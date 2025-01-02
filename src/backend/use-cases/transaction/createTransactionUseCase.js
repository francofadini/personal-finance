import mongoose from 'mongoose';
import Transaction from '@/backend/models/Transaction';
import Account from '@/backend/models/Account';
import { categorizeNewTransactionUseCase } from './categorizeNewTransactionUseCase';

export const createTransactionUseCase = async ({ 
  userId,
  accountId,
  amount,
  currency,
  description,
  note,
  date,
  metadata = {}
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate account exists and belongs to user
    const account = await Account.findOne({ _id: accountId, userId });
    if (!account) {
      throw new Error('Account not found');
    }

    // Create transaction
    const [transaction] = await Transaction.create([{
      userId,
      accountId,
      amount,
      currency,
      description: description?.trim() || 'No description',
      note: note?.trim(),
      date: new Date(date),
      isManual: true,
      metadata
    }], { session });

    // Try to categorize the transaction
    const categorizationResult = await categorizeNewTransactionUseCase(transaction);

    await session.commitTransaction();
    return { 
      transaction,
      categorization: categorizationResult
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}; 