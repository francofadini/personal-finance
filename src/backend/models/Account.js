import mongoose from 'mongoose';

const GoCardlessAccountSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  balance: { type: Number, required: true },
  currency: { type: String, required: true },
  accountType: { type: String, required: true },
});

const AccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  institution: { type: String, required: true },
  gocardlessAccounts: [GoCardlessAccountSchema],
  lastSyncDate: { type: Date },
  visible: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Account || mongoose.model('Account', AccountSchema);
