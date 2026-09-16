import { Hono } from 'hono';
import { Env, AuthContext } from '../lib/middleware';
import { authMiddleware } from '../lib/middleware';
import { generateId, generateReceiptNumber, nowISO } from '../lib/auth';
import { queryAll, queryOne, execute } from '../lib/db';

type Variables = { user: AuthContext };
const payments = new Hono<{ Bindings: Env; Variables: Variables }>();

payments.get('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const search = c.req.query('search') || '';
    const status = c.req.query('status') || '';
    const method = c.req.query('method') || '';
    const propertyId = c.req.query('propertyId') || '';
    const tenantId = c.req.query('tenantId') || '';

    let sql = `
      SELECT p.*, t.first_name as tenant_first, t.last_name as tenant_last,
             u.unit_number, prop.name as property_name
      FROM payments p
      LEFT JOIN tenants t ON p.tenant_id = t.id
      LEFT JOIN units u ON p.unit_id = u.id
      LEFT JOIN properties prop ON p.property_id = prop.id
    `;
    const params: any[] = [];
    const conditions: string[] = [];

    // Role filtering
    if (user.role === 'owner') {
      conditions.push('prop.owner_id = ?');
      params.push(user.userId);
    } else if (user.role === 'manager') {
      conditions.push('(prop.manager_id = ? OR prop.owner_id = ?)');
      params.push(user.userId, user.userId);
    } else if (user.role === 'tenant') {
      conditions.push('(p.tenant_id IN (SELECT id FROM tenants WHERE user_id = ? OR email = ?) OR t.email = ?)');
      params.push(user.userId, user.email, user.email);
    }

    if (search) {
      conditions.push('(t.first_name LIKE ? OR t.last_name LIKE ? OR p.receipt_number LIKE ? OR prop.name LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (status && status !== 'all') {
      conditions.push('p.status = ?');
      params.push(status);
    }
    if (method && method !== 'all') {
      conditions.push('p.payment_method = ?');
      params.push(method);
    }
    if (propertyId) {
      conditions.push('p.property_id = ?');
      params.push(propertyId);
    }
    if (tenantId) {
      conditions.push('p.tenant_id = ?');
      params.push(tenantId);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY p.payment_date DESC LIMIT 100';

    const rows = await queryAll<any>(c.env.DB, sql, params);
    const data = rows.map(mapRow);

    // Summary stats
    const totalCompleted = rows.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.amount, 0);
    const totalPending = rows.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0);

    return c.json({
      success: true,
      data,
      summary: {
        totalCompleted,
        totalPending,
        completedCount: rows.filter(r => r.status === 'completed').length,
        pendingCount: rows.filter(r => r.status === 'pending').length,
        failedCount: rows.filter(r => r.status === 'failed').length,
        total: rows.length,
      }
    });
  } catch (error: any) {
    console.error('Get payments error:', error);
    return c.json({ error: 'Failed to fetch payments', details: error.message }, 500);
  }
});

payments.get('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const row = await queryOne<any>(c.env.DB, `
      SELECT p.*, t.first_name as tenant_first, t.last_name as tenant_last, t.email as tenant_email,
             u.unit_number, prop.name as property_name, prop.address as property_address
      FROM payments p
      LEFT JOIN tenants t ON p.tenant_id = t.id
      LEFT JOIN units u ON p.unit_id = u.id
      LEFT JOIN properties prop ON p.property_id = prop.id
      WHERE p.id = ?
    `, [id]);

    if (!row) return c.json({ error: 'Payment not found' }, 404);
    return c.json({ success: true, data: mapRow(row) });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch payment', details: error.message }, 500);
  }
});

payments.post('/', authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const { tenantId, unitId, propertyId, amount, paymentMethod, status, dueDate, paymentDate, leaseId } = body;

    if (!tenantId || !unitId || !propertyId || !amount) {
      return c.json({ error: 'tenantId, unitId, propertyId, amount required' }, 400);
    }

    const id = generateId();
    const now = nowISO();
    const receiptNumber = generateReceiptNumber();

    await execute(c.env.DB, `
      INSERT INTO payments (id, tenant_id, unit_id, property_id, lease_id, amount, currency, payment_date, due_date, payment_method, status, receipt_number, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'NGN', ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      tenantId,
      unitId,
      propertyId,
      leaseId || null,
      amount,
      paymentDate || now,
      dueDate || now,
      paymentMethod || 'bank_transfer',
      status || 'completed',
      receiptNumber,
      now,
      now
    ]);

    // Update tenant balance and payment status if completed
    if ((status || 'completed') === 'completed') {
      const tenant = await queryOne<any>(c.env.DB, 'SELECT balance, rent_amount FROM tenants WHERE id = ?', [tenantId]);
      if (tenant) {
        const newBalance = Math.max(0, (tenant.balance || 0) - amount);
        const paymentStatus = newBalance <= 0 ? 'paid' : newBalance < tenant.rent_amount ? 'owing' : 'unpaid';
        await execute(c.env.DB, 'UPDATE tenants SET balance = ?, payment_status = ?, updated_at = ? WHERE id = ?', [newBalance, paymentStatus, now, tenantId]);
      }
    }

    // Log activity
    await execute(c.env.DB, `
      INSERT INTO activity_logs (id, user_id, action, entity_type, entity_id, property_id, details, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [generateId(), c.get('user').userId, 'create', 'payment', id, propertyId, JSON.stringify({ amount, method: paymentMethod }), now]);

    const created = await queryOne(c.env.DB, 'SELECT * FROM payments WHERE id = ?', [id]);
    return c.json({ success: true, data: mapRow(created as any) }, 201);
  } catch (error: any) {
    console.error('Create payment error:', error);
    return c.json({ error: 'Failed to create payment', details: error.message }, 500);
  }
});

payments.put('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();

    const existing = await queryOne(c.env.DB, 'SELECT id FROM payments WHERE id = ?', [id]);
    if (!existing) return c.json({ error: 'Payment not found' }, 404);

    const fields: string[] = [];
    const params: any[] = [];

    const mapping: Record<string, string> = {
      amount: 'amount',
      paymentMethod: 'payment_method',
      status: 'status',
      paymentDate: 'payment_date',
      dueDate: 'due_date',
      notes: 'notes',
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

    await execute(c.env.DB, `UPDATE payments SET ${fields.join(', ')} WHERE id = ?`, params);

    const updated = await queryOne(c.env.DB, 'SELECT * FROM payments WHERE id = ?', [id]);
    return c.json({ success: true, data: mapRow(updated as any) });
  } catch (error: any) {
    return c.json({ error: 'Failed to update payment', details: error.message }, 500);
  }
});

payments.delete('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    await execute(c.env.DB, 'DELETE FROM payments WHERE id = ?', [id]);
    return c.json({ success: true, message: 'Payment deleted' });
  } catch (error: any) {
    return c.json({ error: 'Failed to delete payment', details: error.message }, 500);
  }
});

// Record payment for tenant (simplified endpoint for frontend)
payments.post('/record', authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const { tenantId, amount, method, date } = body;

    if (!tenantId || !amount) {
      return c.json({ error: 'tenantId and amount required' }, 400);
    }

    const tenant = await queryOne<any>(c.env.DB, 'SELECT unit_id, property_id FROM tenants WHERE id = ?', [tenantId]);
    if (!tenant) return c.json({ error: 'Tenant not found' }, 404);

    const id = generateId();
    const now = nowISO();
    const receiptNumber = generateReceiptNumber();

    await execute(c.env.DB, `
      INSERT INTO payments (id, tenant_id, unit_id, property_id, amount, currency, payment_date, due_date, payment_method, status, receipt_number, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'NGN', ?, ?, ?, 'completed', ?, ?, ?)
    `, [id, tenantId, tenant.unit_id, tenant.property_id, amount, date || now, date || now, method || 'bank_transfer', receiptNumber, now, now]);

    // Update tenant
    const tenantData = await queryOne<any>(c.env.DB, 'SELECT balance, rent_amount FROM tenants WHERE id = ?', [tenantId]);
    if (tenantData) {
      const newBalance = Math.max(0, (tenantData.balance || 0) - amount);
      const paymentStatus = newBalance <= 0 ? 'paid' : newBalance < tenantData.rent_amount ? 'owing' : 'unpaid';
      await execute(c.env.DB, 'UPDATE tenants SET balance = ?, payment_status = ?, updated_at = ? WHERE id = ?', [newBalance, paymentStatus, now, tenantId]);
    }

    return c.json({ success: true, data: { id, receiptNumber, amount } }, 201);
  } catch (error: any) {
    return c.json({ error: 'Failed to record payment', details: error.message }, 500);
  }
});

function mapRow(row: any) {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    unitId: row.unit_id,
    propertyId: row.property_id,
    leaseId: row.lease_id,
    amount: row.amount,
    currency: row.currency,
    paymentDate: row.payment_date,
    date: row.payment_date,
    dueDate: row.due_date,
    paymentMethod: row.payment_method,
    method: row.payment_method,
    status: row.status,
    referenceNumber: row.reference_number,
    receiptNumber: row.receipt_number,
    gatewayTransactionId: row.gateway_transaction_id,
    fees: row.fees,
    notes: row.notes,
    processedBy: row.processed_by,
    tenantFirstName: row.tenant_first,
    tenantLastName: row.tenant_last,
    tenantEmail: row.tenant_email,
    unitNumber: row.unit_number,
    propertyName: row.property_name,
    propertyAddress: row.property_address,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export default payments;
