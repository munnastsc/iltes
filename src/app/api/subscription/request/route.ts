import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { createLocalPaymentRequest, findLocalPaymentByTransaction } from '../../../../lib/localStore';

type Body = {
    email?: string;
    transactionId?: string;
    amount?: number;
};

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as Body;
        const email = body.email?.trim().toLowerCase();
        const transactionId = body.transactionId?.trim().toUpperCase();
        const amount = Number(body.amount || 0);

        if (!email || !transactionId || !amount) {
            return NextResponse.json({ error: 'email, transactionId, amount required.' }, { status: 400 });
        }

        try {
            const existing = await prisma.paymentRequest.findUnique({ where: { transactionId } });
            if (existing) {
                return NextResponse.json({ error: 'Transaction ID already submitted.' }, { status: 409 });
            }

            const row = await prisma.paymentRequest.create({
                data: { email, transactionId, amount, status: 'PENDING' },
            });
            return NextResponse.json({ success: true, id: row.id, status: row.status, source: 'database' });
        } catch {
            const existing = await findLocalPaymentByTransaction(transactionId);
            if (existing) return NextResponse.json({ error: 'Transaction ID already submitted.' }, { status: 409 });

            const row = await createLocalPaymentRequest({ email, transactionId, amount });
            if (!row) return NextResponse.json({ error: 'Transaction ID already submitted.' }, { status: 409 });
            return NextResponse.json({ success: true, id: row.id, status: row.status, source: 'local' });
        }
    } catch {
        return NextResponse.json({ error: 'Could not create request.' }, { status: 500 });
    }
}
