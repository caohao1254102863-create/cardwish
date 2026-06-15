import { d as defineEventHandler, s as setResponseStatus } from '../../../nitro/nitro.mjs';
import { g as getServiceClient, a as getUserFromEvent, e as ensureProfileAndWallet } from '../../../_/supabase.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/supabase-js';

const wallet_get = defineEventHandler(async (event) => {
  try {
    const supabase = getServiceClient();
    const user = await getUserFromEvent(event);
    if (!user) {
      setResponseStatus(event, 401);
      return { error: "Login required" };
    }
    await ensureProfileAndWallet(supabase, user.id);
    const { data: wallet, error } = await supabase.from("wallets").select("*").eq("user_id", user.id).single();
    if (error) throw error;
    return wallet;
  } catch (e) {
    return { balance_cents: 0, total_earned_cents: 0, total_withdrawn_cents: 0, error: e.message };
  }
});

export { wallet_get as default };
//# sourceMappingURL=wallet.get.mjs.map
