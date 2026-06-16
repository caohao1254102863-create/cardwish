import { _ as __nuxt_component_0 } from './nuxt-link-DXRsjbAZ.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import { u as useI18n, a as useLocalePath, b as useRoute } from './server.mjs';
import { u as useAsyncData } from './asyncData-DZz6jobG.mjs';
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
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const localePath = useLocalePath();
    const route = useRoute();
    const { data, pending } = useAsyncData(
      () => `card-${route.params.id}`,
      () => $fetch(`/api/cards/${route.params.id}`, { query: { locale: locale.value } }),
      "$bj3GmiQmeD"
      /* nuxt-injected */
    );
    const card = computed(() => {
      var _a;
      return ((_a = data.value) == null ? void 0 : _a.card) || null;
    });
    const gradientClass = computed(() => {
      var _a;
      const m = { love: "gradient-love", birthday: "gradient-birthday", flowers: "gradient-floral", coffee: "gradient-coffee", congratulations: "gradient-sunset", thanks: "gradient-forest", mystery: "gradient-royal" };
      return m[((_a = card.value) == null ? void 0 : _a.category_slug) || ""] || "gradient-love";
    });
    const categoryEmoji = computed(() => {
      var _a;
      const m = { love: "\u{1F495}", birthday: "\u{1F382}", flowers: "\u{1F490}", coffee: "\u2615", cake: "\u{1F370}", thanks: "\u{1F64F}", congratulations: "\u{1F389}", mystery: "\u{1F381}", encouragement: "\u{1F4AA}", friendship: "\u{1F91D}" };
      return m[((_a = card.value) == null ? void 0 : _a.category_slug) || ""] || "\u{1F49D}";
    });
    const catName = computed(() => {
      var _a, _b;
      return t(`categories.${(_a = card.value) == null ? void 0 : _a.category_slug}`) || ((_b = card.value) == null ? void 0 : _b.category_slug);
    });
    function formatPrice(c) {
      return (c / 100).toFixed(2);
    }
    useHead(() => ({
      title: card.value ? `${card.value.name} - CardWish` : "CardWish"
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pb-6" }, _attrs))}>`);
      if (unref(pending)) {
        _push(`<div class="p-4"><div class="aspect-[4/3] bg-gray-100 rounded-xl animate-shimmer mb-4"></div><div class="h-6 bg-gray-100 rounded w-3/4 animate-shimmer mb-2"></div><div class="h-4 bg-gray-100 rounded w-1/2 animate-shimmer"></div></div>`);
      } else if (!unref(card)) {
        _push(`<div class="p-8 text-center"><div class="text-4xl mb-3">\u{1F614}</div><p class="text-gray-500 mb-4">${ssrInterpolate(unref(t)("errors.card_not_found"))}</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)("/"),
          class: "btn-primary !inline-flex"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` \u2190 ${ssrInterpolate(unref(t)("common.back"))}`);
            } else {
              return [
                createTextVNode(" \u2190 " + toDisplayString(unref(t)("common.back")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!--[--><div class="relative"><div class="${ssrRenderClass([unref(gradientClass), "w-full aspect-[4/3] flex items-center justify-center text-7xl"])}">${ssrInterpolate(unref(categoryEmoji))}</div></div><div class="px-4 pt-5"><div class="flex items-start justify-between mb-2"><h1 class="text-2xl font-bold text-gray-800 flex-1">${ssrInterpolate(unref(card).name)}</h1></div><p class="text-gray-500 text-sm mb-4">${ssrInterpolate(unref(card).description)}</p><div class="flex items-center gap-2 mb-4"><span class="badge bg-pink-50 text-[var(--color-primary)]">${ssrInterpolate(unref(catName))}</span><!--[-->`);
        ssrRenderList(unref(card).tags, (tag) => {
          _push(`<span class="badge bg-gray-100 text-gray-500">${ssrInterpolate(tag)}</span>`);
        });
        _push(`<!--]--></div><div class="card-container p-4 mb-6"><div class="flex items-center justify-between"><span class="text-gray-500">${ssrInterpolate(unref(t)("card.price"))}</span><span class="price-tag text-2xl"><span class="text-sm mr-0.5">$</span> ${ssrInterpolate(formatPrice(unref(card).price_cents))}</span></div></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)(`/checkout?template_id=${unref(route).params.id}`),
          class: "btn-primary w-full !py-4 !text-lg"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` \u2728 ${ssrInterpolate(unref(t)("card.create_card"))}`);
            } else {
              return [
                createTextVNode(" \u2728 " + toDisplayString(unref(t)("card.create_card")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<p class="text-center text-xs text-gray-400 mt-3">${ssrInterpolate(unref(t)("checkout.fee_note"))}</p></div><!--]-->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/card/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-BaasPr1x.mjs.map
