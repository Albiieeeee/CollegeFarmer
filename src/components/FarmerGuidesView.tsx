import React, { useState } from 'react';
import { FarmerGuide } from '../types';

interface FarmerGuidesViewProps {
  guides: FarmerGuide[];
  onBackToHome: () => void;
}

export const FarmerGuidesView: React.FC<FarmerGuidesViewProps> = ({
  guides,
  onBackToHome,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGuide, setActiveGuide] = useState<FarmerGuide | null>(guides[0] || null);

  const categories = ['all', 'Tapping Techniques', 'Bark Care & Cambium', 'Monsoon & Rain Guarding', 'Processing & DRC'];

  const filteredGuides = guides.filter((guide) => {
    const matchesCat = selectedCategory === 'all' || guide.category === selectedCategory;
    const matchesQuery =
      !searchQuery ||
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.keyTakeaways.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-8">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <button
              onClick={onBackToHome}
              className="hover:text-emerald-700 transition-colors font-medium"
            >
              Home
            </button>
            <span aria-hidden="true">/</span>
            <span>Knowledge Hub &amp; Agronomy</span>
            <span aria-hidden="true">·</span>
            <span>Smallholder Best Practices &amp; Field Studies</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight font-display">
            Rubber Farmer Technical Guides &amp; Research
          </h1>
        </div>

        <button
          onClick={onBackToHome}
          className="text-xs font-semibold text-stone-700 hover:text-stone-900 bg-white border border-stone-300 px-3 py-1.5 rounded-lg shadow-2xs self-start md:self-auto"
        >
          ← Back to Website Overview
        </button>
      </div>

      {/* Search and Category Filter */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides on pre-dawn turgor pressure, cambium shaving, rain guarding, DRC testing..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <svg className="w-4 h-4 text-stone-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
          </svg>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat === 'all' ? 'All Guides' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Articles List & Active Reading Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Guides Cards */}
        <div className="lg:col-span-5 space-y-4">
          {filteredGuides.map((guide) => {
            const isSelected = activeGuide?.id === guide.id;
            return (
              <div
                key={guide.id}
                onClick={() => setActiveGuide(guide)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-stone-200 hover:border-stone-300 hover:shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                  <span className="font-semibold text-emerald-800">{guide.category}</span>
                  <span className="font-mono">{guide.readTime}</span>
                </div>
                <h3 className="text-base font-bold text-stone-900 font-display">
                  {guide.title}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
                  {guide.summary}
                </p>
                <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                  <span>By {guide.author}</span>
                  <span>{guide.date}</span>
                </div>
              </div>
            );
          })}

          {filteredGuides.length === 0 && (
            <div className="text-center py-10 bg-white rounded-xl border border-stone-200 text-stone-500 text-sm">
              No agronomy guides matched your search keywords.
            </div>
          )}
        </div>

        {/* Right Column: Full Selected Guide */}
        {activeGuide && (
          <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                <span className="font-bold text-emerald-800">{activeGuide.category}</span>
                <span aria-hidden="true">·</span>
                <span>{activeGuide.readTime}</span>
                <span aria-hidden="true">·</span>
                <span>Published {activeGuide.date}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display leading-tight">
                {activeGuide.title}
              </h2>
              <div className="text-xs text-stone-500 mt-2">
                Authored by <strong className="text-stone-800">{activeGuide.author}</strong>
              </div>
            </div>

            {/* Quick Summary Callout */}
            <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200/80 text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
              {activeGuide.summary}
            </div>

            {/* Guide Body Paragraphs */}
            <div className="space-y-4 text-stone-700 text-sm leading-relaxed">
              {activeGuide.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Key Field Takeaways */}
            <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 space-y-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Farmer Field Checklist &amp; Takeaways:
              </h4>
              <ul className="space-y-1.5 pt-1">
                {activeGuide.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-800">
                    <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Related Action Box */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-stone-900 text-white p-4 rounded-xl">
              <div>
                <span className="font-bold text-emerald-400">Put this technique to work:</span>
                <div className="text-stone-300 mt-0.5">Explore tested electric knives &amp; robotic tappers with depth limiters.</div>
              </div>
              <button
                onClick={() => {
                  const machineTab = document.getElementById('nav-tapping-machines');
                  if (machineTab) machineTab.click();
                }}
                className="px-4 py-2 bg-emerald-400 text-stone-950 font-bold rounded-lg hover:bg-emerald-300 transition-colors shrink-0"
              >
                Browse Machinery →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
