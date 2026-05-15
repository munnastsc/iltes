import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import type { ListeningTest, ListeningSection, QGroup, QType } from '../../../../lib/listeningData';
import { getSimpleListeningTest, simpleToListeningTest } from '../../../../lib/simpleListeningData';
import { getKBListeningTest } from '../../../../lib/kbListeningData';

export const runtime = 'nodejs';

function isLetterAns(ans: string): boolean {
    return /^[A-I]$/.test(ans);
}

function toPool(options: string[]): string[] {
    return options.map(opt => opt.replace(/^([A-H])[:)]\s*/, '$1. '));
}

function toOpts(options: string[]): string[] {
    return options.map(opt => opt.replace(/^([A-E])[:)]\s*/, '$1. '));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertPart(part: any, sectionNum: 1 | 2 | 3 | 4, book: number): ListeningSection {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const qs: any[] = part.questions || [];
    const topic = (part.title as string).replace(/^Section \d+:\s*/i, '').trim();
    const groups: QGroup[] = [];
    let i = 0;

    while (i < qs.length) {
        const q = qs[i];
        const letterAns = isLetterAns(q.answer as string);
        const hasOpts = Array.isArray(q.options) && q.options.length > 0;

        // Matching/labeling with a pool (answer is letter, options provided)
        if (
            (q.type === 'matching' && hasOpts) ||
            (q.type === 'fill_in_blank' && letterAns && hasOpts)
        ) {
            const pool = toPool(q.options as string[]);
            const poolKey = JSON.stringify(pool);
            const group: QGroup = {
                range: [q.number as number, q.number as number] as [number, number],
                type: 'match' as QType,
                instruction: 'Choose the correct letter.',
                pool,
                qs: [],
            };

            while (i < qs.length) {
                const c = qs[i];
                const eff =
                    (c.type === 'matching' && Array.isArray(c.options) && c.options.length > 0) ||
                    (c.type === 'fill_in_blank' && isLetterAns(c.answer as string) && Array.isArray(c.options) && c.options.length > 0);
                if (!eff) break;
                const cp = toPool(c.options as string[]);
                if (JSON.stringify(cp) !== poolKey) break;

                group.range[1] = c.number as number;
                const qText =
                    (c.prompt as string)
                        .replace(/^[•\-\s]+/, '')
                        .replace(/___/g, '')
                        .trim() || `Question ${c.number as number}`;
                group.qs.push({ n: c.number as number, type: 'match' as QType, q: qText, ans: c.answer as string });
                i++;
            }
            groups.push(group);

        // Map labeling (letter answer, no pool)
        } else if (
            (q.type === 'matching' && !hasOpts) ||
            (q.type === 'fill_in_blank' && letterAns && !hasOpts)
        ) {
            const group: QGroup = {
                range: [q.number as number, q.number as number] as [number, number],
                type: 'fill' as QType,
                instruction: 'Write the correct letter.',
                qs: [],
            };

            while (i < qs.length) {
                const c = qs[i];
                const isMap =
                    (c.type === 'matching' && !(Array.isArray(c.options) && c.options.length > 0)) ||
                    (c.type === 'fill_in_blank' && isLetterAns(c.answer as string) && !(Array.isArray(c.options) && c.options.length > 0));
                if (!isMap) break;

                group.range[1] = c.number as number;
                const pts = (c.prompt as string) !== '___' ? (c.prompt as string).split('___') : ['', ''];
                group.qs.push({
                    n: c.number as number,
                    type: 'fill' as QType,
                    pre: pts[0]?.trim() || `Q${c.number as number}`,
                    post: pts[1]?.trim() || '',
                    ans: c.answer as string,
                });
                i++;
            }
            groups.push(group);

        // MCQ (single or choose-two)
        } else if (q.type === 'mcq') {
            const hasTWO = /two/i.test(q.prompt as string);
            const nextSame =
                i + 1 < qs.length && qs[i + 1].type === 'mcq' && qs[i + 1].prompt === q.prompt;

            if (hasTWO && nextSame) {
                // Multi (choose 2)
                const pool = toOpts((q.options as string[]) || []);
                const group: QGroup = {
                    range: [q.number as number, q.number as number] as [number, number],
                    type: 'multi' as QType,
                    instruction: q.prompt as string,
                    pool,
                    qs: [],
                };
                const sp = q.prompt as string;
                while (i < qs.length && qs[i].type === 'mcq' && qs[i].prompt === sp) {
                    group.range[1] = qs[i].number as number;
                    group.qs.push({
                        n: qs[i].number as number,
                        type: 'multi' as QType,
                        q: '(same as above)',
                        ans: qs[i].answer as string,
                    });
                    i++;
                }
                groups.push(group);
            } else {
                // Single-answer MCQ group
                const optCount = ((q.options as string[]) || []).length;
                const letters = optCount <= 3 ? 'A, B or C' : optCount === 4 ? 'A, B, C or D' : 'A–E';
                const group: QGroup = {
                    range: [q.number as number, q.number as number] as [number, number],
                    type: 'mcq' as QType,
                    instruction: `Choose the correct letter, ${letters}.`,
                    qs: [],
                };

                while (i < qs.length && qs[i].type === 'mcq') {
                    const c = qs[i];
                    const cTWO = /two/i.test(c.prompt as string);
                    const cNext = i + 1 < qs.length && qs[i + 1]?.type === 'mcq' && qs[i + 1].prompt === c.prompt;
                    if (cTWO && cNext) break;
                    group.range[1] = c.number as number;
                    group.qs.push({
                        n: c.number as number,
                        type: 'mcq' as QType,
                        q: c.prompt as string,
                        opts: toOpts((c.options as string[]) || []),
                        ans: c.answer as string,
                    });
                    i++;
                }
                if (group.qs.length > 0) groups.push(group);
            }

        // Regular fill-in-blank (word answers)
        } else if (q.type === 'fill_in_blank') {
            const fillInstruction = book <= 11
                ? 'Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.'
                : 'Write ONE WORD AND/OR A NUMBER for each answer.';
            const group: QGroup = {
                range: [q.number as number, q.number as number] as [number, number],
                type: 'fill' as QType,
                instruction: fillInstruction,
                qs: [],
            };

            while (
                i < qs.length &&
                qs[i].type === 'fill_in_blank' &&
                !isLetterAns(qs[i].answer as string) &&
                !(Array.isArray(qs[i].options) && qs[i].options.length > 0)
            ) {
                const c = qs[i];
                group.range[1] = c.number as number;
                const pts = (c.prompt as string) !== '___' ? (c.prompt as string).split('___') : ['', ''];
                group.qs.push({
                    n: c.number as number,
                    type: 'fill' as QType,
                    pre: pts[0]?.trim() || '',
                    post: pts[1]?.trim() || '',
                    ans: c.answer as string,
                });
                i++;
            }
            if (group.qs.length > 0) groups.push(group);
        } else {
            i++;
        }
    }

    return { section: sectionNum, topic, groups };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertRecord(record: any): ListeningTest {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parts: any[] = record.content?.parts || [];
    return {
        book: record.bookNumber as number,
        test: record.testNumber as number,
        sections: parts.map((p, idx) => convertPart(p, (idx + 1) as 1 | 2 | 3 | 4, record.bookNumber as number)),
    };
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const book = Number(searchParams.get('book'));
    const test = Number(searchParams.get('test'));

    if (!book || !test) {
        return NextResponse.json({ error: 'book and test params required' }, { status: 400 });
    }

    if (book < 9 || book > 20) {
        return NextResponse.json({ error: 'Only books 9–20 served here' }, { status: 400 });
    }

    // Primary: listening-kb.json (books 9–20 all have rich data)
    try {
        const kbTest = getKBListeningTest(book, test);
        if (kbTest) {
            return NextResponse.json(kbTest, {
                headers: { 'Cache-Control': 'public, max-age=3600' },
            });
        }
    } catch {
        // KB unavailable — fall through
    }

    // Fallback: local-store.json
    try {
        const storePath = path.join(process.cwd(), 'data', 'local-store.json');
        const raw = await readFile(storePath, 'utf-8');
        const store = JSON.parse(raw) as { books: unknown[] };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const record = (store.books as any[]).find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (b: any) => b.bookNumber === book && b.testNumber === test && b.module === 'Listening',
        );
        if (record) {
            return NextResponse.json(convertRecord(record), {
                headers: { 'Cache-Control': 'public, max-age=3600' },
            });
        }
    } catch {
        // local-store.json unavailable
    }

    // Last fallback: simple static data (books 16–20)
    const simple = getSimpleListeningTest(book, test);
    if (!simple) {
        return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }
    return NextResponse.json(simpleToListeningTest(simple), {
        headers: { 'Cache-Control': 'public, max-age=3600' },
    });
}
