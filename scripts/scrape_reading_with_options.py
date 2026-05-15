"""
Updated Reading scraper that extracts MCQ options, DND options, and matching options.
- MCQ (A-D): from div.ielts-reading-option inside each question item
- Sentence endings (A-G DND): from draggable div elements
- Matching with named list (e.g. List of Dates A=1836): extracted from section content
- Matching to paragraphs (A-F, no named list): no options stored (A-F are passage labels)
"""
import requests, json, time, re, sys, io
from bs4 import BeautifulSoup, NavigableString, Tag

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')


def get_matching_options_from_content(content_div):
    """Parse 'List of X: A text B text ...' from a section-content div."""
    if not content_div or 'List of' not in content_div.get_text():
        return None
    options = {}
    in_list = False
    for p in content_div.find_all('p'):
        if 'list of' in p.get_text(strip=True).lower():
            in_list = True
            continue
        if not in_list:
            continue
        for strong in p.find_all('strong'):
            letter = strong.get_text(strip=True)
            if len(letter) == 1 and letter.isupper():
                val_parts = []
                node = strong.next_sibling
                while node is not None:
                    if hasattr(node, 'name') and node.name == 'strong':
                        break
                    if isinstance(node, NavigableString):
                        val_parts.append(str(node))
                    elif hasattr(node, 'get_text'):
                        val_parts.append(node.get_text())
                    node = node.next_sibling
                val = re.sub(r'[\xa0  ]+', ' ', ''.join(val_parts)).strip()
                if val:
                    options[letter] = val
    return [f'{k}: {v}' for k, v in sorted(options.items())] if options else None


def get_matching_options(q_num, soup):
    """For a matching table question, extract named A-G options from its section instruction."""
    num_tag = soup.find(id=f'ielts-reading-question-number-{q_num}')
    if not num_tag:
        return None
    # Walk up to the matching table
    el = num_tag
    while el and 'ielts-reading-matching-table' not in el.get('class', []):
        el = el.parent
    if not el:
        return None
    # Parent is ielts-reading-questions div; find preceding section-content sibling
    qs_div = el.parent
    prev = qs_div.previous_sibling
    while prev is not None:
        if hasattr(prev, 'get') and 'ielts-reading-question-section-content' in prev.get('class', []):
            return get_matching_options_from_content(prev)
        prev = prev.previous_sibling
    return None


def get_prompt(q_num, form):
    num_tag = form.find(id=f'ielts-reading-question-number-{q_num}')
    if not num_tag:
        return f'Question {q_num}'
    parent = num_tag.parent
    parent_class = parent.get('class', [])

    # Matching: td with matching-question-cell class
    if 'ielts-reading-matching-question-cell' in parent_class:
        span = parent.find('span')
        return span.get_text(strip=True) if span else parent.get_text(strip=True).lstrip(str(q_num)).strip()

    # Walk up to find the question-item container
    item_el = parent
    while item_el and 'ielts-reading-question-item' not in item_el.get('class', []):
        item_el = item_el.parent

    if item_el:
        # MCQ: has div.ielts-reading-option children → extract only the stem span
        if item_el.find('div', class_='ielts-reading-option'):
            # Find the span inside the outer span that contains the question stem
            outer_span = item_el.find('span', recursive=False)
            if outer_span:
                inner_span = outer_span.find('span')
                if inner_span:
                    return inner_span.get_text(strip=True)
                return re.sub(rf'^\s*{q_num}\s*', '', outer_span.get_text(strip=True)).strip()

        # DND sentence completion: has dnd-zone children
        dnd_zone = item_el.find(class_='dnd-zone')
        if dnd_zone:
            parts = []
            for child in item_el.children:
                if isinstance(child, NavigableString):
                    parts.append(str(child))
                elif isinstance(child, Tag):
                    if 'dnd-zone' in child.get('class', []) or 'options-drop-zone' in child.get('class', []):
                        parts.append('___')
                    elif 'ielts-reading-question-number' not in child.get('class', ['']):
                        parts.append(child.get_text())
            prompt = re.sub(r'\s+', ' ', ''.join(parts)).strip()
            return prompt or f'Question {q_num}'

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


def get_question_item_div(q_num, soup):
    """Walk up from question number element to find the question-item div"""
    num_tag = soup.find(id=f'ielts-reading-question-number-{q_num}')
    if not num_tag:
        return None
    el = num_tag.parent
    while el and 'ielts-reading-question-item' not in el.get('class', []):
        el = el.parent
    return el


def is_dnd_question(q_num, soup):
    """Check if question uses drag-and-drop (has dnd-zone class)"""
    num_tag = soup.find(id=f'ielts-reading-question-number-{q_num}')
    if not num_tag:
        return False
    return bool(num_tag.find_parent(class_='dnd-zone') or num_tag.find_parent(class_='options-drop-zone'))


def get_mcq_options(q_num, soup):
    """Extract options for MCQ questions (div.ielts-reading-option inside question item)"""
    item_div = get_question_item_div(q_num, soup)
    if not item_div:
        return None
    opt_divs = item_div.find_all('div', class_='ielts-reading-option')
    if not opt_divs:
        return None
    options = []
    for opt in opt_divs:
        label = opt.find(class_='ielts-reading-option-letter')
        span = opt.find('span')
        letter = label.get_text(strip=True) if label else ''
        text = span.get_text(strip=True) if span else ''
        if letter and text and text not in ('TRUE', 'FALSE', 'NOT GIVEN', 'YES', 'NO'):
            options.append(f'{letter}) {text}')
    return options if options else None


def get_dnd_options_for_section(q_num, soup):
    """Get DND sentence-ending options - only for DND questions"""
    if not is_dnd_question(q_num, soup):
        return None
    num_tag = soup.find(id=f'ielts-reading-question-number-{q_num}')
    if not num_tag:
        return None
    # Walk up to find ielts-reading-questions container
    el = num_tag.parent
    while el and 'ielts-reading-questions' not in el.get('class', []):
        el = el.parent
    if not el:
        return None
    section = el.parent
    draggables = section.find_all('div', draggable=True)
    if draggables:
        options = [d.get_text(strip=True) for d in draggables if d.get_text(strip=True)]
        return options if options else None
    return None


def get_reading_inline_dnd_options(q_num, soup):
    """For inline DND (complete the summary with word bank A-L), extract options via dnd-group."""
    num_tag = soup.find(id=f'ielts-reading-question-number-{q_num}')
    if not num_tag:
        return None
    drop_zone = num_tag.parent
    if not drop_zone or 'options-drop-zone' not in drop_zone.get('class', []):
        return None
    dnd_group = drop_zone.get('data-dnd-group')
    if not dnd_group:
        return None
    # Find the dnd-panel for this group - search all elements with this data-dnd-group
    # and pick the one that is a panel div (has 'dnd-panel' class but not 'options-drop-zone')
    panel = None
    for el in soup.find_all(attrs={'data-dnd-group': dnd_group}):
        cls = el.get('class', [])
        if 'dnd-panel' in cls and 'options-drop-zone' not in cls:
            panel = el
            break
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
    if len(a) == 1 and a in 'ABCDEFG':
        return 'matching'
    return 'fill_in_blank'


def scrape_reading(book, test):
    url = f'https://engnovate.com/ielts-reading-tests/cambridge-ielts-{book}-academic-reading-test-{test}/'
    try:
        r = requests.get(url, timeout=20, headers={'User-Agent': 'Mozilla/5.0'})
        if r.status_code == 404:
            return None
        soup = BeautifulSoup(r.content, 'html.parser')
        nonce_el = soup.find('input', {'id': 'ielts_reading_test_nonce'})
        post_id_el = soup.find('input', {'id': 'post_id'})
        if not nonce_el or not post_id_el:
            return None
        nonce, post_id = nonce_el['value'], post_id_el['value']
        form = soup.find('form', id='ielts-reading-test-form')

        # Build prompts and collect MCQ/DND/matching options per question
        prompts = {}
        mcq_options = {}
        dnd_options_cache = {}
        matching_options_cache = {}
        _seen_matching_tables = {}  # table element → options list (cache per table)
        _seen_dnd_groups = {}       # dnd-group → options list (cache per word bank)

        for q_num in range(1, 41):
            prompts[q_num] = get_prompt(q_num, form)
            # Check for MCQ options
            opts = get_mcq_options(q_num, soup)
            if opts:
                mcq_options[q_num] = opts
            else:
                # Check for DND sentence-ending options
                dnd_opts = get_dnd_options_for_section(q_num, soup)
                if not dnd_opts:
                    # Check for inline DND word bank (complete the summary A-L)
                    num_tag_dnd = soup.find(id=f'ielts-reading-question-number-{q_num}')
                    if num_tag_dnd:
                        dz = num_tag_dnd.parent
                        if dz and 'options-drop-zone' in dz.get('class', []):
                            grp = dz.get('data-dnd-group')
                            if grp:
                                if grp not in _seen_dnd_groups:
                                    _seen_dnd_groups[grp] = get_reading_inline_dnd_options(q_num, soup)
                                dnd_opts = _seen_dnd_groups[grp]
                if dnd_opts:
                    dnd_options_cache[q_num] = dnd_opts
                else:
                    # Check for named matching options (List of Dates/Writers/etc.)
                    num_tag = soup.find(id=f'ielts-reading-question-number-{q_num}')
                    if num_tag:
                        # Only for questions inside a matching table
                        td = num_tag.parent
                        if td and 'ielts-reading-matching-question-cell' in td.get('class', []):
                            table = td.parent.parent  # tr → tbody/table
                            while table and 'ielts-reading-matching-table' not in table.get('class', []):
                                table = table.parent
                            if table:
                                t_id = id(table)
                                if t_id not in _seen_matching_tables:
                                    _seen_matching_tables[t_id] = get_matching_options(q_num, soup)
                                m_opts = _seen_matching_tables[t_id]
                                if m_opts:
                                    matching_options_cache[q_num] = m_opts

        # Get passage text for each of the 3 parts
        def extract_passage_text(transcript_div):
            """Extract formatted passage text, prefixing paragraph labels (A, B, C...) inline."""
            lines = []
            current_label = None
            for child in transcript_div.children:
                if not isinstance(child, Tag):
                    continue
                text = child.get_text(strip=True)
                if not text:
                    continue
                if child.name == 'h2':
                    lines.append(text)
                elif len(text) <= 2 and text.upper() == text and text.isalpha():
                    current_label = text
                else:
                    if current_label:
                        lines.append(f'{current_label}  {text}')
                        current_label = None
                    else:
                        lines.append(text)
            return '\n\n'.join(lines).strip()

        transcript_divs = soup.find_all('div', class_='ielts-reading-transcript')
        passage_texts = [extract_passage_text(t) for t in transcript_divs]
        passage_titles = []
        for t in transcript_divs:
            h2 = t.find('h2')
            passage_titles.append(h2.get_text(strip=True) if h2 else '')
        passage_text = '\n\n'.join(passage_texts)

        # Get parts/question boundaries
        parts_qs = {}
        bottom = soup.find('div', class_='ielts-reading-bottom-panel')
        if bottom:
            for m in re.findall(r'Part (\d+)[^\d]*?(\d+) questions', bottom.get_text()):
                parts_qs[int(m[0])] = int(m[1])
        if not parts_qs:
            parts_qs = {1: 13, 2: 13, 3: 14}

        # Submit form for answers
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
            'mcq_options': mcq_options,
            'dnd_options': dnd_options_cache,
            'matching_options': matching_options_cache,
            'passage_text': passage_text,
            'passage_texts': passage_texts,
            'passage_titles': passage_titles,
            'parts_qs': parts_qs,
            'answers': data['data']['results']
        }
    except Exception as e:
        return {'book': book, 'test': test, 'error': str(e)}


print('Scraping Reading tests books 10-20 with options...')
all_data = {}
for book in range(10, 21):
    for test in range(1, 5):
        print(f'  Book {book} Test {test}...', end=' ', flush=True)
        result = scrape_reading(book, test)
        if result and 'answers' in result:
            all_data[f'{book}_{test}'] = result
            mcq_count = len(result.get('mcq_options', {}))
            dnd_count = len(result.get('dnd_options', {}))
            match_count = len(result.get('matching_options', {}))
            print(f'OK (mcq={mcq_count} dnd={dnd_count} match={match_count})')
        elif result and 'error' in result:
            print(f'ERR: {result["error"][:50]}')
        else:
            print('SKIP')
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
    dnd_options = data.get('dnd_options', {})
    matching_options = data.get('matching_options', {})
    passage_texts = data.get('passage_texts', [])
    passage_titles = data.get('passage_titles', [])

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
            opts = mcq_options.get(q_num) or dnd_options.get(q_num) or matching_options.get(q_num)
            q_type = detect_type(correct_ans, opts if not matching_options.get(q_num) else None)
            questions.append({
                'number': q_num,
                'type': q_type,
                'prompt': prompts.get(q_num, f'Question {q_num}'),
                'answer': correct_ans.split(',')[0].strip(),
                'answerLine': explanation[:250] if explanation else '',
                **(({'options': opts}) if opts else {}),
            })
        new_part = dict(part)
        new_part['questions'] = questions
        if p_idx < len(passage_texts) and passage_texts[p_idx]:
            new_part['text'] = passage_texts[p_idx]
        if p_idx < len(passage_titles) and passage_titles[p_idx]:
            new_part['title'] = f'Passage {p_idx + 1}: {passage_titles[p_idx]}'
        new_parts.append(new_part)

    content['parts'] = new_parts
    content['sourceStatus'] = 'complete_real'
    content['passageText'] = data.get('passage_text', '')[:5000]
    content['note'] = f'Real Cambridge {book} Test {test} - questions with options from engnovate.com'
    books_list[i]['content'] = content
    updated += 1

store['books'] = books_list
json.dump(store, open('E:/antigravity/ILTES/data/local-store.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print(f'Updated: {updated} Reading entries with options')

# Verify Book 20 Test 1
b20 = [b for b in books_list if b.get('bookNumber') == 20 and b.get('testNumber') == 1 and b.get('module') == 'Reading'][0]
parts = b20['content']['parts']
print('\nVerify Book 20 Test 1 Reading:')
for p in parts:
    qs = p.get('questions', [])
    for q in qs:
        if q.get('options'):
            print(f'  Q{q["number"]} ({q["type"]}): {q["prompt"][:60]}')
            for opt in q['options'][:3]:
                print(f'    {opt}')
            break
