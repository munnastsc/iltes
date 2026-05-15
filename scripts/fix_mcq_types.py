"""
Fix MCQ question types and parse options from embedded prompt text.
Pattern: prompt starts with '___ A[opt]. B[opt]. C[opt].'
These should be type='mcq' with options list, not type='matching'.
"""
import json, re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')


def parse_mcq_options(prompt):
    """Extract options from prompt like '___ AOption text. BOption text. C...'"""
    text = re.sub(r'^___\s*', '', prompt).strip()
    # Try period-separated options first
    positions = [m.start() for m in re.finditer(r'(?:^|(?<=\.))\s*[A-G](?=[A-Z]|[a-z])', text)]
    if len(positions) < 2:
        # Try space-separated options (no period between them)
        positions = [m.start() for m in re.finditer(r'(?:^|\s)[A-G](?=[A-Z])', text)]
    if len(positions) < 2:
        return []
    options = []
    for i, pos in enumerate(positions):
        end = positions[i+1] if i+1 < len(positions) else len(text)
        chunk = text[pos:end].strip()
        m = re.match(r'^([A-G])(.*)', chunk)
        if m:
            letter = m.group(1)
            content = m.group(2).strip().rstrip('. ')
            if content:
                options.append(f'{letter}) {content}')
    return options if len(options) >= 2 else []


def is_mcq_prompt(prompt, answer):
    """Detect if this is an MCQ question (options embedded in prompt)"""
    if not prompt.startswith('___'):
        return False
    ans = answer.strip().upper()
    if not (len(ans) == 1 and ans.isalpha() and ans in 'ABCDEFG'):
        return False
    # Prompt text starts with A[uppercase] pattern after ___
    text = re.sub(r'^___\s*', '', prompt)
    return bool(re.match(r'^[A-G][A-Z]', text))


store = json.load(open('E:/antigravity/ILTES/data/local-store.json', encoding='utf-8'))
books_list = store['books']

fixed = 0
for b in books_list:
    if b.get('bookNumber', 0) > 20:
        continue
    content = b.get('content', {})
    for part in content.get('parts', []):
        qs = part.get('questions', [])
        for q in qs:
            if q.get('type') == 'matching' and is_mcq_prompt(q.get('prompt', ''), q.get('answer', '')):
                options = parse_mcq_options(q['prompt'])
                if options:
                    q['type'] = 'mcq'
                    q['options'] = options
                    # Clean prompt to just the instruction
                    q['prompt'] = 'Choose the correct answer (A, B, or C):'
                    fixed += 1

json.dump(store, open('E:/antigravity/ILTES/data/local-store.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print(f'Fixed {fixed} MCQ questions')

# Verify
b20 = [x for x in books_list if x.get('bookNumber')==20 and x.get('testNumber')==1 and x.get('module')=='Listening'][0]
qs = b20['content']['parts'][1]['questions']
for q in qs[:4]:
    print(f'Q{q["number"]} type={q["type"]} answer={q["answer"]}')
    if q.get('options'):
        for opt in q['options']:
            print(f'  {opt}')
    print(f'  prompt: {q["prompt"][:80]}')
    print()
