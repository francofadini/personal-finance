import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  amount: { 
    type: Number, 
    required: true 
  },
  currency: {
    type: String,
    required: true,
    default: 'EUR'
  },
  description: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  categoryId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  subcategoryId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory'
  },
  recurrentExpenseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RecurrentExpense'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

transactionSchema.index({ userId: 1, date: -1 });

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
