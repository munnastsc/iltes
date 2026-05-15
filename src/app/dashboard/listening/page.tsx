import Link from 'next/link';
import { Headphones, ChevronLeft, Play, Lock } from 'lucide-react';
import { getAvailableTests } from '../../../lib/listeningData';
import { getSimpleListeningTest } from '../../../lib/simpleListeningData';

export default function ListeningPage() {
    const tests = getAvailableTests();

    const byBook: Record<number, number[]> = {};
    for (const { book, test } of tests) {
        if (!byBook[book]) byBook[book] = [];
        byBook[book].push(test);
    }

    // Include Cambridge 16-20 tests from static simple data
    for (let book = 16; book <= 20; book++) {
        for (let test = 1; test <= 4; test++) {
            if (getSimpleListeningTest(book, test)) {
                if (!byBook[book]) byBook[book] = [];
                if (!byBook[book].includes(test)) byBook[book].push(test);
            }
        }
    }

    const mp3Books = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const youtubeBooks: number[] = [];
    const totalTests = tests.length + youtubeBooks.length * 4;

    return (
        <div className="min-h-screen bg-[#f5f6fa]">
            {/* Header */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-5 py-10 lg:px-10">
                <div className="mx-auto max-w-4xl">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition">
                        <ChevronLeft size={15} /> Dashboard
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20 border border-blue-500/30">
                            <Headphones size={26} className="text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white">Listening Practice</h1>
                            <p className="text-slate-400 text-sm mt-1">Cambridge IELTS 9–20 · Audio · 40 Questions per test</p>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-3 max-w-sm">
                        {[
                            { label: 'Available', value: '12', sub: 'Books' },
                            { label: 'Tests', value: String(totalTests), sub: 'Total' },
                            { label: 'Questions', value: String(totalTests * 40), sub: 'Total' },
                        ].map(s => (
                            <div key={s.label} className="rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-center">
                                <p className="text-lg font-black text-white">{s.value}</p>
                                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{s.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Book list */}
            <div className="mx-auto max-w-4xl px-5 py-8 space-y-4">
                {/* cam9-15: MP3 quiz mode */}
                {mp3Books.map(book => {
                    const available = byBook[book] ?? (book >= 16 && book <= 20 ? [1, 2, 3, 4] : undefined);
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
                                            <p className="text-xs text-slate-400">Questions coming soon</p>
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">Soon</span>
                                </div>
                            </div>
                        );
                    }
                    return (
                        <div key={book} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
                                    <Headphones size={18} className="text-blue-700" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-black text-slate-900">Cambridge IELTS {book}</p>
                                    <p className="text-xs text-slate-500">{available.length} tests · 4 sections each · 40 questions</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5">
                                {[1, 2, 3, 4].map(test => {
                                    const ready = available.includes(test);
                                    return ready ? (
                                        <Link
                                            key={test}
                                            href={`/dashboard/listening/${book}/${test}`}
                                            className="group flex flex-col items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 p-5 hover:bg-blue-600 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all duration-200"
                                        >
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white group-hover:bg-blue-500 border border-blue-200 group-hover:border-transparent transition shadow-sm">
                                                <Play size={18} className="text-blue-600 group-hover:text-white transition ml-0.5" />
                                            </div>
                                            <p className="text-sm font-black text-slate-900 group-hover:text-white transition">Test {test}</p>
                                            <p className="text-[11px] text-slate-500 group-hover:text-blue-200 transition">40 questions</p>
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

                {/* cam16-20: YouTube mode */}
                {youtubeBooks.map(book => (
                    <div key={book} className="rounded-2xl border border-red-100 bg-white shadow-sm overflow-hidden">
                        <div className="flex items-center gap-3 px-6 py-4 border-b border-red-50 bg-gradient-to-r from-red-50 to-rose-50">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100">
                                <Play size={18} className="text-red-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-black text-slate-900">Cambridge IELTS {book}</p>
                                <p className="text-xs text-slate-500">4 tests · YouTube audio · Questions & answers</p>
                            </div>
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">YouTube</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5">
                            {[1, 2, 3, 4].map(test => (
                                <Link
                                    key={test}
                                    href={`/dashboard/book/${book}?module=Listening&test=${test}`}
                                    className="group flex flex-col items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-5 hover:bg-red-600 hover:border-red-600 hover:shadow-lg hover:shadow-red-200 transition-all duration-200"
                                >
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white group-hover:bg-red-500 border border-red-200 group-hover:border-transparent transition shadow-sm">
                                        <Play size={18} className="text-red-600 group-hover:text-white transition ml-0.5" />
                                    </div>
                                    <p className="text-sm font-black text-slate-900 group-hover:text-white transition">Test {test}</p>
                                    <p className="text-[11px] text-slate-500 group-hover:text-red-200 transition">40 questions</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
