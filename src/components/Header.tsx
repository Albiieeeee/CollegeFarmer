import React, { useState } from 'react';

interface HeaderProps {
  activeTab: 'home' | 'prices' | 'machines' | 'suppliers' | 'calculator' | 'guides';
  setActiveTab: (tab: 'home' | 'prices' | 'machines' | 'suppliers' | 'calculator' | 'guides') => void;
  onOpenAlertModal: () => void;
  onOpenDealerModal: () => void;
  compareCount: number;
  onOpenCompare: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAlertModal,
  onOpenDealerModal,
  compareCount,
  onOpenCompare,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'home' | 'prices' | 'machines' | 'suppliers' | 'calculator' | 'guides') => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg p-1"
              aria-label="LatexPulse Home"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-950/30">
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

          {/* Zone 2: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'home'
                  ? 'bg-stone-800 text-emerald-400 font-bold shadow-inner'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('prices')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'prices'
                  ? 'bg-stone-800 text-emerald-400 font-bold shadow-inner'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              Everyday Prices
            </button>

            <button
              id="nav-tapping-machines"
              onClick={() => handleNavClick('machines')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'machines'
                  ? 'bg-stone-800 text-emerald-400 font-bold shadow-inner'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <span>Tapping Machines</span>
              {compareCount > 0 && (
                <span className="px-1.5 py-0.2 bg-emerald-500 text-stone-950 text-[10px] font-bold rounded-full">
                  {compareCount}
                </span>
              )}
            </button>

            <button
              id="supplier-directory-nav"
              onClick={() => handleNavClick('suppliers')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'suppliers'
                  ? 'bg-stone-800 text-emerald-400 font-bold shadow-inner'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              Local Suppliers
            </button>

            <button
              onClick={() => handleNavClick('calculator')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'calculator'
                  ? 'bg-stone-800 text-emerald-400 font-bold shadow-inner'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              Yield Calculator
            </button>

            <button
              onClick={() => handleNavClick('guides')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'guides'
                  ? 'bg-stone-800 text-emerald-400 font-bold shadow-inner'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              Farmer Guides
            </button>
          </nav>

          {/* Zone 3: Primary Action & Compare */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {compareCount >= 2 && (
              <button
                onClick={onOpenCompare}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-700/60 rounded-lg hover:bg-emerald-900 transition-colors whitespace-nowrap shrink-0"
              >
                <span>Compare ({compareCount})</span>
              </button>
            )}

            <button
              onClick={onOpenDealerModal}
              className="hidden xl:inline-block text-xs font-medium text-stone-300 hover:text-white px-2.5 py-1.5 transition-colors"
            >
              Dealer Portal
            </button>

            <button
              onClick={onOpenAlertModal}
              className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-stone-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors whitespace-nowrap shrink-0 shadow-sm active:scale-95"
            >
              Price Alert
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-stone-800 space-y-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-md ${
                activeTab === 'home' ? 'bg-stone-800 text-emerald-400' : 'text-stone-300 hover:bg-stone-800/60'
              }`}
            >
              Home Overview
            </button>
            <button
              onClick={() => handleNavClick('prices')}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-md ${
                activeTab === 'prices' ? 'bg-stone-800 text-emerald-400' : 'text-stone-300 hover:bg-stone-800/60'
              }`}
            >
              Everyday Prices
            </button>
            <button
              onClick={() => handleNavClick('machines')}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-md flex items-center justify-between ${
                activeTab === 'machines' ? 'bg-stone-800 text-emerald-400' : 'text-stone-300 hover:bg-stone-800/60'
              }`}
            >
              <span>Tapping Machines</span>
              {compareCount > 0 && (
                <span className="px-1.5 py-0.2 bg-emerald-400 text-stone-950 rounded text-[10px] font-bold">
                  {compareCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleNavClick('suppliers')}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-md ${
                activeTab === 'suppliers' ? 'bg-stone-800 text-emerald-400' : 'text-stone-300 hover:bg-stone-800/60'
              }`}
            >
              Local Suppliers Directory
            </button>
            <button
              onClick={() => handleNavClick('calculator')}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-md ${
                activeTab === 'calculator' ? 'bg-stone-800 text-emerald-400' : 'text-stone-300 hover:bg-stone-800/60'
              }`}
            >
              Yield &amp; DRC Calculator
            </button>
            <button
              onClick={() => handleNavClick('guides')}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-md ${
                activeTab === 'guides' ? 'bg-stone-800 text-emerald-400' : 'text-stone-300 hover:bg-stone-800/60'
              }`}
            >
              Farmer Guides &amp; Agronomy
            </button>
            <div className="pt-2 border-t border-stone-800/80 flex items-center gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenDealerModal();
                }}
                className="w-full py-2 text-center text-xs font-semibold text-stone-300 bg-stone-800 rounded-lg hover:bg-stone-700"
              >
                + Register Dealership
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
