'use client';

import React, { useState, useEffect } from 'react';
import SEOHeader from '../_components/SEOHeader';
import { dbClient } from '@/lib/firebase/client';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { Image as ImageIcon, CheckCircle, XCircle, AlertTriangle, Zap, RefreshCw } from 'lucide-react';

interface ImageAuditResult {
  url: string;
  hasAlt: boolean;
  alt: string;
  isWebP: boolean;
  source: string;
}

function auditImages(properties: any[]): ImageAuditResult[] {
  const results: ImageAuditResult[] = [];
  for (const p of properties) {
    const urls = [p.image, p.coverImage, ...(p.images || []), ...(p.galleryImages || [])].filter(Boolean);
    for (const url of urls) {
      results.push({
        url,
        hasAlt: !!(p.title),
        alt: p.title || '',
        isWebP: url.includes('.webp') || url.includes('webp'),
        source: p.title || p.id,
      });
    }
  }
  return results;
}

export default function ImageSEOPage() {
  const [results, setResults] = useState<ImageAuditResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [ran, setRan] = useState(false);

  const runAudit = async () => {
    setLoading(true);
    try {
      const colls = ['properties', 'lands', 'ready_flats', 'interior_projects'];
      const all: any[] = [];
      for (const c of colls) {
        const snap = await getDocs(query(collection(dbClient, c), limit(50)));
        all.push(...snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
      setResults(auditImages(all));
      setRan(true);
    } finally {
      setLoading(false);
    }
  };

  const withAlt = results.filter(r => r.hasAlt).length;
  const withoutAlt = results.filter(r => !r.hasAlt).length;
  const webp = results.filter(r => r.isWebP).length;
  const nonWebP = results.filter(r => !r.isWebP).length;

  return (
    <div className="max-w-7xl mx-auto">
      <SEOHeader />

      <div className="rounded-xl border bg-gradient-to-r from-primary/10 to-amber-50 border-primary/20 p-6 mb-6 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1">
          <h3 className="font-semibold flex items-center gap-2"><ImageIcon className="h-5 w-5 text-primary" /> Image SEO Audit</h3>
          <p className="text-sm text-muted-foreground mt-1">Scan all property images across your database for SEO issues.</p>
        </div>
        <button onClick={runAudit} disabled={loading}
          className="shrink-0 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors">
          {loading ? <><RefreshCw className="h-4 w-4 animate-spin" />Scanning...</> : <><Zap className="h-4 w-4" />Run Image Audit</>}
        </button>
      </div>

      {ran && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="rounded-xl border bg-blue-50 border-blue-200 p-5 text-center">
              <div className="text-3xl font-bold text-blue-700">{results.length}</div>
              <div className="text-sm text-blue-700 mt-1">Total Images</div>
            </div>
            <div className="rounded-xl border bg-emerald-50 border-emerald-200 p-5 text-center">
              <div className="text-3xl font-bold text-emerald-700">{withAlt}</div>
              <div className="text-sm text-emerald-700 mt-1">Have Alt Text</div>
            </div>
            <div className="rounded-xl border bg-red-50 border-red-200 p-5 text-center">
              <div className="text-3xl font-bold text-red-700">{withoutAlt}</div>
              <div className="text-sm text-red-700 mt-1">Missing Alt Text</div>
            </div>
            <div className="rounded-xl border bg-amber-50 border-amber-200 p-5 text-center">
              <div className="text-3xl font-bold text-amber-700">{nonWebP}</div>
              <div className="text-sm text-amber-700 mt-1">Non-WebP Format</div>
            </div>
          </div>

          {/* Recommendations */}
          {(withoutAlt > 0 || nonWebP > 0) && (
            <div className="rounded-xl border bg-amber-50 border-amber-200 p-5 mb-6 space-y-2">
              <h3 className="font-semibold text-amber-800 flex items-center gap-2"><AlertTriangle className="h-4 w-4" />Recommendations</h3>
              {withoutAlt > 0 && <p className="text-sm text-amber-700">• {withoutAlt} images are missing alt text. Alt text is auto-generated from property title when saving via the Admin form. Ensure all properties have a title.</p>}
              {nonWebP > 0 && <p className="text-sm text-amber-700">• {nonWebP} images are not in WebP format. Consider converting your images to WebP for faster load times and better Core Web Vitals.</p>}
            </div>
          )}

          {results.length === 0 && (
            <div className="rounded-xl border p-10 text-center text-muted-foreground">
              No images found. Make sure properties have images uploaded.
            </div>
          )}

          {/* Table */}
          {results.length > 0 && (
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b"><h3 className="font-semibold">Image Audit Results</h3></div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      {['Preview', 'Property', 'Alt Text', 'Format', 'Status'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.slice(0, 30).map((r, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <div className="h-12 w-16 rounded-md overflow-hidden bg-muted border">
                            <img src={r.url} alt={r.alt} className="h-full w-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-xs max-w-[150px] truncate">{r.source}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground max-w-[180px] truncate">{r.alt || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.isWebP ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {r.isWebP ? 'WebP' : 'Non-WebP'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {r.hasAlt
                            ? <CheckCircle className="h-4 w-4 text-emerald-600" />
                            : <XCircle className="h-4 w-4 text-red-500" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {results.length > 30 && (
                  <div className="px-5 py-3 text-xs text-muted-foreground border-t">Showing first 30 of {results.length} images.</div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {!ran && !loading && (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p>Click "Run Image Audit" to scan all property images for SEO issues.</p>
        </div>
      )}
    </div>
  );
}
