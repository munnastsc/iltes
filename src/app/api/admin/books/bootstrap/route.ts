import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { IELTS_MODULES, makeBookContentTemplate } from '../../../../../lib/bookTemplates';
import { upsertManyLocalBooks } from '../../../../../lib/localStore';

export async function POST() {
    try {
        const items: Array<{
            bookNumber: number;
            testNumber: number;
            module: string;
            content: unknown;
            audioUrl: string | null;
        }> = [];

        for (let bookNumber = 1; bookNumber <= 20; bookNumber += 1) {
            for (let testNumber = 1; testNumber <= 4; testNumber += 1) {
                for (const moduleName of IELTS_MODULES) {
                    const payload = makeBookContentTemplate(bookNumber, testNumber, moduleName);
                    items.push({
                        bookNumber,
                        testNumber,
                        module: moduleName,
                        content: payload,
                        audioUrl: payload.audioUrl || null,
                    });
                }
            }
        }

        try {
            let created = 0;
            let updated = 0;

            for (const item of items) {
                const existing = await prisma.cambridgeBook.findFirst({
                    where: {
                        bookNumber: item.bookNumber,
                        testNumber: item.testNumber,
                        module: item.module,
                    },
                });

                if (existing) {
                    await prisma.cambridgeBook.update({
                        where: { id: existing.id },
                        data: {
                            content: item.content as object,
                            audioUrl: item.audioUrl,
                        },
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
                message: 'Book templates generated for all volumes.',
                created,
                updated,
                total: created + updated,
                source: 'database',
            });
        } catch {
            const result = await upsertManyLocalBooks(items);
            return NextResponse.json({
                success: true,
                message: 'Book templates generated for all volumes.',
                ...result,
                source: 'local',
            });
        }
    } catch {
        return NextResponse.json({ error: 'Bootstrap failed.' }, { status: 500 });
    }
}
