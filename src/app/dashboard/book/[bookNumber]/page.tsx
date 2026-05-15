import Link from 'next/link';
import { ChevronLeft, BookMarked, FlaskConical, Headphones, BookOpen, PenLine, Mic, ClipboardList } from 'lucide-react';
import { prisma } from '../../../../lib/prisma';
import { IELTS_MODULES, makeBookContentTemplate } from '../../../../lib/bookTemplates';
import { getLocalBooksByBookNumber } from '../../../../lib/localStore';
import BookNavigation from '../../../../components/BookNavigation';

type BookPageProps = {
    params: Promise<{ bookNumber: string }>;
    searchParams: Promise<{ module?: string; test?: string }>;
};

export default async function BookDetailsPage({ params, searchParams }: BookPageProps) {
    const { bookNumber } = await params;
    const { module: initialModule, test: initialTest } = await searchParams;
    const numericBook = Number(bookNumber);
    const isMockTest = numericBook >= 101;
    const validBook =
        Number.isInteger(numericBook) &&
        ((numericBook >= 9 && numericBook <= 20) || (numericBook >= 101 && numericBook <= 110));

    if (!validBook) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-5">
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center max-w-sm w-full shadow-sm">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                        <BookMarked size={28} className="text-slate-400" />
                    </div>
                    <h1 className="text-xl font-black text-slate-900">Book not found</h1>
                    <p className="mt-2 text-sm text-slate-500">Invalid book number.</p>
                    <Link href="/dashboard" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-700 transition">
                        <ChevronLeft size={15} />
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    let records: any[] = [];
    let recordSource: 'database' | 'local' | 'generated' = 'database';

    const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
        return await Promise.race([
            promise,
            new Promise<T>((_, reject) =>
                setTimeout(() => reject(new Error('Database request timed out')), timeoutMs)
            ),
        ]);
    };

    try {
        records = await withTimeout(
            prisma.cambridgeBook.findMany({
                where: { bookNumber: numericBook },
                orderBy: [{ testNumber: 'asc' }, { module: 'asc' }],
            }),
            2500
        );
    } catch {
        records = [];
    }

    if (!records.length) {
        const localRows = await getLocalBooksByBookNumber(numericBook);
        if (localRows.length) {
            records = localRows;
            recordSource = 'local';
        }
    }

    const maxTests = 4;
    const appendGeneratedRecord = (testNumber: number, moduleName: (typeof IELTS_MODULES)[number]) => {
        const content = makeBookContentTemplate(numericBook, testNumber, moduleName);
        if (isMockTest) {
            content.title = `Mock Test ${numericBook - 100} — ${moduleName} Test ${testNumber}`;
            content.introduction = 'Full exam simulation. Follow strict IELTS timing rules.';
        }
        records.push({
            id: `synthetic-${testNumber}-${moduleName}`,
            bookNumber: numericBook,
            testNumber,
            module: moduleName,
            content,
            audioUrl: content.audioUrl || null,
            youtubeId: null,
        });
    };

    if (!records.length) {
        recordSource = 'generated';
        for (let testNumber = 1; testNumber <= maxTests; testNumber += 1) {
            for (const moduleName of IELTS_MODULES) {
                appendGeneratedRecord(testNumber, moduleName);
            }
        }
    } else {
        const existingKeys = new Set(records.map((row) => `${row.testNumber}-${row.module}`));
        for (let testNumber = 1; testNumber <= maxTests; testNumber += 1) {
            for (const moduleName of IELTS_MODULES) {
                if (!existingKeys.has(`${testNumber}-${moduleName}`)) {
                    appendGeneratedRecord(testNumber, moduleName);
                }
            }
        }
    }

    const displayTitle = isMockTest ? `Mock Test ${numericBook - 100}` : `Cambridge Book ${numericBook}`;
    const testCount = new Set(records.map((r) => r.testNumber)).size;
    const hasRealAudio = records.some((r) => r.audioUrl);

    const moduleIcons: Record<string, React.ReactNode> = {
        Listening: <Headphones size={13} className="text-blue-600" />,
        Reading: <BookOpen size={13} className="text-emerald-600" />,
        Writing: <PenLine size={13} className="text-violet-600" />,
        Speaking: <Mic size={13} className="text-rose-600" />,
    };

    return (
        <div className="min-h-screen bg-[#f8f9fb]">
            {/* Top gradient accent bar */}
            <div className={`h-1.5 w-full ${isMockTest
                ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400'
                : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500'}`}
            />

            <div className="mx-auto max-w-7xl px-5 py-8">

                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-5 mb-8">
                    <div className="flex items-start gap-5">
                        <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl shadow-sm ${
                            isMockTest ? 'bg-amber-100' : 'bg-blue-100'
                        }`}>
                            {isMockTest
                                ? <FlaskConical size={26} className="text-amber-700" />
                                : <BookMarked size={26} className="text-blue-700" />
                            }
                        </div>
                        <div>
                            <p className={`text-[10px] font-black uppercase tracking-[0.22em] mb-1 ${
                                isMockTest ? 'text-amber-500' : 'text-blue-500'
                            }`}>
                                {isMockTest ? 'Full Exam Simulation' : 'Cambridge IELTS'}
                            </p>
                            <h1 className="text-3xl font-black text-slate-900 lg:text-4xl leading-tight">
                                {displayTitle}
                            </h1>
                            <p className="mt-1.5 text-sm text-slate-500">
                                {isMockTest
                                    ? 'Complete exam with all 4 modules — real Cambridge content.'
                                    : 'Official Cambridge content — practice with real-exam passages.'}
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition"
                    >
                        <ChevronLeft size={16} />
                        Dashboard
                    </Link>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: 'Tests', value: testCount, icon: <ClipboardList size={15} className="text-slate-400" /> },
                        { label: 'Audio', value: hasRealAudio ? 'Real MP3' : 'N/A', icon: <Headphones size={15} className="text-blue-400" /> },
                        { label: 'Modules', value: 4, icon: <BookOpen size={15} className="text-emerald-400" /> },
                        { label: 'Source', value: isMockTest ? 'Cambridge' : 'Official', icon: <BookMarked size={15} className="text-indigo-400" /> },
                    ].map((stat) => (
                        <div key={stat.label} className="flex items-center gap-3 rounded-xl bg-white border border-slate-100 px-4 py-3 shadow-sm">
                            {stat.icon}
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
                                <p className="text-sm font-black text-slate-800">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Module badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {IELTS_MODULES.map((m) => (
                        <span key={m} className="inline-flex items-center gap-1.5 rounded-full border border-slate-100 bg-white px-3 py-1 text-[11px] font-bold text-slate-600 shadow-sm">
                            {moduleIcons[m]}
                            {m}
                        </span>
                    ))}
                    {hasRealAudio && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
                            <Headphones size={11} />
                            Real Audio Included
                        </span>
                    )}
                </div>

                {recordSource === 'generated' && (
                    <div className="mb-5 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        No data yet — showing template content.
                    </div>
                )}

                <BookNavigation
                    bookNumber={numericBook}
                    records={records}
                    initialModule={initialModule}
                    initialTest={initialTest ? Number(initialTest) : undefined}
                />
            </div>
        </div>
    );
}
