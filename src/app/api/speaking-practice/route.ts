import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const EXAMINER_PROMPT = `তুমি একজন IELTS Speaking examiner এবং Spoken English coach।
তোমার কাজ: student-এর সাথে কথা বলা এবং তাদের English improve করতে সাহায্য করা।

RULES:
1. সবসময় English-এ কথা বলো (examiner হিসেবে)
2. প্রতিটা response-এর শেষে একটা follow-up question করো
3. Student ভুল করলে — তাদের কথা repeat করো সঠিকভাবে, তারপর question করো
4. প্রতি ৩-৪ টার্নে একবার short feedback দাও (বাংলায়)
5. Natural conversation রাখো — exam-এর মতো কঠিন নয়

FEEDBACK FORMAT (বাংলায়, শুধু মাঝেমধ্যে):
💡 **Tip:** [one quick grammar/vocab tip]

Always end with a question to keep conversation going.`;

type Mode = 'topic' | 'part1' | 'part2' | 'part3' | 'free';

const TOPIC_INTROS: Record<string, string> = {
    'daily-routine': "Let's talk about your daily routine. What time do you usually wake up in the morning?",
    'hometown': "I'd like to ask you about where you come from. Can you describe your hometown?",
    'technology': "Let's discuss technology. How often do you use the internet in your daily life?",
    'travel': "I'd like to talk about travel and holidays. Do you enjoy travelling? Where have you been?",
    'food': "Let's talk about food. What kind of food do you usually eat?",
    'education': "I'd like to discuss education. Tell me about your study background.",
    'work': "Let's talk about work or studies. Are you working or studying at the moment?",
    'hobbies': "I'd like to ask about your hobbies. What do you like to do in your free time?",
    'family': "Let's talk about family. Can you tell me about your family?",
    'environment': "I'd like to discuss the environment. Are you concerned about environmental issues?",
    'health': "Let's talk about health. How do you try to stay healthy?",
    'media': "I'd like to ask about media and news. How do you usually get your news?",
    'shopping': "Let's talk about shopping. Do you enjoy shopping? Where do you usually shop?",
    'music': "I'd like to discuss music. Do you enjoy listening to music? What kind?",
    'sports': "Let's talk about sports. Do you do any sports or exercise regularly?",
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            message,
            topic,
            mode = 'topic',
            history = [],
            requestFeedback = false,
        }: {
            message?: string;
            topic?: string;
            mode?: Mode;
            history?: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>;
            requestFeedback?: boolean;
        } = body;

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            systemInstruction: EXAMINER_PROMPT,
        });

        // Start of conversation — return intro
        if (!message && topic) {
            const intro = TOPIC_INTROS[topic] || "Hello! Let's have a conversation in English. How are you today?";
            return NextResponse.json({ text: intro, type: 'intro' });
        }

        if (!message) {
            return NextResponse.json({ error: 'No message' }, { status: 400 });
        }

        // Gemini requires history to start with 'user' and alternate user/model
        // Drop leading model messages and ensure proper alternation
        let validHistory = [...history];
        while (validHistory.length > 0 && validHistory[0].role !== 'user') {
            validHistory.shift();
        }
        // Ensure alternation: drop consecutive same-role entries
        const cleanHistory: typeof validHistory = [];
        for (const turn of validHistory) {
            if (cleanHistory.length === 0 || cleanHistory[cleanHistory.length - 1].role !== turn.role) {
                cleanHistory.push(turn);
            }
        }
        // Must end with model turn (user message is sent separately)
        if (cleanHistory.length > 0 && cleanHistory[cleanHistory.length - 1].role === 'user') {
            cleanHistory.pop();
        }

        let prompt = message;
        if (requestFeedback) {
            prompt += '\n\n[Please give me detailed feedback on my English in this conversation so far — grammar, vocabulary, fluency. Write feedback in Bangla.]';
        }

        const MODELS = ['gemini-2.0-flash', 'gemini-2.5-flash'];
        let text = '';
        for (const modelName of MODELS) {
            try {
                const m = genAI.getGenerativeModel({ model: modelName, systemInstruction: EXAMINER_PROMPT });
                const chat = m.startChat({
                    history: cleanHistory,
                    generationConfig: { temperature: 0.8, maxOutputTokens: 300 },
                });
                const result = await chat.sendMessage(prompt);
                text = result.response.text();
                break;
            } catch (e: unknown) {
                const msg = e instanceof Error ? e.message : '';
                if (msg.includes('429') || msg.includes('quota') || msg.includes('503')) continue;
                throw e;
            }
        }

        if (!text) return NextResponse.json({ text: "⏳ একটু বেশি request হয়েছে। ৩০ সেকেন্ড পর আবার try করো!", type: 'reply' });
        return NextResponse.json({ text, type: requestFeedback ? 'feedback' : 'reply' });
    } catch (err) {
        console.error('speaking-practice error:', err);
        return NextResponse.json({ text: "⏳ API limit হয়েছে। নতুন API key লাগাও অথবা কিছুক্ষণ পর try করো।" }, { status: 500 });
    }
}
