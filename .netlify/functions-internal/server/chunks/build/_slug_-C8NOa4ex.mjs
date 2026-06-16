import { _ as _sfc_main$1 } from './CardGrid-B3R40oCq.mjs';
import { defineComponent, computed, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderComponent, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useI18n, b as useRoute } from './server.mjs';
import { u as useAsyncData } from './asyncData-DZz6jobG.mjs';
import { u as useHead } from './v3-tsAQDrvk.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './nuxt-link-DXRsjbAZ.mjs';
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
  __name: "[slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const route = useRoute();
    const slug = computed(() => route.params.slug);
    const currentSort = ref("popular");
    const page = ref(1);
    const catName = computed(() => {
      const map = {
        birthday: "\u{1F382} " + t("categories.birthday"),
        love: "\u{1F495} " + t("categories.love"),
        flowers: "\u{1F490} " + t("categories.flowers"),
        coffee: "\u2615 " + t("categories.coffee"),
        cake: "\u{1F370} " + t("categories.cake"),
        thanks: "\u{1F64F} " + t("categories.thanks"),
        congratulations: "\u{1F389} " + t("categories.congratulations"),
        mystery: "\u{1F381} " + t("categories.mystery"),
        encouragement: "\u{1F4AA} " + t("categories.encouragement"),
        friendship: "\u{1F91D} " + t("categories.friendship")
      };
      return map[slug.value] || slug.value;
    });
    const sorts = computed(() => [
      { label: locale.value === "zh-CN" ? "\u{1F525} \u6700\u70ED\u95E8" : "\u{1F525} Popular", value: "popular" },
      { label: locale.value === "zh-CN" ? "\u{1F195} \u6700\u65B0" : "\u{1F195} Newest", value: "newest" },
      { label: locale.value === "zh-CN" ? "\u{1F4B0} \u4EF7\u683C\u4F4E" : "\u{1F4B0} Price Low", value: "price_asc" },
      { label: locale.value === "zh-CN" ? "\u{1F4B0} \u4EF7\u683C\u9AD8" : "\u{1F4B0} Price High", value: "price_desc" }
    ]);
    const { data, pending, refresh } = useAsyncData(
      () => `category-${slug.value}-${currentSort.value}-${page.value}`,
      async () => {
        const res = await $fetch("/api/cards", {
          query: {
            category: slug.value,
            sort: currentSort.value,
            page: page.value,
            limit: 20,
            locale: locale.value
          }
        });
        return res.cards || [];
      },
      { watch: [slug, currentSort] }
    );
    const cards = computed(() => data.value || []);
    const hasMore = computed(() => cards.value.length >= 20);
    useHead(() => ({
      title: `${catName.value} - CardWish`
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CardGrid = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pb-4" }, _attrs))} data-v-e33ac89b><div class="px-4 pt-4 pb-2" data-v-e33ac89b><h1 class="text-xl font-bold text-gray-800" data-v-e33ac89b>${ssrInterpolate(unref(catName))}</h1></div><div class="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide" data-v-e33ac89b><!--[-->`);
      ssrRenderList(unref(sorts), (s) => {
        _push(`<button class="${ssrRenderClass([unref(currentSort) === s.value ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "bg-white text-gray-500 border-gray-200", "flex-shrink-0 px-4 py-1.5 rounded-full text-sm border transition-all"])}" data-v-e33ac89b>${ssrInterpolate(s.label)}</button>`);
      });
      _push(`<!--]--></div><div class="px-4" data-v-e33ac89b>`);
      _push(ssrRenderComponent(_component_CardGrid, {
        cards: unref(cards),
        loading: unref(pending)
      }, null, _parent));
      _push(`</div>`);
      if (unref(hasMore)) {
        _push(`<div class="text-center py-4" data-v-e33ac89b><button class="btn-secondary"${ssrIncludeBooleanAttr(unref(pending)) ? " disabled" : ""} data-v-e33ac89b>${ssrInterpolate(unref(pending) ? unref(t)("common.loading") : unref(locale) === "zh-CN" ? "\u52A0\u8F7D\u66F4\u591A" : "Load More")}</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/category/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e33ac89b"]]);

export { _slug_ as default };
//# sourceMappingURL=_slug_-C8NOa4ex.mjs.map
