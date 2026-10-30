import React, { useState } from 'react';
import { CommodityType, EquipmentSupplier, RubberCommodityPrice, TappingMachine, TappingMachineUpdate } from '../types';
import { FARMER_GUIDES, FARMER_TESTIMONIALS, MarketRegion, SUPPORTED_REGIONS, WEBSITE_STATS } from '../data/mockData';
import { calculateRubberYield } from '../utils/rubberMath';

interface HomeViewProps {
  prices: RubberCommodityPrice[];
  machines: TappingMachine[];
  updates: TappingMachineUpdate[];
  suppliers: EquipmentSupplier[];
  selectedRegion: MarketRegion;
  onSelectRegion: (reg: MarketRegion) => void;
  onNavigate: (tab: 'prices' | 'machines' | 'suppliers' | 'calculator' | 'guides') => void;
  onOpenAlertModal: () => void;
  onOpenDealerModal: () => void;
  onRequestQuote: (supplier: EquipmentSupplier) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  prices,
  machines,
  updates,
  suppliers,
  selectedRegion,
  onSelectRegion,
  onNavigate,
  onOpenAlertModal,
  onOpenDealerModal,
  onRequestQuote,
}) => {
  // Quick mini calculator on homepage
  const [quickTreeCount, setQuickTreeCount] = useState(450);
  const benchmarkRss4 = prices[0]?.currentPrice || 194.5;
  const quickCalc = calculateRubberYield({
    treeCount: quickTreeCount,
    drcPercentage: 33,
    latexGramsPerTree: 75,
    tappingDaysPerMonth: 14,
    pricePerKgDry: benchmarkRss4,
  });

  return (
    <div className="space-y-16">
      {/* 1. Hero Section */}
      <section className="relative rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 text-white p-6 sm:p-10 lg:p-14 border border-stone-800 shadow-2xl overflow-hidden">
        {/* Subtle decorative background foliage contour pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-700/60 text-emerald-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Today&apos;s Natural Rubber Spot Board Benchmark: ₹{benchmarkRss4}/kg</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-white leading-tight">
            Transparent Rubber Prices &amp; <span className="text-emerald-400">Next-Gen Tapping</span> Machinery
          </h1>

          <p className="text-sm sm:text-lg text-stone-300 max-w-2xl leading-relaxed">
            The dedicated portal for rubber smallholders, estate owners, and tapping contractors. Track daily auction rates, discover cambium-safe motorized tapping tools &amp; robotics, and connect with certified local equipment dealerships.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('prices')}
              className="px-6 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-stone-950 text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <span>Explore Everyday Prices</span>
              <span>→</span>
            </button>

            <button
              onClick={() => onNavigate('machines')}
              className="px-6 py-3.5 bg-stone-800/90 hover:bg-stone-700 text-white border border-stone-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              <span>Tapping Machine Innovations</span>
            </button>

            <button
              onClick={() => onNavigate('suppliers')}
              className="px-6 py-3.5 bg-transparent hover:bg-stone-800/50 text-stone-300 hover:text-white border border-stone-800 text-xs sm:text-sm font-medium rounded-xl transition-colors"
            >
              <span>Find Local Suppliers</span>
            </button>
          </div>
        </div>

        {/* Hero KPI Summary Strip */}
        <div className="mt-10 pt-8 border-t border-stone-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {WEBSITE_STATS.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 tabular-nums">
                {stat.value}
              </div>
              <div className="text-xs text-stone-400 leading-snug">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Live Market Barometer Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
          <div>
            <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              Live Auction Feed
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
              Everyday Market Benchmarks
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedRegion.id}
              onChange={(e) => {
                const reg = SUPPORTED_REGIONS.find((r) => r.id === e.target.value);
                if (reg) onSelectRegion(reg);
              }}
              className="text-xs font-semibold bg-white text-stone-800 py-1.5 px-3 rounded-lg border border-stone-200 shadow-2xs focus:ring-2 focus:ring-emerald-500"
              aria-label="Select region"
            >
              {SUPPORTED_REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.currencyCode})
                </option>
              ))}
            </select>

            <button
              onClick={() => onNavigate('prices')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors whitespace-nowrap"
            >
              View Full Price Board →
            </button>
          </div>
        </div>

        {/* Grid of 4 Core Grades */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {prices.slice(0, 4).map((p) => {
            const converted = Number((p.currentPrice / selectedRegion.exchangeRateToInr).toFixed(2));
            const prevConverted = Number((p.previousPrice / selectedRegion.exchangeRateToInr).toFixed(2));
            const delta = Number((converted - prevConverted).toFixed(2));

            return (
              <div
                key={p.id}
                onClick={() => onNavigate('prices')}
                className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-stone-900 text-base font-display">{p.commodity}</h3>
                    <div className="text-[11px] text-stone-500 line-clamp-1">{p.gradeDescription}</div>
                  </div>
                  <span
                    className={`text-[11px] font-bold font-mono tabular-nums px-2 py-0.5 rounded ${
                      delta >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {delta >= 0 ? '+' : ''}{delta.toFixed(1)}
                  </span>
                </div>

                <div className="flex items-baseline gap-1 pt-1">
                  <span className="text-3xl font-extrabold text-stone-900 font-mono tabular-nums">
                    {selectedRegion.currencySymbol}{converted.toFixed(2)}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">/ kg</span>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span>Sentiment: <strong>{p.marketSentiment}</strong></span>
                  <span className="text-emerald-700 font-semibold">Track →</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Tapping Machine Mechanization Spotlight */}
      <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm space-y-8">
        <div className="max-w-3xl space-y-2">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            Mechanization &amp; Bark Care
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
            Why Modern Planters Are Upgrading from Michie Knives
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Traditional manual tapping relies entirely on tapper wrist fatigue and eye estimation. Modern electric knives and robotic collars guarantee uniform 1.1mm shavings, saving 34% tree bark and preventing destructive cambium wounds.
          </p>
        </div>

        {/* Feature Comparison Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">01. Traditional Gouge</div>
            <h3 className="text-lg font-bold text-stone-900 font-display">Manual Michie Knife</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Prone to operator wrist fatigue. Irregular bark thickness (1.8mm–2.4mm) leads to knotty renewal bark, reducing tree economic lifespan by up to 8 years.
            </p>
            <div className="text-xs font-mono text-stone-500 pt-2 border-t border-stone-200">
              Avg Speed: ~45 trees/hour
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3 relative">
            <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
              Most Popular
            </span>
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">02. Electric Tapper</div>
            <h3 className="text-lg font-bold text-stone-900 font-display">Smart Motorized Knives</h3>
            <p className="text-xs text-stone-700 leading-relaxed">
              Equipped with 0.8mm–1.8mm depth dials and capacitive auto-braking that freezes the blade in 0.02s before touching wood. Built-in LED guide for 3:00 AM tapping.
            </p>
            <div className="text-xs font-mono font-bold text-emerald-900 pt-2 border-t border-emerald-200">
              Avg Speed: 110–125 trees/hour (+14% yield)
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">03. Automated Collar</div>
            <h3 className="text-lg font-bold text-stone-900 font-display">Solar Robotic Tappers</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Tree-mounted solar collars that autonomously tap trees at 2:30 AM when botanical turgor pressure is at its absolute circadian peak, eliminating labor shortages.
            </p>
            <div className="text-xs font-mono text-stone-500 pt-2 border-t border-stone-200">
              Autonomy: 350 trees/hour pre-dawn
            </div>
          </div>
        </div>

        {/* Featured Machines Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {machines.slice(0, 2).map((m) => (
            <div
              key={m.id}
              className="p-6 rounded-2xl border border-stone-200 bg-stone-50 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span className="font-semibold text-emerald-800">{m.brand}</span>
                  <span className="font-bold font-mono text-stone-900">{m.priceRange}</span>
                </div>
                <h3 className="text-xl font-bold text-stone-900 font-display">{m.name}</h3>
                <p className="text-xs text-stone-600 mt-1">{m.tagline}</p>
                <div className="mt-3 text-xs text-stone-700 bg-white p-3 rounded-lg border border-stone-200">
                  <strong>Key Spec: </strong> {m.cuttingDepthControl} · {m.batteryLife.split('(')[0]}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => onNavigate('machines')}
                  className="text-xs font-bold text-stone-900 hover:text-emerald-700"
                >
                  View Machine Details &amp; Bulletins →
                </button>
                <button
                  onClick={() => onNavigate('suppliers')}
                  className="px-3.5 py-1.5 text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors"
                >
                  Find In-Stock Dealers
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Equipment Supplier Network Preview */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
          <div>
            <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              Verified Dealerships &amp; Spares
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
              Local Agricultural Machinery Suppliers
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDealerModal}
              className="text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg border border-stone-200 transition-colors"
            >
              + Register as Dealership
            </button>
            <button
              onClick={() => onNavigate('suppliers')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              Browse All Suppliers ({suppliers.length}) →
            </button>
          </div>
        </div>

        {/* 2 Featured Suppliers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suppliers.slice(0, 2).map((s) => (
            <div
              key={s.id}
              className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                    <span className="font-semibold text-emerald-800">{s.businessType}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 font-semibold">✓ Verified Dealer</span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 font-display">{s.name}</h3>
                  <p className="text-xs text-stone-600 mt-0.5">{s.fullAddress}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-stone-900">★ {s.rating}</div>
                  <div className="text-[11px] text-stone-400">({s.reviewCount} reviews)</div>
                </div>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1">
                <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  In-Stock Highlights:
                </div>
                {s.inventoryHighlights.slice(0, 2).map((inv, i) => (
                  <div key={i} className="flex justify-between text-stone-800">
                    <span>{inv.productName}</span>
                    <span className="font-mono font-semibold">{inv.estimatedPrice}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <a
                  href={`https://wa.me/${s.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello ${s.name}, I found your dealership on LatexPulse website and would like to inquire about rubber tapping machine models and spare blades.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
                >
                  <span>Inquire via WhatsApp</span>
                  <span>→</span>
                </a>

                <button
                  onClick={() => onRequestQuote(s)}
                  className="px-4 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors"
                >
                  Request Quote / Demo
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Interactive Farm Profit & Yield ROI Calculator Teaser */}
      <section className="bg-gradient-to-br from-stone-900 to-stone-950 text-white rounded-3xl p-6 sm:p-10 border border-stone-800 shadow-xl space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Interactive Plantation Planner
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-white">
              Calculate Your Monthly Rubber Revenue &amp; Crop Potential
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Estimate your monthly latex volume (DRC) and income based on tree count, field latex yield per tree, and today’s market spot rates.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-xs text-stone-300">
                <label htmlFor="quick-tree-count-slider" className="font-medium">Number of Tapping Trees</label>
                <span className="font-mono font-bold text-emerald-400 tabular-nums">
                  {quickTreeCount} trees
                </span>
              </div>
              <input
                id="quick-tree-count-slider"
                type="range"
                min="100"
                max="2000"
                step="50"
                value={quickTreeCount}
                onChange={(e) => setQuickTreeCount(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="flex gap-2">
                {[200, 450, 800, 1500].map((num) => (
                  <button
                    key={num}
                    onClick={() => setQuickTreeCount(num)}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                      quickTreeCount === num
                        ? 'bg-emerald-500 text-stone-950 font-bold border-emerald-500'
                        : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('calculator')}
                className="px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-stone-950 text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm"
              >
                Open Full Yield &amp; DRC Calculator →
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 bg-stone-900/90 p-6 rounded-2xl border border-stone-800 space-y-4">
            <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Projected Monthly Output (14 Days Tapping @ ₹{benchmarkRss4}/kg)
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-stone-950/70 p-4 rounded-xl border border-stone-800">
                <div className="text-xs text-stone-400">Monthly Dry Rubber</div>
                <div className="text-2xl font-bold font-mono text-white tabular-nums mt-1">
                  {quickCalc.monthlyDryRubberKg} kg
                </div>
                <div className="text-[11px] text-stone-400 mt-0.5">33% DRC basis</div>
              </div>

              <div className="bg-stone-950/70 p-4 rounded-xl border border-stone-800">
                <div className="text-xs text-stone-400">Projected Revenue</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-1">
                  ₹{quickCalc.grossMonthlyRevenue.toLocaleString()}
                </div>
                <div className="text-[11px] text-stone-400 mt-0.5">gross farm income</div>
              </div>
            </div>

            <div className="text-xs text-stone-300 bg-emerald-950/40 p-3 rounded-lg border border-emerald-800/40">
              💡 Upgrading to an electric knife with uniform 1.1mm depth typically boosts monthly dry rubber yield by <strong>+12% to +14%</strong> while extending tree harvest lifespan.
            </div>
          </div>
        </div>
      </section>

      {/* 6. Farmer Field Case Studies & Testimonials */}
      <section className="space-y-6">
        <div className="max-w-2xl space-y-1">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            Smallholder Case Studies
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
            Real Grower Results from Kerala &amp; Thailand
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FARMER_TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white p-6 rounded-2xl border border-stone-200 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-800 font-mono">{t.metrics}</span>
                  <span className="text-stone-400 font-medium">✓ Verified Smallholder</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 text-xs">
                <div className="font-bold text-stone-900 font-display">{t.farmerName}</div>
                <div className="text-stone-500 text-[11px]">{t.location}</div>
                <div className="text-emerald-700 font-mono text-[11px] mt-0.5">{t.holdingSize}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Farmer Guides & Knowledge Hub Spotlight */}
      <section className="bg-stone-50 rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
          <div>
            <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              Agronomy Knowledge Hub
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
              Technical Research &amp; Field Practices
            </h2>
          </div>
          <button
            onClick={() => onNavigate('guides')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            Explore All Agronomy Guides →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FARMER_GUIDES.slice(0, 2).map((g) => (
            <div
              key={g.id}
              onClick={() => onNavigate('guides')}
              className="bg-white p-6 rounded-2xl border border-stone-200 hover:border-emerald-500 cursor-pointer transition-all space-y-3 hover:shadow-md"
            >
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold text-emerald-800">{g.category}</span>
                <span className="font-mono">{g.readTime}</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 font-display">{g.title}</h3>
              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{g.summary}</p>
              <div className="pt-2 text-xs font-bold text-emerald-700 flex items-center gap-1">
                <span>Read Full Field Guide</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Daily Price Alert & SMS Broadcast Box */}
      <section className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-10 border border-emerald-900 shadow-xl">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Morning Auction Broadcast
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Never Miss a Rubber Market Spike
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
            Configure custom price targets for RSS-4, Field Latex, or TSR-20. Get immediate notifications delivered straight to your WhatsApp or SMS inbox when commodity boards release daily settlement rates.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenAlertModal}
              className="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-stone-950 text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm"
            >
              Set My Price Alerts Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
