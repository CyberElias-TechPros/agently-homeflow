import { Hono } from 'hono';
import { Env, AuthContext } from '../lib/middleware';
import { authMiddleware } from '../lib/middleware';
import { generateId, nowISO } from '../lib/auth';
import { queryAll, queryOne, execute } from '../lib/db';

type Variables = { user: AuthContext };
const expenses = new Hono<{ Bindings: Env; Variables: Variables }>();

expenses.get('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const category = c.req.query('category') || '';
    const propertyId = c.req.query('propertyId') || '';
    const search = c.req.query('search') || '';

    let sql = `
      SELECT e.*, p.name as property_name, p.address as property_address,
             u.unit_number, approver.first_name as approver_first, approver.last_name as approver_last
      FROM expenses e
      LEFT JOIN properties p ON e.property_id = p.id
      LEFT JOIN units u ON e.unit_id = u.id
      LEFT JOIN users approver ON e.approved_by = approver.id
    `;
    const params: any[] = [];
    const conditions: string[] = [];

    if (user.role === 'owner') {
      conditions.push('p.owner_id = ?');
      params.push(user.userId);
    } else if (user.role === 'manager') {
      conditions.push('(p.manager_id = ? OR p.owner_id = ?)');
      params.push(user.userId, user.userId);
    }

    if (category && category !== 'all') {
      conditions.push('e.category = ?');
      params.push(category);
    }
    if (propertyId) {
      conditions.push('e.property_id = ?');
      params.push(propertyId);
    }
    if (search) {
      conditions.push('(e.description LIKE ? OR e.vendor LIKE ? OR p.name LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY e.date DESC LIMIT 100';

    const rows = await queryAll<any>(c.env.DB, sql, params);
    const total = rows.reduce((sum, r) => sum + r.amount, 0);

    return c.json({
      success: true,
      data: rows.map(mapRow),
      summary: {
        total,
        count: rows.length,
        byCategory: groupByCategory(rows),
      }
    });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch expenses', details: error.message }, 500);
  }
});

expenses.post('/', authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const { propertyId, unitId, category, amount, description, date, vendor } = body;

    if (!propertyId || !category || !amount || !description) {
      return c.json({ error: 'propertyId, category, amount, description required' }, 400);
    }

    const id = generateId();
    const now = nowISO();

    await execute(c.env.DB, `
      INSERT INTO expenses (id, property_id, unit_id, category, amount, date, description, vendor, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'approved', ?, ?)
    `, [id, propertyId, unitId || null, category, amount, date || now, description, vendor || null, now, now]);

    const created = await queryOne(c.env.DB, 'SELECT * FROM expenses WHERE id = ?', [id]);
    return c.json({ success: true, data: mapRow(created as any) }, 201);
  } catch (error: any) {
    return c.json({ error: 'Failed to create expense', details: error.message }, 500);
  }
});

expenses.put('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();

    const existing = await queryOne(c.env.DB, 'SELECT id FROM expenses WHERE id = ?', [id]);
    if (!existing) return c.json({ error: 'Expense not found' }, 404);

    const fields: string[] = [];
    const params: any[] = [];

    const mapping: Record<string, string> = {
      category: 'category',
      amount: 'amount',
      description: 'description',
      date: 'date',
      vendor: 'vendor',
      status: 'status',
      propertyId: 'property_id',
      unitId: 'unit_id',
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

    await execute(c.env.DB, `UPDATE expenses SET ${fields.join(', ')} WHERE id = ?`, params);

    const updated = await queryOne(c.env.DB, 'SELECT * FROM expenses WHERE id = ?', [id]);
    return c.json({ success: true, data: mapRow(updated as any) });
  } catch (error: any) {
    return c.json({ error: 'Failed to update expense', details: error.message }, 500);
  }
});

expenses.delete('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    await execute(c.env.DB, 'DELETE FROM expenses WHERE id = ?', [id]);
    return c.json({ success: true, message: 'Expense deleted' });
  } catch (error: any) {
    return c.json({ error: 'Failed to delete expense', details: error.message }, 500);
  }
});

function mapRow(row: any) {
  return {
    id: row.id,
    propertyId: row.property_id,
    unitId: row.unit_id,
    category: row.category,
    subcategory: row.subcategory,
    amount: row.amount,
    currency: row.currency,
    date: row.date,
    description: row.description,
    vendor: row.vendor,
    receiptUrl: row.receipt_url,
    approvedBy: row.approved_by,
    status: row.status,
    recurring: !!row.recurring,
    propertyName: row.property_name,
    propertyAddress: row.property_address,
    unitNumber: row.unit_number,
    approverFirstName: row.approver_first,
    approverLastName: row.approver_last,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function groupByCategory(rows: any[]) {
  const groups: Record<string, number> = {};
  for (const r of rows) {
    groups[r.category] = (groups[r.category] || 0) + r.amount;
  }
  return groups;
}

export default expenses;
