import React from 'react';
import { Expense, Category } from '../../types';
import { groupExpensesByCategory } from '../../utils/helpers';

interface ExpenseChartProps {
  expenses: Expense[];
  categories: Category[];
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses, categories }) => {
  const expensesByCategory = groupExpensesByCategory(expenses);
  const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);
  
  // Only show expense type transactions for the chart
  const filteredExpenses = expenses.filter(expense => expense.type === 'expense');
  
  if (filteredExpenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500 text-center">No expense data for this period</p>
      </div>
    );
  }
  
  // Create pie chart segments
  const chartSegments = Object.entries(expensesByCategory).map(([categoryId, amount]) => {
    const category = categories.find(cat => cat.name === categoryId) || {
      id: categoryId,
      name: categoryId,
      color: '#CBD5E1',
      icon: 'help-circle'
    };
    
    const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
    
    return {
      category,
      amount,
      percentage
    };
  }).sort((a, b) => b.amount - a.amount);
  
  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      {/* Simple pie chart representation */}
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {chartSegments.length > 0 ? (
            <>
              {chartSegments.reduce((jsx, segment, index, array) => {
                let cumulativePercentage = array
                  .slice(0, index)
                  .reduce((sum, s) => sum + s.percentage, 0);
                
                const strokeDasharray = `${segment.percentage} ${100 - segment.percentage}`;
                const strokeDashoffset = -cumulativePercentage;
                
                return [
                  ...jsx,
                  <circle
                    key={segment.category.id}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={segment.category.color}
                    strokeWidth="20"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500 ease-in-out"
                  />
                ];
              }, [] as JSX.Element[])}
              <circle cx="50" cy="50" r="30" fill="white" />
            </>
          ) : (
            <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" strokeWidth="20" />
          )}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex-1 flex flex-col">
        {chartSegments.map(segment => (
          <div key={segment.category.id} className="flex items-center mb-3">
            <div
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: segment.category.color }}
            ></div>
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="font-medium">{segment.category.name}</span>
                <span className="text-gray-600">{segment.percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${segment.percentage}%`,
                    backgroundColor: segment.category.color
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseChart;