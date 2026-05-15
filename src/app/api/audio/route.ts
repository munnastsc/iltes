import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getMockAudioScript } from '../../../lib/mockAudioScripts';

export const runtime = 'nodejs';

function missingConfigResponse() {
    return NextResponse.json(
        {
            error: 'Audio generation requires OPENAI_API_KEY.',
        },
        { status: 400 }
    );
}

async function buildAudioFromText(text: string, voice: string) {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const speech = await openai.audio.speech.create({
        model: 'gpt-4o-mini-tts',
        voice: voice as any,
        input: text,
    });

    const buffer = Buffer.from(await speech.arrayBuffer());
    return new Response(buffer, {
        status: 200,
        headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=3600',
        },
    });
}

export async function GET(request: Request) {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-your-openai-api-key-here') {
        return missingConfigResponse();
    }

    const { searchParams } = new URL(request.url);
    const preset = searchParams.get('preset');
    const voice = searchParams.get('voice') || 'alloy';
    const directText = searchParams.get('text');
    const text = directText?.trim() || getMockAudioScript(preset);

    if (!text) {
        return NextResponse.json({ error: 'Provide ?preset=... or ?text=...' }, { status: 400 });
    }

    try {
        return await buildAudioFromText(text, voice);
    } catch {
        return NextResponse.json({ error: 'Audio generation failed.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-your-openai-api-key-here') {
        return missingConfigResponse();
    }

    try {
        const body = await request.json();
        const preset = typeof body?.preset === 'string' ? body.preset : null;
        const voice = typeof body?.voice === 'string' ? body.voice : 'alloy';
        const directText = typeof body?.text === 'string' ? body.text.trim() : '';
        const text = directText || getMockAudioScript(preset);

        if (!text) {
            return NextResponse.json({ error: 'text or preset is required.' }, { status: 400 });
        }

        return await buildAudioFromText(text, voice);
    } catch {
        return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
    }
}
