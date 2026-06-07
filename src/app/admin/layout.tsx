import React from 'react';
import './admin.css';
import AdminAuthProvider from '@/components/providers/AdminAuthProvider';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-container min-h-screen bg-background text-foreground font-sans">
      <AdminAuthProvider>
        {children}
      </AdminAuthProvider>
    </div>
  );
}
