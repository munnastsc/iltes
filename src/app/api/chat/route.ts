import { NextResponse } from 'next/server';
import OpenAI from 'openai';

type ChatRequestBody = {
    message?: string;
    context?: string;
};

const SYSTEM_PROMPT = `
You are 'IELTS Sathi AI', a senior IELTS expert and coach. Your goal is to help students achieve a high band score (8.0+) in the IELTS exam. 
Always respond in Bengali (বাংলা). Use English for technical IELTS terms (e.g., 'True/False/Not Given', 'Lexical Resource', 'Coherence and Cohesion', 'Skimming', 'Scanning').
Provide detailed explanations, specific strategies, tips, and tricks. 
When asked about a specific module (Listening, Reading, Writing, Speaking), give a step-by-step approach.
Focus on logic, common traps (distractors), and time management.
Encourage the student and be professional yet friendly.
If the student asks in English, still respond in Bengali but you can provide English translations for key tips.
`;

function buildFallbackReply(message: string): string {
    const lower = message.toLowerCase();

    if (lower.includes('reading')) {
        return 'Reading এ আগে question type identify করুন। তারপর keywords mark করে passage scan করুন, এবং True/False/Not Given-এ exact evidence না পেলে Not Given দিন।';
    }
    if (lower.includes('writing')) {
        return 'Writing Task 2 এ প্রথমে clear thesis লিখুন, তারপর 2 body paragraph-এ idea + example দিন। grammar এর চেয়ে coherence আর task response আগে নিশ্চিত করুন।';
    }
    if (lower.includes('listening')) {
        return 'Listening এ section শুরু হওয়ার আগে instruction পড়ুন, answer limit দেখুন, আর distractor words শুনে panic না করে final correction ধরুন।';
    }
    if (lower.includes('speaking')) {
        return 'Speaking এ short answer না দিয়ে 2-3 line expand করুন: idea, reason, example। fluency keep করতে simple structure ব্যবহার করুন।';
    }
    return 'আপনার প্রশ্ন পেয়েছি। IELTS-এ score improve করতে আমরা question ধরন, logic, এবং common trap একসাথে breakdown করে practice করব। (Note: OpenAI API key missing or error, using fallback).';
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as ChatRequestBody;
        const message = body.message?.trim();

        if (!message) {
            return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
        }

        // Try OpenAI first
        if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-openai-api-key-here') {
            try {
                const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
                const response = await openai.chat.completions.create({
                    model: 'gpt-3.5-turbo', // Or gpt-4-turbo-preview
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
                        { role: 'user', content: `Context: ${body.context || 'General'}\nQuestion: ${message}` },
                    ],
                    temperature: 0.7,
                });

                const aiText = response.choices[0]?.message?.content;
                if (aiText) {
                    return NextResponse.json({
                        text: aiText,
                        context: body.context || 'AI Coach Live Response',
                    });
                }
            } catch (err) {
                console.error('OpenAI Error:', err);
                // Fall through to fallback
            }
        }

        // Fallback if no API key or API error
        const text = buildFallbackReply(message);
        return NextResponse.json({
            text,
            context: body.context || 'General IELTS Help (Fallback)',
        });
    } catch {
        return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
    }
}
