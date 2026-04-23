"use client";

import { useState, useTransition } from "react";
import { generateInvoice, markInvoicePaid } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export function GenerateInvoiceButton({
  invoiceId,
  disabled = false
}: {
  invoiceId: string;
  disabled?: boolean;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="grid gap-2">
      <Button
        disabled={disabled || isPending}
        onClick={() => {
          startTransition(async () => {
            // 1) Download the PDF without popups/new tabs (more reliable).
            try {
              const response = await fetch(`/api/invoices/${invoiceId}/pdf`, {
                method: "GET",
                credentials: "same-origin"
              });

              if (!response.ok) {
                const text = await response.text().catch(() => "");
                throw new Error(text || `Failed to generate PDF (HTTP ${response.status}).`);
              }

              const blob = await response.blob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `invoice-${invoiceId.slice(-8).toUpperCase()}.pdf`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
            } catch (error) {
              setMessage(error instanceof Error ? error.message : "Failed to generate PDF.");
              return;
            }

            // 2) Then update invoice status in DB (existing behavior).
            const result = await generateInvoice({ invoiceId });
            setMessage(result.message);
          });
        }}
        variant="secondary"
      >
        {isPending ? "Generating..." : "Generate PDF"}
      </Button>
      {message ? <p className="text-xs text-slate-500">{message}</p> : null}
    </div>
  );
}

export function MarkInvoicePaidButton({ invoiceId }: { invoiceId: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="grid gap-2">
      <Button
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const result = await markInvoicePaid(invoiceId);
            setMessage(result.message);
          });
        }}
      >
        {isPending ? "Updating..." : "Mark as Paid"}
      </Button>
      {message ? <p className="text-xs text-slate-500">{message}</p> : null}
    </div>
  );
}
