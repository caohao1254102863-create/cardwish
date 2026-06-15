import { d as defineEventHandler, s as setResponseStatus, a as getQuery } from '../../../nitro/nitro.mjs';
import { g as getServiceClient, a as getUserFromEvent } from '../../../_/supabase.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/supabase-js';

const earnings_get = defineEventHandler(async (event) => {
  try {
    const supabase = getServiceClient();
    const user = await getUserFromEvent(event);
    if (!user) {
      setResponseStatus(event, 401);
      return { error: "Login required" };
    }
    const query = getQuery(event);
    const page = parseInt(query.page || "1");
    const limit = Math.min(parseInt(query.limit || "20"), 50);
    const offset = (page - 1) * limit;
    const { data, error, count } = await supabase.from("earnings").select("*", { count: "exact" }).eq("user_id", user.id).order("created_at", { ascending: false }).range(offset, offset + limit - 1);
    if (error) throw error;
    const earningsWithNames = await Promise.all((data || []).map(async (earning) => {
      var _a, _b;
      const { data: order } = await supabase.from("orders").select("card_templates(name_zh, name_en)").eq("id", earning.order_id).single();
      return {
        ...earning,
        card_name: ((_a = order == null ? void 0 : order.card_templates) == null ? void 0 : _a.name_zh) || ((_b = order == null ? void 0 : order.card_templates) == null ? void 0 : _b.name_en) || "Card"
      };
    }));
    return {
      earnings: earningsWithNames,
      total: count || 0,
      page,
      limit,
      hasMore: (count || 0) > offset + limit
    };
  } catch (e) {
    return { earnings: [], error: e.message };
  }
});

export { earnings_get as default };
//# sourceMappingURL=earnings.get.mjs.map
