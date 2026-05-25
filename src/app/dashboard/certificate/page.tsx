'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Award, CheckCircle2, Lock } from 'lucide-react';

const MODULES = [
    {
        id: 'reading',
        label: 'Reading Practice',
        bangla: 'রিডিং প্র্যাকটিস',
        color: 'from-emerald-500 to-teal-600',
        badge: 'bg-emerald-100 text-emerald-700',
        progressKey: 'reading_attempts',
        requiredScore: 70,
        description: 'Cambridge Reading Tests সম্পূর্ণ করেছ',
    },
    {
        id: 'listening',
        label: 'Listening Practice',
        bangla: 'লিসেনিং প্র্যাকটিস',
        color: 'from-blue-500 to-indigo-600',
        badge: 'bg-blue-100 text-blue-700',
        progressKey: 'listening_attempts',
        requiredScore: 70,
        description: 'Cambridge Listening Tests সম্পূর্ণ করেছ',
    },
    {
        id: 'spoken',
        label: 'Spoken English',
        bangla: 'স্পোকেন ইংলিশ',
        color: 'from-teal-500 to-cyan-600',
        badge: 'bg-teal-100 text-teal-700',
        progressKey: 'spoken_streak_days',
        requiredStreak: 7,
        description: '৭ দিন Spoken English practice করেছ',
    },
    {
        id: 'speaking',
        label: 'IELTS Speaking',
        bangla: 'আইইএলটিএস স্পিকিং',
        color: 'from-rose-500 to-pink-600',
        badge: 'bg-rose-100 text-rose-700',
        progressKey: 'speaking_attempts',
        requiredScore: 6,
        description: 'IELTS Speaking Practice সম্পূর্ণ করেছ',
    },
    {
        id: 'writing',
        label: 'IELTS Writing',
        bangla: 'আইইএলটিএস রাইটিং',
        color: 'from-violet-500 to-purple-600',
        badge: 'bg-violet-100 text-violet-700',
        progressKey: 'writing_attempts',
        requiredScore: 6,
        description: 'IELTS Writing Evaluation সম্পূর্ণ করেছ',
    },
    {
        id: 'vocabulary',
        label: 'Vocabulary Builder',
        bangla: 'ভোকাবুলারি বিল্ডার',
        color: 'from-amber-500 to-orange-600',
        badge: 'bg-amber-100 text-amber-700',
        progressKey: 'vocab_quiz_best',
        requiredScore: 80,
        description: 'Vocabulary Quiz-এ ৮০%+ পেয়েছ',
    },
];

function checkUnlocked(mod: typeof MODULES[0]): boolean {
    if (typeof window === 'undefined') return false;
    try {
        if (mod.id === 'spoken') {
            const days: string[] = JSON.parse(localStorage.getItem('spoken_streak_days') || '[]');
            return days.length >= (mod.requiredStreak || 7);
        }
        if (mod.id === 'vocabulary') {
            const best = parseInt(localStorage.getItem('vocab_quiz_best') || '0', 10);
            return best >= (mod.requiredScore || 80);
        }
        if (mod.id === 'reading' || mod.id === 'listening') {
            const raw = localStorage.getItem('practice_attempts');
            const items = raw ? JSON.parse(raw) : [];
            const relevant = items.filter((a: { module: string; percentage: number }) =>
                a.module?.toLowerCase().includes(mod.id) && a.percentage >= (mod.requiredScore || 70)
            );
            return relevant.length >= 3;
        }
        if (mod.id === 'speaking') {
            const raw = localStorage.getItem('speaking_attempts');
            const items = raw ? JSON.parse(raw) : [];
            return items.some((a: { band: number }) => a.band >= (mod.requiredScore || 6));
        }
        if (mod.id === 'writing') {
            const raw = localStorage.getItem('writing_attempts');
            const items = raw ? JSON.parse(raw) : [];
            return items.some((a: { band: number }) => a.band >= (mod.requiredScore || 6));
        }
    } catch { /* */ }
    return false;
}

function CertificateCard({ name, module: mod, date }: { name: string; module: typeof MODULES[0]; date: string }) {
    return (
        <div
            id="cert-print"
            style={{ fontFamily: 'Georgia, serif' }}
            className={`relative w-full max-w-2xl mx-auto bg-gradient-to-br ${mod.color} rounded-3xl p-1 shadow-2xl`}
        >
            <div className="bg-white rounded-[22px] p-8 text-center relative overflow-hidden">
                {/* decorative circles */}
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-5 bg-current" />
                <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full opacity-5 bg-current" />

                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${mod.color} shadow-lg mb-4`}>
                    <Award size={32} className="text-white" />
                </div>

                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">ILTES — Sathi AI</p>
                <h1 className="text-3xl font-black text-slate-900 mb-1">Certificate of Achievement</h1>
                <p className="text-sm text-slate-500 mb-6">সফলভাবে সম্পন্ন করার স্বীকৃতি</p>

                <div className="border-t border-b border-slate-100 py-6 mb-6">
                    <p className="text-sm text-slate-500 mb-1">এই সার্টিফিকেট প্রদান করা হচ্ছে</p>
                    <p className="text-4xl font-black text-slate-900 mb-2">{name || 'আপনার নাম'}</p>
                    <p className="text-sm text-slate-500">-কে</p>
                </div>

                <p className="text-lg font-bold text-slate-700 mb-1">{mod.bangla}</p>
                <p className="text-sm text-slate-500 mb-6">{mod.description}</p>

                <div className={`inline-flex items-center gap-2 rounded-full px-5 py-2 bg-gradient-to-r ${mod.color} text-white text-sm font-bold shadow-lg`}>
                    <CheckCircle2 size={16} />
                    {mod.label} — Completed
                </div>

                <div className="mt-8 flex justify-between items-end text-xs text-slate-400">
                    <div>
                        <p className="font-bold text-slate-600">ILTES AI</p>
                        <p>iltes-sathi.com</p>
                    </div>
                    <div className="text-right">
                        <p>তারিখ</p>
                        <p className="font-bold text-slate-600">{date}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CertificatePage() {
    const [name, setName] = useState('');
    const [selectedMod, setSelectedMod] = useState<string | null>(null);
    const printRef = useRef<HTMLDivElement>(null);

    const unlocked = MODULES.filter(m => {
        if (typeof window === 'undefined') return false;
        return checkUnlocked(m);
    });

    const today = new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });

    function handlePrint() {
        const content = printRef.current?.innerHTML;
        if (!content) return;
        const win = window.open('', '_blank');
        if (!win) return;
        win.document.write(`
            <html><head><title>Certificate</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
            <style>
                body { margin: 0; padding: 40px; background: white; display: flex; justify-content: center; }
                @media print { body { padding: 0; } }
                * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            </style>
            </head><body>${content}</body></html>
        `);
        win.document.close();
        win.focus();
        setTimeout(() => { win.print(); win.close(); }, 500);
    }

    const activeMod = MODULES.find(m => m.id === selectedMod);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50/30">
            <div className="border-b border-slate-200 bg-white px-5 py-4 shadow-sm">
                <div className="mx-auto flex max-w-4xl items-center gap-3">
                    <Link href="/dashboard" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-lg font-black text-slate-900">Certificate of Achievement</h1>
                        <p className="text-[11px] text-slate-500">Module সম্পন্ন করলে Certificate ডাউনলোড করো</p>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-5 py-8">
                {/* Modules grid */}
                <p className="mb-4 text-sm font-black text-slate-700">তোমার Achievements:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                    {MODULES.map(mod => {
                        const done = unlocked.some(u => u.id === mod.id);
                        return (
                            <button
                                key={mod.id}
                                onClick={() => done ? setSelectedMod(mod.id) : null}
                                disabled={!done}
                                className={`rounded-2xl border p-4 text-left transition-all ${done
                                    ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-md cursor-pointer'
                                    : 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                                } ${selectedMod === mod.id ? 'ring-2 ring-amber-400' : ''}`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${mod.color}`}>
                                        {done ? <Award size={18} className="text-white" /> : <Lock size={16} className="text-white" />}
                                    </div>
                                    {done && <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />}
                                </div>
                                <p className="text-xs font-black text-slate-800">{mod.label}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{mod.bangla}</p>
                                {!done && <p className="text-[10px] text-slate-400 mt-1">{mod.description}</p>}
                                {done && <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ Unlocked — Click to generate</p>}
                            </button>
                        );
                    })}
                </div>

                {/* Certificate preview */}
                {activeMod && (
                    <div className="space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-slate-600 mb-1">তোমার নাম (Certificate-এ থাকবে)</label>
                                <input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="তোমার পুরো নাম লেখো..."
                                    className="w-full max-w-sm rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-amber-400 transition"
                                />
                            </div>
                            <button
                                onClick={handlePrint}
                                disabled={!name.trim()}
                                className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-lg shadow-amber-200"
                            >
                                <Download size={16} /> Download / Print
                            </button>
                        </div>

                        <div ref={printRef}>
                            <CertificateCard name={name} module={activeMod} date={today} />
                        </div>
                    </div>
                )}

                {!activeMod && unlocked.length === 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                        <Award size={40} className="mx-auto text-slate-300 mb-3" />
                        <p className="font-bold text-slate-600 mb-1">এখনো কোনো Certificate Unlock হয়নি</p>
                        <p className="text-sm text-slate-400">Module practice করো এবং requirements পূরণ করো।</p>
                        <Link href="/dashboard" className="mt-4 inline-block rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-700 transition">
                            Practice শুরু করো
                        </Link>
                    </div>
                )}

                {!activeMod && unlocked.length > 0 && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center">
                        <p className="text-sm font-bold text-amber-700">উপরে Unlocked module-এ click করো Certificate দেখতে।</p>
                    </div>
                )}
            </div>
        </div>
    );
}
