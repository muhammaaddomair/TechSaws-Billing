"use client";

import { use, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";

type InvoiceDetailResponse = {
  id: string;
  invoiceNumber: string;
  status: string;
  type: string;
  issueDate: string;
  dueDate: string | null;
  notes: string;
  client: { name: string; companyName: string; email?: string };
  items: Array<{
    id: string;
    title: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  totals: {
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    previousPaid: number;
    balance: number;
  };
};

function toMoney(value: number) {
  if (!Number.isFinite(value)) return "0.00";
  return value.toFixed(2);
}

function parseMoney(input: string) {
  const cleaned = input.replace(/[^\d.-]/g, "");
  const value = Number.parseFloat(cleaned);
  return Number.isFinite(value) ? value : 0;
}

async function downloadPdf(url: string, filename: string) {
  const response = await fetch(url, { method: "GET", credentials: "same-origin" });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Failed to generate PDF (HTTP ${response.status}).`);
  }
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(blobUrl);
}

export default function InvoicePdfEditorPage({ params }: { params: Promise<{ invoiceId: string }> }) {
  const { invoiceId } = use(params);
  const [data, setData] = useState<InvoiceDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [subtotal, setSubtotal] = useState("0.00");
  const [tax, setTax] = useState("0.00");
  const [discount, setDiscount] = useState("0.00");
  const [previousPaid, setPreviousPaid] = useState("0.00");

  useEffect(() => {
    let cancelled = false;
    setError(null);

    fetch(`/api/invoices/${invoiceId}/detail`, { credentials: "same-origin" })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Failed to load invoice (HTTP ${res.status}).`);
        }
        return (await res.json()) as InvoiceDetailResponse;
      })
      .then((json) => {
        if (cancelled) return;
        setData(json);
        setSubtotal(toMoney(json.totals.subtotal));
        setTax(toMoney(json.totals.tax));
        setDiscount(toMoney(json.totals.discount));
        setPreviousPaid(toMoney(json.totals.previousPaid));
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load invoice.");
      });

    return () => {
      cancelled = true;
    };
  }, [invoiceId]);

  const computed = useMemo(() => {
    const s = parseMoney(subtotal);
    const t = parseMoney(tax);
    const d = parseMoney(discount);
    const paid = Math.max(0, parseMoney(previousPaid));
    const total = Math.max(0, s + t - d);
    const balance = Math.max(0, total - paid);
    const paymentState = paid <= 0 ? "Unpaid" : balance <= 0 ? "Paid" : "Partial";
    return { s, t, d, paid, total, balance, paymentState };
  }, [subtotal, tax, discount, previousPaid]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link className="text-sm font-medium text-accent" href={`/dashboard/invoices/${invoiceId}`}>
            Back to invoice
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-ink">PDF Editor</h1>
          <p className="mt-1 text-sm text-slate-600">Edit totals and download the invoice PDF from the template.</p>
        </div>
        <div className="flex gap-2">
          <Button
            disabled={!data || isPending}
            variant="secondary"
            onClick={() => {
              if (!data) return;
              startTransition(async () => {
                setError(null);
                const q = new URLSearchParams({
                  subtotal: computed.s.toFixed(2),
                  tax: computed.t.toFixed(2),
                  discount: computed.d.toFixed(2),
                  previousPaid: computed.paid.toFixed(2),
                  total: computed.total.toFixed(2)
                });
                try {
                  await downloadPdf(
                    `/api/invoices/${invoiceId}/pdf?${q.toString()}`,
                    `invoice-${data.invoiceNumber?.slice(-12) || invoiceId.slice(-8)}.pdf`
                  );
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Failed to download PDF.");
                }
              });
            }}
          >
            {isPending ? "Preparing..." : "Download PDF"}
          </Button>
        </div>
      </div>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <Card>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Invoice</p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold text-slate-900">Number:</span> {data?.invoiceNumber ?? "-"}
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold text-slate-900">Issued:</span> {data ? formatDate(data.issueDate) : "-"}
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold text-slate-900">Due:</span> {data?.dueDate ? formatDate(data.dueDate) : "-"}
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold text-slate-900">Payment:</span> {computed.paymentState}
            </p>
          </div>
          <div className="grid gap-2">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Client</p>
            <p className="text-sm font-semibold text-slate-900">{data?.client.companyName ?? "-"}</p>
            <p className="text-sm text-slate-700">{data?.client.name ?? "-"}</p>
            <p className="text-sm text-slate-700">{data?.client.email ?? ""}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Totals (editable)</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <span className="text-xs text-slate-500">Subtotal</span>
                <Input inputMode="decimal" value={subtotal} onChange={(e) => setSubtotal(e.target.value)} />
              </div>
              <div className="grid gap-1">
                <span className="text-xs text-slate-500">Tax</span>
                <Input inputMode="decimal" value={tax} onChange={(e) => setTax(e.target.value)} />
              </div>
              <div className="grid gap-1">
                <span className="text-xs text-slate-500">Discount</span>
                <Input inputMode="decimal" value={discount} onChange={(e) => setDiscount(e.target.value)} />
              </div>
              <div className="grid gap-1">
                <span className="text-xs text-slate-500">Previous payment</span>
                <Input inputMode="decimal" value={previousPaid} onChange={(e) => setPreviousPaid(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Computed</p>
            <div className="grid gap-2 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>Total</span>
                <span className="font-semibold text-slate-900">{toMoney(computed.total)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Balance</span>
                <span className="font-semibold text-slate-900">{toMoney(computed.balance)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
