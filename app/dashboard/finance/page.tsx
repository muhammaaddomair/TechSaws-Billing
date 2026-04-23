import { ChartNoAxesColumn } from "lucide-react";
import { FinanceRecordForms } from "@/components/forms/operation-forms";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getClientOptions, getFinanceSummary, getProjects } from "@/lib/data";
import { costCategories, labelFor, revenueCategories } from "@/lib/constants";
import { formatCurrency, formatDate, formatPercent } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function FinancePage() {
  const [clients, projects, finance] = await Promise.all([getClientOptions(), getProjects(), getFinanceSummary()]);
  const projectOptions = projects.map((project) => ({ id: project.id, name: project.name, clientId: project.clientId }));

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Revenue" value={formatCurrency(finance.revenueTotal)} />
        <Metric label="Costs" value={formatCurrency(finance.costTotal)} />
        <Metric label="Profit" value={formatCurrency(finance.profit)} tone={finance.profit >= 0 ? "success" : "danger"} />
        <Metric label="Margin" value={formatPercent(finance.marginPercent)} />
      </div>

      <Card className="rounded-[32px] bg-[#f7f2ec]">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
          <ChartNoAxesColumn className="h-3.5 w-3.5" />
          Revenue & Finance
        </div>
        <FinanceRecordForms clients={clients} projects={projectOptions} />
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold text-ink">Revenue records</h2><Badge>{finance.revenueRecords.length}</Badge></div>
          <div className="grid gap-3">
            {finance.revenueRecords.length === 0 ? <Empty text="No manual revenue records." /> : finance.revenueRecords.slice(0, 12).map((record) => (
              <div key={record.id} className="rounded-2xl bg-[#fbfaf8] p-4 text-sm">
                <div className="flex justify-between gap-3"><p className="font-semibold text-slate-900">{record.client.companyName}</p><p>{formatCurrency(record.amount)}</p></div>
                <p className="mt-2 text-slate-500">{labelFor(record.sourceType, revenueCategories)} · {record.frequency} · {formatDate(record.recognizedDate)}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold text-ink">Cost records</h2><Badge>{finance.costRecords.length}</Badge></div>
          <div className="grid gap-3">
            {finance.costRecords.length === 0 ? <Empty text="No cost records." /> : finance.costRecords.slice(0, 12).map((record) => (
              <div key={record.id} className="rounded-2xl bg-[#fbfaf8] p-4 text-sm">
                <div className="flex justify-between gap-3"><p className="font-semibold text-slate-900">{record.client?.companyName ?? record.vendor ?? "Internal cost"}</p><p>{formatCurrency(record.amount)}</p></div>
                <p className="mt-2 text-slate-500">{labelFor(record.costType, costCategories)} · {record.billingFrequency} · {formatDate(record.incurredDate)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold text-ink">Client profitability</h2><Badge>{finance.clients.length}</Badge></div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead><tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-500"><th className="px-4">Client</th><th className="px-4">Revenue</th><th className="px-4">Cost</th><th className="px-4">Profit</th><th className="px-4">Outstanding</th><th className="px-4">Health</th></tr></thead>
            <tbody>{finance.clients.map((client) => <tr key={client.id} className="bg-[#fbfaf8] text-sm"><td className="rounded-l-2xl px-4 py-4 font-semibold">{client.companyName}</td><td className="px-4 py-4">{formatCurrency(client.totalLifetimeRevenue)}</td><td className="px-4 py-4">{formatCurrency(client.totalCosts)}</td><td className="px-4 py-4">{formatCurrency(client.profit)}</td><td className="px-4 py-4">{formatCurrency(client.outstandingBalance)}</td><td className="rounded-r-2xl px-4 py-4"><Badge tone={client.healthBand === "Healthy" ? "success" : client.healthBand === "Watch" ? "warning" : "danger"}>{client.healthBand}</Badge></td></tr>)}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Metric({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "success" | "danger" }) {
  return <Card className="rounded-[28px] p-5"><div className="mb-3"><Badge tone={tone}>{label}</Badge></div><p className="text-2xl font-semibold text-slate-950">{value}</p></Card>;
}
function Empty({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">{text}</div>;
}
