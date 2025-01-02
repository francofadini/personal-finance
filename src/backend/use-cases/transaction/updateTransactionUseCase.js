import Transaction from '@/backend/models/Transaction';

export const updateTransactionUseCase = async ({
  transactionId,
  userId,
  categoryId,
  subcategoryId,
  ignored
}) => {
  try {
    const updateData = {};
    
    // Only include defined fields in update
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (subcategoryId !== undefined) updateData.subcategoryId = subcategoryId;
    if (ignored !== undefined) updateData.ignored = ignored;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, userId },
      updateData,
      { new: true }
    )
    .populate('categoryId', 'name icon')
    .populate('subcategoryId', 'name');

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return transaction;
  } catch (error) {
    throw new Error(`Failed to update transaction: ${error.message}`);
  }
}; 