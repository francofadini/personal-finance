import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/mongoose';
import { Category } from '@/backend/models/Category';
import { applyCategoryRulesUseCase } from '@/backend/use-cases/category/applyCategoryRulesUseCase';

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
    
    const categories = await Category.find({ 
      userId: session.user.id,
    });

    const results = await Promise.all(
      categories.map(async (category) => {
        try {
          const result = await applyCategoryRulesUseCase(category);
          return {
            categoryId: category._id,
            name: category.name,
            ...result
          };
        } catch (error) {
          return {
            categoryId: category._id,
            name: category.name,
            status: 'error',
            error: error.message
          };
        }
      })
    );

    return res.status(200).json({
      total: results.length,
      results
    });

  } catch (error) {
    console.error('❌ Apply all rules API Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 