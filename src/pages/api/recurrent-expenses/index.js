import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/mongoose';
import { RecurrentExpense } from '@/backend/models/RecurrentExpense';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await connectToDatabase();

    switch (req.method) {
      case 'GET':
        const expenses = await RecurrentExpense.find({ userId: session.user.id })
          .populate('categoryId', 'name icon color')
          .sort('name')
          .lean();
        return res.status(200).json(expenses);

      case 'POST':
        const newExpense = new RecurrentExpense({
          ...req.body,
          userId: session.user.id
        });
        await newExpense.save();
        return res.status(201).json(newExpense);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('❌ Recurrent Expenses API Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 