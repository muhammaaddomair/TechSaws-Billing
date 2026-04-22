import { History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getActivityLogs } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const logs = await getActivityLogs();

  return (
    <div className="grid gap-6">
      <Card className="rounded-[32px] bg-[#f7f2ec]">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
          <History className="h-3.5 w-3.5" />
          Activity / Logs
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-ink">Internal audit feed for key operational changes.</h2>
      </Card>

      <Card>
        <div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold text-ink">Timeline</h2><Badge>{logs.length}</Badge></div>
        <div className="grid gap-3">
          {logs.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">No activity recorded yet.</div> : logs.map((log) => (
            <div key={log.id} className="rounded-2xl bg-[#fbfaf8] p-4 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><p className="font-semibold text-slate-900">{log.message}</p><p className="mt-1 text-slate-500">{log.entityType} · {log.action} · {log.actor?.name ?? log.actor?.email ?? "System"}</p></div>
                <span className="text-slate-500">{formatDate(log.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
