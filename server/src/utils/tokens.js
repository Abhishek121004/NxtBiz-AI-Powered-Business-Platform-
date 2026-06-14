import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAccessToken(user) {
  return jwt.sign({ sub: user.id, role: user.role, email: user.email }, env.jwtAccessSecret, {
    expiresIn: env.accessTokenExpiresIn
  });
}

export function signRefreshToken(user) {
  return jwt.sign({ sub: user.id, tokenType: 'refresh' }, env.jwtRefreshSecret, {
    expiresIn: env.refreshTokenExpiresIn
  });
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
