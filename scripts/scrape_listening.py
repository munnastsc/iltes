import requests, json, time, re
from bs4 import BeautifulSoup, NavigableString, Tag


def get_listening_item_div(q_num, soup):
    num_tag = soup.find(id=f'ielts-listening-question-number-{q_num}')
    if not num_tag:
        return None
    el = num_tag.parent
    while el and 'ielts-listening-question-item' not in el.get('class', []):
        el = el.parent
    return el


def get_listening_mcq_options(q_num, soup):
    item = get_listening_item_div(q_num, soup)
    if not item:
        return None
    opt_divs = item.find_all('div', class_='ielts-listening-option')
    if not opt_divs:
        return None
    options = []
    for opt in opt_divs:
        label = opt.find(class_='ielts-listening-option-letter')
        span = opt.find('span')
        letter = label.get_text(strip=True) if label else ''
        text = span.get_text(strip=True) if span else ''
        if letter and text:
            options.append(f'{letter}) {text}')
    return options if options else None


def get_listening_prompt(q_num, soup):
    num_tag = soup.find(id=f'ielts-listening-question-number-{q_num}')
    if not num_tag:
        return f'Question {q_num}'
    parent = num_tag.parent
    parent_class = parent.get('class', [])

    # Walk up to question-item div
    item_el = parent
    while item_el and 'ielts-listening-question-item' not in item_el.get('class', []):
        item_el = item_el.parent

    if item_el:
        # MCQ: has div.ielts-listening-option children → extract stem from inner span
        if item_el.find('div', class_='ielts-listening-option'):
            outer_span = item_el.find('span', recursive=False)
            if outer_span:
                inner_span = outer_span.find('span')
                if inner_span:
                    return inner_span.get_text(strip=True)
                return re.sub(rf'^\s*{q_num}\s*', '', outer_span.get_text(strip=True)).strip()

    # Fill-in-blank: parent is span.ielts-listening-question-item inside td/p/li
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
                if isinstance(gc, Tag) and 'ielts-listening-question-item' in gc.get('class', []):
                    inner.append('___')
                elif isinstance(gc, NavigableString):
                    inner.append(str(gc))
                elif isinstance(gc, Tag):
                    inner.append(gc.get_text())
            parts.append(''.join(inner))
    prompt = re.sub(r'\s+', ' ', ''.join(parts)).strip()
    return prompt or f'Question {q_num}'


def get_section_instructions(soup, q_num):
    # Find section that contains this question number
    sections = soup.find_all('div', class_='ielts-listening-question-section')
    for sec in sections:
        nums = [int(n.get_text(strip=True)) for n in sec.find_all(class_='ielts-listening-question-number') if n.get_text(strip=True).isdigit()]
        if q_num in nums:
            instr = sec.find(class_='ielts-listening-question-instruction')
            if instr:
                return instr.get_text(strip=True)
    return ''


def get_listening_matching_options(q_num, soup):
    """For a dnd matching question, extract named options A-I from the dnd-panel."""
    num_tag = soup.find(id=f'ielts-listening-question-number-{q_num}')
    if not num_tag:
        return None
    drop_zone = num_tag.parent
    if not drop_zone or 'options-drop-zone' not in drop_zone.get('class', []):
        return None
    dnd_group = drop_zone.get('data-dnd-group')
    if not dnd_group:
        return None
    panel = soup.find('div', class_='dnd-panel--matching', attrs={'data-dnd-group': dnd_group})
    if not panel:
        return None
    cards = panel.find_all('div', class_='dnd-card')
    options = []
    for card in cards:
        val = card.get('data-value', '').strip()
        text_span = card.find('span', class_='dnd-text')
        if text_span:
            text = text_span.get_text(strip=True)
        else:
            raw = card.get('data-text', '')
            text = raw[len(val) + 2:].strip() if raw.startswith(val + '.') else raw.strip()
        if val and text:
            options.append(f'{val}: {text}')
    return options if options else None


def detect_type(ans, options=None):
    a = ans.split(',')[0].strip().upper()
    if a in ('TRUE', 'FALSE', 'NOT GIVEN', 'YES', 'NO'):
        return 'true_false'
    if options:
        return 'mcq'
    if len(a) == 1 and a.isalpha() and a in 'ABCDEFG':
        return 'matching'
    return 'fill_in_blank'


def scrape_listening(book, test):
    url = f'https://engnovate.com/ielts-listening-tests/cambridge-ielts-{book}-academic-listening-test-{test}/'
    try:
        r = requests.get(url, timeout=20, headers={'User-Agent': 'Mozilla/5.0'})
        if r.status_code == 404:
            return None
        soup = BeautifulSoup(r.content, 'html.parser')

        nonce_el = soup.find('input', {'id': 'ielts_listening_test_nonce'})
        post_id_el = soup.find('input', {'id': 'post_id'})
        if not nonce_el or not post_id_el:
            return None

        nonce, post_id = nonce_el['value'], post_id_el['value']

        # Build prompts and MCQ options
        prompts = {q: get_listening_prompt(q, soup) for q in range(1, 41)}
        mcq_options = {}
        matching_options = {}
        _seen_dnd_groups = {}
        for q in range(1, 41):
            opts = get_listening_mcq_options(q, soup)
            if opts:
                mcq_options[q] = opts
            else:
                num_tag = soup.find(id=f'ielts-listening-question-number-{q}')
                if num_tag:
                    drop_zone = num_tag.parent
                    if drop_zone and 'options-drop-zone' in drop_zone.get('class', []):
                        dnd_group = drop_zone.get('data-dnd-group')
                        if dnd_group:
                            if dnd_group not in _seen_dnd_groups:
                                _seen_dnd_groups[dnd_group] = get_listening_matching_options(q, soup)
                            m_opts = _seen_dnd_groups[dnd_group]
                            if m_opts:
                                matching_options[q] = m_opts

        # Detect parts from sections
        parts_qs = {}
        sections = soup.find_all('div', class_='ielts-listening-question-section')
        if sections:
            p_num = 1
            for sec in sections:
                nums = [int(n.get_text(strip=True)) for n in sec.find_all(class_='ielts-listening-question-number') if n.get_text(strip=True).isdigit()]
                if nums:
                    parts_qs[p_num] = len(set(nums))
                    p_num += 1
        if not parts_qs:
            parts_qs = {1: 10, 2: 10, 3: 10, 4: 10}

        # Get transcript text
        transcript_div = soup.find('div', class_='ielts-listening-transcript')
        passage_text = transcript_div.get_text('\n', strip=True) if transcript_div else ''

        # Build form data
        form_data = {
            'action': 'process_ielts_listening_test',
            'ielts_listening_test_nonce': nonce,
            '_wp_http_referer': f'/ielts-listening-tests/cambridge-ielts-{book}-academic-listening-test-{test}/',
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
            'mcq_options': mcq_options,
            'matching_options': matching_options,
            'passage_text': passage_text,
            'parts_qs': parts_qs,
            'answers': data['data']['results']
        }
    except Exception as e:
        return {'book': book, 'test': test, 'error': str(e)}


print('Scraping Listening tests books 10-20...')
all_data = {}
for book in range(10, 21):
    for test in range(1, 5):
        print(f'  Book {book} Test {test}...', end=' ', flush=True)
        result = scrape_listening(book, test)
        if result and 'answers' in result:
            all_data[f'{book}_{test}'] = result
            print('OK')
        elif result and 'error' in result:
            print(f'ERR: {result["error"][:60]}')
        else:
            print('SKIP (404)')
        time.sleep(0.5)

print(f'\nScraped: {len(all_data)}/44')

# Update local-store.json
store = json.load(open('E:/antigravity/ILTES/data/local-store.json', encoding='utf-8'))
books_list = store['books']
idx = {(b.get('bookNumber'), b.get('testNumber'), b.get('module')): i for i, b in enumerate(books_list)}

updated = 0
for key_str, data in all_data.items():
    book, test = data['book'], data['test']
    answers = data['answers']
    prompts = data['prompts']
    parts_qs = data['parts_qs']
    mcq_options = data.get('mcq_options', {})
    matching_options = data.get('matching_options', {})

    store_key = (book, test, 'Listening')
    if store_key not in idx:
        print(f'MISSING in store: Book {book} Test {test} Listening')
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

    # Pad boundaries if needed
    while len(boundaries) < len(parts):
        last_end = boundaries[-1][1] if boundaries else 0
        boundaries.append((last_end + 1, last_end + 10))

    new_parts = []
    for p_idx, part in enumerate(parts):
        start, end = boundaries[p_idx] if p_idx < len(boundaries) else (1, 10)
        questions = []
        for q_i in range(start - 1, min(end, len(answers))):
            ans_data = answers[q_i]
            correct_ans = ans_data.get('correct_answer', '')
            explanation = ans_data.get('explanation', '')
            q_num = q_i + 1
            opts = mcq_options.get(q_num) or matching_options.get(q_num)
            q_type = detect_type(correct_ans, opts if not matching_options.get(q_num) else None)
            q_data = {
                'number': q_num,
                'type': q_type,
                'prompt': prompts.get(q_num, f'Question {q_num}'),
                'answer': correct_ans.split(',')[0].strip(),
                'answerLine': explanation[:250] if explanation else ''
            }
            if opts:
                q_data['options'] = opts
            questions.append(q_data)
        new_part = dict(part)
        new_part['questions'] = questions
        new_parts.append(new_part)

    content['parts'] = new_parts
    content['sourceStatus'] = 'complete_real'
    content['passageText'] = data.get('passage_text', '')[:3000]
    content['note'] = f'Real Cambridge {book} Test {test} Listening - answers from engnovate.com'
    books_list[i]['content'] = content
    updated += 1

store['books'] = books_list
json.dump(store, open('E:/antigravity/ILTES/data/local-store.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print(f'Updated: {updated} Listening entries in local-store.json')

# Verify
b20t1 = [b for b in books_list if b.get('bookNumber') == 20 and b.get('testNumber') == 1 and b.get('module') == 'Listening']
if b20t1:
    parts = b20t1[0]['content']['parts']
    print('\nVerify Book 20 Test 1 Listening:')
    for p in parts:
        qs = p.get('questions', [])
        for q in qs[:2]:
            print(f'  Q{q["number"]}: {q["prompt"][:70]} => {q["answer"]}')
