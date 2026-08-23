import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST as stripePost } from "@/app/api/webhooks/stripe/route";
import { handleMpesaCallback, POST as mpesaPost } from "@/app/api/webhooks/mpesa/route";
import { POST as mpesaSecretPost } from "@/app/api/webhooks/mpesa/[secret]/route";
import prisma from "@/lib/prisma";

// Mock prisma and email
vi.mock("@/lib/prisma", () => ({
  default: {
    order: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    product: {
      update: vi.fn(),
    },
  },
}));

vi.mock("@/lib/order-email", () => ({
  sendOrderConfirmationEmail: vi.fn().mockResolvedValue({ success: true }),
}));

// Mock next/headers
const mockGetHeader = vi.fn();
vi.mock("next/headers", () => ({
  headers: vi.fn(async () => ({
    get: mockGetHeader,
  })),
}));

// Mock stripe constructEvent
vi.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: {
      constructEvent: vi.fn(),
    },
  },
}));

describe("Payment Webhooks Payload Parsing", () => {
  describe("M-Pesa Callback Structure", () => {
    it("parses successful M-Pesa STK Callback metadata correctly", () => {
      const successfulMpesaPayload = {
        Body: {
          stkCallback: {
            MerchantRequestID: "29115-34620561-1",
            CheckoutRequestID: "ws_CO_19122023102443292742232924",
            ResultCode: 0,
            ResultDesc: "The service request is processed successfully.",
            CallbackMetadata: {
              Item: [
                { Name: "Amount", Value: 45000.0 },
                { Name: "MpesaReceiptNumber", Value: "RL12AB34CD" },
                { Name: "TransactionDate", Value: 20240820123000 },
                { Name: "PhoneNumber", Value: 254712345678 },
              ],
            },
          },
        },
      };

      const stkCallback = successfulMpesaPayload.Body.stkCallback;
      expect(stkCallback.ResultCode).toBe(0);

      let mpesaReceiptNumber = "";
      let phoneNumber = "";
      let amount = 0;

      for (const item of stkCallback.CallbackMetadata.Item) {
        if (item.Name === "MpesaReceiptNumber") mpesaReceiptNumber = String(item.Value);
        if (item.Name === "PhoneNumber") phoneNumber = String(item.Value);
        if (item.Name === "Amount") amount = Number(item.Value);
      }

      expect(mpesaReceiptNumber).toBe("RL12AB34CD");
      expect(phoneNumber).toBe("254712345678");
      expect(amount).toBe(45000);
    });

    it("identifies failed or cancelled M-Pesa callbacks (ResultCode != 0)", () => {
      const userCancelledPayload = {
        Body: {
          stkCallback: {
            MerchantRequestID: "29115-34620561-1",
            CheckoutRequestID: "ws_CO_19122023102443292742232924",
            ResultCode: 1032,
            ResultDesc: "Request cancelled by user",
          },
        },
      };

      const stkCallback = userCancelledPayload.Body.stkCallback;
      expect(stkCallback.ResultCode).not.toBe(0);
      expect(stkCallback.ResultCode).toBe(1032);
      expect(stkCallback.ResultDesc).toContain("cancelled");
    });
  });

  describe("Stripe Webhook Event Structure", () => {
    it("extracts orderId metadata from checkout.session.completed event", () => {
      const stripeEvent = {
        id: "evt_test_123456",
        object: "event",
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_test_a1b2c3d4",
            payment_intent: "pi_3MtwBwLkdIwHu7ix28a3tqPa",
            amount_total: 850000,
            currency: "kes",
            customer_details: {
              email: "client@example.com",
              name: "Samuel Ochieng",
            },
            metadata: {
              orderId: "order_clx123456789",
            },
          },
        },
      };

      expect(stripeEvent.type).toBe("checkout.session.completed");
      expect(stripeEvent.data.object.metadata.orderId).toBe("order_clx123456789");
      expect(stripeEvent.data.object.payment_intent).toBe("pi_3MtwBwLkdIwHu7ix28a3tqPa");
    });
  });
});

describe("Stripe Webhook Security Tests", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("rejects request with 400 when stripe-signature header is missing", async () => {
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_secret";
    mockGetHeader.mockReturnValue(null); // No signature header

    const req = new Request("http://localhost:3000/api/webhooks/stripe", {
      method: "POST",
      body: JSON.stringify({ type: "checkout.session.completed" }),
    });

    const response = await stripePost(req);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe("Missing stripe-signature header");
  });

  it("rejects request with 400 when STRIPE_WEBHOOK_SECRET is not configured", async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
    mockGetHeader.mockReturnValue("t=123,v1=test_sig");

    const req = new Request("http://localhost:3000/api/webhooks/stripe", {
      method: "POST",
      body: JSON.stringify({ type: "checkout.session.completed" }),
    });

    const response = await stripePost(req);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe("Stripe webhook secret is not configured");
  });

  it("rejects request with 400 when signature verification fails in constructEvent", async () => {
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_secret";
    mockGetHeader.mockReturnValue("t=123,v1=invalid_signature");

    const { stripe } = await import("@/lib/stripe");
    vi.mocked(stripe.webhooks.constructEvent).mockImplementationOnce(() => {
      throw new Error("Invalid signature");
    });

    const req = new Request("http://localhost:3000/api/webhooks/stripe", {
      method: "POST",
      body: JSON.stringify({ type: "checkout.session.completed" }),
    });

    const response = await stripePost(req);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe("Webhook signature verification failed");
  });
});

describe("M-Pesa Webhook Security Tests", () => {
  const originalEnv = process.env;
  const validSecret = "mpesa_secure_secret_token_123";

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv, MPESA_CALLBACK_SECRET: validSecret };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("rejects callback with 401 when no secret is provided", async () => {
    const req = new Request("http://localhost:3000/api/webhooks/mpesa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Body: { stkCallback: { ResultCode: 0, CheckoutRequestID: "ws_CO_123" } },
      }),
    });

    const response = await mpesaPost(req);
    expect(response.status).toBe(401);

    const data = await response.json();
    expect(data.ResultCode).toBe(1);
    expect(data.ResultDesc).toContain("Unauthorized");
  });

  it("rejects callback with 401 when an incorrect secret is provided in query", async () => {
    const req = new Request("http://localhost:3000/api/webhooks/mpesa?secret=wrong_secret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Body: { stkCallback: { ResultCode: 0, CheckoutRequestID: "ws_CO_123" } },
      }),
    });

    const response = await mpesaPost(req);
    expect(response.status).toBe(401);
  });

  it("rejects callback with 401 when an incorrect secret is provided in dynamic path route", async () => {
    const req = new Request("http://localhost:3000/api/webhooks/mpesa/wrong_secret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Body: { stkCallback: { ResultCode: 0, CheckoutRequestID: "ws_CO_123" } },
      }),
    });

    const response = await mpesaSecretPost(req, { params: Promise.resolve({ secret: "wrong_secret" }) });
    expect(response.status).toBe(401);
  });

  it("rejects callback with 401 when MPESA_CALLBACK_SECRET is not configured in env", async () => {
    delete process.env.MPESA_CALLBACK_SECRET;

    const req = new Request(`http://localhost:3000/api/webhooks/mpesa?secret=${validSecret}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Body: { stkCallback: { ResultCode: 0, CheckoutRequestID: "ws_CO_123" } },
      }),
    });

    const response = await mpesaPost(req);
    expect(response.status).toBe(401);
  });

  it("accepts callback with valid secret via path parameter and queries order strictly by CheckoutRequestID", async () => {
    const checkoutRequestId = "ws_CO_valid_123";
    vi.mocked(prisma.order.findFirst).mockResolvedValueOnce({
      id: "order_123",
      status: "PAYMENT_PENDING" as any,
      total: 5000,
      name: "John Doe",
      email: "john@example.com",
      phone: "254700000000",
      shippingAddress: {},
      items: [],
    } as any);

    const validPayload = {
      Body: {
        stkCallback: {
          MerchantRequestID: "29115-34620561-1",
          CheckoutRequestID: checkoutRequestId,
          ResultCode: 0,
          ResultDesc: "The service request is processed successfully.",
          CallbackMetadata: {
            Item: [
              { Name: "Amount", Value: 5000.0 },
              { Name: "MpesaReceiptNumber", Value: "RECEIPT123" },
              { Name: "PhoneNumber", Value: 254700000000 },
            ],
          },
        },
      },
    };

    const req = new Request(`http://localhost:3000/api/webhooks/mpesa/${validSecret}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const response = await mpesaSecretPost(req, { params: Promise.resolve({ secret: validSecret }) });
    expect(response.status).toBe(200);

    // Verify lookup was done strictly by paymentRef: CheckoutRequestID
    expect(prisma.order.findFirst).toHaveBeenCalledWith({
      where: { paymentRef: checkoutRequestId },
      include: { items: { include: { product: true } } },
    });

    // Verify order was marked PAID
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: "order_123" },
      data: {
        status: "PAID",
        mpesaRef: "RECEIPT123",
      },
    });
  });

  it("does not update or guess orders if CheckoutRequestID is not found in database", async () => {
    const checkoutRequestId = "ws_CO_unmatched_999";
    vi.mocked(prisma.order.findFirst).mockResolvedValueOnce(null);

    const payload = {
      Body: {
        stkCallback: {
          MerchantRequestID: "29115-34620561-1",
          CheckoutRequestID: checkoutRequestId,
          ResultCode: 0,
          ResultDesc: "The service request is processed successfully.",
          CallbackMetadata: {
            Item: [
              { Name: "Amount", Value: 5000.0 },
              { Name: "MpesaReceiptNumber", Value: "RECEIPT999" },
              { Name: "PhoneNumber", Value: 254700000000 },
            ],
          },
        },
      },
    };

    const req = new Request(`http://localhost:3000/api/webhooks/mpesa?secret=${validSecret}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const response = await mpesaPost(req);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.ResultDesc).toContain("manual reconciliation");

    // Ensure update was NOT called
    expect(prisma.order.update).not.toHaveBeenCalled();
  });
});
