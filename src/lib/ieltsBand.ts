export function listeningRawToBand(raw: number): number {
    if (raw >= 39) return 9;
    if (raw >= 37) return 8.5;
    if (raw >= 35) return 8;
    if (raw >= 32) return 7.5;
    if (raw >= 30) return 7;
    if (raw >= 26) return 6.5;
    if (raw >= 23) return 6;
    if (raw >= 18) return 5.5;
    if (raw >= 16) return 5;
    if (raw >= 13) return 4.5;
    return 4;
}

export function readingRawToBand(raw: number): number {
    if (raw >= 39) return 9;
    if (raw >= 37) return 8.5;
    if (raw >= 35) return 8;
    if (raw >= 33) return 7.5;
    if (raw >= 30) return 7;
    if (raw >= 27) return 6.5;
    if (raw >= 23) return 6;
    if (raw >= 19) return 5.5;
    if (raw >= 15) return 5;
    if (raw >= 13) return 4.5;
    return 4;
}

export function moduleBandEstimate(moduleName: string, raw: number, total: number): number | null {
    const m = moduleName.toLowerCase();
    if (m === 'listening') return listeningRawToBand(raw);
    if (m === 'reading') return readingRawToBand(raw);
    if (total <= 0) return null;
    const percentage = raw / total;
    if (percentage >= 0.9) return 8;
    if (percentage >= 0.8) return 7.5;
    if (percentage >= 0.7) return 7;
    if (percentage >= 0.6) return 6.5;
    if (percentage >= 0.5) return 6;
    if (percentage >= 0.4) return 5.5;
    return 5;
}
