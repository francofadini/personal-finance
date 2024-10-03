import { finalizeRequisition } from '@/backend/services/gocardlessService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ref } = req.body;

  if (!ref) {
    return res.status(400).json({ error: 'Reference ID is required' });
  }

  try {
    const finalizedRequisition = await finalizeRequisition(ref);
    res.status(200).json({ status: 'success', data: finalizedRequisition });
  } catch (error) {
    console.error('Error in finalize requisition endpoint:', error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
}
