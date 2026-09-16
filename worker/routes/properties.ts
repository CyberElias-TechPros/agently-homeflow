import { Hono } from 'hono';
import { Env, AuthContext } from '../lib/middleware';
import { authMiddleware, roleMiddleware } from '../lib/middleware';
import { generateId, nowISO } from '../lib/auth';
import { queryAll, queryOne, execute, parseJSON, stringifyJSON } from '../lib/db';

type Variables = { user: AuthContext };
const properties = new Hono<{ Bindings: Env; Variables: Variables }>();

// Get all properties (filtered by role)
properties.get('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const search = c.req.query('search') || '';
    const type = c.req.query('type') || '';
    const status = c.req.query('status') || '';
    
    let sql = `
      SELECT p.*, u.first_name as owner_first, u.last_name as owner_last,
             m.first_name as manager_first, m.last_name as manager_last
      FROM properties p
      LEFT JOIN users u ON p.owner_id = u.id
      LEFT JOIN users m ON p.manager_id = m.id
    `;
    const params: any[] = [];
    const conditions: string[] = [];

    // Role-based filtering
    if (user.role === 'owner') {
      conditions.push('p.owner_id = ?');
      params.push(user.userId);
    } else if (user.role === 'manager') {
      conditions.push('(p.manager_id = ? OR p.owner_id = ?)');
      params.push(user.userId, user.userId);
    } else if (user.role === 'tenant') {
      // Tenants see properties they are in
      sql = `
        SELECT p.*, u.first_name as owner_first, u.last_name as owner_last,
               m.first_name as manager_first, m.last_name as manager_last
        FROM properties p
        LEFT JOIN users u ON p.owner_id = u.id
        LEFT JOIN users m ON p.manager_id = m.id
        INNER JOIN tenants t ON t.property_id = p.id
        WHERE t.user_id = ? OR t.email = ?
      `;
      const userEmail = user.email;
      // We'll need to handle this differently - for now get all and filter
      // Actually we need user record to get tenant link
      // For tenant role, show all properties (simplified) or need tenant lookup
      // Let's query tenants table for this user
      const tenantRecord = await queryOne<any>(c.env.DB, 'SELECT property_id FROM tenants WHERE user_id = ? OR email = ? LIMIT 1', [user.userId, user.email]);
      if (tenantRecord) {
        // Reset
        sql = `
          SELECT p.*, u.first_name as owner_first, u.last_name as owner_last,
                 m.first_name as manager_first, m.last_name as manager_last
          FROM properties p
          LEFT JOIN users u ON p.owner_id = u.id
          LEFT JOIN users m ON p.manager_id = m.id
          WHERE p.id = ?
        `;
        return c.json({
          success: true,
          data: await queryAll(c.env.DB, sql, [tenantRecord.property_id]).then(rows => rows.map(mapPropertyRow))
        });
      }
      // Fallback: tenant sees no properties if not linked
      return c.json({ success: true, data: [] });
    }

    if (search) {
      conditions.push('(p.name LIKE ? OR p.address LIKE ? OR p.city LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (type && type !== 'all') {
      conditions.push('p.type = ?');
      params.push(type);
    }
    if (status && status !== 'all') {
      conditions.push('p.status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      sql += (sql.includes('WHERE') ? ' AND ' : ' WHERE ') + conditions.join(' AND ');
    }

    sql += ' ORDER BY p.created_at DESC';

    const rows = await queryAll<any>(c.env.DB, sql, params);
    const data = rows.map(mapPropertyRow);

    // Enrich with units count
    for (const prop of data) {
      const units = await queryAll<any>(c.env.DB, 'SELECT id, status, rent FROM units WHERE property_id = ?', [prop.id]);
      (prop as any).unitsData = units;
      (prop as any).totalUnitsActual = units.length;
      (prop as any).occupiedUnits = units.filter(u => u.status === 'occupied').length;
      (prop as any).vacantUnits = units.filter(u => u.status === 'vacant').length;
      (prop as any).maintenanceUnits = units.filter(u => u.status === 'maintenance').length;
    }

    return c.json({ success: true, data });
  } catch (error: any) {
    console.error('Get properties error:', error);
    return c.json({ error: 'Failed to fetch properties', details: error.message }, 500);
  }
});

// Get single property
properties.get('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const row = await queryOne<any>(c.env.DB, `
      SELECT p.*, u.first_name as owner_first, u.last_name as owner_last,
             m.first_name as manager_first, m.last_name as manager_last
      FROM properties p
      LEFT JOIN users u ON p.owner_id = u.id
      LEFT JOIN users m ON p.manager_id = m.id
      WHERE p.id = ?
    `, [id]);

    if (!row) return c.json({ error: 'Property not found' }, 404);

    const prop = mapPropertyRow(row);
    const units = await queryAll<any>(c.env.DB, 'SELECT * FROM units WHERE property_id = ? ORDER BY unit_number', [id]);
    const tenants = await queryAll<any>(c.env.DB, 'SELECT * FROM tenants WHERE property_id = ? AND status = ?', [id, 'active']);
    const expenses = await queryAll<any>(c.env.DB, 'SELECT * FROM expenses WHERE property_id = ? ORDER BY date DESC LIMIT 20', [id]);
    const maintenance = await queryAll<any>(c.env.DB, 'SELECT * FROM maintenance_requests WHERE property_id = ? ORDER BY created_at DESC LIMIT 20', [id]);

    return c.json({
      success: true,
      data: {
        ...prop,
        units: units.map(mapUnitRow),
        tenants: tenants.map(mapTenantRow),
        recentExpenses: expenses,
        recentMaintenance: maintenance,
        stats: {
          totalUnits: units.length,
          occupied: units.filter(u => u.status === 'occupied').length,
          vacant: units.filter(u => u.status === 'vacant').length,
          maintenance: units.filter(u => u.status === 'maintenance').length,
          occupancyRate: units.length > 0 ? Math.round((units.filter(u => u.status === 'occupied').length / units.length) * 100) : 0,
        }
      }
    });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch property', details: error.message }, 500);
  }
});

// Create property
properties.post('/', authMiddleware, roleMiddleware(['owner', 'manager', 'admin']), async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const { name, address, type, description, city, state, totalUnits, yearBuilt, marketValue, amenities, images } = body;

    if (!name || !address || !type) {
      return c.json({ error: 'Name, address, and type are required' }, 400);
    }

    const id = generateId();
    const now = nowISO();

    await execute(c.env.DB, `
      INSERT INTO properties (id, owner_id, manager_id, name, description, type, address, city, state, total_units, year_built, market_value, amenities, images, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
    `, [
      id,
      body.ownerId || user.userId,
      body.managerId || null,
      name,
      description || '',
      type,
      address,
      city || 'Lagos',
      state || 'Lagos',
      totalUnits || 1,
      yearBuilt || null,
      marketValue || null,
      stringifyJSON(amenities || []),
      stringifyJSON(images || []),
      now,
      now
    ]);

    // Auto-create units if specified
    const unitsToCreate = parseInt(totalUnits) || 1;
    for (let i = 1; i <= unitsToCreate; i++) {
      const unitId = generateId();
      await execute(c.env.DB, `
        INSERT INTO units (id, property_id, unit_number, rent, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, 'vacant', ?, ?)
      `, [unitId, id, `Unit ${i}`, body.rent || 100000, now, now]);
    }

    const created = await queryOne(c.env.DB, 'SELECT * FROM properties WHERE id = ?', [id]);
    return c.json({ success: true, data: mapPropertyRow(created as any) }, 201);
  } catch (error: any) {
    console.error('Create property error:', error);
    return c.json({ error: 'Failed to create property', details: error.message }, 500);
  }
});

// Update property
properties.put('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const user = c.get('user');
    const body = await c.req.json();

    // Check ownership
    const existing = await queryOne<any>(c.env.DB, 'SELECT owner_id, manager_id FROM properties WHERE id = ?', [id]);
    if (!existing) return c.json({ error: 'Property not found' }, 404);
    
    if (user.role !== 'admin' && existing.owner_id !== user.userId && existing.manager_id !== user.userId) {
      return c.json({ error: 'Forbidden - Not owner or manager' }, 403);
    }

    const fields: string[] = [];
    const params: any[] = [];

    const updatable = ['name', 'description', 'type', 'address', 'city', 'state', 'total_units', 'year_built', 'market_value', 'status', 'manager_id'];
    for (const field of updatable) {
      const camel = field.replace(/_([a-z])/g, (_, l) => l.toUpperCase());
      if (body[field] !== undefined || body[camel] !== undefined) {
        fields.push(`${field} = ?`);
        let val = body[field] ?? body[camel];
        if (field === 'amenities' || field === 'images') val = stringifyJSON(val);
        params.push(val);
      }
    }

    // Handle amenities/images separately
    if (body.amenities) {
      fields.push('amenities = ?');
      params.push(stringifyJSON(body.amenities));
    }
    if (body.images) {
      fields.push('images = ?');
      params.push(stringifyJSON(body.images));
    }

    if (fields.length === 0) {
      return c.json({ error: 'No fields to update' }, 400);
    }

    fields.push('updated_at = ?');
    params.push(nowISO());
    params.push(id);

    await execute(c.env.DB, `UPDATE properties SET ${fields.join(', ')} WHERE id = ?`, params);

    const updated = await queryOne(c.env.DB, 'SELECT * FROM properties WHERE id = ?', [id]);
    return c.json({ success: true, data: mapPropertyRow(updated as any) });
  } catch (error: any) {
    return c.json({ error: 'Failed to update property', details: error.message }, 500);
  }
});

// Delete property
properties.delete('/:id', authMiddleware, roleMiddleware(['owner', 'admin']), async (c) => {
  try {
    const id = c.req.param('id');
    const user = c.get('user');

    const existing = await queryOne<any>(c.env.DB, 'SELECT owner_id FROM properties WHERE id = ?', [id]);
    if (!existing) return c.json({ error: 'Property not found' }, 404);
    if (user.role !== 'admin' && existing.owner_id !== user.userId) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    await execute(c.env.DB, 'DELETE FROM properties WHERE id = ?', [id]);
    return c.json({ success: true, message: 'Property deleted' });
  } catch (error: any) {
    return c.json({ error: 'Failed to delete property', details: error.message }, 500);
  }
});

// Get units for property
properties.get('/:id/units', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const units = await queryAll<any>(c.env.DB, 'SELECT * FROM units WHERE property_id = ? ORDER BY unit_number', [id]);
    return c.json({ success: true, data: units.map(mapUnitRow) });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch units', details: error.message }, 500);
  }
});

// Create unit for property
properties.post('/:id/units', authMiddleware, async (c) => {
  try {
    const propertyId = c.req.param('id');
    const body = await c.req.json();
    const { unitNumber, rent, bedrooms, bathrooms, area, status } = body;

    if (!unitNumber || rent === undefined) {
      return c.json({ error: 'unitNumber and rent required' }, 400);
    }

    const id = generateId();
    const now = nowISO();

    await execute(c.env.DB, `
      INSERT INTO units (id, property_id, unit_number, rent, bedrooms, bathrooms, area, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, propertyId, unitNumber, rent, bedrooms || null, bathrooms || null, area || null, status || 'vacant', now, now]);

    const created = await queryOne(c.env.DB, 'SELECT * FROM units WHERE id = ?', [id]);
    return c.json({ success: true, data: mapUnitRow(created as any) }, 201);
  } catch (error: any) {
    return c.json({ error: 'Failed to create unit', details: error.message }, 500);
  }
});

function mapPropertyRow(row: any) {
  return {
    id: row.id,
    ownerId: row.owner_id,
    managerId: row.manager_id,
    name: row.name,
    description: row.description,
    type: row.type,
    address: row.address,
    city: row.city,
    state: row.state,
    country: row.country,
    zipCode: row.zip_code,
    latitude: row.latitude,
    longitude: row.longitude,
    totalUnits: row.total_units,
    totalArea: row.total_area,
    yearBuilt: row.year_built,
    marketValue: row.market_value,
    status: row.status,
    amenities: parseJSON(row.amenities, []),
    images: parseJSON(row.images, []),
    documents: parseJSON(row.documents, []),
    ownerName: row.owner_first ? `${row.owner_first} ${row.owner_last}` : undefined,
    managerName: row.manager_first ? `${row.manager_first} ${row.manager_last}` : undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapUnitRow(row: any) {
  return {
    id: row.id,
    propertyId: row.property_id,
    unitNumber: row.unit_number,
    floor: row.floor,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    area: row.area,
    rent: row.rent,
    securityDeposit: row.security_deposit,
    status: row.status,
    tenantId: row.tenant_id,
    leaseId: row.lease_id,
    amenities: parseJSON(row.amenities, []),
    images: parseJSON(row.images, []),
    virtualTourUrl: row.virtual_tour_url,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapTenantRow(row: any) {
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
    emergencyContact: parseJSON(row.emergency_contact, null),
    employmentInfo: parseJSON(row.employment_info, null),
    documents: parseJSON(row.documents, []),
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export default properties;
