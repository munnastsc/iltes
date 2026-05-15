'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BarChart3, Trash2 } from 'lucide-react';

type Attempt = {
    id: string;
    module: string;
    title: string;
    correct: number;
    total: number;
    percentage: number;
    band: number | null;
    wrongQuestions: number[];
    retryMode: boolean;
    createdAt: string;
};

export default function PracticeAnalyticsPage() {
    const [attempts, setAttempts] = useState<Attempt[]>([]);
    const [loading, setLoading] = useState(true);

    const loadAttempts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/progress/attempts');
            const data = await res.json();
            setAttempts(Array.isArray(data?.items) ? data.items : []);
        } catch {
            setAttempts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAttempts();
    }, []);

    const summary = useMemo(() => {
        const modules = ['Listening', 'Reading', 'Writing', 'Speaking'];
        return modules.map((module) => {
            const rows = attempts.filter((a) => a.module === module);
            const avg = rows.length ? Math.round(rows.reduce((sum, r) => sum + r.percentage, 0) / rows.length) : 0;
            const best = rows.length ? Math.max(...rows.map((r) => r.percentage)) : 0;
            const avgBandRows = rows.filter((r) => typeof r.band === 'number');
            const avgBand = avgBandRows.length
                ? Number((avgBandRows.reduce((sum, r) => sum + Number(r.band), 0) / avgBandRows.length).toFixed(1))
                : null;
            return { module, attempts: rows.length, avg, best, avgBand };
        });
    }, [attempts]);

    const overall = useMemo(() => {
        if (!attempts.length) return 0;
        return Math.round(attempts.reduce((sum, r) => sum + r.percentage, 0) / attempts.length);
    }, [attempts]);

    return (
        <div className="min-h-screen bg-slate-50 px-5 py-8">
            <div className="mx-auto max-w-6xl">
                <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-6">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-700">Practice Analytics</p>
                        <h1 className="mt-2 text-3xl font-black text-slate-900">Student Performance Dashboard</h1>
                        <p className="mt-2 text-sm text-slate-600">Server-backed attempt tracking with score and band estimates.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={async () => {
                                await fetch('/api/progress/attempts', { method: 'DELETE' });
                                await loadAttempts();
                            }}
                            className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700"
                        >
                            <Trash2 size={16} />
                            Clear Analytics
                        </button>
                        <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                            <ArrowLeft size={16} />
                            Back Dashboard
                        </Link>
                    </div>
                </header>

                <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <article className="rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.1em] text-slate-500">Total Attempts</p>
                        <p className="mt-1 text-3xl font-bold text-slate-900">{attempts.length}</p>
                    </article>
                    <article className="rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.1em] text-slate-500">Overall Avg</p>
                        <p className="mt-1 text-3xl font-bold text-slate-900">{overall}%</p>
                    </article>
                    <article className="rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.1em] text-slate-500">Retry Sessions</p>
                        <p className="mt-1 text-3xl font-bold text-slate-900">{attempts.filter((a) => a.retryMode).length}</p>
                    </article>
                    <article className="rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.1em] text-slate-500">Best Score</p>
                        <p className="mt-1 text-3xl font-bold text-slate-900">{attempts.length ? Math.max(...attempts.map((a) => a.percentage)) : 0}%</p>
                    </article>
                </section>

                <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
                    <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-slate-700">
                        <BarChart3 size={16} />
                        Module Performance
                    </p>
                    <div className="mt-4 space-y-4">
                        {summary.map((row) => (
                            <div key={row.module}>
                                <div className="mb-1 flex items-center justify-between text-sm font-medium text-slate-700">
                                    <span>{row.module}</span>
                                    <span>
                                        Avg {row.avg}% | Best {row.best}% | Attempts {row.attempts}
                                        {row.avgBand !== null ? ` | Band ~${row.avgBand}` : ''}
                                    </span>
                                </div>
                                <div className="h-2.5 w-full rounded-full bg-slate-100">
                                    <div className="h-full rounded-full bg-violet-600" style={{ width: `${row.avg}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
                    <p className="text-sm font-bold uppercase tracking-[0.1em] text-slate-700">Recent Attempts</p>
                    {loading ? (
                        <p className="mt-3 text-sm text-slate-500">Loading...</p>
                    ) : !attempts.length ? (
                        <p className="mt-3 text-sm text-slate-500">No attempts saved yet.</p>
                    ) : (
                        <div className="mt-3 overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="text-left text-slate-500">
                                        <th className="border-b border-slate-200 py-2 pr-3">Time</th>
                                        <th className="border-b border-slate-200 py-2 pr-3">Title</th>
                                        <th className="border-b border-slate-200 py-2 pr-3">Module</th>
                                        <th className="border-b border-slate-200 py-2 pr-3">Score</th>
                                        <th className="border-b border-slate-200 py-2 pr-3">Band</th>
                                        <th className="border-b border-slate-200 py-2 pr-3">Wrong</th>
                                        <th className="border-b border-slate-200 py-2 pr-3">Mode</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attempts.slice(0, 40).map((a) => (
                                        <tr key={a.id} className="text-slate-700">
                                            <td className="border-b border-slate-100 py-2 pr-3">{new Date(a.createdAt).toLocaleString()}</td>
                                            <td className="border-b border-slate-100 py-2 pr-3">{a.title}</td>
                                            <td className="border-b border-slate-100 py-2 pr-3">{a.module}</td>
                                            <td className="border-b border-slate-100 py-2 pr-3">
                                                {a.correct}/{a.total} ({a.percentage}%)
                                            </td>
                                            <td className="border-b border-slate-100 py-2 pr-3">{a.band ?? '-'}</td>
                                            <td className="border-b border-slate-100 py-2 pr-3">{a.wrongQuestions.length}</td>
                                            <td className="border-b border-slate-100 py-2 pr-3">{a.retryMode ? 'Retry' : 'Full'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
