import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { calculateTotalExpenses, calculateTotalIncome, formatCurrency } from '../../utils/helpers';
import { Wallet } from 'lucide-react';

const Header: React.FC = () => {
  const { state } = useAppContext();
  
  const totalExpenses = calculateTotalExpenses(state.expenses);
  const totalIncome = calculateTotalIncome(state.expenses);
  const balance = totalIncome - totalExpenses;
  
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-md">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Wallet size={24} className="mr-2" />
            <h1 className="text-2xl font-bold">ExpenseTracker</h1>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 transition-all hover:bg-white/20">
            <p className="text-sm font-medium text-white/80">Balance</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {formatCurrency(balance)}
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 transition-all hover:bg-white/20">
            <p className="text-sm font-medium text-white/80">Income</p>
            <p className="text-2xl font-bold text-green-300">{formatCurrency(totalIncome)}</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 transition-all hover:bg-white/20">
            <p className="text-sm font-medium text-white/80">Expenses</p>
            <p className="text-2xl font-bold text-red-300">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;