'use client';
import { useState, useEffect } from 'react';
import { Upload, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

type AudioStatus = { existing: string[]; total: number; present: number };

export default function AdminAudioTab() {
    const [status, setStatus] = useState<AudioStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterCam, setFilterCam] = useState(1);
    const [uploading, setUploading] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

    useEffect(() => {
        fetch('/api/admin/audio/status')
            .then((r) => r.json())
            .then((d) => { setStatus(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const existingSet = new Set(status?.existing ?? []);

    async function handleUpload(cam: number, test: number, part: number, file: File) {
        const key = `cam${cam}-test${test}-part${part}.mp3`;
        setUploading(key);
        setMessage(null);
        const form = new FormData();
        form.append('file', file);
        form.append('cam', String(cam));
        form.append('test', String(test));
        form.append('part', String(part));
        try {
            const res = await fetch('/api/admin/audio/upload', { method: 'POST', body: form });
            const data = await res.json();
            if (data.ok) {
                setStatus((prev) =>
                    prev ? { ...prev, existing: [...prev.existing, key], present: prev.present + 1 } : prev,
                );
                setMessage({ type: 'ok', text: `${key} uploaded successfully.` });
            } else {
                setMessage({ type: 'err', text: data.error ?? 'Upload failed.' });
            }
        } catch {
            setMessage({ type: 'err', text: 'Network error during upload.' });
        } finally {
            setUploading(null);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center gap-2 py-10 text-sm text-slate-500">
                <Loader2 size={16} className="animate-spin" /> Scanning audio files…
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* Overall summary */}
            <div className="rounded-lg border border-slate-200 bg-white px-5 py-4">
                <p className="text-sm text-slate-600">
                    <span className="font-bold text-slate-900">{status?.present ?? 0}</span> of{' '}
                    <span className="font-bold text-slate-900">{status?.total ?? 320}</span> audio files present in{' '}
                    <code className="rounded bg-slate-100 px-1 text-xs">public/audio/</code>
                </p>
                <p className="mt-1 text-xs text-slate-400">
                    Naming: <code>cam&#123;N&#125;-test&#123;T&#125;-part&#123;P&#125;.mp3</code> — Mock Test 1 = Cam1, Mock 10 = Cam10, Cambridge 10 = Cam10
                </p>
            </div>

            {message && (
                <p className={`rounded-md border px-4 py-2.5 text-xs font-medium ${
                    message.type === 'ok'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-rose-200 bg-rose-50 text-rose-700'
                }`}>
                    {message.text}
                </p>
            )}

            {/* Cam selector grid */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {Array.from({ length: 20 }, (_, i) => i + 1).map((cam) => {
                    const count = Array.from(existingSet).filter((f) => f.startsWith(`cam${cam}-`)).length;
                    const color =
                        count === 16
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                            : count === 0
                            ? 'border-rose-200 bg-rose-50 text-rose-700'
                            : 'border-amber-200 bg-amber-50 text-amber-700';
                    return (
                        <button
                            key={cam}
                            onClick={() => setFilterCam(cam)}
                            className={`rounded-lg border p-2 text-center transition ${
                                filterCam === cam
                                    ? 'ring-2 ring-blue-400 ring-offset-1'
                                    : 'hover:opacity-80'
                            } ${color}`}
                        >
                            <p className="text-xs font-bold">Cam {cam}</p>
                            <p className="text-[10px] mt-0.5">{count}/16</p>
                        </button>
                    );
                })}
            </div>

            {/* File matrix for selected cam */}
            <div className="rounded-lg border border-slate-200 bg-white p-4">
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                    Cam {filterCam} audio files
                    <span className="ml-2 text-xs font-normal text-slate-400">
                        ({Array.from(existingSet).filter((f) => f.startsWith(`cam${filterCam}-`)).length}/16 present)
                    </span>
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                <th className="border-b border-slate-200 px-3 py-2">File</th>
                                <th className="border-b border-slate-200 px-3 py-2">Status</th>
                                <th className="border-b border-slate-200 px-3 py-2">Upload</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4].flatMap((test) =>
                                [1, 2, 3, 4].map((part) => {
                                    const key = `cam${filterCam}-test${test}-part${part}.mp3`;
                                    const exists = existingSet.has(key);
                                    const isUploading = uploading === key;
                                    const inputId = `up-${filterCam}-${test}-${part}`;
                                    return (
                                        <tr key={key}>
                                            <td className="border-b border-slate-100 px-3 py-2 font-mono text-xs text-slate-600">
                                                {key}
                                            </td>
                                            <td className="border-b border-slate-100 px-3 py-2">
                                                {exists ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                                                        <CheckCircle2 size={12} /> Present
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-500">
                                                        <XCircle size={12} /> Missing
                                                    </span>
                                                )}
                                            </td>
                                            <td className="border-b border-slate-100 px-3 py-2">
                                                {isUploading ? (
                                                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                                                        <Loader2 size={11} className="animate-spin" /> Uploading…
                                                    </span>
                                                ) : (
                                                    <label
                                                        htmlFor={inputId}
                                                        className="inline-flex cursor-pointer items-center gap-1 rounded border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                                                    >
                                                        <Upload size={11} />
                                                        {exists ? 'Replace' : 'Upload'}
                                                        <input
                                                            id={inputId}
                                                            type="file"
                                                            accept="audio/mpeg,.mp3"
                                                            className="sr-only"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) handleUpload(filterCam, test, part, file);
                                                                e.target.value = '';
                                                            }}
                                                        />
                                                    </label>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                }),
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
