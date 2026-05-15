import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import {
    deleteLocalBookById,
    listLocalBooks,
    updateLocalBookById,
    upsertLocalBook,
} from '../../../../lib/localStore';

type AdminBookBody = {
    id?: string;
    bookNumber?: number;
    testNumber?: number;
    module?: string;
    content?: unknown;
    audioUrl?: string;
};

export async function GET() {
    try {
        const rows = await prisma.cambridgeBook.findMany({
            orderBy: [{ bookNumber: 'asc' }, { testNumber: 'asc' }, { module: 'asc' }],
        });
        return NextResponse.json({ items: rows, source: 'database' });
    } catch {
        const rows = await listLocalBooks();
        return NextResponse.json({ items: rows, source: 'local' });
    }
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as AdminBookBody;

        if (!body.bookNumber || !body.testNumber || !body.module || !body.content) {
            return NextResponse.json({ error: 'Required fields are missing.' }, { status: 400 });
        }

        try {
            const existing = await prisma.cambridgeBook.findFirst({
                where: {
                    bookNumber: Number(body.bookNumber),
                    testNumber: Number(body.testNumber),
                    module: body.module,
                },
            });

            if (existing) {
                const updated = await prisma.cambridgeBook.update({
                    where: { id: existing.id },
                    data: {
                        content: body.content as object,
                        audioUrl: body.audioUrl || null,
                    },
                });
                return NextResponse.json({ success: true, mode: 'updated', id: updated.id, source: 'database' });
            }

            const created = await prisma.cambridgeBook.create({
                data: {
                    bookNumber: Number(body.bookNumber),
                    testNumber: Number(body.testNumber),
                    module: body.module,
                    content: body.content as object,
                    audioUrl: body.audioUrl || null,
                },
            });

            return NextResponse.json({ success: true, mode: 'created', id: created.id, source: 'database' });
        } catch {
            const local = await upsertLocalBook({
                bookNumber: Number(body.bookNumber),
                testNumber: Number(body.testNumber),
                module: body.module,
                content: body.content,
                audioUrl: body.audioUrl || null,
            });
            return NextResponse.json({ success: true, mode: local.mode, id: local.record.id, source: 'local' });
        }
    } catch {
        return NextResponse.json({ error: 'Save operation failed.' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = (await request.json()) as AdminBookBody;
        if (!body.id) {
            return NextResponse.json({ error: 'Record id is required.' }, { status: 400 });
        }

        try {
            const updated = await prisma.cambridgeBook.update({
                where: { id: body.id },
                data: {
                    content: body.content as object,
                    audioUrl: body.audioUrl || null,
                },
            });
            return NextResponse.json({ success: true, id: updated.id, source: 'database' });
        } catch {
            const updated = await updateLocalBookById({
                id: body.id,
                content: body.content as object,
                audioUrl: body.audioUrl || null,
            });
            if (!updated) return NextResponse.json({ error: 'Record not found.' }, { status: 404 });
            return NextResponse.json({ success: true, id: updated.id, source: 'local' });
        }
    } catch {
        return NextResponse.json({ error: 'Update failed.' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });

        try {
            await prisma.cambridgeBook.delete({ where: { id } });
            return NextResponse.json({ success: true, source: 'database' });
        } catch {
            const deleted = await deleteLocalBookById(id);
            if (!deleted) return NextResponse.json({ error: 'Record not found.' }, { status: 404 });
            return NextResponse.json({ success: true, source: 'local' });
        }
    } catch {
        return NextResponse.json({ error: 'Delete failed.' }, { status: 500 });
    }
}
