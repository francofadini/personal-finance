import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  balance: { type: Number, required: true },
  currency: { type: String, required: true },
  identifier: { type: String, required: true },
  institutionName: { type: String, required: true },
  institutionLogo: { type: String, required: true },
  visible: { type: Boolean, default: true },
  lastDetailsSync: { type: Date },
  lastTransactionsSync: { type: Date },
  lastBalanceSync: { type: Date },
  metadata: { type: mongoose.Schema.Types.Mixed }
});

export default mongoose.models.Account || mongoose.model('Account', AccountSchema);
