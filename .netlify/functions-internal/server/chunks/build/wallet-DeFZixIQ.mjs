import { _ as __nuxt_component_0 } from './nuxt-link-BVMrTfN6.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { u as useI18n, a as useLocalePath, e as useRuntimeConfig } from './server.mjs';
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
  __name: "wallet",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const localePath = useLocalePath();
    const config = useRuntimeConfig();
    const minWithdrawal = computed(() => config.public.minWithdrawalCents);
    const wallet = ref(null);
    const earnings = ref([]);
    const loading = ref(true);
    const currencySymbol = computed(() => "$");
    function formatPrice(cents) {
      return (cents / 100).toFixed(2);
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pb-6" }, _attrs))}><div class="px-4 pt-4 pb-2"><h1 class="text-xl font-bold">${ssrInterpolate(unref(t)("wallet.title"))}</h1></div><div class="px-4 mb-6"><div class="gradient-love rounded-2xl p-6 text-white text-center"><p class="text-sm text-white/80 mb-1">${ssrInterpolate(unref(t)("wallet.balance"))}</p><p class="text-4xl font-bold mb-4">${ssrInterpolate(unref(currencySymbol))}${ssrInterpolate(formatPrice(((_a = unref(wallet)) == null ? void 0 : _a.balance_cents) || 0))}</p><div class="flex justify-center gap-8"><div><p class="text-xs text-white/60">${ssrInterpolate(unref(t)("wallet.total_earned"))}</p><p class="font-semibold">${ssrInterpolate(unref(currencySymbol))}${ssrInterpolate(formatPrice(((_b = unref(wallet)) == null ? void 0 : _b.total_earned_cents) || 0))}</p></div><div class="border-l border-white/20"></div><div><p class="text-xs text-white/60">${ssrInterpolate(unref(t)("wallet.total_withdrawn"))}</p><p class="font-semibold">${ssrInterpolate(unref(currencySymbol))}${ssrInterpolate(formatPrice(((_c = unref(wallet)) == null ? void 0 : _c.total_withdrawn_cents) || 0))}</p></div></div></div>`);
      if ((((_d = unref(wallet)) == null ? void 0 : _d.balance_cents) || 0) >= unref(minWithdrawal)) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)("/user/withdraw"),
          class: "btn-primary w-full !mt-4 !inline-flex"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` \u{1F4B8} ${ssrInterpolate(unref(t)("wallet.withdraw"))}`);
            } else {
              return [
                createTextVNode(" \u{1F4B8} " + toDisplayString(unref(t)("wallet.withdraw")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<p class="text-center text-xs text-gray-400 mt-3">${ssrInterpolate(unref(t)("wallet.min_withdrawal", { amount: unref(currencySymbol) + formatPrice(unref(minWithdrawal)) }))}</p>`);
      }
      _push(`</div><div class="px-4"><h3 class="font-semibold text-gray-700 mb-3">${ssrInterpolate(unref(t)("wallet.earnings_title"))}</h3>`);
      if (unref(loading)) {
        _push(`<div class="space-y-2"><!--[-->`);
        ssrRenderList(3, (i) => {
          _push(`<div class="h-14 bg-gray-100 rounded-lg animate-shimmer"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(earnings).length === 0) {
        _push(`<div class="text-center py-8"><div class="text-3xl mb-2">\u{1F4B0}</div><p class="text-gray-400 text-sm">${ssrInterpolate(unref(t)("wallet.no_earnings"))}</p></div>`);
      } else {
        _push(`<div class="space-y-2"><!--[-->`);
        ssrRenderList(unref(earnings), (e) => {
          _push(`<div class="card-container p-4 flex items-center justify-between"><div><p class="text-sm font-medium text-gray-700">${ssrInterpolate(unref(t)("wallet.earning_from", { card_name: e.card_name || "Card" }))}</p><p class="text-xs text-gray-400">${ssrInterpolate(unref(t)("wallet.platform_fee", { amount: unref(currencySymbol) + formatPrice(e.platform_fee_cents) }))}</p></div><span class="font-bold text-[var(--color-success)]"> +${ssrInterpolate(unref(currencySymbol))}${ssrInterpolate(formatPrice(e.amount_cents))}</span></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/user/wallet.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=wallet-DeFZixIQ.mjs.map
