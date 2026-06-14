import { Queue, Worker } from 'bullmq';
import { env } from '../config/env.js';
import { runOrchestration } from './agentService.js';

let queue;

export function initializeAgentQueue() {
  if (!env.redisUrl) {
    console.warn('NxtBiz Redis unavailable; agent orchestration will run synchronously.');
    return;
  }

  const connection = { url: env.redisUrl };
  queue = new Queue('agent-orchestration', { connection });
  new Worker('agent-orchestration', (job) => runOrchestration(job.data), { connection, concurrency: 4 });
}

export async function enqueueOrRunOrchestration(payload) {
  if (!queue) {
    return runOrchestration(payload);
  }

  const job = await queue.add('run-agent-orchestration', payload, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 100 }
  });

  return { queued: true, jobId: job.id };
}
