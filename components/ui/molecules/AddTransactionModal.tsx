'use client';

import { useState, useEffect } from 'react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { getCurrencySymbol } from '@/types';

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
}

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaceId: string;
  spaceCurrencies?: string[]; // Array of available currencies for this space
  onSuccess: () => void;
}

export function AddTransactionModal({ isOpen, onClose, spaceId, spaceCurrencies = ['VND'], onSuccess }: AddTransactionModalProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [displayAmount, setDisplayAmount] = useState('');
  const [currency, setCurrency] = useState(spaceCurrencies[0] || 'VND'); // Default to first currency
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  const [notes, setNotes] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch categories when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, spaceId, type]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/categories?spaceId=${spaceId}&type=${type}`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
        if (data.categories?.length > 0) {
          setCategoryId(data.categories[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const formatCurrency = (value: string) => {
    // Remove all non-digit characters
    const numericValue = value.replace(/\D/g, '');

    if (!numericValue) return '';

    // Format with thousand separators
    return new Intl.NumberFormat('vi-VN').format(parseInt(numericValue));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only keep digits
    setAmount(value);
    setDisplayAmount(formatCurrency(value));
  };

  const formatDateForInput = (dateStr: string) => {
    // Convert YYYY-MM-DD to DD/MM/YYYY for display
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const parseDateFromInput = (dateStr: string) => {
    // Convert DD/MM/YYYY back to YYYY-MM-DD for storage
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/transactions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spaceId,
          type,
          amount: parseFloat(amount),
          currency,
          description,
          date,
          categoryId,
          notes: notes || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Có lỗi xảy ra');
        return;
      }

      // Success
      onSuccess();
      handleClose();
    } catch (err) {
      setError('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setDisplayAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setError('');
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-md my-8 backdrop-blur-xl bg-stone-900/90 border border-stone-700/50 rounded-lg shadow-2xl">
        <div className="p-4 md:p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl md:text-2xl font-bold text-stone-100 mb-4 md:mb-6">Thêm giao dịch</h2>

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            {/* Type Selection */}
            <div>
              <Label>Loại giao dịch</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`px-3 md:px-4 py-2 md:py-3 rounded-lg font-medium text-sm md:text-base transition-all flex items-center justify-center gap-2 ${
                    type === 'income'
                      ? 'bg-stone-700/50 text-stone-100 border-2 border-stone-500/50'
                      : 'bg-stone-800/50 text-stone-400 border border-stone-700/50 hover:border-stone-600'
                  }`}
                >
                  <TrendingUp size={18} />
                  Thu nhập
                </button>
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`px-3 md:px-4 py-2 md:py-3 rounded-lg font-medium text-sm md:text-base transition-all flex items-center justify-center gap-2 ${
                    type === 'expense'
                      ? 'bg-stone-700/50 text-stone-100 border-2 border-stone-500/50'
                      : 'bg-stone-800/50 text-stone-400 border border-stone-700/50 hover:border-stone-600'
                  }`}
                >
                  <TrendingDown size={18} />
                  Chi tiêu
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <Label htmlFor="amount">Số tiền *</Label>
              <Input
                id="amount"
                type="text"
                value={displayAmount}
                onChange={handleAmountChange}
                placeholder="0"
                required
              />
            </div>

            {/* Currency (only show if multiple currencies available) */}
            {spaceCurrencies.length > 1 && (
              <div>
                <Label htmlFor="currency">Loại tiền tệ</Label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-800/50 border border-stone-700/50 rounded-lg text-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                >
                  {spaceCurrencies.map((curr) => (
                    <option key={curr} value={curr}>
                      {getCurrencySymbol(curr)} {curr}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Description */}
            <div>
              <Label htmlFor="description">Mô tả *</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="VD: Mua sắm hàng tháng"
                required
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Danh mục *</Label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-800/50 border border-stone-700/50 rounded-lg text-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <Label htmlFor="date">Ngày giao dịch *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Thêm ghi chú..."
                rows={2}
                className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base bg-stone-800/50 border border-stone-700/50 rounded-lg text-stone-100 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                className="flex-1"
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Đang lưu...' : 'Thêm giao dịch'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
