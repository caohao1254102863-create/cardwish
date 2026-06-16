import { d as defineEventHandler, g as getRouterParam, r as readBody, s as setResponseStatus } from '../../../../nitro/nitro.mjs';
import { g as getServiceClient } from '../../../../_/supabase.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/supabase-js';

const demoPay_post = defineEventHandler(async (event) => {
  try {
    const supabase = getServiceClient();
    const shareCode = getRouterParam(event, "share_code");
    const body = await readBody(event);
    const { payer_message } = body || {};
    const { data: order, error } = await supabase.from("orders").select("id, creator_id, total_cents, currency, status, expires_at").eq("share_code", shareCode).single();
    if (error || !order) {
      setResponseStatus(event, 404);
      return { error: "Order not found" };
    }
    if (order.status !== "pending") {
      setResponseStatus(event, 400);
      return { error: "Order already processed" };
    }
    const { data: payment } = await supabase.from("payments").insert({
      order_id: order.id,
      amount_cents: order.total_cents,
      currency: order.currency,
      status: "succeeded",
      payment_method: "stripe",
      payer_message: payer_message || null,
      paid_at: (/* @__PURE__ */ new Date()).toISOString()
    }).select("id").single();
    if (!payment) throw new Error("Failed to create payment");
    const platformFee = Math.round(order.total_cents * 0.3);
    const creatorEarning = order.total_cents - platformFee;
    await supabase.from("earnings").insert({
      user_id: order.creator_id,
      order_id: order.id,
      payment_id: payment.id,
      amount_cents: creatorEarning,
      platform_fee_cents: platformFee,
      description: "Demo payment"
    });
    const { data: wallet } = await supabase.from("wallets").select("balance_cents, total_earned_cents").eq("user_id", order.creator_id).single();
    if (wallet) {
      await supabase.from("wallets").update({
        balance_cents: wallet.balance_cents + creatorEarning,
        total_earned_cents: wallet.total_earned_cents + creatorEarning
      }).eq("user_id", order.creator_id);
    }
    const { data: genCard } = await supabase.from("generated_cards").insert({
      order_id: order.id,
      image_url: "/og-default.png"
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
    return { success: true, order_id: order.id };
  } catch (e) {
    setResponseStatus(event, 500);
    return { error: e.message };
  }
});

export { demoPay_post as default };
//# sourceMappingURL=demo-pay.post.mjs.map
