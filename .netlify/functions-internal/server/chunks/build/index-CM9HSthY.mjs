import { _ as __nuxt_component_0 } from './nuxt-link-DXRsjbAZ.mjs';
import { _ as _sfc_main$1 } from './CardGrid-B3R40oCq.mjs';
import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { u as useI18n, a as useLocalePath } from './server.mjs';
import { u as useHead } from './v3-tsAQDrvk.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const localePath = useLocalePath();
    const steps = computed(() => [
      { icon: "\u{1F3A8}", title: t("home.step1_title"), desc: t("home.step1_desc") },
      { icon: "\u270F\uFE0F", title: t("home.step2_title"), desc: t("home.step2_desc") },
      { icon: "\u{1F4E4}", title: t("home.step3_title"), desc: t("home.step3_desc") },
      { icon: "\u{1F48C}", title: t("home.step4_title"), desc: t("home.step4_desc") }
    ]);
    const allCards = ref([]);
    const catList = ref([]);
    const pending = ref(true);
    async function fetchHomeData() {
      try {
        const cardsRes = await $fetch("/api/cards", { query: { sort: "popular", limit: 20 } });
        const catsRes = await $fetch("/api/categories");
        allCards.value = cardsRes.cards || [];
        catList.value = (catsRes.categories || []).map(function(c) {
          return { ...c, name: locale.value === "zh-CN" ? c.name_zh : c.name_en };
        });
      } catch (e) {
      }
      pending.value = false;
    }
    watch(locale, () => fetchHomeData());
    const categoryList = computed(() => catList.value);
    useHead({
      title: "CardWish - Beautiful Digital Greeting Cards"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_CardGrid = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pb-4" }, _attrs))} data-v-f67b6d37><section class="relative px-4 pt-6 pb-8" data-v-f67b6d37><div class="text-center" data-v-f67b6d37><h1 class="text-3xl font-bold text-gradient mb-2" data-v-f67b6d37>${ssrInterpolate(unref(t)("home.title"))}</h1><p class="text-gray-500 text-sm mb-6" data-v-f67b6d37>${ssrInterpolate(unref(t)("home.subtitle"))}</p>`);
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
      _push(`</div></section><section class="px-4 mb-8" data-v-f67b6d37><div class="card-container p-5" data-v-f67b6d37><h3 class="text-lg font-bold text-center mb-4" data-v-f67b6d37>${ssrInterpolate(unref(t)("home.how_it_works"))}</h3><div class="grid grid-cols-4 gap-2" data-v-f67b6d37><!--[-->`);
      ssrRenderList(unref(steps), (step, i) => {
        _push(`<div class="text-center" data-v-f67b6d37><div class="w-10 h-10 rounded-full bg-[var(--color-bg)] flex items-center justify-center text-lg mx-auto mb-2" data-v-f67b6d37>${ssrInterpolate(step.icon)}</div><p class="text-xs font-semibold text-gray-700" data-v-f67b6d37>${ssrInterpolate(step.title)}</p><p class="text-[10px] text-gray-400 leading-tight mt-1" data-v-f67b6d37>${ssrInterpolate(step.desc)}</p></div>`);
      });
      _push(`<!--]--></div></div></section><section class="px-4 mb-6" data-v-f67b6d37><h3 class="text-lg font-bold mb-3" data-v-f67b6d37>${ssrInterpolate(unref(t)("home.categories"))}</h3><div class="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide" data-v-f67b6d37><!--[-->`);
      ssrRenderList(unref(categoryList), (cat) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: cat.slug,
          to: unref(localePath)(`/category/${cat.slug}`),
          class: "flex flex-col items-center gap-1.5 flex-shrink-0 no-underline w-[72px] py-2 rounded-xl hover:bg-white active:scale-95 transition-all"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-2xl" data-v-f67b6d37${_scopeId}>${ssrInterpolate(cat.icon)}</div><span class="text-xs text-gray-600 text-center leading-tight" data-v-f67b6d37${_scopeId}>${ssrInterpolate(cat.name)}</span>`);
            } else {
              return [
                createVNode("div", { class: "w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-2xl" }, toDisplayString(cat.icon), 1),
                createVNode("span", { class: "text-xs text-gray-600 text-center leading-tight" }, toDisplayString(cat.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></section><section class="px-4 mb-6" data-v-f67b6d37><div class="flex items-center justify-between mb-3" data-v-f67b6d37><h3 class="text-lg font-bold" data-v-f67b6d37>${ssrInterpolate(unref(t)("home.hot_picks"))}</h3>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/category/birthday"),
        class: "text-sm text-[var(--color-primary)] no-underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("common.view_all"))} \u2192 `);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("common.view_all")) + " \u2192 ", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_CardGrid, {
        cards: unref(allCards).slice(0, 6),
        loading: unref(pending)
      }, null, _parent));
      _push(`</section><section class="px-4 mb-6" data-v-f67b6d37><h3 class="text-lg font-bold mb-3" data-v-f67b6d37>${ssrInterpolate(unref(t)("home.featured"))}</h3>`);
      _push(ssrRenderComponent(_component_CardGrid, {
        cards: unref(allCards).slice(6, 14),
        loading: unref(pending)
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
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f67b6d37"]]);

export { index as default };
//# sourceMappingURL=index-CM9HSthY.mjs.map
