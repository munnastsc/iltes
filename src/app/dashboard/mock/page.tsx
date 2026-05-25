'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, Clock, CheckCircle2, XCircle, BookOpen, PenLine, Headphones, RotateCcw } from 'lucide-react';
import { getMockTestOneModule } from '../../../lib/mockFullTestData';
import { getMockTestModule } from '../../../lib/mockTests23Data';

type QType = 'fill_in_blank' | 'mcq' | 'true_false' | 'matching' | 'double_mcq';

interface Question {
    number: number;
    type: QType;
    prompt: string;
    options?: string[];
    answer: string;
    answerLine: string;
}

interface Part {
    partNumber: number;
    title: string;
    text?: string;
    tips?: string[];
    questions: Question[];
}

interface ModuleData {
    title: string;
    introduction: string;
    parts: Part[];
}

const TEST_TIMES: Record<string, number> = {
    Reading: 60,
    Writing: 60,
    Listening: 30,
};

const MODULES = [
    { id: 'Reading', label: 'Reading', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { id: 'Writing', label: 'Writing', icon: PenLine, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
    { id: 'Listening', label: 'Listening', icon: Headphones, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
];

function getModule(testNum: number, module: string): ModuleData | null {
    try {
        if (testNum === 1) return getMockTestOneModule(module as any) as unknown as ModuleData;
        return getMockTestModule(testNum, module as any) as unknown as ModuleData;
    } catch {
        return null;
    }
}

function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function MockTestPage() {
    const [testNum, setTestNum] = useState(1);
    const [module, setModule] = useState<string | null>(null);
    const [started, setStarted] = useState(false);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const moduleData = module ? getModule(testNum, module) : null;

    useEffect(() => {
        if (started && timeLeft > 0 && !submitted) {
            timerRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [started, submitted]);

    useEffect(() => {
        if (timeLeft === 0 && started && !submitted) handleSubmit();
    }, [timeLeft]);

    const handleStart = () => {
        setAnswers({});
        setSubmitted(false);
        setTimeLeft((TEST_TIMES[module!] || 60) * 60);
        setStarted(true);
    };

    const handleSubmit = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setSubmitted(true);
    };

    const handleReset = () => {
        setStarted(false);
        setSubmitted(false);
        setAnswers({});
        setModule(null);
    };

    const calcScore = () => {
        if (!moduleData) return { correct: 0, total: 0 };
        let correct = 0;
        let total = 0;
        for (const part of moduleData.parts) {
            for (const q of part.questions) {
                if (q.type === 'double_mcq') {
                    total++;
                    const userSet = new Set((answers[q.number] || '').split(',').map(s => s.trim()));
                    const ansSet = new Set(q.answer.split(',').map(s => s.trim()));
                    if (userSet.size === ansSet.size && [...userSet].every(v => ansSet.has(v))) correct++;
                } else {
                    total++;
                    if ((answers[q.number] || '').trim().toLowerCase() === q.answer.trim().toLowerCase()) correct++;
                }
            }
        }
        return { correct, total };
    };

    // Module select + test select screen
    if (!started) {
        return (
            <div className="min-h-screen bg-[#f5f6fa]">
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-violet-900 px-5 py-10">
                    <div className="mx-auto max-w-4xl">
                        <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition">
                            <ChevronLeft size={15} /> Dashboard
                        </Link>
                        <p className="text-xs font-bold uppercase tracking-widest text-violet-300">IELTS</p>
                        <h1 className="mt-2 text-3xl font-black text-white">Full Mock Tests</h1>
                        <p className="mt-2 text-sm text-slate-400">Cambridge-style simulation। Exam timing follow করো।</p>
                    </div>
                </div>

                <div className="mx-auto max-w-4xl px-5 py-8">
                    {/* Test selector */}
                    <div className="mb-6">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Mock Test বেছে নাও</p>
                        <div className="flex gap-3">
                            {[1, 2, 3].map((n) => (
                                <button
                                    key={n}
                                    onClick={() => setTestNum(n)}
                                    className={`rounded-xl px-5 py-2.5 text-sm font-bold border transition ${
                                        testNum === n
                                            ? 'bg-slate-900 text-white border-slate-900'
                                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                                    }`}
                                >
                                    Test {n}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Module selector */}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Module বেছে নাও</p>
                        <div className="grid gap-4 sm:grid-cols-3">
                            {MODULES.map((m) => {
                                const Icon = m.icon;
                                const isListening = m.id === 'Listening';
                                return (
                                    <button
                                        key={m.id}
                                        onClick={() => !isListening && setModule(m.id)}
                                        disabled={isListening}
                                        className={`rounded-2xl border-2 p-5 text-left transition ${
                                            module === m.id
                                                ? `${m.border} ${m.bg} ring-2 ring-offset-1 ${m.border}`
                                                : isListening
                                                ? 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
                                                : 'border-slate-200 bg-white hover:border-slate-300'
                                        }`}
                                    >
                                        <Icon size={22} className={isListening ? 'text-slate-400' : m.color} />
                                        <p className="mt-3 font-bold text-slate-900">{m.label}</p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {isListening ? 'Coming soon' : `${TEST_TIMES[m.id]} মিনিট · ৪০ প্রশ্ন`}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {module && moduleData && (
                        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
                            <h3 className="font-bold text-slate-900 text-lg">{moduleData.title}</h3>
                            <p className="mt-2 text-sm text-slate-600">{moduleData.introduction}</p>
                            <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1.5"><Clock size={14} /> {TEST_TIMES[module]} মিনিট</span>
                                <span>{moduleData.parts.reduce((a, p) => a + p.questions.length, 0)} প্রশ্ন</span>
                                <span>{moduleData.parts.length} Passage/Section</span>
                            </div>
                            <button
                                onClick={handleStart}
                                className="mt-5 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-700 transition"
                            >
                                Test শুরু করো →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (!moduleData) return null;

    const allQuestions = moduleData.parts.flatMap((p) => p.questions);
    const answered = Object.keys(answers).length;
    const score = submitted ? calcScore() : null;

    return (
        <div className="min-h-screen bg-[#f5f6fa]">
            {/* Sticky header */}
            <div className="sticky top-0 z-40 bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={handleReset} className="text-slate-500 hover:text-slate-900 transition">
                        <ChevronLeft size={18} />
                    </button>
                    <span className="text-sm font-bold text-slate-900">{moduleData.title}</span>
                </div>
                <div className="flex items-center gap-4">
                    {!submitted && (
                        <>
                            <span className="text-xs text-slate-500">{answered}/{allQuestions.length} answered</span>
                            <span className={`flex items-center gap-1.5 text-sm font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-slate-700'}`}>
                                <Clock size={14} /> {formatTime(timeLeft)}
                            </span>
                            <button
                                onClick={handleSubmit}
                                className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-700"
                            >
                                Submit
                            </button>
                        </>
                    )}
                    {submitted && score && (
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-slate-900">
                                Score: {score.correct}/{score.total} ({Math.round((score.correct / score.total) * 9)} Band est.)
                            </span>
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                            >
                                <RotateCcw size={12} /> Retake
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Score banner */}
            {submitted && score && (
                <div className={`px-5 py-4 text-center font-bold text-white ${
                    score.correct / score.total >= 0.7 ? 'bg-emerald-600' : score.correct / score.total >= 0.5 ? 'bg-amber-500' : 'bg-red-500'
                }`}>
                    {score.correct}/{score.total} সঠিক · Estimated Band: {(score.correct / score.total * 9).toFixed(1)}
                </div>
            )}

            <div className="mx-auto max-w-4xl px-5 py-6 space-y-8">
                {moduleData.parts.map((part) => (
                    <div key={part.partNumber} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Section {part.partNumber}</p>
                            <h2 className="mt-1 font-bold text-slate-900">{part.title}</h2>
                        </div>

                        {/* Passage text */}
                        {part.text && (
                            <div className="px-6 py-5 border-b border-slate-100">
                                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{part.text}</p>
                                {part.tips && (
                                    <div className="mt-4 rounded-lg bg-amber-50 border border-amber-100 p-3">
                                        <p className="text-xs font-bold text-amber-700 mb-1">Tips</p>
                                        <ul className="space-y-0.5">
                                            {part.tips.map((t, i) => (
                                                <li key={i} className="text-xs text-amber-700">• {t}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Questions */}
                        <div className="px-6 py-5 space-y-5">
                            {part.questions.map((q) => (
                                <QuestionBlock
                                    key={q.number}
                                    q={q}
                                    answer={answers[q.number] || ''}
                                    submitted={submitted}
                                    onChange={(val) => setAnswers((prev) => ({ ...prev, [q.number]: val }))}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {!submitted && (
                <div className="sticky bottom-0 bg-white border-t border-slate-200 px-5 py-4 flex justify-between items-center">
                    <span className="text-sm text-slate-500">{answered}/{allQuestions.length} answered</span>
                    <button
                        onClick={handleSubmit}
                        className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-slate-700"
                    >
                        Submit Test
                    </button>
                </div>
            )}
        </div>
    );
}

function QuestionBlock({ q, answer, submitted, onChange }: {
    q: Question;
    answer: string;
    submitted: boolean;
    onChange: (val: string) => void;
}) {
    const isCorrect = submitted && (
        q.type === 'double_mcq'
            ? (() => {
                const userSet = new Set(answer.split(',').map(s => s.trim()));
                const ansSet = new Set(q.answer.split(',').map(s => s.trim()));
                return userSet.size === ansSet.size && [...userSet].every(v => ansSet.has(v));
            })()
            : answer.trim().toLowerCase() === q.answer.trim().toLowerCase()
    );

    return (
        <div className={`rounded-xl border p-4 transition ${
            submitted
                ? isCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'
                : 'border-slate-100 bg-slate-50'
        }`}>
            <div className="flex items-start gap-3">
                <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                    submitted
                        ? isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                }`}>{q.number}</span>
                <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800 mb-3">{q.prompt}</p>

                    {(q.type === 'mcq' || q.type === 'double_mcq') && q.options && (
                        <div className="space-y-2">
                            {q.options.map((opt, i) => {
                                const letter = String.fromCharCode(65 + i);
                                const isSelected = q.type === 'double_mcq'
                                    ? answer.split(',').map(s => s.trim()).includes(letter)
                                    : answer === letter;
                                const isAnswer = q.answer.split(',').map(s => s.trim()).includes(letter);
                                return (
                                    <label
                                        key={i}
                                        className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm cursor-pointer transition ${
                                            submitted
                                                ? isAnswer ? 'border-emerald-400 bg-emerald-100 font-medium' : isSelected ? 'border-red-300 bg-red-100' : 'border-slate-200 bg-white opacity-60'
                                                : isSelected ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'
                                        }`}
                                    >
                                        <input
                                            type={q.type === 'double_mcq' ? 'checkbox' : 'radio'}
                                            name={`q_${q.number}`}
                                            disabled={submitted}
                                            checked={isSelected}
                                            onChange={() => {
                                                if (q.type === 'double_mcq') {
                                                    const current = answer ? answer.split(',').map(s => s.trim()) : [];
                                                    const updated = current.includes(letter)
                                                        ? current.filter(x => x !== letter)
                                                        : [...current, letter];
                                                    onChange(updated.join(','));
                                                } else {
                                                    onChange(letter);
                                                }
                                            }}
                                            className="accent-blue-600"
                                        />
                                        <span>{letter}. {opt}</span>
                                        {submitted && isAnswer && <CheckCircle2 size={14} className="text-emerald-600 ml-auto shrink-0" />}
                                    </label>
                                );
                            })}
                        </div>
                    )}

                    {q.type === 'true_false' && (
                        <div className="flex gap-2 flex-wrap">
                            {['TRUE', 'FALSE', 'NOT GIVEN'].map((opt) => {
                                const isSelected = answer === opt;
                                const isAnswer = q.answer === opt;
                                return (
                                    <button
                                        key={opt}
                                        disabled={submitted}
                                        onClick={() => onChange(opt)}
                                        className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
                                            submitted
                                                ? isAnswer ? 'border-emerald-400 bg-emerald-100 text-emerald-700' : isSelected ? 'border-red-300 bg-red-100 text-red-700' : 'border-slate-200 text-slate-400'
                                                : isSelected ? 'border-blue-400 bg-blue-100 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {(q.type === 'fill_in_blank' || q.type === 'matching') && (
                        <input
                            type="text"
                            value={answer}
                            disabled={submitted}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={q.type === 'matching' ? 'e.g. A, B, ii, iii...' : 'Answer here...'}
                            className={`rounded-lg border px-3 py-2 text-sm w-full max-w-xs outline-none transition ${
                                submitted
                                    ? isCorrect ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : 'border-red-300 bg-red-50 text-red-700'
                                    : 'border-slate-300 focus:border-blue-500'
                            }`}
                        />
                    )}

                    {submitted && (
                        <div className="mt-3 flex items-start gap-2">
                            {isCorrect
                                ? <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                                : <XCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
                            }
                            <div>
                                {!isCorrect && (
                                    <p className="text-xs font-bold text-red-700">সঠিক উত্তর: {q.answer}</p>
                                )}
                                <p className="text-xs text-slate-600 italic mt-0.5">"{q.answerLine}"</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
