import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ success: true });
    response.cookies.set('is_subscribed', 'true', {
        httpOnly: false,
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
    });
    return response;
}
