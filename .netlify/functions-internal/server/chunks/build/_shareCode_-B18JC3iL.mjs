import { _ as __nuxt_component_0 } from './nuxt-link-DXRsjbAZ.mjs';
import { computed, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderStyle, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { b as useRoute } from './server.mjs';
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
  __name: "[shareCode]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const ret = useAsyncData("pay", () => $fetch("/api/orders/" + route.params.shareCode + "/by-share"));
    const o = computed(() => {
      const d = ret.data.value;
      return d ? d.order : null;
    });
    const loading = computed(() => ret.pending.value);
    const isDone = computed(() => {
      if (!o.value) return null;
      if (o.value.status === "expired") return "expired";
      if (o.value.status === "delivered") return "delivered";
      return null;
    });
    const paying = ref(false);
    function fmt(c) {
      return (c / 100).toFixed(2);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-100" }, _attrs))}>`);
      if (unref(loading)) {
        _push(`<div class="min-h-screen flex items-center justify-center"><p class="text-gray-400">\u52A0\u8F7D\u4E2D...</p></div>`);
      } else if (unref(isDone)) {
        _push(`<div class="min-h-screen flex items-center justify-center p-6"><div class="text-center"><p class="text-5xl mb-4">${ssrInterpolate(unref(isDone) === "expired" ? "\u23F0" : "\u{1F48C}")}</p><p class="text-xl font-bold text-gray-700 mb-2">${ssrInterpolate(unref(isDone) === "expired" ? "\u8BA2\u5355\u5DF2\u8FC7\u671F" : "\u5DF2\u5E2ETA\u4E70\u5355\u5566 \u{1F389}")}</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "inline-block px-8 py-3 rounded-full text-white font-semibold no-underline shadow-lg",
          style: { "background": "linear-gradient(135deg, #ff6b81, #ff8fa3)" }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u6311\u9009\u5361\u7247`);
            } else {
              return [
                createTextVNode("\u6311\u9009\u5361\u7247")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else if (unref(o)) {
        _push(`<!--[--><div class="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100"><div class="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg" style="${ssrRenderStyle({ "background": "linear-gradient(135deg, #ff6b81, #ff8fa3)" })}">\u{1F49D}</div><div><p class="text-sm font-semibold text-gray-800">CardWish</p><p class="text-xs text-gray-400">\u670B\u53CB\u4EE3\u4ED8 \xB7 \u5FC3\u610F\u5361\u7247</p></div></div><div class="bg-white mx-3 mt-3 rounded-xl px-4 py-3 flex items-center gap-3"><p class="text-blue-500">\u{1F4CD}</p><div class="flex-1"><p class="text-gray-800 font-medium">${ssrInterpolate(unref(o).recipient_name || "\u597D\u53CB")}</p><p class="text-gray-400 text-xs">\u5FC3\u610F\u5361\u7247 \xB7 \u7EBF\u4E0A\u9001\u8FBE</p></div></div><div class="bg-white mx-3 mt-3 rounded-xl overflow-hidden"><div class="h-48 flex items-center justify-center" style="${ssrRenderStyle({ "background": "linear-gradient(135deg, #fce7f3, #fff1f2, #f3e8ff)" })}"><div class="text-center"><p class="text-6xl mb-2">\u{1F49D}</p><p class="text-sm text-gray-500">${ssrInterpolate(unref(o).card_name)}</p></div></div><div class="p-4">`);
        if (unref(o).message) {
          _push(`<p class="text-sm p-3 rounded-lg mb-3" style="${ssrRenderStyle({ "background": "#fff7ed", "color": "#c2410c" })}">&quot;${ssrInterpolate(unref(o).message)}&quot;</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex justify-between text-sm font-bold pt-3 border-t border-gray-100"><span>\u5B9E\u4ED8\u6B3E</span><span class="text-lg" style="${ssrRenderStyle({ "color": "#ff6b81" })}">$${ssrInterpolate(fmt(unref(o).total_cents))}</span></div></div></div><div class="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 max-w-lg mx-auto"><button type="button"${ssrIncludeBooleanAttr(unref(paying)) ? " disabled" : ""} class="w-full py-3 rounded-full font-bold text-white text-base shadow-lg disabled:opacity-50" style="${ssrRenderStyle({ "background": "#0070ba" })}">${ssrInterpolate(unref(paying) ? "\u5904\u7406\u4E2D..." : "PayPal $" + fmt(unref(o).total_cents) + " \u5E2ETA\u4ED8\u6B3E")}</button></div><div class="h-20"></div><!--]-->`);
      } else {
        _push(`<div class="min-h-screen flex items-center justify-center"><p class="text-gray-500">\u8BA2\u5355\u672A\u627E\u5230</p></div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pay/[shareCode].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_shareCode_-B18JC3iL.mjs.map
