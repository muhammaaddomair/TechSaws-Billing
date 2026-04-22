import Link from "next/link";
import type { Route } from "next";
import { ReceiptText } from "lucide-react";
import { InvoiceEmailButton, InvoicePdfLink, ManualInvoiceModal } from "@/components/forms/manual-invoice-modal";
import { PaymentStatusControl } from "@/components/forms/operation-forms";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getDashboardOverview, getInvoices } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { invoiceFiltersSchema } from "@/validators/invoice";

export const dynamic = "force-dynamic";

export default async function InvoicesPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawFilters = await searchParams;
  const parsed = invoiceFiltersSchema.safeParse({
    search: typeof rawFilters.search === "string" && rawFilters.search ? rawFilters.search : undefined,
    type: typeof rawFilters.type === "string" && rawFilters.type ? rawFilters.type : undefined,
    paymentState: typeof rawFilters.paymentState === "string" && rawFilters.paymentState ? rawFilters.paymentState : undefined
  });
  const filters = parsed.success ? parsed.data : {};
  const [invoices, overview] = await Promise.all([getInvoices(filters), getDashboardOverview()]);

  return (
    <div className="grid gap-6">
      <Card className="rounded-[32px] bg-[#f7f2ec]">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
              <ReceiptText className="h-3.5 w-3.5" />
              Invoices
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-ink">All created invoices</h2>
            <p className="mt-2 text-sm text-slate-600">Create invoices manually, then track paid, pending, and partial amounts.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <form className="grid flex-1 gap-3 sm:grid-cols-[1.2fr_0.8fr_0.8fr_auto_auto]" method="get">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Search
              <input
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent"
                defaultValue={filters.search ?? ""}
                name="search"
                placeholder="Invoice, client, company"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Type
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent"
                defaultValue={filters.type ?? ""}
                name="type"
              >
                <option value="">All types</option>
                <option value="DEVELOPMENT">Software</option>
                <option value="SUBSCRIPTION">Subscription</option>
                <option value="MAINTENANCE">Support charges</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Payment
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent"
                defaultValue={filters.paymentState ?? ""}
                name="paymentState"
              >
                <option value="">All states</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="PARTIAL">Partial</option>
              </select>
            </label>
            <button className="h-10 self-end rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white" type="submit">
              Apply
            </button>
            <Link className="flex h-10 items-center justify-center self-end rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700" href="/dashboard/invoices">
              Reset
            </Link>
          </form>
          <div className="flex justify-end">
            <ManualInvoiceModal />
          </div>
        </div>
      </Card>

      <Card className="rounded-[32px]">
        <div className="mb-5 grid gap-4 sm:grid-cols-4">
          <StatPill label="Invoices" value={overview.invoiceCount.toString()} />
          <StatPill label="Paid" value={overview.paidCount.toString()} />
          <StatPill label="Pending" value={invoices.filter((invoice) => invoice.amountPaid <= 0 && invoice.balanceAmount > 0).length.toString()} />
          <StatPill label="Partial" value={invoices.filter((invoice) => invoice.amountPaid > 0 && invoice.balanceAmount > 0).length.toString()} />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                <th className="px-4">Invoice</th>
                <th className="px-4">Client</th>
                <th className="px-4">Project / Type</th>
                <th className="px-4">Paid</th>
                <th className="px-4">Due</th>
                <th className="px-4">Total</th>
                <th className="px-4">Due date</th>
                <th className="px-4">Payment status</th>
                <th className="px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-center text-sm text-slate-500" colSpan={9}>
                    No invoices match the current filters.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => {
                  const paid = invoice.balanceAmount <= 0;
                  return (
                    <tr key={invoice.id} className="rounded-2xl bg-[#fbfaf8] text-sm text-slate-700">
                      <td className="rounded-l-2xl px-4 py-4 font-semibold text-slate-900">
                        <Link href={`/dashboard/invoices/${invoice.id}` as Route}>{invoice.invoiceNumber}</Link>
                        <div className="mt-1 text-xs text-slate-500">{formatDate(invoice.issueDate)}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium">{invoice.clientName}</div>
                        <div className="text-slate-500">{invoice.companyName}</div>
                      </td>
                      <td className="px-4 py-4">
                        {invoice.type}
                        <div className="text-slate-500">{invoice.projectName ?? "-"}</div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge tone={paid ? "success" : "default"}>{formatCurrency(invoice.amountPaid)}</Badge>
                      </td>
                      <td className="px-4 py-4">
                        <Badge tone={invoice.isOverdue ? "danger" : invoice.balanceAmount > 0 ? "warning" : "success"}>{formatCurrency(invoice.balanceAmount)}</Badge>
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-900">{formatCurrency(invoice.finalAmount)}</td>
                      <td className="px-4 py-4">{invoice.dueDate ? formatDate(invoice.dueDate) : "-"}</td>
                      <td className="px-4 py-4"><PaymentStatusControl invoice={invoice} /></td>
                      <td className="rounded-r-2xl px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <ManualInvoiceModal
                            mode="edit"
                            defaultValues={{
                              id: invoice.id,
                              clientName: invoice.clientName,
                              email: invoice.clientEmail.endsWith("@internal.local") ? "" : invoice.clientEmail,
                              companyName: invoice.companyName,
                              totalProjectCost: invoice.projectCost || invoice.totalAmount,
                              advancePercent: invoice.advancePercent ?? 0,
                              advanceAmount: invoice.advanceAmount,
                              timeline: invoice.timeline ?? "",
                              projectType: invoice.projectName ?? invoice.type,
                              chargeType: invoice.type === "SUBSCRIPTION" ? "SUBSCRIPTION" : invoice.type === "MAINTENANCE" ? "MAINTENANCE" : "DEVELOPMENT",
                              billingMode: invoice.type === "SUBSCRIPTION" ? "MONTHLY" : "ONE_TIME",
                              paidAmount: invoice.amountPaid,
                              issueDate: invoice.issueDate,
                              dueDate: invoice.dueDate ?? undefined
                            }}
                          />
                          <InvoicePdfLink href={`/dashboard/invoices/${invoice.id}`} />
                          <InvoiceEmailButton invoiceId={invoice.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] bg-[#f7f2ec] px-5 py-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}
