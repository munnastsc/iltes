import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { createLocalPaymentRequest, findLocalPaymentByTransaction } from '../../../../lib/localStore';
import { sendWhatsApp } from '../../../../lib/whatsapp';

const PLAN_LABELS: Record<string, string> = {
    spoken: 'Spoken English (৳49)',
    ielts_spoken: 'IELTS + Spoken English (৳299)',
    unlimited_chat: 'Unlimited AI Chat (৳499)',
};

type Body = {
    email?: string;
    transactionId?: string;
    amount?: number;
    plan?: string;
};

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as Body;
        const email = body.email?.trim().toLowerCase();
        const transactionId = body.transactionId?.trim().toUpperCase();
        const amount = Number(body.amount || 0);
        const plan = body.plan || 'spoken';

        if (!email || !transactionId || !amount) {
            return NextResponse.json({ error: 'email, transactionId, amount required.' }, { status: 400 });
        }

        try {
            const existing = await prisma.paymentRequest.findUnique({ where: { transactionId } });
            if (existing) {
                return NextResponse.json({ error: 'Transaction ID already submitted.' }, { status: 409 });
            }

            const row = await prisma.paymentRequest.create({
                data: { email, transactionId, amount, plan, status: 'PENDING' },
            });

            // Notify admin via WhatsApp
            await sendWhatsApp(
`🔔 নতুন Order!

📧 Email: ${email}
📦 Plan: ${PLAN_LABELS[plan] || plan}
💰 Amount: ৳${amount}
🧾 TxID: ${transactionId}

Approve: ${process.env.NEXT_PUBLIC_APP_URL || 'https://iltes.vercel.app'}/admin/orders`
            );

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
