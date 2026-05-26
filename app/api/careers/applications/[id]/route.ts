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
          statusDetails = "Congratulations! We are thrilled to offer you a position at Bezalel Studio. Check your email inbox for our official offer documentation and onboarding steps.";
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
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; background-color: #09090b; color: #f4f4f5; border: 1px solid #27272a; border-radius: 8px;">
            <h2 style="color: #10b981; border-bottom: 1px solid #27272a; padding-bottom: 12px; margin-top: 0; font-size: 1.5em; letter-spacing: 0.05em;">BEZALEL STUDIO</h2>
            <p style="font-size: 1.1em; line-height: 1.5;">Dear <strong>${updatedApplication.name}</strong>,</p>
            <p style="line-height: 1.5; color: #d4d4d8;">Here is a quick update regarding your application for the <strong>${updatedApplication.job.title}</strong> position:</p>
            
            <div style="background-color: #18181b; border: 1px solid #27272a; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <span style="font-weight: bold; color: #10b981; display: block; margin-bottom: 8px; font-size: 1.1em;">Status: ${statusText}</span>
              <p style="margin: 0; color: #d4d4d8; font-size: 0.95em; line-height: 1.5;">${statusDetails}</p>
            </div>
            
            <p style="line-height: 1.5; color: #d4d4d8;">If you have any questions or require additional details, feel free to contact us.</p>
            <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #27272a; font-size: 0.85em; color: #71717a;">
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} Bezalel Studio. All rights reserved.</p>
            </div>
          </div>
        `;

        const { sendEmail } = await import("@/lib/resend");
        sendEmail({
          to: updatedApplication.email,
          subject: `Update regarding your application: ${updatedApplication.job.title} at Bezalel Studio`,
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
