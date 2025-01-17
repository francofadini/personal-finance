import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/mongoose';
import { Category } from '@/backend/models/Category';
import { updateCategoryUseCase } from '@/backend/use-cases/category/updateCategoryUseCase';
import { deleteCategoryUseCase } from '@/backend/use-cases/category/deleteCategoryUseCase';

export default async function handler(req, res) {
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

    switch (req.method) {
      case 'PUT':
        const result = await updateCategoryUseCase({
          categoryId,
          userId: session.user.id,
          ...req.body
        });
        return res.status(200).json(result);

      case 'DELETE':
        await deleteCategoryUseCase({
          categoryId,
          userId: session.user.id
        });
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('❌ Category API Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 