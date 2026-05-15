import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';

const SYSTEM = `You are an IELTS paraphrase evaluator. Given an original sentence and a student's paraphrase attempt, evaluate the quality.

Respond ONLY with valid JSON in this exact format:
{
  "score": <0-100 integer>,
  "feedback": "<1-2 sentence summary in Bengali>",
  "techniqueUsed": "<detected technique: Synonym Replacement / Active→Passive / Clause Restructuring / Nominalization / Antonym+Negation / Mixed>",
  "tips": ["<tip in Bengali>", "<tip in Bengali>"]
}

Scoring criteria:
- 80-100: Excellent — meaning preserved, vocabulary significantly changed, structure varied
- 60-79: Good — meaning mostly preserved, some vocabulary changed
- 40-59: Fair — meaning somewhat preserved but too similar or meaning changed slightly
- 0-39: Poor — too similar to original or meaning changed significantly

Keep feedback and tips in Bengali (বাংলা).`;

export async function POST(request: NextRequest) {
    const body = await request.json().catch(() => null);
    const original = typeof body?.original === 'string' ? body.original.trim() : '';
    const attempt = typeof body?.attempt === 'string' ? body.attempt.trim() : '';

    if (!original || !attempt) {
        return NextResponse.json({ error: 'original and attempt required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'sk-your-openai-api-key-here') {
        return NextResponse.json({ error: 'no_key' }, { status: 503 });
    }

    try {
        const openai = new OpenAI({ apiKey });
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: SYSTEM },
                { role: 'user', content: `Original: "${original}"\n\nStudent's paraphrase: "${attempt}"` },
            ],
            temperature: 0.3,
            max_tokens: 300,
        });

        const text = response.choices[0]?.message?.content || '';
        const json = JSON.parse(text);
        return NextResponse.json(json);
    } catch {
        return NextResponse.json({ error: 'evaluation_failed' }, { status: 500 });
    }
}
