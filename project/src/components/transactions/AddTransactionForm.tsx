import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { PlusCircle, X } from 'lucide-react';

interface AddTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ isOpen, onClose }) => {
  const { state, addExpense } = useAppContext();
  const { categories } = state;
  
  const [form, setForm] = useState({
    amount: '',
    category: categories[0]?.name || '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense' as 'expense' | 'income'
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.amount || !form.category || !form.description || !form.date) {
      alert('Please fill all required fields');
      return;
    }
    
    addExpense({
      amount: parseFloat(form.amount),
      category: form.category,
      description: form.description,
      date: form.date,
      type: form.type
    });
    
    // Reset form
    setForm({
      amount: '',
      category: categories[0]?.name || '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      type: 'expense'
    });
    
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold">Add Transaction</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Type
            </label>
            <div className="flex rounded-md overflow-hidden border border-gray-300">
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'expense' })}
                className={`flex-1 py-2 ${
                  form.type === 'expense' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'income' })}
                className={`flex-1 py-2 ${
                  form.type === 'income' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Income
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="amount">
              Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="number"
                id="amount"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="block w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="" disabled>Select a category</option>
              {categories
                .filter(category => {
                  if (form.type === 'income') {
                    return category.name === 'Salary'; // Only show income categories
                  }
                  return category.name !== 'Salary'; // Don't show income categories for expenses
                })
                .map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))
              }
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
              Description
            </label>
            <input
              type="text"
              id="description"
              placeholder="What was this transaction for?"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="date">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md text-white flex items-center ${
                form.type === 'expense' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              <PlusCircle size={18} className="mr-2" />
              Add {form.type === 'expense' ? 'Expense' : 'Income'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionForm;