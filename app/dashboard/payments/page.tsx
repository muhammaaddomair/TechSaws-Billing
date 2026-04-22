import { CreditCard } from "lucide-react";
import { PaymentRequestModal, PaymentStatusControl } from "@/components/forms/operation-forms";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getClientOptions, getInvoices, getProjectOptions } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

function dayDiff(date: Date | null) {
  if (!date) {
    return null;
  }

  const today = new Date();
  const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.ceil((startDate.getTime() - startToday.getTime()) / 86_400_000);
}

export default async function PaymentsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawFilters = await searchParams;
  const search = typeof rawFilters.search === "string" ? rawFilters.search : "";
  const paymentState = typeof rawFilters.paymentState === "string" ? rawFilters.paymentState : "";
  const clientId = typeof rawFilters.clientId === "string" ? rawFilters.clientId : "";
  const type = typeof rawFilters.type === "string" ? rawFilters.type : "";
  const [clients, projects, invoices] = await Promise.all([
    getClientOptions(),
    getProjectOptions(),
    getInvoices({
      search: search || undefined,
      clientId: clientId || undefined,
      type: type as never,
      paymentState: paymentState as never
    })
  ]);

  return (
    <div className="grid gap-6">
      <Card className="rounded-[24px] bg-[#f7f2ec]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
              <CreditCard className="h-3.5 w-3.5" />
              Payments
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">All payments</h2>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <form className="grid gap-3 sm:grid-cols-[minmax(180px,1fr)_170px_170px_170px_auto]" method="get">
              <input
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-accent"
                defaultValue={search}
                name="search"
                placeholder="Search client, project, invoice"
              />
              <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-accent" defaultValue={clientId} name="clientId">
                <option value="">All clients</option>
                {clients.map((client) => <option key={client.id} value={client.id}>{client.companyName}</option>)}
              </select>
              <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-accent" defaultValue={type} name="type">
                <option value="">All types</option>
                <option value="DEVELOPMENT">Product</option>
                <option value="MAINTENANCE">Support</option>
                <option value="SUBSCRIPTION">Monthly subscription</option>
              </select>
              <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-accent" defaultValue={paymentState} name="paymentState">
                <option value="">All statuses</option>
                <option value="PENDING">Pending</option>
                <option value="PARTIAL">Partial</option>
                <option value="PAID">Paid</option>
              </select>
              <button className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white" type="submit">Search</button>
            </form>
            <PaymentRequestModal clients={clients} projects={projects} />
          </div>
        </div>
      </Card>

      <Card className="rounded-[24px]">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-ink">Payments list</h2>
          <Badge>{invoices.length} total</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                <th className="px-4">Client / Project</th>
                <th className="px-4">Type</th>
                <th className="px-4">Expected</th>
                <th className="px-4">Paid</th>
                <th className="px-4">Due</th>
                <th className="px-4">Due date</th>
                <th className="px-4">Payment status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr><td className="px-4 py-10 text-center text-sm text-slate-500" colSpan={7}>No payments match the current filters.</td></tr>
              ) : invoices.map((invoice) => {
                const days = dayDiff(invoice.dueDate);
                const overdue = invoice.balanceAmount > 0 && days !== null && days < 0;
                const partial = invoice.amountPaid > 0 && invoice.balanceAmount > 0;

                return (
                  <tr key={invoice.id} className="bg-[#fbfaf8] text-sm text-slate-700">
                    <td className="rounded-l-2xl px-4 py-4">
                      <div className="font-semibold text-slate-950">{invoice.companyName}</div>
                      <div className="text-slate-500">{invoice.projectName ?? invoice.invoiceNumber}</div>
                    </td>
                    <td className="px-4 py-4">{invoice.type === "DEVELOPMENT" ? "Product" : invoice.type === "MAINTENANCE" ? "Support" : invoice.type === "SUBSCRIPTION" ? "Monthly subscription" : invoice.type}</td>
                    <td className="px-4 py-4 font-semibold text-slate-950">{formatCurrency(invoice.finalAmount)}</td>
                    <td className="px-4 py-4"><Badge tone={invoice.balanceAmount <= 0 ? "success" : partial ? "info" : "default"}>{formatCurrency(invoice.amountPaid)}</Badge></td>
                    <td className="px-4 py-4"><Badge tone={overdue ? "danger" : invoice.balanceAmount > 0 ? "warning" : "success"}>{formatCurrency(invoice.balanceAmount)}</Badge></td>
                    <td className="px-4 py-4">
                      {invoice.dueDate ? formatDate(invoice.dueDate) : "-"}
                      {overdue ? <div className="mt-1 text-xs font-semibold text-rose-600">Due by {Math.abs(days ?? 0)} days</div> : null}
                    </td>
                    <td className="rounded-r-2xl px-4 py-4">
                      <PaymentStatusControl invoice={invoice} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
