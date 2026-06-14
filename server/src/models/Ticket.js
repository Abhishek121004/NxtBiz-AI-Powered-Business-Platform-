import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    priority: { type: String, default: 'medium' },
    issue: { type: String, required: true },
    status: { type: String, default: 'open' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolution: { type: String, default: '' }
  },
  { timestamps: true }
);

export const Ticket = mongoose.model('Ticket', ticketSchema);
