// Static image URLs for Cambridge IELTS Writing Task 1 questions.
// Images extracted from Cambridge PDFs at 2x resolution.

const WRITING_IMAGES: Record<string, string> = {
    '9_1':  '/images/writing/write_9_1.png',
    '9_2':  '/images/writing/write_9_2.png',
    '9_3':  '/images/writing/write_9_3.png',
    '9_4':  '/images/writing/write_9_4.png',
    '10_1': '/images/writing/write_10_1.png',
    '10_2': '/images/writing/write_10_2.png',
    '10_3': '/images/writing/write_10_3.png',
    '10_4': '/images/writing/write_10_4.png',
    '11_1': '/images/writing/write_11_1.png',
    '11_2': '/images/writing/write_11_2.png',
    '11_3': '/images/writing/write_11_3.png',
    '11_4': '/images/writing/write_11_4.png',
    '12_1': '/images/writing/write_12_1.png',
    '12_2': '/images/writing/write_12_2.png',
    '12_3': '/images/writing/write_12_3.png',
    '12_4': '/images/writing/write_12_4.png',
    '13_1': '/images/writing/write_13_1.png',
    '13_2': '/images/writing/write_13_2.png',
    '13_3': '/images/writing/write_13_3.png',
    '13_4': '/images/writing/write_13_4.png',
    '14_1': '/images/writing/write_14_1.png',
    '14_2': '/images/writing/write_14_2.png',
    '14_3': '/images/writing/write_14_3.png',
    '14_4': '/images/writing/write_14_4.png',
    '15_1': '/images/writing/write_15_1.png',
    '15_2': '/images/writing/write_15_2.png',
    '15_3': '/images/writing/write_15_3.png',
    '15_4': '/images/writing/write_15_4.png',
};

export function getWritingImage(book: number, test: number): string | null {
    return WRITING_IMAGES[`${book}_${test}`] ?? null;
}

// Legacy export kept for compatibility
export interface WritingPageInfo {
    pdfFile: string;
    page: number;
}
export function getWritingPage(book: number, test: number): WritingPageInfo | null {
    return null;
}
