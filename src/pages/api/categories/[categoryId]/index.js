import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/mongoose';
import { Category } from '@/backend/models/Category';

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
        // Ensure some keys are not changed
        const { userId, parentId, ...dataToUpdate } = req.body;
        
        const updatedCategory = await Category.findByIdAndUpdate(
          categoryId,
          dataToUpdate,
          { new: true, runValidators: true }
        );
        return res.status(200).json(updatedCategory);

      case 'DELETE':
        // Check if category has children
        const hasChildren = await Category.exists({ parentId: categoryId });
        if (hasChildren) {
          return res.status(400).json({ 
            error: 'Cannot delete category with subcategories' 
          });
        }
        
        await category.delete();
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