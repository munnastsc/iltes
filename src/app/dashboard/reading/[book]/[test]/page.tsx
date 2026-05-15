import { notFound } from 'next/navigation';
import { getReadingTest } from '../../../../../lib/readingData';
import ReadingSession from '../../../../../components/ReadingSession';

interface Props {
    params: Promise<{ book: string; test: string }>;
}

export default async function ReadingTestPage({ params }: Props) {
    const { book, test } = await params;
    const data = getReadingTest(Number(book), Number(test));
    if (!data) notFound();
    return <ReadingSession data={data} />;
}
