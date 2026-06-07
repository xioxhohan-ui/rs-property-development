import React from 'react';
import AdminSidebar from './_components/AdminSidebar';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Navbar Placeholder (Mobile navbar is inside AdminSidebar) */}
        <header className="h-16 bg-card border-b hidden md:flex items-center justify-end px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              A
            </div>
            <span className="text-sm font-medium">Admin User</span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
