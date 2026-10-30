import React, { useState } from 'react';
import { DealerApplication } from '../types';

interface DealerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (message: string) => void;
}

export const DealerRegistrationModal: React.FC<DealerRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
}) => {
  const [form, setForm] = useState<DealerApplication>({
    businessName: '',
    contactPerson: '',
    phone: '',
    email: '',
    district: '',
    state: 'Kerala',
    country: 'India',
    businessType: 'Authorized Dealer',
    brandsCarried: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.businessName.trim() || !form.contactPerson.trim()) {
      setErrorMessage('Please fill in dealership and contact person names');
      return;
    }
    if (!form.phone.trim() || form.phone.length < 8) {
      setErrorMessage('Please provide a valid phone or WhatsApp number');
      return;
    }
    if (!form.district.trim()) {
      setErrorMessage('Please enter your district or plantation region');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitSuccess(
        `Application received for ${form.businessName}! Our dealer onboarding coordinator will verify your dealership credentials within 24 hours.`
      );
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-display">
              Join the Verified Equipment Supplier Directory
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Connect directly with thousands of rubber smallholders and commercial plantations.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition-colors"
            aria-label="Close dealer registration modal"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="dealer-biz-name" className="block text-xs font-semibold text-stone-800 mb-1">
                Dealership / Business Name *
              </label>
              <input
                id="dealer-biz-name"
                type="text"
                required
                placeholder="e.g. Meenachil Agro Machinery"
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="dealer-contact-name" className="block text-xs font-semibold text-stone-800 mb-1">
                Proprietor / Contact Person *
              </label>
              <input
                id="dealer-contact-name"
                type="text"
                required
                placeholder="e.g. Sunil Kurian"
                value={form.contactPerson}
                onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="dealer-phone" className="block text-xs font-semibold text-stone-800 mb-1">
                Primary WhatsApp / Phone *
              </label>
              <input
                id="dealer-phone"
                type="tel"
                required
                placeholder="+91 9447... or +66 81..."
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="dealer-email" className="block text-xs font-semibold text-stone-800 mb-1">
                Email Address
              </label>
              <input
                id="dealer-email"
                type="email"
                placeholder="sales@dealership.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="dealer-district" className="block text-xs font-semibold text-stone-800 mb-1">
                District / Town *
              </label>
              <input
                id="dealer-district"
                type="text"
                required
                placeholder="e.g. Kottayam / Surat Thani"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="dealer-biz-type" className="block text-xs font-semibold text-stone-800 mb-1">
                Facility Category
              </label>
              <select
                id="dealer-biz-type"
                value={form.businessType}
                onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Authorized Dealer">Authorized Machinery Dealership</option>
                <option value="Parts & Service Center">Spare Parts & Repair Center</option>
                <option value="Cooperative Depot">Growers Cooperative Depot</option>
                <option value="Direct Manufacturer Hub">Manufacturer Regional Hub</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="dealer-brands" className="block text-xs font-semibold text-stone-800 mb-1">
              Brands & Products Stocked
            </label>
            <input
              id="dealer-brands"
              type="text"
              placeholder="e.g. AgriTap, RoboHarvest, Tungsten Blades, Lithium Chargers"
              value={form.brandsCarried}
              onChange={(e) => setForm({ ...form, brandsCarried: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              {isSubmitting ? 'Submitting Application...' : 'Register Dealership'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
