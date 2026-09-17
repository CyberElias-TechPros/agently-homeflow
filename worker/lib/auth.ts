import { SignJWT, jwtVerify } from 'jose';
import * as bcrypt from 'bcryptjs';

const JWT_ALG = 'HS256';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  exp?: number;
  iat?: number;
}

function getSecretKey(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createJWT(payload: Omit<JWTPayload, 'exp' | 'iat'>, secret: string, expiresIn = '7d'): Promise<string> {
  const secretKey = getSecretKey(secret);
  const jwt = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey);
  return jwt;
}

export async function verifyJWT(token: string, secret: string): Promise<JWTPayload> {
  const secretKey = getSecretKey(secret);
  const { payload } = await jwtVerify(token, secretKey);
  return payload as unknown as JWTPayload;
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function generateReceiptNumber(): string {
  const prefix = 'RCP';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
}

export function nowISO(): string {
  return new Date().toISOString();
}
