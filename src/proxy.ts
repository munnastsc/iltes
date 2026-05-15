import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/book/:path*', '/api/chat/:path*', '/api/audio/:path*'],
}
