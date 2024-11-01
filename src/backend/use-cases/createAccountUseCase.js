import { connectToDatabase } from '@/lib/mongoose';
import Account from '@/backend/models/Account';

export const createAccountUseCase = async (accountData) => {
  try {
    await connectToDatabase();

    //validate accountData
    if (!accountData.userId || !accountData.name || !accountData.identifier) {
      throw new Error('Missing required fields');
    }

    const account = new Account({
      userId: accountData.userId,
      name: accountData.name,
      balance: accountData.balance || 0,
      currency: accountData.currency || 'EUR',
      identifier: accountData.identifier,
      metadata: accountData.metadata
    });

    const savedAccount = await account.save();
    
    return savedAccount;
  } catch (error) {
    console.error('❌ Failed to create account:', error.message);
    throw new Error(`Failed to create account: ${error.message}`);
  }
}; 