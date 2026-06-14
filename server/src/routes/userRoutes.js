import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { permissions } from '../config/specRules.js';
import { requireRoles } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    res.json(await User.find().select('-passwordHash -refreshTokenHash').sort({ createdAt: -1 }));
  })
);

router.post(
  '/',
  requireRoles(permissions.createUsers),
  asyncHandler(async (req, res) => {
    const passwordHash = await bcrypt.hash(req.body.password || 'NxtBiz12345', 12);
    const user = await User.create({ ...req.body, passwordHash });
    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role, active: user.active });
  })
);

router.put(
  '/:id',
  requireRoles(permissions.updateUsers),
  asyncHandler(async (req, res) => {
    const update = { ...req.body };
    delete update.password;
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-passwordHash -refreshTokenHash');
    res.json(user);
  })
);

router.delete(
  '/:id',
  requireRoles(permissions.deleteUsers),
  asyncHandler(async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).end();
  })
);

export { router as userRoutes };
