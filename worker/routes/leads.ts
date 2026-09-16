import { Hono } from 'hono';
import { Env, AuthContext } from '../lib/middleware';
import { authMiddleware } from '../lib/middleware';
import { generateId, nowISO } from '../lib/auth';
import { queryAll, queryOne, execute } from '../lib/db';

type Variables = { user: AuthContext };
const leads = new Hono<{ Bindings: Env; Variables: Variables }>();

leads.get('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const status = c.req.query('status') || '';

    let sql = `
      SELECT ld.*, l.title as listing_title, p.name as property_name
      FROM leads ld
      LEFT JOIN listings l ON ld.listing_id = l.id
      LEFT JOIN properties p ON l.property_id = p.id
    `;
    const params: any[] = [];
    const conditions: string[] = [];

    if (user.role === 'realtor') {
      conditions.push('ld.agent_id = ?');
      params.push(user.userId);
    }

    if (status && status !== 'all') {
      conditions.push('ld.status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY ld.created_at DESC LIMIT 100';

    const rows = await queryAll<any>(c.env.DB, sql, params);
    return c.json({ success: true, data: rows.map(mapRow) });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch leads', details: error.message }, 500);
  }
});

leads.post('/', authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const { listingId, name, email, phone, message, source } = body;

    if (!listingId || !name || !email || !phone) {
      return c.json({ error: 'listingId, name, email, phone required' }, 400);
    }

    // Get listing to find agent
    const listing = await queryOne<any>(c.env.DB, 'SELECT agent_id FROM listings WHERE id = ?', [listingId]);
    if (!listing) return c.json({ error: 'Listing not found' }, 404);

    const id = generateId();
    const now = nowISO();

    await execute(c.env.DB, `
      INSERT INTO leads (id, listing_id, agent_id, name, email, phone, message, status, source, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, ?)
    `, [id, listingId, listing.agent_id, name, email, phone, message || '', source || 'website', now, now]);

    // Update leads count
    await execute(c.env.DB, 'UPDATE listings SET leads_count = leads_count + 1, updated_at = ? WHERE id = ?', [now, listingId]);

    const created = await queryOne(c.env.DB, 'SELECT * FROM leads WHERE id = ?', [id]);
    return c.json({ success: true, data: mapRow(created as any) }, 201);
  } catch (error: any) {
    return c.json({ error: 'Failed to create lead', details: error.message }, 500);
  }
});

leads.put('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();

    const existing = await queryOne(c.env.DB, 'SELECT id FROM leads WHERE id = ?', [id]);
    if (!existing) return c.json({ error: 'Lead not found' }, 404);

    const fields: string[] = [];
    const params: any[] = [];

    const mapping: Record<string, string> = {
      status: 'status',
      notes: 'notes',
      scheduledViewing: 'scheduled_viewing',
      name: 'name',
      email: 'email',
      phone: 'phone',
      message: 'message',
    };

    for (const [key, dbField] of Object.entries(mapping)) {
      if (body[key] !== undefined) {
        fields.push(`${dbField} = ?`);
        params.push(body[key]);
      }
    }

    if (fields.length === 0) return c.json({ error: 'No fields to update' }, 400);

    fields.push('updated_at = ?');
    params.push(nowISO());
    params.push(id);

    await execute(c.env.DB, `UPDATE leads SET ${fields.join(', ')} WHERE id = ?`, params);

    const updated = await queryOne(c.env.DB, 'SELECT * FROM leads WHERE id = ?', [id]);
    return c.json({ success: true, data: mapRow(updated as any) });
  } catch (error: any) {
    return c.json({ error: 'Failed to update lead', details: error.message }, 500);
  }
});

function mapRow(row: any) {
  return {
    id: row.id,
    listingId: row.listing_id,
    agentId: row.agent_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    status: row.status,
    scheduledViewing: row.scheduled_viewing,
    notes: row.notes,
    source: row.source,
    score: row.score,
    listingTitle: row.listing_title,
    propertyName: row.property_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export default leads;
