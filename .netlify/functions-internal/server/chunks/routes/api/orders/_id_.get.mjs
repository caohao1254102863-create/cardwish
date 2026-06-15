import { d as defineEventHandler, s as setResponseStatus, g as getRouterParam } from '../../../nitro/nitro.mjs';
import { g as getServiceClient, a as getUserFromEvent } from '../../../_/supabase.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/supabase-js';

const _id__get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  try {
    const supabase = getServiceClient();
    const user = await getUserFromEvent(event);
    if (!user) {
      setResponseStatus(event, 401);
      return { error: "Login required" };
    }
    const id = getRouterParam(event, "id");
    const { data: order, error } = await supabase.from("orders").select(`
        *,
        card_templates!inner(
          name_zh, name_en,
          categories(slug)
        )
      `).eq("id", id).eq("creator_id", user.id).single();
    if (error || !order) {
      setResponseStatus(event, 404);
      return { error: "Order not found" };
    }
    return {
      order: {
        ...order,
        card_name: ((_a = order.card_templates) == null ? void 0 : _a.name_zh) || ((_b = order.card_templates) == null ? void 0 : _b.name_en),
        category_slug: (_d = (_c = order.card_templates) == null ? void 0 : _c.categories) == null ? void 0 : _d.slug,
        card_templates: void 0
      }
    };
  } catch (e) {
    return { error: e.message };
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
