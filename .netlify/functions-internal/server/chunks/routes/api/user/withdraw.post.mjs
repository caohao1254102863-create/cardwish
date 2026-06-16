import { d as defineEventHandler, s as setResponseStatus, r as readBody, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import { g as getServerUser } from '../../../_/auth.mjs';
import { g as getServiceClient } from '../../../_/supabase.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/supabase-js';

const withdraw_post = defineEventHandler(async (event) => {
  try {
    const supabase = getServiceClient();
    const user = await getServerUser(event);
    if (!user) {
      setResponseStatus(event, 401);
      return { error: "Login required" };
    }
    const body = await readBody(event);
    const { amount_cents, method, account_info } = body;
    const config = useRuntimeConfig();
    const minWithdrawal = config.public.minWithdrawalCents;
    if (!amount_cents || amount_cents < minWithdrawal) {
      setResponseStatus(event, 400);
      return { error: `Minimum withdrawal is $${minWithdrawal / 100}` };
    }
    if (!method || !account_info) {
      setResponseStatus(event, 400);
      return { error: "Method and account info are required" };
    }
    const { data: wallet } = await supabase.from("wallets").select("balance_cents").eq("user_id", user.id).single();
    if (!wallet || wallet.balance_cents < amount_cents) {
      setResponseStatus(event, 400);
      return { error: "Insufficient balance" };
    }
    const { error: deductError } = await supabase.from("wallets").update({
      balance_cents: wallet.balance_cents - amount_cents,
      total_withdrawn_cents: supabase.raw(`total_withdrawn_cents + ${amount_cents}`)
    }).eq("user_id", user.id);
    if (deductError) throw deductError;
    const { data: withdrawal, error } = await supabase.from("withdrawal_requests").insert({
      user_id: user.id,
      amount_cents,
      method,
      account_info,
      status: "pending"
    }).select("id, amount_cents, method, status, created_at").single();
    if (error) throw error;
    return {
      withdrawal,
      message: "Withdrawal request submitted"
    };
  } catch (e) {
    setResponseStatus(event, 500);
    return { error: e.message };
  }
});

export { withdraw_post as default };
//# sourceMappingURL=withdraw.post.mjs.map
