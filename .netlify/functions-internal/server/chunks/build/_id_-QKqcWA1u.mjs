import { _ as __nuxt_component_0 } from './nuxt-link-BVMrTfN6.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { u as useI18n, a as useLocalePath, d as useRoute$1 } from './server.mjs';
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
    const card = ref(null);
    const loading = ref(true);
    const cardGradient = computed(() => {
      var _a;
      const map = { love: "gradient-love", birthday: "gradient-birthday", flowers: "gradient-floral", coffee: "gradient-coffee" };
      return map[((_a = card.value) == null ? void 0 : _a.category_slug) || ""] || "gradient-love";
    });
    function formatDate(date) {
      return new Date(date).toLocaleDateString();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pb-6" }, _attrs))}><div class="px-4 pt-4 pb-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/user/received"),
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
      _push(`</div>`);
      if (unref(loading)) {
        _push(`<div class="p-4 space-y-4"><div class="aspect-[3/4] bg-gray-100 rounded-xl animate-shimmer"></div></div>`);
      } else if (unref(card)) {
        _push(`<div class="px-4 animate-fade-in"><div class="card-container overflow-hidden"><div class="${ssrRenderClass([unref(cardGradient), "p-8 text-white text-center"])}"><div class="text-6xl mb-6">\u{1F49D}</div><div class="bg-white/10 rounded-2xl p-6 backdrop-blur-sm"><p class="font-message text-white text-xl leading-relaxed"> &quot;${ssrInterpolate(unref(card).message || "...")}&quot; </p><div class="mt-6 pt-6 border-t border-white/20"><p class="text-sm text-white/80">${ssrInterpolate(unref(t)("card.to"))}: ${ssrInterpolate(unref(card).recipient_name)}</p><p class="text-sm text-white/60 mt-1">${ssrInterpolate(unref(t)("received.paid_by", { payer: unref(card).payer_nickname || "A friend" }))}</p></div></div></div><div class="p-5 space-y-3 text-center"><p class="text-sm text-gray-400">${ssrInterpolate(unref(t)("received.card_from", { payer: unref(card).payer_nickname || "A friend" }))}</p>`);
        if (unref(card).payer_message) {
          _push(`<p class="font-message text-[var(--color-primary)] text-lg"> &quot;${ssrInterpolate(unref(card).payer_message)}&quot; </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<p class="text-xs text-gray-300">${ssrInterpolate(formatDate(unref(card).created_at))}</p></div></div><button class="btn-secondary w-full mt-4"> \u{1F4BE} ${ssrInterpolate(unref(t)("received.download"))}</button></div>`);
      } else {
        _push(`<div class="p-8 text-center"><p class="text-gray-400">${ssrInterpolate(unref(t)("errors.not_found"))}</p></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/user/received/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-QKqcWA1u.mjs.map
