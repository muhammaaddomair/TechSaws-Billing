import Link from "next/link";
import type { Route } from "next";
import { CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getDeadlines } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DeadlinesPage() {
  const deadlines = await getDeadlines();
  const overdue = deadlines.filter((item) => item.overdue);
  const dueSoon = deadlines.filter((item) => item.dueSoon && !item.overdue);

  return (
    <div className="grid gap-6">
      <Card className="rounded-[32px] bg-[#f7f2ec]">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
          <CalendarClock className="h-3.5 w-3.5" />
          Deadlines
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-ink">Project, milestone, invoice, asset, and task dates in one place.</h2>
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
        <DeadlinePanel title="Overdue" items={overdue} />
        <DeadlinePanel title="Next 7 days" items={dueSoon} />
        <DeadlinePanel title="All upcoming" items={deadlines.filter((item) => !item.overdue).slice(0, 12)} />
      </div>
    </div>
  );
}

function DeadlinePanel({ title, items }: { title: string; items: Awaited<ReturnType<typeof getDeadlines>> }) {
  return (
    <Card>
      <div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold text-ink">{title}</h2><Badge>{items.length}</Badge></div>
      <div className="grid gap-3">
        {items.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">Nothing here.</div> : items.map((item) => (
          <Link className="rounded-2xl bg-[#fbfaf8] p-4 text-sm transition hover:bg-white" href={item.href as Route} key={`${title}-${item.type}-${item.id}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><p className="font-semibold text-slate-900">{item.type}: {item.title}</p><p className="mt-1 text-slate-500">{item.clientName}{item.projectName ? ` · ${item.projectName}` : ""}</p></div>
              <Badge tone={item.overdue ? "danger" : item.dueSoon ? "warning" : "default"}>{item.overdue ? `${Math.abs(item.daysRemaining)}d overdue` : `${item.daysRemaining}d`}</Badge>
            </div>
            <p className="mt-3 text-slate-500">{formatDate(item.date)} · {item.status}</p>
          </Link>
        ))}
      </div>
    </Card>
  );
}
