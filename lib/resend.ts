import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  cc?: string | string[];
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
  }>;
}

export async function sendEmail({ to, subject, html, cc, replyTo, attachments }: SendEmailParams) {
  const recipient = Array.isArray(to) ? to.join(", ") : to;

  if (!resend) {
    console.log("\n==========================================");
    console.log("📨 [MOCK EMAIL SENT]");
    console.log(`To:          ${recipient}`);
    if (cc) console.log(`CC:          ${Array.isArray(cc) ? cc.join(", ") : cc}`);
    console.log(`Subject:     ${subject}`);
    if (attachments) console.log(`Attachments: ${attachments.map(a => a.filename).join(", ")}`);
    console.log("------------------------------------------");
    console.log(html);
    console.log("==========================================\n");
    return { success: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Bezalel Technologies <onboarding@resend.dev>",
      to,
      subject,
      html,
      cc,
      replyTo,
      attachments: attachments?.map((att) => ({
        filename: att.filename,
        content: att.content,
      })),
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
