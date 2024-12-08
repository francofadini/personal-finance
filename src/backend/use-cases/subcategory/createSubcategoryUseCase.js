import mongoose from 'mongoose';
import { Category } from '@/backend/models/Category';
import { Subcategory } from '@/backend/models/Subcategory';

export const createSubcategoryUseCase = async ({ 
  categoryId, 
  userId, 
  name, 
  keywords = [], 
  monthlyBudget = 0 
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const category = await Category.findOne({ _id: categoryId, userId });
    if (!category) {
      throw new Error('Category not found');
    }

    const [subcategory] = await Subcategory.create([{
      userId,
      categoryId,
      name,
      keywords,
      monthlyBudget,
      isDefault: false,
      isVisible: true
    }], { session });

    await session.commitTransaction();
    return subcategory;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}; 