import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFile } from 'fs/promises';
import path from 'path';

type ChatRequestBody = {
    message?: string;
    context?: string;
    history?: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>;
    image?: string;      // base64 data URL  (data:image/jpeg;base64,...)
    imageType?: string;  // MIME type
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
- [KB_DATA] block এ ANSWER যা লেখা আছে সেটাই একমাত্র সঠিক উত্তর — নিজের Cambridge book knowledge দিয়ে override করবে না
- [KB_DATA] block থাকলে শুধু ওই data থেকেই explain করো, নিজে Cambridge passage বা question বানাবে না

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
FORMAT B — General IELTS / English question (no KB_DATA):
════════════════════════════════════

Real teacher এর মতো explain করো — সহজ বাংলায়, concrete example সহ।

🎯 **[Direct answer — 2-3 লাইন, কোনো fluff নেই]**

📌 **Rule:**
[1-2 টি concrete rule, real IELTS example সহ]

💡 **মনে রাখার trick:**
[একটি memory hook — ছোট, catchy]

📝 **Example:**
[IELTS-style example — question + answer দেখাও]

🔥 [এক লাইন specific encourage — generic না]

👇 **১** আরো example | **২** Practice question দাও | **৩** Common mistakes দেখাও

════════════════════════════════════
IELTS TEACHING KNOWLEDGE:
════════════════════════════════════

Reading:
- True/False/NG: NG = passage এ কোনো info নেই; False = passage বিপরীত বলেছে; True = exactly বলেছে। "similar word থাকলেই True না" — claim টা exactly match করতে হবে।
- Heading match: paragraph এর main idea = heading। Detail নয়, overall theme।
- Fill blank: blank এর আগে/পরের word = grammar clue (a/an = singular noun; recently = past participle)
- MCQ: সব option পড়ো, passage এ locate করো, "absolute" words (always/never/only/all) সন্দেহ করো।
- Sentence ending: answer গুলো passage এ order অনুযায়ী।

Listening:
- Audio শুরুর আগে 30-45 sec question পড়ো, keyword underline করো।
- Distractor: প্রথমে যা বলে সেটা change হয় → শেষ answer টাই সঠিক।
- Fill blank: spelling সতর্ক, CAPITALIZATION মনে রাখো।
- Map/Plan: directions শোনো — opposite/next to/between/behind। ছবিতে letter দিয়ে track করো।
- Multiple choice: সব option আগে পড়ো, synonym শোনো।

Writing Task 2 structure:
Intro (2-3 sentences: paraphrase topic + thesis) → Body 1 (topic sentence + explanation + example) → Body 2 (topic sentence + explanation + example) → Conclusion (restate thesis, no new info). Band 7+: varied grammar, topic-specific vocab, clear coherence.

Writing Task 1 Academic:
Overview paragraph বাধ্যতামূলক (2 most striking trends)। Specific data cite করো। Present/Past tense অনুযায়ী।

Speaking:
- Part 1: 2-3 sentence answer, এক্সট্রা detail add করো।
- Part 2: PEEL (Point-Example-Explanation-Link), 1.5-2 min।
- Part 3: "That's a great point. I think..." দিয়ে শুরু, agree/disagree + reason + example।
- Fluency: filler words (um/uh) বাদ দাও। Pause করো, তারপর বলো।

Grammar common IELTS points:
- Articles: a (first mention), the (known/specific/unique), no article (plural general)
- Conditionals: Type 2 (If + past simple, would + inf) for hypothetical
- Passive: When agent unknown/unimportant — "is/was + past participle"
- Relative clauses: which/that (thing), who (person), where (place)

Vocabulary:
- Word families matter: economy → economic → economically → economist
- Collocations: make a decision (না "do"), take responsibility (না "make")
- Paraphrase is key: important → crucial/vital/significant`;


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
    const lines = questionText.split('\n').map(l => l.trim()).filter(Boolean);

    // Pattern 1: line starts with "3." or "3)" or "3 text"
    let idx = lines.findIndex(l => /^\d+[.\s)]/.test(l) && parseInt(l) === qn);
    if (idx >= 0) {
        return lines.slice(idx, Math.min(lines.length, idx + 3)).join(' ').trim();
    }

    // Pattern 2: standalone number on its own line, text follows next line
    idx = lines.findIndex(l => l === String(qn));
    if (idx >= 0 && idx + 1 < lines.length) {
        const parts: string[] = [];
        let i = idx + 1;
        while (i < lines.length && !/^[A-Ca-c]$|^TRUE$|^FALSE$|^NOT GIVEN$|^\d+$/.test(lines[i]) && parts.length < 4) {
            parts.push(lines[i]);
            i++;
        }
        return parts.join(' ').trim();
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
    if (lower.includes('true') || lower.includes('false') || lower.includes('not given') || lower.includes('tfng')) {
        return '🎯 **True/False/Not Given strategy:**\n📌 TRUE → passage এ exactly same idea আছে\n📌 FALSE → passage বিপরীত বলেছে\n📌 NOT GIVEN → passage এ কোনো mention নেই\n💡 Trick: similar word থাকলেই TRUE না — claim টা match করতে হবে\n📝 Example: Q says "all players" → passage says "most players" → NOT GIVEN\n🔥 Practice করো, pattern clear হবে!';
    }
    if (lower.includes('heading') || lower.includes('হেডিং')) {
        return '🎯 **Heading Match strategy:**\n📌 Paragraph এর MAIN IDEA = heading, detail নয়\n📌 প্রথম ও শেষ sentence সবচেয়ে important\n💡 Trick: heading এ যদি "contrast/shift" থাকে → paragraph এ "but/however/although" খোঁজো\n🔥 Paragraph কে ১ লাইনে summarize করার practice করো!';
    }
    if (lower.includes('fill') || lower.includes('blank') || lower.includes('ফিল')) {
        return '🎯 **Fill in the Blank strategy:**\n📌 Blank এর আগের word = grammar clue (a/an → singular noun)\n📌 Passage এর exact word ব্যবহার করো — paraphrase নয়\n📌 Word limit মানো (NO MORE THAN TWO WORDS)\n💡 Trick: blank এর context পড়ো → passage এ keyword খোঁজো → surrounding words দেখো\n🔥 Spelling carefully লেখো!';
    }
    if (lower.includes('reading') || lower.includes('রিডিং')) {
        return '🎯 **Reading Master Strategy:**\n📌 Skimming → সব question পড়ো → locate করো → verify করো\n📌 Answer গুলো passage এর order এ থাকে (fill blank/sentence completion)\n📌 "Absolute" words (always/never/all/only) সন্দেহ করো\n💡 Trick: keyword এর synonym passage এ থাকে — direct word নয়\n🔥 Daily 1 passage practice করো!';
    }
    if (lower.includes('listening') || lower.includes('লিসেনিং') || lower.includes('listen')) {
        return '🎯 **Listening Master Strategy:**\n📌 Audio শুরুর আগে question পড়ো, keyword underline করো\n📌 Distractor: প্রথমে যা বলে সেটা change হয় → শেষ answer সঠিক\n📌 Fill blank: exact word লেখো, spelling সঠিক করো\n💡 Trick: question এর keyword এর SYNONYM audio তে শোনা যাবে\n🔥 Section 1 সবচেয়ে easy — এখানে full marks নাও!';
    }
    if (lower.includes('writing') || lower.includes('রাইটিং') || lower.includes('task 2') || lower.includes('task 1')) {
        return '🎯 **Writing Band 7+ Formula:**\n**Task 2:** Intro (paraphrase + thesis) → Body 1 (point+example) → Body 2 (point+example) → Conclusion\n**Task 1:** Overview paragraph বাধ্যতামূলক + specific data cite করো\n📌 Varied sentence structure + topic-specific vocabulary\n💡 Trick: 1 complex sentence + 1 simple sentence + 1 compound sentence — vary করো\n🔥 Daily 1 essay draft করো, word limit মানো!';
    }
    if (lower.includes('speaking') || lower.includes('স্পিকিং')) {
        return '🎯 **Speaking Fluency Strategy:**\n📌 Part 1: 2-3 sentence, extra detail add করো (reason/example)\n📌 Part 2: PEEL method → Point, Example, Explain, Link — 2 min\n📌 Part 3: Opinion + reason + real example দাও\n💡 Trick: pause করো, তারপর বলো — "um/uh" বলার চেয়ে pause ভালো\n🔥 Daily 2 min mirror এর সামনে practice করো!';
    }
    if (lower.includes('grammar') || lower.includes('গ্রামার') || lower.includes('article') || lower.includes('tense') || lower.includes('passive')) {
        return '🎯 **IELTS Grammar shortcuts:**\n📌 Article: a (first mention) / the (known/specific) / no article (plural general)\n📌 Passive: is/was + past participle — when agent unknown/unimportant\n📌 Conditionals: Type 2 = If + past simple, would + infinitive (hypothetical)\n💡 Trick: IELTS Writing এ variety দেখাও — same structure repeat করো না\n🔥 Grammar mistakes Band score কমায় — daily 5 sentence practice করো!';
    }
    if (lower.includes('vocab') || lower.includes('word') || lower.includes('vocabulary') || lower.includes('ভোকাব')) {
        return '🎯 **IELTS Vocabulary shortcuts:**\n📌 Word families শেখো: economy/economic/economically/economist\n📌 Collocations: make a decision, take responsibility, do research\n📌 Paraphrase: important→crucial/vital/significant, show→demonstrate/illustrate\n💡 Trick: প্রতিদিন 5 টা word → 3 forms শেখো → example sentence লেখো\n🔥 Vocabulary Band score সরাসরি বাড়ায়!';
    }
    if (lower.includes('band') || lower.includes('score') || lower.includes('ব্যান্ড')) {
        return '🎯 **Band Score বাড়ানোর roadmap:**\n📌 Band 6→7: Reading accuracy + Listening note-taking\n📌 Band 7→8: Writing coherence + Speaking fluency\n📌 সব section এ balanced practice করো\n💡 Trick: weakness identify করো → সেটাতে double time দাও\n🔥 Daily 2 hours focused practice > 6 hours random study!';
    }
    return '🎯 **IELTS এ দরকার strategy + practice!**\n📌 Daily: 1 Listening + 1 Reading + 15 min Writing + 5 min Speaking\n📌 Cambridge Books 9-20 থেকে practice করো\n📌 আমাকে specific question করো — Cambridge book এর question ও explain করতে পারি!\n💡 Band 7+ এর জন্য accuracy > speed\n🔥 তুমি পারবে — শুধু consistent থাকো!';
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

        // 2. Try Gemini (primary: 2.5-flash, fallback: 2.0-flash)
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
            const contextPrefix = body.context && body.context !== 'General' ? `[Context: ${body.context}]\n` : '';
            const kbBlock = kb ? buildKBContext(kb) + '\n\n' : '';
            const textPart = `${contextPrefix}${kbBlock}Student এর প্রশ্ন: ${message}`;

            const msgParts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
            if (body.image) {
                const mimeType = body.imageType || 'image/jpeg';
                const base64Data = body.image.replace(/^data:[^;]+;base64,/, '');
                msgParts.push({ inlineData: { mimeType, data: base64Data } });
            }
            msgParts.push({ text: textPart });

            const genConfig = { temperature: kb ? 0.3 : 0.7, topK: 40, topP: 0.95, maxOutputTokens: 1500 };
            const MODELS = ['gemini-2.0-flash', 'gemini-2.5-flash'];

            for (const modelName of MODELS) {
                try {
                    const genAI = new GoogleGenerativeAI(apiKey);
                    const model = genAI.getGenerativeModel({ model: modelName, systemInstruction: SYSTEM_PROMPT });
                    const chat = model.startChat({ history: body.history || [], generationConfig: genConfig });

                    // 10-second timeout per model attempt
                    const timeoutPromise = new Promise<never>((_, reject) =>
                        setTimeout(() => reject(new Error('TIMEOUT')), 10000)
                    );
                    const result = await Promise.race([chat.sendMessage(msgParts), timeoutPromise]);
                    const text = (result as Awaited<ReturnType<typeof chat.sendMessage>>).response.text();
                    return NextResponse.json({ text, source: modelName });

                } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : String(err);
                    if (msg.includes('429') || msg.includes('quota') || msg.includes('Too Many')) {
                        return NextResponse.json({
                            text: '⏳ একটু বেশি request হয়েছে। ৩০ সেকেন্ড পর আবার try করো!',
                            source: 'rate_limit',
                        });
                    }
                    // 503 / timeout / fetch failed → try next model
                    console.error(`${modelName} error:`, msg.slice(0, 100));
                }
            }
            // All models failed — fall through to KB/generic fallback
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
