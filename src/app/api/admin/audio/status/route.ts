import { NextResponse } from 'next/server';
import { access } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

export async function GET() {
    const audioDir = path.join(process.cwd(), 'public', 'audio');
    const existing: string[] = [];

    for (let cam = 1; cam <= 20; cam++) {
        for (let test = 1; test <= 4; test++) {
            for (let part = 1; part <= 4; part++) {
                const fileName = `cam${cam}-test${test}-part${part}.mp3`;
                try {
                    await access(path.join(audioDir, fileName));
                    existing.push(fileName);
                } catch {
                    // file not present
                }
            }
        }
    }

    return NextResponse.json({ existing, total: 320, present: existing.length });
}
