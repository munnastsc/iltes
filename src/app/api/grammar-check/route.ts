import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { text } = await request.json();
        if (!text?.trim()) return NextResponse.json({ error: 'No text.' }, { status: 400 });

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return NextResponse.json({ error: 'API not configured.' }, { status: 500 });

        const prompt = `You are an English grammar teacher for IELTS students. Analyze this text and return ONLY valid JSON.

Text: "${text}"

Return this exact JSON shape:
{
  "corrected": "the fully corrected version of the text",
  "errors": [
    {
      "original": "wrong phrase from text",
      "fix": "corrected version",
      "explanation": "বাংলায় ব্যাখ্যা — কেন ভুল এবং কীভাবে ঠিক করলে",
      "type": "grammar|spelling|punctuation|word_choice|article"
    }
  ],
  "overallFeedback": "বাংলায় সামগ্রিক মন্তব্য — ২-৩ বাক্য",
  "ieltsScore": number (0-9, estimate of the writing quality)
}

If no errors found, return errors as empty array and corrected same as input.`;

        const MODELS = ['gemini-2.0-flash', 'gemini-2.5-flash'];
        for (const modelName of MODELS) {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    generationConfig: { temperature: 0.2, maxOutputTokens: 1500 },
                });
                const result = await model.generateContent(prompt);
                const raw = result.response.text().trim()
                    .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
                const parsed = JSON.parse(raw);
                return NextResponse.json({ ...parsed, source: modelName });
            } catch (e: unknown) {
                const msg = e instanceof Error ? e.message : '';
                if (msg.includes('429') || msg.includes('quota')) continue;
                if (msg.includes('JSON')) continue;
                break;
            }
        }
        return NextResponse.json({ error: 'Could not analyze. Try again.' }, { status: 500 });
    } catch {
        return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }
}
