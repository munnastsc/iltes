'use client';
import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Shuffle } from 'lucide-react';
import { PRACTICE_SENTENCES } from '../lib/paraphrasePracticeData';

type Result = {
    score: number;
    feedback: string;
    tips: string[];
    techniqueUsed: string;
};

function basicCheck(original: string, attempt: string): Result {
    const orig = original.toLowerCase();
    const att = attempt.toLowerCase().trim();

    if (!att || att.length < 15) {
        return { score: 0, feedback: 'Paraphrase টা অনেক ছোটো বা খালি।', tips: ['কমপক্ষে একটা পূর্ণ বাক্য লেখো।'], techniqueUsed: '' };
    }

    // Too similar check
    const origWords = orig.split(/\W+/).filter(Boolean);
    const attWords = att.split(/\W+/).filter(Boolean);
    const stop = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'has', 'have', 'been', 'be', 'to', 'of', 'in', 'on', 'at', 'for', 'and', 'or', 'but', 'that', 'this', 'it', 'its', 'by', 'with', 'from', 'as', 'not', 'no']);
    const contentOrig = origWords.filter((w) => !stop.has(w));
    const contentAtt = attWords.filter((w) => !stop.has(w));

    const overlap = contentOrig.filter((w) => contentAtt.includes(w)).length;
    const similarity = contentOrig.length > 0 ? overlap / contentOrig.length : 0;

    if (similarity > 0.8) {
        return {
            score: 20,
            feedback: 'Paraphrase টা Original এর খুব কাছাকাছি। বেশি শব্দ বদলাও।',
            tips: ['Synonym ব্যবহার করো — একই শব্দ repeat করলে হবে না।', 'বাক্যের structure বদলানোর চেষ্টা করো।'],
            techniqueUsed: 'কোনো technique ব্যবহার হয়নি',
        };
    }

    // Length check
    const lenRatio = att.length / original.length;
    const lengthOk = lenRatio > 0.6 && lenRatio < 2.0;

    // Vocabulary change check
    const changed = contentOrig.filter((w) => !contentAtt.includes(w)).length;
    const changePct = contentOrig.length > 0 ? changed / contentOrig.length : 0;

    // Detect techniques used
    const techniques: string[] = [];
    if (att.includes('was ') && !orig.includes('was ') && att.includes('by ')) techniques.push('Active→Passive');
    if (att.includes('despite') && orig.includes('although')) techniques.push('Clause Restructuring');
    if (att.includes('due to') && (orig.includes('because') || orig.includes('since'))) techniques.push('Clause Restructuring');
    if (att.includes('tion') || att.includes('ment') || att.includes('ance') || att.includes('ness')) {
        const nomWords = ['investigation', 'development', 'improvement', 'management', 'establishment'];
        if (nomWords.some((n) => att.includes(n) && !orig.includes(n))) techniques.push('Nominalization');
    }

    const techniqueUsed = techniques.length > 0 ? techniques.join(', ') : 'Synonym Replacement';

    let score = 0;
    const tips: string[] = [];

    // Scoring
    if (similarity < 0.3) score += 35;
    else if (similarity < 0.5) score += 25;
    else if (similarity < 0.7) score += 15;

    if (changePct > 0.6) score += 30;
    else if (changePct > 0.4) score += 20;
    else { score += 10; tips.push('আরো বেশি শব্দ বদলানোর চেষ্টা করো।'); }

    if (lengthOk) score += 20;
    else tips.push('Paraphrase এর length original এর কাছাকাছি রাখো।');

    if (techniques.length > 0) score += 15;
    else tips.push('Synonym ছাড়াও অন্য technique try করো — Clause restructuring বা Nominalization।');

    score = Math.min(score, 100);

    let feedback = '';
    if (score >= 80) feedback = 'চমৎকার! তুমি কার্যকরভাবে paraphrase করেছো।';
    else if (score >= 60) feedback = 'ভালো চেষ্টা! কিছু শব্দ আরো বদলানো যেতো।';
    else if (score >= 40) feedback = 'ঠিকঠাক। কিন্তু আরো বেশি synonym এবং structure change দরকার।';
    else feedback = 'এটা কি আসলেই paraphrase? Original এর বেশিরভাগ শব্দ একই রয়ে গেছে।';

    return { score, feedback, tips, techniqueUsed };
}

export default function ParaphraseBuilder() {
    const [sentenceIdx, setSentenceIdx] = useState(0);
    const [attempt, setAttempt] = useState('');
    const [result, setResult] = useState<Result | null>(null);
    const [loading, setLoading] = useState(false);
    const [showHint, setShowHint] = useState(false);

    const sentence = PRACTICE_SENTENCES[sentenceIdx];

    function randomSentence() {
        const idx = Math.floor(Math.random() * PRACTICE_SENTENCES.length);
        setSentenceIdx(idx);
        setAttempt('');
        setResult(null);
        setShowHint(false);
    }

    async function checkParaphrase() {
        if (!attempt.trim() || loading) return;
        setLoading(true);
        setResult(null);

        // Try AI first
        try {
            const res = await fetch('/api/paraphrase/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ original: sentence.text, attempt }),
            });
            if (res.ok) {
                const data = await res.json();
                if (data.score !== undefined) {
                    setResult(data);
                    setLoading(false);
                    return;
                }
            }
        } catch {
            // fall through to basic check
        }

        // Basic local check
        await new Promise((r) => setTimeout(r, 400));
        setResult(basicCheck(sentence.text, attempt));
        setLoading(false);
    }

    function scoreColor(s: number) {
        if (s >= 80) return 'text-emerald-600';
        if (s >= 60) return 'text-amber-500';
        return 'text-rose-600';
    }

    return (
        <div className="space-y-5">
            {/* Original sentence */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Original Sentence</p>
                        <p className="text-sm font-medium text-slate-900 leading-relaxed">{sentence.text}</p>
                        {showHint && (
                            <p className="mt-2 text-xs text-blue-600 font-medium">💡 Hint: {sentence.hint}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={randomSentence}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                        >
                            <Shuffle size={12} /> নতুন
                        </button>
                        <button
                            onClick={() => setShowHint(!showHint)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
                        >
                            {showHint ? 'Hint লুকাও' : 'Hint দেখো'}
                        </button>
                    </div>
                </div>
                <p className="mt-3 text-[10px] text-slate-400 font-medium">
                    Sentence {sentenceIdx + 1}/{PRACTICE_SENTENCES.length}
                </p>
            </div>

            {/* Input */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3 block">
                    তোমার Paraphrase লেখো
                </label>
                <textarea
                    value={attempt}
                    onChange={(e) => { setAttempt(e.target.value); setResult(null); }}
                    placeholder="এখানে উপরের বাক্যটা তোমার নিজের ভাষায় লেখো — synonyms, structure change, passive voice যেকোনো technique ব্যবহার করতে পারো..."
                    className="w-full h-28 resize-none rounded-xl border border-slate-200 p-3 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 leading-relaxed"
                />
                <button
                    onClick={checkParaphrase}
                    disabled={!attempt.trim() || loading}
                    className="mt-3 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-500 disabled:opacity-40 transition inline-flex items-center justify-center gap-2"
                >
                    {loading ? <><Loader2 size={15} className="animate-spin" /> চেক হচ্ছে...</> : 'Paraphrase চেক করো'}
                </button>
            </div>

            {/* Result */}
            {result && (
                <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
                    {/* Score */}
                    <div className="flex items-center gap-4">
                        <div className={`text-5xl font-black ${scoreColor(result.score)}`}>{result.score}</div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium">/ 100</p>
                            <div className="w-32 h-2.5 rounded-full bg-slate-200 mt-1 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${result.score >= 80 ? 'bg-emerald-400' : result.score >= 60 ? 'bg-amber-400' : 'bg-rose-400'}`}
                                    style={{ width: `${result.score}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Feedback */}
                    <div className={`rounded-xl border p-3.5 ${result.score >= 80 ? 'border-emerald-200 bg-emerald-50' : result.score >= 60 ? 'border-amber-200 bg-amber-50' : 'border-rose-200 bg-rose-50'}`}>
                        <div className="flex items-center gap-2 mb-1">
                            {result.score >= 60 ? <CheckCircle2 size={14} className="text-emerald-600" /> : <AlertCircle size={14} className="text-rose-600" />}
                            <p className="text-sm font-bold text-slate-800">{result.feedback}</p>
                        </div>
                        {result.techniqueUsed && (
                            <p className="text-xs text-slate-500 mt-1">Technique detected: <span className="font-semibold text-slate-700">{result.techniqueUsed}</span></p>
                        )}
                    </div>

                    {/* Tips */}
                    {result.tips.length > 0 && (
                        <div>
                            <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">উন্নতির জন্য</p>
                            <ul className="space-y-1.5">
                                {result.tips.map((tip, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                        <span className="text-blue-400 mt-0.5">→</span> {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Try next */}
                    <button onClick={randomSentence} className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition">
                        পরের sentence চেষ্টা করো →
                    </button>
                </div>
            )}
        </div>
    );
}
