import { Expense } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const groupExpensesByCategory = (expenses: Expense[]): Record<string, number> => {
  return expenses.reduce((acc, expense) => {
    if (expense.type === 'expense') {
      const { category, amount } = expense;
      acc[category] = (acc[category] || 0) + amount;
    }
    return acc;
  }, {} as Record<string, number>);
};

export const calculateTotalExpenses = (expenses: Expense[]): number => {
  return expenses
    .filter(expense => expense.type === 'expense')
    .reduce((total, expense) => total + expense.amount, 0);
};

export const calculateTotalIncome = (expenses: Expense[]): number => {
  return expenses
    .filter(expense => expense.type === 'income')
    .reduce((total, expense) => total + expense.amount, 0);
};

export const filterExpensesByMonth = (expenses: Expense[], month: number, year: number): Expense[] => {
  return expenses.filter(expense => {
    const date = new Date(expense.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};