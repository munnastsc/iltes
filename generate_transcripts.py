"""
Generate Headway Beginner tapescripts using Gemini's training knowledge.
New Headway Beginner is a well-known published textbook.
"""
import json, time, urllib.request, urllib.error

API_KEY = "AIzaSyDTcpeF4oIxpRapSWEfv-UxwcCU9U4Q9K8"

UNITS = [
    (1, "Hello everybody!", 14),
    (2, "Your world", 15),
    (3, "All about you", 11),
    (4, "Family and friends", 17),
    (5, "The way I live", 17),
    (6, "Every day", 16),
    (7, "Places I like", 10),
    (8, "The world of work", 12),
    (9, "Times past", 18),
    (10, "What happened?", 11),
    (11, "The best in the world!", 11),
    (12, "Thank you very much!", 10),
    (13, "Here and now", 12),
    (14, "It's time to go!", 9),
]

def gemini(prompt):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}"
    body = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"maxOutputTokens": 4096, "temperature": 0.1}
    }).encode()
    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            data = json.loads(r.read())
            return data["candidates"][0]["content"]["parts"][0]["text"]
    except urllib.error.HTTPError as e:
        return f"ERROR:{e.code}"
    except Exception as e:
        return f"ERROR:{e}"

all_transcripts = {}

for unit_num, unit_title, track_count in UNITS:
    print(f"\n=== Unit {unit_num}: {unit_title} ({track_count} tracks) ===")

    prompt = f"""New Headway Beginner Student's Book 4th Edition (Oxford University Press).

Unit {unit_num}: "{unit_title}" has {track_count} CD tracks numbered {unit_num}.1 through {unit_num}.{track_count}.

Please provide the tapescripts for ALL {track_count} tracks in Unit {unit_num}.

Format EXACTLY as:
TRACK {unit_num}.1
[transcript]

TRACK {unit_num}.2
[transcript]

(continue for all {track_count} tracks)

Include all dialogue, exercise instructions, and spoken text exactly as they appear in the book.
For each track, write the complete spoken content. This is for educational purposes."""

    result = gemini(prompt)
    if result.startswith("ERROR"):
        print(f"  Error: {result}. Retrying in 10s...")
        time.sleep(10)
        result = gemini(prompt)

    if not result.startswith("ERROR"):
        # Parse tracks from result
        lines = result.split('\n')
        current_track = None
        current_lines = []

        for line in lines:
            stripped = line.strip()
            # Detect track header
            if stripped.upper().startswith(f'TRACK {unit_num}.') or stripped.startswith(f'{unit_num}.'):
                # Save previous track
                if current_track and current_lines:
                    text = '\n'.join(current_lines).strip()
                    if text:
                        all_transcripts[current_track] = {"text": text}
                        print(f"  ✓ {current_track}: {len(text)} chars")

                # Start new track
                parts = stripped.split()
                for p in parts:
                    if '.' in p and p.replace('.', '').isdigit():
                        current_track = p.strip('.,')
                        break
                current_lines = []
            elif current_track and stripped:
                current_lines.append(stripped)

        # Save last track
        if current_track and current_lines:
            text = '\n'.join(current_lines).strip()
            if text:
                all_transcripts[current_track] = {"text": text}
                print(f"  ✓ {current_track}: {len(text)} chars")
    else:
        print(f"  Failed unit {unit_num}: {result}")

    time.sleep(5)  # Rate limit

print(f"\n\nTotal tracks extracted: {len(all_transcripts)}")

# Save
with open("data/headway-transcripts.json", "w", encoding="utf-8") as f:
    json.dump(all_transcripts, f, ensure_ascii=False, indent=2)

print("Saved to data/headway-transcripts.json")
print("\nSample tracks:")
for k in list(all_transcripts.keys())[:5]:
    print(f"  {k}: {all_transcripts[k]['text'][:100]}...")
