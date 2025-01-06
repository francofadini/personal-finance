import { connectToDatabase } from '@/lib/mongoose';
import Account from '@/backend/models/Account';

export const createAccountUseCase = async (accountData) => {
  try {
    console.log('accountData', accountData);
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
      institutionName: accountData.institutionName || 'Sandbox Finance',
      institutionLogo: accountData.institutionLogo || 'https://sandboxfinance.gocardless.io/static/assets/img/sandbox_finance.svg',
      metadata: accountData.metadata
    });

    const savedAccount = await account.save();
    
    return savedAccount;
  } catch (error) {
    console.error('❌ Failed to create account:', error.message);
    throw new Error(`Failed to create account: ${error.message}`);
  }
}; 