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
        // Create a basic account record in the database
        const accountData = {
          userId,
          name: accountId,
          identifier: accountId,
          metadata: {
            provider: 'gocardless',
            accountId,
            institutionId,
            requisitionId: requisition.id
          }
        };
        const savedAccount = await createAccountUseCase(accountData);

        // Fetch account details and update the saved account
        const { account, details, balances } = await fetchAccountAndDetails(savedAccount._id);
        if (!account || !details || !balances || !account.iban) {
          throw new Error(`Failed to fetch account details for ${accountId}`);
        }
        savedAccount.name = details.account?.details || account?.iban;
        savedAccount.balance = balances.balances?.[0]?.balanceAmount?.amount ?? 0;
        savedAccount.currency = balances.balances?.[0]?.balanceAmount?.currency ?? 'EUR';
        savedAccount.identifier = account.iban;
        await savedAccount.save();

        savedAccounts.push(savedAccount);
      } catch (error) {
        console.error('❌ Failed to create account:', error.message);
        // Continue with next account
      }
    }
    
    console.log(`✨ Created ${savedAccounts.length} accounts successfully`);
    return { savedAccounts, availableAccounts: requisition.accounts };
  }
}; 