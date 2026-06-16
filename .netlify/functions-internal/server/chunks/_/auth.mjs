import { e as getCookie, b as getHeader, p as parseCookies } from '../nitro/nitro.mjs';
import { g as getServiceClient } from './supabase.mjs';

async function getServerUser(event) {
  const supabase = getServiceClient();
  let accessToken = "";
  const authCookie = getCookie(event, "auth_token");
  if (authCookie) {
    accessToken = authCookie;
  }
  if (!accessToken) {
    const authHeader = getHeader(event, "Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      accessToken = authHeader.replace("Bearer ", "");
    }
  }
  if (!accessToken) {
    const cookies = parseCookies(event);
    for (const [name, value] of Object.entries(cookies)) {
      if (!name.includes("sb-") && !name.includes("supabase")) continue;
      if (typeof value === "string" && value.startsWith("eyJ")) {
        accessToken = value;
        break;
      }
      try {
        const parsed = JSON.parse(decodeURIComponent(value));
        if (parsed.access_token) {
          accessToken = parsed.access_token;
          break;
        }
      } catch {
        continue;
      }
    }
  }
  if (!accessToken) return null;
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) return null;
  return user;
}

export { getServerUser as g };
//# sourceMappingURL=auth.mjs.map
