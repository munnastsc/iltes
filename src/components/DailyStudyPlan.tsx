'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, Flame, ChevronRight } from 'lucide-react';

type Task = {
    id: string;
    label: string;
    bangla: string;
    duration: string;
    href: string;
    color: string;
    check: string;
};

const DAILY_TASKS: Task[] = [
    { id: 'reading',   label: 'Reading Practice',    bangla: 'রিডিং',      duration: '15 min', href: '/dashboard/reading',        color: 'text-emerald-600', check: 'plan_reading' },
    { id: 'listening', label: 'Listening Practice',  bangla: 'লিসেনিং',   duration: '15 min', href: '/dashboard/listening',      color: 'text-blue-600',    check: 'plan_listening' },
    { id: 'speaking',  label: 'Speaking Practice',   bangla: 'স্পিকিং',   duration: '10 min', href: '/dashboard/ai-conversation',color: 'text-rose-600',    check: 'plan_speaking' },
    { id: 'vocab',     label: 'Vocabulary',          bangla: 'ভোকাবুলারি', duration: '10 min', href: '/dashboard/vocabulary',     color: 'text-violet-600',  check: 'plan_vocab' },
    { id: 'writing',   label: 'Writing',             bangla: 'রাইটিং',     duration: '10 min', href: '/dashboard/writing',        color: 'text-amber-600',   check: 'plan_writing' },
];

const TODAY = new Date().toISOString().slice(0, 10);

function getChecked(): Record<string, boolean> {
    if (typeof window === 'undefined') return {};
    try {
        const raw = localStorage.getItem('daily_plan_' + TODAY);
        return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
}

function saveChecked(data: Record<string, boolean>) {
    localStorage.setItem('daily_plan_' + TODAY, JSON.stringify(data));
}

function getStreak(): number {
    if (typeof window === 'undefined') return 0;
    let streak = 0;
    const d = new Date();
    for (let i = 0; i < 60; i++) {
        const key = 'daily_plan_' + d.toISOString().slice(0, 10);
        const raw = localStorage.getItem(key);
        if (!raw) break;
        const data = JSON.parse(raw);
        const done = Object.values(data).filter(Boolean).length;
        if (done >= 3) streak++;
        else break;
        d.setDate(d.getDate() - 1);
    }
    return streak;
}

export default function DailyStudyPlan() {
    const [checked, setChecked] = useState<Record<string, boolean>>({});
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        setChecked(getChecked());
        setStreak(getStreak());
    }, []);

    function toggle(id: string) {
        const next = { ...checked, [id]: !checked[id] };
        setChecked(next);
        saveChecked(next);
        setStreak(getStreak());
    }

    const doneCount = Object.values(checked).filter(Boolean).length;
    const total = DAILY_TASKS.length;
    const pct = Math.round((doneCount / total) * 100);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div>
                    <p className="font-black text-slate-900 text-sm">📅 আজকের Study Plan</p>
                    <p className="text-[11px] text-slate-500">{new Date().toLocaleDateString('bn-BD', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl bg-orange-50 border border-orange-100 px-3 py-1.5">
                    <Flame size={14} className={streak > 0 ? 'text-orange-500' : 'text-slate-300'} />
                    <span className="text-sm font-black text-slate-700">{streak}</span>
                    <span className="text-[10px] text-slate-500">day streak</span>
                </div>
            </div>

            {/* Progress bar */}
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-600">{doneCount}/{total} tasks done</span>
                    <span className="text-[11px] font-black text-slate-700">{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                    />
                </div>
                {doneCount === total && (
                    <p className="text-[11px] font-bold text-emerald-600 mt-1.5">🎉 আজকের সব task শেষ! দারুণ!</p>
                )}
            </div>

            {/* Task list */}
            <div className="divide-y divide-slate-50">
                {DAILY_TASKS.map(task => {
                    const done = !!checked[task.id];
                    return (
                        <div key={task.id} className={`flex items-center gap-3 px-5 py-3 transition-colors ${done ? 'bg-emerald-50/40' : 'hover:bg-slate-50'}`}>
                            <button onClick={() => toggle(task.id)} className="flex-shrink-0">
                                {done
                                    ? <CheckCircle2 size={20} className="text-emerald-500" />
                                    : <Circle size={20} className="text-slate-300" />
                                }
                            </button>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-bold ${done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                    {task.label}
                                </p>
                                <p className="text-[10px] text-slate-400">{task.bangla} · {task.duration}</p>
                            </div>
                            <Link href={task.href}
                                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition ${done ? 'text-slate-400 hover:bg-slate-100' : `${task.color} hover:bg-slate-100`}`}>
                                Start <ChevronRight size={11} />
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
