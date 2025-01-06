import Transaction from '@/backend/models/Transaction';
import { getCategoriesWithBudgetUseCase } from '@/backend/use-cases/category/getCategoriesWithBudgetUseCase';
import dayjs from 'dayjs';

export const getDashboardDataUseCase = async ({ userId }) => {
  // Get current date info
  const now = dayjs();
  const startOfMonth = now.startOf('month');
  const startOfWeek = now.startOf('week');
  
  // Calculate expected progress
  const daysInMonth = now.daysInMonth();
  const daysInWeek = 7;
  const dayOfMonth = now.date();
  const dayOfWeek = now.day();
  
  const expectedMonthlyProgress = (dayOfMonth / daysInMonth) * 100;
  const expectedWeeklyProgress = (dayOfWeek / daysInWeek) * 100;

  // Get categories with their budgets
  const categories = await getCategoriesWithBudgetUseCase({ userId });
  
  // Get all transactions for current month
  const monthlyTransactions = await Transaction.find({
    userId,
    date: { $gte: startOfMonth.toDate() },
    ignored: { $ne: true }
  }).populate('categoryId');

  // Calculate monthly total (only expenses)
  const monthlyTotal = monthlyTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);

  const categorySpending = new Map();

  // Calculate spending by category (only expenses)
  monthlyTransactions
    .filter(t => t.amount < 0)
    .forEach(transaction => {
      if (!transaction.categoryId) return;
      const categoryId = transaction.categoryId._id.toString();
      const currentSpent = categorySpending.get(categoryId) || 0;
      categorySpending.set(
        categoryId, 
        currentSpent + Math.abs(transaction.amount || 0)
      );
    });

  // Calculate top categories by percentage of budget spent
  const topCategories = categories
    .filter(category => category.monthlyBudget > 0)
    .map(category => {
      const spent = categorySpending.get(category._id.toString()) || 0;
      const percentage = (spent / category.monthlyBudget) * 100;
      return {
        _id: category._id,
        name: category.name,
        color: category.color,
        percentage: Math.round(percentage),
        spent,
        budget: category.monthlyBudget
      };
    })
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  // Calculate total budget
  const totalBudget = categories.reduce((sum, cat) => sum + (cat.monthlyBudget || 0), 0);
  const monthlyProgress = totalBudget ? (monthlyTotal / totalBudget) * 100 : 0;
  
  // Calculate weekly metrics (only expenses)
  const weeklyTransactions = monthlyTransactions
    .filter(t => t.amount < 0 && dayjs(t.date).isAfter(startOfWeek));
  const weeklyTotal = weeklyTransactions
    .reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);
  const weeklyBudget = totalBudget / 4; // Assuming 4 weeks per month
  const weeklyProgress = weeklyBudget ? (weeklyTotal / weeklyBudget) * 100 : 0;

  // Calculate days difference
  const monthlyDaysDiff = Math.round((monthlyProgress - expectedMonthlyProgress) * daysInMonth / 100);
  const weeklyDaysDiff = Math.round((weeklyProgress - expectedWeeklyProgress) * daysInWeek / 100);

  return {
    monthlyTotal,
    monthlyProgress: Math.round(monthlyProgress),
    monthlyDaysDiff,
    weeklyProgress: Math.round(weeklyProgress),
    weeklyDaysDiff,
    expectedMonthlyProgress: Math.round(expectedMonthlyProgress),
    expectedWeeklyProgress: Math.round(expectedWeeklyProgress),
    topCategories
  };
}; 