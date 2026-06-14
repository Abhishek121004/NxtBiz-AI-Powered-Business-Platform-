import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { z } from 'zod';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { hashToken, signAccessToken, signRefreshToken } from '../utils/tokens.js';

const router = Router();
const credentialsSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

function setAuthCookies(res, accessToken, refreshToken) {
  const secure = env.nodeEnv === 'production';
  res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'lax', secure });
  res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax', secure });
}

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const body = credentialsSchema.extend({ name: z.string().min(2), role: z.enum(['Admin', 'Manager', 'Employee', 'Viewer']).optional() }).parse(req.body);
    const passwordHash = await bcrypt.hash(body.password, 12);
    const user = await User.create({ name: body.name, email: body.email, passwordHash, role: body.role || 'Employee' });
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    user.refreshTokenHash = hashToken(refreshToken);
    user.lastLoginAt = new Date();
    await user.save();
    setAuthCookies(res, accessToken, refreshToken);
    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, accessToken });
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const body = credentialsSchema.parse(req.body);
    const user = await User.findOne({ email: body.email });
    if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) throw new ApiError(401, 'Invalid login credentials');
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    user.refreshTokenHash = hashToken(refreshToken);
    user.lastLoginAt = new Date();
    await user.save();
    setAuthCookies(res, accessToken, refreshToken);
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, accessToken });
  })
);

router.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) throw new ApiError(401, 'Refresh token required');
    const payload = jwt.verify(token, env.jwtRefreshSecret);
    const user = await User.findById(payload.sub);
    if (!user || user.refreshTokenHash !== hashToken(token)) throw new ApiError(401, 'Invalid refresh token');
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();
    setAuthCookies(res, accessToken, refreshToken);
    res.json({ accessToken });
  })
);

router.post(
  '/logout',
  asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken;
    if (token) {
      try {
        const payload = jwt.verify(token, env.jwtRefreshSecret);
        await User.findByIdAndUpdate(payload.sub, { $unset: { refreshTokenHash: 1 } });
      } catch {
        // Logout remains idempotent for invalid or expired tokens.
      }
    }
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(204).end();
  })
);

export { router as authRoutes };
