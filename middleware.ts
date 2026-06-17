// middleware.ts
// Place this file in the ROOT of your project (same level as package.json)
// This runs on every request before the page loads

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Admin panel protected routes
const PROTECTED_ROUTES = [
  '/dashboard',
  '/analytics',
  '/ngos',
  '/events',
  '/volunteers',
  '/settings',
];

const PUBLIC_ROUTES = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route needs protection
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  );

  const isPublicRoute = PUBLIC_ROUTES.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  );

  // Get session cookie — Firebase sets this after login
  const sessionCookie = request.cookies.get('__session')?.value ||
    request.cookies.get('firebase-auth')?.value;

  // If accessing protected route without session, redirect to login
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
