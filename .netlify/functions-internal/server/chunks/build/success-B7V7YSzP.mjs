import { u as useI18n, a as useLocalePath, d as useRoute$1, _ as __nuxt_component_0 } from './server.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-BVMrTfN6.mjs';
import { defineComponent, computed, ref, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "success",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const localePath = useLocalePath();
    const route = useRoute$1();
    computed(() => route.params.shareCode);
    const payerMessage = ref("");
    const recipientName = ref("");
    ref("loading");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "pay" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen flex items-center justify-center p-6"${_scopeId}><div class="text-center animate-slide-up"${_scopeId}><div class="text-7xl mb-6 animate-pulse-heart"${_scopeId}>\u{1F389}</div><h1 class="text-2xl font-bold text-gray-800 mb-2"${_scopeId}>${ssrInterpolate(unref(t)("payment.success_title"))}</h1><p class="text-gray-500 mb-4"${_scopeId}>${ssrInterpolate(unref(t)("payment.success_message", { name: unref(recipientName) || "someone special" }))}</p><p class="text-gray-400 text-sm mb-8"${_scopeId}>${ssrInterpolate(unref(t)("payment.success_thanks"))}</p>`);
            if (unref(payerMessage)) {
              _push2(`<div class="card-container p-4 mb-8 inline-block"${_scopeId}><p class="text-sm text-gray-500 mb-1"${_scopeId}>${ssrInterpolate(unref(t)("payment.your_message"))}</p><p class="font-message text-[var(--color-primary)] text-lg"${_scopeId}>&quot;${ssrInterpolate(unref(payerMessage))}&quot;</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: unref(localePath)("/"),
              class: "btn-primary !inline-flex"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` \u{1F3A8} ${ssrInterpolate(unref(t)("payment.create_your_own"))}`);
                } else {
                  return [
                    createTextVNode(" \u{1F3A8} " + toDisplayString(unref(t)("payment.create_your_own")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "min-h-screen flex items-center justify-center p-6" }, [
                createVNode("div", { class: "text-center animate-slide-up" }, [
                  createVNode("div", { class: "text-7xl mb-6 animate-pulse-heart" }, "\u{1F389}"),
                  createVNode("h1", { class: "text-2xl font-bold text-gray-800 mb-2" }, toDisplayString(unref(t)("payment.success_title")), 1),
                  createVNode("p", { class: "text-gray-500 mb-4" }, toDisplayString(unref(t)("payment.success_message", { name: unref(recipientName) || "someone special" })), 1),
                  createVNode("p", { class: "text-gray-400 text-sm mb-8" }, toDisplayString(unref(t)("payment.success_thanks")), 1),
                  unref(payerMessage) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "card-container p-4 mb-8 inline-block"
                  }, [
                    createVNode("p", { class: "text-sm text-gray-500 mb-1" }, toDisplayString(unref(t)("payment.your_message")), 1),
                    createVNode("p", { class: "font-message text-[var(--color-primary)] text-lg" }, '"' + toDisplayString(unref(payerMessage)) + '"', 1)
                  ])) : createCommentVNode("", true),
                  createVNode(_component_NuxtLink, {
                    to: unref(localePath)("/"),
                    class: "btn-primary !inline-flex"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" \u{1F3A8} " + toDisplayString(unref(t)("payment.create_your_own")), 1)
                    ]),
                    _: 1
                  }, 8, ["to"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pay/[shareCode]/success.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=success-B7V7YSzP.mjs.map
