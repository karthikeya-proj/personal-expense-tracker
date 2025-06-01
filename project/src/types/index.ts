export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'expense' | 'income';
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly';
}

export interface AppState {
  expenses: Expense[];
  categories: Category[];
  budgets: Budget[];
}