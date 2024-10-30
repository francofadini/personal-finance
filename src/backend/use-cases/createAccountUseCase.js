import { connectToDatabase } from '@/lib/mongoose';
import Account from '@/backend/models/Account';

export const createAccountUseCase = async (accountData) => {
  try {
    await connectToDatabase();
    console.log('🔄 Creating account:', { 
      name: accountData.name, 
      identifier: accountData.identifier 
    });

    //validate accountData
    if (!accountData.userId || !accountData.name || !accountData.identifier || !accountData.currency) {
      throw new Error('Missing required fields');
    }

    const account = new Account({
      userId: accountData.userId,
      name: accountData.name,
      balance: accountData.balance || 0,
      currency: accountData.currency,
      identifier: accountData.identifier,
      visible: true,
      metadata: accountData.metadata
    });

    const savedAccount = await account.save();
    
    console.log('✅ Account saved successfully:', savedAccount._id);
    return savedAccount;
  } catch (error) {
    console.error('❌ Failed to create account:', error.message);
    throw new Error(`Failed to create account: ${error.message}`);
  }
}; 