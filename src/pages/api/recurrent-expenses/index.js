import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/mongoose';
import { RecurrentExpense } from '@/backend/models/RecurrentExpense';
import { getCategoryUseCase } from '@/backend/use-cases/category/getCategory';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await connectToDatabase();

    switch (req.method) {
      case 'GET':
        const expenses = await RecurrentExpense.find({ userId: session.user.id })
          .populate('categoryId', 'name icon color')
          .populate('subcategoryId', 'name')
          .sort('name')
          .lean();
        return res.status(200).json(expenses);

      case 'POST':
        if (req.body.subcategoryId && !req.body.categoryId) {
          return res.status(400).json({ 
            error: 'Cannot assign subcategory without category' 
          });
        }

        if (req.body.categoryId && !req.body.subcategoryId) {
          const category = await getCategoryUseCase({ categoryId: req.body.categoryId });
          if (!category) {
            return res.status(404).json({ error: 'Category not found' });
          }
          req.body.subcategoryId = category.defaultSubcategoryId;
        }

        const newExpense = new RecurrentExpense({
          ...req.body,
          userId: session.user.id
        });
        
        await newExpense.save();
        
        const populatedExpense = await RecurrentExpense.findById(newExpense._id)
          .populate('categoryId', 'name icon color')
          .populate('subcategoryId', 'name');
          
        return res.status(201).json(populatedExpense);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('❌ Recurrent Expenses API Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 