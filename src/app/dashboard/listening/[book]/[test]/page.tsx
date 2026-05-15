'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ChevronLeft, Play, Pause, RotateCcw, CheckCircle,
    XCircle, Clock, Volume2, Trophy, ChevronRight,
} from 'lucide-react';
import { ListeningTest, ListeningSection, QGroup, Question } from '../../../../../lib/listeningData';
import { getMapPage } from '../../../../../lib/listeningMapPages';
import PDFPageViewer from '../../../../../components/PDFPageViewer';

const BOOK_PDF: Record<number, string> = {
    9:  'Cambridge IELTS 09 www.iac-uk.com.pdf',
    10: 'Cambridge IELTS 10 www.iac-uk.com.pdf',
    11: 'Cambridge IELTS 11 AC www.iac-uk.com.pdf',
    12: 'Cambridge IELTS 12 www.iac-uk.com.pdf',
    13: 'Cambridge IELTS 13 www.iac-uk.com.pdf',
    14: 'Cambridge IELTS 14 www.iac-uk.com.pdf',
    15: 'Cambridge IELTS 15.pdf',
};

function isMapInstruction(instruction: string) {
    return /label.*(map|plan|diagram)/i.test(instruction);
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function fmtTime(s: number) {
    const m = Math.floor(s / 60);
    return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

function checkFill(user: string, correct: string): boolean {
    const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
    return correct.split('/').map(norm).includes(norm(user));
}

function collectRequired(group: QGroup): string[] {
    const seen = new Set<string>();
    for (const q of group.qs) {
        const ans = Array.isArray(q.ans) ? q.ans : [q.ans as string];
        for (const a of ans) if (!seen.has(a)) seen.add(a);
    }
    return [...seen];
}

function scoreTest(data: ListeningTest, answers: Record<number, string | string[]>) {
    let correct = 0, total = 0;
    for (const sec of data.sections) {
        for (const grp of sec.groups) {
            if (grp.type === 'fill' || grp.type === 'short') {
                for (const q of grp.qs) {
                    total++;
                    if (checkFill((answers[q.n] as string) || '', q.ans as string)) correct++;
                }
            } else if (grp.type === 'mcq') {
                for (const q of grp.qs) {
                    total++;
                    if ((answers[q.n] as string) === (q.ans as string)) correct++;
                }
            } else if (grp.type === 'match') {
                for (const q of grp.qs) {
                    total++;
                    if ((answers[q.n] as string) === (q.ans as string)) correct++;
                }
            } else if (grp.type === 'multi') {
                const req = collectRequired(grp);
                const sel = (answers[grp.range[0]] as string[]) || [];
                for (const r of req) {
                    total++;
                    if (sel.includes(r)) correct++;
                }
            }
        }
    }
    return { correct, total };
}

// ─── Audio Player ─────────────────────────────────────────────────────────────

function AudioPlayer({ book, test, section }: { book: number; test: number; section: number }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);
    const [current, setCurrent] = useState(0);
    const [duration, setDuration] = useState(0);
    const [loading, setLoading] = useState(false);
    const [audioError, setAudioError] = useState(false);

    useEffect(() => {
        setPlaying(false);
        setCurrent(0);
        setDuration(0);
        setAudioError(false);
        if (audioRef.current) audioRef.current.load();
    }, [section]);

    const toggle = () => {
        const a = audioRef.current;
        if (!a) return;
        if (playing) {
            a.pause();
            setPlaying(false);
        } else {
            setLoading(true);
            a.play()
                .then(() => { setPlaying(true); setLoading(false); })
                .catch(() => { setAudioError(true); setLoading(false); });
        }
    };

    return (
        <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 mb-5">
            <audio
                ref={audioRef}
                src={`/api/audio/stream?book=${book}&test=${test}&part=${section}`}
                onTimeUpdate={() => setCurrent(audioRef.current?.currentTime ?? 0)}
                onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
                onEnded={() => setPlaying(false)}
                preload="metadata"
            />
            <div className="flex items-center gap-3">
                <button
                    onClick={toggle}
                    disabled={loading || audioError}
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 transition shadow-md shadow-blue-200"
                >
                    {loading
                        ? <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        : playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />
                    }
                </button>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <Volume2 size={13} className="text-blue-500 flex-shrink-0" />
                        <p className="text-xs font-bold text-blue-800">Section {section} Audio</p>
                        {audioError && <span className="text-[10px] text-red-500 font-bold">— file not found</span>}
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={current}
                        onChange={e => {
                            const t = Number(e.target.value);
                            if (audioRef.current) audioRef.current.currentTime = t;
                            setCurrent(t);
                        }}
                        className="w-full h-1.5 accent-blue-600 rounded"
                    />
                    <div className="flex justify-between text-[11px] text-blue-600 font-mono mt-0.5">
                        <span>{fmtTime(current)}</span>
                        <span>{duration ? fmtTime(duration) : '--:--'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Question group renderers ──────────────────────────────────────────────────

function FillGroup({ group, answers, submitted, onChange }: {
    group: QGroup;
    answers: Record<number, string>;
    submitted: boolean;
    onChange: (n: number, v: string) => void;
}) {
    return (
        <div>
            {group.title && (
                <div className="mb-3 rounded-lg bg-slate-100 border border-slate-200 px-4 py-2">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-600">{group.title}</p>
                </div>
            )}
            <div className="space-y-1">
                {group.qs.map(q => {
                    const val = answers[q.n] || '';
                    const ok = submitted && checkFill(val, q.ans as string);
                    const bad = submitted && !ok;
                    return (
                        <div key={q.n} className={`flex flex-wrap items-center gap-x-1.5 gap-y-1 leading-loose py-0.5 text-sm rounded px-1 ${bad ? 'bg-red-50' : ok ? 'bg-emerald-50' : ''}`}>
                            <span className="text-[11px] font-bold text-slate-400 w-6 text-right flex-shrink-0">{q.n}.</span>
                            {q.pre && <span className="text-slate-700">{q.pre}</span>}
                            <input
                                type="text"
                                value={val}
                                onChange={e => onChange(q.n, e.target.value)}
                                disabled={submitted}
                                placeholder="___________"
                                className={`border-b-2 bg-transparent px-1.5 outline-none text-center transition text-sm ${
                                    ok ? 'border-emerald-500 text-emerald-700 font-bold' :
                                    bad ? 'border-red-400 text-red-600' :
                                    'border-slate-400 focus:border-blue-500'
                                }`}
                                style={{ minWidth: 110, maxWidth: 220 }}
                            />
                            {q.post && <span className="text-slate-700">{q.post}</span>}
                            {bad && (
                                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                    ✓ {q.ans as string}
                                </span>
                            )}
                            {q.note && !submitted && (
                                <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">{q.note}</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function McqGroup({ group, answers, submitted, onChange }: {
    group: QGroup;
    answers: Record<number, string>;
    submitted: boolean;
    onChange: (n: number, v: string) => void;
}) {
    return (
        <div className="space-y-5">
            {group.qs.map(q => {
                const sel = answers[q.n] || '';
                const ok = submitted && sel === q.ans;
                return (
                    <div key={q.n}>
                        <p className="text-sm font-semibold text-slate-800 mb-2 leading-snug">
                            <span className="text-[11px] font-bold text-slate-400 mr-1.5">{q.n}.</span>
                            {q.q}
                        </p>
                        <div className="space-y-1.5 ml-5">
                            {(q.opts || []).map(opt => {
                                const letter = opt.charAt(0);
                                const isSelected = sel === letter;
                                const isCorrect = submitted && letter === (q.ans as string);
                                const isWrong = submitted && isSelected && !isCorrect;
                                return (
                                    <label key={letter} className={`flex items-start gap-2.5 rounded-lg px-3 py-2 cursor-pointer transition text-sm select-none ${
                                        isCorrect ? 'bg-emerald-50 border border-emerald-300 text-emerald-800' :
                                        isWrong ? 'bg-red-50 border border-red-300 text-red-700' :
                                        isSelected ? 'bg-blue-50 border border-blue-300 text-blue-900' :
                                        'border border-transparent hover:bg-slate-50'
                                    }`}>
                                        <input
                                            type="radio"
                                            name={`mcq-${q.n}`}
                                            value={letter}
                                            checked={isSelected}
                                            disabled={submitted}
                                            onChange={() => onChange(q.n, letter)}
                                            className="mt-0.5 accent-blue-600 flex-shrink-0"
                                        />
                                        <span>{opt}</span>
                                    </label>
                                );
                            })}
                        </div>
                        {submitted && !ok && (
                            <p className="ml-5 mt-1 text-xs font-bold text-emerald-700">
                                ✓ Correct: {q.ans as string}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function MultiGroup({ group, answer, submitted, onChange }: {
    group: QGroup;
    answer: string[];
    submitted: boolean;
    onChange: (v: string[]) => void;
}) {
    const chooseN = group.range[1] - group.range[0] + 1;
    const options = group.pool ?? (group.qs.find(q => q.opts && q.opts.length > 0)?.opts ?? []);
    const required = collectRequired(group);
    const sel = answer || [];

    const toggle = (letter: string) => {
        if (submitted) return;
        if (sel.includes(letter)) onChange(sel.filter(l => l !== letter));
        else if (sel.length < chooseN) onChange([...sel, letter]);
    };

    const allCorrect = submitted && required.every(r => sel.includes(r)) && sel.length === required.length;

    return (
        <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">
                <span className="text-[11px] font-bold text-slate-400 mr-1.5">{group.range[0]}–{group.range[1]}.</span>
                {group.qs[0]?.q && !group.qs[0].q.startsWith('(same') ? group.qs[0].q : group.instruction}
            </p>
            <div className="space-y-1.5 ml-5">
                {options.map(opt => {
                    const letter = opt.charAt(0);
                    const isSelected = sel.includes(letter);
                    const isRequired = required.includes(letter);
                    const isCorrectSel = submitted && isSelected && isRequired;
                    const isMissed = submitted && !isSelected && isRequired;
                    const isWrong = submitted && isSelected && !isRequired;
                    return (
                        <label key={letter} className={`flex items-start gap-2.5 rounded-lg px-3 py-2 cursor-pointer transition text-sm select-none ${
                            isCorrectSel ? 'bg-emerald-50 border border-emerald-300 text-emerald-800' :
                            isMissed ? 'bg-amber-50 border border-amber-300 text-amber-700' :
                            isWrong ? 'bg-red-50 border border-red-300 text-red-700' :
                            isSelected ? 'bg-blue-50 border border-blue-300 text-blue-900' :
                            'border border-transparent hover:bg-slate-50'
                        }`}>
                            <input
                                type="checkbox"
                                checked={isSelected}
                                disabled={submitted || (!isSelected && sel.length >= chooseN)}
                                onChange={() => toggle(letter)}
                                className="mt-0.5 accent-blue-600 flex-shrink-0"
                            />
                            <span>{opt}</span>
                            {isMissed && <span className="ml-auto text-xs font-bold text-amber-600">missed</span>}
                        </label>
                    );
                })}
            </div>
            {!submitted && (
                <p className="ml-5 mt-1.5 text-xs text-slate-500">
                    Choose {chooseN} · {sel.length}/{chooseN} selected
                </p>
            )}
            {submitted && (
                <p className={`ml-5 mt-1.5 text-xs font-bold ${allCorrect ? 'text-emerald-600' : 'text-amber-600'}`}>
                    ✓ Correct: {required.join(', ')}
                </p>
            )}
        </div>
    );
}

function MatchGroup({ group, answers, submitted, onChange }: {
    group: QGroup;
    answers: Record<number, string>;
    submitted: boolean;
    onChange: (n: number, v: string) => void;
}) {
    const pool = group.pool || [];
    return (
        <div>
            {pool.length > 0 && (
                <div className="mb-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    {group.poolLabel && (
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{group.poolLabel}</p>
                    )}
                    <div className="grid gap-1 sm:grid-cols-2">
                        {pool.map(item => <p key={item} className="text-sm text-slate-700">{item}</p>)}
                    </div>
                </div>
            )}
            <div className="space-y-2">
                {group.qs.map(q => {
                    const sel = answers[q.n] || '';
                    const ok = submitted && sel === (q.ans as string);
                    const bad = submitted && !ok;
                    return (
                        <div key={q.n} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 border transition ${
                            ok ? 'bg-emerald-50 border-emerald-200' :
                            bad ? 'bg-red-50 border-red-200' :
                            'border-slate-100 bg-white'
                        }`}>
                            <span className="text-[11px] font-bold text-slate-400 w-5 flex-shrink-0">{q.n}.</span>
                            <span className="flex-1 text-sm text-slate-800">{q.q}</span>
                            <select
                                value={sel}
                                disabled={submitted}
                                onChange={e => onChange(q.n, e.target.value)}
                                className={`border rounded-lg px-2 py-1 text-sm outline-none transition flex-shrink-0 ${
                                    ok ? 'border-emerald-400 bg-emerald-50 text-emerald-800 font-bold' :
                                    bad && sel ? 'border-red-400 bg-red-50 text-red-700 font-bold' :
                                    'border-slate-300 bg-white focus:border-blue-400'
                                }`}
                            >
                                <option value="">—</option>
                                {pool.map(item => {
                                    const letter = item.charAt(0);
                                    return <option key={letter} value={letter}>{letter}</option>;
                                })}
                            </select>
                            {bad && sel && (
                                <span className="text-xs font-bold text-emerald-700 flex-shrink-0">✓ {q.ans as string}</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Section panel ─────────────────────────────────────────────────────────────

function SectionPanel({ sec, book, test, answers, submitted, onChange }: {
    sec: ListeningSection;
    book: number;
    test: number;
    answers: Record<number, string | string[]>;
    submitted: boolean;
    onChange: (n: number, v: string | string[]) => void;
}) {
    const fillAns = (n: number) => (answers[n] as string) || '';
    const multiAns = (n: number) => (answers[n] as string[]) || [];
    const pdfFile = BOOK_PDF[book];
    void pdfFile; // used in fallback link below

    return (
        <div className="space-y-6">
            <AudioPlayer book={book} test={test} section={sec.section} />

            {sec.groups.map((grp, gi) => (
                <div key={gi} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-200 px-2 py-1 rounded-full">
                            Questions {grp.range[0]}–{grp.range[1]}
                        </span>
                        <p className="mt-2 text-sm font-semibold text-slate-700">{grp.instruction}</p>
                        {grp.limit && (
                            <p className="mt-0.5 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded inline-block">
                                Write {grp.limit}
                            </p>
                        )}
                        {isMapInstruction(grp.instruction) && (() => {
                            const mapInfo = getMapPage(book, test, sec.section);
                            if (mapInfo) {
                                return (
                                    <PDFPageViewer
                                        pdfUrl={`/pdfs/cambridge/${encodeURIComponent(mapInfo.pdfFile)}`}
                                        pageNumber={mapInfo.page}
                                        label="Map / Plan / Diagram"
                                    />
                                );
                            }
                            const fb = BOOK_PDF[book];
                            if (fb) return (
                                <a href={`/pdfs/cambridge/${encodeURIComponent(fb)}`} target="_blank" rel="noopener noreferrer"
                                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100 transition">
                                    📄 View Map / Diagram in PDF
                                </a>
                            );
                            return null;
                        })()}
                    </div>

                    {(grp.type === 'fill' || grp.type === 'short') && (
                        <FillGroup
                            group={grp}
                            answers={answers as Record<number, string>}
                            submitted={submitted}
                            onChange={(n, v) => onChange(n, v)}
                        />
                    )}
                    {grp.type === 'mcq' && (
                        <McqGroup
                            group={grp}
                            answers={answers as Record<number, string>}
                            submitted={submitted}
                            onChange={(n, v) => onChange(n, v)}
                        />
                    )}
                    {grp.type === 'multi' && (
                        <MultiGroup
                            group={grp}
                            answer={multiAns(grp.range[0])}
                            submitted={submitted}
                            onChange={v => onChange(grp.range[0], v)}
                        />
                    )}
                    {grp.type === 'match' && (
                        <MatchGroup
                            group={grp}
                            answers={answers as Record<number, string>}
                            submitted={submitted}
                            onChange={(n, v) => onChange(n, v)}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

// ─── Score result ──────────────────────────────────────────────────────────────

function bandFromScore(correct: number, total: number): string {
    const pct = correct / total;
    if (pct >= 0.9) return '8.5–9.0';
    if (pct >= 0.8) return '7.5–8.0';
    if (pct >= 0.7) return '6.5–7.0';
    if (pct >= 0.6) return '6.0';
    if (pct >= 0.5) return '5.5';
    if (pct >= 0.4) return '5.0';
    return '4.0–4.5';
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function ListeningTestPage() {
    const params = useParams();
    const book = Number(params.book);
    const test = Number(params.test);

    const [fetchedData, setFetchedData] = useState<ListeningTest | null | undefined>(undefined);
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        setFetchLoading(true);
        fetch(`/api/listening/data?book=${book}&test=${test}`)
            .then(r => (r.ok ? r.json() : null))
            .then((d: ListeningTest | null) => { setFetchedData(d); setFetchLoading(false); })
            .catch(() => { setFetchedData(null); setFetchLoading(false); });
    }, [book, test]);

    const data: ListeningTest | null | undefined = fetchLoading ? undefined : fetchedData;

    const [activeSection, setActiveSection] = useState(1);
    const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState<{ correct: number; total: number } | null>(null);
    const [timeLeft, setTimeLeft] = useState(1800);
    const [timerStarted, setTimerStarted] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!timerStarted || submitted) return;
        timerRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(timerRef.current!);
                    doSubmit();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current!);
    }, [timerStarted, submitted]);

    const setAnswer = (n: number, v: string | string[]) => {
        if (!timerStarted) setTimerStarted(true);
        setAnswers(prev => ({ ...prev, [n]: v }));
    };

    const doSubmit = () => {
        if (!data) return;
        clearInterval(timerRef.current!);
        const r = scoreTest(data, answers);
        setResult(r);
        setSubmitted(true);
    };

    const reset = () => {
        setAnswers({});
        setSubmitted(false);
        setResult(null);
        setTimeLeft(1800);
        setTimerStarted(false);
        setActiveSection(1);
    };

    if (data === undefined) {
        return (
            <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center px-5">
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center max-w-sm w-full shadow-sm">
                    <div className="flex justify-center mb-4">
                        <span className="h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                    </div>
                    <p className="text-sm text-slate-500">Loading Cambridge {book} Test {test}…</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center px-5">
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center max-w-sm w-full shadow-sm">
                    <p className="text-4xl mb-4">🎧</p>
                    <h1 className="text-xl font-black text-slate-900">Not Available Yet</h1>
                    <p className="mt-2 text-sm text-slate-500">Questions for Cambridge {book} Test {test} are coming soon.</p>
                    <Link href="/dashboard/listening" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-500 transition">
                        <ChevronLeft size={15} /> Back
                    </Link>
                </div>
            </div>
        );
    }

    const timeDanger = timeLeft < 300;

    return (
        <div className="min-h-screen bg-[#f5f6fa]">
            {/* Sticky top bar */}
            <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm">
                <div className="mx-auto max-w-3xl flex items-center gap-3 px-4 py-3">
                    <Link href="/dashboard/listening" className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition text-sm flex-shrink-0">
                        <ChevronLeft size={16} /> Back
                    </Link>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-900 truncate">Cambridge {book} · Test {test} · Listening</p>
                        <p className="text-[10px] text-slate-500 truncate hidden sm:block">
                            {data.sections[activeSection - 1]?.topic}
                        </p>
                    </div>
                    <div className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-black font-mono flex-shrink-0 ${
                        submitted ? 'bg-slate-100 text-slate-500' :
                        timeDanger ? 'bg-red-100 text-red-700 animate-pulse' :
                        timerStarted ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                        <Clock size={13} />
                        {fmtTime(timeLeft)}
                    </div>
                    {!submitted ? (
                        <button
                            onClick={doSubmit}
                            className="flex-shrink-0 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-500 transition shadow-sm"
                        >
                            Submit
                        </button>
                    ) : (
                        <button
                            onClick={reset}
                            className="flex-shrink-0 flex items-center gap-1.5 rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700 transition"
                        >
                            <RotateCcw size={13} /> Retry
                        </button>
                    )}
                </div>

                {/* Section tabs */}
                <div className="mx-auto max-w-3xl flex gap-0 px-4 pb-0 overflow-x-auto">
                    {data.sections.map(sec => {
                        const isActive = sec.section === activeSection;
                        return (
                            <button
                                key={sec.section}
                                onClick={() => setActiveSection(sec.section)}
                                className={`flex-shrink-0 px-4 py-2.5 text-sm font-bold border-b-2 transition-all ${
                                    isActive
                                        ? 'border-blue-600 text-blue-700'
                                        : 'border-transparent text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                Section {sec.section}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Score banner */}
            {submitted && result && (
                <div className={`border-b ${result.correct / result.total >= 0.7 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                    <div className="mx-auto max-w-3xl px-5 py-4 flex flex-wrap items-center gap-4">
                        <Trophy size={24} className={result.correct / result.total >= 0.7 ? 'text-emerald-600' : 'text-amber-600'} />
                        <div>
                            <p className="text-lg font-black text-slate-900">
                                {result.correct} / {result.total} correct
                            </p>
                            <p className="text-sm text-slate-600">
                                Estimated Band: <span className="font-black text-blue-700">{bandFromScore(result.correct, result.total)}</span>
                            </p>
                        </div>
                        <div className="flex gap-6 ml-auto text-sm">
                            <div className="text-center">
                                <p className="text-2xl font-black text-emerald-700">{result.correct}</p>
                                <p className="text-xs text-slate-500">Correct</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-black text-red-600">{result.total - result.correct}</p>
                                <p className="text-xs text-slate-500">Wrong</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-black text-blue-700">{Math.round(result.correct / result.total * 100)}%</p>
                                <p className="text-xs text-slate-500">Score</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Section content */}
            <div className="mx-auto max-w-3xl px-5 py-6">
                <div className="mb-5">
                    <h2 className="text-lg font-black text-slate-900">
                        Section {activeSection}:&nbsp;
                        <span className="text-blue-700">{data.sections[activeSection - 1]?.topic}</span>
                    </h2>
                </div>

                {data.sections
                    .filter(s => s.section === activeSection)
                    .map(sec => (
                        <SectionPanel
                            key={sec.section}
                            sec={sec}
                            book={book}
                            test={test}
                            answers={answers}
                            submitted={submitted}
                            onChange={setAnswer}
                        />
                    ))}

                {/* Next section button */}
                {activeSection < 4 && (
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => setActiveSection(s => Math.min(4, s + 1))}
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-700 transition"
                        >
                            Section {activeSection + 1} <ChevronRight size={15} />
                        </button>
                    </div>
                )}
                {activeSection === 4 && !submitted && (
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={doSubmit}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-500 transition shadow-md"
                        >
                            <CheckCircle size={16} /> Submit Test
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
