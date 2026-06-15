import { d as defineEventHandler, g as getRouterParam, a as getQuery } from '../../../nitro/nitro.mjs';
import { g as getServiceClient } from '../../../_/supabase.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/supabase-js';

const _id__get = defineEventHandler(async (event) => {
  var _a;
  try {
    const supabase = getServiceClient();
    const id = getRouterParam(event, "id");
    const locale = getQuery(event).locale || "en";
    const nameField = locale === "zh-CN" ? "name_zh" : "name_en";
    const descField = locale === "zh-CN" ? "description_zh" : "description_en";
    const { data, error } = await supabase.from("card_templates").select(`
        id, category_id,
        ${nameField} as name, name_zh, name_en,
        ${descField} as description, description_zh, description_en,
        price_cents, currency, images, tags, status, sort_order, created_at,
        categories!inner(slug)
      `).eq("id", id).single();
    if (error) throw error;
    const card = {
      ...data,
      category_slug: (_a = data.categories) == null ? void 0 : _a.slug,
      categories: void 0
    };
    return { card };
  } catch (e) {
    return { card: null, error: e.message };
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
