import { d as defineEventHandler, g as getRouterParam } from '../../../../nitro/nitro.mjs';
import { g as getServiceClient } from '../../../../_/supabase.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/supabase-js';

const success_get = defineEventHandler(async (event) => {
  var _a, _b;
  try {
    const supabase = getServiceClient();
    const shareCode = getRouterParam(event, "share_code");
    const { data: order } = await supabase.from("orders").select(`
        id, status, message, recipient_name,
        payments(payer_message)
      `).eq("share_code", shareCode).single();
    if (!order) {
      return { status: "not_found" };
    }
    if (order.status === "delivered" || order.status === "paid") {
      return {
        status: "succeeded",
        payer_message: ((_b = (_a = order.payments) == null ? void 0 : _a[0]) == null ? void 0 : _b.payer_message) || "",
        recipient_name: order.recipient_name
      };
    }
    if (order.status === "expired") {
      return { status: "expired" };
    }
    return { status: order.status };
  } catch (e) {
    return { status: "error", error: e.message };
  }
});

export { success_get as default };
//# sourceMappingURL=success.get.mjs.map
