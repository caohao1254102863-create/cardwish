import { _ as __nuxt_component_0 } from './nuxt-link-DXRsjbAZ.mjs';
import { _ as _sfc_main$1 } from './LocaleSwitcher-COtfjrQr.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { u as useI18n, a as useLocalePath, c as useSupabaseClient, d as useSupabaseUser } from './server.mjs';
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
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import '@supabase/ssr';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const localePath = useLocalePath();
    useSupabaseClient();
    const user = useSupabaseUser();
    const userInitial = computed(() => {
      var _a;
      const email = (_a = user.value) == null ? void 0 : _a.email;
      if (email) return email[0].toUpperCase();
      return "?";
    });
    const joinedDate = computed(() => {
      var _a;
      const created = (_a = user.value) == null ? void 0 : _a.created_at;
      if (created) return new Date(created).toLocaleDateString();
      return "...";
    });
    const currentLangName = computed(() => {
      return locale.value === "zh-CN" ? "\u4E2D\u6587" : "English";
    });
    const menuItems = computed(() => [
      { to: "/user/orders", icon: "\u{1F4CB}", label: t("profile.my_orders"), desc: t("orders.title") },
      { to: "/user/wallet", icon: "\u{1F4B0}", label: t("profile.my_wallet"), desc: t("wallet.title") },
      { to: "/user/received", icon: "\u{1F48C}", label: t("profile.my_cards"), desc: t("received.title") }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_LocaleSwitcher = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pb-6" }, _attrs))}><div class="px-4 pt-6 pb-6 text-center"><div class="w-16 h-16 rounded-full bg-gradient-to-br from-[#ff6b81] to-[#ff8fa3] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 shadow-lg">${ssrInterpolate(unref(userInitial))}</div><h2 class="text-lg font-bold text-gray-800">${ssrInterpolate((_a = unref(user)) == null ? void 0 : _a.email)}</h2><p class="text-sm text-gray-400">${ssrInterpolate(unref(t)("profile.joined", { date: unref(joinedDate) }))}</p></div><div class="px-4 space-y-3"><!--[-->`);
      ssrRenderList(unref(menuItems), (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.to,
          to: unref(localePath)(item.to),
          class: "card-container p-4 flex items-center gap-4 no-underline active:scale-[0.98] transition-transform"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl"${_scopeId}>${ssrInterpolate(item.icon)}</div><div class="flex-1"${_scopeId}><p class="font-semibold text-gray-700"${_scopeId}>${ssrInterpolate(item.label)}</p><p class="text-xs text-gray-400"${_scopeId}>${ssrInterpolate(item.desc)}</p></div><span class="text-gray-300"${_scopeId}>\u2192</span>`);
            } else {
              return [
                createVNode("div", { class: "w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl" }, toDisplayString(item.icon), 1),
                createVNode("div", { class: "flex-1" }, [
                  createVNode("p", { class: "font-semibold text-gray-700" }, toDisplayString(item.label), 1),
                  createVNode("p", { class: "text-xs text-gray-400" }, toDisplayString(item.desc), 1)
                ]),
                createVNode("span", { class: "text-gray-300" }, "\u2192")
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--><div class="card-container p-4 flex items-center gap-4"><div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl">\u{1F310}</div><div class="flex-1"><p class="font-semibold text-gray-700">${ssrInterpolate(unref(t)("profile.language"))}</p><p class="text-xs text-gray-400">${ssrInterpolate(unref(currentLangName))}</p></div>`);
      _push(ssrRenderComponent(_component_LocaleSwitcher, null, null, _parent));
      _push(`</div><button class="card-container p-4 flex items-center gap-4 w-full border-0 cursor-pointer active:scale-[0.98] transition-transform"><div class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-xl">\u{1F6AA}</div><div class="flex-1 text-left"><p class="font-semibold text-red-500">${ssrInterpolate(unref(t)("common.logout"))}</p></div></button></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/user/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BXvxcS5D.mjs.map
