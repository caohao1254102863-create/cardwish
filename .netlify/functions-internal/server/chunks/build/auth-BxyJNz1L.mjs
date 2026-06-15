import { l as defineNuxtRouteMiddleware, c as useSupabaseUser, a as useLocalePath, n as navigateTo } from './server.mjs';
import 'vue';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import '@supabase/ssr';
import '@vant/use';
import '@vue/shared';

const auth = defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();
  if (!user.value) {
    const localePath = useLocalePath();
    return navigateTo({
      path: localePath("/auth/login"),
      query: { redirect: to.fullPath }
    });
  }
});

export { auth as default };
//# sourceMappingURL=auth-BxyJNz1L.mjs.map
