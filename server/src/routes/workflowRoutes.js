import { Router } from 'express';
import { Workflow } from '../models/Workflow.js';
import { executeWorkflow } from '../services/workflowService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { partialSchema, workflowSchema } from '../validation/schemas.js';
import { crudRouter } from './crudRouter.js';

const router = crudRouter(Workflow, {
  createSchema: workflowSchema,
  updateSchema: partialSchema(workflowSchema)
});

router.post(
  '/:id/execute',
  asyncHandler(async (req, res) => {
    res.json(await executeWorkflow(req.params.id, req.body));
  })
);

export { router as workflowRoutes };
