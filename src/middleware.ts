import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/admin')) {
        if (pathname === '/admin/login') return NextResponse.next();

        const session = request.cookies.get('admin_session')?.value;
        if (!session || session !== process.env.ADMIN_PASSWORD) {
            const url = request.nextUrl.clone();
            url.pathname = '/admin/login';
            url.searchParams.set('from', pathname);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
