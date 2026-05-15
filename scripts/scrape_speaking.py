import requests, json, time, re, sys, io
from bs4 import BeautifulSoup

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')


def scrape_speaking(book, test):
    url = f'https://engnovate.com/ielts-speaking-tests/cambridge-ielts-{book}-academic-speaking-test-{test}/'
    try:
        r = requests.get(url, timeout=20, headers={'User-Agent': 'Mozilla/5.0'})
        if r.status_code == 404:
            return None
        soup = BeautifulSoup(r.content, 'html.parser')

        question_divs = soup.find_all('div', class_='ielts-speaking-question')
        if not question_divs:
            return None

        questions = []
        for div in question_divs:
            txt = div.get_text('\n', strip=True)
            # Remove score/accuracy noise
            txt = re.sub(r'\d+%\s*Accuracy.*', '', txt, flags=re.DOTALL)
            txt = re.sub(r'Polished transcript.*', '', txt, flags=re.DOTALL)
            txt = re.sub(r'Male\s*Female.*', '', txt, flags=re.DOTALL)
            # Extract question number and text
            m = re.match(r'Question\s*(\d+):\s*(.+)', txt.strip(), re.DOTALL)
            if m:
                q_num = int(m.group(1))
                q_text = m.group(2).strip()
                questions.append({'number': q_num, 'text': q_text})

        # Detect parts from page
        parts_qs = {}
        count_divs = soup.find_all('div', class_='ielts-speaking-part-question-count')
        p_num = 1
        q_offset = 1
        for cd in count_divs:
            txt = cd.get_text(strip=True)
            m = re.search(r'(\d+)-(\d+)', txt)
            if m:
                start, end = int(m.group(1)), int(m.group(2))
                parts_qs[p_num] = (start, end)
            p_num += 1

        return {
            'book': book, 'test': test,
            'questions': questions,
            'parts_qs': parts_qs
        }
    except Exception as e:
        return {'book': book, 'test': test, 'error': str(e)}


print('Scraping Speaking tests books 10-20...')
all_data = {}
for book in range(10, 21):
    for test in range(1, 5):
        print(f'  Book {book} Test {test}...', end=' ', flush=True)
        result = scrape_speaking(book, test)
        if result and 'questions' in result and result['questions']:
            all_data[f'{book}_{test}'] = result
            print(f'OK ({len(result["questions"])} questions)')
        elif result and 'error' in result:
            print(f'ERR: {result["error"][:60]}')
        else:
            print('SKIP')
        time.sleep(0.4)

print(f'\nScraped: {len(all_data)}/44')

# Update local-store.json
store = json.load(open('E:/antigravity/ILTES/data/local-store.json', encoding='utf-8'))
books_list = store['books']
idx = {(b.get('bookNumber'), b.get('testNumber'), b.get('module')): i for i, b in enumerate(books_list)}

updated = 0
for key_str, data in all_data.items():
    book, test = data['book'], data['test']
    questions = data['questions']
    parts_qs = data['parts_qs']

    store_key = (book, test, 'Speaking')
    if store_key not in idx:
        print(f'MISSING: Book {book} Test {test} Speaking')
        continue

    i = idx[store_key]
    content = books_list[i]['content']
    parts = content.get('parts', [])

    # Map questions to parts
    part_titles = ['Part 1: Interview', 'Part 2: Individual Long Turn', 'Part 3: Discussion']
    part_ranges = list(parts_qs.values())

    new_parts = []
    for p_idx, part in enumerate(parts):
        if p_idx < len(part_ranges):
            start, end = part_ranges[p_idx]
            part_qs = [q for q in questions if start <= q['number'] <= end]
        else:
            part_qs = []

        formatted_qs = []
        for q in part_qs:
            qt = q['text']
            # Part 2 is a cue card - treat as a single question
            qtype = 'fill_in_blank'  # speaking uses text input
            formatted_qs.append({
                'number': q['number'],
                'type': qtype,
                'prompt': qt,
                'answer': '',
                'answerLine': ''
            })

        new_part = dict(part)
        new_part['title'] = part_titles[p_idx] if p_idx < len(part_titles) else part.get('title', f'Part {p_idx + 1}')
        if p_idx == 1 and part_qs:
            # Part 2 cue card - full text
            new_part['text'] = part_qs[0]['text'] if part_qs else part.get('text', '')
        new_part['questions'] = formatted_qs
        new_parts.append(new_part)

    content['parts'] = new_parts
    content['sourceStatus'] = 'complete_real'
    content['note'] = f'Real Cambridge {book} Test {test} Speaking questions from engnovate.com'
    books_list[i]['content'] = content
    updated += 1

store['books'] = books_list
json.dump(store, open('E:/antigravity/ILTES/data/local-store.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print(f'Updated: {updated} Speaking entries in local-store.json')

# Verify
b20t1 = [b for b in books_list if b.get('bookNumber') == 20 and b.get('testNumber') == 1 and b.get('module') == 'Speaking']
if b20t1:
    parts = b20t1[0]['content']['parts']
    print('\nVerify Book 20 Test 1 Speaking:')
    for p in parts:
        print(f'  {p.get("title")}:')
        for q in p.get('questions', [])[:2]:
            print(f'    Q{q["number"]}: {q["prompt"][:100]}')
