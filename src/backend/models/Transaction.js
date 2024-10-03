import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  category: { type: String, required: true },
});

export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
