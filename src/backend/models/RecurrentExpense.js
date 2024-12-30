import mongoose from 'mongoose';

const recurrentExpenseSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  name: { 
    type: String, 
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
  estimatedAmount: { 
    type: Number, 
    required: true 
  },
  keywords: [{ 
    type: String 
  }],
  // Simplified to just months array (1-12)
  months: [{
    type: Number,
    min: 1,
    max: 12
  }],
  dayOfMonth: { 
    type: Number, 
    min: 1, 
    max: 31,
    required: true 
  },
  lastMatchedTransaction: {
    transactionId: { type: String },
    amount: { type: Number },
    date: { type: Date }
  }
}); 

export const RecurrentExpense = mongoose.models.RecurrentExpense || mongoose.model('RecurrentExpense', recurrentExpenseSchema);