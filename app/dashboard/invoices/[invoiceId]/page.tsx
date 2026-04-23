import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkInvoicePaidButton } from "@/components/dashboard/generate-invoice-button";
import { DownloadInvoicePdfButton } from "@/components/dashboard/download-invoice-pdf-button";
import { PrintButton } from "@/components/dashboard/print-button";
import { InvoiceEmailButton } from "@/components/forms/manual-invoice-modal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getInvoiceDetail } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function InvoiceDetailPage({
  params
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;
  const invoice = await getInvoiceDetail(invoiceId);

  if (!invoice) {
    notFound();
  }

  return (
    <div className="grid gap-6">
      <div className="print-hidden flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link className="text-sm font-medium text-accent" href="/dashboard/invoices">
            Back to invoices
          </Link>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Invoice #{invoice.id.slice(-8).toUpperCase()}</h2>
        </div>
        <div className="grid w-40 gap-2 sm:w-auto sm:grid-flow-col sm:auto-cols-max sm:items-start">
          <DownloadInvoicePdfButton invoiceId={invoice.id} invoiceNumber={invoice.invoiceNumber} variant="secondary" />
          <InvoiceEmailButton invoiceId={invoice.id} />
          <PrintButton />
          {invoice.status === "GENERATED" ? <MarkInvoicePaidButton invoiceId={invoice.id} /> : null}
        </div>
      </div>

      <Card className="print:shadow-none">
        <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.26em] text-slate-500">Invoice</p>
            <h1 className="mt-3 text-4xl font-semibold text-ink">TechSaws Billing</h1>
            <p className="mt-3 max-w-xl text-sm text-slate-600">
              Print-ready invoice for {invoice.type.toLowerCase()} billing.
            </p>
          </div>
          <div className="text-right">
            <Badge tone={invoice.status === "PAID" ? "success" : invoice.status === "GENERATED" ? "warning" : "default"}>
              {invoice.status}
            </Badge>
            <p className="mt-4 text-sm text-slate-500">Issued {formatDate(invoice.createdAt)}</p>
            <p className="mt-1 text-sm text-slate-500">Type: {invoice.type}</p>
          </div>
        </div>

        <div className="mb-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Billed To</p>
            <h2 className="mt-3 text-xl font-semibold text-slate-900">{invoice.client.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{invoice.client.companyName}</p>
            <p className="text-sm text-slate-600">{invoice.client.email}</p>
          </div>
          <div className="rounded-2xl bg-mist p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Summary</p>
            <div className="mt-4 grid gap-3 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(invoice.totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Service Tax</span>
                <span>{formatCurrency(invoice.taxAmount)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-300 pt-3 text-base font-semibold text-slate-900">
                <span>Total Due</span>
                <span>{formatCurrency(invoice.finalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200">
          <table className="min-w-full">
            <thead className="bg-slate-100 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Qty</th>
                <th className="px-6 py-4">Unit Price</th>
                <th className="px-6 py-4 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-sm text-slate-700">
              {invoice.items.length === 0 ? (
                <tr>
                  <td className="px-6 py-10 text-center text-slate-500" colSpan={5}>
                    No invoice items recorded yet.
                  </td>
                </tr>
              ) : (
                invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 font-medium text-slate-900">{item.title}</td>
                    <td className="px-6 py-4">{item.description ?? "-"}</td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">{formatCurrency(item.total)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
