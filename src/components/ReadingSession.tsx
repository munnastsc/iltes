'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    ChevronLeft, Clock, Trophy, CheckCircle, XCircle,
    BookOpen, ClipboardList, ExternalLink,
} from 'lucide-react';

interface ReadingAnswer {
    correct_answer: string;
    explanation: string;
}

interface ReadingTestData {
    book: number;
    test: number;
    pdfPath?: string;
    passages?: string[];
    passage_text?: string;
    question_text?: string;
    answers: ReadingAnswer[];
    totalQuestions?: number;
}

interface Props {
    data: ReadingTestData;
}

const BAND_TABLE: [number, string][] = [
    [39, '9.0'], [37, '8.5'], [35, '8.0'], [33, '7.5'],
    [30, '7.0'], [27, '6.5'], [23, '6.0'], [19, '5.5'],
    [15, '5.0'], [13, '4.5'], [10, '4.0'], [0, '3.5'],
];

function getBand(score: number): string {
    for (const [min, band] of BAND_TABLE) {
        if (score >= min) return band;
    }
    return '3.5';
}

function checkAnswer(user: string, correct: string): boolean {
    const u = user.trim().toLowerCase();
    if (!u) return false;
    return correct.split(',').some(opt =>
        opt.trim().split('/').some(v => v.trim().toLowerCase() === u)
    );
}

export default function ReadingSession({ data }: Props) {
    const totalQ = data.totalQuestions ?? 40;
    const [userAnswers, setUserAnswers] = useState<string[]>(Array(totalQ).fill(''));
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState<boolean[]>([]);
    const [timeLeft, setTimeLeft] = useState(60 * 60);
    const [showExplanations, setShowExplanations] = useState(false);
    const [mobileTab, setMobileTab] = useState<'pdf' | 'answers'>('pdf');
    const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

    useEffect(() => {
        if (submitted) return;
        timerRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(timerRef.current);
                    doSubmit();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitted]);

    function doSubmit() {
        const r = data.answers.map((ans, i) => checkAnswer(userAnswers[i] ?? '', ans.correct_answer));
        setResults(r);
        setSubmitted(true);
        clearInterval(timerRef.current);
    }

    const score = results.filter(Boolean).length;
    const band = getBand(score);
    const answered = userAnswers.filter(a => a.trim()).length;

    const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const secs = (timeLeft % 60).toString().padStart(2, '0');
    const danger = timeLeft < 300;

    const pdfSrc = data.pdfPath ?? null;
    const passages = data.passages ?? [];

    return (
        <div className="min-h-screen bg-[#f5f6fa] flex flex-col">
            {/* Sticky header */}
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between gap-3">
                    <Link href="/dashboard/reading" className="flex items-center gap-1 text-slate-500 hover:text-slate-900 text-sm transition flex-shrink-0">
                        <ChevronLeft size={16} /> Reading
                    </Link>
                    <p className="text-sm font-black text-slate-900 hidden sm:block truncate">
                        Cambridge IELTS {data.book} · Test {data.test} · Reading
                    </p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <div className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold ${
                            danger ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                            <Clock size={13} /> {mins}:{secs}
                        </div>
                        {!submitted && (
                            <button
                                onClick={doSubmit}
                                className="rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-bold text-white hover:bg-emerald-500 transition"
                            >
                                Submit
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Score banner */}
            {submitted && (
                <div className={`border-b px-4 py-4 ${score >= 30 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                    <div className="mx-auto max-w-7xl flex flex-wrap items-center gap-5">
                        <div className="flex items-center gap-3">
                            <Trophy size={26} className={score >= 30 ? 'text-emerald-600' : 'text-amber-600'} />
                            <div>
                                <p className="text-2xl font-black text-slate-900">{score} / {totalQ}</p>
                                <p className="text-xs text-slate-500">Estimated Band <strong>{band}</strong></p>
                            </div>
                        </div>
                        <div className="flex gap-4 text-sm">
                            <span className="flex items-center gap-1.5 text-emerald-700 font-bold"><CheckCircle size={15} /> {score} Correct</span>
                            <span className="flex items-center gap-1.5 text-red-600 font-bold"><XCircle size={15} /> {totalQ - score} Wrong</span>
                        </div>
                        <button
                            onClick={() => setShowExplanations(e => !e)}
                            className="ml-auto rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
                        >
                            {showExplanations ? 'Hide' : 'Show'} Explanations
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile tabs */}
            <div className="lg:hidden flex border-b border-slate-200 bg-white">
                {([
                    { id: 'pdf', label: 'Passages', icon: <BookOpen size={13} /> },
                    { id: 'answers', label: 'Answers', icon: <ClipboardList size={13} /> },
                ] as const).map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setMobileTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold transition border-b-2 ${
                            mobileTab === tab.id
                                ? 'border-emerald-600 text-emerald-700'
                                : 'border-transparent text-slate-500'
                        }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Body */}
            <div className="mx-auto max-w-7xl w-full px-4 py-5 flex-1 flex flex-col" style={{ minHeight: 0 }}>
                {/* Desktop layout */}
                <div className="hidden lg:grid lg:grid-cols-[1fr_400px] gap-5" style={{ height: 'calc(100vh - 112px)' }}>
                    {/* PDF Viewer */}
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between border-b border-slate-100 bg-emerald-50 px-5 py-3 flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <BookOpen size={15} className="text-emerald-700" />
                                <p className="font-black text-slate-900 text-sm">Reading Passages</p>
                            </div>
                            {pdfSrc && (
                                <a
                                    href={pdfSrc}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 transition"
                                >
                                    <ExternalLink size={11} /> Open PDF
                                </a>
                            )}
                        </div>
                        {passages.length > 0 && (
                            <div className="flex gap-2 px-5 py-2 flex-shrink-0 border-b border-slate-100 overflow-x-auto">
                                {passages.map((p, i) => (
                                    <span key={i} className="flex-shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">
                                        P{i + 1}: {p}
                                    </span>
                                ))}
                            </div>
                        )}
                        <div className="flex-1 overflow-hidden">
                            {pdfSrc ? (
                                <object
                                    data={pdfSrc}
                                    type="application/pdf"
                                    className="w-full h-full"
                                >
                                    <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
                                        <BookOpen size={40} className="text-slate-300" />
                                        <p className="text-slate-500 text-sm">PDF viewer not supported in this browser.</p>
                                        <a
                                            href={pdfSrc}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 transition"
                                        >
                                            <ExternalLink size={14} /> Open PDF
                                        </a>
                                    </div>
                                </object>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full gap-3 p-8 text-center">
                                    <BookOpen size={40} className="text-slate-300" />
                                    <p className="text-slate-400 text-sm">PDF not available for this test.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: answer sheet */}
                    <div className="flex flex-col gap-4 overflow-hidden">
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col flex-1">
                            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3 flex-shrink-0">
                                <div className="flex items-center gap-2">
                                    <ClipboardList size={15} className="text-slate-500" />
                                    <p className="font-black text-slate-900 text-sm">Answer Sheet</p>
                                </div>
                                <p className="text-[11px] text-slate-500">{answered}/{totalQ} filled</p>
                            </div>
                            <div className="p-3 overflow-y-auto flex-1">
                                <AnswerList
                                    userAnswers={userAnswers}
                                    submitted={submitted}
                                    results={results}
                                    answers={data.answers}
                                    showExplanations={showExplanations}
                                    totalQuestions={totalQ}
                                    onChange={(i, v) => {
                                        if (submitted) return;
                                        const next = [...userAnswers];
                                        next[i] = v;
                                        setUserAnswers(next);
                                    }}
                                />
                            </div>
                        </div>

                        {!submitted && (
                            <button
                                onClick={doSubmit}
                                className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-black text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-200 flex-shrink-0"
                            >
                                Submit Answers
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile layout */}
                <div className="lg:hidden flex-1">
                    {mobileTab === 'pdf' && (
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            {passages.length > 0 && (
                                <div className="px-4 py-3 border-b border-slate-100 space-y-1">
                                    <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">Passages in this test</p>
                                    {passages.map((p, i) => (
                                        <p key={i} className="text-xs font-bold text-slate-700">P{i + 1}: {p}</p>
                                    ))}
                                </div>
                            )}
                            <div className="p-5 flex flex-col items-center gap-4">
                                {pdfSrc ? (
                                    <>
                                        <BookOpen size={36} className="text-emerald-400" />
                                        <p className="text-sm text-slate-600 text-center">Open the PDF to read the passages, then switch to Answers tab.</p>
                                        <a
                                            href={pdfSrc}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-500 transition w-full justify-center"
                                        >
                                            <ExternalLink size={15} /> Open Cambridge PDF
                                        </a>
                                    </>
                                ) : (
                                    <>
                                        <BookOpen size={36} className="text-slate-300" />
                                        <p className="text-sm text-slate-400 text-center">PDF not available for this test.</p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                    {mobileTab === 'answers' && (
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3">
                                <p className="font-black text-slate-900 text-sm">Answer Sheet</p>
                                <p className="text-[11px] text-slate-500">{answered}/{totalQ}</p>
                            </div>
                            <div className="p-3">
                                <AnswerList
                                    userAnswers={userAnswers}
                                    submitted={submitted}
                                    results={results}
                                    answers={data.answers}
                                    showExplanations={showExplanations}
                                    totalQuestions={totalQ}
                                    onChange={(i, v) => {
                                        if (submitted) return;
                                        const next = [...userAnswers];
                                        next[i] = v;
                                        setUserAnswers(next);
                                    }}
                                />
                            </div>
                            {!submitted && (
                                <div className="p-3 pt-0">
                                    <button
                                        onClick={doSubmit}
                                        className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-black text-white hover:bg-emerald-500 transition"
                                    >
                                        Submit Answers
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function AnswerList({
    userAnswers, submitted, results, answers, showExplanations, onChange, totalQuestions,
}: {
    userAnswers: string[];
    submitted: boolean;
    results: boolean[];
    answers: ReadingAnswer[];
    showExplanations: boolean;
    onChange: (i: number, v: string) => void;
    totalQuestions: number;
}) {
    return (
        <div className="space-y-1.5">
            {Array.from({ length: totalQuestions }, (_, i) => {
                const correct = submitted ? results[i] : null;
                const ans = answers[i];
                return (
                    <div key={i}>
                        <div className={`flex items-center gap-2 rounded-lg px-3 py-2 border transition ${
                            correct === null
                                ? 'border-slate-200 bg-slate-50'
                                : correct
                                    ? 'border-emerald-300 bg-emerald-50'
                                    : 'border-red-300 bg-red-50'
                        }`}>
                            <span className="text-[11px] font-black text-slate-400 w-6 flex-shrink-0 text-center">{i + 1}</span>
                            <input
                                type="text"
                                value={userAnswers[i]}
                                onChange={e => onChange(i, e.target.value)}
                                placeholder={submitted ? '—' : 'answer'}
                                className="flex-1 text-xs bg-transparent outline-none text-slate-900 placeholder-slate-300 min-w-0"
                                readOnly={submitted}
                            />
                            {correct === false && ans?.correct_answer && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 rounded px-1.5 py-0.5 flex-shrink-0 max-w-[100px] truncate" title={ans.correct_answer}>
                                    {ans.correct_answer.split(',')[0].trim()}
                                </span>
                            )}
                            {correct === true && <CheckCircle size={13} className="text-emerald-600 flex-shrink-0" />}
                        </div>
                        {showExplanations && submitted && correct === false && ans?.explanation && (
                            <p className="text-[11px] text-slate-500 mt-0.5 ml-8 italic leading-relaxed">
                                {ans.explanation}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
