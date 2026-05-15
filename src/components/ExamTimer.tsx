'use client';

import { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';

type Props = {
    durationMinutes: number;
    onExpire: () => void;
    isActive: boolean;
};

export default function ExamTimer({ durationMinutes, onExpire, isActive }: Props) {
    const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);

    useEffect(() => {
        if (!isActive || secondsLeft <= 0) return;

        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onExpire();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, secondsLeft, onExpire]);

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const isLowTime = secondsLeft < 300; // Less than 5 minutes

    return (
        <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-mono font-bold shadow-sm border ${
            isLowTime ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
            <Timer size={16} />
            {formatTime(secondsLeft)}
        </div>
    );
}
