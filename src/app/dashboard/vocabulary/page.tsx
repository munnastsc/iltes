'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, BookOpen, Search, ChevronDown, ChevronUp, Volume2 } from 'lucide-react';
import VocabFlashcardMode from '../../../components/VocabFlashcardMode';
import VocabQuizMode from '../../../components/VocabQuizMode';
import { VOCABULARY, TOPICS, POS_LABELS, POS_SHORT, CONNECTOR_TYPE_LABELS, type Topic, type PartOfSpeech, type BandLevel } from '../../../lib/vocabularyData';

type Tab = 'flashcard' | 'quiz' | 'list';

const TABS: Array<{ id: Tab; label: string; sub: string; color: string; active: string }> = [
    { id: 'flashcard', label: 'ফ্ল্যাশকার্ড', sub: 'Flashcard Study', color: 'text-teal-600', active: 'bg-teal-600' },
    { id: 'quiz', label: 'কুইজ', sub: 'MCQ Practice', color: 'text-violet-600', active: 'bg-violet-600' },
    { id: 'list', label: 'শব্দতালিকা', sub: 'Full Word List', color: 'text-slate-600', active: 'bg-slate-700' },
];

const POS_BADGE: Record<PartOfSpeech, string> = {
    noun: 'bg-blue-100 text-blue-700',
    verb: 'bg-emerald-100 text-emerald-700',
    adjective: 'bg-violet-100 text-violet-700',
    adverb: 'bg-amber-100 text-amber-700',
};

const BAND_BADGE: Record<number, string> = {
    6: 'bg-sky-100 text-sky-700',
    7: 'bg-amber-100 text-amber-700',
    8: 'bg-rose-100 text-rose-700',
};

function WordCard({ word }: { word: typeof VOCABULARY[0] }) {
    const [open, setOpen] = useState(false);

    function speak() {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            const utter = new SpeechSynthesisUtterance(word.word);
            utter.lang = 'en-GB';
            window.speechSynthesis.speak(utter);
        }
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-black text-slate-900 text-sm">{word.word}</span>
                            <span className={`rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${POS_BADGE[word.pos]}`}>{POS_SHORT[word.pos]}</span>
                            <span className={`rounded px-1.5 py-0.5 text-[9px] font-black ${BAND_BADGE[word.band]}`}>B{word.band}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-mono text-slate-400">{word.ipa}</span>
                        </div>
                    </div>
                    <span className="text-sm font-bold text-teal-700 shrink-0">{word.bangla}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    <button
                        onClick={speak}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                        title="Pronunciation"
                    >
                        <Volume2 size={13} />
                    </button>
                    <button
                        onClick={() => setOpen((o) => !o)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                    >
                        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                </div>
            </div>
            {open && (
                <div className="border-t border-slate-100 px-4 py-3 space-y-2 bg-slate-50">
                    <p className="text-xs text-slate-700">{word.definition}</p>
                    <p className="text-xs text-slate-500 italic">"{word.example}"</p>
                    {word.connectorType && (
                        <span className="inline-block rounded bg-teal-50 border border-teal-200 px-2 py-0.5 text-[10px] font-black text-teal-700">
                            {CONNECTOR_TYPE_LABELS[word.connectorType]}
                        </span>
                    )}
                    {word.forms && Object.values(word.forms).some(Boolean) && (
                        <div className="flex flex-wrap gap-1.5">
                            {word.forms.noun && <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">n. {word.forms.noun}</span>}
                            {word.forms.verb && <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">v. {word.forms.verb}</span>}
                            {word.forms.adjective && <span className="rounded bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">adj. {word.forms.adjective}</span>}
                            {word.forms.adverb && <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">adv. {word.forms.adverb}</span>}
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Topic:</span>
                        <span className="text-[10px] text-slate-600">
                            {TOPICS.find((t) => t.id === word.topic)?.icon} {TOPICS.find((t) => t.id === word.topic)?.label}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function VocabularyPage() {
    const [tab, setTab] = useState<Tab>('flashcard');

    // Word list filters
    const [search, setSearch] = useState('');
    const [listTopic, setListTopic] = useState<Topic | 'all'>('all');
    const [listPos, setListPos] = useState<PartOfSpeech | 'all'>('all');
    const [listBand, setListBand] = useState<BandLevel | 'all'>('all');

    const filteredList = useMemo(() => {
        const q = search.toLowerCase().trim();
        return VOCABULARY.filter((w) =>
            (listTopic === 'all' || w.topic === listTopic) &&
            (listPos === 'all' || w.pos === listPos) &&
            (listBand === 'all' || w.band === listBand) &&
            (!q || w.word.toLowerCase().includes(q) || w.bangla.includes(q) || w.definition.toLowerCase().includes(q)),
        );
    }, [search, listTopic, listPos, listBand]);

    const bandCounts = useMemo(() => ({
        6: VOCABULARY.filter((w) => w.band === 6).length,
        7: VOCABULARY.filter((w) => w.band === 7).length,
        8: VOCABULARY.filter((w) => w.band === 8).length,
    }), []);

    return (
        <div className="min-h-screen bg-[#f5f6fa]">

            {/* Header */}
            <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 px-5 py-8 lg:px-10">
                <div className="mx-auto max-w-4xl">
                    <Link href="/dashboard" className="mb-5 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition">
                        <ChevronLeft size={14} /> Dashboard
                    </Link>
                    <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-teal-500/20 border border-teal-500/30">
                            <BookOpen size={26} className="text-teal-300" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white lg:text-4xl">Vocabulary Builder</h1>
                            <p className="mt-2 text-sm text-slate-400 max-w-xl leading-relaxed">
                                IELTS এর জন্য প্রয়োজনীয় শব্দ — IPA উচ্চারণ, বাংলা অর্থ, এবং example sentence সহ।
                                Flashcard দিয়ে পড়ো, Quiz দিয়ে নিজেকে পরীক্ষা করো।
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { v: String(VOCABULARY.length) + '+', l: 'মোট শব্দ' },
                            { v: '12', l: 'Topics + Connectors' },
                            { v: 'IPA + Mic', l: 'Pronunciation' },
                            { v: '3', l: 'Practice Modes' },
                        ].map((s) => (
                            <div key={s.l} className="rounded-xl border border-white/5 bg-white/5 px-4 py-3">
                                <p className="text-xl font-black text-white">{s.v}</p>
                                <p className="text-[11px] text-slate-400">{s.l}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white shadow-sm">
                <div className="mx-auto max-w-4xl px-5">
                    <div className="flex">
                        {TABS.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className={`relative flex flex-1 flex-col items-center gap-0.5 py-3.5 text-sm font-bold transition-colors ${
                                    tab === t.id ? t.color : 'text-slate-400 hover:text-slate-700'
                                }`}
                            >
                                <span>{t.label}</span>
                                <span className="text-[10px] font-medium hidden sm:block opacity-60">{t.sub}</span>
                                {tab === t.id && (
                                    <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${t.active}`} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-4xl px-5 py-8 lg:px-8">

                {/* ── ফ্ল্যাশকার্ড ── */}
                {tab === 'flashcard' && (
                    <div className="space-y-4">
                        <div className="rounded-xl border border-teal-100 bg-teal-50 px-4 py-3">
                            <p className="text-sm text-teal-800 font-medium">
                                Card দেখো, <strong>উচ্চারণ শোনো</strong>, তারপর অর্থ জানার চেষ্টা করো।
                                Card tap করলে বাংলা অর্থ, definition, এবং example দেখাবে।
                                <strong> জানি ✓</strong> চাপলে পরের শব্দে যাবে — <strong>জানি না ✗</strong> চাপলে deck এ থাকবে।
                            </p>
                        </div>
                        <VocabFlashcardMode />
                    </div>
                )}

                {/* ── কুইজ ── */}
                {tab === 'quiz' && (
                    <div className="space-y-4">
                        <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3">
                            <p className="text-sm text-violet-800 font-medium">
                                <strong>২ ধরনের প্রশ্ন:</strong> English word দেখে সঠিক বাংলা অর্থ বেছে নাও।
                                অথবা বাংলা অর্থ দেখে সঠিক English word বেছে নাও।
                                Filter করে specific topic বা band এর quiz দিতে পারো।
                            </p>
                        </div>
                        <VocabQuizMode />
                    </div>
                )}

                {/* ── শব্দতালিকা ── */}
                {tab === 'list' && (
                    <div className="space-y-5">
                        {/* Band summary */}
                        <div className="grid grid-cols-3 gap-3">
                            {([
                                { b: 6, border: 'border-sky-200', bg: 'bg-sky-50', text: 'text-sky-700' },
                                { b: 7, border: 'border-amber-200', bg: 'bg-amber-50', text: 'text-amber-700' },
                                { b: 8, border: 'border-rose-200', bg: 'bg-rose-50', text: 'text-rose-700' },
                            ] as const).map(({ b, border, bg, text }) => (
                                <div key={b} className={`rounded-xl border px-4 py-3 ${border} ${bg}`}>
                                    <p className={`text-lg font-black ${text}`}>{bandCounts[b]}</p>
                                    <p className="text-xs text-slate-500">Band {b} শব্দ</p>
                                </div>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="শব্দ খোঁজো (English বা বাংলায়)..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                            />
                        </div>

                        {/* Filters */}
                        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Topic</p>
                                <div className="flex flex-wrap gap-1.5">
                                    <button onClick={() => setListTopic('all')} className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${listTopic === 'all' ? 'bg-slate-900 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>সব</button>
                                    {TOPICS.map((t) => (
                                        <button key={t.id} onClick={() => setListTopic(t.id)} className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${listTopic === t.id ? 'bg-slate-900 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                            {t.icon} {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">শব্দের ধরন</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {(['all', 'noun', 'verb', 'adjective', 'adverb'] as const).map((p) => (
                                            <button key={p} onClick={() => setListPos(p as PartOfSpeech | 'all')} className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${listPos === p ? 'bg-slate-900 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                                {p === 'all' ? 'সব' : POS_LABELS[p as PartOfSpeech]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Band Level</p>
                                    <div className="flex gap-1.5">
                                        {(['all', 6, 7, 8] as const).map((b) => (
                                            <button key={b} onClick={() => setListBand(b as BandLevel | 'all')} className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${listBand === b ? 'bg-slate-900 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                                {b === 'all' ? 'সব' : `Band ${b}`}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs text-slate-400">{filteredList.length}টা শব্দ — click করলে definition ও example দেখাবে</p>

                        {/* Word list */}
                        <div className="space-y-2">
                            {filteredList.map((w) => (
                                <WordCard key={w.id} word={w} />
                            ))}
                            {filteredList.length === 0 && (
                                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
                                    কোনো শব্দ পাওয়া যায়নি।
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
