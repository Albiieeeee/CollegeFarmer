import React, { useState } from 'react';
import { EquipmentSupplier } from '../types';
import { filterSuppliers } from '../utils/rubberMath';

interface SupplierDirectoryViewProps {
  suppliers: EquipmentSupplier[];
  onRequestQuote: (supplier: EquipmentSupplier) => void;
}

export const SupplierDirectoryView: React.FC<SupplierDirectoryViewProps> = ({
  suppliers,
  onRequestQuote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'name'>('distance');
  const [selectedSupplierDetail, setSelectedSupplierDetail] = useState<EquipmentSupplier | null>(null);

  const filteredSuppliers = filterSuppliers(
    suppliers,
    searchQuery,
    categoryFilter,
    regionFilter,
    sortBy
  );

  // Derive unique categories and districts
  const allCategories = Array.from(
    new Set(suppliers.flatMap((s) => s.stockedCategories))
  );

  const allDistricts = Array.from(
    new Set(suppliers.map((s) => s.district))
  );

  return (
    <div className="space-y-8">
      {/* Directory Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>Verified Local Agricultural Machinery Network</span>
            <span aria-hidden="true">·</span>
            <span>Authorized Tapping Knives, Spares & Field Technicians</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight font-display">
            Directory of Local Equipment Suppliers
          </h1>
        </div>

        <div className="text-xs text-stone-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
          <strong className="text-emerald-950 font-bold">{filteredSuppliers.length} Dealers</strong> available near rubber smallholdings
        </div>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Text Search */}
          <div className="md:col-span-5 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by dealer name, town, spare blades, battery..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <svg className="w-4 h-4 text-stone-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
            </svg>
          </div>

          {/* Region / District Filter */}
          <div className="md:col-span-3">
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full text-xs sm:text-sm py-2 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              aria-label="Filter by district"
            >
              <option value="all">All Districts & States</option>
              {allDistricts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-4 flex items-center justify-between sm:justify-end gap-2">
            <span className="text-xs text-stone-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'distance' | 'rating' | 'name')}
              className="text-xs sm:text-sm py-2 px-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Sort suppliers"
            >
              <option value="distance">Nearest First</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-stone-100 pb-1">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-colors ${
              categoryFilter === 'all'
                ? 'bg-stone-900 text-white font-semibold'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            All Equipment Categories
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Suppliers Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="space-y-4">
              {/* Supplier Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                    <span className="font-semibold text-emerald-800">{supplier.businessType}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{supplier.distanceKm} km away</span>
                    {supplier.verifiedDealer && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verified Dealer
                        </span>
                      </>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-stone-900 font-display">
                    {supplier.name}
                  </h2>

                  <p className="text-xs text-stone-600 mt-1 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-stone-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{supplier.fullAddress}</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center justify-end gap-1 text-xs">
                    <span className="text-amber-500 text-sm">★</span>
                    <span className="font-bold text-stone-900 font-mono tabular-nums text-sm">{supplier.rating}</span>
                    <span className="text-stone-400">({supplier.reviewCount})</span>
                  </div>
                </div>
              </div>

              {/* Service Badges & Hours */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {supplier.offersOnSiteService && (
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200 font-medium">
                    🛠 On-site Plantation Technician
                  </span>
                )}
                {supplier.offersHomeDelivery && (
                  <span className="px-2.5 py-1 bg-stone-100 text-stone-800 rounded-md border border-stone-200 font-medium">
                    🚚 Farm Parcel Delivery
                  </span>
                )}
                <span className="text-stone-500 text-[11px]">
                  🕒 {supplier.openingHours}
                </span>
              </div>

              {/* Stocked Brands */}
              <div className="text-xs text-stone-600">
                <span className="font-semibold text-stone-700">Authorized Brands: </span>
                <span>{supplier.featuredBrands.join(', ')}</span>
              </div>

              {/* Inventory Highlights Table */}
              <div className="bg-stone-50 rounded-xl p-3 border border-stone-200">
                <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
                  Live Stock Highlights
                </div>
                <div className="space-y-1.5">
                  {supplier.inventoryHighlights.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${item.inStock ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                        <span className="text-stone-800 font-medium">{item.productName}</span>
                      </div>
                      <span className="font-mono tabular-nums font-semibold text-stone-900">
                        {item.estimatedPrice}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons: Call, WhatsApp, Request Quote */}
            <div className="pt-5 mt-5 border-t border-stone-100 grid grid-cols-3 gap-2">
              <a
                href={`tel:${supplier.phone.replace(/\s+/g, '')}`}
                className="py-2 px-3 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center justify-center gap-1 text-center"
              >
                <svg className="w-3.5 h-3.5 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Call</span>
              </a>

              <a
                href={`https://wa.me/${supplier.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello ${supplier.name}, I am a rubber farmer reaching out via LatexPulse app. I would like to inquire about rubber tapping machine models and spare parts in stock.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center justify-center gap-1 text-center"
              >
                <span>WhatsApp</span>
              </a>

              <button
                onClick={() => onRequestQuote(supplier)}
                className="py-2 px-3 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors text-center shadow-2xs"
              >
                Request Quote
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-stone-200">
          <p className="text-stone-500 text-sm">No equipment suppliers found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
              setRegionFilter('all');
            }}
            className="mt-3 text-xs font-bold text-emerald-700 underline"
          >
            Reset search and filters
          </button>
        </div>
      )}
    </div>
  );
};
