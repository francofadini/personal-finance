import { Category } from '@/backend/models/Category';
import { Subcategory } from '@/backend/models/Subcategory';

export const getCategoryUseCase = async ({ categoryId }) => {
  try {
    // Get all categories
    const category = await Category.findById(categoryId).lean();

    // Get all subcategories for this user
    const subcategories = await Subcategory.find({ 
      parentId: categoryId 
    }).lean();

      const totalBudget = subcategories.reduce(
        (sum, sub) => sum + (sub.monthlyBudget || 0), 
        0
      );
      const defaultSubcategory = subcategories.find(sub => sub.isDefault);

      return {
        ...category,
        defaultSubcategoryId: defaultSubcategory?._id,
        keywords: defaultSubcategory?.keywords || [],
        monthlyBudget: totalBudget,
        subcategories: subcategories.filter(sub => sub.isVisible)
      }; 

  } catch (error) {
    console.error('❌ Error in getCategoryUseCase:', error);
    throw error;
  }
}; 