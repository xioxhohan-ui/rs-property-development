'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Settings, Search, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

const TABS = [
  { name: 'Dashboard', href: '/admin/seo', icon: LayoutDashboard },
  { name: 'Content Analyzer', href: '/admin/seo/content', icon: FileText },
  { name: 'Keyword Research', href: '/admin/seo/keywords', icon: Search },
  { name: 'Technical SEO', href: '/admin/seo/technical', icon: Settings },
  { name: 'Image SEO', href: '/admin/seo/images', icon: ImageIcon },
  { name: 'Backlinks', href: '/admin/seo/backlinks', icon: LinkIcon },
];

export default function SEOHeader() {
  const pathname = usePathname();

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">SEO Control Center</h1>
      <p className="text-muted-foreground mb-6">Enterprise SEO management, analytics, and automation.</p>
      
      <div className="flex space-x-1 border-b overflow-x-auto pb-px">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`
                flex items-center px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors
                ${isActive 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'}
              `}
            >
              <Icon className="mr-2 h-4 w-4" />
              {tab.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
