import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate } from 'vue/server-renderer';
import { c as useSupabaseClient } from './server.mjs';
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
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useSupabaseClient();
    const phone = ref("");
    const sentCode = ref("");
    const inputCode = ref("");
    const codeSent = ref(false);
    const loading = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[#fef6f7] flex items-center justify-center p-6" }, _attrs))}><div class="w-full max-w-sm"><div class="text-center mb-6"><p class="text-4xl mb-1">\u{1F49D}</p><h1 class="text-2xl font-bold text-gradient">CardWish</h1></div><div class="bg-white rounded-xl p-6 shadow-sm"><div class="flex items-center bg-gray-50 rounded-lg border border-gray-200 focus-within:border-red-300 transition-all mb-5"><span class="pl-4 text-gray-500 text-sm">+86</span><input${ssrRenderAttr("value", unref(phone))} type="tel" placeholder="\u8BF7\u8F93\u5165\u624B\u673A\u53F7" class="flex-1 px-3 py-3 bg-transparent outline-none text-sm" maxlength="11"></div>`);
      if (!unref(codeSent)) {
        _push(`<button type="button" class="w-full py-3 rounded-full bg-gradient-to-r from-red-400 to-pink-400 text-white font-semibold active:scale-95 transition-all"${ssrIncludeBooleanAttr(unref(phone).length !== 11) ? " disabled" : ""}> \u83B7\u53D6\u9A8C\u8BC1\u7801 </button>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(codeSent)) {
        _push(`<div class="space-y-4 animate-fade-in"><div class="p-3 bg-green-50 rounded-lg border border-green-200 text-center"><p class="text-xs text-green-600 mb-1">\u{1F511} \u70B9\u51FB\u9A8C\u8BC1\u7801\u81EA\u52A8\u586B\u5165</p><p class="text-2xl font-bold text-green-700 tracking-[0.3em] cursor-pointer select-all">${ssrInterpolate(unref(sentCode))}</p></div><input${ssrRenderAttr("value", unref(inputCode))} type="text" inputmode="numeric" placeholder="\u8F93\u51656\u4F4D\u9A8C\u8BC1\u7801" class="w-full px-4 py-3 rounded-lg border border-gray-200 text-center text-lg tracking-[0.3em] font-bold outline-none" maxlength="6"><button type="button" class="w-full py-3 rounded-full bg-gradient-to-r from-red-400 to-pink-400 text-white font-semibold active:scale-95 transition-all disabled:opacity-50"${ssrIncludeBooleanAttr(unref(loading) || unref(inputCode).length !== 6) ? " disabled" : ""}>${ssrInterpolate(unref(loading) ? "\u767B\u5F55\u4E2D..." : "\u9A8C\u8BC1\u5E76\u767B\u5F55")}</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-CprbZacG.mjs.map
