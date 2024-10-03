import { Transaction } from '../models/Transaction';

export async function createTransaction(transactionData) {
  const transaction = new Transaction(transactionData);
  await transaction.save();
  return transaction;
}

export async function getTransactions() {
  return Transaction.find();
}
