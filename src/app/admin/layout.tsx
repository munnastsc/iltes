export const dynamic = 'force-dynamic';

import Link from 'next/link';
import LogoutButton from './LogoutButton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-950">
            <nav className="border-b border-slate-800 bg-slate-900 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-black text-white">ILTES Admin</span>
                    <Link href="/admin/orders" className="text-xs text-slate-400 hover:text-white transition">Orders</Link>
                    <Link href="/admin/books" className="text-xs text-slate-400 hover:text-white transition">Books</Link>
                </div>
                <LogoutButton />
            </nav>
            {children}
        </div>
    );
}
