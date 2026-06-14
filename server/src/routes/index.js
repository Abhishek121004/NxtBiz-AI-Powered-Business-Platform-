import { Router } from 'express';
import { permissions } from '../config/specRules.js';
import { Customer } from '../models/Customer.js';
import { CRMActivity } from '../models/CRMActivity.js';
import { Meeting } from '../models/Meeting.js';
import { Memory } from '../models/Memory.js';
import { Notification } from '../models/Notification.js';
import { Ticket } from '../models/Ticket.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { authRoutes } from './authRoutes.js';
import { userRoutes } from './userRoutes.js';
import { crudRouter } from './crudRouter.js';
import { customerRoutes } from './customerRoutes.js';
import { emailRoutes } from './emailRoutes.js';
import { invoiceRoutes } from './invoiceRoutes.js';
import { reportRoutes } from './reportRoutes.js';
import { agentRoutes } from './agentRoutes.js';
import { workflowRoutes } from './workflowRoutes.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { calculateBusinessHealthScore } from '../utils/healthScore.js';
import { createNotification } from '../services/notificationService.js';
import { crmActivitySchema, meetingSchema, notificationUpdateSchema, partialSchema, ticketSchema } from '../validation/schemas.js';

export const router = Router();

router.use('/auth', authRoutes);
router.use(requireAuth);

router.use('/users', requireRoles(permissions.listUsers), userRoutes);
router.use('/customers', customerRoutes);
router.use('/emails', emailRoutes);
router.use(
  '/meetings',
  crudRouter(Meeting, {
    createSchema: meetingSchema,
    updateSchema: partialSchema(meetingSchema),
    createRoles: permissions.writeBusinessRecords,
    updateRoles: permissions.writeBusinessRecords,
    deleteRoles: ['Admin', 'Manager'],
    createEvent: 'meeting_created',
    afterCreate: async (meeting) =>
      createNotification({
        type: 'meeting',
        title: 'Meeting created',
        message: `${meeting.title} was scheduled in NxtBiz.`,
        metadata: { meetingId: meeting.id }
      })
  })
);
router.use('/invoices', invoiceRoutes);
router.use(
  '/tickets',
  crudRouter(Ticket, {
    populate: 'customerId assignedTo',
    createSchema: ticketSchema,
    updateSchema: partialSchema(ticketSchema),
    createRoles: permissions.writeBusinessRecords,
    updateRoles: permissions.writeBusinessRecords,
    deleteRoles: ['Admin', 'Manager'],
    createEvent: 'new_ticket',
    afterCreate: async (ticket) =>
      createNotification({
        type: 'ticket',
        title: 'Ticket created',
        message: `NxtBiz opened a ${ticket.priority || 'medium'} priority ticket.`,
        metadata: { ticketId: ticket.id }
      })
  })
);
router.use('/reports', reportRoutes);
router.use('/agents', requireRoles(permissions.runAgents), agentRoutes);
router.use('/workflows', workflowRoutes);

router.get(
  '/dashboard',
  asyncHandler(async (_req, res) => {
    const [customers, tickets, notifications] = await Promise.all([
      Customer.countDocuments(),
      Ticket.countDocuments({ status: { $ne: 'closed' } }),
      Notification.countDocuments({ read: false })
    ]);
    res.json({
      brand: 'NxtBiz',
      health: calculateBusinessHealthScore(),
      totals: { customers, openTickets: tickets, unreadNotifications: notifications }
    });
  })
);

router.get('/crm', asyncHandler(async (_req, res) => res.json(await CRMActivity.find().populate('customerId').sort({ createdAt: -1 }))));
router.post('/crm/note', asyncHandler(async (req, res) => res.status(201).json(await CRMActivity.create({ ...crmActivitySchema.parse(req.body), type: 'note', createdBy: req.user.id }))));
router.post('/crm/activity', asyncHandler(async (req, res) => res.status(201).json(await CRMActivity.create({ ...crmActivitySchema.parse(req.body), createdBy: req.user.id }))));

router.get(
  '/memory/search',
  asyncHandler(async (req, res) => {
    const q = req.query.q || '';
    const results = q ? await Memory.find({ $text: { $search: q } }).limit(25) : await Memory.find().limit(25);
    res.json(results);
  })
);

router.get('/notifications', asyncHandler(async (_req, res) => res.json(await Notification.find().sort({ createdAt: -1 }).limit(50))));
router.put('/notifications/:id', asyncHandler(async (req, res) => res.json(await Notification.findByIdAndUpdate(req.params.id, notificationUpdateSchema.parse(req.body), { new: true }))));
