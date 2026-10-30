/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WeatherBanner } from './components/WeatherBanner';
import { HomeView } from './components/HomeView';
import { MarketPricesView } from './components/MarketPricesView';
import { TappingMachinesView } from './components/TappingMachinesView';
import { SupplierDirectoryView } from './components/SupplierDirectoryView';
import { YieldCalculatorView } from './components/YieldCalculatorView';
import { FarmerGuidesView } from './components/FarmerGuidesView';
import { CompareDrawer } from './components/CompareDrawer';
import { InquiryQuoteModal } from './components/InquiryQuoteModal';
import { PriceAlertModal } from './components/PriceAlertModal';
import { DealerRegistrationModal } from './components/DealerRegistrationModal';
import {
  INITIAL_RUBBER_PRICES,
  TAPPING_MACHINES,
  TAPPING_MACHINE_UPDATES,
  EQUIPMENT_SUPPLIERS,
  SUPPORTED_REGIONS,
  MarketRegion,
  INITIAL_PRICE_ALERTS,
  FARMER_GUIDES,
} from './data/mockData';
import { CommodityType, EquipmentSupplier, PriceAlert, TappingMachine } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'prices' | 'machines' | 'suppliers' | 'calculator' | 'guides'>('home');
  const [selectedRegion, setSelectedRegion] = useState<MarketRegion>(SUPPORTED_REGIONS[0]);
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>(['agritap-4x-pro', 'treerobo-t500']);
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false);

  // Modals state
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isDealerModalOpen, setIsDealerModalOpen] = useState(false);
  const [targetQuoteMachine, setTargetQuoteMachine] = useState<TappingMachine | null>(null);
  const [targetQuoteSupplier, setTargetQuoteSupplier] = useState<EquipmentSupplier | null>(null);

  // Alerts
  const [alerts, setAlerts] = useState<PriceAlert[]>(INITIAL_PRICE_ALERTS);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculator prefill
  const [calcPrice, setCalcPrice] = useState<number>(194.5);
  const [calcCommodity, setCalcCommodity] = useState<CommodityType>('RSS-4');

  // Handle URL query parameters (e.g. ?tab=prices or ?page=machines)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') || params.get('page');
    if (
      tabParam === 'home' ||
      tabParam === 'prices' ||
      tabParam === 'machines' ||
      tabParam === 'suppliers' ||
      tabParam === 'calculator' ||
      tabParam === 'guides'
    ) {
      setActiveTab(tabParam as any);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleToggleCompare = (machineId: string) => {
    setSelectedCompareIds((prev) => {
      if (prev.includes(machineId)) {
        return prev.filter((id) => id !== machineId);
      }
      if (prev.length >= 3) {
        showToast('Maximum 3 machines can be compared simultaneously.');
        return prev;
      }
      return [...prev, machineId];
    });
  };

  const handleRemoveCompare = (machineId: string) => {
    setSelectedCompareIds((prev) => prev.filter((id) => id !== machineId));
  };

  const handleOpenDemoModal = (machine: TappingMachine) => {
    setTargetQuoteMachine(machine);
    setTargetQuoteSupplier(null);
    setIsQuoteModalOpen(true);
  };

  const handleOpenSupplierQuoteModal = (supplier: EquipmentSupplier) => {
    setTargetQuoteSupplier(supplier);
    setTargetQuoteMachine(null);
    setIsQuoteModalOpen(true);
  };

  const handleAddAlert = (newAlert: PriceAlert) => {
    setAlerts((prev) => [newAlert, ...prev]);
    showToast(`Price alert created for ${newAlert.commodity} at ₹${newAlert.targetPrice}/kg!`);
  };

  const handleToggleAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    showToast('Alert removed.');
  };

  const handleSwitchToCalculator = (commodity: CommodityType, price: number) => {
    setCalcCommodity(commodity);
    setCalcPrice(price);
    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const comparedMachinesList = TAPPING_MACHINES.filter((m) =>
    selectedCompareIds.includes(m.id)
  );

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl border border-stone-800 text-xs sm:text-sm flex items-center gap-2 max-w-md animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-auto text-stone-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Website Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAlertModal={() => setIsAlertModalOpen(true)}
        onOpenDealerModal={() => setIsDealerModalOpen(true)}
        compareCount={selectedCompareIds.length}
        onOpenCompare={() => setIsCompareDrawerOpen(true)}
      />

      {/* Tapping Weather & Turgor Advisory Banner */}
      <WeatherBanner />

      {/* Website Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'home' && (
          <HomeView
            prices={INITIAL_RUBBER_PRICES}
            machines={TAPPING_MACHINES}
            updates={TAPPING_MACHINE_UPDATES}
            suppliers={EQUIPMENT_SUPPLIERS}
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
            onNavigate={setActiveTab}
            onOpenAlertModal={() => setIsAlertModalOpen(true)}
            onOpenDealerModal={() => setIsDealerModalOpen(true)}
            onRequestQuote={handleOpenSupplierQuoteModal}
          />
        )}

        {activeTab === 'prices' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <button
                onClick={() => setActiveTab('home')}
                className="hover:text-emerald-700 transition-colors font-medium"
              >
                Home
              </button>
              <span aria-hidden="true">/</span>
              <span className="text-stone-800 font-semibold">Everyday Prices</span>
            </div>
            <MarketPricesView
              prices={INITIAL_RUBBER_PRICES}
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
              onOpenAlertModal={() => setIsAlertModalOpen(true)}
              onSwitchToCalculator={handleSwitchToCalculator}
              alerts={alerts}
              onToggleAlert={handleToggleAlert}
              onDeleteAlert={handleDeleteAlert}
            />
          </div>
        )}

        {activeTab === 'machines' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <button
                onClick={() => setActiveTab('home')}
                className="hover:text-emerald-700 transition-colors font-medium"
              >
                Home
              </button>
              <span aria-hidden="true">/</span>
              <span className="text-stone-800 font-semibold">Tapping Machines &amp; Updates</span>
            </div>
            <TappingMachinesView
              machines={TAPPING_MACHINES}
              updates={TAPPING_MACHINE_UPDATES}
              selectedCompareIds={selectedCompareIds}
              onToggleCompare={handleToggleCompare}
              onRequestDemo={handleOpenDemoModal}
              onOpenCompareDrawer={() => setIsCompareDrawerOpen(true)}
            />
          </div>
        )}

        {activeTab === 'suppliers' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <button
                onClick={() => setActiveTab('home')}
                className="hover:text-emerald-700 transition-colors font-medium"
              >
                Home
              </button>
              <span aria-hidden="true">/</span>
              <span className="text-stone-800 font-semibold">Equipment Suppliers Directory</span>
            </div>
            <SupplierDirectoryView
              suppliers={EQUIPMENT_SUPPLIERS}
              onRequestQuote={handleOpenSupplierQuoteModal}
            />
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <button
                onClick={() => setActiveTab('home')}
                className="hover:text-emerald-700 transition-colors font-medium"
              >
                Home
              </button>
              <span aria-hidden="true">/</span>
              <span className="text-stone-800 font-semibold">Yield &amp; Revenue Calculator</span>
            </div>
            <YieldCalculatorView
              initialPrice={calcPrice}
              initialCommodity={calcCommodity}
              currencySymbol={selectedRegion.currencySymbol}
            />
          </div>
        )}

        {activeTab === 'guides' && (
          <FarmerGuidesView
            guides={FARMER_GUIDES}
            onBackToHome={() => setActiveTab('home')}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      <CompareDrawer
        isOpen={isCompareDrawerOpen}
        onClose={() => setIsCompareDrawerOpen(false)}
        machines={comparedMachinesList}
        onRemove={handleRemoveCompare}
        onRequestQuote={handleOpenDemoModal}
      />

      <InquiryQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        targetMachine={targetQuoteMachine}
        targetSupplier={targetQuoteSupplier}
        onSubmitSuccess={showToast}
      />

      <PriceAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onAddAlert={handleAddAlert}
        currentRegionName={selectedRegion.name}
        currentPrices={INITIAL_RUBBER_PRICES.map((p) => ({
          commodity: p.commodity,
          price: p.currentPrice,
        }))}
      />

      <DealerRegistrationModal
        isOpen={isDealerModalOpen}
        onClose={() => setIsDealerModalOpen(false)}
        onSubmitSuccess={showToast}
      />

      {/* Comprehensive Website Footer */}
      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-12 pb-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Brand & Mission */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-stone-950 font-bold">
                  <svg className="w-4 h-4 text-stone-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-7.5c-.5 3.5-2 6-4 7.5S5 13 5 15a7 7 0 0 0 7 7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold tracking-tight text-white font-display">
                  Latex<span className="text-emerald-400">Pulse</span>
                </span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                The independent natural rubber market intelligence and mechanization platform for smallholders, planters, and equipment dealers across Kerala, Tripura, and Southeast Asia.
              </p>
              <div className="text-[11px] text-stone-500">
                Official Spot Rates referenced with Rubber Board of India &amp; International MRB/SICOM benchmarks.
              </div>
            </div>

            {/* Column 2: Platform Links */}
            <div className="space-y-3 text-xs">
              <div className="font-bold text-white uppercase tracking-wider font-display">
                Rubber Planter Tools
              </div>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => { setActiveTab('prices'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors">
                    Everyday Spot Prices &amp; RSS-4 Board
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('machines'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors">
                    Tapping Machine Models &amp; Bulletins
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('suppliers'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors">
                    Local Equipment Supplier Directory
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('calculator'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors">
                    Latex Yield &amp; Revenue Calculator
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('guides'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors">
                    Agronomy Research &amp; Field Guides
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Agricultural Belts Covered */}
            <div className="space-y-3 text-xs">
              <div className="font-bold text-white uppercase tracking-wider font-display">
                Regional Hubs Covered
              </div>
              <ul className="space-y-1.5 text-stone-400">
                <li>🇮🇳 Kottayam, Pathanamthitta &amp; Palakkad (Kerala)</li>
                <li>🇮🇳 Kanchrapara &amp; Agartala (North East India)</li>
                <li>🇹🇭 Surat Thani, Songkhla &amp; Hat Yai (Thailand)</li>
                <li>🇲🇾 Kuala Lumpur MRB Benchmark (Malaysia)</li>
                <li>🇸🇬 Singapore SICOM TSR-20 Global Contract</li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => setIsDealerModalOpen(true)}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                >
                  Apply to list your agricultural dealership →
                </button>
              </div>
            </div>

            {/* Column 4: Daily WhatsApp Price Broadcast */}
            <div className="space-y-3 text-xs">
              <div className="font-bold text-white uppercase tracking-wider font-display">
                Daily Price Broadcast
              </div>
              <p className="text-stone-400 text-xs leading-relaxed">
                Receive the morning 07:00 AM Rubber Board rates delivered directly to your WhatsApp or SMS.
              </p>
              <button
                onClick={() => setIsAlertModalOpen(true)}
                className="w-full py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-lg transition-colors text-center shadow-sm"
              >
                Subscribe to Price Alerts
              </button>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
            <div>
              &copy; {new Date().getFullYear()} LatexPulse. All Rights Reserved. Built for rubber farming communities.
            </div>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span aria-hidden="true">·</span>
              <span>Terms of Service</span>
              <span aria-hidden="true">·</span>
              <span>Commodity Disclaimer</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
