import { d as defineEventHandler, g as getRouterParam, s as setResponseStatus } from '../../../../nitro/nitro.mjs';
import { a as getClient } from '../../../../_/supabase.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/supabase-js';

const byShare_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e;
  try {
    const supabase = getClient();
    const shareCode = getRouterParam(event, "share_code");
    const { data: order, error } = await supabase.from("orders").select(`
        *,
        card_templates!inner(
          name_zh, name_en, images, category_id,
          categories(slug)
        )
      `).eq("share_code", shareCode).single();
    if (error || !order) {
      setResponseStatus(event, 404);
      return { error: "Order not found" };
    }
    if (order.status === "pending" && new Date(order.expires_at) < /* @__PURE__ */ new Date()) {
      await supabase.from("orders").update({ status: "expired" }).eq("id", order.id);
      order.status = "expired";
    }
    return {
      order: {
        id: order.id,
        share_code: order.share_code,
        message: order.message,
        recipient_name: order.recipient_name,
        total_cents: order.total_cents,
        currency: order.currency,
        status: order.status,
        expires_at: order.expires_at,
        card_name: ((_a = order.card_templates) == null ? void 0 : _a.name_zh) || ((_b = order.card_templates) == null ? void 0 : _b.name_en),
        card_images: (_c = order.card_templates) == null ? void 0 : _c.images,
        category_slug: (_e = (_d = order.card_templates) == null ? void 0 : _d.categories) == null ? void 0 : _e.slug,
        card_templates: void 0
      }
    };
  } catch (e) {
    return { error: e.message };
  }
});

export { byShare_get as default };
//# sourceMappingURL=by-share.get.mjs.map
