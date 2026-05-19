import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFile } from 'fs/promises';
import path from 'path';

type ChatRequestBody = {
    message?: string;
    context?: string;
    history?: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>;
};

type ReadingKBEntry = { book: number; test: number; qn: number; ans: string; explanation?: string };
type ReadingContextEntry = { book: number; test: number; passage_text?: string; question_text?: string };
type ListeningKBEntry = {
    book: number; test: number; section: number; topic?: string; qn: number;
    type?: string; pre?: string; post?: string; q?: string; ans: string;
    opts?: string[]; instruction?: string; range?: number[];
};

// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `তুমি "ILTES AI Tutor" — IELTS বিশেষজ্ঞ শিক্ষক। সবসময় বাংলায় উত্তর দাও।

ABSOLUTE RULES:
- "Note:", "OpenAI", "API key", "fallback", "audio নেই", "data নেই" — কখনো বলবে না
- Cambridge question বা passage নিজে বানাবে না
- [KB_DATA] block নিজে generate করবে না

════════════════════════════════════
FORMAT A — [KB_DATA] block আসলে:
════════════════════════════════════

এই exact structure follow করো — প্রতিটা section বাধ্যতামূলক:

✅ **উত্তর: [ANSWER field এর value — শুধু এটাই]**

---
**📋 Question বলছে:**
> [QUESTION field থেকে statement টা quote করো]

**📄 Passage/Audio বলছে:**
> "[EXPLANATION_HINT বা PASSAGE_EXCERPT থেকে exact contradicting/supporting line quote করো]"

**🔍 তুলনা:**
Question এ বলছে → "[question এর key claim]"
Passage এ বলছে → "[passage এর actual claim]"
এই দুটো [একমত / বিপরীত / passage এ নেই] → তাই উত্তর [ANSWER]

---
**🔑 Step-by-step কীভাবে বের করলে:**
Step 1: [question এর key word কোনটা ছিল]
Step 2: [passage এ ওই word বা synonym কোথায় খুঁজলে]
Step 3: [কীভাবে match/mismatch detect করলে]

**💡 এই question type এ যে trick কাজ করে:**
[question type specific — True/False/NG হলে: কীভাবে NG থেকে False আলাদা করবে; Fill blank হলে: word form check; MCQ হলে: elimination method — 2 লাইন max]

---
👇 **১** গল্পে বিস্তারিত 📖 | **২** Distractor analysis ❌ | **৩** এই type এর full strategy 🎯

════════════════════════════════════
FORMAT B — General IELTS question (no KB_DATA):
════════════════════════════════════

🎯 **[2-3 লাইনে direct answer]**
📌 **Tip:** [একটি rule]
💡 **Trick:** [memory trick, এক লাইন]
🔥 [এক লাইন encourage]

👇 **১** গল্পে example | **২** Grammar deep dive | **৩** Practice question`;

// ─── QUESTION-TYPE TIPS (used in fallback explanations) ───────────────────────

const TYPE_TIPS: Record<string, string> = {
    fill_in_blank: '📝 Blank fill: blank এর আগে/পরের word গুলো keyword — audio তে এই word এর synonym শোনো।',
    mcq: '🔤 MCQ: সব option পড়ো → eliminate করো → "absolute" word (always/never/only) সতর্ক থাকো।',
    true_false: '✔️ T/F/NG: passage এ exact idea খোঁজো — similar word মানেই True না, opposite মানেই False।',
    matching: '🔗 Matching: সব option আগে পড়ো → audio তে order ধরে শোনো → synonyms লক্ষ্য করো।',
    map: '🗺️ Map/Plan: directions শোনো — opposite/next to/between — pencil দিয়ে track করো।',
    default: '🎯 IELTS tip: question আগে পড়ো, keyword underline করো, synonym শোনো/খোঁজো।',
};

function getTypeTip(type?: string): string {
    if (!type) return TYPE_TIPS.default;
    for (const key of Object.keys(TYPE_TIPS)) {
        if (type.includes(key)) return TYPE_TIPS[key];
    }
    return TYPE_TIPS.default;
}

// ─── KB LOADING ────────────────────────────────────────────────────────────────

let readingKB: Record<string, ReadingKBEntry | ReadingContextEntry> | null = null;
let listeningKB: Record<string, ListeningKBEntry> | null = null;

async function loadKB() {
    if (!readingKB) {
        try {
            const raw = await readFile(path.join(process.cwd(), 'data', 'reading-kb.json'), 'utf-8');
            readingKB = JSON.parse(raw);
        } catch { readingKB = {}; }
    }
    if (!listeningKB) {
        try {
            const raw = await readFile(path.join(process.cwd(), 'data', 'listening-kb.json'), 'utf-8');
            listeningKB = JSON.parse(raw);
        } catch { listeningKB = {}; }
    }
}

// ─── REF PARSING ──────────────────────────────────────────────────────────────

// Convert Bengali digits → ASCII
function normalizeBengaliDigits(s: string): string {
    return s.replace(/[০-৯]/g, d => String('০১২৩৪৫৬৭৮৯'.indexOf(d)));
}

function parseCambridgeRef(message: string): { book: number; test: number; question?: number; module?: string } | null {
    const raw = normalizeBengaliDigits(message);
    const lower = raw.toLowerCase();

    // Book: "cambridge 19", "cam books 19", "book 19", "c19", "19 no book"
    const bookMatch =
        lower.match(/(?:cambridge|ক্যামব্রিজ|ক্যাম)[.\s-]*(?:book|books)?[.\s-]*(\d+)/) ||
        lower.match(/(?:cam)[.\s-]*(?:book|books)?[.\s-]*(\d+)/) ||
        lower.match(/(?:book|বই)[.\s-]*(?:no\.?|number|নম্বর)?[.\s-]*(\d+)/) ||
        lower.match(/\bc(\d+)\b/) ||
        lower.match(/\bcam(\d+)\b/) ||
        lower.match(/(\d+)[.\s-]*(?:no\.?|number|নম্বর)[.\s-]*(?:book|বই)/);

    // Test: "test 1", "t1", "1 test"
    const testMatch =
        lower.match(/test[.\s-]*(\d+)/) ||
        lower.match(/\bt(\d+)\b/) ||
        lower.match(/(\d+)[.\s-]*(?:no\.?|number)?[.\s-]*test/) ||
        lower.match(/(\d+)[.\s-]*(?:নম্বর|no\.?)[.\s-]*test/);

    // Module
    const moduleMatch = lower.match(/\b(listening|reading|লিসেনিং|রিডিং|লিস্টেনিং|listeing|lisening|readng|readin)\b/);

    if (!bookMatch || !testMatch) return null;
    const book = parseInt(bookMatch[1]);
    const test = parseInt(testMatch[1]);
    if (book < 9 || book > 20 || test < 1 || test > 4) return null;

    // Question — explicit patterns first
    let question: number | undefined;
    const explicitQ =
        lower.match(/(?:question|প্রশ্ন|qn)[.\s-]*(?:no\.?|number|নম্বর)?[.\s#-]*(\d+)/) ||
        lower.match(/\bq\.?\s*(\d+)\b/) ||
        lower.match(/#\s*(\d+)/);

    if (explicitQ) {
        question = parseInt(explicitQ[1]);
    } else {
        // Flexible: find any number that is NOT book and NOT test, in range 1-40
        // Works for: "3 no qustoin", "er 3 ta", "3 number", "3 nmbr", "3 no", standalone 3
        const allNums = [...lower.matchAll(/\b(\d+)\b/g)]
            .map(m => parseInt(m[1]))
            .filter(n => n !== book && n !== test && n >= 1 && n <= 40);
        if (allNums.length > 0) question = allNums[0];
    }

    let mod: string | undefined;
    if (moduleMatch) {
        const m = moduleMatch[1];
        mod = (m.startsWith('list') || m === 'লিসেনিং' || m === 'লিস্টেনিং') ? 'listening' : 'reading';
    }

    return { book, test, question, module: mod };
}

// Extract Cambridge ref from chat history (for follow-up messages like "২", "বিস্তারিত")
function parseCambridgeRefFromHistory(
    history: Array<{ role: string; parts: Array<{ text: string }> }>
): { book: number; test: number; question?: number; module?: string } | null {
    // Walk history in reverse, find last user message with a Cambridge ref
    for (let i = history.length - 1; i >= 0; i--) {
        const entry = history[i];
        if (entry.role === 'user') {
            const ref = parseCambridgeRef(entry.parts?.[0]?.text || '');
            if (ref) return ref;
        }
    }
    return null;
}

// ─── PASSAGE HELPERS ──────────────────────────────────────────────────────────

function findQuestionText(questionText: string, qn: number): string {
    if (!questionText) return '';
    const lines = questionText.split('\n');
    const idx = lines.findIndex(l => /^\d+[.\s)]/.test(l.trim()) && parseInt(l.trim()) === qn);
    if (idx >= 0) {
        const start = Math.max(0, idx - 2);
        return lines.slice(start, Math.min(lines.length, idx + 3)).join(' ').trim();
    }
    return '';
}

function findPassageExcerpt(passageText: string, keyword: string): string {
    if (!passageText) return '';
    const lower = passageText.toLowerCase();
    const kw = keyword.toLowerCase().slice(0, 30);
    const idx = lower.indexOf(kw);
    if (idx >= 0) {
        return passageText.slice(Math.max(0, idx - 150), Math.min(passageText.length, idx + 400));
    }
    return passageText.slice(0, 500);
}

// ─── KB DATA LOOKUP — returns structured data + pre-built base answer ──────────

interface KBResult {
    found: boolean;
    module: 'reading' | 'listening' | 'unknown';
    book: number;
    test: number;
    qn: number;
    questionText: string;
    answer: string;
    options?: string[];
    qType?: string;
    section?: number;
    topic?: string;
    passageExcerpt?: string;
    explanation?: string;
    instruction?: string;
}

async function lookupKB(book: number, test: number, qn?: number, module?: string): Promise<KBResult | null> {
    await loadKB();
    if (!qn) return null;

    const isListening = module === 'listening';
    const isReading = module === 'reading';
    const tryBoth = !module;

    // Reading
    if (isReading || tryBoth) {
        const key = `${book}_${test}_${qn}`;
        const entry = readingKB?.[key] as ReadingKBEntry | undefined;
        if (entry) {
            const ctxEntry = readingKB?.[`${book}_${test}_context`] as ReadingContextEntry | undefined;
            const qText = ctxEntry ? findQuestionText(ctxEntry.question_text || '', qn) : '';
            const excerpt = ctxEntry?.passage_text
                ? findPassageExcerpt(ctxEntry.passage_text, entry.explanation || '')
                : '';
            return {
                found: true, module: 'reading', book, test, qn,
                answer: entry.ans,
                questionText: qText || entry.explanation || '',
                passageExcerpt: excerpt,
                explanation: entry.explanation,
                qType: 'reading',
            };
        }
    }

    // Listening
    if (isListening || tryBoth) {
        for (let sec = 1; sec <= 4; sec++) {
            const key = `${book}_${test}_${sec}_${qn}`;
            const entry = listeningKB?.[key];
            if (entry) {
                const qText = entry.pre
                    ? `${entry.pre}${entry.post ? ' ___ ' + entry.post : ' ___'}`
                    : (entry.q || '');
                return {
                    found: true, module: 'listening', book, test, qn,
                    answer: entry.ans,
                    questionText: qText,
                    options: entry.opts,
                    qType: entry.type,
                    section: sec,
                    topic: entry.topic,
                    instruction: entry.instruction,
                };
            }
        }
    }

    return null;
}

// ─── BUILD CONTEXT STRING FOR GEMINI ──────────────────────────────────────────

function buildKBContext(kb: KBResult): string {
    let ctx = `[KB_DATA]\n`;
    ctx += `Cambridge ${kb.book} Test ${kb.test} — ${kb.module === 'listening' ? 'Listening' : 'Reading'} Q${kb.qn}\n`;
    if (kb.section) ctx += `Section ${kb.section}: ${kb.topic || ''}\n`;
    if (kb.questionText) ctx += `QUESTION: ${kb.questionText}\n`;
    if (kb.options?.length) ctx += `OPTIONS:\n${kb.options.map((o, i) => `  ${String.fromCharCode(65 + i)}. ${o}`).join('\n')}\n`;
    if (kb.instruction) ctx += `Instruction: ${kb.instruction}\n`;
    ctx += `ANSWER: ${kb.answer}\n`;
    if (kb.passageExcerpt) ctx += `PASSAGE_EXCERPT: ${kb.passageExcerpt}\n`;
    if (kb.explanation) ctx += `EXPLANATION_HINT: ${kb.explanation}\n`;
    ctx += `QUESTION_TYPE: ${kb.qType || 'unknown'}\n`;
    return ctx;
}

// ─── FALLBACK ANSWER (no Gemini, but still uses real KB data) ─────────────────

function buildKBFallbackAnswer(kb: KBResult): string {
    const mod = kb.module === 'listening' ? 'Listening' : 'Reading';
    let msg = `📚 **Cambridge ${kb.book} Test ${kb.test} — ${mod} Q${kb.qn}**\n\n`;

    if (kb.section) msg += `🎧 Section ${kb.section}: ${kb.topic || ''}\n\n`;

    if (kb.questionText) msg += `**প্রশ্ন:** ${kb.questionText}\n`;
    if (kb.instruction) msg += `*${kb.instruction}*\n`;

    if (kb.options?.length) {
        msg += `\n**Options:**\n${kb.options.map((o, i) => `  **${String.fromCharCode(65 + i)}.** ${o}`).join('\n')}\n`;
    }

    msg += `\n✅ **সঠিক উত্তর: ${kb.answer}**\n`;

    if (kb.explanation) {
        msg += `📍 **Passage keyword:** "${kb.explanation.slice(0, 120)}"\n`;
    }

    if (kb.passageExcerpt) {
        msg += `\n📄 **Passage excerpt:**\n> ${kb.passageExcerpt.slice(0, 300).replace(/\n/g, '\n> ')}\n`;
    }

    msg += `\n${getTypeTip(kb.qType)}\n`;
    msg += `\n👇 আরো জানতে:\n**১** গল্পে বিস্তারিত 📖 | **২** Distractor analysis ❌ | **৩** Full strategy 🎯`;

    return msg;
}

// ─── GENERIC FALLBACK (no KB data, no Gemini) ─────────────────────────────────

function buildGenericFallback(message: string): string {
    const lower = message.toLowerCase();
    if (lower.includes('reading') || lower.includes('রিডিং')) {
        return '🎯 **Reading strategy:**\n📌 True/False/NG → passage এ exact idea খোঁজো\n📌 Fill blank → blank এর context পড়ো\n💡 Answer গুলো passage এর order এ থাকে\n🔥 Practice করো!';
    }
    if (lower.includes('listening') || lower.includes('লিসেনিং')) {
        return '🎯 **Listening strategy:**\n📌 Audio শুরুর আগে question পড়ো\n📌 Keyword এর synonym শোনো\n💡 Distractor: প্রথমে যা বলে সেটা change হয়\n🔥 তুমি পারবে!';
    }
    if (lower.includes('writing') || lower.includes('রাইটিং')) {
        return '🎯 **Writing tip:**\n📌 Task 1: describe, not interpret\n📌 Task 2: clear thesis + 2 body paragraphs\n💡 IELTS writing এ personal opinion শেষে দাও\n🔥 চমৎকার করবে!';
    }
    return '🎯 **IELTS এ দরকার strategy + practice!**\n📌 Daily: 1 Listening + 1 Reading + 15 min Writing\n💡 Band 7+ এর জন্য accuracy > speed\n🔥 তুমি পারবে!';
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as ChatRequestBody;
        const message = body.message?.trim();
        if (!message) return NextResponse.json({ error: 'Message is required.' }, { status: 400 });

        // 1. Parse Cambridge reference — also check history for follow-up messages ("১", "২", "বিস্তারিত" etc.)
        let ref = parseCambridgeRef(message);
        const isFollowUp = !ref && /^[১২৩123]$|বিস্তারিত|distractor|strategy|গল্পে|explain|ব্যাখ্যা/i.test(message);
        if (!ref && isFollowUp && body.history?.length) {
            ref = parseCambridgeRefFromHistory(body.history);
        }
        let kb: KBResult | null = null;
        if (ref) {
            kb = await lookupKB(ref.book, ref.test, ref.question, ref.module);
        }

        // 2. Try Gemini
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({
                    model: 'gemini-2.5-flash',
                    systemInstruction: SYSTEM_PROMPT,
                });

                const chat = model.startChat({
                    history: body.history || [],
                    generationConfig: { temperature: 0.7, topK: 40, topP: 0.95, maxOutputTokens: 1500 },
                });

                const contextPrefix = body.context && body.context !== 'General' ? `[Context: ${body.context}]\n` : '';
                const kbBlock = kb ? buildKBContext(kb) + '\n\n' : '';
                const fullMessage = `${contextPrefix}${kbBlock}Student এর প্রশ্ন: ${message}`;

                const result = await chat.sendMessage(fullMessage);
                const text = result.response.text();
                return NextResponse.json({ text, source: 'gemini' });

            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err);
                if (msg.includes('429') || msg.includes('quota') || msg.includes('Too Many')) {
                    return NextResponse.json({
                        text: '⏳ একটু বেশি request হয়েছে। ৩০ সেকেন্ড পর আবার try করো!',
                        source: 'rate_limit',
                    });
                }
                console.error('Gemini Error:', err);
                // Fall through to KB fallback
            }
        }

        // 3. Gemini unavailable — use KB data directly (always shows real answer)
        if (kb) {
            return NextResponse.json({ text: buildKBFallbackAnswer(kb), source: 'kb_fallback' });
        }

        // 4. No KB data, no Gemini — generic tips
        return NextResponse.json({ text: buildGenericFallback(message), source: 'generic_fallback' });

    } catch {
        return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }
}
