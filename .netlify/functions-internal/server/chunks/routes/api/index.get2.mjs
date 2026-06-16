import { d as defineEventHandler, a as getQuery } from '../../nitro/nitro.mjs';
import { a as getClient } from '../../_/supabase.mjs';
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
    const supabase = getClient();
    const locale = getQuery(event).locale || "en";
    const { data, error } = await supabase.from("categories").select("id, slug, name_zh, name_en, icon, sort_order").order("sort_order", { ascending: true });
    if (error) throw error;
    const categories = (data || []).map((cat) => ({
      ...cat,
      name: locale === "zh-CN" ? cat.name_zh : cat.name_en
    }));
    return { categories };
  } catch (e) {
    return { categories: [], error: e.message };
  }
});

export { index_get as default };
//# sourceMappingURL=index.get2.mjs.map
