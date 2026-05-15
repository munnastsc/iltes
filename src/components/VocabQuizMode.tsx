'use client';
import { useState, useMemo, useCallback } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { VOCABULARY, TOPICS, POS_SHORT, type Topic, type PartOfSpeech, type BandLevel, type VocabWord } from '../lib/vocabularyData';

type QuizType = 'word_to_bangla' | 'bangla_to_word';
type QState = 'idle' | 'answered';

interface Question {
    word: VocabWord;
    type: QuizType;
    options: string[];
    correct: string;
}

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const MAX_QUESTIONS = 20;

function buildQuestions(deck: VocabWord[]): Question[] {
    if (deck.length < 4) return [];
    const selected = shuffle(deck).slice(0, MAX_QUESTIONS);
    return selected.map((word) => {
        const type: QuizType = Math.random() > 0.5 ? 'word_to_bangla' : 'bangla_to_word';
        const wrong = shuffle(deck.filter((w) => w.id !== word.id)).slice(0, 3);
        if (type === 'word_to_bangla') {
            const opts = shuffle([word.bangla, ...wrong.map((w) => w.bangla)]);
            return { word, type, options: opts, correct: word.bangla };
        } else {
            const opts = shuffle([word.word, ...wrong.map((w) => w.word)]);
            return { word, type, options: opts, correct: word.word };
        }
    });
}

export default function VocabQuizMode() {
    const [topicFilter, setTopicFilter] = useState<Topic | 'all'>('all');
    const [posFilter, setPosFilter] = useState<PartOfSpeech | 'all'>('all');
    const [bandFilter, setBandFilter] = useState<BandLevel | 'all'>('all');

    const deck = useMemo(
        () =>
            VOCABULARY.filter(
                (w) =>
                    (topicFilter === 'all' || w.topic === topicFilter) &&
                    (posFilter === 'all' || w.pos === posFilter) &&
                    (bandFilter === 'all' || w.band === bandFilter),
            ),
        [topicFilter, posFilter, bandFilter],
    );

    const [questions, setQuestions] = useState<Question[]>(() => buildQuestions(VOCABULARY));
    const [qIdx, setQIdx] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [qState, setQState] = useState<QState>('idle');
    const [score, setScore] = useState(0);
    const [history, setHistory] = useState<{ correct: boolean; topic: Topic }[]>([]);
    const [quizDone, setQuizDone] = useState(false);

    const startQuiz = useCallback(() => {
        const qs = buildQuestions(deck);
        setQuestions(qs);
        setQIdx(0);
        setSelected(null);
        setQState('idle');
        setScore(0);
        setHistory([]);
        setQuizDone(false);
    }, [deck]);

    const q = questions[qIdx];

    function handleSelect(opt: string) {
        if (qState !== 'idle' || !q) return;
        const isCorrect = opt === q.correct;
        setSelected(opt);
        setQState('answered');
        if (isCorrect) setScore((s) => s + 1);
        setHistory((h) => [...h, { correct: isCorrect, topic: q.word.topic }]);
    }

    function handleNext() {
        if (qIdx + 1 >= questions.length) {
            setQuizDone(true);
        } else {
            setQIdx((i) => i + 1);
            setSelected(null);
            setQState('idle');
        }
    }

    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

    function optionClass(opt: string) {
        if (qState === 'idle') return 'border-slate-200 bg-white hover:border-teal-400 hover:bg-teal-50 text-slate-800';
        if (opt === q.correct) return 'border-emerald-400 bg-emerald-50 text-emerald-800 font-bold';
        if (opt === selected && opt !== q.correct) return 'border-rose-400 bg-rose-50 text-rose-800';
        return 'border-slate-100 bg-slate-50 text-slate-400';
    }

    function optionIcon(opt: string) {
        if (qState === 'idle') return null;
        if (opt === q.correct) return <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />;
        if (opt === selected) return <XCircle size={16} className="text-rose-500 flex-shrink-0" />;
        return null;
    }

    return (
        <div className="space-y-5">
            {/* Filters */}
            <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Topic</p>
                    <div className="flex flex-wrap gap-1.5">
                        <button onClick={() => setTopicFilter('all')} className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${topicFilter === 'all' ? 'bg-slate-900 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>সব</button>
                        {TOPICS.map((t) => (
                            <button key={t.id} onClick={() => setTopicFilter(t.id)} className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${topicFilter === t.id ? 'bg-slate-900 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                {t.icon} {t.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-wrap gap-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">শব্দের ধরন</p>
                        <div className="flex gap-1.5">
                            {(['all', 'noun', 'verb', 'adjective', 'adverb'] as const).map((p) => (
                                <button key={p} onClick={() => setPosFilter(p as PartOfSpeech | 'all')} className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${posFilter === p ? 'bg-slate-900 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                    {p === 'all' ? 'সব' : POS_SHORT[p as PartOfSpeech]}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Band</p>
                        <div className="flex gap-1.5">
                            {(['all', 6, 7, 8] as const).map((b) => (
                                <button key={b} onClick={() => setBandFilter(b as BandLevel | 'all')} className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${bandFilter === b ? 'bg-slate-900 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                    {b === 'all' ? 'সব' : `B${b}`}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <button onClick={startQuiz} className="w-full rounded-xl bg-teal-600 py-2.5 text-sm font-bold text-white hover:bg-teal-500 transition">
                    {quizDone || qIdx > 0 ? 'নতুন Quiz শুরু করো' : 'Quiz শুরু করো'}
                </button>
            </div>

            {questions.length < 4 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center text-sm text-amber-700">
                    Quiz এর জন্য কমপক্ষে 4টা শব্দ দরকার। অন্য filter বেছে নাও।
                </div>
            )}

            {/* Done screen */}
            {quizDone && (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-4">
                    <Trophy size={40} className={`mx-auto ${pct >= 80 ? 'text-amber-400' : pct >= 60 ? 'text-slate-400' : 'text-rose-400'}`} />
                    <div>
                        <p className={`text-5xl font-black ${pct >= 80 ? 'text-emerald-600' : pct >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>{pct}%</p>
                        <p className="text-slate-500 text-sm mt-1">{score} / {questions.length} সঠিক</p>
                    </div>
                    <p className="text-sm text-slate-700">
                        {pct >= 80 ? 'চমৎকার! তোমার vocabulary অনেক শক্তিশালী।' : pct >= 60 ? 'ভালো। আরেকটু practice করলে আরো ভালো হবে।' : 'চেষ্টা জারি রাখো — flashcard দিয়ে আবার পড়ো।'}
                    </p>
                    <button onClick={startQuiz} className="rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-500 transition inline-flex items-center gap-2">
                        <RotateCcw size={14} /> আবার চেষ্টা করো
                    </button>
                </div>
            )}

            {/* Question */}
            {!quizDone && questions.length >= 4 && q && (
                <div className="space-y-4">
                    {/* Progress */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                            <div className="h-full rounded-full bg-teal-400 transition-all" style={{ width: `${((qIdx) / questions.length) * 100}%` }} />
                        </div>
                        <p className="text-xs font-bold text-slate-400">{qIdx + 1} / {questions.length}</p>
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
                        <div className="text-center space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                {q.type === 'word_to_bangla' ? 'নিচের কোনটি সঠিক বাংলা অর্থ?' : 'নিচের কোন word এর বাংলা অর্থ এটি?'}
                            </p>
                            <div className="rounded-xl bg-teal-50 border border-teal-200 px-6 py-4 inline-block min-w-[200px]">
                                <p className="text-2xl font-black text-teal-900">
                                    {q.type === 'word_to_bangla' ? q.word.word : q.word.bangla}
                                </p>
                                {q.type === 'word_to_bangla' && (
                                    <p className="text-xs font-mono text-teal-500 mt-1">{q.word.ipa}</p>
                                )}
                            </div>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                            {q.options.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => handleSelect(opt)}
                                    className={`flex items-center gap-2 rounded-xl border-2 px-4 py-3 text-sm transition text-left ${optionClass(opt)}`}
                                >
                                    {optionIcon(opt)}
                                    <span>{opt}</span>
                                </button>
                            ))}
                        </div>

                        {/* Explanation after answer */}
                        {qState === 'answered' && (
                            <div className={`rounded-xl border p-4 space-y-2 ${selected === q.correct ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
                                <p className={`text-sm font-black ${selected === q.correct ? 'text-emerald-700' : 'text-rose-700'}`}>
                                    {selected === q.correct ? '✓ সঠিক!' : `✗ ভুল — সঠিক উত্তর: ${q.correct}`}
                                </p>
                                <p className="text-xs text-slate-600 italic">{q.word.example}</p>
                                <p className="text-xs text-slate-500">{q.word.definition}</p>
                            </div>
                        )}

                        {qState === 'answered' && (
                            <button onClick={handleNext} className="w-full rounded-xl bg-teal-600 py-2.5 text-sm font-bold text-white hover:bg-teal-500 transition">
                                {qIdx + 1 >= questions.length ? 'ফলাফল দেখো →' : 'পরের প্রশ্ন →'}
                            </button>
                        )}
                    </div>

                    {/* Live score */}
                    {qIdx > 0 && (
                        <p className="text-center text-xs text-slate-400">
                            এখন পর্যন্ত: {score} / {qIdx} সঠিক ({Math.round((score / qIdx) * 100)}%)
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
