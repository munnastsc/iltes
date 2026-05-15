import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { listLocalPaymentRequests, updateLocalPaymentStatus } from '../../../../lib/localStore';

type PatchBody = {
    id?: string;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
};

export async function GET() {
    try {
        const items = await prisma.paymentRequest.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json({ items, source: 'database' });
    } catch {
        const items = await listLocalPaymentRequests();
        return NextResponse.json({ items, source: 'local' });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = (await request.json()) as PatchBody;
        if (!body.id || !body.status) {
            return NextResponse.json({ error: 'id and status are required.' }, { status: 400 });
        }

        try {
            const updated = await prisma.paymentRequest.update({
                where: { id: body.id },
                data: { status: body.status },
            });
            return NextResponse.json({ success: true, item: updated, source: 'database' });
        } catch {
            const updated = await updateLocalPaymentStatus(body.id, body.status);
            if (!updated) return NextResponse.json({ error: 'Request not found.' }, { status: 404 });
            return NextResponse.json({ success: true, item: updated, source: 'local' });
        }
    } catch {
        return NextResponse.json({ error: 'Update failed.' }, { status: 500 });
    }
}
