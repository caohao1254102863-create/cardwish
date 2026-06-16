import { d as defineEventHandler, r as readBody, s as setResponseStatus } from '../../../nitro/nitro.mjs';
import { g as getServiceClient } from '../../../_/supabase.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/supabase-js';

const phoneLogin_post = defineEventHandler(async (event) => {
  var _a, _b;
  try {
    const supabase = getServiceClient();
    const body = await readBody(event);
    const { phone, password } = body;
    if (!phone) {
      setResponseStatus(event, 400);
      return { error: "Phone required" };
    }
    const formatted = phone.startsWith("+") ? phone : "+86" + phone;
    const email = "phone_" + formatted.replace(/\+/g, "") + "@cardwish.com";
    const { data: existing } = await supabase.auth.admin.listUsers();
    const found = (_a = existing == null ? void 0 : existing.users) == null ? void 0 : _a.find((u) => u.email === email);
    if (found) {
      await supabase.auth.admin.updateUserById(found.id, {
        password: password || "cw_" + formatted.replace(/\+/g, ""),
        email_confirm: true
      });
      const { data: wallet } = await supabase.from("wallets").select("id").eq("user_id", found.id).single();
      if (!wallet) {
        await supabase.from("wallets").insert({ user_id: found.id });
      }
      return { success: true, user_id: found.id, message: "existing user updated" };
    }
    const { data: newUser, error } = await supabase.auth.admin.createUser({
      email,
      password: password || "cw_" + formatted.replace(/\+/g, ""),
      email_confirm: true,
      user_metadata: { phone: formatted }
    });
    if (error) throw error;
    if (newUser == null ? void 0 : newUser.user) {
      await supabase.auth.admin.updateUserById(newUser.user.id, { email_confirm: true });
      const { data: profile } = await supabase.from("profiles").select("id").eq("id", newUser.user.id).single();
      if (!profile) {
        await supabase.from("profiles").insert({ id: newUser.user.id, phone: formatted, preferred_locale: "zh-CN" });
      }
      const { data: wallet } = await supabase.from("wallets").select("id").eq("user_id", newUser.user.id).single();
      if (!wallet) {
        await supabase.from("wallets").insert({ user_id: newUser.user.id });
      }
    }
    return { success: true, user_id: (_b = newUser == null ? void 0 : newUser.user) == null ? void 0 : _b.id, message: "new user created" };
  } catch (e) {
    console.error("phone-login error:", e.message);
    setResponseStatus(event, 500);
    return { error: e.message };
  }
});

export { phoneLogin_post as default };
//# sourceMappingURL=phone-login.post.mjs.map
