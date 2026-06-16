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

const phoneRegister_post = defineEventHandler(async (event) => {
  var _a, _b;
  try {
    const supabase = getServiceClient();
    const body = await readBody(event);
    const { phone, password, nickname } = body;
    if (!phone || !password) {
      setResponseStatus(event, 400);
      return { error: "Phone and password are required" };
    }
    let formatted = phone.replace(/[\s\-()]/g, "");
    if (!formatted.startsWith("+")) formatted = `+86${formatted}`;
    if (!/^\+86\d{11}$/.test(formatted)) {
      setResponseStatus(event, 400);
      return { error: "Invalid phone number format" };
    }
    const internalEmail = `phone_${formatted.replace(/\+/g, "")}@cardwish.com`;
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const existing = (_a = existingUser == null ? void 0 : existingUser.users) == null ? void 0 : _a.find((u) => u.email === internalEmail);
    if (existing) {
      await supabase.auth.admin.updateUserById(existing.id, { password });
      return { success: true, message: "Password updated for existing user", user_id: existing.id };
    }
    const { data: newUser, error } = await supabase.auth.admin.createUser({
      email: internalEmail,
      password,
      email_confirm: true,
      user_metadata: { phone: formatted }
    });
    if ((newUser == null ? void 0 : newUser.user) && !newUser.user.email_confirmed_at) {
      await supabase.auth.admin.updateUserById(newUser.user.id, {
        email_confirm: true
      });
    }
    if (error) throw error;
    if (newUser == null ? void 0 : newUser.user) {
      await supabase.from("profiles").upsert({
        id: newUser.user.id,
        phone: formatted,
        phone_verified: true,
        nickname: nickname || null,
        preferred_locale: "zh-CN"
      }, { onConflict: "id" });
      const { data: wallet } = await supabase.from("wallets").select("id").eq("user_id", newUser.user.id).single();
      if (!wallet) {
        await supabase.from("wallets").insert({ user_id: newUser.user.id });
      }
    }
    return { success: true, user_id: (_b = newUser == null ? void 0 : newUser.user) == null ? void 0 : _b.id };
  } catch (e) {
    setResponseStatus(event, 500);
    return { error: e.message };
  }
});

export { phoneRegister_post as default };
//# sourceMappingURL=phone-register.post.mjs.map
