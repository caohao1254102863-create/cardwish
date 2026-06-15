import { d as defineEventHandler, a as getQuery } from '../../nitro/nitro.mjs';
import { g as getServiceClient } from '../../_/supabase.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/supabase-js';

const index_get = defineEventHandler(async (event) => {
  try {
    const supabase = getServiceClient();
    const query = getQuery(event);
    const locale = query.locale || "en";
    const category = query.category;
    const sort = query.sort || "popular";
    const page = parseInt(query.page || "1");
    const limit = Math.min(parseInt(query.limit || "20"), 50);
    const offset = (page - 1) * limit;
    const nameField = locale === "zh-CN" ? "name_zh" : "name_en";
    const descField = locale === "zh-CN" ? "description_zh" : "description_en";
    let dbQuery = supabase.from("card_templates").select(`
        id, category_id,
        ${nameField} as name, name_zh, name_en,
        ${descField} as description, description_zh, description_en,
        price_cents, currency, images, tags, status, sort_order, created_at,
        categories!inner(slug)
      `, { count: "exact" }).eq("status", "online");
    if (category) {
      dbQuery = dbQuery.eq("categories.slug", category);
    }
    switch (sort) {
      case "newest":
        dbQuery = dbQuery.order("created_at", { ascending: false });
        break;
      case "price_asc":
        dbQuery = dbQuery.order("price_cents", { ascending: true });
        break;
      case "price_desc":
        dbQuery = dbQuery.order("price_cents", { ascending: false });
        break;
      default:
        dbQuery = dbQuery.order("sort_order", { ascending: true });
        break;
    }
    dbQuery = dbQuery.range(offset, offset + limit - 1);
    const { data, error, count } = await dbQuery;
    if (error) throw error;
    const cards = (data || []).map((item) => {
      var _a;
      return {
        ...item,
        category_slug: (_a = item.categories) == null ? void 0 : _a.slug,
        categories: void 0
      };
    });
    return {
      cards,
      total: count || 0,
      page,
      limit,
      hasMore: (count || 0) > offset + limit
    };
  } catch (e) {
    return { cards: [], total: 0, page: 1, limit: 20, hasMore: false, error: e.message };
  }
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
