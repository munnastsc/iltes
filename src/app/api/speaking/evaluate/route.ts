import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { findSpeakingTopicById } from '../../../../lib/speakingTopics';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

type BandBreakdown = {
    fluencyAndCoherence: number;
    lexicalResource: number;
    grammaticalRangeAndAccuracy: number;
    pronunciation: number;
    overall: number;
};

type SpeakingEvaluation = {
    transcript: string;
    estimatedBand: BandBreakdown;
    strengths: string[];
    mistakes: string[];
    improvementPlan: string[];
    modelResponse: string;
};

export const runtime = 'nodejs';

function safeNumber(value: unknown, fallback: number): number {
    const num = Number(value);
    if (!Number.isFinite(num)) return fallback;
    return Math.max(0, Math.min(9, Number(num.toFixed(1))));
}

function buildFallbackEvaluation(transcript: string): SpeakingEvaluation {
    const wordCount = transcript.split(/\s+/).filter(Boolean).length;
    const base = wordCount > 130 ? 6.5 : wordCount > 80 ? 6 : wordCount > 45 ? 5.5 : 5;
    const overall = safeNumber(base, 5.5);

    return {
        transcript,
        estimatedBand: {
            fluencyAndCoherence: safeNumber(base + 0.2, 5.5),
            lexicalResource: safeNumber(base, 5.5),
            grammaticalRangeAndAccuracy: safeNumber(base - 0.2, 5.5),
            pronunciation: safeNumber(base - 0.1, 5.5),
            overall,
        },
        strengths: [
            'আপনি উত্তরটি সম্পূর্ণ করার চেষ্টা করেছেন, যা fluency উন্নত করে।',
            'Topic related vocabulary ব্যবহার করার চেষ্টা আছে।',
        ],
        mistakes: [
            'কিছু sentence structure ছোট ও repetitive হয়েছে।',
            'উত্তরে concrete example আরও বেশি দিলে score বাড়বে।',
        ],
        improvementPlan: [
            'Answer framework ব্যবহার করুন: Main idea -> Reason -> Example -> Result.',
            'প্রতিদিন 2 মিনিট cue card practice করে নিজে শুনে correction নিন।',
            'Linking words ব্যবহার করুন: however, moreover, as a result.',
        ],
        modelResponse:
            'One person who is very helpful to me is my elder sister. Whenever I feel confused about studies or career decisions, she gives practical advice and motivates me. For example, during my IELTS preparation, she made a weekly routine for me and reviewed my speaking answers every night. Her support not only improved my confidence but also helped me become more disciplined. That is why I consider her a truly helpful person.',
    };
}

function parseAiJson(content: string): Omit<SpeakingEvaluation, 'transcript'> | null {
    try {
        const parsed = JSON.parse(content);
        return {
            estimatedBand: {
                fluencyAndCoherence: safeNumber(parsed?.estimatedBand?.fluencyAndCoherence, 5.5),
                lexicalResource: safeNumber(parsed?.estimatedBand?.lexicalResource, 5.5),
                grammaticalRangeAndAccuracy: safeNumber(parsed?.estimatedBand?.grammaticalRangeAndAccuracy, 5.5),
                pronunciation: safeNumber(parsed?.estimatedBand?.pronunciation, 5.5),
                overall: safeNumber(parsed?.estimatedBand?.overall, 5.5),
            },
            strengths: Array.isArray(parsed?.strengths) ? parsed.strengths.slice(0, 5) : [],
            mistakes: Array.isArray(parsed?.mistakes) ? parsed.mistakes.slice(0, 6) : [],
            improvementPlan: Array.isArray(parsed?.improvementPlan) ? parsed.improvementPlan.slice(0, 6) : [],
            modelResponse: typeof parsed?.modelResponse === 'string' ? parsed.modelResponse : '',
        };
    } catch {
        return null;
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const topicId = String(formData.get('topicId') || '');
        const activePart = String(formData.get('activePart') || 'part2');
        const manualTranscript = String(formData.get('transcript') || '').trim();
        const audioFile = formData.get('audio');
        const topic = findSpeakingTopicById(topicId);

        if (!topic) {
            return NextResponse.json({ error: 'Invalid topic.' }, { status: 400 });
        }

        let transcript = manualTranscript;

        if (!transcript && audioFile instanceof File) {
            if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-your-openai-api-key-here') {
                return NextResponse.json({ error: 'OPENAI_API_KEY missing for audio scoring.' }, { status: 400 });
            }

            try {
                const transcription = await openai.audio.transcriptions.create({
                    file: audioFile,
                    model: 'whisper-1',
                    language: 'en',
                });
                transcript = transcription.text?.trim() || '';
            } catch {
                return NextResponse.json({ error: 'Audio transcription failed.' }, { status: 500 });
            }
        }

        if (!transcript) {
            return NextResponse.json({ error: 'Provide audio or transcript.' }, { status: 400 });
        }

        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-your-openai-api-key-here') {
            return NextResponse.json(buildFallbackEvaluation(transcript));
        }

        const prompt = `
You are an IELTS Speaking examiner.
Return ONLY valid JSON. No markdown, no explanations.

User context:
- Topic: ${topic.title}
- Part: ${activePart}
- Cue card title: ${topic.part2.title}
- Cue card bullets: ${topic.part2.bulletPoints.join(' | ')}
- Transcript: ${transcript}

Evaluate using IELTS speaking criteria with realistic strictness.

Required JSON shape:
{
  "estimatedBand": {
    "fluencyAndCoherence": number,
    "lexicalResource": number,
    "grammaticalRangeAndAccuracy": number,
    "pronunciation": number,
    "overall": number
  },
  "strengths": ["Bangla bullet", "..."],
  "mistakes": ["Bangla bullet with example/fix", "..."],
  "improvementPlan": ["Actionable Bangla step", "..."],
  "modelResponse": "Band 8 style sample answer in English (120-170 words)"
}
`;

        try {
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                temperature: 0.3,
                messages: [
                    {
                        role: 'system',
                        content:
                            'You are a strict IELTS speaking examiner and coach. Keep feedback concise but precise. বাংলা feedback দিন, কিন্তু sample উত্তর English-এ দিন।',
                    },
                    { role: 'user', content: prompt },
                ],
            });

            const raw = completion.choices[0]?.message?.content?.trim() || '';
            const parsed = parseAiJson(raw);
            if (!parsed) {
                return NextResponse.json(buildFallbackEvaluation(transcript));
            }

            return NextResponse.json({
                transcript,
                ...parsed,
            });
        } catch {
            return NextResponse.json(buildFallbackEvaluation(transcript));
        }
    } catch {
        return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
    }
}
