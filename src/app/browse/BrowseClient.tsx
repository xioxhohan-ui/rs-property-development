/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { dbClient } from '@/lib/firebase/client';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { PlotCard } from '@/components/ui/PlotCard';
import { Search, Filter, Loader2, Star, CheckCircle, Sparkles, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BrowseClient() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

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
          // Handle Firestore Timestamps for sorting
          timestamp: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
        });
      });
      
      const mergedItems = Array.from(newItemsMap.values()).sort((a, b) => b.timestamp - a.timestamp);
      setItems(mergedItems);
      setLoading(false);
    };

    collections.forEach((colName) => {
      const q = query(collection(dbClient, colName), orderBy('createdAt', 'desc'), limit(100));
      const unsubscribe = onSnapshot(q, 
        (snapshot) => handleSnapshot(colName, snapshot),
        (error) => {
          console.error(`Error fetching ${colName}:`, error);
          // If indexing error, we might need to fallback to no orderby if it fails, but we'll assume it works
        }
      );
      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (activeCategory !== 'All' && item.category !== activeCategory) {
        return false;
      }
      
      // Search filter
      if (searchQuery) {
        const queryLower = searchQuery.toLowerCase();
        const searchableFields = [
          item.title,
          item.district,
          item.area,
          item.category,
          item.seoKeywords,
          item.description
        ].map(field => (field || '').toString().toLowerCase());
        
        if (!searchableFields.some(field => field.includes(queryLower))) {
          return false;
        }
      }
      
      return true;
    });
  }, [items, activeCategory, searchQuery]);

  const featuredItems = filteredItems.filter(item => item.featuredInBrowse);
  const verifiedItems = filteredItems.filter(item => item.verified);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-primary">
          <Loader2 className="w-12 h-12 animate-spin" />
          <p className="text-lg font-medium text-muted-foreground">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="bg-secondary/50 pt-32 pb-12 px-4 border-b">
        <div className="container max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">Browse Marketplace</h1>
          
          <div className="relative max-w-3xl mx-auto mb-8 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search className="w-6 h-6" />
            </div>
            <input
              type="text"
              className="w-full bg-background border-2 border-primary/20 rounded-2xl py-4 pl-12 pr-4 text-lg shadow-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              placeholder="Search by title, district, area, category, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {['All', 'Property', 'Land', 'Ready Flat', 'Interior Design'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all shadow-sm
                  ${activeCategory === cat 
                    ? 'bg-primary text-primary-foreground shadow-primary/25 scale-105' 
                    : 'bg-background text-foreground hover:bg-secondary hover:scale-105 border border-border'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-12 space-y-16">
        
        {/* Featured Listings Section */}
        {featuredItems.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-500 fill-amber-500" /> Featured Listings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredItems.map(item => (
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
                  featured={item.featuredInBrowse}
                  category={item.category}
                  image={item.coverImage || item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3'}
                />
              ))}
            </div>
          </section>
        )}

        {/* Verified Listings Section */}
        {verifiedItems.length > 0 && verifiedItems.length !== featuredItems.length && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-emerald-500" /> Verified Listings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {verifiedItems.map(item => (
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
                  featured={item.featuredInBrowse}
                  category={item.category}
                  image={item.coverImage || item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3'}
                />
              ))}
            </div>
          </section>
        )}

        {/* Premium Listings Section */}
        {filteredItems.filter(item => item.priorityOrder > 0).length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-500" /> Premium Listings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.filter(item => item.priorityOrder > 0).map(item => (
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
                  featured={item.featuredInBrowse}
                  category={item.category}
                  image={item.coverImage || item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3'}
                />
              ))}
            </div>
          </section>
        )}

        {/* Recently Added Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-500" /> Recently Added / Latest Listings
          </h2>
          {filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-secondary/30 rounded-2xl border border-border border-dashed">
              <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No listings found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PlotCard 
                      id={item.id}
                      slug={`property/${item.slug}`}
                      title={item.title}
                      location={item.address || item.area || item.district || 'Location unlisted'}
                      price={item.price}
                      size={item.size}
                      type={item.type}
                      verified={item.verified}
                      featured={item.featuredInBrowse}
                      category={item.category}
                      image={item.coverImage || item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3'}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
