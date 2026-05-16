'use client';

import { useDiscount } from '@/context/DiscountContext';
import { X, Gift } from 'lucide-react';
import { useState } from 'react';

export default function DiscountBanner() {
  const { hasPurchased, discountApplied, discountPercentage, applyDiscountCode } = useDiscount();
  const [visible, setVisible] = useState(true);
  const [codeInput, setCodeInput] = useState('');
  const [codeMessage, setCodeMessage] = useState('');

  if (hasPurchased || !discountApplied || !visible) {
    return null;
  }

  const handleApplyCode = async () => {
    if (!codeInput.trim()) return;
    const success = await applyDiscountCode(codeInput.trim());
    setCodeMessage(success ? 'Discount code applied!' : 'Invalid code. Please try again.');
    setTimeout(() => setCodeMessage(''), 3000);
  };

  return (
    <div className="bg-blue-600 text-white relative">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="bg-white/20 p-2 rounded-full">
              <Gift size={22} />
            </div>
            <div>
              <span className="font-bold text-sm sm:text-base">
                🎉 Welcome Offer — {discountPercentage}% OFF your first order!
              </span>
              <span className="hidden sm:block text-xs text-blue-100 mt-0.5">
                Prices shown include your first-purchase discount.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Promo code input */}
            <div className="hidden sm:flex items-center gap-2">
              <input
                type="text"
                placeholder="Promo code"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                className="bg-white/20 border border-white/30 text-white placeholder-blue-200 px-3 py-1 rounded text-sm w-32 focus:outline-none focus:border-white"
              />
              <button
                onClick={handleApplyCode}
                className="bg-yellow-400 text-gray-900 px-3 py-1 rounded text-sm font-semibold hover:bg-yellow-500"
              >
                Apply
              </button>
            </div>
            {codeMessage && (
              <span className="text-xs text-yellow-300 hidden sm:block">{codeMessage}</span>
            )}
            <button
              onClick={() => setVisible(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
