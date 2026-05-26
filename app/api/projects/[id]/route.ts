import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { ProjectStatus } from "@prisma/client";
import { sendEmail } from "@/lib/resend";

const projectUpdateSchema = z.object({
  status: z.nativeEnum(ProjectStatus).optional(),
  adminNote: z.string().nullable().optional(),
  quotedPrice: z.preprocess((val) => {
    if (val === null || val === undefined || val === "") return null;
    const num = Number(val);
    return isNaN(num) ? null : num;
  }, z.number().nullable().optional()),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth guard: Admin only
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsedData = projectUpdateSchema.parse(body);

    // Fetch existing request to check for changes
    const existing = await prisma.projectRequest.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Project request not found" }, { status: 404 });
    }

    // Update Project Request in DB
    const updated = await prisma.projectRequest.update({
      where: { id },
      data: parsedData,
    });

    const statusChanged = parsedData.status && parsedData.status !== existing.status;
    const quoteChanged = parsedData.quotedPrice !== undefined && parsedData.quotedPrice !== existing.quotedPrice;

    // Send status update email if status or quote changed
    if ((statusChanged || quoteChanged) && updated.email) {
      let statusTitle = "";
      let statusDetails = "";
      const currentStatus = parsedData.status || existing.status;
      const currentQuote = parsedData.quotedPrice !== undefined ? parsedData.quotedPrice : existing.quotedPrice;

      switch (currentStatus) {
        case "IN_REVIEW":
          statusTitle = "Under Technical Review";
          statusDetails = "Your project brief is currently under active technical review by our team. We are analyzing the architecture, dependencies, and requirements to map out the best execution path.";
          break;
        case "QUOTED":
          statusTitle = "Estimate Proposal Ready 🧾";
          statusDetails = `We have completed our technical assessment and prepared an official estimate/quote for your project proposal.
                          Our estimated price: <strong>$${currentQuote ? currentQuote.toLocaleString() : "TBD"}</strong>.
                          Please review the details in your dashboard, or respond to this message to coordinate next steps or request clarifications.`;
          break;
        case "ACCEPTED":
          statusTitle = "Quote Accepted 🎉";
          statusDetails = "Awesome! We have logged your acceptance of the project quote. We are now setting up the development environments, drafting the service agreement, and preparing for takeoff. A project lead will schedule a kickoff session shortly.";
          break;
        case "IN_PROGRESS":
          statusTitle = "Development Kickoff 🚀";
          statusDetails = "Development has officially commenced! Our engineers are writing code and setting up the core architecture of your system. We will provide updates at key checkpoints.";
          break;
        case "DELIVERED":
          statusTitle = "Project Delivered 🎁";
          statusDetails = "Great news! Development has been finalized, quality assurance tests have passed, and your project has been successfully delivered. Please coordinate with us for domain configuration, asset handovers, and final walkthrough.";
          break;
        case "CANCELLED":
          statusTitle = "Project Request Cancelled";
          statusDetails = "Your project pipeline ticket has been set to Cancelled. If you did not request this or would like to revisit the project in the future, please don't hesitate to reach out.";
          break;
        case "NEW":
        default:
          statusTitle = "Proposal Logged";
          statusDetails = "Your project proposal has been successfully registered in our pipeline and awaits technical indexing.";
          break;
      }

      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; background-color: #09090b; color: #f4f4f5; border: 1px solid #27272a; border-radius: 8px;">
          <h2 style="color: #10b981; border-bottom: 1px solid #27272a; padding-bottom: 12px; margin-top: 0; font-size: 1.5em; letter-spacing: 0.05em;">BEZALEL STUDIO</h2>
          <p style="font-size: 1.1em; line-height: 1.5;">Dear <strong>${updated.name}</strong>,</p>
          <p style="line-height: 1.5; color: #d4d4d8;">Here is a pipeline update regarding your project request <strong>&ldquo;${updated.title}&rdquo;</strong>:</p>
          
          <div style="background-color: #18181b; border: 1px solid #27272a; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <span style="font-weight: bold; color: #10b981; display: block; margin-bottom: 10px; font-size: 1.15em;">Pipeline Status: ${statusTitle}</span>
            <p style="margin: 0 0 12px 0; color: #d4d4d8; font-size: 0.95em; line-height: 1.5; white-space: pre-line;">${statusDetails}</p>
            ${
              currentQuote !== null
                ? `<p style="margin: 10px 0 0 0; color: #f4f4f5; font-size: 0.95em; border-top: 1px solid #27272a; padding-top: 10px;">
                    <strong>Estimated Cost:</strong> $${currentQuote.toLocaleString()}
                   </p>`
                : ""
            }
          </div>
          
          <p style="line-height: 1.5; color: #d4d4d8;">If you have any questions, you can respond to this email thread to speak directly to your dedicated tech partner.</p>
          
          <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #27272a; font-size: 0.85em; color: #71717a;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Bezalel Studio. All rights reserved.</p>
          </div>
        </div>
      `;

      sendEmail({
        to: updated.email,
        subject: `Project Pipeline Update: ${updated.title}`,
        html: emailHtml,
      }).catch((err) => console.error("❌ Failed to send project update email:", err));
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("❌ PATCH project error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
