import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, default: 'draft' },
    pdfUrl: { type: String },
    lineItems: [
      {
        description: String,
        quantity: { type: Number, default: 1 },
        amount: { type: Number, default: 0 }
      }
    ]
  },
  { timestamps: true }
);

export const Invoice = mongoose.model('Invoice', invoiceSchema);
