import React from 'react';
import ListingGrid from './ListingGrid';

interface ListingPageTemplateProps {
  title: string;
  subtitle: string;
  category: string;
}

export default function ListingPageTemplate({ title, subtitle, category }: ListingPageTemplateProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">{title}</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">{subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border shadow-sm sticky top-24">
              <h2 className="font-semibold text-lg mb-4">Advanced Filters</h2>
              <p className="text-sm text-gray-500 mb-4">Select options to narrow down your search.</p>
              {/* Filter inputs will go here */}
              <div className="space-y-4">
                <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"></div>
                <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"></div>
                <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <ListingGrid filterCategory={category} />
          </div>
        </div>
      </div>
    </div>
  );
}
