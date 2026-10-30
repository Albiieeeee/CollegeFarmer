import React, { useState } from 'react';
import { CommodityType, RubberCommodityPrice, PriceAlert } from '../types';
import { MarketRegion, SUPPORTED_REGIONS } from '../data/mockData';

interface MarketPricesViewProps {
  prices: RubberCommodityPrice[];
  selectedRegion: MarketRegion;
  onSelectRegion: (region: MarketRegion) => void;
  onOpenAlertModal: () => void;
  onSwitchToCalculator: (commodity: CommodityType, price: number) => void;
  alerts: PriceAlert[];
  onToggleAlert: (id: string) => void;
  onDeleteAlert: (id: string) => void;
}

export const MarketPricesView: React.FC<MarketPricesViewProps> = ({
  prices,
  selectedRegion,
  onSelectRegion,
  onOpenAlertModal,
  onSwitchToCalculator,
  alerts,
  onToggleAlert,
  onDeleteAlert,
}) => {
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>(prices[0]?.id || '');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Convert prices based on selected region's currency and exchange rate multiplier
  const activePrices = prices.map((item) => {
    const rate = selectedRegion.exchangeRateToInr;
    const adjustedCurrent = Number((item.currentPrice / rate).toFixed(2));
    const adjustedPrevious = Number((item.previousPrice / rate).toFixed(2));
    const delta = Number((adjustedCurrent - adjustedPrevious).toFixed(2));
    const pct = item.changePct;

    return {
      ...item,
      displayPrice: adjustedCurrent,
      displayPrevious: adjustedPrevious,
      displayDelta: delta,
      displayPct: pct,
      displayUnit: `${selectedRegion.currencySymbol}/kg`,
      convertedHistory: item.sevenDayHistory.map((h) => ({
        ...h,
        price: Number((h.price / rate).toFixed(2)),
      })),
      convertedHigh: Number((item.weeklyHigh / rate).toFixed(2)),
      convertedLow: Number((item.weeklyLow / rate).toFixed(2)),
      convertedAvg: Number((item.monthlyAverage / rate).toFixed(2)),
    };
  });

  const selectedCommodity = activePrices.find((p) => p.id === selectedCommodityId) || activePrices[0];

  return (
    <div className="space-y-8">
      {/* Page Title & Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-stone-500 mb-1">
            <span>Natural Rubber Daily Benchmarks</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Official Spot Auction &amp; Board Rates</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="text-emerald-700 font-medium">Updated 06:30 AM IST</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight font-display">
            Everyday Rubber Market Prices
          </h1>
        </div>

        {/* Region & View Mode Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-lg border border-stone-200">
            <span className="text-xs text-stone-500 pl-2 pr-1 font-medium">Market:</span>
            <select
              value={selectedRegion.id}
              onChange={(e) => {
                const reg = SUPPORTED_REGIONS.find((r) => r.id === e.target.value);
                if (reg) onSelectRegion(reg);
              }}
              className="text-xs font-semibold bg-white text-stone-800 py-1.5 px-2.5 rounded-md border border-stone-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Select rubber market region"
            >
              {SUPPORTED_REGIONS.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name} ({region.currencyCode})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white text-stone-900 shadow-sm font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Cards & Charts
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-stone-900 shadow-sm font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Data Table
            </button>
          </div>
        </div>
      </div>

      {/* Featured Headline Benchmark Card */}
      {selectedCommodity && (
        <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-stone-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span className="uppercase tracking-wider font-semibold text-emerald-400">
                  Spotlight Commodity
                </span>
                <span aria-hidden="true">·</span>
                <span>{selectedCommodity.region}</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
                  {selectedCommodity.commodity}
                </h2>
                <p className="text-sm text-stone-300 mt-1">
                  {selectedCommodity.gradeDescription}
                </p>
              </div>

              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight font-mono tabular-nums text-emerald-400">
                  {selectedRegion.currencySymbol}{selectedCommodity.displayPrice.toFixed(2)}
                </span>
                <span className="text-sm font-medium text-stone-400">/ kg</span>

                <div
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold font-mono tabular-nums ${
                    selectedCommodity.displayDelta >= 0
                      ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                      : 'bg-rose-900/60 text-rose-300 border border-rose-700/50'
                  }`}
                >
                  <span>
                    {selectedCommodity.displayDelta >= 0 ? '+' : ''}
                    {selectedCommodity.displayDelta.toFixed(2)}
                  </span>
                  <span>({selectedCommodity.displayPct >= 0 ? '+' : ''}{selectedCommodity.displayPct}%)</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-800/80 text-xs">
                <div>
                  <div className="text-stone-400">7-Day High</div>
                  <div className="font-semibold text-stone-200 font-mono tabular-nums mt-0.5">
                    {selectedRegion.currencySymbol}{selectedCommodity.convertedHigh.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-stone-400">7-Day Low</div>
                  <div className="font-semibold text-stone-200 font-mono tabular-nums mt-0.5">
                    {selectedRegion.currencySymbol}{selectedCommodity.convertedLow.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-stone-400">Market Tone</div>
                  <div className="font-semibold text-emerald-300 mt-0.5">
                    {selectedCommodity.marketSentiment}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    onSwitchToCalculator(selectedCommodity.commodity, selectedCommodity.displayPrice)
                  }
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="4" y="2" width="16" height="20" rx="2" strokeWidth="2" />
                    <line x1="8" y1="6" x2="16" y2="6" strokeWidth="2" />
                    <line x1="16" y1="14" x2="16" y2="18" strokeWidth="2" />
                    <line x1="8" y1="10" x2="10" y2="10" strokeWidth="2" />
                    <line x1="14" y1="10" x2="16" y2="10" strokeWidth="2" />
                  </svg>
                  <span>Estimate Daily Farm Income</span>
                </button>

                <button
                  onClick={onOpenAlertModal}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span>Set Price SMS / WhatsApp Alert</span>
                </button>
              </div>
            </div>

            {/* 7-Day Trend Chart & History */}
            <div className="lg:col-span-7 bg-stone-950/70 p-5 rounded-xl border border-stone-800/80">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-stone-300">
                  7-Day Price Trend ({selectedRegion.currencyCode})
                </span>
                <span className="text-xs text-stone-400">
                  {selectedCommodity.convertedHistory[0]?.date} – {selectedCommodity.convertedHistory[selectedCommodity.convertedHistory.length - 1]?.date}
                </span>
              </div>

              {/* Render dynamic SVG Sparkline */}
              <div className="h-44 w-full relative">
                {(() => {
                  const history = selectedCommodity.convertedHistory;
                  const pricesArr = history.map((h) => h.price);
                  const min = Math.min(...pricesArr) * 0.985;
                  const max = Math.max(...pricesArr) * 1.015;
                  const range = max - min || 1;

                  const width = 500;
                  const height = 150;
                  const stepX = width / (history.length - 1);

                  const points = history.map((item, idx) => {
                    const x = idx * stepX;
                    const y = height - ((item.price - min) / range) * (height - 30) - 15;
                    return { x, y, ...item };
                  });

                  const pathD = points.reduce((acc, p, idx) => {
                    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
                  }, '');

                  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

                  return (
                    <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Area Fill */}
                      <path d={areaD} fill="url(#chartGradient)" />

                      {/* Line Stroke */}
                      <path d={pathD} fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                      {/* Data Dots and Labels */}
                      {points.map((pt, i) => (
                        <g key={i}>
                          <circle cx={pt.x} cy={pt.y} r="4" fill="#065f46" stroke="#34d399" strokeWidth="2" />
                          <text
                            x={pt.x}
                            y={height - 2}
                            textAnchor="middle"
                            fill="#a8a29e"
                            fontSize="10"
                            fontFamily="JetBrains Mono"
                          >
                            {pt.date}
                          </text>
                          <text
                            x={pt.x}
                            y={pt.y - 8}
                            textAnchor="middle"
                            fill="#f5f5f4"
                            fontSize="11"
                            fontWeight="bold"
                            fontFamily="JetBrains Mono"
                          >
                            {pt.price.toFixed(1)}
                          </text>
                        </g>
                      ))}
                    </svg>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Commodity Cards Grid */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activePrices.map((item) => {
            const isSelected = item.id === selectedCommodityId;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedCommodityId(item.id)}
                className={`p-5 rounded-xl border transition-all cursor-pointer bg-white ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-stone-200 hover:border-stone-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 font-display">
                      {item.commodity}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                      {item.gradeDescription}
                    </p>
                  </div>
                  <div
                    className={`inline-flex items-center text-xs font-bold font-mono tabular-nums px-2 py-0.5 rounded ${
                      item.displayDelta >= 0
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {item.displayDelta >= 0 ? '+' : ''}{item.displayDelta.toFixed(1)}
                  </div>
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-stone-900 font-mono tabular-nums">
                      {selectedRegion.currencySymbol}{item.displayPrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">/ kg</span>
                  </div>

                  <span className="text-xs text-stone-500 font-mono tabular-nums">
                    Prev: {selectedRegion.currencySymbol}{item.displayPrevious.toFixed(2)}
                  </span>
                </div>

                {/* 7-Day Mini Sparkline in Card */}
                <div className="mt-4 h-10 w-full">
                  {(() => {
                    const arr = item.convertedHistory.map((h) => h.price);
                    const min = Math.min(...arr);
                    const max = Math.max(...arr);
                    const range = max - min || 1;
                    const w = 180;
                    const h = 36;
                    const step = w / (arr.length - 1);
                    const pts = arr.map((val, idx) => ({
                      x: idx * step,
                      y: h - ((val - min) / range) * (h - 8) - 4,
                    }));
                    const d = pts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
                    return (
                      <svg className="w-full h-full" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
                        <path d={d} fill="none" stroke={item.displayDelta >= 0 ? '#10b981' : '#f43f5e'} strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    );
                  })()}
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="font-mono tabular-nums">
                    Range: {selectedRegion.currencySymbol}{item.convertedLow.toFixed(1)} - {selectedRegion.currencySymbol}{item.convertedHigh.toFixed(1)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSwitchToCalculator(item.commodity, item.displayPrice);
                    }}
                    className="text-emerald-700 hover:text-emerald-800 font-semibold"
                  >
                    Calculate Yield →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Commodity & Grade</th>
                  <th className="py-3.5 px-4 text-right">Today ({selectedRegion.currencyCode}/kg)</th>
                  <th className="py-3.5 px-4 text-right">Yesterday</th>
                  <th className="py-3.5 px-4 text-right">24h Change</th>
                  <th className="py-3.5 px-4 text-right">7-Day High</th>
                  <th className="py-3.5 px-4 text-right">7-Day Low</th>
                  <th className="py-3.5 px-4 text-center">Market Tone</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {activePrices.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedCommodityId(item.id)}
                    className="hover:bg-stone-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="font-bold text-stone-900">{item.commodity}</div>
                      <div className="text-xs text-stone-500">{item.gradeDescription}</div>
                    </td>
                    <td className="py-4 px-4 text-right font-mono tabular-nums font-bold text-base text-stone-900">
                      {selectedRegion.currencySymbol}{item.displayPrice.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono tabular-nums text-stone-600">
                      {selectedRegion.currencySymbol}{item.displayPrevious.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono tabular-nums">
                      <span
                        className={`inline-block font-semibold px-2 py-0.5 rounded text-xs ${
                          item.displayDelta >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {item.displayDelta >= 0 ? '+' : ''}{item.displayDelta.toFixed(2)} ({item.displayPct >= 0 ? '+' : ''}{item.displayPct}%)
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-mono tabular-nums text-stone-600">
                      {selectedRegion.currencySymbol}{item.convertedHigh.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono tabular-nums text-stone-600">
                      {selectedRegion.currencySymbol}{item.convertedLow.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-xs font-medium text-stone-700">{item.marketSentiment}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSwitchToCalculator(item.commodity, item.displayPrice);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded border border-emerald-200"
                      >
                        Calculate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Active Price Alerts Section */}
      <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-stone-900 font-display">
              Your Daily Price Target Alerts
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Get notified immediately via SMS or WhatsApp when auction rates cross your threshold.
            </p>
          </div>
          <button
            onClick={onOpenAlertModal}
            className="px-3.5 py-2 text-xs font-semibold text-stone-900 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors shadow-sm self-start sm:self-auto"
          >
            + New Price Alert
          </button>
        </div>

        {alerts.length === 0 ? (
          <div className="text-center py-6 text-stone-500 text-xs">
            No active alerts configured. Click &quot;+ New Price Alert&quot; to set your benchmark threshold.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white p-3.5 rounded-xl border border-stone-200 flex items-center justify-between shadow-2xs"
              >
                <div>
                  <div className="text-xs font-bold text-stone-900">{alert.commodity}</div>
                  <div className="text-xs text-stone-600 font-mono tabular-nums mt-0.5">
                    Target: {alert.direction === 'above' ? '≥' : '≤'} ₹{alert.targetPrice}/kg ({alert.notifyVia.toUpperCase()})
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">Set: {alert.createdAt}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleAlert(alert.id)}
                    className={`px-2 py-1 text-[11px] font-semibold rounded ${
                      alert.isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {alert.isActive ? 'Active' : 'Paused'}
                  </button>
                  <button
                    onClick={() => onDeleteAlert(alert.id)}
                    className="p-1 text-stone-400 hover:text-rose-600"
                    aria-label={`Delete alert for ${alert.commodity}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
