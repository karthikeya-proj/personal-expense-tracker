import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { Expense } from '../../types';
import { ArrowUpRight, ArrowDownRight, Trash2, Edit, Filter } from 'lucide-react';

const TransactionList: React.FC = () => {
  const { state, deleteExpense } = useAppContext();
  const { expenses, categories } = state;
  
  const [filter, setFilter] = useState({
    type: 'all',
    category: 'all',
    searchTerm: '',
    sortBy: 'date',
    sortOrder: 'desc' as 'asc' | 'desc'
  });
  
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      deleteExpense(id);
    }
  };
  
  // Filter and sort expenses
  const filteredExpenses = expenses.filter(expense => {
    // Filter by type
    if (filter.type !== 'all' && expense.type !== filter.type) return false;
    
    // Filter by category
    if (filter.category !== 'all' && expense.category !== filter.category) return false;
    
    // Filter by search term
    if (filter.searchTerm && !expense.description.toLowerCase().includes(filter.searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort by selected field
    if (filter.sortBy === 'date') {
      return filter.sortOrder === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (filter.sortBy === 'amount') {
      return filter.sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
    
    // Sort by description
    return filter.sortOrder === 'asc'
      ? a.description.localeCompare(b.description)
      : b.description.localeCompare(a.description);
  });
  
  const uniqueCategories = [...new Set(expenses.map(expense => expense.category))];
  
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>
        <p className="text-gray-600">Manage your income and expenses</p>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search transactions..."
              value={filter.searchTerm}
              onChange={(e) => setFilter({ ...filter, searchTerm: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="all">All Types</option>
              <option value="expense">Expenses</option>
              <option value="income">Income</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={filter.sortBy}
              onChange={(e) => setFilter({ ...filter, sortBy: e.target.value })}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="description">Description</option>
            </select>
          </div>
          
          <div>
            <button
              onClick={() => setFilter({ ...filter, sortOrder: filter.sortOrder === 'asc' ? 'desc' : 'asc' })}
              className="flex items-center gap-1 border border-gray-300 rounded-md p-2 hover:bg-gray-50"
            >
              {filter.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Transaction List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {filteredExpenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left border-b border-gray-200">
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Description</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium text-right">Amount</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map(expense => (
                  <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div 
                        className={`inline-flex items-center p-1 rounded-full ${
                          expense.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                        }`}
                      >
                        {expense.type === 'income' ? (
                          <ArrowUpRight size={16} className="text-green-600" />
                        ) : (
                          <ArrowDownRight size={16} className="text-red-600" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium">{expense.description}</td>
                    <td className="p-4">{expense.category}</td>
                    <td className="p-4">{formatDate(expense.date)}</td>
                    <td className={`p-4 font-medium text-right ${expense.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {expense.type === 'income' ? '+' : '-'}{formatCurrency(expense.amount)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button 
                          className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(expense.id)}
                          className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>No transactions found matching the filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;