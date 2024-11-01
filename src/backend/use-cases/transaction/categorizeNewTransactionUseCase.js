import { Category } from '@/backend/models/Category';
import { RecurrentExpense } from '@/backend/models/RecurrentExpense';

export const categorizeNewTransactionUseCase = async (transaction) => {
  try {
    console.log('🔄 Categorizing new transaction:', transaction._id);
    
    const [categories, recurrentExpenses] = await Promise.all([
      Category.find({ userId: transaction.userId }),
      RecurrentExpense.find({ userId: transaction.userId })
    ]);

    // First try to match with recurrent expenses
    const matchedExpense = recurrentExpenses.find(expense => 
      expense.keywords.some(keyword => 
        transaction.description.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    if (matchedExpense) {
      transaction.categoryId = matchedExpense.categoryId;
      transaction.recurrentExpenseId = matchedExpense._id;
      await transaction.save();
      return {
        status: 'categorized',
        method: 'recurrent',
        expenseId: matchedExpense._id,
        categoryId: matchedExpense.categoryId
      };
    }

    // Then try to match with category keywords
    const matchedCategory = categories.find(category => 
      category.keywords?.some(keyword => 
        transaction.description.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    if (matchedCategory) {
      transaction.categoryId = matchedCategory._id;
      await transaction.save();
      return {
        status: 'categorized',
        method: 'category',
        categoryId: matchedCategory._id
      };
    }

    return { status: 'uncategorized' };

  } catch (error) {
    console.error('❌ Error categorizing transaction:', error);
    throw new Error(`Failed to categorize transaction: ${error.message}`);
  }
}; 