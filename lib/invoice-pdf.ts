import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { decimalToNumber } from "@/lib/business";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

const EMPTY_VALUE = "-";

export type InvoicePdfOverrides = {
  subtotal?: number | null;
  tax?: number | null;
  discount?: number | null;
  total?: number | null;
  previousPaid?: number | null;
};

type PdfMeta = {
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  iban?: string;
  taxPercent?: number;
};

const positions = {
  invoiceNumber: { x: 871, y: 204 },
  invoiceDate: { x: 871, y: 232 },
  dueDate: { x: 871, y: 276 },
  notes: { x: 63, y: 1062 },
  bankName: { x: 230, y: 1242 },
  accountName: { x: 230, y: 1273 },
  accountNumber: { x: 230, y: 1303 },
  iban: { x: 230, y: 1322 },
  subtotal: { x: 850, y: 852 },
  taxPercent: { x: 850, y: 900 },
  discount: { x: 850, y: 942 },
  total: { x: 850, y: 985 },
  item: {
    rowGap: 40,
    description: { x: 168, y: 415 },
    quantity: { x: 575, y: 416 },
    unitPrice: { x: 724, y: 414 },
    amount: { x: 914, y: 416 }
  }
};

function clampText(value: unknown, max = 200) {
  const text = (value ?? "").toString().replace(/\s+/g, " ").trim();
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max - 1)}...` : text;
}

function toFixed2(value: number) {
  const safe = Number.isFinite(value) ? value : 0;
  return safe.toFixed(2);
}

function valueOrDash(value: unknown, max = 200) {
  const text = clampText(value, max);
  return text || EMPTY_VALUE;
}

function parseMeta(value: string | null): PdfMeta {
  if (!value) return {};

  try {
    const parsed = JSON.parse(value) as PdfMeta;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function drawAt(args: {
  page: import("pdf-lib").PDFPage;
  font: import("pdf-lib").PDFFont;
  pageHeight: number;
  text: string;
  x: number;
  y: number;
  size?: number;
  maxWidth?: number;
}) {
  const { page, font, pageHeight, x, y } = args;
  const text = args.text.toString();
  if (!text.trim()) return;

  page.drawText(text, {
    x,
    y: pageHeight - y,
    size: args.size ?? 18,
    font,
    maxWidth: args.maxWidth
  });
}

function drawWrappedAt(args: {
  page: import("pdf-lib").PDFPage;
  font: import("pdf-lib").PDFFont;
  pageHeight: number;
  text: string;
  x: number;
  y: number;
  size?: number;
  maxWidth: number;
  lineHeight?: number;
  maxLines?: number;
}) {
  const size = args.size ?? 18;
  const lineHeight = args.lineHeight ?? size + 6;
  const words = args.text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (args.font.widthOfTextAtSize(next, size) <= args.maxWidth) {
      current = next;
      continue;
    }

    if (current) lines.push(current);
    current = word;
    if (args.maxLines && lines.length >= args.maxLines) break;
  }

  if (current && (!args.maxLines || lines.length < args.maxLines)) {
    lines.push(current);
  }

  lines.forEach((line, index) => {
    drawAt({
      page: args.page,
      font: args.font,
      pageHeight: args.pageHeight,
      text: line,
      x: args.x,
      y: args.y + index * lineHeight,
      size
    });
  });
}

export async function generateInvoicePdf(invoiceId: string, overrides: InvoicePdfOverrides = {}) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      client: { select: { name: true, companyName: true } },
      items: { orderBy: { createdAt: "asc" } }
    }
  });

  if (!invoice) {
    throw new Error("Invoice not found.");
  }

  const templatePath = path.join(process.cwd(), "assets", "techsaws-invoice-template.png");
  const templateBytes = await readFile(templatePath);

  const pdfDoc = await PDFDocument.create();
  const templateImage = await pdfDoc.embedPng(templateBytes);
  const page = pdfDoc.addPage([templateImage.width, templateImage.height]);
  const pageHeight = page.getHeight();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const meta = parseMeta(invoice.internalComments);

  page.drawImage(templateImage, {
    x: 0,
    y: 0,
    width: page.getWidth(),
    height: pageHeight
  });

  drawAt({ page, font, pageHeight, text: valueOrDash(invoice.invoiceNumber, 40), ...positions.invoiceNumber, size: 18 });
  drawAt({ page, font, pageHeight, text: invoice.issueDate ? formatDate(invoice.issueDate) : EMPTY_VALUE, ...positions.invoiceDate, size: 17 });
  drawAt({ page, font, pageHeight, text: invoice.dueDate ? formatDate(invoice.dueDate) : EMPTY_VALUE, ...positions.dueDate, size: 17 });

  invoice.items.forEach((item, index) => {
    const rowOffset = index * positions.item.rowGap;
    const description = [item.title, item.description].filter(Boolean).join(" - ");

    drawWrappedAt({
      page,
      font,
      pageHeight,
      text: valueOrDash(description, 120),
      x: positions.item.description.x,
      y: positions.item.description.y + rowOffset,
      size: 17,
      maxWidth: 360,
      lineHeight: 18,
      maxLines: 2
    });
    drawAt({ page, font, pageHeight, text: String(item.quantity ?? ""), x: positions.item.quantity.x, y: positions.item.quantity.y + rowOffset, size: 17 });
    drawAt({ page, font, pageHeight, text: toFixed2(decimalToNumber(item.unitPrice)), x: positions.item.unitPrice.x, y: positions.item.unitPrice.y + rowOffset, size: 17 });
    drawAt({ page, font, pageHeight, text: toFixed2(decimalToNumber(item.total)), x: positions.item.amount.x, y: positions.item.amount.y + rowOffset, size: 17 });
  });

  const subtotal = overrides.subtotal ?? decimalToNumber(invoice.totalAmount);
  const discount = overrides.discount ?? decimalToNumber(invoice.discountAmount);
  const computedTotal = Math.max(0, subtotal + decimalToNumber(invoice.taxAmount) - discount);
  const total = overrides.total ?? computedTotal;
  const taxPercent =
    typeof meta.taxPercent === "number" && Number.isFinite(meta.taxPercent)
      ? meta.taxPercent
      : subtotal > 0
        ? (decimalToNumber(invoice.taxAmount) / subtotal) * 100
        : 0;

  drawAt({ page, font: fontBold, pageHeight, text: toFixed2(subtotal), ...positions.subtotal, size: 18 });
  drawAt({ page, font: fontBold, pageHeight, text: `${toFixed2(taxPercent)}%`, ...positions.taxPercent, size: 18 });
  drawAt({ page, font: fontBold, pageHeight, text: toFixed2(discount), ...positions.discount, size: 18 });
  drawAt({ page, font: fontBold, pageHeight, text: toFixed2(total), ...positions.total, size: 19 });

  drawWrappedAt({ page, font, pageHeight, text: valueOrDash(invoice.notes, 260), ...positions.notes, size: 17, maxWidth: 500, lineHeight: 22, maxLines: 5 });
  drawAt({ page, font, pageHeight, text: valueOrDash(meta.bankName, 80), ...positions.bankName, size: 16 });
  drawAt({ page, font, pageHeight, text: valueOrDash(meta.accountName, 80), ...positions.accountName, size: 16 });
  drawAt({ page, font, pageHeight, text: valueOrDash(meta.accountNumber, 80), ...positions.accountNumber, size: 16 });
  drawAt({ page, font, pageHeight, text: valueOrDash(meta.iban, 100), ...positions.iban, size: 16 });

  const bytes = await pdfDoc.save();
  const filename = `invoice-${(invoice.invoiceNumber ?? invoice.id).toString().slice(-12)}.pdf`;

  return { bytes: Buffer.from(bytes), filename };
}
