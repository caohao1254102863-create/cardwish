import { _ as __nuxt_component_0 } from './nuxt-link-BVMrTfN6.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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
  __name: "withdraw",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const localePath = useLocalePath();
    const config = useRuntimeConfig();
    const balance = ref(0);
    const amount = ref(null);
    const selectedMethod = ref("wechat");
    const accountInfo = ref("");
    const submitting = ref(false);
    const minWithdrawal = computed(() => config.public.minWithdrawalCents);
    const amountCents = computed(() => Math.round((amount.value || 0) * 100));
    const currencySymbol = computed(() => "$");
    const methods = [
      { value: "wechat", label: t("wallet.method_wechat") },
      { value: "alipay", label: t("wallet.method_alipay") },
      { value: "bank", label: t("wallet.method_bank") }
    ];
    const canWithdraw = computed(() => {
      return amountCents.value >= minWithdrawal.value && amountCents.value <= balance.value && accountInfo.value.trim().length > 0;
    });
    function formatPrice(cents) {
      return (cents / 100).toFixed(2);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pb-6" }, _attrs))}><div class="px-4 pt-4 pb-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/user/wallet"),
        class: "text-[var(--color-primary)] text-sm no-underline"
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
      _push(`<h1 class="text-xl font-bold mt-2">${ssrInterpolate(unref(t)("wallet.withdraw"))}</h1></div><div class="px-4"><div class="card-container p-5"><div class="text-center mb-6"><p class="text-sm text-gray-500">${ssrInterpolate(unref(t)("wallet.balance"))}</p><p class="text-3xl font-bold text-[var(--color-primary)]">${ssrInterpolate(unref(currencySymbol))}${ssrInterpolate(formatPrice(unref(balance)))}</p></div><div class="mb-4"><label class="block text-sm font-semibold text-gray-700 mb-2">${ssrInterpolate(unref(t)("wallet.withdraw_amount"))}</label><input${ssrRenderAttr("value", unref(amount))} type="number"${ssrRenderAttr("min", formatPrice(unref(minWithdrawal)))}${ssrRenderAttr("max", formatPrice(unref(balance)))} step="0.01" class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-card-shadow)] outline-none text-lg font-bold" placeholder="0.00"><p class="text-xs text-gray-400 mt-1">${ssrInterpolate(unref(t)("wallet.min_withdrawal", { amount: unref(currencySymbol) + formatPrice(unref(minWithdrawal)) }))}</p></div><div class="mb-4"><label class="block text-sm font-semibold text-gray-700 mb-2">${ssrInterpolate(unref(t)("wallet.withdraw_method"))}</label><div class="grid grid-cols-3 gap-2"><!--[-->`);
      ssrRenderList(methods, (method) => {
        _push(`<button class="${ssrRenderClass([unref(selectedMethod) === method.value ? "border-[var(--color-primary)] bg-pink-50 text-[var(--color-primary)] font-semibold" : "border-gray-200 text-gray-500", "py-3 rounded-lg border text-center text-sm transition-all"])}">${ssrInterpolate(method.label)}</button>`);
      });
      _push(`<!--]--></div></div><div class="mb-6"><label class="block text-sm font-semibold text-gray-700 mb-2">${ssrInterpolate(unref(t)("wallet.account_info"))}</label><input${ssrRenderAttr("value", unref(accountInfo))} class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-card-shadow)] outline-none"${ssrRenderAttr("placeholder", unref(t)("wallet.account_info_hint"))}></div><button class="btn-primary w-full"${ssrIncludeBooleanAttr(!unref(canWithdraw) || unref(submitting)) ? " disabled" : ""}>${ssrInterpolate(unref(submitting) ? unref(t)("common.loading") : unref(t)("wallet.withdraw") + " " + unref(currencySymbol) + formatPrice(unref(amountCents)))}</button></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/user/withdraw.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=withdraw-BhPO6IVX.mjs.map
