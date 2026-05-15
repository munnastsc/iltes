export type ObjectiveAttempt = {
    id: string;
    submittedAt: string;
    module: 'Listening' | 'Reading' | 'Writing' | 'Speaking';
    bookNumber?: number;
    testNumber?: number;
    partNumber?: number;
    title: string;
    correct: number;
    total: number;
    percentage: number;
    retryMode: boolean;
    wrongQuestions: number[];
};

const OBJECTIVE_ATTEMPTS_KEY = 'iltes_objective_attempts_v1';

function canUseStorage() {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getObjectiveAttempts(): ObjectiveAttempt[] {
    if (!canUseStorage()) return [];
    try {
        const raw = localStorage.getItem(OBJECTIVE_ATTEMPTS_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(
            (item) =>
                item &&
                typeof item.id === 'string' &&
                typeof item.submittedAt === 'string' &&
                typeof item.title === 'string' &&
                typeof item.correct === 'number' &&
                typeof item.total === 'number' &&
                typeof item.percentage === 'number'
        );
    } catch {
        return [];
    }
}

export function saveObjectiveAttempt(input: Omit<ObjectiveAttempt, 'id' | 'submittedAt' | 'percentage'>) {
    if (!canUseStorage()) return;
    const attempt: ObjectiveAttempt = {
        ...input,
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        submittedAt: new Date().toISOString(),
        percentage: input.total > 0 ? Math.round((input.correct / input.total) * 100) : 0,
    };
    const all = getObjectiveAttempts();
    const next = [attempt, ...all].slice(0, 300);
    localStorage.setItem(OBJECTIVE_ATTEMPTS_KEY, JSON.stringify(next));
}

export function clearObjectiveAttempts() {
    if (!canUseStorage()) return;
    localStorage.removeItem(OBJECTIVE_ATTEMPTS_KEY);
}
