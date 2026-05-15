'use client';
import { useState, useMemo } from 'react';
import { Search, Copy, CheckCheck } from 'lucide-react';
import { SYNONYM_GROUPS } from '../lib/paraphraseData';

export default function ParaphraseSynonyms() {
    const [query, setQuery] = useState('');
    const [copied, setCopied] = useState<string | null>(null);

    const filtered = useMemo(() => {
        if (!query.trim()) return SYNONYM_GROUPS;
        const q = query.toLowerCase();
        return SYNONYM_GROUPS.map((group) => ({
            ...group,
            pairs: group.pairs.filter(
                (p) => p.base.toLowerCase().includes(q) || p.synonyms.some((s) => s.toLowerCase().includes(q)),
            ),
        })).filter((g) => g.pairs.length > 0);
    }, [query]);

    function copy(text: string) {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(text);
            setTimeout(() => setCopied(null), 1500);
        });
    }

    return (
        <div className="space-y-5">
            {/* Search */}
            <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="যেকোনো শব্দ খোঁজো... (e.g. increase, show, important)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            <p className="text-xs text-slate-400">
                কোনো synonym এ click করলে copy হবে। IELTS Writing ও Speaking এ সরাসরি ব্যবহার করতে পারবে।
            </p>

            {/* Groups */}
            <div className="space-y-4">
                {filtered.map((group) => (
                    <div key={group.category} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
                            <span className="text-base">{group.icon}</span>
                            <h3 className="text-sm font-black text-slate-900">{group.category}</h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {group.pairs.map((pair) => (
                                <div key={pair.base} className="flex flex-wrap items-start gap-3 px-4 py-3">
                                    <span className="min-w-[120px] rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-black text-white">
                                        {pair.base}
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {pair.synonyms.map((syn) => (
                                            <button
                                                key={syn}
                                                onClick={() => copy(syn)}
                                                title="Click to copy"
                                                className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                                                    copied === syn
                                                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                                                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'
                                                }`}
                                            >
                                                {copied === syn ? <CheckCheck size={10} /> : <Copy size={10} />}
                                                {syn}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
                        "{query}" এই শব্দ পাওয়া যায়নি।
                    </div>
                )}
            </div>
        </div>
    );
}
