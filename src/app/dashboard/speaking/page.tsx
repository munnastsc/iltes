'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Mic, Square, Loader2, ArrowLeft, ClipboardList, Sparkles, Search, Shuffle, Star, Clock3, ChevronLeft } from 'lucide-react';
import { SPEAKING_TOPICS, type SpeakingTopic } from '../../../lib/speakingTopics';

type ActivePart = 'part1' | 'part2' | 'part3';

type EvaluationResponse = {
    transcript: string;
    estimatedBand: {
        fluencyAndCoherence: number;
        lexicalResource: number;
        grammaticalRangeAndAccuracy: number;
        pronunciation: number;
        overall: number;
    };
    strengths: string[];
    mistakes: string[];
    improvementPlan: string[];
    modelResponse: string;
    error?: string;
};

type RecentAttempt = {
    topicId: string;
    topicTitle: string;
    band: number;
    createdAt: string;
};

const PART_LABELS: Record<ActivePart, string> = {
    part1: 'Part 1 · Introduction',
    part2: 'Part 2 · Cue Card',
    part3: 'Part 3 · Discussion',
};

function ScoreBar({ label, score }: { label: string; score: number }) {
    const pct = (score / 9) * 100;
    const barColor = score >= 7 ? 'bg-emerald-500' : score >= 5.5 ? 'bg-amber-500' : 'bg-rose-500';
    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-600">{label}</span>
                <span className="text-xs font-bold text-slate-800">{score}</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className={`h-full rounded-full ${barColor} transition-all duration-700`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

export default function SpeakingPracticePage() {
    const [topicId, setTopicId] = useState(SPEAKING_TOPICS[0]?.id || '');
    const [searchTerm, setSearchTerm] = useState('');
    const [levelFilter, setLevelFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [favoriteTopicIds, setFavoriteTopicIds] = useState<string[]>([]);
    const [recentAttempts, setRecentAttempts] = useState<RecentAttempt[]>([]);
    const [activePart, setActivePart] = useState<ActivePart>('part2');
    const [manualTranscript, setManualTranscript] = useState('');
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<EvaluationResponse | null>(null);
    const [error, setError] = useState('');
    const [prepSeconds, setPrepSeconds] = useState(60);
    const [speakSeconds, setSpeakSeconds] = useState(120);
    const [timerMode, setTimerMode] = useState<'idle' | 'prep' | 'speak'>('idle');

    const recorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);

    const categories = useMemo(
        () => Array.from(new Set(SPEAKING_TOPICS.map((item) => item.category))).sort((a, b) => a.localeCompare(b)),
        []
    );

    const filteredTopics = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();
        return SPEAKING_TOPICS.filter((item) => {
            const matchesSearch =
                !search ||
                item.title.toLowerCase().includes(search) ||
                item.category.toLowerCase().includes(search) ||
                item.contextNote.toLowerCase().includes(search);
            const matchesLevel = levelFilter === 'all' || item.level === levelFilter;
            const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
            return matchesSearch && matchesLevel && matchesCategory;
        });
    }, [searchTerm, levelFilter, categoryFilter]);

    const topic: SpeakingTopic | undefined = useMemo(
        () => SPEAKING_TOPICS.find((t) => t.id === topicId),
        [topicId]
    );

    useEffect(() => {
        try {
            const savedFavorites = localStorage.getItem('iltes_speaking_favorites');
            const savedRecent = localStorage.getItem('iltes_speaking_recent_attempts');
            if (savedFavorites) {
                const parsed = JSON.parse(savedFavorites);
                if (Array.isArray(parsed)) setFavoriteTopicIds(parsed.filter((x) => typeof x === 'string'));
            }
            if (savedRecent) {
                const parsed = JSON.parse(savedRecent);
                if (Array.isArray(parsed)) {
                    setRecentAttempts(
                        parsed.filter((x) => x && typeof x.topicId === 'string' && typeof x.topicTitle === 'string').slice(0, 8)
                    );
                }
            }
        } catch { /* no-op */ }
    }, []);

    useEffect(() => { localStorage.setItem('iltes_speaking_favorites', JSON.stringify(favoriteTopicIds)); }, [favoriteTopicIds]);
    useEffect(() => { localStorage.setItem('iltes_speaking_recent_attempts', JSON.stringify(recentAttempts.slice(0, 8))); }, [recentAttempts]);

    useEffect(() => {
        if (!filteredTopics.length) return;
        const stillVisible = filteredTopics.some((item) => item.id === topicId);
        if (!stillVisible) setTopicId(filteredTopics[0].id);
    }, [filteredTopics, topicId]);

    useEffect(() => {
        if (!audioBlob) return;
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [audioBlob]);

    useEffect(() => {
        if (timerMode === 'idle') return;
        const timer = setInterval(() => {
            if (timerMode === 'prep') {
                setPrepSeconds((prev) => {
                    if (prev <= 1) { setTimerMode('speak'); return 0; }
                    return prev - 1;
                });
            } else {
                setSpeakSeconds((prev) => {
                    if (prev <= 1) { setTimerMode('idle'); return 0; }
                    return prev - 1;
                });
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [timerMode]);

    const startPart2Timer = () => { setPrepSeconds(60); setSpeakSeconds(120); setTimerMode('prep'); };
    const stopPart2Timer = () => { setTimerMode('idle'); setPrepSeconds(60); setSpeakSeconds(120); };

    const startRecording = async () => {
        setError('');
        setResult(null);
        if (!navigator.mediaDevices?.getUserMedia) { setError('এই browser-এ audio recording support নেই।'); return; }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            streamRef.current = stream;
            recorderRef.current = recorder;
            chunksRef.current = [];
            recorder.ondataavailable = (event) => { if (event.data.size > 0) chunksRef.current.push(event.data); };
            recorder.onstop = () => {
                setAudioBlob(new Blob(chunksRef.current, { type: 'audio/webm' }));
                stream.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            };
            recorder.start();
            setIsRecording(true);
        } catch { setError('Microphone access allow করুন, তারপর আবার try করুন।'); }
    };

    const stopRecording = () => {
        const recorder = recorderRef.current;
        if (recorder && recorder.state !== 'inactive') recorder.stop();
        setIsRecording(false);
    };

    const submitForScoring = async () => {
        if (!topic) return;
        setSubmitting(true);
        setError('');
        setResult(null);
        try {
            const formData = new FormData();
            formData.append('topicId', topic.id);
            formData.append('activePart', activePart);
            formData.append('transcript', manualTranscript.trim());
            if (audioBlob) formData.append('audio', audioBlob, 'speaking-answer.webm');
            const res = await fetch('/api/speaking/evaluate', { method: 'POST', body: formData });
            const data = (await res.json()) as EvaluationResponse;
            if (!res.ok) { setError(data?.error || 'Evaluation failed. আবার চেষ্টা করুন।'); return; }
            setResult(data);
            setRecentAttempts((prev) => [
                { topicId: topic.id, topicTitle: topic.title, band: data.estimatedBand?.overall ?? 0, createdAt: new Date().toISOString() },
                ...prev.filter((item) => item.topicId !== topic.id),
            ].slice(0, 8));
        } catch { setError('Network error হয়েছে। পরে আবার চেষ্টা করুন।'); }
        finally { setSubmitting(false); }
    };

    const partQuestions = useMemo(() => {
        if (!topic) return [];
        if (activePart === 'part1') return topic.part1.map((q) => q.question);
        if (activePart === 'part3') return topic.part3.map((q) => q.question);
        return [topic.part2.title];
    }, [topic, activePart]);

    const toggleFavorite = (id: string) => {
        setFavoriteTopicIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    };

    const pickRandomTopic = () => {
        if (!filteredTopics.length) return;
        setTopicId(filteredTopics[Math.floor(Math.random() * filteredTopics.length)].id);
    };

    const timerBg = timerMode === 'prep' ? 'bg-amber-500' : timerMode === 'speak' ? 'bg-rose-500' : 'bg-slate-200';
    const timerTextColor = timerMode === 'idle' ? 'text-slate-500' : 'text-white';
    const timerLabel = timerMode === 'prep' ? 'PREP' : timerMode === 'speak' ? 'SPEAK' : '—';
    const timerValue = timerMode === 'prep' ? prepSeconds : timerMode === 'speak' ? speakSeconds : 0;

    return (
        <div className="min-h-screen bg-[#f5f6fa]">
            {/* Dark Hero */}
            <div className="bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 px-5 py-10 lg:px-10">
                <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-5">
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-rose-300 mb-3">
                            <Mic size={10} />
                            AI SPEAKING LAB
                        </span>
                        <h1 className="text-3xl font-black text-white lg:text-4xl">
                            IELTS Speaking<br />
                            <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">Practice</span>
                        </h1>
                        <p className="mt-2 text-sm text-slate-400">Cue card · Timed practice · Audio scoring · Band feedback</p>
                    </div>
                    <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm font-bold text-slate-200 hover:bg-slate-700 transition">
                        <ChevronLeft size={15} />
                        Dashboard
                    </Link>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-5 py-7">
                <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                    <div className="space-y-4">
                        {/* Topic Selector */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 mb-3">Select Topic</p>
                            <div className="grid gap-2 sm:grid-cols-2">
                                <div className="relative">
                                    <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search topic..."
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-rose-400 focus:bg-white"
                                    />
                                </div>
                                <select
                                    value={levelFilter}
                                    onChange={(e) => setLevelFilter(e.target.value as 'all' | 'beginner' | 'intermediate' | 'advanced')}
                                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-rose-400"
                                >
                                    <option value="all">All Levels</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                            <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]">
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-rose-400"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={pickRandomTopic}
                                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                                >
                                    <Shuffle size={14} />
                                    Random
                                </button>
                            </div>
                            <select
                                value={topicId}
                                onChange={(e) => setTopicId(e.target.value)}
                                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-rose-400"
                            >
                                {filteredTopics.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.title} ({item.category} · {item.level})
                                    </option>
                                ))}
                            </select>
                            {!filteredTopics.length && <p className="mt-2 text-xs text-rose-600">No topics found.</p>}
                            {topic && (
                                <div className="mt-3 flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => toggleFavorite(topic.id)}
                                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                                            favoriteTopicIds.includes(topic.id)
                                                ? 'bg-amber-100 text-amber-800'
                                                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <Star size={12} />
                                        {favoriteTopicIds.includes(topic.id) ? 'Saved' : 'Save'}
                                    </button>
                                    <p className="text-xs text-slate-400">{favoriteTopicIds.length} saved · {topic.contextNote}</p>
                                </div>
                            )}
                        </div>

                        {/* Part selector + Questions */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-wrap gap-2">
                                {(Object.keys(PART_LABELS) as ActivePart[]).map((part) => (
                                    <button
                                        key={part}
                                        type="button"
                                        onClick={() => setActivePart(part)}
                                        className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                                            activePart === part
                                                ? 'bg-rose-600 text-white shadow'
                                                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        {PART_LABELS[part]}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2">Practice Questions</p>
                                <ul className="space-y-2 text-sm text-slate-700">
                                    {partQuestions.map((q, i) => (
                                        <li key={`${q}-${i}`} className="flex gap-2">
                                            <span className="font-bold text-rose-400">{i + 1}.</span>
                                            {q}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Cue Card */}
                            {topic && activePart === 'part2' && (
                                <div className="mt-4">
                                    {/* Timer display */}
                                    {timerMode !== 'idle' && (
                                        <div className={`mb-4 rounded-xl p-4 text-center ${timerBg} transition-colors duration-500`}>
                                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${timerTextColor} opacity-75`}>{timerLabel}</p>
                                            <p className={`text-5xl font-black tabular-nums ${timerTextColor}`}>{timerValue}s</p>
                                        </div>
                                    )}

                                    {/* Actual cue card */}
                                    <div className="rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 p-5">
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-600">IELTS Speaking · Part 2</p>
                                                <p className="mt-1 text-base font-bold text-amber-900">{topic.part2.title}</p>
                                            </div>
                                            <span className="flex-shrink-0 rounded bg-amber-200 px-2 py-0.5 text-[9px] font-black text-amber-800 uppercase tracking-wider">Cue Card</span>
                                        </div>
                                        <p className="text-sm text-amber-800 mb-2">{topic.part2.prompt}</p>
                                        <ul className="space-y-1 mb-4">
                                            {topic.part2.bulletPoints.map((item) => (
                                                <li key={item} className="flex gap-2 text-sm text-amber-900">
                                                    <span className="text-amber-500">▸</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={startPart2Timer}
                                                className="rounded-lg bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-500 transition"
                                            >
                                                Start Timer (1m prep + 2m speak)
                                            </button>
                                            {timerMode !== 'idle' && (
                                                <button
                                                    type="button"
                                                    onClick={stopPart2Timer}
                                                    className="rounded-lg border border-amber-300 bg-white px-4 py-2 text-xs font-bold text-amber-800 hover:bg-amber-50 transition"
                                                >
                                                    Reset
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Recording */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-3">Audio Recording</p>
                            <div className="flex flex-wrap items-center gap-3">
                                {!isRecording ? (
                                    <button
                                        type="button"
                                        onClick={startRecording}
                                        className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-rose-500 transition shadow"
                                    >
                                        <Mic size={16} />
                                        Start Recording
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={stopRecording}
                                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition shadow"
                                    >
                                        <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                                        <Square size={14} />
                                        Stop
                                    </button>
                                )}
                                {audioBlob && (
                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                                        Audio ready
                                    </span>
                                )}
                            </div>
                            {audioUrl && <audio className="mt-3 w-full" controls src={audioUrl} />}

                            <div className="mt-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Transcript (optional)</label>
                                <textarea
                                    value={manualTranscript}
                                    onChange={(e) => setManualTranscript(e.target.value)}
                                    rows={5}
                                    placeholder="অথবা এখানে আপনার উত্তর type করুন..."
                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-rose-400 focus:bg-white resize-none"
                                />
                            </div>

                            <button
                                type="button"
                                disabled={submitting || (!audioBlob && !manualTranscript.trim())}
                                onClick={submitForScoring}
                                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-rose-300 hover:bg-rose-500 transition shadow"
                            >
                                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                                Evaluate My Speaking
                            </button>
                            {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
                        </div>
                    </div>

                    {/* Right sidebar */}
                    <aside className="space-y-4">
                        {/* Recent Attempts */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-slate-500">
                                <Clock3 size={14} />
                                Recent Attempts
                            </p>
                            {!recentAttempts.length ? (
                                <p className="mt-3 text-sm text-slate-400">No attempts yet.</p>
                            ) : (
                                <ul className="mt-3 space-y-2">
                                    {recentAttempts.map((attempt) => (
                                        <li key={`${attempt.topicId}-${attempt.createdAt}`} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-sm font-semibold text-slate-800 leading-tight">{attempt.topicTitle}</p>
                                                <span className={`flex-shrink-0 rounded-lg px-2 py-0.5 text-xs font-black ${attempt.band >= 7 ? 'bg-emerald-100 text-emerald-800' : attempt.band >= 6 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>
                                                    {attempt.band}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-[11px] text-slate-400">
                                                {new Date(attempt.createdAt).toLocaleString()}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Score Report */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-slate-500">
                                <ClipboardList size={14} />
                                Score Report
                            </p>
                            {!result ? (
                                <p className="mt-3 text-sm text-slate-400">Evaluation করার পরে score এখানে দেখাবে।</p>
                            ) : (
                                <div className="mt-4 space-y-4">
                                    {/* Overall band */}
                                    <div className="rounded-xl bg-emerald-600 p-4 text-center text-white">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Overall Band</p>
                                        <p className="text-5xl font-black tabular-nums">{result.estimatedBand.overall}</p>
                                        <p className="text-xs opacity-70">out of 9.0</p>
                                    </div>

                                    {/* Criteria bars */}
                                    <div className="space-y-3">
                                        <ScoreBar label="Fluency & Coherence" score={result.estimatedBand.fluencyAndCoherence} />
                                        <ScoreBar label="Lexical Resource" score={result.estimatedBand.lexicalResource} />
                                        <ScoreBar label="Grammar" score={result.estimatedBand.grammaticalRangeAndAccuracy} />
                                        <ScoreBar label="Pronunciation" score={result.estimatedBand.pronunciation} />
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-600 mb-2">Strengths</p>
                                        <ul className="space-y-1">
                                            {result.strengths.map((item, idx) => (
                                                <li key={`${item}-${idx}`} className="flex gap-2 text-xs text-slate-700">
                                                    <span className="text-emerald-500">✓</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-rose-600 mb-2">Mistakes</p>
                                        <ul className="space-y-1">
                                            {result.mistakes.map((item, idx) => (
                                                <li key={`${item}-${idx}`} className="flex gap-2 text-xs text-slate-700">
                                                    <span className="text-rose-400">✗</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-600 mb-2">Improvement Plan</p>
                                        <ul className="space-y-1">
                                            {result.improvementPlan.map((item, idx) => (
                                                <li key={`${item}-${idx}`} className="flex gap-2 text-xs text-slate-700">
                                                    <span className="text-blue-400">→</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-700 mb-2">Band 8 Sample Answer</p>
                                        <p className="text-sm leading-7 text-blue-900">{result.modelResponse}</p>
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

