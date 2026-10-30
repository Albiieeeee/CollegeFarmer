import React from 'react';

interface HeaderProps {
  activeTab: 'prices' | 'machines' | 'suppliers' | 'calculator';
  setActiveTab: (tab: 'prices' | 'machines' | 'suppliers' | 'calculator') => void;
  onOpenAlertModal: () => void;
  compareCount: number;
  onOpenCompare: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAlertModal,
  compareCount,
  onOpenCompare,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('prices')}
              className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg p-1"
              aria-label="LatexPulse Home"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-950/30">
                {/* SVG Latex drop and bark glyph */}
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v2" />
                  <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-7.5c-.5 3.5-2 6-4 7.5S5 13 5 15a7 7 0 0 0 7 7z" fill="currentColor" fillOpacity="0.2" />
                  <path d="M7 16c.5 1.5 2 2.5 5 2.5" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white font-display">
                  Latex<span className="text-emerald-400">Pulse</span>
                </span>
                <span className="sr-only">Rubber Farmer Price and Equipment Hub</span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4 single-line nav links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium">
            <button
              onClick={() => setActiveTab('prices')}
              className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'prices'
                  ? 'bg-stone-800 text-emerald-400 font-semibold shadow-inner'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              Everyday Prices
            </button>

            <button
              onClick={() => setActiveTab('machines')}
              className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'machines'
                  ? 'bg-stone-800 text-emerald-400 font-semibold shadow-inner'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <span>Tapping Machines</span>
              {compareCount > 0 && (
                <span className="px-1.5 py-0.2 bg-emerald-500 text-stone-950 text-xs font-bold rounded-full">
                  {compareCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('suppliers')}
              className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'suppliers'
                  ? 'bg-stone-800 text-emerald-400 font-semibold shadow-inner'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              Local Suppliers
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'calculator'
                  ? 'bg-stone-800 text-emerald-400 font-semibold shadow-inner'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              Yield Calculator
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            {compareCount >= 2 && (
              <button
                onClick={onOpenCompare}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-700/60 rounded-lg hover:bg-emerald-900 transition-colors whitespace-nowrap shrink-0"
              >
                <span>Compare ({compareCount})</span>
              </button>
            )}

            <button
              onClick={onOpenAlertModal}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-stone-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors whitespace-nowrap shrink-0 shadow-sm active:scale-95"
            >
              Price Alert
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2.5 border-t border-stone-800/80 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('prices')}
            className={`px-2.5 py-1.5 rounded-md whitespace-nowrap shrink-0 ${
              activeTab === 'prices' ? 'text-emerald-400 font-bold bg-stone-800' : 'text-stone-400'
            }`}
          >
            Prices
          </button>
          <button
            onClick={() => setActiveTab('machines')}
            className={`px-2.5 py-1.5 rounded-md whitespace-nowrap shrink-0 flex items-center gap-1 ${
              activeTab === 'machines' ? 'text-emerald-400 font-bold bg-stone-800' : 'text-stone-400'
            }`}
          >
            <span>Machines</span>
            {compareCount > 0 && (
              <span className="w-4 h-4 bg-emerald-400 text-stone-950 rounded-full flex items-center justify-center text-[10px] font-bold">
                {compareCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`px-2.5 py-1.5 rounded-md whitespace-nowrap shrink-0 ${
              activeTab === 'suppliers' ? 'text-emerald-400 font-bold bg-stone-800' : 'text-stone-400'
            }`}
          >
            Suppliers
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-2.5 py-1.5 rounded-md whitespace-nowrap shrink-0 ${
              activeTab === 'calculator' ? 'text-emerald-400 font-bold bg-stone-800' : 'text-stone-400'
            }`}
          >
            Calculator
          </button>
        </div>
      </div>
    </header>
  );
};
