import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/mongoose';
import Account from '@/backend/models/Account';
import { fetchGocardlessAccounts } from '@/backend/services/gocardlessService';
import { get } from 'mongoose';

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

    const updatedAccounts = await fetchGocardlessAccounts(account.metadata.requisitionId);
    console.log('✅ Fetched updated accounts:', updatedAccounts);

    account.accounts = updatedAccounts;
    account.lastSyncDate = new Date();
    await account.save();
    
    console.log('✅ Account sync completed');
    res.status(200).json(account);
  } catch (error) {
    console.error('❌ Account sync failed:', error);
    res.status(500).json({ error: 'Failed to sync account' });
  }
} 