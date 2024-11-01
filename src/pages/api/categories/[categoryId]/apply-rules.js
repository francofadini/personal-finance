import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/mongoose';
import { Category } from '@/backend/models/Category';
import { applyNewCategoryRulesUseCase } from '@/backend/use-cases/category/applyNewCategoryRulesUseCase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { categoryId } = req.query;

  try {
    await connectToDatabase();
    
    const category = await Category.findOne({ 
      _id: categoryId,
      userId: session.user.id
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const result = await applyNewCategoryRulesUseCase(category);
    return res.status(200).json(result);

  } catch (error) {
    console.error('Apply rules API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 