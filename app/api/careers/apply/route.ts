import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadCV } from "@/lib/cloudinary";
import { sendEmail } from "@/lib/resend";
import { auth } from "@/auth";

export async function POST(req: Request) {
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

    // Send emails (non-blocking)
    // 1. Applicant Confirmation Email
    const applicantHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; background-color: #09090b; color: #f4f4f5; border: 1px solid #27272a; border-radius: 8px;">
        <h2 style="color: #10b981; border-bottom: 1px solid #27272a; padding-bottom: 12px; margin-top: 0; font-size: 1.5em; letter-spacing: 0.05em;">BEZALEL STUDIO</h2>
        <p style="font-size: 1.1em; line-height: 1.5;">Dear <strong>${name}</strong>,</p>
        <p style="line-height: 1.5; color: #d4d4d8;">Thank you for your interest in joining Bezalel Studio. We have successfully received your application for the position of <strong>${job.title}</strong> (${job.department}).</p>
        <p style="line-height: 1.5; color: #d4d4d8;">Our team will carefully review your details, experience, and CV. We will reach out to schedule an interview if your skills align with our current needs.</p>
        <p style="line-height: 1.5; color: #d4d4d8;">In the meantime, feel free to explore our platform or check your application status directly in your dashboard if you are a registered user.</p>
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #27272a; font-size: 0.85em; color: #71717a;">
          <p style="margin: 0;">This is an automated receipt. Please do not reply directly to this email.</p>
          <p style="margin: 5px 0 0 0;">&copy; ${new Date().getFullYear()} Bezalel Studio. All rights reserved.</p>
        </div>
      </div>
    `;

    sendEmail({
      to: email,
      subject: `Application Received: ${job.title} at Bezalel Studio`,
      html: applicantHtml,
    }).catch((err) => console.error("❌ Failed to send confirmation email to applicant:", err));

    // 2. Admin Alert Email
    const adminEmail = process.env.SEED_ADMIN_EMAIL || "bezalel@bezalelstudio.com";
    const appUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/studio/careers`;
    
    const adminHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; background-color: #09090b; color: #f4f4f5; border: 1px solid #27272a; border-radius: 8px;">
        <h2 style="color: #10b981; border-bottom: 1px solid #27272a; padding-bottom: 12px; margin-top: 0; font-size: 1.4em;">New Application Alert</h2>
        <p style="color: #e4e4e7;">A new application has been submitted for the role of <strong>${job.title}</strong> (${job.department}).</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 0.95em;">
          <tbody>
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-weight: bold; width: 140px;">Applicant Name:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #f4f4f5;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-weight: bold;">Applicant Email:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a;"><a href="mailto:${email}" style="color: #10b981; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-weight: bold;">Applicant Phone:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #f4f4f5;">${phone || "Not provided"}</td>
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
          coverNote
            ? `
          <div style="background-color: #18181b; border: 1px solid #27272a; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <span style="font-weight: bold; color: #a1a1aa; display: block; margin-bottom: 8px; font-size: 0.9em;">Cover Note:</span>
            <p style="margin: 0; color: #e4e4e7; font-size: 0.95em; white-space: pre-wrap; line-height: 1.5;">${coverNote}</p>
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
