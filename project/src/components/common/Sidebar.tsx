import React from 'react';
import { LayoutDashboard, ListOrdered, PieChart, Wallet, Settings, Plus, Download } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAddTransaction: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onAddTransaction }) => {
  const { state } = useAppContext();
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'transactions', label: 'Transactions', icon: <ListOrdered size={20} /> },
    { id: 'budgets', label: 'Budgets', icon: <Wallet size={20} /> },
    { id: 'categories', label: 'Categories', icon: <PieChart size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(state, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `expense-tracker-export-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  return (
    <aside className="bg-white shadow-md w-full md:w-64 md:min-h-screen p-4">
      <div className="hidden md:flex items-center justify-center mb-8">
        <Wallet className="text-blue-600 mr-2" size={24} />
        <h2 className="text-xl font-bold text-blue-600">ExpenseTracker</h2>
      </div>
      
      <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible gap-2 md:gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center p-3 rounded-lg transition-all w-full ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="mr-3">{tab.icon}</span>
            <span className="font-medium whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-8 hidden md:block">
        <button 
          onClick={onAddTransaction}
          className="bg-blue-600 text-white rounded-lg w-full py-2 px-4 font-medium flex items-center justify-center hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add Expense
        </button>
        
        <button 
          onClick={handleExport}
          className="mt-4 border border-gray-300 text-gray-700 rounded-lg w-full py-2 px-4 font-medium flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <Download size={18} className="mr-2" />
          Export Data
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;