import mongoose from 'mongoose';
import { Category } from '@/backend/models/Category';
import { Subcategory } from '@/backend/models/Subcategory';

export const updateCategoryUseCase = async ({ categoryId, userId, name, icon, keywords, monthlyBudget }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const category = await Category.findOneAndUpdate(
      { _id: categoryId, userId },
      { name, icon },
      { new: true, session }
    );

    if (!category) {
      throw new Error('Category not found');
    }

    const defaultSubcategory = await Subcategory.findOneAndUpdate(
      { categoryId, userId, isDefault: true },
      { name, keywords, monthlyBudget }, // Sync name with category
      { new: true, session }
    );

    await session.commitTransaction();
    return { category, defaultSubcategory };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}; 