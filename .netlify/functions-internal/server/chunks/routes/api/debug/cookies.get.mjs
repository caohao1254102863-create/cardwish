import { d as defineEventHandler, p as parseCookies } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const cookies_get = defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const cookieList = Object.entries(cookies).map(([name, value]) => ({
    name,
    value: typeof value === "string" ? value.substring(0, 50) + "..." : String(value).substring(0, 50)
  }));
  const supabaseCookies = cookieList.filter((c) => c.name.includes("sb") || c.name.includes("supabase"));
  return {
    total: cookieList.length,
    supabaseCookies,
    allNames: cookieList.map((c) => c.name)
  };
});

export { cookies_get as default };
//# sourceMappingURL=cookies.get.mjs.map
