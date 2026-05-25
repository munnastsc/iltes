import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Oxford Learner's Dictionary audio URL pattern:
// /media/english/us_pron/[l1]/[l3]/[l5]/[word]__us_1.mp3
function buildOxfordUrl(word: string): string {
    const w = word.toLowerCase().replace(/[^a-z]/g, '');
    const l1 = w.slice(0, 1);
    const l3 = w.slice(0, 3).padEnd(3, '_');
    const l5 = w.slice(0, 5).padEnd(5, '_');
    return `https://www.oxfordlearnersdictionaries.com/media/english/us_pron/${l1}/${l3}/${l5}/${w}__us_1.mp3`;
}

// Fallback: Free Dictionary API has pronunciation audio too
function buildFreeDictUrl(word: string): string {
    return `https://ssl.gstatic.com/dictionary/static/sounds/oxford/${word.toLowerCase()}--_us_1.mp3`;
}

export async function GET(request: NextRequest) {
    const word = request.nextUrl.searchParams.get('word')?.trim();
    if (!word) {
        return NextResponse.json({ error: 'word param required' }, { status: 400 });
    }

    const sanitized = word.toLowerCase().replace(/[^a-z\-]/g, '');
    if (!sanitized) {
        return NextResponse.json({ error: 'invalid word' }, { status: 400 });
    }

    const sources = [
        buildOxfordUrl(sanitized),
        `https://ssl.gstatic.com/dictionary/static/sounds/oxford/${sanitized}--_us_1.mp3`,
        `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(sanitized)}&type=2`,
    ];

    for (const url of sources) {
        try {
            const res = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Referer': 'https://www.oxfordlearnersdictionaries.com/',
                },
                signal: AbortSignal.timeout(8000),
            });

            if (res.ok) {
                const ct = res.headers.get('content-type') || '';
                if (ct.includes('audio') || ct.includes('mpeg') || ct.includes('octet-stream')) {
                    const buffer = await res.arrayBuffer();
                    return new Response(buffer, {
                        status: 200,
                        headers: {
                            'Content-Type': 'audio/mpeg',
                            'Cache-Control': 'public, max-age=604800',
                        },
                    });
                }
            }
        } catch {
            // try next source
        }
    }

    return NextResponse.json({ error: `Pronunciation not found: ${sanitized}` }, { status: 404 });
}
