import { describe, it, expect } from "vitest";
import { generateQuotationPdfBuffer, QuotationData } from "@/lib/quotation-pdf";

describe("Quotation PDF Generation (Smoke Test)", () => {
  it("renders a valid PDF buffer with %PDF- magic bytes and full rate-card structure", async () => {
    const mockData: QuotationData = {
      documentNumber: "RC-2024-TEST",
      documentType: "RATE CARD",
      date: "21 August 2024",
      validUntil: "20 September 2024",
      title: "Enterprise Core Banking Architecture & Infrastructure",
      subtitle: "PROJECT PROPOSAL, COST ESTIMATE & TIMELINE",
      clientName: "Samuel Ochieng",
      clientLocation: "Nairobi, Kenya",
      clientEmail: "samuel@example.com",
      clientCompany: "Apex FinTech Ltd",
      tableTitle: "Website Design & Development — Scope & Rates",
      lineItems: [
        { description: "System Architecture & API Design", qty: 1, amount: 80000 },
        { description: "Interactive Portal Development", qty: 1, amount: 120000 },
        { description: "M-Pesa STK Push Gateway Integration", qty: 1, amount: 45000 },
      ],
      subtotal: 245000,
      tax: 0,
      taxLabel: "N/A — sole proprietor rate, VAT not applicable",
      total: 245000,
      depositPercentage: 50,
      amountDueToStart: 122500,
      depositBadge: "50% UPFRONT · DUE BEFORE KICKOFF",
      timelineTitle: "Project Timeline — Estimated 5 Weeks",
      timelinePhases: [
        {
          phaseNumber: "01",
          name: "Design & Scope Lock",
          description: "System architecture and mockups",
          dayRangeLabel: "Days 1 – 7",
        },
        {
          phaseNumber: "02",
          name: "Core Development",
          description: "API implementation and data layer",
          dayRangeLabel: "Days 8 – 25",
        },
        {
          phaseNumber: "03",
          name: "QA & Deployment",
          description: "Staging verification and handover",
          dayRangeLabel: "Days 26 – 35",
        },
      ],
      paymentTerms: [
        "50% upfront deposit required before project commencement.",
        "50% balance due upon staging sign-off before production release.",
      ],
      included: [
        "Production-ready Next.js application",
        "Automated deployment configuration",
      ],
      excluded: [
        "Ongoing monthly server hosting fees",
      ],
      closingNote: "Thank you for partnering with Bezalel Technologies.",
    };

    const pdfBuffer = await generateQuotationPdfBuffer(mockData);

    expect(pdfBuffer).toBeDefined();
    expect(Buffer.isBuffer(pdfBuffer)).toBe(true);
    expect(pdfBuffer.length).toBeGreaterThan(1000); // Should be a substantial binary PDF

    // PDF files always begin with the magic header "%PDF-"
    const magicHeader = pdfBuffer.subarray(0, 5).toString("ascii");
    expect(magicHeader).toBe("%PDF-");
  }, 15000); // 15s timeout for PDF rendering
});
