import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/mongoose';
import { getDashboardDataUseCase } from '@/backend/use-cases/dashboard/getDashboardDataUseCase';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await connectToDatabase();
    const dashboardData = await getDashboardDataUseCase({ userId: session.user.id });
    return res.status(200).json(dashboardData);
  } catch (error) {
    console.error('❌ Dashboard API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 