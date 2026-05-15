import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const cam = Number(formData.get('cam'));
        const test = Number(formData.get('test'));
        const part = Number(formData.get('part'));

        if (!file || !cam || !test || !part) {
            return NextResponse.json({ error: 'file, cam, test, part required' }, { status: 400 });
        }

        if (!file.type.startsWith('audio/') && !file.name.toLowerCase().endsWith('.mp3')) {
            return NextResponse.json({ error: 'Must be an MP3 audio file' }, { status: 400 });
        }

        if (cam < 1 || cam > 20 || test < 1 || test > 4 || part < 1 || part > 4) {
            return NextResponse.json({ error: 'cam 1-20, test 1-4, part 1-4' }, { status: 400 });
        }

        const fileName = `cam${cam}-test${test}-part${part}.mp3`;
        const audioDir = path.join(process.cwd(), 'public', 'audio');
        await mkdir(audioDir, { recursive: true });

        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(path.join(audioDir, fileName), buffer);

        return NextResponse.json({ ok: true, fileName });
    } catch {
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
