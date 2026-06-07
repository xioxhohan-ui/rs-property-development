'use client';

import React, { useState } from 'react';
import SEOHeader from '../_components/SEOHeader';
import {
  CheckCircle, XCircle, AlertTriangle, Loader2, Search,
  Hash, FileText, Link as LinkIcon, Image as ImageIcon,
  BookOpen, AlignLeft, BarChart3
} from 'lucide-react';

interface AnalysisResult {
  score: number;
  title: { value: string; length: number; ok: boolean; msg: string };
  description: { value: string; length: number; ok: boolean; msg: string };
  wordCount: number;
  keywordDensity: number;
  headings: { h1: number; h2: number; h3: number };
  suggestions: string[];
  issues: string[];
}

function analyze(title: string, desc: string, content: string, keyword: string): AnalysisResult {
  const titleLen = title.length;
  const descLen = desc.length;
  const words = content.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const kwCount = keyword ? words.filter(w => w.toLowerCase().includes(keyword.toLowerCase())).length : 0;
  const kwDensity = wordCount > 0 && keyword ? parseFloat(((kwCount / wordCount) * 100).toFixed(1)) : 0;

  const h1 = (content.match(/^# .+/gm) || []).length;
  const h2 = (content.match(/^## .+/gm) || []).length;
  const h3 = (content.match(/^### .+/gm) || []).length;

  const suggestions: string[] = [];
  const issues: string[] = [];

  let score = 100;

  // Title
  const titleOk = titleLen >= 40 && titleLen <= 60;
  if (!titleOk) { score -= 15; issues.push(titleLen < 40 ? 'Title is too short (under 40 chars)' : 'Title is too long (over 60 chars)'); }

  // Description
  const descOk = descLen >= 120 && descLen <= 160;
  if (!descOk) { score -= 15; issues.push(descLen < 120 ? 'Meta description is too short' : 'Meta description is too long'); }

  // Word count
  if (wordCount < 300) { score -= 20; issues.push('Content is too short — aim for 600+ words'); }
  else if (wordCount < 600) { score -= 10; suggestions.push('Good start! More content (600+ words) improves rankings.'); }

  // Keyword density
  if (keyword && kwDensity === 0) { score -= 15; issues.push(`Target keyword "${keyword}" not found in content`); }
  else if (kwDensity > 3) { score -= 10; issues.push('Keyword density is too high (> 3%) — avoid keyword stuffing'); }
  else if (kwDensity > 0) suggestions.push(`Keyword density: ${kwDensity}% — looks good!`);

  // Headings
  if (h1 === 0) { score -= 10; issues.push('No H1 heading found in content'); }
  if (h2 === 0) { score -= 5; suggestions.push('Add H2 subheadings to improve structure'); }
  if (h1 > 1) { score -= 5; issues.push('Multiple H1 headings — use only one H1 per page'); }

  // Suggestions
  if (!content.includes('https://') && !content.includes('http://')) suggestions.push('Consider adding external links to authoritative sources');
  if (wordCount > 0 && !content.toLowerCase().includes('?')) suggestions.push('Consider adding an FAQ section for featured snippet opportunities');

  return {
    score: Math.max(0, score),
    title: { value: title, length: titleLen, ok: titleOk, msg: titleOk ? 'Perfect length' : (titleLen < 40 ? 'Too short' : 'Too long') },
    description: { value: desc, length: descLen, ok: descOk, msg: descOk ? 'Perfect length' : (descLen < 120 ? 'Too short' : 'Too long') },
    wordCount,
    keywordDensity: kwDensity,
    headings: { h1, h2, h3 },
    suggestions,
    issues,
  };
}

function ScoreCircle({ score }: { score: number }) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';
  const r = 38, circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="9" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="9"
          strokeDasharray={`${(score / 100) * circ} ${circ}`}
          strokeLinecap="round" transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dasharray 1s ease' }} />
        <text x="50" y="45" textAnchor="middle" fill={color} fontSize="22" fontWeight="bold">{score}</text>
        <text x="50" y="60" textAnchor="middle" fill="#9ca3af" fontSize="10">/100</text>
      </svg>
      <span className="text-sm font-semibold" style={{ color }}>
        {score >= 80 ? 'Excellent' : score >= 60 ? 'Needs Work' : 'Poor'}
      </span>
    </div>
  );
}

function CheckItem({ ok, msg }: { ok: boolean; msg: string }) {
  return (
    <div className={`flex items-start gap-2 text-sm py-1.5 ${ok ? 'text-emerald-700' : 'text-red-600'}`}>
      {ok ? <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" /> : <XCircle className="h-4 w-4 shrink-0 mt-0.5" />}
      {msg}
    </div>
  );
}

export default function ContentAnalyzerPage() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [content, setContent] = useState('');
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResult(analyze(title, desc, content, keyword));
      setAnalyzing(false);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <SEOHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border bg-card shadow-sm p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Content Input</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground flex justify-between">
                  <span>SEO Title</span>
                  <span className={title.length > 60 ? 'text-red-500' : title.length >= 40 ? 'text-emerald-600' : 'text-amber-500'}>{title.length}/60</span>
                </label>
                <input value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Buy Luxury Plot in Purbachal | RS Property Development"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground flex justify-between">
                  <span>Meta Description</span>
                  <span className={desc.length > 160 ? 'text-red-500' : desc.length >= 120 ? 'text-emerald-600' : 'text-amber-500'}>{desc.length}/160</span>
                </label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3}
                  placeholder="Explore premium plots and land for sale in Purbachal, Dhaka. Verified listings with clear titles..."
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Target Keyword</label>
                <input value={keyword} onChange={e => setKeyword(e.target.value)}
                  placeholder="e.g. plot for sale in dhaka"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground flex justify-between">
                  <span>Page Content</span>
                  <span className="text-muted-foreground">{content.trim().split(/\s+/).filter(Boolean).length} words</span>
                </label>
                <textarea value={content} onChange={e => setContent(e.target.value)} rows={10}
                  placeholder="Paste your page content here. Use # for H1, ## for H2, ### for H3 headings..."
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono text-xs" />
              </div>
              <button onClick={handleAnalyze} disabled={analyzing || (!title && !content)}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg py-2.5 font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
                {analyzing ? <><Loader2 className="h-4 w-4 animate-spin" />Analyzing...</> : <><Search className="h-4 w-4" />Analyze SEO</>}
              </button>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          {!result ? (
            <div className="rounded-xl border bg-card shadow-sm p-8 flex flex-col items-center justify-center text-center gap-3 min-h-[300px]">
              <BarChart3 className="h-12 w-12 text-muted-foreground/30" />
              <p className="text-muted-foreground text-sm">Enter your content and click Analyze to get your SEO score.</p>
            </div>
          ) : (
            <>
              {/* Score */}
              <div className="rounded-xl border bg-card shadow-sm p-6 flex flex-col items-center gap-4">
                <h3 className="font-semibold text-sm">SEO Score</h3>
                <ScoreCircle score={result.score} />
              </div>

              {/* Checks */}
              <div className="rounded-xl border bg-card shadow-sm p-5">
                <h3 className="font-semibold text-sm mb-3">Analysis Checks</h3>
                <div className="space-y-1 divide-y">
                  <CheckItem ok={result.title.ok} msg={`Title: ${result.title.length} chars — ${result.title.msg}`} />
                  <CheckItem ok={result.description.ok} msg={`Description: ${result.description.length} chars — ${result.description.msg}`} />
                  <CheckItem ok={result.wordCount >= 600} msg={`Word count: ${result.wordCount} words ${result.wordCount < 600 ? '(min 600 recommended)' : '✓'}`} />
                  <CheckItem ok={result.headings.h1 === 1} msg={`H1 headings: ${result.headings.h1} (need exactly 1)`} />
                  <CheckItem ok={result.headings.h2 >= 2} msg={`H2 subheadings: ${result.headings.h2} (2+ recommended)`} />
                  {keyword && <CheckItem ok={result.keywordDensity > 0 && result.keywordDensity <= 3} msg={`Keyword density: ${result.keywordDensity}% (1–3% ideal)`} />}
                </div>
              </div>

              {/* Issues */}
              {result.issues.length > 0 && (
                <div className="rounded-xl border bg-red-50 border-red-200 p-5">
                  <h3 className="font-semibold text-sm text-red-700 mb-3 flex items-center gap-2"><XCircle className="h-4 w-4" />Issues to Fix</h3>
                  <div className="space-y-2">
                    {result.issues.map((issue, i) => (
                      <div key={i} className="text-xs text-red-700 flex items-start gap-2">
                        <span className="shrink-0 mt-0.5">•</span>{issue}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {result.suggestions.length > 0 && (
                <div className="rounded-xl border bg-amber-50 border-amber-200 p-5">
                  <h3 className="font-semibold text-sm text-amber-700 mb-3 flex items-center gap-2"><AlertTriangle className="h-4 w-4" />Suggestions</h3>
                  <div className="space-y-2">
                    {result.suggestions.map((s, i) => (
                      <div key={i} className="text-xs text-amber-700 flex items-start gap-2">
                        <span className="shrink-0 mt-0.5">→</span>{s}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
