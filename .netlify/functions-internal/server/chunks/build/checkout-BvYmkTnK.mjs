import { _ as __nuxt_component_0 } from './nuxt-link-BVMrTfN6.mjs';
import { defineComponent, computed, ref, reactive, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderComponent } from 'vue/server-renderer';
import { u as useI18n, a as useLocalePath, b as useSupabaseClient, c as useSupabaseUser, n as navigateTo } from './server.mjs';
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
  __name: "checkout",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const localePath = useLocalePath();
    useSupabaseClient();
    const user = useSupabaseUser();
    const steps = computed(() => [
      t("checkout.step_personalize"),
      t("checkout.step_confirm"),
      t("checkout.step_share")
    ]);
    const currentStep = ref(0);
    const creating = ref(false);
    const copied = ref(false);
    const order = ref(null);
    const qrDataUrl = ref("");
    const shareUrl = ref("");
    const cardPrice = ref(2900);
    const platformFee = computed(() => Math.round(cardPrice.value * 0.3));
    const creatorEarning = computed(() => cardPrice.value - platformFee.value);
    const currencySymbol = computed(() => "$");
    const form = reactive({
      message: "",
      recipientName: "",
      address: ""
    });
    function formatPrice(cents) {
      return (cents / 100).toFixed(2);
    }
    if (!user.value) {
      navigateTo(localePath("/auth/login"));
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pb-6" }, _attrs))}><div class="flex items-center justify-center gap-2 px-4 py-4"><!--[-->`);
      ssrRenderList(unref(steps), (step, i) => {
        _push(`<div class="flex items-center gap-2"><div class="${ssrRenderClass([unref(currentStep) >= i ? "bg-[var(--color-primary)] text-white" : "bg-gray-200 text-gray-400", "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"])}">${ssrInterpolate(unref(currentStep) > i ? "\u2713" : i + 1)}</div><span class="${ssrRenderClass([unref(currentStep) >= i ? "text-[var(--color-primary)] font-medium" : "text-gray-400", "text-xs"])}">${ssrInterpolate(step)}</span>`);
        if (i < unref(steps).length - 1) {
          _push(`<div class="w-6 h-px bg-gray-200"></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
      if (unref(currentStep) === 0) {
        _push(`<div class="px-4"><div class="card-container p-5 animate-fade-in"><div class="mb-4"><label class="block text-sm font-semibold text-gray-700 mb-2">${ssrInterpolate(unref(t)("checkout.message_label"))}</label><textarea${ssrRenderAttr("placeholder", unref(t)("checkout.message_placeholder"))} class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-card-shadow)] outline-none transition-all resize-none" rows="4" maxlength="200">${ssrInterpolate(unref(form).message)}</textarea><p class="text-right text-xs text-gray-400 mt-1">${ssrInterpolate(unref(form).message.length)}/200</p></div><div class="mb-4"><label class="block text-sm font-semibold text-gray-700 mb-2">${ssrInterpolate(unref(t)("checkout.recipient_name_label"))}</label><input${ssrRenderAttr("value", unref(form).recipientName)}${ssrRenderAttr("placeholder", unref(t)("card.recipient_name_placeholder"))} class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-card-shadow)] outline-none transition-all" maxlength="30"></div><div class="mb-4"><label class="block text-sm font-semibold text-gray-700 mb-2">${ssrInterpolate(unref(t)("checkout.simulated_address_label"))}</label><input${ssrRenderAttr("value", unref(form).address)}${ssrRenderAttr("placeholder", unref(t)("card.delivery_address_placeholder"))} class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-card-shadow)] outline-none transition-all" maxlength="100"><p class="text-xs text-gray-400 mt-1">\u{1F4A1} ${ssrInterpolate(unref(t)("card.delivery_address_hint"))}</p></div><button class="btn-primary w-full">${ssrInterpolate(unref(t)("common.next"))} \u2192 </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(currentStep) === 1) {
        _push(`<div class="px-4"><div class="card-container p-5 animate-fade-in"><h3 class="font-semibold text-gray-700 mb-4">${ssrInterpolate(unref(t)("card.card_preview"))}</h3><div class="rounded-xl p-5 gradient-love text-white mb-4 text-center"><div class="text-4xl mb-3">\u{1F49D}</div><p class="font-message text-white/90">&quot;${ssrInterpolate(unref(form).message || "...")}&quot;</p><div class="mt-4 pt-4 border-t border-white/20"><p class="text-sm text-white/80">${ssrInterpolate(unref(t)("card.to"))}: ${ssrInterpolate(unref(form).recipientName || "...")}</p></div></div><div class="space-y-3 mb-4"><div class="flex justify-between text-sm"><span class="text-gray-500">${ssrInterpolate(unref(t)("checkout.card_fee"))}</span><span class="font-semibold">${ssrInterpolate(unref(currencySymbol))}${ssrInterpolate(formatPrice(unref(cardPrice)))}</span></div><div class="flex justify-between text-sm"><span class="text-gray-500">${ssrInterpolate(unref(t)("checkout.platform_fee"))} (30%)</span><span class="text-gray-400">${ssrInterpolate(unref(currencySymbol))}${ssrInterpolate(formatPrice(unref(platformFee)))}</span></div><div class="border-t border-gray-100 pt-3 flex justify-between"><span class="font-semibold">${ssrInterpolate(unref(t)("checkout.you_receive"))} (70%)</span><span class="font-bold text-[var(--color-success)] text-lg">${ssrInterpolate(unref(currencySymbol))}${ssrInterpolate(formatPrice(unref(creatorEarning)))}</span></div></div><p class="text-xs text-gray-400 text-center mb-4">${ssrInterpolate(unref(t)("checkout.fee_note"))}</p><div class="flex gap-3"><button class="btn-secondary flex-1"> \u2190 ${ssrInterpolate(unref(t)("common.back"))}</button><button class="btn-primary flex-1"${ssrIncludeBooleanAttr(unref(creating)) ? " disabled" : ""}>${ssrInterpolate(unref(creating) ? unref(t)("common.loading") : unref(t)("checkout.confirm_order"))}</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(currentStep) === 2 && unref(order)) {
        _push(`<div class="px-4"><div class="card-container p-5 text-center animate-slide-up"><div class="text-5xl mb-4">\u{1F389}</div><h3 class="text-lg font-bold mb-2">${ssrInterpolate(unref(t)("share.title"))}</h3><p class="text-gray-500 text-sm mb-6">${ssrInterpolate(unref(t)("share.description"))}</p><div class="bg-gray-50 rounded-lg p-3 mb-4 flex items-center gap-2"><code class="flex-1 text-xs text-gray-600 break-all">${ssrInterpolate(unref(shareUrl))}</code><button class="flex-shrink-0 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium active:scale-95 transition-transform">${ssrInterpolate(unref(copied) ? unref(t)("share.copied") : unref(t)("share.copy_link"))}</button></div>`);
        if (unref(qrDataUrl)) {
          _push(`<div class="mb-4"><img${ssrRenderAttr("src", unref(qrDataUrl))} alt="QR Code" class="w-36 h-36 mx-auto"><p class="text-xs text-gray-400 mt-1">${ssrInterpolate(unref(t)("share.scan_qr"))}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex justify-center gap-3 mb-6"><button class="w-12 h-12 rounded-full bg-green-50 text-green-500 text-xl flex items-center justify-center active:scale-90 transition-transform"> \u{1F4AC} </button><button class="w-12 h-12 rounded-full bg-blue-50 text-blue-500 text-xl flex items-center justify-center active:scale-90 transition-transform"> \u{1F4F1} </button><button class="w-12 h-12 rounded-full bg-gray-100 text-gray-600 text-xl flex items-center justify-center active:scale-90 transition-transform"> \u{1F517} </button></div><p class="text-sm text-yellow-600 bg-yellow-50 rounded-lg p-3"> \u23F3 ${ssrInterpolate(unref(t)("share.waiting_for_payment"))}</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)(`/order/${unref(order).id}`),
          class: "btn-secondary !inline-flex mt-4"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("common.view_all"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("common.view_all")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/checkout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=checkout-BvYmkTnK.mjs.map
