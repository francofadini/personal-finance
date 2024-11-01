import { connectToDatabase } from "@/lib/mongoose";
import Account from '@/backend/models/Account';
import Transaction from '@/backend/models/Transaction';
import { categorizeNewTransactionUseCase } from '@/backend/use-cases/transaction/categorizeNewTransactionUseCase';

const API_URL = 'https://bankaccountdata.gocardless.com/api/v2';
const SECRET_ID = process.env.GOCARDLESS_SECRET_ID;
const SECRET_KEY = process.env.GOCARDLESS_SECRET_KEY;

let accessToken = null;
let tokenExpiration = null;

const getAccessToken = async () => {
  try {
    if (accessToken && tokenExpiration && new Date() < tokenExpiration) {
      return accessToken;
    }

    const response = await fetch(`${API_URL}/token/new/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret_id: SECRET_ID, secret_key: SECRET_KEY }),
    });

    if (!response.ok) throw new Error(`Token request failed: ${response.status}`);

    const data = await response.json();
    accessToken = data.access;
    tokenExpiration = new Date(Date.now() + data.access_expires * 1000);
    return accessToken;
  } catch (error) {
    console.error('❌ Failed to get access token:', error.message);
    throw new Error('Authentication failed with GoCardless');
  }
};

const getHeaders = async () => {
  try {
    return {
      'Authorization': `Bearer ${await getAccessToken()}`,
      'Content-Type': 'application/json',
    };
  } catch (error) {
    console.error('❌ Failed to get headers:', error.message);
    throw error;
  }
};

export const fetchInstitutions = async (countryCode) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      return [
        { 
          id: 'SANDBOXFINANCE_SFIN0000', 
          name: 'Sandbox Finance', 
          logo: 'https://sandboxfinance.gocardless.io/static/assets/img/sandbox_finance.svg' 
        }
      ]
    }
    const response = await fetch(`${API_URL}/institutions/?country=${countryCode}`, { 
      headers: await getHeaders() 
    });
    if (!response.ok) throw new Error(`Failed to fetch institutions: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Failed to fetch institutions:', error.message);
    throw new Error('Could not retrieve institutions list');
  }
};

export const createRequisition = async (institutionId, redirectUrl) => {
  try {
    const response = await fetch(`${API_URL}/requisitions/`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({
        redirect: redirectUrl,
        institution_id: institutionId,
        reference: `inst_${institutionId}_${Date.now()}`,
        user_language: 'EN',
      }),
    });
    if (!response.ok) throw new Error(`Failed to create requisition: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Failed to create requisition:', error.message);
    throw new Error('Could not create bank connection request');
  }
};

export const finalizeRequisition = async (ref) => {
  try {
    const requisitionsResponse = await fetch(`${API_URL}/requisitions/?reference=${ref}`, {
      headers: await getHeaders(),
    });
    if (!requisitionsResponse.ok) throw new Error(`Failed to fetch requisition: ${requisitionsResponse.status}`);

    const requisitions = await requisitionsResponse.json();
    if (!requisitions.results.length) throw new Error('No requisition found with this reference');

    const requisition = requisitions.results[0];

    if (requisition.status !== 'LN') {
      throw new Error(`Invalid requisition status: ${requisition.status}`);
    }

    return requisition;
  } catch (error) {
    console.error('❌ Failed to finalize requisition:', error.message);
    throw new Error('Could not complete bank connection');
  }
};

export const fetchAccountBalance = async (account) => {
  await connectToDatabase();
  if (!account || !account.metadata.accountId) {
    throw new Error(`No account provided`);
  }
  const gocardlessAccountId = account.metadata.accountId;
  if (account.lastBalanceSync && Date.now() - account.lastBalanceSync < 24 * 60 * 60 * 1000) {
    return { status: 'skipped', message: 'Balance synced recently' };
  }

  try {
    const balanceResponse = await fetch(`${API_URL}/accounts/${gocardlessAccountId}/balances`, { 
      headers: await getHeaders() 
    });
    if (!balanceResponse.ok) throw new Error(`Failed to fetch balance: ${balanceResponse.status}`);
    const balances = await balanceResponse.json();
    account.balance = balances.balances?.[0]?.balanceAmount?.amount;
    account.currency = balances.balances?.[0]?.balanceAmount?.currency;
    account.lastBalanceSync = new Date();
    await account.save();
    return { status: 'success', balance: account.balance, currency: account.currency };
  } catch (error) {
    console.error('❌ Failed to fetch balance:', error.message);
    return { status: 'error', message: error.message };
  }
};

export const fetchAccountAndDetails = async (accountId) => {
  await connectToDatabase();
  const account = await Account.findById(accountId);
  if (!account || !account.metadata.accountId) {
    throw new Error(`No account found for ${accountId}`);
  }
  const gocardlessAccountId = account.metadata.accountId;
  if (account.lastDetailsSync && Date.now() - account.lastDetailsSync < 24 * 60 * 60 * 1000) {
    return { account, details: null, balances: null };
  }
  try {
    // Fetch account first
    const accountResponse = await fetch(`${API_URL}/accounts/${gocardlessAccountId}`, { 
      headers: await getHeaders() 
    });
    const accountData = await accountResponse.json();
    if (accountResponse.status !== 200) console.warn(`Failed to fetch account: ${accountResponse.status}`);
    
    // Add delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Fetch details
    const detailsResponse = await fetch(`${API_URL}/accounts/${gocardlessAccountId}/details`, { 
      headers: await getHeaders() 
    });
    const details = await detailsResponse.json();
    if (detailsResponse.status !== 200) console.warn(`Failed to fetch details: ${detailsResponse.status}`);

    // Add delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Fetch balances
    const balancesResponse = await fetch(`${API_URL}/accounts/${gocardlessAccountId}/balances`, { 
      headers: await getHeaders() 
    });
    const balances = await balancesResponse.json();
    if (balancesResponse.status !== 200) console.warn(`Failed to fetch balances: ${balancesResponse.status}`);

    account.lastDetailsSync = new Date();
    await account.save();

    return { account:accountData, details, balances };
  } catch (error) {
    console.error('❌ Failed to fetch account data:', error.message);
    return;
  }
};

export const syncTransactions = async (account) => {
  try {
    await connectToDatabase();
    if (!account || !account.metadata?.accountId) {
      throw new Error(`No account provided`);
    }

    // Check last sync time (24h)
    if (account.lastTransactionsSync && Date.now() - account.lastTransactionsSync < 24 * 60 * 60 * 1000) {
      return { status: 'skipped', message: 'Transactions synced recently' };
    }

    const headers = await getHeaders();
    const gocardlessAccountId = account.metadata.accountId;
    
  
    const response = await fetch(`${API_URL}/accounts/${gocardlessAccountId}/transactions`, {
      headers
    });

    if (!response.ok) throw new Error(`Failed to fetch transactions: ${response.status}`);
    const { transactions } = await response.json();
    const allTransactions = [...transactions.booked, ...transactions.pending];

    // Process transactions
    const results = await Promise.all(allTransactions.map(async (gcTransaction) => {
      try {
        // Check if transaction already exists
        const existingTransaction = await Transaction.findOne({
          accountId: account._id,
          'metadata.gocardless.transactionId': gcTransaction.transactionId
        });

        if (existingTransaction) {
          return { status: 'skipped', transactionId: gcTransaction.transactionId };
        }

        // Create new transaction
        const newTransaction = new Transaction({
          userId: account.userId,
          accountId: account._id,
          amount: parseFloat(gcTransaction.transactionAmount.amount),
          currency: gcTransaction.transactionAmount.currency,
          description: gcTransaction.creditorName || gcTransaction.remittanceInformationUnstructured?.trim() || 'No description',
          note: gcTransaction.remittanceInformationUnstructured?.trim() || 'No description',
          date: new Date(gcTransaction.bookingDateTime || gcTransaction.valueDateTime),
          metadata: {
            gocardless: {
              transactionId: gcTransaction.transactionId,
              status: gcTransaction.status
            }
          }
        });

        await newTransaction.save();
        await categorizeNewTransactionUseCase(newTransaction);
        return { 
          status: 'success', 
          transactionId: newTransaction._id 
        };

      } catch (error) {
        console.error('❌ Error processing transaction:', error.message);
        return { 
          status: 'error', 
          transactionId: gcTransaction.transactionId,
          message: error.message 
        };
      }
    }));

    // Update account sync time
    account.lastTransactionsSync = new Date();
    await account.save();

    return {
      status: 'success',
      total: transactions.length,
      created: results.filter(r => r.status === 'created').length,
      skipped: results.filter(r => r.status === 'skipped').length,
      errors: results.filter(r => r.status === 'error').length,
      details: results
    };

  } catch (error) {
    console.error('❌ Sync transactions error', error.message);
    return { status: 'error', message: error.message };
  }
};