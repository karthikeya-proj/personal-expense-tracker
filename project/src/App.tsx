import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import TransactionList from './components/transactions/TransactionList';
import AddTransactionForm from './components/transactions/AddTransactionForm';
import BudgetList from './components/budgets/BudgetList';
import CategoryList from './components/categories/CategoryList';
import SettingsPanel from './components/settings/SettingsPanel';
import { Plus } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <TransactionList />;
      case 'budgets':
        return <BudgetList />;
      case 'categories':
        return <CategoryList />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <Dashboard />;
    }
  };
  
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex flex-col md:flex-row flex-1">
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onAddTransaction={() => setIsAddTransactionOpen(true)}
          />
          <main className="flex-1">{renderContent()}</main>
        </div>
        
        {/* Mobile Add Button */}
        <div className="md:hidden fixed bottom-6 right-6">
          <button
            onClick={() => setIsAddTransactionOpen(true)}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={24} />
          </button>
        </div>
        
        <AddTransactionForm
          isOpen={isAddTransactionOpen}
          onClose={() => setIsAddTransactionOpen(false)}
        />
      </div>
    </AppProvider>
  );
}

export default App;