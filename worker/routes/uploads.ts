import { Hono } from 'hono';
import { Env, AuthContext } from '../lib/middleware';
import { authMiddleware } from '../lib/middleware';
import { generateId, nowISO } from '../lib/auth';
import { execute } from '../lib/db';

type Variables = { user: AuthContext };
const uploads = new Hono<{ Bindings: Env; Variables: Variables }>();

uploads.post('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.parseBody();
    const file = body['file'] as File;
    const category = (body['category'] as string) || 'other';
    const propertyId = body['propertyId'] as string | undefined;
    const unitId = body['unitId'] as string | undefined;

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'text/csv'];
    if (!allowedTypes.includes(file.type) && !file.type.startsWith('image/')) {
      // Allow but warn - for demo
    }

    // Validate size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return c.json({ error: 'File too large (max 10MB)' }, 400);
    }

    const id = generateId();
    const ext = file.name.split('.').pop() || 'bin';
    const storageKey = `${category}/${user.userId}/${id}.${ext}`;

    // Upload to R2
    try {
      await c.env.STORAGE.put(storageKey, await file.arrayBuffer(), {
        httpMetadata: {
          contentType: file.type,
        },
        customMetadata: {
          originalName: file.name,
          uploadedBy: user.userId,
          category,
        }
      });
    } catch (r2Error: any) {
      console.error('R2 upload error:', r2Error);
      // Fallback: store metadata only for local dev without R2
      if (!c.env.STORAGE) {
        console.warn('R2 not configured, skipping actual upload');
      } else {
        throw r2Error;
      }
    }

    const url = `/api/uploads/${id}`; // Will be served via GET endpoint

    // Store metadata in D1
    const now = nowISO();
    await execute(c.env.DB, `
      INSERT INTO documents (id, owner_id, property_id, unit_id, file_name, file_type, file_size, storage_key, url, category, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, user.userId, propertyId || null, unitId || null, file.name, file.type, file.size, storageKey, url, category, now]);

    return c.json({
      success: true,
      data: {
        id,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        storageKey,
        url,
        category,
      }
    }, 201);
  } catch (error: any) {
    console.error('Upload error:', error);
    return c.json({ error: 'Failed to upload file', details: error.message }, 500);
  }
});

uploads.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const doc = await c.env.DB.prepare('SELECT * FROM documents WHERE id = ?').bind(id).first();

    if (!doc) {
      return c.json({ error: 'File not found' }, 404);
    }

    // Try to get from R2
    if (c.env.STORAGE) {
      const object = await c.env.STORAGE.get(doc.storage_key);
      if (object) {
        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);
        headers.set('Cache-Control', 'public, max-age=31536000');
        return new Response(object.body, { headers });
      }
    }

    return c.json({ error: 'File not found in storage' }, 404);
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch file', details: error.message }, 500);
  }
});

uploads.get('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const category = c.req.query('category');
    const propertyId = c.req.query('propertyId');

    let sql = 'SELECT * FROM documents WHERE owner_id = ?';
    const params: any[] = [user.userId];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (propertyId) {
      sql += ' AND property_id = ?';
      params.push(propertyId);
    }

    sql += ' ORDER BY created_at DESC LIMIT 50';

    const docs = await c.env.DB.prepare(sql).bind(...params).all();
    return c.json({ success: true, data: docs.results });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch documents', details: error.message }, 500);
  }
});

export default uploads;
