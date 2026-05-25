"""Clean whisper-generated transcripts: remove tapescript prefixes."""
import json, re

with open("data/headway-transcripts.json", encoding="utf-8") as f:
    data = json.load(f)

def clean(text):
    # Remove all tapescript/tabescript/tabscript variants with optional number
    text = re.sub(r'(?i)tab?\w*\s*s?cript\s*[\d.]*\s*', '', text)
    # Remove "Unit X." prefix
    text = re.sub(r'(?i)unit\s+\d+\.\s*', '', text)
    # Collapse multiple spaces
    text = re.sub(r'\s+', ' ', text).strip()
    return text

cleaned = {}
for key, val in data.items():
    c = clean(val["text"])
    if c:
        cleaned[key] = {"text": c}

with open("data/headway-transcripts.json", "w", encoding="utf-8") as f:
    json.dump(cleaned, f, ensure_ascii=False, indent=2)

print(f"Cleaned {len(cleaned)} tracks")
for k in list(cleaned.keys())[:5]:
    print(f"  {k}: {cleaned[k]['text'][:80]}")
