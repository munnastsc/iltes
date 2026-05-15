import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { upsertManyLocalBooks } from '../../../../../lib/localStore';
import { validateBulkImportPayload } from '../../../../../lib/bookImportValidation';

type ImportBody = {
    records?: unknown[];
    mode?: 'validate' | 'import';
};

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as ImportBody;
        const mode = body?.mode === 'import' ? 'import' : 'validate';
        const result = validateBulkImportPayload(body);

        if (result.errorCount > 0) {
            return NextResponse.json(
                {
                    success: false,
                    mode,
                    errorCount: result.errorCount,
                    warningCount: result.warningCount,
                    issues: result.issues,
                },
                { status: 400 }
            );
        }

        if (mode === 'validate') {
            return NextResponse.json({
                success: true,
                mode,
                records: result.records.length,
                errorCount: 0,
                warningCount: result.warningCount,
                issues: result.issues,
            });
        }

        const items = result.records.map((r) => ({
            bookNumber: Number(r.bookNumber),
            testNumber: Number(r.testNumber),
            module: String(r.module),
            content: r.content,
            audioUrl: r.audioUrl || null,
        }));

        try {
            let created = 0;
            let updated = 0;
            for (const item of items) {
                const existing = await prisma.cambridgeBook.findFirst({
                    where: { bookNumber: item.bookNumber, testNumber: item.testNumber, module: item.module },
                });
                if (existing) {
                    await prisma.cambridgeBook.update({
                        where: { id: existing.id },
                        data: { content: item.content as object, audioUrl: item.audioUrl },
                    });
                    updated += 1;
                } else {
                    await prisma.cambridgeBook.create({
                        data: {
                            bookNumber: item.bookNumber,
                            testNumber: item.testNumber,
                            module: item.module,
                            content: item.content as object,
                            audioUrl: item.audioUrl,
                        },
                    });
                    created += 1;
                }
            }
            return NextResponse.json({
                success: true,
                mode,
                source: 'database',
                created,
                updated,
                warningCount: result.warningCount,
                issues: result.issues.filter((i) => i.level === 'warning'),
            });
        } catch {
            const local = await upsertManyLocalBooks(items);
            return NextResponse.json({
                success: true,
                mode,
                source: 'local',
                created: local.created,
                updated: local.updated,
                warningCount: result.warningCount,
                issues: result.issues.filter((i) => i.level === 'warning'),
            });
        }
    } catch {
        return NextResponse.json({ success: false, error: 'Invalid import payload.' }, { status: 400 });
    }
}
