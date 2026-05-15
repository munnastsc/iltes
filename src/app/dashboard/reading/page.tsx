import Link from 'next/link';
import { BookOpen, ChevronLeft, Play, Lock } from 'lucide-react';
import { getAvailableReadingTests, READING_BOOKS } from '../../../lib/readingData';

export default function ReadingPage() {
    const tests = getAvailableReadingTests();

    const byBook: Record<number, number[]> = {};
    for (const { book, test } of tests) {
        if (!byBook[book]) byBook[book] = [];
        byBook[book].push(test);
    }

    return (
        <div className="min-h-screen bg-[#f5f6fa]">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 px-5 py-10 lg:px-10">
                <div className="mx-auto max-w-4xl">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition">
                        <ChevronLeft size={15} /> Dashboard
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/30">
                            <BookOpen size={26} className="text-emerald-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white">Reading Practice</h1>
                            <p className="text-slate-400 text-sm mt-1">Cambridge IELTS · Real Passages · 40 Questions per test</p>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-3 max-w-sm">
                        {[
                            { label: 'Available', value: String(Object.keys(byBook).length), sub: 'Books' },
                            { label: 'Tests', value: String(tests.length), sub: 'Total' },
                            { label: 'Questions', value: String(tests.length * 40), sub: 'Total' },
                        ].map(s => (
                            <div key={s.label} className="rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-center">
                                <p className="text-lg font-black text-white">{s.value}</p>
                                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{s.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-5 py-8 space-y-4">
                {READING_BOOKS.map(book => {
                    const available = byBook[book];
                    if (!available) {
                        return (
                            <div key={book} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden opacity-50">
                                <div className="flex items-center justify-between px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
                                            <Lock size={16} className="text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-700">Cambridge IELTS {book}</p>
                                            <p className="text-xs text-slate-400">Passages coming soon</p>
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">Soon</span>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={book} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
                                    <BookOpen size={18} className="text-emerald-700" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-black text-slate-900">Cambridge IELTS {book}</p>
                                    <p className="text-xs text-slate-500">{available.length} tests · 3 passages each · 40 questions</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5">
                                {[1, 2, 3, 4].map(test => {
                                    const ready = available.includes(test);
                                    return ready ? (
                                        <Link
                                            key={test}
                                            href={`/dashboard/reading/${book}/${test}`}
                                            className="group flex flex-col items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-5 hover:bg-emerald-600 hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-200 transition-all duration-200"
                                        >
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white group-hover:bg-emerald-500 border border-emerald-200 group-hover:border-transparent transition shadow-sm">
                                                <Play size={18} className="text-emerald-600 group-hover:text-white transition ml-0.5" />
                                            </div>
                                            <p className="text-sm font-black text-slate-900 group-hover:text-white transition">Test {test}</p>
                                            <p className="text-[11px] text-slate-500 group-hover:text-emerald-200 transition">40 questions</p>
                                        </Link>
                                    ) : (
                                        <div key={test} className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-5 opacity-40">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-slate-200">
                                                <Lock size={16} className="text-slate-400" />
                                            </div>
                                            <p className="text-sm font-black text-slate-500">Test {test}</p>
                                            <p className="text-[11px] text-slate-400">Coming soon</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
