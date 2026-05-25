import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
    try {
        const { word } = await request.json();
        if (!word || typeof word !== 'string') return NextResponse.json({ bangla: '—', partOfSpeech: '' });

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return NextResponse.json({ bangla: '—', partOfSpeech: '' });

        const prompt = `Give the Bangla (Bengali) meaning of the English word or phrase: "${word}"
Return ONLY valid JSON, no markdown: {"bangla": "বাংলা অর্থ", "partOfSpeech": "noun/verb/adjective/adverb/preposition/conjunction/phrase"}
bangla: one short word or phrase in Bangla script. No explanation.`;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash', generationConfig: { temperature: 0, maxOutputTokens: 80 } });
        const result = await model.generateContent(prompt);
        const raw = result.response.text().trim()
            .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
        const parsed = JSON.parse(raw);
        return NextResponse.json({ bangla: String(parsed?.bangla || '—'), partOfSpeech: String(parsed?.partOfSpeech || '') });
    } catch {
        return NextResponse.json({ bangla: '—', partOfSpeech: '' });
    }
}
