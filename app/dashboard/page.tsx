import Link from "next/link";
import type { Route } from "next";
import { BarChart3, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getDashboardOverview } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const overview = await getDashboardOverview();
  const graphMax = Math.max(
    overview.paymentGraph.expectedFromInvoices,
    overview.paymentGraph.receivedPayments,
    overview.paymentGraph.expectedFromOrders,
    1
  );

  return (
    <div className="grid gap-6">
      <Card className="rounded-[32px] bg-[#f7f2ec]">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
              <TrendingUp className="h-3.5 w-3.5" />
              Overview
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-ink">Expected payments, received payments, and order value.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              This graph compares expected payment from invoices, manually received payments, and expected payments from project orders.
            </p>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <PaymentBar label="Expected from invoices" value={overview.paymentGraph.expectedFromInvoices} max={graphMax} className="bg-slate-950" />
          <PaymentBar label="Received payments" value={overview.paymentGraph.receivedPayments} max={graphMax} className="bg-emerald-600" />
          <PaymentBar label="Expected from orders" value={overview.paymentGraph.expectedFromOrders} max={graphMax} className="bg-cyan-700" />
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard label="Total clients" value={overview.clientCount.toString()} />
        <SummaryCard label="Active projects" value={overview.activeProjects.toString()} />
        <SummaryCard label="Monthly revenue" value={formatCurrency(overview.monthlyRevenue)} />
        <SummaryCard label="MRR" value={formatCurrency(overview.monthlyRecurringRevenue)} />
        <SummaryCard label="Outstanding" value={formatCurrency(overview.outstandingInvoices)} tone={overview.outstandingInvoices > 0 ? "warning" : "success"} />
        <SummaryCard label="Overdue invoices" value={overview.overdueInvoicesCount.toString()} tone={overview.overdueInvoicesCount > 0 ? "danger" : "success"} />
        <SummaryCard label="Monthly costs" value={formatCurrency(overview.monthlyCosts)} />
        <SummaryCard label="Estimated profit" value={formatCurrency(overview.estimatedMonthlyProfit)} tone={overview.estimatedMonthlyProfit >= 0 ? "success" : "danger"} />
        <SummaryCard label="Upcoming renewals" value={overview.upcomingRenewalsCount.toString()} />
        <SummaryCard label="Projects at risk" value={overview.delayedProjectsCount.toString()} tone={overview.delayedProjectsCount > 0 ? "danger" : "success"} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="rounded-[32px] bg-[#f7f2ec]">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                <TrendingUp className="h-3.5 w-3.5" />
                Business Overview
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-ink">Revenue, costs, profit, and operational risk.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Values are computed from invoices, payments, assets, revenue records, and costs. No payment gateway is assumed.
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Panel title="Most profitable clients">
              {overview.mostProfitableClients.length === 0 ? <Empty text="No client revenue yet." /> : overview.mostProfitableClients.map((client) => (
                <MiniRow key={client.id} href={`/dashboard/clients/${client.id}` as Route} label={client.companyName} value={formatCurrency(client.profit)} />
              ))}
            </Panel>
            <Panel title="Overdue / outstanding">
              {overview.clientsWithOverduePayments.length === 0 ? <Empty text="No outstanding balances." /> : overview.clientsWithOverduePayments.map((client) => (
                <MiniRow key={client.id} href={`/dashboard/clients/${client.id}` as Route} label={client.companyName} value={formatCurrency(client.outstandingBalance)} danger />
              ))}
            </Panel>
            <Panel title="Low margin clients">
              {overview.lowMarginClients.length === 0 ? <Empty text="No margin risk detected." /> : overview.lowMarginClients.map((client) => (
                <MiniRow key={client.id} href={`/dashboard/clients/${client.id}` as Route} label={client.companyName} value={formatCurrency(client.profit)} />
              ))}
            </Panel>
          </div>
        </Card>

        <MoneyComparisonCard
          due={overview.outstandingInvoices}
          probable={overview.paymentGraph.expectedFromOrders}
          received={overview.paymentGraph.receivedPayments}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <SectionHeader title="Upcoming renewals" count={overview.upcomingRenewals.length} />
          <div className="grid gap-3">
            {overview.upcomingRenewals.length === 0 ? <Empty text="No renewals due soon." /> : overview.upcomingRenewals.map((asset) => (
              <MiniRow key={asset.id} href={`/dashboard/assets/${asset.id}` as Route} label={`${asset.name} · ${asset.client.companyName}`} value={asset.renewalDate ? formatDate(asset.renewalDate) : "No date"} />
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader title="Deadlines due soon" count={overview.deadlinesDueSoon.length} />
          <div className="grid gap-3">
            {overview.deadlinesDueSoon.length === 0 ? <Empty text="Nothing urgent." /> : overview.deadlinesDueSoon.map((item) => (
              <MiniRow key={`${item.type}-${item.id}`} href={item.href as Route} label={`${item.type}: ${item.title}`} value={item.overdue ? `${Math.abs(item.daysRemaining)}d overdue` : `${item.daysRemaining}d left`} danger={item.overdue} />
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader title="Recent payments" count={overview.recentPayments.length} />
          <div className="grid gap-3">
            {overview.recentPayments.length === 0 ? <Empty text="No payments logged yet." /> : overview.recentPayments.map((payment) => (
              <MiniRow key={payment.id} href="/dashboard/payments" label={`${payment.client.companyName} · ${payment.method}`} value={formatCurrency(payment.amountReceived)} />
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <SectionHeader title="Recent internal activity" count={overview.recentActivity.length} />
        <div className="grid gap-3">
          {overview.recentActivity.length === 0 ? <Empty text="No activity yet." /> : overview.recentActivity.map((activity) => (
            <div key={activity.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#fbfaf8] px-4 py-3 text-sm">
              <div>
                <p className="font-semibold text-slate-900">{activity.message}</p>
                <p className="text-slate-500">{activity.entityType} · {activity.action}</p>
              </div>
              <span className="text-slate-500">{formatDate(activity.createdAt)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SummaryCard({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "success" | "warning" | "danger" }) {
  return (
    <Card className="rounded-[28px] p-5">
      <div className="mb-3"><Badge tone={tone}>{label}</Badge></div>
      <p className="text-2xl font-semibold text-slate-950">{value}</p>
    </Card>
  );
}

function PaymentBar({ label, value, max, className }: { label: string; value: number; max: number; className: string }) {
  const width = Math.max(4, Math.round((value / max) * 100));

  return (
    <div className="rounded-[28px] bg-white p-5 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <p className="text-sm font-semibold text-slate-950">{formatCurrency(value)}</p>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${className}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[28px] bg-white p-5 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
      <h3 className="mb-4 text-base font-semibold text-ink">{title}</h3>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <Badge>{count}</Badge>
    </div>
  );
}

function MiniRow({ href, label, value, danger }: { href: Route | string; label: string; value: string; danger?: boolean }) {
  return (
    <Link className="flex items-center justify-between gap-3 rounded-2xl bg-[#fbfaf8] px-4 py-3 text-sm transition hover:bg-white" href={href as Route}>
      <span className="font-medium text-slate-700">{label}</span>
      <span className={danger ? "font-semibold text-rose-700" : "font-semibold text-slate-950"}>{value}</span>
    </Link>
  );
}

function MoneyComparisonCard({ received, due, probable }: { received: number; due: number; probable: number }) {
  const total = received + due + probable;
  const receivedDeg = total > 0 ? (received / total) * 360 : 120;
  const dueDeg = total > 0 ? (due / total) * 360 : 120;
  const probableDeg = total > 0 ? 360 - receivedDeg - dueDeg : 120;
  const dueStart = receivedDeg;
  const probableStart = receivedDeg + dueDeg;
  const projectedTotal = due + probable;
  const gap = Math.max(0, projectedTotal - received);
  const chartBackground = `conic-gradient(#34d399 0deg ${receivedDeg}deg, #fb7185 ${dueStart}deg ${probableStart}deg, #67e8f9 ${probableStart}deg ${probableStart + probableDeg}deg)`;

  return (
    <Card className="rounded-[32px] bg-black text-white">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">
        <BarChart3 className="h-3.5 w-3.5" />
        Payment graph
      </div>
      <div className="grid items-center gap-5 sm:grid-cols-[180px_1fr] xl:grid-cols-1">
        <div className="relative mx-auto h-44 w-44 rounded-full p-4" style={{ background: chartBackground }}>
          <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-black text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Total</span>
            <span className="mt-1 text-xl font-semibold text-white">{formatCurrency(total)}</span>
          </div>
        </div>
        <div className="grid gap-3">
          <RoundGraphLegend color="bg-emerald-400" label="Received payments" value={received} />
          <RoundGraphLegend color="bg-rose-400" label="Due payments" value={due} />
          <RoundGraphLegend color="bg-cyan-300" label="Probable client money" value={probable} />
        </div>
      </div>
      <div className="mt-5 grid gap-3 rounded-[24px] bg-white/10 p-4">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-slate-300">Due + probable</span>
          <span className="font-semibold text-white">{formatCurrency(projectedTotal)}</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-slate-300">Difference from received</span>
          <span className="font-semibold text-cyan-100">{formatCurrency(gap)}</span>
        </div>
      </div>
    </Card>
  );
}

function RoundGraphLegend({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/10 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full ${color}`} />
        <span className="text-sm font-semibold text-slate-200">{label}</span>
      </div>
      <span className="text-sm font-semibold text-white">{formatCurrency(value)}</span>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">{text}</div>;
}
