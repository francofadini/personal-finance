import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { Category } from '@/backend/models/Category';
import { Subcategory } from '@/backend/models/Subcategory';
import Transaction from '@/backend/models/Transaction';
import { createCategoryUseCase } from '../category/createCategoryUseCase';
import { createSubcategoryUseCase } from '../subcategory/createSubcategoryUseCase';
import { updateSubcategoryUseCase } from '../subcategory/updateSubcategoryUseCase';
import { deleteSubcategoryUseCase } from '../subcategory/deleteSubcategoryUseCase';
import { createAccountUseCase } from '../account/createAccountUseCase';
import { createTransactionUseCase } from '../transaction/createTransactionUseCase';

jest.mock('@/lib/mongoose', () => ({
  connectToDatabase: jest.fn(),
}));

let mongoServer;
const userId = new mongoose.Types.ObjectId();
let testCategory;
let testAccount;

// Helper function for cleaner code
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

beforeAll(async () => {
  mongoServer = await MongoMemoryReplSet.create({ 
    // replica set for transactions
    replSet: { count: 1, storageEngine: 'wiredTiger' }
  });
  await mongoose.connect(mongoServer.getUri());
  await wait(1000); // Give MongoDB time to settle
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

  const { category } = await createCategoryUseCase({
    name: 'Food',
    icon: '🍔',
    userId
  });
  testCategory = category;

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

describe('Subcategory Use Cases', () => {
  describe('createSubcategoryUseCase', () => {
    it('should create a subcategory', async () => {
      const result = await createSubcategoryUseCase({
        name: 'Restaurants',
        categoryId: testCategory._id,
        userId,
        keywords: ['restaurant', 'dining']
      });

      expect(result).toMatchObject({
        name: 'Restaurants',
        categoryId: testCategory._id,
        userId,
        keywords: ['restaurant', 'dining'],
        isDefault: false,
        isVisible: true
      });
    });
  });

  describe('updateSubcategoryUseCase', () => {
    it('should update subcategory details', async () => {
      const subcategory = await createSubcategoryUseCase({
        name: 'Restaurants',
        categoryId: testCategory._id,
        userId
      });

      const updated = await updateSubcategoryUseCase({
        subcategoryId: subcategory._id,
        name: 'Dining Out',
        keywords: ['restaurant', 'cafe'],
        userId
      });

      expect(updated.name).toBe('Dining Out');
      expect(updated.keywords).toEqual(['restaurant', 'cafe']);
    });

    it('should not update default subcategory name', async () => {
      const defaultSub = await Subcategory.findOne({ 
        categoryId: testCategory._id,
        isDefault: true 
      });

      await expect(
        updateSubcategoryUseCase({
          subcategoryId: defaultSub._id,
          name: 'New Name',
          userId
        })
      ).rejects.toThrow('Subcategory not found or is default');
    });
  });

  describe('deleteSubcategoryUseCase', () => {
    it('should delete subcategory', async () => {
      const subcategory = await createSubcategoryUseCase({
        name: 'Restaurants',
        categoryId: testCategory._id,
        userId
      });

      await deleteSubcategoryUseCase({
        subcategoryId: subcategory._id,
        userId
      });

      const exists = await Subcategory.exists({ _id: subcategory._id });
      expect(exists).toBeFalsy();
    });

    it('should not delete default subcategory', async () => {
      const defaultSub = await Subcategory.findOne({ 
        categoryId: testCategory._id,
        isDefault: true 
      });

      await expect(
        deleteSubcategoryUseCase({
          subcategoryId: defaultSub._id,
          userId
        })
      ).rejects.toThrow('Subcategory not found or is default');
    });

    it('should not delete subcategory with transactions', async () => {
      const subcategory = await createSubcategoryUseCase({
        name: 'Restaurants',
        categoryId: testCategory._id,
        userId,
        keywords: ['restaurant']
      });

      const { transaction } = await createTransactionUseCase({
        userId,
        accountId: testAccount._id,
        amount: -50,
        currency: 'EUR',
        description: 'Restaurant dinner',
        date: new Date()
      });

      expect(transaction.subcategoryId.equals(subcategory._id)).toBe(true);

      await expect(
        deleteSubcategoryUseCase({
          subcategoryId: subcategory._id,
          userId
        })
      ).rejects.toThrow('Cannot delete subcategory with existing transactions');
    });
  });
}); 