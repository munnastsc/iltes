'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';

type Order = {
    id: string;
    email: string;
    transactionId: string;
    amount: number;
    plan: string | null;
    status: string;
    createdAt: string;
};

const PLAN_LABELS: Record<string, string> = {
    spoken: 'Spoken English (৳49)',
    ielts_spoken: 'IELTS + Spoken (৳299)',
};

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700',
    APPROVED: 'bg-emerald-100 text-emerald-700',
    REJECTED: 'bg-red-100 text-red-700',
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/payment-requests');
            const data = await res.json();
            setOrders(data.items || []);
        } catch {
            setMessage('Orders load করতে পারেনি।');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const updateStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        setUpdating(id);
        try {
            const res = await fetch('/api/admin/payment-requests', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });
            if (res.ok) {
                setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
                setMessage(`${status === 'APPROVED' ? '✅ Approved' : '❌ Rejected'}!`);
                setTimeout(() => setMessage(''), 3000);
            }
        } catch {
            setMessage('Update failed।');
        } finally {
            setUpdating(null);
        }
    };

    const pending = orders.filter(o => o.status === 'PENDING');
    const others = orders.filter(o => o.status !== 'PENDING');

    return (
        <div className="min-h-screen bg-[#f5f6fa] p-6">
            <div className="mx-auto max-w-4xl">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900">Payment Orders</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Pending: <span className="font-bold text-amber-600">{pending.length}</span>
                            {' · '}Total: {orders.length}
                        </p>
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                        <RefreshCw size={14} /> Refresh
                    </button>
                </div>

                {message && (
                    <div className="mb-4 rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
                        {message}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12 text-slate-400">Loading...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">কোনো order নেই।</div>
                ) : (
                    <div className="space-y-6">
                        {/* Pending first */}
                        {pending.length > 0 && (
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-amber-600 mb-3">
                                    🔔 Pending ({pending.length})
                                </p>
                                <div className="space-y-3">
                                    {pending.map(order => (
                                        <OrderCard
                                            key={order.id}
                                            order={order}
                                            updating={updating}
                                            onUpdate={updateStatus}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {others.length > 0 && (
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                                    History
                                </p>
                                <div className="space-y-3">
                                    {others.map(order => (
                                        <OrderCard
                                            key={order.id}
                                            order={order}
                                            updating={updating}
                                            onUpdate={updateStatus}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function OrderCard({ order, updating, onUpdate }: {
    order: Order;
    updating: string | null;
    onUpdate: (id: string, status: 'APPROVED' | 'REJECTED') => void;
}) {
    const date = new Date(order.createdAt).toLocaleString('bn-BD', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className={`rounded-2xl bg-white border p-5 ${order.status === 'PENDING' ? 'border-amber-200 shadow-sm shadow-amber-50' : 'border-slate-200'}`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_COLORS[order.status] || 'bg-slate-100 text-slate-600'}`}>
                            {order.status}
                        </span>
                        <span className="text-xs text-slate-400">{date}</span>
                    </div>
                    <p className="mt-2 font-bold text-slate-900 truncate">{order.email}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                        <span>TxID: <span className="font-mono font-semibold text-slate-700">{order.transactionId}</span></span>
                        <span>৳{order.amount}</span>
                        <span className="rounded bg-blue-50 text-blue-700 px-1.5 py-0.5 font-medium">
                            {PLAN_LABELS[order.plan || ''] || order.plan || 'Unknown'}
                        </span>
                    </div>
                </div>

                {order.status === 'PENDING' && (
                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={() => onUpdate(order.id, 'APPROVED')}
                            disabled={updating === order.id}
                            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-50"
                        >
                            <CheckCircle2 size={13} />
                            {updating === order.id ? '...' : 'Approve'}
                        </button>
                        <button
                            onClick={() => onUpdate(order.id, 'REJECTED')}
                            disabled={updating === order.id}
                            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
                        >
                            <XCircle size={13} />
                            Reject
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
