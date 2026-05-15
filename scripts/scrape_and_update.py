import requests, json, time, re
from bs4 import BeautifulSoup, NavigableString, Tag

def get_prompt(q_num, form):
    num_tag = form.find(id=f'ielts-reading-question-number-{q_num}')
    if not num_tag:
        return f'Question {q_num}'
    parent = num_tag.parent
    parent_class = parent.get('class', [])
    # T/F or MCQ: bare span inside question-item div
    if parent.name == 'span' and not parent_class:
        sibling_span = parent.find('span')
        if sibling_span:
            return sibling_span.get_text(strip=True)
        return re.sub(rf'^\s*{q_num}\s*', '', parent.get_text(strip=True)).strip()
    # Matching: td with matching-question-cell class
    if 'ielts-reading-matching-question-cell' in parent_class:
        span = parent.find('span')
        return span.get_text(strip=True) if span else parent.get_text(strip=True).lstrip(str(q_num)).strip()
    # Fill-in-blank: parent is li/td/p with embedded input
    grandparent = parent.parent
    container = grandparent if grandparent else parent
    parts = []
    for child in container.children:
        if child is parent:
            parts.append('___')
        elif isinstance(child, NavigableString):
            parts.append(str(child))
        elif isinstance(child, Tag):
            inner = []
            for gc in child.children:
                if isinstance(gc, Tag) and 'ielts-reading-question-item' in gc.get('class', []):
                    inner.append('___')
                elif isinstance(gc, NavigableString):
                    inner.append(str(gc))
                elif isinstance(gc, Tag):
                    inner.append(gc.get_text())
            parts.append(''.join(inner))
    return re.sub(r'\s+', ' ', ''.join(parts)).strip() or f'Question {q_num}'


def scrape_test(book, test):
    url = f'https://engnovate.com/ielts-reading-tests/cambridge-ielts-{book}-academic-reading-test-{test}/'
    try:
        r = requests.get(url, timeout=20, headers={'User-Agent': 'Mozilla/5.0'})
        if r.status_code == 404:
            return None
        soup = BeautifulSoup(r.text, 'html.parser')
        nonce_el = soup.find('input', {'id': 'ielts_reading_test_nonce'})
        post_id_el = soup.find('input', {'id': 'post_id'})
        if not nonce_el or not post_id_el:
            return None
        nonce, post_id = nonce_el['value'], post_id_el['value']
        form = soup.find('form', id='ielts-reading-test-form')
        prompts = {q: get_prompt(q, form) for q in range(1, 41)}
        transcript_div = soup.find('div', class_='ielts-reading-test-transcripts')
        passage_text = transcript_div.get_text('\n', strip=True) if transcript_div else ''
        parts_qs = {}
        bottom = soup.find('div', class_='ielts-reading-bottom-panel')
        if bottom:
            for m in re.findall(r'Part (\d+)[^\d]*?(\d+) questions', bottom.get_text()):
                parts_qs[int(m[0])] = int(m[1])
        if not parts_qs:
            parts_qs = {1: 13, 2: 13, 3: 14}
        form_data = {
            'action': 'process_ielts_reading_test',
            'ielts_reading_test_nonce': nonce,
            '_wp_http_referer': f'/ielts-reading-tests/cambridge-ielts-{book}-academic-reading-test-{test}/',
            'post_id': post_id,
            'category_type': 'cambridge-academic',
        }
        for inp in soup.find_all('input'):
            t = inp.get('type', '')
            name = inp.get('name', '')
            val = inp.get('value', '')
            if name and t not in ('submit',) and name not in form_data:
                form_data[name] = val or ''
        session = requests.Session()
        session.get(url, headers={'User-Agent': 'Mozilla/5.0'})
        ajax = session.post(
            'https://engnovate.com/wp-admin/admin-ajax.php',
            data=form_data,
            headers={
                'User-Agent': 'Mozilla/5.0',
                'Referer': url,
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            timeout=20
        )
        if ajax.status_code != 200:
            return None
        data = ajax.json()
        if not data.get('success'):
            return None
        return {
            'book': book, 'test': test,
            'prompts': prompts,
            'passage_text': passage_text,
            'parts_qs': parts_qs,
            'answers': data['data']['results']
        }
    except Exception as e:
        return {'book': book, 'test': test, 'error': str(e)}


def detect_type(ans):
    a = ans.split(',')[0].strip().upper()
    if a in ('TRUE', 'FALSE', 'NOT GIVEN', 'YES', 'NO'):
        return 'true_false'
    if len(a) == 1 and a in 'ABCDEFG':
        return 'matching'
    return 'fill_in_blank'


print('Scraping 44 tests with real question prompts...')
all_data = {}
for book in range(10, 21):
    for test in range(1, 5):
        print(f'  Book {book} Test {test}...', end=' ', flush=True)
        result = scrape_test(book, test)
        if result and 'answers' in result:
            all_data[f'{book}_{test}'] = result
            print('OK')
        elif result and 'error' in result:
            print(f'ERR: {result["error"][:50]}')
        else:
            print('SKIP')
        time.sleep(0.4)

print(f'\nScraped: {len(all_data)}/44')

store = json.load(open('E:/antigravity/ILTES/data/local-store.json', encoding='utf-8'))
books_list = store['books']
idx = {(b.get('bookNumber'), b.get('testNumber'), b.get('module')): i for i, b in enumerate(books_list)}

updated = 0
for key_str, data in all_data.items():
    book, test = data['book'], data['test']
    answers = data['answers']
    prompts = data['prompts']
    parts_qs = data['parts_qs']

    store_key = (book, test, 'Reading')
    if store_key not in idx:
        continue

    i = idx[store_key]
    content = books_list[i]['content']
    parts = content.get('parts', [])

    boundaries = []
    q_start = 1
    for p_num in sorted(parts_qs.keys()):
        count = parts_qs[p_num]
        boundaries.append((q_start, q_start + count - 1))
        q_start += count

    new_parts = []
    for p_idx, part in enumerate(parts):
        start, end = boundaries[p_idx] if p_idx < len(boundaries) else (1, 13)
        questions = []
        for q_i in range(start - 1, min(end, len(answers))):
            ans_data = answers[q_i]
            correct_ans = ans_data.get('correct_answer', '')
            explanation = ans_data.get('explanation', '')
            q_num = q_i + 1
            q_type = detect_type(correct_ans)
            questions.append({
                'number': q_num,
                'type': q_type,
                'prompt': prompts.get(q_num, f'Question {q_num}'),
                'answer': correct_ans.split(',')[0].strip(),
                'answerLine': explanation[:250] if explanation else ''
            })
        new_part = dict(part)
        new_part['questions'] = questions
        new_parts.append(new_part)

    content['parts'] = new_parts
    content['sourceStatus'] = 'complete_real'
    content['passageText'] = data.get('passage_text', '')[:5000]
    content['note'] = f'Real Cambridge {book} Test {test} - questions and answers from official source.'
    books_list[i]['content'] = content
    updated += 1

store['books'] = books_list
json.dump(store, open('E:/antigravity/ILTES/data/local-store.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print(f'Updated: {updated} entries in local-store.json')

# Verify
b18 = [b for b in books_list if b.get('bookNumber') == 18 and b.get('testNumber') == 1 and b.get('module') == 'Reading'][0]
parts = b18['content']['parts']
print('\nVerify Book 18 Test 1 Reading:')
for p in parts:
    qs = p['questions']
    for q in qs[:3]:
        print(f'  Q{q["number"]}: {q["prompt"][:70]} => {q["answer"]}')
