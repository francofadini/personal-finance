import { connectToDatabase } from '@/lib/mongoose';
import Transaction from '@/backend/models/Transaction';
import mongoose from 'mongoose';

async function migrate() {
  try {
    await connectToDatabase();
    console.log('Connected to database');

    const transactions = await Transaction.find({ internalId: { $exists: false } });
    console.log(`Found ${transactions.length} transactions to update`);

    for (const transaction of transactions) {
      transaction.internalId = new mongoose.Types.ObjectId();
      await transaction.save();
      console.log(`Updated transaction ${transaction._id} with internalId ${transaction.internalId}`);
    }

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();