'use client';

import React, { useState, useEffect, useRef } from 'react';
import SEOHeader from './_components/SEOHeader';
import { dbClient } from '@/lib/firebase/client';
import { collection, onSnapshot, query, orderBy, limit, getDocs } from 'firebase/firestore';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Activity, Globe, Eye, MousePointerClick, ArrowUpRight, ArrowDownRight,
  TrendingUp, Link as LinkIcon, Zap, Smartphone, Search, AlertTriangle,
  CheckCircle, Clock, RefreshCw, Target, BarChart3
} from 'lucide-react';

// ─── Helpers ────────────────────────────────────────────────────────────────
const generateSparkData = (base: number, points = 12) =>
  Array.from({ length: points }, (_, i) => ({
    t: i,
    v: Math.max(0, base + Math.floor((Math.random() - 0.4) * base * 0.3)),
  }));

const trafficHistory = [
  { d: 'Jan', organic: 3100, direct: 1200 },
  { d: 'Feb', organic: 3800, direct: 1500 },
  { d: 'Mar', organic: 4200, direct: 1800 },
  { d: 'Apr', organic: 3700, direct: 2100 },
  { d: 'May', organic: 5100, direct: 2400 },
  { d: 'Jun', organic: 6200, direct: 2800 },
  { d: 'Jul', organic: 7400, direct: 3200 },
];

const cwvData = [
  { name: 'LCP', score: 82, color: '#22c55e', label: '2.1s' },
  { name: 'FID', score: 95, color: '#22c55e', label: '18ms' },
  { name: 'CLS', score: 78, color: '#f59e0b', label: '0.09' },
  { name: 'TTFB', score: 88, color: '#22c55e', label: '420ms' },
];

// ─── Metric Card ─────────────────────────────────────────────────────────────
function MetricCard({
  title, value, change, positive, icon: Icon, color, spark
}: {
  title: string; value: string; change: string; positive: boolean;
  icon: React.ElementType; color: string; spark?: { t: number; v: number }[];
}) {
  return (
    <div className="rounded-xl border bg-card shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</span>
        <span className={`h-8 w-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className={`flex items-center gap-1 text-xs mt-1 font-medium ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {change}
        </div>
      </div>
      {spark && (
        <div className="h-12 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spark}>
              <defs>
                <linearGradient id={`sg-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke="#D4AF37" strokeWidth={1.5} fill={`url(#sg-${title})`} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// ─── Score Gauge ──────────────────────────────────────────────────────────────
function ScoreGauge({ score, label }: { score: number; label: string }) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="55" cy="55" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 55 55)"
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
        <text x="55" y="50" textAnchor="middle" fill={color} fontSize="20" fontWeight="bold">{score}</text>
        <text x="55" y="66" textAnchor="middle" fill="#9ca3af" fontSize="10">/100</text>
      </svg>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

// ─── CWV Bar ──────────────────────────────────────────────────────────────────
function CWVBar({ name, score, color, label }: { name: string; score: number; color: string; label: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-medium">
        <span>{name}</span>
        <span style={{ color }}>{label}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

// ─── Live Keyword Row ─────────────────────────────────────────────────────────
function KeywordRow({ kw }: { kw: any }) {
  const change = kw.prevPos - kw.pos;
  return (
    <tr className="border-b last:border-0 hover:bg-muted/40 transition-colors">
      <td className="px-4 py-3 font-medium text-sm">{kw.keyword}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold
          ${kw.pos <= 3 ? 'bg-emerald-100 text-emerald-800' :
            kw.pos <= 10 ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-700'}`}>
          #{kw.pos}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`flex items-center gap-0.5 text-xs font-semibold w-fit
          ${change > 0 ? 'text-emerald-600' : change < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
          {change > 0 ? <ArrowUpRight className="h-3 w-3" /> : change < 0 ? <ArrowDownRight className="h-3 w-3" /> : '–'}
          {Math.abs(change) || '–'}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{kw.volume}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{kw.traffic}</td>
    </tr>
  );
}

// ─── Alert Item ───────────────────────────────────────────────────────────────
function AlertItem({ type, msg, time }: { type: 'success' | 'warning' | 'error'; msg: string; time: string }) {
  const cfg = {
    success: { icon: CheckCircle, cls: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    warning: { icon: AlertTriangle, cls: 'text-amber-600 bg-amber-50 border-amber-200' },
    error:   { icon: AlertTriangle, cls: 'text-red-600 bg-red-50 border-red-200' },
  }[type];
  const Icon = cfg.icon;
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${cfg.cls}`}>
      <Icon className="h-4 w-4 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{msg}</p>
        <p className="text-xs opacity-70 mt-0.5">{time}</p>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function SEODashboard() {
  const [trackedKeywords, setTrackedKeywords] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [period, setPeriod] = useState<'24h' | '7d' | '30d' | '90d'>('30d');

  // Real-time listener for seo_keywords
  useEffect(() => {
    const q = query(collection(dbClient, 'seo_keywords'), orderBy('pos', 'asc'), limit(10));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setTrackedKeywords(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
      setLastUpdated(new Date());
    });
    return () => unsub();
  }, []);

  // Real-time listener for seo_alerts
  useEffect(() => {
    const q = query(collection(dbClient, 'seo_alerts'), orderBy('createdAt', 'desc'), limit(6));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setAlerts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    });
    return () => unsub();
  }, []);

  // Fallback display keywords (shown when Firestore has no data yet)
  const displayKeywords = trackedKeywords.length > 0 ? trackedKeywords : [
    { keyword: 'plot for sale in dhaka', pos: 3, prevPos: 5, volume: '12,500', traffic: '1,240' },
    { keyword: 'purbachal plot price', pos: 1, prevPos: 2, volume: '8,400', traffic: '2,100' },
    { keyword: 'buy land in bangladesh', pos: 5, prevPos: 5, volume: '5,200', traffic: '450' },
    { keyword: 'commercial space dhaka', pos: 12, prevPos: 9, volume: '15,000', traffic: '120' },
    { keyword: 'ready flat dhaka', pos: 7, prevPos: 10, volume: '9,800', traffic: '680' },
  ];

  const displayAlerts = alerts.length > 0 ? alerts : [
    { type: 'success', msg: '5 new pages indexed by Google', time: '2 hours ago' },
    { type: 'warning', msg: 'CLS score dropped on /land — check layout shift', time: '4 hours ago' },
    { type: 'success', msg: 'Keyword "plot for sale dhaka" moved from #5 to #3', time: '6 hours ago' },
    { type: 'error', msg: '3 broken internal links detected on /property', time: '8 hours ago' },
    { type: 'warning', msg: '2 pages missing meta descriptions', time: '12 hours ago' },
  ];

  const metrics = [
    { title: 'Organic Traffic', value: '12,450', change: '+14.2% this month', positive: true, icon: Globe, color: 'bg-blue-100 text-blue-600', spark: generateSparkData(1000) },
    { title: 'Indexed Pages', value: '142', change: '+12 new this week', positive: true, icon: Eye, color: 'bg-purple-100 text-purple-600', spark: generateSparkData(140) },
    { title: 'Avg. Position', value: '14.2', change: '↑ 2.1 positions', positive: true, icon: Target, color: 'bg-amber-100 text-amber-600', spark: generateSparkData(14) },
    { title: 'Click-Through Rate', value: '4.8%', change: '+0.6% vs last month', positive: true, icon: MousePointerClick, color: 'bg-emerald-100 text-emerald-600', spark: generateSparkData(48) },
    { title: 'Impressions', value: '258K', change: '+22% this month', positive: true, icon: BarChart3, color: 'bg-pink-100 text-pink-600', spark: generateSparkData(25000) },
    { title: 'Total Backlinks', value: '1,840', change: '+34 new this week', positive: true, icon: LinkIcon, color: 'bg-teal-100 text-teal-600', spark: generateSparkData(1800) },
    { title: 'Site Speed Score', value: '91', change: '+3 from last audit', positive: true, icon: Zap, color: 'bg-yellow-100 text-yellow-600', spark: generateSparkData(91) },
    { title: 'Mobile Usability', value: '98%', change: 'No new issues', positive: true, icon: Smartphone, color: 'bg-indigo-100 text-indigo-600', spark: generateSparkData(98) },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <SEOHeader />

      {/* Last updated + period selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <RefreshCw className="h-3 w-3 animate-spin" style={{ animationDuration: '4s' }} />
          Live · Updated {lastUpdated.toLocaleTimeString()}
        </div>
        <div className="flex gap-1 bg-muted p-1 rounded-lg">
          {(['24h', '7d', '30d', '90d'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${period === p ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* SEO Health + Core Web Vitals Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="rounded-xl border bg-card shadow-sm p-6 flex flex-col items-center justify-center gap-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">SEO Health Score</h3>
          <ScoreGauge score={92} label="Excellent" />
          <div className="w-full grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg bg-emerald-50 p-2"><div className="font-bold text-emerald-700">98</div><div className="text-muted-foreground">On-Page</div></div>
            <div className="rounded-lg bg-blue-50 p-2"><div className="font-bold text-blue-700">87</div><div className="text-muted-foreground">Technical</div></div>
            <div className="rounded-lg bg-amber-50 p-2"><div className="font-bold text-amber-700">91</div><div className="text-muted-foreground">Content</div></div>
          </div>
        </div>

        <div className="rounded-xl border bg-card shadow-sm p-6">
          <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">Core Web Vitals</h3>
          <div className="space-y-4">
            {cwvData.map(item => (
              <CWVBar key={item.name} {...item} />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t flex items-center gap-2 text-xs text-emerald-600 font-medium">
            <CheckCircle className="h-3.5 w-3.5" />
            All Core Web Vitals pass Google threshold
          </div>
        </div>

        <div className="rounded-xl border bg-card shadow-sm p-6">
          <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">Google Index Status</h3>
          <div className="space-y-3">
            {[
              { label: 'Total Pages', value: '167', icon: Globe, color: 'text-blue-600' },
              { label: 'Indexed', value: '142', icon: CheckCircle, color: 'text-emerald-600' },
              { label: 'Crawled (not indexed)', value: '18', icon: Clock, color: 'text-amber-600' },
              { label: 'Excluded', value: '7', icon: AlertTriangle, color: 'text-red-500' },
            ].map(row => {
              const Icon = row.icon;
              return (
                <div key={row.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className={`h-4 w-4 ${row.color}`} />
                    {row.label}
                  </div>
                  <span className="font-bold text-sm">{row.value}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="text-xs text-muted-foreground mb-1">Index Coverage</div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
            </div>
            <div className="text-xs text-emerald-600 mt-1 font-medium">85% indexed</div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {metrics.map(m => <MetricCard key={m.title} {...m} />)}
      </div>

      {/* Traffic Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3 rounded-xl border bg-card shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Organic vs Direct Traffic</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Last 7 months trend</p>
            </div>
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500"></span>Organic</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500"></span>Direct</span>
            </div>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDirect" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: 12 }} />
                <Area type="monotone" dataKey="organic" stroke="#3b82f6" strokeWidth={2} fill="url(#colorOrganic)" />
                <Area type="monotone" dataKey="direct" stroke="#D4AF37" strokeWidth={2} fill="url(#colorDirect)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Alerts */}
        <div className="lg:col-span-2 rounded-xl border bg-card shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Live SEO Alerts</h3>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="space-y-2">
            {displayAlerts.slice(0, 5).map((a, i) => (
              <AlertItem key={a.id || i} type={a.type} msg={a.msg} time={a.time} />
            ))}
          </div>
        </div>
      </div>

      {/* Keyword Tracker Table */}
      <div className="rounded-xl border bg-card shadow-sm mb-6">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Tracked Keywords</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {trackedKeywords.length > 0 ? 'Real-time from Firestore' : 'Sample data — add keywords in the Keywords tab'}
            </p>
          </div>
          <a href="/admin/seo/keywords" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
            Manage <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Keyword</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Position</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Change</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Volume</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Traffic</th>
              </tr>
            </thead>
            <tbody>
              {displayKeywords.map((kw, i) => <KeywordRow key={kw.id || i} kw={kw} />)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Google Search Console Connection Banner */}
      <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-white shadow border flex items-center justify-center">
            <Search className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold">Connect Google Search Console</h3>
            <p className="text-sm text-muted-foreground">Unlock real clicks, impressions, CTR, and position data directly from Google.</p>
          </div>
        </div>
        <a
          href="https://search.google.com/search-console"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          Connect GSC <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
