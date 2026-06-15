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
    const locale = getQuery(event).locale || "en";
    const nameField = locale === "zh-CN" ? "name_zh" : "name_en";
    const { data, error } = await supabase.from("categories").select(`id, slug, ${nameField} as name, name_zh, name_en, icon, sort_order`).order("sort_order", { ascending: true });
    if (error) throw error;
    return { categories: data };
  } catch (e) {
    return { categories: [], error: e.message };
  }
});

export { index_get as default };
//# sourceMappingURL=index.get2.mjs.map
