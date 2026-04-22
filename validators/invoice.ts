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
    type: z.enum(["DEVELOPMENT", "SUBSCRIPTION", "SERVICE", "HOSTING", "DOMAIN", "MAILBOX", "MAINTENANCE", "OTHER"]),
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

export const manualInvoiceSchema = z
  .object({
    id: z.string().cuid().optional(),
    clientName: z.string().trim().min(2, "Client name is required."),
    email: z.string().trim().email("A valid client email is required.").optional().or(z.literal("")),
    companyName: z.string().trim().min(2, "Company name is required."),
    totalProjectCost: z.coerce.number().positive("Total project cost must be greater than zero."),
    advancePercent: z.coerce.number().min(0).max(100).optional(),
    advanceAmount: z.coerce.number().min(0).optional(),
    timeline: z.string().trim().optional(),
    projectType: z.string().trim().optional(),
    chargeType: z.enum(["SUBSCRIPTION", "DEVELOPMENT", "MAINTENANCE"]),
    billingMode: z.enum(["ONE_TIME", "MONTHLY"]),
    paidAmount: z.coerce.number().min(0).default(0),
    issueDate: z.preprocess((value) => (value === "" ? undefined : value), z.coerce.date().optional()),
    dueDate: z.preprocess((value) => (value === "" ? undefined : value), z.coerce.date().optional()),
    notes: z.string().trim().optional()
  })
  .superRefine((value, ctx) => {
    const hasPercent = value.advancePercent !== undefined && !Number.isNaN(value.advancePercent);
    const hasAmount = value.advanceAmount !== undefined && !Number.isNaN(value.advanceAmount);

    if (!hasPercent && !hasAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter either advance percentage or advance amount.",
        path: ["advancePercent"]
      });
    }

    if ((value.advanceAmount ?? 0) > value.totalProjectCost) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Advance amount cannot exceed total project cost.",
        path: ["advanceAmount"]
      });
    }
  });

export const invoiceFiltersSchema = z.object({
  search: z.string().optional(),
  clientId: z.string().optional(),
  type: z.enum(["DEVELOPMENT", "SUBSCRIPTION", "SERVICE", "HOSTING", "DOMAIN", "MAILBOX", "MAINTENANCE", "OTHER"]).optional(),
  status: z.enum(["DRAFT", "GENERATED", "SENT", "PARTIALLY_PAID", "PAID", "OVERDUE", "CANCELLED"]).optional(),
  paymentState: z.enum(["PAID", "PENDING", "PARTIAL"]).optional()
});

export type InvoiceDraftInput = z.infer<typeof invoiceDraftSchema>;
export type ManualInvoiceInput = z.infer<typeof manualInvoiceSchema>;
