import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token1')?.value;
  const { pathname } = request.nextUrl;

  // Protect internal routes requiring user login
  const isProtectedRoute = 
    pathname.startsWith('/profile') || 
    pathname.startsWith('/compare') || 
    pathname.startsWith('/live-interview') || 
    pathname.startsWith('/admin-varify') ||
    pathname.startsWith('/admin-newsletters');

  // Prevent logged-in users from visiting auth forms
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/sign-up');

  if (isProtectedRoute && !token) {
    console.log(`[Middleware] Blocking access to protected path: ${pathname}. Redirecting to /login.`);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthRoute && token) {
    console.log(`[Middleware] User already authenticated. Redirecting away from ${pathname} to home.`);
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Config matcher to only run middleware on relevant paths
export const config = {
  matcher: [
    '/profile/:path*',
    '/compare/:path*',
    '/live-interview/:path*',
    '/admin-varify/:path*',
    '/admin-newsletters/:path*',
    '/login',
    '/sign-up'
  ]
};
