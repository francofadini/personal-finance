import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { createAccountOrchestrator } from '@/backend/use-cases/account/createAccountOrchestrator';
import { getAccountsUseCase } from '@/backend/use-cases/account/getAccountsUseCase';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const { institutionId, ref } = req.body;
      
      // Step 1: Initiate account creation
      if (institutionId && !ref) {
        const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/?institutionId=${institutionId}`;
        const result = await createAccountOrchestrator.initiate(
          session.user.id, 
          institutionId,
          redirectUrl
        );
        return res.status(201).json(result);
      }
      
      // Step 2: Finalize account creation
      if (ref && institutionId) {
        const { savedAccounts, availableAccounts } = await createAccountOrchestrator.finalize(
          session.user.id,
          institutionId,
          ref
        );
        return res.status(200).json({ savedAccounts, availableAccounts });
      }

      return res.status(400).json({ error: 'Invalid request parameters' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const accounts = await getAccountsUseCase(session.user.id);
      res.status(200).json(accounts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
