import { Hono } from 'hono';
import { Env, AuthContext } from '../lib/middleware';
import { authMiddleware } from '../lib/middleware';
import { generateId, nowISO } from '../lib/auth';
import { queryAll, queryOne, execute, parseJSON, stringifyJSON } from '../lib/db';

type Variables = { user: AuthContext };
const maintenance = new Hono<{ Bindings: Env; Variables: Variables }>();

maintenance.get('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const status = c.req.query('status') || '';
    const priority = c.req.query('priority') || '';
    const propertyId = c.req.query('propertyId') || '';
    const search = c.req.query('search') || '';

    let sql = `
      SELECT mr.*, t.first_name as tenant_first, t.last_name as tenant_last,
             u.unit_number, p.name as property_name, p.address as property_address,
             reporter.first_name as reporter_first, reporter.last_name as reporter_last,
             assignee.first_name as assignee_first, assignee.last_name as assignee_last
      FROM maintenance_requests mr
      LEFT JOIN tenants t ON mr.tenant_id = t.id
      LEFT JOIN units u ON mr.unit_id = u.id
      LEFT JOIN properties p ON mr.property_id = p.id
      LEFT JOIN users reporter ON mr.reported_by = reporter.id
      LEFT JOIN users assignee ON mr.assigned_to = assignee.id
    `;
    const params: any[] = [];
    const conditions: string[] = [];

    if (user.role === 'owner') {
      conditions.push('p.owner_id = ?');
      params.push(user.userId);
    } else if (user.role === 'manager') {
      conditions.push('(p.manager_id = ? OR p.owner_id = ?)');
      params.push(user.userId, user.userId);
    } else if (user.role === 'tenant') {
      conditions.push('(mr.tenant_id IN (SELECT id FROM tenants WHERE user_id = ? OR email = ?) OR mr.reported_by = ?)');
      params.push(user.userId, user.email, user.userId);
    } else if (user.role === 'contractor') {
      conditions.push('(mr.assigned_to = ? OR mr.assigned_to IS NULL)');
      params.push(user.userId);
    }

    if (status && status !== 'all') {
      conditions.push('mr.status = ?');
      params.push(status);
    }
    if (priority && priority !== 'all') {
      conditions.push('mr.priority = ?');
      params.push(priority);
    }
    if (propertyId) {
      conditions.push('mr.property_id = ?');
      params.push(propertyId);
    }
    if (search) {
      conditions.push('(mr.title LIKE ? OR mr.description LIKE ? OR p.name LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY CASE mr.priority WHEN "emergency" THEN 0 WHEN "high" THEN 1 WHEN "medium" THEN 2 ELSE 3 END, mr.created_at DESC LIMIT 100';

    const rows = await queryAll<any>(c.env.DB, sql, params);
    return c.json({ success: true, data: rows.map(mapRow) });
  } catch (error: any) {
    console.error('Get maintenance error:', error);
    return c.json({ error: 'Failed to fetch maintenance requests', details: error.message }, 500);
  }
});

maintenance.get('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const row = await queryOne<any>(c.env.DB, `
      SELECT mr.*, t.first_name as tenant_first, t.last_name as tenant_last, t.email as tenant_email,
             u.unit_number, p.name as property_name, p.address as property_address,
             reporter.first_name as reporter_first, reporter.last_name as reporter_last,
             assignee.first_name as assignee_first, assignee.last_name as assignee_last
      FROM maintenance_requests mr
      LEFT JOIN tenants t ON mr.tenant_id = t.id
      LEFT JOIN units u ON mr.unit_id = u.id
      LEFT JOIN properties p ON mr.property_id = p.id
      LEFT JOIN users reporter ON mr.reported_by = reporter.id
      LEFT JOIN users assignee ON mr.assigned_to = assignee.id
      WHERE mr.id = ?
    `, [id]);

    if (!row) return c.json({ error: 'Maintenance request not found' }, 404);
    return c.json({ success: true, data: mapRow(row) });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch maintenance request', details: error.message }, 500);
  }
});

maintenance.post('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const { propertyId, unitId, tenantId, title, description, priority, category, images, estimatedCost } = body;

    if (!propertyId || !unitId || !title || !description) {
      return c.json({ error: 'propertyId, unitId, title, description required' }, 400);
    }

    const id = generateId();
    const now = nowISO();

    await execute(c.env.DB, `
      INSERT INTO maintenance_requests (id, property_id, unit_id, tenant_id, reported_by, title, description, priority, category, status, images, estimated_cost, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)
    `, [
      id,
      propertyId,
      unitId,
      tenantId || null,
      user.userId,
      title,
      description,
      priority || 'medium',
      category || 'general',
      stringifyJSON(images || []),
      estimatedCost || null,
      now,
      now
    ]);

    const created = await queryOne(c.env.DB, 'SELECT * FROM maintenance_requests WHERE id = ?', [id]);
    return c.json({ success: true, data: mapRow(created as any) }, 201);
  } catch (error: any) {
    console.error('Create maintenance error:', error);
    return c.json({ error: 'Failed to create maintenance request', details: error.message }, 500);
  }
});

maintenance.put('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();

    const existing = await queryOne(c.env.DB, 'SELECT id FROM maintenance_requests WHERE id = ?', [id]);
    if (!existing) return c.json({ error: 'Maintenance request not found' }, 404);

    const fields: string[] = [];
    const params: any[] = [];

    const mapping: Record<string, string> = {
      title: 'title',
      description: 'description',
      priority: 'priority',
      category: 'category',
      status: 'status',
      assignedTo: 'assigned_to',
      estimatedCost: 'estimated_cost',
      actualCost: 'actual_cost',
      scheduledDate: 'scheduled_date',
      completedDate: 'completed_date',
      rating: 'rating',
      feedback: 'feedback',
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

    if (fields.length === 0) return c.json({ error: 'No fields to update' }, 400);

    fields.push('updated_at = ?');
    params.push(nowISO());
    params.push(id);

    await execute(c.env.DB, `UPDATE maintenance_requests SET ${fields.join(', ')} WHERE id = ?`, params);

    const updated = await queryOne(c.env.DB, 'SELECT * FROM maintenance_requests WHERE id = ?', [id]);
    return c.json({ success: true, data: mapRow(updated as any) });
  } catch (error: any) {
    return c.json({ error: 'Failed to update maintenance request', details: error.message }, 500);
  }
});

maintenance.post('/:id/assign', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { contractorId } = body;

    if (!contractorId) return c.json({ error: 'contractorId required' }, 400);

    await execute(c.env.DB, 'UPDATE maintenance_requests SET assigned_to = ?, status = ?, updated_at = ? WHERE id = ?', [contractorId, 'assigned', nowISO(), id]);

    const updated = await queryOne(c.env.DB, 'SELECT * FROM maintenance_requests WHERE id = ?', [id]);
    return c.json({ success: true, data: mapRow(updated as any) });
  } catch (error: any) {
    return c.json({ error: 'Failed to assign maintenance request', details: error.message }, 500);
  }
});

maintenance.delete('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    await execute(c.env.DB, 'DELETE FROM maintenance_requests WHERE id = ?', [id]);
    return c.json({ success: true, message: 'Maintenance request deleted' });
  } catch (error: any) {
    return c.json({ error: 'Failed to delete', details: error.message }, 500);
  }
});

function mapRow(row: any) {
  return {
    id: row.id,
    propertyId: row.property_id,
    unitId: row.unit_id,
    tenantId: row.tenant_id,
    reportedBy: row.reported_by,
    assignedTo: row.assigned_to,
    title: row.title,
    description: row.description,
    priority: row.priority,
    category: row.category,
    status: row.status,
    images: parseJSON(row.images, []),
    estimatedCost: row.estimated_cost,
    actualCost: row.actual_cost,
    scheduledDate: row.scheduled_date,
    completedDate: row.completed_date,
    rating: row.rating,
    feedback: row.feedback,
    tenantFirstName: row.tenant_first,
    tenantLastName: row.tenant_last,
    tenantEmail: row.tenant_email,
    unitNumber: row.unit_number,
    propertyName: row.property_name,
    propertyAddress: row.property_address,
    reporterFirstName: row.reporter_first,
    reporterLastName: row.reporter_last,
    assigneeFirstName: row.assignee_first,
    assigneeLastName: row.assignee_last,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export default maintenance;
