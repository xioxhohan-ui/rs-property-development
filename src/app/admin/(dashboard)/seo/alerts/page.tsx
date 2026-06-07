'use client';

import React, { useState, useEffect } from 'react';
import SEOHeader from '../_components/SEOHeader';
import { dbClient } from '@/lib/firebase/client';
import { collection, onSnapshot, query, orderBy, addDoc, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Bell, Plus, Trash2, Loader2, CheckCircle, AlertTriangle, XCircle, TrendingDown, Link as LinkIcon } from 'lucide-react';

const ALERT_TYPES = [
  { value: 'ranking_drop', label: 'Keyword Ranking Drop', icon: TrendingDown },
  { value: 'ranking_gain', label: 'Keyword Ranking Gain', icon: CheckCircle },
  { value: 'broken_link', label: 'Broken Link Detected', icon: LinkIcon },
  { value: 'missing_meta', label: 'Missing Meta Tags', icon: AlertTriangle },
  { value: 'deindexed', label: 'Page Deindexed', icon: XCircle },
  { value: 'traffic_drop', label: 'Traffic Drop', icon: TrendingDown },
];

const TYPE_CFG: Record<string, { icon: React.ElementType; cls: string; bg: string }> = {
  ranking_drop: { icon: TrendingDown, cls: 'text-red-600', bg: 'bg-red-50 border-red-200' },
  ranking_gain: { icon: CheckCircle, cls: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  broken_link:  { icon: LinkIcon, cls: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  missing_meta: { icon: AlertTriangle, cls: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  deindexed:    { icon: XCircle, cls: 'text-red-600', bg: 'bg-red-50 border-red-200' },
  traffic_drop: { icon: TrendingDown, cls: 'text-red-600', bg: 'bg-red-50 border-red-200' },
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ type: 'ranking_drop', msg: '', severity: 'warning' });

  useEffect(() => {
    const q = query(collection(dbClient, 'seo_alerts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setAlerts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.msg.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(dbClient, 'seo_alerts'), {
        ...form,
        resolved: false,
        createdAt: serverTimestamp(),
        time: 'Just now',
      });
      setForm({ type: 'ranking_drop', msg: '', severity: 'warning' });
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: string) => {
    await updateDoc(doc(dbClient, 'seo_alerts', id), { resolved: true });
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(dbClient, 'seo_alerts', id));
  };

  const unresolved = alerts.filter(a => !a.resolved).length;

  return (
    <div className="max-w-7xl mx-auto">
      <SEOHeader />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border bg-red-50 border-red-200 p-5 text-center">
          <div className="text-3xl font-bold text-red-700">{unresolved}</div>
          <div className="text-sm text-red-700 mt-1">Active Alerts</div>
        </div>
        <div className="rounded-xl border bg-emerald-50 border-emerald-200 p-5 text-center">
          <div className="text-3xl font-bold text-emerald-700">{alerts.filter(a => a.resolved).length}</div>
          <div className="text-sm text-emerald-700 mt-1">Resolved</div>
        </div>
        <div className="rounded-xl border bg-gray-50 p-5 text-center">
          <div className="text-3xl font-bold text-gray-700">{alerts.length}</div>
          <div className="text-sm text-gray-600 mt-1">Total Logged</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Alert Form */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-card shadow-sm p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Bell className="h-4 w-4 text-primary" /> Log SEO Alert</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Alert Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                  {ALERT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Severity</label>
                <select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="warning">Warning</option>
                  <option value="error">Critical</option>
                  <option value="success">Success</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Details *</label>
                <textarea value={form.msg} onChange={e => setForm({ ...form, msg: e.target.value })}
                  rows={3} placeholder="Describe the SEO alert..."
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <button type="submit" disabled={loading || !form.msg.trim()}
                className="w-full h-9 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-md text-sm font-medium disabled:opacity-50">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" />Add Alert</>}
              </button>
            </form>
          </div>

          {/* Alert Type Legend */}
          <div className="rounded-xl border bg-card shadow-sm p-5">
            <h3 className="text-sm font-semibold mb-3">Alert Types</h3>
            <div className="space-y-2">
              {ALERT_TYPES.map(t => {
                const cfg = TYPE_CFG[t.value] || { icon: AlertTriangle, cls: 'text-amber-600', bg: '' };
                const Icon = cfg.icon;
                return (
                  <div key={t.value} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon className={`h-3.5 w-3.5 ${cfg.cls}`} />
                    {t.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="lg:col-span-2 rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" /> SEO Alert Center
              {unresolved > 0 && (
                <span className="ml-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">{unresolved}</span>
              )}
            </h3>
            <span className="text-xs text-emerald-600 flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>Live</span>
          </div>
          <div className="divide-y max-h-[600px] overflow-y-auto">
            {alerts.length === 0 && (
              <div className="p-10 text-center text-muted-foreground text-sm">
                <Bell className="h-10 w-10 mx-auto mb-3 opacity-20" />
                No alerts logged. Add an alert or wait for real-time updates.
              </div>
            )}
            {alerts.map(alert => {
              const cfg = TYPE_CFG[alert.type] || { icon: AlertTriangle, cls: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
              const Icon = cfg.icon;
              return (
                <div key={alert.id}
                  className={`flex items-start gap-3 px-5 py-4 ${alert.resolved ? 'opacity-50' : cfg.bg}`}>
                  <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${cfg.cls}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">{alert.msg}</p>
                      {alert.resolved && <span className="shrink-0 text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Resolved</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {ALERT_TYPES.find(t => t.value === alert.type)?.label || alert.type} · {alert.time || 'Recent'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!alert.resolved && (
                      <button onClick={() => handleResolve(alert.id)}
                        className="h-7 px-2 rounded-md text-emerald-600 hover:bg-emerald-100 text-xs font-medium flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" /> Resolve
                      </button>
                    )}
                    <button onClick={() => handleDelete(alert.id)}
                      className="h-7 w-7 rounded-md text-red-500 hover:bg-red-50 flex items-center justify-center">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
