import { d as defineEventHandler, g as getRouterParam, a as getQuery } from '../../../nitro/nitro.mjs';
import { a as getClient } from '../../../_/supabase.mjs';
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
    const supabase = getClient();
    const id = getRouterParam(event, "id");
    const locale = getQuery(event).locale || "en";
    const { data, error } = await supabase.from("card_templates").select(`
        id, category_id,
        name_zh, name_en,
        description_zh, description_en,
        price_cents, currency, images, tags, status, sort_order, created_at,
        categories!inner(slug)
      `).eq("id", id).single();
    if (error) throw error;
    const card = {
      id: data.id,
      category_id: data.category_id,
      category_slug: (_a = data.categories) == null ? void 0 : _a.slug,
      name: locale === "zh-CN" ? data.name_zh : data.name_en,
      name_zh: data.name_zh,
      name_en: data.name_en,
      description: locale === "zh-CN" ? data.description_zh : data.description_en,
      description_zh: data.description_zh,
      description_en: data.description_en,
      price_cents: data.price_cents,
      currency: data.currency,
      images: data.images,
      tags: data.tags,
      status: data.status,
      sort_order: data.sort_order,
      created_at: data.created_at
    };
    return { card };
  } catch (e) {
    return { card: null, error: e.message };
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
