import { Router } from 'express';
import { Report } from '../models/Report.js';
import { generateReportPdf } from '../services/pdfService.js';
import { calculateBusinessHealthScore } from '../utils/healthScore.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { reportGenerateSchema } from '../validation/schemas.js';

const router = Router();

router.post(
  '/generate',
  asyncHandler(async (req, res) => {
    const body = reportGenerateSchema.parse(req.body);
    const health = calculateBusinessHealthScore(body.metrics);
    const report = await Report.create({
      type: body.type || 'executive',
      title: body.title || 'NxtBiz Executive Report',
      metrics: { ...(body.metrics || {}), healthScore: health.score },
      recommendations: body.recommendations || ['Review customer health trends.', 'Prioritize overdue invoices and critical tickets.'],
      summary: body.summary || 'Generated NxtBiz operations summary.',
      generatedBy: req.user.id
    });
    report.pdfUrl = generateReportPdf(report);
    await report.save();
    res.status(201).json(report);
  })
);

router.get('/', asyncHandler(async (_req, res) => res.json(await Report.find().sort({ createdAt: -1 }))));
router.get('/:id', asyncHandler(async (req, res) => res.json(await Report.findById(req.params.id))));

export { router as reportRoutes };
