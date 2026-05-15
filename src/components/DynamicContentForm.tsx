'use client';

import { useState } from 'react';
import { Plus, Trash2, Settings2 } from 'lucide-react';

type QuestionType = 'fill_in_blank' | 'mcq' | 'double_mcq' | 'true_false' | 'matching';

interface Question {
    id: string;
    type: QuestionType;
    number: number;
    prompt: string;
    answer: string;
    answerLine: string;
    options: string[];
}

export default function DynamicContentForm() {
    const [questions, setQuestions] = useState<Question[]>([]);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: Math.random().toString(36).substring(7),
                type: 'fill_in_blank',
                number: questions.length + 1,
                prompt: '',
                answer: '',
                answerLine: '',
                options: ['', '', '', ''],
            },
        ]);
    };

    const removeQuestion = (id: string) => {
        setQuestions(questions.filter((q) => q.id !== id));
    };

    const updateQuestion = (id: string, field: keyof Question, value: any) => {
        setQuestions(
            questions.map((q) => {
                if (q.id === id) {
                    return { ...q, [field]: value };
                }
                return q;
            })
        );
    };

    const updateOption = (id: string, index: number, value: string) => {
        setQuestions(
            questions.map((q) => {
                if (q.id === id) {
                    const newOptions = [...q.options];
                    newOptions[index] = value;
                    return { ...q, options: newOptions };
                }
                return q;
            })
        );
    };

    return (
        <form action="/admin/books/actions" method="post" className="mt-3 space-y-4">
            <input type="hidden" name="actionType" value="structuredSave" />
            
            {/* We stringify the questions to pass them to the backend */}
            <input type="hidden" name="questionsJson" value={JSON.stringify(questions)} />

            <div className="grid gap-3 md:grid-cols-4">
                <input className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" type="number" name="bookNumber" placeholder="Book (1-20 or 101+)" required />
                <input className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" type="number" name="testNumber" placeholder="Test" required />
                <select className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" name="module" defaultValue="Listening">
                    <option value="Listening">Listening</option>
                    <option value="Reading">Reading</option>
                    <option value="Writing">Writing</option>
                    <option value="Speaking">Speaking</option>
                </select>
                <select className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" name="partNumber" defaultValue="1">
                    <option value="1">Part 1</option>
                    <option value="2">Part 2</option>
                    <option value="3">Part 3</option>
                    <option value="4">Part 4</option>
                </select>
            </div>
            <div className="mt-2 rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-800">
                💡 <strong>Mock Test:</strong> Book Number 101 = Mock Test 1, 102 = Mock Test 2, ইত্যাদি। Cambridge Book হলে 1-20 দিন।
            </div>

            <div className="grid gap-3 md:grid-cols-2 mt-3">
                <input className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" type="text" name="audioUrl" placeholder="Audio URL (optional, for Listening)" />
                <input className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" type="text" name="imageUrl" placeholder="Chart/Image URL (optional, e.g. Writing Task 1)" />
            </div>
            
            <input className="w-full mt-3 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" type="text" name="partTitle" placeholder="Part title" required />
            <textarea className="h-28 w-full mt-3 rounded-md border border-slate-300 p-3 text-sm outline-none focus:border-blue-500" name="partText" placeholder="Part passage/text" required />

            <div className="mt-4 border-t border-slate-200 pt-4">
                <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-800">Questions ({questions.length})</h4>
                    <button
                        type="button"
                        onClick={addQuestion}
                        className="flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                    >
                        <Plus size={14} /> Add Question
                    </button>
                </div>

                <div className="space-y-4">
                    {questions.map((q, i) => (
                        <div key={q.id} className="relative rounded-lg border border-slate-200 bg-slate-50 p-4">
                            <button
                                type="button"
                                onClick={() => removeQuestion(q.id)}
                                className="absolute right-3 top-3 text-slate-400 hover:text-rose-500"
                            >
                                <Trash2 size={16} />
                            </button>
                            
                            <div className="mb-3 flex items-center gap-3 pr-8">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-500 shadow-sm">
                                    {i + 1}
                                </span>
                                <select
                                    value={q.type}
                                    onChange={(e) => updateQuestion(q.id, 'type', e.target.value as QuestionType)}
                                    className="rounded border border-slate-300 px-2 py-1 text-xs outline-none focus:border-blue-500"
                                >
                                    <option value="fill_in_blank">Fill in the blanks</option>
                                    <option value="true_false">True/False/Not Given</option>
                                    <option value="mcq">MCQ (Single)</option>
                                    <option value="double_mcq">MCQ (Double)</option>
                                    <option value="matching">Matching Headings</option>
                                </select>
                                <input
                                    type="number"
                                    value={q.number}
                                    onChange={(e) => updateQuestion(q.id, 'number', parseInt(e.target.value) || i + 1)}
                                    className="w-20 rounded border border-slate-300 px-2 py-1 text-xs outline-none focus:border-blue-500"
                                    placeholder="Q. No"
                                />
                            </div>

                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={q.prompt}
                                    onChange={(e) => updateQuestion(q.id, 'prompt', e.target.value)}
                                    className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                                    placeholder="Question Prompt..."
                                    required
                                />

                                {(q.type === 'mcq' || q.type === 'double_mcq' || q.type === 'matching') && (
                                    <div className="grid grid-cols-2 gap-2 rounded bg-white p-3 shadow-sm">
                                        <div className="col-span-2 mb-1 flex items-center gap-2 text-xs font-semibold text-slate-500">
                                            <Settings2 size={12} /> Options
                                        </div>
                                        {q.options.map((opt, optIdx) => (
                                            <input
                                                key={optIdx}
                                                type="text"
                                                value={opt}
                                                onChange={(e) => updateOption(q.id, optIdx, e.target.value)}
                                                className="rounded border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-blue-500"
                                                placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                                            />
                                        ))}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        value={q.answer}
                                        onChange={(e) => updateQuestion(q.id, 'answer', e.target.value)}
                                        className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                                        placeholder={q.type === 'double_mcq' ? "Answers (e.g. A,C)" : "Correct Answer"}
                                        required
                                    />
                                    <input
                                        type="text"
                                        value={q.answerLine}
                                        onChange={(e) => updateQuestion(q.id, 'answerLine', e.target.value)}
                                        className="rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                                        placeholder="Evidence Line in Passage"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button type="submit" className="mt-4 w-full rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500">
                Save Structured Content
            </button>
        </form>
    );
}
