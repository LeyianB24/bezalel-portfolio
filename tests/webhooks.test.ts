import { describe, it, expect } from "vitest";

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
