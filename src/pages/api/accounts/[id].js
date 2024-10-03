import { getSession } from 'next-auth/react';
import { updateAccount, deleteAccount, syncAccount } from '@/backend/use-cases/accountUseCases';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const account = await updateAccount(id, req.body);
      res.status(200).json(account);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      await deleteAccount(id);
      res.status(204).end();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'POST' && req.body.action === 'sync') {
    try {
      const account = await syncAccount(id);
      res.status(200).json(account);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
