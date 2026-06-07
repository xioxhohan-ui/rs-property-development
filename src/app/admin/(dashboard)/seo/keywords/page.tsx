'use client';

import React, { useState, useEffect } from 'react';
import SEOHeader from '../_components/SEOHeader';
import { dbClient } from '@/lib/firebase/client';
import {
  collection, addDoc, deleteDoc, doc, onSnapshot,
  query, orderBy, serverTimestamp, updateDoc
} from 'firebase/firestore';
import {
  Plus, Trash2, Loader2, ArrowUpRight, ArrowDownRight,
  Minus, TrendingUp, Search, RefreshCw
} from 'lucide-react';

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  Hard: 'bg-red-100 text-red-700',
};

function difficultyLabel(kd: number) {
  if (kd < 30) return 'Easy';
  if (kd < 60) return 'Medium';
  return 'Hard';
}

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    keyword: '', pos: '', prevPos: '', volume: '', kd: '50', cpc: '', traffic: '', competition: 'Medium'
  });

  // Real-time Firestore listener
  useEffect(() => {
    const q = query(collection(dbClient, 'seo_keywords'), orderBy('pos', 'asc'));
    const unsub = onSnapshot(q, snap => {
      setKeywords(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.keyword.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(dbClient, 'seo_keywords'), {
        keyword: form.keyword.trim(),
        pos: Number(form.pos) || 0,
        prevPos: Number(form.prevPos) || Number(form.pos) || 0,
        volume: form.volume || '—',
        kd: Number(form.kd) || 50,
        cpc: form.cpc || '—',
        traffic: form.traffic || '—',
        competition: form.competition,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setForm({ keyword: '', pos: '', prevPos: '', volume: '', kd: '50', cpc: '', traffic: '', competition: 'Medium' });
    } catch (err) {
      console.error(err);
      alert('Failed to add keyword');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this keyword?')) return;
    await deleteDoc(doc(dbClient, 'seo_keywords', id));
  };

  const handleUpdatePos = async (id: string, newPos: number, currentPos: number) => {
    await updateDoc(doc(dbClient, 'seo_keywords', id), {
      prevPos: currentPos,
      pos: newPos,
      updatedAt: serverTimestamp(),
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <SEOHeader />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Tracked Keywords', value: keywords.length, color: 'text-blue-600' },
          { label: 'Top 3 Rankings', value: keywords.filter(k => k.pos <= 3).length, color: 'text-emerald-600' },
          { label: 'Top 10 Rankings', value: keywords.filter(k => k.pos <= 10).length, color: 'text-amber-600' },
          { label: 'Improved Today', value: keywords.filter(k => (k.prevPos - k.pos) > 0).length, color: 'text-purple-600' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border bg-card shadow-sm p-5">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Add Keyword Form */}
      <div className="rounded-xl border bg-card shadow-sm p-6 mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Plus className="h-4 w-4 text-primary" /> Add Keyword to Track</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 items-end">
          <div className="col-span-2 md:col-span-2 space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Keyword *</label>
            <input required value={form.keyword} onChange={e => setForm({ ...form, keyword: e.target.value })}
              placeholder="e.g. plot for sale dhaka"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Cur. Pos.</label>
            <input type="number" value={form.pos} onChange={e => setForm({ ...form, pos: e.target.value })}
              placeholder="3"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Prev. Pos.</label>
            <input type="number" value={form.prevPos} onChange={e => setForm({ ...form, prevPos: e.target.value })}
              placeholder="5"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Volume/mo</label>
            <input value={form.volume} onChange={e => setForm({ ...form, volume: e.target.value })}
              placeholder="12,500"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Difficulty</label>
            <input type="number" min="0" max="100" value={form.kd} onChange={e => setForm({ ...form, kd: e.target.value })}
              placeholder="50"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Traffic/mo</label>
            <input value={form.traffic} onChange={e => setForm({ ...form, traffic: e.target.value })}
              placeholder="1,240"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
          </div>
          <button type="submit" disabled={loading}
            className="h-9 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium px-4 disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-1" />Add</>}
          </button>
        </form>
      </div>

      {/* Keywords Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Keyword Rankings</h3>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {['Keyword', 'Position', 'Change', 'Volume', 'Difficulty', 'Traffic', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {keywords.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  No keywords tracked yet. Add your first keyword above.
                </td></tr>
              )}
              {keywords.map(kw => {
                const change = (kw.prevPos || kw.pos) - kw.pos;
                const kd = Number(kw.kd) || 0;
                const dl = difficultyLabel(kd);
                return (
                  <tr key={kw.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{kw.keyword}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold
                        ${kw.pos <= 3 ? 'bg-emerald-100 text-emerald-800' :
                          kw.pos <= 10 ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-700'}`}>
                        {kw.pos ? `#${kw.pos}` : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-0.5 text-xs font-semibold
                        ${change > 0 ? 'text-emerald-600' : change < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {change > 0 ? <ArrowUpRight className="h-3 w-3" /> :
                         change < 0 ? <ArrowDownRight className="h-3 w-3" /> :
                         <Minus className="h-3 w-3" />}
                        {change !== 0 ? Math.abs(change) : 'Stable'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{kw.volume}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[dl] || 'bg-gray-100 text-gray-700'}`}>
                        {dl} ({kd})
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{kw.traffic}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          title="Update position (+1)"
                          onClick={() => handleUpdatePos(kw.id, Math.max(1, (kw.pos || 0) - 1), kw.pos)}
                          className="h-7 w-7 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center"
                        >
                          <ArrowUpRight className="h-3 w-3" />
                        </button>
                        <button
                          title="Update position (-1)"
                          onClick={() => handleUpdatePos(kw.id, (kw.pos || 0) + 1, kw.pos)}
                          className="h-7 w-7 rounded-md bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center"
                        >
                          <ArrowDownRight className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(kw.id)}
                          className="h-7 w-7 rounded-md text-red-500 hover:bg-red-50 flex items-center justify-center"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-amber-50 border-amber-200 p-4 text-sm text-amber-800">
        <strong>Note:</strong> For verified keyword rankings from Google, connect Google Search Console above. Keyword positions here are manually tracked or pulled from GSC when integrated.
      </div>
    </div>
  );
}
