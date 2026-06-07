'use client';

import React, { useState, useEffect } from 'react';
import { dbClient } from '@/lib/firebase/client';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { PlotCard } from '@/components/ui/PlotCard';

interface ListingGridProps {
  filterCategory: string;
}

export default function ListingGrid({ filterCategory }: ListingGridProps) {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We use onSnapshot for real-time updates as requested by the user
    // Querying the unified 'properties' collection by category
    const q = query(
      collection(dbClient, 'properties'),
      where('category', '==', filterCategory),
      where('status', '==', 'Available'),
      // Note: Ordering might require a composite index in Firestore depending on data
      // orderBy('createdAt', 'desc') 
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProperties(data);
      setLoading(false);
    }, (error) => {
      console.error('Error listening to properties:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [filterCategory]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-xl bg-gray-50 dark:bg-gray-800/50">
        <h3 className="text-lg font-semibold mb-2">No listings found</h3>
        <p className="text-gray-500">There are currently no {filterCategory.toLowerCase()} available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((prop) => (
        <PlotCard
          key={prop.id}
          id={prop.id}
          slug={`${filterCategory.toLowerCase().replace(/ /g, '-')}/${prop.slug}`}
          title={prop.title}
          location={prop.address || prop.district || 'Location unlisted'}
          price={prop.price}
          size={prop.size}
          type={prop.type}
          verified={prop.verified}
          image={prop.image || prop.images?.[0]}
        />
      ))}
    </div>
  );
}
