import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/mongoose';
import Account from '@/backend/models/Account';
import { fetchAccountBalance } from '@/backend/services/gocardlessService';
import { syncTransactions } from '@/backend/services/gocardlessService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('🔄 Starting account sync:', req.query.accountId);
    await connectToDatabase();
    
    const account = await Account.findOne({ 
      _id: req.query.accountId,
      userId: session.user.id 
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const balanceResult = await fetchAccountBalance(account);
    const transactionsResult = await syncTransactions(account);

    if(balanceResult.status != 'error' || transactionsResult.status != 'error') {
      console.log('✅ Account sync completed');
      res.status(200).json(account);
    } else if (balanceResult.status == 'error' || transactionsResult.status == 'error') {
      console.error('❌ Account sync failed');
      res.status(409).json({ error: 'Failed to sync account' });
    } else {
      console.log('✅ Account sync partially completed');
      res.status(200).json(account);
    }
  } catch (error) {
    console.error('❌ Account sync failed');
    res.status(500).json({ error: 'Failed to sync account' });
  }
} 