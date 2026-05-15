import Link from 'next/link';
import { prisma } from '../../../../lib/prisma';
import { listLocalBooks } from '../../../../lib/localStore';
import { findContentQaIssues } from '../../../../lib/contentQa';

async function getQa() {
    try {
        let rows: any[] = [];
        let source: 'database' | 'local' = 'database';
        try {
            rows = await prisma.cambridgeBook.findMany({
                orderBy: [{ bookNumber: 'asc' }, { testNumber: 'asc' }, { module: 'asc' }],
            });
        } catch {
            rows = await listLocalBooks();
            source = 'local';
        }
        const issues = findContentQaIssues(rows as any);
        return { source, rows, issues };
    } catch {
        return { source: 'local' as const, rows: [], issues: [] as Array<{ level: 'error' | 'warning'; key: string; message: string }> };
    }
}

export default async function AdminBooksQaPage() {
    const qa = await getQa();

    return (
        <div className="min-h-screen bg-slate-50 px-5 py-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex items-end justify-between border-b border-slate-200 pb-5">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Admin QA</p>
                        <h1 className="mt-2 text-3xl font-bold text-slate-900">Books/Mock Content Quality Scan</h1>
                        <p className="mt-2 text-sm text-slate-600">Detects missing parts, duplicate numbering, and question count mismatches.</p>
                    </div>
                    <Link href="/admin/books?tab=content" className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                        Back to Admin
                    </Link>
                </div>

                <section className="grid gap-3 sm:grid-cols-3">
                    <article className="rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.1em] text-slate-500">Source</p>
                        <p className="mt-1 text-2xl font-bold text-slate-900">{qa.source}</p>
                    </article>
                    <article className="rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.1em] text-slate-500">Records</p>
                        <p className="mt-1 text-2xl font-bold text-slate-900">{qa.rows.length}</p>
                    </article>
                    <article className="rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.1em] text-slate-500">Issues</p>
                        <p className="mt-1 text-2xl font-bold text-slate-900">{qa.issues.length}</p>
                    </article>
                </section>

                <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
                    <h2 className="text-lg font-semibold text-slate-900">Issue List</h2>
                    {qa.issues.length === 0 ? (
                        <p className="mt-3 text-sm text-emerald-700">No issues found. Content looks healthy.</p>
                    ) : (
                        <ul className="mt-3 space-y-2">
                            {qa.issues.slice(0, 300).map((item, idx) => (
                                <li
                                    key={`${item.key}-${idx}`}
                                    className={`rounded-md border px-3 py-2 text-sm ${
                                        item.level === 'error'
                                            ? 'border-rose-200 bg-rose-50 text-rose-700'
                                            : 'border-amber-200 bg-amber-50 text-amber-800'
                                    }`}
                                >
                                    <span className="font-semibold">{item.key}</span> - {item.message}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
}
