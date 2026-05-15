import './globals.css';
import type { Metadata } from 'next';
import ChatWidget from '../components/ChatWidget';

export const metadata: Metadata = {
    title: 'Sathi AI - IELTS Master Coach',
    description: 'Learn IELTS with Cambridge 1-20 tricks and grammar.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="bn" suppressHydrationWarning>
            <body suppressHydrationWarning className="antialiased bg-slate-50 text-slate-900">
                {children}
                <ChatWidget />
            </body>
        </html>
    );
}
