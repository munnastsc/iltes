// Approximate PDF page numbers for Cambridge IELTS Writing Task 1 questions.
// Derived from Section 2 listening map page anchors (writing = map_page + 24).
// Accuracy: ±3 pages. PDFPageViewer supports zoom+scroll.

export interface WritingPageInfo {
    pdfFile: string;
    page: number;
}

const BOOK_PDF: Record<number, string> = {
    9:  'Cambridge IELTS 09 www.iac-uk.com.pdf',
    10: 'Cambridge IELTS 10 www.iac-uk.com.pdf',
    11: 'Cambridge IELTS 11 AC www.iac-uk.com.pdf',
    12: 'Cambridge IELTS 12 www.iac-uk.com.pdf',
    13: 'Cambridge IELTS 13 www.iac-uk.com.pdf',
    14: 'Cambridge IELTS 14 www.iac-uk.com.pdf',
    15: 'Cambridge IELTS 15.pdf',
};

// Approximate writing Task 1 page numbers per book and test
const WRITING_PAGES: Record<string, number> = {
    // Book 9 (27-page test intervals)
    '9_1': 40,
    '9_2': 67,
    '9_3': 94,
    '9_4': 121,

    // Book 10 (27-page test intervals)
    '10_1': 40,
    '10_2': 67,
    '10_3': 94,
    '10_4': 121,

    // Book 11 (29-page test intervals, T1 map anchor=13)
    '11_1': 37,
    '11_2': 66,
    '11_3': 95,
    '11_4': 124,

    // Book 12 (29-page test intervals, T4 map anchor=101)
    '12_1': 38,
    '12_2': 67,
    '12_3': 96,
    '12_4': 125,

    // Book 13 (29-page test intervals, T1 map anchor=13)
    '13_1': 37,
    '13_2': 66,
    '13_3': 95,
    '13_4': 124,

    // Book 14 (29-page test intervals, T2 map anchor=42)
    '14_1': 37,
    '14_2': 66,
    '14_3': 95,
    '14_4': 124,

    // Book 15 (29-page test intervals, T2 map anchor=42)
    '15_1': 37,
    '15_2': 66,
    '15_3': 95,
    '15_4': 124,
};

export function getWritingPage(book: number, test: number): WritingPageInfo | null {
    const pdfFile = BOOK_PDF[book];
    if (!pdfFile) return null;
    const page = WRITING_PAGES[`${book}_${test}`];
    if (!page) return null;
    return { pdfFile, page };
}
