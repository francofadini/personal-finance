import { connectToDatabase } from '@/lib/mongoose';
import Account from '@/backend/models/Account';

export const getAccountsUseCase = async (userId) => {
  try {
    await connectToDatabase();
    const accounts = await Account.find({ userId, visible: true }).lean();
    return accounts;
  } catch (error) {
    throw new Error(`Failed to retrieve accounts: ${error.message}`);
  }
}; 