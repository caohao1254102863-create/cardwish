import { _ as __nuxt_component_0 } from './nuxt-link-BVMrTfN6.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useI18n, a as useLocalePath } from './server.mjs';
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
import '@vant/use';
import '@vue/shared';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MobileNavigation",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const localePath = useLocalePath();
    const navItems = computed(() => [
      { to: "/", icon: "\u{1F3E0}", label: t("nav.home") },
      { to: "/user/orders", icon: "\u{1F4CB}", label: t("nav.orders") },
      { to: "/user/wallet", icon: "\u{1F4B0}", label: t("nav.wallet") },
      { to: "/user/received", icon: "\u{1F48C}", label: t("nav.received") },
      { to: "/user", icon: "\u{1F464}", label: t("nav.profile") }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<nav${ssrRenderAttrs(mergeProps({ class: "fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-gray-100 safe-bottom md:hidden" }, _attrs))}><div class="flex items-center justify-around h-14 max-w-lg mx-auto"><!--[-->`);
      ssrRenderList(unref(navItems), (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.to,
          to: unref(localePath)(item.to),
          class: "flex flex-col items-center gap-0.5 no-underline text-gray-400 hover:text-[var(--color-primary)] transition-colors min-w-0 flex-1 py-1",
          "active-class": "!text-[var(--color-primary)]"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="text-xl"${_scopeId}>${ssrInterpolate(item.icon)}</span><span class="text-[10px] leading-none"${_scopeId}>${ssrInterpolate(item.label)}</span>`);
            } else {
              return [
                createVNode("span", { class: "text-xl" }, toDisplayString(item.icon), 1),
                createVNode("span", { class: "text-[10px] leading-none" }, toDisplayString(item.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></nav>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/global/MobileNavigation.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=MobileNavigation-DIgsfEWz.mjs.map
