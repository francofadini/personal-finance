import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import {Category } from '@/backend/models/Category';
import { Subcategory } from '@/backend/models/Subcategory';
import  Transaction from '@/backend/models/Transaction';
import { createCategoryUseCase } from '../category/createCategoryUseCase';
import { updateCategoryUseCase } from '../category/updateCategoryUseCase';
import { deleteCategoryUseCase } from '../category/deleteCategoryUseCase';
import { createTransactionUseCase } from '../transaction/createTransactionUseCase';
import { createAccountUseCase } from '../account/createAccountUseCase';

// Add this at the top of your test file
jest.mock('@/lib/mongoose', () => ({
  connectToDatabase: jest.fn(),
}));

let mongoServer;
const userId = new mongoose.Types.ObjectId();
let testAccount;

beforeAll(async () => {
  mongoServer = await MongoMemoryReplSet.create({ 
    // replica set for transactions
    replSet: { count: 1, storageEngine: 'wiredTiger' }
  });
  
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Promise.all([
    Category.deleteMany({}),
    Subcategory.deleteMany({}),
    Transaction.deleteMany({})
  ]);
  
  testAccount = await createAccountUseCase({
    userId,
    name: 'Test Account',
    balance: 1000,
    currency: 'EUR',
    identifier: 'TEST123',
    institutionName: 'Test Institution',
    institutionLogo: 'https://example.com/logo.png'
  });
});

describe('Category Use Cases', () => {
  describe('createCategoryUseCase', () => {
    it('should create a basic category with default subcategory', async () => {
      const result = await createCategoryUseCase({
        name: 'Food',
        icon: '🍔',
        userId
      });

      expect(result.category).toMatchObject({
        name: 'Food',
        icon: '🍔',
        userId
      });

      expect(result.defaultSubcategory).toMatchObject({
        name: 'Food',
        isDefault: true,
        isVisible: false,
        userId,
        categoryId: result.category._id
      });
    });
  });

  describe('updateCategoryUseCase', () => {
    it('should update category and its default subcategory name', async () => {
      const { category } = await createCategoryUseCase({
        name: 'Food',
        icon: '🍔',
        userId
      });

      const result = await updateCategoryUseCase({
        categoryId: category._id,
        name: 'Groceries',
        icon: '🛒',
        userId
      });

      expect(result.category.name).toBe('Groceries');
      expect(result.category.icon).toBe('🛒');
      expect(result.defaultSubcategory.name).toBe('Groceries');
    });
  });

  describe('deleteCategoryUseCase', () => {
    it('should delete category and all its subcategories', async () => {
      const { category } = await createCategoryUseCase({
        name: 'Food',
        icon: '🍔',
        userId
      });

      await deleteCategoryUseCase({
        categoryId: category._id,
        userId
      });

      const categoryExists = await Category.exists({ _id: category._id });
      const subcategoryExists = await Subcategory.exists({ categoryId: category._id });

      expect(categoryExists).toBeFalsy();
      expect(subcategoryExists).toBeFalsy();
    });

    it('should not delete category with transactions', async () => {
      const { category } = await createCategoryUseCase({
        name: 'Food',
        icon: '🍔',
        userId,
        keywords: ['groceries']
      });

      const { transaction } = await createTransactionUseCase({
        userId,
        accountId: testAccount._id,
        amount: -50,
        currency: 'EUR',
        description: 'Groceries',
        date: new Date()
      });

      expect(transaction.categoryId.equals(category._id)).toBe(true);

      await expect(
        deleteCategoryUseCase({
          categoryId: category._id,
          userId
        })
      ).rejects.toThrow('Cannot delete category with existing transactions');
    });
  });
}); 