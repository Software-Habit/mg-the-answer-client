import { NextResponse } from 'next/server';

export function middleware(req) {
    const auth = req.cookies.get('auth')?.value;
    const { pathname } = req.nextUrl;

    // Allow access to the login page, auth API, logout API, or if authenticated
    if (
        pathname.startsWith('/login') || 
        pathname.startsWith('/api/auth') ||  // Exclude the auth API from the check
        pathname.startsWith('/api/logout') ||  // Allow logout API
        auth === 'true'
    ) {
        return NextResponse.next();
    }

    // Allow sync requests if X-Dev-Password matches DEV_PASSWORD
    if (pathname.startsWith('/api/charges/sync') || pathname.startsWith('/api/subscriptions/sync')) {
        const devPassword = req.headers.get('x-dev-password');
        if (devPassword && devPassword === process.env.DEV_PASSWORD) {
            return NextResponse.next();
        } else {
            return new Response('Unauthorized', { status: 401 });
        }
    }

    // Redirect to login page if not authenticated
    return NextResponse.redirect(new URL('/login', req.url));
}

export const config = {
    matcher: ['/', '/dashboard/:path*', '/api/:path*'], // Protect all routes except login, auth, and logout APIs
};
