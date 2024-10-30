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
        const { account, details, balances } = await fetchAccountAndDetails(accountId);

        const accountData = {
          userId,
          name: details.account?.details || account.iban,
          balance: balances.balances?.[0]?.balanceAmount?.amount,
          currency: balances.balances?.[0]?.balanceAmount?.currency,
          identifier: account.iban,
          metadata: { 
            provider: 'gocardless', 
            accountId,
            institutionId: account.institution_id,
            requisitionId: requisition.id,
            needsSync: true,
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
    return { savedAccounts, availableAccounts: requisition.accounts };
  }
}; 