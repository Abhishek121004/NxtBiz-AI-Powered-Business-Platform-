import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    notes: { type: String, default: '' },
    preferences: { type: mongoose.Schema.Types.Mixed, default: {} },
    healthScore: { type: Number, default: 70 }
  },
  { timestamps: true }
);

export const Customer = mongoose.model('Customer', customerSchema);
