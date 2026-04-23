export const clientTypes = [
  ["SERVICE", "Service client"],
  ["SAAS", "SaaS client"],
  ["INFRA_ONLY", "Infra-only client"],
  ["HYBRID", "Hybrid client"],
  ["ONE_TIME_PROJECT", "One-time project client"],
  ["RETAINER", "Retainer client"]
] as const;

export const clientStatuses = [
  ["ACTIVE", "Active"],
  ["INACTIVE", "Inactive"],
  ["WATCH", "Watch"],
  ["RISK", "Risk"],
  ["ARCHIVED", "Archived"]
] as const;

export const projectStatuses = [
  ["NOT_STARTED", "Not started"],
  ["PLANNING", "Planning"],
  ["IN_PROGRESS", "In progress"],
  ["ON_HOLD", "On hold"],
  ["AWAITING_CLIENT", "Awaiting client"],
  ["UNDER_REVIEW", "Under review"],
  ["DELIVERED", "Delivered"],
  ["COMPLETED", "Completed"],
  ["CANCELLED", "Cancelled"]
] as const;

export const priorities = [
  ["LOW", "Low"],
  ["MEDIUM", "Medium"],
  ["HIGH", "High"],
  ["CRITICAL", "Critical"]
] as const;

export const invoiceStatuses = [
  ["DRAFT", "Draft"],
  ["GENERATED", "Generated"],
  ["SENT", "Sent"],
  ["PARTIALLY_PAID", "Partially paid"],
  ["PAID", "Paid"],
  ["OVERDUE", "Overdue"],
  ["CANCELLED", "Cancelled"]
] as const;

export const paymentMethods = [
  ["BANK_TRANSFER", "Bank transfer"],
  ["CASH", "Cash"],
  ["JAZZCASH", "JazzCash"],
  ["EASYPAISA", "EasyPaisa"],
  ["STRIPE_MANUAL", "Stripe/manual external"],
  ["PAYPAL_MANUAL", "PayPal/manual external"],
  ["OTHER", "Other"]
] as const;

export const billingCycles = [
  ["MONTHLY", "Monthly"],
  ["YEARLY", "Yearly"],
  ["QUARTERLY", "Quarterly"],
  ["ONE_TIME", "One-time"],
  ["CUSTOM", "Custom"]
] as const;

export const revenueCategories = [
  ["PROJECT_SERVICE", "Project/service revenue"],
  ["SUBSCRIPTION", "Recurring revenue"],
  ["HOSTING_SERVER", "Hosting/server revenue"],
  ["DOMAIN", "Domain revenue"],
  ["MAILBOX_EMAIL", "Mailbox/email revenue"],
  ["MAINTENANCE_SUPPORT", "Maintenance/support revenue"],
  ["OTHER_RECURRING", "Other recurring charges"],
  ["OTHER_ONE_TIME", "Other one-time charges"]
] as const;

export const costCategories = [
  ["HOSTING_SERVER", "Hosting/server cost"],
  ["DOMAIN", "Domain cost"],
  ["MAILBOX_EMAIL", "Mailbox/email cost"],
  ["THIRD_PARTY_SOFTWARE", "Third-party software"],
  ["CONTRACTOR_INTERNAL", "Contractor/internal delivery"],
  ["PAYMENT_FEES", "Payment/transaction fees"],
  ["OTHER_OPERATIONAL", "Other operational cost"]
] as const;

export function labelFor(value: string | null | undefined, options: readonly (readonly [string, string])[]) {
  return options.find(([key]) => key === value)?.[1] ?? humanize(value ?? "Unknown");
}

export function humanize(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
