/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { dbClient } from '@/lib/firebase/client';
import { collection, onSnapshot, query, orderBy, limit, where } from 'firebase/firestore';
import { PlotCard } from '@/components/ui/PlotCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function HomepageRealtimeFeed() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const collections = ['properties', 'lands', 'ready_flats', 'interior_projects'];
    const unsubscribes: any[] = [];
    const newItemsMap = new Map();

    const handleSnapshot = (colName: string, snapshot: any) => {
      snapshot.forEach((doc: any) => {
        const data = doc.data();
        newItemsMap.set(doc.id, {
          id: doc.id,
          ...data,
          collection: colName,
          timestamp: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
        });
      });
      
      const mergedItems = Array.from(newItemsMap.values())
        .sort((a, b) => b.timestamp - a.timestamp);
      
      setItems(mergedItems);
      setLoading(false);
    };

    // We can fetch recent items that are marked as showOnHomepage or just latest items.
    // The prompt says "Show: Latest Property, Latest Land, Latest Ready Flat, Latest Interior Design"
    // And also mentions "Show On Homepage" admin field.
    // We will query limit(4) per collection for `showOnHomepage == true` or just newest.
    // Let's do `showOnHomepage == true` if it exists, otherwise just newest. Wait, we can just fetch where showOnHomepage == true, but if there are none, we fallback?
    // Let's just fetch recent items and filter in client to combine them correctly.
    collections.forEach((colName) => {
      const q = query(
        collection(dbClient, colName), 
        where('showOnHomepage', '==', true),
        orderBy('priorityOrder', 'desc'),
        orderBy('createdAt', 'desc'), 
        limit(4)
      );
      
      // Fallback query if no index
      const fallbackQ = query(
        collection(dbClient, colName),
        orderBy('createdAt', 'desc'),
        limit(6)
      );

      const unsubscribe = onSnapshot(q, 
        (snapshot) => handleSnapshot(colName, snapshot),
        (error) => {
          console.warn(`Error with complex query on ${colName}, falling back to simple query`);
          const fallbackUnsub = onSnapshot(fallbackQ, 
            (snap) => handleSnapshot(colName, snap),
            (err) => console.error(`Fallback query failed on ${colName}:`, err)
          );
          unsubscribes.push(fallbackUnsub);
        }
      );
      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, []);

  if (loading && items.length === 0) {
    return (
      <section className="py-20 bg-secondary">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">Latest Listings</h2>
              <p className="text-muted">Loading premium locations...</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[400px] bg-background/50 animate-pulse rounded-xl border border-border" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Deduplicate and filter to maximum 8 items or keep all
  // If we want Latest Property, Latest Land, Latest Ready Flat, Latest Interior Design,
  // we can pick the top 1 from each, then fill the rest.
  const topItems = items.slice(0, 8);

  return (
    <section className="py-20 bg-secondary">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              Latest Listings
            </h2>
            <p className="text-muted">Realtime feed of our premium locations</p>
          </div>
          <div className="hidden md:block">
            <Link href="/browse">
              <Button variant="outline">Browse All</Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topItems.map((item) => (
            <PlotCard 
              key={item.id}
              id={item.id}
              slug={`property/${item.slug}`}
              title={item.title}
              location={item.address || item.area || item.district || 'Location unlisted'}
              price={item.price}
              size={item.size}
              type={item.type}
              verified={item.verified}
              featured={item.featuredInBrowse || item.featured}
              category={item.category}
              image={item.coverImage || item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3'}
            />
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link href="/browse">
            <Button variant="outline" fullWidth>Browse All</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
