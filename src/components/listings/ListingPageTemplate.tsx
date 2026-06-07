'use client';

import React, { useState } from 'react';
import ListingGrid from './ListingGrid';

interface ListingPageTemplateProps {
  title: string;
  subtitle: string;
  category: string;
  collectionName?: string;
}

const CATEGORIES = [
  'All Categories', 'Residential', 'Commercial', 'Agricultural',
  'Industrial', 'Plot', 'Flat', 'Duplex', 'Studio', 'Shop',
];

const LOCATIONS = [
  'All Locations', 'Dhaka', 'Gazipur', 'Narayanganj', 'Purbachal',
  'Uttara', 'Mirpur', 'Gulshan', 'Banani', 'Dhanmondi', 'Bashundhara',
  'Sylhet', 'Chattogram', 'Khulna', 'Rajshahi', 'Barishal', 'Mymensingh',
];

const SORTS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'featured', label: 'Featured First' },
  { value: 'verified', label: 'Verified Only' },
];

export default function ListingPageTemplate({
  title, subtitle, category, collectionName = 'properties'
}: ListingPageTemplateProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedPlace, setSelectedPlace] = useState('All Locations');
  const [sortBy, setSortBy] = useState('newest');

  const hasFilters = search || selectedCategory !== 'All Categories' || selectedPlace !== 'All Locations';

  const clearAll = () => {
    setSearch('');
    setSelectedCategory('All Categories');
    setSelectedPlace('All Locations');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: '#FAFAFA' }}>

      {/* ── Hero Banner ── */}
      <div style={{ background: 'linear-gradient(135deg, #1E466B 0%, #2563ab 60%, #67BAF4 100%)' }} className="mb-0">
        <div className="container py-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">{title}</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)' }} className="text-base md:text-lg max-w-2xl">{subtitle}</p>
        </div>
      </div>

      {/* ── Search + Filter Card (overlapping hero) ── */}
      <div className="container">
        <div
          className="rounded-2xl p-5 md:p-6 mb-10 -mt-6"
          style={{
            background: '#FFFFFF',
            boxShadow: '0 8px 40px rgba(30,70,107,0.15)',
            border: '1px solid #e2e8f0',
          }}
        >
          {/* Search Row */}
          <div className="relative mb-4">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg className="h-5 w-5" style={{ color: '#1E466B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Search ${title}... (title, area, district)`}
              className="w-full h-13 text-sm font-medium"
              style={{
                height: '52px',
                paddingLeft: '48px',
                paddingRight: search ? '44px' : '16px',
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                background: '#FAFAFA',
                color: '#0D0D0D',
                fontSize: '15px',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor = '#1E466B'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: '#1E466B' }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Dropdowns Row */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Category */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="appearance-none font-medium text-sm cursor-pointer"
                style={{
                  height: '44px',
                  paddingLeft: '14px',
                  paddingRight: '36px',
                  borderRadius: '10px',
                  border: selectedCategory !== 'All Categories' ? '2px solid #1E466B' : '1.5px solid #e2e8f0',
                  background: selectedCategory !== 'All Categories' ? 'rgba(30,70,107,0.06)' : '#FAFAFA',
                  color: selectedCategory !== 'All Categories' ? '#1E466B' : '#5a6a7a',
                  minWidth: '160px',
                  fontWeight: 500,
                }}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: '#1E466B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Location */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: '#67BAF4' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <select
                value={selectedPlace}
                onChange={e => setSelectedPlace(e.target.value)}
                className="appearance-none font-medium text-sm cursor-pointer"
                style={{
                  height: '44px',
                  paddingLeft: '36px',
                  paddingRight: '36px',
                  borderRadius: '10px',
                  border: selectedPlace !== 'All Locations' ? '2px solid #1E466B' : '1.5px solid #e2e8f0',
                  background: selectedPlace !== 'All Locations' ? 'rgba(30,70,107,0.06)' : '#FAFAFA',
                  color: selectedPlace !== 'All Locations' ? '#1E466B' : '#5a6a7a',
                  minWidth: '165px',
                  fontWeight: 500,
                }}
              >
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: '#1E466B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none font-medium text-sm cursor-pointer"
                style={{
                  height: '44px',
                  paddingLeft: '14px',
                  paddingRight: '36px',
                  borderRadius: '10px',
                  border: '1.5px solid #e2e8f0',
                  background: '#FAFAFA',
                  color: '#5a6a7a',
                  minWidth: '155px',
                  fontWeight: 500,
                }}
              >
                {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: '#1E466B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Clear All */}
            {hasFilters && (
              <button
                onClick={clearAll}
                className="h-11 px-4 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all"
                style={{ background: '#1E466B', color: '#fff' }}
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear
              </button>
            )}
          </div>

          {/* Active Tags */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
              {search && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(30,70,107,0.1)', color: '#1E466B' }}>
                  🔍 "{search}"
                  <button onClick={() => setSearch('')} className="ml-0.5 hover:opacity-70">×</button>
                </span>
              )}
              {selectedCategory !== 'All Categories' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(103,186,244,0.15)', color: '#1E466B' }}>
                  📂 {selectedCategory}
                  <button onClick={() => setSelectedCategory('All Categories')} className="ml-0.5 hover:opacity-70">×</button>
                </span>
              )}
              {selectedPlace !== 'All Locations' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(103,186,244,0.15)', color: '#1E466B' }}>
                  📍 {selectedPlace}
                  <button onClick={() => setSelectedPlace('All Locations')} className="ml-0.5 hover:opacity-70">×</button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Grid */}
        <ListingGrid
          filterCategory={category}
          collectionName={collectionName}
          search={search}
          filterType={selectedCategory === 'All Categories' ? '' : selectedCategory}
          filterDistrict={selectedPlace === 'All Locations' ? '' : selectedPlace}
          sortBy={sortBy}
        />
      </div>
    </div>
  );
}
