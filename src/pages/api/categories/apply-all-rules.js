import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/mongoose';
import { applyAllCategoryRulesUseCase } from '@/backend/use-cases/category/applyAllCategoryRulesUseCase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await connectToDatabase();
    
    const result = await applyAllCategoryRulesUseCase({
      userId: session.user.id
    });

    return res.status(200).json(result);

  } catch (error) {
    console.error('❌ Apply all rules API Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 