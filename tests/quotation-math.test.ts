import { describe, it, expect } from "vitest";

interface QuotationLineItem {
  description: string;
  qty: number;
  unitPrice?: number;
  amount: number;
}

function calculateQuotationMath(
  lineItems: QuotationLineItem[],
  taxRate: number = 0,
  depositPercentage: number = 50
) {
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const tax = taxRate > 0 ? Math.round(subtotal * taxRate * 100) / 100 : 0;
  const total = subtotal + tax;
  const amountDueToStart = Math.round(total * (depositPercentage / 100));

  return { subtotal, tax, total, depositPercentage, amountDueToStart };
}

describe("Quotation Financial Calculations", () => {
  it("calculates subtotal from line items accurately", () => {
    const lineItems: QuotationLineItem[] = [
      { description: "System Architecture & API Design", qty: 1, amount: 80000 },
      { description: "Next.js Frontend & Interactive Client Portal", qty: 1, amount: 120000 },
      { description: "M-Pesa Express & Daraja Integration", qty: 1, amount: 45000 },
    ];

    const result = calculateQuotationMath(lineItems, 0, 50);

    expect(result.subtotal).toBe(245000);
    expect(result.tax).toBe(0);
    expect(result.total).toBe(245000);
    expect(result.amountDueToStart).toBe(122500);
  });

  it("handles standard 50% deposit calculations", () => {
    const lineItems: QuotationLineItem[] = [
      { description: "Cloud Infrastructure Setup", qty: 1, amount: 100000 },
    ];

    const result = calculateQuotationMath(lineItems, 0, 50);

    expect(result.total).toBe(100000);
    expect(result.depositPercentage).toBe(50);
    expect(result.amountDueToStart).toBe(50000);
  });

  it("handles custom deposit percentages (e.g. 70% upfront or 30% kickoff)", () => {
    const lineItems: QuotationLineItem[] = [
      { description: "Hardware Supply & Installation", qty: 1, amount: 350000 },
    ];

    const result70 = calculateQuotationMath(lineItems, 0, 70);
    expect(result70.amountDueToStart).toBe(245000);

    const result30 = calculateQuotationMath(lineItems, 0, 30);
    expect(result30.amountDueToStart).toBe(105000);
  });

  it("calculates VAT / Tax rate correctly when specified", () => {
    const lineItems: QuotationLineItem[] = [
      { description: "Enterprise Consultation", qty: 1, amount: 100000 },
    ];

    // 16% Kenya VAT
    const resultWithVat = calculateQuotationMath(lineItems, 0.16, 50);

    expect(resultWithVat.subtotal).toBe(100000);
    expect(resultWithVat.tax).toBe(16000);
    expect(resultWithVat.total).toBe(116000);
    expect(resultWithVat.amountDueToStart).toBe(58000);
  });

  it("rounds amounts cleanly for odd fractions", () => {
    const lineItems: QuotationLineItem[] = [
      { description: "Custom UI Component", qty: 3, amount: 33333 },
    ];

    const result = calculateQuotationMath(lineItems, 0, 50);

    expect(result.subtotal).toBe(33333);
    expect(result.amountDueToStart).toBe(16667);
  });
});
