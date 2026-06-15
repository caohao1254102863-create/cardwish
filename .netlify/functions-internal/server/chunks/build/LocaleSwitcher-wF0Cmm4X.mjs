import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { u as useI18n, y as useSwitchLocalePath } from './server.mjs';
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
  __name: "LocaleSwitcher",
  __ssrInlineRender: true,
  setup(__props) {
    const { locale } = useI18n();
    useSwitchLocalePath();
    const currentLocale = computed(() => locale.value);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 border-0 cursor-pointer" }, _attrs))}><span>${ssrInterpolate(unref(currentLocale) === "en" ? "\u4E2D" : "EN")}</span></button>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/global/LocaleSwitcher.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=LocaleSwitcher-wF0Cmm4X.mjs.map
