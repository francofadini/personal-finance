const API_URL = '/api/accounts';

export const fetchAccounts = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch accounts');
  }
  return response.json();
};

export const createAccount = async (institutionId) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ institutionId }),
  });
  if (!response.ok) {
    throw new Error('Failed to create account');
  }
  return response.json();
};

export const deleteAccount = async (accountId) => {
  const response = await fetch(`${API_URL}/${accountId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete account');
  }
};

export const syncAccount = async (accountId) => {
  const response = await fetch(`${API_URL}/${accountId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action: 'sync' }),
  });
  if (!response.ok) {
    throw new Error('Failed to sync account');
  }
  return response.json();
};