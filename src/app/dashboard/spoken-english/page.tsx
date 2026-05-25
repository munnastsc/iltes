'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    Play, Pause, RotateCcw, ChevronLeft, ChevronRight,
    Volume2, Info, ArrowLeft, Mic, MicOff, Flame, Trophy,
} from 'lucide-react';
import headwayData from '../../../../data/headway-data.json';

type Unit = typeof headwayData.units[0];
type VocabItem = { word: string; bangla: string; example: string };
type Mode = 'listen' | 'dictation' | 'shadow' | 'vocab';
type TranscriptData = { text: string; bangla?: string } | null;
type TrackProg = { played: number; score: number | null; recorded: boolean };
type ProgressMap = Record<string, TrackProg>;

function WordDiff({ typed, original }: { typed: string; original: string }) {
    const typedWords = typed.trim().split(/\s+/);
    const origWords = original.trim().split(/\s+/);
    const correct = typedWords.filter((w, i) =>
        w.toLowerCase().replace(/[^a-z']/g, '') === (origWords[i] || '').toLowerCase().replace(/[^a-z']/g, '')
    ).length;
    const pct = origWords.length ? Math.round((correct / origWords.length) * 100) : 0;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-600">ফলাফল</p>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${pct >= 80 ? 'bg-emerald-100 text-emerald-700' : pct >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                    {pct}% সঠিক
                </span>
            </div>
            <div className="flex flex-wrap gap-1">
                {origWords.map((word, i) => {
                    const tw = typedWords[i] || '';
                    const ok = tw.toLowerCase().replace(/[^a-z']/g, '') === word.toLowerCase().replace(/[^a-z']/g, '');
                    return (
                        <span key={i} className="flex flex-col items-center gap-0.5">
                            <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${ok ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                {word}
                            </span>
                            {!ok && tw && (
                                <span className="text-[10px] text-slate-400 line-through">{tw}</span>
                            )}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

function getPlan(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/subscription_plan=([^;]+)/);
    return match ? match[1] : null;
}

export default function SpokenEnglishPage() {
    const [selectedUnit, setSelectedUnit] = useState<Unit>(headwayData.units[0]);
    const [plan, setPlan] = useState<string | null>(null);
    const [selectedTrack, setSelectedTrack] = useState(1);
    const [mode, setMode] = useState<Mode>('listen');
    const [isPlaying, setIsPlaying] = useState(false);
    const [transcript, setTranscript] = useState<TranscriptData>(null);
    const [loadingTranscript, setLoadingTranscript] = useState(false);
    const [dictationText, setDictationText] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playCount, setPlayCount] = useState(0);
    const [progress, setProgress] = useState<ProgressMap>({});
    const [isRecording, setIsRecording] = useState(false);
    const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
    const [sentenceIdx, setSentenceIdx] = useState(0);
    const [playingVocab, setPlayingVocab] = useState<string | null>(null);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [streak, setStreak] = useState(0);

    const audioRef = useRef<HTMLAudioElement>(null);
    const recordedAudioRef = useRef<HTMLAudioElement>(null);
    const vocabAudioRef = useRef<HTMLAudioElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const CDN = process.env.NEXT_PUBLIC_AUDIO_CDN_URL
        || 'https://munnastsc.github.io/iltes-audio'
        || '/audio';
    const audioSrc = `${CDN}/headway4B/${selectedUnit.unit}.${selectedTrack}.mp3`;
    const trackKey = `${selectedUnit.unit}.${selectedTrack}`;
    const progressPct = duration ? (currentTime / duration) * 100 : 0;

    useEffect(() => { setPlan(getPlan()); }, []);

    useEffect(() => {
        try {
            const p = JSON.parse(localStorage.getItem('spoken_progress') || '{}');
            setProgress(p);
        } catch { /* ignore */ }

        // Streak: count consecutive days practiced
        try {
            const today = new Date().toISOString().slice(0, 10);
            const days: string[] = JSON.parse(localStorage.getItem('spoken_streak_days') || '[]');
            if (!days.includes(today)) {
                days.push(today);
                localStorage.setItem('spoken_streak_days', JSON.stringify(days));
            }
            // Count consecutive days ending today
            let s = 0;
            const d = new Date(today);
            while (true) {
                const key = d.toISOString().slice(0, 10);
                if (!days.includes(key)) break;
                s++;
                d.setDate(d.getDate() - 1);
            }
            setStreak(s);
        } catch { /* ignore */ }
    }, []);

    useEffect(() => {
        setTranscript(null);
        setDictationText('');
        setSubmitted(false);
        setIsPlaying(false);
        setPlayCount(0);
        setSentenceIdx(0);
        if (recordedUrl) { URL.revokeObjectURL(recordedUrl); setRecordedUrl(null); }

        setLoadingTranscript(true);
        fetch(`/api/headway-transcript?track=${trackKey}`)
            .then(r => r.json())
            .then(d => setTranscript(d.transcript || null))
            .catch(() => setTranscript(null))
            .finally(() => setLoadingTranscript(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trackKey]);

    useEffect(() => {
        const a = audioRef.current;
        if (!a) return;
        a.src = audioSrc;
        a.load();
        setCurrentTime(0);
        setDuration(0);
        setIsPlaying(false);
    }, [audioSrc]);

    useEffect(() => {
        if (audioRef.current) audioRef.current.playbackRate = playbackRate;
    }, [playbackRate]);

    function saveProgress(key: string, update: Partial<TrackProg>) {
        setProgress(prev => {
            const updated = { ...prev, [key]: { played: 0, score: null, recorded: false, ...prev[key], ...update } };
            localStorage.setItem('spoken_progress', JSON.stringify(updated));
            return updated;
        });
    }

    const togglePlay = useCallback(() => {
        const a = audioRef.current;
        if (!a) return;
        if (isPlaying) { a.pause(); setIsPlaying(false); }
        else { a.play().catch(() => {}); setIsPlaying(true); }
    }, [isPlaying]);

    const restart = useCallback(() => {
        const a = audioRef.current;
        if (!a) return;
        a.currentTime = 0;
        a.play().catch(() => {});
        setIsPlaying(true);
    }, []);

    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;
            chunksRef.current = [];
            recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setRecordedUrl(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(blob); });
                stream.getTracks().forEach(t => t.stop());
                saveProgress(trackKey, { recorded: true });
            };
            recorder.start();
            setIsRecording(true);
        } catch {
            alert('Microphone access দরকার। Browser settings-এ allow করো।');
        }
    }

    function stopRecording() {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    }

    function playVocabWord(word: string) {
        const a = vocabAudioRef.current;
        if (!a) return;
        // Use Oxford proxy route — no CDN needed
        a.src = `/api/audio/oxford?word=${encodeURIComponent(word)}`;
        a.play().catch(() => {});
        setPlayingVocab(word);
    }

    function handleDictationSubmit() {
        if (!transcript) { setSubmitted(true); return; }
        const typedWords = dictationText.trim().split(/\s+/);
        const origWords = transcript.text.trim().split(/\s+/);
        const correct = typedWords.filter((w, i) =>
            w.toLowerCase().replace(/[^a-z']/g, '') === (origWords[i] || '').toLowerCase().replace(/[^a-z']/g, '')
        ).length;
        const pct = origWords.length ? Math.round((correct / origWords.length) * 100) : 0;
        saveProgress(trackKey, { score: pct });
        setSubmitted(true);
    }

    const sentences = transcript?.text
        ? (transcript.text.match(/[^.!?]+[.!?]+/g)?.map(s => s.trim()) || [transcript.text])
        : [];

    const tracks = Array.from({ length: selectedUnit.tracks }, (_, i) => i + 1);
    const currentTrackProg = progress[trackKey];
    const vocab = (selectedUnit as Unit & { vocabulary?: VocabItem[] }).vocabulary || [];

    function unitDoneCount(u: Unit) {
        return Array.from({ length: u.tracks }, (_, i) => `${u.unit}.${i + 1}`)
            .filter(k => (progress[k]?.played || 0) > 0).length;
    }

    const totalTracks = headwayData.units.reduce((s, u) => s + u.tracks, 0);
    const completedTracks = Object.values(progress).filter(p => (p?.played || 0) > 0).length;
    const completedUnits = headwayData.units.filter(u => unitDoneCount(u as Unit) === u.tracks).length;
    const overallPct = totalTracks ? Math.round((completedTracks / totalTracks) * 100) : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50/30">
            <audio ref={recordedAudioRef} />
            <audio ref={vocabAudioRef} onEnded={() => setPlayingVocab(null)} />

            {/* Header */}
            <div className="border-b border-slate-200 bg-white px-5 py-4 shadow-sm">
                <div className="mx-auto flex max-w-5xl items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h1 className="text-lg font-black text-slate-900">Spoken English Practice</h1>
                            <p className="text-[11px] text-slate-500">New Headway Beginner · Dictation, Shadowing & Vocab</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {([
                            ['listen', '🎧 শোনো'],
                            ['dictation', '✍️ Dictation'],
                            ['shadow', '🗣️ Shadow'],
                            ['vocab', '📖 Vocab'],
                        ] as [Mode, string][]).map(([m, label]) => (
                            <button key={m} onClick={() => setMode(m)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${mode === m ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Progress Stats Bar */}
            <div className="border-b border-slate-100 bg-white px-5 py-3">
                <div className="mx-auto max-w-5xl flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5">
                        <Flame size={14} className={streak > 0 ? 'text-orange-500' : 'text-slate-300'} />
                        <span className="text-sm font-black text-slate-700">{streak}</span>
                        <span className="text-[11px] text-slate-400">day streak</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Trophy size={14} className="text-amber-500" />
                        <span className="text-sm font-black text-slate-700">{completedUnits}/{headwayData.units.length}</span>
                        <span className="text-[11px] text-slate-400">units done</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-teal-600">{completedTracks}/{totalTracks}</span>
                        <span className="text-[11px] text-slate-400">tracks</span>
                    </div>
                    <div className="flex-1 min-w-[100px]">
                        <div className="h-2 w-full rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${overallPct}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{overallPct}% complete</p>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-5 py-6 space-y-5">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

                    {/* Unit list */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-1">
                        <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">Unit বেছে নাও</p>
                        <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                            {headwayData.units.map(u => {
                                const isFree = u.unit <= 3;
                                const isLocked = !isFree && plan !== 'spoken' && plan !== 'ielts_spoken';
                                const done = unitDoneCount(u as Unit);
                                const isSelected = selectedUnit.unit === u.unit;
                                return (
                                    <button key={u.unit}
                                        onClick={() => {
                                            if (isLocked) { window.location.href = '/dashboard/payment?required=spoken'; return; }
                                            setSelectedUnit(u as Unit);
                                            setSelectedTrack(1);
                                            setSentenceIdx(0);
                                        }}
                                        className={`w-full rounded-xl px-3 py-2.5 text-left transition ${isSelected ? 'bg-teal-600 text-white' : isLocked ? 'opacity-50 hover:bg-slate-50 text-slate-400' : 'hover:bg-slate-50 text-slate-700'}`}>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-black flex-shrink-0 ${isSelected ? 'text-teal-200' : 'text-teal-600'}`}>
                                                {isLocked ? '🔒' : u.unit}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold leading-tight truncate">{u.title}</p>
                                                <p className={`text-[10px] ${isSelected ? 'text-teal-200' : 'text-slate-400'}`}>
                                                    {isFree ? 'Free' : isLocked ? 'Subscribe' : `${u.tracks} tracks`}
                                                </p>
                                            </div>
                                            {done > 0 && !isLocked && (
                                                <span className={`text-[9px] font-black rounded-full px-1.5 py-0.5 flex-shrink-0 ${isSelected ? 'bg-white/20 text-white' : done === u.tracks ? 'bg-emerald-100 text-emerald-700' : 'bg-teal-100 text-teal-700'}`}>
                                                    {done}/{u.tracks}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main area */}
                    <div className="space-y-4 lg:col-span-2">

                        {/* Unit info — always visible */}
                        <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-cyan-50 p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-teal-600 mb-1">Unit {selectedUnit.unit}</p>
                                    <h2 className="text-xl font-black text-slate-900">{selectedUnit.title}</h2>
                                    <p className="text-xs text-slate-500 mt-1">{selectedUnit.topic}</p>
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {selectedUnit.grammar.split('·').map(g => (
                                            <span key={g} className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-bold text-teal-700">{g.trim()}</span>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => setShowNotes(p => !p)}
                                    className={`flex-shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${showNotes ? 'bg-amber-500 text-white' : 'bg-white text-amber-600 border border-amber-200 hover:bg-amber-50'}`}>
                                    <Info size={13} /> বাংলা Notes
                                </button>
                            </div>
                            {showNotes && (
                                <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-slate-700 leading-relaxed">
                                    {selectedUnit.bangla_notes}
                                </div>
                            )}
                        </div>

                        {/* ── VOCAB MODE ── */}
                        {mode === 'vocab' && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">
                                    📖 Unit {selectedUnit.unit} Vocabulary · Oxford 3000
                                </p>
                                {vocab.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-2.5">
                                        {vocab.map(v => (
                                            <div key={v.word} className="rounded-xl border border-slate-200 bg-slate-50 p-3 hover:border-teal-300 hover:bg-teal-50/40 transition">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-base font-black text-slate-900">{v.word}</span>
                                                    <button
                                                        onClick={() => playVocabWord(v.word)}
                                                        className={`rounded-lg p-1.5 transition ${playingVocab === v.word ? 'bg-teal-600 text-white animate-pulse' : 'bg-white border border-slate-200 text-slate-400 hover:text-teal-600 hover:border-teal-300'}`}>
                                                        <Volume2 size={13} />
                                                    </button>
                                                </div>
                                                <p className="text-xs font-bold text-teal-700 mb-1">{v.bangla}</p>
                                                <p className="text-[11px] text-slate-500 italic leading-relaxed">{v.example}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 text-center py-6">Vocabulary coming soon for this unit...</p>
                                )}
                            </div>
                        )}

                        {/* ── AUDIO MODES ── */}
                        {mode !== 'vocab' && (
                            <>
                                {/* Track selector */}
                                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                                            Track {selectedUnit.unit}.{selectedTrack}
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => { setSelectedTrack(p => Math.max(1, p - 1)); setSentenceIdx(0); }} disabled={selectedTrack === 1}
                                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30 transition">
                                                <ChevronLeft size={16} />
                                            </button>
                                            <button onClick={() => { setSelectedTrack(p => Math.min(selectedUnit.tracks, p + 1)); setSentenceIdx(0); }} disabled={selectedTrack === selectedUnit.tracks}
                                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30 transition">
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {tracks.map(t => {
                                            const tk = `${selectedUnit.unit}.${t}`;
                                            const tp = progress[tk];
                                            return (
                                                <button key={t}
                                                    onClick={() => { setSelectedTrack(t); setSentenceIdx(0); }}
                                                    className={`relative rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${selectedTrack === t ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                                    {selectedUnit.unit}.{t}
                                                    {(tp?.played || 0) > 0 && (
                                                        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {/* Track stats */}
                                    {currentTrackProg && (
                                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                                            {(currentTrackProg.played || 0) > 0 && (
                                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">{currentTrackProg.played}× played</span>
                                            )}
                                            {currentTrackProg.score !== null && (
                                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${(currentTrackProg.score || 0) >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    Dictation {currentTrackProg.score}%
                                                </span>
                                            )}
                                            {currentTrackProg.recorded && (
                                                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] text-indigo-700">🎙 Recorded</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Audio Player */}
                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <audio ref={audioRef}
                                        onTimeUpdate={e => setCurrentTime((e.target as HTMLAudioElement).currentTime)}
                                        onLoadedMetadata={e => setDuration((e.target as HTMLAudioElement).duration)}
                                        onEnded={() => {
                                            setIsPlaying(false);
                                            setPlayCount(p => p + 1);
                                            saveProgress(trackKey, { played: (progress[trackKey]?.played || 0) + 1 });
                                        }}
                                    />

                                    {/* Progress bar */}
                                    <div className="mb-4">
                                        <div className="relative h-2 w-full cursor-pointer rounded-full bg-slate-100"
                                            onClick={e => {
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                if (audioRef.current) audioRef.current.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
                                            }}>
                                            <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${progressPct}%` }} />
                                        </div>
                                        <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                                            <span>{Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}</span>
                                            <span>{Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center gap-4">
                                        <button onClick={restart} className="rounded-xl bg-slate-100 p-3 text-slate-600 hover:bg-slate-200 transition">
                                            <RotateCcw size={18} />
                                        </button>
                                        <button onClick={togglePlay}
                                            className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg shadow-teal-200 hover:bg-teal-500 transition">
                                            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                                        </button>
                                        <div className="flex flex-col items-center text-[10px] text-slate-400">
                                            <Volume2 size={16} />
                                            <span>{playCount}×</span>
                                        </div>
                                    </div>

                                    {/* Speed control */}
                                    <div className="mt-3 flex items-center justify-center gap-1.5">
                                        <span className="text-[10px] text-slate-400 mr-1">Speed:</span>
                                        {[0.5, 0.75, 1].map(s => (
                                            <button key={s} onClick={() => setPlaybackRate(s)}
                                                className={`rounded-lg px-3 py-1 text-xs font-bold transition ${playbackRate === s ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                                {s === 1 ? '1× Normal' : `${s}× Slow`}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Record & Compare */}
                                    <div className="mt-4 border-t border-slate-100 pt-3">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">🎙️ Record &amp; Compare</p>
                                        <div className="flex flex-wrap items-center gap-2">
                                            {isRecording ? (
                                                <button onClick={stopRecording}
                                                    className="flex items-center gap-1.5 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-bold text-white animate-pulse hover:bg-rose-400 transition">
                                                    <MicOff size={13} /> Stop Recording
                                                </button>
                                            ) : (
                                                <button onClick={startRecording}
                                                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition">
                                                    <Mic size={13} /> নিজের voice record করো
                                                </button>
                                            )}
                                            {recordedUrl && !isRecording && (
                                                <>
                                                    <button
                                                        onClick={() => { if (recordedAudioRef.current) { recordedAudioRef.current.src = recordedUrl; recordedAudioRef.current.play().catch(() => {}); } }}
                                                        className="flex items-center gap-1 rounded-lg bg-indigo-100 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-200 transition">
                                                        <Volume2 size={13} /> আমার voice
                                                    </button>
                                                    <button
                                                        onClick={() => { if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play().catch(() => {}); setIsPlaying(true); } }}
                                                        className="flex items-center gap-1 rounded-lg bg-teal-100 px-3 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-200 transition">
                                                        <Volume2 size={13} /> Original
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                        {isRecording && (
                                            <p className="mt-1.5 text-[10px] text-rose-500 animate-pulse">● Recording চলছে... শেষ হলে Stop চাপো</p>
                                        )}
                                        {recordedUrl && !isRecording && (
                                            <p className="mt-1.5 text-[10px] text-emerald-600">✅ Recording done। Original vs তোমার voice শুনে compare করো।</p>
                                        )}
                                    </div>

                                    {mode === 'dictation' && (
                                        <p className="mt-3 text-center text-[11px] text-slate-500">
                                            Audio শুনো → নিচে type করো → Submit
                                        </p>
                                    )}
                                </div>

                                {/* ── DICTATION ── */}
                                {mode === 'dictation' && (
                                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">✍️ শুনে type করো</p>
                                        {!submitted ? (
                                            <>
                                                <textarea
                                                    value={dictationText}
                                                    onChange={e => setDictationText(e.target.value)}
                                                    placeholder="Audio শুনে এখানে লেখো..."
                                                    rows={4}
                                                    className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-700 outline-none focus:border-teal-400 resize-none"
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={handleDictationSubmit}
                                                        disabled={!dictationText.trim() || !transcript}
                                                        className="flex-1 rounded-xl bg-teal-600 py-2.5 text-sm font-bold text-white hover:bg-teal-500 disabled:opacity-40 transition">
                                                        {transcript ? '✅ Check করো' : 'Transcript নেই — শুধু Listen করো'}
                                                    </button>
                                                    <button onClick={() => setDictationText('')}
                                                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-500 hover:bg-slate-50 transition">
                                                        Clear
                                                    </button>
                                                </div>
                                                {!transcript && !loadingTranscript && (
                                                    <p className="text-[11px] text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                                                        এই track-এর transcript এখনো add হয়নি। Audio শুনে practice চালিয়ে যাও।
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <div className="space-y-4">
                                                {transcript && <WordDiff typed={dictationText} original={transcript.text} />}
                                                <div className="rounded-xl border border-teal-100 bg-teal-50 p-3">
                                                    <p className="text-[11px] font-bold text-teal-700 mb-1">সঠিক উত্তর:</p>
                                                    <p className="text-sm text-slate-700 leading-relaxed">{transcript?.text}</p>
                                                    {transcript?.bangla && (
                                                        <p className="mt-2 text-xs text-slate-500 border-t border-teal-200 pt-2">{transcript.bangla}</p>
                                                    )}
                                                </div>
                                                <button onClick={() => { setSubmitted(false); setDictationText(''); restart(); }}
                                                    className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition">
                                                    আবার try করো
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ── SHADOW (sentence-by-sentence) ── */}
                                {mode === 'shadow' && (
                                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">
                                            🗣️ Sentence-by-Sentence Shadowing
                                        </p>
                                        {loadingTranscript ? (
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <div className="h-3 w-3 animate-spin rounded-full border-2 border-teal-400 border-t-transparent" />
                                                Loading...
                                            </div>
                                        ) : sentences.length > 0 ? (
                                            <div className="space-y-3">
                                                {/* Current sentence */}
                                                <div className="rounded-xl border-2 border-teal-400 bg-teal-50 p-4 text-center min-h-[80px] flex flex-col items-center justify-center">
                                                    <p className="text-[10px] font-bold text-teal-500 mb-2">{sentenceIdx + 1} / {sentences.length}</p>
                                                    <p className="text-base font-bold text-slate-900 leading-relaxed">{sentences[sentenceIdx]}</p>
                                                </div>
                                                <p className="text-center text-[11px] text-slate-400">Audio শুনো → এই sentence জোরে বলো → পরের sentence</p>

                                                {/* Navigation */}
                                                <div className="flex items-center justify-between gap-2">
                                                    <button
                                                        onClick={() => setSentenceIdx(p => Math.max(0, p - 1))}
                                                        disabled={sentenceIdx === 0}
                                                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition">
                                                        <ChevronLeft size={14} /> আগের
                                                    </button>
                                                    <button
                                                        onClick={() => setSentenceIdx(p => Math.min(sentences.length - 1, p + 1))}
                                                        disabled={sentenceIdx === sentences.length - 1}
                                                        className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-500 disabled:opacity-30 transition">
                                                        পরের <ChevronRight size={14} />
                                                    </button>
                                                </div>

                                                {/* All sentences (collapsible) */}
                                                <details className="group">
                                                    <summary className="cursor-pointer text-[11px] font-bold text-slate-400 hover:text-teal-600 transition list-none flex items-center gap-1 select-none">
                                                        ▼ সব sentences দেখো
                                                    </summary>
                                                    <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                                                        {sentences.map((s, i) => (
                                                            <button key={i} onClick={() => setSentenceIdx(i)}
                                                                className={`w-full text-left rounded-lg px-3 py-2 text-xs transition ${i === sentenceIdx ? 'bg-teal-100 font-bold text-teal-800' : 'text-slate-600 hover:bg-slate-50'}`}>
                                                                {i + 1}. {s}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </details>

                                                {transcript?.bangla && (
                                                    <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs text-slate-600">
                                                        <span className="font-bold text-amber-700">বাংলা: </span>{transcript.bangla}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs text-amber-700">
                                                এই track-এর transcript এখনো add হয়নি। Audio শুনে shadowing করো — transcript ছাড়াও practice হয়!
                                                <p className="mt-1 text-[10px] text-amber-600">💡 প্রতিটা sentence শুনে সাথে সাথে repeat করো।</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ── LISTEN TIPS ── */}
                                {mode === 'listen' && (
                                    <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-cyan-50 p-5">
                                        <p className="text-xs font-black uppercase tracking-widest text-teal-600 mb-3">💡 কীভাবে practice করবে</p>
                                        <div className="space-y-2 text-xs text-slate-600">
                                            {[
                                                ['প্রথমে Listen Only:', 'বুঝে বুঝে শোনো, কী বলছে বোঝার চেষ্টা করো।'],
                                                ['Shadowing করো:', 'Audio-র সাথে জোরে জোরে বলো — pronunciation শেখার সেরা উপায়।'],
                                                ['Dictation করো:', 'Audio শুনে type করো — spelling ও listening দুটোই শেখা হয়।'],
                                                ['Record & Compare:', 'নিজের voice record করো, Original-এর সাথে compare করো।'],
                                                ['Vocab শেখো:', '"📖 Vocab" tab-এ unit-এর key words Oxford pronunciation সহ শেখো।'],
                                                ['বারবার করো:', 'একটা track কমপক্ষে ৩-৫ বার শোনো।'],
                                            ].map(([title, desc], i) => (
                                                <div key={i} className="flex items-start gap-2">
                                                    <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-teal-600 text-[9px] font-black text-white">{i + 1}</span>
                                                    <p><strong>{title}</strong> {desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
