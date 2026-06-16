import { _ as __nuxt_component_0 } from './nuxt-link-DXRsjbAZ.mjs';
import { ref, watch, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
import { c as useSupabaseClient } from './server.mjs';
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

const _sfc_main = {
  __name: "orders",
  __ssrInlineRender: true,
  setup(__props) {
    const supabase = useSupabaseClient();
    const list = ref([]);
    const loading = ref(true);
    const currentStatus = ref("all");
    const tabs = [{ value: "all", label: "\u5168\u90E8" }, { value: "pending", label: "\u7B49\u5F85\u4ED8\u6B3E" }, { value: "delivered", label: "\u5DF2\u9001\u8FBE" }];
    function fmt(c) {
      return (c / 100).toFixed(2);
    }
    function statusLabel(s) {
      const m = { pending: "\u7B49\u5F85\u4ED8\u6B3E", paid: "\u5DF2\u4ED8\u6B3E", delivered: "\u5DF2\u9001\u8FBE", expired: "\u5DF2\u8FC7\u671F", cancelled: "\u5DF2\u53D6\u6D88" };
      return m[s] || s;
    }
    function badgeClass(s) {
      const m = { pending: "bg-yellow-100 text-yellow-700", paid: "bg-blue-100 text-blue-700", delivered: "bg-green-100 text-green-700", expired: "bg-gray-100 text-gray-500" };
      return m[s] || "bg-gray-100 text-gray-500";
    }
    async function fetchOrders() {
      loading.value = true;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = (session == null ? void 0 : session.access_token) || "";
        const q = currentStatus.value !== "all" ? "?status=" + currentStatus.value + "&limit=50" : "?limit=50";
        const res = await $fetch("/api/orders" + q, {
          headers: token ? { Authorization: "Bearer " + token } : {}
        });
        list.value = res.orders || [];
      } catch (e) {
        list.value = [];
      }
      loading.value = false;
    }
    watch(currentStatus, () => fetchOrders());
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pb-6" }, _attrs))} data-v-953178fb><div class="px-4 pt-4 pb-2" data-v-953178fb><h1 class="text-xl font-bold" data-v-953178fb>\u6211\u7684\u8BA2\u5355</h1></div><div class="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide" data-v-953178fb><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button class="${ssrRenderClass([unref(currentStatus) === tab.value ? "bg-red-400 text-white border-red-400" : "bg-white text-gray-500 border-gray-200", "flex-shrink-0 px-4 py-1.5 rounded-full text-sm border transition-all"])}" data-v-953178fb>${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></div><div class="px-4" data-v-953178fb>`);
      if (unref(loading)) {
        _push(`<div class="text-center py-12" data-v-953178fb><p class="text-gray-400" data-v-953178fb>\u52A0\u8F7D\u4E2D...</p></div>`);
      } else if (unref(list).length === 0) {
        _push(`<div class="text-center py-12" data-v-953178fb><p class="text-5xl mb-3" data-v-953178fb>\u{1F4CB}</p><p class="text-gray-400 mb-4" data-v-953178fb>\u8FD8\u6CA1\u6709\u8BA2\u5355\uFF0C\u53BB\u6311\u9009\u5361\u7247\u5427\uFF01</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "btn-primary !inline-flex"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u6311\u9009\u5361\u7247`);
            } else {
              return [
                createTextVNode("\u6311\u9009\u5361\u7247")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="space-y-3" data-v-953178fb><!--[-->`);
        ssrRenderList(unref(list), (o) => {
          _push(`<div data-v-953178fb>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/order/" + o.id,
            class: "card-container block p-4 no-underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex items-center justify-between mb-3" data-v-953178fb${_scopeId}><span class="text-xs text-gray-400" data-v-953178fb${_scopeId}>\u8BA2\u5355\u53F7 ${ssrInterpolate(o.order_number)}</span><span class="${ssrRenderClass([badgeClass(o.status), "text-xs px-2 py-0.5 rounded-full"])}" data-v-953178fb${_scopeId}>${ssrInterpolate(statusLabel(o.status))}</span></div><div class="flex items-center gap-3" data-v-953178fb${_scopeId}><div class="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0" style="${ssrRenderStyle({ "background": "linear-gradient(135deg,#fce7f3,#f3e8ff)" })}" data-v-953178fb${_scopeId}>\u{1F49D}</div><div class="flex-1 min-w-0" data-v-953178fb${_scopeId}><p class="font-medium text-gray-700 truncate" data-v-953178fb${_scopeId}>${ssrInterpolate(o.message || "\u65E0\u7559\u8A00")}</p><p class="text-sm text-gray-400" data-v-953178fb${_scopeId}>\u81F4: ${ssrInterpolate(o.recipient_name)}</p></div><span class="font-bold text-red-400 flex-shrink-0" data-v-953178fb${_scopeId}>$${ssrInterpolate(fmt(o.total_cents))}</span></div>`);
              } else {
                return [
                  createVNode("div", { class: "flex items-center justify-between mb-3" }, [
                    createVNode("span", { class: "text-xs text-gray-400" }, "\u8BA2\u5355\u53F7 " + toDisplayString(o.order_number), 1),
                    createVNode("span", {
                      class: ["text-xs px-2 py-0.5 rounded-full", badgeClass(o.status)]
                    }, toDisplayString(statusLabel(o.status)), 3)
                  ]),
                  createVNode("div", { class: "flex items-center gap-3" }, [
                    createVNode("div", {
                      class: "w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0",
                      style: { "background": "linear-gradient(135deg,#fce7f3,#f3e8ff)" }
                    }, "\u{1F49D}"),
                    createVNode("div", { class: "flex-1 min-w-0" }, [
                      createVNode("p", { class: "font-medium text-gray-700 truncate" }, toDisplayString(o.message || "\u65E0\u7559\u8A00"), 1),
                      createVNode("p", { class: "text-sm text-gray-400" }, "\u81F4: " + toDisplayString(o.recipient_name), 1)
                    ]),
                    createVNode("span", { class: "font-bold text-red-400 flex-shrink-0" }, "$" + toDisplayString(fmt(o.total_cents)), 1)
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/user/orders.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const orders = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-953178fb"]]);

export { orders as default };
//# sourceMappingURL=orders-DqS_S7fM.mjs.map
