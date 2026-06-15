import { _ as __nuxt_component_0 } from './nuxt-link-BVMrTfN6.mjs';
import { defineComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/global/AppFooter.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=AppFooter-dPiBEs93.mjs.map
