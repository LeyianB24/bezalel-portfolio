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
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #0B2036; color: #FAF6EC; border-radius: 8px;">
          <div style="border-bottom: 2px solid #C9A24B; padding-bottom: 16px; margin-bottom: 24px;">
            <h1 style="color: #FAF6EC; margin: 0; font-size: 22px; letter-spacing: 1px;">BEZALEL TECHNOLOGIES</h1>
            <p style="color: #E8CD84; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Software & Infrastructure Engineering</p>
          </div>

          <p style="font-size: 15px; line-height: 1.6; color: #FAF6EC;">Dear <strong>${updated.name}</strong>,</p>
          <p style="line-height: 1.6; color: #E0E7EC; font-size: 14px;">Here is a pipeline update regarding your project request <strong>&ldquo;${updated.title}&rdquo;</strong>:</p>
          
          <div style="background-color: #050D17; border: 1px solid #C9A24B; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <span style="font-weight: bold; color: #E8CD84; display: block; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Pipeline Status: ${statusTitle}</span>
            <p style="margin: 0 0 12px 0; color: #E0E7EC; font-size: 13px; line-height: 1.5; white-space: pre-line;">${statusDetails}</p>
            ${
              currentQuote !== null
                ? `<p style="margin: 10px 0 0 0; color: #FAF6EC; font-size: 14px; border-top: 1px solid #1B2430; padding-top: 10px;">
                    <strong>Estimated Cost:</strong> KES ${currentQuote.toLocaleString()}
                   </p>`
                : ""
            }
          </div>
          
          <p style="line-height: 1.6; color: #E0E7EC; font-size: 13px;">If you have any questions, you can respond to this email thread or reach our engineers directly on WhatsApp at <strong>+254 796 157 265</strong>.</p>
          
          <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #1B2430; font-size: 11px; color: #8FA0B3;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Bezalel Technologies Ltd. All rights reserved. · <a href="https://bezalel.website" style="color: #E8CD84; text-decoration: none;">bezalel.website</a></p>
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
