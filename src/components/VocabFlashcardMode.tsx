'use client';
import { useState, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Check, X, RotateCcw, Volume2, Mic, MicOff } from 'lucide-react';
import { VOCABULARY, TOPICS, POS_LABELS, POS_SHORT, CONNECTOR_TYPE_LABELS, type Topic, type PartOfSpeech, type BandLevel } from '../lib/vocabularyData';

const POS_COLORS: Record<PartOfSpeech, string> = {
    noun: 'bg-blue-100 text-blue-700',
    verb: 'bg-emerald-100 text-emerald-700',
    adjective: 'bg-violet-100 text-violet-700',
    adverb: 'bg-amber-100 text-amber-700',
};

const BAND_COLORS: Record<number, string> = {
    6: 'bg-sky-100 text-sky-700',
    7: 'bg-amber-100 text-amber-700',
    8: 'bg-rose-100 text-rose-700',
};

type PronResult = 'correct' | 'wrong' | null;

export default function VocabFlashcardMode() {
    const [topicFilter, setTopicFilter] = useState<Topic | 'all'>('all');
    const [posFilter, setPosFilter] = useState<PartOfSpeech | 'all'>('all');
    const [bandFilter, setBandFilter] = useState<BandLevel | 'all'>('all');
    const [currentIdx, setCurrentIdx] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [knownIds, setKnownIds] = useState<Set<string>>(new Set());
    const [sessionDone, setSessionDone] = useState(false);
    const [pronResult, setPronResult] = useState<PronResult>(null);
    const [isListening, setIsListening] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);

    const deck = useMemo(() => {
        const filtered = VOCABULARY.filter(
            (w) =>
                (topicFilter === 'all' || w.topic === topicFilter) &&
                (posFilter === 'all' || w.pos === posFilter) &&
                (bandFilter === 'all' || w.band === bandFilter),
        );
        return filtered;
    }, [topicFilter, posFilter, bandFilter]);

    const remaining = useMemo(() => deck.filter((w) => !knownIds.has(w.id)), [deck, knownIds]);
    const safeIdx = remaining.length > 0 ? currentIdx % remaining.length : 0;
    const card = remaining[safeIdx];

    function applyFilter() {
        setCurrentIdx(0);
        setFlipped(false);
        setKnownIds(new Set());
        setSessionDone(false);
    }

    function handleTopicFilter(t: Topic | 'all') {
        setTopicFilter(t);
        applyFilter();
    }
    function handlePosFilter(p: PartOfSpeech | 'all') {
        setPosFilter(p);
        applyFilter();
    }
    function handleBandFilter(b: BandLevel | 'all') {
        setBandFilter(b);
        applyFilter();
    }

    function markKnown() {
        if (!card) return;
        const newKnown = new Set([...knownIds, card.id]);
        setKnownIds(newKnown);
        setFlipped(false);
        setPronResult(null);
        const newRemaining = deck.filter((w) => !newKnown.has(w.id));
        if (newRemaining.length === 0) { setSessionDone(true); return; }
        setCurrentIdx((prev) => prev % newRemaining.length);
    }

    function markUnknown() {
        if (!card) return;
        setFlipped(false);
        setPronResult(null);
        setCurrentIdx((prev) => (prev + 1) % remaining.length);
    }

    function prev() {
        setFlipped(false);
        setPronResult(null);
        setCurrentIdx((prev) => (prev - 1 + remaining.length) % remaining.length);
    }

    function next() {
        setFlipped(false);
        setPronResult(null);
        setCurrentIdx((prev) => (prev + 1) % remaining.length);
    }

    function reset() {
        setKnownIds(new Set());
        setCurrentIdx(0);
        setFlipped(false);
        setSessionDone(false);
        setPronResult(null);
    }

    function speak(text: string) {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = 'en-GB';
            window.speechSynthesis.speak(utter);
        }
    }

    function checkPronunciation(targetWord: string) {
        if (typeof window === 'undefined') return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = window as any;
        const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('আপনার browser এ speech recognition সাপোর্ট নেই। Chrome বা Edge ব্যবহার করুন।');
            return;
        }
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 3;
        setIsListening(true);
        setPronResult(null);
        recognition.onresult = (e: SpeechRecognitionEvent) => {
            const results = Array.from(e.results[0]).map((r) => r.transcript.toLowerCase().trim());
            const target = targetWord.toLowerCase().trim();
            const matched = results.some((r) => r.includes(target) || target.includes(r));
            setPronResult(matched ? 'correct' : 'wrong');
            setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
    }

    const knownCount = knownIds.size;
    const totalCount = deck.length;
    const progressPct = totalCount > 0 ? (knownCount / totalCount) * 100 : 0;

    return (
        <div className="space-y-5">
            {/* Filters */}
            <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
                {/* Topic */}
                <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Topic</p>
                    <div className="flex flex-wrap gap-1.5">
                        <button
                            onClick={() => handleTopicFilter('all')}
                            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${topicFilter === 'all' ? 'bg-slate-900 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >সব</button>
                        {TOPICS.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => handleTopicFilter(t.id)}
                                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${topicFilter === t.id ? 'bg-slate-900 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >{t.icon} {t.label}</button>
                        ))}
                    </div>
                </div>
                {/* POS + Band */}
                <div className="flex flex-wrap gap-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">শব্দের ধরন</p>
                        <div className="flex flex-wrap gap-1.5">
                            {(['all', 'noun', 'verb', 'adjective', 'adverb'] as const).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => handlePosFilter(p as PartOfSpeech | 'all')}
                                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${posFilter === p ? 'bg-slate-900 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >{p === 'all' ? 'সব' : POS_SHORT[p as PartOfSpeech]}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Band Level</p>
                        <div className="flex gap-1.5">
                            {(['all', 6, 7, 8] as const).map((b) => (
                                <button
                                    key={b}
                                    onClick={() => handleBandFilter(b as BandLevel | 'all')}
                                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${bandFilter === b ? 'bg-slate-900 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >{b === 'all' ? 'সব' : `Band ${b}`}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-400 transition-all duration-500" style={{ width: `${progressPct}%` }} />
                </div>
                <p className="text-xs font-bold text-slate-500 whitespace-nowrap">
                    {knownCount} / {totalCount} জানি
                </p>
                {knownCount > 0 && (
                    <button onClick={reset} className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-700 transition">
                        <RotateCcw size={12} /> Reset
                    </button>
                )}
            </div>

            {/* Done screen */}
            {sessionDone ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center space-y-4">
                    <div className="text-5xl">🎉</div>
                    <h3 className="text-xl font-black text-emerald-900">সব শব্দ শেষ!</h3>
                    <p className="text-sm text-emerald-700">তুমি {totalCount}টা শব্দ practice করেছো।</p>
                    <button onClick={reset} className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 transition">
                        আবার শুরু করো
                    </button>
                </div>
            ) : deck.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
                    এই filter এ কোনো শব্দ নেই।
                </div>
            ) : (
                <>
                    {/* Card */}
                    <div
                        onClick={() => setFlipped((f) => !f)}
                        className="cursor-pointer rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow min-h-[280px] flex flex-col justify-between p-6 select-none"
                    >
                        {!flipped ? (
                            // Front
                            <div className="flex flex-col items-center justify-center flex-1 text-center gap-4">
                                <div className="flex items-center gap-2 flex-wrap justify-center">
                                    <span className={`rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${POS_COLORS[card.pos]}`}>
                                        {POS_SHORT[card.pos]}
                                    </span>
                                    <span className={`rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${BAND_COLORS[card.band]}`}>
                                        Band {card.band}
                                    </span>
                                    <span className="rounded-lg border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                                        {TOPICS.find((t) => t.id === card.topic)?.icon} {TOPICS.find((t) => t.id === card.topic)?.label}
                                    </span>
                                    {card.connectorType && (
                                        <span className="rounded-lg bg-teal-50 border border-teal-200 px-2.5 py-1 text-[10px] font-black text-teal-700">
                                            {CONNECTOR_TYPE_LABELS[card.connectorType]}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black text-slate-900">{card.word}</h2>
                                    {card.ipa && <p className="mt-2 text-sm font-mono text-slate-400">{card.ipa}</p>}
                                </div>
                                <div className="flex items-center gap-2 flex-wrap justify-center">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); speak(card.word); }}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition"
                                    >
                                        <Volume2 size={12} /> শোনো
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); checkPronunciation(card.word); }}
                                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
                                            isListening
                                                ? 'border-rose-300 bg-rose-50 text-rose-600 animate-pulse'
                                                : pronResult === 'correct'
                                                ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                                                : pronResult === 'wrong'
                                                ? 'border-rose-300 bg-rose-50 text-rose-700'
                                                : 'border-violet-200 text-violet-600 hover:bg-violet-50'
                                        }`}
                                    >
                                        {isListening ? <MicOff size={12} /> : <Mic size={12} />}
                                        {isListening ? 'শুনছি...' : pronResult === 'correct' ? '✓ সঠিক!' : pronResult === 'wrong' ? '✗ চেষ্টা করো' : 'উচ্চারণ চেক'}
                                    </button>
                                </div>
                                <p className="text-xs text-slate-400">card tap করো — অর্থ দেখতে</p>
                            </div>
                        ) : (
                            // Back
                            <div className="flex flex-col gap-4 flex-1">
                                <div className="text-center">
                                    <p className="text-lg font-black text-slate-400">{card.word}</p>
                                    <p className="text-sm font-mono text-slate-400">{card.ipa}</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">{POS_LABELS[card.pos]}</p>
                                </div>
                                <div className="rounded-xl bg-teal-50 border border-teal-200 px-5 py-4 text-center">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-teal-500 mb-1">বাংলা অর্থ</p>
                                    <p className="text-2xl font-black text-teal-900">{card.bangla}</p>
                                </div>
                                <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Definition</p>
                                    <p className="text-sm text-slate-700">{card.definition}</p>
                                </div>
                                <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-blue-400 mb-1">Example</p>
                                    <p className="text-sm text-slate-700 italic">"{card.example}"</p>
                                </div>
                                {card.forms && Object.values(card.forms).some(Boolean) && (
                                    <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                                        <p className="text-[10px] font-black uppercase tracking-wider text-amber-500 mb-2">Word Family</p>
                                        <div className="flex flex-wrap gap-2">
                                            {card.forms.noun && <span className="rounded bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-700">n. {card.forms.noun}</span>}
                                            {card.forms.verb && <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">v. {card.forms.verb}</span>}
                                            {card.forms.adjective && <span className="rounded bg-violet-100 px-2 py-0.5 text-[11px] font-bold text-violet-700">adj. {card.forms.adjective}</span>}
                                            {card.forms.adverb && <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">adv. {card.forms.adverb}</span>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-3">
                        <button onClick={prev} className="rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50 transition">
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={markUnknown}
                            className="flex-1 rounded-xl border-2 border-rose-200 bg-rose-50 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-100 transition inline-flex items-center justify-center gap-2"
                        >
                            <X size={16} /> জানি না
                        </button>
                        <button
                            onClick={markKnown}
                            className="flex-1 rounded-xl border-2 border-emerald-200 bg-emerald-50 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition inline-flex items-center justify-center gap-2"
                        >
                            <Check size={16} /> জানি
                        </button>
                        <button onClick={next} className="rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50 transition">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                    <p className="text-center text-xs text-slate-400">{safeIdx + 1} / {remaining.length} বাকি আছে</p>
                </>
            )}
        </div>
    );
}
