'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { COMMON_CURRENCIES } from '@/types';

interface CurrencySelectorProps {
  selectedCurrencies: string[];
  onChange: (currencies: string[]) => void;
  label?: string;
  error?: string;
  required?: boolean;
}

export function CurrencySelector({
  selectedCurrencies,
  onChange,
  label = 'Chọn loại tiền tệ',
  error,
  required = false,
}: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCurrency = (code: string) => {
    if (selectedCurrencies.includes(code)) {
      // Don't allow removing if it's the only currency
      if (selectedCurrencies.length === 1) {
        return;
      }
      onChange(selectedCurrencies.filter(c => c !== code));
    } else {
      onChange([...selectedCurrencies, code]);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-stone-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Selected currencies display */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 bg-stone-950/50 border rounded-lg text-left transition-all ${
            error
              ? 'border-red-500/50 focus:border-red-500'
              : 'border-stone-700/50 focus:border-stone-500'
          } focus:outline-none focus:ring-2 focus:ring-stone-500/20`}
        >
          <div className="flex flex-wrap gap-2">
            {selectedCurrencies.length > 0 ? (
              selectedCurrencies.map(code => {
                const currency = COMMON_CURRENCIES.find(c => c.code === code);
                return (
                  <span
                    key={code}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-stone-800/50 border border-stone-600/50 rounded text-sm text-stone-200"
                  >
                    <span className="font-medium">{currency?.symbol}</span>
                    <span>{code}</span>
                  </span>
                );
              })
            ) : (
              <span className="text-stone-500">Chọn ít nhất một loại tiền tệ</span>
            )}
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Currency list */}
            <div className="absolute z-20 w-full mt-2 backdrop-blur-xl bg-stone-900/90 border border-stone-700/50 rounded-lg shadow-2xl max-h-64 overflow-y-auto">
              <div className="p-2">
                {COMMON_CURRENCIES.map(currency => {
                  const isSelected = selectedCurrencies.includes(currency.code);
                  return (
                    <button
                      key={currency.code}
                      type="button"
                      onClick={() => toggleCurrency(currency.code)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-stone-800/50 text-stone-100'
                          : 'text-stone-300 hover:bg-stone-800/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl w-8">{currency.symbol}</span>
                        <div className="text-left">
                          <div className="font-medium">{currency.code}</div>
                          <div className="text-xs text-stone-400">{currency.name}</div>
                        </div>
                      </div>
                      {isSelected && (
                        <Check size={18} className="text-green-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <p className="text-xs text-stone-500">
        Bạn có thể chọn nhiều loại tiền tệ. Loại tiền tệ đầu tiên sẽ là loại mặc định.
      </p>
    </div>
  );
}
