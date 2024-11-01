import Transaction from '@/backend/models/Transaction';

export const applyNewCategoryRulesUseCase = async (category) => {
  try {
    console.log('🔄 Applying new category rules:', category._id);
    
    if (!category.keywords?.length) {
      return { status: 'skipped', reason: 'no_keywords' };
    }

    // Find uncategorized transactions that match the keywords
    const matchingTransactions = await Transaction.find({
      userId: category.userId,
      categoryId: null,
      description: {
        $regex: category.keywords.join('|'),
        $options: 'i'
      }
    });

    // Apply category to matching transactions
    const results = await Promise.all(
      matchingTransactions.map(async (transaction) => {
        try {
          transaction.categoryId = category._id;
          await transaction.save();
          return {
            status: 'categorized',
            transactionId: transaction._id
          };
        } catch (error) {
          console.error('Error updating transaction:', transaction._id, error);
          return {
            status: 'error',
            transactionId: transaction._id,
            error: error.message
          };
        }
      })
    );

    const summary = {
      total: matchingTransactions.length,
      categorized: results.filter(r => r.status === 'categorized').length,
      errors: results.filter(r => r.status === 'error').length,
      details: results
    };

    console.log('✅ Category rules applied:', summary);
    return summary;

  } catch (error) {
    console.error('❌ Error applying category rules:', error);
    throw new Error(`Failed to apply category rules: ${error.message}`);
  }
}; 