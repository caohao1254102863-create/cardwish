import { d as defineEventHandler, s as setResponseStatus, a as getQuery } from '../../nitro/nitro.mjs';
import { g as getServiceClient, a as getUserFromEvent } from '../../_/supabase.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/supabase-js';

const index_get = defineEventHandler(async (event) => {
  try {
    const supabase = getServiceClient();
    const user = await getUserFromEvent(event);
    if (!user) {
      setResponseStatus(event, 401);
      return { error: "Login required" };
    }
    const query = getQuery(event);
    const status = query.status;
    const page = parseInt(query.page || "1");
    const limit = Math.min(parseInt(query.limit || "20"), 50);
    const offset = (page - 1) * limit;
    let dbQuery = supabase.from("orders").select("*", { count: "exact" }).eq("creator_id", user.id).order("created_at", { ascending: false }).range(offset, offset + limit - 1);
    if (status && status !== "all") {
      dbQuery = dbQuery.eq("status", status);
    }
    const { data, error, count } = await dbQuery;
    if (error) throw error;
    return {
      orders: data || [],
      total: count || 0,
      page,
      limit,
      hasMore: (count || 0) > offset + limit
    };
  } catch (e) {
    return { orders: [], error: e.message };
  }
});

export { index_get as default };
//# sourceMappingURL=index.get3.mjs.map
