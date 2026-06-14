import { ApiError } from '../utils/apiError.js';
import { Ticket } from '../models/Ticket.js';
import { Workflow } from '../models/Workflow.js';
import { createNotification } from './notificationService.js';

export async function executeWorkflow(workflowId, payload) {
  const workflow = await Workflow.findById(workflowId);
  if (!workflow) throw new ApiError(404, 'Workflow not found');

  const serializedPayload = JSON.stringify(payload || {}).toLowerCase();
  const condition = workflow.condition?.toLowerCase();

  if (condition && !serializedPayload.includes(condition)) {
    workflow.logs.push({ status: 'skipped', message: 'Condition did not match payload', payload });
    await workflow.save();
    return workflow;
  }

  if (workflow.action.toLowerCase().includes('ticket') && payload?.customerId) {
    await Ticket.create({
      customerId: payload.customerId,
      priority: payload.priority || 'high',
      issue: payload.issue || `Workflow ticket from ${workflow.name}`
    });
  }

  if (workflow.action.toLowerCase().includes('notify')) {
    await createNotification({
      type: 'workflow',
      title: 'Workflow executed',
      message: `${workflow.name} completed.`,
      metadata: { workflowId, payload },
      eventName: 'workflow_executed'
    });
  }

  workflow.logs.push({ status: 'completed', message: 'Workflow completed', payload });
  await workflow.save();
  return workflow;
}
