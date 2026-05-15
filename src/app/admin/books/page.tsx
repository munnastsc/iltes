import Link from 'next/link';
import { prisma } from '../../../lib/prisma';
import { listLocalBooks, listLocalPaymentRequests } from '../../../lib/localStore';
import DynamicContentForm from '../../../components/DynamicContentForm';
import AdminAudioTab from '../../../components/AdminAudioTab';
import AdminRecordsTable from '../../../components/AdminRecordsTable';

type PageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const jsonSample = JSON.stringify(
    {
        title: 'Cambridge 1 Test 1 - Listening',
        introduction: 'Part-by-part listening practice with answer evidence.',
        audioUrl: '',
        parts: [
            {
                partNumber: 1,
                title: 'Section 1 Form Completion',
                text: 'The student confirms the booking date as 12 March after correcting the previous mistake.',
                questions: [
                    {
                        number: 1,
                        prompt: 'What is the final booking date?',
                        answer: '12 March',
                        answerLine: 'booking date as 12 March',
                    },
                ],
            },
        ],
    },
    null,
    2,
);

const bulkImportSample = JSON.stringify(
    {
        records: [
            {
                bookNumber: 1,
                testNumber: 1,
                module: 'Reading',
                audioUrl: null,
                content: {
                    title: 'Cambridge 1 Test 1 - Reading',
                    introduction: 'Reading module sample',
                    parts: [
                        {
                            partNumber: 1,
                            title: 'Passage 1',
                            text: 'Passage text...',
                            tips: ['Find keywords first.'],
                            questions: [
                                {
                                    number: 1,
                                    type: 'true_false',
                                    prompt: 'Statement one',
                                    answer: 'TRUE',
                                    answerLine: 'Evidence line...',
                                },
                            ],
                        },
                    ],
                },
            },
        ],
    },
    null,
    2,
);

async function getBooks() {
    try {
        const items = await prisma.cambridgeBook.findMany({
            orderBy: [{ bookNumber: 'asc' }, { testNumber: 'asc' }, { module: 'asc' }],
        });
        return { items, source: 'database' as const };
    } catch {
        const items = await listLocalBooks();
        return { items, source: 'local' as const };
    }
}

async function getPayments() {
    try {
        const items = await prisma.paymentRequest.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return { items, source: 'database' as const };
    } catch {
        const items = await listLocalPaymentRequests();
        return { items, source: 'local' as const };
    }
}

export default async function AdminBooksPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const message = typeof params.msg === 'string' ? params.msg : '';
    const error = typeof params.err === 'string' ? params.err : '';
    const tab = typeof params.tab === 'string' ? params.tab : 'content';
    const sample = params.sample === '1';
    const editId = typeof params.editId === 'string' ? params.editId : '';

    const booksData = await getBooks();
    const paymentsData = await getPayments();

    // Pre-fill editing if editId provided
    const editRecord = editId
        ? (booksData.items as any[]).find((r) => r.id === editId) ?? null
        : null;

    const editContentJson = editRecord?.content
        ? JSON.stringify(editRecord.content, null, 2)
        : '';

    return (
        <div className="min-h-screen bg-slate-50 px-5 py-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 border-b border-slate-200 pb-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Admin Panel</p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">Content + Audio + Subscription</h1>
                    <p className="mt-2 text-sm text-slate-600">All actions support database with local fallback.</p>
                    <div className="mt-3">
                        <Link
                            href="/admin/books/qa"
                            className="inline-flex items-center rounded-md border border-violet-300 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-800 hover:bg-violet-100"
                        >
                            Open QA Dashboard
                        </Link>
                    </div>
                </div>

                {error && (
                    <p className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {decodeURIComponent(error)}
                    </p>
                )}
                {message && (
                    <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {decodeURIComponent(message)}
                    </p>
                )}

                {/* Tabs */}
                <div className="mb-4 flex gap-2">
                    <Link
                        href="/admin/books?tab=content"
                        className={`rounded-md px-4 py-2 text-sm font-semibold ${
                            tab === 'content' ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white text-slate-700'
                        }`}
                    >
                        Content Manager
                    </Link>
                    <Link
                        href="/admin/books?tab=audio"
                        className={`rounded-md px-4 py-2 text-sm font-semibold ${
                            tab === 'audio' ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white text-slate-700'
                        }`}
                    >
                        Audio Files
                    </Link>
                    <Link
                        href="/admin/books?tab=subscription"
                        className={`rounded-md px-4 py-2 text-sm font-semibold ${
                            tab === 'subscription' ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white text-slate-700'
                        }`}
                    >
                        Subscriptions
                    </Link>
                </div>

                {/* ── Content Manager ── */}
                {tab === 'content' && (
                    <div className="grid gap-5 lg:grid-cols-[1.05fr_1.3fr]">
                        <div className="rounded-lg border border-slate-200 bg-white p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    {editRecord ? `Editing: Book ${editRecord.bookNumber} Test ${editRecord.testNumber} — ${editRecord.module}` : 'Publish / Update Content'}
                                </h2>
                                {editRecord ? (
                                    <Link
                                        href="/admin/books?tab=content"
                                        className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                                    >
                                        Clear Edit
                                    </Link>
                                ) : (
                                    <form action="/admin/books/actions" method="post">
                                        <input type="hidden" name="actionType" value="bootstrap" />
                                        <button
                                            type="submit"
                                            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                                        >
                                            Generate 1-20 Templates
                                        </button>
                                    </form>
                                )}
                            </div>

                            {editRecord && (
                                <div className="mb-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700">
                                    Editing existing record. Save will overwrite it.
                                </div>
                            )}

                            <form action="/admin/books/actions" method="post" className="space-y-3">
                                <input type="hidden" name="actionType" value="save" />
                                <div className="grid gap-3 md:grid-cols-3">
                                    <input
                                        className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                                        type="number"
                                        placeholder="Book"
                                        name="bookNumber"
                                        defaultValue={editRecord?.bookNumber ?? ''}
                                        required
                                    />
                                    <input
                                        className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                                        type="number"
                                        placeholder="Test"
                                        name="testNumber"
                                        defaultValue={editRecord?.testNumber ?? ''}
                                        required
                                    />
                                    <select
                                        className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                                        name="module"
                                        defaultValue={editRecord?.module ?? 'Listening'}
                                    >
                                        <option value="Listening">Listening</option>
                                        <option value="Reading">Reading</option>
                                        <option value="Writing">Writing</option>
                                        <option value="Speaking">Speaking</option>
                                    </select>
                                </div>

                                <input
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                                    type="text"
                                    name="audioUrl"
                                    placeholder="Audio URL (optional — leave blank to use proxy)"
                                    defaultValue={editRecord?.audioUrl ?? ''}
                                />

                                <textarea
                                    className="h-72 w-full rounded-md border border-slate-300 p-3 font-mono text-xs outline-none focus:border-blue-500"
                                    name="content"
                                    defaultValue={editRecord ? editContentJson : sample ? jsonSample : ''}
                                    placeholder='{"title":"","parts":[]}'
                                    required
                                />

                                <div className="flex gap-2">
                                    {!editRecord && (
                                        <Link
                                            href="/admin/books?tab=content&sample=1"
                                            className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
                                        >
                                            Load JSON Sample
                                        </Link>
                                    )}
                                    <button
                                        type="submit"
                                        className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
                                    >
                                        {editRecord ? 'Save Changes' : 'Save Content'}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-6 border-t border-slate-200 pt-5">
                                <h3 className="text-base font-semibold text-slate-900">Quick Structured Input (No JSON)</h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    Use structured fields to auto-build content JSON and save quickly.
                                </p>
                                <DynamicContentForm />
                            </div>

                            <div className="mt-6 border-t border-slate-200 pt-5">
                                <h3 className="text-base font-semibold text-slate-900">Bulk Import + Validator</h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    Validate first to catch answer-key issues, duplicates, and schema mistakes before import.
                                </p>
                                <form action="/admin/books/actions" method="post" className="mt-3 space-y-3">
                                    <input type="hidden" name="actionType" value="bulkImport" />
                                    <textarea
                                        className="h-72 w-full rounded-md border border-slate-300 p-3 font-mono text-xs outline-none focus:border-blue-500"
                                        name="payload"
                                        defaultValue={bulkImportSample}
                                        required
                                    />
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        <button
                                            type="submit"
                                            name="mode"
                                            value="validate"
                                            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                        >
                                            Validate Only
                                        </button>
                                        <button
                                            type="submit"
                                            name="mode"
                                            value="import"
                                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                                        >
                                            Validate + Import
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white p-5">
                            <h2 className="mb-1 text-lg font-semibold text-slate-900">
                                Current Book Records ({booksData.items.length})
                            </h2>
                            <p className="mb-3 text-xs text-slate-500">
                                Source: {booksData.source} — hover a row to Edit or Delete
                            </p>
                            <AdminRecordsTable
                                items={(booksData.items as any[]).map((r) => ({
                                    id: r.id,
                                    bookNumber: r.bookNumber,
                                    testNumber: r.testNumber,
                                    module: r.module,
                                    audioUrl: r.audioUrl,
                                }))}
                            />
                        </div>
                    </div>
                )}

                {/* ── Audio Files ── */}
                {tab === 'audio' && <AdminAudioTab />}

                {/* ── Subscriptions ── */}
                {tab === 'subscription' && (
                    <div className="rounded-lg border border-slate-200 bg-white p-5">
                        <h2 className="mb-1 text-lg font-semibold text-slate-900">
                            Payment Requests ({paymentsData.items.length})
                        </h2>
                        <p className="mb-3 text-xs text-slate-500">Source: {paymentsData.source}</p>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-[0.08em] text-slate-500">
                                        <th className="border-b border-slate-200 px-2 py-2">Email</th>
                                        <th className="border-b border-slate-200 px-2 py-2">Transaction</th>
                                        <th className="border-b border-slate-200 px-2 py-2">Amount</th>
                                        <th className="border-b border-slate-200 px-2 py-2">Status</th>
                                        <th className="border-b border-slate-200 px-2 py-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentsData.items.map((row) => (
                                        <tr key={row.id}>
                                            <td className="border-b border-slate-100 px-2 py-2">{row.email}</td>
                                            <td className="border-b border-slate-100 px-2 py-2">{row.transactionId}</td>
                                            <td className="border-b border-slate-100 px-2 py-2">${row.amount}</td>
                                            <td className="border-b border-slate-100 px-2 py-2">{row.status}</td>
                                            <td className="border-b border-slate-100 px-2 py-2">
                                                <div className="flex gap-2">
                                                    <form action="/admin/books/actions" method="post">
                                                        <input type="hidden" name="actionType" value="paymentStatus" />
                                                        <input type="hidden" name="id" value={row.id} />
                                                        <input type="hidden" name="status" value="APPROVED" />
                                                        <button className="rounded border border-emerald-200 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50">
                                                            Approve
                                                        </button>
                                                    </form>
                                                    <form action="/admin/books/actions" method="post">
                                                        <input type="hidden" name="actionType" value="paymentStatus" />
                                                        <input type="hidden" name="id" value={row.id} />
                                                        <input type="hidden" name="status" value="REJECTED" />
                                                        <button className="rounded border border-rose-200 px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50">
                                                            Reject
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
