import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/mongoose';
import { updateSubcategoryUseCase } from '@/backend/use-cases/subcategory/updateSubcategoryUseCase';
import { deleteSubcategoryUseCase } from '@/backend/use-cases/subcategory/deleteSubcategoryUseCase';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { subcategoryId } = req.query;

  try {
    await connectToDatabase();

    switch (req.method) {
      case 'PUT':
        const result = await updateSubcategoryUseCase({
          subcategoryId,
          userId: session.user.id,
          ...req.body
        });
        return res.status(200).json(result);

      case 'DELETE':
        await deleteSubcategoryUseCase({
          subcategoryId,
          userId: session.user.id
        });
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('❌ Subcategory API Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 