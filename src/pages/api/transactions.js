import { createTransaction, getTransactions } from '@/backend/use-cases/transactionUseCases';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const transaction = await createTransaction(req.body);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const transactions = await getTransactions();
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
