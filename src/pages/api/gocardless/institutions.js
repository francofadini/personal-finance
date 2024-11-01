import { fetchInstitutions } from '@/backend/services/gocardlessService';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { country } = req.query;

  if (!country) {
    return res.status(400).json({ error: 'Country code is required' });
  }

  try {
    const institutions = await fetchInstitutions(country);
    res.status(200).json(institutions);
  } catch (error) {
    console.error('❌ Error in GoCardless institutions endpoint:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
