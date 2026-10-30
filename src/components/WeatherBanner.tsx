import React from 'react';

export const WeatherBanner: React.FC = () => {
  return (
    <div className="bg-stone-900/95 border-b border-stone-800 text-stone-200 py-2.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Today&apos;s Tapping Advisory: Favorable Condition</span>
          </div>
          <span className="text-stone-500 hidden sm:inline">|</span>
          <span className="text-stone-300">
            Pre-dawn Temp: <strong className="text-stone-100 font-mono tabular-nums">22°C</strong>
          </span>
          <span className="text-stone-500 hidden sm:inline">·</span>
          <span className="text-stone-300">
            Humidity: <strong className="text-stone-100 font-mono tabular-nums">88%</strong> (High Turgor Pressure)
          </span>
          <span className="text-stone-500 hidden sm:inline">·</span>
          <span className="text-stone-300">
            Rain Risk: <strong className="text-emerald-400 font-mono tabular-nums">5%</strong> (Safe for open cups)
          </span>
        </div>
        <div className="text-stone-400 text-[11px] sm:text-right">
          Optimal tapping window: <strong>03:00 AM – 06:30 AM</strong>
        </div>
      </div>
    </div>
  );
};
