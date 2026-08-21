import { NextResponse } from "next/server";
import { verifyApiAdminPermission } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { sendEmail } from "@/lib/resend";
import { generateQuotationPdfBuffer } from "@/lib/quotation-pdf";
import { ProjectRequestModel } from "@/types/prisma-models";

const quoteRequestSchema = z.object({
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
      name: z.string().min(1, "Phase name is required"),
      description: z.string().min(1, "Phase description is required"),
      dayRangeLabel: z.string().min(1, "Day range is required"),
    })
  ).optional(),
  paymentTerms: z.array(z.string()).optional(),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  closingNote: z.string().optional().nullable(),
  lineItems: z.array(
    z.object({
      description: z.string().min(1, "Description is required"),
      qty: z.number().min(1).default(1),
      unitPrice: z.number().min(0).optional(),
      amount: z.number().min(0),
    })
  ).min(1, "At least one line item is required"),
  taxRate: z.number().min(0).max(1).optional().default(0),
  notes: z.string().optional().nullable(),
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
    const parsedData = quoteRequestSchema.parse(body);

    const rawProject = await prisma.projectRequest.findUnique({
      where: { id },
    });

    if (!rawProject) {
      return NextResponse.json({ error: "Project request not found" }, { status: 404 });
    }

    const project = rawProject as unknown as ProjectRequestModel;

    // Compute sums
    const subtotal = parsedData.lineItems.reduce((sum, item) => sum + item.amount, 0);
    const tax = parsedData.taxRate > 0 ? Math.round(subtotal * parsedData.taxRate * 100) / 100 : 0;
    const total = subtotal + tax;
    const depositPercentage = parsedData.depositPercentage ?? 50;
    const amountDueToStart = Math.round(total * (depositPercentage / 100));

    const issueDate = new Date();
    const validUntilDate = new Date(issueDate.getTime() + parsedData.validUntilDays * 24 * 60 * 60 * 1000);
    const year = issueDate.getFullYear();

    // Determine sequential document number: RC-YYYY-XXX
    let documentNumber = `RC-${year}-001`;
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
      console.warn("⚠️ Document number lookup fallback in quote route:", dbErr);
      documentNumber = `RC-${year}-${project.id.slice(-4).toUpperCase()}`;
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

    const title = parsedData.title || project.title;
    const subtitle = parsedData.subtitle || "PROJECT PROPOSAL, COST ESTIMATE & TIMELINE";
    const clientLocation = parsedData.clientLocation || project.company || "Nairobi, Kenya";
    const docType = parsedData.documentType || "RATE CARD";

    // Render PDF buffer
    const pdfBuffer = await generateQuotationPdfBuffer({
      documentNumber,
      documentType: docType,
      date: formattedIssueDate,
      validUntil: formattedValidUntil,
      title,
      subtitle,
      clientName: project.name,
      clientLocation,
      clientEmail: project.email,
      clientCompany: project.company,
      clientPhone: project.phone || null,
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

    // Save quotation to DB with fallback if database schema is not yet migrated
    let quotation: any = null;
    try {
      quotation = await prisma.quotation.upsert({
        where: { projectRequestId: id },
        create: {
          projectRequestId: id,
          documentNumber,
          documentType: docType,
          title,
          subtitle,
          clientLocation,
          scopeSummary: parsedData.scopeSummary || null,
          tableTitle: parsedData.tableTitle || null,
          taxLabel: parsedData.taxLabel || null,
          depositPercentage,
          amountDueToStart,
          depositNote: parsedData.depositNote || null,
          depositBadge: parsedData.depositBadge || null,
          timelineTitle: parsedData.timelineTitle || null,
          timelinePhases: parsedData.timelinePhases ? JSON.parse(JSON.stringify(parsedData.timelinePhases)) : undefined,
          paymentTerms: parsedData.paymentTerms || [],
          included: parsedData.included || [],
          excluded: parsedData.excluded || [],
          closingNote: parsedData.closingNote || null,
          lineItems: JSON.parse(JSON.stringify(parsedData.lineItems)),
          subtotal,
          tax,
          total,
          notes: parsedData.notes || null,
          validUntil: validUntilDate,
          sentAt: issueDate,
          status: "SENT",
        },
        update: {
          documentNumber,
          documentType: docType,
          title,
          subtitle,
          clientLocation,
          scopeSummary: parsedData.scopeSummary || null,
          tableTitle: parsedData.tableTitle || null,
          taxLabel: parsedData.taxLabel || null,
          depositPercentage,
          amountDueToStart,
          depositNote: parsedData.depositNote || null,
          depositBadge: parsedData.depositBadge || null,
          timelineTitle: parsedData.timelineTitle || null,
          timelinePhases: parsedData.timelinePhases ? JSON.parse(JSON.stringify(parsedData.timelinePhases)) : undefined,
          paymentTerms: parsedData.paymentTerms || [],
          included: parsedData.included || [],
          excluded: parsedData.excluded || [],
          closingNote: parsedData.closingNote || null,
          lineItems: JSON.parse(JSON.stringify(parsedData.lineItems)),
          subtotal,
          tax,
          total,
          notes: parsedData.notes || null,
          validUntil: validUntilDate,
          sentAt: issueDate,
          status: "SENT",
        },
      });
    } catch (upsertErr) {
      console.warn("⚠️ Full quotation upsert failed, falling back to base schema fields:", upsertErr);
      quotation = await prisma.quotation.upsert({
        where: { projectRequestId: id },
        create: {
          projectRequestId: id,
          lineItems: JSON.parse(JSON.stringify(parsedData.lineItems)),
          subtotal,
          tax,
          total,
          notes: parsedData.notes || JSON.stringify({
            documentNumber,
            documentType: docType,
            title,
            subtitle,
            clientLocation,
            scopeSummary: parsedData.scopeSummary,
            depositPercentage,
            amountDueToStart,
          }),
          validUntil: validUntilDate,
          sentAt: issueDate,
          status: "SENT",
        },
        update: {
          lineItems: JSON.parse(JSON.stringify(parsedData.lineItems)),
          subtotal,
          tax,
          total,
          notes: parsedData.notes || JSON.stringify({
            documentNumber,
            documentType: docType,
            title,
            subtitle,
            clientLocation,
            scopeSummary: parsedData.scopeSummary,
            depositPercentage,
            amountDueToStart,
          }),
          validUntil: validUntilDate,
          sentAt: issueDate,
          status: "SENT",
        },
      });
    }

    // Update project request status to QUOTED
    let updatedProject = rawProject;
    try {
      updatedProject = await prisma.projectRequest.update({
        where: { id },
        data: {
          status: "QUOTED",
          quotedPrice: total,
        },
      });
    } catch (updateErr) {
      console.warn("⚠️ Project status update warning:", updateErr);
    }

    // Email client with PDF attachment and CC admin
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #0B2036; color: #FAF6EC; border-radius: 8px;">
        <div style="border-bottom: 2px solid #C9A24B; padding-bottom: 16px; margin-bottom: 24px;">
          <h1 style="color: #FAF6EC; margin: 0; font-size: 22px; letter-spacing: 1px;">BEZALEL TECHNOLOGIES</h1>
          <p style="color: #E8CD84; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Software & Infrastructure Engineering</p>
        </div>

        <p style="font-size: 15px; line-height: 1.6; color: #FAF6EC;">Dear <strong>${project.name}</strong>,</p>
        
        <p style="font-size: 14px; line-height: 1.6; color: #E0E7EC;">
          Thank you for providing the scope for <strong>&ldquo;${title}&rdquo;</strong>. We have completed our technical assessment and prepared an official ${docType.toLowerCase()} for your project.
        </p>

        <div style="background-color: #050D17; border: 1px solid #C9A24B; border-radius: 6px; padding: 20px; margin: 24px 0;">
          <div style="font-size: 12px; font-weight: bold; color: #E8CD84; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
            ${docType} Summary [${documentNumber}]
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #FAF6EC;">
            <tr style="border-bottom: 1px solid #1B2430;">
              <td style="padding: 6px 0; color: #8FA0B3;">Project Title:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold;">${title}</td>
            </tr>
            <tr style="border-bottom: 1px solid #1B2430;">
              <td style="padding: 6px 0; color: #8FA0B3;">Total Investment:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #E8CD84; font-size: 16px;">
                KES ${total.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #1B2430;">
              <td style="padding: 6px 0; color: #8FA0B3;">Amount Due to Start (${depositPercentage}%):</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #FAF6EC;">
                KES ${amountDueToStart.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #8FA0B3;">Valid Until:</td>
              <td style="padding: 6px 0; text-align: right;">${formattedValidUntil}</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 13px; line-height: 1.6; color: #E0E7EC;">
          The official branded ${docType.toLowerCase()} PDF with itemized deliverables, payment terms, and project timeline is attached to this email for your review and sign-off.
        </p>

        <p style="font-size: 13px; line-height: 1.6; color: #E0E7EC;">
          If you have any questions or require scope adjustments, simply reply to this email or reach us on WhatsApp at <strong>+254 796 157 265</strong>.
        </p>

        <div style="margin-top: 32px; border-top: 1px solid #1B2430; padding-top: 16px; font-size: 11px; color: #8FA0B3;">
          <p style="margin: 0 0 4px 0;">Tomaka Bezalel Leyian</p>
          <p style="margin: 0; color: #E8CD84;">Lead Systems Engineer · Bezalel Technologies</p>
          <p style="margin: 4px 0 0 0;">Nairobi, Kenya · <a href="https://bezalel.website" style="color: #E8CD84; text-decoration: none;">bezalel.website</a></p>
        </div>
      </div>
    `;

    const adminEmail = process.env.ADMIN_EMAIL || "bezaleltech@gmail.com";

    let emailSent = false;
    let emailWarning: string | null = null;

    try {
      const emailResult = await sendEmail({
        to: project.email,
        cc: adminEmail,
        subject: `Official ${docType}: ${title} [${documentNumber}] - Bezalel Technologies`,
        html: emailHtml,
        attachments: [
          {
            filename: `${documentNumber}.pdf`,
            content: pdfBuffer,
          },
        ],
      });

      emailSent = emailResult.success;
      if (!emailResult.success && emailResult.error) {
        emailWarning = typeof emailResult.error === "object" && "message" in emailResult.error
          ? (emailResult.error as any).message
          : "Email could not be delivered to unverified domain";
      } else if (emailResult.sandboxRedirect) {
        emailWarning = `Delivered to verified admin address (leyianbeza24@gmail.com) via Resend Sandbox`;
      }
    } catch (emailErr) {
      console.warn("⚠️ Email delivery warning:", emailErr);
      emailWarning = emailErr instanceof Error ? emailErr.message : "Email delivery skipped";
    }

    const { logAudit } = await import("@/lib/audit");
    await logAudit({
      action: "QUOTATION_SENT",
      entityType: "Quotation",
      entityId: quotation?.id || id,
      metadata: {
        documentNumber,
        projectTitle: title,
        clientName: project.name,
        clientEmail: project.email,
        total,
        amountDueToStart,
        emailSent,
      },
    });

    return NextResponse.json({
      success: true,
      quotation,
      project: updatedProject,
      documentNumber,
      quoteNumber: documentNumber,
      emailSent,
      emailWarning,
    });
  } catch (error) {
    console.error("❌ Generate quote error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid quote data", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to generate quotation" 
    }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
