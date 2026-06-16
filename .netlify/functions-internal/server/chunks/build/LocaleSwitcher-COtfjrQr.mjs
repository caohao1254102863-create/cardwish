import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { u as useI18n, v as useSwitchLocalePath } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LocaleSwitcher",
  __ssrInlineRender: true,
  setup(__props) {
    const { locale } = useI18n();
    useSwitchLocalePath();
    computed(() => locale.value === "zh-CN" ? "en" : "zh-CN");
    const nextLocaleLabel = computed(() => locale.value === "zh-CN" ? "EN" : "\u4E2D\u6587");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-pink-50 hover:bg-pink-100 transition-colors text-[var(--color-primary)] border-0 cursor-pointer" }, _attrs))}> \u{1F310} ${ssrInterpolate(unref(nextLocaleLabel))}</button>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/global/LocaleSwitcher.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=LocaleSwitcher-COtfjrQr.mjs.map
