'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';

type Question = {
    id: string;
    topic: string;
    difficulty: Difficulty;
    sentence: string;
    options: string[];
    answer: string;
    explanation: string;
    banglaRule: string;
};

const QUESTIONS: Question[] = [
    // EASY — Articles
    { id: 'a1', topic: 'Articles', difficulty: 'easy', sentence: 'She wants to be ___ engineer.', options: ['a', 'an', 'the', '—'], answer: 'an', explanation: '"Engineer" vowel sound (e) দিয়ে শুরু, তাই "an" বসে।', banglaRule: 'Vowel sound (a/e/i/o/u) দিয়ে শুরু হলে "an" বসে।' },
    { id: 'a2', topic: 'Articles', difficulty: 'easy', sentence: 'I have ___ dog. ___ dog is very friendly.', options: ['a / The', 'the / A', 'a / A', 'the / The'], answer: 'a / The', explanation: 'প্রথমবার নতুন জিনিস → "a". দ্বিতীয়বার same জিনিস → "the"।', banglaRule: 'নতুন পরিচয় = a/an, পুনরায় উল্লেখ = the।' },
    { id: 'a3', topic: 'Articles', difficulty: 'easy', sentence: '___ sun rises in the east.', options: ['A', 'An', 'The', '—'], answer: 'The', explanation: 'Unique/একমাত্র জিনিসে "the" বসে।', banglaRule: 'Unique জিনিস (sun, moon, earth)-এর আগে "the" বসে।' },
    { id: 'a4', topic: 'Articles', difficulty: 'easy', sentence: 'He is ___ honest man.', options: ['a', 'an', 'the', '—'], answer: 'an', explanation: '"Honest"-এর "h" silent, তাই vowel sound — "an" বসে।', banglaRule: 'Spelling-এ consonant হলেও sound vowel হলে "an" বসে (hour, honest, heir)।' },

    // EASY — Prepositions
    { id: 'p1', topic: 'Prepositions', difficulty: 'easy', sentence: 'The meeting is ___ Monday morning.', options: ['in', 'on', 'at', 'by'], answer: 'on', explanation: 'Day-এর আগে সবসময় "on" বসে।', banglaRule: 'দিনের নাম + তারিখের আগে "on" বসে।' },
    { id: 'p2', topic: 'Prepositions', difficulty: 'easy', sentence: 'She wakes up ___ 6 o\'clock every day.', options: ['in', 'on', 'at', 'by'], answer: 'at', explanation: 'Exact time-এর আগে "at" বসে।', banglaRule: 'নির্দিষ্ট সময়ের আগে "at" বসে (at noon, at midnight)।' },
    { id: 'p3', topic: 'Prepositions', difficulty: 'easy', sentence: 'I was born ___ 2001.', options: ['in', 'on', 'at', 'during'], answer: 'in', explanation: 'Year/month/season-এর আগে "in" বসে।', banglaRule: 'Year, month, season-এর আগে "in" বসে।' },
    { id: 'p4', topic: 'Prepositions', difficulty: 'easy', sentence: 'She is sitting ___ the chair.', options: ['in', 'on', 'at', 'by'], answer: 'on', explanation: 'Surface-এর উপরে থাকলে "on" বসে।', banglaRule: 'Surface (chair/table/floor)-এর উপরে = "on"। ঘেরা জায়গার ভেতরে = "in"।' },

    // EASY — Present Simple
    { id: 't1', topic: 'Present Simple', difficulty: 'easy', sentence: 'She ___ to school every day.', options: ['go', 'goes', 'is going', 'went'], answer: 'goes', explanation: 'He/She/It + present simple → verb-এ "s" যোগ হয়।', banglaRule: 'He/She/It-এর সাথে present simple-এ verb-এর শেষে "s/es" যোগ।' },
    { id: 't2', topic: 'Present Simple', difficulty: 'easy', sentence: 'Water ___ at 100 degrees Celsius.', options: ['boil', 'boils', 'is boiling', 'boiled'], answer: 'boils', explanation: 'Scientific fact → present simple।', banglaRule: 'General truth ও scientific facts-এ present simple।' },
    { id: 't3', topic: 'Present Simple', difficulty: 'easy', sentence: 'I ___ not understand this question.', options: ['am', 'does', 'do', 'have'], answer: 'do', explanation: 'I/You/We/They negative-এ "do not" বসে।', banglaRule: 'I/You/We/They → do not/don\'t। He/She/It → does not/doesn\'t।' },

    // MEDIUM — Past vs Present Perfect
    { id: 'm1', topic: 'Past vs Present Perfect', difficulty: 'medium', sentence: 'I ___ this movie last week.', options: ['have seen', 'saw', 'see', 'had seen'], answer: 'saw', explanation: '"Last week" নির্দিষ্ট past time → past simple।', banglaRule: 'Specific past time (yesterday/last week/in 2019) → past simple।' },
    { id: 'm2', topic: 'Past vs Present Perfect', difficulty: 'medium', sentence: 'She ___ never visited Japan.', options: ['did', 'has', 'is', 'was'], answer: 'has', explanation: '"Never" + life experience → present perfect।', banglaRule: 'Ever/never/already/just/yet → Present perfect (has/have + V3)।' },
    { id: 'm3', topic: 'Past vs Present Perfect', difficulty: 'medium', sentence: '___ you finish your homework yet?', options: ['Did', 'Have', 'Do', 'Were'], answer: 'Have', explanation: '"Yet" → present perfect question।', banglaRule: '"Yet" সাধারণত present perfect-এর সাথে আসে।' },
    { id: 'm4', topic: 'Past vs Present Perfect', difficulty: 'medium', sentence: 'He ___ in this city since 2015.', options: ['lived', 'lives', 'has lived', 'was living'], answer: 'has lived', explanation: '"Since" → past থেকে এখন পর্যন্ত → present perfect।', banglaRule: '"Since" ও "for" (duration) → Present perfect।' },

    // MEDIUM — Modal Verbs
    { id: 'mv1', topic: 'Modal Verbs', difficulty: 'medium', sentence: 'You ___ wear a seatbelt. It\'s the law.', options: ['should', 'must', 'might', 'could'], answer: 'must', explanation: 'Legal obligation/strong necessity → "must"।', banglaRule: '"Must" = বাধ্যতামূলক। "Should" = উচিত (choice আছে)।' },
    { id: 'mv2', topic: 'Modal Verbs', difficulty: 'medium', sentence: 'It ___ rain later. The clouds look dark.', options: ['will', 'must', 'might', 'shall'], answer: 'might', explanation: 'Uncertain prediction → "might"।', banglaRule: '"Might" = হয়তো (uncertain)। "Will" = নিশ্চিত।' },
    { id: 'mv3', topic: 'Modal Verbs', difficulty: 'medium', sentence: 'Could you ___ me the time, please?', options: ['tell', 'to tell', 'told', 'telling'], answer: 'tell', explanation: 'Modal-এর পরে সবসময় base verb (V1)।', banglaRule: 'Modal (can/could/will/would/should/must)-এর পরে base verb।' },

    // MEDIUM — Comparatives
    { id: 'c1', topic: 'Comparatives', difficulty: 'medium', sentence: 'This exam is ___ than I expected.', options: ['more difficult', 'most difficult', 'difficulter', 'the most difficult'], answer: 'more difficult', explanation: '2+ syllable adjective → "more + adj" (comparative)।', banglaRule: 'Long adjective (2+ syllable) comparative = more + adj + than।' },
    { id: 'c2', topic: 'Comparatives', difficulty: 'medium', sentence: 'She is the ___ student in the class.', options: ['smart', 'smarter', 'more smart', 'smartest'], answer: 'smartest', explanation: 'সবার মধ্যে সর্বোচ্চ → superlative: the + adj + est।', banglaRule: 'Superlative = the + short adj + est। বা the most + long adj।' },

    // HARD — Conditionals
    { id: 'h1', topic: 'Conditionals', difficulty: 'hard', sentence: 'If I ___ you, I would apologize.', options: ['am', 'was', 'were', 'would be'], answer: 'were', explanation: 'Second conditional (imaginary) → "if + were" সব person-এ।', banglaRule: '2nd conditional: If + were, would + V1। Imaginary situations।' },
    { id: 'h2', topic: 'Conditionals', difficulty: 'hard', sentence: 'If she had studied harder, she ___ the exam.', options: ['will pass', 'would pass', 'would have passed', 'had passed'], answer: 'would have passed', explanation: 'Third conditional (past regret) → would have + V3।', banglaRule: '3rd conditional: If + had + V3, would have + V3। Past regret।' },
    { id: 'h3', topic: 'Conditionals', difficulty: 'hard', sentence: 'If water reaches 100°C, it ___ into steam.', options: ['turns', 'will turn', 'would turn', 'had turned'], answer: 'turns', explanation: 'Zero conditional (scientific fact) → present + present।', banglaRule: 'Zero conditional: If + present simple, present simple। Always-true facts।' },

    // HARD — Passive Voice
    { id: 'pv1', topic: 'Passive Voice', difficulty: 'hard', sentence: 'The letter ___ by the secretary yesterday.', options: ['typed', 'was typed', 'is typed', 'has typed'], answer: 'was typed', explanation: 'Past passive → was/were + V3।', banglaRule: 'Past passive: was/were + V3। Present passive: am/is/are + V3।' },
    { id: 'pv2', topic: 'Passive Voice', difficulty: 'hard', sentence: 'English ___ as the official language in many countries.', options: ['speaks', 'is spoken', 'was spoken', 'spoke'], answer: 'is spoken', explanation: 'General truth, present → is/are + V3।', banglaRule: 'Passive-এ doer (agent) গুরুত্বপূর্ণ না হলে "by" অংশ বাদ দেওয়া যায়।' },

    // HARD — Reported Speech
    { id: 'rs1', topic: 'Reported Speech', difficulty: 'hard', sentence: 'She said, "I am tired." → She said that she ___ tired.', options: ['is', 'was', 'were', 'has been'], answer: 'was', explanation: 'Reported speech tense backshift: am/is → was।', banglaRule: 'Reported speech: present → past (is/am → was, are → were)।' },
    { id: 'rs2', topic: 'Reported Speech', difficulty: 'hard', sentence: 'He said, "I will come." → He said that he ___ come.', options: ['will', 'would', 'could', 'should'], answer: 'would', explanation: 'Backshift: will → would।', banglaRule: 'Will → Would, Can → Could, May → Might (reported speech)।' },
    { id: 'rs3', topic: 'Reported Speech', difficulty: 'hard', sentence: 'She asked, "Where ___ you going?" → She asked where I ___ going.', options: ['are / am', 'are / was', 'were / was', 'is / was'], answer: 'are / was', explanation: 'Direct question → indirect: tense shifts, word order normal।', banglaRule: 'Reported question-এ question mark থাকে না, tense backshift হয়।' },
];

const DIFFICULTY_META: Record<Difficulty, { label: string; textColor: string; bgColor: string }> = {
    easy:   { label: 'Easy',   textColor: 'text-emerald-700', bgColor: 'bg-emerald-100' },
    medium: { label: 'Medium', textColor: 'text-amber-700',   bgColor: 'bg-amber-100'   },
    hard:   { label: 'Hard',   textColor: 'text-rose-700',    bgColor: 'bg-rose-100'    },
};

const ALL_TOPICS = ['All', 'Articles', 'Prepositions', 'Present Simple', 'Past vs Present Perfect', 'Modal Verbs', 'Comparatives', 'Conditionals', 'Passive Voice', 'Reported Speech'];

export default function GrammarPracticePage() {
    const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('easy');
    const [topic, setTopic] = useState('All');
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [revealed, setRevealed] = useState<Record<string, boolean>>({});
    const [quizMode, setQuizMode] = useState(false);
    const [quizQs, setQuizQs] = useState<Question[]>([]);
    const [quizIdx, setQuizIdx] = useState(0);
    const [quizScore, setQuizScore] = useState(0);
    const [quizPicked, setQuizPicked] = useState<string | null>(null);
    const [quizDone, setQuizDone] = useState(false);

    const filtered = useMemo(() => {
        let q = QUESTIONS;
        if (difficulty !== 'all') q = q.filter(x => x.difficulty === difficulty);
        if (topic !== 'All') q = q.filter(x => x.topic === topic);
        return q;
    }, [difficulty, topic]);

    const correctCount = Object.entries(answers).filter(([id, ans]) => QUESTIONS.find(q => q.id === id)?.answer === ans).length;

    function startQuiz() {
        const pool = difficulty === 'all' ? QUESTIONS : QUESTIONS.filter(x => x.difficulty === difficulty);
        const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
        setQuizQs(shuffled);
        setQuizIdx(0);
        setQuizScore(0);
        setQuizPicked(null);
        setQuizDone(false);
        setQuizMode(true);
    }

    function pickQuiz(opt: string) {
        if (quizPicked !== null) return;
        setQuizPicked(opt);
        if (opt === quizQs[quizIdx].answer) setQuizScore(s => s + 1);
    }

    function nextQuiz() {
        if (quizIdx + 1 >= quizQs.length) { setQuizDone(true); return; }
        setQuizIdx(i => i + 1);
        setQuizPicked(null);
    }

    if (quizMode) {
        if (quizDone) {
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center px-5">
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center max-w-md w-full shadow-lg">
                        <Trophy size={48} className="mx-auto text-amber-500 mb-4" />
                        <h2 className="text-2xl font-black text-slate-900">Quiz শেষ!</h2>
                        <p className="text-5xl font-black text-indigo-600 my-4">{quizScore}/{quizQs.length}</p>
                        <p className="text-sm text-slate-600 mb-6">
                            {quizScore >= 8 ? '🎉 দারুণ! Grammar শক্ত হচ্ছে!' : quizScore >= 6 ? '👍 ভালো! আরো practice করো।' : '📚 আরো practice দরকার।'}
                        </p>
                        <div className="flex gap-3 justify-center flex-wrap">
                            <button onClick={startQuiz} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white">আবার Quiz</button>
                            <button onClick={() => setQuizMode(false)} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700">Practice Mode</button>
                        </div>
                    </div>
                </div>
            );
        }

        const q = quizQs[quizIdx];
        const meta = DIFFICULTY_META[q.difficulty];
        return (
            <div className="min-h-screen bg-slate-50 px-5 py-8">
                <div className="mx-auto max-w-xl">
                    <div className="mb-4 flex items-center justify-between">
                        <button onClick={() => setQuizMode(false)} className="text-sm text-slate-500">← Exit</button>
                        <span className="text-sm font-bold text-slate-700">{quizIdx + 1} / {quizQs.length}</span>
                        <span className="text-sm font-bold text-indigo-600">✓ {quizScore}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 mb-6 overflow-hidden">
                        <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${((quizIdx + 1) / quizQs.length) * 100}%` }} />
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full ${meta.bgColor} ${meta.textColor}`}>{q.topic}</span>
                        </div>
                        <p className="text-lg font-semibold text-slate-900 leading-relaxed mb-5">{q.sentence}</p>
                        <div className="grid gap-2">
                            {q.options.map(opt => {
                                let cls = 'rounded-xl border-2 px-4 py-3 text-sm font-semibold text-left transition-all ';
                                if (quizPicked === null) {
                                    cls += 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700 cursor-pointer';
                                } else if (opt === q.answer) {
                                    cls += 'border-emerald-500 bg-emerald-50 text-emerald-800';
                                } else if (opt === quizPicked) {
                                    cls += 'border-rose-400 bg-rose-50 text-rose-700';
                                } else {
                                    cls += 'border-slate-100 text-slate-400';
                                }
                                return <button key={opt} className={cls} onClick={() => pickQuiz(opt)}>{opt}</button>;
                            })}
                        </div>
                        {quizPicked && (
                            <div className={`mt-4 rounded-xl p-3 ${quizPicked === q.answer ? 'bg-emerald-50 border border-emerald-200' : 'bg-rose-50 border border-rose-200'}`}>
                                <p className="text-sm font-bold mb-1">{quizPicked === q.answer ? '✓ সঠিক!' : `✗ সঠিক: "${q.answer}"`}</p>
                                <p className="text-xs text-slate-700">{q.explanation}</p>
                                <p className="text-xs text-indigo-700 font-semibold mt-1">📌 {q.banglaRule}</p>
                            </div>
                        )}
                        {quizPicked && (
                            <button onClick={nextQuiz} className="mt-4 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white">
                                {quizIdx + 1 >= quizQs.length ? 'Result দেখো' : 'পরের প্রশ্ন →'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-5 py-8">
            <div className="mx-auto max-w-3xl">
                <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-5">
                    <ArrowLeft size={16} /> Back
                </Link>
                <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-700">Grammar Practice</p>
                        <h1 className="mt-1 text-3xl font-black text-slate-900">ব্যাকরণ অনুশীলন</h1>
                        <p className="mt-1 text-sm text-slate-500">Easy → Hard। প্রতিটি উত্তরে বাংলায় rule।</p>
                    </div>
                    <button onClick={startQuiz} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200">
                        🎯 Quiz Mode (10Q)
                    </button>
                </div>

                {/* Filters */}
                <div className="mb-5 space-y-2">
                    <div className="flex flex-wrap gap-2">
                        {(['all', 'easy', 'medium', 'hard'] as const).map(d => (
                            <button key={d} onClick={() => setDifficulty(d)}
                                className={`rounded-full px-3 py-1 text-sm font-bold transition ${difficulty === d ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'}`}>
                                {d === 'all' ? 'All Levels' : DIFFICULTY_META[d].label}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {ALL_TOPICS.map(t => (
                            <button key={t} onClick={() => setTopic(t)}
                                className={`rounded-full px-2.5 py-0.5 text-xs font-bold transition ${topic === t ? 'bg-violet-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-violet-300'}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {Object.keys(answers).length > 0 && (
                    <div className="mb-4 rounded-xl bg-indigo-50 border border-indigo-200 px-4 py-2.5 flex items-center justify-between">
                        <p className="text-sm font-bold text-indigo-800">Score: {correctCount} / {Object.keys(answers).length}</p>
                        <button onClick={() => { setAnswers({}); setRevealed({}); }} className="text-xs text-rose-600 font-bold flex items-center gap-1">
                            <RotateCcw size={11} /> Reset
                        </button>
                    </div>
                )}

                <div className="space-y-4">
                    {filtered.map((q, idx) => {
                        const picked = answers[q.id];
                        const isRevealed = revealed[q.id];
                        const isCorrect = picked === q.answer;
                        const meta = DIFFICULTY_META[q.difficulty];
                        return (
                            <div key={q.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-black text-slate-400">{idx + 1}.</span>
                                        <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full ${meta.bgColor} ${meta.textColor}`}>{meta.label}</span>
                                        <span className="text-[11px] text-slate-500">{q.topic}</span>
                                    </div>
                                    {isRevealed && (isCorrect ? <CheckCircle2 size={18} className="text-emerald-500" /> : <XCircle size={18} className="text-rose-500" />)}
                                </div>
                                <p className="text-base font-semibold text-slate-900 mb-4 leading-relaxed">{q.sentence}</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {q.options.map(opt => {
                                        let cls = 'rounded-xl border-2 px-3 py-2 text-sm font-semibold text-left transition-all ';
                                        if (!isRevealed) {
                                            cls += picked === opt ? 'border-indigo-500 bg-indigo-50 text-indigo-800 cursor-pointer' : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 cursor-pointer';
                                        } else if (opt === q.answer) {
                                            cls += 'border-emerald-500 bg-emerald-50 text-emerald-800';
                                        } else if (opt === picked && opt !== q.answer) {
                                            cls += 'border-rose-400 bg-rose-50 text-rose-700';
                                        } else {
                                            cls += 'border-slate-100 text-slate-400';
                                        }
                                        return (
                                            <button key={opt} className={cls}
                                                onClick={() => { if (!isRevealed) setAnswers(a => ({ ...a, [q.id]: opt })); }}>
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>
                                {picked && !isRevealed && (
                                    <button onClick={() => setRevealed(r => ({ ...r, [q.id]: true }))}
                                        className="mt-3 w-full rounded-xl bg-indigo-600 py-2 text-sm font-bold text-white">
                                        Check Answer
                                    </button>
                                )}
                                {isRevealed && (
                                    <div className={`mt-3 rounded-xl p-3 ${isCorrect ? 'bg-emerald-50 border border-emerald-100' : 'bg-rose-50 border border-rose-100'}`}>
                                        <p className="text-sm font-bold mb-1">{isCorrect ? '✓ সঠিক!' : `✗ সঠিক উত্তর: "${q.answer}"`}</p>
                                        <p className="text-xs text-slate-700">{q.explanation}</p>
                                        <p className="text-xs text-indigo-700 font-semibold mt-1">📌 Rule: {q.banglaRule}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
