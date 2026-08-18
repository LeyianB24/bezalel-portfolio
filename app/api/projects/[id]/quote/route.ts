import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { sendEmail } from "@/lib/resend";
import { generateQuotationPdfBuffer } from "@/lib/quotation-pdf";
import { ProjectRequestModel } from "@/types/prisma-models";

const quoteRequestSchema = z.object({
  lineItems: z.array(
    z.object({
      description: z.string().min(1, "Description is required"),
      qty: z.number().min(1).default(1),
      unitPrice: z.number().min(0),
      amount: z.number().min(0),
    })
  ).min(1, "At least one line item is required"),
  taxRate: z.number().min(0).max(1).default(0),
  notes: z.string().optional().nullable(),
  validUntilDays: z.number().min(1).default(30),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
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
    const tax = Math.round(subtotal * parsedData.taxRate * 100) / 100;
    const total = subtotal + tax;

    const issueDate = new Date();
    const validUntilDate = new Date(issueDate.getTime() + parsedData.validUntilDays * 24 * 60 * 60 * 1000);
    const quoteNumber = `BEZ-${issueDate.getFullYear()}-${project.id.slice(-6).toUpperCase()}`;

    const formattedIssueDate = issueDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const formattedValidUntil = validUntilDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    // Render PDF buffer
    const pdfBuffer = await generateQuotationPdfBuffer({
      quoteNumber,
      date: formattedIssueDate,
      validUntil: formattedValidUntil,
      clientName: project.name,
      clientEmail: project.email,
      clientCompany: project.company,
      clientPhone: project.phone || null,
      projectTitle: project.title,
      lineItems: parsedData.lineItems,
      subtotal,
      tax,
      total,
      notes: parsedData.notes,
    });

    // Save quotation to DB
    const quotation = await prisma.quotation.upsert({
      where: { projectRequestId: id },
      create: {
        projectRequestId: id,
        lineItems: JSON.parse(JSON.stringify(parsedData.lineItems)),
        subtotal,
        tax,
        total,
        notes: parsedData.notes,
        validUntil: validUntilDate,
        sentAt: issueDate,
        status: "SENT",
      },
      update: {
        lineItems: JSON.parse(JSON.stringify(parsedData.lineItems)),
        subtotal,
        tax,
        total,
        notes: parsedData.notes,
        validUntil: validUntilDate,
        sentAt: issueDate,
        status: "SENT",
      },
    });

    // Update project request status to QUOTED
    const updatedProject = await prisma.projectRequest.update({
      where: { id },
      data: {
        status: "QUOTED",
        quotedPrice: total,
      },
    });

    // Email client with PDF attachment and CC admin
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #0B2036; color: #FAF6EC; border-radius: 8px;">
        <div style="border-bottom: 2px solid #C9A24B; padding-bottom: 16px; margin-bottom: 24px;">
          <h1 style="color: #FAF6EC; margin: 0; font-size: 22px; letter-spacing: 1px;">BEZALEL TECHNOLOGIES</h1>
          <p style="color: #E8CD84; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Software & Infrastructure Engineering</p>
        </div>

        <p style="font-size: 15px; line-height: 1.6; color: #FAF6EC;">Dear <strong>${project.name}</strong>,</p>
        
        <p style="font-size: 14px; line-height: 1.6; color: #E0E7EC;">
          Thank you for providing the scope for <strong>&ldquo;${project.title}&rdquo;</strong>. We have completed our technical assessment and prepared an official itemized quotation for your project.
        </p>

        <div style="background-color: #050D17; border: 1px solid #C9A24B; border-radius: 6px; padding: 20px; margin: 24px 0;">
          <div style="font-size: 12px; font-weight: bold; color: #E8CD84; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
            Quotation Summary [${quoteNumber}]
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #FAF6EC;">
            <tr style="border-bottom: 1px solid #1B2430;">
              <td style="padding: 6px 0; color: #8FA0B3;">Project Title:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold;">${project.title}</td>
            </tr>
            <tr style="border-bottom: 1px solid #1B2430;">
              <td style="padding: 6px 0; color: #8FA0B3;">Total Investment:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #E8CD84; font-size: 16px;">
                KES ${total.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #8FA0B3;">Valid Until:</td>
              <td style="padding: 6px 0; text-align: right;">${formattedValidUntil}</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 13px; line-height: 1.6; color: #E0E7EC;">
          The official branded quotation PDF with detailed deliverables, payment milestones, and terms is attached to this email for your review and internal sign-off.
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

    await sendEmail({
      to: project.email,
      cc: adminEmail,
      subject: `Official Quotation: ${project.title} [${quoteNumber}] - Bezalel Technologies`,
      html: emailHtml,
      attachments: [
        {
          filename: `Quotation_${quoteNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      quotation,
      project: updatedProject,
      quoteNumber,
    });
  } catch (error) {
    console.error("❌ Generate quote error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid quote data", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to generate quotation" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
