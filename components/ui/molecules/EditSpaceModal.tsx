'use client';

import { useState, useEffect } from 'react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';

interface Space {
  id: string;
  name: string;
  currency: string;
}

interface EditSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  space: Space | null;
  onSuccess: () => void;
}

const CURRENCIES = [
  { code: 'VND', name: 'Việt Nam Đồng (₫)', symbol: '₫' },
  { code: 'USD', name: 'US Dollar ($)', symbol: '$' },
  { code: 'EUR', name: 'Euro (€)', symbol: '€' },
  { code: 'GBP', name: 'British Pound (£)', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen (¥)', symbol: '¥' },
];

export function EditSpaceModal({ isOpen, onClose, space, onSuccess }: EditSpaceModalProps) {
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('VND');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load space data when modal opens
  useEffect(() => {
    if (isOpen && space) {
      setName(space.name);
      setCurrency(space.currency);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, space]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!space) return;

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/spaces/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: space.id,
          name,
          currency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Có lỗi xảy ra');
        return;
      }

      onSuccess();
      handleClose();
    } catch (err) {
      setError('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setCurrency('VND');
    setError('');
    onClose();
  };

  if (!isOpen || !space) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-md my-8 backdrop-blur-xl bg-stone-900/90 border border-stone-700/50 rounded-lg shadow-2xl">
        <div className="p-4 md:p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl md:text-2xl font-bold text-stone-100 mb-4 md:mb-6">Chỉnh sửa không gian</h2>

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            {/* Space Name */}
            <div>
              <Label htmlFor="space-name">Tên không gian *</Label>
              <Input
                id="space-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Tài chính cá nhân"
                required
                maxLength={100}
              />
            </div>

            {/* Currency */}
            <div>
              <Label htmlFor="currency">Loại tiền tệ *</Label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-800/50 border border-stone-700/50 rounded-lg text-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                required
              >
                {CURRENCIES.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.name}
                  </option>
                ))}
              </select>
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
                {loading ? 'Đang lưu...' : 'Cập nhật'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
