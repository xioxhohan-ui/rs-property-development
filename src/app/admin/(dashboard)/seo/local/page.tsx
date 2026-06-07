'use client';

import React, { useState, useEffect } from 'react';
import SEOHeader from '../_components/SEOHeader';
import { dbClient } from '@/lib/firebase/client';
import { collection, onSnapshot, query, orderBy, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Trash2, Loader2, Globe, MapPin, ArrowUpRight, Building2 } from 'lucide-react';

const BD_DISTRICTS = [
  'Dhaka', 'Gazipur', 'Narayanganj', 'Sylhet', 'Chattogram', 'Khulna',
  'Rajshahi', 'Barishal', 'Rangpur', 'Mymensingh', 'Cumilla', 'Bogura',
];

const PROPERTY_TYPES = ['Plot', 'Apartment', 'Commercial', 'Land', 'Ready Flat', 'Duplex'];

function generateLocalSlug(district: string, type: string) {
  return `${type.toLowerCase().replace(/ /g, '-')}-${district.toLowerCase().replace(/ /g, '-')}`;
}

function generateLocalTitle(district: string, type: string) {
  return `${type} for Sale in ${district} | RS Property Development`;
}

function generateLocalDesc(district: string, type: string) {
  return `Find verified ${type.toLowerCase()} listings for sale in ${district}. Premium real estate by RS Property Development — trusted across Bangladesh.`;
}

export default function LocalSEOPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ district: 'Dhaka', type: 'Plot', customTitle: '', customDesc: '' });

  useEffect(() => {
    const q = query(collection(dbClient, 'seo_local_pages'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => setPages(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const slug = generateLocalSlug(form.district, form.type);
  const autoTitle = generateLocalTitle(form.district, form.type);
  const autoDesc = generateLocalDesc(form.district, form.type);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(dbClient, 'seo_local_pages'), {
        district: form.district,
        type: form.type,
        slug,
        title: form.customTitle || autoTitle,
        description: form.customDesc || autoDesc,
        url: `/properties/${slug}`,
        createdAt: serverTimestamp(),
      });
      setForm({ district: 'Dhaka', type: 'Plot', customTitle: '', customDesc: '' });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkGenerate = async () => {
    if (!confirm(`Generate SEO pages for all ${BD_DISTRICTS.length} districts × ${PROPERTY_TYPES.length} types = ${BD_DISTRICTS.length * PROPERTY_TYPES.length} pages?`)) return;
    setLoading(true);
    try {
      for (const district of BD_DISTRICTS) {
        for (const type of PROPERTY_TYPES) {
          await addDoc(collection(dbClient, 'seo_local_pages'), {
            district, type,
            slug: generateLocalSlug(district, type),
            title: generateLocalTitle(district, type),
            description: generateLocalDesc(district, type),
            url: `/properties/${generateLocalSlug(district, type)}`,
            createdAt: serverTimestamp(),
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(dbClient, 'seo_local_pages', id));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <SEOHeader />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border bg-blue-50 border-blue-200 p-5 text-center">
          <div className="text-3xl font-bold text-blue-700">{pages.length}</div>
          <div className="text-sm text-blue-700 mt-1">Local Pages Created</div>
        </div>
        <div className="rounded-xl border bg-emerald-50 border-emerald-200 p-5 text-center">
          <div className="text-3xl font-bold text-emerald-700">{new Set(pages.map(p => p.district)).size}</div>
          <div className="text-sm text-emerald-700 mt-1">Districts Covered</div>
        </div>
        <div className="rounded-xl border bg-amber-50 border-amber-200 p-5 text-center">
          <div className="text-3xl font-bold text-amber-700">{new Set(pages.map(p => p.type)).size}</div>
          <div className="text-sm text-amber-700 mt-1">Property Types</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generator */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-card shadow-sm p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Generate Local SEO Page</h3>
            <form onSubmit={handleGenerate} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">District</label>
                <select value={form.district} onChange={e => setForm({ ...form, district: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                  {BD_DISTRICTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Property Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                  {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              {/* Auto-preview */}
              <div className="rounded-lg bg-muted p-3 space-y-2 text-xs">
                <div className="text-blue-700 font-medium truncate">{form.customTitle || autoTitle}</div>
                <div className="text-emerald-700">rsproperty.com/properties/{slug}</div>
                <div className="text-muted-foreground line-clamp-2">{autoDesc}</div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full h-9 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-md text-sm font-medium disabled:opacity-50">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" />Create Page</>}
              </button>
            </form>
          </div>

          <div className="rounded-xl border bg-gradient-to-br from-primary/10 to-amber-50 border-primary/20 p-5">
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /> Bulk Generate</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Auto-create SEO landing pages for all {BD_DISTRICTS.length} districts × {PROPERTY_TYPES.length} property types.
            </p>
            <button onClick={handleBulkGenerate} disabled={loading}
              className="w-full h-9 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-md text-sm font-medium disabled:opacity-50">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Generate {BD_DISTRICTS.length * PROPERTY_TYPES.length} Pages</>}
            </button>
          </div>
        </div>

        {/* Pages List */}
        <div className="lg:col-span-2 rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> Created Local SEO Pages</h3>
            <span className="text-xs text-emerald-600 flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>Live</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {['District', 'Type', 'URL Slug', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pages.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground text-sm">
                    No local SEO pages created yet. Use the form to generate pages.
                  </td></tr>
                )}
                {pages.map(page => (
                  <tr key={page.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{page.district}</td>
                    <td className="px-4 py-3 text-muted-foreground">{page.type}</td>
                    <td className="px-4 py-3 text-blue-600 text-xs font-mono truncate max-w-[200px]">{page.url}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(page.id)}
                        className="h-7 w-7 rounded-md text-red-500 hover:bg-red-50 flex items-center justify-center">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
