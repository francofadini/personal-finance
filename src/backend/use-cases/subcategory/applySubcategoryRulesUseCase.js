import Transaction from '@/backend/models/Transaction';

export const applySubcategoryRulesUseCase = async ({ subcategory }) => {
  try {
    if (!subcategory.keywords?.length) {
      return { status: 'skipped', reason: 'no_keywords' };
    }

    // Find uncategorized transactions that match the keywords
    const matchingTransactions = await Transaction.find({
      userId: subcategory.userId,
      categoryId: null,
      description: {
        $regex: subcategory.keywords.join('|'),
        $options: 'i'
      }
    });

    const results = await Promise.all(
      matchingTransactions.map(async (transaction) => {
        try {
          transaction.categoryId = subcategory.categoryId;
          transaction.subcategoryId = subcategory._id;
          await transaction.save();
          return { status: 'categorized', transactionId: transaction._id };
        } catch (error) {
          return { status: 'error', transactionId: transaction._id, error: error.message };
        }
      })
    );

    return {
      total: matchingTransactions.length,
      categorized: results.filter(r => r.status === 'categorized').length,
      errors: results.filter(r => r.status === 'error').length,
      details: results
    };
  } catch (error) {
    throw new Error(`Failed to apply subcategory rules: ${error.message}`);
  }
}; 