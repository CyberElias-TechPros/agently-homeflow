import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { Env } from './lib/middleware';

import authRoutes from './routes/auth';
import propertyRoutes from './routes/properties';
import tenantRoutes from './routes/tenants';
import paymentRoutes from './routes/payments';
import maintenanceRoutes from './routes/maintenance';
import expenseRoutes from './routes/expenses';
import analyticsRoutes from './routes/analytics';
import listingRoutes from './routes/listings';
import leadRoutes from './routes/leads';
import applicationRoutes from './routes/applications';
import uploadRoutes from './routes/uploads';

const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: (origin, c) => {
    // Allow all in dev, specific in prod
    const allowed = [
      'http://localhost:8080',
      'http://localhost:5173',
      'http://localhost:3000',
      'https://agently-homeflow.vercel.app',
      c.env.FRONTEND_URL,
    ].filter(Boolean);
    
    // For development, allow all origins
    if (c.env.ENVIRONMENT !== 'production') {
      return origin || '*';
    }
    
    if (!origin) return '*';
    if (allowed.includes(origin)) return origin;
    // Allow preview deployments
    if (origin.includes('vercel.app') || origin.includes('e2b.app') || origin.includes('localhost')) {
      return origin;
    }
    return allowed[0] || '*';
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposeHeaders: ['Content-Length'],
  credentials: true,
  maxAge: 86400,
}));

// Health check
app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'Agently Homeflow API - Production Ready',
    version: '2.0.0',
    environment: c.env.ENVIRONMENT || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      properties: '/api/properties',
      tenants: '/api/tenants',
      payments: '/api/payments',
      maintenance: '/api/maintenance',
      expenses: '/api/expenses',
      analytics: '/api/analytics',
      listings: '/api/listings',
      leads: '/api/leads',
      applications: '/api/applications',
      uploads: '/api/uploads',
      health: '/api/health',
    }
  });
});

app.get('/api', (c) => {
  return c.json({
    success: true,
    message: 'Agently Homeflow API v2.0',
    docs: '/api/docs - coming soon',
    health: '/api/health',
  });
});

app.get('/api/health', async (c) => {
  let dbStatus = 'unknown';
  try {
    if (c.env.DB) {
      await c.env.DB.prepare('SELECT 1').first();
      dbStatus = 'connected';
    } else {
      dbStatus = 'not_configured';
    }
  } catch (e: any) {
    dbStatus = `error: ${e.message}`;
  }

  return c.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus,
      storage: c.env.STORAGE ? 'configured' : 'not_configured',
      cache: c.env.CACHE ? 'configured' : 'not_configured',
    },
    version: '2.0.0',
  });
});

// Mount routes
app.route('/api/auth', authRoutes);
app.route('/api/properties', propertyRoutes);
app.route('/api/tenants', tenantRoutes);
app.route('/api/payments', paymentRoutes);
app.route('/api/maintenance', maintenanceRoutes);
app.route('/api/expenses', expenseRoutes);
app.route('/api/analytics', analyticsRoutes);
app.route('/api/listings', listingRoutes);
app.route('/api/leads', leadRoutes);
app.route('/api/applications', applicationRoutes);
app.route('/api/uploads', uploadRoutes);

// Seed endpoint for development (protected)
app.post('/api/seed', async (c) => {
  try {
    // Only allow in development or with secret
    const secret = c.req.header('X-Seed-Secret');
    if (c.env.ENVIRONMENT === 'production' && secret !== c.env.JWT_SECRET) {
      return c.json({ error: 'Forbidden - Seed not allowed in production without secret' }, 403);
    }

    const { hashPassword, generateId } = await import('./lib/auth');
    const now = new Date().toISOString();

    // Create demo users if not exist
    const demoUsers = [
      { id: 'demo-owner', email: 'owner@agently.com', password: 'owner123', firstName: 'John', lastName: 'Landlord', role: 'owner', phone: '+234-801-234-5678' },
      { id: 'demo-manager', email: 'manager@agently.com', password: 'manager123', firstName: 'Sarah', lastName: 'Manager', role: 'manager', phone: '+234-802-234-5678' },
      { id: 'demo-accountant', email: 'accountant@agently.com', password: 'accountant123', firstName: 'Michael', lastName: 'Finance', role: 'accountant', phone: '+234-803-234-5678' },
      { id: 'demo-tenant', email: 'tenant@agently.com', password: 'tenant123', firstName: 'Alice', lastName: 'Tenant', role: 'tenant', phone: '+234-804-234-5678' },
      { id: 'demo-realtor', email: 'realtor@agently.com', password: 'realtor123', firstName: 'David', lastName: 'Agent', role: 'realtor', phone: '+234-805-234-5678' },
      { id: 'demo-contractor', email: 'contractor@agently.com', password: 'contractor123', firstName: 'James', lastName: 'Handyman', role: 'contractor', phone: '+234-806-234-5678' },
      { id: 'demo-admin', email: 'admin@agently.com', password: 'admin123', firstName: 'Admin', lastName: 'User', role: 'admin', phone: '+234-807-234-5678' },
    ];

    let createdUsers = 0;
    for (const u of demoUsers) {
      const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(u.email).first();
      if (!existing) {
        const hash = await hashPassword(u.password);
        await c.env.DB.prepare(`
          INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, kyc_status, email_verified, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'verified', 1, ?, ?)
        `).bind(u.id, u.email, hash, u.firstName, u.lastName, u.phone, u.role, now, now).run();
        createdUsers++;
      }
    }

    // Create demo properties
    const propertiesCount = await c.env.DB.prepare('SELECT COUNT(*) as count FROM properties').first();
    let createdProperties = 0;
    if (!propertiesCount || (propertiesCount as any).count === 0) {
      const demoProperties = [
        { name: 'Lekki Gardens Estate', address: '15 Admiralty Way, Lekki Phase 1', city: 'Lagos', type: 'apartment', units: 12, rent: 2500000 },
        { name: 'Victoria Island Towers', address: '42 Ahmadu Bello Way, VI', city: 'Lagos', type: 'apartment', units: 8, rent: 5000000 },
        { name: 'Ikoyi Heights', address: '10 Bourdillon Road, Ikoyi', city: 'Lagos', type: 'house', units: 1, rent: 8000000 },
        { name: 'Yaba Business Complex', address: '25 Herbert Macaulay, Yaba', city: 'Lagos', type: 'commercial', units: 6, rent: 1500000 },
      ];

      for (const prop of demoProperties) {
        const propId = generateId();
        await c.env.DB.prepare(`
          INSERT INTO properties (id, owner_id, name, address, city, state, type, total_units, market_value, amenities, images, status, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
        `).bind(
          propId,
          'demo-owner',
          prop.name,
          prop.address,
          prop.city,
          'Lagos',
          prop.type,
          prop.units,
          prop.rent * 12 * 5,
          JSON.stringify(['Security', 'Parking', 'Water', 'Electricity']),
          JSON.stringify([]),
          now,
          now
        ).run();

        // Create units
        for (let i = 1; i <= prop.units; i++) {
          const unitId = generateId();
          await c.env.DB.prepare(`
            INSERT INTO units (id, property_id, unit_number, rent, bedrooms, bathrooms, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, 'vacant', ?, ?)
          `).bind(unitId, propId, `${prop.type === 'house' ? 'Main' : `Unit ${i}`}`, prop.rent, prop.type === 'house' ? 4 : 2, prop.type === 'house' ? 3 : 2, now, now).run();
        }
        createdProperties++;
      }
    }

    return c.json({
      success: true,
      message: 'Database seeded',
      data: {
        usersCreated: createdUsers,
        propertiesCreated: createdProperties,
      }
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return c.json({ error: 'Seed failed', details: error.message }, 500);
  }
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found', path: c.req.path }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({ error: 'Internal Server Error', details: err.message }, 500);
});

export default app;
