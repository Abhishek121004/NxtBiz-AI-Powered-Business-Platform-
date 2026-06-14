import { Router } from 'express';
import { permissions } from '../config/specRules.js';
import { CRMActivity } from '../models/CRMActivity.js';
import { Customer } from '../models/Customer.js';
import { Email } from '../models/Email.js';
import { Invoice } from '../models/Invoice.js';
import { Meeting } from '../models/Meeting.js';
import { Memory } from '../models/Memory.js';
import { Ticket } from '../models/Ticket.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { customerSchema, partialSchema } from '../validation/schemas.js';
import { crudRouter } from './crudRouter.js';

const router = Router();

router.get(
  '/:id/360',
  asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const [crm, emails, meetings, invoices, tickets, memory] = await Promise.all([
      CRMActivity.find({ customerId: customer.id }).sort({ createdAt: -1 }).limit(25),
      Email.find({ customerId: customer.id }).sort({ createdAt: -1 }).limit(25),
      Meeting.find({ customerId: customer.id }).sort({ startTime: -1 }).limit(25),
      Invoice.find({ customerId: customer.id }).sort({ createdAt: -1 }).limit(25),
      Ticket.find({ customerId: customer.id }).sort({ createdAt: -1 }).limit(25),
      Memory.find({ customerId: customer.id }).sort({ createdAt: -1 }).limit(25)
    ]);

    res.json({ customer, crm, emails, meetings, invoices, tickets, memory });
  })
);

router.use(
  crudRouter(Customer, {
    createSchema: customerSchema,
    updateSchema: partialSchema(customerSchema),
    createRoles: permissions.writeBusinessRecords,
    updateRoles: permissions.writeBusinessRecords,
    deleteRoles: permissions.deleteCustomers
  })
);

export { router as customerRoutes };
