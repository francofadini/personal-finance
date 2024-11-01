import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, default: null },
  color: { type: String, default: '4E74EF' },
  icon: { type: String, default: '💰' },
  keywords: [{ type: String }],
  monthlyBudget: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema); 