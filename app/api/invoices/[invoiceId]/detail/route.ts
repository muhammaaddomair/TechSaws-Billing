import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { decimalToNumber } from "@/lib/business";
import { assertDatabaseUrl } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ invoiceId: string }> }) {
  await requireUser();
  assertDatabaseUrl();

  const { invoiceId } = await params;

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      client: { select: { name: true, companyName: true, email: true } },
      items: { orderBy: { createdAt: "asc" } },
      allocations: { select: { amount: true, payment: { select: { paymentDate: true, method: true, referenceNumber: true } } } }
    }
  });

  if (!invoice) {
    return NextResponse.json({ message: "Invoice not found." }, { status: 404 });
  }

  const previousPaid = invoice.allocations.reduce((sum, allocation) => sum + decimalToNumber(allocation.amount), 0);

  return NextResponse.json({
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    status: invoice.status,
    type: invoice.type,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    notes: invoice.notes ?? "",
    client: invoice.client,
    items: invoice.items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description ?? "",
      quantity: item.quantity,
      unitPrice: decimalToNumber(item.unitPrice),
      total: decimalToNumber(item.total)
    })),
    totals: {
      subtotal: decimalToNumber(invoice.totalAmount),
      tax: decimalToNumber(invoice.taxAmount),
      discount: decimalToNumber(invoice.discountAmount),
      total: decimalToNumber(invoice.finalAmount),
      previousPaid,
      balance: Math.max(0, decimalToNumber(invoice.finalAmount) - previousPaid)
    }
  });
}

