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
type ListeningKBEntry = { book: number; test: number; section: number; topic?: string; qn: number; type?: string; pre?: string; post?: string; q?: string; ans: string; opts?: string[] };

const SYSTEM_PROMPT = `তুমি "ILTES AI Tutor" — IELTS শিক্ষক। সবসময় বাংলায় উত্তর দাও।

ABSOLUTE RULES (কখনো ভাঙবে না):
- "Note:", "OpenAI", "API key", "fallback", "audio নেই", "আমার কাছে data নেই" — কখনো বলবে না
- নিজে Cambridge question, passage, বা audio script বানাবে না
- [CAMBRIDGE_ANSWER] block নিজে generate করবে না — শুধু inject হওয়া data use করবে

════════════════════════════════
FORMAT A — যখন [CAMBRIDGE_ANSWER] block দেওয়া হয়:
════════════════════════════════

এই exact structure follow করো:

✅ **উত্তর: [Correct Answer]**
📍 keyword: "[question text থেকে 2-3 টা key word]" → এই word গুলো answer indicate করে

🔑 কীভাবে বের করবে:
[2-3 লাইনে method — paraphrase কী ছিল, কোন distractor এড়াতে হবে, কী শুনতে/পড়তে হবে]

💡 Quick trick: [এক লাইনে grammar বা IELTS trick]

---
আরো জানতে চাইলে নিচের option বেছে নাও:
**১** — গল্পে বিস্তারিত ব্যাখ্যা 📖
**২** — Distractor গুলো কেন ভুল ছিল ❌
**৩** — এই ধরনের question এর full strategy 🎯

CRITICAL: Correct Answer field এ যা আছে ONLY সেটাই বলো।

════════════════════════════════
FORMAT B — General IELTS question (কোনো specific Cambridge data নেই):
════════════════════════════════

🎯 [Direct answer, 2-3 লাইন]
📌 Tip: [একটি rule বা shortcut]
💡 Trick: [memory trick, এক লাইন]
🔥 [এক লাইন encourage]

---
বিস্তারিত চাইলে: **১** গল্পে example | **২** Grammar deep dive | **৩** Practice question

════════════════════════════════
STYLE:
- বাংলায়, English technical terms রাখো
- Concise — student চাইলে তবেই বড় করো
- Emoji ব্যবহার করো কিন্তু overuse করো না`;

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

function parseCambridgeRef(message: string): { book: number; test: number; question?: number; module?: string } | null {
    const lower = message.toLowerCase();

    // Book: "cambridge 9", "cam9", "c9", "book 9", "বই ৯", "ক্যামব্রিজ ৯", digits 9-20
    const bookMatch = lower.match(/(?:cambridge|cam|book|বই|ক্যামব্রিজ|ক্যাম)[.\s-]*(\d+)/) ||
                      lower.match(/\bc(\d+)\b/) ||
                      lower.match(/\bcam(\d+)\b/);

    // Test: "test 1", "t1", "test-1"
    const testMatch = lower.match(/test[.\s-]*(\d+)/) ||
                      lower.match(/\bt(\d+)\b/);

    // Question: "question 5", "q5", "q. 5", "no 5", "number 5", "প্রশ্ন ৫", "#5"
    const qMatch = lower.match(/(?:question|q\.?|no\.?|number|প্রশ্ন)[.\s#-]*(\d+)/) ||
                   lower.match(/\bq(\d+)\b/) ||
                   lower.match(/#(\d+)/);

    // Module: reading/listening keywords in English or Bangla
    const moduleMatch = lower.match(/\b(listening|reading|লিসেনিং|রিডিং|লিস্টেনিং)\b/);

    if (!bookMatch || !testMatch) return null;
    const book = parseInt(bookMatch[1]);
    const test = parseInt(testMatch[1]);
    if (book < 9 || book > 20 || test < 1 || test > 4) return null;

    let mod: string | undefined;
    if (moduleMatch) {
        const m = moduleMatch[1];
        mod = (m === 'লিসেনিং' || m === 'listening' || m === 'লিস্টেনিং') ? 'listening' : 'reading';
    }

    return { book, test, question: qMatch ? parseInt(qMatch[1]) : undefined, module: mod };
}

function findQuestionText(questionText: string, qn: number): string {
    if (!questionText) return '';
    const lines = questionText.split('\n');
    // Find line starting with question number
    const idx = lines.findIndex(l => /^(\d+)[.\s)]/.test(l.trim()) && parseInt(l.trim()) === qn);
    if (idx >= 0) {
        // Include instruction header (few lines before) + question + next 2 lines
        const start = Math.max(0, idx - 2);
        const end = Math.min(lines.length, idx + 3);
        return lines.slice(start, end).join(' ').trim();
    }
    return '';
}

function findPassageExcerpt(passageText: string, keyword: string): string {
    if (!passageText || !keyword) return passageText.slice(0, 800);
    const lower = passageText.toLowerCase();
    const kw = keyword.toLowerCase().slice(0, 30);
    const idx = lower.indexOf(kw);
    if (idx >= 0) {
        const start = Math.max(0, idx - 200);
        const end = Math.min(passageText.length, idx + 600);
        return passageText.slice(start, end);
    }
    return passageText.slice(0, 800);
}

async function getCambridgeContext(book: number, test: number, qn?: number, module?: string): Promise<string> {
    await loadKB();
    let ctx = '';

    const isListening = module === 'listening';
    const isReading = module === 'reading';
    const tryBoth = !module;

    // Reading lookup
    if (isReading || tryBoth) {
        if (qn && readingKB) {
            const key = `${book}_${test}_${qn}`;
            const entry = readingKB[key] as ReadingKBEntry | undefined;
            if (entry) {
                ctx += `[CAMBRIDGE_ANSWER — Reading]\n`;
                ctx += `Cambridge ${book} Test ${test} Q${qn}\n`;
                ctx += `Correct Answer: ${entry.ans}\n`;
                if (entry.explanation) ctx += `Answer Explanation (from passage): ${entry.explanation}\n`;

                const ctxKey = `${book}_${test}_context`;
                const ctxEntry = readingKB[ctxKey] as ReadingContextEntry | undefined;
                if (ctxEntry) {
                    const qText = findQuestionText(ctxEntry.question_text || '', qn);
                    if (qText) ctx += `\nQuestion: ${qText}\n`;
                    if (ctxEntry.passage_text) {
                        const excerpt = findPassageExcerpt(ctxEntry.passage_text, entry.explanation || '');
                        ctx += `\nPassage excerpt:\n${excerpt}\n`;
                    }
                }
                return ctx;
            }
        }
        // No specific question — context overview
        if (!qn && readingKB) {
            const ctxKey = `${book}_${test}_context`;
            const ctxEntry = readingKB[ctxKey] as ReadingContextEntry | undefined;
            if (ctxEntry?.passage_text) {
                ctx += `[CAMBRIDGE_ANSWER — Reading]\nCambridge ${book} Test ${test}\n`;
                ctx += `Passage (excerpt): ${ctxEntry.passage_text.slice(0, 800)}\n`;
                if (ctxEntry.question_text) {
                    ctx += `\nQuestions overview: ${ctxEntry.question_text.slice(0, 400)}\n`;
                }
                return ctx;
            }
        }
    }

    // Listening lookup
    if (isListening || (tryBoth && !ctx)) {
        if (qn && listeningKB) {
            for (let sec = 1; sec <= 4; sec++) {
                const key = `${book}_${test}_${sec}_${qn}`;
                const entry = listeningKB[key];
                if (entry) {
                    ctx += `[CAMBRIDGE_ANSWER — Listening]\n`;
                    ctx += `Cambridge ${book} Test ${test} Q${qn}\n`;
                    ctx += `Section ${sec}: ${entry.topic || ''}\n`;
                    const qText = entry.pre ? `${entry.pre} ___ ${entry.post || ''}` : (entry.q || '');
                    if (qText) ctx += `Question: ${qText}\n`;
                    if (entry.opts?.length) ctx += `Options: ${entry.opts.join(' / ')}\n`;
                    ctx += `Correct Answer: ${entry.ans}\n`;
                    ctx += `Question Type: ${entry.type || 'fill_in_blank'}\n`;
                    return ctx;
                }
            }
        }
        // No specific question — list first few
        if (!qn && listeningKB) {
            const sampleKeys = Object.keys(listeningKB).filter(k => k.startsWith(`${book}_${test}_`)).slice(0, 8);
            if (sampleKeys.length) {
                ctx += `[CAMBRIDGE_ANSWER — Listening]\nCambridge ${book} Test ${test}\n`;
                ctx += `Sample questions:\n`;
                sampleKeys.forEach(k => {
                    const e = listeningKB![k];
                    ctx += `  Q${e.qn}: ${e.pre ? e.pre + ' ___' : (e.q || '')} → Answer: ${e.ans}\n`;
                });
                return ctx;
            }
        }
    }

    return ctx;
}

function buildFallbackReply(message: string): string {
    const lower = message.toLowerCase();
    if (lower.includes('reading') || lower.includes('রিডিং')) {
        return '🎯 Reading এ সবচেয়ে বড় trick হলো — answer passage এ আছেই!\n\n📌 True/False/Not Given:\n- True = same idea আছে\n- False = opposite আছে\n- Not Given = নেই\n\n✅ Trick: Answer order follow করে passage এ!\n\n🔥 তুমি পারবে!';
    }
    if (lower.includes('listening') || lower.includes('লিসেনিং')) {
        return '🎯 Listening secret — audio আগে question পড়ো!\n\n📌 3 Steps:\n1. Keywords underline করো\n2. Synonym শোনো\n3. Distractor এড়াও\n\n🔥 Practice করতে থাকো!';
    }
    return '🎯 IELTS এ দরকার strategy + practice!\n\n📌 Daily: 1 Listening + 1 Reading + 15 min Writing\n\n🔥 তুমি পারবে!';
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as ChatRequestBody;
        const message = body.message?.trim();
        if (!message) return NextResponse.json({ error: 'Message is required.' }, { status: 400 });

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return NextResponse.json({ text: buildFallbackReply(message), source: 'fallback' });

        // Detect Cambridge reference and inject data
        let cambridgeContext = '';
        const ref = parseCambridgeRef(message);
        if (ref) {
            cambridgeContext = await getCambridgeContext(ref.book, ref.test, ref.question, ref.module);
        }

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({
                model: 'gemini-2.5-flash',
                systemInstruction: SYSTEM_PROMPT,
            });

            const chat = model.startChat({
                history: body.history || [],
                generationConfig: { temperature: 0.7, topK: 40, topP: 0.95, maxOutputTokens: 2048 },
            });

            const contextPrefix = body.context && body.context !== 'General' ? `[Context: ${body.context}]\n` : '';
            const fullMessage = cambridgeContext
                ? `${contextPrefix}${cambridgeContext}\n\nStudent এর প্রশ্ন: ${message}`
                : `${contextPrefix}${message}`;

            const result = await chat.sendMessage(fullMessage);
            return NextResponse.json({ text: result.response.text(), source: 'gemini' });
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            if (msg.includes('429') || msg.includes('quota') || msg.includes('Too Many')) {
                return NextResponse.json({ text: '⏳ একটু বেশি request হয়েছে। ৩০ সেকেন্ড পর আবার try করো!', source: 'rate_limit' });
            }
            console.error('Gemini Error:', err);
        }

        return NextResponse.json({ text: buildFallbackReply(message), source: 'fallback' });
    } catch {
        return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }
}
