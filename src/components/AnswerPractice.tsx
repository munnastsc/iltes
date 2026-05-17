'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock, RotateCcw } from 'lucide-react';
import ExamTimer from './ExamTimer';
import { saveObjectiveAttempt } from '../lib/practiceAnalytics';
import { moduleBandEstimate } from '../lib/ieltsBand';

type QuestionType = 'fill_in_blank' | 'mcq' | 'double_mcq' | 'true_false' | 'matching' | 'heading_match';

type QuestionItem = {
    number?: number;
    type?: QuestionType;
    prompt?: string;
    answer?: string;
    answerLine?: string;
    options?: string[];
    instruction?: string;
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
    headingOptions?: string[];
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
        return (
            <div>
                <span className="text-sm leading-7 text-slate-700 font-medium">{prompt}</span>
                <input
                    value={userVal}
                    disabled={checked}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Type your answer..."
                    className={`mt-2 w-full rounded-lg border-2 px-3 py-2 text-sm font-medium outline-none transition ${
                        checked
                            ? isCorrect
                                ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                                : 'border-rose-400 bg-rose-50 text-rose-800'
                            : 'border-slate-200 bg-white hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                    }`}
                />
                {checked && !isCorrect && gradable && (
                    <p className="mt-1.5 text-xs font-bold text-rose-600">✗ Correct: <span className="text-rose-700">{correctAnswer}</span></p>
                )}
                {checked && isCorrect && (
                    <p className="mt-1.5 text-xs font-bold text-emerald-600">✓ Correct!</p>
                )}
            </div>
        );
    }

    return (
        <span className="text-sm leading-9 text-slate-700 font-medium">
            {parts.map((part, i) => (
                <span key={i}>
                    <span dangerouslySetInnerHTML={{ __html: part }} />
                    {i < parts.length - 1 && (
                        <span className="inline-flex flex-col items-center mx-1.5 align-middle">
                            <input
                                value={userVal}
                                disabled={checked}
                                onChange={(e) => onChange(e.target.value)}
                                placeholder={String(qKey)}
                                className={`w-32 rounded-lg border-2 px-2 py-1 text-sm text-center font-semibold outline-none transition ${
                                    checked
                                        ? isCorrect
                                            ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                                            : 'border-rose-400 bg-rose-50 text-rose-700'
                                        : 'border-indigo-300 bg-indigo-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
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

export default function AnswerPractice({ title, questions, type = 'Reading', durationMinutes, meta, headingOptions }: Props) {
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
    type QGroup = { type: QuestionType | 'fill_in_blank' | 'heading_match'; questions: QuestionItem[] };
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
        <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50 px-5 py-3.5">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">{title}</p>
                    <p className="text-sm font-bold text-slate-700 mt-0.5">
                        Questions {qStart}–{qEnd} &nbsp;<span className="text-slate-400 font-normal">·</span>&nbsp; {questionPool.length} questions
                    </p>
                    {isRetryMode && <p className="text-xs font-bold text-amber-600 mt-0.5">⟳ Retry Mode — wrong questions only</p>}
                </div>
                <div className="flex items-center gap-3">
                    {!isExamStarted && !checked && (
                        <button
                            onClick={() => setIsExamMode(!isExamMode)}
                            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                                isExamMode
                                    ? 'bg-indigo-600 text-white shadow'
                                    : 'border-2 border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                            }`}
                        >
                            {isExamMode ? '⏱ Exam Mode ON' : 'Exam Mode'}
                        </button>
                    )}
                    {isExamStarted && <ExamTimer durationMinutes={examDuration} isActive={isExamStarted} onExpire={finalizeAttempt} />}
                </div>
            </div>

            {/* Exam start screen */}
            {!isExamStarted && isExamMode && !checked ? (
                <div className="flex flex-col items-center justify-center px-6 py-12 text-center bg-slate-50">
                    <div className="rounded-2xl bg-indigo-100 p-5 text-indigo-600"><Clock size={36} /></div>
                    <h4 className="mt-5 text-xl font-black text-slate-900">Ready for the {type} test?</h4>
                    <p className="mt-2 text-sm text-slate-500">
                        You have <strong className="text-slate-700">{examDuration} minutes</strong>. Auto-submits when timer expires.
                    </p>
                    <button
                        onClick={() => setIsExamStarted(true)}
                        className="mt-6 rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-500 active:scale-95"
                    >
                        Start Exam
                    </button>
                </div>
            ) : (
                <div className="p-5">
                    {/* List of Headings panel */}
                    {headingOptions && headingOptions.length > 0 && (
                        <div className="mb-6 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                            <div className="bg-slate-900 px-5 py-3 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-indigo-400" />
                                <p className="text-xs font-black text-white uppercase tracking-[0.15em]">List of Headings</p>
                            </div>
                            <div className="bg-slate-50 px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                                {headingOptions.map((opt, idx) => {
                                    const dot = opt.indexOf('.');
                                    const numeral = dot >= 0 ? opt.slice(0, dot) : String(idx + 1);
                                    const text = dot >= 0 ? opt.slice(dot + 1).trim() : opt;
                                    return (
                                        <div key={idx} className="flex gap-3 items-start">
                                            <span className="shrink-0 inline-flex items-center justify-center w-8 h-6 rounded bg-indigo-100 text-xs font-black text-indigo-700 italic">{numeral}</span>
                                            <span className="text-sm text-slate-700 leading-snug">{text}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {/* Cambridge-style grouped questions */}
                    <div className="space-y-6">
                        {groups.map((group, gi) => {
                            const gStart = group.questions[0]?.number || 1;
                            const gEnd = group.questions[group.questions.length - 1]?.number || gStart;
                            const rangeLabel = gStart === gEnd ? `Question ${gStart}` : `Questions ${gStart}–${gEnd}`;

                            return (
                                <div key={gi} className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                    {/* Section header */}
                                    <div className="bg-slate-900 px-5 py-3">
                                        <p className="text-xs font-black text-white uppercase tracking-[0.15em]">{rangeLabel}</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                                            {group.type === 'true_false' && (
                                                group.questions.some(q => ['yes','no'].includes((q.answer||'').toLowerCase()))
                                                    ? 'YES / NO / NOT GIVEN'
                                                    : 'TRUE / FALSE / NOT GIVEN'
                                            )}
                                            {group.type === 'fill_in_blank' && (() => {
                                                const inst = group.questions[0]?.instruction;
                                                if (inst) return inst;
                                                if (type === 'Writing') {
                                                    return title.includes('Part 2') || title.includes('Task 2')
                                                        ? 'You should spend about 40 minutes on this task. Write at least 250 words.'
                                                        : 'You should spend about 20 minutes on this task. Write at least 150 words.';
                                                }
                                                if (type === 'Speaking') {
                                                    if (title.includes('Part 2')) return 'Talk about the topic for 1–2 minutes. Make notes during 1 minute preparation time.';
                                                    if (title.includes('Part 3')) return 'Discuss abstract questions related to the Part 2 topic.';
                                                    return 'Answer the examiner\'s questions about familiar topics.';
                                                }
                                                return 'Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer';
                                            })()}
                                            {group.type === 'heading_match' && 'Choose the correct heading from the list for each paragraph'}
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
                                                    className={`px-5 py-4 transition ${
                                                        checked && evalResult.gradable
                                                            ? isCorrect ? 'bg-emerald-50' : 'bg-rose-50'
                                                            : 'bg-white hover:bg-slate-50/60'
                                                    }`}
                                                >
                                                    {/* Fill-in-blank: inline input in sentence */}
                                                    {(!q.type || q.type === 'fill_in_blank') && (
                                                        <div className="flex gap-2 items-baseline flex-wrap">
                                                            <span className="shrink-0 inline-flex h-5 w-5 items-center justify-center rounded bg-indigo-600 text-[10px] font-black text-white">
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
                                                                <span className="shrink-0 inline-flex h-5 w-5 items-center justify-center rounded bg-indigo-600 text-[10px] font-black text-white mt-0.5">
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
                                                                                        ? isAns ? 'border-emerald-500 bg-emerald-500 text-white'
                                                                                        : selected && !isAns ? 'border-rose-500 bg-rose-500 text-white'
                                                                                        : 'border-slate-200 bg-slate-100 text-slate-400'
                                                                                        : selected ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                                                                                        : 'border-slate-300 bg-white text-slate-600 hover:border-indigo-400 hover:text-indigo-600'
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
                                                            <span className="shrink-0 inline-flex h-5 w-5 items-center justify-center rounded bg-indigo-600 text-[10px] font-black text-white mt-0.5">
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
                                                                                            ? 'border-emerald-500 bg-emerald-500 text-white'
                                                                                            : selected && !isAns
                                                                                            ? 'border-rose-500 bg-rose-500 text-white'
                                                                                            : 'border-slate-200 bg-slate-100 text-slate-400'
                                                                                        : selected
                                                                                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                                                                                        : 'border-slate-300 bg-white text-slate-600 hover:border-indigo-400 hover:text-indigo-600'
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
                                                            <span className="shrink-0 inline-flex h-5 w-5 items-center justify-center rounded bg-indigo-600 text-[10px] font-black text-white mt-0.5">
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
                                                                                            ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold'
                                                                                            : selected && !isAns
                                                                                            ? 'border-rose-400 bg-rose-50 text-rose-700'
                                                                                            : 'border-slate-100 bg-white text-slate-400'
                                                                                        : selected
                                                                                        ? 'border-indigo-500 bg-indigo-50 text-indigo-800 font-semibold'
                                                                                        : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/40'
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
                                                            <span className="shrink-0 inline-flex h-5 w-5 items-center justify-center rounded bg-indigo-600 text-[10px] font-black text-white mt-0.5">
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
                                                            <span className="shrink-0 inline-flex h-5 w-5 items-center justify-center rounded bg-indigo-600 text-[10px] font-black text-white mt-0.5">
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
                                                                                    ? isAns2 ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold'
                                                                                    : isChecked2 && !isAns2 ? 'border-rose-400 bg-rose-50 text-rose-700'
                                                                                    : 'border-slate-100 bg-white text-slate-400'
                                                                                    : isChecked2 ? 'border-indigo-500 bg-indigo-50 text-indigo-800 font-semibold'
                                                                                    : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/40'
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

                                                    {/* Heading match: roman numeral buttons */}
                                                    {q.type === 'heading_match' && (() => {
                                                        const opts = headingOptions && headingOptions.length > 0
                                                            ? headingOptions.map(o => { const d = o.indexOf('.'); return d >= 0 ? o.slice(0, d).trim() : o; })
                                                            : ['i','ii','iii','iv','v','vi','vii','viii','ix','x','xi'];
                                                        return (
                                                            <div className="flex items-start gap-3">
                                                                <span className="shrink-0 inline-flex h-5 w-5 items-center justify-center rounded bg-indigo-600 text-[10px] font-black text-white mt-0.5">
                                                                    {key}
                                                                </span>
                                                                <div className="flex-1">
                                                                    <p className="text-sm text-slate-500 italic mb-2">Paragraph {String.fromCharCode(64 + (q.number ? q.number - (questionPool.find(x => x.type === 'heading_match')?.number ?? q.number) + 1 : 1))}</p>
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {opts.map((opt) => {
                                                                            const selected = (typeof userVal === 'string' ? userVal : '').toLowerCase() === opt.toLowerCase();
                                                                            const isAns = opt.toLowerCase() === ans.toLowerCase();
                                                                            return (
                                                                                <label key={opt} className={`flex cursor-pointer items-center justify-center min-w-[2.5rem] h-8 px-2 rounded-lg border text-xs font-bold italic transition ${
                                                                                    checked
                                                                                        ? isAns ? 'border-emerald-500 bg-emerald-500 text-white'
                                                                                        : selected && !isAns ? 'border-rose-500 bg-rose-500 text-white'
                                                                                        : 'border-slate-200 bg-slate-100 text-slate-400'
                                                                                        : selected ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                                                                                        : 'border-slate-300 bg-white text-slate-600 hover:border-indigo-400 hover:text-indigo-600'
                                                                                }`}>
                                                                                    <input type="radio" name={`q_${key}`} disabled={checked} checked={selected}
                                                                                        onChange={() => handleInputChange(key, opt)} className="hidden" />
                                                                                    {opt}
                                                                                </label>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                    {checked && iswrong && (
                                                                        <p className="mt-1 text-xs font-semibold text-rose-600">✗ Answer: <strong>{ans}</strong></p>
                                                                    )}
                                                                    {checked && isCorrect && (
                                                                        <p className="mt-1 text-xs font-semibold text-emerald-600">✓ Correct</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}

                                                    {/* Evidence after check */}
                                                    {checked && q.answerLine && (
                                                        <div className="mt-2.5 ml-7 rounded-lg border-l-4 border-amber-400 bg-amber-50 px-4 py-2.5 text-xs leading-relaxed text-slate-700">
                                                            <span className="font-black text-amber-700 uppercase tracking-widest text-[9px]">Evidence </span>
                                                            <span className="text-slate-600 italic">&ldquo;{q.answerLine}&rdquo;</span>
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
                        <div className="mt-6 rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                            <div className="bg-slate-900 px-6 py-4 text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Result</p>
                            </div>
                            <div className="bg-white px-6 py-5">
                                <div className="flex justify-center gap-10 mb-5">
                                    <div className="text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Score</p>
                                        <p className="text-4xl font-black text-slate-900 mt-1">{score.correct}<span className="text-xl text-slate-400">/{score.total}</span></p>
                                    </div>
                                    <div className="w-px bg-slate-100" />
                                    <div className="text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Percentage</p>
                                        <p className="text-4xl font-black text-indigo-600 mt-1">{score.total ? Math.round((score.correct / score.total) * 100) : 0}%</p>
                                    </div>
                                    <div className="w-px bg-slate-100" />
                                    <div className="text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Band Est.</p>
                                        <p className="text-4xl font-black text-emerald-600 mt-1">{moduleBandEstimate(type, score.correct, score.total) ?? '–'}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap justify-center gap-2 pt-4 border-t border-slate-100">
                                    <button onClick={restoreFullSet}
                                        className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition">
                                        <RotateCcw size={13} /> Re-take
                                    </button>
                                    {wrongQuestionNumbers.length > 0 && (
                                        <button onClick={retryWrongOnly}
                                            className="inline-flex items-center gap-2 rounded-xl border-2 border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100 transition">
                                            ⟳ Retry Wrong ({wrongQuestionNumbers.length})
                                        </button>
                                    )}
                                    {isRetryMode && (
                                        <button onClick={restoreFullSet}
                                            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
                                            Full Set
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit / Reset */}
                    {!checked && (
                        <div className="mt-6 flex items-center gap-3 border-t-2 border-slate-100 pt-5">
                            <button type="button" onClick={() => {
                                if (isExamMode && !confirm('Submit now?')) return;
                                finalizeAttempt();
                            }}
                                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-indigo-500 active:scale-95">
                                <CheckCircle2 size={17} /> Submit Answers
                            </button>
                            <button type="button" onClick={restoreFullSet}
                                className="flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition">
                                <RotateCcw size={17} /> Reset
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
