import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { listLocalBooks } from '../../../../../lib/localStore';
import { findContentQaIssues } from '../../../../../lib/contentQa';

export async function GET() {
    try {
        let rows: any[] = [];
        let source: 'database' | 'local' = 'database';
        try {
            rows = await prisma.cambridgeBook.findMany({
                orderBy: [{ bookNumber: 'asc' }, { testNumber: 'asc' }, { module: 'asc' }],
            });
        } catch {
            rows = await listLocalBooks();
            source = 'local';
        }

        const issues = findContentQaIssues(rows as any);
        return NextResponse.json({
            source,
            totalRecords: rows.length,
            issueCount: issues.length,
            issues,
        });
    } catch {
        return NextResponse.json({ error: 'QA scan failed.' }, { status: 500 });
    }
}
