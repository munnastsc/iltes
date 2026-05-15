'use client';
import { useState, useMemo } from 'react';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy, Filter } from 'lucide-react';
import { QUIZ_QUESTIONS, type QuizQuestion, type TechniqueId } from '../lib/paraphraseData';

type Filter = { difficulty: 'all' | 'easy' | 'medium' | 'hard'; technique: TechniqueId | 'all'; type: QuizQuestion['type'] | 'all' };

function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}

export default function ParaphraseQuiz() {
    const [filters, setFilters] = useState<Filter>({ difficulty: 'all', technique: 'all', type: 'all' });
    const [questions, setQuestions] = useState<QuizQuestion[]>(() => shuffle(QUIZ_QUESTIONS));
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [answered, setAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);
    const [history, setHistory] = useState<Array<{ id: string; correct: boolean; technique: TechniqueId }>>([]);

    const filtered = useMemo(() => {
        let q = QUIZ_QUESTIONS;
        if (filters.difficulty !== 'all') q = q.filter((x) => x.difficulty === filters.difficulty);
        if (filters.technique !== 'all') q = q.filter((x) => x.technique === filters.technique);
        if (filters.type !== 'all') q = q.filter((x) => x.type === filters.type);
        return shuffle(q);
    }, [filters]);

    const activeQuestions = questions.filter((q) =>
        (filters.difficulty === 'all' || q.difficulty === filters.difficulty) &&
        (filters.technique === 'all' || q.technique === filters.technique) &&
        (filters.type === 'all' || q.type === filters.type),
    );

    function applyFilters() {
        setQuestions(shuffle(filtered));
        setCurrent(0);
        setSelected(null);
        setAnswered(false);
        setScore(0);
        setDone(false);
        setHistory([]);
    }

    function handleSelect(idx: number) {
        if (answered) return;
        setSelected(idx);
        setAnswered(true);
        const q = activeQuestions[current];
        const isCorrect = q.options[idx].isCorrect;
        if (isCorrect) setScore((s) => s + 1);
        setHistory((h) => [...h, { id: q.id, correct: isCorrect, technique: q.technique }]);
    }

    function next() {
        if (current + 1 >= activeQuestions.length) {
            setDone(true);
        } else {
            setCurrent((c) => c + 1);
            setSelected(null);
            setAnswered(false);
        }
    }

    function restart() {
        setQuestions(shuffle(filtered));
        setCurrent(0);
        setSelected(null);
        setAnswered(false);
        setScore(0);
        setDone(false);
        setHistory([]);
    }

    const q = activeQuestions[current];
    const pct = activeQuestions.length > 0 ? Math.round((score / activeQuestions.length) * 100) : 0;

    // ── Technique weakness analysis
    const weakTechniques = useMemo(() => {
        const counts: Record<string, { correct: number; total: number }> = {};
        for (const h of history) {
            if (!counts[h.technique]) counts[h.technique] = { correct: 0, total: 0 };
            counts[h.technique].total += 1;
            if (h.correct) counts[h.technique].correct += 1;
        }
        return Object.entries(counts).filter(([, v]) => v.total > 0).sort((a, b) => {
            const pA = a[1].correct / a[1].total;
            const pB = b[1].correct / b[1].total;
            return pA - pB;
        });
    }, [history]);

    // ── Type label helper
    function typeLabel(type: QuizQuestion['type']) {
        if (type === 'find_paraphrase') return 'Paraphrase খোঁজো';
        if (type === 'find_source') return 'Source খোঁজো';
        return 'Technique চেনো';
    }

    function diffColor(d: QuizQuestion['difficulty']) {
        return d === 'easy' ? 'bg-emerald-100 text-emerald-700' : d === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700';
    }

    // ── Done screen
    if (done) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
                    <Trophy size={32} className="text-amber-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Quiz শেষ!</h3>
                <p className="mt-1 text-slate-500 text-sm">তুমি পেয়েছো</p>
                <p className={`mt-2 text-5xl font-black ${pct >= 70 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-500' : 'text-rose-600'}`}>
                    {score}/{activeQuestions.length}
                </p>
                <p className="text-sm text-slate-400 mt-1">{pct}% correct</p>

                {weakTechniques.length > 0 && (
                    <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4 text-left">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Technique Breakdown</p>
                        <div className="space-y-2">
                            {weakTechniques.map(([tech, { correct, total }]) => {
                                const p = Math.round((correct / total) * 100);
                                return (
                                    <div key={tech} className="flex items-center gap-3">
                                        <span className="w-40 text-xs text-slate-600 truncate">{tech}</span>
                                        <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                                            <div className={`h-full rounded-full ${p >= 70 ? 'bg-emerald-400' : p >= 50 ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ width: `${p}%` }} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 w-12 text-right">{correct}/{total}</span>
                                    </div>
                                );
                            })}
                        </div>
                        {weakTechniques[0] && weakTechniques[0][1].correct / weakTechniques[0][1].total < 0.6 && (
                            <p className="mt-3 text-xs text-rose-600 font-medium">
                                ⚠ "{weakTechniques[0][0]}" technique তে তুমি সবচেয়ে বেশি ভুল করেছো। Guide থেকে এটা আরো practice করো।
                            </p>
                        )}
                    </div>
                )}

                <button
                    onClick={restart}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-500 transition"
                >
                    <RotateCcw size={15} /> আবার চেষ্টা করো
                </button>
            </div>
        );
    }

    // ── No questions
    if (activeQuestions.length === 0) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                <p className="text-slate-500 text-sm">এই filter এ কোনো question পাওয়া যায়নি। Filter পরিবর্তন করো।</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Filter bar */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500"><Filter size={12} /> Filter:</span>
                    <select
                        value={filters.difficulty}
                        onChange={(e) => setFilters((f) => ({ ...f, difficulty: e.target.value as Filter['difficulty'] }))}
                        className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-medium text-slate-700 outline-none"
                    >
                        <option value="all">সব Difficulty</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                    <select
                        value={filters.type}
                        onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value as Filter['type'] }))}
                        className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-medium text-slate-700 outline-none"
                    >
                        <option value="all">সব Types</option>
                        <option value="find_paraphrase">Paraphrase খোঁজো</option>
                        <option value="find_source">Source খোঁজো</option>
                        <option value="identify_technique">Technique চেনো</option>
                    </select>
                    <button
                        onClick={applyFilters}
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500"
                    >
                        Apply
                    </button>
                    <span className="ml-auto text-xs text-slate-400">{activeQuestions.length} questions</span>
                </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${((current) / activeQuestions.length) * 100}%` }} />
                </div>
                <span className="text-xs font-bold text-slate-500">{current + 1}/{activeQuestions.length}</span>
                <span className="text-xs font-bold text-emerald-600">{score} ✓</span>
            </div>

            {/* Question card */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
                {/* Meta badges */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${diffColor(q.difficulty)}`}>
                        {q.difficulty}
                    </span>
                    <span className="rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                        {typeLabel(q.type)}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-500">
                        {q.context}
                    </span>
                </div>

                {/* Instruction */}
                <p className="text-xs font-semibold text-slate-500 mb-3">{q.instruction}</p>

                {/* Display text(s) */}
                <div className={`rounded-xl p-4 mb-2 ${q.type === 'identify_technique' ? 'space-y-3' : ''} ${q.context === 'listening' ? 'bg-blue-50 border border-blue-100' : 'bg-slate-50 border border-slate-200'}`}>
                    <p className="text-sm font-medium text-slate-800 leading-relaxed">{q.display}</p>
                    {q.display2 && (
                        <p className="text-sm font-medium text-violet-800 leading-relaxed border-t border-slate-200 pt-3">{q.display2}</p>
                    )}
                </div>

                {/* Options */}
                <div className="mt-4 space-y-2.5">
                    {q.options.map((opt, idx) => {
                        let style = 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50 cursor-pointer';
                        if (answered) {
                            if (opt.isCorrect) style = 'border-emerald-400 bg-emerald-50 cursor-default';
                            else if (idx === selected && !opt.isCorrect) style = 'border-rose-400 bg-rose-50 cursor-default';
                            else style = 'border-slate-200 bg-slate-50 opacity-60 cursor-default';
                        } else if (selected === idx) {
                            style = 'border-blue-400 bg-blue-50 cursor-pointer';
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleSelect(idx)}
                                className={`w-full rounded-xl border p-3.5 text-left text-sm transition ${style}`}
                            >
                                <div className="flex items-start gap-3">
                                    <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                        answered && opt.isCorrect ? 'bg-emerald-500 text-white' :
                                        answered && idx === selected && !opt.isCorrect ? 'bg-rose-500 text-white' :
                                        'bg-slate-100 text-slate-600'
                                    }`}>
                                        {answered && opt.isCorrect ? <CheckCircle2 size={13} /> :
                                         answered && idx === selected && !opt.isCorrect ? <XCircle size={13} /> :
                                         String.fromCharCode(65 + idx)}
                                    </span>
                                    <span className="flex-1 leading-relaxed text-slate-700">{opt.text}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Explanation */}
                {answered && (
                    <div className={`mt-4 rounded-xl border p-4 ${q.options[selected ?? 0]?.isCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
                        <p className={`text-xs font-black uppercase tracking-wider mb-2 ${q.options[selected ?? 0]?.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {q.options[selected ?? 0]?.isCorrect ? '✓ সঠিক!' : '✗ ভুল হয়েছে'}
                        </p>
                        <p className="text-sm text-slate-700 leading-relaxed">{q.explanation}</p>
                        <p className="mt-2 text-[11px] font-bold text-slate-500">
                            Technique: <span className="text-slate-700">{q.technique.replace(/_/g, ' ')}</span>
                        </p>
                    </div>
                )}
            </div>

            {answered && (
                <button
                    onClick={next}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-700 transition"
                >
                    {current + 1 >= activeQuestions.length ? 'ফলাফল দেখো' : 'পরের প্রশ্ন'} <ChevronRight size={16} />
                </button>
            )}
        </div>
    );
}
