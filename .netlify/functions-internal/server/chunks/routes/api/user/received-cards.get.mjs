import { d as defineEventHandler, s as setResponseStatus } from '../../../nitro/nitro.mjs';
import { g as getServiceClient, a as getUserFromEvent } from '../../../_/supabase.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/supabase-js';

const receivedCards_get = defineEventHandler(async (event) => {
  try {
    const supabase = getServiceClient();
    const user = await getUserFromEvent(event);
    if (!user) {
      setResponseStatus(event, 401);
      return { error: "Login required" };
    }
    const { data, error, count } = await supabase.from("received_cards").select(`
        id, is_new, created_at, viewed_at,
        generated_cards!inner(
          id, image_url,
          orders!inner(
            message, recipient_name,
            card_templates!inner(name_zh, name_en, categories(slug)),
            payments(payer_message)
          )
        )
      `, { count: "exact" }).eq("user_id", user.id).order("created_at", { ascending: false }).limit(50);
    if (error) throw error;
    const cards = (data || []).map((item) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s;
      return {
        id: item.id,
        is_new: item.is_new,
        created_at: item.created_at,
        viewed_at: item.viewed_at,
        image_url: (_a = item.generated_cards) == null ? void 0 : _a.image_url,
        message: (_c = (_b = item.generated_cards) == null ? void 0 : _b.orders) == null ? void 0 : _c.message,
        recipient_name: (_e = (_d = item.generated_cards) == null ? void 0 : _d.orders) == null ? void 0 : _e.recipient_name,
        card_name: ((_h = (_g = (_f = item.generated_cards) == null ? void 0 : _f.orders) == null ? void 0 : _g.card_templates) == null ? void 0 : _h.name_zh) || ((_k = (_j = (_i = item.generated_cards) == null ? void 0 : _i.orders) == null ? void 0 : _j.card_templates) == null ? void 0 : _k.name_en),
        category_slug: (_o = (_n = (_m = (_l = item.generated_cards) == null ? void 0 : _l.orders) == null ? void 0 : _m.card_templates) == null ? void 0 : _n.categories) == null ? void 0 : _o.slug,
        payer_message: (_s = (_r = (_q = (_p = item.generated_cards) == null ? void 0 : _p.orders) == null ? void 0 : _q.payments) == null ? void 0 : _r[0]) == null ? void 0 : _s.payer_message
      };
    });
    return { cards, total: count || 0 };
  } catch (e) {
    return { cards: [], error: e.message };
  }
});

export { receivedCards_get as default };
//# sourceMappingURL=received-cards.get.mjs.map
