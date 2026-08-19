import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Save to database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
        status: "UNREAD",
      },
    });

    const { sendEmail } = await import("@/lib/resend");
    const adminEmail = process.env.ADMIN_EMAIL || "bezaleltech@gmail.com";

    // Send admin notification
    sendEmail({
      to: adminEmail,
      replyTo: email,
      subject: `New Inquiry: ${subject} from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; padding: 25px; background-color: #0B2036; color: #FAF6EC; border-radius: 8px;">
          <h2 style="color: #E8CD84; margin-top: 0;">New Inbound Client Inquiry</h2>
          <p><strong>From:</strong> ${name} (<a href="mailto:${email}" style="color: #E8CD84;">${email}</a>)</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="background-color: #050D17; padding: 15px; border-radius: 6px; border: 1px solid #C9A24B; margin: 20px 0;">
            <p style="margin: 0; white-space: pre-wrap; color: #FAF6EC;">${message}</p>
          </div>
        </div>
      `,
    }).catch((err) => console.error("❌ Failed to send contact email to admin:", err));

    return NextResponse.json(contactMessage, { status: 201 });
  } catch (error) {
    console.error("Contact message error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Admin only
    const { auth } = await import("@/auth");
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
