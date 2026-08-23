import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadCV } from "@/lib/cloudinary";
import { sendEmail } from "@/lib/resend";
import { auth } from "@/auth";
import { checkRateLimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
  // Rate limiting check
  const rateLimitResponse = await checkRateLimit(req, "form");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const formData = await req.formData();
    const jobId = formData.get("jobId") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string | null;
    const coverNote = formData.get("coverNote") as string | null;
    const cvFile = formData.get("cv") as File | null;

    if (!jobId || !name || !email || !cvFile) {
      return NextResponse.json(
        { error: "Missing required fields: jobId, name, email, cv" },
        { status: 400 }
      );
    }

    // Verify job exists and is open
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json({ error: "Job position not found" }, { status: 404 });
    }

    if (!job.isOpen) {
      return NextResponse.json({ error: "Job position is closed" }, { status: 400 });
    }

    // Attach userId if candidate is logged in
    const session = await auth();
    const userId = session?.user?.id || null;

    // Upload CV (handles real Cloudinary or mock)
    const cvUrl = await uploadCV(cvFile, cvFile.name);

    // Save Application to DB
    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        userId,
        name,
        email,
        phone,
        cvUrl,
        coverNote,
        status: "PENDING",
      },
    });

    const appDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const appRef = `APP-${application.id.slice(-6).toUpperCase()}`;

    // Generate branded Application Receipt PDF
    let pdfAttachment: { filename: string; content: Buffer } | undefined;
    try {
      const { generateApplicationAcknowledgmentPdfBuffer } = await import("@/lib/application-pdf");
      const pdfBuffer = await generateApplicationAcknowledgmentPdfBuffer({
        applicationId: application.id,
        date: appDate,
        applicantName: name,
        applicantEmail: email,
        applicantPhone: phone || null,
        jobTitle: job.title,
        jobDepartment: job.department,
        coverNote: coverNote || null,
      });
      pdfAttachment = {
        filename: `Application_Receipt_${appRef}.pdf`,
        content: pdfBuffer,
      };
    } catch (pdfErr) {
      console.error("❌ Failed to generate application receipt PDF:", pdfErr);
    }

    const { escapeHtml } = await import("@/lib/utils");
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = phone ? escapeHtml(phone) : null;
    const safeCoverNote = coverNote ? escapeHtml(coverNote) : null;
    const safeJobTitle = escapeHtml(job.title);
    const safeDepartment = escapeHtml(job.department);

    // Send emails (non-blocking)
    // 1. Applicant Confirmation Email
    const applicantHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #0B2036; color: #FAF6EC; border-radius: 8px;">
        <div style="border-bottom: 2px solid #C9A24B; padding-bottom: 16px; margin-bottom: 24px;">
          <h1 style="color: #FAF6EC; margin: 0; font-size: 22px; letter-spacing: 1px;">BEZALEL TECHNOLOGIES</h1>
          <p style="color: #E8CD84; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Engineering Talent & Recruitment</p>
        </div>

        <p style="font-size: 15px; line-height: 1.6; color: #FAF6EC;">Dear <strong>${safeName}</strong>,</p>
        <p style="line-height: 1.6; color: #E0E7EC; font-size: 14px;">Thank you for your interest in joining Bezalel Technologies. We have successfully received your application for the position of <strong>${safeJobTitle}</strong> (${safeDepartment}) [Ref: <strong>${appRef}</strong>].</p>
        <p style="line-height: 1.6; color: #E0E7EC; font-size: 14px;">Our engineering leadership is reviewing your submission and CV. Your official <strong>Application Receipt PDF</strong> is attached to this email.</p>
        <p style="line-height: 1.6; color: #E0E7EC; font-size: 14px;">We will contact you directly to schedule a technical discussion if your experience aligns with our active project pipeline.</p>
        
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #1B2430; font-size: 11px; color: #8FA0B3;">
          <p style="margin: 0;">Bezalel Technologies Ltd · Global Software & Infrastructure · <a href="https://bezalel.website" style="color: #E8CD84; text-decoration: none;">bezalel.website</a></p>
        </div>
      </div>
    `;

    sendEmail({
      to: email,
      subject: `Application Received: ${job.title} [${appRef}] - Bezalel Technologies`,
      html: applicantHtml,
      attachments: pdfAttachment ? [pdfAttachment] : undefined,
    }).catch((err) => console.error("❌ Failed to send confirmation email to applicant:", err));

    // 2. Admin Alert Email
    const adminEmail = process.env.SEED_ADMIN_EMAIL || "bezalel@bezalelstudio.com";
    const appUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/studio/careers`;
    
    const adminHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; background-color: #09090b; color: #f4f4f5; border: 1px solid #27272a; border-radius: 8px;">
        <h2 style="color: #10b981; border-bottom: 1px solid #27272a; padding-bottom: 12px; margin-top: 0; font-size: 1.4em;">New Application Alert</h2>
        <p style="color: #e4e4e7;">A new application has been submitted for the role of <strong>${safeJobTitle}</strong> (${safeDepartment}).</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 0.95em;">
          <tbody>
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-weight: bold; width: 140px;">Applicant Name:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #f4f4f5;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-weight: bold;">Applicant Email:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a;"><a href="mailto:${safeEmail}" style="color: #10b981; text-decoration: none;">${safeEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-weight: bold;">Applicant Phone:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #f4f4f5;">${safePhone || "Not provided"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-weight: bold;">CV Document:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a;">
                <a href="${cvUrl}" target="_blank" style="color: #10b981; text-decoration: underline; font-weight: bold;">
                  View CV File
                </a>
              </td>
            </tr>
          </tbody>
        </table>

        ${
          safeCoverNote
            ? `
          <div style="background-color: #18181b; border: 1px solid #27272a; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <span style="font-weight: bold; color: #a1a1aa; display: block; margin-bottom: 8px; font-size: 0.9em;">Cover Note:</span>
            <p style="margin: 0; color: #e4e4e7; font-size: 0.95em; white-space: pre-wrap; line-height: 1.5;">${safeCoverNote}</p>
          </div>
        `
            : ""
        }

        <div style="margin-top: 30px; text-align: center;">
          <a href="${appUrl}" target="_blank" style="display: inline-block; background-color: #10b981; color: #09090b; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 0.95em; letter-spacing: 0.02em;">
            Open Careers Dashboard
          </a>
        </div>
      </div>
    `;

    sendEmail({
      to: adminEmail,
      subject: `New Application: ${name} - ${job.title}`,
      html: adminHtml,
    }).catch((err) => console.error("❌ Failed to send notification email to admin:", err));

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("❌ Apply endpoint error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
