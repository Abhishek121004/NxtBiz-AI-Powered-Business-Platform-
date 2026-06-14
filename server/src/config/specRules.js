export const roles = ['Admin', 'Manager', 'Employee', 'Viewer'];

export const permissions = {
  listUsers: ['Admin', 'Manager'],
  createUsers: ['Admin'],
  updateUsers: ['Admin', 'Manager'],
  deleteUsers: ['Admin'],
  runAgents: ['Admin', 'Manager'],
  deleteCustomers: ['Admin', 'Manager'],
  writeBusinessRecords: ['Admin', 'Manager', 'Employee'],
  readBusinessRecords: ['Admin', 'Manager', 'Employee', 'Viewer']
};

export const emailRules = {
  sentiment: ['positive', 'neutral', 'negative'],
  urgency: ['low', 'medium', 'high', 'critical'],
  intent: ['general_inquiry', 'schedule_meeting', 'invoice_request', 'support_request', 'sales_opportunity'],
  negativeSignals: ['angry', 'cancel', 'broken', 'refund', 'late', 'complaint', 'urgent', 'bad', 'issue', 'failed'],
  positiveSignals: ['thanks', 'great', 'love', 'happy', 'excellent', 'appreciate', 'renew'],
  criticalUrgencySignals: ['urgent', 'asap', 'immediately']
};

export const agentDefinitions = [
  'intent-agent',
  'task-planner-agent',
  'email-agent',
  'crm-agent',
  'meeting-agent',
  'invoice-agent',
  'customer-support-agent',
  'chief-of-staff-agent'
];

export const plannerRules = {
  schedule_meeting: ['meeting-agent'],
  invoice_request: ['invoice-agent'],
  support_request: ['customer-support-agent'],
  sales_opportunity: ['email-agent'],
  general_inquiry: ['email-agent']
};

export const healthScoreWeights = {
  customerSatisfaction: 0.28,
  responseTime: 0.16,
  invoiceCollection: 0.2,
  ticketResolution: 0.2,
  leadConversion: 0.16
};

export const socketEvents = [
  'new_email',
  'new_ticket',
  'invoice_created',
  'meeting_created',
  'agent_completed',
  'workflow_executed'
];
