'use client';

import { useEffect, useMemo, useState } from 'react';

export default function ExamCountdown() {
    const [examDate, setExamDate] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('iltes_exam_date');
        if (saved) setExamDate(saved);
    }, []);

    useEffect(() => {
        if (examDate) localStorage.setItem('iltes_exam_date', examDate);
    }, [examDate]);

    const daysLeft = useMemo(() => {
        if (!examDate) return null;
        const target = new Date(examDate);
        if (Number.isNaN(target.getTime())) return null;
        const now = new Date();
        const diff = target.getTime() - now.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }, [examDate]);

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.1em] text-slate-500">Exam Countdown</p>
            <div className="mt-2 flex items-center gap-2">
                <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="rounded border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                />
                {daysLeft !== null && (
                    <p className="text-sm font-semibold text-slate-800">
                        {daysLeft >= 0 ? `${daysLeft} দিন বাকি` : `${Math.abs(daysLeft)} দিন আগে exam হয়ে গেছে`}
                    </p>
                )}
            </div>
        </div>
    );
}
