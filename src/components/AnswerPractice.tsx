'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock, RotateCcw } from 'lucide-react';
import ExamTimer from './ExamTimer';
import { saveObjectiveAttempt } from '../lib/practiceAnalytics';
import { moduleBandEstimate } from '../lib/ieltsBand';

type QuestionType = 'fill_in_blank' | 'mcq' | 'double_mcq' | 'true_false' | 'matching';

type QuestionItem = {
    number?: number;
    type?: QuestionType;
    prompt?: string;
    answer?: string;
    answerLine?: string;
    options?: string[];
};

type Props = {
    title: string;
    questions: QuestionItem[];
    type?: 'Reading' | 'Listening' | 'Writing' | 'Speaking';
    durationMinutes?: number;
    meta?: {
        bookNumber?: number;
        testNumber?: number;
        partNumber?: number;
    };
};

function evaluateQuestion(q: QuestionItem, userVal: string | string[] | undefined) {
    const ans = (q.answer || '').trim().toLowerCase();
    if (!ans || ans === 'open' || ans === 'sample provided') {
        return { gradable: false, correct: false };
    }

    if (q.type === 'double_mcq' && Array.isArray(userVal)) {
        const userAnswers = userVal.map((v) => v.trim().toLowerCase()).sort().join(',');
        const correctAnswers = ans.split(',').map((v) => v.trim().toLowerCase()).sort().join(',');
        return { gradable: true, correct: userAnswers && correctAnswers && userAnswers === correctAnswers };
    }

    if (typeof userVal === 'string') {
        const userNorm = userVal.trim().toLowerCase();
        if (userNorm === ans) return { gradable: true, correct: true };
        // Accept answer ignoring optional parenthesized words: (the) rich → rich
        const ansNoParens = ans.replace(/\([^)]*\)\s*/g, '').trim();
        if (ansNoParens && userNorm === ansNoParens) return { gradable: true, correct: true };
        return { gradable: true, correct: false };
    }

    return { gradable: true, correct: false };
}

// Render fill-in-blank prompt with inline input at ___ positions
function FillInBlankRenderer({
    prompt,
    qKey,
    userVal,
    checked,
    isCorrect,
    gradable,
    correctAnswer,
    onChange,
}: {
    prompt: string;
    qKey: number;
    userVal: string;
    checked: boolean;
    isCorrect: boolean;
    gradable: boolean;
    correctAnswer: string;
    onChange: (val: string) => void;
}) {
    const parts = prompt.split('___');

    if (parts.length === 1) {
        // No blank in prompt — show prompt then input below
        return (
            <div>
                <span className="text-sm leading-7 text-slate-800">{prompt}</span>
                <input
                    value={userVal}
                    disabled={checked}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Answer..."
                    className={`mt-2 w-full rounded border px-3 py-1.5 text-sm outline-none transition focus:ring-1 ${
                        checked
                            ? isCorrect
                                ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                                : 'border-rose-300 bg-rose-50 text-rose-800'
                            : 'border-slate-300 bg-white focus:border-blue-400 focus:ring-blue-100'
                    }`}
                />
                {checked && !isCorrect && gradable && (
                    <p className="mt-1 text-xs font-semibold text-rose-600">✗ Answer: <span className="font-bold">{correctAnswer}</span></p>
                )}
                {checked && isCorrect && (
                    <p className="mt-1 text-xs font-semibold text-emerald-600">✓ Correct</p>
                )}
            </div>
        );
    }

    return (
        <span className="text-sm leading-8 text-slate-800">
            {parts.map((part, i) => (
                <span key={i}>
                    <span dangerouslySetInnerHTML={{ __html: part }} />
                    {i < parts.length - 1 && (
                        <span className="inline-flex flex-col items-center mx-1 align-middle">
                            <input
                                value={userVal}
                                disabled={checked}
                                onChange={(e) => onChange(e.target.value)}
                                placeholder={String(qKey)}
                                className={`w-28 rounded border px-2 py-0.5 text-sm text-center outline-none transition focus:ring-1 ${
                                    checked
                                        ? isCorrect
                                            ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                                            : 'border-rose-300 bg-rose-50 text-rose-700'
                                        : 'border-blue-300 bg-blue-50 focus:border-blue-500 focus:ring-blue-100'
                                }`}
                            />
                            {checked && !isCorrect && gradable && (
                                <span className="text-[10px] font-bold text-rose-600 mt-0.5">{correctAnswer}</span>
                            )}
                            {checked && isCorrect && (
                                <span className="text-[10px] font-bold text-emerald-600 mt-0.5">✓</span>
                            )}
                        </span>
                    )}
                </span>
            ))}
        </span>
    );
}

export default function AnswerPractice({ title, questions, type = 'Reading', durationMinutes, meta }: Props) {
    const [inputs, setInputs] = useState<Record<number, string | string[]>>({});
    const [checked, setChecked] = useState(false);
    const [isExamMode, setIsExamMode] = useState(false);
    const [isExamStarted, setIsExamStarted] = useState(false);
    const [examDuration] = useState(durationMinutes ?? (type === 'Listening' ? 30 : type === 'Speaking' ? 15 : 60));
    const [isRetryMode, setIsRetryMode] = useState(false);
    const [questionPool, setQuestionPool] = useState<QuestionItem[]>(questions);

    useEffect(() => {
        setQuestionPool(questions);
        setIsRetryMode(false);
        setInputs({});
        setChecked(false);
        setIsExamStarted(false);
    }, [questions]);

    const score = useMemo(() => {
        let correct = 0; let totalGradable = 0;
        questionPool.forEach((q, i) => {
            const key = q.number || i + 1;
            const result = evaluateQuestion(q, inputs[key]);
            if (result.gradable) { totalGradable += 1; if (result.correct) correct += 1; }
        });
        return { correct, total: totalGradable };
    }, [inputs, questionPool]);

    const wrongQuestionNumbers = useMemo(() => {
        if (!checked) return [] as number[];
        return questionPool
            .map((q, i) => {
                const key = q.number || i + 1;
                const result = evaluateQuestion(q, inputs[key]);
                if (!result.gradable || result.correct) return null;
                return key;
            })
            .filter((v): v is number => typeof v === 'number');
    }, [checked, inputs, questionPool]);

    const finalizeAttempt = () => {
        const computedWrong = questionPool
            .map((q, i) => {
                const key = q.number || i + 1;
                const result = evaluateQuestion(q, inputs[key]);
                if (!result.gradable || result.correct) return null;
                return key;
            })
            .filter((v): v is number => typeof v === 'number');

        const computedScore = questionPool.reduce(
            (acc, q, i) => {
                const key = q.number || i + 1;
                const result = evaluateQuestion(q, inputs[key]);
                if (!result.gradable) return acc;
                return { correct: acc.correct + (result.correct ? 1 : 0), total: acc.total + 1 };
            },
            { correct: 0, total: 0 }
        );

        setChecked(true);
        setIsExamStarted(false);

        const payload = {
            module: type, title,
            bookNumber: meta?.bookNumber, testNumber: meta?.testNumber, partNumber: meta?.partNumber,
            retryMode: isRetryMode, wrongQuestions: computedWrong,
        };
        saveObjectiveAttempt({ ...payload, correct: computedScore.correct, total: computedScore.total });
        fetch('/api/progress/attempts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...payload, correct: computedScore.correct, total: computedScore.total }),
        }).catch(() => {});
    };

    const handleInputChange = (key: number, val: string) => setInputs((p) => ({ ...p, [key]: val }));
    const handleCheckboxChange = (key: number, option: string) => {
        setInputs((prev) => {
            const current = Array.isArray(prev[key]) ? (prev[key] as string[]) : [];
            if (current.includes(option)) return { ...prev, [key]: current.filter((o) => o !== option) };
            return { ...prev, [key]: [...current, option] };
        });
    };

    const retryWrongOnly = () => {
        const wrongSet = new Set(wrongQuestionNumbers);
        const subset = questionPool.filter((q, i) => wrongSet.has(q.number || i + 1));
        if (!subset.length) return;
        setQuestionPool(subset); setIsRetryMode(true); setInputs({}); setChecked(false);
        setIsExamStarted(false); setIsExamMode(false);
    };

    const restoreFullSet = () => {
        setQuestionPool(questions); setIsRetryMode(false); setInputs({}); setChecked(false); setIsExamStarted(false);
    };

    if (!questionPool.length) return null;

    // Group questions by their detected section type for Cambridge-style display
    // We group consecutive questions of the same type together
    type QGroup = { type: QuestionType | 'fill_in_blank'; questions: QuestionItem[] };
    const groups: QGroup[] = [];
    for (const q of questionPool) {
        const qtype = (q.type || 'fill_in_blank') as QuestionType;
        const last = groups[groups.length - 1];
        if (last && last.type === qtype) {
            last.questions.push(q);
        } else {
            groups.push({ type: qtype, questions: [q] });
        }
    }

    const qStart = questionPool[0]?.number || 1;
    const qEnd = questionPool[questionPool.length - 1]?.number || questionPool.length;

    return (
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{title}</p>
                    <p className="text-xs font-semibold text-slate-600">
                        Questions {qStart}–{qEnd} &nbsp;·&nbsp; {questionPool.length} questions
                    </p>
                    {isRetryMode && <p className="text-xs font-semibold text-amber-700">Retry Mode: Wrong questions only</p>}
                </div>
                <div className="flex items-center gap-3">
                    {!isExamStarted && !checked && (
                        <button
                            onClick={() => setIsExamMode(!isExamMode)}
                            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                                isExamMode ? 'bg-blue-100 text-blue-700' : 'border border-slate-300 bg-white text-slate-600'
                            }`}
                        >
                            {isExamMode ? 'Exam Mode ON' : 'Exam Mode'}
                        </button>
                    )}
                    {isExamStarted && <ExamTimer durationMinutes={examDuration} isActive={isExamStarted} onExpire={finalizeAttempt} />}
                </div>
            </div>

            {/* Exam start screen */}
            {!isExamStarted && isExamMode && !checked ? (
                <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
                    <div className="rounded-full bg-blue-50 p-4 text-blue-600"><Clock size={32} /></div>
                    <h4 className="mt-4 text-lg font-bold text-slate-900">Ready to start the {type} test?</h4>
                    <p className="mt-2 text-sm text-slate-600">
                        You have {examDuration} minutes. Auto-submits when timer expires.
                    </p>
                    <button
                        onClick={() => setIsExamStarted(true)}
                        className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-blue-500"
                    >
                        Start Exam
                    </button>
                </div>
            ) : (
                <div className="p-5">
                    {/* Cambridge-style grouped questions */}
                    <div className="space-y-6">
                        {groups.map((group, gi) => {
                            const gStart = group.questions[0]?.number || 1;
                            const gEnd = group.questions[group.questions.length - 1]?.number || gStart;
                            const rangeLabel = gStart === gEnd ? `Question ${gStart}` : `Questions ${gStart}–${gEnd}`;

                            return (
                                <div key={gi} className="rounded-lg border border-slate-200 overflow-hidden">
                                    {/* Section header */}
                                    <div className="bg-slate-700 px-4 py-2">
                                        <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">{rangeLabel}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">
                                            {group.type === 'true_false' && (
                                                group.questions.some(q => ['yes','no'].includes((q.answer||'').toLowerCase()))
                                                    ? 'YES / NO / NOT GIVEN'
                                                    : 'TRUE / FALSE / NOT GIVEN'
                                            )}
                                            {group.type === 'fill_in_blank' && 'Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer'}
                                            {group.type === 'matching' && (() => {
                                                const firstAns = (group.questions[0]?.answer || '').trim();
                                                const firstOpts = group.questions[0]?.options;
                                                if (/^[ivxIVX]+$/.test(firstAns)) return 'Choose the correct heading, i–xii';
                                                if (firstOpts && firstOpts.length) {
                                                    const last = firstOpts[firstOpts.length - 1].split(':')[0].trim();
                                                    return `Match each statement with the correct option, A–${last}`;
                                                }
                                                return 'Choose the correct letter, A–H';
                                            })()}
                                            {group.type === 'mcq' && 'Choose the correct letter, A, B, C or D'}
                                            {group.type === 'double_mcq' && 'Choose TWO correct letters, A–E'}
                                        </p>
                                    </div>

                                    <div className="divide-y divide-slate-100">
                                        {group.questions.map((q, qi) => {
                                            const key = q.number || qi + 1;
                                            const userVal = inputs[key];
                                            const ans = q.answer || '';
                                            const evalResult = evaluateQuestion(q, userVal);
                                            const isCorrect = checked && evalResult.gradable ? evalResult.correct : false;
                                            const iswrong = checked && evalResult.gradable && !evalResult.correct;

                                            return (
                                                <div
                                                    key={key}
                                                    className={`px-4 py-3 transition ${
                                                        checked && evalResult.gradable
                                                            ? isCorrect ? 'bg-emerald-50/60' : 'bg-rose-50/60'
                                                            : 'bg-white'
                                                    }`}
                                                >
                                                    {/* Fill-in-blank: inline input in sentence */}
                                                    {(!q.type || q.type === 'fill_in_blank') && (
                                                        <div className="flex gap-2 items-baseline flex-wrap">
                                                            <span className="shrink-0 inline-flex h-5 w-5 items-center justify-center rounded bg-slate-700 text-[10px] font-bold text-white">
                                                                {key}
                                                            </span>
                                                            <FillInBlankRenderer
                                                                prompt={q.prompt || ''}
                                                                qKey={key}
                                                                userVal={typeof userVal === 'string' ? userVal : ''}
                                                                checked={checked}
                                                                isCorrect={isCorrect}
                                                                gradable={evalResult.gradable}
                                                                correctAnswer={ans}
                                                                onChange={(val) => handleInputChange(key, val)}
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Matching: statement + clickable letter/numeral buttons */}
                                                    {q.type === 'matching' && (() => {
                                                        const isRoman = /^[ivxIVX]+$/.test(ans.trim());
                                                        // If named options stored (e.g. "A: 1836"), derive buttons from them
                                                        const namedOpts = q.options && q.options.length > 0 ? q.options : null;
                                                        const btnOpts = namedOpts
                                                            ? namedOpts.map(o => o.split(':')[0].trim())
                                                            : isRoman
                                                            ? ['i','ii','iii','iv','v','vi','vii','viii','ix','x','xi','xii']
                                                            : ['A','B','C','D','E','F','G','H'];
                                                        return (
                                                            <div className="flex items-start gap-3">
                                                                <span className="shrink-0 inline-flex h-5 w-5 items-center justify-center rounded bg-slate-700 text-[10px] font-bold text-white mt-0.5">
                                                                    {key}
                                                                </span>
                                                                <div className="flex-1">
                                                                    <p className="text-sm text-slate-800 leading-snug">{q.prompt}</p>
                                                                    {namedOpts ? (
                                                                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
                                                                            {namedOpts.map((o) => {
                                                                                const [ltr, ...rest] = o.split(':');
                                                                                return (
                                                                                    <span key={ltr} className="text-xs text-slate-600">
                                                                                        <strong className="text-slate-800">{ltr.trim()}</strong>: {rest.join(':').trim()}
                                                                                    </span>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    ) : !isRoman && (
                                                                        <p className="mt-1 text-xs text-slate-400 italic">A–H = labelled sections of the passage</p>
                                                                    )}
                                                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                                                        {btnOpts.map((opt) => {
                                                                            const selected = (typeof userVal === 'string' ? userVal : '').toLowerCase() === opt.toLowerCase();
                                                                            const isAns = opt.toLowerCase() === ans.toLowerCase();
                                                                            return (
                                                                                <label key={opt} className={`flex cursor-pointer items-center justify-center min-w-[2rem] h-8 px-2 rounded-lg border text-xs font-bold transition ${
                                                                                    checked
                                                                                        ? isAns ? 'border-emerald-400 bg-emerald-100 text-emerald-800'
                                                                                        : selected && !isAns ? 'border-rose-400 bg-rose-100 text-rose-800'
                                                                                        : 'border-slate-200 bg-slate-50 text-slate-400'
                                                                                        : selected ? 'border-blue-500 bg-blue-100 text-blue-800'
                                                                                        : 'border-slate-300 bg-white text-slate-600 hover:border-blue-300'
                                                                                }`}>
                                                                                    <input type="radio" name={`q_${key}`} disabled={checked} checked={selected}
                                                                                        onChange={() => handleInputChange(key, opt.toUpperCase())} className="hidden" />
                                                                                    {opt}
                                                                                </label>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                    {checked && iswrong && (
                                                                        <p className="mt-1 text-xs font-semibold text-rose-600">✗ Answer: <strong>{ans.toUpperCase()}</strong></p>
                                                                    )}
                                                                    {checked && isCorrect && (
                                                                        <p className="mt-1 text-xs font-semibold text-emerald-600">✓ Correct</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}

                                                    {/* True/False/Not Given / Yes/No */}
                                                    {q.type === 'true_false' && (
                                                        <div className="flex items-start gap-3">
                                                            <span className="shrink-0 inline-flex h-5 w-5 items-center justify-center rounded bg-slate-700 text-[10px] font-bold text-white mt-0.5">
                                                                {key}
                                                            </span>
                                                            <div className="flex-1">
                                                                <p className="text-sm text-slate-800 leading-snug mb-2">{q.prompt}</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {(ans.toUpperCase() === 'YES' || ans.toUpperCase() === 'NO'
                                                                        ? ['YES', 'NO', 'NOT GIVEN']
                                                                        : ['TRUE', 'FALSE', 'NOT GIVEN']
                                                                    ).map((opt) => {
                                                                        const selected = userVal === opt;
                                                                        const isAns = opt === ans.toUpperCase();
                                                                        return (
                                                                            <label
                                                                                key={opt}
                                                                                className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition ${
                                                                                    checked
                                                                                        ? isAns
                                                                                            ? 'border-emerald-400 bg-emerald-100 text-emerald-800'
                                                                                            : selected && !isAns
                                                                                            ? 'border-rose-400 bg-rose-100 text-rose-800'
                                                                                            : 'border-slate-200 bg-slate-50 text-slate-400'
                                                                                        : selected
                                                                                        ? 'border-blue-500 bg-blue-100 text-blue-800'
                                                                                        : 'border-slate-300 bg-white text-slate-600 hover:border-blue-300'
                                                                                }`}
                                                                            >
                                                                                <input
                                                                                    type="radio"
                                                                                    name={`q_${key}`}
                                                                                    disabled={checked}
                                                                                    checked={selected}
                                                                                    onChange={() => handleInputChange(key, opt)}
                                                                                    className="hidden"
                                                                                />
                                                                                {opt}
                                                                            </label>
                                                                        );
                                                                    })}
                                                                </div>
                                                                {checked && iswrong && (
                                                                    <p className="mt-1 text-xs font-semibold text-rose-600">✗ Answer: <strong>{ans.toUpperCase()}</strong></p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* MCQ with options */}
                                                    {q.type === 'mcq' && q.options && (
                                                        <div className="flex items-start gap-3">
                                                            <span className="shrink-0 inline-flex h-5 w-5 items-center justify-center rounded bg-slate-700 text-[10px] font-bold text-white mt-0.5">
                                                                {key}
                                                            </span>
                                                            <div className="flex-1">
                                                                <p className="text-sm text-slate-800 leading-snug mb-2">{q.prompt}</p>
                                                                <div className="space-y-1.5">
                                                                    {q.options.filter(Boolean).map((opt, oi) => {
                                                                        const label = String.fromCharCode(65 + oi);
                                                                        const selected = userVal === label;
                                                                        const isAns = label === ans.toUpperCase();
                                                                        // Strip leading "A) " prefix if already in option text
                                                                        const optText = opt.replace(/^[A-G][).]\s*/, '');
                                                                        return (
                                                                            <label
                                                                                key={oi}
                                                                                className={`flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                                                                                    checked
                                                                                        ? isAns
                                                                                            ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                                                                                            : selected && !isAns
                                                                                            ? 'border-rose-300 bg-rose-50 text-rose-700'
                                                                                            : 'border-slate-100 bg-white text-slate-400'
                                                                                        : selected
                                                                                        ? 'border-blue-400 bg-blue-50 text-blue-800'
                                                                                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200'
                                                                                }`}
                                                                            >
                                                                                <input type="radio" name={`q_${key}`} disabled={checked} checked={selected}
                                                                                    onChange={() => handleInputChange(key, label)} className="mt-0.5 shrink-0" />
                                                                                <span><strong className="mr-1">{label}.</strong>{optText}</span>
                                                                            </label>
                                                                        );
                                                                    })}
                                                                </div>
                                                                {checked && iswrong && (
                                                                    <p className="mt-1 text-xs font-semibold text-rose-600">✗ Answer: <strong>{ans.toUpperCase()}</strong></p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {/* MCQ without options — fallback to letter select */}
                                                    {q.type === 'mcq' && !q.options && (
                                                        <div className="flex items-start gap-3">
                                                            <span className="shrink-0 inline-flex h-5 w-5 items-center justify-center rounded bg-slate-700 text-[10px] font-bold text-white mt-0.5">
                                                                {key}
                                                            </span>
                                                            <div className="flex-1">
                                                                <p className="text-sm text-slate-800 leading-snug mb-2">{q.prompt}</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {['A','B','C','D','E','F','G','H'].map((letter) => {
                                                                        const selected = userVal === letter;
                                                                        const isAns = letter === ans.toUpperCase();
                                                                        return (
                                                                            <label key={letter} className={`flex cursor-pointer items-center justify-center h-9 w-9 rounded-lg border text-sm font-bold transition ${
                                                                                checked
                                                                                    ? isAns ? 'border-emerald-400 bg-emerald-100 text-emerald-800'
                                                                                    : selected && !isAns ? 'border-rose-400 bg-rose-100 text-rose-800'
                                                                                    : 'border-slate-200 bg-slate-50 text-slate-400'
                                                                                    : selected ? 'border-blue-500 bg-blue-100 text-blue-800'
                                                                                    : 'border-slate-300 bg-white text-slate-600 hover:border-blue-300'
                                                                            }`}>
                                                                                <input type="radio" name={`q_${key}`} disabled={checked} checked={selected}
                                                                                    onChange={() => handleInputChange(key, letter)} className="hidden" />
                                                                                {letter}
                                                                            </label>
                                                                        );
                                                                    })}
                                                                </div>
                                                                {checked && iswrong && (
                                                                    <p className="mt-1 text-xs font-semibold text-rose-600">✗ Answer: <strong>{ans.toUpperCase()}</strong></p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Double MCQ */}
                                                    {q.type === 'double_mcq' && q.options && (
                                                        <div className="flex items-start gap-3">
                                                            <span className="shrink-0 inline-flex h-5 w-5 items-center justify-center rounded bg-slate-700 text-[10px] font-bold text-white mt-0.5">
                                                                {key}
                                                            </span>
                                                            <div className="flex-1">
                                                                <p className="text-sm text-slate-800 leading-snug mb-2">{q.prompt}</p>
                                                                <div className="space-y-1.5">
                                                                    {q.options.filter(Boolean).map((opt, oi) => {
                                                                        const label = String.fromCharCode(65 + oi);
                                                                        const isChecked2 = Array.isArray(userVal) && userVal.includes(label);
                                                                        const correctLetters = ans.toUpperCase().split(/[,/\s]+/).map(s => s.trim()).filter(Boolean);
                                                                        const isAns2 = correctLetters.includes(label);
                                                                        const optText = opt.replace(/^[A-G][).]\s*/, '');
                                                                        return (
                                                                            <label key={oi} className={`flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                                                                                checked
                                                                                    ? isAns2 ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                                                                                    : isChecked2 && !isAns2 ? 'border-rose-300 bg-rose-50 text-rose-700'
                                                                                    : 'border-slate-100 bg-white text-slate-400'
                                                                                    : isChecked2 ? 'border-blue-400 bg-blue-50 text-blue-800'
                                                                                    : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200'
                                                                            }`}>
                                                                                <input type="checkbox" disabled={checked} checked={isChecked2}
                                                                                    onChange={() => handleCheckboxChange(key, label)} className="mt-0.5 shrink-0" />
                                                                                <span><strong className="mr-1">{label}.</strong>{optText}</span>
                                                                            </label>
                                                                        );
                                                                    })}
                                                                </div>
                                                                {checked && iswrong && (
                                                                    <p className="mt-1 text-xs font-semibold text-rose-600">✗ Answer: <strong>{ans.toUpperCase()}</strong></p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Evidence after check */}
                                                    {checked && q.answerLine && (
                                                        <div className="mt-2 ml-7 rounded border-l-2 border-amber-300 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-slate-700">
                                                            <span className="font-bold text-amber-700 uppercase tracking-tight text-[10px]">Evidence: </span>
                                                            &ldquo;{q.answerLine}&rdquo;
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Score result */}
                    {checked && (
                        <div className="mt-6 rounded-xl border-2 border-blue-100 bg-blue-50 p-5 text-center">
                            <h4 className="text-lg font-bold text-blue-900">Result</h4>
                            <div className="mt-3 flex justify-center gap-8">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Score</p>
                                    <p className="text-3xl font-black text-blue-900">{score.correct}/{score.total}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Percentage</p>
                                    <p className="text-3xl font-black text-blue-900">{score.total ? Math.round((score.correct / score.total) * 100) : 0}%</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Band Est.</p>
                                    <p className="text-3xl font-black text-blue-900">{moduleBandEstimate(type, score.correct, score.total) ?? '-'}</p>
                                </div>
                            </div>
                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                <button onClick={restoreFullSet}
                                    className="inline-flex items-center gap-2 rounded-md border border-blue-200 bg-white px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100">
                                    <RotateCcw size={13} /> Re-take
                                </button>
                                {wrongQuestionNumbers.length > 0 && (
                                    <button onClick={retryWrongOnly}
                                        className="inline-flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100">
                                        Retry Wrong ({wrongQuestionNumbers.length})
                                    </button>
                                )}
                                {isRetryMode && (
                                    <button onClick={restoreFullSet}
                                        className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100">
                                        Full Set
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Submit / Reset */}
                    {!checked && (
                        <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-5">
                            <button type="button" onClick={() => {
                                if (isExamMode && !confirm('Submit now?')) return;
                                finalizeAttempt();
                            }}
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow transition hover:bg-blue-500">
                                <CheckCircle2 size={17} /> Submit Answers
                            </button>
                            <button type="button" onClick={restoreFullSet}
                                className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                                <RotateCcw size={17} /> Reset
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
