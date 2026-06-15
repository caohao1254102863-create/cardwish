import { u as useI18n, a as useLocalePath, b as useSupabaseClient, _ as __nuxt_component_0 } from './server.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-BVMrTfN6.mjs';
import { defineComponent, ref, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createVNode, withModifiers, withDirectives, isRef, vModelText, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const localePath = useLocalePath();
    const supabase = useSupabaseClient();
    const email = ref("");
    const password = ref("");
    const loading = ref(false);
    async function handleRegister() {
      loading.value = true;
      try {
        const { error } = await supabase.auth.signUp({
          email: email.value,
          password: password.value
        });
        if (error) throw error;
        alert("Check your email to confirm your account!");
      } catch (e) {
        alert(e.message);
      }
      loading.value = false;
    }
    async function handleGoogleLogin() {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: `${(void 0).location.origin}/auth/callback` }
        });
        if (error) throw error;
      } catch (e) {
        alert(e.message);
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "auth" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card-container p-6 animate-fade-in"${_scopeId}><h2 class="text-xl font-bold text-center mb-6"${_scopeId}>${ssrInterpolate(unref(t)("auth.register"))}</h2><form class="space-y-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-600 mb-1"${_scopeId}>${ssrInterpolate(unref(t)("auth.email"))}</label><input${ssrRenderAttr("value", unref(email))} type="email"${ssrRenderAttr("placeholder", unref(t)("auth.email_placeholder"))} class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-card-shadow)] outline-none transition-all" required${_scopeId}></div><div${_scopeId}><label class="block text-sm font-medium text-gray-600 mb-1"${_scopeId}>${ssrInterpolate(unref(t)("auth.password"))}</label><input${ssrRenderAttr("value", unref(password))} type="password"${ssrRenderAttr("placeholder", unref(t)("auth.password_placeholder"))} class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-card-shadow)] outline-none transition-all" required minlength="6"${_scopeId}></div><button type="submit" class="btn-primary w-full"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(unref(loading) ? unref(t)("common.loading") : unref(t)("auth.register_button"))}</button></form><div class="flex items-center gap-3 my-5"${_scopeId}><div class="flex-1 h-px bg-gray-200"${_scopeId}></div><span class="text-xs text-gray-400"${_scopeId}>${ssrInterpolate(unref(t)("auth.or_continue_with"))}</span><div class="flex-1 h-px bg-gray-200"${_scopeId}></div></div><button class="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full border-2 border-gray-200 text-gray-700 font-medium active:scale-95 transition-all"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}${_scopeId}> G ${ssrInterpolate(unref(t)("auth.google"))}</button><p class="text-center text-sm text-gray-400 mt-6"${_scopeId}>${ssrInterpolate(unref(t)("auth.have_account"))} `);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: unref(localePath)("/auth/login"),
              class: "text-[var(--color-primary)] font-medium no-underline"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t)("auth.login"))} \u2192 `);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("auth.login")) + " \u2192 ", 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</p></div>`);
          } else {
            return [
              createVNode("div", { class: "card-container p-6 animate-fade-in" }, [
                createVNode("h2", { class: "text-xl font-bold text-center mb-6" }, toDisplayString(unref(t)("auth.register")), 1),
                createVNode("form", {
                  onSubmit: withModifiers(handleRegister, ["prevent"]),
                  class: "space-y-4"
                }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-600 mb-1" }, toDisplayString(unref(t)("auth.email")), 1),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => isRef(email) ? email.value = $event : null,
                      type: "email",
                      placeholder: unref(t)("auth.email_placeholder"),
                      class: "w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-card-shadow)] outline-none transition-all",
                      required: ""
                    }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                      [vModelText, unref(email)]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-600 mb-1" }, toDisplayString(unref(t)("auth.password")), 1),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => isRef(password) ? password.value = $event : null,
                      type: "password",
                      placeholder: unref(t)("auth.password_placeholder"),
                      class: "w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-card-shadow)] outline-none transition-all",
                      required: "",
                      minlength: "6"
                    }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                      [vModelText, unref(password)]
                    ])
                  ]),
                  createVNode("button", {
                    type: "submit",
                    class: "btn-primary w-full",
                    disabled: unref(loading)
                  }, toDisplayString(unref(loading) ? unref(t)("common.loading") : unref(t)("auth.register_button")), 9, ["disabled"])
                ], 32),
                createVNode("div", { class: "flex items-center gap-3 my-5" }, [
                  createVNode("div", { class: "flex-1 h-px bg-gray-200" }),
                  createVNode("span", { class: "text-xs text-gray-400" }, toDisplayString(unref(t)("auth.or_continue_with")), 1),
                  createVNode("div", { class: "flex-1 h-px bg-gray-200" })
                ]),
                createVNode("button", {
                  onClick: handleGoogleLogin,
                  class: "flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full border-2 border-gray-200 text-gray-700 font-medium active:scale-95 transition-all",
                  disabled: unref(loading)
                }, " G " + toDisplayString(unref(t)("auth.google")), 9, ["disabled"]),
                createVNode("p", { class: "text-center text-sm text-gray-400 mt-6" }, [
                  createTextVNode(toDisplayString(unref(t)("auth.have_account")) + " ", 1),
                  createVNode(_component_NuxtLink, {
                    to: unref(localePath)("/auth/login"),
                    class: "text-[var(--color-primary)] font-medium no-underline"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(t)("auth.login")) + " \u2192 ", 1)
                    ]),
                    _: 1
                  }, 8, ["to"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=register-BU95loGD.mjs.map
