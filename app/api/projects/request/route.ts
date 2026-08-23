import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadFile } from "@/lib/cloudinary";
import { sendEmail } from "@/lib/resend";
import { auth } from "@/auth";
import { z } from "zod";
import { ProjectCategory } from "@prisma/client";
import { checkRateLimit } from "@/lib/ratelimit";

const projectRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional().nullable(),
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.nativeEnum(ProjectCategory),
  budget: z.preprocess((val) => {
    if (!val || val === "null" || val === "undefined") return null;
    if (typeof val === "string") {
      const sanitized = val.replace(/[^0-9.]/g, "");
      if (!sanitized) return null;
      const num = Number(sanitized);
      return isNaN(num) ? null : num;
    }
    const num = Number(val);
    return isNaN(num) ? null : num;
  }, z.number().nullable().optional()),
  timeline: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  // Rate limiting check
  const rateLimitResponse = await checkRateLimit(req, "form");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const formData = await req.formData();
    
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      budget: formData.get("budget"),
      timeline: formData.get("timeline"),
    };

    const parsed = projectRequestSchema.safeParse(rawData);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const attachmentFile = formData.get("attachment") as File | null;
    let attachmentUrl: string | null = null;

    if (attachmentFile && attachmentFile.size > 0) {
      // Upload attachment (PDF, zip, docx, image, etc.)
      attachmentUrl = await uploadFile(attachmentFile, attachmentFile.name, "project-briefs");
    }

    // Associate user if logged in
    const session = await auth();
    const userId = session?.user?.id || null;

    const { name, email, company, title, description, category, budget, timeline } = parsed.data;

    // Create the project request
    const projectRequest = await prisma.projectRequest.create({
      data: {
        userId,
        name,
        email,
        company,
        title,
        description,
        category,
        budget,
        timeline,
        attachmentUrl,
        status: "NEW",
      },
    });

    const briefDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const refCode = `BEZ-${projectRequest.id.slice(-6).toUpperCase()}`;

    // Generate branded Project Brief PDF
    let pdfAttachment: { filename: string; content: Buffer } | undefined;
    try {
      const { generateProjectBriefPdfBuffer } = await import("@/lib/project-brief-pdf");
      const pdfBuffer = await generateProjectBriefPdfBuffer({
        requestId: projectRequest.id,
        date: briefDate,
        clientName: name,
        clientEmail: email,
        clientCompany: company,
        clientPhone: (formData.get("phone") as string) || null,
        projectTitle: title,
        category,
        budget: budget ? budget : null,
        timeline,
        description,
        attachmentUrl,
      });
      pdfAttachment = {
        filename: `Project_Brief_${refCode}.pdf`,
        content: pdfBuffer,
      };
    } catch (pdfErr) {
      console.error("❌ Failed to generate project brief PDF:", pdfErr);
    }

    const { escapeHtml } = await import("@/lib/utils");
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeCompany = company ? escapeHtml(company) : null;
    const safeTitle = escapeHtml(title);
    const safeDescription = escapeHtml(description);
    const safeTimeline = timeline ? escapeHtml(timeline) : null;
    const safeCategory = escapeHtml(category);

    // Send emails (non-blocking)
    // 1. Client Confirmation Email
    const clientHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #0B2036; color: #FAF6EC; border-radius: 8px;">
        <div style="border-bottom: 2px solid #C9A24B; padding-bottom: 16px; margin-bottom: 24px;">
          <h1 style="color: #FAF6EC; margin: 0; font-size: 22px; letter-spacing: 1px;">BEZALEL TECHNOLOGIES</h1>
          <p style="color: #E8CD84; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Software & Infrastructure Engineering</p>
        </div>

        <p style="font-size: 15px; line-height: 1.6; color: #FAF6EC;">Dear <strong>${safeName}</strong>,</p>
        <p style="line-height: 1.6; color: #E0E7EC; font-size: 14px;">We have successfully received your project scope: <strong>&ldquo;${safeTitle}&rdquo;</strong> [Ref: <strong>${refCode}</strong>].</p>
        <p style="line-height: 1.6; color: #E0E7EC; font-size: 14px;">Our engineering team is assessing the technical specifications and requirements. We have attached an official <strong>Project Brief PDF</strong> to this email summarizing your submission.</p>
        <p style="line-height: 1.6; color: #E0E7EC; font-size: 14px;">We typically provide an itemized milestone quotation and schedule a discovery call within <strong>24–48 hours</strong>.</p>
        
        <div style="background-color: #050D17; border: 1px solid #C9A24B; border-radius: 6px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0; color: #E8CD84; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Need fast adjustments?</p>
          <p style="margin: 4px 0 0 0; color: #FAF6EC; font-size: 13px;">Direct WhatsApp Engineer Desk: <strong>+254 796 157 265</strong></p>
        </div>

        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #1B2430; font-size: 11px; color: #8FA0B3;">
          <p style="margin: 0;">Bezalel Technologies Ltd · Nairobi, Kenya · <a href="https://bezalel.website" style="color: #E8CD84; text-decoration: none;">bezalel.website</a></p>
        </div>
      </div>
    `;

    sendEmail({
      to: email,
      subject: `Project Proposal Received: ${title} [${refCode}] - Bezalel Technologies`,
      html: clientHtml,
      attachments: pdfAttachment ? [pdfAttachment] : undefined,
    }).catch((err) => console.error("❌ Failed to send confirmation email to client:", err));

    // 2. Admin Notification Email
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SEED_ADMIN_EMAIL || "bezaleltech@gmail.com";
    const studioUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/studio/projects`;

    const adminHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; background-color: #09090b; color: #f4f4f5; border: 1px solid #27272a; border-radius: 8px;">
        <h2 style="color: #10b981; border-bottom: 1px solid #27272a; padding-bottom: 12px; margin-top: 0; font-size: 1.4em;">New Project Request Alert [${refCode}]</h2>
        <p style="color: #e4e4e7;">A new project brief has been submitted to the pipeline. (Official PDF Brief Attached)</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 0.95em;">
          <tbody>
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-weight: bold; width: 140px;">Client Name:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #f4f4f5;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-weight: bold;">Client Email:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a;"><a href="mailto:${safeEmail}" style="color: #10b981; text-decoration: none;">${safeEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-weight: bold;">Company:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #f4f4f5;">${safeCompany || "None"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-weight: bold;">Project Title:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #f4f4f5;">${safeTitle}</td>
            </tr>
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-weight: bold;">Category:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #f4f4f5;">${safeCategory}</td>
            </tr>
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-weight: bold;">Est. Budget:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #f4f4f5;">${budget ? `KES ${budget.toLocaleString()}` : "Not specified"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-weight: bold;">Timeline:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #f4f4f5;">${safeTimeline || "Not specified"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-weight: bold;">Attachment:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a;">
                ${
                  attachmentUrl
                    ? `<a href="${attachmentUrl}" target="_blank" style="color: #10b981; text-decoration: underline; font-weight: bold;">View Attached File</a>`
                    : "No attachment provided"
                }
              </td>
            </tr>
          </tbody>
        </table>

        <div style="background-color: #18181b; border: 1px solid #27272a; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <span style="font-weight: bold; color: #a1a1aa; display: block; margin-bottom: 8px; font-size: 0.9em;">Project Description:</span>
          <p style="margin: 0; color: #e4e4e7; font-size: 0.95em; white-space: pre-wrap; line-height: 1.5;">${safeDescription}</p>
        </div>

        <div style="margin-top: 30px; text-align: center;">
          <a href="${studioUrl}" target="_blank" style="display: inline-block; background-color: #10b981; color: #09090b; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 0.95em; letter-spacing: 0.02em;">
            Open Pipeline Dashboard
          </a>
        </div>
      </div>
    `;

    sendEmail({
      to: adminEmail,
      subject: `New Project Request: ${title} from ${name} [${refCode}]`,
      html: adminHtml,
      attachments: pdfAttachment ? [pdfAttachment] : undefined,
    }).catch((err) => console.error("❌ Failed to send notification email to admin:", err));

    return NextResponse.json(projectRequest, { status: 201 });
  } catch (error) {
    console.error("❌ Project Request POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
