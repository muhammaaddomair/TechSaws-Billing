import { z } from "zod";

const optionalCuid = z.preprocess((value) => (value === "" ? undefined : value), z.string().cuid().optional());
const optionalDate = z.preprocess((value) => (value === "" ? undefined : value), z.coerce.date().optional());
const money = z.coerce.number().min(0, "Amount cannot be negative.");

export const projectSchema = z.object({
  id: optionalCuid,
  clientId: z.string().cuid("Select a client."),
  name: z.string().trim().min(2, "Project name is required."),
  type: z.enum(["SOFTWARE_PRODUCT", "CLIENT_SERVICE", "INTERNAL_TOOL", "SUBSCRIPTION_SETUP", "INFRASTRUCTURE", "SUPPORT", "OTHER"]),
  status: z.enum(["NOT_STARTED", "PLANNING", "IN_PROGRESS", "ON_HOLD", "AWAITING_CLIENT", "UNDER_REVIEW", "DELIVERED", "COMPLETED", "CANCELLED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  description: z.string().trim().optional(),
  scopeSummary: z.string().trim().optional(),
  startDate: optionalDate,
  deadline: optionalDate,
  revisedDeadline: optionalDate,
  deliveryDate: optionalDate,
  budgetAmount: money,
  internalCostEstimate: money,
  progress: z.coerce.number().int().min(0).max(100),
  blockers: z.string().trim().optional()
});

export const milestoneSchema = z.object({
  id: optionalCuid,
  projectId: z.string().cuid(),
  title: z.string().trim().min(2, "Milestone title is required."),
  description: z.string().trim().optional(),
  dueDate: optionalDate,
  status: z.enum(["TODO", "IN_PROGRESS", "DONE", "BLOCKED", "CANCELLED"]),
  owner: z.string().trim().optional()
});

export const paymentSchema = z
  .object({
    id: optionalCuid,
    clientId: z.string().cuid("Select a client."),
    paymentDate: z.coerce.date(),
    amountReceived: z.coerce.number().positive("Payment amount must be greater than zero."),
    currency: z.string().trim().default("USD"),
    method: z.enum(["BANK_TRANSFER", "CASH", "JAZZCASH", "EASYPAISA", "STRIPE_MANUAL", "PAYPAL_MANUAL", "OTHER"]),
    referenceNumber: z.string().trim().optional(),
    notes: z.string().trim().optional(),
    allocations: z
      .array(
        z.object({
          invoiceId: z.string().cuid(),
          amount: z.coerce.number().min(0)
        })
      )
      .default([])
  })
  .superRefine((value, ctx) => {
    const allocated = value.allocations.reduce((sum, allocation) => sum + allocation.amount, 0);
    if (allocated > value.amountReceived) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["allocations"],
        message: "Allocated amount cannot exceed the payment received."
      });
    }
  });

export const paymentRequestSchema = z
  .object({
    clientId: z.string().cuid("Select a client."),
    projectId: z.string().cuid().optional().or(z.literal("")),
    createProject: z.coerce.boolean().default(false),
    projectName: z.string().trim().optional(),
    projectType: z.enum(["SOFTWARE_PRODUCT", "CLIENT_SERVICE", "INTERNAL_TOOL", "SUBSCRIPTION_SETUP", "INFRASTRUCTURE", "SUPPORT", "OTHER"]).default("CLIENT_SERVICE"),
    paymentType: z.enum(["PRODUCT", "SUPPORT", "MONTHLY_SUBSCRIPTION"]),
    amount: z.coerce.number().positive("Amount must be greater than zero."),
    advancePercent: z.coerce.number().min(0).max(100).optional(),
    advanceAmount: z.coerce.number().min(0).optional(),
    dueDate: z.coerce.date(),
    notes: z.string().trim().optional()
  })
  .superRefine((value, ctx) => {
    if (value.createProject && !value.projectName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["projectName"],
        message: "Project name is required."
      });
    }

    if (value.paymentType === "PRODUCT" && !value.projectId && !value.createProject) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["projectId"],
        message: "Select or add a product project."
      });
    }

    if ((value.advanceAmount ?? 0) > value.amount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["advanceAmount"],
        message: "Advance amount cannot exceed the total amount."
      });
    }
  });

export const paymentStatusSchema = z
  .object({
    invoiceId: z.string().cuid(),
    status: z.enum(["PENDING", "PARTIALLY_PAID", "PAID"]),
    amountReceived: z.coerce.number().min(0).default(0),
    method: z.enum(["BANK_TRANSFER", "CASH", "JAZZCASH", "EASYPAISA", "STRIPE_MANUAL", "PAYPAL_MANUAL", "OTHER"]).default("BANK_TRANSFER"),
    referenceNumber: z.string().trim().optional()
  })
  .superRefine((value, ctx) => {
    if (value.status === "PARTIALLY_PAID" && value.amountReceived <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amountReceived"],
        message: "Enter the partial payment received."
      });
    }
  });

export const assetSchema = z.object({
  id: optionalCuid,
  clientId: z.string().cuid("Select a client."),
  name: z.string().trim().min(2, "Asset name is required."),
  type: z.enum(["DOMAIN", "VPS_SERVER", "CLOUD_HOSTING", "MAILBOX_EMAIL", "SAAS_SUBSCRIPTION", "SSL", "MAINTENANCE_SUPPORT", "OTHER_RECURRING_SERVICE"]),
  provider: z.string().trim().optional(),
  providerAccountReference: z.string().trim().optional(),
  purchaseDate: optionalDate,
  renewalDate: optionalDate,
  billingFrequency: z.enum(["MONTHLY", "YEARLY", "ONE_TIME", "QUARTERLY", "CUSTOM"]),
  internalCost: money,
  clientCharge: money,
  status: z.enum(["ACTIVE", "INACTIVE", "EXPIRING", "EXPIRED", "CANCELLED"]),
  autoRenewal: z.coerce.boolean().default(false),
  alertDays: z.coerce.number().int().min(1).max(365).default(30),
  notes: z.string().trim().optional()
});

export const renewalSchema = z.object({
  assetId: z.string().cuid(),
  dateRenewed: z.coerce.date(),
  newRenewalDate: z.coerce.date(),
  cost: money,
  clientCharge: money,
  notes: z.string().trim().optional()
});

export const taskSchema = z.object({
  id: optionalCuid,
  title: z.string().trim().min(2, "Task title is required."),
  description: z.string().trim().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "BLOCKED", "DONE", "CANCELLED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  dueDate: optionalDate,
  clientId: z.string().cuid().optional().or(z.literal("")),
  projectId: z.string().cuid().optional().or(z.literal(""))
});

export const noteSchema = z.object({
  entityType: z.enum(["CLIENT", "PROJECT", "INVOICE", "PAYMENT", "ASSET", "TASK"]),
  entityId: z.string().min(1),
  body: z.string().trim().min(2, "Note is required.")
});

export const revenueRecordSchema = z.object({
  id: optionalCuid,
  clientId: z.string().cuid("Select a client."),
  projectId: z.string().cuid().optional().or(z.literal("")),
  sourceType: z.enum(["PROJECT_SERVICE", "SUBSCRIPTION", "HOSTING_SERVER", "DOMAIN", "MAILBOX_EMAIL", "MAINTENANCE_SUPPORT", "OTHER_RECURRING", "OTHER_ONE_TIME"]),
  reference: z.string().trim().optional(),
  frequency: z.enum(["MONTHLY", "YEARLY", "ONE_TIME", "QUARTERLY", "CUSTOM"]),
  amount: z.coerce.number().positive("Revenue amount must be greater than zero."),
  status: z.enum(["PLANNED", "RECOGNIZED", "PENDING", "CANCELLED"]),
  recognizedDate: z.coerce.date(),
  notes: z.string().trim().optional()
});

export const costRecordSchema = z.object({
  id: optionalCuid,
  clientId: z.string().cuid().optional().or(z.literal("")),
  projectId: z.string().cuid().optional().or(z.literal("")),
  assetId: z.string().cuid().optional().or(z.literal("")),
  costType: z.enum(["HOSTING_SERVER", "DOMAIN", "MAILBOX_EMAIL", "THIRD_PARTY_SOFTWARE", "CONTRACTOR_INTERNAL", "PAYMENT_FEES", "OTHER_OPERATIONAL"]),
  amount: z.coerce.number().positive("Cost amount must be greater than zero."),
  billingFrequency: z.enum(["MONTHLY", "YEARLY", "ONE_TIME", "QUARTERLY", "CUSTOM"]),
  vendor: z.string().trim().optional(),
  incurredDate: z.coerce.date(),
  notes: z.string().trim().optional()
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type MilestoneInput = z.infer<typeof milestoneSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type PaymentRequestInput = z.infer<typeof paymentRequestSchema>;
export type PaymentStatusInput = z.infer<typeof paymentStatusSchema>;
export type AssetInput = z.infer<typeof assetSchema>;
export type RenewalInput = z.infer<typeof renewalSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type RevenueRecordInput = z.infer<typeof revenueRecordSchema>;
export type CostRecordInput = z.infer<typeof costRecordSchema>;
