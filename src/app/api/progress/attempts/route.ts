import { NextResponse } from 'next/server';
import { addLocalAttempt, clearLocalAttempts, listLocalAttempts } from '../../../../lib/localStore';
import { moduleBandEstimate } from '../../../../lib/ieltsBand';

type AttemptBody = {
    module?: string;
    title?: string;
    bookNumber?: number | null;
    testNumber?: number | null;
    partNumber?: number | null;
    correct?: number;
    total?: number;
    retryMode?: boolean;
    wrongQuestions?: number[];
};

export async function GET() {
    const attempts = await listLocalAttempts();
    return NextResponse.json({ items: attempts, source: 'local' });
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as AttemptBody;
        const module = String(body.module || '').trim();
        const title = String(body.title || '').trim();
        const correct = Number(body.correct || 0);
        const total = Number(body.total || 0);

        if (!module || !title || !Number.isFinite(correct) || !Number.isFinite(total)) {
            return NextResponse.json({ error: 'module/title/correct/total required.' }, { status: 400 });
        }

        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
        const band = moduleBandEstimate(module, correct, total);

        const row = await addLocalAttempt({
            module,
            title,
            bookNumber: body.bookNumber ?? null,
            testNumber: body.testNumber ?? null,
            partNumber: body.partNumber ?? null,
            correct,
            total,
            percentage,
            band,
            retryMode: Boolean(body.retryMode),
            wrongQuestions: Array.isArray(body.wrongQuestions) ? body.wrongQuestions.map(Number).filter(Number.isFinite) : [],
        });
        return NextResponse.json({ success: true, item: row, source: 'local' });
    } catch {
        return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
    }
}

export async function DELETE() {
    await clearLocalAttempts();
    return NextResponse.json({ success: true, source: 'local' });
}
