import React, { useState } from 'react';
import { CommodityType, YieldCalculationInput } from '../types';
import { calculateRubberYield } from '../utils/rubberMath';

interface YieldCalculatorViewProps {
  initialPrice?: number;
  initialCommodity?: CommodityType;
  currencySymbol: string;
}

export const YieldCalculatorView: React.FC<YieldCalculatorViewProps> = ({
  initialPrice = 194.5,
  initialCommodity = 'RSS-4',
  currencySymbol,
}) => {
  const [inputs, setInputs] = useState<YieldCalculationInput>({
    treeCount: 450,
    drcPercentage: 33,
    latexGramsPerTree: 75,
    tappingDaysPerMonth: 14,
    pricePerKgDry: initialPrice,
  });

  const [tapperType, setTapperType] = useState<'traditional' | 'electric_knife' | 'automated_robot'>('electric_knife');

  // Multiplier for mechanization: precision electric knife yields ~12% more DRC through uniform depth, robotic yields ~18% through pre-dawn 2:30 AM biological timing
  const yieldEfficiencyMultiplier =
    tapperType === 'electric_knife' ? 1.12 : tapperType === 'automated_robot' ? 1.18 : 1.0;

  const baselineResult = calculateRubberYield(inputs);
  const adjustedDailyKg = Number((baselineResult.dailyDryRubberKg * yieldEfficiencyMultiplier).toFixed(2));
  const adjustedMonthlyKg = Number((baselineResult.monthlyDryRubberKg * yieldEfficiencyMultiplier).toFixed(2));
  const adjustedDailyRevenue = Number((adjustedDailyKg * inputs.pricePerKgDry).toFixed(2));
  const adjustedMonthlyRevenue = Number((adjustedMonthlyKg * inputs.pricePerKgDry).toFixed(2));

  const monthlyGain = Number((adjustedMonthlyRevenue - baselineResult.grossMonthlyRevenue).toFixed(2));

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="pb-2 border-b border-stone-200">
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
          <span>Plantation Economics & DRC Calculator</span>
          <span aria-hidden="true">·</span>
          <span>Field Latex, Cup Lump & Smoked Sheet Revenue Estimator</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight font-display">
          Rubber Yield & Revenue Calculator
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Parameters Box */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 space-y-5 shadow-2xs">
          <h2 className="text-lg font-bold text-stone-900 font-display">
            Farm Yield Parameters
          </h2>

          {/* Preset Buttons for Tree Count */}
          <div>
            <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5">
              <label htmlFor="tree-count-input" className="font-semibold text-stone-900">
                Number of Tapping Trees
              </label>
              <span className="font-mono tabular-nums font-bold text-stone-900">
                {inputs.treeCount} trees
              </span>
            </div>
            <input
              id="tree-count-input"
              type="range"
              min="50"
              max="2500"
              step="25"
              value={inputs.treeCount}
              onChange={(e) => setInputs({ ...inputs, treeCount: Number(e.target.value) })}
              className="w-full accent-emerald-600"
            />
            <div className="flex gap-2 mt-2">
              {[200, 450, 800, 1500].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setInputs({ ...inputs, treeCount: count })}
                  className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                    inputs.treeCount === count
                      ? 'bg-stone-900 text-white font-bold border-stone-900'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                  }`}
                >
                  {count} trees
                </button>
              ))}
            </div>
          </div>

          {/* Average Latex Grams per Tree */}
          <div>
            <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5">
              <label htmlFor="latex-grams-input" className="font-semibold text-stone-900">
                Average Latex Yield per Tree
              </label>
              <span className="font-mono tabular-nums font-bold text-stone-900">
                {inputs.latexGramsPerTree} grams
              </span>
            </div>
            <input
              id="latex-grams-input"
              type="range"
              min="30"
              max="150"
              step="5"
              value={inputs.latexGramsPerTree}
              onChange={(e) => setInputs({ ...inputs, latexGramsPerTree: Number(e.target.value) })}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-stone-400 mt-1">
              <span>Low (40g)</span>
              <span>Average (75g - RRII 105)</span>
              <span>High Peak (120g+)</span>
            </div>
          </div>

          {/* DRC Percentage Slider */}
          <div>
            <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5">
              <label htmlFor="drc-input" className="font-semibold text-stone-900">
                Dry Rubber Content (DRC)
              </label>
              <span className="font-mono tabular-nums font-bold text-stone-900">
                {inputs.drcPercentage}% DRC
              </span>
            </div>
            <input
              id="drc-input"
              type="range"
              min="20"
              max="65"
              step="1"
              value={inputs.drcPercentage}
              onChange={(e) => setInputs({ ...inputs, drcPercentage: Number(e.target.value) })}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-stone-400 mt-1">
              <span>Field Latex (~32-34%)</span>
              <span>Cup Lump (~50%)</span>
              <span>Latex Concentrate (60%)</span>
            </div>
          </div>

          {/* Monthly Tapping Days */}
          <div>
            <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5">
              <label htmlFor="days-input" className="font-semibold text-stone-900">
                Tapping Days per Month
              </label>
              <span className="font-mono tabular-nums font-bold text-stone-900">
                {inputs.tappingDaysPerMonth} days
              </span>
            </div>
            <input
              id="days-input"
              type="range"
              min="6"
              max="26"
              step="1"
              value={inputs.tappingDaysPerMonth}
              onChange={(e) => setInputs({ ...inputs, tappingDaysPerMonth: Number(e.target.value) })}
              className="w-full accent-emerald-600"
            />
            <div className="text-[11px] text-stone-500 mt-1">
              Standard d2 alternate day system = 14 to 15 days/month.
            </div>
          </div>

          {/* Current Selling Price */}
          <div>
            <label htmlFor="price-input" className="block text-xs font-semibold text-stone-900 mb-1">
              Selling Price per Dry Kg ({currencySymbol}/kg)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-stone-400 font-mono text-sm">
                {currencySymbol}
              </span>
              <input
                id="price-input"
                type="number"
                step="0.5"
                value={inputs.pricePerKgDry}
                onChange={(e) => setInputs({ ...inputs, pricePerKgDry: Number(e.target.value) })}
                className="w-full pl-8 pr-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-mono tabular-nums font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Mechanization Method Selector */}
          <div className="pt-2 border-t border-stone-100">
            <span className="block text-xs font-semibold text-stone-900 mb-2">
              Tapping Technology Mode
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'traditional', label: 'Traditional Knife', desc: 'Baseline' },
                { id: 'electric_knife', label: 'Electric Knife', desc: '+12% yield' },
                { id: 'automated_robot', label: 'Robotic Collar', desc: '+18% pre-dawn' },
              ].map((tech) => (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => setTapperType(tech.id as any)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    tapperType === tech.id
                      ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500'
                      : 'bg-white border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="text-xs font-bold text-stone-900">{tech.label}</div>
                  <div className="text-[10px] text-emerald-800 font-medium mt-0.5">{tech.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projected Revenue & Output Cards */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-white rounded-2xl p-6 sm:p-8 border border-stone-800 shadow-xl space-y-6">
            <div className="border-b border-stone-800 pb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Financial Projection
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white font-display mt-1">
                Estimated Farm Revenue
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-stone-900/80 p-4 rounded-xl border border-stone-800">
                <div className="text-xs text-stone-400">Daily Gross Revenue</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums mt-1">
                  {currencySymbol}{adjustedDailyRevenue.toLocaleString()}
                </div>
                <div className="text-[11px] text-stone-400 mt-1">
                  from {adjustedDailyKg} kg dry rubber
                </div>
              </div>

              <div className="bg-stone-900/80 p-4 rounded-xl border border-stone-800">
                <div className="text-xs text-stone-400">Monthly Projected Crop</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums mt-1">
                  {currencySymbol}{adjustedMonthlyRevenue.toLocaleString()}
                </div>
                <div className="text-[11px] text-stone-400 mt-1">
                  over {inputs.tappingDaysPerMonth} tapping days
                </div>
              </div>
            </div>

            {/* Production Breakdown Breakdown */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                Daily Physical Harvest Breakdown
              </div>

              <div className="bg-stone-950/60 p-4 rounded-xl border border-stone-800/80 space-y-2 text-xs">
                <div className="flex justify-between items-center text-stone-300">
                  <span>Total Wet Latex Collected:</span>
                  <span className="font-mono tabular-nums font-bold text-white">
                    {baselineResult.dailyWetLatexKg} kg / day
                  </span>
                </div>
                <div className="flex justify-between items-center text-stone-300">
                  <span>Dry Rubber Equivalent ({inputs.drcPercentage}% DRC):</span>
                  <span className="font-mono tabular-nums font-bold text-emerald-400">
                    {adjustedDailyKg} kg / day
                  </span>
                </div>
                <div className="flex justify-between items-center text-stone-300">
                  <span>Monthly Dry Sheet / Block Output:</span>
                  <span className="font-mono tabular-nums font-bold text-white">
                    {adjustedMonthlyKg} kg / month
                  </span>
                </div>
              </div>
            </div>

            {/* Mechanization ROI Comparison */}
            {tapperType !== 'traditional' && (
              <div className="bg-emerald-950/70 border border-emerald-800/80 p-4 rounded-xl text-xs space-y-1 text-emerald-200">
                <div className="font-bold text-emerald-300">
                  Mechanization Advantage:
                </div>
                <p>
                  By switching to {tapperType === 'electric_knife' ? 'Motorized Electric Knife' : 'Autonomous Robotic Tapping'}, you gain an estimated additional{' '}
                  <strong className="text-white font-mono tabular-nums">
                    +{currencySymbol}{monthlyGain.toLocaleString()} / month
                  </strong>{' '}
                  in latex yield due to optimized shaving depth and reduced cambium damage.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
