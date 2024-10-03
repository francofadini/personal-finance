/**
 * GoCardless API Service
 * 
 * This service handles interactions with the GoCardless API.
 * API Documentation: https://bankaccountdata.gocardless.com/api/v2/swagger.json
 */

const GOCARDLESS_API_URL = 'https://bankaccountdata.gocardless.com/api/v2';
const SECRET_ID = process.env.GOCARDLESS_SECRET_ID;
const SECRET_KEY = process.env.GOCARDLESS_SECRET_KEY;

let accessToken = null;
let tokenExpiration = null;

async function getAccessToken() {
  if (accessToken && tokenExpiration && new Date() < tokenExpiration) {
    return accessToken;
  }

  try {
    const response = await fetch(`${GOCARDLESS_API_URL}/token/new/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret_id: SECRET_ID,
        secret_key: SECRET_KEY,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    accessToken = data.access;
    tokenExpiration = new Date(Date.now() + data.access_expires * 1000);

    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error.message);
    throw new Error('Failed to get access token');
  }
}

async function listGocardlessAccounts(requisitionId) {
  try {
    const token = await getAccessToken();
    const response = await fetch(`${GOCARDLESS_API_URL}/requisitions/${requisitionId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to list GoCardless accounts');
    }

    const data = await response.json();
    return data.accounts;
  } catch (error) {
    console.error('Error listing GoCardless accounts:', error.message);
    throw new Error('Failed to list GoCardless accounts');
  }
}

async function getRequisitions(limit = 100, offset = 0) {
  try {
    const token = await getAccessToken();
    const response = await fetch(`${GOCARDLESS_API_URL}/requisitions/?limit=${limit}&offset=${offset}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch requisitions');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching requisitions:', error.message);
    throw new Error('Failed to fetch requisitions');
  }
}

async function getInstitutions(countryCode) {
  try {
    const token = await getAccessToken();
    const response = await fetch(`${GOCARDLESS_API_URL}/institutions/?country=${countryCode}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch institutions');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching institutions:', error.message);
    throw new Error('Failed to fetch institutions');
  }
}

async function createRequisition(institutionId, redirectUrl) {
  try {
    const token = await getAccessToken();
    console.log('request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          redirect: redirectUrl,
          institution_id: institutionId,
          reference: Date.now().toString(),
          user_language: 'EN',
        }),
      })
    const response = await fetch(`${GOCARDLESS_API_URL}/requisitions/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        redirect: redirectUrl,
        institution_id: institutionId,
        reference: Date.now().toString(),
        user_language: 'EN',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create requisition');
    }

    return response.json();
  } catch (error) {
    console.error('Error creating requisition:', error.message);
    throw new Error('Failed to create requisition');
  }
}

async function finalizeRequisition(ref) {
  try {
    const token = await getAccessToken();
    
    // First, we need to get the requisition ID using the reference
    const requisitionsResponse = await fetch(`${GOCARDLESS_API_URL}/requisitions/?reference=${ref}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!requisitionsResponse.ok) {
      throw new Error('Failed to fetch requisition');
    }

    const requisitions = await requisitionsResponse.json();
    if (requisitions.results.length === 0) {
      throw new Error('No requisition found with the given reference');
    }

    const requisitionId = requisitions.results[0].id;

    // Now we can proceed with the finalization
    const response = await fetch(`${GOCARDLESS_API_URL}/requisitions/${requisitionId}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to finalize requisition');
    }

    const requisition = await response.json();

    // Check if the requisition status is LN (linked)
    if (requisition.status !== 'LN') {
      throw new Error('Requisition is not in a linked state');
    }

    // Here you would typically save the account information to your database
    // For now, we'll just return the requisition data
    return requisition;
  } catch (error) {
    console.error('Error finalizing requisition:', error.message);
    throw new Error('Failed to finalize requisition');
  }
}

export { getAccessToken, listGocardlessAccounts, getRequisitions, getInstitutions, createRequisition, finalizeRequisition };