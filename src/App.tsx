/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WeatherBanner } from './components/WeatherBanner';
import { MarketPricesView } from './components/MarketPricesView';
import { TappingMachinesView } from './components/TappingMachinesView';
import { SupplierDirectoryView } from './components/SupplierDirectoryView';
import { YieldCalculatorView } from './components/YieldCalculatorView';
import { CompareDrawer } from './components/CompareDrawer';
import { InquiryQuoteModal } from './components/InquiryQuoteModal';
import { PriceAlertModal } from './components/PriceAlertModal';
import {
  INITIAL_RUBBER_PRICES,
  TAPPING_MACHINES,
  TAPPING_MACHINE_UPDATES,
  EQUIPMENT_SUPPLIERS,
  SUPPORTED_REGIONS,
  MarketRegion,
  INITIAL_PRICE_ALERTS,
} from './data/mockData';
import { CommodityType, EquipmentSupplier, PriceAlert, TappingMachine } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'prices' | 'machines' | 'suppliers' | 'calculator'>('prices');
  const [selectedRegion, setSelectedRegion] = useState<MarketRegion>(SUPPORTED_REGIONS[0]);
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>(['agritap-4x-pro', 'treerobo-t500']);
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false);

  // Modals state
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [targetQuoteMachine, setTargetQuoteMachine] = useState<TappingMachine | null>(null);
  const [targetQuoteSupplier, setTargetQuoteSupplier] = useState<EquipmentSupplier | null>(null);

  // Alerts
  const [alerts, setAlerts] = useState<PriceAlert[]>(INITIAL_PRICE_ALERTS);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculator prefill
  const [calcPrice, setCalcPrice] = useState<number>(194.5);
  const [calcCommodity, setCalcCommodity] = useState<CommodityType>('RSS-4');

  // Handle URL query parameters (e.g. ?tab=machines)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'machines' || tabParam === 'suppliers' || tabParam === 'calculator' || tabParam === 'prices') {
      setActiveTab(tabParam);
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
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans">
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

      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAlertModal={() => setIsAlertModalOpen(true)}
        compareCount={selectedCompareIds.length}
        onOpenCompare={() => setIsCompareDrawerOpen(true)}
      />

      {/* Tapping Conditions Weather Banner */}
      <WeatherBanner />

      {/* Main Body Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'prices' && (
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
        )}

        {activeTab === 'machines' && (
          <TappingMachinesView
            machines={TAPPING_MACHINES}
            updates={TAPPING_MACHINE_UPDATES}
            selectedCompareIds={selectedCompareIds}
            onToggleCompare={handleToggleCompare}
            onRequestDemo={handleOpenDemoModal}
            onOpenCompareDrawer={() => setIsCompareDrawerOpen(true)}
          />
        )}

        {activeTab === 'suppliers' && (
          <SupplierDirectoryView
            suppliers={EQUIPMENT_SUPPLIERS}
            onRequestQuote={handleOpenSupplierQuoteModal}
          />
        )}

        {activeTab === 'calculator' && (
          <YieldCalculatorView
            initialPrice={calcPrice}
            initialCommodity={calcCommodity}
            currencySymbol={selectedRegion.currencySymbol}
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

      {/* Clean Domain Footer */}
      <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 text-xs py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white font-display text-sm">
                Latex<span className="text-emerald-400">Pulse</span>
              </span>
              <span>— Natural Rubber Farmer Price & Mechanization Portal</span>
            </div>

            <div className="flex items-center gap-6 text-stone-400">
              <button onClick={() => setActiveTab('prices')} className="hover:text-white transition-colors">
                Prices
              </button>
              <button onClick={() => setActiveTab('machines')} className="hover:text-white transition-colors">
                Tapping Machines
              </button>
              <button onClick={() => setActiveTab('suppliers')} className="hover:text-white transition-colors">
                Suppliers
              </button>
              <button onClick={() => setActiveTab('calculator')} className="hover:text-white transition-colors">
                Yield Calculator
              </button>
            </div>

            <div className="text-stone-500 text-[11px]">
              Daily data referenced with Rubber Board & Spot Auction benchmarks.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
