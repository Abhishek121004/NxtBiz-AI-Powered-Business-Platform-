import { Router } from 'express';
import { emitEvent } from '../realtime/socket.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export function crudRouter(Model, options = {}) {
  const router = Router();
  const populate = options.populate || '';
  const createSchema = options.createSchema;
  const updateSchema = options.updateSchema;

  function checkRoles(req, allowedRoles) {
    if (allowedRoles?.length && !allowedRoles.includes(req.user?.role)) {
      throw new ApiError(403, 'Insufficient permissions');
    }
  }

  function parseBody(schema, body) {
    return schema ? schema.parse(body) : body;
  }

  router.get(
    '/',
    asyncHandler(async (_req, res) => {
      const query = Model.find().sort({ createdAt: -1 });
      if (populate) query.populate(populate);
      res.json(await query);
    })
  );

  router.get(
    '/:id',
    asyncHandler(async (req, res) => {
      const query = Model.findById(req.params.id);
      if (populate) query.populate(populate);
      const record = await query;
      if (!record) return res.status(404).json({ message: 'Record not found' });
      res.json(record);
    })
  );

  router.post(
    '/',
    asyncHandler(async (req, res) => {
      checkRoles(req, options.createRoles);
      const record = await Model.create(parseBody(createSchema, req.body));
      if (options.createEvent) emitEvent(options.createEvent, { record });
      if (options.afterCreate) await options.afterCreate(record, req);
      res.status(201).json(record);
    })
  );

  router.put(
    '/:id',
    asyncHandler(async (req, res) => {
      checkRoles(req, options.updateRoles);
      const record = await Model.findByIdAndUpdate(req.params.id, parseBody(updateSchema, req.body), { new: true, runValidators: true });
      if (!record) return res.status(404).json({ message: 'Record not found' });
      res.json(record);
    })
  );

  router.delete(
    '/:id',
    asyncHandler(async (req, res) => {
      checkRoles(req, options.deleteRoles);
      const record = await Model.findByIdAndDelete(req.params.id);
      if (!record) return res.status(404).json({ message: 'Record not found' });
      res.status(204).end();
    })
  );

  return router;
}
