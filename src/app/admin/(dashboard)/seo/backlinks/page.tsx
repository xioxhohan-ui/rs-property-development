'use client';

import React, { useState, useEffect } from 'react';
import SEOHeader from '../_components/SEOHeader';
import { dbClient } from '@/lib/firebase/client';
import { collection, onSnapshot, query, orderBy, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Trash2, Loader2, Link as LinkIcon, ArrowUpRight, ArrowDownRight, TrendingUp, Globe, Shield } from 'lucide-react';

import { useToast } from '@/components/ui/Toast';

const BACKLINK_TYPES: Record<string, string> = {
  dofollow: 'bg-emerald-100 text-emerald-700',
  nofollow: 'bg-gray-100 text-gray-600',
  sponsored: 'bg-amber-100 text-amber-700',
};

export default function BacklinksPage() {
  const [backlinks, setBacklinks] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ source: '', targetPage: '/', anchorText: '', type: 'dofollow', da: '', status: 'Active' });
  const toast = useToast();

  useEffect(() => {
    const q = query(collection(dbClient, 'seo_backlinks'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => setBacklinks(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.source.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(dbClient, 'seo_backlinks'), {
        ...form,
        da: Number(form.da) || 0,
        createdAt: serverTimestamp(),
      });
      setForm({ source: '', targetPage: '/', anchorText: '', type: 'dofollow', da: '', status: 'Active' });
      toast.success('Backlink Added');
    } catch (err) {
      console.error(err);
      toast.error('Add Failed', 'Failed to add backlink');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await toast.confirm({
      title: 'Remove Backlink',
      message: 'Are you sure you want to remove this backlink?',
      danger: true,
      confirmLabel: 'Remove'
    });
    if (!ok) return;
    
    await deleteDoc(doc(dbClient, 'seo_backlinks', id));
    toast.success('Backlink Removed');
  };

  const totalDA = backlinks.length > 0 ? Math.round(backlinks.reduce((s, b) => s + (b.da || 0), 0) / backlinks.length) : 0;
  const dofollow = backlinks.filter(b => b.type === 'dofollow').length;
  const domains = new Set(backlinks.map(b => { try { return new URL(b.source).hostname; } catch { return b.source; } })).size;

  return (
    <div className="max-w-7xl mx-auto">
      <SEOHeader />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Backlinks', value: backlinks.length, icon: LinkIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Referring Domains', value: domains, icon: Globe, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Dofollow Links', value: dofollow, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Avg. Domain Auth.', value: totalDA || '—', icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`rounded-xl border shadow-sm p-5 ${s.bg}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
                <Icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Add Form */}
      <div className="rounded-xl border bg-card shadow-sm p-6 mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Plus className="h-4 w-4 text-primary" /> Add Backlink</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
          <div className="col-span-2 space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Source URL *</label>
            <input required value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}
              placeholder="https://example.com/article"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Target Page</label>
            <input value={form.targetPage} onChange={e => setForm({ ...form, targetPage: e.target.value })}
              placeholder="/property"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Anchor Text</label>
            <input value={form.anchorText} onChange={e => setForm({ ...form, anchorText: e.target.value })}
              placeholder="buy plot dhaka"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Type</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
              <option value="dofollow">Dofollow</option>
              <option value="nofollow">Nofollow</option>
              <option value="sponsored">Sponsored</option>
            </select>
          </div>
          <button type="submit" disabled={loading}
            className="h-9 inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium px-4 disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" />Add</>}
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Backlink Registry</h3>
          <span className="text-xs text-emerald-600 flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>Live</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {['Source Domain', 'Target Page', 'Anchor Text', 'Type', 'DA', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {backlinks.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground text-sm">
                  No backlinks logged yet. Add your first backlink above.
                </td></tr>
              )}
              {backlinks.map(bl => {
                let domain = bl.source;
                try { domain = new URL(bl.source).hostname; } catch {}
                return (
                  <tr key={bl.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <a href={bl.source} target="_blank" rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:underline flex items-center gap-1">
                        {domain} <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{bl.targetPage || '/'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{bl.anchorText || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${BACKLINK_TYPES[bl.type] || 'bg-gray-100 text-gray-600'}`}>
                        {bl.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{bl.da || '—'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(bl.id)}
                        className="h-7 w-7 rounded-md text-red-500 hover:bg-red-50 flex items-center justify-center">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-blue-50 border-blue-200 p-4 text-sm text-blue-800">
        <strong>Tip:</strong> For automated backlink discovery, connect tools like Ahrefs, Moz, or Google Search Console. This tracker stores your manually verified backlinks.
      </div>
    </div>
  );
}
