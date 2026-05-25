import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

function toCamNumber(book: number): number {
    if (book >= 101 && book <= 110) return book - 100;
    return book;
}

// Check local public/audio folder first
async function tryLocalFile(camNum: number, test: number, part: number): Promise<Buffer | null> {
    const fileName = `cam${camNum}-test${test}-part${part}.mp3`;
    const filePath = path.join(process.cwd(), 'public', 'audio', fileName);
    try {
        return await readFile(filePath);
    } catch {
        return null;
    }
}

function buildSources(camNum: number, test: number, part: number): Array<{ url: string; referer: string }> {
    const n = camNum;
    const t = test;
    const p = part;
    return [
        {
            url: `https://www.ieltsxpress.com/wp-content/uploads/audio/cam${n}-test${t}-part${p}.mp3`,
            referer: 'https://www.ieltsxpress.com/',
        },
        {
            url: `https://ieltspractice.net/wp-content/uploads/audio/cam${n}-test${t}-part${p}.mp3`,
            referer: 'https://ieltspractice.net/',
        },
        {
            url: `https://ieltsdata.com/audio/cambridge-${n}-test-${t}-part-${p}.mp3`,
            referer: 'https://ieltsdata.com/',
        },
    ];
}

const BROWSER_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'audio/mpeg,audio/*;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'identity',
    'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'audio',
    'Sec-Fetch-Mode': 'no-cors',
    'Sec-Fetch-Site': 'same-origin',
};

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const book = Number(searchParams.get('book'));
    const test = Number(searchParams.get('test'));
    const part = Number(searchParams.get('part'));

    if (!book || !test || !part) {
        return NextResponse.json({ error: 'book, test, part params required' }, { status: 400 });
    }

    const camNum = toCamNumber(book);

    // 1. CDN redirect if configured
    const cdnBase = process.env.NEXT_PUBLIC_AUDIO_CDN_URL;
    if (cdnBase) {
        const cdnUrl = `${cdnBase.replace(/\/$/, '')}/cam${camNum}-test${test}-part${part}.mp3`;
        return NextResponse.redirect(cdnUrl, { status: 302 });
    }

    // 2. Try local file
    const localBuffer = await tryLocalFile(camNum, test, part);
    if (localBuffer) {
        return new Response(new Uint8Array(localBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': String(localBuffer.length),
                'Cache-Control': 'public, max-age=604800',
                'Accept-Ranges': 'bytes',
            },
        });
    }

    // 3. Try external sources
    for (const { url, referer } of buildSources(camNum, test, part)) {
        try {
            const upstream = await fetch(url, {
                headers: { ...BROWSER_HEADERS, 'Referer': referer },
                signal: AbortSignal.timeout(15000),
            });

            if (upstream.ok && upstream.body) {
                const ct = upstream.headers.get('content-type') || '';
                // Only forward if it's actually audio (not bot-check HTML)
                if (!ct.startsWith('audio/') && !ct.includes('mpeg') && !ct.includes('octet-stream')) {
                    continue;
                }
                const cl = upstream.headers.get('content-length');
                const responseHeaders: Record<string, string> = {
                    'Content-Type': 'audio/mpeg',
                    'Cache-Control': 'public, max-age=86400',
                    'Accept-Ranges': 'bytes',
                };
                if (cl) responseHeaders['Content-Length'] = cl;
                return new Response(upstream.body, { status: 200, headers: responseHeaders });
            }
        } catch {
            // try next
        }
    }

    return NextResponse.json(
        { error: `Audio not found: Cam${camNum} Test ${test} Part ${part}` },
        { status: 404 },
    );
}
