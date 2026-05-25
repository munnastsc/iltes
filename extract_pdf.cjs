const { PDFParse } = require('pdf-parse');
const fs = require('fs');

const pdfPath = "public/audio/headway4B/090- New Headway. Beginner. Student's book. 4th Ed_2013 -143p.pdf";
const buf = fs.readFileSync(pdfPath);
const parser = new PDFParse({});

async function run() {
  await parser.load(buf);
  const info = parser.getInfo();
  console.log('Pages:', info.numPages);

  let allText = '';
  for (let i = 1; i <= info.numPages; i++) {
    const pageText = await parser.getPageText(i);
    allText += pageText + '\n---PAGE---\n';
  }

  fs.writeFileSync('headway_extracted.txt', allText, 'utf8');
  console.log('Saved. Total chars:', allText.length);

  const lower = allText.toLowerCase();
  const idx = lower.indexOf('tapescript');
  if (idx >= 0) {
    console.log('TAPESCRIPT at char', idx);
    console.log(allText.slice(idx, idx + 3000));
  } else {
    console.log('No tapescript. Showing last 2000:');
    console.log(allText.slice(-2000));
  }
}

run().catch(e => console.error('Error:', e.message));
