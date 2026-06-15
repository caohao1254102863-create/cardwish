import { _ as __nuxt_component_0 } from './nuxt-link-BVMrTfN6.mjs';
import { defineComponent, ref, computed, resolveComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { u as useI18n, a as useLocalePath } from './server.mjs';
import { u as useHead } from './v3-tsAQDrvk.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const localePath = useLocalePath();
    const loading = ref(true);
    const steps = computed(() => [
      { icon: "\u{1F3A8}", title: t("home.step1_title"), desc: t("home.step1_desc") },
      { icon: "\u270F\uFE0F", title: t("home.step2_title"), desc: t("home.step2_desc") },
      { icon: "\u{1F4E4}", title: t("home.step3_title"), desc: t("home.step3_desc") },
      { icon: "\u{1F48C}", title: t("home.step4_title"), desc: t("home.step4_desc") }
    ]);
    const hotCards = ref([]);
    const featuredCards = ref([]);
    useHead({
      title: "CardWish - Beautiful Digital Greeting Cards",
      meta: [
        { name: "description", content: "Create beautiful digital greeting cards, share with friends, and let them pay for it!" }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_CategoryGrid = resolveComponent("CategoryGrid");
      const _component_CardGrid = resolveComponent("CardGrid");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pb-4" }, _attrs))}><section class="relative px-4 pt-6 pb-8"><div class="text-center"><h1 class="text-3xl font-bold text-gradient mb-2">${ssrInterpolate(unref(t)("home.title"))}</h1><p class="text-gray-500 text-sm mb-6">${ssrInterpolate(unref(t)("home.subtitle"))}</p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/category/birthday"),
        class: "btn-primary inline-flex"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u{1F3A8} ${ssrInterpolate(unref(t)("common.view_all"))}`);
          } else {
            return [
              createTextVNode(" \u{1F3A8} " + toDisplayString(unref(t)("common.view_all")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section><section class="px-4 mb-8"><div class="card-container p-5"><h3 class="text-lg font-bold text-center mb-4">${ssrInterpolate(unref(t)("home.how_it_works"))}</h3><div class="grid grid-cols-4 gap-2"><!--[-->`);
      ssrRenderList(unref(steps), (step, i) => {
        _push(`<div class="text-center"><div class="w-10 h-10 rounded-full bg-[var(--color-bg)] flex items-center justify-center text-lg mx-auto mb-2">${ssrInterpolate(step.icon)}</div><p class="text-xs font-semibold text-gray-700">${ssrInterpolate(step.title)}</p><p class="text-[10px] text-gray-400 leading-tight mt-1">${ssrInterpolate(step.desc)}</p></div>`);
      });
      _push(`<!--]--></div></div></section><section class="px-4 mb-6"><h3 class="text-lg font-bold mb-3">${ssrInterpolate(unref(t)("home.categories"))}</h3>`);
      _push(ssrRenderComponent(_component_CategoryGrid, null, null, _parent));
      _push(`</section><section class="px-4 mb-6"><div class="flex items-center justify-between mb-3"><h3 class="text-lg font-bold">${ssrInterpolate(unref(t)("home.hot_picks"))}</h3><span class="text-sm text-[var(--color-primary)]">${ssrInterpolate(unref(t)("common.view_all"))} \u2192</span></div>`);
      _push(ssrRenderComponent(_component_CardGrid, {
        cards: unref(hotCards),
        loading: unref(loading)
      }, null, _parent));
      _push(`</section><section class="px-4 mb-6"><h3 class="text-lg font-bold mb-3">${ssrInterpolate(unref(t)("home.featured"))}</h3>`);
      _push(ssrRenderComponent(_component_CardGrid, {
        cards: unref(featuredCards),
        loading: unref(loading)
      }, null, _parent));
      _push(`</section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DwCHsa10.mjs.map
