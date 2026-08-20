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

  const fromAddress = process.env.EMAIL_FROM || "Bezalel Technologies <onboarding@resend.dev>";

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
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
      console.warn("⚠️ Resend Email Send Warning:", error);

      // Handle Resend testing/sandbox restriction (only allowed to send to account owner's email)
      const isSandboxRestriction =
        (error as any).statusCode === 403 ||
        (error.message && error.message.includes("only send testing emails to your own email address"));

      if (isSandboxRestriction) {
        const ownerEmail = "leyianbeza24@gmail.com";
        console.log(`🔄 Retrying email send in sandbox mode to account owner: ${ownerEmail} (intended for: ${recipient})`);

        try {
          const retryHtml = `
            <div style="background:#FFFBEB;border:1px solid #F59E0B;padding:12px;margin-bottom:16px;border-radius:6px;color:#92400E;font-size:12px;font-family:sans-serif;">
              <strong>⚠️ Resend Sandbox Notice:</strong> This email was originally addressed to <code>${recipient}</code>, but was delivered to your verified Resend account owner email (<code>${ownerEmail}</code>) because a custom domain has not been verified yet on Resend.
            </div>
            ${html}
          `;

          const retryResult = await resend.emails.send({
            from: fromAddress,
            to: ownerEmail,
            subject: `[Sandbox Mode - for ${recipient}] ${subject}`,
            html: retryHtml,
            attachments: attachments?.map((att) => ({
              filename: att.filename,
              content: att.content,
            })),
          });

          if (!retryResult.error) {
            console.log("✅ Successfully delivered test email to Resend account owner in sandbox mode");
            return {
              success: true,
              data: retryResult.data,
              sandboxRedirect: true,
              originalRecipient: recipient,
            };
          }
        } catch (retryErr) {
          console.error("❌ Sandbox retry failed:", retryErr);
        }
      }

      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("❌ Failed to send email via Resend:", error);
    return { success: false, error };
  }
}
