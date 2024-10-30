import { connectToDatabase } from '@/lib/mongoose';
import Account from '@/backend/models/Account';

export const createAccountUseCase = async (accountData) => {
  try {
    await connectToDatabase();
    console.log('🔄 Creating account:', { 
      name: accountData.name, 
      identifier: accountData.identifier 
    });

    const account = new Account(accountData);
    const savedAccount = await account.save();
    
    console.log('✅ Account saved successfully:', savedAccount._id);
    return savedAccount;
  } catch (error) {
    console.error('❌ Failed to create account:', error.message);
    throw new Error(`Failed to create account: ${error.message}`);
  }
}; 