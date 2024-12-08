import mongoose from 'mongoose';
import { Subcategory } from '@/backend/models/Subcategory';

export const updateSubcategoryUseCase = async ({ 
  subcategoryId, 
  userId, 
  name, 
  keywords, 
  monthlyBudget 
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const subcategory = await Subcategory.findOneAndUpdate(
      { _id: subcategoryId, userId, isDefault: false }, // Prevent updating default subcategories
      { 
        name,
        keywords,
        monthlyBudget
      },
      { new: true, session }
    );

    if (!subcategory) {
      throw new Error('Subcategory not found or is default');
    }

    await session.commitTransaction();
    return subcategory;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}; 