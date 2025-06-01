import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { PlusCircle, Trash2, Edit, CheckCircle, XCircle } from 'lucide-react';

const CategoryList: React.FC = () => {
  const { state, addCategory, deleteCategory } = useAppContext();
  const { categories } = state;
  
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#3B82F6',
    icon: 'tag'
  });
  
  const [editMode, setEditMode] = useState(false);
  
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) {
      alert('Category name is required');
      return;
    }
    
    // Check if category name already exists
    if (categories.some(cat => cat.name.toLowerCase() === newCategory.name.toLowerCase())) {
      alert('A category with this name already exists');
      return;
    }
    
    addCategory(newCategory);
    setNewCategory({
      name: '',
      color: '#3B82F6',
      icon: 'tag'
    });
  };
  
  const handleDeleteCategory = (id: string) => {
    // Check if this is a default category
    const category = categories.find(cat => cat.id === id);
    if (['Food', 'Transport', 'Entertainment', 'Housing', 'Shopping', 'Utilities', 'Healthcare', 'Salary'].includes(category?.name || '')) {
      alert('Cannot delete default categories');
      return;
    }
    
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
    }
  };
  
  const colorOptions = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#64748B', // Slate
  ];
  
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
        <p className="text-gray-600">Manage your expense categories</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="font-bold text-gray-800 mb-4">Add New Category</h3>
        
        <form onSubmit={handleAddCategory} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="categoryName">
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              placeholder="e.g., Education, Gifts"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <div className="flex gap-2">
              {colorOptions.map(color => (
                <button
                  key={color}
                  type="button"
                  style={{ backgroundColor: color }}
                  className={`w-8 h-8 rounded-full ${
                    newCategory.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  onClick={() => setNewCategory({ ...newCategory, color })}
                ></button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              &nbsp;
            </label>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 transition-colors"
            >
              <PlusCircle size={18} className="mr-2" />
              Add Category
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Your Categories</h3>
          
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              editMode ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {editMode ? 'Done' : 'Edit'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-4">
          {categories.map(category => (
            <div
              key={category.id}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <div style={{ backgroundColor: category.color }} className="w-5 h-5 rounded-full"></div>
                </div>
                <span className="font-medium">{category.name}</span>
              </div>
              
              {editMode && (
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-gray-500 hover:text-red-600 transition-colors"
                  title="Delete category"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;