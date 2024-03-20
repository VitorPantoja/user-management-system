import { createHash, randomBytes } from 'crypto';
import { hash as bcryptHash, compare as bcryptCompare } from 'bcryptjs';
import { env } from '../../../infrastructure/config/environment';

export function hashPassword(password: string): string {
  const sha256 = createHash('sha256');
  sha256.update(password);
  return sha256.digest('hex');
}

export function generateSalt(): string {
  return randomBytes(env.SALTS_ROUNDS).toString('hex');
}

export async function generateHashPassword(password: string): Promise<string> {
  const saltRounds = generateSalt();
  return await bcryptHash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcryptCompare(password, hashedPassword);
}
