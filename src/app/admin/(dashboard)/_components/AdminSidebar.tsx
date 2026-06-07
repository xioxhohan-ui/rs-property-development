'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building, FileText, Mail, Users, Map, Settings, Menu, X, LogOut } from 'lucide-react';
import { auth } from '@/lib/firebase/client';
import { signOut } from 'firebase/auth';

const NAV_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/properties', label: 'Properties', icon: Building },
  { href: '/admin/blogs', label: 'Blogs', icon: FileText },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Mail },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/users', label: 'Users', icon: Users }, // Reusing Users icon
  { href: '/admin/districts', label: 'Districts', icon: Map },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_bypass');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-primary">RS Admin</h2>
        <button className="md:hidden" onClick={() => setIsOpen(false)}>
          <X className="h-6 w-6 text-muted-foreground" />
        </button>
      </div>
      <nav className="space-y-1 px-4 flex-1">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
          
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center px-4 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="md:hidden flex items-center justify-between bg-card border-b p-4 sticky top-0 z-20">
        <span className="text-lg font-bold text-primary">RS Admin</span>
        <button onClick={() => setIsOpen(true)} className="p-2 rounded-md hover:bg-muted">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-card border-r flex flex-col transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarContent />
      </aside>
    </>
  );
}
