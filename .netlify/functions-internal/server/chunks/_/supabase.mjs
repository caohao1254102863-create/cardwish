import { u as useRuntimeConfig, b as getHeader } from '../nitro/nitro.mjs';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  var _a;
  const config = useRuntimeConfig();
  const url = process.env.SUPABASE_URL || ((_a = config.public.supabase) == null ? void 0 : _a.url);
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || config.supabaseServiceRoleKey;
  if (!url || !key) {
    throw new Error("Missing Supabase environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
async function getUserFromEvent(event) {
  const supabase = getServiceClient();
  const authHeader = getHeader(event, "Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}
async function ensureProfileAndWallet(supabase, userId) {
  const { data: profile } = await supabase.from("profiles").select("id").eq("id", userId).single();
  if (!profile) {
    await supabase.from("profiles").insert({
      id: userId,
      preferred_locale: "en"
    });
  }
  const { data: wallet } = await supabase.from("wallets").select("id").eq("user_id", userId).single();
  if (!wallet) {
    await supabase.from("wallets").insert({
      user_id: userId,
      balance_cents: 0,
      total_earned_cents: 0,
      total_withdrawn_cents: 0
    });
  }
}
function generateShareCode() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
function generateOrderNumber() {
  const now = /* @__PURE__ */ new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CRD-${dateStr}-${random}`;
}

export { getUserFromEvent as a, generateShareCode as b, generateOrderNumber as c, ensureProfileAndWallet as e, getServiceClient as g };
//# sourceMappingURL=supabase.mjs.map
