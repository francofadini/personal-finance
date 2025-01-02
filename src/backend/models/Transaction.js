import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  internalId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
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
  ignored: {
    type: Boolean,
    default: false
  },
  isManual: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true // Add createdAt and updatedAt fields
});

// Indexes
transactionSchema.index({ internalId: 1 }, { unique: true }); // Global unique internalId
transactionSchema.index({ userId: 1 }); // For user queries
transactionSchema.index(
  { 
    accountId: 1, 
    'metadata.gocardless.transactionId': 1 
  }, 
  { 
    unique: true,
    partialFilterExpression: { 
      isManual: { $ne: true },
      'metadata.gocardless.transactionId': { $exists: true }
    }
  }
); // For GoCardless transaction uniqueness

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
