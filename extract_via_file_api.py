"""
Upload PDF to Gemini File API, then extract tapescripts in one request.
"""
import json, time, urllib.request, urllib.error, urllib.parse

API_KEY = "AIzaSyDTcpeF4oIxpRapSWEfv-UxwcCU9U4Q9K8"
PDF_PATH = r"public/audio/headway4B/090- New Headway. Beginner. Student's book. 4th Ed_2013 -143p.pdf"

# Step 1: Upload file to Gemini File API
print("Uploading PDF to Gemini File API...")
with open(PDF_PATH, 'rb') as f:
    pdf_bytes = f.read()

upload_url = f"https://generativelanguage.googleapis.com/upload/v1beta/files?uploadType=media&key={API_KEY}"
upload_req = urllib.request.Request(
    upload_url,
    data=pdf_bytes,
    headers={
        "Content-Type": "application/pdf",
        "X-Goog-Upload-Command": "upload, finalize",
        "X-Goog-Upload-Header-Content-Length": str(len(pdf_bytes)),
    }
)

try:
    with urllib.request.urlopen(upload_req, timeout=60) as r:
        upload_data = json.loads(r.read())
        file_uri = upload_data.get("file", {}).get("uri") or upload_data.get("uri")
        print(f"Upload success. File URI: {file_uri}")
except urllib.error.HTTPError as e:
    print(f"Upload failed: {e.code} {e.read()[:200]}")
    exit(1)

# Wait for file to be processed
print("Waiting for file processing...")
time.sleep(3)

# Step 2: Ask Gemini to extract tapescripts
print("Extracting tapescripts...")

body = {
    "contents": [{
        "parts": [
            {
                "file_data": {
                    "mime_type": "application/pdf",
                    "file_uri": file_uri
                }
            },
            {
                "text": (
                    "This is New Headway Beginner 4th Edition student book. "
                    "Please extract ALL audio tapescripts/listening scripts from this book "
                    "(usually found at the back, pages 100+). "
                    "\n\nFor each track, format as:\n"
                    "TRACK X.Y\n"
                    "[full transcript text]\n\n"
                    "Include ALL spoken dialogue and text. "
                    "Track numbers follow the format: unit.track (e.g., 1.1, 1.2, 2.1 etc). "
                    "Extract everything, do not summarize."
                )
            }
        ]
    }],
    "generationConfig": {"maxOutputTokens": 8192}
}

extract_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}"
req = urllib.request.Request(
    extract_url,
    data=json.dumps(body).encode(),
    headers={"Content-Type": "application/json"}
)

try:
    with urllib.request.urlopen(req, timeout=120) as r:
        result = json.loads(r.read())
        text = result["candidates"][0]["content"]["parts"][0]["text"]
        print(f"\nExtracted {len(text)} chars")
        with open("headway_raw_transcripts.txt", "w", encoding="utf-8") as f:
            f.write(text)
        print("Saved to headway_raw_transcripts.txt")
        print("\n=== PREVIEW (first 3000 chars) ===")
        print(text[:3000])
except urllib.error.HTTPError as e:
    err = e.read()
    print(f"Extract failed: {e.code} {err[:500]}")
except Exception as e:
    print(f"Error: {e}")
