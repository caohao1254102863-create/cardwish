import { _ as __nuxt_component_0 } from './nuxt-link-BVMrTfN6.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { u as useI18n, a as useLocalePath, d as useRoute$1, e as useRuntimeConfig } from './server.mjs';
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
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const localePath = useLocalePath();
    useRoute$1();
    const config = useRuntimeConfig();
    const order = ref(null);
    const loading = ref(true);
    const copied = ref(false);
    const shareUrl = computed(() => {
      var _a;
      if (!((_a = order.value) == null ? void 0 : _a.share_code)) return "";
      return `${config.public.siteUrl}/pay/${order.value.share_code}`;
    });
    const creatorEarning = computed(() => {
      var _a;
      if (!((_a = order.value) == null ? void 0 : _a.total_cents)) return 0;
      return Math.round(order.value.total_cents * 0.7);
    });
    const expiresIn = computed(() => {
      var _a;
      if (!((_a = order.value) == null ? void 0 : _a.expires_at)) return "...";
      const diff = new Date(order.value.expires_at).getTime() - Date.now();
      if (diff <= 0) return "0h";
      const hours = Math.floor(diff / 36e5);
      const mins = Math.floor(diff % 36e5 / 6e4);
      return `${hours}h ${mins}m`;
    });
    const statusText = computed(() => {
      var _a, _b;
      const statusMap = {
        pending: t("orders.status_pending"),
        paid: t("orders.status_paid"),
        delivered: t("orders.status_delivered"),
        expired: t("orders.status_expired"),
        cancelled: t("orders.status_cancelled")
      };
      return statusMap[(_a = order.value) == null ? void 0 : _a.status] || ((_b = order.value) == null ? void 0 : _b.status);
    });
    const statusEmoji = computed(() => {
      var _a;
      const map = { pending: "\u23F3", paid: "\u2705", delivered: "\u{1F48C}", expired: "\u231B", cancelled: "\u274C" };
      return map[(_a = order.value) == null ? void 0 : _a.status] || "\u{1F4CB}";
    });
    const statusBannerClass = computed(() => {
      var _a;
      const map = {
        pending: "bg-gradient-to-r from-yellow-400 to-orange-400",
        paid: "bg-gradient-to-r from-blue-400 to-cyan-400",
        delivered: "bg-gradient-to-r from-green-400 to-emerald-400",
        expired: "bg-gradient-to-r from-gray-400 to-gray-500",
        cancelled: "bg-gradient-to-r from-gray-400 to-gray-500"
      };
      return map[(_a = order.value) == null ? void 0 : _a.status] || "bg-gray-400";
    });
    function formatPrice(cents) {
      return (cents / 100).toFixed(2);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pb-6" }, _attrs))}>`);
      if (unref(loading)) {
        _push(`<div class="p-4 space-y-4"><div class="h-6 bg-gray-100 rounded w-2/3 animate-shimmer"></div><div class="h-40 bg-gray-100 rounded-xl animate-shimmer"></div><div class="h-10 bg-gray-100 rounded animate-shimmer"></div></div>`);
      } else if (!unref(order)) {
        _push(`<div class="p-8 text-center"><div class="text-4xl mb-3">\u{1F50D}</div><p class="text-gray-500">${ssrInterpolate(unref(t)("errors.order_not_found"))}</p></div>`);
      } else {
        _push(`<!--[--><div class="${ssrRenderClass([unref(statusBannerClass), "px-4 py-5 text-white text-center"])}"><div class="text-3xl mb-2">${ssrInterpolate(unref(statusEmoji))}</div><h2 class="text-lg font-bold">${ssrInterpolate(unref(statusText))}</h2><p class="text-sm opacity-80 mt-1">${ssrInterpolate(unref(t)("orders.order_number", { number: unref(order).order_number }))}</p></div><div class="px-4 -mt-4"><div class="card-container p-5"><div class="rounded-xl p-5 gradient-love text-white text-center"><div class="text-4xl mb-3">\u{1F49D}</div><p class="font-message text-white/90">&quot;${ssrInterpolate(unref(order).message || "...")}&quot;</p><div class="mt-4 pt-4 border-t border-white/20"><p class="text-sm text-white/80">${ssrInterpolate(unref(t)("card.to"))}: ${ssrInterpolate(unref(order).recipient_name)}</p></div></div><div class="mt-4 space-y-2 text-sm"><div class="flex justify-between"><span class="text-gray-500">${ssrInterpolate(unref(t)("checkout.card_fee"))}</span><span class="font-semibold">$${ssrInterpolate(formatPrice(unref(order).total_cents))}</span></div><div class="flex justify-between"><span class="text-gray-500">${ssrInterpolate(unref(t)("checkout.you_receive"))}</span><span class="font-bold text-[var(--color-success)]"> $${ssrInterpolate(formatPrice(unref(creatorEarning)))}</span></div></div></div></div>`);
        if (unref(order).status === "pending") {
          _push(`<div class="px-4 mt-4"><div class="card-container p-5"><h3 class="font-semibold mb-3">${ssrInterpolate(unref(t)("share.title"))}</h3><div class="bg-gray-50 rounded-lg p-3 mb-3 flex items-center gap-2"><code class="flex-1 text-xs text-gray-600 break-all">${ssrInterpolate(unref(shareUrl))}</code><button class="flex-shrink-0 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium active:scale-95">${ssrInterpolate(unref(copied) ? unref(t)("share.copied") : unref(t)("share.copy_link"))}</button></div><p class="text-xs text-gray-400">${ssrInterpolate(unref(t)("share.share_hint"))}</p><p class="text-xs text-yellow-600 mt-2"> \u23F0 ${ssrInterpolate(unref(t)("orders.expires_in", { time: unref(expiresIn) }))}</p></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(order).status === "delivered") {
          _push(`<div class="px-4 mt-4">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: unref(localePath)("/user/received"),
            class: "btn-primary w-full !inline-flex"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` \u{1F48C} ${ssrInterpolate(unref(t)("received.view_card"))}`);
              } else {
                return [
                  createTextVNode(" \u{1F48C} " + toDisplayString(unref(t)("received.view_card")), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/order/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-Dnab-Pon.mjs.map
