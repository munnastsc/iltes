import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith('/admin')) {
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminPassword) return NextResponse.next();

        const authHeader = req.headers.get('authorization');
        if (authHeader) {
            const encoded = authHeader.replace('Basic ', '');
            const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
            const [, password] = decoded.split(':');
            if (password === adminPassword) return NextResponse.next();
        }

        return new NextResponse('Unauthorized', {
            status: 401,
            headers: { 'WWW-Authenticate': 'Basic realm="Admin Panel"' },
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
