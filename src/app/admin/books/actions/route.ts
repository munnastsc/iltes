import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { IELTS_MODULES, makeBookContentTemplate } from '../../../../lib/bookTemplates';
import { validateBulkImportPayload } from '../../../../lib/bookImportValidation';
import {
    createLocalPaymentRequest,
    deleteLocalBookById,
    listLocalBooks,
    upsertLocalBook,
    upsertManyLocalBooks,
    updateLocalPaymentStatus,
} from '../../../../lib/localStore';

function redirectWith(base: string, values: Record<string, string>) {
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const url = new URL(base, origin);
    Object.entries(values).forEach(([k, v]) => url.searchParams.set(k, encodeURIComponent(v)));
    return NextResponse.redirect(url);
}

export async function POST(request: Request) {
    const form = await request.formData();
    const actionType = String(form.get('actionType') || '');

    if (actionType === 'structuredSave') {
        try {
            const bookNumber = Number(form.get('bookNumber'));
            const testNumber = Number(form.get('testNumber'));
            const moduleName = String(form.get('module') || '');
            const partNumber = Number(form.get('partNumber'));
            const partTitle = String(form.get('partTitle') || '').trim();
            const partText = String(form.get('partText') || '').trim();
            const audioUrl = String(form.get('audioUrl') || '').trim();
            const imageUrl = String(form.get('imageUrl') || '').trim();
            
            // New logic to accept full questions JSON
            const questionsJson = String(form.get('questionsJson') || '[]');
            let parsedQuestions = [];
            try {
                parsedQuestions = JSON.parse(questionsJson);
            } catch {
                return redirectWith('/admin/books', { tab: 'content', err: 'Invalid questions JSON.' });
            }

            if (!bookNumber || !testNumber || !moduleName || !partNumber || !partTitle || !partText || parsedQuestions.length === 0) {
                return redirectWith('/admin/books', { tab: 'content', err: 'সব required field পূরণ করুন এবং অন্তত একটি প্রশ্ন দিন।' });
            }

            const baseTitle = `Cambridge ${bookNumber} Test ${testNumber} - ${moduleName}`;

            let existingContent: any = null;

            try {
                const dbRow = await prisma.cambridgeBook.findFirst({
                    where: { bookNumber, testNumber, module: moduleName },
                });
                existingContent = dbRow?.content || null;
            } catch {
                const localRows = await listLocalBooks();
                const localRow = localRows.find((r) => r.bookNumber === bookNumber && r.testNumber === testNumber && r.module === moduleName);
                existingContent = localRow?.content || null;
            }

            const content = typeof existingContent === 'object' && existingContent ? { ...(existingContent as Record<string, any>) } : {};
            const existingParts = Array.isArray(content.parts) ? [...content.parts] : [];
            const existingIndex = existingParts.findIndex((p: any) => Number(p?.partNumber) === partNumber);

            const mergedPart = {
                partNumber,
                title: partTitle,
                text: partText,
                imageUrl,
                questions: parsedQuestions,
            };

            if (existingIndex >= 0) existingParts[existingIndex] = mergedPart;
            else existingParts.push(mergedPart);

            const finalContent = {
                title: content.title || baseTitle,
                introduction: content.introduction || `${moduleName} module structured practice content.`,
                audioUrl: audioUrl || content.audioUrl || '',
                parts: existingParts.sort((a: any, b: any) => Number(a.partNumber || 0) - Number(b.partNumber || 0)),
            };

            try {
                const dbExisting = await prisma.cambridgeBook.findFirst({
                    where: { bookNumber, testNumber, module: moduleName },
                });
                if (dbExisting) {
                    await prisma.cambridgeBook.update({
                        where: { id: dbExisting.id },
                        data: {
                            content: finalContent,
                            audioUrl: audioUrl || null,
                        },
                    });
                } else {
                    await prisma.cambridgeBook.create({
                        data: {
                            bookNumber,
                            testNumber,
                            module: moduleName,
                            content: finalContent,
                            audioUrl: audioUrl || null,
                        },
                    });
                }
                return redirectWith('/admin/books', { tab: 'content', msg: `Structured content saved for ${baseTitle} Part ${partNumber} (database).` });
            } catch {
                await upsertLocalBook({
                    bookNumber,
                    testNumber,
                    module: moduleName,
                    content: finalContent,
                    audioUrl: audioUrl || null,
                });
                return redirectWith('/admin/books', { tab: 'content', msg: `Structured content saved for ${baseTitle} Part ${partNumber} (local).` });
            }
        } catch {
            return redirectWith('/admin/books', { tab: 'content', err: 'Structured save failed.' });
        }
    }

    if (actionType === 'save') {
        try {
            const bookNumber = Number(form.get('bookNumber'));
            const testNumber = Number(form.get('testNumber'));
            const moduleName = String(form.get('module') || '');
            const audioUrl = String(form.get('audioUrl') || '').trim();
            const contentRaw = String(form.get('content') || '');

            if (!bookNumber || !testNumber || !moduleName || !contentRaw) {
                return redirectWith('/admin/books', { tab: 'content', err: 'Book, test, module and content are required.' });
            }

            let content: unknown;
            try {
                content = JSON.parse(contentRaw);
            } catch {
                return redirectWith('/admin/books', { tab: 'content', err: 'Invalid JSON format.' });
            }

            try {
                const existing = await prisma.cambridgeBook.findFirst({
                    where: { bookNumber, testNumber, module: moduleName },
                });
                if (existing) {
                    await prisma.cambridgeBook.update({
                        where: { id: existing.id },
                        data: { content: content as object, audioUrl: audioUrl || null },
                    });
                    return redirectWith('/admin/books', { tab: 'content', msg: 'Content updated successfully (database).' });
                }
                await prisma.cambridgeBook.create({
                    data: { bookNumber, testNumber, module: moduleName, content: content as object, audioUrl: audioUrl || null },
                });
                return redirectWith('/admin/books', { tab: 'content', msg: 'Content saved successfully (database).' });
            } catch {
                await upsertLocalBook({
                    bookNumber,
                    testNumber,
                    module: moduleName,
                    content,
                    audioUrl: audioUrl || null,
                });
                return redirectWith('/admin/books', { tab: 'content', msg: 'Content saved successfully (local).' });
            }
        } catch {
            return redirectWith('/admin/books', { tab: 'content', err: 'Save operation failed.' });
        }
    }

    if (actionType === 'bootstrap') {
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
                            data: { content: item.content as object, audioUrl: item.audioUrl },
                        });
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
                    }
                }
                return redirectWith('/admin/books', { tab: 'content', msg: '1-20 templates generated successfully (database).' });
            } catch {
                const result = await upsertManyLocalBooks(items);
                return redirectWith('/admin/books', {
                    tab: 'content',
                    msg: `1-20 templates generated (local). Created ${result.created}, updated ${result.updated}.`,
                });
            }
        } catch {
            return redirectWith('/admin/books', { tab: 'content', err: 'Template generation failed.' });
        }
    }

    if (actionType === 'bulkImport') {
        try {
            const payloadRaw = String(form.get('payload') || '').trim();
            const mode = String(form.get('mode') || 'validate'); // validate | import

            if (!payloadRaw) {
                return redirectWith('/admin/books', { tab: 'content', err: 'Bulk payload is required.' });
            }

            let payload: unknown;
            try {
                payload = JSON.parse(payloadRaw);
            } catch {
                return redirectWith('/admin/books', { tab: 'content', err: 'Invalid bulk JSON format.' });
            }

            const result = validateBulkImportPayload(payload);
            if (result.errorCount > 0) {
                const top = result.issues
                    .filter((i) => i.level === 'error')
                    .slice(0, 5)
                    .map((i) => `${i.path}: ${i.message}`)
                    .join(' | ');
                return redirectWith('/admin/books', {
                    tab: 'content',
                    err: `Validation failed. Errors: ${result.errorCount}, warnings: ${result.warningCount}. ${top}`,
                });
            }

            if (mode === 'validate') {
                return redirectWith('/admin/books', {
                    tab: 'content',
                    msg: `Validation passed for ${result.records.length} records. Warnings: ${result.warningCount}.`,
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
                return redirectWith('/admin/books', {
                    tab: 'content',
                    msg: `Bulk import completed (database). Created ${created}, updated ${updated}. Warnings: ${result.warningCount}.`,
                });
            } catch {
                const local = await upsertManyLocalBooks(items);
                return redirectWith('/admin/books', {
                    tab: 'content',
                    msg: `Bulk import completed (local). Created ${local.created}, updated ${local.updated}. Warnings: ${result.warningCount}.`,
                });
            }
        } catch {
            return redirectWith('/admin/books', { tab: 'content', err: 'Bulk import failed.' });
        }
    }

    if (actionType === 'paymentStatus') {
        try {
            const id = String(form.get('id') || '');
            const status = String(form.get('status') || '') as 'APPROVED' | 'REJECTED' | 'PENDING';
            if (!id || !status) {
                return redirectWith('/admin/books', { tab: 'subscription', err: 'id and status are required.' });
            }

            try {
                await prisma.paymentRequest.update({ where: { id }, data: { status } });
                return redirectWith('/admin/books', { tab: 'subscription', msg: `Payment marked ${status} (database).` });
            } catch {
                const updated = await updateLocalPaymentStatus(id, status);
                if (!updated) return redirectWith('/admin/books', { tab: 'subscription', err: 'Payment request not found.' });
                return redirectWith('/admin/books', { tab: 'subscription', msg: `Payment marked ${status} (local).` });
            }
        } catch {
            return redirectWith('/admin/books', { tab: 'subscription', err: 'Payment status update failed.' });
        }
    }

    if (actionType === 'createPayment') {
        try {
            const email = String(form.get('email') || '').trim().toLowerCase();
            const transactionId = String(form.get('transactionId') || '').trim().toUpperCase();
            const amount = Number(form.get('amount') || 0);
            if (!email || !transactionId || !amount) {
                return redirectWith('/admin/books', { tab: 'subscription', err: 'email, transactionId, amount required.' });
            }

            try {
                await prisma.paymentRequest.create({
                    data: { email, transactionId, amount, status: 'PENDING' },
                });
                return redirectWith('/admin/books', { tab: 'subscription', msg: 'Payment request created (database).' });
            } catch {
                const row = await createLocalPaymentRequest({ email, transactionId, amount });
                if (!row) return redirectWith('/admin/books', { tab: 'subscription', err: 'Transaction ID already exists.' });
                return redirectWith('/admin/books', { tab: 'subscription', msg: 'Payment request created (local).' });
            }
        } catch {
            return redirectWith('/admin/books', { tab: 'subscription', err: 'Create payment request failed.' });
        }
    }

    if (actionType === 'deleteRecord') {
        const id = String(form.get('id') || '');
        if (!id) return redirectWith('/admin/books', { tab: 'content', err: 'id required.' });

        try {
            await prisma.cambridgeBook.delete({ where: { id } });
            return redirectWith('/admin/books', { tab: 'content', msg: 'Record deleted (database).' });
        } catch {
            const deleted = await deleteLocalBookById(id);
            if (!deleted) return redirectWith('/admin/books', { tab: 'content', err: 'Record not found.' });
            return redirectWith('/admin/books', { tab: 'content', msg: 'Record deleted (local).' });
        }
    }

    return redirectWith('/admin/books', { tab: 'content', err: 'Unknown action.' });
}
