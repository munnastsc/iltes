import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

type Body = {
    email?: string;
};

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as Body;
        const email = body.email?.trim().toLowerCase();

        if (!email) {
            return NextResponse.json({ error: 'Email দাও।' }, { status: 400 });
        }

        let plan = 'spoken';
        let found = false;

        try {
            // Find most recent APPROVED payment for this email
            const row = await prisma.paymentRequest.findFirst({
                where: { email, status: 'APPROVED' },
                orderBy: { updatedAt: 'desc' },
            });

            if (row) {
                found = true;
                plan = row.plan || 'spoken';
            }
        } catch {
            return NextResponse.json({ error: 'Database error।' }, { status: 500 });
        }

        if (!found) {
            return NextResponse.json({ error: 'এই email এ কোনো approved payment নেই। Admin approval এর জন্য অপেক্ষা করো।' }, { status: 403 });
        }

        const response = NextResponse.json({ success: true, plan });
        response.cookies.set('subscription_plan', plan, {
            httpOnly: false,
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
            sameSite: 'lax',
        });
        response.cookies.set('is_subscribed', 'true', {
            httpOnly: false,
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
            sameSite: 'lax',
        });
        return response;
    } catch {
        return NextResponse.json({ error: 'Activation failed।' }, { status: 500 });
    }
}
