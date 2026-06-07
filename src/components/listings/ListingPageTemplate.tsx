'use client';

import React, { useState } from 'react';
import ListingGrid from './ListingGrid';
import { MobileBottomSheet } from '@/components/ui/MobileBottomSheet';
import { SlidersHorizontal } from 'lucide-react';

interface ListingPageTemplateProps {
  title: string;
  subtitle: string;
  category: string;
  collectionName?: string;
}

export default function ListingPageTemplate({ title, subtitle, category, collectionName = 'properties' }: ListingPageTemplateProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const FilterContent = () => (
    <div className="space-y-4">
      <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse border border-border/50"></div>
      <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse border border-border/50"></div>
      <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse border border-border/50"></div>
      <button className="w-full h-12 bg-primary text-primary-foreground rounded-lg font-medium mt-4">Apply Filters</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
      <div className="container">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">{title}</h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">{subtitle}</p>
          </div>
          
          {/* Mobile Filter Button */}
          <button 
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-white dark:bg-gray-800 border shadow-sm rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <SlidersHorizontal size={20} />
            Filters
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border shadow-sm sticky top-24">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <SlidersHorizontal size={20} /> Advanced Filters
              </h2>
              <p className="text-sm text-gray-500 mb-6">Select options to narrow down your search.</p>
              <FilterContent />
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <ListingGrid filterCategory={category} collectionName={collectionName} />
          </div>
        </div>
      </div>

      <MobileBottomSheet 
        isOpen={isMobileFiltersOpen} 
        onClose={() => setIsMobileFiltersOpen(false)}
        title="Advanced Filters"
      >
        <FilterContent />
      </MobileBottomSheet>
    </div>
  );
}
