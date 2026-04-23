import { z } from "zod";

export const invoiceItemInputSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2, "Title is required."),
  description: z.string().trim().optional(),
  quantity: z.coerce.number().int().positive("Quantity must be at least 1."),
  unitPrice: z.coerce.number().positive("Unit price must be greater than zero.")
});

export const invoiceDraftSchema = z
  .object({
    id: z.string().cuid().optional(),
    clientId: z.string().cuid("Select a client."),
    projectId: z.string().cuid().optional().or(z.literal("")),
    type: z.enum(["DEVELOPMENT", "SERVICE", "HOSTING", "DOMAIN", "MAILBOX", "MAINTENANCE", "OTHER"]),
    issueDate: z.preprocess((value) => (value === "" ? undefined : value), z.coerce.date().optional()),
    dueDate: z.preprocess((value) => (value === "" ? undefined : value), z.coerce.date().optional()),
    notes: z.string().trim().optional(),
    items: z.array(invoiceItemInputSchema).default([])
  })
  .superRefine((value, ctx) => {
    if (value.type === "DEVELOPMENT" && value.items.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Add at least one invoice item for a development invoice.",
        path: ["items"]
      });
    }
  });

export const generateInvoiceSchema = z.object({
  invoiceId: z.string().cuid()
});

export const manualInvoiceItemSchema = z.object({
  description: z.string().trim().min(2, "Description is required."),
  quantity: z.coerce.number().positive("Quantity must be greater than zero."),
  unitPrice: z.coerce.number().min(0, "Unit price cannot be negative."),
  amount: z.coerce.number().min(0, "Amount cannot be negative.")
});

export const manualInvoiceSchema = z.object({
  id: z.preprocess((value) => (value === "" ? undefined : value), z.string().cuid().optional()),
  invoiceNumber: z.string().trim().min(1, "Invoice number is required."),
  clientName: z.string().trim().min(2, "Client name is required."),
  email: z.string().trim().email("A valid client email is required.").optional().or(z.literal("")),
  companyName: z.string().trim().min(2, "Company name is required."),
  issueDate: z.preprocess((value) => (value === "" ? undefined : value), z.coerce.date().optional()),
  dueDate: z.preprocess((value) => (value === "" ? undefined : value), z.coerce.date().optional()),
  notes: z.string().trim().optional(),
  bankName: z.string().trim().optional(),
  accountName: z.string().trim().optional(),
  accountNumber: z.string().trim().optional(),
  iban: z.string().trim().optional(),
  subtotal: z.coerce.number().min(0, "Subtotal cannot be negative."),
  taxPercent: z.coerce.number().min(0, "Tax cannot be negative."),
  discountAmount: z.coerce.number().min(0, "Discount cannot be negative."),
  totalAmount: z.coerce.number().min(0, "Total cannot be negative."),
  items: z.array(manualInvoiceItemSchema).min(1, "Add at least one invoice item.")
});

export const invoiceFiltersSchema = z.object({
  search: z.string().optional(),
  clientId: z.string().optional(),
  type: z.enum(["DEVELOPMENT", "SERVICE", "HOSTING", "DOMAIN", "MAILBOX", "MAINTENANCE", "OTHER"]).optional(),
  status: z.enum(["DRAFT", "GENERATED", "SENT", "PARTIALLY_PAID", "PAID", "OVERDUE", "CANCELLED"]).optional(),
  paymentState: z.enum(["PAID", "PENDING", "PARTIAL"]).optional()
});

export type InvoiceDraftInput = z.infer<typeof invoiceDraftSchema>;
export type ManualInvoiceInput = z.infer<typeof manualInvoiceSchema>;
