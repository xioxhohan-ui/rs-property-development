'use client';

import React, { useState, useMemo } from 'react';
import ListingGrid from './ListingGrid';

interface ListingPageTemplateProps {
  title: string;
  subtitle: string;
  category: string;
  collectionName?: string;
}

export default function ListingPageTemplate({ title, subtitle, category, collectionName = 'properties' }: ListingPageTemplateProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPlace, setSelectedPlace] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
      <div className="container">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">{title}</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">{subtitle}</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-border shadow-sm p-4 mb-8">
          {/* Search Input */}
          <div className="relative mb-4">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
              className="w-full pl-12 pr-4 h-12 rounded-xl border border-border bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap gap-3">
            {/* Category Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 px-1">Category</label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="h-10 pl-3 pr-8 rounded-xl border border-border bg-gray-50 dark:bg-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer min-w-[160px]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '16px' }}
              >
                <option value="All">All Categories</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Agricultural">Agricultural</option>
                <option value="Industrial">Industrial</option>
                <option value="Plot">Plot</option>
                <option value="Flat">Flat</option>
                <option value="Duplex">Duplex</option>
                <option value="Studio">Studio</option>
              </select>
            </div>

            {/* Place / District Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 px-1">Location</label>
              <select
                value={selectedPlace}
                onChange={e => setSelectedPlace(e.target.value)}
                className="h-10 pl-3 pr-8 rounded-xl border border-border bg-gray-50 dark:bg-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer min-w-[160px]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '16px' }}
              >
                <option value="All">All Locations</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Gazipur">Gazipur</option>
                <option value="Narayanganj">Narayanganj</option>
                <option value="Purbachal">Purbachal</option>
                <option value="Uttara">Uttara</option>
                <option value="Mirpur">Mirpur</option>
                <option value="Gulshan">Gulshan</option>
                <option value="Banani">Banani</option>
                <option value="Dhanmondi">Dhanmondi</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Chattogram">Chattogram</option>
                <option value="Khulna">Khulna</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Barishal">Barishal</option>
                <option value="Mymensingh">Mymensingh</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 px-1">Sort By</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="h-10 pl-3 pr-8 rounded-xl border border-border bg-gray-50 dark:bg-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer min-w-[160px]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '16px' }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="featured">Featured First</option>
                <option value="verified">Verified Only</option>
              </select>
            </div>

            {/* Active Filter Tags */}
            <div className="flex items-end gap-2 flex-wrap">
              {search && (
                <span className="inline-flex items-center gap-1.5 h-10 px-3 rounded-xl bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  "{search}"
                  <button onClick={() => setSearch('')} className="ml-1 hover:opacity-70">×</button>
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1.5 h-10 px-3 rounded-xl bg-blue-50 text-blue-700 text-sm font-medium border border-blue-200">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')} className="ml-1 hover:opacity-70">×</button>
                </span>
              )}
              {selectedPlace !== 'All' && (
                <span className="inline-flex items-center gap-1.5 h-10 px-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-200">
                  📍 {selectedPlace}
                  <button onClick={() => setSelectedPlace('All')} className="ml-1 hover:opacity-70">×</button>
                </span>
              )}
              {(search || selectedCategory !== 'All' || selectedPlace !== 'All') && (
                <button
                  onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedPlace('All'); }}
                  className="h-10 px-3 rounded-xl text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid — full width now */}
        <ListingGrid
          filterCategory={category}
          collectionName={collectionName}
          search={search}
          filterType={selectedCategory === 'All' ? '' : selectedCategory}
          filterDistrict={selectedPlace === 'All' ? '' : selectedPlace}
          sortBy={sortBy}
        />
      </div>
    </div>
  );
}
