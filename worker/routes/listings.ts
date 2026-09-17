import { Hono } from 'hono';
import { Env, AuthContext } from '../lib/middleware';
import { authMiddleware } from '../lib/middleware';
import { generateId, nowISO } from '../lib/auth';
import { queryAll, queryOne, execute, parseJSON, stringifyJSON } from '../lib/db';

type Variables = { user: AuthContext };
const listings = new Hono<{ Bindings: Env; Variables: Variables }>();

listings.get('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const status = c.req.query('status') || '';

    let sql = `
      SELECT l.*, p.name as property_name, u.unit_number,
             agent.first_name as agent_first, agent.last_name as agent_last
      FROM listings l
      LEFT JOIN properties p ON l.property_id = p.id
      LEFT JOIN units u ON l.unit_id = u.id
      LEFT JOIN users agent ON l.agent_id = agent.id
    `;
    const params: any[] = [];
    const conditions: string[] = [];

    if (user.role === 'realtor') {
      conditions.push('l.agent_id = ?');
      params.push(user.userId);
    }

    if (status && status !== 'all') {
      conditions.push('l.status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY l.created_at DESC LIMIT 100';

    const rows = await queryAll<any>(c.env.DB, sql, params);
    return c.json({ success: true, data: rows.map(mapRow) });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch listings', details: error.message }, 500);
  }
});

listings.post('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const { propertyId, unitId, title, description, rent, images, featured } = body;

    if (!propertyId || !unitId || !title || !rent) {
      return c.json({ error: 'propertyId, unitId, title, rent required' }, 400);
    }

    const id = generateId();
    const now = nowISO();

    await execute(c.env.DB, `
      INSERT INTO listings (id, property_id, unit_id, agent_id, title, description, rent, images, featured, status, views, leads_count, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', 0, 0, ?, ?)
    `, [id, propertyId, unitId, user.userId, title, description || '', rent, stringifyJSON(images || []), featured ? 1 : 0, now, now]);

    const created = await queryOne(c.env.DB, 'SELECT * FROM listings WHERE id = ?', [id]);
    return c.json({ success: true, data: mapRow(created as any) }, 201);
  } catch (error: any) {
    return c.json({ error: 'Failed to create listing', details: error.message }, 500);
  }
});

listings.put('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();

    const existing = await queryOne(c.env.DB, 'SELECT id FROM listings WHERE id = ?', [id]);
    if (!existing) return c.json({ error: 'Listing not found' }, 404);

    const fields: string[] = [];
    const params: any[] = [];

    const mapping: Record<string, string> = {
      title: 'title',
      description: 'description',
      rent: 'rent',
      status: 'status',
      virtualTourUrl: 'virtual_tour_url',
      videoUrl: 'video_url',
    };

    for (const [key, dbField] of Object.entries(mapping)) {
      if (body[key] !== undefined) {
        fields.push(`${dbField} = ?`);
        params.push(body[key]);
      }
    }

    if (body.images) {
      fields.push('images = ?');
      params.push(stringifyJSON(body.images));
    }
    if (body.featured !== undefined) {
      fields.push('featured = ?');
      params.push(body.featured ? 1 : 0);
    }

    if (fields.length === 0) return c.json({ error: 'No fields to update' }, 400);

    fields.push('updated_at = ?');
    params.push(nowISO());
    params.push(id);

    await execute(c.env.DB, `UPDATE listings SET ${fields.join(', ')} WHERE id = ?`, params);

    const updated = await queryOne(c.env.DB, 'SELECT * FROM listings WHERE id = ?', [id]);
    return c.json({ success: true, data: mapRow(updated as any) });
  } catch (error: any) {
    return c.json({ error: 'Failed to update listing', details: error.message }, 500);
  }
});

function mapRow(row: any) {
  return {
    id: row.id,
    propertyId: row.property_id,
    unitId: row.unit_id,
    agentId: row.agent_id,
    title: row.title,
    description: row.description,
    rent: row.rent,
    images: parseJSON(row.images, []),
    virtualTourUrl: row.virtual_tour_url,
    videoUrl: row.video_url,
    featured: !!row.featured,
    status: row.status,
    verifiedBy: row.verified_by,
    views: row.views,
    leads: row.leads_count,
    leadsCount: row.leads_count,
    amenities: parseJSON(row.amenities, []),
    propertyName: row.property_name,
    unitNumber: row.unit_number,
    agentFirstName: row.agent_first,
    agentLastName: row.agent_last,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export default listings;
