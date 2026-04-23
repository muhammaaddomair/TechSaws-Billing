"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

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

export function DownloadInvoicePdfButton({
  invoiceId,
  invoiceNumber,
  variant = "ghost"
}: {
  invoiceId: string;
  invoiceNumber?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="grid gap-1">
      <Button
        disabled={isPending}
        variant={variant}
        onClick={() => {
          startTransition(async () => {
            setMessage(null);
            try {
              const filename = `invoice-${(invoiceNumber ?? invoiceId).toString().slice(-12)}.pdf`;
              await downloadPdf(`/api/invoices/${invoiceId}/pdf`, filename);
            } catch (error) {
              setMessage(error instanceof Error ? error.message : "Failed to download PDF.");
            }
          });
        }}
      >
        {isPending ? "Downloading..." : "Download PDF"}
      </Button>
      {message ? <p className="text-xs text-rose-600">{message}</p> : null}
    </div>
  );
}

