import Transaction from '@/backend/models/Transaction';

export const updateTransactionCategoryUseCase = async ({
  transactionId,
  userId,
  categoryId,
  subcategoryId
}) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, userId },
      { 
        categoryId,
        subcategoryId,
        recurrentExpenseId: null // Clear any previous recurrent expense
      },
      { new: true }
    )
    .populate('categoryId', 'name icon')
    .populate('subcategoryId', 'name');

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return transaction;
  } catch (error) {
    throw new Error(`Failed to update transaction category: ${error.message}`);
  }
}; 