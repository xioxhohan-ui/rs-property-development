'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Settings, Search, Image as ImageIcon, Link as LinkIcon, Bell, Target, Globe, BarChart3 } from 'lucide-react';

const TABS = [
  { name: 'Dashboard', href: '/admin/seo', icon: LayoutDashboard },
  { name: 'Keywords', href: '/admin/seo/keywords', icon: Target },
  { name: 'Content Analyzer', href: '/admin/seo/content', icon: FileText },
  { name: 'Technical SEO', href: '/admin/seo/technical', icon: Settings },
  { name: 'Image SEO', href: '/admin/seo/images', icon: ImageIcon },
  { name: 'Backlinks', href: '/admin/seo/backlinks', icon: LinkIcon },
  { name: 'Competitors', href: '/admin/seo/competitors', icon: BarChart3 },
  { name: 'Local SEO', href: '/admin/seo/local', icon: Globe },
  { name: 'Alerts', href: '/admin/seo/alerts', icon: Bell },
];

export default function SEOHeader() {
  const pathname = usePathname();

  return (
    <div className="mb-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">SEO Control Center <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-1 align-middle">2.0</span></h1>
              <p className="text-muted-foreground text-sm">Enterprise SEO management, analytics, and real-time monitoring.</p>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Monitoring Active
          </div>
        </div>
      </div>

      <div className="flex space-x-1 border-b overflow-x-auto pb-px scrollbar-hide">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href || (tab.href !== '/admin/seo' && pathname.startsWith(tab.href));
          const Icon = tab.icon;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`
                flex items-center px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors gap-1.5
                ${isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'}
              `}
            >
              <Icon className="h-4 w-4" />
              {tab.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
