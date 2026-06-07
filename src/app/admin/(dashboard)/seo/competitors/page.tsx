'use client';

import React, { useState, useEffect } from 'react';
import SEOHeader from '../_components/SEOHeader';
import { dbClient } from '@/lib/firebase/client';
import { collection, onSnapshot, query, orderBy, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Trash2, Loader2, BarChart3, Globe, ArrowUpRight } from 'lucide-react';

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState('');

  useEffect(() => {
    const q = query(collection(dbClient, 'seo_competitors'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => setCompetitors(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(dbClient, 'seo_competitors'), {
        domain: domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, ''),
        addedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        notes: '',
      });
      setDomain('');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(dbClient, 'seo_competitors', id));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <SEOHeader />

      <div className="rounded-xl border bg-card shadow-sm p-6 mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /> Add Competitor Domain</h3>
        <form onSubmit={handleAdd} className="flex gap-3">
          <input required value={domain} onChange={e => setDomain(e.target.value)}
            placeholder="e.g. bproperty.com or bikroy.com"
            className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm" />
          <button type="submit" disabled={loading}
            className="h-10 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-md text-sm font-medium px-6 disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" />Track</>}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {competitors.length === 0 && (
          <div className="col-span-3 rounded-xl border border-dashed p-12 text-center text-muted-foreground">
            <Globe className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>No competitors tracked yet. Add a competitor domain above.</p>
          </div>
        )}
        {competitors.map(comp => (
          <div key={comp.id} className="rounded-xl border bg-card shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{comp.domain}</div>
                  <a href={`https://${comp.domain}`} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-0.5">
                    Visit <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
              <button onClick={() => handleDelete(comp.id)}
                className="text-red-400 hover:text-red-600 hover:bg-red-50 h-7 w-7 rounded-md flex items-center justify-center">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 text-xs text-amber-700">
              <strong>Tip:</strong> To see competitor keyword gaps, traffic and backlinks, connect Ahrefs or SEMrush via their APIs. Manual comparison is shown when you add notes.
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <a href={`https://ahrefs.com/site-explorer/overview/v2/subdomains/live?target=${comp.domain}`}
                target="_blank" rel="noopener noreferrer"
                className="text-xs text-center p-2 rounded-md border hover:bg-muted transition-colors">
                Ahrefs ↗
              </a>
              <a href={`https://www.semrush.com/analytics/overview/?q=${comp.domain}`}
                target="_blank" rel="noopener noreferrer"
                className="text-xs text-center p-2 rounded-md border hover:bg-muted transition-colors">
                SEMrush ↗
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-blue-50 border-blue-200 p-5 text-sm text-blue-800">
        <strong>About Competitor Analysis:</strong> Real competitor SEO data (traffic, keywords, backlinks) requires integration with tools like Ahrefs, SEMrush, or Moz. Direct links are provided per competitor card. This module stores your tracked competitor domains for quick access.
      </div>
    </div>
  );
}
