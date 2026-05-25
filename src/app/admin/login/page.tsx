'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock } from 'lucide-react';

function LoginForm() {
    const router = useRouter();
    const params = useSearchParams();
    const [pw, setPw] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: pw }),
            });
            if (res.ok) {
                router.push(params.get('from') || '/admin/orders');
            } else {
                setError('Wrong password. Try again.');
            }
        } catch {
            setError('Something went wrong.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-5">
            <div className="w-full max-w-sm">
                <div className="flex justify-center mb-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600">
                        <Lock size={24} className="text-white" />
                    </div>
                </div>
                <h1 className="text-2xl font-black text-white text-center mb-1">Admin Panel</h1>
                <p className="text-sm text-slate-400 text-center mb-8">ILTES Sathi</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        placeholder="Admin password"
                        value={pw}
                        onChange={e => setPw(e.target.value)}
                        className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
                        autoFocus
                    />
                    {error && <p className="text-sm text-rose-400">{error}</p>}
                    <button type="submit" disabled={loading || !pw}
                        className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white disabled:opacity-50">
                        {loading ? 'Checking...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}
