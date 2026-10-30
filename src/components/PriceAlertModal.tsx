import React, { useState } from 'react';
import { CommodityType, PriceAlert } from '../types';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAlert: (alert: PriceAlert) => void;
  currentPrices: { commodity: CommodityType; price: number }[];
  currentRegionName: string;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  onClose,
  onAddAlert,
  currentPrices,
  currentRegionName,
}) => {
  const [commodity, setCommodity] = useState<CommodityType>('RSS-4');
  const [targetPrice, setTargetPrice] = useState<number>(200);
  const [direction, setDirection] = useState<'above' | 'below'>('above');
  const [notifyVia, setNotifyVia] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const currentBenchmark = currentPrices.find((p) => p.commodity === commodity)?.price || 194.5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim() || phoneOrEmail.length < 8) {
      setErrorMessage('Please enter a valid mobile number for SMS / WhatsApp alerts');
      return;
    }
    if (targetPrice <= 0) {
      setErrorMessage('Please enter a target price greater than 0');
      return;
    }

    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      commodity,
      region: currentRegionName,
      targetPrice,
      direction,
      notifyVia,
      phoneOrEmail,
      isActive: true,
      createdAt: 'Today',
    };

    onAddAlert(newAlert);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-display">
              Set Daily Price Alert
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Receive immediate ping when market auction prices meet your threshold.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition-colors"
            aria-label="Close alert modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800">
              {errorMessage}
            </div>
          )}

          <div>
            <label htmlFor="alert-commodity" className="block text-xs font-semibold text-stone-800 mb-1">
              Rubber Grade
            </label>
            <select
              id="alert-commodity"
              value={commodity}
              onChange={(e) => {
                const newCom = e.target.value as CommodityType;
                setCommodity(newCom);
                const match = currentPrices.find((p) => p.commodity === newCom);
                if (match) setTargetPrice(Math.round(match.price * 1.04));
              }}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="RSS-4">RSS-4 (Smoked Sheet Grade 4)</option>
              <option value="Field Latex (60% DRC)">Field Latex (60% DRC)</option>
              <option value="RSS-3">RSS-3 (International Standard)</option>
              <option value="Cup Lump (50% DRC)">Cup Lump (50% DRC Wet Scrap)</option>
              <option value="ISNR-20 / TSR-20">ISNR-20 / TSR-20 (Block Rubber)</option>
            </select>
            <div className="text-[11px] text-stone-500 mt-1">
              Current market benchmark: <strong>₹{currentBenchmark.toFixed(2)}/kg</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="alert-direction" className="block text-xs font-semibold text-stone-800 mb-1">
                Condition
              </label>
              <select
                id="alert-direction"
                value={direction}
                onChange={(e) => setDirection(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="above">Rises to or Above (≥)</option>
                <option value="below">Drops to or Below (≤)</option>
              </select>
            </div>

            <div>
              <label htmlFor="target-price" className="block text-xs font-semibold text-stone-800 mb-1">
                Target Price (₹/kg)
              </label>
              <input
                id="target-price"
                type="number"
                step="0.5"
                required
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono tabular-nums font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="alert-channel" className="block text-xs font-semibold text-stone-800 mb-1">
                Notification Channel
              </label>
              <select
                id="alert-channel"
                value={notifyVia}
                onChange={(e) => setNotifyVia(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="whatsapp">WhatsApp Message</option>
                <option value="sms">SMS Text Message</option>
              </select>
            </div>

            <div>
              <label htmlFor="alert-phone" className="block text-xs font-semibold text-stone-800 mb-1">
                Mobile Number *
              </label>
              <input
                id="alert-phone"
                type="tel"
                required
                placeholder="+91 94471 00000"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-bold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm"
            >
              Save Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
