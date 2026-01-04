// Core Types for Financial Management App

export interface Space {
  id: string;
  name: string;
  description?: string;
  password_hash?: string; // Only returned in specific API calls
  owner_id: string;
  currency?: string; // Legacy field - kept for backward compatibility
  currencies: string[]; // New field - array of supported currencies
  created_at: string;
  updated_at?: string;
}

export interface Transaction {
  id: string;
  space_id: string;
  category_id: string;
  amount: number;
  currency: string; // Which currency this transaction is in
  description?: string;
  transaction_date: string;
  type: 'income' | 'expense';
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  space_id: string;
  name: string;
  icon: string; // Lucide icon name
  type: 'income' | 'expense';
  created_at: string;
}

// Common currency codes supported
export const COMMON_CURRENCIES = [
  { code: 'VND', name: 'Việt Nam Đồng', symbol: '₫' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'KRW', name: 'Korean Won', symbol: '₩' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
] as const;

export type CurrencyCode = typeof COMMON_CURRENCIES[number]['code'];

// Helper function to get currency symbol
export function getCurrencySymbol(code: string): string {
  const currency = COMMON_CURRENCIES.find(c => c.code === code);
  return currency?.symbol || code;
}

// Helper function to format amount with currency
export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = COMMON_CURRENCIES.find(c => c.code === currencyCode);

  if (currencyCode === 'VND') {
    return `${amount.toLocaleString('vi-VN')}${currency?.symbol || 'đ'}`;
  }

  return `${currency?.symbol || currencyCode}${amount.toLocaleString('en-US')}`;
}
