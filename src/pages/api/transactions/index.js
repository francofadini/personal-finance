import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/mongoose';
import Transaction from '@/backend/models/Transaction';
import { updateTransactionCategoryUseCase } from '@/backend/use-cases/transaction/updateTransactionCategoryUseCase';

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
      case 'PUT':
        return handleUpdateTransaction(req, res, session.user.id);
      default:
        res.setHeader('Allow', ['GET', 'PUT']);
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
    subcategoryId,
    startDate, 
    endDate,
    page = 1,
    limit = 50
  } = req.query;

  const query = { userId };
  console.log(startDate, endDate);
  
  if (accountId) query.accountId = accountId;
  if (categoryId) query.categoryId = categoryId;
  if (subcategoryId) query.subcategoryId = subcategoryId;
  if (startDate || endDate) {
    query.date = {};
  }
  if (startDate) query.date.$gte = new Date(startDate);
  if (endDate) query.date.$lte = new Date(endDate);

  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    Transaction.find(query)
      .populate('categoryId', 'name icon')
      .populate('subcategoryId', 'name')
      .skip(skip)
      .limit(limit)
      .exec(),
    Transaction.countDocuments(query).exec()
  ]);

  return res.status(200).json({ transactions, pagination: { page, limit, total } });
}

async function handleUpdateTransaction(req, res, userId) {
  const { transactionId, categoryId, subcategoryId } = req.body;
  
  if (!transactionId) {
    return res.status(400).json({ error: 'Transaction ID is required' });
  }

  const transaction = await updateTransactionCategoryUseCase({
    transactionId,
    userId,
    categoryId,
    subcategoryId
  });

  return res.status(200).json(transaction);
} 