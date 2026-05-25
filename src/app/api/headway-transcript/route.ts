import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export const dynamic = 'force-dynamic';

type TranscriptMap = Record<string, { text: string; bangla?: string }>;

let cache: TranscriptMap | null = null;

function loadTranscripts(): TranscriptMap {
    if (cache) return cache;
    const p = join(process.cwd(), 'data', 'headway-transcripts.json');
    if (!existsSync(p)) { cache = {}; return cache; }
    try {
        cache = JSON.parse(readFileSync(p, 'utf8'));
        return cache!;
    } catch {
        cache = {};
        return cache;
    }
}

export async function GET(req: NextRequest) {
    const track = req.nextUrl.searchParams.get('track');
    if (!track) return NextResponse.json({ transcript: null });
    const transcripts = loadTranscripts();
    const data = transcripts[track] ?? null;
    return NextResponse.json({ transcript: data });
}
