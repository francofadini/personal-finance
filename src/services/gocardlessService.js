const API_BASE_URL = 'https://bankaccountdata.gocardless.com/api/v2';
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_GOCARDLESS_ACCESS_TOKEN;

const headers = {
  'Authorization': `Bearer ${ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
};

export const fetchInstitutions = async () => {
  const response = await fetch(`${API_BASE_URL}/institutions/?country=gb`, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch institutions');
  }
  return response.json();
};

export const createRequisition = async (institutionId) => {
  const response = await fetch(`${API_BASE_URL}/requisitions/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      redirect: `${window.location.origin}/callback`,
      institution_id: institutionId,
      reference: Date.now().toString(),
      user_language: 'EN',
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to create requisition');
  }
  return response.json();
};

export const fetchGocardlessAccounts = async (requisitionId) => {
  const response = await fetch(`${API_BASE_URL}/requisitions/${requisitionId}/`, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch GoCardless accounts');
  }
  return response.json();
};
