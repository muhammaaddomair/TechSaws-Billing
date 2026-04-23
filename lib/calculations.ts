type DevelopmentCalculationInput = Array<{
  quantity: number;
  unitPrice: number | { toString(): string };
}>;

type CalculationSummary = {
  totalAmount: number;
  taxAmount: number;
  finalAmount: number;
};

function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
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
