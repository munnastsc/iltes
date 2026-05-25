/**
 * Upload Headway 4B + Oxford audio files to Cloudflare R2
 *
 * Setup:
 *   npm install @aws-sdk/client-s3 mime-types
 *
 * Env vars needed (set in terminal before running):
 *   R2_ACCOUNT_ID=your_account_id
 *   R2_ACCESS_KEY_ID=your_access_key
 *   R2_SECRET_ACCESS_KEY=your_secret_key
 *   R2_BUCKET_NAME=iltes-audio
 *
 * Run:
 *   node scripts/upload-to-r2.mjs
 */

import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { readdir, readFile, stat } from 'fs/promises';
import { join, relative, extname } from 'path';

const ACCOUNT_ID    = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY    = process.env.R2_ACCESS_KEY_ID;
const SECRET_KEY    = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET        = process.env.R2_BUCKET_NAME || 'iltes-audio';

if (!ACCOUNT_ID || !ACCESS_KEY || !SECRET_KEY) {
    console.error('❌  R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY required.');
    process.exit(1);
}

const client = new S3Client({
    region: 'auto',
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
});

const PUBLIC_DIR = join(process.cwd(), 'public', 'audio');

// Folders to upload
const FOLDERS = ['headway4B', 'Oxford_Audios'];

async function getAllFiles(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = [];
    for (const e of entries) {
        const full = join(dir, e.name);
        if (e.isDirectory()) {
            files.push(...await getAllFiles(full));
        } else if (e.isFile() && extname(e.name) === '.mp3') {
            files.push(full);
        }
    }
    return files;
}

async function exists(key) {
    try {
        await client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
        return true;
    } catch {
        return false;
    }
}

async function upload(filePath, key) {
    const body = await readFile(filePath);
    await client.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: body,
        ContentType: 'audio/mpeg',
        CacheControl: 'public, max-age=31536000',
    }));
}

async function main() {
    let total = 0, uploaded = 0, skipped = 0, failed = 0;

    for (const folder of FOLDERS) {
        const folderPath = join(PUBLIC_DIR, folder);
        let files;
        try {
            files = await getAllFiles(folderPath);
        } catch {
            console.log(`⚠️  Folder not found: public/audio/${folder} — skipping`);
            continue;
        }
        total += files.length;
        console.log(`\n📁 ${folder} — ${files.length} files`);

        for (const file of files) {
            const relPath = relative(PUBLIC_DIR, file).replace(/\\/g, '/');
            const key = relPath; // e.g. headway4B/1.1.mp3

            try {
                const alreadyUploaded = await exists(key);
                if (alreadyUploaded) {
                    process.stdout.write('.');
                    skipped++;
                    continue;
                }
                await upload(file, key);
                process.stdout.write('+');
                uploaded++;
            } catch (err) {
                process.stdout.write('x');
                console.error(`\n  ❌ Failed: ${key} — ${err.message}`);
                failed++;
            }

            // Small delay to avoid rate limits
            if ((uploaded + skipped) % 50 === 0) await new Promise(r => setTimeout(r, 200));
        }
    }

    console.log(`\n\n✅ Done! Uploaded: ${uploaded}, Skipped: ${skipped}, Failed: ${failed} / Total: ${total}`);
    if (uploaded > 0 || skipped > 0) {
        console.log(`\n🌐 Set this in Vercel env vars:`);
        console.log(`   NEXT_PUBLIC_AUDIO_CDN_URL = https://${BUCKET}.${ACCOUNT_ID}.r2.cloudflarestorage.com`);
        console.log(`\n   (Or use a custom domain / R2 public URL if you enabled public access)`);
    }
}

main().catch(err => { console.error(err); process.exit(1); });
