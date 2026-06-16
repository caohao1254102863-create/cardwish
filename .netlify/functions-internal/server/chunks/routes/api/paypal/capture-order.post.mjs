import { d as defineEventHandler, r as readBody, s as setResponseStatus, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import { g as getServiceClient } from '../../../_/supabase.mjs';
import { a as capturePayPalOrder } from '../../../_/paypal.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/supabase-js';

const captureOrder_post = defineEventHandler(async (event) => {
  try {
    const supabase = getServiceClient();
    const body = await readBody(event);
    const { paypal_order_id, payer_message } = body;
    if (!paypal_order_id) {
      setResponseStatus(event, 400);
      return { error: "paypal_order_id required" };
    }
    const { data: existingPayment } = await supabase.from("payments").select("id, status, order_id").eq("paypal_order_id", paypal_order_id).single();
    if ((existingPayment == null ? void 0 : existingPayment.status) === "succeeded") {
      return { status: "already_processed" };
    }
    let captureResult;
    try {
      captureResult = await capturePayPalOrder(paypal_order_id);
    } catch (e) {
      setResponseStatus(event, 500);
      return { error: "Failed to capture PayPal order: " + e.message };
    }
    if (captureResult.status !== "COMPLETED") {
      setResponseStatus(event, 400);
      return { error: "Payment not completed" };
    }
    const shareCode = captureResult.customId;
    const { data: order } = await supabase.from("orders").select("*").eq("share_code", shareCode).single();
    if (!order) {
      setResponseStatus(event, 404);
      return { error: "Order not found" };
    }
    if (order.status !== "pending") {
      return { status: "already_processed" };
    }
    await supabase.from("payments").update({
      status: "succeeded",
      payer_message: payer_message || null,
      paid_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("paypal_order_id", paypal_order_id);
    const totalCents = order.total_cents;
    const platformFeeCents = Math.round(totalCents * 0.3);
    const creatorEarningCents = totalCents - platformFeeCents;
    const { data: payment } = await supabase.from("payments").select("id").eq("paypal_order_id", paypal_order_id).single();
    if (payment) {
      await supabase.from("earnings").insert({
        user_id: order.creator_id,
        order_id: order.id,
        payment_id: payment.id,
        amount_cents: creatorEarningCents,
        platform_fee_cents: platformFeeCents,
        description: "PayPal payment received"
      });
      await supabase.rpc("credit_wallet", {
        p_user_id: order.creator_id,
        p_amount_cents: creatorEarningCents
      });
      const { data: genCard } = await supabase.from("generated_cards").insert({
        order_id: order.id,
        image_url: `${useRuntimeConfig().public.siteUrl}/og-default.png`
      }).select("id").single();
      if (genCard) {
        await supabase.from("received_cards").insert({
          user_id: order.creator_id,
          generated_card_id: genCard.id,
          is_new: true
        });
      }
      await supabase.from("orders").update({
        status: "delivered",
        paid_at: (/* @__PURE__ */ new Date()).toISOString(),
        delivered_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", order.id);
    }
    return { status: "completed" };
  } catch (e) {
    setResponseStatus(event, 500);
    return { error: e.message };
  }
});

export { captureOrder_post as default };
//# sourceMappingURL=capture-order.post.mjs.map
