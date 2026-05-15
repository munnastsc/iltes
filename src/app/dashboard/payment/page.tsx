'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PaymentPage() {
    const [form, setForm] = useState({ email: '', transactionId: '', amount: '9' });
    const [activateForm, setActivateForm] = useState({ email: '', transactionId: '' });
    const [loading, setLoading] = useState(false);
    const [activating, setActivating] = useState(false);
    const [message, setMessage] = useState('');

    const submitPaymentRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const res = await fetch('/api/subscription/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: form.email,
                    transactionId: form.transactionId,
                    amount: Number(form.amount),
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMessage(data.error || 'Request submission failed.');
                return;
            }
            setMessage('Payment request submitted. Admin approval এর পর activate করুন।');
        } catch {
            setMessage('Network সমস্যা হয়েছে। আবার চেষ্টা করুন।');
        } finally {
            setLoading(false);
        }
    };

    const activateSubscription = async (e: React.FormEvent) => {
        e.preventDefault();
        setActivating(true);
        setMessage('');
        try {
            const res = await fetch('/api/subscription/activate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(activateForm),
            });
            const data = await res.json();
            if (!res.ok) {
                setMessage(data.error || 'Activation failed.');
                return;
            }
            setMessage('Subscription activated successfully. এখন protected বই access করতে পারবেন।');
        } catch {
            setMessage('Activation request failed.');
        } finally {
            setActivating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-5 py-8">
            <div className="mx-auto max-w-5xl">
                <header className="border-b border-slate-200 pb-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">Subscription</p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">Upgrade Your IELTS Workspace</h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Step 1: payment request submit করুন। Step 2: admin approve হলে activation form থেকে access enable করুন।
                    </p>
                </header>

                <section className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 bg-white p-5">
                        <p className="text-xs uppercase tracking-[0.1em] text-slate-500">Monthly</p>
                        <h2 className="mt-2 text-3xl font-bold text-slate-900">$9</h2>
                        <p className="mt-2 text-sm text-slate-600">All books + AI coach + module practice</p>
                    </div>
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
                        <p className="text-xs uppercase tracking-[0.1em] text-blue-600">Yearly (Best Value)</p>
                        <h2 className="mt-2 text-3xl font-bold text-slate-900">$79</h2>
                        <p className="mt-2 text-sm text-slate-700">Long-term prep with continuous updates</p>
                    </div>
                </section>

                <section className="mt-6 grid gap-4 lg:grid-cols-2">
                    <form onSubmit={submitPaymentRequest} className="rounded-lg border border-slate-200 bg-white p-5">
                        <h3 className="text-lg font-semibold text-slate-900">1) Submit Payment Request</h3>
                        <p className="mt-1 text-sm text-slate-600">Transaction id submit করলে admin panel-এ review হবে।</p>

                        <div className="mt-4 space-y-3">
                            <input
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                                placeholder="Email"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                required
                            />
                            <input
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                                placeholder="Transaction ID"
                                value={form.transactionId}
                                onChange={(e) => setForm((p) => ({ ...p, transactionId: e.target.value }))}
                                required
                            />
                            <input
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                                placeholder="Amount"
                                type="number"
                                value={form.amount}
                                onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
                            >
                                {loading ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </form>

                    <form onSubmit={activateSubscription} className="rounded-lg border border-slate-200 bg-white p-5">
                        <h3 className="text-lg font-semibold text-slate-900">2) Activate After Approval</h3>
                        <p className="mt-1 text-sm text-slate-600">Admin APPROVED করলে এই form থেকে subscription চালু হবে।</p>

                        <div className="mt-4 space-y-3">
                            <input
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                                placeholder="Email"
                                type="email"
                                value={activateForm.email}
                                onChange={(e) => setActivateForm((p) => ({ ...p, email: e.target.value }))}
                                required
                            />
                            <input
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                                placeholder="Transaction ID"
                                value={activateForm.transactionId}
                                onChange={(e) => setActivateForm((p) => ({ ...p, transactionId: e.target.value }))}
                                required
                            />
                            <button
                                type="submit"
                                disabled={activating}
                                className="w-full rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
                            >
                                {activating ? 'Activating...' : 'Activate Subscription'}
                            </button>
                        </div>
                    </form>
                </section>

                {message && <p className="mt-4 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">{message}</p>}

                <div className="mt-6">
                    <Link href="/dashboard" className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
