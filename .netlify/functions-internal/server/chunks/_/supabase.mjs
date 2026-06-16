import { u as useRuntimeConfig } from '../nitro/nitro.mjs';
import { createClient } from '@supabase/supabase-js';

function getSupabaseConfig() {
  const config = useRuntimeConfig();
  return {
    url: process.env.SUPABASE_URL || "",
    anonKey: process.env.SUPABASE_KEY || "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || config.supabaseServiceRoleKey || ""
  };
}
function getServiceClient() {
  const { url, serviceRoleKey } = getSupabaseConfig();
  if (!url || !serviceRoleKey) {
    throw new Error(`Missing SUPABASE_URL (${!!url}) or SUPABASE_SERVICE_ROLE_KEY (${!!serviceRoleKey})`);
  }
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}
function getClient() {
  const { url, anonKey, serviceRoleKey } = getSupabaseConfig();
  if (!url) throw new Error("Missing SUPABASE_URL");
  const key = serviceRoleKey || anonKey;
  if (!key) throw new Error("Missing Supabase key");
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}
async function ensureProfileAndWallet(supabase, userId) {
  const { data: profile } = await supabase.from("profiles").select("id").eq("id", userId).single();
  if (!profile) {
    await supabase.from("profiles").insert({ id: userId, preferred_locale: "zh-CN" });
  }
  const { data: wallet } = await supabase.from("wallets").select("id").eq("user_id", userId).single();
  if (!wallet) {
    await supabase.from("wallets").insert({ user_id: userId, balance_cents: 0, total_earned_cents: 0, total_withdrawn_cents: 0 });
  }
}
function generateShareCode() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}
function generateOrderNumber() {
  const now = /* @__PURE__ */ new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CRD-${dateStr}-${random}`;
}

export { getClient as a, generateShareCode as b, generateOrderNumber as c, ensureProfileAndWallet as e, getServiceClient as g };
//# sourceMappingURL=supabase.mjs.map
