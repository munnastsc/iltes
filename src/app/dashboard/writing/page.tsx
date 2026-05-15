'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ChevronLeft, FilePenLine, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { CAMBRIDGE_WRITING_TASKS, CAMBRIDGE_WRITING_BOOKS, getCambridgeWritingTasks } from '../../../lib/cambridgeWritingTasks';
import { getWritingImage } from '../../../lib/cambridgeWritingPages';

type TaskType = 'task1' | 'task2';

type Result = {
    wordCount: number;
    estimatedBand: number;
    criteria: {
        taskResponse: number;
        coherenceAndCohesion: number;
        lexicalResource: number;
        grammaticalRangeAndAccuracy: number;
    };
    strengths: string[];
    mistakes: string[];
    improvementPlan: string[];
    improvedSample: string;
    error?: string;
};

const TASK_1_PROMPTS = [
    'The chart below shows monthly online grocery sales in three cities from January to June. Summarize the information by selecting and reporting the main features.',
    'The table compares the percentage of renewable energy use in five countries in 2000 and 2025. Summarize the key trends.',
    'The bar chart shows the number of students enrolled in four university departments in 2010 and 2020. Summarize the information.',
    'The line graph illustrates average daily water consumption in two cities over a 12-month period. Summarize the main features.',
    'The pie charts compare household expenditure in a country in 2005 and 2025. Summarize the information and make comparisons.',
    'The table gives information about international tourist arrivals in five regions between 2012 and 2022. Summarize the key trends.',
    'The graph shows changes in average house prices in three cities over a 15-year period. Summarize the main developments.',
    'The charts below show the proportion of people using different transport modes in 2000 and 2020 in one city. Summarize the information.',
    'The diagram illustrates how coffee is produced from planting to packaging. Summarize the process.',
    'The maps show how a town center changed between 1995 and 2025. Summarize the main changes.',
    'The table compares the number of hospital beds and doctors per 1,000 people in six countries. Summarize the information.',
    'The bar chart and table show electricity generation by source in one country in 2010 and 2030. Summarize and compare key features.',
    'The line chart shows unemployment rates for men and women in one country from 2001 to 2021. Summarize the main trends.',
    'The chart shows the percentage of company employees working remotely between 2018 and 2024. Summarize the information.',
    'The table presents average monthly spending on food, rent, and transport for three income groups. Summarize and compare.',
    'The charts compare the proportion of waste recycled in four cities in 2005, 2015, and 2025. Summarize the trends.',
];

const TASK_2_PROMPTS = [
    'Some people think university education should be free for everyone. Others believe students should pay for their own studies. Discuss both views and give your opinion.',
    'Many people now work from home. Do the advantages of this development outweigh the disadvantages?',
    'Some people believe that public transport should be free in all cities. To what extent do you agree or disagree?',
    'In many countries, people are living longer. What are the advantages and disadvantages of an ageing population?',
    'Some think children should start learning a foreign language at primary school rather than secondary school. Discuss both views and give your opinion.',
    'Many people believe that social media has a negative effect on young people. Do you agree or disagree?',
    'Some people think governments should spend more on healthcare than on the arts. To what extent do you agree or disagree?',
    'Environmental problems are too big for individual people to solve. Only governments and large companies can make a difference. Discuss both views and give your opinion.',
    'Some people believe that success in life depends mainly on hard work, while others think money and appearance are more important. Discuss both views.',
    'Online education is becoming more common than classroom learning. Do the benefits outweigh the drawbacks?',
    'Some people think that the best way to reduce crime is to give longer prison sentences. Others believe there are better alternatives. Discuss both views and give your opinion.',
    'Many countries are facing increasing traffic congestion. What are the causes, and what solutions can be taken?',
    'Some believe that advertising encourages people to buy unnecessary things. Others say advertising informs consumers. Discuss both views and give your opinion.',
    'In some countries, more people are choosing to live alone. Is this a positive or negative development?',
    'Some people think international tourism creates more problems than benefits. To what extent do you agree or disagree?',
    'Many students choose to study abroad for higher education. Do the advantages of studying abroad outweigh the disadvantages?',
    'Some people believe that schools should teach financial skills, such as budgeting and saving. Do you agree or disagree?',
    'In the future, people may read only online instead of printed books and newspapers. Is this a positive or negative development?',
    'Some people think that job satisfaction is more important than job security. Do you agree or disagree?',
    'Technology is making people less social. To what extent do you agree or disagree?',
];

function CriteriaBar({ label, score }: { label: string; score: number }) {
    const pct = (score / 9) * 100;
    const barColor = score >= 7 ? 'bg-emerald-500' : score >= 6 ? 'bg-amber-500' : 'bg-rose-500';
    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-600">{label}</span>
                <span className="text-xs font-bold text-slate-800">{score}</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

export default function WritingAIEvaluatorPage() {
    const [taskType, setTaskType] = useState<TaskType>('task2');
    const [targetBand, setTargetBand] = useState(7);
    const [prompt, setPrompt] = useState(TASK_2_PROMPTS[0]);
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<Result | null>(null);
    const [error, setError] = useState('');
    const [source, setSource] = useState<'practice' | 'cambridge'>('cambridge');
    const [camBook, setCamBook] = useState(9);
    const [camTest, setCamTest] = useState(1);

    const prompts = useMemo(() => (taskType === 'task1' ? TASK_1_PROMPTS : TASK_2_PROMPTS), [taskType]);

    const camTasks = useMemo(() => getCambridgeWritingTasks(camBook, camTest), [camBook, camTest]);
    const camTests = useMemo(() => {
        const ts = [...new Set(CAMBRIDGE_WRITING_TASKS.filter(t => t.book === camBook).map(t => t.test))].sort((a,b)=>a-b);
        return ts;
    }, [camBook]);
    const wordCount = useMemo(() => response.trim().split(/\s+/).filter(Boolean).length, [response]);
    const minWords = taskType === 'task1' ? 150 : 250;
    const wordPct = Math.min(100, (wordCount / minWords) * 100);
    const wordOk = wordCount >= minWords;

    const evaluate = async () => {
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const res = await fetch('/api/writing/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskType, prompt: prompt.trim(), response: response.trim(), targetBand }),
            });
            const data = (await res.json()) as Result;
            if (!res.ok) { setError(data?.error || 'Evaluation failed.'); return; }
            setResult(data);
        } catch { setError('Network issue. Please try again.'); }
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-[#f5f6fa]">
            {/* Dark Hero */}
            <div className="bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 px-5 py-10 lg:px-10">
                <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-5">
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-violet-300 mb-3">
                            <FilePenLine size={10} />
                            AI WRITING EVALUATOR
                        </span>
                        <h1 className="text-3xl font-black text-white lg:text-4xl">
                            IELTS Writing<br />
                            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Analyzer</span>
                        </h1>
                        <p className="mt-2 text-sm text-slate-400">Band estimate · Criteria scores · Mistakes · Improved sample</p>
                    </div>
                    <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm font-bold text-slate-200 hover:bg-slate-700 transition">
                        <ChevronLeft size={15} />
                        Dashboard
                    </Link>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-5 py-7">
                <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
                    {/* Left: Input */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                        {/* Task type + Band */}
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-3">Task Type &amp; Target Band</p>
                            <div className="grid gap-2 sm:grid-cols-3">
                                <button
                                    type="button"
                                    onClick={() => { setTaskType('task1'); setPrompt(TASK_1_PROMPTS[0]); }}
                                    className={`rounded-xl py-3 text-sm font-bold transition ${taskType === 'task1' ? 'bg-violet-600 text-white shadow' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                                >
                                    Task 1
                                    <span className="block text-[10px] font-normal opacity-70 mt-0.5">Report / Process</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setTaskType('task2'); setPrompt(TASK_2_PROMPTS[0]); }}
                                    className={`rounded-xl py-3 text-sm font-bold transition ${taskType === 'task2' ? 'bg-violet-600 text-white shadow' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                                >
                                    Task 2
                                    <span className="block text-[10px] font-normal opacity-70 mt-0.5">Essay / Argument</span>
                                </button>
                                <select
                                    value={targetBand}
                                    onChange={(e) => setTargetBand(Number(e.target.value))}
                                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-violet-400"
                                >
                                    {[6, 6.5, 7, 7.5, 8].map((band) => (
                                        <option key={band} value={band}>Target: Band {band}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Source: Cambridge / Practice */}
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2">Question Source</p>
                            <div className="flex gap-2 mb-3">
                                <button type="button"
                                    onClick={() => setSource('cambridge')}
                                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-bold transition ${source === 'cambridge' ? 'bg-violet-600 text-white shadow' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <BookOpen size={13} /> Cambridge IELTS
                                </button>
                                <button type="button"
                                    onClick={() => setSource('practice')}
                                    className={`flex-1 rounded-xl py-2 text-sm font-bold transition ${source === 'practice' ? 'bg-violet-600 text-white shadow' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                                >
                                    Practice Tasks
                                </button>
                            </div>

                            {source === 'cambridge' ? (
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <select value={camBook} onChange={e => { setCamBook(Number(e.target.value)); setCamTest(1); }}
                                            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-violet-400">
                                            {CAMBRIDGE_WRITING_BOOKS.map(b => <option key={b} value={b}>Cambridge {b}</option>)}
                                        </select>
                                        <select value={camTest} onChange={e => setCamTest(Number(e.target.value))}
                                            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-violet-400">
                                            {camTests.map(t => <option key={t} value={t}>Test {t}</option>)}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {camTasks.map(ct => (
                                            <button key={ct.task} type="button"
                                                onClick={() => { setTaskType(ct.task === 1 ? 'task1' : 'task2'); setPrompt(ct.prompt); }}
                                                className={`rounded-xl border p-3 text-left text-xs transition ${prompt === ct.prompt ? 'bg-violet-50 border-violet-300 font-bold text-violet-800' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'}`}
                                            >
                                                <span className="block font-black mb-0.5">Task {ct.task}</span>
                                                <span className="text-[10px] text-slate-500">{ct.type}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <select value={prompt} onChange={(e) => setPrompt(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:bg-white">
                                    {prompts.map((item) => <option key={item} value={item}>{item.slice(0, 80)}…</option>)}
                                </select>
                            )}

                            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mt-3 mb-1">Question / Prompt</p>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={3}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:bg-white resize-none leading-6"
                            />

                            {/* Task 1 chart/graph image */}
                            {source === 'cambridge' && taskType === 'task1' && (() => {
                                const imgUrl = getWritingImage(camBook, camTest);
                                if (imgUrl) return (
                                    <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                                        <img src={imgUrl} alt="Task 1 — Chart / Graph / Diagram" className="w-full h-auto" />
                                    </div>
                                );
                                return (
                                    <p className="mt-2 text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
                                        📄 Open your Cambridge {camBook} book to Test {camTest} Writing Task 1 to see the chart/graph.
                                    </p>
                                );
                            })()}
                        </div>

                        {/* Response */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Your Response</label>
                                <span className={`text-xs font-bold ${wordOk ? 'text-emerald-600' : 'text-rose-500'}`}>
                                    {wordCount} / {minWords} words
                                </span>
                            </div>
                            {/* Word count progress bar */}
                            <div className="mb-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-300 ${wordOk ? 'bg-emerald-500' : 'bg-violet-400'}`}
                                    style={{ width: `${wordPct}%` }}
                                />
                            </div>
                            <textarea
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                rows={14}
                                placeholder="Write your IELTS response here..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:bg-white resize-none leading-7"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={evaluate}
                            disabled={loading || !prompt.trim() || !response.trim()}
                            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-violet-300 hover:bg-violet-500 transition shadow"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                            Evaluate Writing
                        </button>
                        {error && <p className="text-sm text-rose-600">{error}</p>}
                    </div>

                    {/* Right: Report */}
                    <aside>
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
                                <FilePenLine size={13} />
                                Evaluation Report
                            </p>
                            {!result ? (
                                <div className="mt-6 text-center py-8">
                                    <p className="text-4xl mb-3">✍️</p>
                                    <p className="text-sm text-slate-400">Submit your writing to see score and feedback.</p>
                                </div>
                            ) : (
                                <div className="mt-4 space-y-5">
                                    {/* Band score */}
                                    <div className="rounded-xl bg-violet-600 p-4 text-center text-white">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Estimated Band</p>
                                        <p className="text-5xl font-black tabular-nums">{result.estimatedBand}</p>
                                        <p className="text-xs opacity-70">{result.wordCount} words</p>
                                    </div>

                                    {/* Criteria bars */}
                                    <div className="space-y-3">
                                        <CriteriaBar label="Task Response" score={result.criteria.taskResponse} />
                                        <CriteriaBar label="Coherence & Cohesion" score={result.criteria.coherenceAndCohesion} />
                                        <CriteriaBar label="Lexical Resource" score={result.criteria.lexicalResource} />
                                        <CriteriaBar label="Grammar" score={result.criteria.grammaticalRangeAndAccuracy} />
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-600 mb-2">Strengths</p>
                                        <ul className="space-y-1">
                                            {result.strengths.map((item, i) => (
                                                <li key={`${item}-${i}`} className="flex gap-2 text-xs text-slate-700">
                                                    <span className="text-emerald-500">✓</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-rose-600 mb-2">Mistakes</p>
                                        <ul className="space-y-1">
                                            {result.mistakes.map((item, i) => (
                                                <li key={`${item}-${i}`} className="flex gap-2 text-xs text-slate-700">
                                                    <span className="text-rose-400">✗</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-600 mb-2">Improvement Plan</p>
                                        <ul className="space-y-1">
                                            {result.improvementPlan.map((item, i) => (
                                                <li key={`${item}-${i}`} className="flex gap-2 text-xs text-slate-700">
                                                    <span className="text-blue-400">→</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-violet-700 mb-2">Improved Sample</p>
                                        <p className="whitespace-pre-wrap text-sm leading-7 text-violet-900">{result.improvedSample}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                </section>
            </div>
        </div>
    );
}

