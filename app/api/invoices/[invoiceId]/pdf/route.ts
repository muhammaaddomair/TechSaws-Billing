import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { assertDatabaseUrl } from "@/lib/env";
import { generateInvoicePdf } from "@/lib/invoice-pdf";

export const runtime = "nodejs";

function parseQueryNumber(search: URLSearchParams, key: string) {
  const raw = search.get(key);
  if (!raw) return null;
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : null;
}

export async function GET(request: Request, { params }: { params: Promise<{ invoiceId: string }> }) {
  await requireUser();
  assertDatabaseUrl();

  const { invoiceId } = await params;
  const url = new URL(request.url);
  const search = url.searchParams;

  const { bytes, filename } = await generateInvoicePdf(invoiceId, {
    subtotal: parseQueryNumber(search, "subtotal"),
    tax: parseQueryNumber(search, "tax"),
    discount: parseQueryNumber(search, "discount"),
    total: parseQueryNumber(search, "total"),
    previousPaid: parseQueryNumber(search, "previousPaid")
  });

  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`
    }
  });
}
