import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export type LocalBookRecord = {
    id: string;
    bookNumber: number;
    testNumber: number;
    module: string;
    content: unknown;
    audioUrl: string | null;
    createdAt: string;
    updatedAt: string;
};

export type LocalPaymentRecord = {
    id: string;
    email: string;
    transactionId: string;
    amount: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
    createdAt: string;
    updatedAt: string;
};

type LocalData = {
    books: LocalBookRecord[];
    payments: LocalPaymentRecord[];
    attempts: LocalAttemptRecord[];
};

export type LocalAttemptRecord = {
    id: string;
    module: string;
    title: string;
    bookNumber: number | null;
    testNumber: number | null;
    partNumber: number | null;
    correct: number;
    total: number;
    percentage: number;
    band: number | null;
    retryMode: boolean;
    wrongQuestions: number[];
    createdAt: string;
};

const dataDir = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'local-store.json');

async function ensureStore(): Promise<LocalData> {
    await mkdir(dataDir, { recursive: true });
    try {
        const raw = await readFile(dataFile, 'utf-8');
        const parsed = JSON.parse(raw) as Partial<LocalData>;
        return {
            books: Array.isArray(parsed.books) ? parsed.books : [],
            payments: Array.isArray(parsed.payments) ? parsed.payments : [],
            attempts: Array.isArray((parsed as any).attempts) ? (parsed as any).attempts : [],
        };
    } catch {
        const fresh: LocalData = { books: [], payments: [], attempts: [] };
        await writeFile(dataFile, JSON.stringify(fresh, null, 2), 'utf-8');
        return fresh;
    }
}

async function saveStore(data: LocalData) {
    await mkdir(dataDir, { recursive: true });
    await writeFile(dataFile, JSON.stringify(data, null, 2), 'utf-8');
}

export async function listLocalBooks() {
    const data = await ensureStore();
    return [...data.books].sort((a, b) => {
        if (a.bookNumber !== b.bookNumber) return a.bookNumber - b.bookNumber;
        if (a.testNumber !== b.testNumber) return a.testNumber - b.testNumber;
        return a.module.localeCompare(b.module);
    });
}

export async function upsertLocalBook(input: {
    bookNumber: number;
    testNumber: number;
    module: string;
    content: unknown;
    audioUrl?: string | null;
}) {
    const data = await ensureStore();
    const now = new Date().toISOString();
    const existing = data.books.find(
        (item) =>
            item.bookNumber === input.bookNumber &&
            item.testNumber === input.testNumber &&
            item.module === input.module,
    );

    if (existing) {
        existing.content = input.content;
        existing.audioUrl = input.audioUrl ?? null;
        existing.updatedAt = now;
        await saveStore(data);
        return { mode: 'updated' as const, record: existing };
    }

    const record: LocalBookRecord = {
        id: crypto.randomUUID(),
        bookNumber: input.bookNumber,
        testNumber: input.testNumber,
        module: input.module,
        content: input.content,
        audioUrl: input.audioUrl ?? null,
        createdAt: now,
        updatedAt: now,
    };
    data.books.push(record);
    await saveStore(data);
    return { mode: 'created' as const, record };
}

export async function upsertManyLocalBooks(
    inputs: Array<{
        bookNumber: number;
        testNumber: number;
        module: string;
        content: unknown;
        audioUrl?: string | null;
    }>,
) {
    const data = await ensureStore();
    let created = 0;
    let updated = 0;

    for (const input of inputs) {
        const now = new Date().toISOString();
        const existing = data.books.find(
            (item) =>
                item.bookNumber === input.bookNumber &&
                item.testNumber === input.testNumber &&
                item.module === input.module,
        );

        if (existing) {
            existing.content = input.content;
            existing.audioUrl = input.audioUrl ?? null;
            existing.updatedAt = now;
            updated += 1;
            continue;
        }

        const record: LocalBookRecord = {
            id: crypto.randomUUID(),
            bookNumber: input.bookNumber,
            testNumber: input.testNumber,
            module: input.module,
            content: input.content,
            audioUrl: input.audioUrl ?? null,
            createdAt: now,
            updatedAt: now,
        };
        data.books.push(record);
        created += 1;
    }

    await saveStore(data);
    return { created, updated, total: created + updated };
}

export async function updateLocalBookById(input: { id: string; content: unknown; audioUrl?: string | null }) {
    const data = await ensureStore();
    const existing = data.books.find((item) => item.id === input.id);
    if (!existing) return null;
    existing.content = input.content;
    existing.audioUrl = input.audioUrl ?? null;
    existing.updatedAt = new Date().toISOString();
    await saveStore(data);
    return existing;
}

export async function deleteLocalBookById(id: string) {
    const data = await ensureStore();
    const before = data.books.length;
    data.books = data.books.filter((item) => item.id !== id);
    if (before === data.books.length) return false;
    await saveStore(data);
    return true;
}

export async function getLocalBooksByBookNumber(bookNumber: number) {
    const data = await ensureStore();
    return data.books
        .filter((item) => item.bookNumber === bookNumber)
        .sort((a, b) => (a.testNumber !== b.testNumber ? a.testNumber - b.testNumber : a.module.localeCompare(b.module)));
}

export async function listLocalPaymentRequests() {
    const data = await ensureStore();
    return [...data.payments].sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
}

export async function createLocalPaymentRequest(input: { email: string; transactionId: string; amount: number }) {
    const data = await ensureStore();
    const exists = data.payments.find((item) => item.transactionId === input.transactionId);
    if (exists) return null;

    const now = new Date().toISOString();
    const row: LocalPaymentRecord = {
        id: crypto.randomUUID(),
        email: input.email,
        transactionId: input.transactionId,
        amount: input.amount,
        status: 'PENDING',
        createdAt: now,
        updatedAt: now,
    };
    data.payments.push(row);
    await saveStore(data);
    return row;
}

export async function updateLocalPaymentStatus(id: string, status: 'PENDING' | 'APPROVED' | 'REJECTED') {
    const data = await ensureStore();
    const row = data.payments.find((item) => item.id === id);
    if (!row) return null;
    row.status = status;
    row.updatedAt = new Date().toISOString();
    await saveStore(data);
    return row;
}

export async function findLocalPaymentByTransaction(transactionId: string) {
    const data = await ensureStore();
    return data.payments.find((item) => item.transactionId === transactionId) || null;
}

export async function listLocalAttempts() {
    const data = await ensureStore();
    return [...data.attempts].sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
}

export async function addLocalAttempt(input: Omit<LocalAttemptRecord, 'id' | 'createdAt'>) {
    const data = await ensureStore();
    const row: LocalAttemptRecord = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...input,
    };
    data.attempts.unshift(row);
    if (data.attempts.length > 1000) data.attempts = data.attempts.slice(0, 1000);
    await saveStore(data);
    return row;
}

export async function clearLocalAttempts() {
    const data = await ensureStore();
    data.attempts = [];
    await saveStore(data);
}
