import { getAccessToken, listGocardlessAccounts } from '@/backend/services/gocardlessService';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { requisitionId } = req.query;

  if (!requisitionId) {
    return res.status(400).json({ error: 'Requisition ID is required' });
  }

  try {
    // First, get the access token
    await getAccessToken();

    // Then, list the accounts
    const accounts = await listGocardlessAccounts(requisitionId);

    res.status(200).json({ accounts });
  } catch (error) {
    console.error('❌ Error in GoCardless accounts endpoint:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
