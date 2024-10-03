import Account from '../models/Account';
import { connectToDatabase } from '@/lib/mongodb';
import { fetchGocardlessAccounts, createRequisition } from '@/services/gocardlessService';

export async function createAccount(userId, institutionId, requisitionId) {
  await connectToDatabase();
  const gocardlessAccounts = await fetchGocardlessAccounts(requisitionId);
  
  const account = new Account({
    userId,
    name: gocardlessAccounts[0].institution.name,
    institution: institutionId,
    gocardlessAccounts: gocardlessAccounts.map(acc => ({
      id: acc.id,
      name: acc.name,
      balance: acc.balance.amount,
      currency: acc.balance.currency,
      accountType: acc.account_type,
    })),
    lastSyncDate: new Date(),
  });

  await account.save();
  return account;
}

export async function getAccounts(userId) {
  await connectToDatabase();
  return Account.find({ userId, visible: true });
}

export async function updateAccount(accountId, updateData) {
  await connectToDatabase();
  const account = await Account.findByIdAndUpdate(accountId, updateData, { new: true });
  if (!account) {
    throw new Error('Account not found');
  }
  return account;
}

export async function deleteAccount(accountId) {
  await connectToDatabase();
  const account = await Account.findByIdAndUpdate(accountId, { visible: false }, { new: true });
  if (!account) {
    throw new Error('Account not found');
  }
  return account;
}

export async function syncAccount(accountId) {
  await connectToDatabase();
  const account = await Account.findById(accountId);
  if (!account) {
    throw new Error('Account not found');
  }

  const gocardlessAccounts = await fetchGocardlessAccounts(account.institution);
  account.gocardlessAccounts = gocardlessAccounts.map(acc => ({
    id: acc.id,
    name: acc.name,
    balance: acc.balance.amount,
    currency: acc.balance.currency,
    accountType: acc.account_type,
  }));
  account.lastSyncDate = new Date();

  await account.save();
  return account;
}
