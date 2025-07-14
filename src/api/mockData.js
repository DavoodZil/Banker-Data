// Mock data for iframe integration - replace base44 entities

export const mockAccounts = [
  {
    id: '1',
    account_name: 'Checking Account',
    account_type: 'checking',
    balance: 2500.00,
    currency: 'USD',
    institution_name: 'Chase Bank',
    account_number_last_four: '1234',
    available_balance: 2400.00,
    lastSync: new Date().toISOString(),
    is_active: true
  },
  {
    id: '2',
    account_name: 'Savings Account',
    account_type: 'savings',
    balance: 15000.00,
    currency: 'USD',
    institution_name: 'Wells Fargo',
    account_number_last_four: '5678',
    available_balance: 15000.00,
    lastSync: new Date().toISOString(),
    is_active: true
  },
  {
    id: '3',
    account_name: 'Credit Card',
    account_type: 'credit',
    balance: -1250.50,
    currency: 'USD',
    institution_name: 'American Express',
    account_number_last_four: '9012',
    available_balance: 5000.00,
    lastSync: new Date().toISOString(),
    is_active: true
  }
];

export const mockTransactions = [
  {
    id: '1',
    accountId: '1',
    amount: -45.67,
    description: 'Grocery Store',
    custom_description: 'Grocery Store',
    category: 'groceries',
    date: new Date().toISOString(),
    type: 'debit',
    merchant: 'Whole Foods Market'
  },
  {
    id: '2',
    accountId: '1',
    amount: -120.00,
    description: 'Gas Station',
    custom_description: 'Gas Station',
    category: 'transportation',
    date: new Date(Date.now() - 86400000).toISOString(),
    type: 'debit',
    merchant: 'Shell'
  },
  {
    id: '3',
    accountId: '2',
    amount: 5000.00,
    description: 'Salary Deposit',
    custom_description: 'Salary Deposit',
    category: 'income',
    date: new Date(Date.now() - 172800000).toISOString(),
    type: 'credit',
    merchant: 'Employer'
  },
  {
    id: '4',
    accountId: '1',
    amount: -85.50,
    description: 'Restaurant',
    custom_description: 'Dinner Out',
    category: 'dining',
    date: new Date(Date.now() - 259200000).toISOString(),
    type: 'debit',
    merchant: 'Local Restaurant'
  },
  {
    id: '5',
    accountId: '3',
    amount: -250.00,
    description: 'Shopping',
    custom_description: 'Clothing Purchase',
    category: 'shopping',
    date: new Date(Date.now() - 345600000).toISOString(),
    type: 'debit',
    merchant: 'Department Store'
  }
];

export const mockCategories = [
  { id: '1', name: 'groceries', color: '#10b981', budget_amount: 500 },
  { id: '2', name: 'transportation', color: '#3b82f6', budget_amount: 300 },
  { id: '3', name: 'shopping', color: '#ec4899', budget_amount: 200 },
  { id: '4', name: 'entertainment', color: '#8b5cf6', budget_amount: 150 },
  { id: '5', name: 'income', color: '#f59e0b', budget_amount: 0 },
  { id: '6', name: 'dining', color: '#ef4444', budget_amount: 250 },
  { id: '7', name: 'utilities', color: '#06b6d4', budget_amount: 400 },
  { id: '8', name: 'healthcare', color: '#84cc16', budget_amount: 100 }
];

export const mockTags = [
  { id: '1', name: 'Essential', color: '#FF6B6B' },
  { id: '2', name: 'Luxury', color: '#4ECDC4' },
  { id: '3', name: 'Recurring', color: '#45B7D1' },
  { id: '4', name: 'One-time', color: '#96CEB4' }
];

export const mockRules = [
  {
    id: '1',
    name: 'Grocery Rule',
    condition: 'description contains "grocery"',
    action: 'categorize as "Food & Dining"',
    isActive: true
  },
  {
    id: '2',
    name: 'Gas Rule',
    condition: 'merchant contains "gas"',
    action: 'categorize as "Transportation"',
    isActive: true
  }
];

export const mockFinancialEntities = [
  {
    id: '1',
    name: 'Whole Foods Market',
    type: 'merchant',
    rules: ['1'],
    transactions: ['1']
  },
  {
    id: '2',
    name: 'Shell',
    type: 'merchant',
    rules: ['2'],
    transactions: ['2']
  }
]; 