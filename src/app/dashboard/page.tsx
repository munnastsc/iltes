'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
    ArrowUpRight, BarChart3, Bot, CircleHelp, FilePenLine,
    Headphones, BookOpen, PenLine, Mic, Layers3, Sparkles,
    BookMarked, FlaskConical, SendHorizonal, ChevronRight, GraduationCap, Zap, Radio, MessageSquare, ClipboardList, Award, SpellCheck, TrendingUp, Pencil, Library,
} from 'lucide-react';
import ExamCountdown from '../../components/ExamCountdown';
import DailyStudyPlan from '../../components/DailyStudyPlan';

type Message = { role: 'user' | 'assistant'; content: string };

const MODULE_DOTS = [
    { label: 'L', color: 'bg-blue-400', title: 'Listening' },
    { label: 'R', color: 'bg-emerald-400', title: 'Reading' },
    { label: 'W', color: 'bg-violet-400', title: 'Writing' },
    { label: 'S', color: 'bg-rose-400', title: 'Speaking' },
];

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<'cambridge' | 'mock'>('cambridge');
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const [chatMessages, setChatMessages] = useState<Message[]>([
        { role: 'assistant', content: 'আসসালামু আলাইকুম! আমি আপনার IELTS কোচ। যেকোনো প্রশ্ন করুন — Strategy, Grammar, Band Score — সব বিষয়ে সাহায্য করব।' },
    ]);

    const sendChat = async () => {
        const text = chatInput.trim();
        if (!text || chatLoading) return;
        setChatMessages((p) => [...p, { role: 'user', content: text }]);
        setChatInput('');
        setChatLoading(true);
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, context: 'Dashboard Quick Coach' }),
            });
            const data = await res.json();
            setChatMessages((p) => [...p, { role: 'assistant', content: data?.text || 'Try again in a moment.' }]);
        } catch {
            setChatMessages((p) => [...p, { role: 'assistant', content: 'Network error. Please retry.' }]);
        } finally {
            setChatLoading(false);
        }
    };

    const cambridgeBooks = Array.from({ length: 12 }, (_, i) => i + 9);
    const mockBooks = Array.from({ length: 10 }, (_, i) => i + 101);
    const displayBooks = activeTab === 'cambridge' ? cambridgeBooks : mockBooks;

    return (
        <div className="min-h-screen bg-[#f5f6fa]">

            {/* Hero Banner */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 px-5 py-10 lg:px-10">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-wrap items-start justify-between gap-6">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-3">
                                <Sparkles size={10} />
                                PRO ACCOUNT ACTIVE
                            </span>
                            <h1 className="text-3xl font-black text-white lg:text-5xl leading-tight">
                                IELTS Mastery<br />
                                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Library</span>
                            </h1>
                            <p className="mt-3 text-sm text-slate-400 max-w-xl leading-relaxed">
                                Cambridge Books 9–20 · Full Mock Tests 1–10 · AI Writing & Speaking Evaluator
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Link href="/dashboard/ai-tutor"
                                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/30">
                                <Bot size={15} /> AI Tutor
                            </Link>
                            <Link href="/dashboard/writing"
                                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-500 transition shadow-lg shadow-violet-900/30">
                                <PenLine size={15} /> Writing AI
                            </Link>
                            <Link href="/dashboard/speaking"
                                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-500 transition shadow-lg shadow-rose-900/30">
                                <Mic size={15} /> Speaking AI
                            </Link>
                            <Link href="/admin/books"
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-700 px-4 py-2.5 text-sm font-bold text-slate-200 hover:bg-slate-600 transition">
                                <Layers3 size={15} /> Content
                            </Link>
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: 'Cambridge Books', value: '12', sub: 'Books 9–20', icon: <BookMarked size={16} className="text-blue-400" /> },
                            { label: 'Full Mock Tests', value: '10', sub: 'Tests 1–10', icon: <FlaskConical size={16} className="text-amber-400" /> },
                            { label: 'Total Tests', value: '84', sub: '4 per book', icon: <BookOpen size={16} className="text-emerald-400" /> },
                            { label: 'AI Evaluators', value: '2', sub: 'Writing + Speaking', icon: <Bot size={16} className="text-violet-400" /> },
                        ].map((s) => (
                            <div key={s.label} className="rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm px-4 py-3">
                                <div className="flex items-center gap-2 mb-1">{s.icon}<p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</p></div>
                                <p className="text-2xl font-black text-white">{s.value}</p>
                                <p className="text-[11px] text-slate-500 mt-0.5">{s.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">

                {/* Quick Actions */}
                <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link href="/dashboard/ai-tutor"
                        className="group flex items-center gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600 group-hover:bg-indigo-500 transition shadow-md shadow-indigo-200">
                            <Bot size={22} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p className="font-black text-slate-900">AI Tutor</p>
                                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-black text-indigo-700">NEW</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">বাংলায় IELTS শেখো — 24/7</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition" />
                    </Link>
                    <Link href="/dashboard/writing"
                        className="group flex items-center gap-4 rounded-2xl border border-violet-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-violet-300 transition-all">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-violet-100 group-hover:bg-violet-200 transition">
                            <FilePenLine size={22} className="text-violet-700" />
                        </div>
                        <div className="flex-1">
                            <p className="font-black text-slate-900">Writing Evaluator</p>
                            <p className="text-xs text-slate-500 mt-0.5">Task 1 & 2 AI Band Scoring</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-violet-500 transition" />
                    </Link>
                    <Link href="/dashboard/speaking"
                        className="group flex items-center gap-4 rounded-2xl border border-rose-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-rose-300 transition-all">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-rose-100 group-hover:bg-rose-200 transition">
                            <Mic size={22} className="text-rose-700" />
                        </div>
                        <div className="flex-1">
                            <p className="font-black text-slate-900">Speaking Lab</p>
                            <p className="text-xs text-slate-500 mt-0.5">Part 1–3 Practice & AI Feedback</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-rose-500 transition" />
                    </Link>
                    <Link href="/dashboard/ai-conversation"
                        className="group flex items-center gap-4 rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 to-orange-50 p-5 shadow-sm hover:shadow-md hover:border-rose-300 transition-all">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-rose-600 group-hover:bg-rose-500 transition shadow-md shadow-rose-200">
                            <MessageSquare size={22} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p className="font-black text-slate-900">AI Conversation</p>
                                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-700">NEW</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">IELTS Speaking · 15 Topics</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-rose-500 transition" />
                    </Link>
                    <Link href="/dashboard/spoken-english"
                        className="group flex items-center gap-4 rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-cyan-50 p-5 shadow-sm hover:shadow-md hover:border-teal-300 transition-all">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-teal-600 group-hover:bg-teal-500 transition shadow-md shadow-teal-200">
                            <Radio size={22} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p className="font-black text-slate-900">Spoken English</p>
                                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-black text-teal-700">NEW</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">Headway Dictation & Shadowing</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-teal-500 transition" />
                    </Link>
                    <Link href="/dashboard/mock"
                        className="group flex items-center gap-4 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-purple-50 p-5 shadow-sm hover:shadow-md hover:border-violet-300 transition-all">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-violet-600 group-hover:bg-violet-500 transition shadow-md shadow-violet-200">
                            <ClipboardList size={22} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p className="font-black text-slate-900">Mock Tests</p>
                                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-black text-violet-700">NEW</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">3 Full Tests · Reading + Writing</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-violet-500 transition" />
                    </Link>
                    <Link href="/dashboard/analytics"
                        className="group flex items-center gap-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 group-hover:bg-blue-200 transition">
                            <BarChart3 size={22} className="text-blue-700" />
                        </div>
                        <div className="flex-1">
                            <p className="font-black text-slate-900">Analytics</p>
                            <p className="text-xs text-slate-500 mt-0.5">Track Progress & Band Trends</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition" />
                    </Link>
                    <Link href="/dashboard/guide"
                        className="group flex items-center gap-4 rounded-2xl border border-amber-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-amber-300 transition-all">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-100 group-hover:bg-amber-200 transition">
                            <GraduationCap size={22} className="text-amber-700" />
                        </div>
                        <div className="flex-1">
                            <p className="font-black text-slate-900">IELTS Guide</p>
                            <p className="text-xs text-slate-500 mt-0.5">Tips, Tricks & Secret Strategies</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-amber-500 transition" />
                    </Link>
                    <Link href="/dashboard/paraphrase"
                        className="group flex items-center gap-4 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-100 group-hover:bg-indigo-200 transition">
                            <Zap size={22} className="text-indigo-700" />
                        </div>
                        <div className="flex-1">
                            <p className="font-black text-slate-900">Paraphrase Master</p>
                            <p className="text-xs text-slate-500 mt-0.5">Learn · Quiz · Build · Synonyms</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition" />
                    </Link>
                    <Link href="/dashboard/vocabulary"
                        className="group flex items-center gap-4 rounded-2xl border border-teal-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-teal-300 transition-all">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-teal-100 group-hover:bg-teal-200 transition">
                            <BookOpen size={22} className="text-teal-700" />
                        </div>
                        <div className="flex-1">
                            <p className="font-black text-slate-900">Vocabulary Builder</p>
                            <p className="text-xs text-slate-500 mt-0.5">IPA · বাংলা অর্থ · Flashcard · Quiz</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-teal-500 transition" />
                    </Link>
                    <Link href="/dashboard/listening"
                        className="group flex items-center gap-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 group-hover:bg-blue-200 transition">
                            <Headphones size={22} className="text-blue-700" />
                        </div>
                        <div className="flex-1">
                            <p className="font-black text-slate-900">Listening Practice</p>
                            <p className="text-xs text-slate-500 mt-0.5">Cambridge Tests · Audio · 40 Questions</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition" />
                    </Link>
                    <Link href="/dashboard/reading"
                        className="group flex items-center gap-4 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100 group-hover:bg-emerald-200 transition">
                            <BookOpen size={22} className="text-emerald-700" />
                        </div>
                        <div className="flex-1">
                            <p className="font-black text-slate-900">Reading Practice</p>
                            <p className="text-xs text-slate-500 mt-0.5">Cambridge Tests · Real Passages · 40 Questions</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-500 transition" />
                    </Link>
                    <Link href="/dashboard/certificate"
                        className="group flex items-center gap-4 rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm hover:shadow-md hover:border-amber-300 transition-all">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500 group-hover:bg-amber-400 transition shadow-md shadow-amber-200">
                            <Award size={22} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p className="font-black text-slate-900">Certificate</p>
                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-700">NEW</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">Achievement Badge · Download PDF</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-amber-500 transition" />
                    </Link>
                    <Link href="/dashboard/grammar"
                        className="group flex items-center gap-4 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 group-hover:bg-emerald-500 transition shadow-md shadow-emerald-200">
                            <SpellCheck size={22} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p className="font-black text-slate-900">Grammar Checker</p>
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-700">NEW</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">AI বাংলায় ভুল explain করবে</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-500 transition" />
                    </Link>
                    <Link href="/dashboard/band-predictor"
                        className="group flex items-center gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50 p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600 group-hover:bg-indigo-500 transition shadow-md shadow-indigo-200">
                            <TrendingUp size={22} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p className="font-black text-slate-900">Band Predictor</p>
                                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-black text-indigo-700">NEW</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">তোমার predicted IELTS band দেখো</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition" />
                    </Link>
                    <Link href="/dashboard/grammar-practice"
                        className="group flex items-center gap-4 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-purple-50 p-5 shadow-sm hover:shadow-md hover:border-violet-300 transition-all">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-violet-600 group-hover:bg-violet-500 transition shadow-md shadow-violet-200">
                            <Pencil size={22} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p className="font-black text-slate-900">Grammar Practice</p>
                                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-black text-violet-700">NEW</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">Easy → Hard · MCQ · বাংলায় Rule</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-violet-500 transition" />
                    </Link>
                    <Link href="/dashboard/stories"
                        className="group flex items-center gap-4 rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 to-pink-50 p-5 shadow-sm hover:shadow-md hover:border-rose-300 transition-all">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-rose-600 group-hover:bg-rose-500 transition shadow-md shadow-rose-200">
                            <Library size={22} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p className="font-black text-slate-900">English Stories</p>
                                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-700">NEW</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">শব্দে click → বাংলা অর্থ · Quiz</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-rose-500 transition" />
                    </Link>
                </div>

                <ExamCountdown />

                <DailyStudyPlan />

                {/* Referral Banner */}
                <div className="rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <p className="font-black text-green-800 text-sm">🎁 বন্ধুকে invite করো!</p>
                        <p className="text-xs text-green-600 mt-0.5">WhatsApp-এ share করো — বন্ধু join করলে তুমিও benefit পাবে।</p>
                    </div>
                    <a
                        href={`https://wa.me/?text=${encodeURIComponent('🎓 ILTES Sathi AI — বাংলায় IELTS প্র্যাকটিস! Cambridge Books 9-20, AI Tutor, Speaking Practice, Writing Checker সব একসাথে। এখনই try করো: https://iltes-sathi.com')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-500 transition shadow-md shadow-green-200"
                    >
                        <SendHorizonal size={15} /> WhatsApp-এ Share করো
                    </a>
                </div>

                {/* Books + Chat grid */}
                <div className="mt-8 grid gap-6 lg:grid-cols-[1.7fr_1fr]">

                    {/* Book Library */}
                    <div>
                        {/* Tabs */}
                        <div className="flex rounded-2xl bg-white border border-slate-200 shadow-sm p-1.5 gap-1 mb-5">
                            <button
                                onClick={() => setActiveTab('cambridge')}
                                className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                                    activeTab === 'cambridge'
                                        ? 'bg-slate-900 text-white shadow'
                                        : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                <BookMarked size={14} />
                                Cambridge Books
                                <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-black ${
                                    activeTab === 'cambridge' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                                }`}>11</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('mock')}
                                className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                                    activeTab === 'mock'
                                        ? 'bg-amber-500 text-white shadow'
                                        : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                <FlaskConical size={14} />
                                Mock Tests
                                <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-black ${
                                    activeTab === 'mock' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                                }`}>10</span>
                            </button>
                        </div>

                        {/* Cards */}
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {displayBooks.map((book) => {
                                const isMock = activeTab === 'mock';
                                const label = isMock ? `Mock Test ${book - 100}` : `Book ${book}`;
                                return (
                                    <Link
                                        key={book}
                                        href={`/dashboard/book/${book}`}
                                        className={`group relative flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg overflow-hidden ${
                                            isMock ? 'border-amber-100 hover:border-amber-300' : 'border-slate-100 hover:border-blue-300'
                                        }`}
                                    >
                                        {/* Card accent */}
                                        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${
                                            isMock
                                                ? 'bg-gradient-to-r from-amber-400 to-orange-400'
                                                : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                                        }`} />

                                        <div className="flex items-start justify-between mt-1">
                                            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                                                isMock ? 'bg-amber-100' : 'bg-blue-50'
                                            }`}>
                                                {isMock
                                                    ? <FlaskConical size={16} className="text-amber-700" />
                                                    : <BookMarked size={16} className="text-blue-700" />
                                                }
                                            </div>
                                            <ArrowUpRight size={15} className={`opacity-0 group-hover:opacity-100 transition ${
                                                isMock ? 'text-amber-500' : 'text-blue-500'
                                            }`} />
                                        </div>

                                        <p className={`mt-3 text-xl font-black text-slate-900`}>{label}</p>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {isMock ? '4 Full Tests · Real Audio' : '4 Tests · Official Content'}
                                        </p>

                                        {/* Module dots */}
                                        <div className="mt-3 flex items-center gap-1.5">
                                            {MODULE_DOTS.map((d) => (
                                                <div key={d.label} className="group/dot relative">
                                                    <div className={`h-2 w-2 rounded-full ${d.color}`} title={d.title} />
                                                </div>
                                            ))}
                                            <span className="ml-1 text-[10px] font-semibold text-slate-400">4 Modules</span>
                                        </div>

                                        <div className={`mt-3 text-xs font-bold ${isMock ? 'text-amber-600' : 'text-blue-600'}`}>
                                            Open →
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* AI Coach */}
                    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                                    <Bot size={16} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900">AI IELTS Coach</p>
                                    <p className="text-[10px] text-slate-400">Powered by Claude AI</p>
                                </div>
                            </div>
                            <span className="flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Online
                            </span>
                        </div>

                        <div className="flex-1 space-y-3 overflow-y-auto p-4 min-h-[300px] max-h-[420px] bg-[#fafafa]">
                            {chatMessages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                                        m.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-sm'
                                            : 'bg-white border border-slate-100 text-slate-700 rounded-bl-sm'
                                    }`}>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                            {chatLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                                        <div className="flex gap-1">
                                            <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce [animation-delay:0ms]" />
                                            <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce [animation-delay:150ms]" />
                                            <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce [animation-delay:300ms]" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-slate-100 p-4">
                            <div className="flex gap-2">
                                <input
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') sendChat(); }}
                                    placeholder="Ask about IELTS..."
                                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white transition"
                                />
                                <button
                                    onClick={sendChat}
                                    disabled={!chatInput.trim() || chatLoading}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 transition"
                                >
                                    <SendHorizonal size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
