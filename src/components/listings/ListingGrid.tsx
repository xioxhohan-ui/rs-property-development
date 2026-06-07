'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { dbClient } from '@/lib/firebase/client';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { PlotCard } from '@/components/ui/PlotCard';

interface ListingGridProps {
  filterCategory: string;
  collectionName?: string;
  search?: string;
  filterType?: string;
  filterDistrict?: string;
  sortBy?: string;
}

export default function ListingGrid({
  filterCategory,
  collectionName = 'properties',
  search = '',
  filterType = '',
  filterDistrict = '',
  sortBy = 'newest',
}: ListingGridProps) {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(dbClient, collectionName),
      where('status', '==', 'Available')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProperties(data);
      setLoading(false);
    }, (error) => {
      console.error('Error listening to properties:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName]);

  // Client-side filtering + sorting
  const filtered = useMemo(() => {
    let list = [...properties];

    // Search — matches title, area, district, address, type
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.district || '').toLowerCase().includes(q) ||
        (p.area || '').toLowerCase().includes(q) ||
        (p.address || '').toLowerCase().includes(q) ||
        (p.type || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      );
    }

    // Category / type filter
    if (filterType) {
      list = list.filter(p =>
        (p.type || '').toLowerCase() === filterType.toLowerCase() ||
        (p.category || '').toLowerCase() === filterType.toLowerCase()
      );
    }

    // District / place filter
    if (filterDistrict) {
      list = list.filter(p =>
        (p.district || '').toLowerCase().includes(filterDistrict.toLowerCase()) ||
        (p.area || '').toLowerCase().includes(filterDistrict.toLowerCase()) ||
        (p.address || '').toLowerCase().includes(filterDistrict.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'featured') list = list.filter(p => p.featured).concat(list.filter(p => !p.featured));
    else if (sortBy === 'verified') list = list.filter(p => p.verified);
    else if (sortBy === 'oldest') list = list.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
    else list = list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)); // newest

    return list;
  }, [properties, search, filterType, filterDistrict, sortBy]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed rounded-2xl bg-white dark:bg-gray-800/50">
        <svg className="h-14 w-14 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className="text-lg font-semibold mb-1 text-gray-700 dark:text-gray-300">No results found</h3>
        <p className="text-gray-400 text-sm">Try adjusting your search or clearing the filters.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{filtered.length}</span> listing{filtered.length !== 1 ? 's' : ''}
        {search && <span> for "<span className="text-primary">{search}</span>"</span>}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((prop) => (
          <PlotCard
            key={prop.id}
            id={prop.id}
            slug={`${filterCategory.toLowerCase().replace(/ /g, '-')}/${prop.slug}`}
            title={prop.title}
            location={prop.address || prop.area || prop.district || 'Location unlisted'}
            price={prop.price}
            size={prop.size}
            type={prop.type}
            verified={prop.verified}
            image={prop.coverImage || prop.image || prop.images?.[0]}
          />
        ))}
      </div>
    </div>
  );
}
