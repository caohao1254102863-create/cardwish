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

const emailRegister_post = defineEventHandler(async (event) => {
  var _a, _b;
  try {
    const supabase = getServiceClient();
    const body = await readBody(event);
    const { email } = body;
    if (!email) {
      setResponseStatus(event, 400);
      return { error: "Email is required" };
    }
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const existing = (_a = existingUser == null ? void 0 : existingUser.users) == null ? void 0 : _a.find((u) => u.email === email);
    if (existing) {
      if (!existing.email_confirmed_at) {
        await supabase.auth.admin.updateUserById(existing.id, { email_confirm: true });
      }
      return { success: true, user_id: existing.id, message: "User confirmed" };
    }
    const { data: newUser, error } = await supabase.auth.admin.createUser({
      email,
      password: `cw_email_${email.replace(/[^a-zA-Z0-9]/g, "_")}`,
      email_confirm: true
    });
    if (error) throw error;
    if (newUser == null ? void 0 : newUser.user) {
      if (!newUser.user.email_confirmed_at) {
        await supabase.auth.admin.updateUserById(newUser.user.id, { email_confirm: true });
      }
      await supabase.from("profiles").upsert({ id: newUser.user.id }, { onConflict: "id" });
      const { data: wallet } = await supabase.from("wallets").select("id").eq("user_id", newUser.user.id).single();
      if (!wallet) await supabase.from("wallets").insert({ user_id: newUser.user.id });
    }
    return { success: true, user_id: (_b = newUser == null ? void 0 : newUser.user) == null ? void 0 : _b.id };
  } catch (e) {
    setResponseStatus(event, 500);
    return { error: e.message };
  }
});

export { emailRegister_post as default };
//# sourceMappingURL=email-register.post.mjs.map
