import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Expected a MongoDB object id');
const optionalObjectId = objectId.optional().or(z.literal(''));

export const customerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  preferences: z.record(z.any()).optional(),
  healthScore: z.coerce.number().min(0).max(100).optional()
});

export const meetingSchema = z.object({
  title: z.string().min(2),
  attendees: z.array(z.string()).optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date().optional(),
  notes: z.string().optional(),
  status: z.string().optional(),
  customerId: optionalObjectId
});

export const invoiceSchema = z.object({
  customerId: objectId,
  amount: z.coerce.number().min(0),
  dueDate: z.coerce.date(),
  status: z.string().optional(),
  lineItems: z
    .array(
      z.object({
        description: z.string().optional(),
        quantity: z.coerce.number().min(1).optional(),
        amount: z.coerce.number().min(0).optional()
      })
    )
    .optional()
});

export const ticketSchema = z.object({
  customerId: optionalObjectId,
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  issue: z.string().min(2),
  status: z.string().optional(),
  assignedTo: optionalObjectId,
  resolution: z.string().optional()
});

export const workflowSchema = z.object({
  name: z.string().min(2),
  trigger: z.string().min(2),
  condition: z.string().optional(),
  action: z.string().min(2),
  enabled: z.boolean().optional(),
  steps: z
    .array(
      z.object({
        type: z.enum(['trigger', 'condition', 'action']),
        label: z.string().optional(),
        config: z.record(z.any()).optional()
      })
    )
    .optional()
});

export const crmActivitySchema = z.object({
  customerId: optionalObjectId,
  type: z.string().min(2).optional(),
  title: z.string().min(2),
  body: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

export const emailProcessSchema = z.object({
  sender: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
  customerId: optionalObjectId
});

export const reportGenerateSchema = z.object({
  type: z.string().optional(),
  title: z.string().min(2).optional(),
  metrics: z.record(z.coerce.number()).optional(),
  recommendations: z.array(z.string()).optional(),
  summary: z.string().optional()
});

export const agentRunSchema = z.object({
  intent: z.enum(['general_inquiry', 'schedule_meeting', 'invoice_request', 'support_request', 'sales_opportunity']).optional(),
  eventId: z.string().optional(),
  emailId: optionalObjectId,
  customerId: optionalObjectId,
  source: z.string().optional()
});

export const notificationUpdateSchema = z.object({
  read: z.boolean().optional()
});

export function partialSchema(schema) {
  return schema.partial();
}
