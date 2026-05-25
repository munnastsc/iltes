import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { password } = await request.json();
    const correct = process.env.ADMIN_PASSWORD;

    if (!correct || password !== correct) {
        return NextResponse.json({ error: 'Wrong password.' }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set('admin_session', correct, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });
    return res;
}

export async function DELETE() {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete('admin_session');
    return res;
}
