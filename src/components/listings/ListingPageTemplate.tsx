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

  const hasFilters = search.trim() || selectedType !== 'Property Type' || selectedDistrict !== 'District' || selectedPrice !== 'Price Range';

  const clearAll = () => {
    setSearch('');
    setSelectedType('Property Type');
    setSelectedDistrict('District');
    setSelectedPrice('Price Range');
    setSortBy('newest');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA', paddingTop: '68px' }}>

      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(135deg, #1E466B 0%, #1a5fa8 55%, #67BAF4 100%)', padding: '44px 0 80px' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'clamp(1.75rem,4vw,2.75rem)', fontWeight: 800, color: '#fff', margin: '0 0 10px', lineHeight: 1.2 }}>{title}</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px', margin: 0, maxWidth: '540px' }}>{subtitle}</p>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="container" style={{ marginTop: '-32px', position: 'relative', zIndex: 20 }}>
        <div className="listing-pill-bar" style={{
          background: '#fff',
          borderRadius: '999px',
          boxShadow: '0 4px 32px rgba(30,70,107,0.14)',
          border: '1px solid #e8edf2',
          display: 'flex',
          alignItems: 'center',
          padding: '6px 6px 6px 20px',
          gap: 0,
          flexWrap: 'nowrap',
          overflow: 'hidden',
        }}>
          {/* Search Icon + Input */}
          <div className="listing-pill-input-wrap" style={{ display: 'flex', alignItems: 'center', flex: '1 1 auto' }}>
            <svg style={{ flexShrink: 0, marginRight: '10px' }} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9aafc4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by location, district, or area..."
              style={{
                width: '100%',
                minWidth: '100px',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '14px',
                color: '#0D0D0D',
                fontFamily: 'Inter,sans-serif',
                padding: '8px 0',
              }}
            />
          </div>

          {/* Divider */}
          <div className="pill-divider" style={{ width: '1px', height: '28px', background: '#e2e8f0', margin: '0 4px', flexShrink: 0 }} />

          {/* Property Type */}
          <div style={{ position: 'relative', flexShrink: 0 }} className="listing-pill-select-wrap">
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              style={{
                height: '40px',
                paddingLeft: '14px',
                paddingRight: '32px',
                border: 'none',
                background: 'transparent',
                color: selectedType !== 'Property Type' ? '#1E466B' : '#64748b',
                fontSize: '13px',
                fontWeight: selectedType !== 'Property Type' ? 600 : 500,
                fontFamily: 'Inter,sans-serif',
                appearance: 'none',
                WebkitAppearance: 'none',
                cursor: 'pointer',
                outline: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <svg style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
          </div>

          {/* Divider */}
          <div className="pill-divider" style={{ width: '1px', height: '28px', background: '#e2e8f0', margin: '0 4px', flexShrink: 0 }} />

          {/* District */}
          <div style={{ position: 'relative', flexShrink: 0 }} className="listing-pill-select-wrap">
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              style={{
                height: '40px',
                paddingLeft: '14px',
                paddingRight: '32px',
                border: 'none',
                background: 'transparent',
                color: selectedDistrict !== 'District' ? '#1E466B' : '#64748b',
                fontSize: '13px',
                fontWeight: selectedDistrict !== 'District' ? 600 : 500,
                fontFamily: 'Inter,sans-serif',
                appearance: 'none',
                WebkitAppearance: 'none',
                cursor: 'pointer',
                outline: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <svg style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
          </div>

          {/* Divider */}
          <div className="pill-divider" style={{ width: '1px', height: '28px', background: '#e2e8f0', margin: '0 4px', flexShrink: 0 }} />

          {/* Price Range */}
          <div style={{ position: 'relative', flexShrink: 0 }} className="listing-pill-select-wrap">
            <select
              value={selectedPrice}
              onChange={e => setSelectedPrice(e.target.value)}
              style={{
                height: '40px',
                paddingLeft: '14px',
                paddingRight: '32px',
                border: 'none',
                background: 'transparent',
                color: selectedPrice !== 'Price Range' ? '#1E466B' : '#64748b',
                fontSize: '13px',
                fontWeight: selectedPrice !== 'Price Range' ? 600 : 500,
                fontFamily: 'Inter,sans-serif',
                appearance: 'none',
                WebkitAppearance: 'none',
                cursor: 'pointer',
                outline: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {PRICE_RANGES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <svg style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
          </div>

          {/* Search Button */}
          <button
            className="search-btn"
            style={{
              flexShrink: 0,
              marginLeft: '6px',
              height: '44px',
              padding: '0 22px',
              borderRadius: '999px',
              background: '#1E466B',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'Inter,sans-serif',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              whiteSpace: 'nowrap',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Search
          </button>
        </div>

        {/* ── Mobile Search Bar (stacked layout) ── */}
        {/* Active Tags Row */}
        {hasFilters && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px', alignItems: 'center' }}>
            {search.trim() && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '20px', background: 'rgba(30,70,107,0.1)', color: '#1E466B', fontSize: '12px', fontWeight: 600 }}>
                🔍 "{search}" <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1E466B', padding: 0, lineHeight: 1, fontSize: '14px' }}>×</button>
              </span>
            )}
            {selectedType !== 'Property Type' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '20px', background: 'rgba(103,186,244,0.15)', color: '#1E466B', fontSize: '12px', fontWeight: 600 }}>
                📂 {selectedType} <button onClick={() => setSelectedType('Property Type')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1E466B', padding: 0, lineHeight: 1, fontSize: '14px' }}>×</button>
              </span>
            )}
            {selectedDistrict !== 'District' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '20px', background: 'rgba(103,186,244,0.15)', color: '#1E466B', fontSize: '12px', fontWeight: 600 }}>
                📍 {selectedDistrict} <button onClick={() => setSelectedDistrict('District')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1E466B', padding: 0, lineHeight: 1, fontSize: '14px' }}>×</button>
              </span>
            )}
            {selectedPrice !== 'Price Range' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '20px', background: 'rgba(103,186,244,0.15)', color: '#1E466B', fontSize: '12px', fontWeight: 600 }}>
                💰 {selectedPrice} <button onClick={() => setSelectedPrice('Price Range')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1E466B', padding: 0, lineHeight: 1, fontSize: '14px' }}>×</button>
              </span>
            )}
            <button onClick={clearAll} style={{ padding: '5px 14px', borderRadius: '20px', background: '#1E466B', color: '#fff', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Sort + Results Row ── */}
      <div className="container" style={{ marginTop: '28px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#5a6a7a', fontFamily: 'Inter,sans-serif' }}>
          Showing results for <strong style={{ color: '#1E466B' }}>{title}</strong>
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: '#9aafc4', fontFamily: 'Inter,sans-serif' }}>Sort:</span>
          <div style={{ position: 'relative' }}>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                height: '36px', paddingLeft: '12px', paddingRight: '30px',
                borderRadius: '8px', border: '1.5px solid #e2e8f0',
                background: '#fff', color: '#1E466B',
                fontSize: '13px', fontWeight: 600, fontFamily: 'Inter,sans-serif',
                appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer', outline: 'none',
              }}
            >
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <svg style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#1E466B" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
          </div>
        </div>
      </div>

      {/* ── Listing Grid ── */}
      <div className="container" style={{ paddingBottom: '60px' }}>
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

      {/* ── Mobile Sticky Search Bar ── */}
      <style>{`
        @media (max-width: 640px) {
          .listing-pill-bar {
            border-radius: 14px !important;
            flex-direction: column !important;
            padding: 12px !important;
            gap: 10px !important;
          }
          .listing-pill-bar .pill-divider { display: none !important; }
          .listing-pill-bar select {
            width: 100% !important;
            border: 1.5px solid #e2e8f0 !important;
            border-radius: 9px !important;
            background: #F8FAFC !important;
            padding-left: 12px !important;
          }
          .listing-pill-bar .search-btn {
            width: 100% !important;
            justify-content: center !important;
            border-radius: 10px !important;
          }
          .listing-pill-input-wrap {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
