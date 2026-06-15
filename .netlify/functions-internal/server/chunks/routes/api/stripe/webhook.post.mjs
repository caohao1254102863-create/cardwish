import { d as defineEventHandler, b as getHeader, s as setResponseStatus, c as readRawBody, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import { g as getServiceClient } from '../../../_/supabase.mjs';
import { v as verifyWebhookSignature } from '../../../_/stripe.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/supabase-js';
import 'stripe';

const webhook_post = defineEventHandler(async (event) => {
  var _a;
  const supabase = getServiceClient();
  try {
    const signature = getHeader(event, "stripe-signature");
    if (!signature) {
      setResponseStatus(event, 400);
      return { error: "Missing stripe-signature header" };
    }
    const rawBody = await readRawBody(event);
    if (!rawBody) {
      setResponseStatus(event, 400);
      return { error: "Missing request body" };
    }
    let stripeEvent;
    try {
      stripeEvent = verifyWebhookSignature(rawBody, signature);
    } catch (err) {
      setResponseStatus(event, 400);
      return { error: "Invalid webhook signature" };
    }
    switch (stripeEvent.type) {
      case "checkout.session.completed": {
        const session = stripeEvent.data.object;
        const { order_id, share_code, payer_message } = session.metadata || {};
        if (!order_id) {
          console.error("No order_id in session metadata");
          break;
        }
        const { data: existing } = await supabase.from("payments").select("id").eq("stripe_session_id", session.id).single();
        if (existing) {
          console.log("Payment already processed:", session.id);
          return { received: true, status: "already_processed" };
        }
        const { data: order } = await supabase.from("orders").select("*").eq("id", order_id).single();
        if (!order) {
          console.error("Order not found:", order_id);
          break;
        }
        if (order.status !== "pending") {
          console.log("Order not pending:", order_id, order.status);
          break;
        }
        const { data: payment, error: paymentError } = await supabase.from("payments").insert({
          order_id,
          stripe_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent,
          amount_cents: session.amount_total,
          currency: ((_a = session.currency) == null ? void 0 : _a.toUpperCase()) || "USD",
          status: "succeeded",
          payer_message: payer_message || null,
          paid_at: (/* @__PURE__ */ new Date()).toISOString()
        }).select("id").single();
        if (paymentError) {
          console.error("Failed to create payment:", paymentError);
          break;
        }
        const totalCents = order.total_cents;
        const platformFeeCents = Math.round(totalCents * 0.3);
        const creatorEarningCents = totalCents - platformFeeCents;
        await supabase.from("earnings").insert({
          user_id: order.creator_id,
          order_id,
          payment_id: payment.id,
          amount_cents: creatorEarningCents,
          platform_fee_cents: platformFeeCents,
          description: "Card payment received"
        });
        const { error: walletError } = await supabase.rpc("credit_wallet", {
          p_user_id: order.creator_id,
          p_amount_cents: creatorEarningCents
        });
        if (walletError) {
          const { data: wallet } = await supabase.from("wallets").select("balance_cents, total_earned_cents").eq("user_id", order.creator_id).single();
          if (wallet) {
            await supabase.from("wallets").update({
              balance_cents: wallet.balance_cents + creatorEarningCents,
              total_earned_cents: wallet.total_earned_cents + creatorEarningCents
            }).eq("user_id", order.creator_id);
          }
        }
        const cardImageUrl = `${useRuntimeConfig().public.siteUrl}/og-default.png`;
        const { data: genCard } = await supabase.from("generated_cards").insert({
          order_id,
          image_url: cardImageUrl
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
        }).eq("id", order_id);
        console.log("Payment processed successfully:", order_id, "Earnings:", creatorEarningCents);
        break;
      }
      case "checkout.session.expired": {
        console.log("Checkout session expired:", stripeEvent.data.object);
        break;
      }
      default:
        console.log("Unhandled event type:", stripeEvent.type);
    }
    return { received: true };
  } catch (e) {
    console.error("Webhook error:", e);
    setResponseStatus(event, 500);
    return { error: e.message };
  }
});

export { webhook_post as default };
//# sourceMappingURL=webhook.post.mjs.map
