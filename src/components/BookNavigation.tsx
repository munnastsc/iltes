'use client';

import { useEffect, useMemo, useState, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import { Headphones, BookOpen, PenLine, Mic, Volume2, CheckCircle2, AlertCircle } from 'lucide-react';
import AnswerPractice from './AnswerPractice';
import { getMapImage } from '../lib/listeningMapPages';
import { getWritingImage } from '../lib/cambridgeWritingPages';

type QuestionItem = {
    number?: number;
    type?: 'fill_in_blank' | 'mcq' | 'double_mcq' | 'true_false' | 'matching';
    prompt?: string;
    answer?: string;
    answerLine?: string;
    options?: string[];
};

type ContentPart = {
    partNumber?: number;
    title?: string;
    text?: string;
    imageUrl?: string;
    audioUrl?: string | null;
    tips?: string[];
    questions?: QuestionItem[];
    headingOptions?: string[];
};

type ContentShape = {
    title?: string;
    sourceStatus?: string;
    introduction?: string;
    audioUrl?: string | null;
    examConfig?: {
        durationMinutes?: number;
        totalQuestions?: number;
        module?: string;
    };
    parts?: ContentPart[];
};

type BookNavigationProps = {
    bookNumber: number;
    records: Array<{
        id: string;
        testNumber: number;
        module: string;
        content: any;
        audioUrl: string | null;
        youtubeId?: string | null;
    }>;
    initialModule?: string;
    initialTest?: number;
};

const MODULES = ['Listening', 'Reading', 'Writing', 'Speaking'];

const MODULE_META: Record<string, {
    icon: ReactNode;
    activeTab: string;
    labelBadge: string;
    tipBorder: string;
    tipBg: string;
    tipText: string;
    tipBullet: string;
    evalBg: string;
    evalText: string;
    evalBorder: string;
}> = {
    Listening: {
        icon: <Headphones size={15} />,
        activeTab: 'border-b-2 border-blue-600 bg-blue-50 text-blue-700',
        labelBadge: 'bg-blue-100 text-blue-800',
        tipBorder: 'border-blue-100',
        tipBg: 'bg-blue-50',
        tipText: 'text-blue-900',
        tipBullet: 'text-blue-400',
        evalBg: 'bg-blue-600',
        evalText: 'text-white',
        evalBorder: 'border-blue-600',
    },
    Reading: {
        icon: <BookOpen size={15} />,
        activeTab: 'border-b-2 border-emerald-600 bg-emerald-50 text-emerald-700',
        labelBadge: 'bg-emerald-100 text-emerald-800',
        tipBorder: 'border-emerald-100',
        tipBg: 'bg-emerald-50',
        tipText: 'text-emerald-900',
        tipBullet: 'text-emerald-400',
        evalBg: 'bg-emerald-600',
        evalText: 'text-white',
        evalBorder: 'border-emerald-600',
    },
    Writing: {
        icon: <PenLine size={15} />,
        activeTab: 'border-b-2 border-violet-600 bg-violet-50 text-violet-700',
        labelBadge: 'bg-violet-100 text-violet-800',
        tipBorder: 'border-violet-100',
        tipBg: 'bg-violet-50',
        tipText: 'text-violet-900',
        tipBullet: 'text-violet-400',
        evalBg: 'bg-violet-600',
        evalText: 'text-white',
        evalBorder: 'border-violet-600',
    },
    Speaking: {
        icon: <Mic size={15} />,
        activeTab: 'border-b-2 border-rose-600 bg-rose-50 text-rose-700',
        labelBadge: 'bg-rose-100 text-rose-800',
        tipBorder: 'border-rose-100',
        tipBg: 'bg-rose-50',
        tipText: 'text-rose-900',
        tipBullet: 'text-rose-400',
        evalBg: 'bg-rose-600',
        evalText: 'text-white',
        evalBorder: 'border-rose-600',
    },
};

function PassageRenderer({ text, module }: { text: string; module: string }) {
    const meta = MODULE_META[module] || MODULE_META.Reading;
    if (!text) {
        return <p className="italic text-slate-400">No passage content available yet.</p>;
    }

    const blocks = text.split(/\n\n+/).filter((b) => b.trim() && !/^\d+Drop heading here$/.test(b.trim()));

    return (
        <div className="space-y-4">
            {blocks.map((block, i) => {
                const labelMatch = block.match(/^([A-H])\s{1,}([\s\S]+)/);
                if (labelMatch) {
                    return (
                        <div key={i} className="flex gap-3">
                            <span className={`flex-shrink-0 mt-[3px] h-6 w-6 rounded text-[11px] font-black flex items-center justify-center ${meta.labelBadge}`}>
                                {labelMatch[1]}
                            </span>
                            <p className="text-[15px] leading-[1.9] text-slate-700">{labelMatch[2].trim()}</p>
                        </div>
                    );
                }
                if (i === 0) {
                    return <p key={i} className="text-lg font-bold text-slate-900">{block}</p>;
                }
                return <p key={i} className="text-[15px] leading-[1.9] text-slate-700">{block}</p>;
            })}
        </div>
    );
}

export default function BookNavigation({ bookNumber, records, initialModule, initialTest }: BookNavigationProps) {
    const [audioError, setAudioError] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const moduleOptions = useMemo(() => {
        const availableModules = Array.from(new Set(records.map((r) => r.module)));
        const ordered = MODULES.filter((m) => availableModules.includes(m));
        return ordered.length ? ordered : MODULES;
    }, [records]);

    const [selectedModule, setSelectedModule] = useState(
        initialModule && moduleOptions.includes(initialModule) ? initialModule :
        moduleOptions.includes('Reading') ? 'Reading' : moduleOptions[0]
    );

    const testOptions = useMemo(() => {
        const forModule = Array.from(
            new Set(
                records
                    .filter((r) => r.module === selectedModule)
                    .map((r) => r.testNumber)
            )
        ).sort((a, b) => a - b);

        if (forModule.length) return forModule;
        const allTests = Array.from(new Set(records.map((r) => r.testNumber))).sort((a, b) => a - b);
        return allTests.length ? allTests : [1];
    }, [records, selectedModule]);

    const [selectedTest, setSelectedTest] = useState(
        initialTest && testOptions.includes(initialTest) ? initialTest : testOptions[0] || 1
    );
    const [selectedPart, setSelectedPart] = useState(1);

    useEffect(() => {
        if (!moduleOptions.includes(selectedModule)) {
            setSelectedModule(moduleOptions[0]);
            setSelectedPart(1);
        }
    }, [moduleOptions, selectedModule]);

    useEffect(() => {
        if (!testOptions.includes(selectedTest)) {
            setSelectedTest(testOptions[0] || 1);
            setSelectedPart(1);
        }
    }, [testOptions, selectedTest]);

    const currentRecord = records.find(
        (r) => r.testNumber === selectedTest && r.module === selectedModule
    );
    const fallbackRecord = records.find((r) => r.module === selectedModule) || records[0];
    const content = ((currentRecord || fallbackRecord)?.content || {}) as ContentShape;
    const parts = Array.isArray(content.parts) ? content.parts : [];
    const activePart = parts.find((p) => p.partNumber === selectedPart) || parts[0];
    const youtubeId = selectedModule === 'Listening' ? (currentRecord?.youtubeId ?? null) : null;
    // Use proxy for local MP3s; skip if YouTube is available
    const listeningAudioUrl = selectedModule === 'Listening' && !youtubeId
        ? `/api/audio/stream?book=${bookNumber}&test=${selectedTest}&part=${selectedPart}`
        : null;

    // Reset audio error when audio URL changes
    useEffect(() => { setAudioError(false); }, [listeningAudioUrl]);

    const partOptions = useMemo(() => {
        const nums = parts
            .map((p) => p.partNumber)
            .filter((p): p is number => typeof p === 'number')
            .sort((a, b) => a - b);
        return nums.length ? nums : [1];
    }, [parts]);

    useEffect(() => {
        if (!parts.length) return;
        if (partOptions.length && !partOptions.includes(selectedPart)) {
            setSelectedPart(partOptions[0]);
        }
    }, [partOptions, parts, selectedPart]);

    const meta = MODULE_META[selectedModule] || MODULE_META.Reading;
    const isReal = content.sourceStatus === 'real_data' || content.sourceStatus === 'complete_real';

    return (
        <div className="mt-6">
            {/* Module Tabs */}
            <div className="flex flex-wrap gap-0 border-b border-slate-200">
                {moduleOptions.map((m) => {
                    const mm = MODULE_META[m] || MODULE_META.Reading;
                    return (
                        <button
                            key={m}
                            onClick={() => { setSelectedModule(m); setSelectedPart(1); }}
                            className={`inline-flex items-center gap-2 px-5 py-3.5 text-sm font-bold transition-all duration-200 ${
                                selectedModule === m ? mm.activeTab : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                            }`}
                        >
                            {mm.icon}
                            {m}
                        </button>
                    );
                })}
            </div>

            {/* Test & Part Row */}
            <div className="mt-5 flex flex-wrap items-center gap-5">
                {testOptions.length > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Test</span>
                        <div className="flex gap-1">
                            {testOptions.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setSelectedTest(t)}
                                    className={`h-8 min-w-[2.5rem] rounded-lg px-3 text-xs font-bold transition-all ${
                                        selectedTest === t
                                            ? 'bg-slate-900 text-white shadow'
                                            : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {partOptions.length > 1 && (
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Part</span>
                        <div className="flex gap-1">
                            {partOptions.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setSelectedPart(p)}
                                    className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                                        selectedPart === p
                                            ? 'bg-slate-900 text-white shadow'
                                            : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="ml-auto flex items-center gap-2">
                    {isReal && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700">
                            <CheckCircle2 size={11} />
                            Official Content
                        </span>
                    )}
                    {(selectedModule === 'Writing' || selectedModule === 'Speaking') && (
                        <Link
                            href={selectedModule === 'Writing' ? '/dashboard/writing' : '/dashboard/speaking'}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold ${meta.evalBg} ${meta.evalText}`}
                        >
                            {meta.icon}
                            Open {selectedModule} AI Evaluator
                        </Link>
                    )}
                </div>
            </div>

            {/* Main 2-col layout */}
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.55fr_1fr]">
                {/* Left: Passage */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    {/* Card header */}
                    <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                        <h2 className="text-lg font-black text-slate-900 leading-tight">
                            {content.title || `Book ${bookNumber} — Test ${selectedTest} — ${selectedModule}`}
                        </h2>
                        {content.introduction && (
                            <p className="mt-1.5 text-sm italic leading-relaxed text-slate-500 border-l-[3px] border-slate-300 pl-3">
                                {content.introduction}
                            </p>
                        )}
                    </div>

                    <div className="p-6">
                        {youtubeId && (
                            <div className="mb-6 rounded-xl overflow-hidden bg-black">
                                <div className="flex items-center justify-between gap-2 px-4 py-2 bg-slate-900">
                                    <div className="flex items-center gap-2">
                                        <Volume2 size={14} className="text-slate-400" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                            Listening Audio · All Parts
                                        </p>
                                    </div>
                                    <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">YouTube</span>
                                </div>
                                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                    <iframe
                                        className="absolute inset-0 w-full h-full"
                                        src={`https://www.youtube.com/embed/${youtubeId}`}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title="IELTS Listening Audio"
                                    />
                                </div>
                            </div>
                        )}
                        {listeningAudioUrl && (
                            <div className="mb-6 rounded-xl bg-slate-900 p-4">
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-2">
                                        <Volume2 size={14} className="text-slate-400" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                            Part {selectedPart} Audio
                                        </p>
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Cambridge Official</span>
                                </div>
                                {audioError ? (
                                    <div className="flex items-start gap-3 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3">
                                        <AlertCircle size={15} className="text-amber-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs font-bold text-amber-300">Audio unavailable</p>
                                            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                                                Place <span className="font-mono text-slate-300">cam{bookNumber >= 101 ? bookNumber - 100 : bookNumber}-test{selectedTest}-part{selectedPart}.mp3</span> in <span className="font-mono text-slate-300">public/audio/</span> to enable audio.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <audio
                                        ref={audioRef}
                                        key={listeningAudioUrl}
                                        controls
                                        preload="metadata"
                                        className="w-full h-10 accent-blue-500"
                                        onError={() => setAudioError(true)}
                                    >
                                        <source src={listeningAudioUrl} type="audio/mpeg" />
                                    </audio>
                                )}
                            </div>
                        )}

                        {activePart && (
                            <div>
                                <p className="mb-4 text-xs font-black uppercase tracking-[0.15em] text-slate-400">
                                    Part {selectedPart}
                                    {activePart.title ? ` · ${activePart.title}` : ''}
                                </p>

                                {activePart.imageUrl && (
                                    <div className="mb-5 rounded-lg border border-slate-200 p-2 text-center">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={activePart.imageUrl} alt="Part visual" className="mx-auto rounded" style={{ maxHeight: '380px' }} />
                                    </div>
                                )}
                                {!activePart.imageUrl && selectedModule === 'Listening' && (() => {
                                    const imgUrl = getMapImage(bookNumber, selectedTest, selectedPart);
                                    if (!imgUrl) return null;
                                    return (
                                        <div className="mb-5 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={imgUrl} alt="Map / Plan / Diagram" className="w-full h-auto" />
                                        </div>
                                    );
                                })()}
                                {selectedModule === 'Writing' && selectedPart === 1 && (() => {
                                    const imgUrl = getWritingImage(bookNumber, selectedTest);
                                    if (!imgUrl) return null;
                                    return (
                                        <div className="mb-5 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={imgUrl} alt="Task 1 — Chart / Graph / Diagram" className="w-full h-auto" />
                                        </div>
                                    );
                                })()}

                                <PassageRenderer text={activePart.text || ''} module={selectedModule} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Questions + Tips */}
                <div className="space-y-5">
                    {activePart && (
                        <AnswerPractice
                            title={`${selectedModule} Part ${selectedPart}`}
                            questions={activePart.questions || []}
                            type={selectedModule as any}
                            durationMinutes={content.examConfig?.durationMinutes}
                            meta={{ bookNumber, testNumber: selectedTest, partNumber: selectedPart }}
                            headingOptions={activePart.headingOptions}
                        />
                    )}

                    <div className={`rounded-xl border p-5 ${meta.tipBorder} ${meta.tipBg}`}>
                        <h4 className={`flex items-center gap-2 text-sm font-bold ${meta.tipText}`}>
                            <span>💡</span>
                            Tips &amp; Strategies
                        </h4>
                        <ul className="mt-3 space-y-2">
                            {(activePart?.tips || [
                                'প্রথমে প্রশ্নগুলো ভালো করে পড়ুন।',
                                'প্যাসেজে কী-ওয়ার্ড (Keywords) খুঁজে বের করুন।',
                                'একই শব্দের সিনোনিম (Synonyms) বা প্যারাফ্রেজিং খেয়াল করুন।',
                            ]).map((tip, i) => (
                                <li key={i} className={`flex gap-2 text-xs leading-relaxed ${meta.tipText}`}>
                                    <span className={`mt-0.5 ${meta.tipBullet}`}>▸</span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
