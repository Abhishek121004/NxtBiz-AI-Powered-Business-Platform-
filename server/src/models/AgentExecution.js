import mongoose from 'mongoose';

const agentExecutionSchema = new mongoose.Schema(
  {
    agentId: { type: String, required: true },
    eventId: { type: String, required: true },
    status: { type: String, default: 'pending' },
    input: { type: mongoose.Schema.Types.Mixed, default: {} },
    output: { type: mongoose.Schema.Types.Mixed, default: {} },
    logs: [{ type: String }],
    startedAt: { type: Date },
    finishedAt: { type: Date },
    error: { type: String }
  },
  { timestamps: true }
);

export const AgentExecution = mongoose.model('AgentExecution', agentExecutionSchema);
