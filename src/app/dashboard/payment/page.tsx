'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Lock, Mic, BookOpen, Bot, Radio, MessageSquare, ChevronLeft, Infinity } from 'lucide-react';
import { Suspense } from 'react';

const PLANS = {
    spoken: {
        id: 'spoken',
        name: 'Spoken English',
        price: 49,
        original: 149,
        color: 'from-emerald-600 to-teal-600',
        borderColor: 'border-emerald-200',
        bgColor: 'bg-emerald-50',
        badgeColor: 'bg-emerald-100 text-emerald-700',
        badge: null,
        features: [
            { icon: Radio, text: 'Headway 4B — সব ১৪ Unit unlock (1-3 free)' },
            { icon: Radio, text: 'Listen → Dictation → Shadowing practice' },
            { icon: MessageSquare, text: 'AI Conversation Practice (১৫ IELTS topic)' },
            { icon: Mic, text: 'Voice input + AI feedback in Bangla' },
        ],
        notIncluded: ['AI Tutor (IELTS)', 'Unlimited AI Chat'],
    },
    ielts_spoken: {
        id: 'ielts_spoken',
        name: 'IELTS + Spoken English',
        price: 299,
        original: 499,
        color: 'from-blue-600 to-indigo-600',
        borderColor: 'border-blue-200',
        bgColor: 'bg-blue-50',
        badgeColor: 'bg-blue-100 text-blue-700',
        badge: 'সেরা Value',
        features: [
            { icon: Bot, text: 'AI Tutor — image upload, voice in/out' },
            { icon: MessageSquare, text: 'AI Conversation Practice (১৫ IELTS topic)' },
            { icon: Radio, text: 'Headway 4B — সব ১৪ Unit unlock' },
            { icon: BookOpen, text: 'Cambridge Reading/Listening — সব Books' },
        ],
        notIncluded: ['Unlimited AI Chat (দিনে ২০টি limit)'],
    },
    unlimited_chat: {
        id: 'unlimited_chat',
        name: 'Unlimited AI Chat',
        price: 499,
        original: 999,
        color: 'from-violet-600 to-purple-600',
        borderColor: 'border-violet-300',
        bgColor: 'bg-violet-50',
        badgeColor: 'bg-violet-100 text-violet-700',
        badge: '∞ Unlimited',
        features: [
            { icon: Infinity, text: 'AI Tutor — Unlimited দৈনিক প্রশ্ন (কোনো limit নেই)' },
            { icon: Bot, text: 'Image upload, voice in/out সহ সব AI feature' },
            { icon: MessageSquare, text: 'AI Conversation Practice (১৫ IELTS topic)' },
            { icon: Radio, text: 'Headway 4B — সব ১৪ Unit unlock' },
        ],
        notIncluded: [],
    },
};

type PlanId = keyof typeof PLANS;

function PaymentContent() {
    const searchParams = useSearchParams();
    const required = searchParams.get('required');

    const getInitialPlan = (): PlanId => {
        if (required === 'unlimited_chat') return 'unlimited_chat';
        if (required === 'ielts_spoken') return 'ielts_spoken';
        return 'spoken';
    };

    const [selectedPlan, setSelectedPlan] = useState<PlanId>(getInitialPlan());
    const [step, setStep] = useState<'plan' | 'pay' | 'activate'>('plan');
    const [form, setForm] = useState({ email: '', transactionId: '' });
    const [activateEmail, setActivateEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('error');

    const plan = PLANS[selectedPlan];

    const submitPayment = async (e: React.FormEvent) => {
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
                    amount: plan.price,
                    plan: selectedPlan,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMessageType('error');
                setMessage(data.error || 'Submit failed।');
                return;
            }
            setMessageType('success');
            setMessage('Payment request submit হয়েছে। Admin approve করলে নিচের form থেকে activate করো।');
            setStep('activate');
        } catch {
            setMessageType('error');
            setMessage('Network সমস্যা। আবার try করো।');
        } finally {
            setLoading(false);
        }
    };

    const activateSubscription = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const res = await fetch('/api/subscription/activate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: activateEmail }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMessageType('error');
                setMessage(data.error || 'Activation failed।');
                return;
            }
            setMessageType('success');
            setMessage('✅ Subscription চালু হয়েছে! Dashboard এ যাও।');
        } catch {
            setMessageType('error');
            setMessage('Activation failed। আবার try করো।');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f6fa]">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 px-5 py-10">
                <div className="mx-auto max-w-4xl">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition">
                        <ChevronLeft size={15} /> Dashboard
                    </Link>
                    <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300">Subscription</p>
                    <h1 className="mt-2 text-3xl font-black text-white">Plan বেছে নাও</h1>
                    <p className="mt-2 text-sm text-slate-400">bKash এ payment করো, admin approve করবে।</p>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-5 py-8">
                {required && (
                    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        🔒 এই feature টি access করতে subscription দরকার।
                    </div>
                )}

                {/* Plan cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    {(Object.values(PLANS) as typeof PLANS[PlanId][]).map((p) => (
                        <button
                            key={p.id}
                            onClick={() => setSelectedPlan(p.id as PlanId)}
                            className={`text-left rounded-2xl border-2 p-5 transition ${
                                selectedPlan === p.id
                                    ? `${p.borderColor} ${p.bgColor} ring-2 ring-offset-1 ${p.borderColor}`
                                    : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    {p.badge && (
                                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold mb-2 ${p.badgeColor}`}>
                                            {p.badge}
                                        </span>
                                    )}
                                    <p className="font-bold text-slate-900 text-lg">{p.name}</p>
                                    <div className="mt-1 flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-slate-900">৳{p.price}</span>
                                        <span className="text-slate-400 text-sm">/মাস</span>
                                        <span className="text-slate-400 text-xs line-through">৳{p.original}</span>
                                    </div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${
                                    selectedPlan === p.id ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                                }`}>
                                    {selectedPlan === p.id && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                            </div>

                            <ul className="mt-4 space-y-2">
                                {p.features.map((f, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                        <CheckCircle2 size={15} className="text-emerald-500 mt-0.5 shrink-0" />
                                        {f.text}
                                    </li>
                                ))}
                                {p.notIncluded.map((f, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                                        <Lock size={13} className="mt-0.5 shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </button>
                    ))}
                </div>

                {/* Payment steps */}
                <div className="mt-8 grid gap-4 lg:grid-cols-2">
                    {/* Step 1: bKash */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-7 h-7 rounded-full bg-pink-100 text-pink-700 text-xs font-black flex items-center justify-center">১</span>
                            <h3 className="font-bold text-slate-900">bKash এ Send Money করো</h3>
                        </div>
                        <div className="rounded-xl bg-pink-50 border border-pink-100 p-4 text-center">
                            <p className="text-xs text-pink-600 font-semibold uppercase tracking-wide">bKash Number</p>
                            <p className="text-2xl font-black text-pink-700 mt-1">01XXXXXXXXXX</p>
                            <p className="text-xs text-pink-500 mt-1">(Personal/Send Money)</p>
                        </div>
                        <div className="mt-4 rounded-xl bg-slate-50 p-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Plan</span>
                                <span className="font-semibold text-slate-900">{plan.name}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-2">
                                <span className="text-slate-500">Amount</span>
                                <span className="font-bold text-slate-900">৳{plan.price}</span>
                            </div>
                        </div>
                        <p className="mt-3 text-xs text-slate-500">Payment করার পর Transaction ID note করো।</p>
                    </div>

                    {/* Step 2 & 3 */}
                    <div className="space-y-4">
                        <form onSubmit={submitPayment} className="rounded-2xl border border-slate-200 bg-white p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">২</span>
                                <h3 className="font-bold text-slate-900">Request Submit করো</h3>
                            </div>
                            <div className="space-y-3">
                                <input
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                    placeholder="তোমার Email"
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                    required
                                />
                                <input
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                    placeholder="bKash Transaction ID"
                                    value={form.transactionId}
                                    onChange={(e) => setForm((p) => ({ ...p, transactionId: e.target.value }))}
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={loading || step === 'activate'}
                                    className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Submitting...' : 'Submit Request'}
                                </button>
                            </div>
                        </form>

                        <form onSubmit={activateSubscription} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-7 h-7 rounded-full bg-emerald-500 text-white text-xs font-black flex items-center justify-center">৩</span>
                                <h3 className="font-bold text-slate-900">Approve হলে এখানে Email দাও</h3>
                            </div>
                            <p className="text-xs text-slate-600 mb-4">
                                Admin approve করলে (সাধারণত ১-২ ঘণ্টা) শুধু email দিলেই subscription চালু হবে।
                            </p>
                            <div className="space-y-3">
                                <input
                                    className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                                    placeholder="তোমার Email"
                                    type="email"
                                    value={activateEmail}
                                    onChange={(e) => setActivateEmail(e.target.value)}
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 disabled:bg-slate-200 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Checking...' : 'Subscription Activate করো'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {message && (
                    <div className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
                        messageType === 'success'
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                            : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                        {message}
                        {messageType === 'success' && (
                            <Link href="/dashboard" className="ml-2 underline font-bold">Dashboard →</Link>
                        )}
                    </div>
                )}

                {/* Status Check */}
                <StatusChecker />
            </div>
        </div>
    );
}

function StatusChecker() {
    const [email, setEmail] = useState('');
    const [result, setResult] = useState<{ found: boolean; status?: string; plan?: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const checkStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            const res = await fetch(`/api/subscription/status?email=${encodeURIComponent(email)}`);
            const data = await res.json();
            setResult(data);
        } catch {
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="font-bold text-slate-900 mb-1">আমার Order এর Status দেখো</h3>
            <p className="text-xs text-slate-500 mb-4">Payment submit করার পর এখানে email দিয়ে status check করো।</p>
            <form onSubmit={checkStatus} className="flex gap-3">
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="তোমার Email"
                    required
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-700 disabled:opacity-50 whitespace-nowrap"
                >
                    {loading ? '...' : 'Check করো'}
                </button>
            </form>

            {result && (
                <div className="mt-4">
                    {!result.found ? (
                        <p className="text-sm text-slate-500">এই email এ কোনো payment request পাওয়া যায়নি।</p>
                    ) : result.status === 'PENDING' ? (
                        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                            <p className="text-sm font-bold text-amber-700">⏳ Pending — Admin review করছে</p>
                            <p className="text-xs text-amber-600 mt-1">সাধারণত ১-২ ঘণ্টার মধ্যে approve হবে।</p>
                        </div>
                    ) : result.status === 'APPROVED' ? (
                        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
                            <p className="text-sm font-bold text-emerald-700">✅ Approved! Subscription activate করো।</p>
                            <p className="text-xs text-emerald-600 mt-1">উপরের Step ৩ তে email দিয়ে activate করো।</p>
                        </div>
                    ) : (
                        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                            <p className="text-sm font-bold text-red-700">❌ Rejected — Admin এর সাথে যোগাযোগ করো।</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center text-slate-500">Loading...</div>}>
            <PaymentContent />
        </Suspense>
    );
}
