import React, { useState } from 'react';
import { EquipmentSupplier, TappingMachine } from '../types';

interface InquiryQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetMachine?: TappingMachine | null;
  targetSupplier?: EquipmentSupplier | null;
  onSubmitSuccess: (message: string) => void;
}

export const InquiryQuoteModal: React.FC<InquiryQuoteModalProps> = ({
  isOpen,
  onClose,
  targetMachine,
  targetSupplier,
  onSubmitSuccess,
}) => {
  const [farmerName, setFarmerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [plantationTown, setPlantationTown] = useState('');
  const [inquiryType, setInquiryType] = useState<'quote' | 'demo' | 'parts'>('quote');
  const [treeCount, setTreeCount] = useState('500');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.length < 8) {
      setErrorMessage('Please enter a valid phone or WhatsApp number');
      return;
    }
    if (!plantationTown.trim()) {
      setErrorMessage('Please enter your village, district, or plantation town');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsSubmitting(false);
      const targetName = targetMachine ? targetMachine.name : targetSupplier ? targetSupplier.name : 'Equipment';
      onSubmitSuccess(
        `Inquiry received for ${targetName}! An authorized specialist will contact you via WhatsApp / phone within 4 business hours.`
      );
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-display">
              Request Equipment Quote & Demonstration
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Direct connection with local certified dealers and field support.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition-colors"
            aria-label="Close quote modal"
          >
            ✕
          </button>
        </div>

        {/* Selected Item Context Banner */}
        {(targetMachine || targetSupplier) && (
          <div className="bg-emerald-50/80 px-5 py-3 border-b border-emerald-100 flex items-center gap-3 text-xs">
            <span className="font-semibold text-emerald-950">Target:</span>
            {targetMachine && (
              <span className="text-emerald-900 font-bold">
                {targetMachine.brand} {targetMachine.name} ({targetMachine.priceRange})
              </span>
            )}
            {targetSupplier && (
              <span className="text-emerald-900 font-bold">
                Dealer: {targetSupplier.name} ({targetSupplier.district})
              </span>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800">
              {errorMessage}
            </div>
          )}

          <div>
            <label htmlFor="farmer-name" className="block text-xs font-semibold text-stone-800 mb-1">
              Farmer / Estate Manager Name *
            </label>
            <input
              id="farmer-name"
              type="text"
              required
              placeholder="e.g. Thomas K. / Somchai P."
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="phone-number" className="block text-xs font-semibold text-stone-800 mb-1">
                Phone / WhatsApp *
              </label>
              <input
                id="phone-number"
                type="tel"
                required
                placeholder="+91 9447... or +66 81..."
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="plantation-town" className="block text-xs font-semibold text-stone-800 mb-1">
                Plantation Location *
              </label>
              <input
                id="plantation-town"
                type="text"
                required
                placeholder="e.g. Kanjirappally, Kottayam"
                value={plantationTown}
                onChange={(e) => setPlantationTown(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="inquiry-type" className="block text-xs font-semibold text-stone-800 mb-1">
                Inquiry Type
              </label>
              <select
                id="inquiry-type"
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="quote">Purchase Price & Dealer Quote</option>
                <option value="demo">Book On-Farm Live Demonstration</option>
                <option value="parts">Spare Blades, Batteries & Service</option>
              </select>
            </div>

            <div>
              <label htmlFor="tree-count-quote" className="block text-xs font-semibold text-stone-800 mb-1">
                Holding Size (Rubber Trees)
              </label>
              <select
                id="tree-count-quote"
                value={treeCount}
                onChange={(e) => setTreeCount(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="200">Smallholder (100 - 300 trees)</option>
                <option value="500">Medium (300 - 750 trees)</option>
                <option value="1200">Large Holding (750 - 2,000 trees)</option>
                <option value="3000">Commercial Estate (2,000+ trees)</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="quote-notes" className="block text-xs font-semibold text-stone-800 mb-1">
              Specific Requirements or Questions (Optional)
            </label>
            <textarea
              id="quote-notes"
              rows={2}
              placeholder="e.g., Do you have subsidy clearance? Can you demonstrate before next tapping cycle?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
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
              disabled={isSubmitting}
              className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Sending Request...' : 'Submit Inquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
