import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Download, Upload, Trash2 } from 'lucide-react';

const SettingsPanel: React.FC = () => {
  const { state } = useAppContext();
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  
  const handleExport = () => {
    try {
      let dataStr;
      let filename;
      
      if (exportFormat === 'json') {
        dataStr = JSON.stringify(state, null, 2);
        filename = `expense-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
      } else {
        // CSV format
        const headers = ['id', 'date', 'type', 'category', 'amount', 'description'];
        const csvRows = [headers.join(',')];
        
        state.expenses.forEach(expense => {
          const row = [
            expense.id,
            expense.date,
            expense.type,
            expense.category,
            expense.amount,
            `"${expense.description.replace(/"/g, '""')}"`
          ];
          csvRows.push(row.join(','));
        });
        
        dataStr = csvRows.join('\n');
        filename = `expense-tracker-export-${new Date().toISOString().split('T')[0]}.csv`;
      }
      
      const blob = new Blob([dataStr], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };
  
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const data = JSON.parse(result);
        
        if (data.expenses && data.categories) {
          // Validate data structure
          localStorage.setItem('expenseTrackerState', result);
          alert('Data imported successfully. Please refresh the page to see the changes.');
          window.location.reload();
        } else {
          alert('Invalid data format. Import failed.');
        }
      } catch (error) {
        console.error('Import failed:', error);
        alert('Import failed. Please check the file format and try again.');
      }
    };
    
    reader.readAsText(file);
  };
  
  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('expenseTrackerState');
      alert('All data has been cleared. The page will now reload.');
      window.location.reload();
    }
  };
  
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <p className="text-gray-600">Manage your account preferences</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 divide-y">
        {/* Data Management */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Data Management</h3>
          
          <div className="space-y-6">
            {/* Export Data */}
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Export Data</h4>
              <p className="text-gray-600 text-sm mb-3">
                Download your expense data as a file for backup or transfer.
              </p>
              
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="json-format"
                    name="exportFormat"
                    checked={exportFormat === 'json'}
                    onChange={() => setExportFormat('json')}
                    className="text-blue-600"
                  />
                  <label htmlFor="json-format" className="text-sm">JSON Format</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="csv-format"
                    name="exportFormat"
                    checked={exportFormat === 'csv'}
                    onChange={() => setExportFormat('csv')}
                    className="text-blue-600"
                  />
                  <label htmlFor="csv-format" className="text-sm">CSV Format</label>
                </div>
                
                <button
                  onClick={handleExport}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Download size={16} className="mr-2" />
                  Export Data
                </button>
              </div>
            </div>
            
            {/* Import Data */}
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Import Data</h4>
              <p className="text-gray-600 text-sm mb-3">
                Import your expense data from a JSON file. This will replace all existing data.
              </p>
              
              <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer w-fit">
                <Upload size={16} className="mr-2" />
                Import Data
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
            
            {/* Clear Data */}
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Clear All Data</h4>
              <p className="text-gray-600 text-sm mb-3">
                Delete all your expense data. This action cannot be undone.
              </p>
              
              <button
                onClick={handleClearData}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <Trash2 size={16} className="mr-2" />
                Clear All Data
              </button>
            </div>
          </div>
        </div>
        
        {/* About */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">About</h3>
          <p className="text-gray-600 mb-2">
            ExpenseTracker is a personal finance tool to help you manage your expenses and track your spending habits.
          </p>
          <p className="text-gray-600 mb-2">
            Version 1.0.0
          </p>
          <p className="text-gray-600">
            © 2025 ExpenseTracker
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;