import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/mongoose';
import Transaction from '@/backend/models/Transaction';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { transactionId } = req.query;

  try {
    await connectToDatabase();

    if (req.method === 'DELETE') {
      const transaction = await Transaction.findOne({ 
        _id: transactionId, 
        userId: session.user.id,
        isManual: true // Only allow deleting manual transactions
      });

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found or cannot be deleted' });
      }

      await transaction.deleteOne();
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('❌ Transaction API Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 