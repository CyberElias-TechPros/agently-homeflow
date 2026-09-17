import { Hono } from 'hono';
import { Env, AuthContext } from '../lib/middleware';
import { authMiddleware } from '../lib/middleware';
import { generateId, nowISO } from '../lib/auth';
import { queryAll, queryOne, execute, parseJSON } from '../lib/db';

type Variables = { user: AuthContext };
const tenants = new Hono<{ Bindings: Env; Variables: Variables }>();

tenants.get('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const search = c.req.query('search') || '';
    const status = c.req.query('status') || '';
    const paymentStatus = c.req.query('paymentStatus') || '';

    let sql = `
      SELECT t.*, u.unit_number, p.name as property_name, p.address as property_address
      FROM tenants t
      LEFT JOIN units u ON t.unit_id = u.id
      LEFT JOIN properties p ON t.property_id = p.id
    `;
    const params: any[] = [];
    const conditions: string[] = [];

    // Role filtering
    if (user.role === 'owner') {
      sql = `
        SELECT t.*, u.unit_number, p.name as property_name, p.address as property_address
        FROM tenants t
        LEFT JOIN units u ON t.unit_id = u.id
        LEFT JOIN properties p ON t.property_id = p.id
        WHERE p.owner_id = ?
      `;
      params.push(user.userId);
      if (search) {
        conditions.push('(t.first_name LIKE ? OR t.last_name LIKE ? OR t.email LIKE ?)');
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
    } else if (user.role === 'manager') {
      sql = `
        SELECT t.*, u.unit_number, p.name as property_name, p.address as property_address
        FROM tenants t
        LEFT JOIN units u ON t.unit_id = u.id
        LEFT JOIN properties p ON t.property_id = p.id
        WHERE (p.manager_id = ? OR p.owner_id = ?)
      `;
      params.push(user.userId, user.userId);
      if (search) {
        conditions.push('(t.first_name LIKE ? OR t.last_name LIKE ? OR t.email LIKE ?)');
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
    } else if (user.role === 'tenant') {
      sql = `
        SELECT t.*, u.unit_number, p.name as property_name, p.address as property_address
        FROM tenants t
        LEFT JOIN units u ON t.unit_id = u.id
        LEFT JOIN properties p ON t.property_id = p.id
        WHERE t.user_id = ? OR t.email = ?
      `;
      params.push(user.userId, user.email);
    } else {
      // admin, accountant etc see all
      if (search) {
        conditions.push('(t.first_name LIKE ? OR t.last_name LIKE ? OR t.email LIKE ?)');
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
    }

    if (status && status !== 'all') {
      conditions.push('t.status = ?');
      params.push(status);
    }
    if (paymentStatus && paymentStatus !== 'all') {
      conditions.push('t.payment_status = ?');
      params.push(paymentStatus);
    }

    if (conditions.length > 0) {
      const hasWhere = sql.includes('WHERE');
      sql += (hasWhere ? ' AND ' : ' WHERE ') + conditions.join(' AND ');
    }

    sql += ' ORDER BY t.created_at DESC LIMIT 100';

    const rows = await queryAll<any>(c.env.DB, sql, params);
    const data = rows.map(mapRow);

    return c.json({ success: true, data });
  } catch (error: any) {
    console.error('Get tenants error:', error);
    return c.json({ error: 'Failed to fetch tenants', details: error.message }, 500);
  }
});

tenants.get('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const row = await queryOne<any>(c.env.DB, `
      SELECT t.*, u.unit_number, u.rent as unit_rent, p.name as property_name, p.address as property_address, p.city, p.state
      FROM tenants t
      LEFT JOIN units u ON t.unit_id = u.id
      LEFT JOIN properties p ON t.property_id = p.id
      WHERE t.id = ?
    `, [id]);

    if (!row) return c.json({ error: 'Tenant not found' }, 404);

    // Get payments
    const payments = await queryAll(c.env.DB, 'SELECT * FROM payments WHERE tenant_id = ? ORDER BY payment_date DESC LIMIT 20', [id]);
    // Get maintenance
    const maintenance = await queryAll(c.env.DB, 'SELECT * FROM maintenance_requests WHERE tenant_id = ? ORDER BY created_at DESC LIMIT 20', [id]);

    return c.json({
      success: true,
      data: {
        ...mapRow(row),
        payments,
        maintenanceRequests: maintenance,
      }
    });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch tenant', details: error.message }, 500);
  }
});

tenants.post('/', authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const { unitId, propertyId, firstName, lastName, email, phone, leaseStart, leaseEnd, rentAmount, rentFrequency, securityDeposit } = body;

    if (!unitId || !propertyId || !firstName || !lastName || !email) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Check if unit exists and is vacant
    const unit = await queryOne<any>(c.env.DB, 'SELECT id, status FROM units WHERE id = ?', [unitId]);
    if (!unit) return c.json({ error: 'Unit not found' }, 404);
    // Allow assigning even if not vacant for demo, but warn

    const id = generateId();
    const now = nowISO();

    await execute(c.env.DB, `
      INSERT INTO tenants (id, unit_id, property_id, first_name, last_name, email, phone, lease_start, lease_end, rent_amount, rent_frequency, security_deposit, payment_status, balance, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unpaid', 0, 'active', ?, ?)
    `, [id, unitId, propertyId, firstName, lastName, email, phone || '', leaseStart || now, leaseEnd || new Date(Date.now() + 365*24*60*60*1000).toISOString(), rentAmount || 0, rentFrequency || 'monthly', securityDeposit || 0, now, now]);

    // Update unit status to occupied
    await execute(c.env.DB, 'UPDATE units SET status = ?, tenant_id = ?, updated_at = ? WHERE id = ?', ['occupied', id, now, unitId]);

    const created = await queryOne(c.env.DB, 'SELECT * FROM tenants WHERE id = ?', [id]);
    return c.json({ success: true, data: mapRow(created as any) }, 201);
  } catch (error: any) {
    console.error('Create tenant error:', error);
    return c.json({ error: 'Failed to create tenant', details: error.message }, 500);
  }
});

tenants.put('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();

    const existing = await queryOne(c.env.DB, 'SELECT id FROM tenants WHERE id = ?', [id]);
    if (!existing) return c.json({ error: 'Tenant not found' }, 404);

    const fields: string[] = [];
    const params: any[] = [];

    const mapping: Record<string, string> = {
      firstName: 'first_name',
      lastName: 'last_name',
      email: 'email',
      phone: 'phone',
      leaseStart: 'lease_start',
      leaseEnd: 'lease_end',
      rentAmount: 'rent_amount',
      rentFrequency: 'rent_frequency',
      paymentStatus: 'payment_status',
      balance: 'balance',
      status: 'status',
      securityDeposit: 'security_deposit',
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

    await execute(c.env.DB, `UPDATE tenants SET ${fields.join(', ')} WHERE id = ?`, params);

    const updated = await queryOne(c.env.DB, 'SELECT * FROM tenants WHERE id = ?', [id]);
    return c.json({ success: true, data: mapRow(updated as any) });
  } catch (error: any) {
    return c.json({ error: 'Failed to update tenant', details: error.message }, 500);
  }
});

tenants.delete('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const tenant = await queryOne<any>(c.env.DB, 'SELECT unit_id FROM tenants WHERE id = ?', [id]);
    if (!tenant) return c.json({ error: 'Tenant not found' }, 404);

    await execute(c.env.DB, 'DELETE FROM tenants WHERE id = ?', [id]);
    if (tenant.unit_id) {
      await execute(c.env.DB, 'UPDATE units SET status = ?, tenant_id = NULL, updated_at = ? WHERE id = ?', ['vacant', nowISO(), tenant.unit_id]);
    }

    return c.json({ success: true, message: 'Tenant deleted' });
  } catch (error: any) {
    return c.json({ error: 'Failed to delete tenant', details: error.message }, 500);
  }
});

function mapRow(row: any) {
  return {
    id: row.id,
    userId: row.user_id,
    unitId: row.unit_id,
    propertyId: row.property_id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    leaseStart: row.lease_start,
    leaseEnd: row.lease_end,
    rentAmount: row.rent_amount,
    rentFrequency: row.rent_frequency,
    paymentDay: row.payment_day,
    securityDeposit: row.security_deposit,
    paymentStatus: row.payment_status,
    balance: row.balance,
    status: row.status,
    unitNumber: row.unit_number,
    unitRent: row.unit_rent,
    propertyName: row.property_name,
    propertyAddress: row.property_address,
    city: row.city,
    state: row.state,
    emergencyContact: parseJSON(row.emergency_contact, null),
    employmentInfo: parseJSON(row.employment_info, null),
    documents: parseJSON(row.documents, []),
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export default tenants;
