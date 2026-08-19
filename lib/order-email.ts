import { sendEmail } from "./resend";
import { generateOrderInvoicePdfBuffer } from "./invoice-pdf";

export interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  paymentMethod: string;
  paymentRef?: string | null;
  shippingAddress: string | { street?: string; city?: string; country?: string };
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const adminEmail = process.env.ADMIN_EMAIL || "bezaleltech@gmail.com";
  const address = typeof data.shippingAddress === "string" 
    ? data.shippingAddress 
    : `${data.shippingAddress.street || ""}, ${data.shippingAddress.city || ""}, ${data.shippingAddress.country || "Kenya"}`;

  const orderDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const orderRef = data.orderId.slice(-8).toUpperCase();

  let pdfAttachment: { filename: string; content: Buffer } | undefined;
  try {
    const pdfBuffer = await generateOrderInvoicePdfBuffer({
      orderId: data.orderId,
      date: orderDate,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone || null,
      shippingAddress: address,
      items: data.items,
      subtotal: data.total,
      tax: 0,
      total: data.total,
      paymentMethod: data.paymentMethod,
      paymentRef: data.paymentRef || null,
    });
    pdfAttachment = {
      filename: `Tax_Invoice_${orderRef}.pdf`,
      content: pdfBuffer,
    };
  } catch (pdfErr) {
    console.error("❌ Failed to generate order invoice PDF:", pdfErr);
  }

  const itemsHtml = data.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #1B2430;">
        <td style="padding: 10px 0; color: #FAF6EC;">
          <strong>${item.name}</strong> × ${item.quantity}
        </td>
        <td style="padding: 10px 0; text-align: right; font-family: monospace; color: #E8CD84;">
          KES ${(item.price * item.quantity).toLocaleString("en-KE", { minimumFractionDigits: 2 })}
        </td>
      </tr>
    `
    )
    .join("");

  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #0B2036; color: #FAF6EC; border-radius: 8px;">
      <div style="border-bottom: 2px solid #C9A24B; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="color: #FAF6EC; margin: 0; font-size: 22px; letter-spacing: 1px;">BEZALEL STORE</h1>
        <p style="color: #E8CD84; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Order Confirmation & Official Tax Invoice</p>
      </div>

      <p style="font-size: 15px; line-height: 1.6; color: #FAF6EC;">Dear <strong>${data.customerName}</strong>,</p>
      
      <p style="font-size: 14px; line-height: 1.6; color: #E0E7EC;">
        Thank you for your order! We have received your payment and are preparing your hardware/items for dispatch. Your official branded PDF invoice is attached to this email.
      </p>

      <div style="background-color: #050D17; border: 1px solid #C9A24B; border-radius: 6px; padding: 20px; margin: 24px 0;">
        <div style="font-size: 12px; font-weight: bold; color: #E8CD84; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
          Order #${orderRef}
        </div>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          ${itemsHtml}
          <tr>
            <td style="padding: 12px 0 6px 0; font-weight: bold; color: #FAF6EC; font-size: 14px;">Total Paid:</td>
            <td style="padding: 12px 0 6px 0; text-align: right; font-weight: bold; color: #E8CD84; font-size: 16px; font-family: monospace;">
              KES ${data.total.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
            </td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #8FA0B3; font-size: 12px;">Payment Method:</td>
            <td style="padding: 4px 0; text-align: right; color: #E0E7EC; font-size: 12px;">
              ${data.paymentMethod}${data.paymentRef ? ` (${data.paymentRef})` : ""}
            </td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #8FA0B3; font-size: 12px;">Delivery Address:</td>
            <td style="padding: 4px 0; text-align: right; color: #E0E7EC; font-size: 12px;">
              ${address}
            </td>
          </tr>
        </table>
      </div>

      <p style="font-size: 13px; line-height: 1.6; color: #E0E7EC;">
        Our logistics team will contact you at <strong>${data.customerPhone || data.customerEmail}</strong> with delivery tracking details once the package departs our Nairobi facility.
      </p>

      <div style="margin-top: 32px; border-top: 1px solid #1B2430; padding-top: 16px; font-size: 11px; color: #8FA0B3;">
        <p style="margin: 0 0 4px 0;">Bezalel Technologies Hardware & IT Distribution</p>
        <p style="margin: 0;">Nairobi, Kenya · +254 796 157 265 · <a href="https://bezalel.website" style="color: #E8CD84; text-decoration: none;">bezalel.website</a></p>
      </div>
    </div>
  `;

  return sendEmail({
    to: data.customerEmail,
    cc: adminEmail,
    subject: `Order Confirmation #${orderRef} (Invoice Attached) - Bezalel Technologies`,
    html: emailHtml,
    attachments: pdfAttachment ? [pdfAttachment] : undefined,
  });
}
