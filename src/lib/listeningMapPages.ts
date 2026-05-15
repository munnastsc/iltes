// PDF page numbers for listening sections containing maps/plans/diagrams.
// Values are approximate (±2 pages). Click-to-zoom lets students scroll if needed.

export interface MapPageInfo {
    pdfFile: string;
    page: number;
}

// Key: "book_test_section"
const MAP_PAGES: Record<string, MapPageInfo> = {
    // Cambridge 9
    '9_2_2': { pdfFile: 'Cambridge IELTS 09 www.iac-uk.com.pdf', page: 43 },
    '9_4_2': { pdfFile: 'Cambridge IELTS 09 www.iac-uk.com.pdf', page: 97 },

    // Cambridge 11
    '11_1_2': { pdfFile: 'Cambridge IELTS 11 AC www.iac-uk.com.pdf', page: 13 },
    '11_2_2': { pdfFile: 'Cambridge IELTS 11 AC www.iac-uk.com.pdf', page: 42 },
    '11_3_2': { pdfFile: 'Cambridge IELTS 11 AC www.iac-uk.com.pdf', page: 71 },
    '11_4_2': { pdfFile: 'Cambridge IELTS 11 AC www.iac-uk.com.pdf', page: 100 },

    // Cambridge 12
    '12_4_2': { pdfFile: 'Cambridge IELTS 12 www.iac-uk.com.pdf', page: 101 },

    // Cambridge 13
    '13_1_2': { pdfFile: 'Cambridge IELTS 13 www.iac-uk.com.pdf', page: 13 },

    // Cambridge 14
    '14_2_2': { pdfFile: 'Cambridge IELTS 14 www.iac-uk.com.pdf', page: 42 },

    // Cambridge 15
    '15_2_2': { pdfFile: 'Cambridge IELTS 15.pdf', page: 42 },
    '15_4_2': { pdfFile: 'Cambridge IELTS 15.pdf', page: 100 },
};

export function getMapPage(book: number, test: number, section: number): MapPageInfo | null {
    return MAP_PAGES[`${book}_${test}_${section}`] ?? null;
}
