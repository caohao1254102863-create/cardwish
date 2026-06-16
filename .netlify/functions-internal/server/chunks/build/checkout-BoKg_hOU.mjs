import { _ as __nuxt_component_0 } from './nuxt-link-DXRsjbAZ.mjs';
import { defineComponent, computed, ref, reactive, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderComponent } from 'vue/server-renderer';
import { u as useI18n, a as useLocalePath, b as useRoute, c as useSupabaseClient, d as useSupabaseUser } from './server.mjs';
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
  __name: "checkout",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const localePath = useLocalePath();
    const route = useRoute();
    useSupabaseClient();
    useSupabaseUser();
    const steps = computed(() => [t("checkout.step_personalize"), t("checkout.step_confirm"), t("checkout.step_share")]);
    const currentStep = ref(0);
    const creating = ref(false);
    const copied = ref(false);
    const shareData = ref(null);
    ref(null);
    const cardTemplate = ref(null);
    computed(() => route.query.template_id);
    const platformFee = computed(() => {
      var _a;
      return Math.round((((_a = cardTemplate.value) == null ? void 0 : _a.price_cents) || 0) * 0.3);
    });
    const creatorEarning = computed(() => {
      var _a;
      return (((_a = cardTemplate.value) == null ? void 0 : _a.price_cents) || 0) - platformFee.value;
    });
    const form = reactive({ message: "", recipientName: "", address: "" });
    function formatPrice(c) {
      return (c / 100).toFixed(2);
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
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
        _push(`<div class="px-4 animate-fade-in"><div class="card-container p-5"><div class="mb-4"><label class="block text-sm font-semibold text-gray-700 mb-2">${ssrInterpolate(unref(t)("checkout.message_label"))}</label><textarea${ssrRenderAttr("placeholder", unref(t)("checkout.message_placeholder"))} class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-card-shadow)] outline-none transition-all resize-none" rows="4" maxlength="200">${ssrInterpolate(unref(form).message)}</textarea><p class="text-right text-xs text-gray-400 mt-1">${ssrInterpolate(unref(form).message.length)}/200</p></div><div class="mb-4"><label class="block text-sm font-semibold text-gray-700 mb-2">${ssrInterpolate(unref(t)("checkout.recipient_name_label"))}</label><input${ssrRenderAttr("value", unref(form).recipientName)}${ssrRenderAttr("placeholder", unref(t)("card.recipient_name_placeholder"))} class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-card-shadow)] outline-none transition-all" maxlength="30"></div><div class="mb-4"><label class="block text-sm font-semibold text-gray-700 mb-2">${ssrInterpolate(unref(t)("checkout.simulated_address_label"))}</label><input${ssrRenderAttr("value", unref(form).address)}${ssrRenderAttr("placeholder", unref(t)("card.delivery_address_placeholder"))} class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-card-shadow)] outline-none transition-all" maxlength="100"><p class="text-xs text-gray-400 mt-1">\u{1F4A1} ${ssrInterpolate(unref(t)("card.delivery_address_hint"))}</p></div><button class="btn-primary w-full">${ssrInterpolate(unref(t)("common.next"))} \u2192 </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(currentStep) === 1) {
        _push(`<div class="px-4 animate-fade-in"><div class="card-container p-5"><h3 class="font-semibold text-gray-700 mb-4">${ssrInterpolate(unref(t)("card.card_preview"))}</h3><div class="rounded-xl p-5 gradient-love text-white mb-4 text-center"><div class="text-4xl mb-3">\u{1F49D}</div><p class="font-message text-white/90">&quot;${ssrInterpolate(unref(form).message || "...")}&quot;</p><div class="mt-4 pt-4 border-t border-white/20"><p class="text-sm text-white/80">${ssrInterpolate(unref(t)("card.to"))}: ${ssrInterpolate(unref(form).recipientName || "...")}</p></div></div><div class="space-y-3 mb-4 text-sm"><div class="flex justify-between"><span class="text-gray-500">${ssrInterpolate(unref(t)("checkout.card_fee"))}</span><span class="font-semibold">$${ssrInterpolate(formatPrice(((_a = unref(cardTemplate)) == null ? void 0 : _a.price_cents) || 0))}</span></div><div class="flex justify-between"><span class="text-gray-500">${ssrInterpolate(unref(t)("checkout.platform_fee"))} (30%)</span><span class="text-gray-400">$${ssrInterpolate(formatPrice(unref(platformFee)))}</span></div><div class="border-t border-gray-100 pt-3 flex justify-between"><span class="font-semibold">${ssrInterpolate(unref(t)("checkout.you_receive"))} (70%)</span><span class="font-bold text-[var(--color-success)] text-lg">$${ssrInterpolate(formatPrice(unref(creatorEarning)))}</span></div></div><div class="flex gap-3"><button class="btn-secondary flex-1">\u2190 ${ssrInterpolate(unref(t)("common.back"))}</button><button class="btn-primary flex-1"${ssrIncludeBooleanAttr(unref(creating)) ? " disabled" : ""}>${ssrInterpolate(unref(creating) ? unref(t)("common.loading") : unref(t)("checkout.confirm_order"))}</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(currentStep) === 2 && unref(shareData)) {
        _push(`<div class="px-4 animate-slide-up"><div class="card-container p-5 text-center"><div class="text-5xl mb-4">\u{1F389}</div><h3 class="text-lg font-bold mb-2">${ssrInterpolate(unref(t)("share.title"))}</h3><p class="text-gray-500 text-sm mb-6">${ssrInterpolate(unref(t)("share.description"))}</p><div class="bg-gray-50 rounded-lg p-3 mb-4 flex items-center gap-2"><code class="flex-1 text-xs text-gray-600 break-all text-left">${ssrInterpolate(unref(shareData).share_url)}</code><button class="flex-shrink-0 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium active:scale-95">${ssrInterpolate(unref(copied) ? unref(t)("share.copied") : unref(t)("share.copy_link"))}</button></div><div class="mb-4"><canvas class="w-36 h-36 mx-auto"></canvas></div><p class="text-sm text-yellow-600 bg-yellow-50 rounded-lg p-3 mb-4"> \u23F3 ${ssrInterpolate(unref(t)("share.waiting_for_payment"))}</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)(`/order/${(_b = unref(shareData).order) == null ? void 0 : _b.id}`),
          class: "btn-secondary !inline-flex"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` \u{1F4CB} ${ssrInterpolate(unref(t)("orders.title"))}`);
            } else {
              return [
                createTextVNode(" \u{1F4CB} " + toDisplayString(unref(t)("orders.title")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)("/"),
          class: "btn-primary !inline-flex mt-3 w-full"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` \u{1F3A8} ${ssrInterpolate(unref(t)("home.title"))}`);
            } else {
              return [
                createTextVNode(" \u{1F3A8} " + toDisplayString(unref(t)("home.title")), 1)
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
//# sourceMappingURL=checkout-BoKg_hOU.mjs.map
