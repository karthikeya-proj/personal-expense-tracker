import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { calculateTotalExpenses, calculateTotalIncome, groupExpensesByCategory, formatCurrency } from '../../utils/helpers';
import { ArrowDownIcon, ArrowUpIcon, TrendingUp, DollarSign, CreditCard, Calendar } from 'lucide-react';
import RecentTransactions from './RecentTransactions';
import ExpenseChart from './ExpenseChart';

const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const { expenses, categories } = state;
  
  // Filter for current month
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  const filteredExpenses = expenses.filter(expense => {
    const date = new Date(expense.date);
    return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
  });
  
  const totalExpenses = calculateTotalExpenses(filteredExpenses);
  const totalIncome = calculateTotalIncome(filteredExpenses);
  const balance = totalIncome - totalExpenses;
  
  const expensesByCategory = groupExpensesByCategory(filteredExpenses);
  
  // Calculate month-over-month change
  const lastMonthDate = new Date(selectedYear, selectedMonth - 1);
  const lastMonthExpenses = expenses.filter(expense => {
    const date = new Date(expense.date);
    return date.getMonth() === lastMonthDate.getMonth() && 
           date.getFullYear() === lastMonthDate.getFullYear() && 
           expense.type === 'expense';
  });
  
  const lastMonthTotal = lastMonthExpenses.reduce((total, expense) => total + expense.amount, 0);
  const expenseChange = lastMonthTotal ? ((totalExpenses - lastMonthTotal) / lastMonthTotal) * 100 : 0;
  
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-600">Overview of your financial situation</p>
      </div>
      
      {/* Date selector */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <Calendar size={20} className="text-gray-500" />
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="border border-gray-300 rounded-md p-2"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="border border-gray-300 rounded-md p-2"
          >
            {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Current Balance</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(balance)}
              </p>
            </div>
            <div className={`p-2 rounded-full ${balance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <DollarSign size={20} className={balance >= 0 ? 'text-green-600' : 'text-red-600'} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Income</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <ArrowUpIcon size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="bg-red-100 p-2 rounded-full">
              <ArrowDownIcon size={20} className="text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">vs. Last Month</p>
              <p className={`text-2xl font-bold ${expenseChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {expenseChange > 0 ? '+' : ''}{expenseChange.toFixed(1)}%
              </p>
            </div>
            <div className={`p-2 rounded-full ${expenseChange > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
              <TrendingUp size={20} className={expenseChange > 0 ? 'text-red-600' : 'text-green-600'} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Spending by Category</h3>
          <ExpenseChart expenses={filteredExpenses} categories={categories} />
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Recent Transactions</h3>
          <RecentTransactions expenses={expenses.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;