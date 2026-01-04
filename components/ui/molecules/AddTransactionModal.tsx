'use client';

import { useState, useEffect } from 'react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';

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
  onSuccess: () => void;
}

export function AddTransactionModal({ isOpen, onClose, spaceId, onSuccess }: AddTransactionModalProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
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
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setError('');
    onClose();
  };

  if (!isOpen) {
    console.log('Modal is closed');
    return null;
  }

  console.log('Modal is open, rendering...');

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
                  className={`px-3 md:px-4 py-2 md:py-3 rounded-lg font-medium text-sm md:text-base transition-all ${
                    type === 'income'
                      ? 'bg-green-500/20 text-green-400 border-2 border-green-500/50'
                      : 'bg-stone-800/50 text-stone-400 border border-stone-700/50 hover:border-stone-600'
                  }`}
                >
                  💰 Thu nhập
                </button>
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`px-3 md:px-4 py-2 md:py-3 rounded-lg font-medium text-sm md:text-base transition-all ${
                    type === 'expense'
                      ? 'bg-red-500/20 text-red-400 border-2 border-red-500/50'
                      : 'bg-stone-800/50 text-stone-400 border border-stone-700/50 hover:border-stone-600'
                  }`}
                >
                  💸 Chi tiêu
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <Label htmlFor="amount">Số tiền *</Label>
              <Input
                id="amount"
                type="number"
                step="1000"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                required
              />
            </div>

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
                    {cat.icon} {cat.name}
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
