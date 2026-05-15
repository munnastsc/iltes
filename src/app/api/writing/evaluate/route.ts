import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

type Body = {
    taskType?: 'task1' | 'task2';
    prompt?: string;
    response?: string;
    targetBand?: number;
};

function safeBand(value: unknown, fallback: number) {
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(0, Math.min(9, Number(n.toFixed(1))));
}

function fallbackEvaluation(taskType: 'task1' | 'task2', prompt: string, response: string) {
    const words = response.trim().split(/\s+/).filter(Boolean).length;
    const minimum = taskType === 'task1' ? 150 : 250;
    const base = words >= minimum ? 6 : words >= Math.floor(minimum * 0.7) ? 5.5 : 5;
    const overall = safeBand(base, 5.5);
    return {
        taskType,
        prompt,
        wordCount: words,
        estimatedBand: overall,
        criteria: {
            taskResponse: safeBand(base + 0.1, overall),
            coherenceAndCohesion: safeBand(base, overall),
            lexicalResource: safeBand(base - 0.1, overall),
            grammaticalRangeAndAccuracy: safeBand(base - 0.1, overall),
        },
        strengths: [
            'You have attempted a complete response structure.',
            'Core idea is understandable and mostly on-topic.',
        ],
        mistakes: [
            'Some sentences are repetitive and need better variety.',
            `Word count may be below ideal target (${minimum}+ recommended).`,
        ],
        improvementPlan: [
            'Use clear paragraph roles: introduction, 2 body paragraphs, concise conclusion.',
            'Add specific examples instead of general statements.',
            'Review sentence accuracy for articles, tense, and subject-verb agreement.',
        ],
        improvedSample:
            taskType === 'task1'
                ? 'The chart illustrates notable changes over the period, with the most significant increase seen in...'
                : 'While practical skills improve employability, universities should also preserve broad academic learning because...',
        source: 'fallback',
    };
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as Body;
        const taskType = body.taskType === 'task1' ? 'task1' : 'task2';
        const prompt = String(body.prompt || '').trim();
        const response = String(body.response || '').trim();
        const targetBand = safeBand(body.targetBand, 7);

        if (!prompt || !response) {
            return NextResponse.json({ error: 'prompt and response are required.' }, { status: 400 });
        }

        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-your-openai-api-key-here') {
            return NextResponse.json(fallbackEvaluation(taskType, prompt, response));
        }

        const userPrompt = `
You are a strict IELTS Writing examiner.
Return ONLY valid JSON.

Task type: ${taskType}
Target band: ${targetBand}
Prompt: ${prompt}
Student response: ${response}

Required JSON shape:
{
  "wordCount": number,
  "estimatedBand": number,
  "criteria": {
    "taskResponse": number,
    "coherenceAndCohesion": number,
    "lexicalResource": number,
    "grammaticalRangeAndAccuracy": number
  },
  "strengths": ["short bullet", "..."],
  "mistakes": ["short bullet with fix", "..."],
  "improvementPlan": ["actionable step", "..."],
  "improvedSample": "better model paragraph/mini essay aligned with prompt"
}
`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            temperature: 0.2,
            messages: [
                {
                    role: 'system',
                    content:
                        'You are an IELTS Writing examiner. Be accurate and concise. Provide feedback in simple English.',
                },
                { role: 'user', content: userPrompt },
            ],
        });

        const raw = completion.choices[0]?.message?.content?.trim() || '';
        let parsed: any = null;
        try {
            parsed = JSON.parse(raw);
        } catch {
            return NextResponse.json(fallbackEvaluation(taskType, prompt, response));
        }

        return NextResponse.json({
            taskType,
            prompt,
            wordCount: Number(parsed?.wordCount) || response.split(/\s+/).length,
            estimatedBand: safeBand(parsed?.estimatedBand, 6),
            criteria: {
                taskResponse: safeBand(parsed?.criteria?.taskResponse, 6),
                coherenceAndCohesion: safeBand(parsed?.criteria?.coherenceAndCohesion, 6),
                lexicalResource: safeBand(parsed?.criteria?.lexicalResource, 6),
                grammaticalRangeAndAccuracy: safeBand(parsed?.criteria?.grammaticalRangeAndAccuracy, 6),
            },
            strengths: Array.isArray(parsed?.strengths) ? parsed.strengths.slice(0, 6) : [],
            mistakes: Array.isArray(parsed?.mistakes) ? parsed.mistakes.slice(0, 6) : [],
            improvementPlan: Array.isArray(parsed?.improvementPlan) ? parsed.improvementPlan.slice(0, 6) : [],
            improvedSample: typeof parsed?.improvedSample === 'string' ? parsed.improvedSample : '',
            source: 'openai',
        });
    } catch {
        return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
    }
}
