import mongoose from 'mongoose';
import { Subcategory } from '@/backend/models/Subcategory';
import Transaction from '@/backend/models/Transaction';

export const deleteSubcategoryUseCase = async ({ subcategoryId, userId }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const subcategory = await Subcategory.findOne({ 
      _id: subcategoryId, 
      userId,
      isDefault: false // Prevent deleting default subcategories
    });
    
    if (!subcategory) {
      throw new Error('Subcategory not found or is default');
    }

    const hasTransactions = await Transaction.exists({ subcategoryId });
    if (hasTransactions) {
      throw new Error('Cannot delete subcategory with existing transactions');
    }

    await Subcategory.deleteOne({ _id: subcategoryId, userId }, { session });

    await session.commitTransaction();
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}; 