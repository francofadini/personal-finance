const API_URL = '/api/accounts';

const fetchWithAuth = (url, options = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};

export const fetchAccounts = async () => {
  const response = await fetchWithAuth(API_URL);
  if (!response.ok) throw new Error('Failed to fetch accounts');
  return response.json();
};

export const createAccount = async (institutionId) => {
  const response = await fetchWithAuth(API_URL, {
    method: 'POST',
    body: JSON.stringify({ institutionId }),
  });
  if (!response.ok) throw new Error('Failed to create account');
  return response.json();
};

export const finalizeAccount = async (ref, institutionId) => {
  const response = await fetch('/api/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ref, institutionId }),
  });
  if (!response.ok) throw new Error('Failed to finalize account');
  return response.json();
};

export const deleteAccount = async (accountId) => {
  const response = await fetch(`${API_URL}/${accountId}`, {
    method: 'DELETE',
  });
  if (response.status !== 204) {
    throw new Error('Failed to delete account');
  }
  return response.json();
};

export const syncAccount = async (accountId) => {
  const response = await fetch(`${API_URL}/${accountId}/sync`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to sync account');
  }
  return response.json();
};