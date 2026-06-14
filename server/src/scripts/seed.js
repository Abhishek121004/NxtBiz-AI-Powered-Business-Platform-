import bcrypt from 'bcryptjs';
import { connectDatabase } from '../db/connect.js';
import { User } from '../models/User.js';
import { Customer } from '../models/Customer.js';
import { Workflow } from '../models/Workflow.js';
import { Memory } from '../models/Memory.js';
import { ensureAgents } from '../services/agentService.js';

async function seed() {
  await connectDatabase();

  const passwordHash = await bcrypt.hash('Admin12345', 12);
  const admin = await User.findOneAndUpdate(
    { email: 'admin@nxtbiz.local' },
    { name: 'NxtBiz Admin', email: 'admin@nxtbiz.local', passwordHash, role: 'Admin', active: true },
    { upsert: true, new: true }
  );

  const customer = await Customer.findOneAndUpdate(
    { email: 'ops@example.com' },
    {
      name: 'Sample Operations Customer',
      email: 'ops@example.com',
      phone: '+1 555 0100',
      company: 'Example Co',
      tags: ['demo', 'priority'],
      notes: 'Seed customer for NxtBiz verification.',
      healthScore: 78
    },
    { upsert: true, new: true }
  );

  await Workflow.findOneAndUpdate(
    { name: 'Negative Email Escalation' },
    {
      name: 'Negative Email Escalation',
      trigger: 'email.processed',
      condition: 'negative',
      action: 'create ticket and notify manager',
      enabled: true,
      steps: [
        { type: 'trigger', label: 'Email processed' },
        { type: 'condition', label: 'Negative sentiment detected' },
        { type: 'action', label: 'Create ticket and notify' }
      ]
    },
    { upsert: true }
  );

  await Memory.findOneAndUpdate(
    { key: 'demo-customer-context' },
    {
      scope: 'customer',
      customerId: customer.id,
      key: 'demo-customer-context',
      value: 'Example Co prefers quick email follow-up and concise invoice summaries.',
      tags: ['demo', 'customer'],
      source: 'seed'
    },
    { upsert: true }
  );

  await ensureAgents();
  console.log(`NxtBiz seed complete. Admin: ${admin.email} / Admin12345`);
  process.exit(0);
}

seed().catch((error) => {
  console.error('NxtBiz seed failed', error);
  process.exit(1);
});
