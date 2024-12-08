import { Category } from '@/backend/models/Category';
import { Subcategory } from '@/backend/models/Subcategory';

export const getCategoriesWithBudgetUseCase = async ({ userId }) => {
  try {
    // Get all categories
    const categories = await Category.find({ 
      userId 
    }).lean();

    // Get all subcategories for this user
    const subcategories = await Subcategory.find({ 
      userId 
    }).lean();

    // Calculate totals and structure response
    const categoriesWithBudget = categories.map(category => {
      const categorySubcategories = subcategories.filter(
        sub => sub.categoryId.toString() === category._id.toString()
      );

      const totalBudget = categorySubcategories.reduce(
        (sum, sub) => sum + (sub.monthlyBudget || 0), 
        0
      );
      const defaultSubcategory = categorySubcategories.find(sub => sub.isDefault);

      return {
        ...category,
        keywords: defaultSubcategory?.keywords || [],
        monthlyBudget: totalBudget,
        subcategories: categorySubcategories.filter(sub => sub.isVisible)
      };
    });

    // Sort by order if exists, then by name
    return categoriesWithBudget.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return a.name.localeCompare(b.name);
    });

  } catch (error) {
    console.error('❌ Error in getCategoriesWithBudgetUseCase:', error);
    throw error;
  }
}; 