import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/mongoose';
import { Category } from '@/backend/models/Category';
import { getRandomColor } from '@/utils/colorsUtils';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await connectToDatabase();

    switch (req.method) {
      case 'GET':
        try {
          const categories = await Category.find({ 
            userId: session.user.id 
          }).sort('order').lean();
          return res.status(200).json(categories);
        } catch (error) {
          console.error('❌ Error fetching categories:', error.message);
          return res.status(500).json({ error: 'Internal server error' });
        }

      case 'POST':
        const color = req.body.color || getRandomColor();
        const newCategory = new Category({
          ...req.body,
          color,
          userId: session.user.id
        });
        await newCategory.save();
        return res.status(201).json(newCategory);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('❌ Categories API Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 