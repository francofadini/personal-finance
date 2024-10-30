import { createRequisition, finalizeRequisition, fetchAccountAndDetails } from '@/backend/services/gocardlessService';
import { createAccountUseCase } from './createAccountUseCase';

export const createAccountOrchestrator = {
  initiate: async (userId, institutionId, redirectUrl) => {
    console.log('🚀 Initiating account creation:', { userId, institutionId });
    const requisition = await createRequisition(institutionId, redirectUrl);
    console.log('✅ Requisition created:', requisition);
    return { requisitionId: requisition.id, link: requisition.link };
  },

  finalize: async (userId, institutionId, ref) => {
    console.log('🚀 Finalizing account creation:', { userId, institutionId, ref });
    
    const requisition = await finalizeRequisition(ref);
    console.log('✅ Requisition finalized, accounts:', requisition.accounts);
    
    const savedAccounts = [];
    for (const accountId of requisition.accounts) {
      try {
        const { account, balances } = await fetchAccountAndDetails(accountId);
        
        // Check if we hit rate limits
        if (balances.status_code === 429) {
          console.warn('⚠️ Rate limit hit, using default values');
        }

        const accountData = {
          userId,
          name: account.owner_name || `Account ${account.iban}`,
          balance: 0, // Default when rate limited
          currency: 'EUR', // Default when rate limited
          identifier: account.iban,
          status: account.status.toLowerCase(),
          metadata: { 
            provider: 'gocardless', 
            accountId,
            institutionId: account.institution_id,
            requisitionId: requisition.id,
            needsSync: true, // Flag to sync later
            lastSync: new Date()
          }
        };

        const savedAccount = await createAccountUseCase(accountData);
        savedAccounts.push(savedAccount);
        
      } catch (error) {
        console.error('❌ Failed to create account:', accountId, error);
        // Continue with next account
      }
    }
    
    console.log(`✨ Created ${savedAccounts.length} accounts successfully`);
    return savedAccounts;
  }
}; 