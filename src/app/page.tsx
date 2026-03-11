'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        // Unauthenticated admins go directly to login
        router.replace('/login');
      }
    }
  }, [router, user, isLoading]);

  return (
    <div className="flex h-screen items-center justify-center bg-muted/30">
      <div className="text-center space-y-4">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-muted-foreground animate-pulse">Initializing Admin Suite...</p>
      </div>
    </div>
  );
}
