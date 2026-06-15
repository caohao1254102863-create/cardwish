import { d as defineEventHandler, g as getRouterParam, r as readBody, s as setResponseStatus } from '../../../../nitro/nitro.mjs';
import { g as getServiceClient } from '../../../../_/supabase.mjs';
import { c as createCheckoutSession } from '../../../../_/stripe.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/supabase-js';
import 'stripe';

const createSession_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e;
  try {
    const supabase = getServiceClient();
    const shareCode = getRouterParam(event, "share_code");
    const body = await readBody(event);
    const { success_url, cancel_url, payer_message, locale } = body;
    const { data: order, error } = await supabase.from("orders").select(`
        id, total_cents, currency, status, expires_at,
        card_templates!inner(name_zh, name_en, images)
      `).eq("share_code", shareCode).single();
    if (error || !order) {
      setResponseStatus(event, 404);
      return { error: "Order not found" };
    }
    if (order.status !== "pending") {
      setResponseStatus(event, 400);
      return { error: "Order is no longer available for payment" };
    }
    if (new Date(order.expires_at) < /* @__PURE__ */ new Date()) {
      await supabase.from("orders").update({ status: "expired" }).eq("id", order.id);
      setResponseStatus(event, 400);
      return { error: "Order has expired" };
    }
    const cardName = ((_a = order.card_templates) == null ? void 0 : _a.name_zh) || ((_b = order.card_templates) == null ? void 0 : _b.name_en) || "Digital Card";
    const cardImageUrl = (_e = (_d = (_c = order.card_templates) == null ? void 0 : _c.images) == null ? void 0 : _d[0]) == null ? void 0 : _e.url;
    const session = await createCheckoutSession({
      orderId: order.id,
      shareCode,
      amountCents: order.total_cents,
      currency: order.currency,
      cardName,
      cardImageUrl,
      successUrl: success_url,
      cancelUrl: cancel_url,
      payerMessage: payer_message,
      locale
    });
    return { checkout_url: session.url };
  } catch (e) {
    setResponseStatus(event, 500);
    return { error: e.message || "Payment session creation failed" };
  }
});

export { createSession_post as default };
//# sourceMappingURL=create-session.post.mjs.map
