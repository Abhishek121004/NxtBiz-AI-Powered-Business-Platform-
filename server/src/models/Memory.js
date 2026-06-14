import mongoose from 'mongoose';

const memorySchema = new mongoose.Schema(
  {
    scope: { type: String, required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    agentId: { type: String },
    key: { type: String, required: true },
    value: { type: String, required: true },
    tags: [{ type: String }],
    source: { type: String }
  },
  { timestamps: true }
);

memorySchema.index({ key: 'text', value: 'text', tags: 'text' });

export const Memory = mongoose.model('Memory', memorySchema);
