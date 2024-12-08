import { Subcategory } from '@/backend/models/Subcategory';
import { RecurrentExpense } from '@/backend/models/RecurrentExpense';

export const categorizeNewTransactionUseCase = async (transaction) => {
  try {
    const [subcategories, recurrentExpenses] = await Promise.all([
      Subcategory.find({ userId: transaction.userId }),
      RecurrentExpense.find({ userId: transaction.userId })
        .populate('subcategoryId', 'categoryId')
    ]);

    // First try recurrent expenses
    const matchedExpense = recurrentExpenses.find(expense => 
      expense.keywords.some(keyword => 
        transaction.description.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    if (matchedExpense) {
      transaction.categoryId = matchedExpense.subcategoryId.categoryId;
      transaction.subcategoryId = matchedExpense.subcategoryId._id;
      transaction.recurrentExpenseId = matchedExpense._id;
      await transaction.save();
      return { 
        status: 'categorized', 
        method: 'recurrent',
        categoryId: matchedExpense.subcategoryId.categoryId,
        subcategoryId: matchedExpense.subcategoryId._id,
        expenseId: matchedExpense._id
      };
    }

    // Then try subcategory keywords
    const matchedSubcategory = subcategories.find(sub => 
      sub.keywords?.some(keyword => 
        transaction.description.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    if (matchedSubcategory) {
      transaction.categoryId = matchedSubcategory.categoryId;
      transaction.subcategoryId = matchedSubcategory._id;
      await transaction.save();
      return { 
        status: 'categorized', 
        method: 'keyword',
        categoryId: matchedSubcategory.categoryId,
        subcategoryId: matchedSubcategory._id
      };
    }

    return { status: 'uncategorized' };
  } catch (error) {
    throw new Error(`Failed to categorize transaction: ${error.message}`);
  }
}; 