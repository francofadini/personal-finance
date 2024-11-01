import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/mongoose';
import Transaction from '@/backend/models/Transaction';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await connectToDatabase();

    switch (req.method) {
      case 'GET':
        return handleGetTransactions(req, res, session.user.id);
      default:
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('❌ Transactions API Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleGetTransactions(req, res, userId) {
  const { 
    accountId, 
    categoryId, 
    startDate, 
    endDate,
    page = 1,
    limit = 50
  } = req.query;

  const query = { userId };
  
  if (accountId) query.accountId = accountId;
  if (categoryId) query.categoryId = categoryId;
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    Transaction.find(query).skip(skip).limit(limit).exec(),
    Transaction.countDocuments(query).exec()
  ]);

  return res.status(200).json({ transactions, pagination: { page, limit, total } });
} 