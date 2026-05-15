import { readFileSync } from 'fs';
import path from 'path';
import type { ListeningTest, ListeningSection, QGroup, Question, QType } from './listeningData';

interface KBEntry {
    book: number;
    test: number;
    section: number;
    topic: string;
    qn: number;
    type: string;
    pre: string | null;
    post: string | null;
    q: string | null;
    opts: string[] | null;
    ans: string | string[];
    pool: string[] | null;
    instruction: string | null;
    range?: [number, number];  // Optional — books 16-20 omit this field
}

let _kb: KBEntry[] | null = null;

function getKB(): KBEntry[] {
    if (!_kb) {
        const raw = readFileSync(path.join(process.cwd(), 'data', 'listening-kb.json'), 'utf-8');
        _kb = Object.values(JSON.parse(raw)) as KBEntry[];
    }
    return _kb;
}

function wordLimit(book: number): string {
    return book <= 11
        ? 'Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.'
        : 'Write ONE WORD AND/OR A NUMBER for each answer.';
}

function isLetterAns(ans: string | string[]): boolean {
    const a = Array.isArray(ans) ? ans[0] : ans;
    return typeof a === 'string' && /^[A-I]$/i.test(a);
}

function normalizeType(raw: string, pool: string[] | null, opts?: string[] | null): QType {
    if (raw === 'fill_in_blank') return 'fill';
    if (raw === 'matching') return pool && pool.length > 0 ? 'match' : 'fill';
    // 'match' with no pool = map label questions → fill inputs
    if (raw === 'match' && (!pool || pool.length === 0)) return 'fill';
    // 'mcq' with no options (books 16-20 lite format) → fill with letter answer
    if (raw === 'mcq' && (!opts || opts.length === 0)) return 'fill';
    return raw as QType;
}

function buildInstruction(entry: KBEntry, book: number, resolvedType: QType): string {
    const kb = entry.instruction ?? '';
    if (resolvedType === 'fill') {
        // Map label questions already say "write the correct letter" — don't append word limit
        if (kb && /write the correct letter/i.test(kb)) return kb;
        // Letter answers (MCQ/matching without options) → don't append word limit
        if (isLetterAns(entry.ans)) return kb || 'Choose the correct letter.';
        return kb ? `${kb} ${wordLimit(book)}` : wordLimit(book);
    }
    return kb || 'Choose the correct letter.';
}

export function isMapGroup(instruction: string): boolean {
    return /label.*(map|plan|diagram)/i.test(instruction);
}

// Group entries that have no range field:
// consecutive fill_in_blank → one group, MCQ/matching → individual groups
function groupWithoutRange(entries: KBEntry[]): KBEntry[][] {
    const result: KBEntry[][] = [];
    let fillBuf: KBEntry[] = [];

    const flush = () => {
        if (fillBuf.length > 0) { result.push(fillBuf); fillBuf = []; }
    };

    for (const e of entries) {
        if (e.type === 'fill_in_blank') {
            fillBuf.push(e);
        } else {
            flush();
            result.push([e]);
        }
    }
    flush();
    return result;
}

export function getKBListeningTest(book: number, test: number): ListeningTest | null {
    const kb = getKB();
    const entries = kb.filter(e => e.book === book && e.test === test);
    if (entries.length === 0) return null;

    const sections: ListeningSection[] = ([1, 2, 3, 4] as const).map(sNum => {
        const sEntries = entries
            .filter(e => e.section === sNum)
            .sort((a, b) => a.qn - b.qn);

        if (sEntries.length === 0) {
            return { section: sNum, topic: `Section ${sNum}`, groups: [] };
        }

        // Strip "Section N:" prefix from topic (present in books 16-20)
        const topic = sEntries[0].topic.replace(/^Section \d+:\s*/i, '').trim();

        // Group by range (books 9-15) or by consecutive type (books 16-20 without range)
        const hasRange = sEntries[0].range != null;
        let grouped: KBEntry[][];

        if (hasRange) {
            const rangeMap = new Map<string, KBEntry[]>();
            for (const e of sEntries) {
                const key = `${e.range![0]}-${e.range![1]}`;
                if (!rangeMap.has(key)) rangeMap.set(key, []);
                rangeMap.get(key)!.push(e);
            }
            grouped = [...rangeMap.values()];
        } else {
            grouped = groupWithoutRange(sEntries);
        }

        const groups: QGroup[] = [];
        for (const groupEntries of grouped) {
            const first = groupEntries[0];
            const last = groupEntries[groupEntries.length - 1];
            const rangeStart = first.range?.[0] ?? first.qn;
            const rangeEnd = first.range?.[1] ?? last.qn;

            const type = normalizeType(first.type, first.pool, first.opts);
            const instruction = buildInstruction(first, book, type);

            let qs: Question[];

            if (type === 'multi') {
                // Collapse to one question — take entry with real text
                const real = groupEntries.find(e => e.q && !e.q.startsWith('(same')) ?? first;
                const rawAns = real.ans;
                qs = [{
                    n: first.range![0],
                    type,
                    q: real.q ?? '',
                    opts: real.opts ?? [],
                    ans: Array.isArray(rawAns) ? rawAns : [rawAns],
                }];
            } else {
                qs = groupEntries.map(e => {
                    const q: Question = { n: e.qn, type, ans: e.ans };
                    // Strip trailing underscores from pre text (common in books 16-20 matching)
                    const cleanPre = e.pre?.replace(/_{3,}\s*$/, '').trim() || null;
                    if (cleanPre) q.pre = cleanPre;
                    if (e.post != null) q.post = e.post;
                    if (e.q != null) q.q = e.q;
                    if (e.opts && e.opts.length > 0) q.opts = e.opts;
                    return q;
                });
            }

            const group: QGroup = {
                range: [rangeStart, rangeEnd],
                type,
                instruction,
                qs,
            };
            if (first.pool && first.pool.length > 0) group.pool = first.pool;

            groups.push(group);
        }

        return { section: sNum, topic, groups };
    });

    return { book, test, sections };
}
