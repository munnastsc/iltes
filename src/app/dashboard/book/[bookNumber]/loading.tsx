export default function Loading() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
            <p className="mt-4 text-sm font-semibold text-slate-600 animate-pulse">
                Loading Book Workspace...
            </p>
            <p className="mt-1 text-xs text-slate-400">বইয়ের কন্টেন্ট লোড হচ্ছে, দয়া করে অপেক্ষা করুন।</p>
        </div>
    );
}
