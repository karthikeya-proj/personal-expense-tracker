import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency } from '../../utils/helpers';
import { Wallet, TrendingDown, AlertTriangle } from 'lucide-react';

const BudgetList: React.FC = () => {
  const { state, addBudget } = useAppContext();
  const { budgets, expenses, categories } = state;
  const [isAddingBudget, setIsAddingBudget] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: categories[0]?.name || '',
    amount: '',
    period: 'monthly' as const
  });
  
  // Filter for current month
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const currentMonthExpenses = expenses.filter(expense => {
    const date = new Date(expense.date);
    return date.getMonth() === currentMonth && 
           date.getFullYear() === currentYear && 
           expense.type === 'expense';
  });
  
  // Calculate spending by category
  const spendingByCategory = currentMonthExpenses.reduce((acc, expense) => {
    const { category, amount } = expense;
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBudget.amount || !newBudget.category) {
      alert('Please fill in all fields');
      return;
    }

    addBudget({
      category: newBudget.category,
      amount: parseFloat(newBudget.amount),
      period: newBudget.period
    });

    setNewBudget({
      category: categories[0]?.name || '',
      amount: '',
      period: 'monthly'
    });
    setIsAddingBudget(false);
  };
  
  if (budgets.length === 0) {
    return (
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Budgets</h2>
          <p className="text-gray-600">Track your spending limits</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100 text-center">
          <Wallet size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No budgets yet</h3>
          <p className="text-gray-600 mb-4">Create a budget to track your spending against your limits</p>
          <button 
            onClick={() => setIsAddingBudget(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Create your first budget
          </button>
        </div>

        {isAddingBudget && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <h3 className="text-lg font-bold mb-4">Create New Budget</h3>
              <form onSubmit={handleAddBudget}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newBudget.category}
                    onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    {categories
                      .filter(category => category.name !== 'Salary')
                      .map(category => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))
                    }
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newBudget.amount}
                    onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Period
                  </label>
                  <select
                    value={newBudget.period}
                    onChange={(e) => setNewBudget({ ...newBudget, period: e.target.value as 'monthly' })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingBudget(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create Budget
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Budgets</h2>
        <p className="text-gray-600">Track your spending limits</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {categories
          .filter(category => category.name !== 'Salary')
          .map(category => {
            const budget = budgets.find(b => b.category === category.name);
            const spent = spendingByCategory[category.name] || 0;
            const budgetAmount = budget?.amount || 0;
            const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;
            
            let statusColor = 'bg-green-600';
            if (percentage > 90) statusColor = 'bg-red-600';
            else if (percentage > 75) statusColor = 'bg-amber-500';
            else if (percentage > 50) statusColor = 'bg-blue-600';
            
            return (
              <div key={category.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <div className="flex items-center mb-3">
                  <div
                    className="p-2 rounded-full mr-3"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <TrendingDown size={20} style={{ color: category.color }} />
                  </div>
                  <h3 className="font-bold text-gray-800">{category.name}</h3>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">
                      Spent: {formatCurrency(spent)}
                    </span>
                    <span className="font-medium">
                      {budgetAmount > 0 ? `${percentage.toFixed(0)}%` : 'No budget'}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${statusColor} transition-all duration-500`}
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Budget</p>
                    <p className="font-bold text-gray-800">
                      {budgetAmount > 0 ? formatCurrency(budgetAmount) : 'Not set'}
                    </p>
                  </div>
                  
                  {percentage > 90 && budgetAmount > 0 && (
                    <div className="bg-red-100 p-2 rounded-full">
                      <AlertTriangle size={18} className="text-red-600" />
                    </div>
                  )}
                  
                  {budgetAmount === 0 && (
                    <button 
                      onClick={() => {
                        setNewBudget({
                          category: category.name,
                          amount: '',
                          period: 'monthly'
                        });
                        setIsAddingBudget(true);
                      }}
                      className="text-sm text-blue-600 font-medium"
                    >
                      Set Budget
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>
      
      <div className="flex justify-end mb-6">
        <button 
          onClick={() => {
            setNewBudget({
              category: categories[0]?.name || '',
              amount: '',
              period: 'monthly'
            });
            setIsAddingBudget(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium flex items-center hover:bg-blue-700 transition-colors"
        >
          <Wallet size={18} className="mr-2" />
          Add New Budget
        </button>
      </div>

      {isAddingBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">Create New Budget</h3>
            <form onSubmit={handleAddBudget}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  {categories
                    .filter(category => category.name !== 'Salary')
                    .map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))
                  }
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newBudget.amount}
                  onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Period
                </label>
                <select
                  value={newBudget.period}
                  onChange={(e) => setNewBudget({ ...newBudget, period: e.target.value as 'monthly' })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingBudget(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetList;