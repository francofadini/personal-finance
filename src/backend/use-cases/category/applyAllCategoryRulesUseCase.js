import { Category } from '@/backend/models/Category';
import { applyCategoryRulesUseCase } from './applyCategoryRulesUseCase';

export const applyAllCategoryRulesUseCase = async ({ userId }) => {
  try {
    // Get all categories for this user
    const categories = await Category.find({ userId });

    const results = await Promise.all(
      categories.map(async (category) => {
        try {
          const result = await applyCategoryRulesUseCase(category);
          return {
            categoryId: category._id,
            name: category.name,
            ...result
          };
        } catch (error) {
          return {
            categoryId: category._id,
            name: category.name,
            status: 'error',
            error: error.message,
            total: 0,
            categorized: 0
          };
        }
      })
    );

    // Calculate overall totals
    const totals = results.reduce((acc, r) => ({
      total: acc.total + (r.total || 0),
      categorized: acc.categorized + (r.categorized || 0)
    }), { total: 0, categorized: 0 });

    return {
      total: totals.total,
      categorized: totals.categorized,
      errors: results.filter(r => r.status === 'error').length,
      results
    };
  } catch (error) {
    throw new Error(`Failed to apply all category rules: ${error.message}`);
  }
}; 