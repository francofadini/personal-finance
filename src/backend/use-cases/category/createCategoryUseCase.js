import mongoose from 'mongoose';
import { Category } from '@/backend/models/Category';
import { Subcategory } from '@/backend/models/Subcategory';
import { getRandomColor } from '@/utils/colorsUtils';

export const createCategoryUseCase = async ({ name, icon, keywords, monthlyBudget, userId }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [category] = await Category.create([{
      name,
      icon,
      userId,
      color: getRandomColor()
    }], { session });

    const [defaultSubcategory] = await Subcategory.create([{
      userId,
      categoryId: category._id,
      name: category.name,
      keywords: keywords || [],
      monthlyBudget: monthlyBudget || 0,
      isDefault: true,
      isVisible: false
    }], { session });

    await session.commitTransaction();
    return { category, defaultSubcategory };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}; 