"use client";

import { Button } from "@/components/ui/button";

export function PdfEditorButton({ invoiceId }: { invoiceId: string }) {
  return (
    <Button
      variant="secondary"
      onClick={() => {
        window.open(`/dashboard/invoices/${invoiceId}/pdf-editor`, "_blank");
      }}
    >
      PDF Editor
    </Button>
  );
}

