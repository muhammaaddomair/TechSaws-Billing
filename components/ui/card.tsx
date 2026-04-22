import { cn } from "@/lib/utils";

export function Card({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-3xl border border-white/70 bg-white/90 p-6 shadow-panel", className)}>
      {children}
    </section>
  );
}
