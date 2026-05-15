// Static image URLs for listening sections containing maps/plans/diagrams.
// Images extracted from Cambridge PDFs at 2x resolution.

// Key: "book_test_section"
const MAP_IMAGES: Record<string, string> = {
    '9_2_2':  '/images/listening/listen_9_2_2.png',
    '9_4_2':  '/images/listening/listen_9_4_2.png',
    '11_1_2': '/images/listening/listen_11_1_2.png',
    '11_2_2': '/images/listening/listen_11_2_2.png',
    '11_3_2': '/images/listening/listen_11_3_2.png',
    '11_4_2': '/images/listening/listen_11_4_2.png',
    '12_4_2': '/images/listening/listen_12_4_2.png',
    '13_1_2': '/images/listening/listen_13_1_2.png',
    '14_2_2': '/images/listening/listen_14_2_2.png',
    '15_2_2': '/images/listening/listen_15_2_2.png',
    '15_4_2': '/images/listening/listen_15_4_2.png',
};

export function getMapImage(book: number, test: number, section: number): string | null {
    return MAP_IMAGES[`${book}_${test}_${section}`] ?? null;
}

// Keep old export for any remaining usages
export interface MapPageInfo {
    pdfFile: string;
    page: number;
}
export function getMapPage(book: number, test: number, section: number): MapPageInfo | null {
    return null;
}
export function isMapGroup(instruction: string): boolean {
    return /label.*(map|plan|diagram)/i.test(instruction);
}
