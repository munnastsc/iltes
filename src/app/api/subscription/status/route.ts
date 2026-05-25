import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email')?.trim().toLowerCase();

    if (!email) return NextResponse.json({ error: 'Email দাও।' }, { status: 400 });

    try {
        const row = await prisma.paymentRequest.findFirst({
            where: { email },
            orderBy: { createdAt: 'desc' },
            select: { status: true, plan: true, amount: true, createdAt: true },
        });

        if (!row) return NextResponse.json({ found: false });

        return NextResponse.json({ found: true, status: row.status, plan: row.plan, amount: row.amount });
    } catch {
        return NextResponse.json({ error: 'Error checking status।' }, { status: 500 });
    }
}
