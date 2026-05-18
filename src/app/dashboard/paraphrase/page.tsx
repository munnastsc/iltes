'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, BookOpen, Shuffle, PenLine, Search, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import ParaphraseQuiz from '../../../components/ParaphraseQuiz';
import ParaphraseSynonyms from '../../../components/ParaphraseSynonyms';
import ParaphraseBuilder from '../../../components/ParaphraseBuilder';
import { TECHNIQUES } from '../../../lib/paraphraseData';

type Tab = 'learn' | 'quiz' | 'build' | 'synonyms';

const TABS: Array<{ id: Tab; label: string; bangla: string; icon: React.ReactNode; color: string }> = [
    { id: 'learn', label: 'শিখো', bangla: 'Techniques & Examples', icon: <BookOpen size={16} />, color: 'text-blue-600' },
    { id: 'quiz', label: 'চেনো', bangla: 'Recognition Quiz', icon: <Shuffle size={16} />, color: 'text-violet-600' },
    { id: 'build', label: 'লেখো', bangla: 'Practice & Check', icon: <PenLine size={16} />, color: 'text-emerald-600' },
    { id: 'synonyms', label: 'শব্দভান্ডার', bangla: 'Synonym Dictionary', icon: <Search size={16} />, color: 'text-amber-600' },
];

const TECH_COLORS: Record<string, string> = {
    synonym: 'border-blue-200 bg-blue-50',
    active_passive: 'border-violet-200 bg-violet-50',
    nominalization: 'border-amber-200 bg-amber-50',
    clause_restructure: 'border-emerald-200 bg-emerald-50',
    antonym_negation: 'border-rose-200 bg-rose-50',
    word_form: 'border-indigo-200 bg-indigo-50',
};

const TECH_BADGE: Record<string, string> = {
    synonym: 'bg-blue-100 text-blue-700',
    active_passive: 'bg-violet-100 text-violet-700',
    nominalization: 'bg-amber-100 text-amber-700',
    clause_restructure: 'bg-emerald-100 text-emerald-700',
    antonym_negation: 'bg-rose-100 text-rose-700',
    word_form: 'bg-indigo-100 text-indigo-700',
};

function TechniqueCard({ tech }: { tech: typeof TECHNIQUES[0] }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`rounded-xl border overflow-hidden ${TECH_COLORS[tech.id] ?? 'border-slate-200 bg-white'}`}>
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
                <div>
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className={`rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${TECH_BADGE[tech.id] ?? 'bg-slate-100 text-slate-700'}`}>
                            {tech.id.replace(/_/g, ' ')}
                        </span>
                    </div>
                    <h3 className="text-sm font-black text-slate-900">{tech.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{tech.bangla}</p>
                </div>
                {open ? <ChevronUp size={16} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
            </button>

            {open && (
                <div className="px-5 pb-5 space-y-4 border-t border-black/5">
                    <p className="text-sm text-slate-700 leading-relaxed mt-4">{tech.description}</p>

                    <div className="rounded-xl bg-white/70 border border-black/5 p-3.5">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">কীভাবে করবে</p>
                        <p className="text-xs font-mono text-slate-700 whitespace-pre-line leading-relaxed">{tech.howTo}</p>
                    </div>

                    <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">উদাহরণ</p>
                        {tech.examples.map((ex, i) => (
                            <div key={i} className="rounded-xl bg-white/70 border border-black/5 p-3.5 space-y-2">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 mb-1">Original</p>
                                    <p className="text-sm text-slate-800 leading-relaxed">{ex.original}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-emerald-500 mb-1">Paraphrase</p>
                                    <p className="text-sm text-slate-800 leading-relaxed font-medium">{ex.paraphrase}</p>
                                </div>
                                <div className="rounded-lg bg-slate-100 px-3 py-2">
                                    <p className="text-[10px] font-bold text-slate-400 mb-0.5">কী বদলেছে</p>
                                    <p className="text-xs font-mono text-slate-600">{ex.highlight}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ParaphrasePage() {
    const [tab, setTab] = useState<Tab>('learn');

    return (
        <div className="min-h-screen bg-[#f5f6fa]">

            {/* Header */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-5 py-8 lg:px-10">
                <div className="mx-auto max-w-4xl">
                    <Link href="/dashboard" className="mb-5 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition">
                        <ChevronLeft size={14} /> Dashboard
                    </Link>
                    <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-500/20 border border-indigo-500/30">
                            <Zap size={26} className="text-indigo-300" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white lg:text-4xl">Paraphrase Master</h1>
                            <p className="mt-2 text-sm text-slate-400 max-w-xl leading-relaxed">
                                IELTS এর সবচেয়ে গুরুত্বপূর্ণ skill — শিখো, চেনো, এবং নিজে লেখো।
                                Cambridge Books 1–20 এর real paraphrase patterns থেকে build করা।
                            </p>
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { v: '6', l: 'Techniques' },
                            { v: '700+', l: 'Quiz Questions' },
                            { v: '1000+', l: 'Synonyms' },
                            { v: '500+', l: 'Practice Sentences' },
                        ].map((s) => (
                            <div key={s.l} className="rounded-xl border border-white/5 bg-white/5 px-4 py-3">
                                <p className="text-xl font-black text-white">{s.v}</p>
                                <p className="text-[11px] text-slate-400">{s.l}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white shadow-sm">
                <div className="mx-auto max-w-4xl px-5">
                    <div className="flex">
                        {TABS.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className={`relative flex flex-1 flex-col items-center gap-0.5 py-3.5 text-sm font-bold transition-colors ${
                                    tab === t.id ? t.color : 'text-slate-400 hover:text-slate-700'
                                }`}
                            >
                                <span className="flex items-center gap-1.5">
                                    {t.icon}
                                    <span>{t.label}</span>
                                </span>
                                <span className="text-[10px] font-medium hidden sm:block opacity-60">{t.bangla}</span>
                                {tab === t.id && (
                                    <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                                        t.id === 'learn' ? 'bg-blue-600' : t.id === 'quiz' ? 'bg-violet-600' : t.id === 'build' ? 'bg-emerald-600' : 'bg-amber-600'
                                    }`} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-4xl px-5 py-8 lg:px-8">

                {/* ── শিখো: LEARN ── */}
                {tab === 'learn' && (
                    <div className="space-y-6">
                        <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
                            <h2 className="font-black text-blue-900 mb-1">Paraphrase কী এবং কেন শিখতে হবে?</h2>
                            <p className="text-sm text-blue-800 leading-relaxed">
                                IELTS এ Examiner সবসময় passage/audio এর exact শব্দ question এ ব্যবহার করে না — সে <strong>paraphrase</strong> করে।
                                Reading এ তুমি যদি passage এর exact শব্দ question এ খোঁজো তাহলে পাবে না।
                                Audio তে যা বলে তা question এ অন্যভাবে লেখা থাকে।
                                Writing এ question টা paraphrase করে introduction শুরু করতে হয়।
                                এই system তোমাকে ৬টা main technique শেখাবে — প্রতিটা click করে details দেখো।
                            </p>
                        </div>

                        <div className="space-y-3">
                            {TECHNIQUES.map((tech) => (
                                <TechniqueCard key={tech.id} tech={tech} />
                            ))}
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <h3 className="font-black text-slate-900 mb-3">IELTS এ Paraphrase কোথায় কোথায় আসে</h3>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {[
                                    { module: 'Listening', color: 'bg-blue-50 border-blue-100', points: ['Question এ passage/audio এর synonym থাকে', 'Audio তে distractor বলে তারপর correct করে', 'Section 3-4 তে complex paraphrasing বেশি'] },
                                    { module: 'Reading', color: 'bg-emerald-50 border-emerald-100', points: ['True/False এ statement টা passage থেকে paraphrase', 'Short answer এ passage এর exact word লিখতে হয়', 'Heading matching তে main idea paraphrase করা থাকে'] },
                                    { module: 'Writing', color: 'bg-violet-50 border-violet-100', points: ['Task 2 introduction এ question paraphrase করতে হয়', 'একই শব্দ বারবার না লিখে synonym ব্যবহার করতে হয়', 'Task 1 এ data describe করতে variety লাগে'] },
                                    { module: 'Speaking', color: 'bg-rose-50 border-rose-100', points: ['Examiner এর question টা নিজের ভাষায় restate করে answer শুরু করো', 'Vocabulary range দেখাতে synonyms ব্যবহার করো', 'একই শব্দ repeat করা fluency কমায়'] },
                                ].map((item) => (
                                    <div key={item.module} className={`rounded-xl border p-4 ${item.color}`}>
                                        <p className="font-black text-slate-900 mb-2 text-sm">{item.module}</p>
                                        <ul className="space-y-1.5">
                                            {item.points.map((p, i) => (
                                                <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                                                    <span className="text-slate-400 mt-0.5">•</span> {p}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => setTab('quiz')}
                            className="w-full rounded-xl bg-violet-600 py-3 text-sm font-bold text-white hover:bg-violet-500 transition"
                        >
                            এখন Quiz দাও → চেনো Tab
                        </button>
                    </div>
                )}

                {/* ── চেনো: QUIZ ── */}
                {tab === 'quiz' && (
                    <div className="space-y-4">
                        <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3">
                            <p className="text-sm text-violet-800 font-medium">
                                <strong>৩ ধরনের প্রশ্ন:</strong> Paraphrase খোঁজো (original দেখে correct paraphrase বেছে নাও) · Source খোঁজো (paraphrased question দেখে original passage sentence বেছে নাও) · Technique চেনো (কোন technique ব্যবহার হয়েছে চেনো)।
                                Filter ব্যবহার করে specific practice করতে পারো।
                            </p>
                        </div>
                        <ParaphraseQuiz />
                    </div>
                )}

                {/* ── লেখো: BUILD ── */}
                {tab === 'build' && (
                    <div className="space-y-4">
                        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                            <p className="text-sm text-emerald-800 font-medium">
                                একটা sentence দেওয়া হবে — তুমি সেটার paraphrase লেখো।
                                System automatically check করবে তুমি কতটুকু কার্যকরভাবে paraphrase করেছো।
                                OpenAI key থাকলে AI feedback পাবে, না থাকলে basic analysis পাবে।
                            </p>
                        </div>
                        <ParaphraseBuilder />
                    </div>
                )}

                {/* ── শব্দভান্ডার: SYNONYMS ── */}
                {tab === 'synonyms' && (
                    <div className="space-y-4">
                        <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
                            <p className="text-sm text-amber-800 font-medium">
                                IELTS এ সবচেয়ে বেশি দরকার হওয়া <strong>1000+ synonym</strong> — category অনুযায়ী সাজানো।
                                যেকোনো শব্দ search করো। Synonym এ click করলে copy হয়ে যাবে — সরাসরি Writing বা Speaking এ ব্যবহার করো।
                            </p>
                        </div>
                        <ParaphraseSynonyms />
                    </div>
                )}
            </div>
        </div>
    );
}
