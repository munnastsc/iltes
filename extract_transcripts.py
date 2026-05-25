"""
Extract Headway Beginner tapescripts from PDF using Gemini REST API.
Renders each PDF page as image, sends to Gemini.
"""
import fitz
import json, base64, time, urllib.request, urllib.error

API_KEY = "AIzaSyDTcpeF4oIxpRapSWEfv-UxwcCU9U4Q9K8"
PDF_PATH = r"public/audio/headway4B/090- New Headway. Beginner. Student's book. 4th Ed_2013 -143p.pdf"

def gemini_request(prompt_parts):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}"
    body = json.dumps({"contents": [{"parts": prompt_parts}]}).encode()
    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            data = json.loads(r.read())
            return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        return f"ERROR: {e}"

def page_to_b64(page):
    mat = fitz.Matrix(1.5, 1.5)
    pix = page.get_pixmap(matrix=mat)
    return base64.b64encode(pix.tobytes("png")).decode()

doc = fitz.open(PDF_PATH)
total = len(doc)
print(f"Total pages: {total}")

# Scan pages 95-145 for tapescripts
print("Scanning pages 95+ for tapescripts...")
all_text = ""

for page_num in range(94, total):
    img_b64 = page_to_b64(doc[page_num])
    text = gemini_request([
        {"inline_data": {"mime_type": "image/png", "data": img_b64}},
        {"text": (
            "This is page " + str(page_num+1) + " from New Headway Beginner 4th Edition. "
            "If this page contains audio tapescripts/listening scripts, extract ALL text exactly. "
            "Include track numbers (1.1, 1.2, etc.) and all dialogue. "
            "Format each track as: TRACK X.Y\n[text]\n\n"
            "If NO tapescripts on this page, reply exactly: SKIP"
        )}
    ])
    if text.strip() != "SKIP" and "ERROR" not in text:
        all_text += f"\n\n=== PAGE {page_num+1} ===\n{text}"
        print(f"  Page {page_num+1}: {len(text)} chars extracted")
    else:
        print(f"  Page {page_num+1}: {text[:30]}")
    time.sleep(5)

print(f"\nDone. Total chars: {len(all_text)}")

with open("headway_raw_transcripts.txt", "w", encoding="utf-8") as f:
    f.write(all_text)

print("Saved to headway_raw_transcripts.txt")
print("\n=== PREVIEW ===")
print(all_text[:3000])
