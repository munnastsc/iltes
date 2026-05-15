import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-6xl px-6 pb-20 pt-8">
                <nav className="flex items-center justify-between border-b border-slate-200 pb-5">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">ILTES Sathi AI</p>
                        <h1 className="mt-2 text-2xl font-bold text-slate-900">IELTS Preparation Workspace</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/admin/books" className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                            Admin
                        </Link>
                        <Link href="/dashboard" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                            Open Dashboard
                        </Link>
                    </div>
                </nav>

                <section className="grid gap-6 py-12 lg:grid-cols-2">
                    <div>
                        <p className="text-sm font-medium text-blue-700">Cambridge 1-20 Structured System</p>
                        <h2 className="mt-3 text-4xl font-bold leading-tight text-slate-900">Build consistent IELTS progress every day.</h2>
                        <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                            Book, test, and module-wise structured practice with AI guidance and admin-managed content publishing.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link href="/dashboard" className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">
                                Start Practice
                            </Link>
                            <Link href="/dashboard/payment" className="rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700">
                                Subscription
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5">
                        <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm font-medium text-slate-700">Daily Focus</p>
                            <p className="mt-1 text-2xl font-bold text-slate-900">Listening + Writing</p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs uppercase tracking-[0.1em] text-slate-500">Books Ready</p>
                                <p className="mt-1 text-3xl font-bold text-slate-900">20</p>
                            </div>
                            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs uppercase tracking-[0.1em] text-slate-500">Modules</p>
                                <p className="mt-1 text-3xl font-bold text-slate-900">4</p>
                            </div>
                        </div>
                        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                            Subscription, content publishing, and book-level part-by-part flow are now connected.
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
