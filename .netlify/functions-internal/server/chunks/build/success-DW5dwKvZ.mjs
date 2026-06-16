import { _ as __nuxt_component_0 } from './nuxt-link-DXRsjbAZ.mjs';
import { computed, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { b as useRoute } from './server.mjs';
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

const _sfc_main = {
  __name: "success",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    computed(() => route.params.shareCode);
    const name = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-100 flex flex-col" }, _attrs))}><div class="text-white text-center py-12 px-4" style="${ssrRenderStyle({ "background": "linear-gradient(135deg,#4ade80,#10b981)" })}"><p class="text-6xl mb-4">\u{1F389}</p><h1 class="text-2xl font-bold mb-2">\u4ED8\u6B3E\u6210\u529F\uFF01</h1><p class="text-white text-sm">\u5361\u7247\u5DF2\u9001\u8FBE ${ssrInterpolate(unref(name) || "TA")}</p></div><div class="px-3 -mt-4"><div class="bg-white rounded-xl p-6 text-center shadow-sm"><p class="text-5xl mb-4">\u{1F48C}</p><p class="text-gray-800 font-semibold mb-1">\u5FC3\u610F\u5361\u7247\u5DF2\u751F\u6210</p><p class="text-gray-400 text-sm mb-6">\u5FC3\u610F\u5DF2\u4F20\u8FBE\u7ED9 ${ssrInterpolate(unref(name) || "TA")}\uFF01</p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "inline-block px-8 py-3 rounded-full text-white font-semibold no-underline shadow-lg",
        style: { "background": "linear-gradient(135deg,#ff6b81,#ff8fa3)" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u6211\u4E5F\u8981\u521B\u5EFA\u5361\u7247`);
          } else {
            return [
              createTextVNode("\u6211\u4E5F\u8981\u521B\u5EFA\u5361\u7247")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="flex-1"></div><p class="text-center text-xs text-gray-300 pb-6">\u611F\u8C22\u4F60\u8BA9\u4E16\u754C\u591A\u4E86\u4E00\u4EFD\u6E29\u6696 \u{1F49D}</p></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pay/[shareCode]/success.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=success-DW5dwKvZ.mjs.map
