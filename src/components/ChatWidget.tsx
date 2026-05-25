'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, MessageSquare, Send, X, Mic, MicOff, Volume2, ImageIcon, Infinity } from 'lucide-react';
import { usePathname } from 'next/navigation';

type Message = {
    role: 'user' | 'assistant';
    content: string;
    image?: string;
};

type GeminiHistory = { role: 'user' | 'model'; parts: Array<{ text: string }> };

const FREE_LIMIT = 10;

function getFreeCount(): number {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem('iltes_chat_count') || '0', 10);
}

function saveFreeCount(n: number) {
    localStorage.setItem('iltes_chat_count', String(n));
}

function getUnlimitedCache(): string | null {
    if (typeof window === 'undefined') return null;
    const email = localStorage.getItem('iltes_unlimited_email');
    const ts = parseInt(localStorage.getItem('iltes_unlimited_ts') || '0', 10);
    if (!email || !ts) return null;
    if (Date.now() - ts > 24 * 60 * 60 * 1000) return null;
    return email;
}

function saveUnlimitedCache(email: string) {
    localStorage.setItem('iltes_unlimited_email', email);
    localStorage.setItem('iltes_unlimited_ts', String(Date.now()));
}

function formatText(text: string) {
    return text.split('\n').map((line, i, arr) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
            <span key={i}>
                {parts.map((p, j) =>
                    p.startsWith('**') && p.endsWith('**')
                        ? <strong key={j}>{p.slice(2, -2)}</strong>
                        : <span key={j}>{p}</span>
                )}
                {i < arr.length - 1 && <br />}
            </span>
        );
    });
}

function stripMarkdown(t: string) {
    return t.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/^> /gm, '').replace(/\n+/g, ' ').trim();
}

export default function ChatWidget() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageData, setImageData] = useState<string | null>(null);
    const [imageType, setImageType] = useState('image/jpeg');
    const [showSelector, setShowSelector] = useState(false);
    const [selBook, setSelBook] = useState(9);
    const [selTest, setSelTest] = useState(1);
    const [selModule, setSelModule] = useState<'Reading' | 'Listening'>('Reading');
    const [selQ, setSelQ] = useState(1);

    // Free trial states
    const [dailyCount, setDailyCount] = useState(0);
    const [isUnlimited, setIsUnlimited] = useState(false);
    const [unlimitedEmail, setUnlimitedEmail] = useState('');
    const [showUnlimitInput, setShowUnlimitInput] = useState(false);
    const [unlimitedMsg, setUnlimitedMsg] = useState('');
    const [unlimitedChecking, setUnlimitedChecking] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const count = getFreeCount();
        setDailyCount(count);
        const cached = getUnlimitedCache();
        if (cached) setIsUnlimited(true);
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    function buildHistory(): GeminiHistory[] {
        return messages.slice(-10).map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }],
        }));
    }

    function incrementCount() {
        const next = getFreeCount() + 1;
        saveFreeCount(next);
        setDailyCount(next);
    }

    function isLimitReached() {
        return dailyCount >= FREE_LIMIT && !isUnlimited;
    }

    async function verifyUnlimited() {
        const email = unlimitedEmail.trim().toLowerCase();
        if (!email) return;
        setUnlimitedChecking(true);
        setUnlimitedMsg('');
        try {
            const res = await fetch(`/api/subscription/status?email=${encodeURIComponent(email)}`);
            const data = await res.json();
            if (data?.found && data.status === 'APPROVED') {
                saveUnlimitedCache(email);
                setIsUnlimited(true);
                setShowUnlimitInput(false);
                setUnlimitedMsg('');
            } else {
                setUnlimitedMsg('Active subscription পাওয়া যায়নি।');
            }
        } catch {
            setUnlimitedMsg('Network error। আবার try করো।');
        } finally {
            setUnlimitedChecking(false);
        }
    }

    async function sendQuestionSelector(question: string) {
        if (loading || isLimitReached()) return;
        setMessages(p => [...p, { role: 'user', content: question }]);
        setLoading(true);
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: question, context: 'Cambridge IELTS', history: buildHistory() }),
            });
            const data = await res.json();
            setMessages(p => [...p, { role: 'assistant', content: data?.text || 'উত্তর দিতে পারছি না।' }]);
            incrementCount();
        } catch {
            setMessages(p => [...p, { role: 'assistant', content: 'Network error।' }]);
        } finally {
            setLoading(false);
        }
    }

    async function sendMessage() {
        const question = input.trim();
        if ((!question && !imageData) || loading || isLimitReached()) return;

        const img = imageData;
        const iType = imageType;
        setMessages(p => [...p, { role: 'user', content: question || '📸 Image পাঠালাম', image: img || undefined }]);
        setInput('');
        setImagePreview(null);
        setImageData(null);
        setLoading(true);

        try {
            const body: Record<string, unknown> = {
                message: question || 'এই image টা দেখো এবং IELTS সম্পর্কিত যা আছে explain করো।',
                context: 'General IELTS',
                history: buildHistory(),
            };
            if (img) { body.image = img; body.imageType = iType; }

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            setMessages(p => [...p, { role: 'assistant', content: data?.text || 'উত্তর দিতে পারছি না, আবার চেষ্টা করো।' }]);
            incrementCount();
        } catch {
            setMessages(p => [...p, { role: 'assistant', content: 'Network error। আবার try করো।' }]);
        } finally {
            setLoading(false);
        }
    }

    function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            const r = ev.target?.result as string;
            setImagePreview(r);
            setImageData(r);
            setImageType(file.type || 'image/jpeg');
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    }

    const toggleVoice = useCallback(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const API = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!API) { alert('Chrome ব্যবহার করো voice input এর জন্য।'); return; }

        if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }

        const r = new API();
        recognitionRef.current = r;
        r.lang = 'bn-BD';
        r.interimResults = false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        r.onresult = (e: any) => setInput((p: string) => p ? p + ' ' + e.results[0][0].transcript : e.results[0][0].transcript);
        r.onerror = () => setIsListening(false);
        r.onend = () => setIsListening(false);
        r.start();
        setIsListening(true);
    }, [isListening]);

    function speakText(text: string) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(stripMarkdown(text));
        const v = window.speechSynthesis.getVoices().find(x => x.lang.startsWith('bn'));
        if (v) u.voice = v;
        u.rate = 0.9;
        window.speechSynthesis.speak(u);
    }

    if (pathname?.startsWith('/dashboard/ai-tutor')) return null;

    const limitReached = isLimitReached();

    return (
        <div className="pointer-events-none fixed bottom-4 right-4 z-50 h-fit w-fit">
            {isOpen ? (
                <div className="pointer-events-auto flex h-[540px] w-[340px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between bg-gradient-to-r from-indigo-700 to-violet-700 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                                <Bot size={14} className="text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">Sathi AI</p>
                                <p className="text-[10px] text-indigo-200">IELTS Tutor • বাংলায়</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {!isUnlimited && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    dailyCount >= FREE_LIMIT ? 'bg-red-500 text-white' : 'bg-white/20 text-white'
                                }`}>
                                    {dailyCount}/{FREE_LIMIT} free
                                </span>
                            )}
                            {isUnlimited && (
                                <span className="flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-400/40 text-white">
                                    <Infinity size={9} /> Unlimited
                                </span>
                            )}
                            <button onClick={() => setIsOpen(false)} className="rounded-lg bg-white/10 p-1.5 text-white hover:bg-white/20 transition">
                                <X size={13} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 space-y-2.5 overflow-y-auto bg-slate-50 p-3">
                        {messages.length === 0 && (
                            <div className="rounded-xl border border-indigo-100 bg-white p-3 text-xs text-slate-600">
                                👋 আমাকে যেকোনো IELTS প্রশ্ন করো। Cambridge Books এর question ও explain করতে পারি!
                            </div>
                        )}

                        {messages.map((m, i) => (
                            <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                                <div className={`inline-block max-w-[90%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                                    m.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-sm'
                                        : 'border border-slate-200 bg-white text-slate-700 rounded-tl-sm'
                                }`}>
                                    {m.image && <img src={m.image} alt="" className="mb-1.5 max-h-24 rounded-lg" />}
                                    {formatText(m.content)}
                                    {m.role === 'assistant' && (
                                        <button onClick={() => speakText(m.content)} className="mt-1 flex items-center gap-0.5 text-[9px] text-slate-400 hover:text-indigo-500 transition">
                                            <Volume2 size={9} /> শুনো
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex gap-1 text-left">
                                <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:0ms]" />
                                <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:150ms]" />
                                <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:300ms]" />
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Cambridge Question Selector */}
                    <div className="border-t border-slate-100 bg-white px-3 pt-2 pb-1">
                        <button
                            onClick={() => setShowSelector(p => !p)}
                            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[10px] font-bold transition ${
                                showSelector ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100'
                            }`}
                        >
                            <span>📚 Cambridge Q Selector</span>
                            <span>{showSelector ? '▲' : '▼'}</span>
                        </button>

                        {showSelector && (
                            <div className="mt-1.5 rounded-lg border border-teal-200 bg-teal-50 p-2">
                                <div className="grid grid-cols-4 gap-1 mb-2">
                                    <div>
                                        <p className="text-[9px] font-bold text-teal-600 mb-0.5">Book</p>
                                        <select value={selBook} onChange={e => setSelBook(Number(e.target.value))} className="w-full rounded border border-teal-200 bg-white px-1 py-1 text-[10px] font-bold text-slate-700 outline-none">
                                            {Array.from({length: 12}, (_, i) => i + 9).map(b => <option key={b} value={b}>Cam {b}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-teal-600 mb-0.5">Test</p>
                                        <select value={selTest} onChange={e => setSelTest(Number(e.target.value))} className="w-full rounded border border-teal-200 bg-white px-1 py-1 text-[10px] font-bold text-slate-700 outline-none">
                                            {[1,2,3,4].map(t => <option key={t} value={t}>T{t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-teal-600 mb-0.5">Module</p>
                                        <select value={selModule} onChange={e => setSelModule(e.target.value as 'Reading' | 'Listening')} className="w-full rounded border border-teal-200 bg-white px-1 py-1 text-[10px] font-bold text-slate-700 outline-none">
                                            <option value="Reading">Read</option>
                                            <option value="Listening">Listen</option>
                                        </select>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-teal-600 mb-0.5">Q No.</p>
                                        <select value={selQ} onChange={e => setSelQ(Number(e.target.value))} className="w-full rounded border border-teal-200 bg-white px-1 py-1 text-[10px] font-bold text-slate-700 outline-none">
                                            {Array.from({length: 40}, (_, i) => i + 1).map(n => <option key={n} value={n}>Q{n}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        sendQuestionSelector(`Cambridge ${selBook} Test ${selTest} ${selModule} Q${selQ} explain koro`);
                                        setShowSelector(false);
                                    }}
                                    disabled={loading || limitReached}
                                    className="w-full rounded-lg bg-teal-600 py-1.5 text-[11px] font-bold text-white hover:bg-teal-500 disabled:opacity-50 transition"
                                >
                                    ✨ Explain করো
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Image preview */}
                    {imagePreview && (
                        <div className="flex items-center gap-2 border-t border-slate-200 px-3 py-2 bg-white">
                            <div className="relative">
                                <img src={imagePreview} alt="" className="h-10 rounded-md object-cover" />
                                <button onClick={() => { setImagePreview(null); setImageData(null); }} className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-white">
                                    <X size={8} />
                                </button>
                            </div>
                            <span className="text-[10px] text-slate-500">Image attached</span>
                        </div>
                    )}

                    {/* Input area — limit reached OR normal */}
                    {limitReached ? (
                        <div className="border-t border-amber-200 bg-amber-50 px-3 py-2.5">
                            <p className="text-[11px] font-bold text-amber-800">🔒 {FREE_LIMIT}টি বিনামূল্যে প্রশ্ন শেষ! Subscription নাও।</p>
                            {!showUnlimitInput ? (
                                <div className="mt-2 flex gap-1.5">
                                    <button
                                        onClick={() => setShowUnlimitInput(true)}
                                        className="flex-1 rounded-lg border border-violet-300 bg-white py-1.5 text-[10px] font-bold text-violet-700 hover:bg-violet-50 transition"
                                    >
                                        Unlimited plan আছে?
                                    </button>
                                    <a
                                        href="/dashboard/payment"
                                        className="flex-1 rounded-lg bg-violet-600 py-1.5 text-[10px] font-bold text-white text-center hover:bg-violet-500 transition"
                                    >
                                        Plan নাও →
                                    </a>
                                </div>
                            ) : (
                                <div className="mt-2 space-y-1.5">
                                    <div className="flex gap-1">
                                        <input
                                            type="email"
                                            value={unlimitedEmail}
                                            onChange={e => setUnlimitedEmail(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter') verifyUnlimited(); }}
                                            placeholder="Unlimited plan এর email"
                                            className="flex-1 rounded-lg border border-violet-300 px-2 py-1.5 text-[10px] outline-none focus:border-violet-500"
                                        />
                                        <button
                                            onClick={verifyUnlimited}
                                            disabled={unlimitedChecking}
                                            className="rounded-lg bg-violet-600 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-violet-500 disabled:opacity-50 transition"
                                        >
                                            {unlimitedChecking ? '...' : 'Unlock'}
                                        </button>
                                    </div>
                                    {unlimitedMsg && <p className="text-[10px] text-red-600">{unlimitedMsg}</p>}
                                    <button onClick={() => setShowUnlimitInput(false)} className="text-[9px] text-slate-400 hover:text-slate-600">← ফিরে যাও</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 border-t border-slate-200 bg-white p-3">
                            <button onClick={() => fileRef.current?.click()} disabled={loading} className="text-slate-400 hover:text-indigo-500 transition">
                                <ImageIcon size={15} />
                            </button>
                            <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageSelect} />

                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
                                placeholder={isListening ? '🎤 বলো...' : 'IELTS প্রশ্ন করো...'}
                                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs outline-none focus:border-indigo-400"
                                disabled={loading}
                            />

                            <button onClick={toggleVoice} disabled={loading} className={`transition ${isListening ? 'animate-pulse text-rose-500' : 'text-slate-400 hover:text-indigo-500'}`}>
                                {isListening ? <MicOff size={15} /> : <Mic size={15} />}
                            </button>

                            <button
                                onClick={sendMessage}
                                disabled={(!input.trim() && !imageData) || loading}
                                className="rounded-lg bg-indigo-600 p-1.5 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                <Send size={13} />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="pointer-events-auto inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:shadow-indigo-300 hover:scale-105"
                >
                    <MessageSquare size={16} />
                    AI Tutor
                </button>
            )}
        </div>
    );
}
