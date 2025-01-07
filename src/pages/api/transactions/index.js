import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/mongoose';
import { Category } from '@/backend/models/Category';
import { Subcategory } from '@/backend/models/Subcategory';
import Transaction from '@/backend/models/Transaction';
import { updateTransactionUseCase } from '@/backend/use-cases/transaction/updateTransactionUseCase';
import { createTransactionUseCase } from '@/backend/use-cases/transaction/createTransactionUseCase';

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
      case 'POST':
        return handleCreateTransaction(req, res, session.user.id);
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'POST']);
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
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .exec(),
    Transaction.countDocuments(query).exec()
  ]);

  return res.status(200).json({ 
    transactions, 
    pagination: { 
      page: parseInt(page), 
      limit: parseInt(limit), 
      total 
    } 
  });
}

async function handleUpdateTransaction(req, res, userId) {
  const { transactionId, categoryId, subcategoryId, ignored } = req.body;
  
  if (!transactionId) {
    return res.status(400).json({ error: 'Transaction ID is required' });
  }

  const transaction = await updateTransactionUseCase({
    transactionId,
    userId,
    categoryId,
    subcategoryId,
    ignored
  });

  return res.status(200).json(transaction);
}

async function handleCreateTransaction(req, res, userId) {
  const { accountId, amount, description, date, categoryId, subcategoryId } = req.body;

  try {
    const result = await createTransactionUseCase({
      userId,
      accountId,
      amount: parseFloat(amount),
      currency: 'EUR',
      description,
      date,
      categoryId,
      subcategoryId,
      isManual: true
    });

    return res.status(201).json(result.transaction);
  } catch (error) {
    console.error('❌ Create transaction Error:', error.message);
    return res.status(400).json({ error: error.message });
  }
} 