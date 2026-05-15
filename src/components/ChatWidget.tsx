'use client';

import { useState } from 'react';
import { Bot, MessageSquare, Send, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export default function ChatWidget() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        const question = input.trim();
        if (!question || loading) return;

        setMessages((prev) => [...prev, { role: 'user', content: question }]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: question, context: 'Floating chat assistant' }),
            });
            const data = await res.json();
            const text = data?.text || 'Unable to reply right now.';
            setMessages((prev) => [...prev, { role: 'assistant', content: text }]);
        } catch {
            setMessages((prev) => [...prev, { role: 'assistant', content: 'Network issue. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    if (pathname?.startsWith('/dashboard')) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed bottom-4 right-4 z-50 h-fit w-fit">
            {isOpen ? (
                <div className="pointer-events-auto flex h-[560px] w-[360px] flex-col overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xl">
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                        <div className="inline-flex items-center gap-2">
                            <Bot size={18} className="text-blue-700" />
                            <div>
                                <p className="text-sm font-semibold text-slate-900">Sathi AI</p>
                                <p className="text-xs text-slate-500">IELTS Helper</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="rounded-md border border-slate-300 p-1.5 text-slate-600 hover:bg-slate-100">
                            <X size={14} />
                        </button>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-3">
                        {messages.length === 0 && (
                            <div className="rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-600">
                                Example: How to improve True/False/Not Given accuracy?
                            </div>
                        )}

                        {messages.map((m, i) => (
                            <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                                <p
                                    className={`inline-block max-w-[90%] rounded-md px-3 py-2 text-sm leading-6 ${
                                        m.role === 'user' ? 'bg-blue-600 text-white' : 'border border-slate-200 bg-white text-slate-700'
                                    }`}
                                >
                                    {m.content}
                                </p>
                            </div>
                        ))}

                        {loading && <p className="text-xs text-slate-500">Thinking...</p>}
                    </div>

                    <div className="flex items-center gap-2 border-t border-slate-200 p-3">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') sendMessage();
                            }}
                            placeholder="Ask any IELTS question..."
                            className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || loading}
                            className="rounded-md bg-blue-600 p-2 text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
                        >
                            <Send size={15} />
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="pointer-events-auto inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-500"
                >
                    <MessageSquare size={16} />
                    Chat with AI
                </button>
            )}
        </div>
    );
}
