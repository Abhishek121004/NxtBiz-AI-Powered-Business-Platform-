import mongoose from 'mongoose';

const workflowSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    trigger: { type: String, required: true },
    condition: { type: String, default: '' },
    action: { type: String, required: true },
    steps: [
      {
        type: { type: String, enum: ['trigger', 'condition', 'action'], required: true },
        label: String,
        config: { type: mongoose.Schema.Types.Mixed, default: {} }
      }
    ],
    enabled: { type: Boolean, default: true },
    logs: [
      {
        status: String,
        message: String,
        payload: mongoose.Schema.Types.Mixed,
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export const Workflow = mongoose.model('Workflow', workflowSchema);
