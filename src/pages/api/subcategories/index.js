import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/mongoose';
import { createSubcategoryUseCase } from '@/backend/use-cases/subcategory/createSubcategoryUseCase';
import { Subcategory } from '@/backend/models/Subcategory';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await connectToDatabase();

    switch (req.method) {
      case 'GET':
        const subcategories = await Subcategory.find({ 
          userId: session.user.id ,
          isVisible: true
        }).sort('order').lean();
        return res.status(200).json(subcategories);

      case 'POST':
        const result = await createSubcategoryUseCase({
          ...req.body,
          userId: session.user.id
        });
        return res.status(201).json(result);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('❌ Subcategories API Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 