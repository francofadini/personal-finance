import mongoose from 'mongoose';
import { Category } from '@/backend/models/Category';
import { Subcategory } from '@/backend/models/Subcategory';
import Transaction from '@/backend/models/Transaction';

export const deleteCategoryUseCase = async ({ categoryId, userId }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const category = await Category.findOne({ _id: categoryId, userId });
    if (!category) {
      throw new Error('Category not found');
    }

    const hasTransactions = await Transaction.exists({ categoryId });
    if (hasTransactions) {
      throw new Error('Cannot delete category with existing transactions');
    }

    await Subcategory.deleteMany({ categoryId, userId }, { session });
    await Category.deleteOne({ _id: categoryId, userId }, { session });

    await session.commitTransaction();
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}; 