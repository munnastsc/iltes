'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';

type Record = {
    id: string;
    bookNumber: number;
    testNumber: number;
    module: string;
    audioUrl?: string | null;
};

export default function AdminRecordsTable({ items }: { items: Record[] }) {
    const [confirmId, setConfirmId] = useState<string | null>(null);

    return (
        <div className="max-h-[650px] overflow-y-auto">
            {confirmId && (
                <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs">
                    <p className="font-semibold text-rose-700">Delete this record?</p>
                    <div className="mt-2 flex gap-2">
                        <form action="/admin/books/actions" method="post">
                            <input type="hidden" name="actionType" value="deleteRecord" />
                            <input type="hidden" name="id" value={confirmId} />
                            <button
                                type="submit"
                                className="rounded bg-rose-600 px-3 py-1 text-xs font-bold text-white hover:bg-rose-700"
                            >
                                Yes, delete
                            </button>
                        </form>
                        <button
                            type="button"
                            onClick={() => setConfirmId(null)}
                            className="rounded border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="text-left text-xs uppercase tracking-[0.08em] text-slate-500">
                        <th className="border-b border-slate-200 px-2 py-2">Book</th>
                        <th className="border-b border-slate-200 px-2 py-2">Test</th>
                        <th className="border-b border-slate-200 px-2 py-2">Module</th>
                        <th className="border-b border-slate-200 px-2 py-2">Audio</th>
                        <th className="border-b border-slate-200 px-2 py-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((row) => (
                        <tr key={row.id} className="group hover:bg-slate-50">
                            <td className="border-b border-slate-100 px-2 py-1.5">{row.bookNumber}</td>
                            <td className="border-b border-slate-100 px-2 py-1.5">{row.testNumber}</td>
                            <td className="border-b border-slate-100 px-2 py-1.5">{row.module}</td>
                            <td className="border-b border-slate-100 px-2 py-1.5">
                                {row.module === 'Listening' ? (
                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                                        via proxy
                                    </span>
                                ) : (
                                    <span className="text-[10px] text-slate-300">—</span>
                                )}
                            </td>
                            <td className="border-b border-slate-100 px-2 py-1.5">
                                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link
                                        href={`/admin/books?tab=content&editId=${row.id}`}
                                        className="inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50"
                                    >
                                        <Pencil size={10} /> Edit
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setConfirmId(row.id)}
                                        className="inline-flex items-center gap-1 rounded border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-600 hover:bg-rose-100"
                                    >
                                        <Trash2 size={10} /> Del
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
