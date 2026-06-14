import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    attendees: [{ type: String }],
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    notes: { type: String, default: '' },
    status: { type: String, default: 'scheduled' },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }
  },
  { timestamps: true }
);

export const Meeting = mongoose.model('Meeting', meetingSchema);
