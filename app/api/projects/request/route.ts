import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadFile } from "@/lib/cloudinary";
import { sendEmail } from "@/lib/resend";
import { auth } from "@/auth";
import { z } from "zod";
import { ProjectCategory } from "@prisma/client";

const projectRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional().nullable(),
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.nativeEnum(ProjectCategory),
  budget: z.preprocess((val) => {
    if (!val || val === "null" || val === "undefined") return null;
    const num = Number(val);
    return isNaN(num) ? null : num;
  }, z.number().nullable().optional()),
  timeline: z.string().optional().nullable(),
});

export async function POST(req: Request) {
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

    // Send emails (non-blocking)
    // 1. Client Confirmation Email
    const clientHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; background-color: #09090b; color: #f4f4f5; border: 1px solid #27272a; border-radius: 8px;">
        <h2 style="color: #10b981; border-bottom: 1px solid #27272a; padding-bottom: 12px; margin-top: 0; font-size: 1.5em; letter-spacing: 0.05em;">BEZALEL STUDIO</h2>
        <p style="font-size: 1.1em; line-height: 1.5;">Dear <strong>${name}</strong>,</p>
        <p style="line-height: 1.5; color: #d4d4d8;">We have successfully received your project request: <strong>&ldquo;${title}&rdquo;</strong>.</p>
        <p style="line-height: 1.5; color: #d4d4d8;">Our engineering team is already reviewing your brief and details. We will assess the specifications, category, budget, and timeline to provide a detailed estimate and quote.</p>
        <p style="line-height: 1.5; color: #d4d4d8;">We typically get back to you with questions or an initial project quote within <strong>24–48 hours</strong>.</p>
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #27272a; font-size: 0.85em; color: #71717a;">
          <p style="margin: 0;">This is an automated confirmation of receipt. Please do not reply directly to this email.</p>
          <p style="margin: 5px 0 0 0;">&copy; ${new Date().getFullYear()} Bezalel Studio. All rights reserved.</p>
        </div>
      </div>
    `;

    sendEmail({
      to: email,
      subject: `Project Proposal Received: ${title}`,
      html: clientHtml,
    }).catch((err) => console.error("❌ Failed to send confirmation email to client:", err));

    // 2. Admin Notification Email
    const adminEmail = process.env.SEED_ADMIN_EMAIL || "bezalel@bezalelstudio.com";
    const studioUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/studio/projects`;

    const adminHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; background-color: #09090b; color: #f4f4f5; border: 1px solid #27272a; border-radius: 8px;">
        <h2 style="color: #10b981; border-bottom: 1px solid #27272a; padding-bottom: 12px; margin-top: 0; font-size: 1.4em;">New Project Request Alert</h2>
        <p style="color: #e4e4e7;">A new project brief has been submitted to the pipeline.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 0.95em;">
          <tbody>
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-weight: bold; width: 140px;">Client Name:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #f4f4f5;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-weight: bold;">Client Email:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a;"><a href="mailto:${email}" style="color: #10b981; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-weight: bold;">Company:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #f4f4f5;">${company || "None"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-weight: bold;">Project Title:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #f4f4f5;">${title}</td>
            </tr>
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-weight: bold;">Category:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #f4f4f5;">${category}</td>
            </tr>
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-weight: bold;">Est. Budget:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #f4f4f5;">${budget ? `$${budget.toLocaleString()}` : "Not specified"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-weight: bold;">Timeline:</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #f4f4f5;">${timeline || "Not specified"}</td>
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
          <p style="margin: 0; color: #e4e4e7; font-size: 0.95em; white-space: pre-wrap; line-height: 1.5;">${description}</p>
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
      subject: `New Project Request: ${title} from ${name}`,
      html: adminHtml,
    }).catch((err) => console.error("❌ Failed to send notification email to admin:", err));

    return NextResponse.json(projectRequest, { status: 201 });
  } catch (error) {
    console.error("❌ Project Request POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
