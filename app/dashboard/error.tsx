"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDatabaseConfigError =
    error.message.includes("DATABASE_URL") || error.message.includes("Environment variable not found");

  return (
    <main className="grid min-h-[60vh] place-items-center px-4 py-12">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-panel">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Configuration Error</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          {isDatabaseConfigError ? "Database connection is not configured." : "The dashboard could not load."}
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          {isDatabaseConfigError
            ? "Add your PostgreSQL connection string before opening the billing dashboard."
            : error.message}
        </p>

        {isDatabaseConfigError ? (
          <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Required setup</p>
            <p className="mt-2">1. Create a `.env.local` file in the project root.</p>
            <p className="mt-1">
              2. Add `DATABASE_URL=&quot;postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public&quot;`
            </p>
            <p className="mt-1">3. Run `npm run prisma:migrate` and then restart `npm run dev`.</p>
          </div>
        ) : null}

        <div className="mt-6">
          <Button onClick={reset} variant="ghost">
            Try again
          </Button>
        </div>
      </div>
    </main>
  );
}
