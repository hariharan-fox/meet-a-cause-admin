'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from './header';
import Sidebar from './sidebar';
import { useAuth } from '@/lib/auth-context';
import BottomNav from './bottom-nav';
import Footer from './footer';

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isLoading } = useAuth();

    const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/signup');
    const isPublicPage = pathname === '/' || isAuthPage;

    useEffect(() => {
        if (isLoading) return;

        if (user) {
            // If user is logged in, redirect away from auth pages and landing page
            if (isAuthPage || pathname === '/') {
                router.push('/dashboard');
            }
        } else {
            // If user is not logged in, protect non-public pages
            if (!isPublicPage) {
                router.push('/login');
            }
        }
    }, [user, isLoading, isPublicPage, isAuthPage, router, pathname]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/10">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium text-muted-foreground">Loading Admin Portal...</span>
                </div>
            </div>
        );
    }

    if (user) {
        // Authenticated Admin layout
        return (
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
                <Sidebar />
                <div className="flex flex-col">
                    <Header />
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 pb-20 md:pb-6">
                        {children}
                    </main>
                </div>
                <BottomNav />
            </div>
        );
    }
    
    // Auth page layout (Login/Signup)
    if (isAuthPage || pathname === '/') {
         return (
            <div className="flex flex-col min-h-screen">
                <main className="flex-1 flex items-center justify-center p-4">
                    {children}
                </main>
            </div>
        );
    }

    return null; 
}
