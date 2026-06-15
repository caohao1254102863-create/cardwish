import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { u as useI18n } from './server.mjs';
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
  __name: "terms",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "px-4 py-6 max-w-lg mx-auto" }, _attrs))}><h1 class="text-2xl font-bold mb-4">${ssrInterpolate(unref(t)("footer.terms"))}</h1><div class="prose prose-sm text-gray-600 space-y-4"><p>Last updated: June 2026</p><h3>1. Service Description</h3><p>CardWish is a digital greeting card platform that allows users to create and share virtual greeting cards. Friends can pay to send these digital cards.</p><h3>2. Platform Fees</h3><p>Platform charges a 30% service fee on each transaction. The card recipient receives 70% of the payment amount.</p><h3>3. Digital Products</h3><p>All cards are digital products. No physical goods are delivered.</p><h3>4. Payments</h3><p>Payments are processed securely through Stripe. By making a payment, you agree to Stripe&#39;s terms of service.</p><h3>5. Refunds</h3><p>Due to the digital nature of our products, all sales are final. Refunds are issued only in cases of technical errors.</p></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/legal/terms.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=terms-D757bQpf.mjs.map
