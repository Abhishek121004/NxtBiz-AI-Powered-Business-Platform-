import mongoose from 'mongoose';

const crmActivitySchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    type: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, default: '' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export const CRMActivity = mongoose.model('CRMActivity', crmActivitySchema);
