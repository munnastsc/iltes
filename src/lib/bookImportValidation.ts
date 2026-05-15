import { IELTS_MODULE_BLUEPRINT, type IELTSQuestionType } from './mockTestFormat';

export type BulkImportRecord = {
    bookNumber: number;
    testNumber: number;
    module: 'Listening' | 'Reading' | 'Writing' | 'Speaking';
    audioUrl?: string | null;
    content: any;
};

export type ValidationIssue = {
    level: 'error' | 'warning';
    path: string;
    message: string;
};

export type ValidationResult = {
    records: BulkImportRecord[];
    issues: ValidationIssue[];
    errorCount: number;
    warningCount: number;
};

const MODULES = ['Listening', 'Reading', 'Writing', 'Speaking'] as const;
type ModuleName = (typeof MODULES)[number];

function isObjectiveType(type: IELTSQuestionType | undefined) {
    return type === 'fill_in_blank' || type === 'mcq' || type === 'double_mcq' || type === 'true_false' || type === 'matching';
}

function push(issues: ValidationIssue[], level: 'error' | 'warning', path: string, message: string) {
    issues.push({ level, path, message });
}

function parseRecords(payload: any): BulkImportRecord[] {
    if (Array.isArray(payload)) return payload as BulkImportRecord[];
    if (Array.isArray(payload?.records)) return payload.records as BulkImportRecord[];
    return [];
}

function validateQuestion(question: any, path: string, issues: ValidationIssue[]) {
    const qType = (question?.type || 'fill_in_blank') as IELTSQuestionType;
    const prompt = String(question?.prompt || '').trim();
    const answer = String(question?.answer || '').trim();
    const options = Array.isArray(question?.options) ? question.options : [];

    if (!prompt) push(issues, 'error', `${path}.prompt`, 'Question prompt is required.');
    if (!question?.number || !Number.isFinite(Number(question.number))) {
        push(issues, 'error', `${path}.number`, 'Question number must be numeric.');
    }

    if (qType === 'mcq' || qType === 'double_mcq') {
        if (options.length < 2) push(issues, 'error', `${path}.options`, 'MCQ questions require at least 2 options.');
    }

    if (qType === 'mcq') {
        if (!/^[A-Z]$/.test(answer)) {
            push(issues, 'error', `${path}.answer`, 'MCQ answer must be a single option letter (A/B/C...).');
        } else {
            const index = answer.charCodeAt(0) - 65;
            if (index < 0 || index >= options.length) {
                push(issues, 'error', `${path}.answer`, 'MCQ answer letter does not map to an option.');
            }
        }
    }

    if (qType === 'double_mcq') {
        const parts = answer.split(',').map((v) => v.trim()).filter(Boolean);
        if (parts.length < 2) push(issues, 'error', `${path}.answer`, 'double_mcq requires at least two answer letters like A,C.');
        for (const p of parts) {
            if (!/^[A-Z]$/.test(p)) push(issues, 'error', `${path}.answer`, `Invalid option letter "${p}".`);
            const idx = p.charCodeAt(0) - 65;
            if (idx < 0 || idx >= options.length) {
                push(issues, 'error', `${path}.answer`, `Option "${p}" is out of range for defined options.`);
            }
        }
    }

    if (qType === 'true_false') {
        const tf = answer.toUpperCase();
        if (!['TRUE', 'FALSE', 'NOT GIVEN'].includes(tf)) {
            push(issues, 'error', `${path}.answer`, 'true_false answer must be TRUE/FALSE/NOT GIVEN.');
        }
    }

    if (isObjectiveType(qType) && !answer) {
        push(issues, 'error', `${path}.answer`, 'Objective question requires an answer key.');
    }

    if (qType === 'open' && answer && answer.toLowerCase() !== 'open') {
        push(issues, 'warning', `${path}.answer`, 'Open question usually uses answer="open".');
    }
}

function validateContent(record: BulkImportRecord, recordPath: string, issues: ValidationIssue[]) {
    const { module, content } = record;
    const blueprint = IELTS_MODULE_BLUEPRINT[module];
    if (!content || typeof content !== 'object') {
        push(issues, 'error', `${recordPath}.content`, 'Content must be a JSON object.');
        return;
    }

    if (!String(content.title || '').trim()) push(issues, 'warning', `${recordPath}.content.title`, 'Missing title.');
    if (!String(content.introduction || '').trim()) push(issues, 'warning', `${recordPath}.content.introduction`, 'Missing introduction.');

    const parts = Array.isArray(content.parts) ? content.parts : [];
    if (!parts.length) {
        push(issues, 'error', `${recordPath}.content.parts`, 'parts[] is required.');
        return;
    }

    if (parts.length !== blueprint.partCount) {
        push(issues, 'warning', `${recordPath}.content.parts`, `Expected ${blueprint.partCount} parts for ${module}, found ${parts.length}.`);
    }

    const allNumbers = new Set<number>();
    let totalQuestions = 0;

    parts.forEach((part: any, pIdx: number) => {
        const pPath = `${recordPath}.content.parts[${pIdx}]`;
        const partNumber = Number(part?.partNumber);
        if (!Number.isFinite(partNumber)) push(issues, 'error', `${pPath}.partNumber`, 'partNumber must be numeric.');
        if (!String(part?.title || '').trim()) push(issues, 'warning', `${pPath}.title`, 'Missing part title.');
        if (!String(part?.text || '').trim()) push(issues, 'warning', `${pPath}.text`, 'Missing part text/passage.');

        const questions = Array.isArray(part?.questions) ? part.questions : [];
        if (!questions.length) {
            push(issues, 'error', `${pPath}.questions`, 'questions[] is required.');
            return;
        }

        totalQuestions += questions.length;
        questions.forEach((q: any, qIdx: number) => {
            const qPath = `${pPath}.questions[${qIdx}]`;
            validateQuestion(q, qPath, issues);
            const qNum = Number(q?.number);
            if (Number.isFinite(qNum)) {
                if (allNumbers.has(qNum)) push(issues, 'error', `${qPath}.number`, `Duplicate question number ${qNum}.`);
                allNumbers.add(qNum);
            }
        });
    });

    if (totalQuestions !== blueprint.totalQuestions && module !== 'Writing' && module !== 'Speaking') {
        push(issues, 'warning', `${recordPath}.content.parts`, `${module} usually has ${blueprint.totalQuestions} questions; found ${totalQuestions}.`);
    }
}

export function validateBulkImportPayload(payload: any): ValidationResult {
    const issues: ValidationIssue[] = [];
    const records = parseRecords(payload);

    if (!records.length) {
        push(issues, 'error', 'records', 'No records found. Use { "records": [ ... ] } format.');
    }

    records.forEach((record, idx) => {
        const path = `records[${idx}]`;
        if (!Number.isFinite(Number(record?.bookNumber))) push(issues, 'error', `${path}.bookNumber`, 'bookNumber is required.');
        if (!Number.isFinite(Number(record?.testNumber))) push(issues, 'error', `${path}.testNumber`, 'testNumber is required.');
        if (!MODULES.includes(record?.module)) push(issues, 'error', `${path}.module`, 'module must be Listening/Reading/Writing/Speaking.');
        validateContent(record, path, issues);
    });

    return {
        records: records as BulkImportRecord[],
        issues,
        errorCount: issues.filter((i) => i.level === 'error').length,
        warningCount: issues.filter((i) => i.level === 'warning').length,
    };
}
