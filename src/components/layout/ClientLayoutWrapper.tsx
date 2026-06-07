'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}
      <main style={{ minHeight: !isAdmin ? 'calc(100vh - 5rem)' : '100vh', paddingTop: !isAdmin ? '5rem' : '0' }}>
        {children}
      </main>
      {!isAdmin && <Footer />}
    </>
  );
}
