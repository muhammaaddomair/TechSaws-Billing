import { z } from "zod";

export const clientSchema = z.object({
  id: z.preprocess((value) => (value === "" ? undefined : value), z.string().cuid().optional()),
  name: z.string().trim().min(2, "Client name is required."),
  email: z.string().trim().email("A valid email is required.").optional().or(z.literal("")),
  companyName: z.string().trim().min(2, "Company name is required."),
  contactPerson: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  type: z
    .enum(["SERVICE", "SAAS", "INFRA_ONLY", "HYBRID", "ONE_TIME_PROJECT", "RETAINER"])
    .default("SERVICE"),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED", "WATCH", "RISK"]).default("ACTIVE"),
  contractStatus: z.enum(["ACTIVE", "PENDING", "EXPIRED", "NONE"]).default("NONE"),
  startDate: z.preprocess((value) => (value === "" ? undefined : value), z.coerce.date().optional()),
  tagsText: z.string().trim().optional()
});

export const subscriptionSchema = z.object({
  id: z.string().cuid().optional(),
  clientId: z.string().cuid(),
  serviceName: z.string().trim().min(2, "Service name is required."),
  monthlyCost: z.coerce.number().positive("Monthly cost must be greater than zero."),
  billingCycle: z.enum(["MONTHLY", "YEARLY"])
});

export type ClientInput = z.infer<typeof clientSchema>;
export type SubscriptionInput = z.infer<typeof subscriptionSchema>;
