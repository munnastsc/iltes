'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, Mic, MicOff, Volume2, RotateCcw, Star, MessageSquare } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; content: string; type?: 'feedback' | 'intro' | 'reply' };
type GeminiHistory = { role: 'user' | 'model'; parts: Array<{ text: string }> };

const TOPIC_SUGGESTIONS: Record<string, string[]> = {
    'daily-routine': ["I usually wake up at 7 am and have breakfast.", "I wake up around 6 o'clock and go for a walk.", "I wake up at 8 am, then I get ready for college."],
    'hometown': ["I'm from Dhaka. It's a very big and busy city.", "I come from Chittagong. It's near the sea.", "My hometown is a small town. It's quiet and peaceful."],
    'technology': ["I use the internet every day, mostly on my phone.", "I use it a lot — for study, social media and videos.", "I use the internet maybe 3 or 4 hours a day."],
    'travel': ["Yes, I love travelling. I visited Cox's Bazar last year.", "I enjoy travelling, but I haven't been many places yet.", "Not really. I prefer staying at home, but I want to travel more."],
    'food': ["I usually eat rice and vegetables. I love Bangladeshi food.", "I eat rice three times a day. My favourite is fish curry.", "I like both local and fast food. Pizza is my favourite."],
    'education': ["I'm currently studying at university. I study Computer Science.", "I finished school last year. Now I'm preparing for IELTS.", "I studied Business at college. Now I'm working."],
    'work': ["I'm studying at university right now. I'm in second year.", "I'm working at a company. I started 6 months ago.", "I just finished my studies and I'm looking for a job."],
    'hobbies': ["I love reading books in my free time.", "I enjoy watching movies and listening to music.", "I like playing cricket with my friends on weekends."],
    'family': ["I have a small family — my parents and one sister.", "I live with my parents, two brothers and a sister.", "My family is quite big. We have many relatives nearby."],
    'environment': ["Yes, I'm very worried about climate change.", "I think pollution is a big problem in our city.", "I try to help by not wasting plastic and water."],
    'health': ["I try to walk every morning for 30 minutes.", "I play football twice a week to stay fit.", "I eat healthy food and try to sleep early."],
    'media': ["I usually get news from Facebook and YouTube.", "I watch TV news every evening with my family.", "I read online news on my phone every morning."],
    'shopping': ["Yes, I enjoy shopping. I usually go to big malls.", "I don't shop much. I only buy things I really need.", "I prefer online shopping. It's easy and saves time."],
    'music': ["Yes, I love music. I listen to it every day.", "I enjoy Bangladeshi and Hindi songs the most.", "I like soft music. It helps me relax and study."],
    'sports': ["I play cricket with friends on weekends.", "I go for a walk or jog every morning.", "I don't play much, but I love watching football on TV."],
};

const GENERIC_SUGGESTIONS = [
    ["Yes, I do. I think it's very important in life.", "Not really. I don't have much experience with it.", "I think it depends on the situation, actually."],
    ["That's a good question. I think it's quite common.", "In my opinion, it's becoming more popular these days.", "I'm not sure, but I think most people do it."],
    ["I agree with that. It has many advantages.", "I think there are both good and bad sides to it.", "Personally, I find it very useful and interesting."],
];

const TOPICS = [
    { id: 'daily-routine', label: 'Daily Routine', bangla: 'প্রতিদিনের জীবন', emoji: '🌅' },
    { id: 'hometown', label: 'Hometown', bangla: 'নিজের শহর', emoji: '🏙️' },
    { id: 'technology', label: 'Technology', bangla: 'প্রযুক্তি', emoji: '💻' },
    { id: 'travel', label: 'Travel', bangla: 'ভ্রমণ', emoji: '✈️' },
    { id: 'food', label: 'Food', bangla: 'খাবার', emoji: '🍛' },
    { id: 'education', label: 'Education', bangla: 'পড়াশোনা', emoji: '📚' },
    { id: 'work', label: 'Work & Study', bangla: 'কাজ / পড়া', emoji: '💼' },
    { id: 'hobbies', label: 'Hobbies', bangla: 'শখ', emoji: '🎨' },
    { id: 'family', label: 'Family', bangla: 'পরিবার', emoji: '👨‍👩‍👧' },
    { id: 'environment', label: 'Environment', bangla: 'পরিবেশ', emoji: '🌿' },
    { id: 'health', label: 'Health', bangla: 'স্বাস্থ্য', emoji: '🏃' },
    { id: 'media', label: 'Media & News', bangla: 'মিডিয়া', emoji: '📰' },
    { id: 'shopping', label: 'Shopping', bangla: 'কেনাকাটা', emoji: '🛍️' },
    { id: 'music', label: 'Music', bangla: 'সঙ্গীত', emoji: '🎵' },
    { id: 'sports', label: 'Sports', bangla: 'খেলাধুলা', emoji: '⚽' },
];

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
    return t.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/💡/g, '').replace(/\n+/g, ' ').trim();
}

const CONV_FREE_LIMIT = 20;
const UNLIMITED_KEY = 'iltes_conv_unlimited';
const COUNT_KEY = 'iltes_conv_msg_count';

function getCount() {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem(COUNT_KEY) || '0', 10);
}
function saveCount(n: number) { localStorage.setItem(COUNT_KEY, String(n)); }
function getCached() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(UNLIMITED_KEY);
}
function saveUnlimited(email: string) { localStorage.setItem(UNLIMITED_KEY, email); }

export default function AIConversationPage() {
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [turnCount, setTurnCount] = useState(0);
    const [sessionDone, setSessionDone] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [freeCount, setFreeCount] = useState(0);
    const [isUnlimited, setIsUnlimited] = useState(false);
    const [showUnlock, setShowUnlock] = useState(false);
    const [unlockEmail, setUnlockEmail] = useState('');
    const [unlockMsg, setUnlockMsg] = useState('');
    const [verifying, setVerifying] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        setFreeCount(getCount());
        if (getCached()) setIsUnlimited(true);
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    async function verifySubscription() {
        if (!unlockEmail.trim()) return;
        setVerifying(true);
        setUnlockMsg('');
        try {
            const res = await fetch('/api/check-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: unlockEmail.trim() }),
            });
            const data = await res.json();
            if (data?.found && data.status === 'APPROVED') {
                saveUnlimited(unlockEmail.trim());
                setIsUnlimited(true);
                setShowUnlock(false);
            } else {
                setUnlockMsg('Active subscription পাওয়া যায়নি।');
            }
        } catch {
            setUnlockMsg('Error। আবার try করো।');
        } finally {
            setVerifying(false);
        }
    }

    function isLimitReached() { return freeCount >= CONV_FREE_LIMIT && !isUnlimited; }

    function buildHistory(): GeminiHistory[] {
        return messages.slice(-12).map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }],
        }));
    }

    async function startTopic(topicId: string) {
        setSelectedTopic(topicId);
        setMessages([]);
        setTurnCount(0);
        setSessionDone(false);
        setSuggestions(TOPIC_SUGGESTIONS[topicId] || GENERIC_SUGGESTIONS[0]);
        setLoading(true);

        try {
            const res = await fetch('/api/speaking-practice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: topicId }),
            });
            const data = await res.json();
            setMessages([{ role: 'assistant', content: data.text, type: 'intro' }]);
            speakText(data.text);
        } catch {
            setMessages([{ role: 'assistant', content: "Hello! Let's practice English. How are you today?" }]);
        } finally {
            setLoading(false);
        }
    }

    async function sendMessage(getFeedback = false) {
        const text = input.trim();
        if ((!text && !getFeedback) || loading) return;
        if (isLimitReached()) return;

        if (!getFeedback) {
            setMessages(p => [...p, { role: 'user', content: text }]);
            setInput('');
            setSuggestions([]);
        }
        setLoading(true);

        const newTurn = turnCount + 1;
        setTurnCount(newTurn);
        if (!getFeedback) {
            const next = freeCount + 1;
            setFreeCount(next);
            saveCount(next);
        }

        try {
            const res = await fetch('/api/speaking-practice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text || 'Please give me feedback now.',
                    topic: selectedTopic,
                    history: buildHistory(),
                    requestFeedback: getFeedback,
                }),
            });
            const data = await res.json();
            const msgType = getFeedback ? 'feedback' : 'reply';
            setMessages(p => [...p, { role: 'assistant', content: data.text, type: msgType }]);
            if (!getFeedback) {
                speakText(data.text);
                const pool = GENERIC_SUGGESTIONS[newTurn % GENERIC_SUGGESTIONS.length];
                setSuggestions(pool);
            }
            if (getFeedback) { setSessionDone(true); setSuggestions([]); }
        } catch {
            setMessages(p => [...p, { role: 'assistant', content: "Sorry, couldn't respond. Try again." }]);
        } finally {
            setLoading(false);
        }
    }

    function speakText(text: string) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(stripMarkdown(text));
        const voices = window.speechSynthesis.getVoices();
        const engVoice = voices.find(v => v.lang.startsWith('en-') && v.name.includes('Female'))
            || voices.find(v => v.lang.startsWith('en-'));
        if (engVoice) u.voice = engVoice;
        u.rate = 0.9;
        window.speechSynthesis.speak(u);
    }

    const toggleVoice = useCallback(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const API = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!API) { alert('Chrome ব্যবহার করো voice input এর জন্য।'); return; }
        if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
        const r = new API();
        recognitionRef.current = r;
        r.lang = 'en-US';
        r.interimResults = false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        r.onresult = (e: any) => setInput((p: string) => p ? p + ' ' + e.results[0][0].transcript : e.results[0][0].transcript);
        r.onerror = () => setIsListening(false);
        r.onend = () => setIsListening(false);
        r.start();
        setIsListening(true);
    }, [isListening]);

    function resetSession() {
        setSelectedTopic(null);
        setMessages([]);
        setTurnCount(0);
        setSessionDone(false);
        setSuggestions([]);
        window.speechSynthesis.cancel();
    }

    // Topic selection screen
    if (!selectedTopic) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-rose-50/30">
                <div className="border-b border-slate-200 bg-white px-5 py-4 shadow-sm">
                    <div className="mx-auto flex max-w-4xl items-center gap-3">
                        <Link href="/dashboard" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition">
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h1 className="text-lg font-black text-slate-900">AI Conversation Practice</h1>
                            <p className="text-[11px] text-slate-500">IELTS Speaking · Real examiner-style English conversation</p>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-4xl px-5 py-8">
                    {/* How it works */}
                    <div className="mb-6 rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 to-orange-50 p-5">
                        <p className="text-xs font-black uppercase tracking-widest text-rose-600 mb-3">💬 কীভাবে কাজ করে</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                                { step: '১', text: 'Topic বেছে নাও', sub: 'IELTS Speaking-এর common topics' },
                                { step: '২', text: 'AI Examiner কথা বলবে', sub: 'English-এ question করবে' },
                                { step: '৩', text: 'তুমি উত্তর দাও', sub: 'Type করো বা Voice দিয়ে বলো' },
                            ].map(s => (
                                <div key={s.step} className="flex items-start gap-3">
                                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-rose-600 text-xs font-black text-white">{s.step}</span>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800">{s.text}</p>
                                        <p className="text-[11px] text-slate-500">{s.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="mt-3 text-[11px] text-slate-500 border-t border-rose-200 pt-3">
                            💡 AI ভুল correct করবে + Tips দেবে। ১০টা turn পর Feedback বাটন দিয়ে পুরো session-এর বাংলা feedback নাও।
                        </p>
                    </div>

                    {/* Topic grid */}
                    <p className="mb-4 text-sm font-black text-slate-700">Topic বেছে নাও:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        {TOPICS.map(t => (
                            <button key={t.id} onClick={() => startTopic(t.id)}
                                className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm hover:border-rose-300 hover:shadow-md transition-all">
                                <span className="text-3xl">{t.emoji}</span>
                                <div>
                                    <p className="text-xs font-black text-slate-800 group-hover:text-rose-700 transition">{t.label}</p>
                                    <p className="text-[10px] text-slate-400">{t.bangla}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const topic = TOPICS.find(t => t.id === selectedTopic)!;

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-rose-50/20">
            {/* Header */}
            <div className="border-b border-slate-200 bg-white px-5 py-3 shadow-sm">
                <div className="mx-auto flex max-w-3xl items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={resetSession} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition">
                            <ArrowLeft size={18} />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-xl">{topic.emoji}</span>
                            <div>
                                <p className="text-sm font-black text-slate-900">{topic.label}</p>
                                <p className="text-[10px] text-slate-500">{turnCount} turns · {isUnlimited ? '∞ unlimited' : `${freeCount}/${CONV_FREE_LIMIT} free`}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {turnCount >= 6 && !sessionDone && (
                            <button onClick={() => sendMessage(true)}
                                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-white hover:bg-amber-400 transition">
                                <Star size={13} /> Feedback নাও
                            </button>
                        )}
                        <button onClick={resetSession}
                            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
                            <RotateCcw size={13} /> নতুন Topic
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="mx-auto max-w-3xl space-y-3">
                    {messages.map((m, i) => (
                        <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                            {m.role === 'assistant' && (
                                <div className="mr-2 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-rose-600 text-xs font-black text-white">
                                    AI
                                </div>
                            )}
                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                m.role === 'user'
                                    ? 'bg-rose-600 text-white rounded-tr-sm'
                                    : m.type === 'feedback'
                                    ? 'border-2 border-amber-300 bg-amber-50 text-slate-800 rounded-tl-sm'
                                    : 'border border-slate-200 bg-white text-slate-800 shadow-sm rounded-tl-sm'
                            }`}>
                                {m.type === 'feedback' && (
                                    <p className="mb-2 flex items-center gap-1 text-xs font-black text-amber-700">
                                        <Star size={12} /> Session Feedback
                                    </p>
                                )}
                                {formatText(m.content)}
                                {m.role === 'assistant' && m.type !== 'feedback' && (
                                    <button onClick={() => speakText(m.content)}
                                        className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-400 hover:text-rose-500 transition">
                                        <Volume2 size={10} /> শুনো
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-xs font-black text-white">AI</div>
                            <div className="flex gap-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                                <span className="h-2 w-2 animate-bounce rounded-full bg-rose-400 [animation-delay:0ms]" />
                                <span className="h-2 w-2 animate-bounce rounded-full bg-rose-400 [animation-delay:150ms]" />
                                <span className="h-2 w-2 animate-bounce rounded-full bg-rose-400 [animation-delay:300ms]" />
                            </div>
                        </div>
                    )}

                    {sessionDone && (
                        <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4 text-center">
                            <p className="text-sm font-bold text-teal-700 mb-2">🎉 Session শেষ! আবার practice করো।</p>
                            <button onClick={resetSession}
                                className="rounded-xl bg-teal-600 px-5 py-2 text-sm font-bold text-white hover:bg-teal-500 transition">
                                নতুন Topic বেছে নাও
                            </button>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>
            </div>

            {/* Input */}
            {!sessionDone && (
                <div className="border-t border-slate-200 bg-white px-4 py-3">
                    {isLimitReached() ? (
                        <div className="mx-auto max-w-3xl">
                            <div className="rounded-2xl border-2 border-rose-200 bg-rose-50 p-4 text-center">
                                <p className="text-sm font-black text-rose-700 mb-1">🔒 {CONV_FREE_LIMIT}টি বিনামূল্যে message শেষ!</p>
                                <p className="text-xs text-rose-600 mb-3">Unlimited practice-এর জন্য Subscription নাও।</p>
                                {!showUnlock ? (
                                    <div className="flex justify-center gap-2">
                                        <Link href="/dashboard/payment" className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500 transition">
                                            Subscription নাও
                                        </Link>
                                        <button onClick={() => setShowUnlock(true)}
                                            className="rounded-xl border border-rose-300 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition">
                                            আমার Subscription আছে
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2 items-center">
                                        <input value={unlockEmail} onChange={e => setUnlockEmail(e.target.value)}
                                            placeholder="তোমার Email দাও"
                                            className="w-full max-w-xs rounded-xl border border-rose-300 px-3 py-2 text-sm outline-none focus:border-rose-500" />
                                        {unlockMsg && <p className="text-xs text-red-600">{unlockMsg}</p>}
                                        <button onClick={verifySubscription} disabled={verifying}
                                            className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-500 disabled:opacity-50 transition">
                                            {verifying ? 'Checking...' : 'Verify করো'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Suggested answers */}
                            {suggestions.length > 0 && !loading && (
                                <div className="mx-auto mb-2 max-w-3xl">
                                    <p className="mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide">💡 Sample answers — click to use:</p>
                                    <div className="flex flex-col gap-1.5">
                                        {suggestions.map((s, i) => (
                                            <button key={i} onClick={() => setInput(s)}
                                                className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-left text-xs text-rose-800 hover:bg-rose-100 hover:border-rose-300 transition">
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="mx-auto flex max-w-3xl items-center gap-2">
                                <input
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                                    placeholder={isListening ? '🎤 বলো...' : 'English-এ উত্তর দাও...'}
                                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:bg-white transition"
                                    disabled={loading}
                                />
                                <button onClick={toggleVoice} disabled={loading}
                                    className={`rounded-xl p-2.5 transition ${isListening ? 'animate-pulse bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600'}`}>
                                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                                </button>
                                <button onClick={() => sendMessage()}
                                    disabled={!input.trim() || loading}
                                    className="rounded-xl bg-rose-600 p-2.5 text-white hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed transition">
                                    <Send size={18} />
                                </button>
                            </div>
                            <p className="mt-1.5 text-center text-[10px] text-slate-400">
                                English-এ বলো — AI correct করবে এবং follow-up question করবে
                            </p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
