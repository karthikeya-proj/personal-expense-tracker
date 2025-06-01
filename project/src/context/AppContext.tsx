import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Expense, Category, Budget } from '../types';
import { generateId } from '../utils/helpers';

// Default categories
const defaultCategories: Category[] = [
  { id: '1', name: 'Food', color: '#10B981', icon: 'utensils' },
  { id: '2', name: 'Transport', color: '#3B82F6', icon: 'car' },
  { id: '3', name: 'Entertainment', color: '#F59E0B', icon: 'film' },
  { id: '4', name: 'Housing', color: '#6366F1', icon: 'home' },
  { id: '5', name: 'Shopping', color: '#EC4899', icon: 'shopping-bag' },
  { id: '6', name: 'Utilities', color: '#8B5CF6', icon: 'plug' },
  { id: '7', name: 'Healthcare', color: '#EF4444', icon: 'activity' },
  { id: '8', name: 'Salary', color: '#34D399', icon: 'dollar-sign' },
];

type Action =
  | { type: 'ADD_EXPENSE'; payload: Omit<Expense, 'id'> }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'ADD_CATEGORY'; payload: Omit<Category, 'id'> }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'ADD_BUDGET'; payload: Omit<Budget, 'id'> }
  | { type: 'UPDATE_BUDGET'; payload: Budget }
  | { type: 'DELETE_BUDGET'; payload: string };

const initialState: AppState = {
  expenses: [],
  categories: defaultCategories,
  budgets: []
};

const loadState = (): AppState => {
  try {
    const savedState = localStorage.getItem('expenseTrackerState');
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Error loading state from localStorage', error);
  }
  return initialState;
};

const saveState = (state: AppState) => {
  try {
    localStorage.setItem('expenseTrackerState', JSON.stringify(state));
  } catch (error) {
    console.error('Error saving state to localStorage', error);
  }
};

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, { ...action.payload, id: generateId() }]
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload)
      };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense => 
          expense.id === action.payload.id ? action.payload : expense
        )
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, { ...action.payload, id: generateId() }]
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload)
      };
    case 'ADD_BUDGET':
      return {
        ...state,
        budgets: [...state.budgets, { ...action.payload, id: generateId() }]
      };
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(budget => 
          budget.id === action.payload.id ? action.payload : budget
        )
      };
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(budget => budget.id !== action.payload)
      };
    default:
      return state;
  }
};

type AppContextType = {
  state: AppState;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (expense: Expense) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    dispatch({ type: 'ADD_EXPENSE', payload: expense });
  };

  const deleteExpense = (id: string) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  };

  const updateExpense = (expense: Expense) => {
    dispatch({ type: 'UPDATE_EXPENSE', payload: expense });
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    dispatch({ type: 'ADD_CATEGORY', payload: category });
  };

  const deleteCategory = (id: string) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: id });
  };

  const addBudget = (budget: Omit<Budget, 'id'>) => {
    dispatch({ type: 'ADD_BUDGET', payload: budget });
  };

  const updateBudget = (budget: Budget) => {
    dispatch({ type: 'UPDATE_BUDGET', payload: budget });
  };

  const deleteBudget = (id: string) => {
    dispatch({ type: 'DELETE_BUDGET', payload: id });
  };

  return (
    <AppContext.Provider value={{
      state,
      addExpense,
      deleteExpense,
      updateExpense,
      addCategory,
      deleteCategory,
      addBudget,
      updateBudget,
      deleteBudget
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};