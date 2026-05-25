'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Target, TrendingUp, BookOpen, Headphones, Mic, PenLine, AlertCircle } from 'lucide-react';

type ModuleData = {
    id: string;
    label: string;
    bangla: string;
    icon: React.ReactNode;
    color: string;
    ring: string;
    band: number | null;
    attempts: number;
    href: string;
    tip: string;
};

function readBand(module: string): { band: number | null; attempts: number } {
    if (typeof window === 'undefined') return { band: null, attempts: 0 };
    try {
        if (module === 'reading' || module === 'listening') {
            const raw = localStorage.getItem('practice_attempts') || '[]';
            const items: Array<{ module: string; percentage: number }> = JSON.parse(raw);
            const rel = items.filter(a => a.module?.toLowerCase().includes(module));
            if (!rel.length) return { band: null, attempts: 0 };
            const avg = rel.reduce((s, a) => s + a.percentage, 0) / rel.length;
            // Reading/Listening % → band approximation
            const band = avg >= 90 ? 8.5 : avg >= 80 ? 7.5 : avg >= 70 ? 6.5 : avg >= 60 ? 5.5 : avg >= 50 ? 5 : 4.5;
            return { band: Math.round(band * 2) / 2, attempts: rel.length };
        }
        if (module === 'speaking') {
            const raw = localStorage.getItem('speaking_attempts') || '[]';
            const items: Array<{ band: number }> = JSON.parse(raw);
            if (!items.length) return { band: null, attempts: 0 };
            const avg = items.reduce((s, a) => s + (a.band || 0), 0) / items.length;
            return { band: Math.round(avg * 2) / 2, attempts: items.length };
        }
        if (module === 'writing') {
            const raw = localStorage.getItem('writing_attempts') || '[]';
            const items: Array<{ band: number }> = JSON.parse(raw);
            if (!items.length) return { band: null, attempts: 0 };
            const avg = items.reduce((s, a) => s + (a.band || 0), 0) / items.length;
            return { band: Math.round(avg * 2) / 2, attempts: items.length };
        }
    } catch { /* */ }
    return { band: null, attempts: 0 };
}

function bandToColor(band: number | null) {
    if (!band) return 'text-slate-400';
    if (band >= 7.5) return 'text-emerald-600';
    if (band >= 6.5) return 'text-amber-600';
    return 'text-rose-600';
}

function bandToBar(band: number | null) {
    if (!band) return 'bg-slate-200';
    if (band >= 7.5) return 'bg-emerald-500';
    if (band >= 6.5) return 'bg-amber-500';
    return 'bg-rose-500';
}

function daysToTarget(current: number, target: number): string {
    if (current >= target) return 'অর্জিত! 🎉';
    const diff = target - current;
    if (diff <= 0.5) return '~2 সপ্তাহ';
    if (diff <= 1) return '~1 মাস';
    if (diff <= 1.5) return '~2 মাস';
    return '~3+ মাস';
}

export default function BandPredictorPage() {
    const [modules, setModules] = useState<ModuleData[]>([]);
    const [targetBand, setTargetBand] = useState(7);

    useEffect(() => {
        const reading  = readBand('reading');
        const listening = readBand('listening');
        const speaking  = readBand('speaking');
        const writing   = readBand('writing');

        setModules([
            { id: 'reading',   label: 'Reading',   bangla: 'রিডিং',     icon: <BookOpen size={18} />,    color: 'bg-emerald-100', ring: 'ring-emerald-400', ...reading,  href: '/dashboard/reading',   tip: 'Cambridge tests আরো practice করো' },
            { id: 'listening', label: 'Listening', bangla: 'লিসেনিং',  icon: <Headphones size={18} />,  color: 'bg-blue-100',    ring: 'ring-blue-400',    ...listening, href: '/dashboard/listening', tip: 'Dictation ও shadowing practice করো' },
            { id: 'speaking',  label: 'Speaking',  bangla: 'স্পিকিং',  icon: <Mic size={18} />,         color: 'bg-rose-100',    ring: 'ring-rose-400',    ...speaking,  href: '/dashboard/speaking',  tip: 'Part 2 cue card practice বাড়াও' },
            { id: 'writing',   label: 'Writing',   bangla: 'রাইটিং',   icon: <PenLine size={18} />,     color: 'bg-violet-100',  ring: 'ring-violet-400',  ...writing,   href: '/dashboard/writing',   tip: 'Task 2 essay আরো লেখো' },
        ]);
    }, []);

    const scored = modules.filter(m => m.band !== null);
    const overall = scored.length
        ? Math.round((scored.reduce((s, m) => s + (m.band || 0), 0) / scored.length) * 2) / 2
        : null;

    const overallColor = bandToColor(overall);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/20">
            <div className="border-b border-slate-200 bg-white px-5 py-4 shadow-sm">
                <div className="mx-auto flex max-w-4xl items-center gap-3">
                    <Link href="/dashboard" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-lg font-black text-slate-900">Band Score Predictor</h1>
                        <p className="text-[11px] text-slate-500">তোমার সব practice-এর উপর ভিত্তি করে IELTS band estimate</p>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-5 py-6 space-y-5">
                {/* Overall band */}
                <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-br from-slate-900 to-indigo-900 px-6 py-8 text-center">
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-300 mb-2">Predicted Overall Band</p>
                        {overall ? (
                            <>
                                <p className="text-7xl font-black text-white mb-1">{overall}</p>
                                <p className="text-sm text-slate-400">
                                    {overall >= 8 ? 'Excellent — Expert User' :
                                     overall >= 7 ? 'Good — Competent User' :
                                     overall >= 6 ? 'Competent — Effective User' :
                                     'Modest — Limited User'}
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-7xl font-black text-slate-500 mb-1">—</p>
                                <p className="text-sm text-slate-400">Practice করো → Band দেখাবে</p>
                            </>
                        )}
                    </div>

                    {/* Target selector */}
                    <div className="px-6 py-4 border-b border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-black text-slate-700">Target Band</p>
                            <p className="text-lg font-black text-indigo-600">{targetBand}</p>
                        </div>
                        <input type="range" min={5} max={9} step={0.5} value={targetBand}
                            onChange={e => setTargetBand(parseFloat(e.target.value))}
                            className="w-full accent-indigo-600" />
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                            <span>5.0</span><span>6.0</span><span>7.0</span><span>8.0</span><span>9.0</span>
                        </div>
                    </div>

                    {overall && (
                        <div className="px-6 py-4 bg-indigo-50">
                            <div className="flex items-center gap-3">
                                <TrendingUp size={18} className="text-indigo-600 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-black text-indigo-800">
                                        Band {targetBand} পেতে: {daysToTarget(overall, targetBand)}
                                    </p>
                                    <p className="text-[11px] text-indigo-600">প্রতিদিন consistent practice করলে</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Module breakdown */}
                <p className="text-sm font-black text-slate-700">Module-wise Breakdown:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {modules.map(mod => (
                        <div key={mod.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${mod.color} text-slate-700`}>
                                        {mod.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-800">{mod.label}</p>
                                        <p className="text-[10px] text-slate-400">{mod.attempts} attempts</p>
                                    </div>
                                </div>
                                <p className={`text-3xl font-black ${bandToColor(mod.band)}`}>
                                    {mod.band ?? '—'}
                                </p>
                            </div>

                            {/* Band bar */}
                            <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-3">
                                <div className={`h-full rounded-full transition-all duration-700 ${bandToBar(mod.band)}`}
                                    style={{ width: mod.band ? `${(mod.band / 9) * 100}%` : '0%' }} />
                            </div>

                            {mod.band === null ? (
                                <div className="flex items-center gap-1.5">
                                    <AlertCircle size={12} className="text-slate-400" />
                                    <p className="text-[11px] text-slate-400">এখনো কোনো attempt নেই</p>
                                </div>
                            ) : mod.band < targetBand ? (
                                <p className="text-[11px] text-amber-600">💡 {mod.tip}</p>
                            ) : (
                                <p className="text-[11px] text-emerald-600">✓ Target band অর্জিত!</p>
                            )}

                            <Link href={mod.href}
                                className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 hover:text-indigo-500 transition">
                                <Target size={11} /> Practice করো
                            </Link>
                        </div>
                    ))}
                </div>

                {scored.length < 4 && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                        <p className="text-xs font-bold text-amber-700">
                            💡 সব ৪টা module-এ practice করলে accurate band prediction পাবে। এখন {scored.length}/4 module-এ data আছে।
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
