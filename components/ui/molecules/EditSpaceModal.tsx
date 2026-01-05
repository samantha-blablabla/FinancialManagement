'use client';

import { useState, useEffect } from 'react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';
import { X } from 'lucide-react';

interface Space {
  id: string;
  name: string;
  currency: string; // Legacy
  currencies?: string[]; // Multi-currency support
}

interface EditSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  space: Space | null;
  onSuccess: () => void;
}

const CURRENCIES = [
  { code: 'VND', name: 'Việt Nam Đồng', symbol: '₫' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
];

const getCurrencySymbol = (code: string) => {
  return CURRENCIES.find(c => c.code === code)?.symbol || code;
};

export function EditSpaceModal({ isOpen, onClose, space, onSuccess }: EditSpaceModalProps) {
  const [name, setName] = useState('');
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>(['VND']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load space data when modal opens
  useEffect(() => {
    if (isOpen && space) {
      setName(space.name);
      // Support both legacy single currency and new multi-currency
      if (space.currencies && space.currencies.length > 0) {
        setSelectedCurrencies(space.currencies);
      } else {
        setSelectedCurrencies([space.currency || 'VND']);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, space]);

  // Add currency handler
  const handleAddCurrency = (currencyCode: string) => {
    if (!selectedCurrencies.includes(currencyCode)) {
      setSelectedCurrencies([...selectedCurrencies, currencyCode]);
    }
  };

  // Remove currency handler
  const handleRemoveCurrency = (currencyCode: string) => {
    if (selectedCurrencies.length > 1) {
      setSelectedCurrencies(selectedCurrencies.filter(c => c !== currencyCode));
    } else {
      setError('Phải có ít nhất 1 loại tiền tệ');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Get available currencies (not selected yet)
  const availableCurrencies = CURRENCIES.filter(
    c => !selectedCurrencies.includes(c.code)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!space) return;

    if (selectedCurrencies.length === 0) {
      setError('Phải chọn ít nhất 1 loại tiền tệ');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/spaces/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        body: JSON.stringify({
          id: space.id,
          name,
          currencies: selectedCurrencies,
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
    setSelectedCurrencies(['VND']);
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
          <h2 className="text-xl md:text-2xl font-bold text-stone-100 mb-4 md:mb-6">Chỉnh sửa tiền tệ</h2>

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

            {/* Currency Tags */}
            <div>
              <Label htmlFor="currency-select">Loại tiền tệ *</Label>

              {/* Selected Currency Tags */}
              <div className="flex flex-wrap gap-2 mb-3 p-3 bg-stone-800/30 border border-stone-700/50 rounded-lg min-h-[3rem]">
                {selectedCurrencies.map((currencyCode) => {
                  const currency = CURRENCIES.find(c => c.code === currencyCode);
                  return (
                    <div
                      key={currencyCode}
                      className="flex items-center gap-2 px-3 py-1.5 bg-stone-700/50 border border-stone-600/50 rounded-md text-sm text-stone-100 hover:bg-stone-700/70 transition-colors"
                    >
                      <span className="font-medium">{currency?.symbol}</span>
                      <span>{currency?.code}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCurrency(currencyCode)}
                        className="ml-1 hover:text-stone-300 transition-colors"
                        aria-label={`Remove ${currencyCode}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Add Currency Dropdown */}
              {availableCurrencies.length > 0 && (
                <select
                  id="currency-select"
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddCurrency(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="w-full px-4 py-2.5 bg-stone-800/50 border border-stone-700/50 rounded-lg text-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent text-sm"
                  defaultValue=""
                >
                  <option value="" disabled>Thêm loại tiền tệ...</option>
                  {availableCurrencies.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.name} ({curr.code})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-stone-800/50 border border-stone-600/50 rounded-lg text-stone-300 text-sm">
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
