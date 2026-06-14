import mongoose from 'mongoose';
import { emailRules } from '../config/specRules.js';

const emailSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    body: { type: String, required: true },
    sender: { type: String, required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    sentiment: { type: String, enum: emailRules.sentiment, default: 'neutral' },
    intent: { type: String, enum: emailRules.intent, default: 'general_inquiry' },
    urgency: { type: String, enum: emailRules.urgency, default: 'low' },
    confidence: { type: Number, default: 0.5 },
    autoResponse: { type: String, default: '' },
    recommendations: [{ type: String }],
    processed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Email = mongoose.model('Email', emailSchema);
