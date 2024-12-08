import { Subcategory } from '@/backend/models/Subcategory';
import { applySubcategoryRulesUseCase } from '../subcategory/applySubcategoryRulesUseCase';

export const applyCategoryRulesUseCase = async (category) => {
  try {
    // Get all subcategories for this category
    const subcategories = await Subcategory.find({ 
      categoryId: category._id,
      userId: category.userId
    });

    const results = await Promise.all(
      subcategories.map(async (subcategory) => {
        try {
          const result = await applySubcategoryRulesUseCase({ subcategory });
          return {
            subcategoryId: subcategory._id,
            name: subcategory.name,
            ...result
          };
        } catch (error) {
          return {
            subcategoryId: subcategory._id,
            name: subcategory.name,
            status: 'error',
            error: error.message,
            total: 0,
            categorized: 0
          };
        }
      })
    );

    // Sum up totals and categorized from all subcategories
    const totals = results.reduce((acc, r) => ({
      total: acc.total + (r.total || 0),
      categorized: acc.categorized + (r.categorized || 0)
    }), { total: 0, categorized: 0 });

    return {
      total: totals.total,
      categorized: totals.categorized,
      errors: results.filter(r => r.status === 'error').length,
      details: results
    };
  } catch (error) {
    throw new Error(`Failed to apply category rules: ${error.message}`);
  }
}; 