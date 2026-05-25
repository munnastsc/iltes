/**
 * Upload all audio files from public/audio/ to S3-compatible storage
 *
 * Supported providers:
 *   PROVIDER=b2    → Backblaze B2 (default, free 10GB, no credit card)
 *   PROVIDER=r2    → Cloudflare R2 (needs credit card on file)
 *
 * Setup:
 *   1. Copy .env.example → .env.upload and fill in credentials
 *   2. npm run upload-audio
 */

import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { readdir, readFile, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUDIO_DIR = path.join(__dirname, '..', 'public', 'audio');

// ── Credentials from environment ──────────────────────────────────────────────
const ACCOUNT_ID     = process.env.R2_ACCOUNT_ID;       // R2 only
const ACCESS_KEY_ID  = process.env.R2_ACCESS_KEY_ID;
const SECRET_KEY     = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET         = process.env.R2_BUCKET_NAME || 'iltes-audio';
const B2_REGION      = process.env.B2_REGION || 'us-west-004'; // from B2 bucket settings

if (!ACCESS_KEY_ID || !SECRET_KEY) {
    console.error(`
❌  Missing credentials!

Set these environment variables before running:
  R2_ACCESS_KEY_ID     = your Access Key ID
  R2_SECRET_ACCESS_KEY = your Secret Key
  R2_BUCKET_NAME       = iltes-audio  (or your bucket name)

For Backblaze B2 also set:
  B2_REGION            = us-west-004  (check your bucket page for exact region)

Example (Windows PowerShell):
  $env:R2_ACCESS_KEY_ID="key_id"
  $env:R2_SECRET_ACCESS_KEY="secret"
  $env:B2_REGION="us-west-004"
  npm run upload-audio
`);
    process.exit(1);
}

const PROVIDER = process.env.PROVIDER || 'b2';

let endpoint;
if (PROVIDER === 'b2') {
    endpoint = `https://s3.${B2_REGION}.backblazeb2.com`;
} else if (PROVIDER === 'r2') {
    if (!ACCOUNT_ID) { console.error('❌ R2_ACCOUNT_ID required for R2 provider'); process.exit(1); }
    endpoint = `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`;
} else {
    console.error(`❌ Unknown PROVIDER="${PROVIDER}". Use b2 or r2.`);
    process.exit(1);
}

const client = new S3Client({
    region: PROVIDER === 'b2' ? B2_REGION : 'auto',
    endpoint,
    credentials: { accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_KEY },
    forcePathStyle: PROVIDER === 'b2',
});

// ── Collect all mp3 files ──────────────────────────────────────────────────────
async function collectFiles(dir, prefix = '') {
    const files = [];
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const key = prefix ? `${prefix}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
            if (entry.name === '_needs-review') continue;
            const sub = await collectFiles(fullPath, key);
            files.push(...sub);
        } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.mp3')) {
            files.push({ fullPath, key });
        }
    }
    return files;
}

// ── Check if file already uploaded (skip if same size) ────────────────────────
async function alreadyUploaded(key, localSize) {
    try {
        const res = await client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
        return res.ContentLength === localSize;
    } catch {
        return false;
    }
}

// ── Upload one file ────────────────────────────────────────────────────────────
async function uploadFile(fullPath, key) {
    const body = await readFile(fullPath);
    await client.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: body,
        ContentType: 'audio/mpeg',
        CacheControl: 'public, max-age=31536000',
    }));
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
    console.log(`\n🎵 ILTES Audio Upload → ${PROVIDER === 'b2' ? 'Backblaze B2' : 'Cloudflare R2'}`);
    console.log(`   Endpoint: ${endpoint}`);
    console.log(`   Bucket:   ${BUCKET}`);
    console.log(`   Source:   ${AUDIO_DIR}\n`);

    const files = await collectFiles(AUDIO_DIR);
    console.log(`   Found ${files.length} MP3 files\n`);

    let done = 0, skipped = 0, failed = 0;
    const CONCURRENCY = 8;

    for (let i = 0; i < files.length; i += CONCURRENCY) {
        const batch = files.slice(i, i + CONCURRENCY);
        await Promise.all(batch.map(async ({ fullPath, key }) => {
            try {
                const { size } = await stat(fullPath);
                if (await alreadyUploaded(key, size)) {
                    skipped++;
                    process.stdout.write(`\r   ⏭  ${done + skipped + failed}/${files.length} | ✅ ${done} uploaded | ⏭ ${skipped} skipped | ❌ ${failed} failed`);
                    return;
                }
                await uploadFile(fullPath, key);
                done++;
                process.stdout.write(`\r   ⬆  ${done + skipped + failed}/${files.length} | ✅ ${done} uploaded | ⏭ ${skipped} skipped | ❌ ${failed} failed`);
            } catch (err) {
                failed++;
                console.error(`\n   ❌ Failed: ${key} — ${err.message}`);
            }
        }));
    }

    console.log(`\n\n✅ Upload complete!`);
    console.log(`   Uploaded: ${done} | Skipped: ${skipped} | Failed: ${failed}`);

    if (PROVIDER === 'b2') {
        console.log(`\n📋 Next steps:`);
        console.log(`   1. B2 bucket must be set to "Public" (Bucket Settings → Privacy)`);
        console.log(`   2. Your public URL: https://${BUCKET}.s3.${B2_REGION}.backblazeb2.com`);
        console.log(`   3. Set in Railway env vars:`);
        console.log(`      NEXT_PUBLIC_AUDIO_CDN_URL = https://${BUCKET}.s3.${B2_REGION}.backblazeb2.com`);
        console.log(`\n   Audio URL example: https://${BUCKET}.s3.${B2_REGION}.backblazeb2.com/cam9-test1-part1.mp3`);
    }
}

main().catch(e => {
    console.error('\n❌ Fatal error:', e.message);
    process.exit(1);
});
