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
            const result = await generateInvoice({ invoiceId });
            setMessage(result.message);
          });
        }}
        variant="secondary"
      >
        {isPending ? "Generating..." : "Generate Invoice"}
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
