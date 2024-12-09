import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  icon: { type: String, default: '💰' },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, {
  strict: true
});

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema); 