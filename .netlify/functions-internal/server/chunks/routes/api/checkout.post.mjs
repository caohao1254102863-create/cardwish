import { d as defineEventHandler, s as setResponseStatus, r as readBody, u as useRuntimeConfig } from '../../nitro/nitro.mjs';
import { g as getServerUser } from '../../_/auth.mjs';
import { g as getServiceClient, b as generateShareCode, c as generateOrderNumber } from '../../_/supabase.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/supabase-js';

const checkout_post = defineEventHandler(async (event) => {
  var _a;
  try {
    const supabase = getServiceClient();
    const user = await getServerUser(event);
    if (!user) {
      setResponseStatus(event, 401);
      return { error: "Login required" };
    }
    const body = await readBody(event);
    const { template_id, message, recipient_name, delivery_address_simulation } = body;
    if (!template_id) {
      setResponseStatus(event, 400);
      return { error: "template_id is required" };
    }
    const { data: template } = await supabase.from("card_templates").select("price_cents, currency, name_zh, name_en, categories(slug)").eq("id", template_id).single();
    if (!template) {
      setResponseStatus(event, 404);
      return { error: "Card template not found" };
    }
    const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).single();
    if (!profile) {
      await supabase.from("profiles").insert({ id: user.id, preferred_locale: "zh-CN" });
    }
    const { data: wallet } = await supabase.from("wallets").select("id").eq("user_id", user.id).single();
    if (!wallet) {
      await supabase.from("wallets").insert({ user_id: user.id, balance_cents: 0, total_earned_cents: 0, total_withdrawn_cents: 0 });
    }
    const shareCode = generateShareCode();
    const orderNumber = generateOrderNumber();
    const expiresAt = new Date(Date.now() + 48 * 3600 * 1e3).toISOString();
    const { data: order, error } = await supabase.from("orders").insert({
      creator_id: user.id,
      template_id,
      message: message || "",
      recipient_name: recipient_name || "",
      delivery_address_simulation: delivery_address_simulation || "",
      total_cents: template.price_cents,
      currency: template.currency,
      status: "pending",
      share_code: shareCode,
      order_number: orderNumber,
      expires_at: expiresAt
    }).select("*").single();
    if (error) throw error;
    const config = useRuntimeConfig();
    const shareUrl = `${config.public.siteUrl}/pay/${shareCode}`;
    return {
      order: {
        ...order,
        card_name: template.name_zh || template.name_en,
        category_slug: (_a = template.categories) == null ? void 0 : _a.slug
      },
      share_url: shareUrl
    };
  } catch (e) {
    setResponseStatus(event, 500);
    return { error: e.message };
  }
});

export { checkout_post as default };
//# sourceMappingURL=checkout.post.mjs.map
