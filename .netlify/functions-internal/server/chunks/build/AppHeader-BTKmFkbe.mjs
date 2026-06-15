import { _ as __nuxt_component_0 } from './nuxt-link-BVMrTfN6.mjs';
import _sfc_main$1 from './LocaleSwitcher-wF0Cmm4X.mjs';
import { defineComponent, computed, mergeProps, withCtx, createVNode, unref, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useI18n, a as useLocalePath, c as useSupabaseUser } from './server.mjs';
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
      const _component_LocaleSwitcher = _sfc_main$1;
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/global/AppHeader.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=AppHeader-BTKmFkbe.mjs.map
