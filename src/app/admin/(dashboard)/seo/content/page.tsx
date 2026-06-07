'use client';

import React, { useState, useEffect } from 'react';
import SEOHeader from '../_components/SEOHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function ContentAnalyzer() {
  const [keyword, setKeyword] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [score, setScore] = useState(0);

  const [checks, setChecks] = useState({
    titleLength: false,
    titleKeyword: false,
    contentLength: false,
    keywordDensity: false,
    headings: false,
  });

  useEffect(() => {
    let currentScore = 0;
    const newChecks = { ...checks };

    // 1. Title length
    if (title.length >= 40 && title.length <= 60) {
      currentScore += 20;
      newChecks.titleLength = true;
    } else {
      newChecks.titleLength = false;
    }

    // 2. Keyword in title
    if (keyword && title.toLowerCase().includes(keyword.toLowerCase())) {
      currentScore += 20;
      newChecks.titleKeyword = true;
    } else {
      newChecks.titleKeyword = false;
    }

    // 3. Content length
    const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
    if (words >= 300) {
      currentScore += 20;
      newChecks.contentLength = true;
    } else {
      newChecks.contentLength = false;
    }

    // 4. Keyword density (target ~1-2%)
    if (keyword && words > 0) {
      const keywordRegex = new RegExp(keyword, 'gi');
      const matches = content.match(keywordRegex) || [];
      const density = (matches.length / words) * 100;
      if (density >= 1 && density <= 2.5) {
        currentScore += 20;
        newChecks.keywordDensity = true;
      } else {
        newChecks.keywordDensity = false;
      }
    } else {
      newChecks.keywordDensity = false;
    }

    // 5. Headings used
    if (content.includes('##') || content.includes('<h3>')) {
      currentScore += 20;
      newChecks.headings = true;
    } else {
      newChecks.headings = false;
    }

    setScore(currentScore);
    setChecks(newChecks);
  }, [keyword, title, content]);

  return (
    <div className="max-w-7xl mx-auto">
      <SEOHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Primary Keyword</label>
                <input 
                  type="text" 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g. plot for sale in dhaka"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">SEO Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter optimized title"
                />
                <p className="text-xs text-muted-foreground mt-1">{title.length} characters (Optimal: 40-60)</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Article Content</label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2 border rounded-md h-[400px]"
                  placeholder="Start writing your SEO optimized content here..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {content.trim().split(/\s+/).filter(w => w.length > 0).length} words (Minimum 300 recommended)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live SEO Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6">
                <div className={`text-6xl font-bold ${score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                  {score}
                </div>
                <p className="text-sm text-muted-foreground mt-2">/ 100 points</p>
              </div>

              <div className="space-y-4 mt-6 border-t pt-6">
                <h3 className="font-semibold text-sm">Optimization Checklist</h3>
                
                <div className="flex items-start gap-2 text-sm">
                  {checks.titleKeyword ? <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> : <XCircle className="h-5 w-5 text-red-500 shrink-0" />}
                  <span>Primary keyword in title</span>
                </div>
                
                <div className="flex items-start gap-2 text-sm">
                  {checks.titleLength ? <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> : <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />}
                  <span>Title length is optimal (40-60 chars)</span>
                </div>
                
                <div className="flex items-start gap-2 text-sm">
                  {checks.contentLength ? <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> : <XCircle className="h-5 w-5 text-red-500 shrink-0" />}
                  <span>Content is at least 300 words</span>
                </div>
                
                <div className="flex items-start gap-2 text-sm">
                  {checks.keywordDensity ? <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> : <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />}
                  <span>Keyword density is optimal (1-2.5%)</span>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  {checks.headings ? <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> : <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />}
                  <span>Content uses headings for structure</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
