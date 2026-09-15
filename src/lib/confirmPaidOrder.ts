import { confirmBackendPayment } from "@/lib/hybridAppApi";
import { getPineLabsOrder, isPineLabsOrderPaid } from "@/lib/pinelabs";

export type ConfirmPaidOrderInput = {
  orderId: string;
  email?: string | null;
  planId?: string | null;
  userId?: string | null;
  merchantOrderReference?: string | null;
  mobile?: string | null;
};

export async function confirmPaidOrderAndActivate(input: ConfirmPaidOrderInput) {
  const orderId = input.orderId.trim();
  if (!orderId) throw new Error("orderId is required");

  try {
    const order = await getPineLabsOrder(
      orderId,
      input.merchantOrderReference?.trim() || undefined,
    );
    if (!isPineLabsOrderPaid(order)) {
      throw new Error("Payment is not confirmed yet. Try again in a moment.");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.toLowerCase().includes("not confirmed")) throw error;
  }

  const result = await confirmBackendPayment({
    orderId,
    email: input.email,
    planId: input.planId,
    userId: input.userId,
    merchantOrderReference: input.merchantOrderReference?.trim() || undefined,
    mobile: input.mobile,
  });

  if (result.ok === false) {
    throw new Error("Payment was not completed");
  }

  return {
    ...result,
    planId: result.planId,
    planName: result.planName,
    email: result.email,
  };
}
