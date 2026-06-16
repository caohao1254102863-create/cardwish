import { _ as __nuxt_component_0 } from './nuxt-link-DXRsjbAZ.mjs';
import { computed, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';
import { b as useRoute, e as useRuntimeConfig } from './server.mjs';
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

const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const cfg = useRuntimeConfig();
    const ret = useAsyncData("order-detail", () => $fetch("/api/orders/" + route.params.id));
    const order = computed(() => {
      const d = ret.data.value;
      return d ? d.order : null;
    });
    const copied = ref(false);
    const shareUrl = computed(() => order.value ? cfg.public.siteUrl + "/pay/" + order.value.share_code : "");
    const earning = computed(() => {
      var _a;
      return Math.round((((_a = order.value) == null ? void 0 : _a.total_cents) || 0) * 0.7);
    });
    const pending = computed(() => ret.pending.value);
    function fmt(c) {
      return (c / 100).toFixed(2);
    }
    const labels = {
      p: "\u7B49\u5F85\u4ED8\u6B3E",
      a: "\u5DF2\u4ED8\u6B3E",
      d: "\u5361\u7247\u5DF2\u9001\u8FBE",
      e: "\u5DF2\u8FC7\u671F",
      c: "\u5DF2\u53D6\u6D88",
      pe: "\u23F3",
      ae: "\u2705",
      de: "\u{1F48C}",
      ee: "\u231B",
      ce: "\u274C",
      pb: "bg-gradient-to-r from-yellow-400 to-orange-400",
      ab: "bg-gradient-to-r from-blue-400 to-cyan-400",
      db: "bg-gradient-to-r from-green-400 to-emerald-400",
      eb: "bg-gradient-to-r from-gray-400 to-gray-500",
      cb: "bg-gradient-to-r from-gray-400 to-gray-500"
    };
    const s = computed(() => {
      var _a;
      return ((_a = order.value) == null ? void 0 : _a.status) || "";
    });
    const statusText = computed(() => labels[s.value] || s.value);
    const statusEmoji = computed(() => labels[s.value + "e"] || "\u{1F4CB}");
    const statusBg = computed(() => labels[s.value + "b"] || "bg-gray-400");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-100 pb-6" }, _attrs))}>`);
      if (unref(pending)) {
        _push(`<div class="p-4 pt-20 space-y-4"><div class="h-6 bg-gray-200 rounded w-2/3"></div><div class="h-40 bg-gray-200 rounded-xl"></div></div>`);
      } else if (!unref(order)) {
        _push(`<div class="p-8 text-center pt-20"><p class="text-4xl mb-3">\u{1F50D}</p><p class="text-gray-500">\u8BA2\u5355\u672A\u627E\u5230</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "btn-primary !inline-flex mt-4"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u8FD4\u56DE\u9996\u9875`);
            } else {
              return [
                createTextVNode("\u8FD4\u56DE\u9996\u9875")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!--[--><div class="${ssrRenderClass([unref(statusBg), "text-white text-center py-8 px-4"])}"><p class="text-4xl mb-2">${ssrInterpolate(unref(statusEmoji))}</p><h2 class="text-xl font-bold">${ssrInterpolate(unref(statusText))}</h2><p class="text-sm opacity-80 mt-1">\u8BA2\u5355\u53F7 ${ssrInterpolate(unref(order).order_number)}</p></div><div class="px-3 -mt-4"><div class="bg-white rounded-xl overflow-hidden shadow-sm"><div class="h-40 flex items-center justify-center" style="${ssrRenderStyle({ "background": "linear-gradient(135deg,#fce7f3,#fff1f2,#f3e8ff)" })}"><div class="text-center"><p class="text-6xl">\u{1F49D}</p></div></div><div class="p-4">`);
        if (unref(order).message) {
          _push(`<p class="text-sm p-3 rounded-lg mb-3" style="${ssrRenderStyle({ "background": "#fff7ed", "color": "#c2410c" })}">&quot;${ssrInterpolate(unref(order).message)}&quot;</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex justify-between text-sm mb-1"><span class="text-gray-400">\u5361\u7247\u91D1\u989D</span><span class="font-semibold">$${ssrInterpolate(fmt(unref(order).total_cents))}</span></div><div class="flex justify-between text-sm"><span class="text-gray-400">\u4F60\u5C06\u83B7\u5F97 (70%)</span><span class="font-bold text-green-500">$${ssrInterpolate(fmt(unref(earning)))}</span></div></div></div></div>`);
        if (unref(order).status === "pending") {
          _push(`<div class="px-3 mt-4"><div class="bg-white rounded-xl p-5 shadow-sm"><h3 class="font-bold text-gray-800 mb-1">\u5206\u4EAB\u94FE\u63A5\u7ED9\u670B\u53CB\u4EE3\u4ED8</h3><p class="text-xs text-gray-400 mb-4">\u590D\u5236\u94FE\u63A5\u53D1\u9001\u7ED9\u5FAE\u4FE1 / \u5C0F\u7EA2\u4E66 / X \u597D\u53CB</p><div class="bg-gray-50 rounded-lg p-3 mb-4 flex items-center gap-2"><code class="flex-1 text-xs text-gray-600 break-all">${ssrInterpolate(unref(shareUrl))}</code><button class="flex-shrink-0 px-4 py-2 text-white rounded-lg text-sm font-medium active:scale-95" style="${ssrRenderStyle({ "background": "#ff6b81" })}">${ssrInterpolate(unref(copied) ? "\u5DF2\u590D\u5236" : "\u590D\u5236")}</button></div><div class="flex justify-center gap-4"><button class="w-12 h-12 rounded-full flex items-center justify-center text-xl active:scale-90" style="${ssrRenderStyle({ "background": "#f0fdf4", "color": "#22c55e" })}">\u{1F4AC}</button><button class="w-12 h-12 rounded-full flex items-center justify-center text-xl active:scale-90" style="${ssrRenderStyle({ "background": "#fef2f2", "color": "#ef4444" })}">\u{1F4D5}</button><button class="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl active:scale-90" style="${ssrRenderStyle({ "background": "#111" })}">\u{1D54F}</button><button class="w-12 h-12 rounded-full flex items-center justify-center text-xl active:scale-90" style="${ssrRenderStyle({ "background": "#eff6ff", "color": "#3b82f6" })}">\u{1F4F1}</button></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(order).status === "delivered") {
          _push(`<div class="px-3 mt-4">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/user/received",
            class: "w-full py-3 rounded-full text-white font-semibold text-center block no-underline shadow-lg",
            style: { "background": "linear-gradient(135deg,#ff6b81,#ff8fa3)" }
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`\u67E5\u770B\u6211\u7684\u5361\u7247`);
              } else {
                return [
                  createTextVNode("\u67E5\u770B\u6211\u7684\u5361\u7247")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/order/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-BWoUxqF-.mjs.map
