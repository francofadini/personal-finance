import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/mongoose';
import { RecurrentExpense } from '@/backend/models/RecurrentExpense';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { expenseId } = req.query;

  try {
    await connectToDatabase();
    const expense = await RecurrentExpense.findOne({ 
      _id: expenseId, 
      userId: session.user.id 
    });

    if (!expense) {
      return res.status(404).json({ error: 'Recurrent expense not found' });
    }

    switch (req.method) {
      case 'PUT':
        const updatedExpense = await RecurrentExpense.findByIdAndUpdate(
          expenseId,
          { ...req.body, userId: session.user.id },
          { new: true, runValidators: true }
        ).populate('categoryId', 'name icon color');
        
        return res.status(200).json(updatedExpense);

      case 'DELETE':
        await expense.delete();
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('❌ Recurrent Expense API Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 