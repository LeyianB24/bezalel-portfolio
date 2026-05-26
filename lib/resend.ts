import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const recipient = Array.isArray(to) ? to.join(", ") : to;

  if (!resend) {
    console.log("\n==========================================");
    console.log("📨 [MOCK EMAIL SENT]");
    console.log(`To:      ${recipient}`);
    console.log(`Subject: ${subject}`);
    console.log("------------------------------------------");
    console.log(html);
    console.log("==========================================\n");
    return { success: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Bezalel Studio <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("❌ Resend Email Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("❌ Failed to send email via Resend:", error);
    return { success: false, error };
  }
}
