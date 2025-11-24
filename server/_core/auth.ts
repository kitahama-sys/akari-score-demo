import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from './env';

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(userId: number): string {
  return jwt.sign({ userId }, ENV.jwtSecret, {
    expiresIn: '7d',
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): { userId: number } | null {
  try {
    const decoded = jwt.verify(token, ENV.jwtSecret) as { userId: number };
    return decoded;
  } catch (error) {
    return null;
  }
}
