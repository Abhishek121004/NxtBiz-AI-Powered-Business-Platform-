import crypto from 'crypto';
import { agentDefinitions, plannerRules } from '../config/specRules.js';
import { Agent } from '../models/Agent.js';
import { AgentExecution } from '../models/AgentExecution.js';
import { Email } from '../models/Email.js';
import { createNotification } from './notificationService.js';

export function planAgents(intent) {
  return ['intent-agent', 'task-planner-agent', ...(plannerRules[intent] || plannerRules.general_inquiry), 'crm-agent', 'chief-of-staff-agent'];
}

async function executeAgent(agentId, eventId, input) {
  await Agent.updateOne({ agentId }, { status: 'running', lastExecution: new Date(), $push: { logs: `Started ${eventId}` } });
  const execution = await AgentExecution.create({
    agentId,
    eventId,
    status: 'running',
    input,
    logs: [`${agentId} started`],
    startedAt: new Date()
  });

  const output = {
    summary: `${agentId} completed NxtBiz operational step`,
    nextAction: agentId === 'chief-of-staff-agent' ? 'Review consolidated execution history.' : 'Continue planned orchestration.'
  };

  execution.status = 'completed';
  execution.output = output;
  execution.logs.push(`${agentId} completed`);
  execution.finishedAt = new Date();
  await execution.save();
  await Agent.updateOne({ agentId }, { status: 'idle', lastExecution: new Date(), $push: { logs: `Completed ${eventId}` } });
  return execution;
}

export async function ensureAgents() {
  await Promise.all(
    agentDefinitions.map((agentId) =>
      Agent.updateOne(
        { agentId },
        {
          $setOnInsert: {
            agentId,
            name: agentId.replaceAll('-', ' '),
            status: 'idle',
            capabilities: ['operations', 'crm', 'workflow']
          }
        },
        { upsert: true }
      )
    )
  );
}

export async function runOrchestration(input) {
  await ensureAgents();
  const eventId = input.eventId || crypto.randomUUID();
  const plannedAgents = planAgents(input.intent || 'general_inquiry');
  const executions = [];

  for (const agentId of plannedAgents) {
    executions.push(await executeAgent(agentId, eventId, input));
  }

  if (input.emailId) {
    await Email.findByIdAndUpdate(input.emailId, { processed: true });
  }

  await createNotification({
    type: 'agent',
    title: 'Agent orchestration completed',
    message: `NxtBiz completed ${plannedAgents.length} operational agent steps.`,
    metadata: { eventId, plannedAgents },
    eventName: 'agent_completed'
  });

  return { eventId, plannedAgents, executions };
}
