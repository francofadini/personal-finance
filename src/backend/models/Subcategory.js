import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  isVisible: { type: Boolean, default: true },
  keywords: [{ type: String }],
  monthlyBudget: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, {
  strict: true
});

// Ensure only one default subcategory per category
subcategorySchema.index({ categoryId: 1, isDefault: 1 }, { 
  unique: true, 
  partialFilterExpression: { isDefault: true } 
});

export const Subcategory = mongoose.models.Subcategory || mongoose.model('Subcategory', subcategorySchema); 