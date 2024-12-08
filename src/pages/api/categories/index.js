import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/mongoose';
import { getCategoriesWithBudgetUseCase } from '@/backend/use-cases/category/getCategoriesWithBudgetUseCase';
import { createCategoryUseCase } from '@/backend/use-cases/category/createCategoryUseCase';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await connectToDatabase();

    switch (req.method) {
      case 'GET':
        const categories = await getCategoriesWithBudgetUseCase({
          userId: session.user.id
        });
        return res.status(200).json(categories);

      case 'POST':
        const result = await createCategoryUseCase({
          ...req.body,
          userId: session.user.id
        });
        return res.status(201).json(result);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('❌ Categories API Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 