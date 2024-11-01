import { connectToDatabase } from "@/lib/mongoose";
import Account from '@/backend/models/Account';

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
    console.error('❌ Failed to get access token:', error);
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
    console.error('❌ Failed to get headers:', error);
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
    console.log('🔄 Fetching institutions for:', countryCode);
    const response = await fetch(`${API_URL}/institutions/?country=${countryCode}`, { 
      headers: await getHeaders() 
    });
    if (!response.ok) throw new Error(`Failed to fetch institutions: ${response.status}`);
    const data = await response.json();
    console.log('✅ Institutions fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ Failed to fetch institutions:', error);
    throw new Error('Could not retrieve institutions list');
  }
};

export const createRequisition = async (institutionId, redirectUrl) => {
  try {
    console.log('🔄 Creating requisition:', { institutionId, redirectUrl });
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
    console.log('✅ Requisition created');
    return data;
  } catch (error) {
    console.error('❌ Failed to create requisition:', error);
    throw new Error('Could not create bank connection request');
  }
};

export const finalizeRequisition = async (ref) => {
  try {
    console.log('🔄 Finalizing requisition with ref:', ref);
    const requisitionsResponse = await fetch(`${API_URL}/requisitions/?reference=${ref}`, {
      headers: await getHeaders(),
    });
    if (!requisitionsResponse.ok) throw new Error(`Failed to fetch requisition: ${requisitionsResponse.status}`);

    const requisitions = await requisitionsResponse.json();
    if (!requisitions.results.length) throw new Error('No requisition found with this reference');

    const requisition = requisitions.results[0];
    console.log('✅ Requisition found');

    if (requisition.status !== 'LN') {
      throw new Error(`Invalid requisition status: ${requisition.status}`);
    }

    return requisition;
  } catch (error) {
    console.error('❌ Failed to finalize requisition:', error);
    throw new Error('Could not complete bank connection');
  }
};

export const fetchAccountBalance = async (accountId) => {
  await connectToDatabase();
  const account = await Account.findById(accountId);
  if (!account || !account.metadata.accountId) {
    throw new Error(`No account found for ${accountId}`);
  }
  const gocardlessAccountId = account.metadata.accountId;
  if (account.lastSync && Date.now() - account.lastSync < 24 * 60 * 60 * 1000) {
    return;
  }

  try {
    console.log('🔄 Fetching balance for account:', gocardlessAccountId);
    const balanceResponse = await fetch(`${API_URL}/accounts/${gocardlessAccountId}/balances`, { 
      headers: await getHeaders() 
    });
    if (!balanceResponse.ok) throw new Error(`Failed to fetch balance: ${balanceResponse.status}`);
    const balances = await balanceResponse.json();
    console.log('✅ Balance fetched successfully');
    return balances;
  } catch (error) {
    console.error('❌ Failed to fetch balance:', error);
    throw new Error(`Failed to fetch balance for account ${accountId}`);
  }
};

export const fetchAccountAndDetails = async (accountId) => {
  await connectToDatabase();
  const account = await Account.findById(accountId);
  if (!account || !account.metadata.accountId) {
    throw new Error(`No account found for ${accountId}`);
  }
  const gocardlessAccountId = account.metadata.accountId;
  if (account.lastSync && Date.now() - account.lastSync < 24 * 60 * 60 * 1000) {
    return { account, details: null, balances: null };
  }
  try {
    console.log('🔄 Fetching account data for:', gocardlessAccountId);
    
    // Fetch account first
    const accountResponse = await fetch(`${API_URL}/accounts/${gocardlessAccountId}`, { 
      headers: await getHeaders() 
    });
    const account = await accountResponse.json();
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

    return { account, details, balances };
  } catch (error) {
    console.error('❌ Failed to fetch account data:', error);
    throw new Error('Could not retrieve account information');
  }
};
