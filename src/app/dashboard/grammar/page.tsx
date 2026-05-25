'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, Sparkles, Copy, RotateCcw } from 'lucide-react';

type ErrorItem = {
    original: string;
    fix: string;
    explanation: string;
    type: string;
};

type Result = {
    corrected: string;
    errors: ErrorItem[];
    overallFeedback: string;
    ieltsScore: number;
};

const TYPE_LABEL: Record<string, { label: string; color: string }> = {
    grammar:     { label: 'Grammar',     color: 'bg-rose-100 text-rose-700' },
    spelling:    { label: 'Spelling',    color: 'bg-amber-100 text-amber-700' },
    punctuation: { label: 'Punctuation', color: 'bg-blue-100 text-blue-700' },
    word_choice: { label: 'Word Choice', color: 'bg-violet-100 text-violet-700' },
    article:     { label: 'Article',     color: 'bg-teal-100 text-teal-700' },
};

const SAMPLES = [
    "I am going to market yesterday and buyed many things for my family.",
    "She don't know the answer because she didn't studied for the exam.",
    "The informations are very importance for we students.",
    "He suggested that I should to improve my vocabulary skills.",
];

export default function GrammarCheckerPage() {
    const [text, setText] = useState('');
    const [result, setResult] = useState<Result | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    async function checkGrammar() {
        if (!text.trim() || loading) return;
        setLoading(true);
        setResult(null);
        setError('');
        try {
            const res = await fetch('/api/grammar-check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text.trim() }),
            });
            const data = await res.json();
            if (data.error) { setError(data.error); return; }
            setResult(data);
        } catch {
            setError('Network error। আবার try করো।');
        } finally {
            setLoading(false);
        }
    }

    function copyCorrect() {
        if (!result) return;
        navigator.clipboard.writeText(result.corrected);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const bandColor = (score: number) =>
        score >= 7 ? 'text-emerald-600' : score >= 6 ? 'text-amber-600' : 'text-rose-600';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/20">
            <div className="border-b border-slate-200 bg-white px-5 py-4 shadow-sm">
                <div className="mx-auto flex max-w-4xl items-center gap-3">
                    <Link href="/dashboard" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-lg font-black text-slate-900">Grammar Checker</h1>
                        <p className="text-[11px] text-slate-500">English text paste করো — AI বাংলায় ভুল explain করবে</p>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-5 py-6 space-y-5">
                {/* Input */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="px-4 pt-4 pb-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">তোমার English লেখো:</p>
                        <textarea
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder="এখানে English sentence বা paragraph লেখো বা paste করো..."
                            rows={5}
                            className="w-full resize-none text-sm text-slate-800 placeholder-slate-400 outline-none leading-relaxed"
                        />
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5 bg-slate-50">
                        <span className="text-[11px] text-slate-400">{text.length} characters</span>
                        <div className="flex gap-2">
                            <button onClick={() => { setText(''); setResult(null); }}
                                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-200 transition">
                                <RotateCcw size={12} /> Clear
                            </button>
                            <button onClick={checkGrammar} disabled={!text.trim() || loading}
                                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-40 transition">
                                {loading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                                {loading ? 'Checking...' : 'Check Grammar'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sample sentences */}
                {!result && !loading && (
                    <div>
                        <p className="text-xs font-bold text-slate-500 mb-2">Sample sentences try করো:</p>
                        <div className="flex flex-col gap-1.5">
                            {SAMPLES.map((s, i) => (
                                <button key={i} onClick={() => setText(s)}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-left text-xs text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 transition">
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="space-y-4">
                        {/* Score + overall */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Error Count</p>
                                <p className={`text-4xl font-black ${result.errors.length === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {result.errors.length}
                                </p>
                                <p className="text-xs text-slate-500">{result.errors.length === 0 ? 'কোনো ভুল নেই!' : 'টি ভুল পেয়েছি'}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">IELTS Quality</p>
                                <p className={`text-4xl font-black ${bandColor(result.ieltsScore)}`}>
                                    {result.ieltsScore}
                                </p>
                                <p className="text-xs text-slate-500">Band estimate</p>
                            </div>
                        </div>

                        {/* Overall feedback */}
                        {result.overallFeedback && (
                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                                <p className="text-xs font-black text-emerald-700 mb-1">💡 Overall Feedback</p>
                                <p className="text-sm text-emerald-800 leading-relaxed">{result.overallFeedback}</p>
                            </div>
                        )}

                        {/* Corrected version */}
                        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-black text-blue-700 flex items-center gap-1.5">
                                    <CheckCircle2 size={13} /> Corrected Version
                                </p>
                                <button onClick={copyCorrect}
                                    className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold text-blue-600 hover:bg-blue-100 transition">
                                    <Copy size={11} /> {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            <p className="text-sm text-blue-900 leading-relaxed">{result.corrected}</p>
                        </div>

                        {/* Errors list */}
                        {result.errors.length > 0 && (
                            <div className="space-y-3">
                                <p className="text-sm font-black text-slate-700">ভুলগুলো বিস্তারিত:</p>
                                {result.errors.map((err, i) => {
                                    const typeInfo = TYPE_LABEL[err.type] || { label: err.type, color: 'bg-slate-100 text-slate-600' };
                                    return (
                                        <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <AlertCircle size={14} className="text-rose-500 flex-shrink-0" />
                                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${typeInfo.color}`}>{typeInfo.label}</span>
                                                <span className="text-xs font-bold text-slate-500">#{i + 1}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 mb-3">
                                                <div className="rounded-xl bg-rose-50 border border-rose-100 px-3 py-2">
                                                    <p className="text-[10px] font-black text-rose-500 mb-0.5">❌ ভুল</p>
                                                    <p className="text-sm font-bold text-rose-800">{err.original}</p>
                                                </div>
                                                <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2">
                                                    <p className="text-[10px] font-black text-emerald-500 mb-0.5">✅ সঠিক</p>
                                                    <p className="text-sm font-bold text-emerald-800">{err.fix}</p>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-600 leading-relaxed">{err.explanation}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {result.errors.length === 0 && (
                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                                <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
                                <p className="font-black text-emerald-700">কোনো ভুল নেই! চমৎকার!</p>
                                <p className="text-sm text-emerald-600 mt-1">তোমার লেখায় কোনো grammar error পাইনি।</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
