import { d as defineEventHandler, g as getRouterParam, s as setResponseStatus } from '../../../../nitro/nitro.mjs';
import { g as getServiceClient } from '../../../../_/supabase.mjs';
import { c as createPayPalOrder } from '../../../../_/paypal.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/supabase-js';

const createPaypalOrder_post = defineEventHandler(async (event) => {
  var _a, _b;
  try {
    const supabase = getServiceClient();
    const shareCode = getRouterParam(event, "share_code");
    const { data: order, error } = await supabase.from("orders").select("id, total_cents, currency, status, expires_at, card_templates!inner(name_zh, name_en)").eq("share_code", shareCode).single();
    if (error || !order) {
      setResponseStatus(event, 404);
      return { error: "Order not found" };
    }
    if (order.status !== "pending") {
      setResponseStatus(event, 400);
      return { error: "Order is no longer available" };
    }
    if (new Date(order.expires_at) < /* @__PURE__ */ new Date()) {
      await supabase.from("orders").update({ status: "expired" }).eq("id", order.id);
      setResponseStatus(event, 400);
      return { error: "Order has expired" };
    }
    const cardName = ((_a = order.card_templates) == null ? void 0 : _a.name_zh) || ((_b = order.card_templates) == null ? void 0 : _b.name_en) || "Digital Card";
    const paypalOrder = await createPayPalOrder({
      amountCents: order.total_cents,
      currency: order.currency,
      orderId: order.id,
      shareCode,
      cardName
    });
    await supabase.from("payments").insert({
      order_id: order.id,
      paypal_order_id: paypalOrder.orderId,
      amount_cents: order.total_cents,
      currency: order.currency,
      status: "pending",
      payment_method: "paypal"
    });
    return { paypal_order_id: paypalOrder.orderId, approval_url: paypalOrder.approvalUrl };
  } catch (e) {
    setResponseStatus(event, 500);
    return { error: e.message };
  }
});

export { createPaypalOrder_post as default };
//# sourceMappingURL=create-paypal-order.post.mjs.map
