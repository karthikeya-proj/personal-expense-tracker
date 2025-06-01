import React from 'react';
import { Expense } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface RecentTransactionsProps {
  expenses: Expense[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ expenses }) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No transactions to display
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map(expense => (
          <div key={expense.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div 
              className={`p-2 rounded-full mr-3 ${
                expense.type === 'income' ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              {expense.type === 'income' ? (
                <ArrowUpRight size={16} className="text-green-600" />
              ) : (
                <ArrowDownRight size={16} className="text-red-600" />
              )}
            </div>
            
            <div className="flex-1">
              <p className="font-medium">{expense.description}</p>
              <p className="text-sm text-gray-500">{expense.category} • {formatDate(expense.date)}</p>
            </div>
            
            <div className={expense.type === 'income' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
              {expense.type === 'income' ? '+' : '-'}{formatCurrency(expense.amount)}
            </div>
          </div>
        ))}
        
      <button className="w-full text-blue-600 text-sm font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors">
        View all transactions
      </button>
    </div>
  );
};

export default RecentTransactions;