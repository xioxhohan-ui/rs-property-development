'use client';

import React, { useState } from 'react';
import ListingGrid from './ListingGrid';

interface ListingPageTemplateProps {
  title: string;
  subtitle: string;
  category: string;
  collectionName?: string;
}

const PROPERTY_TYPES = ['Property Type', 'Residential', 'Commercial', 'Agricultural', 'Industrial', 'Plot', 'Flat', 'Duplex', 'Studio', 'Shop'];
const DISTRICTS = ['District', 'Dhaka', 'Gazipur', 'Narayanganj', 'Purbachal', 'Uttara', 'Mirpur', 'Gulshan', 'Banani', 'Dhanmondi', 'Bashundhara', 'Sylhet', 'Chattogram', 'Khulna', 'Rajshahi', 'Barishal', 'Mymensingh'];
const PRICE_RANGES = ['Price Range', 'Under 10 Lac', '10–50 Lac', '50 Lac–1 Crore', '1–2 Crore', '2–5 Crore', '5 Crore+'];
const SORTS = [{ value: 'newest', label: 'Newest' }, { value: 'oldest', label: 'Oldest' }, { value: 'featured', label: 'Featured' }, { value: 'verified', label: 'Verified' }];

export default function ListingPageTemplate({ title, subtitle, category, collectionName = 'properties' }: ListingPageTemplateProps) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('Property Type');
  const [selectedDistrict, setSelectedDistrict] = useState('District');
  const [selectedPrice, setSelectedPrice] = useState('Price Range');
  const [sortBy, setSortBy] = useState('newest');

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const hasFilters = search.trim() || selectedType !== 'Property Type' || selectedDistrict !== 'District' || selectedPrice !== 'Price Range';

  const clearAll = () => {
    setSearch('');
    setSelectedType('Property Type');
    setSelectedDistrict('District');
    setSelectedPrice('Price Range');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-[var(--secondary-color)] pt-[68px]">

      {/* ── Hero ── */}
      <div className="bg-brand-gradient pt-12 pb-24">
        <div className="container">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 leading-tight">{title}</h1>
          <p className="text-white/80 text-sm md:text-base max-w-xl">{subtitle}</p>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="container relative z-20 -mt-8">
        <div className="bg-white rounded-2xl md:rounded-full shadow-lg border border-[var(--border-color)] p-3 md:p-1.5 flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0">
          
          {/* Top Row: Search Input & Mobile Filter Toggle */}
          <div className="flex items-center flex-1 px-3 md:px-5 py-2 md:py-0 bg-[var(--secondary-color)]/50 md:bg-transparent rounded-xl md:rounded-none">
            <svg className="flex-shrink-0 mr-3" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9aafc4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by location, district..."
              className="w-full bg-transparent outline-none text-sm md:text-base text-[var(--text-color)] min-w-[100px]"
            />
            
            {/* Mobile Filter Toggle */}
            <button 
              className="md:hidden p-2 ml-2 bg-white rounded-lg shadow-sm border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)]"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            </button>
          </div>

          {/* Desktop & Collapsible Mobile Filters */}
          <div className={`w-full md:w-auto flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0 ${isMobileFilterOpen ? 'flex' : 'hidden md:flex'}`}>
            
            {/* Divider */}
            <div className="hidden md:block w-px h-7 bg-[var(--border-color)] mx-2 flex-shrink-0" />

            {/* Property Type */}
            <div className="relative flex-shrink-0 w-full md:w-auto">
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className={`w-full md:w-auto h-12 md:h-10 pl-4 pr-10 border border-[var(--border-color)] md:border-none rounded-xl md:rounded-none bg-[var(--secondary-color)]/50 md:bg-transparent appearance-none outline-none text-sm ${selectedType !== 'Property Type' ? 'text-[var(--accent-color)] font-semibold' : 'text-[var(--text-muted)] font-medium'}`}
              >
                {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-7 bg-[var(--border-color)] mx-2 flex-shrink-0" />

            {/* District */}
            <div className="relative flex-shrink-0 w-full md:w-auto">
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                className={`w-full md:w-auto h-12 md:h-10 pl-4 pr-10 border border-[var(--border-color)] md:border-none rounded-xl md:rounded-none bg-[var(--secondary-color)]/50 md:bg-transparent appearance-none outline-none text-sm ${selectedDistrict !== 'District' ? 'text-[var(--accent-color)] font-semibold' : 'text-[var(--text-muted)] font-medium'}`}
              >
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-7 bg-[var(--border-color)] mx-2 flex-shrink-0" />

            {/* Price Range */}
            <div className="relative flex-shrink-0 w-full md:w-auto">
              <select
                value={selectedPrice}
                onChange={e => setSelectedPrice(e.target.value)}
                className={`w-full md:w-auto h-12 md:h-10 pl-4 pr-10 border border-[var(--border-color)] md:border-none rounded-xl md:rounded-none bg-[var(--secondary-color)]/50 md:bg-transparent appearance-none outline-none text-sm ${selectedPrice !== 'Price Range' ? 'text-[var(--accent-color)] font-semibold' : 'text-[var(--text-muted)] font-medium'}`}
              >
                {PRICE_RANGES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
            </div>

            {/* Search Button */}
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full md:w-auto flex items-center justify-center gap-2 h-12 md:h-11 px-6 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white rounded-xl md:rounded-full font-semibold text-sm transition-colors mt-2 md:mt-0 md:ml-2 flex-shrink-0"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Search
            </button>
          </div>
        </div>

        {/* Active Tags Row */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {search.trim() && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--accent-color)]/10 text-[var(--accent-color)] text-xs font-semibold">
                🔍 "{search}" 
                <button onClick={() => setSearch('')} className="bg-transparent border-none text-[var(--accent-color)] text-sm leading-none ml-1">×</button>
              </span>
            )}
            {selectedType !== 'Property Type' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--light-accent)]/20 text-[var(--accent-color)] text-xs font-semibold">
                📂 {selectedType} 
                <button onClick={() => setSelectedType('Property Type')} className="bg-transparent border-none text-[var(--accent-color)] text-sm leading-none ml-1">×</button>
              </span>
            )}
            {selectedDistrict !== 'District' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--light-accent)]/20 text-[var(--accent-color)] text-xs font-semibold">
                📍 {selectedDistrict} 
                <button onClick={() => setSelectedDistrict('District')} className="bg-transparent border-none text-[var(--accent-color)] text-sm leading-none ml-1">×</button>
              </span>
            )}
            {selectedPrice !== 'Price Range' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--light-accent)]/20 text-[var(--accent-color)] text-xs font-semibold">
                💰 {selectedPrice} 
                <button onClick={() => setSelectedPrice('Price Range')} className="bg-transparent border-none text-[var(--accent-color)] text-sm leading-none ml-1">×</button>
              </span>
            )}
            <button onClick={clearAll} className="px-4 py-1.5 rounded-full bg-[var(--accent-color)] text-white text-xs font-semibold transition-colors hover:bg-[var(--accent-hover)]">
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Sort + Results Row ── */}
      <div className="container mt-8 mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-[var(--text-muted)]">
          Showing results for <strong className="text-[var(--accent-color)] font-semibold">{title}</strong>
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-muted)]">Sort:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="h-10 pl-3 pr-8 rounded-lg border-2 border-[var(--border-color)] bg-white text-[var(--accent-color)] text-sm font-semibold appearance-none outline-none cursor-pointer"
            >
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
          </div>
        </div>
      </div>

      {/* ── Listing Grid ── */}
      <div className="container pb-16">
        <ListingGrid
          filterCategory={category}
          collectionName={collectionName}
          search={search}
          filterType={selectedType === 'Property Type' ? '' : selectedType}
          filterDistrict={selectedDistrict === 'District' ? '' : selectedDistrict}
          priceRange={selectedPrice === 'Price Range' ? '' : selectedPrice}
          sortBy={sortBy}
        />
      </div>
    </div>
  );
}
