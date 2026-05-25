import { PDFParse } from 'pdf-parse';
import { readFileSync, writeFileSync } from 'fs';

const pdfPath = "public/audio/headway4B/090- New Headway. Beginner. Student's book. 4th Ed_2013 -143p.pdf";
const buf = readFileSync(pdfPath);
const parser = new PDFParse({});
const d = await parser.parse(buf);
const text = d.text || '';
writeFileSync('headway_extracted.txt', text, 'utf8');
console.log('DONE chars:', text.length);
// Find tapescript
const lower = text.toLowerCase();
const idx = lower.indexOf('tapescript');
if (idx >= 0) {
  console.log('TAPESCRIPT FOUND at char:', idx);
  console.log(text.slice(idx, idx + 4000));
} else {
  console.log('No tapescript keyword. Last 3000 chars:');
  console.log(text.slice(-3000));
}
