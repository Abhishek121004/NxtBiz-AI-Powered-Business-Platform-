import { Router } from 'express';
import { Email } from '../models/Email.js';
import { CRMActivity } from '../models/CRMActivity.js';
import { analyzeEmail } from '../services/emailIntelligence.js';
import { enqueueOrRunOrchestration } from '../services/agentQueue.js';
import { createNotification } from '../services/notificationService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { emailProcessSchema } from '../validation/schemas.js';

const router = Router();

router.post(
  '/process',
  asyncHandler(async (req, res) => {
    const body = emailProcessSchema.parse(req.body);
    const analysis = analyzeEmail(body);
    const email = await Email.create({ ...body, ...analysis });
    if (email.customerId) {
      await CRMActivity.create({
        customerId: email.customerId,
        type: 'email',
        title: email.subject,
        body: email.body,
        createdBy: req.user.id,
        metadata: analysis
      });
    }
    await createNotification({
      type: 'email',
      title: 'New email processed',
      message: `${analysis.intent.replaceAll('_', ' ')} detected with ${analysis.urgency} urgency.`,
      metadata: { emailId: email.id },
      eventName: 'new_email'
    });
    const orchestration = await enqueueOrRunOrchestration({ emailId: email.id, intent: analysis.intent, customerId: email.customerId });
    const processedEmail = await Email.findById(email.id);
    res.status(201).json({ email: processedEmail, orchestration });
  })
);

router.get('/', asyncHandler(async (_req, res) => res.json(await Email.find().sort({ createdAt: -1 }).populate('customerId'))));
router.get('/:id', asyncHandler(async (req, res) => res.json(await Email.findById(req.params.id).populate('customerId'))));

export { router as emailRoutes };
