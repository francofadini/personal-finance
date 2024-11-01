import { getRequisitions, createRequisition, finalizeRequisition } from '@/backend/services/gocardlessService';

export default async function handler(req, res) {
  const { method, query, body } = req;

  switch (method) {
    case 'GET':
      return handleGetRequisitions(req, res);
    case 'POST':
      return handleCreateRequisition(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function handleGetRequisitions(req, res) {
  const { limit, offset } = req.query;

  try {
    const requisitions = await getRequisitions(limit, offset);
    res.status(200).json(requisitions);
  } catch (error) {
    console.error('❌ Error in GoCardless requisitions endpoint:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleCreateRequisition(req, res) {
  const { institutionId } = req.body;

  if (!institutionId) {
    return res.status(400).json({ error: 'Institution ID is required' });
  }

  try {
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/callback`;
    const requisition = await createRequisition(institutionId, redirectUrl);
    res.status(200).json(requisition);
  } catch (error) {
    console.error('❌ Error in create requisition endpoint:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
