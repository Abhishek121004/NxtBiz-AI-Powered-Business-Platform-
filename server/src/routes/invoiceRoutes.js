import { Router } from 'express';
import { permissions } from '../config/specRules.js';
import { requireRoles } from '../middleware/auth.js';
import { Customer } from '../models/Customer.js';
import { Invoice } from '../models/Invoice.js';
import { generateInvoicePdf } from '../services/pdfService.js';
import { createNotification } from '../services/notificationService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { invoiceSchema, partialSchema } from '../validation/schemas.js';

const router = Router();

router.get('/', asyncHandler(async (_req, res) => res.json(await Invoice.find().populate('customerId').sort({ createdAt: -1 }))));
router.get('/:id', asyncHandler(async (req, res) => res.json(await Invoice.findById(req.params.id).populate('customerId'))));
router.get('/:id/download', asyncHandler(async (req, res) => res.json(await Invoice.findById(req.params.id).select('pdfUrl'))));

router.post(
  '/',
  requireRoles(permissions.writeBusinessRecords),
  asyncHandler(async (req, res) => {
    const body = invoiceSchema.parse(req.body);
    const invoice = await Invoice.create(body);
    const customer = await Customer.findById(invoice.customerId);
    invoice.pdfUrl = generateInvoicePdf(invoice, customer);
    await invoice.save();
    await createNotification({
      type: 'invoice',
      title: 'Invoice created',
      message: `NxtBiz generated invoice ${invoice.id}.`,
      metadata: { invoiceId: invoice.id },
      eventName: 'invoice_created'
    });
    res.status(201).json(invoice);
  })
);

router.put(
  '/:id',
  requireRoles(permissions.writeBusinessRecords),
  asyncHandler(async (req, res) => {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, partialSchema(invoiceSchema).parse(req.body), { new: true });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  })
);
router.delete(
  '/:id',
  requireRoles(['Admin', 'Manager']),
  asyncHandler(async (req, res) => {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.status(204).end();
  })
);

export { router as invoiceRoutes };
