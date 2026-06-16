import { _ as __nuxt_component_0 } from './nuxt-link-DXRsjbAZ.mjs';
import { defineComponent, unref, computed, mergeProps, withCtx, createVNode, openBlock, createBlock, toDisplayString, Fragment, renderList, createCommentVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { u as useI18n, a as useLocalePath } from './server.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CardItem",
  __ssrInlineRender: true,
  props: {
    card: {}
  },
  setup(__props) {
    const { locale } = useI18n();
    const localePath = useLocalePath();
    const props = __props;
    const currencySymbol = computed(() => {
      if (props.card.currency === "CNY") return "\xA5";
      return "$";
    });
    function formatPrice(cents) {
      return (cents / 100).toFixed(2);
    }
    function getGradientClass(category) {
      const map = {
        love: "gradient-love",
        birthday: "gradient-birthday",
        flowers: "gradient-floral",
        coffee: "gradient-coffee",
        congratulations: "gradient-sunset",
        thanks: "gradient-forest",
        mystery: "gradient-royal"
      };
      return map[category || ""] || "gradient-love";
    }
    function getCategoryEmoji(category) {
      const map = {
        love: "\u{1F495}",
        birthday: "\u{1F382}",
        flowers: "\u{1F490}",
        coffee: "\u2615",
        cake: "\u{1F370}",
        thanks: "\u{1F64F}",
        congratulations: "\u{1F389}",
        mystery: "\u{1F381}",
        encouragement: "\u{1F4AA}",
        friendship: "\u{1F91D}"
      };
      return map[category || ""] || "\u{1F49D}";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: unref(localePath)(`/card/${__props.card.id}`),
        class: "card-container no-underline group active:scale-[0.98] transition-transform duration-200"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f;
          if (_push2) {
            _push2(`<div class="${ssrRenderClass([getGradientClass(__props.card.category_slug), "aspect-[3/4] relative overflow-hidden"])}"${_scopeId}>`);
            if ((_b = (_a = __props.card.images) == null ? void 0 : _a[0]) == null ? void 0 : _b.url) {
              _push2(`<img${ssrRenderAttr("src", __props.card.images[0].url)}${ssrRenderAttr("alt", __props.card.name)} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy"${_scopeId}>`);
            } else {
              _push2(`<div class="w-full h-full flex items-center justify-center text-5xl"${_scopeId}>${ssrInterpolate(getCategoryEmoji(__props.card.category_slug))}</div>`);
            }
            if ((_c = __props.card.tags) == null ? void 0 : _c.length) {
              _push2(`<div class="absolute top-2 left-2 flex flex-col gap-1"${_scopeId}><!--[-->`);
              ssrRenderList(__props.card.tags, (tag) => {
                _push2(`<span class="badge bg-white/90 text-[var(--color-primary)] text-[10px]"${_scopeId}>${ssrInterpolate(tag)}</span>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="p-3"${_scopeId}><h4 class="text-sm font-semibold text-gray-800 line-clamp-2 mb-1"${_scopeId}>${ssrInterpolate(__props.card.name)}</h4><div class="price-tag text-base"${_scopeId}><span class="text-xs mr-0.5"${_scopeId}>${ssrInterpolate(unref(currencySymbol))}</span> ${ssrInterpolate(formatPrice(__props.card.price_cents))}</div></div>`);
          } else {
            return [
              createVNode("div", {
                class: ["aspect-[3/4] relative overflow-hidden", getGradientClass(__props.card.category_slug)]
              }, [
                ((_e = (_d = __props.card.images) == null ? void 0 : _d[0]) == null ? void 0 : _e.url) ? (openBlock(), createBlock("img", {
                  key: 0,
                  src: __props.card.images[0].url,
                  alt: __props.card.name,
                  class: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",
                  loading: "lazy"
                }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "w-full h-full flex items-center justify-center text-5xl"
                }, toDisplayString(getCategoryEmoji(__props.card.category_slug)), 1)),
                ((_f = __props.card.tags) == null ? void 0 : _f.length) ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "absolute top-2 left-2 flex flex-col gap-1"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.card.tags, (tag) => {
                    return openBlock(), createBlock("span", {
                      key: tag,
                      class: "badge bg-white/90 text-[var(--color-primary)] text-[10px]"
                    }, toDisplayString(tag), 1);
                  }), 128))
                ])) : createCommentVNode("", true)
              ], 2),
              createVNode("div", { class: "p-3" }, [
                createVNode("h4", { class: "text-sm font-semibold text-gray-800 line-clamp-2 mb-1" }, toDisplayString(__props.card.name), 1),
                createVNode("div", { class: "price-tag text-base" }, [
                  createVNode("span", { class: "text-xs mr-0.5" }, toDisplayString(unref(currencySymbol)), 1),
                  createTextVNode(" " + toDisplayString(formatPrice(__props.card.price_cents)), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cards/CardItem.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CardGrid",
  __ssrInlineRender: true,
  props: {
    cards: {},
    loading: { type: Boolean }
  },
  setup(__props) {
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CardItem = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (__props.loading) {
        _push(`<div class="grid grid-cols-2 gap-3"><!--[-->`);
        ssrRenderList(4, (i) => {
          _push(`<div class="card-container animate-shimmer"><div class="aspect-[3/4] bg-gray-100"></div><div class="p-3 space-y-2"><div class="h-4 bg-gray-100 rounded w-3/4"></div><div class="h-5 bg-gray-100 rounded w-1/3"></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (__props.cards.length > 0) {
        _push(`<div class="grid grid-cols-2 gap-3"><!--[-->`);
        ssrRenderList(__props.cards, (card) => {
          _push(ssrRenderComponent(_component_CardItem, {
            key: card.id,
            card
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-center py-12"><div class="text-4xl mb-3">\u{1F0CF}</div><p class="text-gray-400 text-sm">${ssrInterpolate(unref(t)("common.no_data"))}</p></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cards/CardGrid.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=CardGrid-B3R40oCq.mjs.map
