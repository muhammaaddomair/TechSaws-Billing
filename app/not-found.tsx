import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-panel">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Not Found</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">The page you requested does not exist.</h1>
        <p className="mt-3 text-sm text-slate-600">Return to the dashboard to keep managing clients and invoices.</p>
        <Link
          className="mt-6 inline-flex rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white"
          href="/dashboard/clients"
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
