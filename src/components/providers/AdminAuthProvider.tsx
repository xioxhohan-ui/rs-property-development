'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { Loader2 } from 'lucide-react';

export default function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for development bypass
    if (typeof window !== 'undefined' && localStorage.getItem('admin_bypass') === 'true') {
      setUser({ uid: 'bypass', email: 'admin@local' } as User);
      setLoading(false);
      if (pathname.includes('/login')) {
        router.push('/admin');
      }
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      // Protection Logic
      if (!currentUser && !pathname.includes('/login')) {
        router.push('/admin/login');
      } else if (currentUser && pathname.includes('/login')) {
        router.push('/admin');
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  // If not logged in and trying to access protected route, don't render children yet
  if (!user && !pathname.includes('/login')) {
    return null; 
  }

  return <>{children}</>;
}
