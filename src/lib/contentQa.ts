import { IELTS_MODULE_BLUEPRINT } from './mockTestFormat';

type GenericRecord = {
    id: string;
    bookNumber: number;
    testNumber: number;
    module: string;
    content: any;
};

export type QaIssue = {
    level: 'error' | 'warning';
    key: string;
    message: string;
};

export function findContentQaIssues(rows: GenericRecord[]): QaIssue[] {
    const issues: QaIssue[] = [];
    for (const row of rows) {
        const key = `B${row.bookNumber}-T${row.testNumber}-${row.module}`;
        const content = row.content && typeof row.content === 'object' ? row.content : null;
        if (!content) {
            issues.push({ level: 'error', key, message: 'Missing content object.' });
            continue;
        }

        const parts = Array.isArray(content.parts) ? content.parts : [];
        if (!parts.length) {
            issues.push({ level: 'error', key, message: 'No parts[] found.' });
            continue;
        }

        const blueprint = IELTS_MODULE_BLUEPRINT[row.module as keyof typeof IELTS_MODULE_BLUEPRINT];
        if (blueprint) {
            if (parts.length !== blueprint.partCount) {
                issues.push({
                    level: 'warning',
                    key,
                    message: `Expected ${blueprint.partCount} parts, found ${parts.length}.`,
                });
            }
            const qCount = parts.reduce((sum: number, p: any) => sum + (Array.isArray(p?.questions) ? p.questions.length : 0), 0);
            if (row.module === 'Listening' || row.module === 'Reading') {
                if (qCount !== blueprint.totalQuestions) {
                    issues.push({
                        level: 'warning',
                        key,
                        message: `Expected ${blueprint.totalQuestions} questions, found ${qCount}.`,
                    });
                }
            }
        }

        const seen = new Set<number>();
        for (const part of parts) {
            const questions = Array.isArray(part?.questions) ? part.questions : [];
            for (const q of questions) {
                const n = Number(q?.number);
                if (!Number.isFinite(n)) {
                    issues.push({ level: 'error', key, message: `Part ${part?.partNumber}: question number missing.` });
                    continue;
                }
                if (seen.has(n)) {
                    issues.push({ level: 'error', key, message: `Duplicate question number ${n}.` });
                }
                seen.add(n);
                if (!String(q?.prompt || '').trim()) {
                    issues.push({ level: 'warning', key, message: `Question ${n} prompt missing.` });
                }
            }
        }
    }
    return issues;
}
