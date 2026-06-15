import { defineComponent, computed, ref, watch, resolveComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderComponent, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useI18n, d as useRoute$1, a as useLocalePath } from './server.mjs';
import { u as useFetch } from './fetch-COjRzY71.mjs';
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
import '@vant/use';
import '@vue/shared';
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const route = useRoute$1();
    useLocalePath();
    const slug = computed(() => route.params.slug);
    const cards = ref([]);
    const loading = ref(true);
    const loadingMore = ref(false);
    const currentSort = ref("popular");
    const page = ref(1);
    const hasMore = ref(true);
    const categoryName = computed(() => {
      const nameMap = {
        birthday: t("categories.birthday"),
        love: t("categories.love"),
        flowers: t("categories.flowers"),
        coffee: t("categories.coffee"),
        cake: t("categories.cake"),
        thanks: t("categories.thanks"),
        congratulations: t("categories.congratulations"),
        mystery: t("categories.mystery"),
        encouragement: t("categories.encouragement"),
        friendship: t("categories.friendship")
      };
      return nameMap[slug.value] || slug.value;
    });
    const sorts = [
      { label: "\u{1F525} Popular", value: "popular" },
      { label: "\u{1F195} Newest", value: "newest" },
      { label: "\u{1F4B0} Price \u2191", value: "price_asc" },
      { label: "\u{1F4B0} Price \u2193", value: "price_desc" }
    ];
    async function fetchCards(reset = false) {
      if (reset) {
        page.value = 1;
        cards.value = [];
      }
      loading.value = true;
      try {
        const { data } = await useFetch(
          "/api/cards",
          {
            query: {
              category: slug.value,
              sort: currentSort.value,
              page: page.value,
              limit: 20,
              locale: locale.value
            }
          },
          "$igc7Mv3EJ-"
          /* nuxt-injected */
        );
        if (data.value) {
          const newCards = data.value.cards || [];
          if (reset) cards.value = newCards;
          else cards.value.push(...newCards);
          hasMore.value = newCards.length >= 20;
        }
      } catch (e) {
      }
      loading.value = false;
      loadingMore.value = false;
    }
    watch(currentSort, () => fetchCards(true));
    watch(slug, () => fetchCards(true));
    useHead(() => ({
      title: `${categoryName.value} - CardWish`
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CardGrid = resolveComponent("CardGrid");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pb-4" }, _attrs))} data-v-abc1a975><div class="px-4 pt-4 pb-2" data-v-abc1a975><h1 class="text-xl font-bold text-gray-800" data-v-abc1a975>${ssrInterpolate(unref(categoryName))}</h1></div><div class="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide" data-v-abc1a975><!--[-->`);
      ssrRenderList(sorts, (s) => {
        _push(`<button class="${ssrRenderClass([unref(currentSort) === s.value ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "bg-white text-gray-500 border-gray-200", "flex-shrink-0 px-4 py-1.5 rounded-full text-sm border transition-all"])}" data-v-abc1a975>${ssrInterpolate(s.label)}</button>`);
      });
      _push(`<!--]--></div><div class="px-4" data-v-abc1a975>`);
      _push(ssrRenderComponent(_component_CardGrid, {
        cards: unref(cards),
        loading: unref(loading)
      }, null, _parent));
      _push(`</div>`);
      if (unref(hasMore)) {
        _push(`<div class="text-center py-4" data-v-abc1a975><button class="btn-secondary"${ssrIncludeBooleanAttr(unref(loadingMore)) ? " disabled" : ""} data-v-abc1a975>${ssrInterpolate(unref(loadingMore) ? unref(t)("common.loading") : "Load More")}</button></div>`);
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
const _slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-abc1a975"]]);

export { _slug_ as default };
//# sourceMappingURL=_slug_-SjtR-9do.mjs.map
