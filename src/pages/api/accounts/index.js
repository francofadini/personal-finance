import { getSession } from 'next-auth/react';
import { createAccount, getAccounts } from '@/backend/use-cases/accountUseCases';
import { createRequisition } from '@/services/gocardlessService';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const { institutionId } = req.body;
      const requisition = await createRequisition(institutionId);
      const account = await createAccount(session.user.id, institutionId, requisition.id);
      res.status(201).json({ account, requisitionId: requisition.id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const accounts = await getAccounts(session.user.id);
      res.status(200).json(accounts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
