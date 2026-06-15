import { _ as __nuxt_component_0 } from './nuxt-link-BVMrTfN6.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { u as useI18n, a as useLocalePath } from './server.mjs';
import { u as useFetch } from './fetch-COjRzY71.mjs';
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
  __name: "orders",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const localePath = useLocalePath();
    const orders = ref([]);
    const loading = ref(true);
    const currentStatus = ref("all");
    const statusTabs = computed(() => [
      { value: "all", label: "All" },
      { value: "pending", label: t("orders.status_pending") },
      { value: "paid", label: t("orders.status_paid") },
      { value: "delivered", label: t("orders.status_delivered") }
    ]);
    function getStatusText(status) {
      const map = {
        pending: t("orders.status_pending"),
        paid: t("orders.status_paid"),
        delivered: t("orders.status_delivered"),
        expired: t("orders.status_expired"),
        cancelled: t("orders.status_cancelled")
      };
      return map[status] || status;
    }
    function getStatusBadgeClass(status) {
      const map = {
        pending: "badge-pending",
        paid: "badge-paid",
        delivered: "badge-delivered",
        expired: "badge-expired"
      };
      return map[status] || "badge-expired";
    }
    function formatPrice(cents) {
      return (cents / 100).toFixed(2);
    }
    function formatDate(date) {
      return new Date(date).toLocaleDateString();
    }
    async function fetchOrders() {
      loading.value = true;
      try {
        const query = { page: 1, limit: 50 };
        if (currentStatus.value !== "all") query.status = currentStatus.value;
        const { data } = await useFetch(
          "/api/orders",
          { query },
          "$4Amiw9MoEc"
          /* nuxt-injected */
        );
        if (data.value) {
          orders.value = data.value.orders || [];
        }
      } catch (e) {
      }
      loading.value = false;
    }
    watch(currentStatus, fetchOrders);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pb-6" }, _attrs))}><div class="px-4 pt-4 pb-2"><h1 class="text-xl font-bold">${ssrInterpolate(unref(t)("orders.title"))}</h1></div><div class="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide"><!--[-->`);
      ssrRenderList(unref(statusTabs), (tab) => {
        _push(`<button class="${ssrRenderClass([unref(currentStatus) === tab.value ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "bg-white text-gray-500 border-gray-200", "flex-shrink-0 px-4 py-1.5 rounded-full text-sm border transition-all"])}">${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></div><div class="px-4 space-y-3">`);
      if (unref(loading)) {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(3, (i) => {
          _push(`<div class="card-container p-4 animate-shimmer"><div class="h-4 bg-gray-100 rounded w-2/3 mb-3"></div><div class="h-16 bg-gray-100 rounded-lg mb-3"></div><div class="h-4 bg-gray-100 rounded w-1/2"></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(orders).length === 0) {
        _push(`<div class="text-center py-12"><div class="text-5xl mb-3">\u{1F4CB}</div><p class="text-gray-400">${ssrInterpolate(unref(t)("orders.no_orders"))}</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)("/"),
          class: "btn-primary !inline-flex mt-4"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("home.title"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("home.title")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(orders), (order) => {
        _push(`<div class="card-container overflow-hidden">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)(`/order/${order.id}`),
          class: "no-underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="p-4"${_scopeId}><div class="flex items-center justify-between mb-3"${_scopeId}><span class="text-xs text-gray-400"${_scopeId}>${ssrInterpolate(unref(t)("orders.order_number", { number: order.order_number }))}</span><span class="${ssrRenderClass([getStatusBadgeClass(order.status), "badge"])}"${_scopeId}>${ssrInterpolate(getStatusText(order.status))}</span></div><div class="flex items-center gap-3"${_scopeId}><div class="w-12 h-12 rounded-lg gradient-love flex items-center justify-center text-2xl flex-shrink-0"${_scopeId}> \u{1F49D} </div><div class="flex-1 min-w-0"${_scopeId}><p class="font-medium text-gray-700 truncate"${_scopeId}>${ssrInterpolate(order.message || "...")}</p><p class="text-sm text-gray-400"${_scopeId}>${ssrInterpolate(unref(t)("card.to"))}: ${ssrInterpolate(order.recipient_name)}</p></div><div class="price-tag flex-shrink-0"${_scopeId}> $${ssrInterpolate(formatPrice(order.total_cents))}</div></div><p class="text-xs text-gray-400 mt-2"${_scopeId}>${ssrInterpolate(unref(t)("orders.created_at", { date: formatDate(order.created_at) }))}</p></div>`);
            } else {
              return [
                createVNode("div", { class: "p-4" }, [
                  createVNode("div", { class: "flex items-center justify-between mb-3" }, [
                    createVNode("span", { class: "text-xs text-gray-400" }, toDisplayString(unref(t)("orders.order_number", { number: order.order_number })), 1),
                    createVNode("span", {
                      class: ["badge", getStatusBadgeClass(order.status)]
                    }, toDisplayString(getStatusText(order.status)), 3)
                  ]),
                  createVNode("div", { class: "flex items-center gap-3" }, [
                    createVNode("div", { class: "w-12 h-12 rounded-lg gradient-love flex items-center justify-center text-2xl flex-shrink-0" }, " \u{1F49D} "),
                    createVNode("div", { class: "flex-1 min-w-0" }, [
                      createVNode("p", { class: "font-medium text-gray-700 truncate" }, toDisplayString(order.message || "..."), 1),
                      createVNode("p", { class: "text-sm text-gray-400" }, toDisplayString(unref(t)("card.to")) + ": " + toDisplayString(order.recipient_name), 1)
                    ]),
                    createVNode("div", { class: "price-tag flex-shrink-0" }, " $" + toDisplayString(formatPrice(order.total_cents)), 1)
                  ]),
                  createVNode("p", { class: "text-xs text-gray-400 mt-2" }, toDisplayString(unref(t)("orders.created_at", { date: formatDate(order.created_at) })), 1)
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/user/orders.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=orders-D-qqz9Dj.mjs.map
