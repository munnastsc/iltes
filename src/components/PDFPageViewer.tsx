'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
    pdfUrl: string;
    pageNumber: number;
    label?: string;
}

export default function PDFPageViewer({ pdfUrl, pageNumber, label }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');
    const [zoom, setZoom] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function render() {
            try {
                setStatus('loading');
                const pdfjsLib = await import('pdfjs-dist');
                pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

                const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
                const page = await pdf.getPage(Math.min(pageNumber, pdf.numPages));
                if (cancelled) return;

                const viewport = page.getViewport({ scale: 1.6 });
                const canvas = canvasRef.current;
                if (!canvas) return;

                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d')!;
                await page.render({ canvasContext: ctx, viewport, canvas: canvas }).promise;
                if (!cancelled) setStatus('done');
            } catch {
                if (!cancelled) setStatus('error');
            }
        }

        render();
        return () => { cancelled = true; };
    }, [pdfUrl, pageNumber]);

    return (
        <div className="my-3">
            {label && (
                <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">{label}</p>
            )}
            <div
                className={`relative rounded-xl overflow-hidden border border-amber-200 bg-amber-50 cursor-pointer transition-all ${zoom ? 'fixed inset-4 z-50 bg-white shadow-2xl rounded-2xl overflow-auto' : ''}`}
                onClick={() => setZoom(z => !z)}
                title={zoom ? 'Click to shrink' : 'Click to zoom'}
            >
                {status === 'loading' && (
                    <div className="flex items-center justify-center h-48 gap-2 text-slate-400 text-sm">
                        <span className="h-5 w-5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                        Loading map…
                    </div>
                )}
                {status === 'error' && (
                    <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
                        Map image not available
                    </div>
                )}
                <canvas
                    ref={canvasRef}
                    className={`w-full h-auto ${status !== 'done' ? 'hidden' : ''}`}
                />
                {status === 'done' && !zoom && (
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                        🔍 Click to zoom
                    </div>
                )}
                {zoom && (
                    <button
                        onClick={e => { e.stopPropagation(); setZoom(false); }}
                        className="fixed top-6 right-6 z-50 bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center text-lg font-bold hover:bg-black"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}
