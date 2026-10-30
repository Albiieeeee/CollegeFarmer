import React, { useState } from 'react';
import { TappingMachine, TappingMachineUpdate } from '../types';
import { filterMachines } from '../utils/rubberMath';

interface TappingMachinesViewProps {
  machines: TappingMachine[];
  updates: TappingMachineUpdate[];
  selectedCompareIds: string[];
  onToggleCompare: (machineId: string) => void;
  onRequestDemo: (machine: TappingMachine) => void;
  onOpenCompareDrawer: () => void;
}

export const TappingMachinesView: React.FC<TappingMachinesViewProps> = ({
  machines,
  updates,
  selectedCompareIds,
  onToggleCompare,
  onRequestDemo,
  onOpenCompareDrawer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [activeSection, setActiveSection] = useState<'catalog' | 'updates'>('catalog');
  const [selectedUpdate, setSelectedUpdate] = useState<TappingMachineUpdate | null>(updates[0] || null);

  const filteredMachines = filterMachines(machines, searchQuery, typeFilter);

  return (
    <div className="space-y-8">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>Plantation Mechanization & Robotics</span>
            <span aria-hidden="true">·</span>
            <span>Cambium-Safe Motorized Knives & Robotic Tappers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight font-display">
            Rubber Tapping Machine Updates & Models
          </h1>
        </div>

        {/* Section Tabs: Catalog vs Tech Bulletins */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200">
            <button
              onClick={() => setActiveSection('catalog')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeSection === 'catalog'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Machine Catalog ({machines.length})
            </button>
            <button
              onClick={() => setActiveSection('updates')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                activeSection === 'updates'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>Field Updates & Bulletins</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </button>
          </div>

          {selectedCompareIds.length >= 2 && (
            <button
              onClick={onOpenCompareDrawer}
              className="px-3.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span>Compare Selected ({selectedCompareIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {activeSection === 'catalog' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models, brands (e.g. AgriTap, RoboHarvest, LED guide, cambium)..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <svg className="w-4 h-4 text-stone-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
              </svg>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { label: 'All Types', value: 'all' },
                { label: 'Handheld Electric', value: 'Handheld Electric' },
                { label: 'Tree-Mounted Robotic', value: 'Tree-Mounted Robotic' },
                { label: 'Semi-Automated', value: 'Semi-Automated Spiral' },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setTypeFilter(filter.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    typeFilter === filter.value
                      ? 'bg-stone-900 text-white font-semibold'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Innovation Alert Strip */}
          <div className="bg-emerald-950 text-emerald-100 p-4 rounded-xl border border-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center shrink-0 text-emerald-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-xs">
                <span className="font-bold text-white">Latest Tech Bulletin: </span>
                <span>Firmware v2.4 released with adaptive bark moisture sensing for rainy season tapping.</span>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveSection('updates');
                setSelectedUpdate(updates[0]);
              }}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 shrink-0"
            >
              Read Advisory →
            </button>
          </div>

          {/* Machine Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMachines.map((machine) => {
              const isCompared = selectedCompareIds.includes(machine.id);

              return (
                <div
                  key={machine.id}
                  className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="space-y-4">
                    {/* Machine Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                          <span className="font-semibold text-emerald-800">{machine.brand}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{machine.modelCode}</span>
                          {machine.badge && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-emerald-700 font-medium">{machine.badge}</span>
                            </>
                          )}
                        </div>
                        <h2 className="text-xl font-bold text-stone-900 font-display">
                          {machine.name}
                        </h2>
                        <p className="text-xs text-stone-600 mt-1">
                          {machine.tagline}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-stone-900 font-mono tabular-nums">
                          {machine.priceRange}
                        </div>
                        <div className="flex items-center justify-end gap-1 text-xs text-stone-600 mt-0.5">
                          <span className="text-amber-500">★</span>
                          <span className="font-bold font-mono tabular-nums">{machine.rating}</span>
                          <span className="text-stone-400">({machine.reviewCount})</span>
                        </div>
                      </div>
                    </div>

                    {/* Machine Vector Illustration / Schematics Banner */}
                    <div className="w-full h-32 rounded-xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 p-4 relative overflow-hidden flex items-center justify-between text-white border border-stone-800">
                      <div className="space-y-1 z-10 max-w-[65%]">
                        <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold font-mono">
                          {machine.type}
                        </span>
                        <div className="text-sm font-bold text-stone-100 line-clamp-1">
                          {machine.cuttingDepthControl}
                        </div>
                        <div className="text-xs text-stone-300 line-clamp-1">
                          Shield: {machine.cambiumProtection}
                        </div>
                      </div>

                      {/* Schematic Graphic representation */}
                      <div className="w-24 h-24 rounded-full bg-emerald-950/80 border border-emerald-700/40 flex items-center justify-center shrink-0 shadow-inner">
                        {machine.type === 'Tree-Mounted Robotic' ? (
                          <svg className="w-12 h-12 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="7" y="2" width="10" height="20" rx="2" strokeDasharray="3 3" />
                            <circle cx="12" cy="12" r="5" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
                            <path d="M12 9v6m-3-3h6" />
                            <path d="M2 12h5m10 0h5" />
                          </svg>
                        ) : (
                          <svg className="w-12 h-12 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                            <circle cx="8" cy="16" r="1" fill="currentColor" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Technical Specifications Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs">
                      <div>
                        <div className="text-stone-500 text-[11px]">Tapping Speed</div>
                        <div className="font-bold text-stone-900 font-mono tabular-nums mt-0.5">
                          {machine.treesPerHour} trees/hr
                        </div>
                      </div>
                      <div>
                        <div className="text-stone-500 text-[11px]">Battery Life</div>
                        <div className="font-bold text-stone-900 font-mono tabular-nums mt-0.5">
                          {machine.batteryLife.split('(')[0].trim()}
                        </div>
                      </div>
                      <div>
                        <div className="text-stone-500 text-[11px]">Tool Weight</div>
                        <div className="font-bold text-stone-900 font-mono tabular-nums mt-0.5">
                          {machine.weightKg} kg
                        </div>
                      </div>
                      <div>
                        <div className="text-stone-500 text-[11px]">Warranty</div>
                        <div className="font-bold text-stone-900 font-mono tabular-nums mt-0.5">
                          {machine.warrantyMonths} Months
                        </div>
                      </div>
                    </div>

                    {/* Feature Checklist */}
                    <div className="space-y-1.5 pt-1">
                      {machine.keyFeatures.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Field Test Summary Quote */}
                    <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-100 text-xs text-emerald-950">
                      <strong>Field Trial Note: </strong>
                      <span>{machine.fieldTestingSummary}</span>
                    </div>
                  </div>

                  {/* Card Bottom CTA Actions */}
                  <div className="pt-5 mt-5 border-t border-stone-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => onToggleCompare(machine.id)}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
                        isCompared
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                          : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isCompared}
                        onChange={() => onToggleCompare(machine.id)}
                        className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 pointer-events-none"
                      />
                      <span>{isCompared ? 'Compared' : 'Add to Compare'}</span>
                    </button>

                    <button
                      onClick={() => onRequestDemo(machine)}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                    >
                      Book Farm Demo / Quote
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredMachines.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-stone-200">
              <p className="text-stone-500 text-sm">No tapping machines match your query.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('all');
                }}
                className="mt-3 text-xs font-bold text-emerald-700 underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Field Updates & Technical Bulletins View */}
      {activeSection === 'updates' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Bulletin List */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-sm font-bold text-stone-800 uppercase tracking-wider">
              Technical Advisory Feed
            </h2>
            {updates.map((update) => {
              const isSelected = selectedUpdate?.id === update.id;
              return (
                <div
                  key={update.id}
                  onClick={() => setSelectedUpdate(update)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all bg-white ${
                    isSelected
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="font-semibold text-emerald-800">{update.category}</span>
                    <span className="font-mono tabular-nums">{update.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-stone-900 font-display">
                    {update.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 mt-1">
                    {update.summary}
                  </p>
                  <div className="mt-2 text-[11px] text-stone-400 font-mono">
                    Ref: {update.version}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Bulletin Deep Dive */}
          {selectedUpdate && (
            <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="border-b border-stone-200 pb-4">
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                  <span className="font-bold text-emerald-800">{selectedUpdate.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{selectedUpdate.version}</span>
                  <span aria-hidden="true">·</span>
                  <span>Published {selectedUpdate.date}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
                  {selectedUpdate.title}
                </h3>
              </div>

              <div className="space-y-4 text-stone-700 text-sm leading-relaxed">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 font-medium text-stone-900 text-xs sm:text-sm">
                  {selectedUpdate.summary}
                </div>

                <p>{selectedUpdate.details}</p>

                <div className="pt-4 border-t border-stone-100">
                  <div className="text-xs font-bold text-stone-900 mb-2">Affected Machine Models:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedUpdate.affectedModels.map((model, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs font-semibold bg-stone-100 text-stone-800 rounded-md border border-stone-200"
                      >
                        {model}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <strong className="text-emerald-950">Need firmware upgrade or blade inspection?</strong>
                    <div className="text-emerald-800 mt-0.5">Visit an authorized local supplier for complimentary checkup.</div>
                  </div>
                  <button
                    onClick={() => {
                      const firstSupplier = document.getElementById('supplier-directory-nav');
                      if (firstSupplier) firstSupplier.click();
                    }}
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shrink-0"
                  >
                    Find Service Dealer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
