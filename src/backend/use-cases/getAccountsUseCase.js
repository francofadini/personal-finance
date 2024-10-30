import { connectToDatabase } from '@/lib/mongoose';
import Account from '@/backend/models/Account';

export const getAccountsUseCase = async (userId) => {
  await connectToDatabase();
  return Account.find({ userId, visible: true }).lean();
}; 