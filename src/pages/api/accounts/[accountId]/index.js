import { connectToDatabase, getObjectId } from '@/lib/mongoose';
import Account from '@/backend/models/Account';
import { authOptions } from '../../auth/[...nextauth]';
import { getServerSession } from 'next-auth';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { accountId } = req.query;

  try {
    await connectToDatabase();
    const account = await Account.findOne({ 
      _id: accountId, 
      userId: session.user.id 
    });

    if (!account) {
      console.log('❌ Account not found:', { accountId, userId: session.user.id });
      return res.status(404).json({ error: 'Account not found' });
    }

    if (req.method === 'DELETE') {
      await account.delete();
      return res.status(204).end();
    }

    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('Error handling account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
