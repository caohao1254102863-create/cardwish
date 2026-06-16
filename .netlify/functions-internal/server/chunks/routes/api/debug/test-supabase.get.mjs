import { d as defineEventHandler } from '../../../nitro/nitro.mjs';
import { createClient } from '@supabase/supabase-js';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const testSupabase_get = defineEventHandler(async (event) => {
  const result = {
    env: {
      url: process.env.SUPABASE_URL ? "SET" : "MISSING",
      key: process.env.SUPABASE_KEY ? "SET" : "MISSING",
      serviceRole: process.env.SUPABASE_SERVICE_ROLE_KEY ? "SET (" + process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20) + "...)" : "MISSING"
    }
  };
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    result.error = "Missing env vars";
    return result;
  }
  try {
    const supabase = createClient(url, key);
    const { data: catData, error: catError } = await supabase.from("categories").select("count").limit(1);
    result.categories = { data: catData, error: catError == null ? void 0 : catError.message };
    const { data: tableData, error: tableError } = await supabase.from("card_templates").select("count").limit(1);
    result.card_templates = { data: tableData, error: tableError == null ? void 0 : tableError.message };
    const { data: rlsData, error: rlsError } = await supabase.rpc("credit_wallet", {
      p_user_id: "00000000-0000-0000-0000-000000000000",
      p_amount_cents: 0
    });
    result.rpc = { data: rlsData, error: rlsError == null ? void 0 : rlsError.message };
  } catch (e) {
    result.exception = e.message;
  }
  return result;
});

export { testSupabase_get as default };
//# sourceMappingURL=test-supabase.get.mjs.map
