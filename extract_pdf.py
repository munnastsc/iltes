import fitz
import json, re, sys

pdf_path = r"public/audio/headway4B/090- New Headway. Beginner. Student's book. 4th Ed_2013 -143p.pdf"
doc = fitz.open(pdf_path)

print(f"Total pages: {len(doc)}")

all_text = ""
for i, page in enumerate(doc):
    text = page.get_text()
    all_text += f"\n===PAGE {i+1}===\n" + text

with open("headway_extracted.txt", "w", encoding="utf-8") as f:
    f.write(all_text)

print(f"Saved. Total chars: {len(all_text)}")

# Find tapescript
lower = all_text.lower()
idx = lower.find("tapescript")
if idx >= 0:
    print(f"\nTAPESCRIPT FOUND at char {idx}")
    print(all_text[idx:idx+4000])
else:
    # Show pages 100-143 (likely back of book)
    print("\nNo 'tapescript' keyword. Showing pages 100+:")
    for i, page in enumerate(doc):
        if i >= 99:
            text = page.get_text()
            if text.strip():
                print(f"\n--- PAGE {i+1} ---")
                print(text[:500])
