import { u as useI18n, a as useLocalePath, d as useRoute$1, _ as __nuxt_component_0, e as useRuntimeConfig } from './server.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-BVMrTfN6.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, unref, createTextVNode, toDisplayString, openBlock, createBlock, createVNode, withDirectives, isRef, vModelText, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useFetch } from './fetch-COjRzY71.mjs';
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
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[shareCode]",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const localePath = useLocalePath();
    const route = useRoute$1();
    const config = useRuntimeConfig();
    const order = ref(null);
    const loading = ref(true);
    const paying = ref(false);
    const payerMessage = ref("");
    const shareCode = computed(() => route.params.shareCode);
    const currencySymbol = computed(() => {
      var _a;
      if (((_a = order.value) == null ? void 0 : _a.currency) === "CNY") return "\xA5";
      return "$";
    });
    const cardGradient = computed(() => {
      var _a;
      const map = { love: "gradient-love", birthday: "gradient-birthday", flowers: "gradient-floral", coffee: "gradient-coffee", congratulations: "gradient-sunset", thanks: "gradient-forest", mystery: "gradient-royal" };
      return map[((_a = order.value) == null ? void 0 : _a.category_slug) || ""] || "gradient-love";
    });
    const cardEmoji = computed(() => {
      var _a;
      const map = { love: "\u{1F495}", birthday: "\u{1F382}", flowers: "\u{1F490}", coffee: "\u2615", cake: "\u{1F370}", thanks: "\u{1F64F}", congratulations: "\u{1F389}", mystery: "\u{1F381}", encouragement: "\u{1F4AA}", friendship: "\u{1F91D}" };
      return map[((_a = order.value) == null ? void 0 : _a.category_slug) || ""] || "\u{1F49D}";
    });
    function formatPrice(cents) {
      return (cents / 100).toFixed(2);
    }
    async function handlePay() {
      var _a, _b;
      paying.value = true;
      try {
        const successUrl = `${(void 0).location.origin}/pay/${shareCode.value}/success`;
        const cancelUrl = `${(void 0).location.origin}/pay/${shareCode.value}`;
        const { data, error } = await useFetch(
          `/api/pay/${shareCode.value}/create-session`,
          {
            method: "POST",
            body: {
              success_url: successUrl,
              cancel_url: cancelUrl,
              payer_message: payerMessage.value,
              locale: locale.value
            }
          },
          "$o3NzKUOywt"
          /* nuxt-injected */
        );
        if (error.value) throw error.value;
        const sessionUrl = ((_a = data.value) == null ? void 0 : _a.checkout_url) || ((_b = data.value) == null ? void 0 : _b.url);
        if (sessionUrl) {
          (void 0).location.href = sessionUrl;
        }
      } catch (e) {
        alert(e.message || t("errors.payment_failed"));
      }
      paying.value = false;
    }
    useHead(() => {
      if (!order.value) return {};
      const cardName = order.value.card_name || "Card";
      const recipientName = order.value.recipient_name || "Someone";
      const price = formatPrice(order.value.total_cents || 0);
      const cur = order.value.currency === "CNY" ? "\xA5" : "$";
      return {
        title: t("payment.page_title", { name: recipientName, card_name: cardName }),
        meta: [
          { property: "og:title", content: t("payment.page_title", { name: recipientName, card_name: cardName }) },
          { property: "og:description", content: t("share.og_description", { price: cur + price, name: recipientName }) },
          { property: "og:type", content: "website" },
          { property: "og:image", content: `${config.public.siteUrl}/og-default.png` },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "twitter:title", content: t("payment.page_title", { name: recipientName, card_name: cardName }) },
          { name: "twitter:description", content: t("share.og_description", { price: cur + price, name: recipientName }) }
        ]
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "pay" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f;
          if (_push2) {
            if (unref(loading)) {
              _push2(`<div class="min-h-screen flex items-center justify-center"${_scopeId}><div class="text-center"${_scopeId}><div class="text-5xl animate-bounce mb-4"${_scopeId}>\u{1F49D}</div><p class="text-gray-400"${_scopeId}>${ssrInterpolate(unref(t)("common.loading"))}</p></div></div>`);
            } else if (((_a = unref(order)) == null ? void 0 : _a.status) === "expired") {
              _push2(`<div class="min-h-screen flex items-center justify-center p-6"${_scopeId}><div class="text-center animate-fade-in"${_scopeId}><div class="text-6xl mb-4"${_scopeId}>\u23F0</div><h2 class="text-xl font-bold text-gray-700 mb-2"${_scopeId}>${ssrInterpolate(unref(t)("payment.expired"))}</h2><p class="text-gray-400 mb-6"${_scopeId}>${ssrInterpolate(unref(t)("payment.create_your_own"))}</p>`);
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: unref(localePath)("/"),
                class: "btn-primary !inline-flex"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` \u{1F3A8} ${ssrInterpolate(unref(t)("home.title"))}`);
                  } else {
                    return [
                      createTextVNode(" \u{1F3A8} " + toDisplayString(unref(t)("home.title")), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else if (((_b = unref(order)) == null ? void 0 : _b.status) === "paid" || ((_c = unref(order)) == null ? void 0 : _c.status) === "delivered") {
              _push2(`<div class="min-h-screen flex items-center justify-center p-6"${_scopeId}><div class="text-center animate-fade-in"${_scopeId}><div class="text-6xl mb-4"${_scopeId}>\u{1F48C}</div><h2 class="text-xl font-bold text-gray-700 mb-2"${_scopeId}>${ssrInterpolate(unref(t)("payment.already_paid"))}</h2><p class="text-gray-400 mb-6"${_scopeId}>${ssrInterpolate(unref(t)("payment.create_your_own"))}</p>`);
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: unref(localePath)("/"),
                class: "btn-primary !inline-flex"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` \u{1F3A8} ${ssrInterpolate(unref(t)("home.title"))}`);
                  } else {
                    return [
                      createTextVNode(" \u{1F3A8} " + toDisplayString(unref(t)("home.title")), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else if (unref(order)) {
              _push2(`<div class="px-4 pt-8 pb-12 animate-fade-in"${_scopeId}><div class="text-center mb-6"${_scopeId}><p class="text-sm text-gray-500 mb-2"${_scopeId}>${ssrInterpolate(unref(t)("payment.card_from", { name: unref(order).recipient_name || "Someone" }))}</p><h1 class="text-2xl font-bold text-gray-800 mb-1"${_scopeId}>${ssrInterpolate(unref(t)("payment.page_title", { name: unref(order).recipient_name || "", card_name: unref(order).card_name || "Card" }))}</h1></div><div class="card-container mb-6 overflow-hidden"${_scopeId}><div class="${ssrRenderClass([unref(cardGradient), "p-6 text-white text-center"])}"${_scopeId}><div class="text-5xl mb-4"${_scopeId}>${ssrInterpolate(unref(cardEmoji))}</div><div class="bg-white/10 rounded-xl p-5 backdrop-blur-sm"${_scopeId}><p class="font-message text-white text-lg leading-relaxed"${_scopeId}> &quot;${ssrInterpolate(unref(order).message || "...")}&quot; </p><div class="mt-4 pt-4 border-t border-white/20"${_scopeId}><p class="text-sm text-white/80"${_scopeId}>${ssrInterpolate(unref(t)("card.to"))}: ${ssrInterpolate(unref(order).recipient_name || "...")}</p></div></div></div><div class="p-5 text-center"${_scopeId}><p class="text-gray-500 text-sm mb-2"${_scopeId}>${ssrInterpolate(unref(t)("card.price"))}</p><div class="price-tag text-3xl mb-1"${_scopeId}><span class="text-lg mr-0.5"${_scopeId}>${ssrInterpolate(unref(currencySymbol))}</span> ${ssrInterpolate(formatPrice(unref(order).total_cents))}</div><div class="mt-4"${_scopeId}><input${ssrRenderAttr("value", unref(payerMessage))}${ssrRenderAttr("placeholder", unref(t)("payment.your_message_placeholder", { name: unref(order).recipient_name || "" }))} class="w-full px-4 py-3 rounded-lg border border-gray-200 text-center focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-card-shadow)] outline-none transition-all text-sm" maxlength="100"${_scopeId}></div></div></div><button class="btn-primary w-full !py-4 !text-lg mb-3 animate-pulse-heart"${ssrIncludeBooleanAttr(unref(paying)) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(unref(paying) ? unref(t)("common.loading") : unref(t)("payment.pay_button", { price: unref(currencySymbol) + formatPrice(unref(order).total_cents) }))}</button><p class="text-center text-xs text-gray-400 mb-1"${_scopeId}> \u{1F512} ${ssrInterpolate(unref(t)("payment.secure_payment"))}</p><p class="text-center text-[10px] text-gray-300"${_scopeId}>${ssrInterpolate(unref(t)("payment.payment_methods"))}</p></div>`);
            } else {
              _push2(`<div class="min-h-screen flex items-center justify-center p-6"${_scopeId}><div class="text-center"${_scopeId}><div class="text-5xl mb-4"${_scopeId}>\u{1F615}</div><p class="text-gray-500"${_scopeId}>${ssrInterpolate(unref(t)("errors.order_not_found"))}</p></div></div>`);
            }
          } else {
            return [
              unref(loading) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "min-h-screen flex items-center justify-center"
              }, [
                createVNode("div", { class: "text-center" }, [
                  createVNode("div", { class: "text-5xl animate-bounce mb-4" }, "\u{1F49D}"),
                  createVNode("p", { class: "text-gray-400" }, toDisplayString(unref(t)("common.loading")), 1)
                ])
              ])) : ((_d = unref(order)) == null ? void 0 : _d.status) === "expired" ? (openBlock(), createBlock("div", {
                key: 1,
                class: "min-h-screen flex items-center justify-center p-6"
              }, [
                createVNode("div", { class: "text-center animate-fade-in" }, [
                  createVNode("div", { class: "text-6xl mb-4" }, "\u23F0"),
                  createVNode("h2", { class: "text-xl font-bold text-gray-700 mb-2" }, toDisplayString(unref(t)("payment.expired")), 1),
                  createVNode("p", { class: "text-gray-400 mb-6" }, toDisplayString(unref(t)("payment.create_your_own")), 1),
                  createVNode(_component_NuxtLink, {
                    to: unref(localePath)("/"),
                    class: "btn-primary !inline-flex"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" \u{1F3A8} " + toDisplayString(unref(t)("home.title")), 1)
                    ]),
                    _: 1
                  }, 8, ["to"])
                ])
              ])) : ((_e = unref(order)) == null ? void 0 : _e.status) === "paid" || ((_f = unref(order)) == null ? void 0 : _f.status) === "delivered" ? (openBlock(), createBlock("div", {
                key: 2,
                class: "min-h-screen flex items-center justify-center p-6"
              }, [
                createVNode("div", { class: "text-center animate-fade-in" }, [
                  createVNode("div", { class: "text-6xl mb-4" }, "\u{1F48C}"),
                  createVNode("h2", { class: "text-xl font-bold text-gray-700 mb-2" }, toDisplayString(unref(t)("payment.already_paid")), 1),
                  createVNode("p", { class: "text-gray-400 mb-6" }, toDisplayString(unref(t)("payment.create_your_own")), 1),
                  createVNode(_component_NuxtLink, {
                    to: unref(localePath)("/"),
                    class: "btn-primary !inline-flex"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" \u{1F3A8} " + toDisplayString(unref(t)("home.title")), 1)
                    ]),
                    _: 1
                  }, 8, ["to"])
                ])
              ])) : unref(order) ? (openBlock(), createBlock("div", {
                key: 3,
                class: "px-4 pt-8 pb-12 animate-fade-in"
              }, [
                createVNode("div", { class: "text-center mb-6" }, [
                  createVNode("p", { class: "text-sm text-gray-500 mb-2" }, toDisplayString(unref(t)("payment.card_from", { name: unref(order).recipient_name || "Someone" })), 1),
                  createVNode("h1", { class: "text-2xl font-bold text-gray-800 mb-1" }, toDisplayString(unref(t)("payment.page_title", { name: unref(order).recipient_name || "", card_name: unref(order).card_name || "Card" })), 1)
                ]),
                createVNode("div", { class: "card-container mb-6 overflow-hidden" }, [
                  createVNode("div", {
                    class: ["p-6 text-white text-center", unref(cardGradient)]
                  }, [
                    createVNode("div", { class: "text-5xl mb-4" }, toDisplayString(unref(cardEmoji)), 1),
                    createVNode("div", { class: "bg-white/10 rounded-xl p-5 backdrop-blur-sm" }, [
                      createVNode("p", { class: "font-message text-white text-lg leading-relaxed" }, ' "' + toDisplayString(unref(order).message || "...") + '" ', 1),
                      createVNode("div", { class: "mt-4 pt-4 border-t border-white/20" }, [
                        createVNode("p", { class: "text-sm text-white/80" }, toDisplayString(unref(t)("card.to")) + ": " + toDisplayString(unref(order).recipient_name || "..."), 1)
                      ])
                    ])
                  ], 2),
                  createVNode("div", { class: "p-5 text-center" }, [
                    createVNode("p", { class: "text-gray-500 text-sm mb-2" }, toDisplayString(unref(t)("card.price")), 1),
                    createVNode("div", { class: "price-tag text-3xl mb-1" }, [
                      createVNode("span", { class: "text-lg mr-0.5" }, toDisplayString(unref(currencySymbol)), 1),
                      createTextVNode(" " + toDisplayString(formatPrice(unref(order).total_cents)), 1)
                    ]),
                    createVNode("div", { class: "mt-4" }, [
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => isRef(payerMessage) ? payerMessage.value = $event : null,
                        placeholder: unref(t)("payment.your_message_placeholder", { name: unref(order).recipient_name || "" }),
                        class: "w-full px-4 py-3 rounded-lg border border-gray-200 text-center focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-card-shadow)] outline-none transition-all text-sm",
                        maxlength: "100"
                      }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                        [vModelText, unref(payerMessage)]
                      ])
                    ])
                  ])
                ]),
                createVNode("button", {
                  class: "btn-primary w-full !py-4 !text-lg mb-3 animate-pulse-heart",
                  onClick: handlePay,
                  disabled: unref(paying)
                }, toDisplayString(unref(paying) ? unref(t)("common.loading") : unref(t)("payment.pay_button", { price: unref(currencySymbol) + formatPrice(unref(order).total_cents) })), 9, ["disabled"]),
                createVNode("p", { class: "text-center text-xs text-gray-400 mb-1" }, " \u{1F512} " + toDisplayString(unref(t)("payment.secure_payment")), 1),
                createVNode("p", { class: "text-center text-[10px] text-gray-300" }, toDisplayString(unref(t)("payment.payment_methods")), 1)
              ])) : (openBlock(), createBlock("div", {
                key: 4,
                class: "min-h-screen flex items-center justify-center p-6"
              }, [
                createVNode("div", { class: "text-center" }, [
                  createVNode("div", { class: "text-5xl mb-4" }, "\u{1F615}"),
                  createVNode("p", { class: "text-gray-500" }, toDisplayString(unref(t)("errors.order_not_found")), 1)
                ])
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pay/[shareCode].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_shareCode_-DKH737oY.mjs.map
