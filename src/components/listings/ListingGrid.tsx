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
  priceRange?: string;
  sortBy?: string;
}

function parsePriceRange(range: string): [number, number] {
  if (range === 'Under 10 Lac') return [0, 1000000];
  if (range === '10–50 Lac') return [1000000, 5000000];
  if (range === '50 Lac–1 Crore') return [5000000, 10000000];
  if (range === '1–2 Crore') return [10000000, 20000000];
  if (range === '2–5 Crore') return [20000000, 50000000];
  if (range === '5 Crore+') return [50000000, Infinity];
  return [0, Infinity];
}

export default function ListingGrid({
  filterCategory,
  collectionName = 'properties',
  search = '',
  filterType = '',
  filterDistrict = '',
  priceRange = '',
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

    // Price range filter
    if (priceRange) {
      const [min, max] = parsePriceRange(priceRange);
      list = list.filter(p => {
        const price = Number(String(p.price || '0').replace(/[^0-9.]/g, ''));
        return price >= min && price <= max;
      });
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center rounded-2xl"
        style={{ background: '#fff', border: '2px dashed #67BAF4' }}>
        <div className="h-16 w-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: 'rgba(103,186,244,0.12)' }}>
          <svg className="h-8 w-8" style={{ color: '#1E466B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold mb-1" style={{ color: '#1E466B' }}>No results found</h3>
        <p className="text-sm" style={{ color: '#5a6a7a' }}>Try adjusting your search or clearing the filters.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm mb-5 font-medium" style={{ color: '#5a6a7a' }}>
        Showing <span className="font-bold" style={{ color: '#1E466B' }}>{filtered.length}</span> listing{filtered.length !== 1 ? 's' : ''}
        {search && <span> for "<span style={{ color: '#1E466B' }}>{search}</span>"</span>}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
