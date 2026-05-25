'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, RotateCcw, Bot, User, Sparkles, BookOpen, Headphones, PenLine, Mic, MicOff, Volume2, VolumeX, GraduationCap, Lightbulb, ImageIcon, X } from 'lucide-react';

type Message = {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    image?: string; // base64 preview for user messages
};

type GeminiHistoryItem = {
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
};

const QUICK_QUESTIONS = [
    { label: '📖 Reading trick', q: 'IELTS Reading এ True/False/Not Given কীভাবে solve করব? সহজ shortcut দাও।' },
    { label: '🎧 Listening tips', q: 'IELTS Listening এ distractor থেকে কীভাবে বাঁচব? Tips দাও।' },
    { label: '✍️ Writing formula', q: 'IELTS Writing Task 2 এ Band 7+ পেতে কোন structure follow করব?' },
    { label: '🗣️ Speaking tricks', q: 'IELTS Speaking এ answer কীভাবে extend করব? সহজ কৌশল দাও।' },
    { label: '📝 Grammar shortcut', q: 'Active voice কে Passive voice এ convert করার সহজ rule কী?' },
    { label: '🎯 Band score secrets', q: 'IELTS এ Band 7 পেতে হলে কোন কোন বিষয়ে সবচেয়ে বেশি focus করতে হবে?' },
];

const TOPICS = [
    { id: 'all', label: 'সব', icon: <Sparkles size={13} /> },
    { id: 'listening', label: 'Listening', icon: <Headphones size={13} /> },
    { id: 'reading', label: 'Reading', icon: <BookOpen size={13} /> },
    { id: 'writing', label: 'Writing', icon: <PenLine size={13} /> },
    { id: 'speaking', label: 'Speaking', icon: <Mic size={13} /> },
    { id: 'grammar', label: 'Grammar', icon: <GraduationCap size={13} /> },
    { id: 'vocab', label: 'Vocabulary', icon: <Lightbulb size={13} /> },
];

const STORAGE_KEY = 'iltes-ai-tutor-history';
const MAX_HISTORY = 30;

const WELCOME: Message = {
    role: 'assistant',
    content: `আসসালামু আলাইকুম! 👋 আমি তোমার **ILTES AI Tutor**।

🎯 আমি তোমাকে সাহায্য করতে পারি:
- Cambridge IELTS Books 9–20 এর যেকোনো question explain করতে
- Listening, Reading, Writing, Speaking এর tips ও strategy দিতে
- English Grammar সহজ shortcut দিয়ে শেখাতে
- IELTS এ high band score পাওয়ার secrets শেয়ার করতে
- Question এর **ছবি তুলে পাঠাও** — আমি দেখে explain করব!

💬 যেকোনো প্রশ্ন করো — বাংলায় বা English এ, যেটা সহজ লাগে!`,
    timestamp: Date.now(),
};

function formatText(text: string) {
    const lines = text.split('\n');
    return lines.map((line, i) => {
        // Handle blockquote lines ("> ...")
        if (line.startsWith('> ')) {
            const inner = line.slice(2);
            const parts = inner.split(/(\*\*[^*]+\*\*)/g);
            return (
                <span key={i}>
                    <span className="block border-l-4 border-indigo-400 bg-indigo-50 pl-3 py-1 text-indigo-800 rounded-r-lg my-1 italic">
                        {parts.map((p, j) =>
                            p.startsWith('**') && p.endsWith('**')
                                ? <strong key={j}>{p.slice(2, -2)}</strong>
                                : <span key={j}>{p}</span>
                        )}
                    </span>
                    {i < lines.length - 1 && <span />}
                </span>
            );
        }
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
            <span key={i}>
                {parts.map((part, j) =>
                    part.startsWith('**') && part.endsWith('**')
                        ? <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>
                        : <span key={j}>{part}</span>
                )}
                {i < lines.length - 1 && <br />}
            </span>
        );
    });
}

// Strip markdown for TTS
function stripMarkdown(text: string): string {
    return text
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/^> /gm, '')
        .replace(/[📖🎧✍️🗣️📝🎯✅📋📄🔍🔑💡👇🎓💬🔥📌⏳❌]/gu, '')
        .replace(/\n{2,}/g, '. ')
        .replace(/\n/g, ' ')
        .trim();
}

export default function AiTutorPage() {
    const [messages, setMessages] = useState<Message[]>([WELCOME]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTopic, setActiveTopic] = useState('all');

    // Image state
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageData, setImageData] = useState<string | null>(null);
    const [imageType, setImageType] = useState<string>('image/jpeg');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Voice input state
    const [isListening, setIsListening] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);

    // Voice output state
    const [speakingMsgId, setSpeakingMsgId] = useState<number | null>(null);
    const [ttsEnabled, setTtsEnabled] = useState(false);

    // Voice input language
    const [voiceLang, setVoiceLang] = useState<'bn-BD' | 'en-US'>('bn-BD');

    // Question Selector state + mid-conversation toggle
    const [selBook, setSelBook] = useState(9);
    const [selTest, setSelTest] = useState(1);
    const [selModule, setSelModule] = useState<'Reading' | 'Listening'>('Reading');
    const [selQ, setSelQ] = useState(1);
    const [showSelector, setShowSelector] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved) as Message[];
                if (parsed.length > 0) setMessages(parsed);
            }
        } catch { /* empty */ }
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_HISTORY)));
        } catch { /* empty */ }
    }, [messages]);

    function buildGeminiHistory(msgs: Message[]): GeminiHistoryItem[] {
        const history: GeminiHistoryItem[] = [];
        for (const m of msgs) {
            if (m.content === WELCOME.content) continue;
            history.push({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }],
            });
        }
        return history.slice(-20);
    }

    // ── Image upload ─────────────────────────────────────────────────────────
    function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 4 * 1024 * 1024) {
            alert('Image size 4MB এর বেশি হওয়া যাবে না।');
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
            const result = ev.target?.result as string;
            setImagePreview(result);
            setImageData(result);
            setImageType(file.type || 'image/jpeg');
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    }

    function clearImage() {
        setImagePreview(null);
        setImageData(null);
    }

    // ── Voice input ──────────────────────────────────────────────────────────
    const toggleVoiceInput = useCallback(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognitionAPI) {
            alert('তোমার browser এ voice input support নেই। Chrome ব্যবহার করো।');
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const recognition = new SpeechRecognitionAPI();
        recognitionRef.current = recognition;
        recognition.lang = voiceLang;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (e: any) => {
            const transcript = e.results[0][0].transcript;
            setInput((prev: string) => prev ? prev + ' ' + transcript : transcript);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognition.start();
        setIsListening(true);
    }, [isListening, voiceLang]);

    // ── Voice output ─────────────────────────────────────────────────────────
    function speakMessage(text: string, msgId: number) {
        if (!ttsEnabled) return;
        if (speakingMsgId === msgId) {
            window.speechSynthesis.cancel();
            setSpeakingMsgId(null);
            return;
        }
        window.speechSynthesis.cancel();
        const clean = stripMarkdown(text);
        const utterance = new SpeechSynthesisUtterance(clean);

        // Try to find a Bengali voice; fall back to any available voice
        const voices = window.speechSynthesis.getVoices();
        const bnVoice = voices.find(v => v.lang.startsWith('bn'));
        if (bnVoice) utterance.voice = bnVoice;

        utterance.rate = 0.9;
        utterance.onend = () => setSpeakingMsgId(null);
        utterance.onerror = () => setSpeakingMsgId(null);

        setSpeakingMsgId(msgId);
        window.speechSynthesis.speak(utterance);
    }

    // ── Send message ─────────────────────────────────────────────────────────
    async function sendMessage(text?: string, imgData?: string | null, imgType?: string) {
        const msg = (text || input).trim();
        if (!msg || loading) return;

        const img = imgData !== undefined ? imgData : imageData;
        const iType = imgType || imageType;

        const userMsg: Message = {
            role: 'user',
            content: msg,
            timestamp: Date.now(),
            image: img || undefined,
        };
        setMessages((p) => [...p, userMsg]);
        setInput('');
        clearImage();
        setLoading(true);

        try {
            const currentHistory = buildGeminiHistory(messages);
            const contextLabel = activeTopic !== 'all'
                ? `IELTS ${activeTopic.charAt(0).toUpperCase() + activeTopic.slice(1)}`
                : 'General IELTS';

            const body: Record<string, unknown> = {
                message: msg,
                context: contextLabel,
                history: currentHistory,
            };
            if (img) {
                body.image = img;
                body.imageType = iType;
            }

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            const aiMsg: Message = {
                role: 'assistant',
                content: data?.text || 'একটু সমস্যা হয়েছে, আবার try করো।',
                timestamp: Date.now(),
            };
            setMessages((p) => [...p, aiMsg]);
        } catch {
            setMessages((p) => [...p, {
                role: 'assistant',
                content: '❌ Network error। Internet connection check করো এবং আবার try করো।',
                timestamp: Date.now(),
            }]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    }

    function clearHistory() {
        window.speechSynthesis?.cancel();
        setSpeakingMsgId(null);
        setMessages([WELCOME]);
        localStorage.removeItem(STORAGE_KEY);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    return (
        <div className="flex flex-col h-screen bg-[#f5f6fa]">

            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-900 via-slate-800 to-indigo-900 px-4 py-4 shadow-lg">
                <div className="mx-auto max-w-3xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 shadow-lg">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-base font-black text-white">ILTES AI Tutor</h1>
                                <p className="text-[11px] text-indigo-300">World-class IELTS Coach • বাংলায় শেখো</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* TTS toggle */}
                            <button
                                onClick={() => { setTtsEnabled(p => !p); window.speechSynthesis?.cancel(); setSpeakingMsgId(null); }}
                                title={ttsEnabled ? 'Voice output ON' : 'Voice output OFF'}
                                className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/10 transition"
                            >
                                {ttsEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
                            </button>
                            <button
                                onClick={clearHistory}
                                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 transition"
                            >
                                <RotateCcw size={12} /> নতুন চ্যাট
                            </button>
                        </div>
                    </div>

                    {/* Topic filter */}
                    <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                        {TOPICS.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTopic(t.id)}
                                className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold transition ${
                                    activeTopic === t.id
                                        ? 'bg-indigo-500 text-white shadow-md'
                                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                                }`}
                            >
                                {t.icon} {t.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="mx-auto max-w-3xl space-y-4">

                    {/* Question Selector + Quick Questions (show when only welcome message) */}
                    {messages.length === 1 && (
                        <div className="space-y-3">
                            {/* Cambridge Question Selector */}
                            <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4 shadow-sm">
                                <p className="mb-3 text-xs font-black uppercase tracking-wider text-teal-700">📚 Cambridge Books — যেকোনো Question Explain করাও</p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-teal-600 mb-1">Book</label>
                                        <select value={selBook} onChange={e => setSelBook(Number(e.target.value))} className="w-full rounded-lg border border-teal-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-teal-400">
                                            {Array.from({length: 12}, (_, i) => i + 9).map(b => <option key={b} value={b}>Cambridge {b}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-teal-600 mb-1">Test</label>
                                        <select value={selTest} onChange={e => setSelTest(Number(e.target.value))} className="w-full rounded-lg border border-teal-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-teal-400">
                                            {[1,2,3,4].map(t => <option key={t} value={t}>Test {t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-teal-600 mb-1">Module</label>
                                        <select value={selModule} onChange={e => setSelModule(e.target.value as 'Reading' | 'Listening')} className="w-full rounded-lg border border-teal-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-teal-400">
                                            <option value="Reading">Reading</option>
                                            <option value="Listening">Listening</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-teal-600 mb-1">Question</label>
                                        <select value={selQ} onChange={e => setSelQ(Number(e.target.value))} className="w-full rounded-lg border border-teal-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-teal-400">
                                            {Array.from({length: 40}, (_, i) => i + 1).map(n => <option key={n} value={n}>Q{n}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <button
                                    onClick={() => sendMessage(`Cambridge ${selBook} Test ${selTest} ${selModule} Q${selQ} explain koro`)}
                                    className="w-full rounded-xl bg-teal-600 py-2.5 text-sm font-bold text-white hover:bg-teal-500 transition"
                                >
                                    ✨ এই Question টা Explain করো
                                </button>
                            </div>

                            {/* Quick questions */}
                            <div className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm">
                                <p className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">⚡ Quick Questions</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {QUICK_QUESTIONS.map((q) => (
                                        <button
                                            key={q.label}
                                            onClick={() => sendMessage(q.q)}
                                            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-xs font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition"
                                        >
                                            {q.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm ${
                                msg.role === 'user' ? 'bg-indigo-600' : 'bg-gradient-to-br from-emerald-400 to-teal-500'
                            }`}>
                                {msg.role === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
                            </div>

                            {/* Bubble */}
                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed ${
                                msg.role === 'user'
                                    ? 'rounded-tr-sm bg-indigo-600 text-white'
                                    : 'rounded-tl-sm bg-white text-slate-800 border border-slate-100'
                            }`}>
                                {/* Image preview in user message */}
                                {msg.image && (
                                    <img
                                        src={msg.image}
                                        alt="uploaded"
                                        className="mb-2 max-h-40 rounded-lg object-contain"
                                    />
                                )}
                                {formatText(msg.content)}

                                {/* TTS button on AI messages */}
                                {msg.role === 'assistant' && msg.content !== WELCOME.content && (
                                    <button
                                        onClick={() => speakMessage(msg.content, msg.timestamp)}
                                        className={`mt-2 flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium transition ${
                                            speakingMsgId === msg.timestamp
                                                ? 'bg-indigo-100 text-indigo-700'
                                                : 'text-slate-400 hover:text-indigo-500 hover:bg-slate-50'
                                        }`}
                                    >
                                        {speakingMsgId === msg.timestamp ? <VolumeX size={11} /> : <Volume2 size={11} />}
                                        {speakingMsgId === msg.timestamp ? 'বন্ধ করো' : 'শুনো'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {loading && (
                        <div className="flex gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-sm">
                                <Bot size={14} className="text-white" />
                            </div>
                            <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-slate-100 bg-white px-4 py-3 shadow-sm">
                                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>
            </div>

            {/* Input area */}
            <div className="border-t border-slate-200 bg-white px-4 pt-2 pb-3 shadow-lg">
                <div className="mx-auto max-w-3xl">

                    {/* Cambridge Question Selector — always visible, collapsible */}
                    <div className="mb-2">
                        <button
                            onClick={() => setShowSelector(p => !p)}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition ${
                                showSelector
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100'
                            }`}
                        >
                            <span>📚 Cambridge Book → Question Selector</span>
                            <span>{showSelector ? '▲' : '▼'}</span>
                        </button>

                        {showSelector && (
                            <div className="mt-1.5 rounded-xl border border-teal-200 bg-teal-50 p-3">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                                    <div>
                                        <label className="block text-[10px] font-bold text-teal-600 mb-1">Book</label>
                                        <select value={selBook} onChange={e => setSelBook(Number(e.target.value))} className="w-full rounded-lg border border-teal-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-teal-400">
                                            {Array.from({length: 12}, (_, i) => i + 9).map(b => <option key={b} value={b}>Cambridge {b}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-teal-600 mb-1">Test</label>
                                        <select value={selTest} onChange={e => setSelTest(Number(e.target.value))} className="w-full rounded-lg border border-teal-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-teal-400">
                                            {[1,2,3,4].map(t => <option key={t} value={t}>Test {t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-teal-600 mb-1">Module</label>
                                        <select value={selModule} onChange={e => setSelModule(e.target.value as 'Reading' | 'Listening')} className="w-full rounded-lg border border-teal-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-teal-400">
                                            <option value="Reading">Reading</option>
                                            <option value="Listening">Listening</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-teal-600 mb-1">Question</label>
                                        <select value={selQ} onChange={e => setSelQ(Number(e.target.value))} className="w-full rounded-lg border border-teal-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-teal-400">
                                            {Array.from({length: 40}, (_, i) => i + 1).map(n => <option key={n} value={n}>Q{n}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { sendMessage(`Cambridge ${selBook} Test ${selTest} ${selModule} Q${selQ} explain koro`); setShowSelector(false); }}
                                    disabled={loading}
                                    className="w-full rounded-xl bg-teal-600 py-2 text-sm font-bold text-white hover:bg-teal-500 disabled:opacity-50 transition"
                                >
                                    ✨ এই Question টা Explain করো
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Image preview */}
                    {imagePreview && (
                        <div className="mb-2 flex items-center gap-2">
                            <div className="relative">
                                <img src={imagePreview} alt="preview" className="h-16 rounded-lg object-cover border border-slate-200" />
                                <button
                                    onClick={clearImage}
                                    className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white shadow"
                                >
                                    <X size={10} />
                                </button>
                            </div>
                            <p className="text-xs text-slate-500">Image attach হয়েছে — প্রশ্ন লিখে send করো।</p>
                        </div>
                    )}

                    <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 focus-within:border-indigo-400 focus-within:bg-white transition">
                        {/* Image upload button */}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={loading}
                            title="ছবি upload করো"
                            className="mb-0.5 shrink-0 text-slate-400 hover:text-indigo-500 transition disabled:opacity-40"
                        >
                            <ImageIcon size={18} />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={handleImageSelect}
                        />

                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={isListening ? '🎤 বলো... (শুনছি)' : 'IELTS নিয়ে যেকোনো প্রশ্ন করো... (Enter = send, Shift+Enter = নতুন লাইন)'}
                            rows={1}
                            className="flex-1 resize-none bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none leading-relaxed"
                            style={{ maxHeight: '120px', overflowY: 'auto' }}
                            onInput={(e) => {
                                const el = e.currentTarget;
                                el.style.height = 'auto';
                                el.style.height = Math.min(el.scrollHeight, 120) + 'px';
                            }}
                            disabled={loading}
                        />

                        {/* Voice language toggle (bn/en) */}
                        <button
                            type="button"
                            onClick={() => setVoiceLang(l => l === 'bn-BD' ? 'en-US' : 'bn-BD')}
                            disabled={loading}
                            title="Voice language toggle"
                            className="mb-0.5 shrink-0 rounded px-1 text-[10px] font-bold text-slate-400 hover:text-indigo-500 transition"
                        >
                            {voiceLang === 'bn-BD' ? 'বাং' : 'EN'}
                        </button>

                        {/* Voice input button */}
                        <button
                            type="button"
                            onClick={toggleVoiceInput}
                            disabled={loading}
                            title={isListening ? 'বন্ধ করো' : 'Voice দিয়ে বলো'}
                            className={`mb-0.5 shrink-0 transition disabled:opacity-40 ${
                                isListening
                                    ? 'animate-pulse text-rose-500'
                                    : 'text-slate-400 hover:text-indigo-500'
                            }`}
                        >
                            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                        </button>

                        {/* Send button */}
                        <button
                            onClick={() => sendMessage()}
                            disabled={(!input.trim() && !imagePreview) || loading}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Send size={15} />
                        </button>
                    </div>
                    <p className="mt-1.5 text-center text-[10px] text-slate-400">
                        📸 ছবি | 🎤 Voice | ⌨️ Type — যেভাবে সহজ। AI উত্তর সবসময় verify করো।
                    </p>
                </div>
            </div>
        </div>
    );
}
