import { _ as __nuxt_component_0 } from './nuxt-link-DXRsjbAZ.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { u as useI18n, a as useLocalePath } from './server.mjs';
import { u as useAsyncData } from './asyncData-DZz6jobG.mjs';
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
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "received",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const localePath = useLocalePath();
    const { data, pending } = useAsyncData("user-received", () => $fetch("/api/user/received-cards"));
    const cards = computed(() => {
      var _a;
      return ((_a = data.value) == null ? void 0 : _a.cards) || [];
    });
    function formatDate(d) {
      return new Date(d).toLocaleDateString();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pb-6" }, _attrs))}><div class="px-4 pt-4 pb-2"><h1 class="text-xl font-bold">${ssrInterpolate(unref(t)("received.title"))}</h1></div><div class="px-4">`);
      if (unref(pending)) {
        _push(`<div class="grid grid-cols-2 gap-3"><!--[-->`);
        ssrRenderList(4, (i) => {
          _push(`<div class="card-container animate-shimmer"><div class="aspect-[3/4] bg-gray-100"></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(cards).length === 0) {
        _push(`<div class="text-center py-12"><div class="text-5xl mb-3">\u{1F48C}</div><p class="text-gray-400 mb-4">${ssrInterpolate(unref(t)("received.no_cards"))}</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)("/"),
          class: "btn-primary !inline-flex"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("home.title"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("home.title")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="grid grid-cols-2 gap-3"><!--[-->`);
        ssrRenderList(unref(cards), (card) => {
          var _a;
          _push(`<div class="card-container relative group active:scale-[0.98] transition-transform cursor-pointer">`);
          if (card.is_new) {
            _push(`<div class="absolute top-2 right-2 z-10 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">${ssrInterpolate(unref(t)("received.new_badge"))}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="aspect-[3/4] gradient-love flex items-center justify-center text-5xl">\u{1F49D}</div><div class="p-3"><p class="text-xs text-gray-400">${ssrInterpolate(((_a = card.message) == null ? void 0 : _a.substring(0, 30)) || "...")}</p><p class="text-xs text-gray-300">${ssrInterpolate(formatDate(card.created_at))}</p></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/user/received.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=received-BM9Fx55j.mjs.map
