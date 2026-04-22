import { cn } from "@/lib/utils";

export function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error ? <span className={cn("text-xs text-rose-600")}>{error}</span> : null}
    </label>
  );
}
