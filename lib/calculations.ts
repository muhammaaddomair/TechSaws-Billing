import { type BillingCycle } from "@/generated/prisma";

type DevelopmentCalculationInput = Array<{
  quantity: number;
  unitPrice: number | { toString(): string };
}>;
type SubscriptionCalculationInput = Array<{
  serviceName: string;
  monthlyCost: number | { toString(): string };
  billingCycle: BillingCycle;
}>;

type CalculationSummary = {
  totalAmount: number;
  taxAmount: number;
  finalAmount: number;
};

function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function subscriptionLabel(billingCycle: BillingCycle) {
  return billingCycle === "YEARLY" ? "Yearly subscription" : "Monthly subscription";
}

export function calculateDevelopmentInvoice(items: DevelopmentCalculationInput): CalculationSummary {
  const totalAmount = roundCurrency(
    items.reduce((sum, item) => sum + item.quantity * Number(item.unitPrice), 0)
  );

  return {
    totalAmount,
    taxAmount: 0,
    finalAmount: totalAmount
  };
}

export function calculateSubscriptionInvoice(subscriptions: SubscriptionCalculationInput) {
  const totalAmount = roundCurrency(
    subscriptions.reduce((sum, subscription) => sum + Number(subscription.monthlyCost), 0)
  );
  const taxAmount = roundCurrency(totalAmount * 0.25);
  const finalAmount = roundCurrency(totalAmount + taxAmount);

  return {
    totalAmount,
    taxAmount,
    finalAmount,
    items: subscriptions.map((subscription) => ({
      title: subscription.serviceName,
      description: subscriptionLabel(subscription.billingCycle),
      quantity: 1,
      unitPrice: roundCurrency(Number(subscription.monthlyCost)),
      total: roundCurrency(Number(subscription.monthlyCost))
    }))
  };
}
