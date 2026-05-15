import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { findLocalPaymentByTransaction } from '../../../../lib/localStore';

type Body = {
    email?: string;
    transactionId?: string;
};

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as Body;
        const email = body.email?.trim().toLowerCase();
        const transactionId = body.transactionId?.trim().toUpperCase();

        if (!email || !transactionId) {
            return NextResponse.json({ error: 'email and transactionId are required.' }, { status: 400 });
        }

        let approved = false;

        try {
            const requestRow = await prisma.paymentRequest.findUnique({ where: { transactionId } });
            approved = Boolean(requestRow && requestRow.email === email && requestRow.status === 'APPROVED');
        } catch {
            const local = await findLocalPaymentByTransaction(transactionId);
            approved = Boolean(local && local.email === email && local.status === 'APPROVED');
        }

        if (!approved) {
            return NextResponse.json({ error: 'Payment is not approved yet.' }, { status: 403 });
        }

        const response = NextResponse.json({ success: true, status: 'active' });
        response.cookies.set('is_subscribed', 'true', {
            httpOnly: false,
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
            sameSite: 'lax',
        });
        return response;
    } catch {
        return NextResponse.json({ error: 'Activation failed.' }, { status: 500 });
    }
}
