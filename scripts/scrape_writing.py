import requests, json, time, re, sys, io
from bs4 import BeautifulSoup

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')


def scrape_writing(book, test):
    url = f'https://engnovate.com/ielts-writing-tests/cambridge-ielts-{book}-academic-writing-test-{test}/'
    try:
        r = requests.get(url, timeout=20, headers={'User-Agent': 'Mozilla/5.0'})
        if r.status_code == 404:
            return None
        soup = BeautifulSoup(r.content, 'html.parser')

        sections = soup.find_all('div', class_='ielts-writing-question-section')
        if not sections:
            return None

        tasks = []
        for i, sec in enumerate(sections):
            txt = sec.get_text('\n', strip=True)
            # Remove instruction boilerplate from front
            txt = re.sub(r'^You should spend about \d+ minutes on this task\.\s*', '', txt)
            txt = re.sub(r'^Write at least \d+ words\.\s*', '', txt)
            txt = re.sub(r'^Give reasons for your answer[^.]*\.\s*', '', txt)
            tasks.append(txt.strip())

        return {'book': book, 'test': test, 'tasks': tasks}
    except Exception as e:
        return {'book': book, 'test': test, 'error': str(e)}


print('Scraping Writing tests books 10-20...')
all_data = {}
for book in range(10, 21):
    for test in range(1, 5):
        print(f'  Book {book} Test {test}...', end=' ', flush=True)
        result = scrape_writing(book, test)
        if result and 'tasks' in result and result['tasks']:
            all_data[f'{book}_{test}'] = result
            print(f'OK ({len(result["tasks"])} tasks)')
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
    tasks = data['tasks']

    store_key = (book, test, 'Writing')
    if store_key not in idx:
        print(f'MISSING: Book {book} Test {test} Writing')
        continue

    i = idx[store_key]
    content = books_list[i]['content']
    parts = content.get('parts', [])

    task_labels = ['Task 1', 'Task 2']
    for p_idx, part in enumerate(parts):
        if p_idx < len(tasks):
            task_text = tasks[p_idx]
            part['text'] = task_text
            part['title'] = f'{task_labels[p_idx]}: {task_text[:60].strip()}...' if len(task_text) > 60 else f'{task_labels[p_idx]}: {task_text}'
            # Update question prompt too
            qs = part.get('questions', [])
            for q in qs:
                q['prompt'] = task_text[:300]

    content['sourceStatus'] = 'complete_real'
    content['note'] = f'Real Cambridge {book} Test {test} Writing tasks from engnovate.com'
    books_list[i]['content'] = content
    updated += 1

store['books'] = books_list
json.dump(store, open('E:/antigravity/ILTES/data/local-store.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print(f'Updated: {updated} Writing entries in local-store.json')

# Verify
b20t1 = [b for b in books_list if b.get('bookNumber') == 20 and b.get('testNumber') == 1 and b.get('module') == 'Writing']
if b20t1:
    parts = b20t1[0]['content']['parts']
    print('\nVerify Book 20 Test 1 Writing:')
    for p in parts:
        print(f'  Part {p.get("partNumber")}: {p.get("text","")[:150]}')
        print()
