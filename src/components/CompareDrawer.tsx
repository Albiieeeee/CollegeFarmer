import React from 'react';
import { TappingMachine } from '../types';

interface CompareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  machines: TappingMachine[];
  onRemove: (id: string) => void;
  onRequestQuote: (machine: TappingMachine) => void;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({
  isOpen,
  onClose,
  machines,
  onRemove,
  onRequestQuote,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-5xl rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-xl font-bold text-stone-900 font-display">
              Side-by-Side Machine Comparison ({machines.length} Selected)
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Compare tapping speed, cambium safety mechanisms, and battery autonomy.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition-colors"
            aria-label="Close comparison modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Comparison Content */}
        <div className="p-4 sm:p-6 overflow-x-auto flex-1">
          {machines.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-sm">
              No machines selected for comparison. Select 2 or more from the Tapping Machines tab.
            </div>
          ) : (
            <div className="min-w-[650px]">
              <div className="grid grid-cols-4 gap-4 pb-4 border-b border-stone-200 font-semibold text-xs text-stone-500 uppercase tracking-wider">
                <div className="col-span-1">Specification</div>
                {machines.map((m) => (
                  <div key={m.id} className="col-span-1 flex items-center justify-between">
                    <span className="font-bold text-stone-900 truncate">{m.name}</span>
                    <button
                      onClick={() => onRemove(m.id)}
                      className="text-stone-400 hover:text-rose-600 text-xs ml-1"
                      title="Remove from compare"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Rows */}
              <div className="divide-y divide-stone-100 text-xs sm:text-sm">
                <div className="grid grid-cols-4 gap-4 py-3 items-center">
                  <div className="font-semibold text-stone-700">Type</div>
                  {machines.map((m) => (
                    <div key={m.id} className="text-stone-900 font-medium">
                      {m.type}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-4 py-3 items-center">
                  <div className="font-semibold text-stone-700">Price Range</div>
                  {machines.map((m) => (
                    <div key={m.id} className="text-stone-900 font-bold font-mono tabular-nums">
                      {m.priceRange}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-4 py-3 items-center">
                  <div className="font-semibold text-stone-700">Tapping Speed</div>
                  {machines.map((m) => (
                    <div key={m.id} className="text-stone-900 font-mono tabular-nums font-semibold">
                      {m.treesPerHour} trees / hour
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-4 py-3 items-center">
                  <div className="font-semibold text-stone-700">Power & Battery Life</div>
                  {machines.map((m) => (
                    <div key={m.id} className="text-stone-800">
                      {m.batteryLife}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-4 py-3 items-center">
                  <div className="font-semibold text-stone-700">Cambium Protection</div>
                  {machines.map((m) => (
                    <div key={m.id} className="text-emerald-800 font-medium">
                      {m.cambiumProtection}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-4 py-3 items-center">
                  <div className="font-semibold text-stone-700">Tool Weight</div>
                  {machines.map((m) => (
                    <div key={m.id} className="text-stone-800 font-mono tabular-nums">
                      {m.weightKg} kg
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-4 py-3 items-center">
                  <div className="font-semibold text-stone-700">Depth Adjustment</div>
                  {machines.map((m) => (
                    <div key={m.id} className="text-stone-800">
                      {m.cuttingDepthControl}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-4 py-3 items-center">
                  <div className="font-semibold text-stone-700">Blade Technology</div>
                  {machines.map((m) => (
                    <div key={m.id} className="text-stone-800">
                      {m.bladeType}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-4 py-3 items-center">
                  <div className="font-semibold text-stone-700">Warranty</div>
                  {machines.map((m) => (
                    <div key={m.id} className="text-stone-800 font-mono tabular-nums">
                      {m.warrantyMonths} Months
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-4 py-4 items-center">
                  <div className="font-semibold text-stone-700">Actions</div>
                  {machines.map((m) => (
                    <div key={m.id}>
                      <button
                        onClick={() => {
                          onClose();
                          onRequestQuote(m);
                        }}
                        className="w-full py-2 px-3 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors text-center"
                      >
                        Request Quote
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
