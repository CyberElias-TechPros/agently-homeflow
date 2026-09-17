import { Context, Next } from 'hono';
import { verifyJWT } from './auth';

export interface Env {
  DB: any;
  STORAGE: any;
  CACHE: any;
  JWT_SECRET: string;
  ENVIRONMENT: string;
  FRONTEND_URL: string;
}

export interface AuthContext {
  userId: string;
  email: string;
  role: string;
}

export async function authMiddleware(c: Context<{ Bindings: Env; Variables: { user: AuthContext } }>, next: Next) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized - No token provided' }, 401);
  }

  const token = authHeader.substring(7);
  try {
    const payload = await verifyJWT(token, c.env.JWT_SECRET);
    c.set('user', {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });
    await next();
  } catch (error) {
    return c.json({ error: 'Unauthorized - Invalid token' }, 401);
  }
}

export function roleMiddleware(allowedRoles: string[]) {
  return async (c: Context<{ Bindings: Env; Variables: { user: AuthContext } }>, next: Next) => {
    const user = c.get('user');
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    if (!allowedRoles.includes(user.role)) {
      return c.json({ error: `Forbidden - Requires one of: ${allowedRoles.join(', ')}` }, 403);
    }
    await next();
  };
}

export async function optionalAuthMiddleware(c: Context<{ Bindings: Env; Variables: { user?: AuthContext } }>, next: Next) {
  const authHeader = c.req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const payload = await verifyJWT(token, c.env.JWT_SECRET);
      c.set('user', {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      });
    } catch {
      // Ignore invalid token for optional auth
    }
  }
  await next();
}
