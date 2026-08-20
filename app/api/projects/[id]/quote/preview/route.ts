import { NextResponse } from "next/server";
import { verifyApiAdminPermission } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { generateQuotationPdfBuffer } from "@/lib/quotation-pdf";
import { ProjectRequestModel } from "@/types/prisma-models";

const quotePreviewSchema = z.object({
  documentType: z.string().optional().default("RATE CARD"),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  clientName: z.string().optional(),
  clientLocation: z.string().optional(),
  clientEmail: z.string().optional(),
  clientCompany: z.string().optional().nullable(),
  clientPhone: z.string().optional().nullable(),
  scopeSummary: z.string().optional().nullable(),
  tableTitle: z.string().optional(),
  taxLabel: z.string().optional().nullable(),
  depositPercentage: z.number().min(0).max(100).optional().default(50),
  depositNote: z.string().optional().nullable(),
  depositBadge: z.string().optional().nullable(),
  timelineTitle: z.string().optional().nullable(),
  timelinePhases: z.array(
    z.object({
      phaseNumber: z.string().optional(),
      name: z.string().min(1),
      description: z.string().min(1),
      dayRangeLabel: z.string().min(1),
    })
  ).optional(),
  paymentTerms: z.array(z.string()).optional(),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  closingNote: z.string().optional().nullable(),
  lineItems: z.array(
    z.object({
      description: z.string().min(1),
      qty: z.number().min(1).default(1),
      unitPrice: z.number().min(0).optional(),
      amount: z.number().min(0),
    })
  ).min(1),
  taxRate: z.number().min(0).max(1).optional().default(0),
  validUntilDays: z.number().min(1).default(30),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { errorResponse } = await verifyApiAdminPermission("PROJECTS_QUOTATIONS");
    if (errorResponse) return errorResponse;

    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams?.id;

    const body = await req.json();
    const parsedData = quotePreviewSchema.parse(body);

    let project: Partial<ProjectRequestModel> | null = null;
    if (id) {
      try {
        project = await prisma.projectRequest.findUnique({
          where: { id },
        });
      } catch (dbErr) {
        console.warn("⚠️ Could not query projectRequest from DB for preview:", dbErr);
      }
    }

    const clientName = parsedData.clientName || project?.name || "Valued Client";
    const clientEmail = parsedData.clientEmail || project?.email || "client@example.com";
    const clientCompany = parsedData.clientCompany || project?.company || null;
    const clientPhone = parsedData.clientPhone || project?.phone || null;
    const clientLocation = parsedData.clientLocation || clientCompany || "Nairobi, Kenya";
    const title = parsedData.title || project?.title || "Website & E-commerce Platform Development";
    const subtitle = parsedData.subtitle || "PROJECT PROPOSAL, COST ESTIMATE & TIMELINE";
    const docType = parsedData.documentType || "RATE CARD";

    // Calculations
    const subtotal = parsedData.lineItems.reduce((sum, item) => sum + item.amount, 0);
    const tax = parsedData.taxRate > 0 ? Math.round(subtotal * parsedData.taxRate * 100) / 100 : 0;
    const total = subtotal + tax;
    const depositPercentage = parsedData.depositPercentage ?? 50;
    const amountDueToStart = Math.round(total * (depositPercentage / 100));

    const issueDate = new Date();
    const validUntilDate = new Date(issueDate.getTime() + parsedData.validUntilDays * 24 * 60 * 60 * 1000);
    const year = issueDate.getFullYear();

    let documentNumber = `RC-${year}-PREVIEW`;
    if (id) {
      try {
        const existingQuotation = await (prisma.quotation as any).findUnique({
          where: { projectRequestId: id },
          select: { documentNumber: true },
        });

        if (existingQuotation?.documentNumber) {
          documentNumber = existingQuotation.documentNumber;
        } else {
          const yearQuotes = await (prisma.quotation as any).findMany({
            where: {
              documentNumber: {
                startsWith: `RC-${year}-`,
              },
            },
            select: { documentNumber: true },
          });

          let maxSeq = 0;
          if (Array.isArray(yearQuotes)) {
            for (const q of yearQuotes) {
              if (q.documentNumber) {
                const parts = q.documentNumber.split("-");
                const seq = parseInt(parts[2], 10);
                if (!isNaN(seq) && seq > maxSeq) {
                  maxSeq = seq;
                }
              }
            }
          }
          const nextSeq = maxSeq + 1;
          documentNumber = `RC-${year}-${String(nextSeq).padStart(3, "0")}`;
        }
      } catch (dbErr) {
        console.warn("⚠️ Document number lookup fallback in preview:", dbErr);
        documentNumber = `RC-${year}-001`;
      }
    }

    const formattedIssueDate = issueDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const formattedValidUntil = validUntilDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const pdfBuffer = await generateQuotationPdfBuffer({
      documentNumber,
      documentType: docType,
      date: formattedIssueDate,
      validUntil: formattedValidUntil,
      title,
      subtitle,
      clientName,
      clientLocation,
      clientEmail,
      clientCompany,
      clientPhone,
      scopeSummary: parsedData.scopeSummary || null,
      tableTitle: parsedData.tableTitle || "Website Design & Development — Scope & Rates",
      lineItems: parsedData.lineItems,
      subtotal,
      tax,
      taxLabel: parsedData.taxLabel || (tax > 0 ? `KES ${tax.toLocaleString("en-KE")}` : "N/A — sole proprietor rate, VAT not applicable"),
      total,
      depositPercentage,
      amountDueToStart,
      depositNote: parsedData.depositNote || null,
      depositBadge: parsedData.depositBadge || `${depositPercentage}% UPFRONT · DUE BEFORE KICKOFF`,
      timelineTitle: parsedData.timelineTitle || "Project Timeline — Estimated 5 Weeks",
      timelinePhases: parsedData.timelinePhases,
      paymentTerms: parsedData.paymentTerms,
      included: parsedData.included,
      excluded: parsedData.excluded || [],
      closingNote: parsedData.closingNote || null,
    });

    return new Response(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${documentNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("❌ Preview quote error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid quote preview data", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to render PDF preview" 
    }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
