import { _ as __nuxt_component_0 } from './nuxt-link-DXRsjbAZ.mjs';
import { _ as _sfc_main$4 } from './LocaleSwitcher-COtfjrQr.mjs';
import { useSSRContext, defineComponent, computed, mergeProps, withCtx, createVNode, unref, createTextVNode, toDisplayString } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderSlot } from 'vue/server-renderer';
import { u as useI18n, a as useLocalePath, d as useSupabaseUser } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
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

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "AppHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const localePath = useLocalePath();
    const user = useSupabaseUser();
    const userInitial = computed(() => {
      var _a;
      const email = (_a = user.value) == null ? void 0 : _a.email;
      if (email) return email[0].toUpperCase();
      return "?";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_LocaleSwitcher = _sfc_main$4;
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 pc-container" }, _attrs))}><div class="flex items-center justify-between px-4 h-14">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-2 no-underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-2xl"${_scopeId}>\u{1F49D}</span><span class="text-xl font-bold text-gradient hidden sm:block"${_scopeId}>CardWish</span>`);
          } else {
            return [
              createVNode("span", { class: "text-2xl" }, "\u{1F49D}"),
              createVNode("span", { class: "text-xl font-bold text-gradient hidden sm:block" }, "CardWish")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-center gap-3">`);
      _push(ssrRenderComponent(_component_LocaleSwitcher, null, null, _parent));
      if (unref(user)) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/user",
          class: "w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b81] to-[#ff8fa3] flex items-center justify-center text-white text-sm font-semibold shadow-sm"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(userInitial))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(userInitial)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)("/auth/login"),
          class: "btn-primary !px-4 !py-2 !text-sm"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("auth.login"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("auth.login")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div></div></header>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/global/AppHeader.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "AppFooter",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const localePath = useLocalePath();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "hidden md:block mt-auto border-t border-gray-100 bg-white py-6" }, _attrs))}><div class="pc-container px-4"><div class="flex items-center justify-between text-sm text-gray-400"><div class="flex gap-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/legal/terms"),
        class: "no-underline text-gray-400 hover:text-[var(--color-primary)]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("footer.terms"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("footer.terms")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/legal/privacy"),
        class: "no-underline text-gray-400 hover:text-[var(--color-primary)]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("footer.privacy"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("footer.privacy")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><span>${ssrInterpolate(unref(t)("footer.copyright", { year: 2026 }))}</span></div></div></footer>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/global/AppFooter.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/global/MobileNavigation.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_AppHeader = _sfc_main$3;
  const _component_AppFooter = _sfc_main$2;
  const _component_MobileNavigation = _sfc_main$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col bg-[var(--color-bg)]" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_AppHeader, null, null, _parent));
  _push(`<main class="flex-1 pb-16 md:pb-0 pc-container">`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</main>`);
  _push(ssrRenderComponent(_component_AppFooter, null, null, _parent));
  _push(ssrRenderComponent(_component_MobileNavigation, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _default as default };
//# sourceMappingURL=default-W3mDrAJU.mjs.map
