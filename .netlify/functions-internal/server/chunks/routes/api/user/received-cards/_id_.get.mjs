import { d as defineEventHandler, s as setResponseStatus, g as getRouterParam } from '../../../../nitro/nitro.mjs';
import { g as getServerUser } from '../../../../_/auth.mjs';
import { g as getServiceClient } from '../../../../_/supabase.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/supabase-js';

const _id__get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s;
  try {
    const supabase = getServiceClient();
    const user = await getServerUser(event);
    if (!user) {
      setResponseStatus(event, 401);
      return { error: "Login required" };
    }
    const id = getRouterParam(event, "id");
    const { data, error } = await supabase.from("received_cards").select(`
        id, is_new, created_at, viewed_at,
        generated_cards!inner(
          id, image_url,
          orders!inner(
            message, recipient_name,
            card_templates!inner(name_zh, name_en, categories(slug)),
            payments(payer_message)
          )
        )
      `).eq("id", id).eq("user_id", user.id).single();
    if (error || !data) {
      setResponseStatus(event, 404);
      return { error: "Card not found" };
    }
    if (data.is_new) {
      await supabase.from("received_cards").update({ is_new: false, viewed_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id);
    }
    const card = {
      id: data.id,
      is_new: data.is_new,
      created_at: data.created_at,
      viewed_at: data.viewed_at,
      image_url: (_a = data.generated_cards) == null ? void 0 : _a.image_url,
      message: (_c = (_b = data.generated_cards) == null ? void 0 : _b.orders) == null ? void 0 : _c.message,
      recipient_name: (_e = (_d = data.generated_cards) == null ? void 0 : _d.orders) == null ? void 0 : _e.recipient_name,
      card_name: ((_h = (_g = (_f = data.generated_cards) == null ? void 0 : _f.orders) == null ? void 0 : _g.card_templates) == null ? void 0 : _h.name_zh) || ((_k = (_j = (_i = data.generated_cards) == null ? void 0 : _i.orders) == null ? void 0 : _j.card_templates) == null ? void 0 : _k.name_en),
      category_slug: (_o = (_n = (_m = (_l = data.generated_cards) == null ? void 0 : _l.orders) == null ? void 0 : _m.card_templates) == null ? void 0 : _n.categories) == null ? void 0 : _o.slug,
      payer_message: (_s = (_r = (_q = (_p = data.generated_cards) == null ? void 0 : _p.orders) == null ? void 0 : _q.payments) == null ? void 0 : _r[0]) == null ? void 0 : _s.payer_message
    };
    return card;
  } catch (e) {
    return { error: e.message };
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
