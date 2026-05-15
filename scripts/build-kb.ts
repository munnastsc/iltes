import { listeningTests } from '../src/lib/listeningData';
import * as fs from 'fs';
import * as path from 'path';

// --- LISTENING KB ---
const listeningKb: Record<string, unknown> = {};

for (const t of listeningTests) {
  for (let sIdx = 0; sIdx < t.sections.length; sIdx++) {
    const sec = t.sections[sIdx];
    for (const grp of sec.groups) {
      for (const q of grp.qs) {
        const key = `${t.book}_${t.test}_${sIdx + 1}_${q.n}`;
        listeningKb[key] = {
          book: t.book,
          test: t.test,
          section: sIdx + 1,
          topic: sec.topic,
          qn: q.n,
          type: q.type,
          pre: q.pre ?? null,
          post: q.post ?? null,
          q: q.q ?? null,
          opts: q.opts ?? null,
          ans: q.ans,
          pool: grp.pool ?? null,
          instruction: grp.instruction,
          range: grp.range,
        };
      }
    }
  }
}

// --- LISTENING cam16-20 from local-store.json ---
const localStore = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'data/local-store.json'), 'utf-8')
);
const localBooks: any[] = localStore.books ?? [];

for (const entry of localBooks) {
  if (entry.module !== 'Listening') continue;
  const { bookNumber: book, testNumber: test, content } = entry;
  if (book < 16) continue; // cam9-15 already in listeningData.ts
  const parts: any[] = content?.parts ?? [];
  for (let sIdx = 0; sIdx < parts.length; sIdx++) {
    const part = parts[sIdx];
    const topic = part.title ?? `Section ${sIdx + 1}`;
    const questions: any[] = part.questions ?? [];
    for (const q of questions) {
      const key = `${book}_${test}_${sIdx + 1}_${q.number}`;
      listeningKb[key] = {
        book,
        test,
        section: sIdx + 1,
        topic,
        qn: q.number,
        type: q.type ?? 'fill',
        pre: q.prompt ?? null,
        ans: q.answer,
      };
    }
  }
}

// --- READING KB ---
const readingRaw = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'data/scraped_reading.json'), 'utf-8')
);

const readingKb: Record<string, unknown> = {};
for (const [key, val] of Object.entries(readingRaw as Record<string, any>)) {
  const { book, test, passage_text, question_text, answers } = val;
  // flat per-question entries
  for (let i = 0; i < answers.length; i++) {
    const qn = i + 1;
    const qkey = `${book}_${test}_${qn}`;
    readingKb[qkey] = {
      book,
      test,
      qn,
      ans: answers[i].correct_answer,
      explanation: answers[i].explanation ?? null,
    };
  }
  // also store full passage + question text for AI context
  readingKb[`${book}_${test}_context`] = {
    book,
    test,
    passage_text,
    question_text,
  };
}

// --- WRITE ---
const dataDir = path.join(process.cwd(), 'data');

fs.writeFileSync(
  path.join(dataDir, 'listening-kb.json'),
  JSON.stringify(listeningKb, null, 2),
  'utf-8'
);
console.log(`listening-kb.json: ${Object.keys(listeningKb).length} entries`);

fs.writeFileSync(
  path.join(dataDir, 'reading-kb.json'),
  JSON.stringify(readingKb, null, 2),
  'utf-8'
);
console.log(`reading-kb.json: ${Object.keys(readingKb).length} entries`);
