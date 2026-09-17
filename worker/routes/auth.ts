import { Hono } from 'hono';
import { Env, AuthContext } from '../lib/middleware';
import { hashPassword, verifyPassword, createJWT, verifyJWT, generateId, nowISO } from '../lib/auth';
import { queryOne, execute, queryAll } from '../lib/db';
import { authMiddleware } from '../lib/middleware';

type Variables = { user: AuthContext };

const auth = new Hono<{ Bindings: Env; Variables: Variables }>();

// Register
auth.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, firstName, lastName, phone, role = 'owner' } = body;

    if (!email || !password || !firstName || !lastName) {
      return c.json({ error: 'Missing required fields: email, password, firstName, lastName' }, 400);
    }

    // Validate role
    const validRoles = ['owner', 'manager', 'accountant', 'tenant', 'realtor', 'contractor', 'admin', 'inspector'];
    if (!validRoles.includes(role)) {
      return c.json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` }, 400);
    }

    // Check existing user
    const existing = await queryOne(c.env.DB, 'SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing) {
      return c.json({ error: 'User with this email already exists' }, 409);
    }

    const id = generateId();
    const passwordHash = await hashPassword(password);
    const now = nowISO();

    await execute(c.env.DB, `
      INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, kyc_status, email_verified, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 0, ?, ?)
    `, [id, email.toLowerCase(), passwordHash, firstName, lastName, phone || '', role, now, now]);

    const token = await createJWT({ userId: id, email: email.toLowerCase(), role }, c.env.JWT_SECRET);

    const user = await queryOne(c.env.DB, 'SELECT id, email, first_name, last_name, phone, role, kyc_status, avatar_url, created_at FROM users WHERE id = ?', [id]);

    return c.json({
      success: true,
      data: {
        user: {
          id: (user as any).id,
          email: (user as any).email,
          firstName: (user as any).first_name,
          lastName: (user as any).last_name,
          phone: (user as any).phone,
          role: (user as any).role,
          kycStatus: (user as any).kyc_status,
          avatar: (user as any).avatar_url,
          createdAt: (user as any).created_at,
        },
        token
      }
    }, 201);
  } catch (error: any) {
    console.error('Register error:', error);
    return c.json({ error: 'Registration failed', details: error.message }, 500);
  }
});

// Login
auth.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400);
    }

    // Try to find user
    const user = await queryOne<any>(c.env.DB, 'SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    
    if (!user) {
      // For demo compatibility, allow hardcoded demo users if DB empty
      const demoUsers: Record<string, { password: string; role: string; firstName: string; lastName: string }> = {
        'owner@agently.com': { password: 'owner123', role: 'owner', firstName: 'John', lastName: 'Landlord' },
        'manager@agently.com': { password: 'manager123', role: 'manager', firstName: 'Sarah', lastName: 'Manager' },
        'accountant@agently.com': { password: 'accountant123', role: 'accountant', firstName: 'Michael', lastName: 'Finance' },
        'tenant@agently.com': { password: 'tenant123', role: 'tenant', firstName: 'Alice', lastName: 'Tenant' },
        'realtor@agently.com': { password: 'realtor123', role: 'realtor', firstName: 'David', lastName: 'Agent' },
        'contractor@agently.com': { password: 'contractor123', role: 'contractor', firstName: 'James', lastName: 'Handyman' },
        'admin@agently.com': { password: 'admin123', role: 'admin', firstName: 'Admin', lastName: 'User' },
      };

      const demo = demoUsers[email.toLowerCase()];
      if (demo && demo.password === password) {
        // Auto-create demo user
        const id = `demo-${demo.role}`;
        const now = nowISO();
        const passwordHash = await hashPassword(password);
        
        // Check if demo user exists
        const existingDemo = await queryOne(c.env.DB, 'SELECT id FROM users WHERE id = ?', [id]);
        if (!existingDemo) {
          await execute(c.env.DB, `
            INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, kyc_status, email_verified, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'verified', 1, ?, ?)
          `, [id, email.toLowerCase(), passwordHash, demo.firstName, demo.lastName, '+234-801-000-0000', demo.role, now, now]);
        }

        const token = await createJWT({ userId: id, email: email.toLowerCase(), role: demo.role }, c.env.JWT_SECRET);
        return c.json({
          success: true,
          data: {
            user: {
              id,
              email: email.toLowerCase(),
              firstName: demo.firstName,
              lastName: demo.lastName,
              phone: '+234-801-000-0000',
              role: demo.role,
              kycStatus: 'verified',
              createdAt: now,
            },
            token
          }
        });
      }

      return c.json({ error: 'Invalid email or password' }, 401);
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    const token = await createJWT({ userId: user.id, email: user.email, role: user.role }, c.env.JWT_SECRET);

    // Update last login
    await execute(c.env.DB, 'UPDATE users SET updated_at = ? WHERE id = ?', [nowISO(), user.id]);

    return c.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          role: user.role,
          kycStatus: user.kyc_status,
          avatar: user.avatar_url,
          createdAt: user.created_at,
        },
        token
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return c.json({ error: 'Login failed', details: error.message }, 500);
  }
});

// Me - get current user
auth.get('/me', authMiddleware, async (c) => {
  try {
    const userCtx = c.get('user');
    const user = await queryOne<any>(c.env.DB, 'SELECT id, email, first_name, last_name, phone, role, kyc_status, avatar_url, bio, company_name, created_at FROM users WHERE id = ?', [userCtx.userId]);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role,
        kycStatus: user.kyc_status,
        avatar: user.avatar_url,
        bio: user.bio,
        companyName: user.company_name,
        createdAt: user.created_at,
      }
    });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch user', details: error.message }, 500);
  }
});

// Verify token
auth.post('/verify', async (c) => {
  try {
    const body = await c.req.json();
    const { token } = body;
    if (!token) return c.json({ error: 'Token required' }, 400);
    
    const payload = await verifyJWT(token, c.env.JWT_SECRET);
    return c.json({ success: true, data: payload });
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
});

// List users (admin/manager)
auth.get('/users', authMiddleware, async (c) => {
  try {
    const userCtx = c.get('user');
    if (!['admin', 'owner', 'manager'].includes(userCtx.role)) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    const role = c.req.query('role');
    let sql = 'SELECT id, email, first_name, last_name, phone, role, kyc_status, avatar_url, created_at FROM users';
    const params: any[] = [];
    
    if (role && role !== 'all') {
      sql += ' WHERE role = ?';
      params.push(role);
    }
    sql += ' ORDER BY created_at DESC LIMIT 100';

    const users = await queryAll<any>(c.env.DB, sql, params);
    
    const mapped = users.map(u => ({
      id: u.id,
      email: u.email,
      firstName: u.first_name,
      lastName: u.last_name,
      phone: u.phone,
      role: u.role,
      kycStatus: u.kyc_status,
      avatar: u.avatar_url,
      createdAt: u.created_at,
    }));

    return c.json({ success: true, data: mapped });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch users', details: error.message }, 500);
  }
});

export default auth;
