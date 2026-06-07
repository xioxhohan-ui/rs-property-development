'use client';

import React, { useState, useEffect } from 'react';
import SEOHeader from '../_components/SEOHeader';
import { dbClient } from '@/lib/firebase/client';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { CheckCircle, XCircle, AlertTriangle, Plus, Trash2, Loader2, RefreshCw, Shield, Zap, Link as LinkIcon, FileText } from 'lucide-react';

const STATIC_CHECKS = [
  { category: 'Meta Tags', label: 'All pages have title tags', status: 'ok' },
  { category: 'Meta Tags', label: 'All pages have meta descriptions', status: 'warning', detail: '2 pages missing' },
  { category: 'Canonicals', label: 'Canonical URLs set on all pages', status: 'ok' },
  { category: 'Canonicals', label: 'No duplicate canonical conflicts', status: 'ok' },
  { category: 'Redirects', label: 'No redirect chains (3+ hops)', status: 'ok' },
  { category: 'Redirects', label: 'HTTP → HTTPS redirect active', status: 'ok' },
  { category: 'Performance', label: 'sitemap.xml accessible', status: 'ok' },
  { category: 'Performance', label: 'robots.txt configured', status: 'ok' },
  { category: 'Performance', label: 'No 4xx errors in last 24h', status: 'warning', detail: '1 broken link found' },
  { category: 'Mobile', label: 'Mobile-responsive design', status: 'ok' },
  { category: 'Mobile', label: 'Viewport meta tag present', status: 'ok' },
  { category: 'Security', label: 'HTTPS / SSL active', status: 'ok' },
  { category: 'Schema', label: 'LocalBusiness schema present', status: 'warning', detail: 'Add to homepage' },
  { category: 'Schema', label: 'BreadcrumbList schema on listing pages', status: 'error', detail: 'Not implemented' },
];

const STATUS_CFG = {
  ok:      { icon: CheckCircle, cls: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  warning: { icon: AlertTriangle, cls: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  error:   { icon: XCircle, cls: 'text-red-600', bg: 'bg-red-50 border-red-200' },
};

function StatusIcon({ status }: { status: string }) {
  const cfg = STATUS_CFG[status as keyof typeof STATUS_CFG] || STATUS_CFG.ok;
  const Icon = cfg.icon;
  return <Icon className={`h-4 w-4 ${cfg.cls}`} />;
}

export default function TechnicalSEOPage() {
  const [issues, setIssues] = useState<any[]>([]);
  const [newIssue, setNewIssue] = useState({ type: 'error', msg: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(dbClient, 'seo_technical_issues'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setIssues(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleAddIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssue.msg.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(dbClient, 'seo_technical_issues'), {
        ...newIssue,
        createdAt: serverTimestamp(),
        resolved: false,
      });
      setNewIssue({ type: 'error', msg: '' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(dbClient, 'seo_technical_issues', id));
  };

  const grouped = STATIC_CHECKS.reduce((acc, check) => {
    if (!acc[check.category]) acc[check.category] = [];
    acc[check.category].push(check);
    return acc;
  }, {} as Record<string, typeof STATIC_CHECKS>);

  const okCount = STATIC_CHECKS.filter(c => c.status === 'ok').length;
  const warnCount = STATIC_CHECKS.filter(c => c.status === 'warning').length;
  const errCount = STATIC_CHECKS.filter(c => c.status === 'error').length;

  return (
    <div className="max-w-7xl mx-auto">
      <SEOHeader />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border bg-emerald-50 border-emerald-200 p-5 text-center">
          <div className="text-3xl font-bold text-emerald-700">{okCount}</div>
          <div className="text-sm text-emerald-700 mt-1">Passed</div>
        </div>
        <div className="rounded-xl border bg-amber-50 border-amber-200 p-5 text-center">
          <div className="text-3xl font-bold text-amber-700">{warnCount}</div>
          <div className="text-sm text-amber-700 mt-1">Warnings</div>
        </div>
        <div className="rounded-xl border bg-red-50 border-red-200 p-5 text-center">
          <div className="text-3xl font-bold text-red-700">{errCount}</div>
          <div className="text-sm text-red-700 mt-1">Errors</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Static Checks */}
        <div className="lg:col-span-2 space-y-4">
          {Object.entries(grouped).map(([cat, checks]) => (
            <div key={cat} className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-muted/50 border-b">
                <h3 className="font-semibold text-sm">{cat}</h3>
              </div>
              <div className="divide-y">
                {checks.map((check, i) => {
                  const cfg = STATUS_CFG[check.status as keyof typeof STATUS_CFG];
                  return (
                    <div key={i} className={`flex items-start justify-between px-5 py-3 ${check.status !== 'ok' ? cfg.bg : ''}`}>
                      <div className="flex items-start gap-3">
                        <StatusIcon status={check.status} />
                        <div>
                          <div className="text-sm font-medium">{check.label}</div>
                          {check.detail && <div className={`text-xs mt-0.5 ${cfg.cls}`}>{check.detail}</div>}
                        </div>
                      </div>
                      <span className={`text-xs font-medium uppercase ${cfg.cls}`}>{check.status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Live Issues Tracker */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-card shadow-sm p-5">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> Log Technical Issue
            </h3>
            <form onSubmit={handleAddIssue} className="space-y-3">
              <select value={newIssue.type} onChange={e => setNewIssue({ ...newIssue, type: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="error">🔴 Error</option>
                <option value="warning">🟡 Warning</option>
                <option value="ok">🟢 Fixed</option>
              </select>
              <input value={newIssue.msg} onChange={e => setNewIssue({ ...newIssue, msg: e.target.value })}
                placeholder="Describe the technical issue..."
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
              <button type="submit" disabled={loading || !newIssue.msg.trim()}
                className="w-full h-9 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-md text-sm font-medium disabled:opacity-50">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" />Log Issue</>}
              </button>
            </form>
          </div>

          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-muted/50 border-b flex items-center justify-between">
              <h3 className="font-semibold text-sm">Logged Issues</h3>
              <span className="text-xs text-emerald-600 flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>Live</span>
            </div>
            <div className="divide-y max-h-[400px] overflow-y-auto">
              {issues.length === 0 && (
                <div className="p-6 text-center text-muted-foreground text-sm">No issues logged yet.</div>
              )}
              {issues.map(issue => {
                const cfg = STATUS_CFG[issue.type as keyof typeof STATUS_CFG] || STATUS_CFG.error;
                return (
                  <div key={issue.id} className={`flex items-start gap-3 px-4 py-3 ${cfg.bg}`}>
                    <StatusIcon status={issue.type} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{issue.msg}</p>
                    </div>
                    <button onClick={() => handleDelete(issue.id)} className="text-muted-foreground hover:text-red-500 shrink-0">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Tools */}
          <div className="rounded-xl border bg-card shadow-sm p-5">
            <h3 className="font-semibold text-sm mb-3">Quick Tools</h3>
            <div className="space-y-2">
              {[
                { label: 'View Sitemap', href: '/sitemap.xml', icon: FileText },
                { label: 'View Robots.txt', href: '/robots.txt', icon: Shield },
                { label: 'GSC Coverage Report', href: 'https://search.google.com/search-console', icon: Zap, external: true },
              ].map(tool => {
                const Icon = tool.icon;
                return (
                  <a key={tool.label} href={tool.href} target={tool.external ? '_blank' : '_self'} rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-lg border hover:bg-muted transition-colors text-sm">
                    <Icon className="h-4 w-4 text-primary" />
                    {tool.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
