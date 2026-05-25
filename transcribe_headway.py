"""
Transcribe all Headway 4B audio files using OpenAI Whisper (local, no API needed).
Model: base.en (fast, English-only, good accuracy)
"""
import whisper
import json
import os
import glob

# Patch whisper to use bundled ffmpeg (Windows PATH workaround)
import imageio_ffmpeg
import whisper.audio as _wa
import numpy as np
from subprocess import run as _run

_ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
print(f"Using ffmpeg: {_ffmpeg_exe}")

def _patched_load_audio(file, sr=16000):
    cmd = [_ffmpeg_exe, '-nostdin', '-threads', '0', '-i', file,
           '-f', 's16le', '-ac', '1', '-acodec', 'pcm_s16le', '-ar', str(sr), '-']
    out = _run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(out, np.int16).flatten().astype(np.float32) / 32768.0

_wa.load_audio = _patched_load_audio

AUDIO_DIR = "public/audio/headway4B"
OUT_FILE = "data/headway-transcripts.json"

print("Loading Whisper base.en model...")
model = whisper.load_model("base.en")
print("Model loaded.")

# Load existing transcripts (resume if interrupted)
existing = {}
if os.path.exists(OUT_FILE):
    with open(OUT_FILE, "r", encoding="utf-8") as f:
        try:
            existing = json.load(f)
        except:
            existing = {}

print(f"Existing transcripts: {len(existing)}")

# Get all mp3 files sorted by unit.track
mp3_files = sorted(
    glob.glob(f"{AUDIO_DIR}/*.mp3"),
    key=lambda x: tuple(float(p) for p in os.path.basename(x).replace('.mp3','').split('.'))
)

print(f"Total audio files: {len(mp3_files)}")
print("Starting transcription...\n")

done = 0
for mp3_path in mp3_files:
    filename = os.path.basename(mp3_path)
    track_key = filename.replace('.mp3', '')  # e.g. "1.1"

    if track_key in existing:
        print(f"  SKIP {track_key} (already done)")
        continue

    print(f"  Transcribing {track_key}...", end=" ", flush=True)
    try:
        result = model.transcribe(mp3_path, language="en", fp16=False)
        text = result["text"].strip()
        if text:
            existing[track_key] = {"text": text}
            print(f"✓ ({len(text)} chars)")
        else:
            print("(empty - skipped)")
        done += 1

        # Save every 10 files
        if done % 10 == 0:
            with open(OUT_FILE, "w", encoding="utf-8") as f:
                json.dump(existing, f, ensure_ascii=False, indent=2)
            print(f"  → Saved checkpoint ({len(existing)} tracks)")

    except Exception as e:
        print(f"ERROR: {e}")

# Final save
with open(OUT_FILE, "w", encoding="utf-8") as f:
    json.dump(existing, f, ensure_ascii=False, indent=2)

print(f"\nDone! Total transcribed: {len(existing)} tracks")
print("Saved to:", OUT_FILE)

# Sample
print("\nSample:")
for k in list(existing.keys())[:3]:
    print(f"  {k}: {existing[k]['text'][:100]}")
