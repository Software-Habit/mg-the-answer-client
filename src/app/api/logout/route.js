// /app/api/logout/route.js
import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ message: 'Logged out' });
    
    // Clear the 'auth' cookie by setting its expiration in the past
    response.cookies.set('auth', '', { path: '/', maxAge: -1 });

    return response;
}
