// /src/app/api/auth/route.js
import { NextResponse } from 'next/server';

const DEV_PASSWORD = process.env.DEV_PASSWORD;

export async function POST(req) {
    console.log('test')
    const { password } = await req.json();

    console.log(password);
    console.log(DEV_PASSWORD);

    if (password === DEV_PASSWORD) {
        // Set a cookie to authenticate future requests
        const response = NextResponse.json({ message: 'Authenticated' });
        response.cookies.set('auth', 'true', { httpOnly: true, secure: true, path: '/' });
        return response;
    }

    return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
}
