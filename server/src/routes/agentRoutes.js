import { Router } from 'express';
import { Agent } from '../models/Agent.js';
import { AgentExecution } from '../models/AgentExecution.js';
import { enqueueOrRunOrchestration } from '../services/agentQueue.js';
import { ensureAgents } from '../services/agentService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { agentRunSchema } from '../validation/schemas.js';

const router = Router();

router.get('/', asyncHandler(async (_req, res) => { await ensureAgents(); res.json(await Agent.find().sort({ agentId: 1 })); }));
router.get('/executions', asyncHandler(async (_req, res) => res.json(await AgentExecution.find().sort({ createdAt: -1 }).limit(100))));
router.post('/run', asyncHandler(async (req, res) => res.status(202).json(await enqueueOrRunOrchestration(agentRunSchema.parse(req.body)))));

export { router as agentRoutes };
