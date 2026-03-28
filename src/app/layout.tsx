
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/lib/auth-context';
import { BadgeUnlockProvider } from '@/lib/badge-unlock-context';
import { ClientLayout } from '@/components/layout/client-layout';
import { Merriweather, Inter } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase';

const headlineFont = Merriweather({
  subsets: ['latin'],
  weight: '700',
  display: 'swap',
  variable: '--font-headline',
});

const bodyFont = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Meet A Cause | Admin Portal',
  description: 'Shared Administrative Suite for the Meet A Cause Platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(headlineFont.variable, bodyFont.variable)}>
      <body className={cn('min-h-screen bg-background font-body text-foreground/90 antialiased')}>
        <FirebaseClientProvider>
          <AuthProvider>
            <BadgeUnlockProvider>
              <ClientLayout>
                {children}
              </ClientLayout>
            </BadgeUnlockProvider>
          </AuthProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
