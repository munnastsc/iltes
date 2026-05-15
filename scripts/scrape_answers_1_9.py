"""
Scrape real Cambridge IELTS 1-9 Listening and Reading answers from ieltsprogress.com.
- Listening: Q/A tables (books 5-9) or numbered list (books 1-4)
- Reading: numbered list per test from combined answer pages
Updates local-store.json with real answers, keeping AI-generated prompts.
"""
import requests, json, time, re, sys, io
from bs4 import BeautifulSoup

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE = 'https://ieltsprogress.com/'

LISTEN_URLS = {
    (1,1): 'cambridge-ielts-1-listening-1-ans-pdf-transcript/',
    (1,2): 'cambridge-ielts-1-listening-2-ans-pdf-transcript/',
    (1,3): 'cambridge-ielts-1-listening-test-3-answerspdftranscript/',
    (1,4): 'cambridge-ielts-1-listening-test-4-answers-pdf-transcript/',
    (2,1): 'cambridge-ielts-2-listening-test-1-ans-pdf-transcript/',
    (2,2): 'cambridge-ielts-2-listening-test-2-answers-pdf-transcript/',
    (2,3): 'cambridge-ielts-2-listening-test-3-ans-pdf-audio/',
    (2,4): 'cambridge-ielts-2-listening-test-4-ans-pdf-audio/',
    (3,1): 'cambridge-ielts-3-listening-test-1-answers/',
    (3,2): 'cambridge-ielts-3-listening-test-2-answers/',
    (3,3): 'cambridge-ielts-3-listening-test-3-answers/',
    (3,4): 'cambridge-ielts-3-listening-test-4-answers/',
    (4,1): 'cambridge-ielts-4-listening-test-1-answers/',
    (4,2): 'cambridge-ielts-4-listening-test-2-answers/',
    (4,3): 'cambridge-ielts-4-listening-test-3-answers/',
    (4,4): 'cambridge-4-listening-test-4-answers-pdf/',
}
for b in range(5, 10):
    for t in range(1, 5):
        LISTEN_URLS[(b, t)] = f'cambridge-{b}-listening-test-{t}-answers/'

READ_URLS = {}
for b in range(1, 10):
    READ_URLS[b] = f'cambridge-{b}-reading-test-1-2-3-4-answers/'
# Books 1-4 may have different URL pattern
READ_URLS_ALT = {
    1: 'cambridge-1-reading-test-1-2-3-4-answers/',
    2: 'cambridge-2-reading-test-1-2-3-4-answers/',
    3: 'cambridge-3-reading-test-1-2-3-4-answers/',
    4: 'cambridge-4-reading-test-1-2-3-4-answers/',
}


def get_page_lines(url):
    """Fetch page and return cleaned text lines."""
    r = requests.get(url, timeout=15, headers={'User-Agent': 'Mozilla/5.0'})
    soup = BeautifulSoup(r.content, 'html.parser')
    content = soup.find('div', class_='entry-content') or soup.find('article')
    if not content:
        return []
    text = content.get_text('\n', strip=True)
    return [l.strip() for l in text.split('\n') if l.strip()]


def parse_qa_tables(url):
    """Parse Q/A tables format (books 5-9)."""
    r = requests.get(url, timeout=15, headers={'User-Agent': 'Mozilla/5.0'})
    soup = BeautifulSoup(r.content, 'html.parser')
    content = soup.find('div', class_='entry-content') or soup.find('article')
    if not content:
        return {}
    answers = {}
    for t in content.find_all('table'):
        rows = t.find_all('tr')
        for row in rows:
            cells = [td.get_text(strip=True) for td in row.find_all(['td', 'th'])]
            if len(cells) == 2 and cells[0].isdigit():
                q_num = int(cells[0])
                if 1 <= q_num <= 40:
                    answers[q_num] = cells[1]
    return answers


def parse_numbered_list(lines):
    """Parse numbered answers like '1. A', '2. city centre', etc."""
    answers = {}
    for line in lines:
        m = re.match(r'^(\d{1,2})\.\s+(.+)$', line)
        if m:
            q_num = int(m.group(1))
            val = m.group(2).strip()
            if 1 <= q_num <= 40:
                answers[q_num] = val
    return answers


def parse_checkout_list(lines):
    """Parse unnumbered answer list after 'Checkout' marker (book 4)."""
    answers = {}
    in_answers = False
    ans_list = []
    for line in lines:
        if 'checkout your listening' in line.lower():
            in_answers = True
            continue
        if in_answers:
            # Stop at Cambridge/PDF/download lines
            if any(x in line.lower() for x in ['cambridge', 'pdf', 'download', 'transcript', 'listening test']):
                break
            if line:
                ans_list.append(line)
    # Map to Q1-Q40
    for i, val in enumerate(ans_list[:40], 1):
        answers[i] = val
    return answers


def scrape_listening_answers(book, test):
    """Get answers for a listening test."""
    key = (book, test)
    url = BASE + LISTEN_URLS.get(key, f'cambridge-{book}-listening-test-{test}-answers/')

    # Books 5-9: Q/A tables
    if book >= 5:
        answers = parse_qa_tables(url)
        if answers:
            return answers

    # Books 1-4: Try numbered list
    lines = get_page_lines(url)
    answers = parse_numbered_list(lines)
    if len(answers) >= 35:
        return answers

    # Fallback: checkout list (book 4 style)
    answers = parse_checkout_list(lines)
    if answers:
        return answers

    return {}


def scrape_reading_answers(book):
    """Get answers for all 4 reading tests in a book. Returns {test: {q_num: answer}}."""
    url = BASE + READ_URLS_ALT.get(book, READ_URLS[book])
    lines = get_page_lines(url)

    # Split by test sections
    tests = {}
    current_test = None
    current_answers = {}

    for line in lines:
        # Detect test section header
        m_header = re.search(r'reading test (\d) answers', line.lower())
        if m_header:
            if current_test and current_answers:
                tests[current_test] = current_answers
            current_test = int(m_header.group(1))
            current_answers = {}
            continue

        if current_test is None:
            continue

        # Parse numbered answer
        m = re.match(r'^(\d{1,2})\.\s*(.+)$', line)
        if m:
            q_num = int(m.group(1))
            val = m.group(2).strip()
            if 1 <= q_num <= 40:
                current_answers[q_num] = val

    if current_test and current_answers:
        tests[current_test] = current_answers

    return tests


def detect_type(ans, existing_type=None):
    a = ans.strip().split('/')[0].strip().upper()
    if a in ('TRUE', 'FALSE', 'NOT GIVEN', 'YES', 'NO'):
        return 'true_false'
    # Paragraph/section matching: roman numerals or lowercase letters
    if re.match(r'^[ivxIVX]+$', a) or re.match(r'^[viii]+$', a.lower()):
        return 'matching'
    # Single letter MCQ
    if len(a) == 1 and a.isalpha() and a in 'ABCDEFG':
        return existing_type or 'matching'
    return 'fill_in_blank'


# ===== MAIN =====

print('Scraping Listening answers for books 1-9...')
listen_data = {}
for book in range(1, 10):
    for test in range(1, 5):
        print(f'  Book {book} Test {test}...', end=' ', flush=True)
        try:
            answers = scrape_listening_answers(book, test)
            if len(answers) >= 30:
                listen_data[(book, test)] = answers
                print(f'OK ({len(answers)} answers)')
            else:
                print(f'PARTIAL ({len(answers)} answers)')
                if answers:
                    listen_data[(book, test)] = answers
        except Exception as e:
            print(f'ERR: {e}')
        time.sleep(0.4)

print(f'\nListening: {len(listen_data)}/36 scraped')

print('\nScraping Reading answers for books 1-9...')
read_data = {}
for book in range(1, 10):
    print(f'  Book {book}...', end=' ', flush=True)
    try:
        tests = scrape_reading_answers(book)
        if tests:
            read_data[book] = tests
            counts = {t: len(a) for t, a in tests.items()}
            print(f'OK tests={list(counts.keys())} q_counts={list(counts.values())}')
        else:
            print('NO DATA')
    except Exception as e:
        print(f'ERR: {e}')
    time.sleep(0.5)

print(f'\nReading: {len(read_data)}/9 books scraped')

# ===== UPDATE LOCAL STORE =====

store = json.load(open('E:/antigravity/ILTES/data/local-store.json', encoding='utf-8'))
books_list = store['books']
idx = {(b.get('bookNumber'), b.get('testNumber'), b.get('module')): i for i, b in enumerate(books_list)}

listen_updated = 0
read_updated = 0

# Update Listening
for (book, test), answers in listen_data.items():
    key = (book, test, 'Listening')
    if key not in idx:
        print(f'MISSING: Book {book} Test {test} Listening')
        continue

    i = idx[key]
    content = books_list[i]['content']
    parts = content.get('parts', [])

    # Map questions across parts to answers
    q_global = 1
    for part in parts:
        qs = part.get('questions', [])
        for q in qs:
            q_num = q.get('number', q_global)
            if q_num in answers:
                raw_ans = answers[q_num]
                # Take first answer if multiple given (e.g., 'A/B' or 'city centre/downtown')
                clean = raw_ans.split('/')[0].strip()
                # Remove bracketed content in parens for cleaner answer
                clean = re.sub(r'^\((.*)\)$', r'\1', clean).strip()
                q['answer'] = clean
                # Update type based on real answer
                old_type = q.get('type', '')
                new_type = detect_type(raw_ans, old_type)
                if old_type != new_type and new_type != 'fill_in_blank':
                    q['type'] = new_type
            q_global += 1

    content['sourceStatus'] = 'audio_real_answers_real'
    content['note'] = f'Real Cambridge {book} Test {test} Listening - answers from ieltsprogress.com'
    books_list[i]['content'] = content
    listen_updated += 1

# Update Reading
for book, tests in read_data.items():
    for test, answers in tests.items():
        if not answers:
            continue
        key = (book, test, 'Reading')
        if key not in idx:
            continue

        i = idx[key]
        content = books_list[i]['content']
        parts = content.get('parts', [])

        q_global = 1
        for part in parts:
            qs = part.get('questions', [])
            for q in qs:
                q_num = q.get('number', q_global)
                if q_num in answers:
                    raw_ans = answers[q_num]
                    clean = raw_ans.split('/')[0].strip()
                    clean = re.sub(r'^\((.*)\)$', r'\1', clean).strip()
                    q['answer'] = clean
                    old_type = q.get('type', '')
                    new_type = detect_type(raw_ans, old_type)
                    if old_type != new_type and new_type != 'fill_in_blank':
                        q['type'] = new_type
                q_global += 1

        content['sourceStatus'] = 'answers_real'
        content['note'] = f'Real Cambridge {book} Test {test} Reading - answers from ieltsprogress.com'
        books_list[i]['content'] = content
        read_updated += 1

store['books'] = books_list
json.dump(store, open('E:/antigravity/ILTES/data/local-store.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print(f'\nUpdated: {listen_updated} Listening + {read_updated} Reading entries')

# Verify
b5t1 = [b for b in books_list if b.get('bookNumber')==5 and b.get('testNumber')==1 and b.get('module')=='Listening']
if b5t1:
    parts = b5t1[0]['content']['parts']
    print('\nVerify Book 5 Test 1 Listening:')
    for p in parts:
        qs = p.get('questions', [])
        for q in qs[:2]:
            print(f'  Q{q["number"]}: {q["answer"]}')
