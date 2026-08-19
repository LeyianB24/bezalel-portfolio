import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { AppStatus } from "@prisma/client";

const applicationUpdateSchema = z.object({
  status: z.nativeEnum(AppStatus).optional(),
  adminNote: z.string().nullable().optional(),
});

export async function PATCH(
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
    const parsedData = applicationUpdateSchema.parse(body);

    const updatedApplication = await prisma.jobApplication.update({
      where: { id },
      data: parsedData,
      include: {
        job: true,
      },
    });

    // Notify applicant of status change if applicable
    if (parsedData.status && updatedApplication.email) {
      let statusText = "";
      let statusDetails = "";

      switch (parsedData.status) {
        case "SHORTLISTED":
          statusText = "Shortlisted";
          statusDetails = "We have shortlisted your application! Our hiring team will contact you shortly to schedule the next phase.";
          break;
        case "INTERVIEWED":
          statusText = "Interview Process";
          statusDetails = "Your interview stage is logged. We are currently calibrating candidate feedback and will get back to you shortly.";
          break;
        case "OFFERED":
          statusText = "Offer Extended 🎉";
          statusDetails = "Congratulations! We are thrilled to offer you a position at Bezalel Technologies. Check your email inbox for our official offer documentation and onboarding steps.";
          break;
        case "REJECTED":
          statusText = "Application Closed";
          statusDetails = "Thank you for investing your time to interview and share your experiences with us. We enjoyed learning more about your background. While we won't be moving forward with your candidacy for this role, we will keep your CV on file for future openings that match your skill set.";
          break;
        case "REVIEWED":
          statusText = "Under Review";
          statusDetails = "Your application details and qualifications are being actively evaluated by our recruitment committee.";
          break;
        default:
          break;
      }

      if (statusText) {
        const emailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #0B2036; color: #FAF6EC; border-radius: 8px;">
            <div style="border-bottom: 2px solid #C9A24B; padding-bottom: 16px; margin-bottom: 24px;">
              <h1 style="color: #FAF6EC; margin: 0; font-size: 22px; letter-spacing: 1px;">BEZALEL TECHNOLOGIES</h1>
              <p style="color: #E8CD84; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Engineering Talent & Operations</p>
            </div>

            <p style="font-size: 15px; line-height: 1.6; color: #FAF6EC;">Dear <strong>${updatedApplication.name}</strong>,</p>
            <p style="line-height: 1.6; color: #E0E7EC; font-size: 14px;">Here is an update regarding your application for the <strong>${updatedApplication.job.title}</strong> position:</p>
            
            <div style="background-color: #050D17; border: 1px solid #C9A24B; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <span style="font-weight: bold; color: #E8CD84; display: block; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Status: ${statusText}</span>
              <p style="margin: 0; color: #E0E7EC; font-size: 13px; line-height: 1.5;">${statusDetails}</p>
            </div>
            
            <p style="line-height: 1.6; color: #E0E7EC; font-size: 13px;">If you have any questions or require additional details, feel free to reply to this email.</p>
            
            <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #1B2430; font-size: 11px; color: #8FA0B3;">
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} Bezalel Technologies Ltd. All rights reserved. · <a href="https://bezalel.website" style="color: #E8CD84; text-decoration: none;">bezalel.website</a></p>
            </div>
          </div>
        `;

        const { sendEmail } = await import("@/lib/resend");
        sendEmail({
          to: updatedApplication.email,
          subject: `Update regarding your application: ${updatedApplication.job.title} at Bezalel Technologies`,
          html: emailHtml,
        }).catch((err) => console.error("❌ Failed to send status update email to applicant:", err));
      }
    }

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error("❌ PATCH application error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
