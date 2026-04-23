import { Prisma } from "@/generated/prisma";

export type HealthBand = "Healthy" | "Watch" | "Risk";

export type HealthInput = {
  overdueInvoices: number;
  overdueAmount: number;
  delayedProjects: number;
  marginPercent: number;
};

export function decimalToNumber(value: Prisma.Decimal | number | null | undefined) {
  return Number(value ?? 0);
}

export function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function monthlyEquivalent(amount: number, frequency?: string | null) {
  if (frequency === "YEARLY") {
    return roundMoney(amount / 12);
  }

  if (frequency === "QUARTERLY") {
    return roundMoney(amount / 3);
  }

  if (frequency === "ONE_TIME") {
    return 0;
  }

  return roundMoney(amount);
}

export function annualEquivalent(amount: number, frequency?: string | null) {
  if (frequency === "YEARLY") {
    return roundMoney(amount);
  }

  if (frequency === "QUARTERLY") {
    return roundMoney(amount * 4);
  }

  if (frequency === "ONE_TIME") {
    return 0;
  }

  return roundMoney(amount * 12);
}

export function marginPercent(revenue: number, cost: number) {
  if (revenue <= 0) {
    return 0;
  }

  return roundMoney(((revenue - cost) / revenue) * 100);
}

export function invoiceBalance(total: number, paid: number) {
  return Math.max(0, roundMoney(total - paid));
}

export function isInvoiceOverdue(dueDate: Date | string | null | undefined, balance: number, today = new Date()) {
  if (!dueDate || balance <= 0) {
    return false;
  }

  return new Date(dueDate).getTime() < startOfDay(today).getTime();
}

export function isProjectDelayed(
  deadline: Date | string | null | undefined,
  status: string,
  today = new Date()
) {
  if (!deadline || ["COMPLETED", "DELIVERED", "CANCELLED"].includes(status)) {
    return false;
  }

  return new Date(deadline).getTime() < startOfDay(today).getTime();
}

export function daysBetween(from: Date | string, to = new Date()) {
  const start = startOfDay(new Date(from)).getTime();
  const end = startOfDay(to).getTime();

  return Math.ceil((start - end) / 86_400_000);
}

export function calculateHealthScore(input: HealthInput) {
  let score = 100;
  score -= input.overdueInvoices * 15;
  score -= Math.min(30, Math.floor(input.overdueAmount / 500) * 5);
  score -= input.delayedProjects * 12;

  if (input.marginPercent > 0 && input.marginPercent < 20) {
    score -= 15;
  }

  if (input.marginPercent < 0) {
    score -= 25;
  }

  const normalized = Math.max(0, Math.min(100, score));
  const band: HealthBand = normalized >= 75 ? "Healthy" : normalized >= 45 ? "Watch" : "Risk";

  return { score: normalized, band };
}

export function startOfDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

export function currentMonthRange(today = new Date()) {
  return {
    start: new Date(today.getFullYear(), today.getMonth(), 1),
    end: new Date(today.getFullYear(), today.getMonth() + 1, 1)
  };
}
