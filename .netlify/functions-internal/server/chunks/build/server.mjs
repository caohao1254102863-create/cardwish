import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { defineComponent, inject, computed, unref, shallowRef, hasInjectionContext, getCurrentInstance, defineAsyncComponent, toRef, isRef, createElementBlock, provide, cloneVNode, h, ref, reactive, createVNode, watchEffect, mergeProps, Transition, Teleport, watch, nextTick, Fragment, withDirectives, vShow, Comment, withKeys, Suspense, shallowReactive, useSSRContext, createApp, Text, resolveDirective, createTextVNode, withCtx, onErrorCaptured, onServerPrefetch, resolveDynamicComponent, effectScope, getCurrentScope, isReadonly, isShallow, isReactive, toRaw, markRaw } from 'vue';
import { h as createError$1, n as defu, o as sanitizeStatusCode, p as getContext, $ as $fetch, q as createHooks, t as getRequestProtocol, v as getRequestHeaders, w as executeAsync, b as getHeader, x as setCookie, y as klona, z as getRequestHeader, A as destr, B as isEqual$1, C as getCookie, D as deleteCookie } from '../nitro/nitro.mjs';
import { b as baseURL } from '../routes/renderer.mjs';
import { useRoute as useRoute$2, RouterView, isNavigationFailure, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import { useWindowSize, useChildren, useParent, useEventListener, useScrollParent, useRect, usePageVisibility, onMountedOrActivated, doubleRaf, CUSTOM_FIELD_INJECTION_KEY, cancelRaf, raf, useCustomFieldValue, getScrollParent } from '@vant/use';
import { normalizeClass, stringifyStyle, normalizeStyle } from '@vue/shared';
import { ssrRenderComponent, ssrRenderSuspense, ssrRenderVNode } from 'vue/server-renderer';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const NullObject = /* @__PURE__ */ (() => {
  const C = function() {
  };
  C.prototype = /* @__PURE__ */ Object.create(null);
  return C;
})();
function parse$1(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = new NullObject();
  const opt = options || {};
  const dec = opt.decode || decode$1;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode$1(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const appLayoutTransition = false;
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "value": null, "errorValue": null, "deep": true };
const fetchDefaults = {};
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.21.8";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name2, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name2, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name2, value) => {
    const $name = "$" + name2;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    const unresolvedPluginsForThisPlugin = plugin2.dependsOn?.filter((name2) => plugins2.some((p) => p._name === name2) && !resolvedPlugins.has(name2)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin2.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin2.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
const ENC_ENC_SLASH_RE = /%252f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return encode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F").replace(ENC_ENC_SLASH_RE, "%2F").replace(AMPERSAND_RE, "%26").replace(PLUS_RE, "%2B");
}
function decode(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}
const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const PROTOCOL_SCRIPT_RE = /^[\s\0]*(blob|data|javascript|vbscript):$/i;
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function isScriptProtocol(protocol) {
  return !!protocol && PROTOCOL_SCRIPT_RE.test(protocol);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
  }
  const [s0, ...s] = path.split("?");
  const cleanPath = s0.endsWith("/") ? s0.slice(0, -1) : s0;
  return (cleanPath || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
    if (!path) {
      return fragment;
    }
  }
  const [s0, ...s] = path.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
function isEqual(a, b, options = {}) {
  if (!options.trailingSlash) {
    a = withTrailingSlash(a);
    b = withTrailingSlash(b);
  }
  if (!options.leadingSlash) {
    a = withLeadingSlash(a);
    b = withLeadingSlash(b);
  }
  if (!options.encoding) {
    a = decode(a);
    b = decode(b);
  }
  return a === b;
}
const protocolRelative = /* @__PURE__ */ Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}
const LayoutMetaSymbol = /* @__PURE__ */ Symbol("layout-meta");
const PageRouteSymbol = /* @__PURE__ */ Symbol("route");
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute$1 = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const addRouteMiddleware = (name2, middleware, options = {}) => {
  const nuxtApp = useNuxtApp();
  const global2 = options.global || typeof name2 !== "string";
  const mw = middleware;
  if (!mw) {
    console.warn("[nuxt] No route middleware passed to `addRouteMiddleware`.", name2);
    return;
  }
  if (global2) {
    nuxtApp._middleware.global.push(mw);
  } else {
    nuxtApp._middleware.named[name2] = mw;
  }
};
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const HTML_ATTR_UNSAFE_RE = /[&"'<>]/g;
const HTML_ATTR_ENCODE_MAP = {
  "&": "%26",
  '"': "%22",
  "'": "%27",
  "<": "%3C",
  ">": "%3E"
};
function encodeForHtmlAttr(value) {
  return value.replace(HTML_ATTR_UNSAFE_RE, (c) => HTML_ATTR_ENCODE_MAP[c]);
}
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject$1(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedHeader = encodeURL(location2, isExternalHost);
        const encodedLoc = encodeForHtmlAttr(encodedHeader);
        nuxtApp.ssrContext["~renderResponse"] = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  const encodedTo = typeof to === "string" ? encodeRoutePath(to) : to;
  return options?.replace ? router.replace(encodedTo) : router.push(encodedTo);
};
function resolveRouteObject$1(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    const pathname = url.pathname.replace(/^\/{2,}/, "/");
    return pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
function encodeRoutePath(url) {
  const parsed = parseURL(url);
  return encodePath(decodePath(parsed.pathname)) + parsed.search + parsed.hash;
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const error2 = /* @__PURE__ */ useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  if (typeof error !== "string" && error.statusText) {
    error.message ??= error.statusText;
  }
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  Object.defineProperty(nuxtError, "status", {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    get: () => nuxtError.statusCode,
    configurable: true
  });
  Object.defineProperty(nuxtError, "statusText", {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    get: () => nuxtError.statusMessage,
    configurable: true
  });
  return nuxtError;
};
function freezeHead(head) {
  const realPush = head.push;
  head.push = () => ({ dispose: () => {
  }, patch: () => {
  }, _poll: () => {
  } });
  return () => {
    head.push = realPush;
  };
}
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    if (nuxtApp.ssrContext.islandContext) {
      const unfreeze = freezeHead(head);
      nuxtApp.hooks.hookOnce("app:created", unfreeze);
    }
    nuxtApp.vueApp.use(head);
  }
});
function toArray$3(value) {
  return Array.isArray(value) ? value : [value];
}
const matcher = (m, p) => {
  return [];
};
const _routeRulesMatcher = (path) => defu({}, ...matcher("", typeof path === "string" ? path.toLowerCase() : path).map((r) => r.data).reverse());
const routeRulesMatcher$1 = _routeRulesMatcher;
function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  try {
    return routeRulesMatcher$1(path.toLowerCase());
  } catch (e) {
    console.error("[nuxt] Error matching route rules.", e);
    return {};
  }
}
const __nuxt_page_meta$2 = {
  layout: "auth"
};
const __nuxt_page_meta$1 = {
  layout: "auth"
};
const __nuxt_page_meta = {
  layout: "auth"
};
const _routes = [
  {
    name: "index___en",
    path: "/",
    component: () => import('./index-DwCHsa10.mjs')
  },
  {
    name: "index___zh-CN",
    path: "/zh-CN",
    component: () => import('./index-DwCHsa10.mjs')
  },
  {
    name: "checkout___en",
    path: "/checkout",
    meta: { "middleware": ["auth"] },
    component: () => import('./checkout-BvYmkTnK.mjs')
  },
  {
    name: "checkout___zh-CN",
    path: "/zh-CN/checkout",
    meta: { "middleware": ["auth"] },
    component: () => import('./checkout-BvYmkTnK.mjs')
  },
  {
    name: "card-id___en",
    path: "/card/:id()",
    component: () => import('./_id_-B9aD-vQs.mjs')
  },
  {
    name: "card-id___zh-CN",
    path: "/zh-CN/card/:id()",
    component: () => import('./_id_-B9aD-vQs.mjs')
  },
  {
    name: "auth-login___en",
    path: "/auth/login",
    meta: __nuxt_page_meta$2 || {},
    component: () => import('./login-BvuZ2Lg_.mjs')
  },
  {
    name: "auth-login___zh-CN",
    path: "/zh-CN/auth/login",
    meta: __nuxt_page_meta$2 || {},
    component: () => import('./login-BvuZ2Lg_.mjs')
  },
  {
    name: "order-id___en",
    path: "/order/:id()",
    component: () => import('./_id_-Dnab-Pon.mjs')
  },
  {
    name: "order-id___zh-CN",
    path: "/zh-CN/order/:id()",
    component: () => import('./_id_-Dnab-Pon.mjs')
  },
  {
    name: "user___en",
    path: "/user",
    component: () => import('./index-Cillj584.mjs')
  },
  {
    name: "user___zh-CN",
    path: "/zh-CN/user",
    component: () => import('./index-Cillj584.mjs')
  },
  {
    name: "legal-terms___en",
    path: "/legal/terms",
    component: () => import('./terms-D757bQpf.mjs')
  },
  {
    name: "legal-terms___zh-CN",
    path: "/zh-CN/legal/terms",
    component: () => import('./terms-D757bQpf.mjs')
  },
  {
    name: "user-orders___en",
    path: "/user/orders",
    component: () => import('./orders-D-qqz9Dj.mjs')
  },
  {
    name: "user-orders___zh-CN",
    path: "/zh-CN/user/orders",
    component: () => import('./orders-D-qqz9Dj.mjs')
  },
  {
    name: "user-wallet___en",
    path: "/user/wallet",
    component: () => import('./wallet-DeFZixIQ.mjs')
  },
  {
    name: "user-wallet___zh-CN",
    path: "/zh-CN/user/wallet",
    component: () => import('./wallet-DeFZixIQ.mjs')
  },
  {
    name: "auth-callback___en",
    path: "/auth/callback",
    meta: __nuxt_page_meta$1 || {},
    component: () => import('./callback-3wy2a8H9.mjs')
  },
  {
    name: "auth-callback___zh-CN",
    path: "/zh-CN/auth/callback",
    meta: __nuxt_page_meta$1 || {},
    component: () => import('./callback-3wy2a8H9.mjs')
  },
  {
    name: "auth-register___en",
    path: "/auth/register",
    meta: __nuxt_page_meta || {},
    component: () => import('./register-BU95loGD.mjs')
  },
  {
    name: "auth-register___zh-CN",
    path: "/zh-CN/auth/register",
    meta: __nuxt_page_meta || {},
    component: () => import('./register-BU95loGD.mjs')
  },
  {
    name: "legal-privacy___en",
    path: "/legal/privacy",
    component: () => import('./privacy-DYrbGpsl.mjs')
  },
  {
    name: "legal-privacy___zh-CN",
    path: "/zh-CN/legal/privacy",
    component: () => import('./privacy-DYrbGpsl.mjs')
  },
  {
    name: "user-received___en",
    path: "/user/received",
    component: () => import('./received-BRpCamKv.mjs'),
    children: [
      {
        name: "user-received-id___en",
        path: ":id()",
        component: () => import('./_id_-QKqcWA1u.mjs')
      }
    ]
  },
  {
    name: "user-received___zh-CN",
    path: "/zh-CN/user/received",
    component: () => import('./received-BRpCamKv.mjs'),
    children: [
      {
        name: "user-received-id___zh-CN",
        path: ":id()",
        component: () => import('./_id_-QKqcWA1u.mjs')
      }
    ]
  },
  {
    name: "user-withdraw___en",
    path: "/user/withdraw",
    component: () => import('./withdraw-BhPO6IVX.mjs')
  },
  {
    name: "user-withdraw___zh-CN",
    path: "/zh-CN/user/withdraw",
    component: () => import('./withdraw-BhPO6IVX.mjs')
  },
  {
    name: "category-slug___en",
    path: "/category/:slug()",
    component: () => import('./_slug_-SjtR-9do.mjs')
  },
  {
    name: "category-slug___zh-CN",
    path: "/zh-CN/category/:slug()",
    component: () => import('./_slug_-SjtR-9do.mjs')
  },
  {
    name: "pay-shareCode___en",
    path: "/pay/:shareCode()",
    component: () => import('./_shareCode_-DKH737oY.mjs'),
    children: [
      {
        name: "pay-shareCode-success___en",
        path: "success",
        component: () => import('./success-B7V7YSzP.mjs')
      }
    ]
  },
  {
    name: "pay-shareCode___zh-CN",
    path: "/zh-CN/pay/:shareCode()",
    component: () => import('./_shareCode_-DKH737oY.mjs'),
    children: [
      {
        name: "pay-shareCode-success___zh-CN",
        path: "success",
        component: () => import('./success-B7V7YSzP.mjs')
      }
    ]
  }
];
const _wrapInTransition = (props, children) => {
  return { default: () => children.default?.() };
};
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route2) {
  const source = route2?.meta.key ?? route2.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route2.params[r.slice(1)]?.toString() || "");
  return typeof source === "function" ? source(route2) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
function toArray$2(value) {
  return Array.isArray(value) ? value : [value];
}
function _mergeTransitionProps(routeProps2) {
  const _props = [];
  for (const prop of routeProps2) {
    if (!prop) {
      continue;
    }
    _props.push({
      ...prop,
      onAfterLeave: prop.onAfterLeave ? toArray$2(prop.onAfterLeave) : void 0,
      onBeforeLeave: prop.onBeforeLeave ? toArray$2(prop.onBeforeLeave) : void 0
    });
  }
  return defu(..._props);
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    const hashScrollBehaviour = useRouter().options?.scrollBehaviorType ?? "auto";
    if (to.path.replace(/\/$/, "") === from.path.replace(/\/$/, "")) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior: hashScrollBehaviour };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    if (from === START_LOCATION) {
      return _calculatePosition(to, from, savedPosition, hashScrollBehaviour);
    }
    return new Promise((resolve2) => {
      const doScroll = () => {
        requestAnimationFrame(() => resolve2(_calculatePosition(to, from, savedPosition, hashScrollBehaviour)));
      };
      nuxtApp.hooks.hookOnce("page:loading:end", () => {
        const transitionPromise = nuxtApp["~transitionPromise"];
        if (transitionPromise) {
          transitionPromise.then(doScroll);
        } else {
          doScroll();
        }
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
  if (savedPosition) {
    return savedPosition;
  }
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: isChangingPage(to, from) ? defaultHashScrollBehaviour : "instant"
    };
  }
  return {
    left: 0,
    top: 0
  };
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
  let __temp, __restore;
  if (!to.meta?.validate) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    status: result && (result.status || result.statusCode) || 404,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    statusText: result && (result.statusText || result.statusMessage) || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware((to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {
  auth: () => import('./auth-BxyJNz1L.mjs')
};
Object.assign(/* @__PURE__ */ Object.create(null), {});
const pageIslandRoutes = Object.assign(/* @__PURE__ */ Object.create(null), {});
const plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = routerOptions.history?.(routerBase) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    router.afterEach((to, from) => {
      const lastTo = to.matched.at(-1)?.components?.default;
      const lastFrom = from.matched.at(-1)?.components?.default;
      if (lastTo === lastFrom) {
        syncCurrentRoute();
        return;
      }
      if (to.matched.length < from.matched.length && to.matched.every((m, i) => m.components?.default === from.matched[i]?.components?.default)) {
        syncCurrentRoute();
      }
    });
    const route2 = { sync: syncCurrentRoute };
    for (const key in _route.value) {
      Object.defineProperty(route2, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route2);
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    const error = /* @__PURE__ */ useError();
    const isServerPage = nuxtApp.ssrContext?.islandContext?.name?.startsWith("page_");
    if (!nuxtApp.ssrContext?.islandContext || isServerPage) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if (failure?.type === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    const hasDeferredRoute = false;
    syncCurrentRoute();
    if (nuxtApp.ssrContext?.islandContext && !isServerPage) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!nuxtApp.ssrContext?.islandContext || isServerPage) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray$3(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        const routeRules = getRouteRules({ path: to.path });
        if (routeRules.appMiddleware) {
          for (const key in routeRules.appMiddleware) {
            if (routeRules.appMiddleware[key]) {
              middlewareEntries.add(key);
            } else {
              middlewareEntries.delete(key);
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await namedMiddleware[entry2]?.().then((r) => r.default || r) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            if (false) ;
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  status: 404,
                  statusText: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    if (isServerPage) {
      router.beforeResolve((to) => {
        const expected = pageIslandRoutes[nuxtApp.ssrContext.islandContext.name];
        const actual = to.matched.find((m) => m.components?.default?.__nuxt_island)?.components?.default;
        if (!expected || expected !== actual?.__nuxt_island) {
          nuxtApp.ssrContext["~renderResponse"] = {
            statusCode: 400,
            statusMessage: "Invalid island request path"
          };
          return false;
        }
      });
    }
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach((to) => {
      if (to.matched.length === 0 && !error.value) {
        return nuxtApp.runWithContext(() => showError(createError({
          status: 404,
          fatal: false,
          statusText: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        if (hasDeferredRoute) ;
        else {
          await router.replace({
            ...resolvedInitialRoute,
            force: true
          });
        }
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
async function fetchWithRetry(req, init) {
  const retries = 3;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fetch(req, init);
    } catch (error) {
      if (init?.signal?.aborted) {
        throw error;
      }
      if (attempt === retries) {
        console.error(`Error fetching request ${req}`, error, init);
        throw error;
      }
      console.warn(`Retrying fetch attempt ${attempt + 1} for request: ${req}`);
    }
  }
  throw new Error("Unreachable code");
}
function setCookies(event, cookies) {
  const response = event.node.res;
  const headersWritable = () => !response.headersSent && !response.writableEnded;
  if (!headersWritable()) {
    return;
  }
  for (const { name: name2, value, options } of cookies) {
    if (!headersWritable()) {
      break;
    }
    setCookie(event, name2, value, options);
  }
}
const serverSupabaseClient = async (event) => {
  if (!event.context._supabaseClient) {
    const { url, key, cookiePrefix, cookieOptions, clientOptions: { auth = {}, global: global2 = {} } } = (/* @__PURE__ */ useRuntimeConfig()).public.supabase;
    event.context._supabaseClient = createServerClient(url, key, {
      auth,
      cookies: {
        getAll: () => parseCookieHeader(getHeader(event, "Cookie") ?? ""),
        setAll: (cookies) => setCookies(event, cookies)
      },
      cookieOptions: {
        ...cookieOptions,
        name: cookiePrefix
      },
      global: {
        fetch: fetchWithRetry,
        ...global2
      }
    });
  }
  return event.context._supabaseClient;
};
const serverSupabaseUser = async (event) => {
  const client = await serverSupabaseClient(event);
  const { data: { user }, error } = await client.auth.getUser();
  if (error) {
    throw createError$1({ statusMessage: error?.message });
  }
  return user;
};
const serverSupabaseSession = async (event) => {
  const client = await serverSupabaseClient(event);
  const { data: { session }, error } = await client.auth.getSession();
  if (error) {
    throw createError$1({ statusMessage: error?.message });
  }
  delete session?.user;
  return session;
};
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const useSupabaseSession = () => useState("supabase_session", () => null);
const useSupabaseUser = () => useState("supabase_user", () => null);
function useRequestEvent(nuxtApp) {
  nuxtApp ||= useNuxtApp();
  return nuxtApp.ssrContext?.event;
}
function useRequestHeaders(include) {
  const event = useRequestEvent();
  const _headers = event ? getRequestHeaders(event) : {};
  if (!include || !event) {
    return _headers;
  }
  const headers = /* @__PURE__ */ Object.create(null);
  for (const _key of include) {
    const key = _key.toLowerCase();
    const header = _headers[key];
    if (header) {
      headers[key] = header;
    }
  }
  return headers;
}
function useRequestHeader(header) {
  const event = useRequestEvent();
  return event ? getRequestHeader(event, header) : void 0;
}
function useRequestFetch() {
  return useRequestEvent()?.$fetch || globalThis.$fetch;
}
const supabase_server_NZuw_NDm2ZtOgvg4QqXN_Xqdg_KPvGuBBWKrLH15GWY = /* @__PURE__ */ defineNuxtPlugin({
  name: "supabase",
  enforce: "pre",
  async setup({ provide: provide2 }) {
    let __temp, __restore;
    const { url, key, cookiePrefix, useSsrCookies, cookieOptions, clientOptions } = (/* @__PURE__ */ useRuntimeConfig()).public.supabase;
    const event = useRequestEvent();
    const client = createServerClient(url, key, {
      ...clientOptions,
      cookies: {
        getAll: () => parseCookieHeader(getHeader(event, "Cookie") ?? ""),
        setAll: (cookies) => setCookies(event, cookies)
      },
      cookieOptions: {
        ...cookieOptions,
        name: cookiePrefix
      },
      global: {
        fetch: fetchWithRetry,
        ...clientOptions.global
      }
    });
    provide2("supabase", { client });
    if (useSsrCookies) {
      const [
        session,
        user
      ] = ([__temp, __restore] = executeAsync(() => Promise.all([
        serverSupabaseSession(event).catch(() => null),
        serverSupabaseUser(event).catch(() => null)
      ])), __temp = await __temp, __restore(), __temp);
      useSupabaseSession().value = session;
      useSupabaseUser().value = user;
    }
  }
});
function definePayloadReducer(name2, reduce) {
  {
    useNuxtApp().ssrContext["~payloadReducers"][name2] = reduce;
  }
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const piniaSymbol = (
  /* istanbul ignore next */
  /* @__PURE__ */ Symbol()
);
var MutationType;
(function(MutationType2) {
  MutationType2["direct"] = "direct";
  MutationType2["patchObject"] = "patch object";
  MutationType2["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
function createPinia() {
  const scope = effectScope(true);
  const state = scope.run(() => ref({}));
  let _p = [];
  let toBeInstalled = [];
  const pinia = markRaw({
    install(app) {
      {
        pinia._a = app;
        app.provide(piniaSymbol, pinia);
        app.config.globalProperties.$pinia = pinia;
        toBeInstalled.forEach((plugin2) => _p.push(plugin2));
        toBeInstalled = [];
      }
    },
    use(plugin2) {
      if (!this._a && true) {
        toBeInstalled.push(plugin2);
      } else {
        _p.push(plugin2);
      }
      return this;
    },
    _p,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: scope,
    _s: /* @__PURE__ */ new Map(),
    state
  });
  return pinia;
}
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = /* @__PURE__ */ Symbol.for("nuxt:client-only");
defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => {
    const decoded = decodeURIComponent(val);
    const parsed = destr(decoded);
    if (typeof parsed === "number" && (!Number.isFinite(parsed) || String(parsed) !== decoded)) {
      return decoded;
    }
    return parsed;
  },
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name2, _opts) {
  const opts = { ...CookieDefaults, ..._opts };
  opts.filter ??= (key) => key === name2;
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : cookies[name2] ?? opts.default?.());
  const cookie = ref(cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual$1(cookie.value, cookies[name2])) {
        return;
      }
      nuxtApp._cookies ||= {};
      if (name2 in nuxtApp._cookies) {
        if (isEqual$1(cookie.value, nuxtApp._cookies[name2])) {
          return;
        }
      }
      nuxtApp._cookies[name2] = cookie.value;
      writeServerCookie(useRequestEvent(nuxtApp), name2, cookie.value, opts);
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  {
    return parse$1(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
function writeServerCookie(event, name2, value, opts = {}) {
  if (event) {
    if (value !== null && value !== void 0) {
      return setCookie(event, name2, value, opts);
    }
    if (getCookie(event, name2) !== void 0) {
      return deleteCookie(event, name2, opts);
    }
  }
}
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "pinia",
  setup(nuxtApp) {
    const pinia = createPinia();
    nuxtApp.vueApp.use(pinia);
    {
      nuxtApp.payload.pinia = pinia.state.value;
    }
    return {
      provide: {
        pinia
      }
    };
  }
});
function warn(msg, err) {
  if (typeof console !== "undefined") {
    console.warn(`[intlify] ` + msg);
    if (err) {
      console.warn(err.stack);
    }
  }
}
const makeSymbol = (name2, shareable = false) => !shareable ? Symbol(name2) : Symbol.for(name2);
const generateFormatCacheKey = (locale, key, source) => friendlyJSONstringify({ l: locale, k: key, s: source });
const friendlyJSONstringify = (json) => JSON.stringify(json).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029").replace(/\u0027/g, "\\u0027");
const isNumber = (val) => typeof val === "number" && isFinite(val);
const isDate = (val) => toTypeString(val) === "[object Date]";
const isRegExp = (val) => toTypeString(val) === "[object RegExp]";
const isEmptyObject = (val) => isPlainObject(val) && Object.keys(val).length === 0;
const assign = Object.assign;
const _create = Object.create;
const create = (obj = null) => _create(obj);
function escapeHtml(rawText) {
  return rawText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/\//g, "&#x2F;").replace(/=/g, "&#x3D;");
}
function escapeAttributeValue(value) {
  return value.replace(/&(?![a-zA-Z0-9#]{2,6};)/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function sanitizeTranslatedHtml(html) {
  html = html.replace(/(\w+)\s*=\s*"([^"]*)"/g, (_, attrName, attrValue) => `${attrName}="${escapeAttributeValue(attrValue)}"`);
  html = html.replace(/(\w+)\s*=\s*'([^']*)'/g, (_, attrName, attrValue) => `${attrName}='${escapeAttributeValue(attrValue)}'`);
  const eventHandlerPattern = /\s*on\w+\s*=\s*["']?[^"'>]+["']?/gi;
  if (eventHandlerPattern.test(html)) {
    html = html.replace(/(\s+)(on)(\w+\s*=)/gi, "$1&#111;n$3");
  }
  const javascriptUrlPattern = [
    // In href, src, action, formaction attributes
    /(\s+(?:href|src|action|formaction)\s*=\s*["']?)\s*javascript:/gi,
    // In style attributes within url()
    /(style\s*=\s*["'][^"']*url\s*\(\s*)javascript:/gi
  ];
  javascriptUrlPattern.forEach((pattern) => {
    html = html.replace(pattern, "$1javascript&#58;");
  });
  return html;
}
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return hasOwnProperty$1.call(obj, key);
}
const isArray = Array.isArray;
const isFunction$1 = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isBoolean = (val) => typeof val === "boolean";
const isObject$1 = (val) => val !== null && typeof val === "object";
const isPromise$1 = (val) => {
  return isObject$1(val) && isFunction$1(val.then) && isFunction$1(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const toDisplayString = (val) => {
  return val == null ? "" : isArray(val) || isPlainObject(val) && val.toString === objectToString ? JSON.stringify(val, null, 2) : String(val);
};
function join(items, separator = "") {
  return items.reduce((str, item, index) => index === 0 ? str + item : str + separator + item, "");
}
const isNotObjectOrIsArray = (val) => !isObject$1(val) || isArray(val);
function deepCopy(src, des) {
  if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) {
    throw new Error("Invalid value");
  }
  const stack = [{ src, des }];
  while (stack.length) {
    const { src: src2, des: des2 } = stack.pop();
    Object.keys(src2).forEach((key) => {
      if (key === "__proto__") {
        return;
      }
      if (isObject$1(src2[key]) && !isObject$1(des2[key])) {
        des2[key] = Array.isArray(src2[key]) ? [] : create();
      }
      if (isNotObjectOrIsArray(des2[key]) || isNotObjectOrIsArray(src2[key])) {
        des2[key] = src2[key];
      } else {
        stack.push({ src: src2[key], des: des2[key] });
      }
    });
  }
}
const localeCodes = [
  "en",
  "zh-CN"
];
const localeLoaders = {
  en: [
    {
      key: "locale_en_46json_cbf9abf8",
      load: () => import(
        './en-DXhoXyLz.mjs'
        /* webpackChunkName: "locale_en_46json_cbf9abf8" */
      ),
      cache: true
    }
  ],
  "zh-CN": [
    {
      key: "locale_zh_45CN_46json_0fd859d2",
      load: () => import(
        './zh-CN-B7cO5_r2.mjs'
        /* webpackChunkName: "locale_zh_45CN_46json_0fd859d2" */
      ),
      cache: true
    }
  ]
};
const vueI18nConfigs = [];
const normalizedLocales = [
  {
    code: "en",
    name: "English",
    files: [
      {
        path: "/Users/langxiaoyue/digital-card-platform/i18n/locales/en.json",
        cache: void 0
      }
    ]
  },
  {
    code: "zh-CN",
    name: "中文",
    files: [
      {
        path: "/Users/langxiaoyue/digital-card-platform/i18n/locales/zh-CN.json",
        cache: void 0
      }
    ]
  }
];
const NUXT_I18N_MODULE_ID = "@nuxtjs/i18n";
const parallelPlugin = false;
const DEFAULT_COOKIE_KEY = "i18n_redirected";
const DEFAULT_DYNAMIC_PARAMS_KEY = "nuxtI18nInternal";
const SWITCH_LOCALE_PATH_LINK_IDENTIFIER = "nuxt-i18n-slp";
function getRouteName(routeName) {
  if (isString(routeName)) return routeName;
  if (routeName != null) return routeName.toString();
  return "(null)";
}
function getLocaleRouteName(routeName, locale, opts) {
  const { defaultLocale, strategy, routesNameSeparator, defaultLocaleRouteNameSuffix, differentDomains } = opts;
  const localizedRoutes = strategy !== "no_prefix" || differentDomains;
  const name2 = getRouteName(routeName) + (localizedRoutes ? routesNameSeparator + locale : "");
  if (locale === defaultLocale && strategy === "prefix_and_default") {
    return name2 + routesNameSeparator + defaultLocaleRouteNameSuffix;
  }
  return name2;
}
function matchBrowserLocale(locales, browserLocales) {
  const matchedLocales = [];
  for (const [index, browserCode] of browserLocales.entries()) {
    const matchedLocale = locales.find((l) => l.language?.toLowerCase() === browserCode.toLowerCase());
    if (matchedLocale) {
      matchedLocales.push({ code: matchedLocale.code, score: 1 - index / browserLocales.length });
      break;
    }
  }
  for (const [index, browserCode] of browserLocales.entries()) {
    const languageCode = browserCode.split("-")[0].toLowerCase();
    const matchedLocale = locales.find((l) => l.language?.split("-")[0].toLowerCase() === languageCode);
    if (matchedLocale) {
      matchedLocales.push({ code: matchedLocale.code, score: 0.999 - index / browserLocales.length });
      break;
    }
  }
  return matchedLocales;
}
function compareBrowserLocale(a, b) {
  if (a.score === b.score) {
    return b.code.length - a.code.length;
  }
  return b.score - a.score;
}
function findBrowserLocale(locales, browserLocales) {
  const normalizedLocales2 = locales.map((l) => ({ code: l.code, language: l.language || l.code }));
  const matchedLocales = matchBrowserLocale(normalizedLocales2, browserLocales);
  if (matchedLocales.length === 0) {
    return "";
  }
  if (matchedLocales.length > 1) {
    matchedLocales.sort(compareBrowserLocale);
  }
  return matchedLocales[0].code;
}
function getLocalesRegex(localeCodes2) {
  return new RegExp(`^/(${localeCodes2.join("|")})(?:/|$)`, "i");
}
const localesPattern = `(${localeCodes.join("|")})`;
const regexpPath = getLocalesRegex(localeCodes);
function createLocaleFromRouteGetter() {
  const { routesNameSeparator, defaultLocaleRouteNameSuffix } = (/* @__PURE__ */ useRuntimeConfig()).public.i18n;
  const defaultSuffixPattern = `(?:${routesNameSeparator}${defaultLocaleRouteNameSuffix})?`;
  const regexpName = new RegExp(`${routesNameSeparator}${localesPattern}${defaultSuffixPattern}$`, "i");
  return (route2) => {
    if (isString(route2)) {
      return route2.match(regexpPath)?.[1] ?? "";
    }
    if (route2.name) {
      return getRouteName(route2.name).match(regexpName)?.[1] ?? "";
    }
    if (route2.path) {
      return route2.path.match(regexpPath)?.[1] ?? "";
    }
    return "";
  };
}
function isI18nInstance(i18n) {
  return i18n != null && "global" in i18n && "mode" in i18n;
}
function isComposer(target) {
  return target != null && !("__composer" in target) && "locale" in target && isRef(target.locale);
}
function isVueI18n(target) {
  return target != null && "__composer" in target;
}
function getI18nTarget(i18n) {
  return isI18nInstance(i18n) ? i18n.global : i18n;
}
function getComposer$3(i18n) {
  const target = getI18nTarget(i18n);
  if (isComposer(target)) return target;
  if (isVueI18n(target)) return target.__composer;
  return target;
}
function getHost() {
  const header = useRequestHeaders(["x-forwarded-host", "host"]);
  return header["x-forwarded-host"] || header["host"] || "";
}
function getLocaleDomain(locales, strategy, route2) {
  const host = getHost();
  if (!host) {
    return host;
  }
  const routePath = isString(route2) ? route2 : route2.path;
  const matchingLocales = locales.filter((locale) => {
    if (locale.domain) {
      return (hasProtocol(locale.domain) ? locale.domain.replace(/(http|https):\/\//, "") : locale.domain) === host;
    }
    return isArray(locale?.domains) ? locale.domains.includes(host) : false;
  });
  if (matchingLocales.length === 0) {
    return "";
  }
  if (matchingLocales.length === 1) {
    return matchingLocales[0]?.code ?? "";
  }
  if (strategy === "no_prefix") {
    console.warn(
      formatMessage(
        "Multiple matching domains found! This is not supported for no_prefix strategy in combination with differentDomains!"
      )
    );
    return matchingLocales[0]?.code ?? "";
  }
  if (route2 && routePath) {
    const matched = routePath.match(getLocalesRegex(matchingLocales.map((l) => l.code)))?.at(1);
    if (matched) {
      const matchingLocale2 = matchingLocales.find((l) => l.code === matched);
      return matchingLocale2?.code ?? "";
    }
  }
  const matchingLocale = matchingLocales.find((l) => l.defaultForDomains?.includes(host) ?? l.domainDefault);
  return matchingLocale?.code ?? "";
}
function getDomainFromLocale(localeCode) {
  const nuxt = useNuxtApp();
  const host = getHost();
  const { domainLocales } = (/* @__PURE__ */ useRuntimeConfig()).public.i18n;
  const lang2 = normalizedLocales.find((locale) => locale.code === localeCode);
  const domain = domainLocales?.[localeCode]?.domain || lang2?.domain || lang2?.domains?.find((v) => v === host);
  if (!domain) {
    console.warn(formatMessage("Could not find domain name for locale " + localeCode));
    return;
  }
  if (hasProtocol(domain, { strict: true })) {
    return domain;
  }
  const protocol = getRequestProtocol(useRequestEvent(nuxt)) + ":";
  return protocol + "//" + domain;
}
function setupMultiDomainLocales(runtimeI18n, defaultLocaleDomain) {
  const { multiDomainLocales, strategy, routesNameSeparator, defaultLocaleRouteNameSuffix } = runtimeI18n;
  if (!multiDomainLocales) return;
  if (!(strategy === "prefix_except_default" || strategy === "prefix_and_default")) return;
  const router = useRouter();
  const defaultRouteSuffix = [routesNameSeparator, defaultLocaleRouteNameSuffix].join("");
  for (const route2 of router.getRoutes()) {
    const routeName = getRouteName(route2.name);
    if (routeName.endsWith(defaultRouteSuffix)) {
      router.removeRoute(routeName);
      continue;
    }
    const routeNameLocale = routeName.split(routesNameSeparator)[1];
    if (routeNameLocale === defaultLocaleDomain) {
      router.addRoute({
        ...route2,
        path: route2.path === `/${routeNameLocale}` ? "/" : route2.path.replace(`/${routeNameLocale}`, "")
      });
    }
  }
}
function getDefaultLocaleForDomain(runtimeI18n) {
  const { locales, domainLocales, defaultLocale, multiDomainLocales } = runtimeI18n;
  const host = getHost();
  if (!multiDomainLocales) {
    const foundLocale = normalizedLocales.find((l) => {
      const localeCode = isString(l) ? l : l.code;
      const lang2 = normalizedLocales.find((locale) => locale.code === localeCode);
      const domain = domainLocales?.[localeCode]?.domain ?? lang2?.domain;
      return domain === host;
    });
    return foundLocale?.code ?? defaultLocale ?? "";
  }
  if (locales.some((l) => !isString(l) && l.defaultForDomains != null)) {
    const findDefaultLocale = locales.find(
      (l) => !isString(l) && !!l.defaultForDomains?.includes(host)
    );
    return findDefaultLocale?.code ?? "";
  }
  return defaultLocale || "";
}
const cacheMessages = /* @__PURE__ */ new Map();
async function loadVueI18nOptions(vueI18nConfigs2, nuxt) {
  const vueI18nOptions = { messages: {} };
  for (const configFile of vueI18nConfigs2) {
    const { default: resolver } = await configFile();
    const resolved = isFunction$1(resolver) ? await nuxt.runWithContext(() => resolver()) : resolver;
    deepCopy(resolved, vueI18nOptions);
  }
  return vueI18nOptions;
}
function makeFallbackLocaleCodes(fallback, locales) {
  if (fallback === false) return [];
  if (isArray(fallback)) return fallback;
  let fallbackLocales = [];
  if (isString(fallback)) {
    if (locales.every((locale) => locale !== fallback)) {
      fallbackLocales.push(fallback);
    }
    return fallbackLocales;
  }
  const targets = [...locales, "default"];
  for (const locale of targets) {
    if (locale in fallback == false) continue;
    fallbackLocales = [...fallbackLocales, ...fallback[locale].filter(Boolean)];
  }
  return fallbackLocales;
}
const isModule = (val) => toTypeString(val) === "[object Module]";
async function loadMessage(locale, { key, load }, nuxt) {
  let message = null;
  try {
    const getter = await load().then((x) => isModule(x) ? x.default : x);
    if (isFunction$1(getter)) {
      message = await nuxt.runWithContext(() => getter(locale));
    } else {
      message = getter;
      if (message != null && cacheMessages && true) {
        cacheMessages.set(key, message);
      }
    }
  } catch (e) {
    console.error("Failed locale loading: " + e.message);
  }
  return message;
}
async function loadLocale(locale, localeLoaders2, setter, nuxt) {
  const loaders = localeLoaders2[locale];
  if (loaders == null) {
    return;
  }
  const targetMessage = {};
  for (const loader of loaders) {
    let message = null;
    if (cacheMessages && cacheMessages.has(loader.key) && loader.cache) {
      message = cacheMessages.get(loader.key);
    } else {
      message = await nuxt.runWithContext(() => loadMessage(locale, loader, nuxt));
    }
    if (message != null) {
      deepCopy(message, targetMessage);
    }
  }
  setter(locale, targetMessage);
}
function getRouteBaseName(common, route2) {
  const _route = unref(route2);
  const routeName = isObject$1(_route) ? _route?.name : _route;
  if (_route == null || !routeName) {
    return;
  }
  return getRouteName(routeName).split(common.runtimeConfig.public.i18n.routesNameSeparator)[0];
}
function localePath(common, route2, locale) {
  if (isString(route2) && hasProtocol(route2, { acceptRelative: true })) {
    return route2;
  }
  const localizedRoute = resolveRoute(common, route2, locale);
  return localizedRoute == null ? "" : localizedRoute.redirectedFrom?.fullPath || localizedRoute.fullPath;
}
function localeRoute(common, route2, locale) {
  return resolveRoute(common, route2, locale) ?? void 0;
}
function normalizeRawLocation(route2) {
  if (!isString(route2)) {
    return assign({}, route2);
  }
  if (route2[0] === "/") {
    const { pathname: path, search, hash } = parsePath(route2);
    return { path, query: parseQuery(search), hash };
  }
  return { name: route2 };
}
const isRouteLocationPathRaw = (val) => !!val.path && !val.name;
function resolveRouteObject(common, route2, locale) {
  const runtimeI18n = common.runtimeConfig.public.i18n;
  if (isRouteLocationPathRaw(route2)) {
    const resolved = resolve(common, route2, locale);
    const resolvedName = getRouteBaseName(common, resolved);
    if (resolvedName) {
      resolved.name = getLocaleRouteName(resolvedName, locale, runtimeI18n);
      return resolved;
    }
    if (!runtimeI18n.differentDomains && prefixable(locale, runtimeI18n.defaultLocale, runtimeI18n.strategy)) {
      route2.path = "/" + locale + route2.path;
    }
    route2.path = (runtimeI18n.trailingSlash ? withTrailingSlash : withoutTrailingSlash)(route2.path, true);
    return route2;
  }
  route2.name ||= getRouteBaseName(common, common.router.currentRoute.value);
  const localizedName = getLocaleRouteName(route2.name, locale, runtimeI18n);
  if (common.router.hasRoute(localizedName)) {
    route2.name = localizedName;
  }
  return route2;
}
function resolveRoute(common, route2, locale) {
  try {
    const _locale = locale || unref(getI18nTarget(common.i18n).locale);
    const normalized = normalizeRawLocation(route2);
    const resolved = common.router.resolve(resolveRouteObject(common, normalized, _locale));
    if (resolved.name) {
      return resolved;
    }
    return common.router.resolve(route2);
  } catch (e) {
    if (isNavigationFailure(
      e,
      1
      /* No match */
    )) {
      return null;
    }
  }
}
function getLocalizableMetaFromDynamicParams(common, route2) {
  if (common.runtimeConfig.public.i18n.experimental.switchLocalePathLinkSSR) {
    return unref(common.metaState.value);
  }
  const meta = route2.meta || {};
  return unref(meta)?.[DEFAULT_DYNAMIC_PARAMS_KEY] || {};
}
function switchLocalePath(common, locale, _route) {
  const route2 = _route ?? common.router.currentRoute.value;
  const name2 = getRouteBaseName(common, route2);
  if (!name2) {
    return "";
  }
  const resolvedParams = getLocalizableMetaFromDynamicParams(common, route2)[locale];
  const routeCopy = {
    name: name2,
    params: assign({}, route2.params, resolvedParams),
    fullPath: route2.fullPath,
    query: route2.query,
    hash: route2.hash,
    path: route2.path,
    meta: route2.meta
    // matched: route.matched,
    // redirectedFrom: route.redirectedFrom
  };
  const path = localePath(common, routeCopy, locale);
  if (common.runtimeConfig.public.i18n.differentDomains) {
    const domain = getDomainFromLocale(locale);
    return domain && joinURL(domain, path) || path;
  }
  return path;
}
function resolve(common, route2, locale) {
  if (common.runtimeConfig.public.i18n.strategy === "no_prefix") {
    return route2;
  }
  if (common.runtimeConfig.public.i18n.strategy !== "prefix") {
    return common.router.resolve(route2);
  }
  const restPath = route2.path.slice(1);
  const targetPath = route2.path[0] + locale + (restPath && "/" + restPath);
  const _route = common.router.options.routes.find((r) => r.path === targetPath);
  if (_route == null) {
    return route2;
  }
  return common.router.resolve(assign({}, route2, _route, { path: targetPath }));
}
function formatMessage(message) {
  return `[${NUXT_I18N_MODULE_ID}]: ${message}`;
}
function initCommonComposableOptions(i18n) {
  return {
    i18n: i18n ?? useNuxtApp().$i18n,
    router: useRouter(),
    runtimeConfig: /* @__PURE__ */ useRuntimeConfig(),
    metaState: useState("nuxt-i18n-meta", () => ({}))
  };
}
async function loadAndSetLocale(nuxtApp, newLocale, initial = false) {
  const { differentDomains, skipSettingLocaleOnNavigate } = nuxtApp.$config.public.i18n;
  const opts = runtimeDetectBrowserLanguage(nuxtApp.$config.public.i18n);
  const oldLocale = unref(nuxtApp.$i18n.locale);
  const localeCodes2 = unref(nuxtApp.$i18n.localeCodes);
  function syncCookie(locale = oldLocale) {
    if (opts === false || !opts.useCookie) return;
    if (skipSettingLocaleOnNavigate) return;
    nuxtApp.$i18n.setLocaleCookie(locale);
  }
  const localeOverride = await nuxtApp.$i18n.onBeforeLanguageSwitch(oldLocale, newLocale, initial, nuxtApp);
  if (localeOverride && localeCodes2.includes(localeOverride)) {
    if (oldLocale === localeOverride) {
      syncCookie();
      return false;
    }
    newLocale = localeOverride;
  }
  if (!newLocale) {
    syncCookie();
    return false;
  }
  if (!initial && differentDomains) {
    syncCookie();
    return false;
  }
  if (oldLocale === newLocale) {
    syncCookie();
    return false;
  }
  const i18nFallbackLocales = unref(nuxtApp.$i18n.fallbackLocale);
  const setter = nuxtApp.$i18n.mergeLocaleMessage.bind(nuxtApp.$i18n);
  if (i18nFallbackLocales) {
    const fallbackLocales = makeFallbackLocaleCodes(i18nFallbackLocales, [newLocale]);
    await Promise.all(fallbackLocales.map((locale) => loadLocale(locale, localeLoaders, setter, nuxtApp)));
  }
  await loadLocale(newLocale, localeLoaders, setter, nuxtApp);
  if (skipSettingLocaleOnNavigate) {
    return false;
  }
  syncCookie(newLocale);
  nuxtApp._vueI18n.__setLocale(newLocale);
  await nuxtApp.$i18n.onLanguageSwitched(oldLocale, newLocale);
  return true;
}
function detectLocale(nuxtApp, route2, routeLocale, currentLocale, localeCookie) {
  const { strategy, defaultLocale, differentDomains, multiDomainLocales } = nuxtApp.$config.public.i18n;
  const _detectBrowserLanguage = runtimeDetectBrowserLanguage();
  const detectedBrowser = detectBrowserLanguage(nuxtApp, route2, localeCookie, currentLocale);
  if (detectedBrowser.locale && detectedBrowser.from != null && localeCodes.includes(detectedBrowser.locale)) {
    return detectedBrowser.locale;
  }
  let detected = "";
  if (differentDomains || multiDomainLocales) {
    detected ||= getLocaleDomain(normalizedLocales, strategy, route2);
  } else if (strategy !== "no_prefix") {
    detected ||= routeLocale;
  }
  const cookieLocale = (localeCodes.includes(detectedBrowser.locale) || localeCookie && localeCodes.includes(localeCookie)) && _detectBrowserLanguage && _detectBrowserLanguage.useCookie && localeCookie;
  detected ||= cookieLocale || currentLocale || defaultLocale || "";
  return detected;
}
function detectRedirect({ to, nuxtApp, from, locale, routeLocale }, inMiddleware = false) {
  if (routeLocale === locale || nuxtApp.$i18n.strategy === "no_prefix") {
    return "";
  }
  const common = initCommonComposableOptions();
  let redirectPath = switchLocalePath(common, locale, to);
  if (inMiddleware && !redirectPath) {
    redirectPath = localePath(common, to.fullPath, locale);
  }
  if (isEqual(redirectPath, to.fullPath) || from && isEqual(redirectPath, from.fullPath)) {
    return "";
  }
  return redirectPath;
}
const useRedirectState = () => useState(NUXT_I18N_MODULE_ID + ":redirect", () => "");
async function navigate({ nuxt, locale, route: route2, redirectPath }, enableNavigate = false) {
  const { rootRedirect, differentDomains, multiDomainLocales, skipSettingLocaleOnNavigate, locales, strategy } = nuxt.$config.public.i18n;
  if (route2.path === "/" && rootRedirect) {
    let redirectCode = 302;
    if (isString(rootRedirect)) {
      redirectPath = "/" + rootRedirect;
    } else {
      redirectPath = "/" + rootRedirect.path;
      redirectCode = rootRedirect.statusCode;
    }
    redirectPath = nuxt.$localePath(redirectPath, locale);
    return navigateTo(redirectPath, { redirectCode });
  }
  if (multiDomainLocales && strategy === "prefix_except_default") {
    const host = getHost();
    const currentDomain = locales.find((locale2) => {
      if (isString(locale2)) return;
      return locale2.defaultForDomains?.find((domain) => domain === host);
    });
    const defaultLocaleForDomain = !isString(currentDomain) ? currentDomain?.code : void 0;
    if (route2.path.startsWith(`/${defaultLocaleForDomain}`)) {
      return navigateTo(route2.path.replace(`/${defaultLocaleForDomain}`, ""));
    }
    if (!route2.path.startsWith(`/${locale}`) && locale !== defaultLocaleForDomain) {
      const oldLocale = nuxt._vueI18n.__localeFromRoute(route2.path);
      if (oldLocale !== "") {
        return navigateTo(`/${locale + route2.path.replace(`/${oldLocale}`, "")}`);
      }
      return navigateTo(`/${locale + (route2.path === "/" ? "" : route2.path)}`);
    }
    if (redirectPath && route2.path !== redirectPath) {
      return navigateTo(redirectPath);
    }
    return;
  }
  if (differentDomains) {
    const state = useRedirectState();
    if (state.value && state.value !== redirectPath) {
      {
        state.value = redirectPath;
      }
    }
  } else if (redirectPath) {
    return navigateTo(redirectPath);
  }
}
function prefixable(currentLocale, defaultLocale, strategy) {
  return (
    // strategy has no prefixes
    strategy !== "no_prefix" && // strategy should not prefix default locale
    !(currentLocale === defaultLocale && (strategy === "prefix_and_default" || strategy === "prefix_except_default"))
  );
}
function extendBaseUrl(ctx) {
  const { baseUrl, defaultLocale, differentDomains } = ctx.$config.public.i18n;
  if (isFunction$1(baseUrl)) {
    return () => {
      const baseUrlResult = baseUrl(ctx);
      return baseUrlResult;
    };
  }
  const localeCode = isFunction$1(defaultLocale) ? defaultLocale() : defaultLocale;
  return () => {
    if (differentDomains && localeCode) {
      const domain = getDomainFromLocale(localeCode);
      if (domain) {
        return domain;
      }
    }
    return baseUrl ?? "";
  };
}
function toArray$1(value) {
  return isArray(value) ? value : [value];
}
function wrapComposable(fn, common = initCommonComposableOptions()) {
  return (...args) => fn(common, ...args);
}
function parseAcceptLanguage(input = "") {
  return input.split(",").map((tag) => tag.split(";")[0]);
}
function getBrowserLocale() {
  const browserLocales = parseAcceptLanguage(useRequestHeader("accept-language"));
  return findBrowserLocale(normalizedLocales, browserLocales) || void 0;
}
function createI18nCookie() {
  const detect = runtimeDetectBrowserLanguage();
  const cookieKey = detect && detect.cookieKey || DEFAULT_COOKIE_KEY;
  const date = /* @__PURE__ */ new Date();
  const cookieOptions = {
    path: "/",
    readonly: false,
    expires: new Date(date.setDate(date.getDate() + 365)),
    sameSite: detect && detect.cookieCrossOrigin ? "none" : "lax",
    domain: detect && detect.cookieDomain || void 0,
    secure: detect && detect.cookieCrossOrigin || detect && detect.cookieSecure
  };
  return useCookie(cookieKey, cookieOptions);
}
function getLocaleCookie(cookieRef, detect, defaultLocale) {
  if (detect === false || !detect.useCookie) {
    return;
  }
  const localeCode = cookieRef.value ?? void 0;
  if (localeCode == null) {
    return;
  }
  if (localeCodes.includes(localeCode)) {
    return localeCode;
  }
  if (defaultLocale) {
    cookieRef.value = defaultLocale;
    return defaultLocale;
  }
  cookieRef.value = void 0;
}
function detectBrowserLanguage(nuxtApp, route2, localeCookie, locale = "") {
  const _detect = runtimeDetectBrowserLanguage();
  if (!_detect) {
    return { locale: "", error: "disabled" };
  }
  const strategy = nuxtApp.$i18n.strategy;
  const firstAccess = nuxtApp._vueI18n.__firstAccess;
  if (!firstAccess) {
    return { locale: strategy === "no_prefix" ? locale : "", error: "first_access_only" };
  }
  if (strategy !== "no_prefix") {
    const path = isString(route2) ? route2 : route2.path;
    if (_detect.redirectOn === "root" && path !== "/") {
      return { locale: "", error: "not_redirect_on_root" };
    }
    if (_detect.redirectOn === "no prefix" && !_detect.alwaysRedirect && path.match(regexpPath)) {
      return { locale: "", error: "not_redirect_on_no_prefix" };
    }
  }
  const cookieMatch = _detect.useCookie && localeCookie || void 0;
  if (cookieMatch) {
    return { locale: cookieMatch, from: "cookie" };
  }
  const browserMatch = nuxtApp.$i18n.getBrowserLocale();
  if (browserMatch) {
    return { locale: browserMatch, from: "navigator_or_header" };
  }
  return { locale: _detect.fallbackLocale || "", from: "fallback" };
}
function runtimeDetectBrowserLanguage(opts = (/* @__PURE__ */ useRuntimeConfig()).public.i18n) {
  if (opts?.detectBrowserLanguage === false) return false;
  return opts?.detectBrowserLanguage;
}
function createHeadContext(options) {
  const nuxtApp = useNuxtApp();
  const locale = unref(nuxtApp.$i18n.locale);
  const locales = unref(nuxtApp.$i18n.locales).map((x) => isString(x) ? { code: x } : x);
  const currentLocale = locales.find((l) => l.code === locale) || { code: locale };
  const baseUrl = joinURL(unref(getComposer$3(nuxtApp.$i18n).baseUrl), nuxtApp.$config.app.baseURL);
  const runtimeI18n = nuxtApp.$config.public.i18n;
  if (!baseUrl) {
    console.warn("I18n `baseUrl` is required to generate valid SEO tag links.");
  }
  return {
    dir: options.dir,
    lang: options.lang,
    key: options.key,
    seo: options.seo,
    locale,
    locales,
    currentDir: currentLocale.dir || runtimeI18n.defaultDirection,
    currentLocale,
    currentLanguage: currentLocale.language,
    baseUrl,
    runtimeI18n
  };
}
function localeHead(common, { dir = true, lang: lang2 = true, seo = true, key = "hid" }) {
  return _localeHead(common, { dir, lang: lang2, seo, key });
}
function _localeHead(common, options) {
  const metaObject = {
    htmlAttrs: {},
    link: [],
    meta: []
  };
  const ctx = createHeadContext(options);
  if (ctx.baseUrl == null) {
    return metaObject;
  }
  if (ctx.dir) {
    metaObject.htmlAttrs.dir = ctx.currentDir;
  }
  if (ctx.lang && ctx.currentLanguage) {
    metaObject.htmlAttrs.lang = ctx.currentLanguage;
  }
  if (ctx.seo) {
    metaObject.link = metaObject.link.concat(
      getHreflangLinks(common, ctx),
      getCanonicalLink(common, ctx)
    );
    metaObject.meta = metaObject.meta.concat(
      getOgUrl(common, ctx),
      getCurrentOgLocale(ctx),
      getAlternateOgLocales(ctx)
    );
  }
  return metaObject;
}
function getHreflangLinks(common, ctx) {
  const { defaultLocale, strategy, differentDomains } = ctx.runtimeI18n;
  const links = [];
  if (strategy === "no_prefix" && !differentDomains) return links;
  const localeMap = /* @__PURE__ */ new Map();
  for (const locale of ctx.locales) {
    if (!locale.language) {
      console.warn("Locale `language` ISO code is required to generate alternate link");
      continue;
    }
    const [language, region] = locale.language.split("-");
    if (language && region && (locale.isCatchallLocale || !localeMap.has(language))) {
      localeMap.set(language, locale);
    }
    localeMap.set(locale.language, locale);
  }
  const strictCanonicals = ctx.runtimeI18n.experimental.alternateLinkCanonicalQueries === true;
  const routeWithoutQuery = strictCanonicals ? common.router.resolve({ query: {} }) : void 0;
  if (!ctx.runtimeI18n.experimental.switchLocalePathLinkSSR && strictCanonicals) {
    routeWithoutQuery.meta = common.router.currentRoute.value.meta;
  }
  for (const [language, mapLocale] of localeMap.entries()) {
    const localePath2 = switchLocalePath(common, mapLocale.code, routeWithoutQuery);
    if (!localePath2) continue;
    const fullPath = differentDomains && mapLocale.domain ? localePath2 : joinURL(ctx.baseUrl, localePath2);
    const href = withQuery(fullPath, strictCanonicals ? getCanonicalQueryParams(common, ctx) : {});
    links.push({ [ctx.key]: `i18n-alt-${language}`, rel: "alternate", href, hreflang: language });
    if (defaultLocale && defaultLocale === mapLocale.code) {
      links.unshift({ [ctx.key]: "i18n-xd", rel: "alternate", href, hreflang: "x-default" });
    }
  }
  return links;
}
function getCanonicalUrl(common, ctx) {
  const route2 = common.router.currentRoute.value;
  const currentRoute = localeRoute(
    common,
    assign({}, route2, { path: void 0, name: getRouteBaseName(common, route2) })
  );
  if (!currentRoute) return "";
  return withQuery(joinURL(ctx.baseUrl, currentRoute.path), getCanonicalQueryParams(common, ctx));
}
function getCanonicalLink(common, ctx) {
  const href = getCanonicalUrl(common, ctx);
  if (!href) return [];
  return [{ [ctx.key]: "i18n-can", rel: "canonical", href }];
}
function getCanonicalQueryParams(common, ctx) {
  const route2 = common.router.currentRoute.value;
  const currentRoute = localeRoute(
    common,
    assign({}, route2, { path: void 0, name: getRouteBaseName(common, route2) })
  );
  const canonicalQueries = isObject$1(ctx.seo) && ctx.seo?.canonicalQueries || [];
  const currentRouteQuery = currentRoute?.query || {};
  const params = {};
  for (const param of canonicalQueries.filter((x) => x in currentRouteQuery)) {
    params[param] ??= [];
    for (const val of toArray$1(currentRouteQuery[param])) {
      params[param].push(val || "");
    }
  }
  return params;
}
function getOgUrl(common, ctx) {
  const href = getCanonicalUrl(common, ctx);
  if (!href) return [];
  return [{ [ctx.key]: "i18n-og-url", property: "og:url", content: href }];
}
function getCurrentOgLocale(ctx) {
  if (!ctx.currentLanguage) return [];
  return [{ [ctx.key]: "i18n-og", property: "og:locale", content: hyphenToUnderscore(ctx.currentLanguage) }];
}
function getAlternateOgLocales(ctx) {
  const alternateLocales = ctx.locales.filter((locale) => locale.language && locale.language !== ctx.currentLanguage);
  return alternateLocales.map((locale) => ({
    [ctx.key]: `i18n-og-alt-${locale.language}`,
    property: "og:locale:alternate",
    content: hyphenToUnderscore(locale.language)
  }));
}
function hyphenToUnderscore(val = "") {
  return val.replace(/-/g, "_");
}
function createPosition(line, column, offset) {
  return { line, column, offset };
}
function createLocation(start, end, source) {
  const loc = { start, end };
  return loc;
}
const CompileErrorCodes = {
  // tokenizer error codes
  EXPECTED_TOKEN: 1,
  INVALID_TOKEN_IN_PLACEHOLDER: 2,
  UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER: 3,
  UNKNOWN_ESCAPE_SEQUENCE: 4,
  INVALID_UNICODE_ESCAPE_SEQUENCE: 5,
  UNBALANCED_CLOSING_BRACE: 6,
  UNTERMINATED_CLOSING_BRACE: 7,
  EMPTY_PLACEHOLDER: 8,
  NOT_ALLOW_NEST_PLACEHOLDER: 9,
  INVALID_LINKED_FORMAT: 10,
  // parser error codes
  MUST_HAVE_MESSAGES_IN_PLURAL: 11,
  UNEXPECTED_EMPTY_LINKED_MODIFIER: 12,
  UNEXPECTED_EMPTY_LINKED_KEY: 13,
  UNEXPECTED_LEXICAL_ANALYSIS: 14};
const COMPILE_ERROR_CODES_EXTEND_POINT = 17;
function createCompileError(code, loc, options = {}) {
  const { domain, messages: messages2, args } = options;
  const msg = code;
  const error = new SyntaxError(String(msg));
  error.code = code;
  if (loc) {
    error.location = loc;
  }
  error.domain = domain;
  return error;
}
function defaultOnError(error) {
  throw error;
}
const CHAR_SP = " ";
const CHAR_CR = "\r";
const CHAR_LF = "\n";
const CHAR_LS = String.fromCharCode(8232);
const CHAR_PS = String.fromCharCode(8233);
function createScanner(str) {
  const _buf = str;
  let _index = 0;
  let _line = 1;
  let _column = 1;
  let _peekOffset = 0;
  const isCRLF = (index2) => _buf[index2] === CHAR_CR && _buf[index2 + 1] === CHAR_LF;
  const isLF = (index2) => _buf[index2] === CHAR_LF;
  const isPS = (index2) => _buf[index2] === CHAR_PS;
  const isLS = (index2) => _buf[index2] === CHAR_LS;
  const isLineEnd = (index2) => isCRLF(index2) || isLF(index2) || isPS(index2) || isLS(index2);
  const index = () => _index;
  const line = () => _line;
  const column = () => _column;
  const peekOffset = () => _peekOffset;
  const charAt = (offset) => isCRLF(offset) || isPS(offset) || isLS(offset) ? CHAR_LF : _buf[offset];
  const currentChar = () => charAt(_index);
  const currentPeek = () => charAt(_index + _peekOffset);
  function next() {
    _peekOffset = 0;
    if (isLineEnd(_index)) {
      _line++;
      _column = 0;
    }
    if (isCRLF(_index)) {
      _index++;
    }
    _index++;
    _column++;
    return _buf[_index];
  }
  function peek() {
    if (isCRLF(_index + _peekOffset)) {
      _peekOffset++;
    }
    _peekOffset++;
    return _buf[_index + _peekOffset];
  }
  function reset() {
    _index = 0;
    _line = 1;
    _column = 1;
    _peekOffset = 0;
  }
  function resetPeek(offset = 0) {
    _peekOffset = offset;
  }
  function skipToPeek() {
    const target = _index + _peekOffset;
    while (target !== _index) {
      next();
    }
    _peekOffset = 0;
  }
  return {
    index,
    line,
    column,
    peekOffset,
    charAt,
    currentChar,
    currentPeek,
    next,
    peek,
    reset,
    resetPeek,
    skipToPeek
  };
}
const EOF = void 0;
const DOT = ".";
const LITERAL_DELIMITER = "'";
const ERROR_DOMAIN$3 = "tokenizer";
function createTokenizer(source, options = {}) {
  const location = options.location !== false;
  const _scnr = createScanner(source);
  const currentOffset = () => _scnr.index();
  const currentPosition = () => createPosition(_scnr.line(), _scnr.column(), _scnr.index());
  const _initLoc = currentPosition();
  const _initOffset = currentOffset();
  const _context = {
    currentType: 13,
    offset: _initOffset,
    startLoc: _initLoc,
    endLoc: _initLoc,
    lastType: 13,
    lastOffset: _initOffset,
    lastStartLoc: _initLoc,
    lastEndLoc: _initLoc,
    braceNest: 0,
    inLinked: false,
    text: ""
  };
  const context = () => _context;
  const { onError } = options;
  function emitError(code, pos, offset, ...args) {
    const ctx = context();
    pos.column += offset;
    pos.offset += offset;
    if (onError) {
      const loc = location ? createLocation(ctx.startLoc, pos) : null;
      const err = createCompileError(code, loc, {
        domain: ERROR_DOMAIN$3,
        args
      });
      onError(err);
    }
  }
  function getToken(context2, type, value) {
    context2.endLoc = currentPosition();
    context2.currentType = type;
    const token = { type };
    if (location) {
      token.loc = createLocation(context2.startLoc, context2.endLoc);
    }
    if (value != null) {
      token.value = value;
    }
    return token;
  }
  const getEndToken = (context2) => getToken(
    context2,
    13
    /* TokenTypes.EOF */
  );
  function eat(scnr, ch) {
    if (scnr.currentChar() === ch) {
      scnr.next();
      return ch;
    } else {
      emitError(CompileErrorCodes.EXPECTED_TOKEN, currentPosition(), 0, ch);
      return "";
    }
  }
  function peekSpaces(scnr) {
    let buf = "";
    while (scnr.currentPeek() === CHAR_SP || scnr.currentPeek() === CHAR_LF) {
      buf += scnr.currentPeek();
      scnr.peek();
    }
    return buf;
  }
  function skipSpaces(scnr) {
    const buf = peekSpaces(scnr);
    scnr.skipToPeek();
    return buf;
  }
  function isIdentifierStart(ch) {
    if (ch === EOF) {
      return false;
    }
    const cc = ch.charCodeAt(0);
    return cc >= 97 && cc <= 122 || // a-z
    cc >= 65 && cc <= 90 || // A-Z
    cc === 95;
  }
  function isNumberStart(ch) {
    if (ch === EOF) {
      return false;
    }
    const cc = ch.charCodeAt(0);
    return cc >= 48 && cc <= 57;
  }
  function isNamedIdentifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ret = isIdentifierStart(scnr.currentPeek());
    scnr.resetPeek();
    return ret;
  }
  function isListIdentifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ch = scnr.currentPeek() === "-" ? scnr.peek() : scnr.currentPeek();
    const ret = isNumberStart(ch);
    scnr.resetPeek();
    return ret;
  }
  function isLiteralStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === LITERAL_DELIMITER;
    scnr.resetPeek();
    return ret;
  }
  function isLinkedDotStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 7) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === ".";
    scnr.resetPeek();
    return ret;
  }
  function isLinkedModifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 8) {
      return false;
    }
    peekSpaces(scnr);
    const ret = isIdentifierStart(scnr.currentPeek());
    scnr.resetPeek();
    return ret;
  }
  function isLinkedDelimiterStart(scnr, context2) {
    const { currentType } = context2;
    if (!(currentType === 7 || currentType === 11)) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === ":";
    scnr.resetPeek();
    return ret;
  }
  function isLinkedReferStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 9) {
      return false;
    }
    const fn = () => {
      const ch = scnr.currentPeek();
      if (ch === "{") {
        return isIdentifierStart(scnr.peek());
      } else if (ch === "@" || ch === "|" || ch === ":" || ch === "." || ch === CHAR_SP || !ch) {
        return false;
      } else if (ch === CHAR_LF) {
        scnr.peek();
        return fn();
      } else {
        return isTextStart(scnr, false);
      }
    };
    const ret = fn();
    scnr.resetPeek();
    return ret;
  }
  function isPluralStart(scnr) {
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === "|";
    scnr.resetPeek();
    return ret;
  }
  function isTextStart(scnr, reset = true) {
    const fn = (hasSpace = false, prev = "") => {
      const ch = scnr.currentPeek();
      if (ch === "{") {
        return hasSpace;
      } else if (ch === "@" || !ch) {
        return hasSpace;
      } else if (ch === "|") {
        return !(prev === CHAR_SP || prev === CHAR_LF);
      } else if (ch === CHAR_SP) {
        scnr.peek();
        return fn(true, CHAR_SP);
      } else if (ch === CHAR_LF) {
        scnr.peek();
        return fn(true, CHAR_LF);
      } else {
        return true;
      }
    };
    const ret = fn();
    reset && scnr.resetPeek();
    return ret;
  }
  function takeChar(scnr, fn) {
    const ch = scnr.currentChar();
    if (ch === EOF) {
      return EOF;
    }
    if (fn(ch)) {
      scnr.next();
      return ch;
    }
    return null;
  }
  function isIdentifier(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 97 && cc <= 122 || // a-z
    cc >= 65 && cc <= 90 || // A-Z
    cc >= 48 && cc <= 57 || // 0-9
    cc === 95 || // _
    cc === 36;
  }
  function takeIdentifierChar(scnr) {
    return takeChar(scnr, isIdentifier);
  }
  function isNamedIdentifier(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 97 && cc <= 122 || // a-z
    cc >= 65 && cc <= 90 || // A-Z
    cc >= 48 && cc <= 57 || // 0-9
    cc === 95 || // _
    cc === 36 || // $
    cc === 45;
  }
  function takeNamedIdentifierChar(scnr) {
    return takeChar(scnr, isNamedIdentifier);
  }
  function isDigit(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 48 && cc <= 57;
  }
  function takeDigit(scnr) {
    return takeChar(scnr, isDigit);
  }
  function isHexDigit(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 48 && cc <= 57 || // 0-9
    cc >= 65 && cc <= 70 || // A-F
    cc >= 97 && cc <= 102;
  }
  function takeHexDigit(scnr) {
    return takeChar(scnr, isHexDigit);
  }
  function getDigits(scnr) {
    let ch = "";
    let num = "";
    while (ch = takeDigit(scnr)) {
      num += ch;
    }
    return num;
  }
  function readText(scnr) {
    let buf = "";
    while (true) {
      const ch = scnr.currentChar();
      if (ch === "{" || ch === "}" || ch === "@" || ch === "|" || !ch) {
        break;
      } else if (ch === CHAR_SP || ch === CHAR_LF) {
        if (isTextStart(scnr)) {
          buf += ch;
          scnr.next();
        } else if (isPluralStart(scnr)) {
          break;
        } else {
          buf += ch;
          scnr.next();
        }
      } else {
        buf += ch;
        scnr.next();
      }
    }
    return buf;
  }
  function readNamedIdentifier(scnr) {
    skipSpaces(scnr);
    let ch = "";
    let name2 = "";
    while (ch = takeNamedIdentifierChar(scnr)) {
      name2 += ch;
    }
    if (scnr.currentChar() === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
    }
    return name2;
  }
  function readListIdentifier(scnr) {
    skipSpaces(scnr);
    let value = "";
    if (scnr.currentChar() === "-") {
      scnr.next();
      value += `-${getDigits(scnr)}`;
    } else {
      value += getDigits(scnr);
    }
    if (scnr.currentChar() === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
    }
    return value;
  }
  function isLiteral2(ch) {
    return ch !== LITERAL_DELIMITER && ch !== CHAR_LF;
  }
  function readLiteral(scnr) {
    skipSpaces(scnr);
    eat(scnr, `'`);
    let ch = "";
    let literal = "";
    while (ch = takeChar(scnr, isLiteral2)) {
      if (ch === "\\") {
        literal += readEscapeSequence(scnr);
      } else {
        literal += ch;
      }
    }
    const current2 = scnr.currentChar();
    if (current2 === CHAR_LF || current2 === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER, currentPosition(), 0);
      if (current2 === CHAR_LF) {
        scnr.next();
        eat(scnr, `'`);
      }
      return literal;
    }
    eat(scnr, `'`);
    return literal;
  }
  function readEscapeSequence(scnr) {
    const ch = scnr.currentChar();
    switch (ch) {
      case "\\":
      case `'`:
        scnr.next();
        return `\\${ch}`;
      case "u":
        return readUnicodeEscapeSequence(scnr, ch, 4);
      case "U":
        return readUnicodeEscapeSequence(scnr, ch, 6);
      default:
        emitError(CompileErrorCodes.UNKNOWN_ESCAPE_SEQUENCE, currentPosition(), 0, ch);
        return "";
    }
  }
  function readUnicodeEscapeSequence(scnr, unicode, digits) {
    eat(scnr, unicode);
    let sequence = "";
    for (let i = 0; i < digits; i++) {
      const ch = takeHexDigit(scnr);
      if (!ch) {
        emitError(CompileErrorCodes.INVALID_UNICODE_ESCAPE_SEQUENCE, currentPosition(), 0, `\\${unicode}${sequence}${scnr.currentChar()}`);
        break;
      }
      sequence += ch;
    }
    return `\\${unicode}${sequence}`;
  }
  function isInvalidIdentifier(ch) {
    return ch !== "{" && ch !== "}" && ch !== CHAR_SP && ch !== CHAR_LF;
  }
  function readInvalidIdentifier(scnr) {
    skipSpaces(scnr);
    let ch = "";
    let identifiers = "";
    while (ch = takeChar(scnr, isInvalidIdentifier)) {
      identifiers += ch;
    }
    return identifiers;
  }
  function readLinkedModifier(scnr) {
    let ch = "";
    let name2 = "";
    while (ch = takeIdentifierChar(scnr)) {
      name2 += ch;
    }
    return name2;
  }
  function readLinkedRefer(scnr) {
    const fn = (buf) => {
      const ch = scnr.currentChar();
      if (ch === "{" || ch === "@" || ch === "|" || ch === "(" || ch === ")" || !ch) {
        return buf;
      } else if (ch === CHAR_SP) {
        return buf;
      } else if (ch === CHAR_LF || ch === DOT) {
        buf += ch;
        scnr.next();
        return fn(buf);
      } else {
        buf += ch;
        scnr.next();
        return fn(buf);
      }
    };
    return fn("");
  }
  function readPlural(scnr) {
    skipSpaces(scnr);
    const plural = eat(
      scnr,
      "|"
      /* TokenChars.Pipe */
    );
    skipSpaces(scnr);
    return plural;
  }
  function readTokenInPlaceholder(scnr, context2) {
    let token = null;
    const ch = scnr.currentChar();
    switch (ch) {
      case "{":
        if (context2.braceNest >= 1) {
          emitError(CompileErrorCodes.NOT_ALLOW_NEST_PLACEHOLDER, currentPosition(), 0);
        }
        scnr.next();
        token = getToken(
          context2,
          2,
          "{"
          /* TokenChars.BraceLeft */
        );
        skipSpaces(scnr);
        context2.braceNest++;
        return token;
      case "}":
        if (context2.braceNest > 0 && context2.currentType === 2) {
          emitError(CompileErrorCodes.EMPTY_PLACEHOLDER, currentPosition(), 0);
        }
        scnr.next();
        token = getToken(
          context2,
          3,
          "}"
          /* TokenChars.BraceRight */
        );
        context2.braceNest--;
        context2.braceNest > 0 && skipSpaces(scnr);
        if (context2.inLinked && context2.braceNest === 0) {
          context2.inLinked = false;
        }
        return token;
      case "@":
        if (context2.braceNest > 0) {
          emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
        }
        token = readTokenInLinked(scnr, context2) || getEndToken(context2);
        context2.braceNest = 0;
        return token;
      default: {
        let validNamedIdentifier = true;
        let validListIdentifier = true;
        let validLiteral = true;
        if (isPluralStart(scnr)) {
          if (context2.braceNest > 0) {
            emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
          }
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        if (context2.braceNest > 0 && (context2.currentType === 4 || context2.currentType === 5 || context2.currentType === 6)) {
          emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
          context2.braceNest = 0;
          return readToken(scnr, context2);
        }
        if (validNamedIdentifier = isNamedIdentifierStart(scnr, context2)) {
          token = getToken(context2, 4, readNamedIdentifier(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (validListIdentifier = isListIdentifierStart(scnr, context2)) {
          token = getToken(context2, 5, readListIdentifier(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (validLiteral = isLiteralStart(scnr, context2)) {
          token = getToken(context2, 6, readLiteral(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (!validNamedIdentifier && !validListIdentifier && !validLiteral) {
          token = getToken(context2, 12, readInvalidIdentifier(scnr));
          emitError(CompileErrorCodes.INVALID_TOKEN_IN_PLACEHOLDER, currentPosition(), 0, token.value);
          skipSpaces(scnr);
          return token;
        }
        break;
      }
    }
    return token;
  }
  function readTokenInLinked(scnr, context2) {
    const { currentType } = context2;
    let token = null;
    const ch = scnr.currentChar();
    if ((currentType === 7 || currentType === 8 || currentType === 11 || currentType === 9) && (ch === CHAR_LF || ch === CHAR_SP)) {
      emitError(CompileErrorCodes.INVALID_LINKED_FORMAT, currentPosition(), 0);
    }
    switch (ch) {
      case "@":
        scnr.next();
        token = getToken(
          context2,
          7,
          "@"
          /* TokenChars.LinkedAlias */
        );
        context2.inLinked = true;
        return token;
      case ".":
        skipSpaces(scnr);
        scnr.next();
        return getToken(
          context2,
          8,
          "."
          /* TokenChars.LinkedDot */
        );
      case ":":
        skipSpaces(scnr);
        scnr.next();
        return getToken(
          context2,
          9,
          ":"
          /* TokenChars.LinkedDelimiter */
        );
      default:
        if (isPluralStart(scnr)) {
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        if (isLinkedDotStart(scnr, context2) || isLinkedDelimiterStart(scnr, context2)) {
          skipSpaces(scnr);
          return readTokenInLinked(scnr, context2);
        }
        if (isLinkedModifierStart(scnr, context2)) {
          skipSpaces(scnr);
          return getToken(context2, 11, readLinkedModifier(scnr));
        }
        if (isLinkedReferStart(scnr, context2)) {
          skipSpaces(scnr);
          if (ch === "{") {
            return readTokenInPlaceholder(scnr, context2) || token;
          } else {
            return getToken(context2, 10, readLinkedRefer(scnr));
          }
        }
        if (currentType === 7) {
          emitError(CompileErrorCodes.INVALID_LINKED_FORMAT, currentPosition(), 0);
        }
        context2.braceNest = 0;
        context2.inLinked = false;
        return readToken(scnr, context2);
    }
  }
  function readToken(scnr, context2) {
    let token = {
      type: 13
      /* TokenTypes.EOF */
    };
    if (context2.braceNest > 0) {
      return readTokenInPlaceholder(scnr, context2) || getEndToken(context2);
    }
    if (context2.inLinked) {
      return readTokenInLinked(scnr, context2) || getEndToken(context2);
    }
    const ch = scnr.currentChar();
    switch (ch) {
      case "{":
        return readTokenInPlaceholder(scnr, context2) || getEndToken(context2);
      case "}":
        emitError(CompileErrorCodes.UNBALANCED_CLOSING_BRACE, currentPosition(), 0);
        scnr.next();
        return getToken(
          context2,
          3,
          "}"
          /* TokenChars.BraceRight */
        );
      case "@":
        return readTokenInLinked(scnr, context2) || getEndToken(context2);
      default: {
        if (isPluralStart(scnr)) {
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        if (isTextStart(scnr)) {
          return getToken(context2, 0, readText(scnr));
        }
        break;
      }
    }
    return token;
  }
  function nextToken() {
    const { currentType, offset, startLoc, endLoc } = _context;
    _context.lastType = currentType;
    _context.lastOffset = offset;
    _context.lastStartLoc = startLoc;
    _context.lastEndLoc = endLoc;
    _context.offset = currentOffset();
    _context.startLoc = currentPosition();
    if (_scnr.currentChar() === EOF) {
      return getToken(
        _context,
        13
        /* TokenTypes.EOF */
      );
    }
    return readToken(_scnr, _context);
  }
  return {
    nextToken,
    currentOffset,
    currentPosition,
    context
  };
}
const ERROR_DOMAIN$2 = "parser";
const KNOWN_ESCAPES = /(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g;
function fromEscapeSequence(match, codePoint4, codePoint6) {
  switch (match) {
    case `\\\\`:
      return `\\`;
    // eslint-disable-next-line no-useless-escape
    case `\\'`:
      return `'`;
    default: {
      const codePoint = parseInt(codePoint4 || codePoint6, 16);
      if (codePoint <= 55295 || codePoint >= 57344) {
        return String.fromCodePoint(codePoint);
      }
      return "�";
    }
  }
}
function createParser(options = {}) {
  const location = options.location !== false;
  const { onError } = options;
  function emitError(tokenzer, code, start, offset, ...args) {
    const end = tokenzer.currentPosition();
    end.offset += offset;
    end.column += offset;
    if (onError) {
      const loc = location ? createLocation(start, end) : null;
      const err = createCompileError(code, loc, {
        domain: ERROR_DOMAIN$2,
        args
      });
      onError(err);
    }
  }
  function startNode(type, offset, loc) {
    const node = { type };
    if (location) {
      node.start = offset;
      node.end = offset;
      node.loc = { start: loc, end: loc };
    }
    return node;
  }
  function endNode(node, offset, pos, type) {
    if (location) {
      node.end = offset;
      if (node.loc) {
        node.loc.end = pos;
      }
    }
  }
  function parseText(tokenizer, value) {
    const context = tokenizer.context();
    const node = startNode(3, context.offset, context.startLoc);
    node.value = value;
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseList(tokenizer, index) {
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(5, offset, loc);
    node.index = parseInt(index, 10);
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseNamed(tokenizer, key) {
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(4, offset, loc);
    node.key = key;
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLiteral(tokenizer, value) {
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(9, offset, loc);
    node.value = value.replace(KNOWN_ESCAPES, fromEscapeSequence);
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLinkedModifier(tokenizer) {
    const token = tokenizer.nextToken();
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(8, offset, loc);
    if (token.type !== 11) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_MODIFIER, context.lastStartLoc, 0);
      node.value = "";
      endNode(node, offset, loc);
      return {
        nextConsumeToken: token,
        node
      };
    }
    if (token.value == null) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
    }
    node.value = token.value || "";
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return {
      node
    };
  }
  function parseLinkedKey(tokenizer, value) {
    const context = tokenizer.context();
    const node = startNode(7, context.offset, context.startLoc);
    node.value = value;
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLinked(tokenizer) {
    const context = tokenizer.context();
    const linkedNode = startNode(6, context.offset, context.startLoc);
    let token = tokenizer.nextToken();
    if (token.type === 8) {
      const parsed = parseLinkedModifier(tokenizer);
      linkedNode.modifier = parsed.node;
      token = parsed.nextConsumeToken || tokenizer.nextToken();
    }
    if (token.type !== 9) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
    }
    token = tokenizer.nextToken();
    if (token.type === 2) {
      token = tokenizer.nextToken();
    }
    switch (token.type) {
      case 10:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseLinkedKey(tokenizer, token.value || "");
        break;
      case 4:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseNamed(tokenizer, token.value || "");
        break;
      case 5:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseList(tokenizer, token.value || "");
        break;
      case 6:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseLiteral(tokenizer, token.value || "");
        break;
      default: {
        emitError(tokenizer, CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_KEY, context.lastStartLoc, 0);
        const nextContext = tokenizer.context();
        const emptyLinkedKeyNode = startNode(7, nextContext.offset, nextContext.startLoc);
        emptyLinkedKeyNode.value = "";
        endNode(emptyLinkedKeyNode, nextContext.offset, nextContext.startLoc);
        linkedNode.key = emptyLinkedKeyNode;
        endNode(linkedNode, nextContext.offset, nextContext.startLoc);
        return {
          nextConsumeToken: token,
          node: linkedNode
        };
      }
    }
    endNode(linkedNode, tokenizer.currentOffset(), tokenizer.currentPosition());
    return {
      node: linkedNode
    };
  }
  function parseMessage(tokenizer) {
    const context = tokenizer.context();
    const startOffset = context.currentType === 1 ? tokenizer.currentOffset() : context.offset;
    const startLoc = context.currentType === 1 ? context.endLoc : context.startLoc;
    const node = startNode(2, startOffset, startLoc);
    node.items = [];
    let nextToken = null;
    do {
      const token = nextToken || tokenizer.nextToken();
      nextToken = null;
      switch (token.type) {
        case 0:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseText(tokenizer, token.value || ""));
          break;
        case 5:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseList(tokenizer, token.value || ""));
          break;
        case 4:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseNamed(tokenizer, token.value || ""));
          break;
        case 6:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseLiteral(tokenizer, token.value || ""));
          break;
        case 7: {
          const parsed = parseLinked(tokenizer);
          node.items.push(parsed.node);
          nextToken = parsed.nextConsumeToken || null;
          break;
        }
      }
    } while (context.currentType !== 13 && context.currentType !== 1);
    const endOffset = context.currentType === 1 ? context.lastOffset : tokenizer.currentOffset();
    const endLoc = context.currentType === 1 ? context.lastEndLoc : tokenizer.currentPosition();
    endNode(node, endOffset, endLoc);
    return node;
  }
  function parsePlural(tokenizer, offset, loc, msgNode) {
    const context = tokenizer.context();
    let hasEmptyMessage = msgNode.items.length === 0;
    const node = startNode(1, offset, loc);
    node.cases = [];
    node.cases.push(msgNode);
    do {
      const msg = parseMessage(tokenizer);
      if (!hasEmptyMessage) {
        hasEmptyMessage = msg.items.length === 0;
      }
      node.cases.push(msg);
    } while (context.currentType !== 13);
    if (hasEmptyMessage) {
      emitError(tokenizer, CompileErrorCodes.MUST_HAVE_MESSAGES_IN_PLURAL, loc, 0);
    }
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseResource(tokenizer) {
    const context = tokenizer.context();
    const { offset, startLoc } = context;
    const msgNode = parseMessage(tokenizer);
    if (context.currentType === 13) {
      return msgNode;
    } else {
      return parsePlural(tokenizer, offset, startLoc, msgNode);
    }
  }
  function parse2(source) {
    const tokenizer = createTokenizer(source, assign({}, options));
    const context = tokenizer.context();
    const node = startNode(0, context.offset, context.startLoc);
    if (location && node.loc) {
      node.loc.source = source;
    }
    node.body = parseResource(tokenizer);
    if (options.onCacheKey) {
      node.cacheKey = options.onCacheKey(source);
    }
    if (context.currentType !== 13) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, source[context.offset] || "");
    }
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  return { parse: parse2 };
}
function getTokenCaption(token) {
  if (token.type === 13) {
    return "EOF";
  }
  const name2 = (token.value || "").replace(/\r?\n/gu, "\\n");
  return name2.length > 10 ? name2.slice(0, 9) + "…" : name2;
}
function createTransformer(ast, options = {}) {
  const _context = {
    ast,
    helpers: /* @__PURE__ */ new Set()
  };
  const context = () => _context;
  const helper = (name2) => {
    _context.helpers.add(name2);
    return name2;
  };
  return { context, helper };
}
function traverseNodes(nodes, transformer) {
  for (let i = 0; i < nodes.length; i++) {
    traverseNode(nodes[i], transformer);
  }
}
function traverseNode(node, transformer) {
  switch (node.type) {
    case 1:
      traverseNodes(node.cases, transformer);
      transformer.helper(
        "plural"
        /* HelperNameMap.PLURAL */
      );
      break;
    case 2:
      traverseNodes(node.items, transformer);
      break;
    case 6: {
      const linked = node;
      traverseNode(linked.key, transformer);
      transformer.helper(
        "linked"
        /* HelperNameMap.LINKED */
      );
      transformer.helper(
        "type"
        /* HelperNameMap.TYPE */
      );
      break;
    }
    case 5:
      transformer.helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      );
      transformer.helper(
        "list"
        /* HelperNameMap.LIST */
      );
      break;
    case 4:
      transformer.helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      );
      transformer.helper(
        "named"
        /* HelperNameMap.NAMED */
      );
      break;
  }
}
function transform(ast, options = {}) {
  const transformer = createTransformer(ast);
  transformer.helper(
    "normalize"
    /* HelperNameMap.NORMALIZE */
  );
  ast.body && traverseNode(ast.body, transformer);
  const context = transformer.context();
  ast.helpers = Array.from(context.helpers);
}
function optimize(ast) {
  const body = ast.body;
  if (body.type === 2) {
    optimizeMessageNode(body);
  } else {
    body.cases.forEach((c) => optimizeMessageNode(c));
  }
  return ast;
}
function optimizeMessageNode(message) {
  if (message.items.length === 1) {
    const item = message.items[0];
    if (item.type === 3 || item.type === 9) {
      message.static = item.value;
      delete item.value;
    }
  } else {
    const values = [];
    for (let i = 0; i < message.items.length; i++) {
      const item = message.items[i];
      if (!(item.type === 3 || item.type === 9)) {
        break;
      }
      if (item.value == null) {
        break;
      }
      values.push(item.value);
    }
    if (values.length === message.items.length) {
      message.static = join(values);
      for (let i = 0; i < message.items.length; i++) {
        const item = message.items[i];
        if (item.type === 3 || item.type === 9) {
          delete item.value;
        }
      }
    }
  }
}
function minify(node) {
  node.t = node.type;
  switch (node.type) {
    case 0: {
      const resource = node;
      minify(resource.body);
      resource.b = resource.body;
      delete resource.body;
      break;
    }
    case 1: {
      const plural = node;
      const cases = plural.cases;
      for (let i = 0; i < cases.length; i++) {
        minify(cases[i]);
      }
      plural.c = cases;
      delete plural.cases;
      break;
    }
    case 2: {
      const message = node;
      const items = message.items;
      for (let i = 0; i < items.length; i++) {
        minify(items[i]);
      }
      message.i = items;
      delete message.items;
      if (message.static) {
        message.s = message.static;
        delete message.static;
      }
      break;
    }
    case 3:
    case 9:
    case 8:
    case 7: {
      const valueNode = node;
      if (valueNode.value) {
        valueNode.v = valueNode.value;
        delete valueNode.value;
      }
      break;
    }
    case 6: {
      const linked = node;
      minify(linked.key);
      linked.k = linked.key;
      delete linked.key;
      if (linked.modifier) {
        minify(linked.modifier);
        linked.m = linked.modifier;
        delete linked.modifier;
      }
      break;
    }
    case 5: {
      const list = node;
      list.i = list.index;
      delete list.index;
      break;
    }
    case 4: {
      const named = node;
      named.k = named.key;
      delete named.key;
      break;
    }
  }
  delete node.type;
}
function createCodeGenerator(ast, options) {
  const { filename, breakLineCode, needIndent: _needIndent } = options;
  const location = options.location !== false;
  const _context = {
    filename,
    code: "",
    column: 1,
    line: 1,
    offset: 0,
    map: void 0,
    breakLineCode,
    needIndent: _needIndent,
    indentLevel: 0
  };
  if (location && ast.loc) {
    _context.source = ast.loc.source;
  }
  const context = () => _context;
  function push(code, node) {
    _context.code += code;
  }
  function _newline(n, withBreakLine = true) {
    const _breakLineCode = withBreakLine ? breakLineCode : "";
    push(_needIndent ? _breakLineCode + `  `.repeat(n) : _breakLineCode);
  }
  function indent(withNewLine = true) {
    const level = ++_context.indentLevel;
    withNewLine && _newline(level);
  }
  function deindent(withNewLine = true) {
    const level = --_context.indentLevel;
    withNewLine && _newline(level);
  }
  function newline() {
    _newline(_context.indentLevel);
  }
  const helper = (key) => `_${key}`;
  const needIndent = () => _context.needIndent;
  return {
    context,
    push,
    indent,
    deindent,
    newline,
    helper,
    needIndent
  };
}
function generateLinkedNode(generator, node) {
  const { helper } = generator;
  generator.push(`${helper(
    "linked"
    /* HelperNameMap.LINKED */
  )}(`);
  generateNode(generator, node.key);
  if (node.modifier) {
    generator.push(`, `);
    generateNode(generator, node.modifier);
    generator.push(`, _type`);
  } else {
    generator.push(`, undefined, _type`);
  }
  generator.push(`)`);
}
function generateMessageNode(generator, node) {
  const { helper, needIndent } = generator;
  generator.push(`${helper(
    "normalize"
    /* HelperNameMap.NORMALIZE */
  )}([`);
  generator.indent(needIndent());
  const length = node.items.length;
  for (let i = 0; i < length; i++) {
    generateNode(generator, node.items[i]);
    if (i === length - 1) {
      break;
    }
    generator.push(", ");
  }
  generator.deindent(needIndent());
  generator.push("])");
}
function generatePluralNode(generator, node) {
  const { helper, needIndent } = generator;
  if (node.cases.length > 1) {
    generator.push(`${helper(
      "plural"
      /* HelperNameMap.PLURAL */
    )}([`);
    generator.indent(needIndent());
    const length = node.cases.length;
    for (let i = 0; i < length; i++) {
      generateNode(generator, node.cases[i]);
      if (i === length - 1) {
        break;
      }
      generator.push(", ");
    }
    generator.deindent(needIndent());
    generator.push(`])`);
  }
}
function generateResource(generator, node) {
  if (node.body) {
    generateNode(generator, node.body);
  } else {
    generator.push("null");
  }
}
function generateNode(generator, node) {
  const { helper } = generator;
  switch (node.type) {
    case 0:
      generateResource(generator, node);
      break;
    case 1:
      generatePluralNode(generator, node);
      break;
    case 2:
      generateMessageNode(generator, node);
      break;
    case 6:
      generateLinkedNode(generator, node);
      break;
    case 8:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 7:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 5:
      generator.push(`${helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      )}(${helper(
        "list"
        /* HelperNameMap.LIST */
      )}(${node.index}))`, node);
      break;
    case 4:
      generator.push(`${helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      )}(${helper(
        "named"
        /* HelperNameMap.NAMED */
      )}(${JSON.stringify(node.key)}))`, node);
      break;
    case 9:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 3:
      generator.push(JSON.stringify(node.value), node);
      break;
  }
}
const generate = (ast, options = {}) => {
  const mode = isString(options.mode) ? options.mode : "normal";
  const filename = isString(options.filename) ? options.filename : "message.intl";
  !!options.sourceMap;
  const breakLineCode = options.breakLineCode != null ? options.breakLineCode : mode === "arrow" ? ";" : "\n";
  const needIndent = options.needIndent ? options.needIndent : mode !== "arrow";
  const helpers = ast.helpers || [];
  const generator = createCodeGenerator(ast, {
    filename,
    breakLineCode,
    needIndent
  });
  generator.push(mode === "normal" ? `function __msg__ (ctx) {` : `(ctx) => {`);
  generator.indent(needIndent);
  if (helpers.length > 0) {
    generator.push(`const { ${join(helpers.map((s) => `${s}: _${s}`), ", ")} } = ctx`);
    generator.newline();
  }
  generator.push(`return `);
  generateNode(generator, ast);
  generator.deindent(needIndent);
  generator.push(`}`);
  delete ast.helpers;
  const { code, map } = generator.context();
  return {
    ast,
    code,
    map: map ? map.toJSON() : void 0
    // eslint-disable-line @typescript-eslint/no-explicit-any
  };
};
function baseCompile$1(source, options = {}) {
  const assignedOptions = assign({}, options);
  const jit = !!assignedOptions.jit;
  const enalbeMinify = !!assignedOptions.minify;
  const enambeOptimize = assignedOptions.optimize == null ? true : assignedOptions.optimize;
  const parser = createParser(assignedOptions);
  const ast = parser.parse(source);
  if (!jit) {
    transform(ast, assignedOptions);
    return generate(ast, assignedOptions);
  } else {
    enambeOptimize && optimize(ast);
    enalbeMinify && minify(ast);
    return { ast, code: "" };
  }
}
function isMessageAST(val) {
  return isObject$1(val) && resolveType(val) === 0 && (hasOwn(val, "b") || hasOwn(val, "body"));
}
const PROPS_BODY = ["b", "body"];
function resolveBody(node) {
  return resolveProps(node, PROPS_BODY);
}
const PROPS_CASES = ["c", "cases"];
function resolveCases(node) {
  return resolveProps(node, PROPS_CASES, []);
}
const PROPS_STATIC = ["s", "static"];
function resolveStatic(node) {
  return resolveProps(node, PROPS_STATIC);
}
const PROPS_ITEMS = ["i", "items"];
function resolveItems(node) {
  return resolveProps(node, PROPS_ITEMS, []);
}
const PROPS_TYPE = ["t", "type"];
function resolveType(node) {
  return resolveProps(node, PROPS_TYPE);
}
const PROPS_VALUE = ["v", "value"];
function resolveValue$1(node, type) {
  const resolved = resolveProps(node, PROPS_VALUE);
  if (resolved != null) {
    return resolved;
  } else {
    throw createUnhandleNodeError(type);
  }
}
const PROPS_MODIFIER = ["m", "modifier"];
function resolveLinkedModifier(node) {
  return resolveProps(node, PROPS_MODIFIER);
}
const PROPS_KEY = ["k", "key"];
function resolveLinkedKey(node) {
  const resolved = resolveProps(node, PROPS_KEY);
  if (resolved) {
    return resolved;
  } else {
    throw createUnhandleNodeError(
      6
      /* NodeTypes.Linked */
    );
  }
}
function resolveProps(node, props, defaultValue) {
  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    if (hasOwn(node, prop) && node[prop] != null) {
      return node[prop];
    }
  }
  return defaultValue;
}
const AST_NODE_PROPS_KEYS = [
  ...PROPS_BODY,
  ...PROPS_CASES,
  ...PROPS_STATIC,
  ...PROPS_ITEMS,
  ...PROPS_KEY,
  ...PROPS_MODIFIER,
  ...PROPS_VALUE,
  ...PROPS_TYPE
];
function createUnhandleNodeError(type) {
  return new Error(`unhandled node type: ${type}`);
}
function format$1(ast) {
  const msg = (ctx) => formatParts(ctx, ast);
  return msg;
}
function formatParts(ctx, ast) {
  const body = resolveBody(ast);
  if (body == null) {
    throw createUnhandleNodeError(
      0
      /* NodeTypes.Resource */
    );
  }
  const type = resolveType(body);
  if (type === 1) {
    const plural = body;
    const cases = resolveCases(plural);
    return ctx.plural(cases.reduce((messages2, c) => [
      ...messages2,
      formatMessageParts(ctx, c)
    ], []));
  } else {
    return formatMessageParts(ctx, body);
  }
}
function formatMessageParts(ctx, node) {
  const static_ = resolveStatic(node);
  if (static_ != null) {
    return ctx.type === "text" ? static_ : ctx.normalize([static_]);
  } else {
    const messages2 = resolveItems(node).reduce((acm, c) => [...acm, formatMessagePart(ctx, c)], []);
    return ctx.normalize(messages2);
  }
}
function formatMessagePart(ctx, node) {
  const type = resolveType(node);
  switch (type) {
    case 3: {
      return resolveValue$1(node, type);
    }
    case 9: {
      return resolveValue$1(node, type);
    }
    case 4: {
      const named = node;
      if (hasOwn(named, "k") && named.k) {
        return ctx.interpolate(ctx.named(named.k));
      }
      if (hasOwn(named, "key") && named.key) {
        return ctx.interpolate(ctx.named(named.key));
      }
      throw createUnhandleNodeError(type);
    }
    case 5: {
      const list = node;
      if (hasOwn(list, "i") && isNumber(list.i)) {
        return ctx.interpolate(ctx.list(list.i));
      }
      if (hasOwn(list, "index") && isNumber(list.index)) {
        return ctx.interpolate(ctx.list(list.index));
      }
      throw createUnhandleNodeError(type);
    }
    case 6: {
      const linked = node;
      const modifier = resolveLinkedModifier(linked);
      const key = resolveLinkedKey(linked);
      return ctx.linked(formatMessagePart(ctx, key), modifier ? formatMessagePart(ctx, modifier) : void 0, ctx.type);
    }
    case 7: {
      return resolveValue$1(node, type);
    }
    case 8: {
      return resolveValue$1(node, type);
    }
    default:
      throw new Error(`unhandled node on format message part: ${type}`);
  }
}
const defaultOnCacheKey = (message) => message;
let compileCache = create();
function baseCompile(message, options = {}) {
  let detectError = false;
  const onError = options.onError || defaultOnError;
  options.onError = (err) => {
    detectError = true;
    onError(err);
  };
  return { ...baseCompile$1(message, options), detectError };
}
// @__NO_SIDE_EFFECTS__
function compile(message, context) {
  if (isString(message)) {
    isBoolean(context.warnHtmlMessage) ? context.warnHtmlMessage : true;
    const onCacheKey = context.onCacheKey || defaultOnCacheKey;
    const cacheKey = onCacheKey(message);
    const cached = compileCache[cacheKey];
    if (cached) {
      return cached;
    }
    const { ast, detectError } = baseCompile(message, {
      ...context,
      location: "production" !== "production",
      jit: true
    });
    const msg = format$1(ast);
    return !detectError ? compileCache[cacheKey] = msg : msg;
  } else {
    const cacheKey = message.cacheKey;
    if (cacheKey) {
      const cached = compileCache[cacheKey];
      if (cached) {
        return cached;
      }
      return compileCache[cacheKey] = format$1(message);
    } else {
      return format$1(message);
    }
  }
}
const CoreErrorCodes = {
  INVALID_ARGUMENT: COMPILE_ERROR_CODES_EXTEND_POINT,
  // 17
  INVALID_DATE_ARGUMENT: 18,
  INVALID_ISO_DATE_ARGUMENT: 19,
  NOT_SUPPORT_LOCALE_PROMISE_VALUE: 21,
  NOT_SUPPORT_LOCALE_ASYNC_FUNCTION: 22,
  NOT_SUPPORT_LOCALE_TYPE: 23
};
const CORE_ERROR_CODES_EXTEND_POINT = 24;
function createCoreError(code) {
  return createCompileError(code, null, void 0);
}
function getLocale(context, options) {
  return options.locale != null ? resolveLocale(options.locale) : resolveLocale(context.locale);
}
let _resolveLocale;
function resolveLocale(locale) {
  if (isString(locale)) {
    return locale;
  } else {
    if (isFunction$1(locale)) {
      if (locale.resolvedOnce && _resolveLocale != null) {
        return _resolveLocale;
      } else if (locale.constructor.name === "Function") {
        const resolve2 = locale();
        if (isPromise$1(resolve2)) {
          throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_PROMISE_VALUE);
        }
        return _resolveLocale = resolve2;
      } else {
        throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION);
      }
    } else {
      throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_TYPE);
    }
  }
}
function fallbackWithSimple(ctx, fallback, start) {
  return [.../* @__PURE__ */ new Set([
    start,
    ...isArray(fallback) ? fallback : isObject$1(fallback) ? Object.keys(fallback) : isString(fallback) ? [fallback] : [start]
  ])];
}
function fallbackWithLocaleChain(ctx, fallback, start) {
  const startLocale = isString(start) ? start : DEFAULT_LOCALE;
  const context = ctx;
  if (!context.__localeChainCache) {
    context.__localeChainCache = /* @__PURE__ */ new Map();
  }
  let chain = context.__localeChainCache.get(startLocale);
  if (!chain) {
    chain = [];
    let block = [start];
    while (isArray(block)) {
      block = appendBlockToChain(chain, block, fallback);
    }
    const defaults = isArray(fallback) || !isPlainObject(fallback) ? fallback : fallback["default"] ? fallback["default"] : null;
    block = isString(defaults) ? [defaults] : defaults;
    if (isArray(block)) {
      appendBlockToChain(chain, block, false);
    }
    context.__localeChainCache.set(startLocale, chain);
  }
  return chain;
}
function appendBlockToChain(chain, block, blocks) {
  let follow = true;
  for (let i = 0; i < block.length && isBoolean(follow); i++) {
    const locale = block[i];
    if (isString(locale)) {
      follow = appendLocaleToChain(chain, block[i], blocks);
    }
  }
  return follow;
}
function appendLocaleToChain(chain, locale, blocks) {
  let follow;
  const tokens = locale.split("-");
  do {
    const target = tokens.join("-");
    follow = appendItemToChain(chain, target, blocks);
    tokens.splice(-1, 1);
  } while (tokens.length && follow === true);
  return follow;
}
function appendItemToChain(chain, target, blocks) {
  let follow = false;
  if (!chain.includes(target)) {
    follow = true;
    if (target) {
      follow = target[target.length - 1] !== "!";
      const locale = target.replace(/!/g, "");
      chain.push(locale);
      if ((isArray(blocks) || isPlainObject(blocks)) && blocks[locale]) {
        follow = blocks[locale];
      }
    }
  }
  return follow;
}
const pathStateMachine = [];
pathStateMachine[
  0
  /* States.BEFORE_PATH */
] = {
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    0
    /* States.BEFORE_PATH */
  ],
  [
    "i"
    /* PathCharTypes.IDENT */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4
    /* States.IN_SUB_PATH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: [
    7
    /* States.AFTER_PATH */
  ]
};
pathStateMachine[
  1
  /* States.IN_PATH */
] = {
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    1
    /* States.IN_PATH */
  ],
  [
    "."
    /* PathCharTypes.DOT */
  ]: [
    2
    /* States.BEFORE_IDENT */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4
    /* States.IN_SUB_PATH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: [
    7
    /* States.AFTER_PATH */
  ]
};
pathStateMachine[
  2
  /* States.BEFORE_IDENT */
] = {
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    2
    /* States.BEFORE_IDENT */
  ],
  [
    "i"
    /* PathCharTypes.IDENT */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "0"
    /* PathCharTypes.ZERO */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ]
};
pathStateMachine[
  3
  /* States.IN_IDENT */
] = {
  [
    "i"
    /* PathCharTypes.IDENT */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "0"
    /* PathCharTypes.ZERO */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    1,
    1
    /* Actions.PUSH */
  ],
  [
    "."
    /* PathCharTypes.DOT */
  ]: [
    2,
    1
    /* Actions.PUSH */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4,
    1
    /* Actions.PUSH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: [
    7,
    1
    /* Actions.PUSH */
  ]
};
pathStateMachine[
  4
  /* States.IN_SUB_PATH */
] = {
  [
    "'"
    /* PathCharTypes.SINGLE_QUOTE */
  ]: [
    5,
    0
    /* Actions.APPEND */
  ],
  [
    '"'
    /* PathCharTypes.DOUBLE_QUOTE */
  ]: [
    6,
    0
    /* Actions.APPEND */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4,
    2
    /* Actions.INC_SUB_PATH_DEPTH */
  ],
  [
    "]"
    /* PathCharTypes.RIGHT_BRACKET */
  ]: [
    1,
    3
    /* Actions.PUSH_SUB_PATH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* PathCharTypes.ELSE */
  ]: [
    4,
    0
    /* Actions.APPEND */
  ]
};
pathStateMachine[
  5
  /* States.IN_SINGLE_QUOTE */
] = {
  [
    "'"
    /* PathCharTypes.SINGLE_QUOTE */
  ]: [
    4,
    0
    /* Actions.APPEND */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* PathCharTypes.ELSE */
  ]: [
    5,
    0
    /* Actions.APPEND */
  ]
};
pathStateMachine[
  6
  /* States.IN_DOUBLE_QUOTE */
] = {
  [
    '"'
    /* PathCharTypes.DOUBLE_QUOTE */
  ]: [
    4,
    0
    /* Actions.APPEND */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* PathCharTypes.ELSE */
  ]: [
    6,
    0
    /* Actions.APPEND */
  ]
};
const literalValueRE = /^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
function isLiteral(exp) {
  return literalValueRE.test(exp);
}
function stripQuotes(str) {
  const a = str.charCodeAt(0);
  const b = str.charCodeAt(str.length - 1);
  return a === b && (a === 34 || a === 39) ? str.slice(1, -1) : str;
}
function getPathCharType(ch) {
  if (ch === void 0 || ch === null) {
    return "o";
  }
  const code = ch.charCodeAt(0);
  switch (code) {
    case 91:
    // [
    case 93:
    // ]
    case 46:
    // .
    case 34:
    // "
    case 39:
      return ch;
    case 95:
    // _
    case 36:
    // $
    case 45:
      return "i";
    case 9:
    // Tab (HT)
    case 10:
    // Newline (LF)
    case 13:
    // Return (CR)
    case 160:
    // No-break space (NBSP)
    case 65279:
    // Byte Order Mark (BOM)
    case 8232:
    // Line Separator (LS)
    case 8233:
      return "w";
  }
  return "i";
}
function formatSubPath(path) {
  const trimmed = path.trim();
  if (path.charAt(0) === "0" && isNaN(parseInt(path))) {
    return false;
  }
  return isLiteral(trimmed) ? stripQuotes(trimmed) : "*" + trimmed;
}
function parse(path) {
  const keys = [];
  let index = -1;
  let mode = 0;
  let subPathDepth = 0;
  let c;
  let key;
  let newChar;
  let type;
  let transition;
  let action;
  let typeMap;
  const actions = [];
  actions[
    0
    /* Actions.APPEND */
  ] = () => {
    if (key === void 0) {
      key = newChar;
    } else {
      key += newChar;
    }
  };
  actions[
    1
    /* Actions.PUSH */
  ] = () => {
    if (key !== void 0) {
      keys.push(key);
      key = void 0;
    }
  };
  actions[
    2
    /* Actions.INC_SUB_PATH_DEPTH */
  ] = () => {
    actions[
      0
      /* Actions.APPEND */
    ]();
    subPathDepth++;
  };
  actions[
    3
    /* Actions.PUSH_SUB_PATH */
  ] = () => {
    if (subPathDepth > 0) {
      subPathDepth--;
      mode = 4;
      actions[
        0
        /* Actions.APPEND */
      ]();
    } else {
      subPathDepth = 0;
      if (key === void 0) {
        return false;
      }
      key = formatSubPath(key);
      if (key === false) {
        return false;
      } else {
        actions[
          1
          /* Actions.PUSH */
        ]();
      }
    }
  };
  function maybeUnescapeQuote() {
    const nextChar = path[index + 1];
    if (mode === 5 && nextChar === "'" || mode === 6 && nextChar === '"') {
      index++;
      newChar = "\\" + nextChar;
      actions[
        0
        /* Actions.APPEND */
      ]();
      return true;
    }
  }
  while (mode !== null) {
    index++;
    c = path[index];
    if (c === "\\" && maybeUnescapeQuote()) {
      continue;
    }
    type = getPathCharType(c);
    typeMap = pathStateMachine[mode];
    transition = typeMap[type] || typeMap[
      "l"
      /* PathCharTypes.ELSE */
    ] || 8;
    if (transition === 8) {
      return;
    }
    mode = transition[0];
    if (transition[1] !== void 0) {
      action = actions[transition[1]];
      if (action) {
        newChar = c;
        if (action() === false) {
          return;
        }
      }
    }
    if (mode === 7) {
      return keys;
    }
  }
}
const cache = /* @__PURE__ */ new Map();
function resolveWithKeyValue(obj, path) {
  return isObject$1(obj) ? obj[path] : null;
}
function resolveValue(obj, path) {
  if (!isObject$1(obj)) {
    return null;
  }
  let hit = cache.get(path);
  if (!hit) {
    hit = parse(path);
    if (hit) {
      cache.set(path, hit);
    }
  }
  if (!hit) {
    return null;
  }
  const len = hit.length;
  let last = obj;
  let i = 0;
  while (i < len) {
    const key = hit[i];
    if (AST_NODE_PROPS_KEYS.includes(key) && isMessageAST(last)) {
      return null;
    }
    const val = last[key];
    if (val === void 0) {
      return null;
    }
    if (isFunction$1(last)) {
      return null;
    }
    last = val;
    i++;
  }
  return last;
}
const VERSION$1 = "10.0.8";
const NOT_REOSLVED = -1;
const DEFAULT_LOCALE = "en-US";
const MISSING_RESOLVE_VALUE = "";
const capitalize = (str) => `${str.charAt(0).toLocaleUpperCase()}${str.substr(1)}`;
function getDefaultLinkedModifiers() {
  return {
    upper: (val, type) => {
      return type === "text" && isString(val) ? val.toUpperCase() : type === "vnode" && isObject$1(val) && "__v_isVNode" in val ? val.children.toUpperCase() : val;
    },
    lower: (val, type) => {
      return type === "text" && isString(val) ? val.toLowerCase() : type === "vnode" && isObject$1(val) && "__v_isVNode" in val ? val.children.toLowerCase() : val;
    },
    capitalize: (val, type) => {
      return type === "text" && isString(val) ? capitalize(val) : type === "vnode" && isObject$1(val) && "__v_isVNode" in val ? capitalize(val.children) : val;
    }
  };
}
let _compiler;
function registerMessageCompiler(compiler) {
  _compiler = compiler;
}
let _resolver;
function registerMessageResolver(resolver) {
  _resolver = resolver;
}
let _fallbacker;
function registerLocaleFallbacker(fallbacker) {
  _fallbacker = fallbacker;
}
const setAdditionalMeta = /* @__NO_SIDE_EFFECTS__ */ (meta) => {
};
let _fallbackContext = null;
const setFallbackContext = (context) => {
  _fallbackContext = context;
};
const getFallbackContext = () => _fallbackContext;
let _cid = 0;
function createCoreContext(options = {}) {
  const onWarn = isFunction$1(options.onWarn) ? options.onWarn : warn;
  const version = isString(options.version) ? options.version : VERSION$1;
  const locale = isString(options.locale) || isFunction$1(options.locale) ? options.locale : DEFAULT_LOCALE;
  const _locale = isFunction$1(locale) ? DEFAULT_LOCALE : locale;
  const fallbackLocale = isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || isString(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale;
  const messages2 = isPlainObject(options.messages) ? options.messages : createResources(_locale);
  const datetimeFormats = isPlainObject(options.datetimeFormats) ? options.datetimeFormats : createResources(_locale);
  const numberFormats = isPlainObject(options.numberFormats) ? options.numberFormats : createResources(_locale);
  const modifiers = assign(create(), options.modifiers, getDefaultLinkedModifiers());
  const pluralRules = options.pluralRules || create();
  const missing = isFunction$1(options.missing) ? options.missing : null;
  const missingWarn = isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
  const fallbackWarn = isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
  const fallbackFormat = !!options.fallbackFormat;
  const unresolving = !!options.unresolving;
  const postTranslation = isFunction$1(options.postTranslation) ? options.postTranslation : null;
  const processor = isPlainObject(options.processor) ? options.processor : null;
  const warnHtmlMessage = isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
  const escapeParameter = !!options.escapeParameter;
  const messageCompiler = isFunction$1(options.messageCompiler) ? options.messageCompiler : _compiler;
  const messageResolver = isFunction$1(options.messageResolver) ? options.messageResolver : _resolver || resolveWithKeyValue;
  const localeFallbacker = isFunction$1(options.localeFallbacker) ? options.localeFallbacker : _fallbacker || fallbackWithSimple;
  const fallbackContext = isObject$1(options.fallbackContext) ? options.fallbackContext : void 0;
  const internalOptions = options;
  const __datetimeFormatters = isObject$1(internalOptions.__datetimeFormatters) ? internalOptions.__datetimeFormatters : /* @__PURE__ */ new Map();
  const __numberFormatters = isObject$1(internalOptions.__numberFormatters) ? internalOptions.__numberFormatters : /* @__PURE__ */ new Map();
  const __meta = isObject$1(internalOptions.__meta) ? internalOptions.__meta : {};
  _cid++;
  const context = {
    version,
    cid: _cid,
    locale,
    fallbackLocale,
    messages: messages2,
    modifiers,
    pluralRules,
    missing,
    missingWarn,
    fallbackWarn,
    fallbackFormat,
    unresolving,
    postTranslation,
    processor,
    warnHtmlMessage,
    escapeParameter,
    messageCompiler,
    messageResolver,
    localeFallbacker,
    fallbackContext,
    onWarn,
    __meta
  };
  {
    context.datetimeFormats = datetimeFormats;
    context.numberFormats = numberFormats;
    context.__datetimeFormatters = __datetimeFormatters;
    context.__numberFormatters = __numberFormatters;
  }
  return context;
}
const createResources = (locale) => ({ [locale]: create() });
function handleMissing(context, key, locale, missingWarn, type) {
  const { missing, onWarn } = context;
  if (missing !== null) {
    const ret = missing(context, locale, key, type);
    return isString(ret) ? ret : key;
  } else {
    return key;
  }
}
function updateFallbackLocale(ctx, locale, fallback) {
  const context = ctx;
  context.__localeChainCache = /* @__PURE__ */ new Map();
  ctx.localeFallbacker(ctx, fallback, locale);
}
function isAlmostSameLocale(locale, compareLocale) {
  if (locale === compareLocale)
    return false;
  return locale.split("-")[0] === compareLocale.split("-")[0];
}
function isImplicitFallback(targetLocale, locales) {
  const index = locales.indexOf(targetLocale);
  if (index === -1) {
    return false;
  }
  for (let i = index + 1; i < locales.length; i++) {
    if (isAlmostSameLocale(targetLocale, locales[i])) {
      return true;
    }
  }
  return false;
}
function datetime(context, ...args) {
  const { datetimeFormats, unresolving, fallbackLocale, onWarn, localeFallbacker } = context;
  const { __datetimeFormatters } = context;
  const [key, value, options, overrides] = parseDateTimeArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const part = !!options.part;
  const locale = getLocale(context, options);
  const locales = localeFallbacker(
    context,
    // eslint-disable-line @typescript-eslint/no-explicit-any
    fallbackLocale,
    locale
  );
  if (!isString(key) || key === "") {
    return new Intl.DateTimeFormat(locale, overrides).format(value);
  }
  let datetimeFormat = {};
  let targetLocale;
  let format2 = null;
  const type = "datetime format";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = locales[i];
    datetimeFormat = datetimeFormats[targetLocale] || {};
    format2 = datetimeFormat[key];
    if (isPlainObject(format2))
      break;
    handleMissing(context, key, targetLocale, missingWarn, type);
  }
  if (!isPlainObject(format2) || !isString(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let id = `${targetLocale}__${key}`;
  if (!isEmptyObject(overrides)) {
    id = `${id}__${JSON.stringify(overrides)}`;
  }
  let formatter = __datetimeFormatters.get(id);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(targetLocale, assign({}, format2, overrides));
    __datetimeFormatters.set(id, formatter);
  }
  return !part ? formatter.format(value) : formatter.formatToParts(value);
}
const DATETIME_FORMAT_OPTIONS_KEYS = [
  "localeMatcher",
  "weekday",
  "era",
  "year",
  "month",
  "day",
  "hour",
  "minute",
  "second",
  "timeZoneName",
  "formatMatcher",
  "hour12",
  "timeZone",
  "dateStyle",
  "timeStyle",
  "calendar",
  "dayPeriod",
  "numberingSystem",
  "hourCycle",
  "fractionalSecondDigits"
];
function parseDateTimeArgs(...args) {
  const [arg1, arg2, arg3, arg4] = args;
  const options = create();
  let overrides = create();
  let value;
  if (isString(arg1)) {
    const matches = arg1.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);
    if (!matches) {
      throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT);
    }
    const dateTime = matches[3] ? matches[3].trim().startsWith("T") ? `${matches[1].trim()}${matches[3].trim()}` : `${matches[1].trim()}T${matches[3].trim()}` : matches[1].trim();
    value = new Date(dateTime);
    try {
      value.toISOString();
    } catch {
      throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT);
    }
  } else if (isDate(arg1)) {
    if (isNaN(arg1.getTime())) {
      throw createCoreError(CoreErrorCodes.INVALID_DATE_ARGUMENT);
    }
    value = arg1;
  } else if (isNumber(arg1)) {
    value = arg1;
  } else {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  if (isString(arg2)) {
    options.key = arg2;
  } else if (isPlainObject(arg2)) {
    Object.keys(arg2).forEach((key) => {
      if (DATETIME_FORMAT_OPTIONS_KEYS.includes(key)) {
        overrides[key] = arg2[key];
      } else {
        options[key] = arg2[key];
      }
    });
  }
  if (isString(arg3)) {
    options.locale = arg3;
  } else if (isPlainObject(arg3)) {
    overrides = arg3;
  }
  if (isPlainObject(arg4)) {
    overrides = arg4;
  }
  return [options.key || "", value, options, overrides];
}
function clearDateTimeFormat(ctx, locale, format2) {
  const context = ctx;
  for (const key in format2) {
    const id = `${locale}__${key}`;
    if (!context.__datetimeFormatters.has(id)) {
      continue;
    }
    context.__datetimeFormatters.delete(id);
  }
}
function number(context, ...args) {
  const { numberFormats, unresolving, fallbackLocale, onWarn, localeFallbacker } = context;
  const { __numberFormatters } = context;
  const [key, value, options, overrides] = parseNumberArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const part = !!options.part;
  const locale = getLocale(context, options);
  const locales = localeFallbacker(
    context,
    // eslint-disable-line @typescript-eslint/no-explicit-any
    fallbackLocale,
    locale
  );
  if (!isString(key) || key === "") {
    return new Intl.NumberFormat(locale, overrides).format(value);
  }
  let numberFormat = {};
  let targetLocale;
  let format2 = null;
  const type = "number format";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = locales[i];
    numberFormat = numberFormats[targetLocale] || {};
    format2 = numberFormat[key];
    if (isPlainObject(format2))
      break;
    handleMissing(context, key, targetLocale, missingWarn, type);
  }
  if (!isPlainObject(format2) || !isString(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let id = `${targetLocale}__${key}`;
  if (!isEmptyObject(overrides)) {
    id = `${id}__${JSON.stringify(overrides)}`;
  }
  let formatter = __numberFormatters.get(id);
  if (!formatter) {
    formatter = new Intl.NumberFormat(targetLocale, assign({}, format2, overrides));
    __numberFormatters.set(id, formatter);
  }
  return !part ? formatter.format(value) : formatter.formatToParts(value);
}
const NUMBER_FORMAT_OPTIONS_KEYS = [
  "localeMatcher",
  "style",
  "currency",
  "currencyDisplay",
  "currencySign",
  "useGrouping",
  "minimumIntegerDigits",
  "minimumFractionDigits",
  "maximumFractionDigits",
  "minimumSignificantDigits",
  "maximumSignificantDigits",
  "compactDisplay",
  "notation",
  "signDisplay",
  "unit",
  "unitDisplay",
  "roundingMode",
  "roundingPriority",
  "roundingIncrement",
  "trailingZeroDisplay"
];
function parseNumberArgs(...args) {
  const [arg1, arg2, arg3, arg4] = args;
  const options = create();
  let overrides = create();
  if (!isNumber(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  const value = arg1;
  if (isString(arg2)) {
    options.key = arg2;
  } else if (isPlainObject(arg2)) {
    Object.keys(arg2).forEach((key) => {
      if (NUMBER_FORMAT_OPTIONS_KEYS.includes(key)) {
        overrides[key] = arg2[key];
      } else {
        options[key] = arg2[key];
      }
    });
  }
  if (isString(arg3)) {
    options.locale = arg3;
  } else if (isPlainObject(arg3)) {
    overrides = arg3;
  }
  if (isPlainObject(arg4)) {
    overrides = arg4;
  }
  return [options.key || "", value, options, overrides];
}
function clearNumberFormat(ctx, locale, format2) {
  const context = ctx;
  for (const key in format2) {
    const id = `${locale}__${key}`;
    if (!context.__numberFormatters.has(id)) {
      continue;
    }
    context.__numberFormatters.delete(id);
  }
}
const DEFAULT_MODIFIER = (str) => str;
const DEFAULT_MESSAGE = (ctx) => "";
const DEFAULT_MESSAGE_DATA_TYPE = "text";
const DEFAULT_NORMALIZE = (values) => values.length === 0 ? "" : join(values);
const DEFAULT_INTERPOLATE = toDisplayString;
function pluralDefault(choice, choicesLength) {
  choice = Math.abs(choice);
  if (choicesLength === 2) {
    return choice ? choice > 1 ? 1 : 0 : 1;
  }
  return choice ? Math.min(choice, 2) : 0;
}
function getPluralIndex(options) {
  const index = isNumber(options.pluralIndex) ? options.pluralIndex : -1;
  return options.named && (isNumber(options.named.count) || isNumber(options.named.n)) ? isNumber(options.named.count) ? options.named.count : isNumber(options.named.n) ? options.named.n : index : index;
}
function normalizeNamed(pluralIndex, props) {
  if (!props.count) {
    props.count = pluralIndex;
  }
  if (!props.n) {
    props.n = pluralIndex;
  }
}
function createMessageContext(options = {}) {
  const locale = options.locale;
  const pluralIndex = getPluralIndex(options);
  const pluralRule = isObject$1(options.pluralRules) && isString(locale) && isFunction$1(options.pluralRules[locale]) ? options.pluralRules[locale] : pluralDefault;
  const orgPluralRule = isObject$1(options.pluralRules) && isString(locale) && isFunction$1(options.pluralRules[locale]) ? pluralDefault : void 0;
  const plural = (messages2) => {
    return messages2[pluralRule(pluralIndex, messages2.length, orgPluralRule)];
  };
  const _list = options.list || [];
  const list = (index) => _list[index];
  const _named = options.named || create();
  isNumber(options.pluralIndex) && normalizeNamed(pluralIndex, _named);
  const named = (key) => _named[key];
  function message(key, useLinked) {
    const msg = isFunction$1(options.messages) ? options.messages(key, !!useLinked) : isObject$1(options.messages) ? options.messages[key] : false;
    return !msg ? options.parent ? options.parent.message(key) : DEFAULT_MESSAGE : msg;
  }
  const _modifier = (name2) => options.modifiers ? options.modifiers[name2] : DEFAULT_MODIFIER;
  const normalize = isPlainObject(options.processor) && isFunction$1(options.processor.normalize) ? options.processor.normalize : DEFAULT_NORMALIZE;
  const interpolate = isPlainObject(options.processor) && isFunction$1(options.processor.interpolate) ? options.processor.interpolate : DEFAULT_INTERPOLATE;
  const type = isPlainObject(options.processor) && isString(options.processor.type) ? options.processor.type : DEFAULT_MESSAGE_DATA_TYPE;
  const linked = (key, ...args) => {
    const [arg1, arg2] = args;
    let type2 = "text";
    let modifier = "";
    if (args.length === 1) {
      if (isObject$1(arg1)) {
        modifier = arg1.modifier || modifier;
        type2 = arg1.type || type2;
      } else if (isString(arg1)) {
        modifier = arg1 || modifier;
      }
    } else if (args.length === 2) {
      if (isString(arg1)) {
        modifier = arg1 || modifier;
      }
      if (isString(arg2)) {
        type2 = arg2 || type2;
      }
    }
    const ret = message(key, true)(ctx);
    const msg = (
      // The message in vnode resolved with linked are returned as an array by processor.nomalize
      type2 === "vnode" && isArray(ret) && modifier ? ret[0] : ret
    );
    return modifier ? _modifier(modifier)(msg, type2) : msg;
  };
  const ctx = {
    [
      "list"
      /* HelperNameMap.LIST */
    ]: list,
    [
      "named"
      /* HelperNameMap.NAMED */
    ]: named,
    [
      "plural"
      /* HelperNameMap.PLURAL */
    ]: plural,
    [
      "linked"
      /* HelperNameMap.LINKED */
    ]: linked,
    [
      "message"
      /* HelperNameMap.MESSAGE */
    ]: message,
    [
      "type"
      /* HelperNameMap.TYPE */
    ]: type,
    [
      "interpolate"
      /* HelperNameMap.INTERPOLATE */
    ]: interpolate,
    [
      "normalize"
      /* HelperNameMap.NORMALIZE */
    ]: normalize,
    [
      "values"
      /* HelperNameMap.VALUES */
    ]: assign(create(), _list, _named)
  };
  return ctx;
}
const NOOP_MESSAGE_FUNCTION = () => "";
const isMessageFunction = (val) => isFunction$1(val);
function translate(context, ...args) {
  const { fallbackFormat, postTranslation, unresolving, messageCompiler, fallbackLocale, messages: messages2 } = context;
  const [key, options] = parseTranslateArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  const fallbackWarn = isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const escapeParameter = isBoolean(options.escapeParameter) ? options.escapeParameter : context.escapeParameter;
  const resolvedMessage = !!options.resolvedMessage;
  const defaultMsgOrKey = isString(options.default) || isBoolean(options.default) ? !isBoolean(options.default) ? options.default : !messageCompiler ? () => key : key : fallbackFormat ? !messageCompiler ? () => key : key : null;
  const enableDefaultMsg = fallbackFormat || defaultMsgOrKey != null && (isString(defaultMsgOrKey) || isFunction$1(defaultMsgOrKey));
  const locale = getLocale(context, options);
  escapeParameter && escapeParams(options);
  let [formatScope, targetLocale, message] = !resolvedMessage ? resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) : [
    key,
    locale,
    messages2[locale] || create()
  ];
  let format2 = formatScope;
  let cacheBaseKey = key;
  if (!resolvedMessage && !(isString(format2) || isMessageAST(format2) || isMessageFunction(format2))) {
    if (enableDefaultMsg) {
      format2 = defaultMsgOrKey;
      cacheBaseKey = format2;
    }
  }
  if (!resolvedMessage && (!(isString(format2) || isMessageAST(format2) || isMessageFunction(format2)) || !isString(targetLocale))) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let occurred = false;
  const onError = () => {
    occurred = true;
  };
  const msg = !isMessageFunction(format2) ? compileMessageFormat(context, key, targetLocale, format2, cacheBaseKey, onError) : format2;
  if (occurred) {
    return format2;
  }
  const ctxOptions = getMessageContextOptions(context, targetLocale, message, options);
  const msgContext = createMessageContext(ctxOptions);
  const messaged = evaluateMessage(context, msg, msgContext);
  let ret = postTranslation ? postTranslation(messaged, key) : messaged;
  if (escapeParameter && isString(ret)) {
    ret = sanitizeTranslatedHtml(ret);
  }
  return ret;
}
function escapeParams(options) {
  if (isArray(options.list)) {
    options.list = options.list.map((item) => isString(item) ? escapeHtml(item) : item);
  } else if (isObject$1(options.named)) {
    Object.keys(options.named).forEach((key) => {
      if (isString(options.named[key])) {
        options.named[key] = escapeHtml(options.named[key]);
      }
    });
  }
}
function resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) {
  const { messages: messages2, onWarn, messageResolver: resolveValue2, localeFallbacker } = context;
  const locales = localeFallbacker(context, fallbackLocale, locale);
  let message = create();
  let targetLocale;
  let format2 = null;
  const type = "translate";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = locales[i];
    message = messages2[targetLocale] || create();
    if ((format2 = resolveValue2(message, key)) === null) {
      format2 = message[key];
    }
    if (isString(format2) || isMessageAST(format2) || isMessageFunction(format2)) {
      break;
    }
    if (!isImplicitFallback(targetLocale, locales)) {
      const missingRet = handleMissing(
        context,
        // eslint-disable-line @typescript-eslint/no-explicit-any
        key,
        targetLocale,
        missingWarn,
        type
      );
      if (missingRet !== key) {
        format2 = missingRet;
      }
    }
  }
  return [format2, targetLocale, message];
}
function compileMessageFormat(context, key, targetLocale, format2, cacheBaseKey, onError) {
  const { messageCompiler, warnHtmlMessage } = context;
  if (isMessageFunction(format2)) {
    const msg2 = format2;
    msg2.locale = msg2.locale || targetLocale;
    msg2.key = msg2.key || key;
    return msg2;
  }
  if (messageCompiler == null) {
    const msg2 = (() => format2);
    msg2.locale = targetLocale;
    msg2.key = key;
    return msg2;
  }
  const msg = messageCompiler(format2, getCompileContext(context, targetLocale, cacheBaseKey, format2, warnHtmlMessage, onError));
  msg.locale = targetLocale;
  msg.key = key;
  msg.source = format2;
  return msg;
}
function evaluateMessage(context, msg, msgCtx) {
  const messaged = msg(msgCtx);
  return messaged;
}
function parseTranslateArgs(...args) {
  const [arg1, arg2, arg3] = args;
  const options = create();
  if (!isString(arg1) && !isNumber(arg1) && !isMessageFunction(arg1) && !isMessageAST(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  const key = isNumber(arg1) ? String(arg1) : isMessageFunction(arg1) ? arg1 : arg1;
  if (isNumber(arg2)) {
    options.plural = arg2;
  } else if (isString(arg2)) {
    options.default = arg2;
  } else if (isPlainObject(arg2) && !isEmptyObject(arg2)) {
    options.named = arg2;
  } else if (isArray(arg2)) {
    options.list = arg2;
  }
  if (isNumber(arg3)) {
    options.plural = arg3;
  } else if (isString(arg3)) {
    options.default = arg3;
  } else if (isPlainObject(arg3)) {
    assign(options, arg3);
  }
  return [key, options];
}
function getCompileContext(context, locale, key, source, warnHtmlMessage, onError) {
  return {
    locale,
    key,
    warnHtmlMessage,
    onError: (err) => {
      onError && onError(err);
      {
        throw err;
      }
    },
    onCacheKey: (source2) => generateFormatCacheKey(locale, key, source2)
  };
}
function getMessageContextOptions(context, locale, message, options) {
  const { modifiers, pluralRules, messageResolver: resolveValue2, fallbackLocale, fallbackWarn, missingWarn, fallbackContext } = context;
  const resolveMessage = (key, useLinked) => {
    let val = resolveValue2(message, key);
    if (val == null && (fallbackContext || useLinked)) {
      const [, , message2] = resolveMessageFormat(
        fallbackContext || context,
        // NOTE: if has fallbackContext, fallback to root, else if use linked, fallback to local context
        key,
        locale,
        fallbackLocale,
        fallbackWarn,
        missingWarn
      );
      val = resolveValue2(message2, key);
    }
    if (isString(val) || isMessageAST(val)) {
      let occurred = false;
      const onError = () => {
        occurred = true;
      };
      const msg = compileMessageFormat(context, key, locale, val, key, onError);
      return !occurred ? msg : NOOP_MESSAGE_FUNCTION;
    } else if (isMessageFunction(val)) {
      return val;
    } else {
      return NOOP_MESSAGE_FUNCTION;
    }
  };
  const ctxOptions = {
    locale,
    modifiers,
    pluralRules,
    messages: resolveMessage
  };
  if (context.processor) {
    ctxOptions.processor = context.processor;
  }
  if (options.list) {
    ctxOptions.list = options.list;
  }
  if (options.named) {
    ctxOptions.named = options.named;
  }
  if (isNumber(options.plural)) {
    ctxOptions.pluralIndex = options.plural;
  }
  return ctxOptions;
}
const VERSION = "10.0.8";
const I18nErrorCodes = {
  // composer module errors
  UNEXPECTED_RETURN_TYPE: CORE_ERROR_CODES_EXTEND_POINT,
  // 24
  // legacy module errors
  INVALID_ARGUMENT: 25,
  // i18n module errors
  MUST_BE_CALL_SETUP_TOP: 26,
  NOT_INSTALLED: 27,
  // directive module errors
  REQUIRED_VALUE: 28,
  INVALID_VALUE: 29,
  NOT_INSTALLED_WITH_PROVIDE: 31,
  // unexpected error
  UNEXPECTED_ERROR: 32};
function createI18nError(code, ...args) {
  return createCompileError(code, null, void 0);
}
const TranslateVNodeSymbol = /* @__PURE__ */ makeSymbol("__translateVNode");
const DatetimePartsSymbol = /* @__PURE__ */ makeSymbol("__datetimeParts");
const NumberPartsSymbol = /* @__PURE__ */ makeSymbol("__numberParts");
const SetPluralRulesSymbol = makeSymbol("__setPluralRules");
const InejctWithOptionSymbol = /* @__PURE__ */ makeSymbol("__injectWithOption");
const DisposeSymbol = /* @__PURE__ */ makeSymbol("__dispose");
function handleFlatJson(obj) {
  if (!isObject$1(obj)) {
    return obj;
  }
  if (isMessageAST(obj)) {
    return obj;
  }
  for (const key in obj) {
    if (!hasOwn(obj, key)) {
      continue;
    }
    if (!key.includes(".")) {
      if (isObject$1(obj[key])) {
        handleFlatJson(obj[key]);
      }
    } else {
      const subKeys = key.split(".");
      const lastIndex = subKeys.length - 1;
      let currentObj = obj;
      let hasStringValue = false;
      for (let i = 0; i < lastIndex; i++) {
        if (subKeys[i] === "__proto__") {
          throw new Error(`unsafe key: ${subKeys[i]}`);
        }
        if (!(subKeys[i] in currentObj)) {
          currentObj[subKeys[i]] = create();
        }
        if (!isObject$1(currentObj[subKeys[i]])) {
          hasStringValue = true;
          break;
        }
        currentObj = currentObj[subKeys[i]];
      }
      if (!hasStringValue) {
        if (!isMessageAST(currentObj)) {
          currentObj[subKeys[lastIndex]] = obj[key];
          delete obj[key];
        } else {
          if (!AST_NODE_PROPS_KEYS.includes(subKeys[lastIndex])) {
            delete obj[key];
          }
        }
      }
      if (!isMessageAST(currentObj)) {
        const target = currentObj[subKeys[lastIndex]];
        if (isObject$1(target)) {
          handleFlatJson(target);
        }
      }
    }
  }
  return obj;
}
function getLocaleMessages(locale, options) {
  const { messages: messages2, __i18n, messageResolver, flatJson } = options;
  const ret = isPlainObject(messages2) ? messages2 : isArray(__i18n) ? create() : { [locale]: create() };
  if (isArray(__i18n)) {
    __i18n.forEach((custom) => {
      if ("locale" in custom && "resource" in custom) {
        const { locale: locale2, resource } = custom;
        if (locale2) {
          ret[locale2] = ret[locale2] || create();
          deepCopy(resource, ret[locale2]);
        } else {
          deepCopy(resource, ret);
        }
      } else {
        isString(custom) && deepCopy(JSON.parse(custom), ret);
      }
    });
  }
  if (messageResolver == null && flatJson) {
    for (const key in ret) {
      if (hasOwn(ret, key)) {
        handleFlatJson(ret[key]);
      }
    }
  }
  return ret;
}
function getComponentOptions(instance) {
  return instance.type;
}
function adjustI18nResources(gl, options, componentOptions) {
  let messages2 = isObject$1(options.messages) ? options.messages : create();
  if ("__i18nGlobal" in componentOptions) {
    messages2 = getLocaleMessages(gl.locale.value, {
      messages: messages2,
      __i18n: componentOptions.__i18nGlobal
    });
  }
  const locales = Object.keys(messages2);
  if (locales.length) {
    locales.forEach((locale) => {
      gl.mergeLocaleMessage(locale, messages2[locale]);
    });
  }
  {
    if (isObject$1(options.datetimeFormats)) {
      const locales2 = Object.keys(options.datetimeFormats);
      if (locales2.length) {
        locales2.forEach((locale) => {
          gl.mergeDateTimeFormat(locale, options.datetimeFormats[locale]);
        });
      }
    }
    if (isObject$1(options.numberFormats)) {
      const locales2 = Object.keys(options.numberFormats);
      if (locales2.length) {
        locales2.forEach((locale) => {
          gl.mergeNumberFormat(locale, options.numberFormats[locale]);
        });
      }
    }
  }
}
function createTextNode(key) {
  return createVNode(Text, null, key, 0);
}
const DEVTOOLS_META = "__INTLIFY_META__";
const NOOP_RETURN_ARRAY = () => [];
const NOOP_RETURN_FALSE = () => false;
let composerID = 0;
function defineCoreMissingHandler(missing) {
  return ((ctx, locale, key, type) => {
    return missing(locale, key, getCurrentInstance() || void 0, type);
  });
}
const getMetaInfo = /* @__NO_SIDE_EFFECTS__ */ () => {
  const instance = getCurrentInstance();
  let meta = null;
  return instance && (meta = getComponentOptions(instance)[DEVTOOLS_META]) ? { [DEVTOOLS_META]: meta } : null;
};
function createComposer(options = {}) {
  const { __root, __injectWithOption } = options;
  const _isGlobal = __root === void 0;
  const flatJson = options.flatJson;
  const _ref = shallowRef;
  let _inheritLocale = isBoolean(options.inheritLocale) ? options.inheritLocale : true;
  const _locale = _ref(
    // prettier-ignore
    __root && _inheritLocale ? __root.locale.value : isString(options.locale) ? options.locale : DEFAULT_LOCALE
  );
  const _fallbackLocale = _ref(
    // prettier-ignore
    __root && _inheritLocale ? __root.fallbackLocale.value : isString(options.fallbackLocale) || isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale.value
  );
  const _messages = _ref(getLocaleMessages(_locale.value, options));
  const _datetimeFormats = _ref(isPlainObject(options.datetimeFormats) ? options.datetimeFormats : { [_locale.value]: {} });
  const _numberFormats = _ref(isPlainObject(options.numberFormats) ? options.numberFormats : { [_locale.value]: {} });
  let _missingWarn = __root ? __root.missingWarn : isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
  let _fallbackWarn = __root ? __root.fallbackWarn : isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
  let _fallbackRoot = __root ? __root.fallbackRoot : isBoolean(options.fallbackRoot) ? options.fallbackRoot : true;
  let _fallbackFormat = !!options.fallbackFormat;
  let _missing = isFunction$1(options.missing) ? options.missing : null;
  let _runtimeMissing = isFunction$1(options.missing) ? defineCoreMissingHandler(options.missing) : null;
  let _postTranslation = isFunction$1(options.postTranslation) ? options.postTranslation : null;
  let _warnHtmlMessage = __root ? __root.warnHtmlMessage : isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
  let _escapeParameter = !!options.escapeParameter;
  const _modifiers = __root ? __root.modifiers : isPlainObject(options.modifiers) ? options.modifiers : {};
  let _pluralRules = options.pluralRules || __root && __root.pluralRules;
  let _context;
  const getCoreContext = () => {
    _isGlobal && setFallbackContext(null);
    const ctxOptions = {
      version: VERSION,
      locale: _locale.value,
      fallbackLocale: _fallbackLocale.value,
      messages: _messages.value,
      modifiers: _modifiers,
      pluralRules: _pluralRules,
      missing: _runtimeMissing === null ? void 0 : _runtimeMissing,
      missingWarn: _missingWarn,
      fallbackWarn: _fallbackWarn,
      fallbackFormat: _fallbackFormat,
      unresolving: true,
      postTranslation: _postTranslation === null ? void 0 : _postTranslation,
      warnHtmlMessage: _warnHtmlMessage,
      escapeParameter: _escapeParameter,
      messageResolver: options.messageResolver,
      messageCompiler: options.messageCompiler,
      __meta: { framework: "vue" }
    };
    {
      ctxOptions.datetimeFormats = _datetimeFormats.value;
      ctxOptions.numberFormats = _numberFormats.value;
      ctxOptions.__datetimeFormatters = isPlainObject(_context) ? _context.__datetimeFormatters : void 0;
      ctxOptions.__numberFormatters = isPlainObject(_context) ? _context.__numberFormatters : void 0;
    }
    const ctx = createCoreContext(ctxOptions);
    _isGlobal && setFallbackContext(ctx);
    return ctx;
  };
  _context = getCoreContext();
  updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
  function trackReactivityValues() {
    return [
      _locale.value,
      _fallbackLocale.value,
      _messages.value,
      _datetimeFormats.value,
      _numberFormats.value
    ];
  }
  const locale = computed({
    get: () => _locale.value,
    set: (val) => {
      _locale.value = val;
      _context.locale = _locale.value;
    }
  });
  const fallbackLocale = computed({
    get: () => _fallbackLocale.value,
    set: (val) => {
      _fallbackLocale.value = val;
      _context.fallbackLocale = _fallbackLocale.value;
      updateFallbackLocale(_context, _locale.value, val);
    }
  });
  const messages2 = computed(() => _messages.value);
  const datetimeFormats = /* @__PURE__ */ computed(() => _datetimeFormats.value);
  const numberFormats = /* @__PURE__ */ computed(() => _numberFormats.value);
  function getPostTranslationHandler() {
    return isFunction$1(_postTranslation) ? _postTranslation : null;
  }
  function setPostTranslationHandler(handler) {
    _postTranslation = handler;
    _context.postTranslation = handler;
  }
  function getMissingHandler() {
    return _missing;
  }
  function setMissingHandler(handler) {
    if (handler !== null) {
      _runtimeMissing = defineCoreMissingHandler(handler);
    }
    _missing = handler;
    _context.missing = _runtimeMissing;
  }
  const wrapWithDeps = (fn, argumentParser, warnType, fallbackSuccess, fallbackFail, successCondition) => {
    trackReactivityValues();
    let ret;
    try {
      if ("production" !== "production" || false) ;
      if (!_isGlobal) {
        _context.fallbackContext = __root ? getFallbackContext() : void 0;
      }
      ret = fn(_context);
    } finally {
      if (!_isGlobal) {
        _context.fallbackContext = void 0;
      }
    }
    if (warnType !== "translate exists" && // for not `te` (e.g `t`)
    isNumber(ret) && ret === NOT_REOSLVED || warnType === "translate exists" && !ret) {
      const [key, arg2] = argumentParser();
      return __root && _fallbackRoot ? fallbackSuccess(__root) : fallbackFail(key);
    } else if (successCondition(ret)) {
      return ret;
    } else {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_RETURN_TYPE);
    }
  };
  function t2(...args) {
    return wrapWithDeps((context) => Reflect.apply(translate, null, [context, ...args]), () => parseTranslateArgs(...args), "translate", (root) => Reflect.apply(root.t, root, [...args]), (key) => key, (val) => isString(val));
  }
  function rt(...args) {
    const [arg1, arg2, arg3] = args;
    if (arg3 && !isObject$1(arg3)) {
      throw createI18nError(I18nErrorCodes.INVALID_ARGUMENT);
    }
    return t2(...[arg1, arg2, assign({ resolvedMessage: true }, arg3 || {})]);
  }
  function d(...args) {
    return wrapWithDeps((context) => Reflect.apply(datetime, null, [context, ...args]), () => parseDateTimeArgs(...args), "datetime format", (root) => Reflect.apply(root.d, root, [...args]), () => MISSING_RESOLVE_VALUE, (val) => isString(val));
  }
  function n(...args) {
    return wrapWithDeps((context) => Reflect.apply(number, null, [context, ...args]), () => parseNumberArgs(...args), "number format", (root) => Reflect.apply(root.n, root, [...args]), () => MISSING_RESOLVE_VALUE, (val) => isString(val));
  }
  function normalize(values) {
    return values.map((val) => isString(val) || isNumber(val) || isBoolean(val) ? createTextNode(String(val)) : val);
  }
  const interpolate = (val) => val;
  const processor = {
    normalize,
    interpolate,
    type: "vnode"
  };
  function translateVNode(...args) {
    return wrapWithDeps((context) => {
      let ret;
      const _context2 = context;
      try {
        _context2.processor = processor;
        ret = Reflect.apply(translate, null, [_context2, ...args]);
      } finally {
        _context2.processor = null;
      }
      return ret;
    }, () => parseTranslateArgs(...args), "translate", (root) => root[TranslateVNodeSymbol](...args), (key) => [createTextNode(key)], (val) => isArray(val));
  }
  function numberParts(...args) {
    return wrapWithDeps((context) => Reflect.apply(number, null, [context, ...args]), () => parseNumberArgs(...args), "number format", (root) => root[NumberPartsSymbol](...args), NOOP_RETURN_ARRAY, (val) => isString(val) || isArray(val));
  }
  function datetimeParts(...args) {
    return wrapWithDeps((context) => Reflect.apply(datetime, null, [context, ...args]), () => parseDateTimeArgs(...args), "datetime format", (root) => root[DatetimePartsSymbol](...args), NOOP_RETURN_ARRAY, (val) => isString(val) || isArray(val));
  }
  function setPluralRules(rules) {
    _pluralRules = rules;
    _context.pluralRules = _pluralRules;
  }
  function te(key, locale2) {
    return wrapWithDeps(() => {
      if (!key) {
        return false;
      }
      const targetLocale = isString(locale2) ? locale2 : _locale.value;
      const message = getLocaleMessage(targetLocale);
      const resolved = _context.messageResolver(message, key);
      return isMessageAST(resolved) || isMessageFunction(resolved) || isString(resolved);
    }, () => [key], "translate exists", (root) => {
      return Reflect.apply(root.te, root, [key, locale2]);
    }, NOOP_RETURN_FALSE, (val) => isBoolean(val));
  }
  function resolveMessages(key) {
    let messages22 = null;
    const locales = fallbackWithLocaleChain(_context, _fallbackLocale.value, _locale.value);
    for (let i = 0; i < locales.length; i++) {
      const targetLocaleMessages = _messages.value[locales[i]] || {};
      const messageValue = _context.messageResolver(targetLocaleMessages, key);
      if (messageValue != null) {
        messages22 = messageValue;
        break;
      }
    }
    return messages22;
  }
  function tm(key) {
    const messages22 = resolveMessages(key);
    return messages22 != null ? messages22 : __root ? __root.tm(key) || {} : {};
  }
  function getLocaleMessage(locale2) {
    return _messages.value[locale2] || {};
  }
  function setLocaleMessage(locale2, message) {
    if (flatJson) {
      const _message = { [locale2]: message };
      for (const key in _message) {
        if (hasOwn(_message, key)) {
          handleFlatJson(_message[key]);
        }
      }
      message = _message[locale2];
    }
    _messages.value[locale2] = message;
    _context.messages = _messages.value;
  }
  function mergeLocaleMessage(locale2, message) {
    _messages.value[locale2] = _messages.value[locale2] || {};
    const _message = { [locale2]: message };
    if (flatJson) {
      for (const key in _message) {
        if (hasOwn(_message, key)) {
          handleFlatJson(_message[key]);
        }
      }
    }
    message = _message[locale2];
    deepCopy(message, _messages.value[locale2]);
    _context.messages = _messages.value;
  }
  function getDateTimeFormat(locale2) {
    return _datetimeFormats.value[locale2] || {};
  }
  function setDateTimeFormat(locale2, format2) {
    _datetimeFormats.value[locale2] = format2;
    _context.datetimeFormats = _datetimeFormats.value;
    clearDateTimeFormat(_context, locale2, format2);
  }
  function mergeDateTimeFormat(locale2, format2) {
    _datetimeFormats.value[locale2] = assign(_datetimeFormats.value[locale2] || {}, format2);
    _context.datetimeFormats = _datetimeFormats.value;
    clearDateTimeFormat(_context, locale2, format2);
  }
  function getNumberFormat(locale2) {
    return _numberFormats.value[locale2] || {};
  }
  function setNumberFormat(locale2, format2) {
    _numberFormats.value[locale2] = format2;
    _context.numberFormats = _numberFormats.value;
    clearNumberFormat(_context, locale2, format2);
  }
  function mergeNumberFormat(locale2, format2) {
    _numberFormats.value[locale2] = assign(_numberFormats.value[locale2] || {}, format2);
    _context.numberFormats = _numberFormats.value;
    clearNumberFormat(_context, locale2, format2);
  }
  composerID++;
  const composer = {
    id: composerID,
    locale,
    fallbackLocale,
    get inheritLocale() {
      return _inheritLocale;
    },
    set inheritLocale(val) {
      _inheritLocale = val;
      if (val && __root) {
        _locale.value = __root.locale.value;
        _fallbackLocale.value = __root.fallbackLocale.value;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    },
    get availableLocales() {
      return Object.keys(_messages.value).sort();
    },
    messages: messages2,
    get modifiers() {
      return _modifiers;
    },
    get pluralRules() {
      return _pluralRules || {};
    },
    get isGlobal() {
      return _isGlobal;
    },
    get missingWarn() {
      return _missingWarn;
    },
    set missingWarn(val) {
      _missingWarn = val;
      _context.missingWarn = _missingWarn;
    },
    get fallbackWarn() {
      return _fallbackWarn;
    },
    set fallbackWarn(val) {
      _fallbackWarn = val;
      _context.fallbackWarn = _fallbackWarn;
    },
    get fallbackRoot() {
      return _fallbackRoot;
    },
    set fallbackRoot(val) {
      _fallbackRoot = val;
    },
    get fallbackFormat() {
      return _fallbackFormat;
    },
    set fallbackFormat(val) {
      _fallbackFormat = val;
      _context.fallbackFormat = _fallbackFormat;
    },
    get warnHtmlMessage() {
      return _warnHtmlMessage;
    },
    set warnHtmlMessage(val) {
      _warnHtmlMessage = val;
      _context.warnHtmlMessage = val;
    },
    get escapeParameter() {
      return _escapeParameter;
    },
    set escapeParameter(val) {
      _escapeParameter = val;
      _context.escapeParameter = val;
    },
    t: t2,
    getLocaleMessage,
    setLocaleMessage,
    mergeLocaleMessage,
    getPostTranslationHandler,
    setPostTranslationHandler,
    getMissingHandler,
    setMissingHandler,
    [SetPluralRulesSymbol]: setPluralRules
  };
  {
    composer.datetimeFormats = datetimeFormats;
    composer.numberFormats = numberFormats;
    composer.rt = rt;
    composer.te = te;
    composer.tm = tm;
    composer.d = d;
    composer.n = n;
    composer.getDateTimeFormat = getDateTimeFormat;
    composer.setDateTimeFormat = setDateTimeFormat;
    composer.mergeDateTimeFormat = mergeDateTimeFormat;
    composer.getNumberFormat = getNumberFormat;
    composer.setNumberFormat = setNumberFormat;
    composer.mergeNumberFormat = mergeNumberFormat;
    composer[InejctWithOptionSymbol] = __injectWithOption;
    composer[TranslateVNodeSymbol] = translateVNode;
    composer[DatetimePartsSymbol] = datetimeParts;
    composer[NumberPartsSymbol] = numberParts;
  }
  return composer;
}
const baseFormatProps = {
  tag: {
    type: [String, Object]
  },
  locale: {
    type: String
  },
  scope: {
    type: String,
    // NOTE: avoid https://github.com/microsoft/rushstack/issues/1050
    validator: (val) => val === "parent" || val === "global",
    default: "parent"
    /* ComponentI18nScope */
  },
  i18n: {
    type: Object
  }
};
function getInterpolateArg({ slots }, keys) {
  if (keys.length === 1 && keys[0] === "default") {
    const ret = slots.default ? slots.default() : [];
    return ret.reduce((slot, current2) => {
      return [
        ...slot,
        // prettier-ignore
        ...current2.type === Fragment ? current2.children : [current2]
      ];
    }, []);
  } else {
    return keys.reduce((arg, key) => {
      const slot = slots[key];
      if (slot) {
        arg[key] = slot();
      }
      return arg;
    }, create());
  }
}
function getFragmentableTag() {
  return Fragment;
}
const TranslationImpl = /* @__PURE__ */ defineComponent({
  /* eslint-disable */
  name: "i18n-t",
  props: assign({
    keypath: {
      type: String,
      required: true
    },
    plural: {
      type: [Number, String],
      validator: (val) => isNumber(val) || !isNaN(val)
    }
  }, baseFormatProps),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props, context) {
    const { slots, attrs } = context;
    const i18n = props.i18n || useI18n({
      useScope: props.scope,
      __useComponent: true
    });
    return () => {
      const keys = Object.keys(slots).filter((key) => key !== "_");
      const options = create();
      if (props.locale) {
        options.locale = props.locale;
      }
      if (props.plural !== void 0) {
        options.plural = isString(props.plural) ? +props.plural : props.plural;
      }
      const arg = getInterpolateArg(context, keys);
      const children = i18n[TranslateVNodeSymbol](props.keypath, arg, options);
      const assignedAttrs = assign(create(), attrs);
      const tag = isString(props.tag) || isObject$1(props.tag) ? props.tag : getFragmentableTag();
      return h(tag, assignedAttrs, children);
    };
  }
});
const Translation = TranslationImpl;
function isVNode(target) {
  return isArray(target) && !isString(target[0]);
}
function renderFormatter(props, context, slotKeys, partFormatter) {
  const { slots, attrs } = context;
  return () => {
    const options = { part: true };
    let overrides = create();
    if (props.locale) {
      options.locale = props.locale;
    }
    if (isString(props.format)) {
      options.key = props.format;
    } else if (isObject$1(props.format)) {
      if (isString(props.format.key)) {
        options.key = props.format.key;
      }
      overrides = Object.keys(props.format).reduce((options2, prop) => {
        return slotKeys.includes(prop) ? assign(create(), options2, { [prop]: props.format[prop] }) : options2;
      }, create());
    }
    const parts = partFormatter(...[props.value, options, overrides]);
    let children = [options.key];
    if (isArray(parts)) {
      children = parts.map((part, index) => {
        const slot = slots[part.type];
        const node = slot ? slot({ [part.type]: part.value, index, parts }) : [part.value];
        if (isVNode(node)) {
          node[0].key = `${part.type}-${index}`;
        }
        return node;
      });
    } else if (isString(parts)) {
      children = [parts];
    }
    const assignedAttrs = assign(create(), attrs);
    const tag = isString(props.tag) || isObject$1(props.tag) ? props.tag : getFragmentableTag();
    return h(tag, assignedAttrs, children);
  };
}
const NumberFormatImpl = /* @__PURE__ */ defineComponent({
  /* eslint-disable */
  name: "i18n-n",
  props: assign({
    value: {
      type: Number,
      required: true
    },
    format: {
      type: [String, Object]
    }
  }, baseFormatProps),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props, context) {
    const i18n = props.i18n || useI18n({
      useScope: props.scope,
      __useComponent: true
    });
    return renderFormatter(props, context, NUMBER_FORMAT_OPTIONS_KEYS, (...args) => (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      i18n[NumberPartsSymbol](...args)
    ));
  }
});
const NumberFormat = NumberFormatImpl;
const DatetimeFormatImpl = /* @__PURE__ */ defineComponent({
  /* eslint-disable */
  name: "i18n-d",
  props: assign({
    value: {
      type: [Number, Date],
      required: true
    },
    format: {
      type: [String, Object]
    }
  }, baseFormatProps),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props, context) {
    const i18n = props.i18n || useI18n({
      useScope: props.scope,
      __useComponent: true
    });
    return renderFormatter(props, context, DATETIME_FORMAT_OPTIONS_KEYS, (...args) => (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      i18n[DatetimePartsSymbol](...args)
    ));
  }
});
const DatetimeFormat = DatetimeFormatImpl;
function getComposer$1(i18n, instance) {
  const i18nInternal = i18n;
  if (i18n.mode === "composition") {
    return i18nInternal.__getInstance(instance) || i18n.global;
  } else {
    const vueI18n = i18nInternal.__getInstance(instance);
    return vueI18n != null ? vueI18n.__composer : i18n.global.__composer;
  }
}
function vTDirective(i18n) {
  const _process = (binding) => {
    const { instance, value } = binding;
    if (!instance || !instance.$) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    const composer = getComposer$1(i18n, instance.$);
    const parsedValue = parseValue(value);
    return [
      Reflect.apply(composer.t, composer, [...makeParams(parsedValue)]),
      composer
    ];
  };
  const register = (el, binding) => {
    const [textContent, composer] = _process(binding);
    el.__composer = composer;
    el.textContent = textContent;
  };
  const unregister = (el) => {
    if (el.__composer) {
      el.__composer = void 0;
      delete el.__composer;
    }
  };
  const update = (el, { value }) => {
    if (el.__composer) {
      const composer = el.__composer;
      const parsedValue = parseValue(value);
      el.textContent = Reflect.apply(composer.t, composer, [
        ...makeParams(parsedValue)
      ]);
    }
  };
  const getSSRProps = (binding) => {
    const [textContent] = _process(binding);
    return { textContent };
  };
  return {
    created: register,
    unmounted: unregister,
    beforeUpdate: update,
    getSSRProps
  };
}
function parseValue(value) {
  if (isString(value)) {
    return { path: value };
  } else if (isPlainObject(value)) {
    if (!("path" in value)) {
      throw createI18nError(I18nErrorCodes.REQUIRED_VALUE, "path");
    }
    return value;
  } else {
    throw createI18nError(I18nErrorCodes.INVALID_VALUE);
  }
}
function makeParams(value) {
  const { path, locale, args, choice, plural } = value;
  const options = {};
  const named = args || {};
  if (isString(locale)) {
    options.locale = locale;
  }
  if (isNumber(choice)) {
    options.plural = choice;
  }
  if (isNumber(plural)) {
    options.plural = plural;
  }
  return [path, named, options];
}
function apply(app, i18n, ...options) {
  const pluginOptions = isPlainObject(options[0]) ? options[0] : {};
  const globalInstall = isBoolean(pluginOptions.globalInstall) ? pluginOptions.globalInstall : true;
  if (globalInstall) {
    [Translation.name, "I18nT"].forEach((name2) => app.component(name2, Translation));
    [NumberFormat.name, "I18nN"].forEach((name2) => app.component(name2, NumberFormat));
    [DatetimeFormat.name, "I18nD"].forEach((name2) => app.component(name2, DatetimeFormat));
  }
  {
    app.directive("t", vTDirective(i18n));
  }
}
const I18nInjectionKey = /* @__PURE__ */ makeSymbol("global-vue-i18n");
function createI18n(options = {}, VueI18nLegacy) {
  const __globalInjection = isBoolean(options.globalInjection) ? options.globalInjection : true;
  const __instances = /* @__PURE__ */ new Map();
  const [globalScope, __global] = createGlobal(options);
  const symbol = /* @__PURE__ */ makeSymbol("");
  function __getInstance(component) {
    return __instances.get(component) || null;
  }
  function __setInstance(component, instance) {
    __instances.set(component, instance);
  }
  function __deleteInstance(component) {
    __instances.delete(component);
  }
  const i18n = {
    // mode
    get mode() {
      return "composition";
    },
    // install plugin
    async install(app, ...options2) {
      app.__VUE_I18N_SYMBOL__ = symbol;
      app.provide(app.__VUE_I18N_SYMBOL__, i18n);
      if (isPlainObject(options2[0])) {
        const opts = options2[0];
        i18n.__composerExtend = opts.__composerExtend;
        i18n.__vueI18nExtend = opts.__vueI18nExtend;
      }
      let globalReleaseHandler = null;
      if (__globalInjection) {
        globalReleaseHandler = injectGlobalFields(app, i18n.global);
      }
      {
        apply(app, i18n, ...options2);
      }
      const unmountApp = app.unmount;
      app.unmount = () => {
        globalReleaseHandler && globalReleaseHandler();
        i18n.dispose();
        unmountApp();
      };
    },
    // global accessor
    get global() {
      return __global;
    },
    dispose() {
      globalScope.stop();
    },
    // @internal
    __instances,
    // @internal
    __getInstance,
    // @internal
    __setInstance,
    // @internal
    __deleteInstance
  };
  return i18n;
}
function useI18n(options = {}) {
  const instance = getCurrentInstance();
  if (instance == null) {
    throw createI18nError(I18nErrorCodes.MUST_BE_CALL_SETUP_TOP);
  }
  if (!instance.isCE && instance.appContext.app != null && !instance.appContext.app.__VUE_I18N_SYMBOL__) {
    throw createI18nError(I18nErrorCodes.NOT_INSTALLED);
  }
  const i18n = getI18nInstance(instance);
  const gl = getGlobalComposer(i18n);
  const componentOptions = getComponentOptions(instance);
  const scope = getScope(options, componentOptions);
  if (scope === "global") {
    adjustI18nResources(gl, options, componentOptions);
    return gl;
  }
  if (scope === "parent") {
    let composer2 = getComposer(i18n, instance, options.__useComponent);
    if (composer2 == null) {
      composer2 = gl;
    }
    return composer2;
  }
  const i18nInternal = i18n;
  let composer = i18nInternal.__getInstance(instance);
  if (composer == null) {
    const composerOptions = assign({}, options);
    if ("__i18n" in componentOptions) {
      composerOptions.__i18n = componentOptions.__i18n;
    }
    if (gl) {
      composerOptions.__root = gl;
    }
    composer = createComposer(composerOptions);
    if (i18nInternal.__composerExtend) {
      composer[DisposeSymbol] = i18nInternal.__composerExtend(composer);
    }
    i18nInternal.__setInstance(instance, composer);
  }
  return composer;
}
function createGlobal(options, legacyMode, VueI18nLegacy) {
  const scope = effectScope();
  const obj = scope.run(() => createComposer(options));
  if (obj == null) {
    throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
  }
  return [scope, obj];
}
function getI18nInstance(instance) {
  const i18n = inject(!instance.isCE ? instance.appContext.app.__VUE_I18N_SYMBOL__ : I18nInjectionKey);
  if (!i18n) {
    throw createI18nError(!instance.isCE ? I18nErrorCodes.UNEXPECTED_ERROR : I18nErrorCodes.NOT_INSTALLED_WITH_PROVIDE);
  }
  return i18n;
}
function getScope(options, componentOptions) {
  return isEmptyObject(options) ? "__i18n" in componentOptions ? "local" : "global" : !options.useScope ? "local" : options.useScope;
}
function getGlobalComposer(i18n) {
  return i18n.mode === "composition" ? i18n.global : i18n.global.__composer;
}
function getComposer(i18n, target, useComponent = false) {
  let composer = null;
  const root = target.root;
  let current2 = getParentComponentInstance(target, useComponent);
  while (current2 != null) {
    const i18nInternal = i18n;
    if (i18n.mode === "composition") {
      composer = i18nInternal.__getInstance(current2);
    }
    if (composer != null) {
      break;
    }
    if (root === current2) {
      break;
    }
    current2 = current2.parent;
  }
  return composer;
}
function getParentComponentInstance(target, useComponent = false) {
  if (target == null) {
    return null;
  }
  return !useComponent ? target.parent : target.vnode.ctx || target.parent;
}
const globalExportProps = [
  "locale",
  "fallbackLocale",
  "availableLocales"
];
const globalExportMethods = ["t", "rt", "d", "n", "tm", "te"];
function injectGlobalFields(app, composer) {
  const i18n = /* @__PURE__ */ Object.create(null);
  globalExportProps.forEach((prop) => {
    const desc = Object.getOwnPropertyDescriptor(composer, prop);
    if (!desc) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    const wrap = isRef(desc.value) ? {
      get() {
        return desc.value.value;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set(val) {
        desc.value.value = val;
      }
    } : {
      get() {
        return desc.get && desc.get();
      }
    };
    Object.defineProperty(i18n, prop, wrap);
  });
  app.config.globalProperties.$i18n = i18n;
  globalExportMethods.forEach((method) => {
    const desc = Object.getOwnPropertyDescriptor(composer, method);
    if (!desc || !desc.value) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    Object.defineProperty(app.config.globalProperties, `$${method}`, desc);
  });
  const dispose = () => {
    delete app.config.globalProperties.$i18n;
    globalExportMethods.forEach((method) => {
      delete app.config.globalProperties[`$${method}`];
    });
  };
  return dispose;
}
registerMessageCompiler(compile);
registerMessageResolver(resolveValue);
registerLocaleFallbacker(fallbackWithLocaleChain);
function useRouteBaseName() {
  return wrapComposable(getRouteBaseName);
}
function useLocalePath() {
  return wrapComposable(localePath);
}
function useLocaleRoute() {
  return wrapComposable(localeRoute);
}
function useLocaleLocation() {
  return wrapComposable(localeRoute);
}
function useSwitchLocalePath() {
  return wrapComposable(switchLocalePath);
}
const switch_locale_path_ssr_NflG9_QeVcJ1jVig0vCfxB_cZhpEMQ9U2ujRUiYbbVw = /* @__PURE__ */ defineNuxtPlugin({
  name: "i18n:plugin:switch-locale-path-ssr",
  dependsOn: ["i18n:plugin"],
  setup(_nuxt) {
    const nuxt = useNuxtApp(_nuxt._id);
    if (nuxt.$config.public.i18n.experimental.switchLocalePathLinkSSR !== true) return;
    const switchLocalePath2 = useSwitchLocalePath();
    const switchLocalePathLinkWrapperExpr = new RegExp(
      [
        `<!--${SWITCH_LOCALE_PATH_LINK_IDENTIFIER}-\\[(\\w+)\\]-->`,
        `.+?`,
        `<!--/${SWITCH_LOCALE_PATH_LINK_IDENTIFIER}-->`
      ].join(""),
      "g"
    );
    nuxt.hook("app:rendered", (ctx) => {
      if (ctx.renderResult?.html == null) return;
      ctx.renderResult.html = ctx.renderResult.html.replaceAll(
        switchLocalePathLinkWrapperExpr,
        (match, p1) => match.replace(/href="([^"]+)"/, `href="${encodeURI(switchLocalePath2(p1 ?? ""))}"`)
      );
    });
  }
});
const route_locale_detect__HPHJq3Jg7gwhwgKEI8tQavopSAjmrCSPXl9HgL2h9U = /* @__PURE__ */ defineNuxtPlugin({
  name: "i18n:plugin:route-locale-detect",
  dependsOn: ["i18n:plugin"],
  async setup(_nuxt) {
    let __temp, __restore;
    const nuxt = useNuxtApp(_nuxt._id);
    const currentRoute = nuxt.$router.currentRoute;
    async function handleRouteDetect(to) {
      let detected = detectLocale(
        nuxt,
        to,
        nuxt._vueI18n.__localeFromRoute(to),
        unref(nuxt.$i18n.locale),
        nuxt.$i18n.getLocaleCookie()
      );
      if (nuxt._vueI18n.__firstAccess) {
        nuxt._vueI18n.__setLocale(detected);
        const fallbackLocales = makeFallbackLocaleCodes(unref(nuxt._vueI18n.global.fallbackLocale), [detected]);
        await Promise.all(fallbackLocales.map((x) => nuxt.$i18n.loadLocaleMessages(x)));
        await nuxt.$i18n.loadLocaleMessages(detected);
      }
      const modified = await nuxt.runWithContext(() => loadAndSetLocale(nuxt, detected, nuxt._vueI18n.__firstAccess));
      if (modified) {
        detected = unref(nuxt.$i18n.locale);
      }
      return detected;
    }
    [__temp, __restore] = executeAsync(() => handleRouteDetect(currentRoute.value)), await __temp, __restore();
    const localeChangeMiddleware = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
      let __temp2, __restore2;
      const locale = ([__temp2, __restore2] = executeAsync(() => nuxt.runWithContext(() => handleRouteDetect(to))), __temp2 = await __temp2, __restore2(), __temp2);
      const redirectPath = ([__temp2, __restore2] = executeAsync(() => nuxt.runWithContext(
        () => detectRedirect({ to, nuxtApp: nuxt, from, locale, routeLocale: nuxt._vueI18n.__localeFromRoute(to) }, true)
      )), __temp2 = await __temp2, __restore2(), __temp2);
      nuxt._vueI18n.__firstAccess = false;
      return [__temp2, __restore2] = executeAsync(() => nuxt.runWithContext(() => navigate({ nuxt, redirectPath, locale, route: to }))), __temp2 = await __temp2, __restore2(), __temp2;
    });
    addRouteMiddleware("locale-changing", localeChangeMiddleware, { global: true });
  }
});
function extendI18n(i18n, { extendComposer, extendComposerInstance }) {
  const scope = effectScope();
  const installI18n = i18n.install.bind(i18n);
  i18n.install = (app, ...options) => {
    const pluginOptions = assign({}, options[0]);
    pluginOptions.__composerExtend = (c) => {
      extendComposerInstance(c, getComposer$3(i18n));
      return () => {
      };
    };
    if (i18n.mode === "legacy") {
      pluginOptions.__vueI18nExtend = (vueI18n) => {
        extendComposerInstance(vueI18n, getComposer$3(vueI18n));
        return () => {
        };
      };
    }
    Reflect.apply(installI18n, i18n, [app, pluginOptions]);
    const globalComposer = getComposer$3(i18n);
    scope.run(() => {
      extendComposer(globalComposer);
      if (i18n.mode === "legacy" && isVueI18n(i18n.global)) {
        extendComposerInstance(i18n.global, getComposer$3(i18n.global));
      }
    });
    if (i18n.mode === "composition" && app.config.globalProperties.$i18n != null) {
      extendComposerInstance(app.config.globalProperties.$i18n, globalComposer);
    }
    if (app.unmount) {
      const unmountApp = app.unmount.bind(app);
      app.unmount = () => {
        scope.stop();
        unmountApp();
      };
    }
  };
}
const i18n_EI7LsD1KYQADczz5hrChviGQCdVM8yUkvFEZLJpmnvM = /* @__PURE__ */ defineNuxtPlugin({
  name: "i18n:plugin",
  parallel: parallelPlugin,
  async setup(_nuxt) {
    let __temp, __restore;
    const nuxt = useNuxtApp(_nuxt._id);
    Object.defineProperty(_nuxt.versions, "nuxtI18n", { get: () => "9.5.6" });
    const _runtimeI18n = nuxt.$config.public.i18n;
    const defaultLocaleDomain = getDefaultLocaleForDomain(_runtimeI18n);
    setupMultiDomainLocales(_runtimeI18n, defaultLocaleDomain);
    nuxt.$config.public.i18n.defaultLocale = defaultLocaleDomain;
    const runtimeI18n = {
      ..._runtimeI18n,
      defaultLocale: defaultLocaleDomain,
      baseUrl: extendBaseUrl(nuxt)
    };
    const vueI18nOptions = ([__temp, __restore] = executeAsync(() => loadVueI18nOptions(vueI18nConfigs, useNuxtApp())), __temp = await __temp, __restore(), __temp);
    vueI18nOptions.messages ||= {};
    vueI18nOptions.fallbackLocale ??= false;
    if (defaultLocaleDomain) {
      vueI18nOptions.locale = defaultLocaleDomain;
    }
    for (const l of localeCodes) {
      vueI18nOptions.messages[l] ??= {};
    }
    const i18n = createI18n(vueI18nOptions);
    nuxt._vueI18n = i18n;
    i18n.__localeFromRoute = createLocaleFromRouteGetter();
    i18n.__firstAccess = true;
    i18n.__setLocale = (locale) => {
      const i = getI18nTarget(i18n);
      if (isRef(i.locale)) {
        i.locale.value = locale;
      } else {
        i.locale = locale;
      }
    };
    const localeCookie = createI18nCookie();
    const detectBrowserOptions = runtimeDetectBrowserLanguage();
    extendI18n(i18n, {
      extendComposer(composer) {
        const _locales = ref(runtimeI18n.locales);
        composer.locales = computed(() => _locales.value);
        const _localeCodes = ref(localeCodes);
        composer.localeCodes = computed(() => _localeCodes.value);
        const _baseUrl = ref(runtimeI18n.baseUrl());
        composer.baseUrl = computed(() => _baseUrl.value);
        composer.strategy = runtimeI18n.strategy;
        composer.localeProperties = computed(
          () => normalizedLocales.find((l) => l.code === composer.locale.value) || { code: composer.locale.value }
        );
        composer.setLocale = async (locale) => {
          await loadAndSetLocale(nuxt, locale, i18n.__firstAccess);
          if (composer.strategy === "no_prefix" || false) {
            await composer.loadLocaleMessages(locale);
            i18n.__setLocale(locale);
            return;
          }
          const route2 = nuxt.$router.currentRoute.value;
          const redirectPath = await nuxt.runWithContext(
            () => detectRedirect({ to: route2, nuxtApp: nuxt, locale, routeLocale: i18n.__localeFromRoute(route2) })
          );
          await nuxt.runWithContext(() => navigate({ nuxt, redirectPath, locale, route: route2 }, true));
        };
        composer.loadLocaleMessages = async (locale) => await loadLocale(locale, localeLoaders, composer.mergeLocaleMessage.bind(composer), nuxt);
        composer.differentDomains = runtimeI18n.differentDomains;
        composer.defaultLocale = runtimeI18n.defaultLocale;
        composer.getBrowserLocale = () => getBrowserLocale();
        composer.getLocaleCookie = () => getLocaleCookie(localeCookie, detectBrowserOptions, composer.defaultLocale);
        composer.setLocaleCookie = (locale) => {
          if (!detectBrowserOptions || !detectBrowserOptions.useCookie) return;
          localeCookie.value = locale;
        };
        composer.onBeforeLanguageSwitch = (oldLocale, newLocale, initialSetup, context) => nuxt.callHook("i18n:beforeLocaleSwitch", {
          oldLocale,
          newLocale,
          initialSetup,
          context
        });
        composer.onLanguageSwitched = (oldLocale, newLocale) => nuxt.callHook("i18n:localeSwitched", { oldLocale, newLocale });
        composer.finalizePendingLocaleChange = async () => {
          if (!i18n.__pendingLocale) return;
          i18n.__setLocale(i18n.__pendingLocale);
          i18n.__resolvePendingLocalePromise?.();
          i18n.__pendingLocale = void 0;
        };
        composer.waitForPendingLocaleChange = async () => {
          if (i18n.__pendingLocale && i18n.__pendingLocalePromise) {
            await i18n.__pendingLocalePromise;
          }
        };
      },
      extendComposerInstance(instance, c) {
        const props = [
          ["locales", () => c.locales],
          ["localeCodes", () => c.localeCodes],
          ["baseUrl", () => c.baseUrl],
          ["strategy", () => c.strategy],
          ["localeProperties", () => c.localeProperties],
          ["setLocale", () => async (locale) => Reflect.apply(c.setLocale, c, [locale])],
          ["loadLocaleMessages", () => async (locale) => Reflect.apply(c.loadLocaleMessages, c, [locale])],
          ["differentDomains", () => c.differentDomains],
          ["defaultLocale", () => c.defaultLocale],
          ["getBrowserLocale", () => () => Reflect.apply(c.getBrowserLocale, c, [])],
          ["getLocaleCookie", () => () => Reflect.apply(c.getLocaleCookie, c, [])],
          ["setLocaleCookie", () => (locale) => Reflect.apply(c.setLocaleCookie, c, [locale])],
          [
            "onBeforeLanguageSwitch",
            () => (oldLocale, newLocale, initialSetup, context) => Reflect.apply(c.onBeforeLanguageSwitch, c, [oldLocale, newLocale, initialSetup, context])
          ],
          [
            "onLanguageSwitched",
            () => (oldLocale, newLocale) => Reflect.apply(c.onLanguageSwitched, c, [oldLocale, newLocale])
          ],
          ["finalizePendingLocaleChange", () => () => Reflect.apply(c.finalizePendingLocaleChange, c, [])],
          ["waitForPendingLocaleChange", () => () => Reflect.apply(c.waitForPendingLocaleChange, c, [])]
        ];
        for (const [key, get2] of props) {
          Object.defineProperty(instance, key, { get: get2 });
        }
      }
    });
    nuxt.vueApp.use(i18n);
    Object.defineProperty(nuxt, "$i18n", { get: () => getI18nTarget(i18n) });
    return {
      provide: {
        /**
         * TODO: remove type assertions while type narrowing based on generated types
         */
        localeHead: wrapComposable(localeHead),
        localePath: useLocalePath(),
        localeRoute: useLocaleRoute(),
        getRouteBaseName: useRouteBaseName(),
        switchLocalePath: useSwitchLocalePath(),
        // TODO: remove in v10
        resolveRoute: wrapComposable(resolveRoute),
        // TODO: remove in v10
        localeLocation: useLocaleLocation()
      }
    };
  }
});
const LazyAppFooter = defineAsyncComponent(() => import('./AppFooter-dPiBEs93.mjs').then((r) => r["default"] || r.default || r));
const LazyAppHeader = defineAsyncComponent(() => import('./AppHeader-BTKmFkbe.mjs').then((r) => r["default"] || r.default || r));
const LazyLocaleSwitcher = defineAsyncComponent(() => import('./LocaleSwitcher-wF0Cmm4X.mjs').then((r) => r["default"] || r.default || r));
const LazyMobileNavigation = defineAsyncComponent(() => import('./MobileNavigation-DIgsfEWz.mjs').then((r) => r["default"] || r.default || r));
const lazyGlobalComponents = [
  ["AppFooter", LazyAppFooter],
  ["AppHeader", LazyAppHeader],
  ["LocaleSwitcher", LazyLocaleSwitcher],
  ["MobileNavigation", LazyMobileNavigation]
];
const components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components",
  setup(nuxtApp) {
    for (const [name2, component] of lazyGlobalComponents) {
      nuxtApp.vueApp.component(name2, component);
      nuxtApp.vueApp.component("Lazy" + name2, component);
    }
  }
});
function noop() {
}
const extend = Object.assign;
const isObject = (val) => val !== null && typeof val === "object";
const isDef = (val) => val !== void 0 && val !== null;
const isFunction = (val) => typeof val === "function";
const isPromise = (val) => isObject(val) && isFunction(val.then) && isFunction(val.catch);
const isNumeric = (val) => typeof val === "number" || /^\d+(\.\d+)?$/.test(val);
function get(object, path) {
  const keys = path.split(".");
  let result = object;
  keys.forEach((key) => {
    var _a;
    result = isObject(result) ? (_a = result[key]) != null ? _a : "" : "";
  });
  return result;
}
function pick(obj, keys, ignoreUndefined) {
  return keys.reduce(
    (ret, key) => {
      if (!ignoreUndefined || obj[key] !== void 0) {
        ret[key] = obj[key];
      }
      return ret;
    },
    {}
  );
}
const isSameValue = (newValue, oldValue) => JSON.stringify(newValue) === JSON.stringify(oldValue);
const toArray = (item) => Array.isArray(item) ? item : [item];
const flat = (arr) => arr.reduce((acc, val) => acc.concat(val), []);
const unknownProp = null;
const numericProp = [Number, String];
const truthProp = {
  type: Boolean,
  default: true
};
const makeRequiredProp = (type) => ({
  type,
  required: true
});
const makeArrayProp = () => ({
  type: Array,
  default: () => []
});
const makeNumberProp = (defaultVal) => ({
  type: Number,
  default: defaultVal
});
const makeNumericProp = (defaultVal) => ({
  type: numericProp,
  default: defaultVal
});
const makeStringProp = (defaultVal) => ({
  type: String,
  default: defaultVal
});
function getScrollTop(el) {
  const top = "scrollTop" in el ? el.scrollTop : el.pageYOffset;
  return Math.max(top, 0);
}
function setScrollTop(el, value) {
  if ("scrollTop" in el) {
    el.scrollTop = value;
  } else {
    el.scrollTo(el.scrollX, value);
  }
}
function getRootScrollTop() {
  return (void 0).pageYOffset || (void 0).documentElement.scrollTop || (void 0).body.scrollTop || 0;
}
function setRootScrollTop(value) {
  setScrollTop(void 0, value);
  setScrollTop((void 0).body, value);
}
function getElementTop(el, scroller) {
  if (el === void 0) {
    return 0;
  }
  const scrollTop = scroller ? getScrollTop(scroller) : getRootScrollTop();
  return useRect(el).top + scrollTop;
}
const stopPropagation = (event) => event.stopPropagation();
function preventDefault(event, isStopPropagation) {
  if (typeof event.cancelable !== "boolean" || event.cancelable) {
    event.preventDefault();
  }
  if (isStopPropagation) {
    stopPropagation(event);
  }
}
function isHidden(elementRef) {
  const el = unref(elementRef);
  if (!el) {
    return false;
  }
  const style = (void 0).getComputedStyle(el);
  const hidden = style.display === "none";
  const parentHidden = el.offsetParent === null && style.position !== "fixed";
  return hidden || parentHidden;
}
const { width: windowWidth, height: windowHeight } = useWindowSize();
function addUnit(value) {
  if (isDef(value)) {
    return isNumeric(value) ? `${value}px` : String(value);
  }
  return void 0;
}
function getSizeStyle(originSize) {
  if (isDef(originSize)) {
    if (Array.isArray(originSize)) {
      return {
        width: addUnit(originSize[0]),
        height: addUnit(originSize[1])
      };
    }
    const size = addUnit(originSize);
    return {
      width: size,
      height: size
    };
  }
}
function getZIndexStyle(zIndex) {
  const style = {};
  if (zIndex !== void 0) {
    style.zIndex = +zIndex;
  }
  return style;
}
function unitToPx(value) {
  if (typeof value === "number") {
    return value;
  }
  return parseFloat(value);
}
const camelizeRE = /-(\w)/g;
const camelize = (str) => str.replace(camelizeRE, (_, c) => c.toUpperCase());
const kebabCase = (str) => str.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "");
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
function trimExtraChar(value, char, regExp) {
  const index = value.indexOf(char);
  if (index === -1) {
    return value;
  }
  if (char === "-" && index !== 0) {
    return value.slice(0, index);
  }
  return value.slice(0, index + 1) + value.slice(index).replace(regExp, "");
}
function formatNumber(value, allowDot = true, allowMinus = true) {
  if (allowDot) {
    value = trimExtraChar(value, ".", /\./g);
  } else {
    value = value.split(".")[0];
  }
  if (allowMinus) {
    value = trimExtraChar(value, "-", /-/g);
  } else {
    value = value.replace(/-/, "");
  }
  const regExp = allowDot ? /[^-0-9.]/g : /[^-0-9]/g;
  return value.replace(regExp, "");
}
const { hasOwnProperty } = Object.prototype;
function assignKey(to, from, key) {
  const val = from[key];
  if (!isDef(val)) {
    return;
  }
  if (!hasOwnProperty.call(to, key) || !isObject(val)) {
    to[key] = val;
  } else {
    to[key] = deepAssign(Object(to[key]), val);
  }
}
function deepAssign(to, from) {
  Object.keys(from).forEach((key) => {
    assignKey(to, from, key);
  });
  return to;
}
var stdin_default$M = {
  name: "姓名",
  tel: "电话",
  save: "保存",
  clear: "清空",
  undo: "撤销",
  cancel: "取消",
  confirm: "确认",
  delete: "删除",
  loading: "加载中...",
  noCoupon: "暂无优惠券",
  nameEmpty: "请填写姓名",
  addContact: "添加联系人",
  telInvalid: "请填写正确的电话",
  vanCalendar: {
    end: "结束",
    start: "开始",
    title: "日期选择",
    weekdays: ["日", "一", "二", "三", "四", "五", "六"],
    monthTitle: (year, month) => `${year}年${month}月`,
    rangePrompt: (maxRange) => `最多选择 ${maxRange} 天`
  },
  vanCascader: {
    select: "请选择"
  },
  vanPagination: {
    prev: "上一页",
    next: "下一页"
  },
  vanPullRefresh: {
    pulling: "下拉即可刷新...",
    loosing: "释放即可刷新..."
  },
  vanSubmitBar: {
    label: "合计:"
  },
  vanCoupon: {
    unlimited: "无门槛",
    discount: (discount) => `${discount}折`,
    condition: (condition) => `满${condition}元可用`
  },
  vanCouponCell: {
    title: "优惠券",
    count: (count) => `${count}张可用`
  },
  vanCouponList: {
    exchange: "兑换",
    close: "不使用",
    enable: "可用",
    disabled: "不可用",
    placeholder: "输入优惠码"
  },
  vanAddressEdit: {
    area: "地区",
    areaEmpty: "请选择地区",
    addressEmpty: "请填写详细地址",
    addressDetail: "详细地址",
    defaultAddress: "设为默认收货地址"
  },
  vanAddressList: {
    add: "新增地址"
  }
};
const lang = ref("zh-CN");
const messages = reactive({
  "zh-CN": stdin_default$M
});
const Locale = {
  messages() {
    return messages[lang.value];
  },
  use(newLang, newMessages) {
    lang.value = newLang;
    this.add({ [newLang]: newMessages });
  },
  add(newMessages = {}) {
    deepAssign(messages, newMessages);
  }
};
var stdin_default$L = Locale;
function createTranslate(name2) {
  const prefix = camelize(name2) + ".";
  return (path, ...args) => {
    const messages2 = stdin_default$L.messages();
    const message = get(messages2, prefix + path) || get(messages2, path);
    return isFunction(message) ? message(...args) : message;
  };
}
function genBem(name2, mods) {
  if (!mods) {
    return "";
  }
  if (typeof mods === "string") {
    return ` ${name2}--${mods}`;
  }
  if (Array.isArray(mods)) {
    return mods.reduce(
      (ret, item) => ret + genBem(name2, item),
      ""
    );
  }
  return Object.keys(mods).reduce(
    (ret, key) => ret + (mods[key] ? genBem(name2, key) : ""),
    ""
  );
}
function createBEM(name2) {
  return (el, mods) => {
    if (el && typeof el !== "string") {
      mods = el;
      el = "";
    }
    el = el ? `${name2}__${el}` : name2;
    return `${el}${genBem(el, mods)}`;
  };
}
function createNamespace(name2) {
  const prefixedName = `van-${name2}`;
  return [
    prefixedName,
    createBEM(prefixedName),
    createTranslate(prefixedName)
  ];
}
const BORDER = "van-hairline";
const BORDER_TOP = `${BORDER}--top`;
const BORDER_LEFT = `${BORDER}--left`;
const BORDER_BOTTOM = `${BORDER}--bottom`;
const BORDER_SURROUND = `${BORDER}--surround`;
const BORDER_TOP_BOTTOM = `${BORDER}--top-bottom`;
const BORDER_UNSET_TOP_BOTTOM = `${BORDER}-unset--top-bottom`;
const HAPTICS_FEEDBACK = "van-haptics-feedback";
const FORM_KEY = /* @__PURE__ */ Symbol("van-form");
const LONG_PRESS_START_TIME = 500;
const TAP_OFFSET = 5;
function callInterceptor(interceptor, {
  args = [],
  done,
  canceled,
  error
}) {
  if (interceptor) {
    const returnVal = interceptor.apply(null, args);
    if (isPromise(returnVal)) {
      returnVal.then((value) => {
        if (value) {
          done();
        } else if (canceled) {
          canceled();
        }
      }).catch(error || noop);
    } else if (returnVal) {
      done();
    } else if (canceled) {
      canceled();
    }
  } else {
    done();
  }
}
function withInstall(options) {
  options.install = (app) => {
    const { name: name2 } = options;
    if (name2) {
      app.component(name2, options);
      app.component(camelize(`-${name2}`), options);
    }
  };
  return options;
}
const POPUP_TOGGLE_KEY = /* @__PURE__ */ Symbol();
function onPopupReopen(callback) {
  const popupToggleStatus = inject(POPUP_TOGGLE_KEY, null);
  if (popupToggleStatus) {
    watch(popupToggleStatus, (show) => {
      if (show) {
        callback();
      }
    });
  }
}
const useHeight = (element, withSafeArea) => {
  const height = ref();
  const setHeight = () => {
    height.value = useRect(element).height;
  };
  onPopupReopen(() => nextTick(setHeight));
  watch([windowWidth, windowHeight], setHeight);
  return height;
};
function usePlaceholder(contentRef, bem2) {
  const height = useHeight(contentRef);
  return (renderContent) => createVNode("div", {
    "class": bem2("placeholder"),
    "style": {
      height: height.value ? `${height.value}px` : void 0
    }
  }, [renderContent()]);
}
const [name$I, bem$I] = createNamespace("action-bar");
const ACTION_BAR_KEY = Symbol(name$I);
const actionBarProps = {
  placeholder: Boolean,
  safeAreaInsetBottom: truthProp
};
var stdin_default$K = defineComponent({
  name: name$I,
  props: actionBarProps,
  setup(props, {
    slots
  }) {
    const root = ref();
    const renderPlaceholder = usePlaceholder(root, bem$I);
    const {
      linkChildren
    } = useChildren(ACTION_BAR_KEY);
    linkChildren();
    const renderActionBar = () => {
      var _a;
      return createVNode("div", {
        "ref": root,
        "class": [bem$I(), {
          "van-safe-area-bottom": props.safeAreaInsetBottom
        }]
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
    return () => {
      if (props.placeholder) {
        return renderPlaceholder(renderActionBar);
      }
      return renderActionBar();
    };
  }
});
const ActionBar = withInstall(stdin_default$K);
function useExpose(apis) {
  const instance = getCurrentInstance();
  if (instance) {
    extend(instance.proxy, apis);
  }
}
const routeProps = {
  to: [String, Object],
  url: String,
  replace: Boolean
};
function route({
  to,
  url,
  replace,
  $router: router
}) {
  if (to && router) {
    router[replace ? "replace" : "push"](to);
  } else if (url) {
    replace ? (void 0).replace(url) : (void 0).href = url;
  }
}
function useRoute() {
  const vm = getCurrentInstance().proxy;
  return () => route(vm);
}
const [name$H, bem$H] = createNamespace("badge");
const badgeProps = {
  dot: Boolean,
  max: numericProp,
  tag: makeStringProp("div"),
  color: String,
  offset: Array,
  content: numericProp,
  showZero: truthProp,
  position: makeStringProp("top-right")
};
var stdin_default$J = defineComponent({
  name: name$H,
  props: badgeProps,
  setup(props, {
    slots
  }) {
    const hasContent = () => {
      if (slots.content) {
        return true;
      }
      const {
        content,
        showZero
      } = props;
      return isDef(content) && content !== "" && (showZero || content !== 0 && content !== "0");
    };
    const renderContent = () => {
      const {
        dot,
        max,
        content
      } = props;
      if (!dot && hasContent()) {
        if (slots.content) {
          return slots.content();
        }
        if (isDef(max) && isNumeric(content) && +content > +max) {
          return `${max}+`;
        }
        return content;
      }
    };
    const getOffsetWithMinusString = (val) => val.startsWith("-") ? val.replace("-", "") : `-${val}`;
    const style = computed(() => {
      const style2 = {
        background: props.color
      };
      if (props.offset) {
        const [x, y] = props.offset;
        const {
          position
        } = props;
        const [offsetY, offsetX] = position.split("-");
        if (slots.default) {
          if (typeof y === "number") {
            style2[offsetY] = addUnit(offsetY === "top" ? y : -y);
          } else {
            style2[offsetY] = offsetY === "top" ? addUnit(y) : getOffsetWithMinusString(y);
          }
          if (typeof x === "number") {
            style2[offsetX] = addUnit(offsetX === "left" ? x : -x);
          } else {
            style2[offsetX] = offsetX === "left" ? addUnit(x) : getOffsetWithMinusString(x);
          }
        } else {
          style2.marginTop = addUnit(y);
          style2.marginLeft = addUnit(x);
        }
      }
      return style2;
    });
    const renderBadge = () => {
      if (hasContent() || props.dot) {
        return createVNode("div", {
          "class": bem$H([props.position, {
            dot: props.dot,
            fixed: !!slots.default
          }]),
          "style": style.value
        }, [renderContent()]);
      }
    };
    return () => {
      if (slots.default) {
        const {
          tag
        } = props;
        return createVNode(tag, {
          "class": bem$H("wrapper")
        }, {
          default: () => [slots.default(), renderBadge()]
        });
      }
      return renderBadge();
    };
  }
});
const Badge = withInstall(stdin_default$J);
let globalZIndex = 2e3;
const useGlobalZIndex = () => ++globalZIndex;
const setGlobalZIndex = (val) => {
  globalZIndex = val;
};
const [name$G, bem$G] = createNamespace("config-provider");
const CONFIG_PROVIDER_KEY = Symbol(name$G);
const configProviderProps = {
  tag: makeStringProp("div"),
  theme: makeStringProp("light"),
  zIndex: Number,
  themeVars: Object,
  themeVarsDark: Object,
  themeVarsLight: Object,
  themeVarsScope: makeStringProp("local"),
  iconPrefix: String
};
function insertDash(str) {
  return str.replace(/([a-zA-Z])(\d)/g, "$1-$2");
}
function mapThemeVarsToCSSVars(themeVars) {
  const cssVars = {};
  Object.keys(themeVars).forEach((key) => {
    const formattedKey = insertDash(kebabCase(key));
    cssVars[`--van-${formattedKey}`] = themeVars[key];
  });
  return cssVars;
}
defineComponent({
  name: name$G,
  props: configProviderProps,
  setup(props, {
    slots
  }) {
    const style = computed(() => mapThemeVarsToCSSVars(extend({}, props.themeVars, props.theme === "dark" ? props.themeVarsDark : props.themeVarsLight)));
    provide(CONFIG_PROVIDER_KEY, props);
    watchEffect(() => {
      if (props.zIndex !== void 0) {
        setGlobalZIndex(props.zIndex);
      }
    });
    return () => createVNode(props.tag, {
      "class": bem$G(),
      "style": props.themeVarsScope === "local" ? style.value : void 0
    }, {
      default: () => {
        var _a;
        return [(_a = slots.default) == null ? void 0 : _a.call(slots)];
      }
    });
  }
});
const [name$F, bem$F] = createNamespace("icon");
const isImage = (name2) => name2 == null ? void 0 : name2.includes("/");
const iconProps = {
  dot: Boolean,
  tag: makeStringProp("i"),
  name: String,
  size: numericProp,
  badge: numericProp,
  color: String,
  badgeProps: Object,
  classPrefix: String
};
var stdin_default$I = defineComponent({
  name: name$F,
  props: iconProps,
  setup(props, {
    slots
  }) {
    const config = inject(CONFIG_PROVIDER_KEY, null);
    const classPrefix = computed(() => props.classPrefix || (config == null ? void 0 : config.iconPrefix) || bem$F());
    return () => {
      const {
        tag,
        dot,
        name: name2,
        size,
        badge,
        color
      } = props;
      const isImageIcon = isImage(name2);
      return createVNode(Badge, mergeProps({
        "dot": dot,
        "tag": tag,
        "class": [classPrefix.value, isImageIcon ? "" : `${classPrefix.value}-${name2}`],
        "style": {
          color,
          fontSize: addUnit(size)
        },
        "content": badge
      }, props.badgeProps), {
        default: () => {
          var _a;
          return [(_a = slots.default) == null ? void 0 : _a.call(slots), isImageIcon && createVNode("img", {
            "class": bem$F("image"),
            "src": name2
          }, null)];
        }
      });
    };
  }
});
const Icon = withInstall(stdin_default$I);
const [name$E, bem$E] = createNamespace("loading");
const SpinIcon = Array(12).fill(null).map((_, index) => createVNode("i", {
  "class": bem$E("line", String(index + 1))
}, null));
const CircularIcon = createVNode("svg", {
  "class": bem$E("circular"),
  "viewBox": "25 25 50 50"
}, [createVNode("circle", {
  "cx": "50",
  "cy": "50",
  "r": "20",
  "fill": "none"
}, null)]);
const loadingProps = {
  size: numericProp,
  type: makeStringProp("circular"),
  color: String,
  vertical: Boolean,
  textSize: numericProp,
  textColor: String
};
var stdin_default$H = defineComponent({
  name: name$E,
  props: loadingProps,
  setup(props, {
    slots
  }) {
    const spinnerStyle = computed(() => extend({
      color: props.color
    }, getSizeStyle(props.size)));
    const renderIcon = () => {
      const DefaultIcon = props.type === "spinner" ? SpinIcon : CircularIcon;
      return createVNode("span", {
        "class": bem$E("spinner", props.type),
        "style": spinnerStyle.value
      }, [slots.icon ? slots.icon() : DefaultIcon]);
    };
    const renderText = () => {
      var _a;
      if (slots.default) {
        return createVNode("span", {
          "class": bem$E("text"),
          "style": {
            fontSize: addUnit(props.textSize),
            color: (_a = props.textColor) != null ? _a : props.color
          }
        }, [slots.default()]);
      }
    };
    return () => {
      const {
        type,
        vertical
      } = props;
      return createVNode("div", {
        "class": bem$E([type, {
          vertical
        }]),
        "aria-live": "polite",
        "aria-busy": true
      }, [renderIcon(), renderText()]);
    };
  }
});
const Loading = withInstall(stdin_default$H);
const [name$D, bem$D] = createNamespace("button");
const buttonProps = extend({}, routeProps, {
  tag: makeStringProp("button"),
  text: String,
  icon: String,
  type: makeStringProp("default"),
  size: makeStringProp("normal"),
  color: String,
  block: Boolean,
  plain: Boolean,
  round: Boolean,
  square: Boolean,
  loading: Boolean,
  hairline: Boolean,
  disabled: Boolean,
  iconPrefix: String,
  nativeType: makeStringProp("button"),
  loadingSize: numericProp,
  loadingText: String,
  loadingType: String,
  iconPosition: makeStringProp("left")
});
var stdin_default$G = defineComponent({
  name: name$D,
  props: buttonProps,
  emits: ["click"],
  setup(props, {
    emit,
    slots
  }) {
    const route2 = useRoute();
    const renderLoadingIcon = () => {
      if (slots.loading) {
        return slots.loading();
      }
      return createVNode(Loading, {
        "size": props.loadingSize,
        "type": props.loadingType,
        "class": bem$D("loading")
      }, null);
    };
    const renderIcon = () => {
      if (props.loading) {
        return renderLoadingIcon();
      }
      if (slots.icon) {
        return createVNode("div", {
          "class": bem$D("icon")
        }, [slots.icon()]);
      }
      if (props.icon) {
        return createVNode(Icon, {
          "name": props.icon,
          "class": bem$D("icon"),
          "classPrefix": props.iconPrefix
        }, null);
      }
    };
    const renderText = () => {
      let text;
      if (props.loading) {
        text = props.loadingText;
      } else {
        text = slots.default ? slots.default() : props.text;
      }
      if (text) {
        return createVNode("span", {
          "class": bem$D("text")
        }, [text]);
      }
    };
    const getStyle = () => {
      const {
        color,
        plain
      } = props;
      if (color) {
        const style = {
          color: plain ? color : "white"
        };
        if (!plain) {
          style.background = color;
        }
        if (color.includes("gradient")) {
          style.border = 0;
        } else {
          style.borderColor = color;
        }
        return style;
      }
    };
    const onClick = (event) => {
      if (props.loading) {
        preventDefault(event);
      } else if (!props.disabled) {
        emit("click", event);
        route2();
      }
    };
    return () => {
      const {
        tag,
        type,
        size,
        block,
        round,
        plain,
        square,
        loading,
        disabled,
        hairline,
        nativeType,
        iconPosition
      } = props;
      const classes = [bem$D([type, size, {
        plain,
        block,
        round,
        square,
        loading,
        disabled,
        hairline
      }]), {
        [BORDER_SURROUND]: hairline
      }];
      return createVNode(tag, {
        "type": nativeType,
        "class": classes,
        "style": getStyle(),
        "disabled": disabled,
        "onClick": onClick
      }, {
        default: () => [createVNode("div", {
          "class": bem$D("content")
        }, [iconPosition === "left" && renderIcon(), renderText(), iconPosition === "right" && renderIcon()])]
      });
    };
  }
});
const Button = withInstall(stdin_default$G);
const [name$C, bem$C] = createNamespace("action-bar-button");
const actionBarButtonProps = extend({}, routeProps, {
  type: String,
  text: String,
  icon: String,
  color: String,
  loading: Boolean,
  disabled: Boolean
});
var stdin_default$F = defineComponent({
  name: name$C,
  props: actionBarButtonProps,
  setup(props, {
    slots
  }) {
    const route2 = useRoute();
    const {
      parent,
      index
    } = useParent(ACTION_BAR_KEY);
    const isFirst = computed(() => {
      if (parent) {
        const prev = parent.children[index.value - 1];
        return !(prev && "isButton" in prev);
      }
    });
    const isLast = computed(() => {
      if (parent) {
        const next = parent.children[index.value + 1];
        return !(next && "isButton" in next);
      }
    });
    useExpose({
      isButton: true
    });
    return () => {
      const {
        type,
        icon,
        text,
        color,
        loading,
        disabled
      } = props;
      return createVNode(Button, {
        "class": bem$C([type, {
          last: isLast.value,
          first: isFirst.value
        }]),
        "size": "large",
        "type": type,
        "icon": icon,
        "color": color,
        "loading": loading,
        "disabled": disabled,
        "onClick": route2
      }, {
        default: () => [slots.default ? slots.default() : text]
      });
    };
  }
});
const ActionBarButton = withInstall(stdin_default$F);
const popupSharedProps = {
  // whether to show popup
  show: Boolean,
  // z-index
  zIndex: numericProp,
  // whether to show overlay
  overlay: truthProp,
  // transition duration
  duration: numericProp,
  // teleport
  teleport: [String, Object],
  // prevent body scroll
  lockScroll: truthProp,
  // whether to lazy render
  lazyRender: truthProp,
  // callback function before close
  beforeClose: Function,
  // overlay props
  overlayProps: Object,
  // overlay custom style
  overlayStyle: Object,
  // overlay custom class name
  overlayClass: unknownProp,
  // Initial rendering animation
  transitionAppear: Boolean,
  // whether to close popup when overlay is clicked
  closeOnClickOverlay: truthProp
};
const popupSharedPropKeys = Object.keys(
  popupSharedProps
);
function getDirection(x, y) {
  if (x > y) {
    return "horizontal";
  }
  if (y > x) {
    return "vertical";
  }
  return "";
}
function useTouch() {
  const startX = ref(0);
  const startY = ref(0);
  const deltaX = ref(0);
  const deltaY = ref(0);
  const offsetX = ref(0);
  const offsetY = ref(0);
  const direction = ref("");
  const isTap = ref(true);
  const isVertical = () => direction.value === "vertical";
  const isHorizontal = () => direction.value === "horizontal";
  const reset = () => {
    deltaX.value = 0;
    deltaY.value = 0;
    offsetX.value = 0;
    offsetY.value = 0;
    direction.value = "";
    isTap.value = true;
  };
  const start = ((event) => {
    reset();
    startX.value = event.touches[0].clientX;
    startY.value = event.touches[0].clientY;
  });
  const move = ((event) => {
    const touch = event.touches[0];
    deltaX.value = (touch.clientX < 0 ? 0 : touch.clientX) - startX.value;
    deltaY.value = touch.clientY - startY.value;
    offsetX.value = Math.abs(deltaX.value);
    offsetY.value = Math.abs(deltaY.value);
    const LOCK_DIRECTION_DISTANCE = 10;
    if (!direction.value || offsetX.value < LOCK_DIRECTION_DISTANCE && offsetY.value < LOCK_DIRECTION_DISTANCE) {
      direction.value = getDirection(offsetX.value, offsetY.value);
    }
    if (isTap.value && (offsetX.value > TAP_OFFSET || offsetY.value > TAP_OFFSET)) {
      isTap.value = false;
    }
  });
  return {
    move,
    start,
    reset,
    startX,
    startY,
    deltaX,
    deltaY,
    offsetX,
    offsetY,
    direction,
    isVertical,
    isHorizontal,
    isTap
  };
}
let totalLockCount = 0;
const BODY_LOCK_CLASS = "van-overflow-hidden";
function useLockScroll(rootRef, shouldLock) {
  const touch = useTouch();
  const DIRECTION_UP = "01";
  const DIRECTION_DOWN = "10";
  const onTouchMove = (event) => {
    touch.move(event);
    const direction = touch.deltaY.value > 0 ? DIRECTION_DOWN : DIRECTION_UP;
    const el = getScrollParent(
      event.target,
      rootRef.value
    );
    const { scrollHeight, offsetHeight, scrollTop } = el;
    let status = "11";
    if (scrollTop === 0) {
      status = offsetHeight >= scrollHeight ? "00" : "01";
    } else if (scrollTop + offsetHeight >= scrollHeight) {
      status = "10";
    }
    if (status !== "11" && touch.isVertical() && !(parseInt(status, 2) & parseInt(direction, 2))) {
      preventDefault(event, true);
    }
  };
  const lock = () => {
    (void 0).addEventListener("touchstart", touch.start);
    (void 0).addEventListener("touchmove", onTouchMove, { passive: false });
    if (!totalLockCount) {
      (void 0).body.classList.add(BODY_LOCK_CLASS);
    }
    totalLockCount++;
  };
  const unlock = () => {
    if (totalLockCount) {
      (void 0).removeEventListener("touchstart", touch.start);
      (void 0).removeEventListener("touchmove", onTouchMove);
      totalLockCount--;
      if (!totalLockCount) {
        (void 0).body.classList.remove(BODY_LOCK_CLASS);
      }
    }
  };
  const init = () => shouldLock() && lock();
  onMountedOrActivated(init);
  watch(shouldLock, (value) => {
    value ? lock() : unlock();
  });
}
function useLazyRender(show) {
  const inited = ref(false);
  watch(
    show,
    (value) => {
      if (value) {
        inited.value = value;
      }
    },
    { immediate: true }
  );
  return (render) => () => inited.value ? render() : null;
}
const useScopeId = () => {
  var _a;
  const { scopeId } = ((_a = getCurrentInstance()) == null ? void 0 : _a.vnode) || {};
  return scopeId ? { [scopeId]: "" } : null;
};
const [name$B, bem$B] = createNamespace("overlay");
const overlayProps = {
  show: Boolean,
  zIndex: numericProp,
  duration: numericProp,
  className: unknownProp,
  lockScroll: truthProp,
  lazyRender: truthProp,
  customStyle: Object,
  teleport: [String, Object]
};
var stdin_default$E = defineComponent({
  name: name$B,
  inheritAttrs: false,
  props: overlayProps,
  setup(props, {
    attrs,
    slots
  }) {
    const root = ref();
    const lazyRender = useLazyRender(() => props.show || !props.lazyRender);
    const onTouchMove = (event) => {
      if (props.lockScroll) {
        preventDefault(event, true);
      }
    };
    const renderOverlay = lazyRender(() => {
      var _a;
      const style = extend(getZIndexStyle(props.zIndex), props.customStyle);
      if (isDef(props.duration)) {
        style.animationDuration = `${props.duration}s`;
      }
      return withDirectives(createVNode("div", mergeProps({
        "ref": root,
        "style": style,
        "class": [bem$B(), props.className]
      }, attrs), [(_a = slots.default) == null ? void 0 : _a.call(slots)]), [[vShow, props.show]]);
    });
    useEventListener("touchmove", onTouchMove, {
      target: root
    });
    return () => {
      const Content = createVNode(Transition, {
        "name": "van-fade",
        "appear": true
      }, {
        default: renderOverlay
      });
      if (props.teleport) {
        return createVNode(Teleport, {
          "to": props.teleport
        }, {
          default: () => [Content]
        });
      }
      return Content;
    };
  }
});
const Overlay = withInstall(stdin_default$E);
const popupProps$1 = extend({}, popupSharedProps, {
  round: Boolean,
  position: makeStringProp("center"),
  closeIcon: makeStringProp("cross"),
  closeable: Boolean,
  transition: String,
  iconPrefix: String,
  closeOnPopstate: Boolean,
  closeIconPosition: makeStringProp("top-right"),
  destroyOnClose: Boolean,
  safeAreaInsetTop: Boolean,
  safeAreaInsetBottom: Boolean
});
const [name$A, bem$A] = createNamespace("popup");
var stdin_default$D = defineComponent({
  name: name$A,
  inheritAttrs: false,
  props: popupProps$1,
  emits: ["open", "close", "opened", "closed", "keydown", "update:show", "clickOverlay", "clickCloseIcon"],
  setup(props, {
    emit,
    attrs,
    slots
  }) {
    let opened;
    const zIndex = ref();
    const popupRef = ref();
    const lazyRender = useLazyRender(() => props.show || !props.lazyRender);
    const style = computed(() => {
      const style2 = {
        zIndex: zIndex.value
      };
      if (isDef(props.duration)) {
        const key = props.position === "center" ? "animationDuration" : "transitionDuration";
        style2[key] = `${props.duration}s`;
      }
      return style2;
    });
    const open = () => {
      if (!opened) {
        opened = true;
        zIndex.value = props.zIndex !== void 0 ? +props.zIndex : useGlobalZIndex();
        emit("open");
      }
    };
    const close = () => {
      if (opened) {
        callInterceptor(props.beforeClose, {
          done() {
            opened = false;
            emit("close");
            emit("update:show", false);
          }
        });
      }
    };
    const onClickOverlay = (event) => {
      emit("clickOverlay", event);
      if (props.closeOnClickOverlay) {
        close();
      }
    };
    const renderOverlay = () => {
      if (props.overlay) {
        const overlayProps2 = extend({
          show: props.show,
          class: props.overlayClass,
          zIndex: zIndex.value,
          duration: props.duration,
          customStyle: props.overlayStyle,
          role: props.closeOnClickOverlay ? "button" : void 0,
          tabindex: props.closeOnClickOverlay ? 0 : void 0
        }, props.overlayProps);
        return createVNode(Overlay, mergeProps(overlayProps2, useScopeId(), {
          "onClick": onClickOverlay
        }), {
          default: slots["overlay-content"]
        });
      }
    };
    const onClickCloseIcon = (event) => {
      emit("clickCloseIcon", event);
      close();
    };
    const renderCloseIcon = () => {
      if (props.closeable) {
        return createVNode(Icon, {
          "role": "button",
          "tabindex": 0,
          "name": props.closeIcon,
          "class": [bem$A("close-icon", props.closeIconPosition), HAPTICS_FEEDBACK],
          "classPrefix": props.iconPrefix,
          "onClick": onClickCloseIcon
        }, null);
      }
    };
    let timer;
    const onOpened = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        emit("opened");
      });
    };
    const onClosed = () => emit("closed");
    const onKeydown = (event) => emit("keydown", event);
    const renderPopup = lazyRender(() => {
      var _a;
      const {
        destroyOnClose,
        round,
        position,
        safeAreaInsetTop,
        safeAreaInsetBottom,
        show
      } = props;
      if (!show && destroyOnClose) {
        return;
      }
      return withDirectives(createVNode("div", mergeProps({
        "ref": popupRef,
        "style": style.value,
        "role": "dialog",
        "tabindex": 0,
        "class": [bem$A({
          round,
          [position]: position
        }), {
          "van-safe-area-top": safeAreaInsetTop,
          "van-safe-area-bottom": safeAreaInsetBottom
        }],
        "onKeydown": onKeydown
      }, attrs, useScopeId()), [(_a = slots.default) == null ? void 0 : _a.call(slots), renderCloseIcon()]), [[vShow, show]]);
    });
    const renderTransition = () => {
      const {
        position,
        transition,
        transitionAppear
      } = props;
      const name2 = position === "center" ? "van-fade" : `van-popup-slide-${position}`;
      return createVNode(Transition, {
        "name": transition || name2,
        "appear": transitionAppear,
        "onAfterEnter": onOpened,
        "onAfterLeave": onClosed
      }, {
        default: renderPopup
      });
    };
    watch(() => props.show, (show) => {
      if (show && !opened) {
        open();
        if (attrs.tabindex === 0) {
          nextTick(() => {
            var _a;
            (_a = popupRef.value) == null ? void 0 : _a.focus();
          });
        }
      }
      if (!show && opened) {
        opened = false;
        emit("close");
      }
    });
    useExpose({
      popupRef
    });
    useLockScroll(popupRef, () => props.show && props.lockScroll);
    useEventListener("popstate", () => {
      if (props.closeOnPopstate) {
        close();
      }
    });
    provide(POPUP_TOGGLE_KEY, () => props.show);
    return () => {
      if (props.teleport) {
        return createVNode(Teleport, {
          "to": props.teleport
        }, {
          default: () => [renderOverlay(), renderTransition()]
        });
      }
      return createVNode(Fragment, null, [renderOverlay(), renderTransition()]);
    };
  }
});
const Popup = withInstall(stdin_default$D);
const [name$z, bem$z] = createNamespace("action-sheet");
const actionSheetProps = extend({}, popupSharedProps, {
  title: String,
  round: truthProp,
  actions: makeArrayProp(),
  closeIcon: makeStringProp("cross"),
  closeable: truthProp,
  cancelText: String,
  description: String,
  closeOnPopstate: truthProp,
  closeOnClickAction: Boolean,
  safeAreaInsetBottom: truthProp
});
const popupInheritKeys$1 = [...popupSharedPropKeys, "round", "closeOnPopstate", "safeAreaInsetBottom"];
var stdin_default$C = defineComponent({
  name: name$z,
  props: actionSheetProps,
  emits: ["select", "cancel", "update:show"],
  setup(props, {
    slots,
    emit
  }) {
    const updateShow = (show) => emit("update:show", show);
    const onCancel = () => {
      updateShow(false);
      emit("cancel");
    };
    const renderHeader = () => {
      if (props.title) {
        return createVNode("div", {
          "class": bem$z("header")
        }, [props.title, props.closeable && createVNode(Icon, {
          "name": props.closeIcon,
          "class": [bem$z("close"), HAPTICS_FEEDBACK],
          "onClick": onCancel
        }, null)]);
      }
    };
    const renderCancel = () => {
      if (slots.cancel || props.cancelText) {
        return [createVNode("div", {
          "class": bem$z("gap")
        }, null), createVNode("button", {
          "type": "button",
          "class": bem$z("cancel"),
          "onClick": onCancel
        }, [slots.cancel ? slots.cancel() : props.cancelText])];
      }
    };
    const renderIcon = (action) => {
      if (action.icon) {
        return createVNode(Icon, {
          "class": bem$z("item-icon"),
          "name": action.icon
        }, null);
      }
    };
    const renderActionContent = (action, index) => {
      if (action.loading) {
        return createVNode(Loading, {
          "class": bem$z("loading-icon")
        }, null);
      }
      if (slots.action) {
        return slots.action({
          action,
          index
        });
      }
      return [createVNode("span", {
        "class": bem$z("name")
      }, [action.name]), action.subname && createVNode("div", {
        "class": bem$z("subname")
      }, [action.subname])];
    };
    const renderAction = (action, index) => {
      const {
        color,
        loading,
        callback,
        disabled,
        className
      } = action;
      const onClick = () => {
        if (disabled || loading) {
          return;
        }
        if (callback) {
          callback(action);
        }
        if (props.closeOnClickAction) {
          updateShow(false);
        }
        nextTick(() => emit("select", action, index));
      };
      return createVNode("button", {
        "type": "button",
        "style": {
          color
        },
        "class": [bem$z("item", {
          loading,
          disabled
        }), className],
        "onClick": onClick
      }, [renderIcon(action), renderActionContent(action, index)]);
    };
    const renderDescription = () => {
      if (props.description || slots.description) {
        const content = slots.description ? slots.description() : props.description;
        return createVNode("div", {
          "class": bem$z("description")
        }, [content]);
      }
    };
    return () => createVNode(Popup, mergeProps({
      "class": bem$z(),
      "position": "bottom",
      "onUpdate:show": updateShow
    }, pick(props, popupInheritKeys$1)), {
      default: () => {
        var _a;
        return [renderHeader(), renderDescription(), createVNode("div", {
          "class": bem$z("content")
        }, [props.actions.map(renderAction), (_a = slots.default) == null ? void 0 : _a.call(slots)]), renderCancel()];
      }
    });
  }
});
const ActionSheet = withInstall(stdin_default$C);
const [name$y, bem$y, t$5] = createNamespace("picker");
const getFirstEnabledOption = (options) => options.find((option) => !option.disabled) || options[0];
function getColumnsType(columns, fields) {
  const firstColumn = columns[0];
  if (firstColumn) {
    if (Array.isArray(firstColumn)) {
      return "multiple";
    }
    if (fields.children in firstColumn) {
      return "cascade";
    }
  }
  return "default";
}
function findIndexOfEnabledOption(options, index) {
  index = clamp(index, 0, options.length);
  for (let i = index; i < options.length; i++) {
    if (!options[i].disabled) return i;
  }
  for (let i = index - 1; i >= 0; i--) {
    if (!options[i].disabled) return i;
  }
  return 0;
}
const isOptionExist = (options, value, fields) => value !== void 0 && options.some((option) => option[fields.value] === value);
function findOptionByValue(options, value, fields) {
  const index = options.findIndex((option) => option[fields.value] === value);
  const enabledIndex = findIndexOfEnabledOption(options, index);
  return options[enabledIndex];
}
function formatCascadeColumns(columns, fields, selectedValues) {
  const formatted = [];
  let cursor = {
    [fields.children]: columns
  };
  let columnIndex = 0;
  while (cursor && cursor[fields.children]) {
    const options = cursor[fields.children];
    const value = selectedValues.value[columnIndex];
    cursor = isDef(value) ? findOptionByValue(options, value, fields) : void 0;
    if (!cursor && options.length) {
      const firstValue = getFirstEnabledOption(options)[fields.value];
      cursor = findOptionByValue(options, firstValue, fields);
    }
    columnIndex++;
    formatted.push(options);
  }
  return formatted;
}
function getElementTranslateY(element) {
  const { transform: transform2 } = (void 0).getComputedStyle(element);
  const translateY = transform2.slice(7, transform2.length - 1).split(", ")[5];
  return Number(translateY);
}
function assignDefaultFields(fields) {
  return extend(
    {
      text: "text",
      value: "value",
      children: "children"
    },
    fields
  );
}
const DEFAULT_DURATION = 200;
const MOMENTUM_TIME = 300;
const MOMENTUM_DISTANCE = 15;
const [name$x, bem$x] = createNamespace("picker-column");
const PICKER_KEY = Symbol(name$x);
var stdin_default$B = defineComponent({
  name: name$x,
  props: {
    value: numericProp,
    fields: makeRequiredProp(Object),
    options: makeArrayProp(),
    readonly: Boolean,
    allowHtml: Boolean,
    optionHeight: makeRequiredProp(Number),
    swipeDuration: makeRequiredProp(numericProp),
    visibleOptionNum: makeRequiredProp(numericProp)
  },
  emits: ["change", "clickOption", "scrollInto"],
  setup(props, {
    emit,
    slots
  }) {
    let moving;
    let startOffset;
    let touchStartTime;
    let momentumOffset;
    let transitionEndTrigger;
    const root = ref();
    const wrapper = ref();
    const currentOffset = ref(0);
    const currentDuration = ref(0);
    const touch = useTouch();
    const count = () => props.options.length;
    const baseOffset = () => props.optionHeight * (+props.visibleOptionNum - 1) / 2;
    const updateValueByIndex = (index) => {
      let enabledIndex = findIndexOfEnabledOption(props.options, index);
      const offset = -enabledIndex * props.optionHeight;
      const trigger = () => {
        if (enabledIndex > count() - 1) {
          enabledIndex = findIndexOfEnabledOption(props.options, index);
        }
        const value = props.options[enabledIndex][props.fields.value];
        if (value !== props.value) {
          emit("change", value);
        }
      };
      if (moving && offset !== currentOffset.value) {
        transitionEndTrigger = trigger;
      } else {
        trigger();
      }
      currentOffset.value = offset;
    };
    const isReadonly2 = () => props.readonly || !props.options.length;
    const onClickOption = (index) => {
      if (moving || isReadonly2()) {
        return;
      }
      transitionEndTrigger = null;
      currentDuration.value = DEFAULT_DURATION;
      updateValueByIndex(index);
      emit("clickOption", props.options[index]);
    };
    const getIndexByOffset = (offset) => clamp(Math.round(-offset / props.optionHeight), 0, count() - 1);
    const currentIndex = computed(() => getIndexByOffset(currentOffset.value));
    const momentum = (distance, duration) => {
      const speed = Math.abs(distance / duration);
      distance = currentOffset.value + speed / 3e-3 * (distance < 0 ? -1 : 1);
      const index = getIndexByOffset(distance);
      currentDuration.value = +props.swipeDuration;
      updateValueByIndex(index);
    };
    const stopMomentum = () => {
      moving = false;
      currentDuration.value = 0;
      if (transitionEndTrigger) {
        transitionEndTrigger();
        transitionEndTrigger = null;
      }
    };
    const onTouchStart = (event) => {
      if (isReadonly2()) {
        return;
      }
      touch.start(event);
      if (moving) {
        const translateY = getElementTranslateY(wrapper.value);
        currentOffset.value = Math.min(0, translateY - baseOffset());
      }
      currentDuration.value = 0;
      startOffset = currentOffset.value;
      touchStartTime = Date.now();
      momentumOffset = startOffset;
      transitionEndTrigger = null;
    };
    const onTouchMove = (event) => {
      if (isReadonly2()) {
        return;
      }
      touch.move(event);
      if (touch.isVertical()) {
        moving = true;
        preventDefault(event, true);
      }
      const newOffset = clamp(startOffset + touch.deltaY.value, -(count() * props.optionHeight), props.optionHeight);
      const newIndex = getIndexByOffset(newOffset);
      if (newIndex !== currentIndex.value) {
        emit("scrollInto", props.options[newIndex]);
      }
      currentOffset.value = newOffset;
      const now = Date.now();
      if (now - touchStartTime > MOMENTUM_TIME) {
        touchStartTime = now;
        momentumOffset = newOffset;
      }
    };
    const onTouchEnd = () => {
      if (isReadonly2()) {
        return;
      }
      const distance = currentOffset.value - momentumOffset;
      const duration = Date.now() - touchStartTime;
      const startMomentum = duration < MOMENTUM_TIME && Math.abs(distance) > MOMENTUM_DISTANCE;
      if (startMomentum) {
        momentum(distance, duration);
        return;
      }
      const index = getIndexByOffset(currentOffset.value);
      currentDuration.value = DEFAULT_DURATION;
      updateValueByIndex(index);
      setTimeout(() => {
        moving = false;
      }, 0);
    };
    const renderOptions = () => {
      const optionStyle = {
        height: `${props.optionHeight}px`
      };
      return props.options.map((option, index) => {
        const text = option[props.fields.text];
        const {
          disabled
        } = option;
        const value = option[props.fields.value];
        const data = {
          role: "button",
          style: optionStyle,
          tabindex: disabled ? -1 : 0,
          class: [bem$x("item", {
            disabled,
            selected: value === props.value
          }), option.className],
          onClick: () => onClickOption(index)
        };
        const childData = {
          class: "van-ellipsis",
          [props.allowHtml ? "innerHTML" : "textContent"]: text
        };
        return createVNode("li", data, [slots.option ? slots.option(option, index) : createVNode("div", childData, null)]);
      });
    };
    useParent(PICKER_KEY);
    useExpose({
      stopMomentum
    });
    watchEffect(() => {
      const index = moving ? Math.floor(-currentOffset.value / props.optionHeight) : props.options.findIndex((option) => option[props.fields.value] === props.value);
      const enabledIndex = findIndexOfEnabledOption(props.options, index);
      const offset = -enabledIndex * props.optionHeight;
      if (moving && enabledIndex < index) stopMomentum();
      currentOffset.value = offset;
    });
    useEventListener("touchmove", onTouchMove, {
      target: root
    });
    return () => createVNode("div", {
      "ref": root,
      "class": bem$x(),
      "onTouchstartPassive": onTouchStart,
      "onTouchend": onTouchEnd,
      "onTouchcancel": onTouchEnd
    }, [createVNode("ul", {
      "ref": wrapper,
      "style": {
        transform: `translate3d(0, ${currentOffset.value + baseOffset()}px, 0)`,
        transitionDuration: `${currentDuration.value}ms`,
        transitionProperty: currentDuration.value ? "all" : "none"
      },
      "class": bem$x("wrapper"),
      "onTransitionend": stopMomentum
    }, [renderOptions()])]);
  }
});
const [name$w] = createNamespace("picker-toolbar");
const pickerToolbarProps = {
  title: String,
  cancelButtonText: String,
  confirmButtonText: String
};
const pickerToolbarSlots = ["cancel", "confirm", "title", "toolbar"];
const pickerToolbarPropKeys = Object.keys(pickerToolbarProps);
var stdin_default$A = defineComponent({
  name: name$w,
  props: pickerToolbarProps,
  emits: ["confirm", "cancel"],
  setup(props, {
    emit,
    slots
  }) {
    const renderTitle = () => {
      if (slots.title) {
        return slots.title();
      }
      if (props.title) {
        return createVNode("div", {
          "class": [bem$y("title"), "van-ellipsis"]
        }, [props.title]);
      }
    };
    const onCancel = () => emit("cancel");
    const onConfirm = () => emit("confirm");
    const renderCancel = () => {
      var _a;
      const text = (_a = props.cancelButtonText) != null ? _a : t$5("cancel");
      if (!slots.cancel && !text) {
        return;
      }
      return createVNode("button", {
        "type": "button",
        "class": [bem$y("cancel"), HAPTICS_FEEDBACK],
        "onClick": onCancel
      }, [slots.cancel ? slots.cancel() : text]);
    };
    const renderConfirm = () => {
      var _a;
      const text = (_a = props.confirmButtonText) != null ? _a : t$5("confirm");
      if (!slots.confirm && !text) {
        return;
      }
      return createVNode("button", {
        "type": "button",
        "class": [bem$y("confirm"), HAPTICS_FEEDBACK],
        "onClick": onConfirm
      }, [slots.confirm ? slots.confirm() : text]);
    };
    return () => createVNode("div", {
      "class": bem$y("toolbar")
    }, [slots.toolbar ? slots.toolbar() : [renderCancel(), renderTitle(), renderConfirm()]]);
  }
});
const useSyncPropRef = (getProp, setProp) => {
  const propRef = ref(getProp());
  watch(getProp, (value) => {
    if (value !== propRef.value) {
      propRef.value = value;
    }
  });
  watch(propRef, (value) => {
    if (value !== getProp()) {
      setProp(value);
    }
  });
  return propRef;
};
function scrollLeftTo(scroller, to, duration) {
  let rafId;
  let count = 0;
  const from = scroller.scrollLeft;
  const frames = duration === 0 ? 1 : Math.round(duration * 1e3 / 16);
  let scrollLeft = from;
  function cancel() {
    cancelRaf(rafId);
  }
  function animate() {
    scrollLeft += (to - from) / frames;
    scroller.scrollLeft = scrollLeft;
    if (++count < frames) {
      rafId = raf(animate);
    }
  }
  animate();
  return cancel;
}
function scrollTopTo(scroller, to, duration, callback) {
  let rafId;
  let current2 = getScrollTop(scroller);
  const isDown = current2 < to;
  const frames = duration === 0 ? 1 : Math.round(duration * 1e3 / 16);
  const step = (to - current2) / frames;
  function cancel() {
    cancelRaf(rafId);
  }
  function animate() {
    current2 += step;
    if (isDown && current2 > to || !isDown && current2 < to) {
      current2 = to;
    }
    setScrollTop(scroller, current2);
    if (isDown && current2 < to || !isDown && current2 > to) {
      rafId = raf(animate);
    } else if (callback) {
      rafId = raf(callback);
    }
  }
  animate();
  return cancel;
}
let current = 0;
function useId() {
  const vm = getCurrentInstance();
  const { name: name2 = "unknown" } = (vm == null ? void 0 : vm.type) || {};
  return `${name2}-${++current}`;
}
function useRefs() {
  const refs = ref([]);
  const cache2 = [];
  const setRefs = (index) => {
    if (!cache2[index]) {
      cache2[index] = (el) => {
        refs.value[index] = el;
      };
    }
    return cache2[index];
  };
  return [refs, setRefs];
}
const [name$v, bem$w] = createNamespace("sticky");
const stickyProps = {
  zIndex: numericProp,
  position: makeStringProp("top"),
  container: Object,
  offsetTop: makeNumericProp(0),
  offsetBottom: makeNumericProp(0)
};
var stdin_default$z = defineComponent({
  name: name$v,
  props: stickyProps,
  emits: ["scroll", "change"],
  setup(props, {
    emit,
    slots
  }) {
    const root = ref();
    const scrollParent = useScrollParent(root);
    const state = reactive({
      fixed: false,
      width: 0,
      // root width
      height: 0,
      // root height
      transform: 0
    });
    const isReset = ref(false);
    const offset = computed(() => unitToPx(props.position === "top" ? props.offsetTop : props.offsetBottom));
    const rootStyle = computed(() => {
      if (isReset.value) {
        return;
      }
      const {
        fixed,
        height,
        width
      } = state;
      if (fixed) {
        return {
          width: `${width}px`,
          height: `${height}px`
        };
      }
    });
    const stickyStyle = computed(() => {
      if (!state.fixed || isReset.value) {
        return;
      }
      const style = extend(getZIndexStyle(props.zIndex), {
        width: `${state.width}px`,
        height: `${state.height}px`,
        [props.position]: `${offset.value}px`
      });
      if (state.transform) {
        style.transform = `translate3d(0, ${state.transform}px, 0)`;
      }
      return style;
    });
    const emitScroll = (scrollTop) => emit("scroll", {
      scrollTop,
      isFixed: state.fixed
    });
    const onScroll = () => {
      if (!root.value || isHidden(root)) {
        return;
      }
      const {
        container,
        position
      } = props;
      const rootRect = useRect(root);
      const scrollTop = getScrollTop(void 0);
      state.width = rootRect.width;
      state.height = rootRect.height;
      if (position === "top") {
        if (container) {
          const containerRect = useRect(container);
          const difference = containerRect.bottom - offset.value - state.height;
          state.fixed = offset.value > rootRect.top && containerRect.bottom > 0;
          state.transform = difference < 0 ? difference : 0;
        } else {
          state.fixed = offset.value > rootRect.top;
        }
      } else {
        const {
          clientHeight
        } = (void 0).documentElement;
        if (container) {
          const containerRect = useRect(container);
          const difference = clientHeight - containerRect.top - offset.value - state.height;
          state.fixed = clientHeight - offset.value < rootRect.bottom && clientHeight > containerRect.top;
          state.transform = difference < 0 ? -difference : 0;
        } else {
          state.fixed = clientHeight - offset.value < rootRect.bottom;
        }
      }
      emitScroll(scrollTop);
    };
    watch(() => state.fixed, (value) => emit("change", value));
    useEventListener("scroll", onScroll, {
      target: scrollParent,
      passive: true
    });
    watch([windowWidth, windowHeight], () => {
      if (!root.value || isHidden(root) || !state.fixed) {
        return;
      }
      isReset.value = true;
      nextTick(() => {
        const rootRect = useRect(root);
        state.width = rootRect.width;
        state.height = rootRect.height;
        isReset.value = false;
      });
    });
    return () => {
      var _a;
      return createVNode("div", {
        "ref": root,
        "style": rootStyle.value
      }, [createVNode("div", {
        "class": bem$w({
          fixed: state.fixed && !isReset.value
        }),
        "style": stickyStyle.value
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)])]);
    };
  }
});
const Sticky = withInstall(stdin_default$z);
const [name$u, bem$v] = createNamespace("swipe");
const swipeProps = {
  loop: truthProp,
  width: numericProp,
  height: numericProp,
  vertical: Boolean,
  autoplay: makeNumericProp(0),
  duration: makeNumericProp(500),
  touchable: truthProp,
  lazyRender: Boolean,
  initialSwipe: makeNumericProp(0),
  indicatorColor: String,
  showIndicators: truthProp,
  stopPropagation: truthProp
};
const SWIPE_KEY = Symbol(name$u);
var stdin_default$y = defineComponent({
  name: name$u,
  props: swipeProps,
  emits: ["change", "dragStart", "dragEnd"],
  setup(props, {
    emit,
    slots
  }) {
    const root = ref();
    const track = ref();
    const state = reactive({
      rect: null,
      width: 0,
      height: 0,
      offset: 0,
      active: 0,
      swiping: false
    });
    let dragging = false;
    const touch = useTouch();
    const {
      children,
      linkChildren
    } = useChildren(SWIPE_KEY);
    const count = computed(() => children.length);
    const size = computed(() => state[props.vertical ? "height" : "width"]);
    const delta = computed(() => props.vertical ? touch.deltaY.value : touch.deltaX.value);
    const minOffset = computed(() => {
      if (state.rect) {
        const base = props.vertical ? state.rect.height : state.rect.width;
        return base - size.value * count.value;
      }
      return 0;
    });
    const maxCount = computed(() => size.value ? Math.ceil(Math.abs(minOffset.value) / size.value) : count.value);
    const trackSize = computed(() => count.value * size.value);
    const activeIndicator = computed(() => (state.active + count.value) % count.value);
    const isCorrectDirection = computed(() => {
      const expect = props.vertical ? "vertical" : "horizontal";
      return touch.direction.value === expect;
    });
    const trackStyle = computed(() => {
      const style = {
        transitionDuration: `${state.swiping ? 0 : props.duration}ms`,
        transform: `translate${props.vertical ? "Y" : "X"}(${+state.offset.toFixed(2)}px)`
      };
      if (size.value) {
        const mainAxis = props.vertical ? "height" : "width";
        const crossAxis = props.vertical ? "width" : "height";
        style[mainAxis] = `${trackSize.value}px`;
        style[crossAxis] = props[crossAxis] ? `${props[crossAxis]}px` : "";
      }
      return style;
    });
    const getTargetActive = (pace) => {
      const {
        active
      } = state;
      if (pace) {
        if (props.loop) {
          return clamp(active + pace, -1, count.value);
        }
        return clamp(active + pace, 0, maxCount.value);
      }
      return active;
    };
    const getTargetOffset = (targetActive, offset = 0) => {
      let currentPosition = targetActive * size.value;
      if (!props.loop) {
        currentPosition = Math.min(currentPosition, -minOffset.value);
      }
      let targetOffset = offset - currentPosition;
      if (!props.loop) {
        targetOffset = clamp(targetOffset, minOffset.value, 0);
      }
      return targetOffset;
    };
    const move = ({
      pace = 0,
      offset = 0,
      emitChange
    }) => {
      if (count.value <= 1) {
        return;
      }
      const {
        active
      } = state;
      const targetActive = getTargetActive(pace);
      const targetOffset = getTargetOffset(targetActive, offset);
      if (props.loop) {
        if (children[0] && targetOffset !== minOffset.value) {
          const outRightBound = targetOffset < minOffset.value;
          children[0].setOffset(outRightBound ? trackSize.value : 0);
        }
        if (children[count.value - 1] && targetOffset !== 0) {
          const outLeftBound = targetOffset > 0;
          children[count.value - 1].setOffset(outLeftBound ? -trackSize.value : 0);
        }
      }
      state.active = targetActive;
      state.offset = targetOffset;
      if (emitChange && targetActive !== active) {
        emit("change", activeIndicator.value);
      }
    };
    const correctPosition = () => {
      state.swiping = true;
      if (state.active <= -1) {
        move({
          pace: count.value
        });
      } else if (state.active >= count.value) {
        move({
          pace: -count.value
        });
      }
    };
    const prev = () => {
      correctPosition();
      touch.reset();
      doubleRaf(() => {
        state.swiping = false;
        move({
          pace: -1,
          emitChange: true
        });
      });
    };
    const next = () => {
      correctPosition();
      touch.reset();
      doubleRaf(() => {
        state.swiping = false;
        move({
          pace: 1,
          emitChange: true
        });
      });
    };
    let autoplayTimer;
    const stopAutoplay = () => clearTimeout(autoplayTimer);
    const autoplay = () => {
      stopAutoplay();
      if (+props.autoplay > 0 && count.value > 1) {
        autoplayTimer = setTimeout(() => {
          next();
          autoplay();
        }, +props.autoplay);
      }
    };
    const initialize = (active = +props.initialSwipe) => {
      if (!root.value) {
        return;
      }
      const cb = () => {
        var _a, _b;
        if (!isHidden(root)) {
          const rect = {
            width: root.value.offsetWidth,
            height: root.value.offsetHeight
          };
          state.rect = rect;
          state.width = +((_a = props.width) != null ? _a : rect.width);
          state.height = +((_b = props.height) != null ? _b : rect.height);
        }
        if (count.value) {
          active = Math.min(count.value - 1, active);
          if (active === -1) {
            active = count.value - 1;
          }
        }
        state.active = active;
        state.swiping = true;
        state.offset = getTargetOffset(active);
        children.forEach((swipe) => {
          swipe.setOffset(0);
        });
        autoplay();
      };
      if (isHidden(root)) {
        nextTick().then(cb);
      } else {
        cb();
      }
    };
    const resize = () => initialize(state.active);
    let touchStartTime;
    const onTouchStart = (event) => {
      if (!props.touchable || // avoid resetting position on multi-finger touch
      event.touches.length > 1) return;
      touch.start(event);
      dragging = false;
      touchStartTime = Date.now();
      stopAutoplay();
      correctPosition();
    };
    const onTouchMove = (event) => {
      if (props.touchable && state.swiping) {
        touch.move(event);
        if (isCorrectDirection.value) {
          const isEdgeTouch = !props.loop && (state.active === 0 && delta.value > 0 || state.active === count.value - 1 && delta.value < 0);
          if (!isEdgeTouch) {
            preventDefault(event, props.stopPropagation);
            move({
              offset: delta.value
            });
            if (!dragging) {
              emit("dragStart", {
                index: activeIndicator.value
              });
              dragging = true;
            }
          }
        }
      }
    };
    const onTouchEnd = () => {
      if (!props.touchable || !state.swiping) {
        return;
      }
      const duration = Date.now() - touchStartTime;
      const speed = delta.value / duration;
      const shouldSwipe = Math.abs(speed) > 0.25 || Math.abs(delta.value) > size.value / 2;
      if (shouldSwipe && isCorrectDirection.value) {
        const offset = props.vertical ? touch.offsetY.value : touch.offsetX.value;
        let pace = 0;
        if (props.loop) {
          pace = offset > 0 ? delta.value > 0 ? -1 : 1 : 0;
        } else {
          pace = -Math[delta.value > 0 ? "ceil" : "floor"](delta.value / size.value);
        }
        move({
          pace,
          emitChange: true
        });
      } else if (delta.value) {
        move({
          pace: 0
        });
      }
      dragging = false;
      state.swiping = false;
      emit("dragEnd", {
        index: activeIndicator.value
      });
      autoplay();
    };
    const swipeTo = (index, options = {}) => {
      correctPosition();
      touch.reset();
      doubleRaf(() => {
        let targetIndex;
        if (props.loop && index === count.value) {
          targetIndex = state.active === 0 ? 0 : index;
        } else {
          targetIndex = index % count.value;
        }
        if (options.immediate) {
          doubleRaf(() => {
            state.swiping = false;
          });
        } else {
          state.swiping = false;
        }
        move({
          pace: targetIndex - state.active,
          emitChange: true
        });
      });
    };
    const renderDot = (_, index) => {
      const active = index === activeIndicator.value;
      const style = active ? {
        backgroundColor: props.indicatorColor
      } : void 0;
      return createVNode("i", {
        "style": style,
        "class": bem$v("indicator", {
          active
        })
      }, null);
    };
    const renderIndicator = () => {
      if (slots.indicator) {
        return slots.indicator({
          active: activeIndicator.value,
          total: count.value
        });
      }
      if (props.showIndicators && count.value > 1) {
        return createVNode("div", {
          "class": bem$v("indicators", {
            vertical: props.vertical
          })
        }, [Array(count.value).fill("").map(renderDot)]);
      }
    };
    useExpose({
      prev,
      next,
      state,
      resize,
      swipeTo
    });
    linkChildren({
      size,
      props,
      count,
      activeIndicator
    });
    watch(() => props.initialSwipe, (value) => initialize(+value));
    watch(count, () => initialize(state.active));
    watch(() => props.autoplay, autoplay);
    watch([windowWidth, windowHeight, () => props.width, () => props.height], resize);
    watch(usePageVisibility(), (visible) => {
      if (visible === "visible") {
        autoplay();
      } else {
        stopAutoplay();
      }
    });
    onPopupReopen(() => initialize(state.active));
    useEventListener("touchmove", onTouchMove, {
      target: track
    });
    return () => {
      var _a;
      return createVNode("div", {
        "ref": root,
        "class": bem$v()
      }, [createVNode("div", {
        "ref": track,
        "style": trackStyle.value,
        "class": bem$v("track", {
          vertical: props.vertical
        }),
        "onTouchstartPassive": onTouchStart,
        "onTouchend": onTouchEnd,
        "onTouchcancel": onTouchEnd
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]), renderIndicator()]);
    };
  }
});
const Swipe = withInstall(stdin_default$y);
const [name$t, bem$u] = createNamespace("tabs");
var stdin_default$x = defineComponent({
  name: name$t,
  props: {
    count: makeRequiredProp(Number),
    inited: Boolean,
    animated: Boolean,
    duration: makeRequiredProp(numericProp),
    swipeable: Boolean,
    lazyRender: Boolean,
    currentIndex: makeRequiredProp(Number)
  },
  emits: ["change"],
  setup(props, {
    emit,
    slots
  }) {
    const swipeRef = ref();
    const onChange = (index) => emit("change", index);
    const renderChildren = () => {
      var _a;
      const Content = (_a = slots.default) == null ? void 0 : _a.call(slots);
      if (props.animated || props.swipeable) {
        return createVNode(Swipe, {
          "ref": swipeRef,
          "loop": false,
          "class": bem$u("track"),
          "duration": +props.duration * 1e3,
          "touchable": props.swipeable,
          "lazyRender": props.lazyRender,
          "showIndicators": false,
          "onChange": onChange
        }, {
          default: () => [Content]
        });
      }
      return Content;
    };
    const swipeToCurrentTab = (index) => {
      const swipe = swipeRef.value;
      if (swipe && swipe.state.active !== index) {
        swipe.swipeTo(index, {
          immediate: !props.inited
        });
      }
    };
    watch(() => props.currentIndex, swipeToCurrentTab);
    useExpose({
      swipeRef
    });
    return () => createVNode("div", {
      "class": bem$u("content", {
        animated: props.animated || props.swipeable
      })
    }, [renderChildren()]);
  }
});
const [name$s, bem$t] = createNamespace("tabs");
const tabsProps = {
  type: makeStringProp("line"),
  color: String,
  border: Boolean,
  sticky: Boolean,
  shrink: Boolean,
  active: makeNumericProp(0),
  duration: makeNumericProp(0.3),
  animated: Boolean,
  ellipsis: truthProp,
  swipeable: Boolean,
  scrollspy: Boolean,
  offsetTop: makeNumericProp(0),
  background: String,
  lazyRender: truthProp,
  showHeader: truthProp,
  lineWidth: numericProp,
  lineHeight: numericProp,
  beforeChange: Function,
  swipeThreshold: makeNumericProp(5),
  titleActiveColor: String,
  titleInactiveColor: String
};
const TABS_KEY = Symbol(name$s);
var stdin_default$w = defineComponent({
  name: name$s,
  props: tabsProps,
  emits: ["change", "scroll", "rendered", "clickTab", "update:active"],
  setup(props, {
    emit,
    slots
  }) {
    let tabHeight;
    let lockScroll;
    let stickyFixed;
    let cancelScrollLeftToRaf;
    let cancelScrollTopToRaf;
    const root = ref();
    const navRef = ref();
    const wrapRef = ref();
    const contentRef = ref();
    const id = useId();
    const scroller = useScrollParent(root);
    const [titleRefs, setTitleRefs] = useRefs();
    const {
      children,
      linkChildren
    } = useChildren(TABS_KEY);
    const state = reactive({
      inited: false,
      position: "",
      lineStyle: {},
      currentIndex: -1
    });
    const scrollable = computed(() => children.length > +props.swipeThreshold || !props.ellipsis || props.shrink);
    const navStyle = computed(() => ({
      borderColor: props.color,
      background: props.background
    }));
    const getTabName = (tab, index) => {
      var _a;
      return (_a = tab.name) != null ? _a : index;
    };
    const currentName = computed(() => {
      const activeTab = children[state.currentIndex];
      if (activeTab) {
        return getTabName(activeTab, state.currentIndex);
      }
    });
    const offsetTopPx = computed(() => unitToPx(props.offsetTop));
    const scrollOffset = computed(() => {
      if (props.sticky) {
        return offsetTopPx.value + tabHeight;
      }
      return 0;
    });
    const scrollIntoView = (immediate) => {
      const nav = navRef.value;
      const titles = titleRefs.value;
      if (!scrollable.value || !nav || !titles || !titles[state.currentIndex]) {
        return;
      }
      const title = titles[state.currentIndex].$el;
      const to = title.offsetLeft - (nav.offsetWidth - title.offsetWidth) / 2;
      if (cancelScrollLeftToRaf) cancelScrollLeftToRaf();
      cancelScrollLeftToRaf = scrollLeftTo(nav, to, immediate ? 0 : +props.duration);
    };
    const setLine = () => {
      const shouldAnimate = state.inited;
      nextTick(() => {
        const titles = titleRefs.value;
        if (!titles || !titles[state.currentIndex] || props.type !== "line" || isHidden(root.value)) {
          return;
        }
        const title = titles[state.currentIndex].$el;
        const {
          lineWidth,
          lineHeight
        } = props;
        const left = title.offsetLeft + title.offsetWidth / 2;
        const lineStyle = {
          width: addUnit(lineWidth),
          backgroundColor: props.color,
          transform: `translateX(${left}px) translateX(-50%)`
        };
        if (shouldAnimate) {
          lineStyle.transitionDuration = `${props.duration}s`;
        }
        if (isDef(lineHeight)) {
          const height = addUnit(lineHeight);
          lineStyle.height = height;
          lineStyle.borderRadius = height;
        }
        state.lineStyle = lineStyle;
      });
    };
    const findAvailableTab = (index) => {
      const diff = index < state.currentIndex ? -1 : 1;
      while (index >= 0 && index < children.length) {
        if (!children[index].disabled) {
          return index;
        }
        index += diff;
      }
    };
    const setCurrentIndex = (currentIndex, skipScrollIntoView) => {
      const newIndex = findAvailableTab(currentIndex);
      if (!isDef(newIndex)) {
        return;
      }
      const newTab = children[newIndex];
      const newName = getTabName(newTab, newIndex);
      const shouldEmitChange = state.currentIndex !== null;
      if (state.currentIndex !== newIndex) {
        state.currentIndex = newIndex;
        if (!skipScrollIntoView) {
          scrollIntoView();
        }
        setLine();
      }
      if (newName !== props.active) {
        emit("update:active", newName);
        if (shouldEmitChange) {
          emit("change", newName, newTab.title);
        }
      }
      if (stickyFixed && !props.scrollspy) {
        setRootScrollTop(Math.ceil(getElementTop(root.value) - offsetTopPx.value));
      }
    };
    const setCurrentIndexByName = (name2, skipScrollIntoView) => {
      const index = children.findIndex((tab, index2) => getTabName(tab, index2) === name2);
      setCurrentIndex(index === -1 ? 0 : index, skipScrollIntoView);
    };
    const scrollToCurrentContent = (immediate = false) => {
      if (props.scrollspy) {
        const target = children[state.currentIndex].$el;
        if (target && scroller.value) {
          const to = getElementTop(target, scroller.value) - scrollOffset.value;
          lockScroll = true;
          if (cancelScrollTopToRaf) cancelScrollTopToRaf();
          cancelScrollTopToRaf = scrollTopTo(scroller.value, to, immediate ? 0 : +props.duration, () => {
            lockScroll = false;
          });
        }
      }
    };
    const onClickTab = (item, index, event) => {
      const {
        title,
        disabled
      } = children[index];
      const name2 = getTabName(children[index], index);
      if (!disabled) {
        callInterceptor(props.beforeChange, {
          args: [name2],
          done: () => {
            setCurrentIndex(index);
            scrollToCurrentContent();
          }
        });
        route(item);
      }
      emit("clickTab", {
        name: name2,
        title,
        event,
        disabled
      });
    };
    const onStickyScroll = (params) => {
      stickyFixed = params.isFixed;
      emit("scroll", params);
    };
    const scrollTo = (name2) => {
      nextTick(() => {
        setCurrentIndexByName(name2);
        scrollToCurrentContent(true);
      });
    };
    const getCurrentIndexOnScroll = () => {
      for (let index = 0; index < children.length; index++) {
        const {
          top
        } = useRect(children[index].$el);
        if (top > scrollOffset.value) {
          return index === 0 ? 0 : index - 1;
        }
      }
      return children.length - 1;
    };
    const onScroll = () => {
      if (props.scrollspy && !lockScroll) {
        const index = getCurrentIndexOnScroll();
        setCurrentIndex(index);
      }
    };
    const renderLine = () => {
      if (props.type === "line" && children.length) {
        return createVNode("div", {
          "class": bem$t("line"),
          "style": state.lineStyle
        }, null);
      }
    };
    const renderHeader = () => {
      var _a, _b, _c;
      const {
        type,
        border,
        sticky
      } = props;
      const Header = [createVNode("div", {
        "ref": sticky ? void 0 : wrapRef,
        "class": [bem$t("wrap"), {
          [BORDER_TOP_BOTTOM]: type === "line" && border
        }]
      }, [createVNode("div", {
        "ref": navRef,
        "role": "tablist",
        "class": bem$t("nav", [type, {
          shrink: props.shrink,
          complete: scrollable.value
        }]),
        "style": navStyle.value,
        "aria-orientation": "horizontal"
      }, [(_a = slots["nav-left"]) == null ? void 0 : _a.call(slots), children.map((item) => item.renderTitle(onClickTab)), renderLine(), (_b = slots["nav-right"]) == null ? void 0 : _b.call(slots)])]), (_c = slots["nav-bottom"]) == null ? void 0 : _c.call(slots)];
      if (sticky) {
        return createVNode("div", {
          "ref": wrapRef
        }, [Header]);
      }
      return Header;
    };
    const resize = () => {
      setLine();
      nextTick(() => {
        var _a, _b;
        scrollIntoView(true);
        (_b = (_a = contentRef.value) == null ? void 0 : _a.swipeRef.value) == null ? void 0 : _b.resize();
      });
    };
    watch(() => [props.color, props.duration, props.lineWidth, props.lineHeight], setLine);
    watch(windowWidth, resize);
    watch(() => props.active, (value) => {
      if (value !== currentName.value) {
        setCurrentIndexByName(value);
      }
    });
    watch(() => children.length, () => {
      if (state.inited) {
        setCurrentIndexByName(props.active);
        setLine();
        nextTick(() => {
          scrollIntoView(true);
        });
      }
    });
    const init = () => {
      setCurrentIndexByName(props.active, true);
      nextTick(() => {
        state.inited = true;
        if (wrapRef.value) {
          tabHeight = useRect(wrapRef.value).height;
        }
        scrollIntoView(true);
      });
    };
    const onRendered = (name2, title) => emit("rendered", name2, title);
    useExpose({
      resize,
      scrollTo
    });
    onPopupReopen(setLine);
    onMountedOrActivated(init);
    useEventListener("scroll", onScroll, {
      target: scroller,
      passive: true
    });
    linkChildren({
      id,
      props,
      setLine,
      scrollable,
      onRendered,
      currentName,
      setTitleRefs,
      scrollIntoView
    });
    return () => createVNode("div", {
      "ref": root,
      "class": bem$t([props.type])
    }, [props.showHeader ? props.sticky ? createVNode(Sticky, {
      "container": root.value,
      "offsetTop": offsetTopPx.value,
      "onScroll": onStickyScroll
    }, {
      default: () => [renderHeader()]
    }) : renderHeader() : null, createVNode(stdin_default$x, {
      "ref": contentRef,
      "count": children.length,
      "inited": state.inited,
      "animated": props.animated,
      "duration": props.duration,
      "swipeable": props.swipeable,
      "lazyRender": props.lazyRender,
      "currentIndex": state.currentIndex,
      "onChange": setCurrentIndex
    }, {
      default: () => {
        var _a;
        return [(_a = slots.default) == null ? void 0 : _a.call(slots)];
      }
    })]);
  }
});
const TAB_STATUS_KEY = /* @__PURE__ */ Symbol();
const ALL_TAB_STATUS_KEY = /* @__PURE__ */ Symbol();
const useAllTabStatus = () => inject(ALL_TAB_STATUS_KEY, null);
const useProvideTabStatus = (status) => {
  const allTabStatus = useAllTabStatus();
  provide(TAB_STATUS_KEY, status);
  provide(
    ALL_TAB_STATUS_KEY,
    computed(() => {
      return (allTabStatus == null || allTabStatus.value) && status.value;
    })
  );
};
const [name$r, bem$s] = createNamespace("tab");
const TabTitle = defineComponent({
  name: name$r,
  props: {
    id: String,
    dot: Boolean,
    type: String,
    color: String,
    title: String,
    badge: numericProp,
    shrink: Boolean,
    isActive: Boolean,
    disabled: Boolean,
    controls: String,
    scrollable: Boolean,
    activeColor: String,
    inactiveColor: String,
    showZeroBadge: truthProp
  },
  setup(props, {
    slots
  }) {
    const style = computed(() => {
      const style2 = {};
      const {
        type,
        color,
        disabled,
        isActive,
        activeColor,
        inactiveColor
      } = props;
      const isCard = type === "card";
      if (color && isCard) {
        style2.borderColor = color;
        if (!disabled) {
          if (isActive) {
            style2.backgroundColor = color;
          } else {
            style2.color = color;
          }
        }
      }
      const titleColor = isActive ? activeColor : inactiveColor;
      if (titleColor) {
        style2.color = titleColor;
      }
      return style2;
    });
    const renderText = () => {
      const Text2 = createVNode("span", {
        "class": bem$s("text", {
          ellipsis: !props.scrollable
        })
      }, [slots.title ? slots.title() : props.title]);
      if (props.dot || isDef(props.badge) && props.badge !== "") {
        return createVNode(Badge, {
          "dot": props.dot,
          "content": props.badge,
          "showZero": props.showZeroBadge
        }, {
          default: () => [Text2]
        });
      }
      return Text2;
    };
    return () => createVNode("div", {
      "id": props.id,
      "role": "tab",
      "class": [bem$s([props.type, {
        grow: props.scrollable && !props.shrink,
        shrink: props.shrink,
        active: props.isActive,
        disabled: props.disabled
      }])],
      "style": style.value,
      "tabindex": props.disabled ? void 0 : props.isActive ? 0 : -1,
      "aria-selected": props.isActive,
      "aria-disabled": props.disabled || void 0,
      "aria-controls": props.controls,
      "data-allow-mismatch": "attribute"
    }, [renderText()]);
  }
});
const [name$q, bem$r] = createNamespace("swipe-item");
var stdin_default$v = defineComponent({
  name: name$q,
  setup(props, {
    slots
  }) {
    let rendered;
    const state = reactive({
      offset: 0,
      inited: false,
      mounted: false
    });
    const {
      parent,
      index
    } = useParent(SWIPE_KEY);
    if (!parent) {
      return;
    }
    const style = computed(() => {
      const style2 = {};
      const {
        vertical
      } = parent.props;
      if (parent.size.value) {
        style2[vertical ? "height" : "width"] = `${parent.size.value}px`;
      }
      if (state.offset) {
        style2.transform = `translate${vertical ? "Y" : "X"}(${state.offset}px)`;
      }
      return style2;
    });
    const shouldRender = computed(() => {
      const {
        loop,
        lazyRender
      } = parent.props;
      if (!lazyRender || rendered) {
        return true;
      }
      if (!state.mounted) {
        return false;
      }
      const active = parent.activeIndicator.value;
      const maxActive = parent.count.value - 1;
      const prevActive = active === 0 && loop ? maxActive : active - 1;
      const nextActive = active === maxActive && loop ? 0 : active + 1;
      rendered = index.value === active || index.value === prevActive || index.value === nextActive;
      return rendered;
    });
    const setOffset = (offset) => {
      state.offset = offset;
    };
    useExpose({
      setOffset
    });
    return () => {
      var _a;
      return createVNode("div", {
        "class": bem$r(),
        "style": style.value
      }, [shouldRender.value ? (_a = slots.default) == null ? void 0 : _a.call(slots) : null]);
    };
  }
});
const SwipeItem = withInstall(stdin_default$v);
const [name$p, bem$q] = createNamespace("tab");
const tabProps = extend({}, routeProps, {
  dot: Boolean,
  name: numericProp,
  badge: numericProp,
  title: String,
  disabled: Boolean,
  titleClass: unknownProp,
  titleStyle: [String, Object],
  showZeroBadge: truthProp
});
var stdin_default$u = defineComponent({
  name: name$p,
  props: tabProps,
  setup(props, {
    slots
  }) {
    const id = useId();
    const inited = ref(false);
    const instance = getCurrentInstance();
    const {
      parent,
      index
    } = useParent(TABS_KEY);
    if (!parent) {
      return;
    }
    const getName = () => {
      var _a;
      return (_a = props.name) != null ? _a : index.value;
    };
    const init = () => {
      inited.value = true;
      if (parent.props.lazyRender) {
        nextTick(() => {
          parent.onRendered(getName(), props.title);
        });
      }
    };
    const active = computed(() => {
      const isActive = getName() === parent.currentName.value;
      if (isActive && !inited.value) {
        init();
      }
      return isActive;
    });
    const parsedClass = ref("");
    const parsedStyle = ref("");
    watchEffect(() => {
      const {
        titleClass,
        titleStyle
      } = props;
      parsedClass.value = titleClass ? normalizeClass(titleClass) : "";
      parsedStyle.value = titleStyle && typeof titleStyle !== "string" ? stringifyStyle(normalizeStyle(titleStyle)) : titleStyle;
    });
    const renderTitle = (onClickTab) => createVNode(TabTitle, mergeProps({
      "key": id,
      "id": `${parent.id}-${index.value}`,
      "ref": parent.setTitleRefs(index.value),
      "style": parsedStyle.value,
      "class": parsedClass.value,
      "isActive": active.value,
      "controls": id,
      "scrollable": parent.scrollable.value,
      "activeColor": parent.props.titleActiveColor,
      "inactiveColor": parent.props.titleInactiveColor,
      "onClick": (event) => onClickTab(instance.proxy, index.value, event)
    }, pick(parent.props, ["type", "color", "shrink"]), pick(props, ["dot", "badge", "title", "disabled", "showZeroBadge"])), {
      title: slots.title
    });
    const hasInactiveClass = ref(!active.value);
    watch(active, (val) => {
      if (val) {
        hasInactiveClass.value = false;
      } else {
        doubleRaf(() => {
          hasInactiveClass.value = true;
        });
      }
    });
    watch(() => props.title, () => {
      parent.setLine();
      parent.scrollIntoView();
    });
    useProvideTabStatus(active);
    useExpose({
      id,
      renderTitle
    });
    return () => {
      var _a;
      const label = `${parent.id}-${index.value}`;
      const {
        animated,
        swipeable,
        scrollspy,
        lazyRender
      } = parent.props;
      if (!slots.default && !animated) {
        return;
      }
      const show = scrollspy || active.value;
      if (animated || swipeable) {
        return createVNode(SwipeItem, {
          "id": id,
          "role": "tabpanel",
          "class": bem$q("panel-wrapper", {
            inactive: hasInactiveClass.value
          }),
          "tabindex": active.value ? 0 : -1,
          "aria-hidden": !active.value,
          "aria-labelledby": label,
          "data-allow-mismatch": "attribute"
        }, {
          default: () => {
            var _a2;
            return [createVNode("div", {
              "class": bem$q("panel")
            }, [(_a2 = slots.default) == null ? void 0 : _a2.call(slots)])];
          }
        });
      }
      const shouldRender = inited.value || scrollspy || !lazyRender;
      const Content = shouldRender ? (_a = slots.default) == null ? void 0 : _a.call(slots) : null;
      return withDirectives(createVNode("div", {
        "id": id,
        "role": "tabpanel",
        "class": bem$q("panel"),
        "tabindex": show ? 0 : -1,
        "aria-labelledby": label,
        "data-allow-mismatch": "attribute"
      }, [Content]), [[vShow, show]]);
    };
  }
});
const Tab = withInstall(stdin_default$u);
const Tabs = withInstall(stdin_default$w);
const [name$o, bem$p] = createNamespace("picker-group");
const PICKER_GROUP_KEY = Symbol(name$o);
const pickerGroupProps = extend({
  tabs: makeArrayProp(),
  activeTab: makeNumericProp(0),
  nextStepText: String,
  showToolbar: truthProp
}, pickerToolbarProps);
defineComponent({
  name: name$o,
  props: pickerGroupProps,
  emits: ["confirm", "cancel", "update:activeTab"],
  setup(props, {
    emit,
    slots
  }) {
    const activeTab = useSyncPropRef(() => props.activeTab, (value) => emit("update:activeTab", value));
    const {
      children,
      linkChildren
    } = useChildren(PICKER_GROUP_KEY);
    linkChildren();
    const showNextButton = () => +activeTab.value < props.tabs.length - 1 && props.nextStepText;
    const onConfirm = () => {
      if (showNextButton()) {
        activeTab.value = +activeTab.value + 1;
      } else {
        emit("confirm", children.map((item) => item.confirm()));
      }
    };
    const onCancel = () => emit("cancel");
    return () => {
      var _a, _b;
      let childNodes = (_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) == null ? void 0 : _b.filter((node) => node.type !== Comment).map((node) => {
        if (node.type === Fragment) {
          return node.children;
        }
        return node;
      });
      if (childNodes) {
        childNodes = flat(childNodes);
      }
      const confirmButtonText = showNextButton() ? props.nextStepText : props.confirmButtonText;
      return createVNode("div", {
        "class": bem$p()
      }, [props.showToolbar ? createVNode(stdin_default$A, {
        "title": props.title,
        "cancelButtonText": props.cancelButtonText,
        "confirmButtonText": confirmButtonText,
        "onConfirm": onConfirm,
        "onCancel": onCancel
      }, pick(slots, pickerToolbarSlots)) : null, createVNode(Tabs, {
        "active": activeTab.value,
        "onUpdate:active": ($event) => activeTab.value = $event,
        "class": bem$p("tabs"),
        "shrink": true,
        "animated": true,
        "lazyRender": false
      }, {
        default: () => [props.tabs.map((title, index) => createVNode(Tab, {
          "title": title,
          "titleClass": bem$p("tab-title")
        }, {
          default: () => [childNodes == null ? void 0 : childNodes[index]]
        }))]
      })]);
    };
  }
});
const pickerSharedProps = extend({
  loading: Boolean,
  readonly: Boolean,
  allowHtml: Boolean,
  optionHeight: makeNumericProp(44),
  showToolbar: truthProp,
  swipeDuration: makeNumericProp(1e3),
  visibleOptionNum: makeNumericProp(6)
}, pickerToolbarProps);
const pickerProps = extend({}, pickerSharedProps, {
  columns: makeArrayProp(),
  modelValue: makeArrayProp(),
  toolbarPosition: makeStringProp("top"),
  columnsFieldNames: Object
});
var stdin_default$t = defineComponent({
  name: name$y,
  props: pickerProps,
  emits: ["confirm", "cancel", "change", "scrollInto", "clickOption", "update:modelValue"],
  setup(props, {
    emit,
    slots
  }) {
    const columnsRef = ref();
    const selectedValues = ref(props.modelValue.slice(0));
    const {
      parent
    } = useParent(PICKER_GROUP_KEY);
    const {
      children,
      linkChildren
    } = useChildren(PICKER_KEY);
    linkChildren();
    const fields = computed(() => assignDefaultFields(props.columnsFieldNames));
    const optionHeight = computed(() => unitToPx(props.optionHeight));
    const columnsType = computed(() => getColumnsType(props.columns, fields.value));
    const currentColumns = computed(() => {
      const {
        columns
      } = props;
      switch (columnsType.value) {
        case "multiple":
          return columns;
        case "cascade":
          return formatCascadeColumns(columns, fields.value, selectedValues);
        default:
          return [columns];
      }
    });
    const hasOptions = computed(() => currentColumns.value.some((options) => options.length));
    const selectedOptions = computed(() => currentColumns.value.map((options, index) => findOptionByValue(options, selectedValues.value[index], fields.value)));
    const selectedIndexes = computed(() => currentColumns.value.map((options, index) => options.findIndex((option) => option[fields.value.value] === selectedValues.value[index])));
    const setValue = (index, value) => {
      if (selectedValues.value[index] !== value) {
        const newValues = selectedValues.value.slice(0);
        newValues[index] = value;
        selectedValues.value = newValues;
      }
    };
    const getEventParams = () => ({
      selectedValues: selectedValues.value.slice(0),
      selectedOptions: selectedOptions.value,
      selectedIndexes: selectedIndexes.value
    });
    const onChange = (value, columnIndex) => {
      setValue(columnIndex, value);
      if (columnsType.value === "cascade") {
        selectedValues.value.forEach((value2, index) => {
          const options = currentColumns.value[index];
          if (!isOptionExist(options, value2, fields.value)) {
            setValue(index, options.length ? options[0][fields.value.value] : void 0);
          }
        });
      }
      nextTick(() => {
        emit("change", extend({
          columnIndex
        }, getEventParams()));
      });
    };
    const onClickOption = (currentOption, columnIndex) => {
      const params = {
        columnIndex,
        currentOption
      };
      emit("clickOption", extend(getEventParams(), params));
      emit("scrollInto", params);
    };
    const confirm = () => {
      children.forEach((child) => child.stopMomentum());
      const params = getEventParams();
      nextTick(() => {
        const params2 = getEventParams();
        emit("confirm", params2);
      });
      return params;
    };
    const cancel = () => emit("cancel", getEventParams());
    const renderColumnItems = () => currentColumns.value.map((options, columnIndex) => createVNode(stdin_default$B, {
      "value": selectedValues.value[columnIndex],
      "fields": fields.value,
      "options": options,
      "readonly": props.readonly,
      "allowHtml": props.allowHtml,
      "optionHeight": optionHeight.value,
      "swipeDuration": props.swipeDuration,
      "visibleOptionNum": props.visibleOptionNum,
      "onChange": (value) => onChange(value, columnIndex),
      "onClickOption": (option) => onClickOption(option, columnIndex),
      "onScrollInto": (option) => {
        emit("scrollInto", {
          currentOption: option,
          columnIndex
        });
      }
    }, {
      option: slots.option
    }));
    const renderMask = (wrapHeight) => {
      if (hasOptions.value) {
        const frameStyle = {
          height: `${optionHeight.value}px`
        };
        const maskStyle = {
          backgroundSize: `100% ${(wrapHeight - optionHeight.value) / 2}px`
        };
        return [createVNode("div", {
          "class": bem$y("mask"),
          "style": maskStyle
        }, null), createVNode("div", {
          "class": [BORDER_UNSET_TOP_BOTTOM, bem$y("frame")],
          "style": frameStyle
        }, null)];
      }
    };
    const renderColumns = () => {
      const wrapHeight = optionHeight.value * +props.visibleOptionNum;
      const columnsStyle = {
        height: `${wrapHeight}px`
      };
      if (!props.loading && !hasOptions.value && slots.empty) {
        return slots.empty();
      }
      return createVNode("div", {
        "ref": columnsRef,
        "class": bem$y("columns"),
        "style": columnsStyle
      }, [renderColumnItems(), renderMask(wrapHeight)]);
    };
    const renderToolbar = () => {
      if (props.showToolbar && !parent) {
        return createVNode(stdin_default$A, mergeProps(pick(props, pickerToolbarPropKeys), {
          "onConfirm": confirm,
          "onCancel": cancel
        }), pick(slots, pickerToolbarSlots));
      }
    };
    const resetSelectedValues = (columns) => {
      columns.forEach((options, index) => {
        if (options.length && !isOptionExist(options, selectedValues.value[index], fields.value)) {
          setValue(index, getFirstEnabledOption(options)[fields.value.value]);
        }
      });
    };
    watch(currentColumns, (columns) => resetSelectedValues(columns), {
      immediate: true
    });
    let lastEmittedModelValue;
    watch(() => props.modelValue, (newValues) => {
      if (!isSameValue(newValues, selectedValues.value) && !isSameValue(newValues, lastEmittedModelValue)) {
        selectedValues.value = newValues.slice(0);
        lastEmittedModelValue = newValues.slice(0);
      }
      if (props.modelValue.length === 0) {
        resetSelectedValues(currentColumns.value);
      }
    }, {
      deep: true
    });
    watch(selectedValues, (newValues) => {
      if (!isSameValue(newValues, props.modelValue)) {
        lastEmittedModelValue = newValues.slice(0);
        emit("update:modelValue", lastEmittedModelValue);
      }
    }, {
      immediate: true
    });
    useEventListener("touchmove", preventDefault, {
      target: columnsRef
    });
    const getSelectedOptions = () => selectedOptions.value;
    useExpose({
      confirm,
      getSelectedOptions
    });
    return () => {
      var _a, _b;
      return createVNode("div", {
        "class": bem$y()
      }, [props.toolbarPosition === "top" ? renderToolbar() : null, props.loading ? createVNode(Loading, {
        "class": bem$y("loading")
      }, null) : null, (_a = slots["columns-top"]) == null ? void 0 : _a.call(slots), renderColumns(), (_b = slots["columns-bottom"]) == null ? void 0 : _b.call(slots), props.toolbarPosition === "bottom" ? renderToolbar() : null]);
    };
  }
});
const Picker = withInstall(stdin_default$t);
const [name$n, bem$o] = createNamespace("cell");
const cellSharedProps = {
  tag: makeStringProp("div"),
  icon: String,
  size: String,
  title: numericProp,
  value: numericProp,
  label: numericProp,
  center: Boolean,
  isLink: Boolean,
  border: truthProp,
  iconPrefix: String,
  valueClass: unknownProp,
  labelClass: unknownProp,
  titleClass: unknownProp,
  titleStyle: null,
  arrowDirection: String,
  required: {
    type: [Boolean, String],
    default: null
  },
  clickable: {
    type: Boolean,
    default: null
  }
};
const cellProps = extend({}, cellSharedProps, routeProps);
var stdin_default$s = defineComponent({
  name: name$n,
  props: cellProps,
  setup(props, {
    slots
  }) {
    const route2 = useRoute();
    const renderLabel = () => {
      const showLabel = slots.label || isDef(props.label);
      if (showLabel) {
        return createVNode("div", {
          "class": [bem$o("label"), props.labelClass]
        }, [slots.label ? slots.label() : props.label]);
      }
    };
    const renderTitle = () => {
      var _a;
      if (slots.title || isDef(props.title)) {
        const titleSlot = (_a = slots.title) == null ? void 0 : _a.call(slots);
        if (Array.isArray(titleSlot) && titleSlot.length === 0) {
          return;
        }
        return createVNode("div", {
          "class": [bem$o("title"), props.titleClass],
          "style": props.titleStyle
        }, [titleSlot || createVNode("span", null, [props.title]), renderLabel()]);
      }
    };
    const renderValue = () => {
      const slot = slots.value || slots.default;
      const hasValue = slot || isDef(props.value);
      if (hasValue) {
        return createVNode("div", {
          "class": [bem$o("value"), props.valueClass]
        }, [slot ? slot() : createVNode("span", null, [props.value])]);
      }
    };
    const renderLeftIcon = () => {
      if (slots.icon) {
        return slots.icon();
      }
      if (props.icon) {
        return createVNode(Icon, {
          "name": props.icon,
          "class": bem$o("left-icon"),
          "classPrefix": props.iconPrefix
        }, null);
      }
    };
    const renderRightIcon = () => {
      if (slots["right-icon"]) {
        return slots["right-icon"]();
      }
      if (props.isLink) {
        const name2 = props.arrowDirection && props.arrowDirection !== "right" ? `arrow-${props.arrowDirection}` : "arrow";
        return createVNode(Icon, {
          "name": name2,
          "class": bem$o("right-icon")
        }, null);
      }
    };
    return () => {
      var _a;
      const {
        tag,
        size,
        center,
        border,
        isLink,
        required
      } = props;
      const clickable = (_a = props.clickable) != null ? _a : isLink;
      const classes = {
        center,
        required: !!required,
        clickable,
        borderless: !border
      };
      if (size) {
        classes[size] = !!size;
      }
      return createVNode(tag, {
        "class": bem$o(classes),
        "role": clickable ? "button" : void 0,
        "tabindex": clickable ? 0 : void 0,
        "onClick": route2
      }, {
        default: () => {
          var _a2;
          return [renderLeftIcon(), renderTitle(), renderValue(), renderRightIcon(), (_a2 = slots.extra) == null ? void 0 : _a2.call(slots)];
        }
      });
    };
  }
});
const Cell = withInstall(stdin_default$s);
const [name$m, bem$n] = createNamespace("form");
const formProps = {
  colon: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  required: [Boolean, String],
  showError: Boolean,
  labelWidth: numericProp,
  labelAlign: String,
  inputAlign: String,
  scrollToError: Boolean,
  scrollToErrorPosition: String,
  validateFirst: Boolean,
  submitOnEnter: truthProp,
  showErrorMessage: truthProp,
  errorMessageAlign: String,
  validateTrigger: {
    type: [String, Array],
    default: "onBlur"
  }
};
var stdin_default$r = defineComponent({
  name: name$m,
  props: formProps,
  emits: ["submit", "failed"],
  setup(props, {
    emit,
    slots
  }) {
    const {
      children,
      linkChildren
    } = useChildren(FORM_KEY);
    const getFieldsByNames = (names) => {
      if (names) {
        return children.filter((field) => names.includes(field.name));
      }
      return children;
    };
    const validateSeq = (names) => new Promise((resolve2, reject) => {
      const errors = [];
      const fields = getFieldsByNames(names);
      fields.reduce((promise, field) => promise.then(() => {
        if (!errors.length) {
          return field.validate().then((error) => {
            if (error) {
              errors.push(error);
            }
          });
        }
      }), Promise.resolve()).then(() => {
        if (errors.length) {
          reject(errors);
        } else {
          resolve2();
        }
      });
    });
    const validateAll = (names) => new Promise((resolve2, reject) => {
      const fields = getFieldsByNames(names);
      Promise.all(fields.map((item) => item.validate())).then((errors) => {
        errors = errors.filter(Boolean);
        if (errors.length) {
          reject(errors);
        } else {
          resolve2();
        }
      });
    });
    const validateField = (name2) => {
      const matched = children.find((item) => item.name === name2);
      if (matched) {
        return new Promise((resolve2, reject) => {
          matched.validate().then((error) => {
            if (error) {
              reject(error);
            } else {
              resolve2();
            }
          });
        });
      }
      return Promise.reject();
    };
    const validate2 = (name2) => {
      if (typeof name2 === "string") {
        return validateField(name2);
      }
      return props.validateFirst ? validateSeq(name2) : validateAll(name2);
    };
    const resetValidation = (name2) => {
      if (typeof name2 === "string") {
        name2 = [name2];
      }
      const fields = getFieldsByNames(name2);
      fields.forEach((item) => {
        item.resetValidation();
      });
    };
    const getValidationStatus = () => children.reduce((form, field) => {
      form[field.name] = field.getValidationStatus();
      return form;
    }, {});
    const scrollToField = (name2, options) => {
      children.some((item) => {
        if (item.name === name2) {
          item.$el.scrollIntoView(options);
          return true;
        }
        return false;
      });
    };
    const getValues = () => children.reduce((form, field) => {
      if (field.name !== void 0) {
        form[field.name] = field.formValue.value;
      }
      return form;
    }, {});
    const submit = () => {
      const values = getValues();
      validate2().then(() => emit("submit", values)).catch((errors) => {
        emit("failed", {
          values,
          errors
        });
        const {
          scrollToError,
          scrollToErrorPosition
        } = props;
        if (scrollToError && errors[0].name) {
          scrollToField(errors[0].name, scrollToErrorPosition ? {
            block: scrollToErrorPosition
          } : void 0);
        }
      });
    };
    const onSubmit = (event) => {
      preventDefault(event);
      submit();
    };
    linkChildren({
      props
    });
    useExpose({
      submit,
      validate: validate2,
      getValues,
      scrollToField,
      resetValidation,
      getValidationStatus
    });
    return () => {
      var _a;
      return createVNode("form", {
        "class": bem$n(),
        "onSubmit": onSubmit
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
  }
});
const Form = withInstall(stdin_default$r);
function isEmptyValue(value) {
  if (Array.isArray(value)) {
    return !value.length;
  }
  if (value === 0) {
    return false;
  }
  return !value;
}
function runSyncRule(value, rule) {
  if (isEmptyValue(value)) {
    if (rule.required) {
      return false;
    }
    if (rule.validateEmpty === false) {
      return true;
    }
  }
  if (rule.pattern && !rule.pattern.test(String(value))) {
    return false;
  }
  return true;
}
function runRuleValidator(value, rule) {
  return new Promise((resolve2) => {
    const returnVal = rule.validator(value, rule);
    if (isPromise(returnVal)) {
      returnVal.then(resolve2);
      return;
    }
    resolve2(returnVal);
  });
}
function getRuleMessage(value, rule) {
  const { message } = rule;
  if (isFunction(message)) {
    return message(value, rule);
  }
  return message || "";
}
function startComposing({ target }) {
  target.composing = true;
}
function endComposing({ target }) {
  if (target.composing) {
    target.composing = false;
    target.dispatchEvent(new Event("input"));
  }
}
function resizeTextarea(input, autosize) {
  const scrollTop = getRootScrollTop();
  input.style.height = "auto";
  let height = input.scrollHeight;
  if (isObject(autosize)) {
    const { maxHeight, minHeight } = autosize;
    if (maxHeight !== void 0) {
      height = Math.min(height, maxHeight);
    }
    if (minHeight !== void 0) {
      height = Math.max(height, minHeight);
    }
  }
  if (height) {
    input.style.height = `${height}px`;
    setRootScrollTop(scrollTop);
  }
}
function mapInputType(type, inputmode) {
  if (type === "number") {
    type = "text";
    inputmode != null ? inputmode : inputmode = "decimal";
  }
  if (type === "digit") {
    type = "tel";
    inputmode != null ? inputmode : inputmode = "numeric";
  }
  return { type, inputmode };
}
function getStringLength(str) {
  return [...str].length;
}
function cutString(str, maxlength) {
  return [...str].slice(0, maxlength).join("");
}
const [name$l, bem$m] = createNamespace("field");
const fieldSharedProps = {
  id: String,
  name: String,
  leftIcon: String,
  rightIcon: String,
  autofocus: Boolean,
  clearable: Boolean,
  maxlength: numericProp,
  max: Number,
  min: Number,
  formatter: Function,
  clearIcon: makeStringProp("clear"),
  modelValue: makeNumericProp(""),
  inputAlign: String,
  placeholder: String,
  autocomplete: String,
  autocapitalize: String,
  autocorrect: String,
  errorMessage: String,
  enterkeyhint: String,
  clearTrigger: makeStringProp("focus"),
  formatTrigger: makeStringProp("onChange"),
  spellcheck: {
    type: Boolean,
    default: null
  },
  error: {
    type: Boolean,
    default: null
  },
  disabled: {
    type: Boolean,
    default: null
  },
  readonly: {
    type: Boolean,
    default: null
  },
  inputmode: String
};
const fieldProps = extend({}, cellSharedProps, fieldSharedProps, {
  rows: numericProp,
  type: makeStringProp("text"),
  rules: Array,
  autosize: [Boolean, Object],
  labelWidth: numericProp,
  labelClass: unknownProp,
  labelAlign: String,
  showWordLimit: Boolean,
  errorMessageAlign: String,
  colon: {
    type: Boolean,
    default: null
  }
});
var stdin_default$q = defineComponent({
  name: name$l,
  props: fieldProps,
  emits: ["blur", "focus", "clear", "keypress", "clickInput", "endValidate", "startValidate", "clickLeftIcon", "clickRightIcon", "update:modelValue"],
  setup(props, {
    emit,
    slots
  }) {
    const id = useId();
    const state = reactive({
      status: "unvalidated",
      focused: false,
      validateMessage: ""
    });
    const inputRef = ref();
    const clearIconRef = ref();
    const customValue = ref();
    const {
      parent: form
    } = useParent(FORM_KEY);
    const getModelValue = () => {
      var _a;
      return String((_a = props.modelValue) != null ? _a : "");
    };
    const getProp = (key) => {
      if (isDef(props[key])) {
        return props[key];
      }
      if (form && isDef(form.props[key])) {
        return form.props[key];
      }
    };
    const showClear = computed(() => {
      const readonly = getProp("readonly");
      if (props.clearable && !readonly) {
        const hasValue = getModelValue() !== "";
        const trigger = props.clearTrigger === "always" || props.clearTrigger === "focus" && state.focused;
        return hasValue && trigger;
      }
      return false;
    });
    const formValue = computed(() => {
      if (customValue.value && slots.input) {
        return customValue.value();
      }
      return props.modelValue;
    });
    const showRequiredMark = computed(() => {
      var _a;
      const required = getProp("required");
      if (required === "auto") {
        return (_a = props.rules) == null ? void 0 : _a.some((rule) => rule.required);
      }
      return required;
    });
    const runRules = (rules) => rules.reduce((promise, rule) => promise.then(() => {
      if (state.status === "failed") {
        return;
      }
      let {
        value
      } = formValue;
      if (rule.formatter) {
        value = rule.formatter(value, rule);
      }
      if (!runSyncRule(value, rule)) {
        state.status = "failed";
        state.validateMessage = getRuleMessage(value, rule);
        return;
      }
      if (rule.validator) {
        if (isEmptyValue(value) && rule.validateEmpty === false) {
          return;
        }
        return runRuleValidator(value, rule).then((result) => {
          if (result && typeof result === "string") {
            state.status = "failed";
            state.validateMessage = result;
          } else if (result === false) {
            state.status = "failed";
            state.validateMessage = getRuleMessage(value, rule);
          }
        });
      }
    }), Promise.resolve());
    const resetValidation = () => {
      state.status = "unvalidated";
      state.validateMessage = "";
    };
    const endValidate = () => emit("endValidate", {
      status: state.status,
      message: state.validateMessage
    });
    const validate2 = (rules = props.rules) => new Promise((resolve2) => {
      resetValidation();
      if (rules) {
        emit("startValidate");
        runRules(rules).then(() => {
          if (state.status === "failed") {
            resolve2({
              name: props.name,
              message: state.validateMessage
            });
            endValidate();
          } else {
            state.status = "passed";
            resolve2();
            endValidate();
          }
        });
      } else {
        resolve2();
      }
    });
    const validateWithTrigger = (trigger) => {
      if (form && props.rules) {
        const {
          validateTrigger
        } = form.props;
        const defaultTrigger = toArray(validateTrigger).includes(trigger);
        const rules = props.rules.filter((rule) => {
          if (rule.trigger) {
            return toArray(rule.trigger).includes(trigger);
          }
          return defaultTrigger;
        });
        if (rules.length) {
          validate2(rules);
        }
      }
    };
    const limitValueLength = (value) => {
      var _a;
      const {
        maxlength
      } = props;
      if (isDef(maxlength) && getStringLength(value) > +maxlength) {
        const modelValue = getModelValue();
        if (modelValue && getStringLength(modelValue) === +maxlength) {
          return modelValue;
        }
        let selectionEnd = (_a = inputRef.value) == null ? void 0 : _a.selectionEnd;
        if (state.focused && selectionEnd) {
          const valueArr = [...value];
          const exceededLength = valueArr.length - +maxlength;
          selectionEnd = getStringLength(value.slice(0, selectionEnd));
          valueArr.splice(selectionEnd - exceededLength, exceededLength);
          return valueArr.join("");
        }
        return cutString(value, +maxlength);
      }
      return value;
    };
    const updateValue = (value, trigger = "onChange") => {
      var _a, _b;
      const originalValue = value;
      value = limitValueLength(value);
      const limitDiffLen = originalValue.length - value.length;
      if (props.type === "number" || props.type === "digit") {
        const isNumber2 = props.type === "number";
        value = formatNumber(value, isNumber2, isNumber2);
        if (trigger === "onBlur" && value !== "" && (props.min !== void 0 || props.max !== void 0)) {
          const adjustedValue = clamp(+value, (_a = props.min) != null ? _a : -Infinity, (_b = props.max) != null ? _b : Infinity);
          if (+value !== adjustedValue) {
            value = adjustedValue.toString();
          }
        }
      }
      let formatterDiffLen = 0;
      if (props.formatter && trigger === props.formatTrigger) {
        const {
          formatter,
          maxlength
        } = props;
        value = formatter(value);
        if (isDef(maxlength) && getStringLength(value) > +maxlength) {
          value = cutString(value, +maxlength);
        }
        if (inputRef.value && state.focused) {
          const {
            selectionEnd
          } = inputRef.value;
          const bcoVal = cutString(originalValue, selectionEnd);
          formatterDiffLen = formatter(bcoVal).length - bcoVal.length;
        }
      }
      if (inputRef.value && inputRef.value.value !== value) {
        if (state.focused) {
          let {
            selectionStart,
            selectionEnd
          } = inputRef.value;
          inputRef.value.value = value;
          if (isDef(selectionStart) && isDef(selectionEnd)) {
            const valueLen = value.length;
            if (limitDiffLen) {
              selectionStart -= limitDiffLen;
              selectionEnd -= limitDiffLen;
            } else if (formatterDiffLen) {
              selectionStart += formatterDiffLen;
              selectionEnd += formatterDiffLen;
            }
            inputRef.value.setSelectionRange(Math.min(selectionStart, valueLen), Math.min(selectionEnd, valueLen));
          }
        } else {
          inputRef.value.value = value;
        }
      }
      if (value !== props.modelValue) {
        emit("update:modelValue", value);
      }
    };
    const onInput = (event) => {
      if (!event.target.composing) {
        updateValue(event.target.value);
      }
    };
    const blur = () => {
      var _a;
      return (_a = inputRef.value) == null ? void 0 : _a.blur();
    };
    const focus = () => {
      var _a;
      return (_a = inputRef.value) == null ? void 0 : _a.focus();
    };
    const adjustTextareaSize = () => {
      const input = inputRef.value;
      if (props.type === "textarea" && props.autosize && input) {
        resizeTextarea(input, props.autosize);
      }
    };
    const onFocus = (event) => {
      state.focused = true;
      emit("focus", event);
      nextTick(adjustTextareaSize);
      if (getProp("readonly")) {
        blur();
      }
    };
    const onBlur = (event) => {
      state.focused = false;
      updateValue(getModelValue(), "onBlur");
      emit("blur", event);
      if (getProp("readonly")) {
        return;
      }
      validateWithTrigger("onBlur");
      nextTick(adjustTextareaSize);
    };
    const onClickInput = (event) => emit("clickInput", event);
    const onClickLeftIcon = (event) => emit("clickLeftIcon", event);
    const onClickRightIcon = (event) => emit("clickRightIcon", event);
    const onClear = (event) => {
      preventDefault(event);
      emit("update:modelValue", "");
      emit("clear", event);
    };
    const showError2 = computed(() => {
      if (typeof props.error === "boolean") {
        return props.error;
      }
      if (form && form.props.showError && state.status === "failed") {
        return true;
      }
    });
    const labelStyle = computed(() => {
      const labelWidth = getProp("labelWidth");
      const labelAlign = getProp("labelAlign");
      if (labelWidth && labelAlign !== "top") {
        return {
          width: addUnit(labelWidth)
        };
      }
    });
    const onKeypress = (event) => {
      const ENTER_CODE = 13;
      if (event.keyCode === ENTER_CODE) {
        const submitOnEnter = form && form.props.submitOnEnter;
        if (!submitOnEnter && props.type !== "textarea") {
          preventDefault(event);
        }
        if (props.type === "search") {
          blur();
        }
      }
      emit("keypress", event);
    };
    const getInputId = () => props.id || `${id}-input`;
    const getValidationStatus = () => state.status;
    const renderInput = () => {
      const controlClass = bem$m("control", [getProp("inputAlign"), {
        error: showError2.value,
        custom: !!slots.input,
        "min-height": props.type === "textarea" && !props.autosize
      }]);
      if (slots.input) {
        return createVNode("div", {
          "class": controlClass,
          "onClick": onClickInput
        }, [slots.input()]);
      }
      const inputAttrs = {
        id: getInputId(),
        ref: inputRef,
        name: props.name,
        rows: props.rows !== void 0 ? +props.rows : void 0,
        class: controlClass,
        disabled: getProp("disabled"),
        readonly: getProp("readonly"),
        autofocus: props.autofocus,
        placeholder: props.placeholder,
        autocomplete: props.autocomplete,
        autocapitalize: props.autocapitalize,
        autocorrect: props.autocorrect,
        enterkeyhint: props.enterkeyhint,
        spellcheck: props.spellcheck,
        "aria-labelledby": props.label ? `${id}-label` : void 0,
        "data-allow-mismatch": "attribute",
        onBlur,
        onFocus,
        onInput,
        onClick: onClickInput,
        onChange: endComposing,
        onKeypress,
        onCompositionend: endComposing,
        onCompositionstart: startComposing
      };
      if (props.type === "textarea") {
        return createVNode("textarea", mergeProps(inputAttrs, {
          "inputmode": props.inputmode
        }), null);
      }
      return createVNode("input", mergeProps(mapInputType(props.type, props.inputmode), inputAttrs), null);
    };
    const renderLeftIcon = () => {
      const leftIconSlot = slots["left-icon"];
      if (props.leftIcon || leftIconSlot) {
        return createVNode("div", {
          "class": bem$m("left-icon"),
          "onClick": onClickLeftIcon
        }, [leftIconSlot ? leftIconSlot() : createVNode(Icon, {
          "name": props.leftIcon,
          "classPrefix": props.iconPrefix
        }, null)]);
      }
    };
    const renderRightIcon = () => {
      const rightIconSlot = slots["right-icon"];
      if (props.rightIcon || rightIconSlot) {
        return createVNode("div", {
          "class": bem$m("right-icon"),
          "onClick": onClickRightIcon
        }, [rightIconSlot ? rightIconSlot() : createVNode(Icon, {
          "name": props.rightIcon,
          "classPrefix": props.iconPrefix
        }, null)]);
      }
    };
    const renderWordLimit = () => {
      if (props.showWordLimit && props.maxlength) {
        const count = getStringLength(getModelValue());
        return createVNode("div", {
          "class": bem$m("word-limit")
        }, [createVNode("span", {
          "class": bem$m("word-num")
        }, [count]), createTextVNode("/"), props.maxlength]);
      }
    };
    const renderMessage = () => {
      if (form && form.props.showErrorMessage === false) {
        return;
      }
      const message = props.errorMessage || state.validateMessage;
      if (message) {
        const slot = slots["error-message"];
        const errorMessageAlign = getProp("errorMessageAlign");
        return createVNode("div", {
          "class": bem$m("error-message", errorMessageAlign)
        }, [slot ? slot({
          message
        }) : message]);
      }
    };
    const renderLabel = () => {
      const labelWidth = getProp("labelWidth");
      const labelAlign = getProp("labelAlign");
      const colon = getProp("colon") ? ":" : "";
      if (slots.label) {
        return [slots.label(), colon];
      }
      if (props.label) {
        return createVNode("label", {
          "id": `${id}-label`,
          "for": slots.input ? void 0 : getInputId(),
          "data-allow-mismatch": "attribute",
          "onClick": (event) => {
            preventDefault(event);
            focus();
          },
          "style": labelAlign === "top" && labelWidth ? {
            width: addUnit(labelWidth)
          } : void 0
        }, [props.label + colon]);
      }
    };
    const renderFieldBody = () => [createVNode("div", {
      "class": bem$m("body")
    }, [renderInput(), showClear.value && createVNode(Icon, {
      "ref": clearIconRef,
      "name": props.clearIcon,
      "class": bem$m("clear")
    }, null), renderRightIcon(), slots.button && createVNode("div", {
      "class": bem$m("button")
    }, [slots.button()])]), renderWordLimit(), renderMessage()];
    useExpose({
      blur,
      focus,
      validate: validate2,
      formValue,
      resetValidation,
      getValidationStatus
    });
    provide(CUSTOM_FIELD_INJECTION_KEY, {
      customValue,
      resetValidation,
      validateWithTrigger
    });
    watch(() => props.modelValue, () => {
      updateValue(getModelValue());
      resetValidation();
      validateWithTrigger("onChange");
      nextTick(adjustTextareaSize);
    });
    useEventListener("touchstart", onClear, {
      target: computed(() => {
        var _a;
        return (_a = clearIconRef.value) == null ? void 0 : _a.$el;
      })
    });
    return () => {
      const disabled = getProp("disabled");
      const labelAlign = getProp("labelAlign");
      const LeftIcon = renderLeftIcon();
      const renderTitle = () => {
        const Label = renderLabel();
        if (labelAlign === "top") {
          return [LeftIcon, Label].filter(Boolean);
        }
        return Label || [];
      };
      return createVNode(Cell, {
        "size": props.size,
        "class": bem$m({
          error: showError2.value,
          disabled,
          [`label-${labelAlign}`]: labelAlign
        }),
        "center": props.center,
        "border": props.border,
        "isLink": props.isLink,
        "clickable": props.clickable,
        "titleStyle": labelStyle.value,
        "valueClass": bem$m("value"),
        "titleClass": [bem$m("label", [labelAlign, {
          required: showRequiredMark.value
        }]), props.labelClass],
        "arrowDirection": props.arrowDirection
      }, {
        icon: LeftIcon && labelAlign !== "top" ? () => LeftIcon : null,
        title: renderTitle,
        value: renderFieldBody,
        extra: slots.extra
      });
    };
  }
});
const Field = withInstall(stdin_default$q);
let lockCount = 0;
function lockClick(lock) {
  if (lock) {
    if (!lockCount) {
      (void 0).body.classList.add("van-toast--unclickable");
    }
    lockCount++;
  } else if (lockCount) {
    lockCount--;
    if (!lockCount) {
      (void 0).body.classList.remove("van-toast--unclickable");
    }
  }
}
const [name$k, bem$l] = createNamespace("toast");
const popupInheritProps = ["show", "overlay", "teleport", "transition", "overlayClass", "overlayStyle", "closeOnClickOverlay", "zIndex"];
const toastProps = {
  icon: String,
  show: Boolean,
  type: makeStringProp("text"),
  overlay: Boolean,
  message: numericProp,
  iconSize: numericProp,
  duration: makeNumberProp(2e3),
  position: makeStringProp("middle"),
  teleport: [String, Object],
  wordBreak: String,
  className: unknownProp,
  iconPrefix: String,
  transition: makeStringProp("van-fade"),
  loadingType: String,
  forbidClick: Boolean,
  overlayClass: unknownProp,
  overlayStyle: Object,
  closeOnClick: Boolean,
  closeOnClickOverlay: Boolean,
  zIndex: numericProp
};
var stdin_default$p = defineComponent({
  name: name$k,
  props: toastProps,
  emits: ["update:show"],
  setup(props, {
    emit,
    slots
  }) {
    let timer;
    let clickable = false;
    const toggleClickable = () => {
      const newValue = props.show && props.forbidClick;
      if (clickable !== newValue) {
        clickable = newValue;
        lockClick(clickable);
      }
    };
    const updateShow = (show) => emit("update:show", show);
    const onClick = () => {
      if (props.closeOnClick) {
        updateShow(false);
      }
    };
    const clearTimer = () => clearTimeout(timer);
    const renderIcon = () => {
      const {
        icon,
        type,
        iconSize,
        iconPrefix,
        loadingType
      } = props;
      const hasIcon = icon || type === "success" || type === "fail";
      if (hasIcon) {
        return createVNode(Icon, {
          "name": icon || type,
          "size": iconSize,
          "class": bem$l("icon"),
          "classPrefix": iconPrefix
        }, null);
      }
      if (type === "loading") {
        return createVNode(Loading, {
          "class": bem$l("loading"),
          "size": iconSize,
          "type": loadingType
        }, null);
      }
    };
    const renderMessage = () => {
      const {
        type,
        message
      } = props;
      if (slots.message) {
        return createVNode("div", {
          "class": bem$l("text")
        }, [slots.message()]);
      }
      if (isDef(message) && message !== "") {
        return type === "html" ? createVNode("div", {
          "key": 0,
          "class": bem$l("text"),
          "innerHTML": String(message)
        }, null) : createVNode("div", {
          "class": bem$l("text")
        }, [message]);
      }
    };
    watch(() => [props.show, props.forbidClick], toggleClickable);
    watch(() => [props.show, props.type, props.message, props.duration], () => {
      clearTimer();
      if (props.show && props.duration > 0) {
        timer = setTimeout(() => {
          updateShow(false);
        }, props.duration);
      }
    });
    return () => createVNode(Popup, mergeProps({
      "class": [bem$l([props.position, props.wordBreak === "normal" ? "break-normal" : props.wordBreak, {
        [props.type]: !props.icon
      }]), props.className],
      "lockScroll": false,
      "onClick": onClick,
      "onClosed": clearTimer,
      "onUpdate:show": updateShow
    }, pick(props, popupInheritProps)), {
      default: () => [renderIcon(), renderMessage()]
    });
  }
});
const Toast = withInstall(stdin_default$p);
const [name$j, bem$k] = createNamespace("tag");
const tagProps = {
  size: String,
  mark: Boolean,
  show: truthProp,
  type: makeStringProp("default"),
  color: String,
  plain: Boolean,
  round: Boolean,
  textColor: String,
  closeable: Boolean
};
var stdin_default$o = defineComponent({
  name: name$j,
  props: tagProps,
  emits: ["close"],
  setup(props, {
    slots,
    emit
  }) {
    const onClose = (event) => {
      event.stopPropagation();
      emit("close", event);
    };
    const getStyle = () => {
      if (props.plain) {
        return {
          color: props.textColor || props.color,
          borderColor: props.color
        };
      }
      return {
        color: props.textColor,
        background: props.color
      };
    };
    const renderTag = () => {
      var _a;
      const {
        type,
        mark,
        plain,
        round,
        size,
        closeable
      } = props;
      const classes = {
        mark,
        plain,
        round
      };
      if (size) {
        classes[size] = size;
      }
      const CloseIcon = closeable && createVNode(Icon, {
        "name": "cross",
        "class": [bem$k("close"), HAPTICS_FEEDBACK],
        "onClick": onClose
      }, null);
      return createVNode("span", {
        "style": getStyle(),
        "class": bem$k([classes, type])
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots), CloseIcon]);
    };
    return () => createVNode(Transition, {
      "name": props.closeable ? "van-fade" : void 0
    }, {
      default: () => [props.show ? renderTag() : null]
    });
  }
});
const Tag = withInstall(stdin_default$o);
const [name$i, bem$j] = createNamespace("image");
const imageProps = {
  src: String,
  alt: String,
  fit: String,
  position: String,
  round: Boolean,
  block: Boolean,
  width: numericProp,
  height: numericProp,
  radius: numericProp,
  lazyLoad: Boolean,
  iconSize: numericProp,
  showError: truthProp,
  errorIcon: makeStringProp("photo-fail"),
  iconPrefix: String,
  showLoading: truthProp,
  loadingIcon: makeStringProp("photo"),
  crossorigin: String,
  referrerpolicy: String,
  decoding: String
};
var stdin_default$n = defineComponent({
  name: name$i,
  props: imageProps,
  emits: ["load", "error"],
  setup(props, {
    emit,
    slots
  }) {
    const error = ref(false);
    const loading = ref(true);
    const imageRef = ref();
    const {
      $Lazyload
    } = getCurrentInstance().proxy;
    const style = computed(() => {
      const style2 = {
        width: addUnit(props.width),
        height: addUnit(props.height)
      };
      if (isDef(props.radius)) {
        style2.overflow = "hidden";
        style2.borderRadius = addUnit(props.radius);
      }
      return style2;
    });
    watch(() => props.src, () => {
      error.value = false;
      loading.value = true;
    });
    const onLoad = (event) => {
      if (loading.value) {
        loading.value = false;
        emit("load", event);
      }
    };
    const onError = (event) => {
      error.value = true;
      loading.value = false;
      emit("error", event);
    };
    const renderIcon = (name2, className, slot) => {
      if (slot) {
        return slot();
      }
      return createVNode(Icon, {
        "name": name2,
        "size": props.iconSize,
        "class": className,
        "classPrefix": props.iconPrefix
      }, null);
    };
    const renderPlaceholder = () => {
      if (loading.value && props.showLoading) {
        return createVNode("div", {
          "class": bem$j("loading")
        }, [renderIcon(props.loadingIcon, bem$j("loading-icon"), slots.loading)]);
      }
      if (error.value && props.showError) {
        return createVNode("div", {
          "class": bem$j("error")
        }, [renderIcon(props.errorIcon, bem$j("error-icon"), slots.error)]);
      }
    };
    const renderImage = () => {
      if (error.value || !props.src) {
        return;
      }
      const attrs = {
        alt: props.alt,
        class: bem$j("img"),
        decoding: props.decoding,
        style: {
          objectFit: props.fit,
          objectPosition: props.position
        },
        crossorigin: props.crossorigin,
        referrerpolicy: props.referrerpolicy
      };
      if (props.lazyLoad) {
        return withDirectives(createVNode("img", mergeProps({
          "ref": imageRef
        }, attrs), null), [[resolveDirective("lazy"), props.src]]);
      }
      return createVNode("img", mergeProps({
        "ref": imageRef,
        "src": props.src,
        "onLoad": onLoad,
        "onError": onError
      }, attrs), null);
    };
    return () => {
      var _a;
      return createVNode("div", {
        "class": bem$j({
          round: props.round,
          block: props.block
        }),
        "style": style.value
      }, [renderImage(), renderPlaceholder(), (_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
  }
});
const Image = withInstall(stdin_default$n);
const [name$h, bem$i] = createNamespace("card");
const cardProps = {
  tag: String,
  num: numericProp,
  desc: String,
  thumb: String,
  title: String,
  price: numericProp,
  centered: Boolean,
  lazyLoad: Boolean,
  currency: makeStringProp("¥"),
  thumbLink: String,
  originPrice: numericProp
};
var stdin_default$m = defineComponent({
  name: name$h,
  props: cardProps,
  emits: ["clickThumb"],
  setup(props, {
    slots,
    emit
  }) {
    const renderTitle = () => {
      if (slots.title) {
        return slots.title();
      }
      if (props.title) {
        return createVNode("div", {
          "class": [bem$i("title"), "van-multi-ellipsis--l2"]
        }, [props.title]);
      }
    };
    const renderThumbTag = () => {
      if (slots.tag || props.tag) {
        return createVNode("div", {
          "class": bem$i("tag")
        }, [slots.tag ? slots.tag() : createVNode(Tag, {
          "mark": true,
          "type": "primary"
        }, {
          default: () => [props.tag]
        })]);
      }
    };
    const renderThumbImage = () => {
      if (slots.thumb) {
        return slots.thumb();
      }
      return createVNode(Image, {
        "src": props.thumb,
        "fit": "cover",
        "width": "100%",
        "height": "100%",
        "lazyLoad": props.lazyLoad
      }, null);
    };
    const renderThumb = () => {
      if (slots.thumb || props.thumb) {
        return createVNode("a", {
          "href": props.thumbLink,
          "class": bem$i("thumb"),
          "onClick": (event) => emit("clickThumb", event)
        }, [renderThumbImage(), renderThumbTag()]);
      }
    };
    const renderDesc = () => {
      if (slots.desc) {
        return slots.desc();
      }
      if (props.desc) {
        return createVNode("div", {
          "class": [bem$i("desc"), "van-ellipsis"]
        }, [props.desc]);
      }
    };
    const renderPriceText = () => {
      const priceArr = props.price.toString().split(".");
      return createVNode("div", null, [createVNode("span", {
        "class": bem$i("price-currency")
      }, [props.currency]), createVNode("span", {
        "class": bem$i("price-integer")
      }, [priceArr[0]]), priceArr.length > 1 && createVNode(Fragment, null, [createTextVNode("."), createVNode("span", {
        "class": bem$i("price-decimal")
      }, [priceArr[1]])])]);
    };
    return () => {
      var _a, _b, _c;
      const showNum = slots.num || isDef(props.num);
      const showPrice = slots.price || isDef(props.price);
      const showOriginPrice = slots["origin-price"] || isDef(props.originPrice);
      const showBottom = showNum || showPrice || showOriginPrice || slots.bottom;
      const Price = showPrice && createVNode("div", {
        "class": bem$i("price")
      }, [slots.price ? slots.price() : renderPriceText()]);
      const OriginPrice = showOriginPrice && createVNode("div", {
        "class": bem$i("origin-price")
      }, [slots["origin-price"] ? slots["origin-price"]() : `${props.currency} ${props.originPrice}`]);
      const Num = showNum && createVNode("div", {
        "class": bem$i("num")
      }, [slots.num ? slots.num() : `x${props.num}`]);
      const Footer = slots.footer && createVNode("div", {
        "class": bem$i("footer")
      }, [slots.footer()]);
      const Bottom = showBottom && createVNode("div", {
        "class": bem$i("bottom")
      }, [(_a = slots["price-top"]) == null ? void 0 : _a.call(slots), Price, OriginPrice, Num, (_b = slots.bottom) == null ? void 0 : _b.call(slots)]);
      return createVNode("div", {
        "class": bem$i()
      }, [createVNode("div", {
        "class": bem$i("header")
      }, [renderThumb(), createVNode("div", {
        "class": bem$i("content", {
          centered: props.centered
        })
      }, [createVNode("div", null, [renderTitle(), renderDesc(), (_c = slots.tags) == null ? void 0 : _c.call(slots)]), Bottom])]), Footer]);
    };
  }
});
const Card = withInstall(stdin_default$m);
const [name$g, bem$h] = createNamespace("cell-group");
const cellGroupProps = {
  title: String,
  inset: Boolean,
  border: truthProp
};
var stdin_default$l = defineComponent({
  name: name$g,
  inheritAttrs: false,
  props: cellGroupProps,
  setup(props, {
    slots,
    attrs
  }) {
    const renderGroup = () => {
      var _a;
      return createVNode("div", mergeProps({
        "class": [bem$h({
          inset: props.inset
        }), {
          [BORDER_TOP_BOTTOM]: props.border && !props.inset
        }]
      }, attrs, useScopeId()), [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
    const renderTitle = () => createVNode("div", {
      "class": bem$h("title", {
        inset: props.inset
      })
    }, [slots.title ? slots.title() : props.title]);
    return () => {
      if (props.title || slots.title) {
        return createVNode(Fragment, null, [renderTitle(), renderGroup()]);
      }
      return renderGroup();
    };
  }
});
const CellGroup = withInstall(stdin_default$l);
const [name$f, bem$g] = createNamespace("circle");
let uid = 0;
const format = (rate) => Math.min(Math.max(+rate, 0), 100);
function getPath(clockwise, viewBoxSize) {
  const sweepFlag = clockwise ? 1 : 0;
  return `M ${viewBoxSize / 2} ${viewBoxSize / 2} m 0, -500 a 500, 500 0 1, ${sweepFlag} 0, 1000 a 500, 500 0 1, ${sweepFlag} 0, -1000`;
}
const circleProps = {
  text: String,
  size: numericProp,
  fill: makeStringProp("none"),
  rate: makeNumericProp(100),
  speed: makeNumericProp(0),
  color: [String, Object],
  clockwise: truthProp,
  layerColor: String,
  currentRate: makeNumberProp(0),
  strokeWidth: makeNumericProp(40),
  strokeLinecap: String,
  startPosition: makeStringProp("top")
};
var stdin_default$k = defineComponent({
  name: name$f,
  props: circleProps,
  emits: ["update:currentRate"],
  setup(props, {
    emit,
    slots
  }) {
    const id = `van-circle-${uid++}`;
    const viewBoxSize = computed(() => +props.strokeWidth + 1e3);
    const path = computed(() => getPath(props.clockwise, viewBoxSize.value));
    const svgStyle = computed(() => {
      const ROTATE_ANGLE_MAP = {
        top: 0,
        right: 90,
        bottom: 180,
        left: 270
      };
      const angleValue = ROTATE_ANGLE_MAP[props.startPosition];
      if (angleValue) {
        return {
          transform: `rotate(${angleValue}deg)`
        };
      }
    });
    watch(() => props.rate, (rate) => {
      let rafId;
      const startTime = Date.now();
      const startRate = props.currentRate;
      const endRate = format(rate);
      const duration = Math.abs((startRate - endRate) * 1e3 / +props.speed);
      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const rate2 = progress * (endRate - startRate) + startRate;
        emit("update:currentRate", format(parseFloat(rate2.toFixed(1))));
        if (endRate > startRate ? rate2 < endRate : rate2 > endRate) {
          rafId = raf(animate);
        }
      };
      if (props.speed) {
        if (rafId) {
          cancelRaf(rafId);
        }
        rafId = raf(animate);
      } else {
        emit("update:currentRate", endRate);
      }
    }, {
      immediate: true
    });
    const renderHover = () => {
      const PERIMETER = 3140;
      const {
        strokeWidth,
        currentRate,
        strokeLinecap
      } = props;
      const offset = PERIMETER * currentRate / 100;
      const color = isObject(props.color) ? `url(#${id})` : props.color;
      const style = {
        stroke: color,
        strokeWidth: `${+strokeWidth + 1}px`,
        strokeLinecap,
        strokeDasharray: `${offset}px ${PERIMETER}px`
      };
      return createVNode("path", {
        "d": path.value,
        "style": style,
        "class": bem$g("hover"),
        "stroke": color
      }, null);
    };
    const renderLayer = () => {
      const style = {
        fill: props.fill,
        stroke: props.layerColor,
        strokeWidth: `${props.strokeWidth}px`
      };
      return createVNode("path", {
        "class": bem$g("layer"),
        "style": style,
        "d": path.value
      }, null);
    };
    const renderGradient = () => {
      const {
        color
      } = props;
      if (!isObject(color)) {
        return;
      }
      const Stops = Object.keys(color).sort((a, b) => parseFloat(a) - parseFloat(b)).map((key, index) => createVNode("stop", {
        "key": index,
        "offset": key,
        "stop-color": color[key]
      }, null));
      return createVNode("defs", null, [createVNode("linearGradient", {
        "id": id,
        "x1": "100%",
        "y1": "0%",
        "x2": "0%",
        "y2": "0%"
      }, [Stops])]);
    };
    const renderText = () => {
      if (slots.default) {
        return slots.default();
      }
      if (props.text) {
        return createVNode("div", {
          "class": bem$g("text")
        }, [props.text]);
      }
    };
    return () => createVNode("div", {
      "class": bem$g(),
      "style": getSizeStyle(props.size)
    }, [createVNode("svg", {
      "viewBox": `0 0 ${viewBoxSize.value} ${viewBoxSize.value}`,
      "style": svgStyle.value
    }, [renderGradient(), renderLayer(), renderHover()]), renderText()]);
  }
});
const Circle = withInstall(stdin_default$k);
const [name$e, bem$f] = createNamespace("empty");
const emptyProps = {
  image: makeStringProp("default"),
  imageSize: [Number, String, Array],
  description: String
};
var stdin_default$j = defineComponent({
  name: name$e,
  props: emptyProps,
  setup(props, {
    slots
  }) {
    const renderDescription = () => {
      const description = slots.description ? slots.description() : props.description;
      if (description) {
        return createVNode("p", {
          "class": bem$f("description")
        }, [description]);
      }
    };
    const renderBottom = () => {
      if (slots.default) {
        return createVNode("div", {
          "class": bem$f("bottom")
        }, [slots.default()]);
      }
    };
    const baseId = useId();
    const getId = (num) => `${baseId}-${num}`;
    const getUrlById = (num) => `url(#${getId(num)})`;
    const renderStop = (color, offset, opacity) => createVNode("stop", {
      "stop-color": color,
      "offset": `${offset}%`,
      "stop-opacity": opacity
    }, null);
    const renderStops = (fromColor, toColor) => [renderStop(fromColor, 0), renderStop(toColor, 100)];
    const renderShadow = (id) => [createVNode("defs", null, [createVNode("radialGradient", {
      "id": getId(id),
      "cx": "50%",
      "cy": "54%",
      "fx": "50%",
      "fy": "54%",
      "r": "297%",
      "gradientTransform": "matrix(-.16 0 0 -.33 .58 .72)",
      "data-allow-mismatch": "attribute"
    }, [renderStop("#EBEDF0", 0), renderStop("#F2F3F5", 100, 0.3)])]), createVNode("ellipse", {
      "fill": getUrlById(id),
      "opacity": ".8",
      "cx": "80",
      "cy": "140",
      "rx": "46",
      "ry": "8",
      "data-allow-mismatch": "attribute"
    }, null)];
    const renderBuilding = () => [createVNode("defs", null, [createVNode("linearGradient", {
      "id": getId("a"),
      "x1": "64%",
      "y1": "100%",
      "x2": "64%",
      "data-allow-mismatch": "attribute"
    }, [renderStop("#FFF", 0, 0.5), renderStop("#F2F3F5", 100)])]), createVNode("g", {
      "opacity": ".8",
      "data-allow-mismatch": "children"
    }, [createVNode("path", {
      "d": "M36 131V53H16v20H2v58h34z",
      "fill": getUrlById("a")
    }, null), createVNode("path", {
      "d": "M123 15h22v14h9v77h-31V15z",
      "fill": getUrlById("a")
    }, null)])];
    const renderCloud = () => [createVNode("defs", null, [createVNode("linearGradient", {
      "id": getId("b"),
      "x1": "64%",
      "y1": "97%",
      "x2": "64%",
      "y2": "0%",
      "data-allow-mismatch": "attribute"
    }, [renderStop("#F2F3F5", 0, 0.3), renderStop("#F2F3F5", 100)])]), createVNode("g", {
      "opacity": ".8",
      "data-allow-mismatch": "children"
    }, [createVNode("path", {
      "d": "M87 6c3 0 7 3 8 6a8 8 0 1 1-1 16H80a7 7 0 0 1-8-6c0-4 3-7 6-7 0-5 4-9 9-9Z",
      "fill": getUrlById("b")
    }, null), createVNode("path", {
      "d": "M19 23c2 0 3 1 4 3 2 0 4 2 4 4a4 4 0 0 1-4 3v1h-7v-1l-1 1c-2 0-3-2-3-4 0-1 1-3 3-3 0-2 2-4 4-4Z",
      "fill": getUrlById("b")
    }, null)])];
    const renderNetwork = () => createVNode("svg", {
      "viewBox": "0 0 160 160"
    }, [createVNode("defs", {
      "data-allow-mismatch": "children"
    }, [createVNode("linearGradient", {
      "id": getId(1),
      "x1": "64%",
      "y1": "100%",
      "x2": "64%"
    }, [renderStop("#FFF", 0, 0.5), renderStop("#F2F3F5", 100)]), createVNode("linearGradient", {
      "id": getId(2),
      "x1": "50%",
      "x2": "50%",
      "y2": "84%"
    }, [renderStop("#EBEDF0", 0), renderStop("#DCDEE0", 100, 0)]), createVNode("linearGradient", {
      "id": getId(3),
      "x1": "100%",
      "x2": "100%",
      "y2": "100%"
    }, [renderStops("#EAEDF0", "#DCDEE0")]), createVNode("radialGradient", {
      "id": getId(4),
      "cx": "50%",
      "cy": "0%",
      "fx": "50%",
      "fy": "0%",
      "r": "100%",
      "gradientTransform": "matrix(0 1 -.54 0 .5 -.5)"
    }, [renderStop("#EBEDF0", 0), renderStop("#FFF", 100, 0)])]), createVNode("g", {
      "fill": "none"
    }, [renderBuilding(), createVNode("path", {
      "fill": getUrlById(4),
      "d": "M0 139h160v21H0z",
      "data-allow-mismatch": "attribute"
    }, null), createVNode("path", {
      "d": "M80 54a7 7 0 0 1 3 13v27l-2 2h-2a2 2 0 0 1-2-2V67a7 7 0 0 1 3-13z",
      "fill": getUrlById(2),
      "data-allow-mismatch": "attribute"
    }, null), createVNode("g", {
      "opacity": ".6",
      "stroke-linecap": "round",
      "stroke-width": "7",
      "data-allow-mismatch": "children"
    }, [createVNode("path", {
      "d": "M64 47a19 19 0 0 0-5 13c0 5 2 10 5 13",
      "stroke": getUrlById(3)
    }, null), createVNode("path", {
      "d": "M53 36a34 34 0 0 0 0 48",
      "stroke": getUrlById(3)
    }, null), createVNode("path", {
      "d": "M95 73a19 19 0 0 0 6-13c0-5-2-9-6-13",
      "stroke": getUrlById(3)
    }, null), createVNode("path", {
      "d": "M106 84a34 34 0 0 0 0-48",
      "stroke": getUrlById(3)
    }, null)]), createVNode("g", {
      "transform": "translate(31 105)"
    }, [createVNode("rect", {
      "fill": "#EBEDF0",
      "width": "98",
      "height": "34",
      "rx": "2"
    }, null), createVNode("rect", {
      "fill": "#FFF",
      "x": "9",
      "y": "8",
      "width": "80",
      "height": "18",
      "rx": "1.1"
    }, null), createVNode("rect", {
      "fill": "#EBEDF0",
      "x": "15",
      "y": "12",
      "width": "18",
      "height": "6",
      "rx": "1.1"
    }, null)])])]);
    const renderMaterial = () => createVNode("svg", {
      "viewBox": "0 0 160 160"
    }, [createVNode("defs", {
      "data-allow-mismatch": "children"
    }, [createVNode("linearGradient", {
      "x1": "50%",
      "x2": "50%",
      "y2": "100%",
      "id": getId(5)
    }, [renderStops("#F2F3F5", "#DCDEE0")]), createVNode("linearGradient", {
      "x1": "95%",
      "y1": "48%",
      "x2": "5.5%",
      "y2": "51%",
      "id": getId(6)
    }, [renderStops("#EAEDF1", "#DCDEE0")]), createVNode("linearGradient", {
      "y1": "45%",
      "x2": "100%",
      "y2": "54%",
      "id": getId(7)
    }, [renderStops("#EAEDF1", "#DCDEE0")])]), renderBuilding(), renderCloud(), createVNode("g", {
      "transform": "translate(36 50)",
      "fill": "none"
    }, [createVNode("g", {
      "transform": "translate(8)"
    }, [createVNode("rect", {
      "fill": "#EBEDF0",
      "opacity": ".6",
      "x": "38",
      "y": "13",
      "width": "36",
      "height": "53",
      "rx": "2"
    }, null), createVNode("rect", {
      "fill": getUrlById(5),
      "width": "64",
      "height": "66",
      "rx": "2",
      "data-allow-mismatch": "attribute"
    }, null), createVNode("rect", {
      "fill": "#FFF",
      "x": "6",
      "y": "6",
      "width": "52",
      "height": "55",
      "rx": "1"
    }, null), createVNode("g", {
      "transform": "translate(15 17)",
      "fill": getUrlById(6),
      "data-allow-mismatch": "attribute"
    }, [createVNode("rect", {
      "width": "34",
      "height": "6",
      "rx": "1"
    }, null), createVNode("path", {
      "d": "M0 14h34v6H0z"
    }, null), createVNode("rect", {
      "y": "28",
      "width": "34",
      "height": "6",
      "rx": "1"
    }, null)])]), createVNode("rect", {
      "fill": getUrlById(7),
      "y": "61",
      "width": "88",
      "height": "28",
      "rx": "1",
      "data-allow-mismatch": "attribute"
    }, null), createVNode("rect", {
      "fill": "#F7F8FA",
      "x": "29",
      "y": "72",
      "width": "30",
      "height": "6",
      "rx": "1"
    }, null)])]);
    const renderError = () => createVNode("svg", {
      "viewBox": "0 0 160 160"
    }, [createVNode("defs", null, [createVNode("linearGradient", {
      "x1": "50%",
      "x2": "50%",
      "y2": "100%",
      "id": getId(8),
      "data-allow-mismatch": "attribute"
    }, [renderStops("#EAEDF1", "#DCDEE0")])]), renderBuilding(), renderCloud(), renderShadow("c"), createVNode("path", {
      "d": "m59 60 21 21 21-21h3l9 9v3L92 93l21 21v3l-9 9h-3l-21-21-21 21h-3l-9-9v-3l21-21-21-21v-3l9-9h3Z",
      "fill": getUrlById(8),
      "data-allow-mismatch": "attribute"
    }, null)]);
    const renderSearch = () => createVNode("svg", {
      "viewBox": "0 0 160 160"
    }, [createVNode("defs", {
      "data-allow-mismatch": "children"
    }, [createVNode("linearGradient", {
      "x1": "50%",
      "y1": "100%",
      "x2": "50%",
      "id": getId(9)
    }, [renderStops("#EEE", "#D8D8D8")]), createVNode("linearGradient", {
      "x1": "100%",
      "y1": "50%",
      "y2": "50%",
      "id": getId(10)
    }, [renderStops("#F2F3F5", "#DCDEE0")]), createVNode("linearGradient", {
      "x1": "50%",
      "x2": "50%",
      "y2": "100%",
      "id": getId(11)
    }, [renderStops("#F2F3F5", "#DCDEE0")]), createVNode("linearGradient", {
      "x1": "50%",
      "x2": "50%",
      "y2": "100%",
      "id": getId(12)
    }, [renderStops("#FFF", "#F7F8FA")])]), renderBuilding(), renderCloud(), renderShadow("d"), createVNode("g", {
      "transform": "rotate(-45 113 -4)",
      "fill": "none",
      "data-allow-mismatch": "children"
    }, [createVNode("rect", {
      "fill": getUrlById(9),
      "x": "24",
      "y": "52.8",
      "width": "5.8",
      "height": "19",
      "rx": "1"
    }, null), createVNode("rect", {
      "fill": getUrlById(10),
      "x": "22.1",
      "y": "67.3",
      "width": "9.9",
      "height": "28",
      "rx": "1"
    }, null), createVNode("circle", {
      "stroke": getUrlById(11),
      "stroke-width": "8",
      "cx": "27",
      "cy": "27",
      "r": "27"
    }, null), createVNode("circle", {
      "fill": getUrlById(12),
      "cx": "27",
      "cy": "27",
      "r": "16"
    }, null), createVNode("path", {
      "d": "M37 7c-8 0-15 5-16 12",
      "stroke": getUrlById(11),
      "stroke-width": "3",
      "opacity": ".5",
      "stroke-linecap": "round",
      "transform": "rotate(45 29 13)"
    }, null)])]);
    const renderImage = () => {
      var _a;
      if (slots.image) {
        return slots.image();
      }
      const PRESET_IMAGES = {
        error: renderError,
        search: renderSearch,
        network: renderNetwork,
        default: renderMaterial
      };
      return ((_a = PRESET_IMAGES[props.image]) == null ? void 0 : _a.call(PRESET_IMAGES)) || createVNode("img", {
        "src": props.image
      }, null);
    };
    return () => createVNode("div", {
      "class": bem$f()
    }, [createVNode("div", {
      "class": bem$f("image"),
      "style": getSizeStyle(props.imageSize)
    }, [renderImage()]), renderDescription(), renderBottom()]);
  }
});
const Empty = withInstall(stdin_default$j);
const [name$d, bem$e, t$4] = createNamespace("dialog");
const dialogProps = extend({}, popupSharedProps, {
  title: String,
  theme: String,
  width: numericProp,
  message: [String, Function],
  callback: Function,
  allowHtml: Boolean,
  className: unknownProp,
  transition: makeStringProp("van-dialog-bounce"),
  messageAlign: String,
  closeOnPopstate: truthProp,
  showCancelButton: Boolean,
  cancelButtonText: String,
  cancelButtonColor: String,
  cancelButtonDisabled: Boolean,
  confirmButtonText: String,
  confirmButtonColor: String,
  confirmButtonDisabled: Boolean,
  showConfirmButton: truthProp,
  closeOnClickOverlay: Boolean,
  keyboardEnabled: truthProp,
  destroyOnClose: Boolean
});
const popupInheritKeys = [...popupSharedPropKeys, "transition", "closeOnPopstate", "destroyOnClose"];
var stdin_default$i = defineComponent({
  name: name$d,
  props: dialogProps,
  emits: ["confirm", "cancel", "keydown", "update:show"],
  setup(props, {
    emit,
    slots
  }) {
    const root = ref();
    const loading = reactive({
      confirm: false,
      cancel: false
    });
    const updateShow = (value) => emit("update:show", value);
    const close = (action) => {
      var _a;
      updateShow(false);
      (_a = props.callback) == null ? void 0 : _a.call(props, action);
    };
    const getActionHandler = (action) => () => {
      if (!props.show) {
        return;
      }
      emit(action);
      if (props.beforeClose) {
        loading[action] = true;
        callInterceptor(props.beforeClose, {
          args: [action],
          done() {
            close(action);
            loading[action] = false;
          },
          canceled() {
            loading[action] = false;
          }
        });
      } else {
        close(action);
      }
    };
    const onCancel = getActionHandler("cancel");
    const onConfirm = getActionHandler("confirm");
    const onKeydown = withKeys((event) => {
      var _a, _b;
      if (!props.keyboardEnabled) {
        return;
      }
      if (event.target !== ((_b = (_a = root.value) == null ? void 0 : _a.popupRef) == null ? void 0 : _b.value)) {
        return;
      }
      const onEventType = {
        Enter: props.showConfirmButton ? onConfirm : noop,
        Escape: props.showCancelButton ? onCancel : noop
      };
      onEventType[event.key]();
      emit("keydown", event);
    }, ["enter", "esc"]);
    const renderTitle = () => {
      const title = slots.title ? slots.title() : props.title;
      if (title) {
        return createVNode("div", {
          "class": bem$e("header", {
            isolated: !props.message && !slots.default
          })
        }, [title]);
      }
    };
    const renderMessage = (hasTitle) => {
      const {
        message,
        allowHtml,
        messageAlign
      } = props;
      const classNames = bem$e("message", {
        "has-title": hasTitle,
        [messageAlign]: messageAlign
      });
      const content = isFunction(message) ? message() : message;
      if (allowHtml && typeof content === "string") {
        return createVNode("div", {
          "class": classNames,
          "innerHTML": content
        }, null);
      }
      return createVNode("div", {
        "class": classNames
      }, [content]);
    };
    const renderContent = () => {
      if (slots.default) {
        return createVNode("div", {
          "class": bem$e("content")
        }, [slots.default()]);
      }
      const {
        title,
        message,
        allowHtml
      } = props;
      if (message) {
        const hasTitle = !!(title || slots.title);
        return createVNode("div", {
          "key": allowHtml ? 1 : 0,
          "class": bem$e("content", {
            isolated: !hasTitle
          })
        }, [renderMessage(hasTitle)]);
      }
    };
    const renderButtons = () => createVNode("div", {
      "class": [BORDER_TOP, bem$e("footer")]
    }, [props.showCancelButton && createVNode(Button, {
      "size": "large",
      "text": props.cancelButtonText || t$4("cancel"),
      "class": bem$e("cancel"),
      "style": {
        color: props.cancelButtonColor
      },
      "loading": loading.cancel,
      "disabled": props.cancelButtonDisabled,
      "onClick": onCancel
    }, null), props.showConfirmButton && createVNode(Button, {
      "size": "large",
      "text": props.confirmButtonText || t$4("confirm"),
      "class": [bem$e("confirm"), {
        [BORDER_LEFT]: props.showCancelButton
      }],
      "style": {
        color: props.confirmButtonColor
      },
      "loading": loading.confirm,
      "disabled": props.confirmButtonDisabled,
      "onClick": onConfirm
    }, null)]);
    const renderRoundButtons = () => createVNode(ActionBar, {
      "class": bem$e("footer")
    }, {
      default: () => [props.showCancelButton && createVNode(ActionBarButton, {
        "type": "warning",
        "text": props.cancelButtonText || t$4("cancel"),
        "class": bem$e("cancel"),
        "color": props.cancelButtonColor,
        "loading": loading.cancel,
        "disabled": props.cancelButtonDisabled,
        "onClick": onCancel
      }, null), props.showConfirmButton && createVNode(ActionBarButton, {
        "type": "danger",
        "text": props.confirmButtonText || t$4("confirm"),
        "class": bem$e("confirm"),
        "color": props.confirmButtonColor,
        "loading": loading.confirm,
        "disabled": props.confirmButtonDisabled,
        "onClick": onConfirm
      }, null)]
    });
    const renderFooter = () => {
      if (slots.footer) {
        return slots.footer();
      }
      return props.theme === "round-button" ? renderRoundButtons() : renderButtons();
    };
    return () => {
      const {
        width,
        title,
        theme,
        message,
        className
      } = props;
      return createVNode(Popup, mergeProps({
        "ref": root,
        "role": "dialog",
        "class": [bem$e([theme]), className],
        "style": {
          width: addUnit(width)
        },
        "tabindex": 0,
        "aria-labelledby": title || message,
        "onKeydown": onKeydown,
        "onUpdate:show": updateShow
      }, pick(props, popupInheritKeys)), {
        default: () => [renderTitle(), renderContent(), renderFooter()]
      });
    };
  }
});
const Dialog = withInstall(stdin_default$i);
const [name$c, bem$d] = createNamespace("divider");
const dividerProps = {
  dashed: Boolean,
  hairline: truthProp,
  vertical: Boolean,
  contentPosition: makeStringProp("center")
};
var stdin_default$h = defineComponent({
  name: name$c,
  props: dividerProps,
  setup(props, {
    slots
  }) {
    return () => {
      var _a;
      return createVNode("div", {
        "role": "separator",
        "class": bem$d({
          dashed: props.dashed,
          hairline: props.hairline,
          vertical: props.vertical,
          [`content-${props.contentPosition}`]: !!slots.default && !props.vertical
        })
      }, [!props.vertical && ((_a = slots.default) == null ? void 0 : _a.call(slots))]);
    };
  }
});
const Divider = withInstall(stdin_default$h);
const getDistance = (touches) => Math.sqrt((touches[0].clientX - touches[1].clientX) ** 2 + (touches[0].clientY - touches[1].clientY) ** 2);
const getCenter = (touches) => ({
  x: (touches[0].clientX + touches[1].clientX) / 2,
  y: (touches[0].clientY + touches[1].clientY) / 2
});
const bem$c = createNamespace("image-preview")[1];
const longImageRatio = 2.6;
const imagePreviewItemProps = {
  src: String,
  show: Boolean,
  active: Number,
  minZoom: makeRequiredProp(numericProp),
  maxZoom: makeRequiredProp(numericProp),
  rootWidth: makeRequiredProp(Number),
  rootHeight: makeRequiredProp(Number),
  disableZoom: Boolean,
  doubleScale: Boolean,
  closeOnClickImage: Boolean,
  closeOnClickOverlay: Boolean,
  vertical: Boolean
};
var stdin_default$g = defineComponent({
  props: imagePreviewItemProps,
  emits: ["scale", "close", "longPress"],
  setup(props, {
    emit,
    slots
  }) {
    const state = reactive({
      scale: 1,
      moveX: 0,
      moveY: 0,
      moving: false,
      zooming: false,
      initializing: false,
      imageRatio: 0
    });
    const touch = useTouch();
    const imageRef = ref();
    const swipeItem = ref();
    const vertical = ref(false);
    const isLongImage = ref(false);
    let initialMoveY = 0;
    const imageStyle = computed(() => {
      const {
        scale,
        moveX,
        moveY,
        moving,
        zooming,
        initializing
      } = state;
      const style = {
        transitionDuration: zooming || moving || initializing ? "0s" : ".3s"
      };
      if (scale !== 1 || isLongImage.value) {
        style.transform = `matrix(${scale}, 0, 0, ${scale}, ${moveX}, ${moveY})`;
      }
      return style;
    });
    const maxMoveX = computed(() => {
      if (state.imageRatio) {
        const {
          rootWidth,
          rootHeight
        } = props;
        const displayWidth = vertical.value ? rootHeight / state.imageRatio : rootWidth;
        return Math.max(0, (state.scale * displayWidth - rootWidth) / 2);
      }
      return 0;
    });
    const maxMoveY = computed(() => {
      if (state.imageRatio) {
        const {
          rootWidth,
          rootHeight
        } = props;
        const displayHeight = vertical.value ? rootHeight : rootWidth * state.imageRatio;
        return Math.max(0, (state.scale * displayHeight - rootHeight) / 2);
      }
      return 0;
    });
    const setScale = (scale, center) => {
      var _a;
      scale = clamp(scale, +props.minZoom, +props.maxZoom + 1);
      if (scale !== state.scale) {
        const ratio = scale / state.scale;
        state.scale = scale;
        if (center) {
          const imageRect = useRect((_a = imageRef.value) == null ? void 0 : _a.$el);
          const origin = {
            x: imageRect.width * 0.5,
            y: imageRect.height * 0.5
          };
          const moveX = state.moveX - (center.x - imageRect.left - origin.x) * (ratio - 1);
          const moveY = state.moveY - (center.y - imageRect.top - origin.y) * (ratio - 1);
          state.moveX = clamp(moveX, -maxMoveX.value, maxMoveX.value);
          state.moveY = clamp(moveY, -maxMoveY.value, maxMoveY.value);
        } else {
          state.moveX = 0;
          state.moveY = isLongImage.value ? initialMoveY : 0;
        }
        emit("scale", {
          scale,
          index: props.active
        });
      }
    };
    const resetScale = () => {
      setScale(1);
    };
    const toggleScale = () => {
      const scale = state.scale > 1 ? 1 : 2;
      setScale(scale, scale === 2 || isLongImage.value ? {
        x: touch.startX.value,
        y: touch.startY.value
      } : void 0);
    };
    let fingerNum;
    let startMoveX;
    let startMoveY;
    let startScale;
    let startDistance;
    let lastCenter;
    let doubleTapTimer;
    let touchStartTime;
    let isImageMoved = false;
    const onTouchStart = (event) => {
      const {
        touches
      } = event;
      fingerNum = touches.length;
      if (fingerNum === 2 && props.disableZoom) {
        return;
      }
      const {
        offsetX
      } = touch;
      touch.start(event);
      startMoveX = state.moveX;
      startMoveY = state.moveY;
      touchStartTime = Date.now();
      isImageMoved = false;
      state.moving = fingerNum === 1 && (state.scale !== 1 || isLongImage.value);
      state.zooming = fingerNum === 2 && !offsetX.value;
      if (state.zooming) {
        startScale = state.scale;
        startDistance = getDistance(touches);
      }
    };
    const onTouchMove = (event) => {
      const {
        touches
      } = event;
      touch.move(event);
      if (state.moving) {
        const {
          deltaX,
          deltaY
        } = touch;
        const moveX = deltaX.value + startMoveX;
        const moveY = deltaY.value + startMoveY;
        if ((props.vertical ? touch.isVertical() && Math.abs(moveY) > maxMoveY.value : touch.isHorizontal() && Math.abs(moveX) > maxMoveX.value) && !isImageMoved) {
          state.moving = false;
          return;
        }
        isImageMoved = true;
        preventDefault(event, true);
        state.moveX = clamp(moveX, -maxMoveX.value, maxMoveX.value);
        state.moveY = clamp(moveY, -maxMoveY.value, maxMoveY.value);
      }
      if (state.zooming) {
        preventDefault(event, true);
        if (touches.length === 2) {
          const distance = getDistance(touches);
          const scale = startScale * distance / startDistance;
          lastCenter = getCenter(touches);
          setScale(scale, lastCenter);
        }
      }
    };
    const checkClose = (event) => {
      var _a;
      const swipeItemEl = (_a = swipeItem.value) == null ? void 0 : _a.$el;
      if (!swipeItemEl) return;
      const imageEl = swipeItemEl.firstElementChild;
      const isClickOverlay = event.target === swipeItemEl;
      const isClickImage = imageEl == null ? void 0 : imageEl.contains(event.target);
      if (!props.closeOnClickImage && isClickImage) return;
      if (!props.closeOnClickOverlay && isClickOverlay) return;
      emit("close");
    };
    const checkTap = (event) => {
      if (fingerNum > 1) {
        return;
      }
      const deltaTime = Date.now() - touchStartTime;
      const TAP_TIME = 250;
      if (touch.isTap.value) {
        if (deltaTime < TAP_TIME) {
          if (props.doubleScale) {
            if (doubleTapTimer) {
              clearTimeout(doubleTapTimer);
              doubleTapTimer = null;
              toggleScale();
            } else {
              doubleTapTimer = setTimeout(() => {
                checkClose(event);
                doubleTapTimer = null;
              }, TAP_TIME);
            }
          } else {
            checkClose(event);
          }
        } else if (deltaTime > LONG_PRESS_START_TIME) {
          emit("longPress");
        }
      }
    };
    const onTouchEnd = (event) => {
      let stopPropagation2 = false;
      if (state.moving || state.zooming) {
        stopPropagation2 = true;
        if (state.moving && startMoveX === state.moveX && startMoveY === state.moveY) {
          stopPropagation2 = false;
        }
        if (!event.touches.length) {
          if (state.zooming) {
            state.moveX = clamp(state.moveX, -maxMoveX.value, maxMoveX.value);
            state.moveY = clamp(state.moveY, -maxMoveY.value, maxMoveY.value);
            state.zooming = false;
          }
          state.moving = false;
          startMoveX = 0;
          startMoveY = 0;
          startScale = 1;
          if (state.scale < 1) {
            resetScale();
          }
          const maxZoom = +props.maxZoom;
          if (state.scale > maxZoom) {
            setScale(maxZoom, lastCenter);
          }
        }
      }
      preventDefault(event, stopPropagation2);
      checkTap(event);
      touch.reset();
    };
    const resize = () => {
      const {
        rootWidth,
        rootHeight
      } = props;
      const rootRatio = rootHeight / rootWidth;
      const {
        imageRatio
      } = state;
      vertical.value = state.imageRatio > rootRatio && imageRatio < longImageRatio;
      isLongImage.value = state.imageRatio > rootRatio && imageRatio >= longImageRatio;
      if (isLongImage.value) {
        initialMoveY = (imageRatio * rootWidth - rootHeight) / 2;
        state.moveY = initialMoveY;
        state.initializing = true;
        raf(() => {
          state.initializing = false;
        });
      }
      resetScale();
    };
    const onLoad = (event) => {
      const {
        naturalWidth,
        naturalHeight
      } = event.target;
      state.imageRatio = naturalHeight / naturalWidth;
      resize();
    };
    watch(() => props.active, resetScale);
    watch(() => props.show, (value) => {
      if (!value) {
        resetScale();
      }
    });
    watch(() => [props.rootWidth, props.rootHeight], resize);
    useEventListener("touchmove", onTouchMove, {
      target: computed(() => {
        var _a;
        return (_a = swipeItem.value) == null ? void 0 : _a.$el;
      })
    });
    useExpose({
      resetScale
    });
    return () => {
      const imageSlots = {
        loading: () => createVNode(Loading, {
          "type": "spinner"
        }, null)
      };
      return createVNode(SwipeItem, {
        "ref": swipeItem,
        "class": bem$c("swipe-item"),
        "onTouchstartPassive": onTouchStart,
        "onTouchend": onTouchEnd,
        "onTouchcancel": onTouchEnd
      }, {
        default: () => [slots.image ? createVNode("div", {
          "class": bem$c("image-wrap")
        }, [slots.image({
          src: props.src,
          onLoad,
          style: imageStyle.value
        })]) : createVNode(Image, {
          "ref": imageRef,
          "src": props.src,
          "fit": "contain",
          "class": bem$c("image", {
            vertical: vertical.value
          }),
          "style": imageStyle.value,
          "onLoad": onLoad
        }, imageSlots)]
      });
    };
  }
});
const [name$b, bem$b] = createNamespace("image-preview");
const popupProps = ["show", "teleport", "transition", "overlayStyle", "closeOnPopstate"];
const imagePreviewProps = {
  show: Boolean,
  loop: truthProp,
  images: makeArrayProp(),
  minZoom: makeNumericProp(1 / 3),
  maxZoom: makeNumericProp(3),
  overlay: truthProp,
  vertical: Boolean,
  closeable: Boolean,
  showIndex: truthProp,
  className: unknownProp,
  closeIcon: makeStringProp("clear"),
  transition: String,
  beforeClose: Function,
  doubleScale: truthProp,
  overlayClass: unknownProp,
  overlayStyle: Object,
  swipeDuration: makeNumericProp(300),
  startPosition: makeNumericProp(0),
  showIndicators: Boolean,
  closeOnPopstate: truthProp,
  closeOnClickImage: truthProp,
  closeOnClickOverlay: truthProp,
  closeIconPosition: makeStringProp("top-right"),
  teleport: [String, Object]
};
var stdin_default$f = defineComponent({
  name: name$b,
  props: imagePreviewProps,
  emits: ["scale", "close", "closed", "change", "longPress", "update:show"],
  setup(props, {
    emit,
    slots
  }) {
    const swipeRef = ref();
    const activedPreviewItemRef = ref();
    const state = reactive({
      active: 0,
      rootWidth: 0,
      rootHeight: 0,
      disableZoom: false
    });
    const resize = () => {
      if (swipeRef.value) {
        const rect = useRect(swipeRef.value.$el);
        state.rootWidth = rect.width;
        state.rootHeight = rect.height;
        swipeRef.value.resize();
      }
    };
    const emitScale = (args) => emit("scale", args);
    const updateShow = (show) => emit("update:show", show);
    const emitClose = () => {
      callInterceptor(props.beforeClose, {
        args: [state.active],
        done: () => updateShow(false)
      });
    };
    const setActive = (active) => {
      if (active !== state.active) {
        state.active = active;
        emit("change", active);
      }
    };
    const renderIndex = () => {
      if (props.showIndex) {
        return createVNode("div", {
          "class": bem$b("index")
        }, [slots.index ? slots.index({
          index: state.active
        }) : `${state.active + 1} / ${props.images.length}`]);
      }
    };
    const renderCover = () => {
      if (slots.cover) {
        return createVNode("div", {
          "class": bem$b("cover")
        }, [slots.cover()]);
      }
    };
    const onDragStart = () => {
      state.disableZoom = true;
    };
    const onDragEnd = () => {
      state.disableZoom = false;
    };
    const renderImages = () => createVNode(Swipe, {
      "ref": swipeRef,
      "lazyRender": true,
      "loop": props.loop,
      "class": bem$b("swipe"),
      "vertical": props.vertical,
      "duration": props.swipeDuration,
      "initialSwipe": props.startPosition,
      "showIndicators": props.showIndicators,
      "indicatorColor": "white",
      "onChange": setActive,
      "onDragEnd": onDragEnd,
      "onDragStart": onDragStart
    }, {
      default: () => [props.images.map((image, index) => createVNode(stdin_default$g, {
        "ref": (item) => {
          if (index === state.active) {
            activedPreviewItemRef.value = item;
          }
        },
        "src": image,
        "show": props.show,
        "active": state.active,
        "maxZoom": props.maxZoom,
        "minZoom": props.minZoom,
        "rootWidth": state.rootWidth,
        "rootHeight": state.rootHeight,
        "disableZoom": state.disableZoom,
        "doubleScale": props.doubleScale,
        "closeOnClickImage": props.closeOnClickImage,
        "closeOnClickOverlay": props.closeOnClickOverlay,
        "vertical": props.vertical,
        "onScale": emitScale,
        "onClose": emitClose,
        "onLongPress": () => emit("longPress", {
          index
        })
      }, {
        image: slots.image
      }))]
    });
    const renderClose = () => {
      if (props.closeable) {
        return createVNode(Icon, {
          "role": "button",
          "name": props.closeIcon,
          "class": [bem$b("close-icon", props.closeIconPosition), HAPTICS_FEEDBACK],
          "onClick": emitClose
        }, null);
      }
    };
    const onClosed = () => emit("closed");
    const swipeTo = (index, options) => {
      var _a;
      return (_a = swipeRef.value) == null ? void 0 : _a.swipeTo(index, options);
    };
    useExpose({
      resetScale: () => {
        var _a;
        (_a = activedPreviewItemRef.value) == null ? void 0 : _a.resetScale();
      },
      swipeTo
    });
    watch([windowWidth, windowHeight], resize);
    watch(() => props.startPosition, (value) => setActive(+value));
    watch(() => props.show, (value) => {
      const {
        images,
        startPosition
      } = props;
      if (value) {
        setActive(+startPosition);
        nextTick(() => {
          resize();
          swipeTo(+startPosition, {
            immediate: true
          });
        });
      } else {
        emit("close", {
          index: state.active,
          url: images[state.active]
        });
      }
    });
    return () => createVNode(Popup, mergeProps({
      "class": [bem$b(), props.className],
      "overlayClass": [bem$b("overlay"), props.overlayClass],
      "onClosed": onClosed,
      "onUpdate:show": updateShow
    }, pick(props, popupProps)), {
      default: () => [renderClose(), renderImages(), renderIndex(), renderCover()]
    });
  }
});
const showImagePreview = (options, startPosition = 0) => {
  {
    return;
  }
};
const ImagePreview = withInstall(stdin_default$f);
const [name$a, bem$a, t$3] = createNamespace("list");
const listProps = {
  error: Boolean,
  offset: makeNumericProp(300),
  loading: Boolean,
  disabled: Boolean,
  finished: Boolean,
  scroller: Object,
  errorText: String,
  direction: makeStringProp("down"),
  loadingText: {
    type: String,
    default: ""
  },
  finishedText: String,
  immediateCheck: truthProp
};
var stdin_default$e = defineComponent({
  name: name$a,
  props: listProps,
  emits: ["load", "update:error", "update:loading"],
  setup(props, {
    emit,
    slots
  }) {
    const loading = ref(props.loading);
    const root = ref();
    const placeholder = ref();
    const tabStatus = useAllTabStatus();
    const scrollParent = useScrollParent(root);
    const scroller = computed(() => props.scroller || scrollParent.value);
    const check = () => {
      nextTick(() => {
        if (loading.value || props.finished || props.disabled || props.error || // skip check when inside an inactive tab
        (tabStatus == null ? void 0 : tabStatus.value) === false) {
          return;
        }
        const {
          direction
        } = props;
        const offset = +props.offset;
        const scrollParentRect = useRect(scroller);
        if (!scrollParentRect.height || isHidden(root)) {
          return;
        }
        let isReachEdge = false;
        const placeholderRect = useRect(placeholder);
        if (direction === "up") {
          isReachEdge = scrollParentRect.top - placeholderRect.top <= offset;
        } else {
          isReachEdge = placeholderRect.bottom - scrollParentRect.bottom <= offset;
        }
        if (isReachEdge) {
          loading.value = true;
          emit("update:loading", true);
          emit("load");
        }
      });
    };
    const renderFinishedText = () => {
      if (props.finished) {
        const text = slots.finished ? slots.finished() : props.finishedText;
        if (text) {
          return createVNode("div", {
            "class": bem$a("finished-text")
          }, [text]);
        }
      }
    };
    const clickErrorText = () => {
      emit("update:error", false);
      check();
    };
    const renderErrorText = () => {
      if (props.error) {
        const text = slots.error ? slots.error() : props.errorText;
        if (text) {
          return createVNode("div", {
            "role": "button",
            "class": bem$a("error-text"),
            "tabindex": 0,
            "onClick": clickErrorText
          }, [text]);
        }
      }
    };
    const renderLoading = () => {
      if (loading.value && !props.finished && !props.disabled) {
        return createVNode("div", {
          "class": bem$a("loading")
        }, [slots.loading ? slots.loading() : props.loadingText != null && createVNode(Loading, {
          "class": bem$a("loading-icon")
        }, {
          default: () => [props.loadingText || t$3("loading")]
        })]);
      }
    };
    watch(() => [props.loading, props.finished, props.error], check);
    if (tabStatus) {
      watch(tabStatus, (tabActive) => {
        if (tabActive) {
          check();
        }
      });
    }
    useExpose({
      check
    });
    useEventListener("scroll", check, {
      target: scroller,
      passive: true
    });
    return () => {
      var _a;
      const Content = (_a = slots.default) == null ? void 0 : _a.call(slots);
      const Placeholder = createVNode("div", {
        "ref": placeholder,
        "class": bem$a("placeholder")
      }, null);
      return createVNode("div", {
        "ref": root,
        "role": "feed",
        "class": bem$a(),
        "aria-busy": loading.value
      }, [props.direction === "down" ? Content : Placeholder, renderLoading(), renderFinishedText(), renderErrorText(), props.direction === "up" ? Content : Placeholder]);
    };
  }
});
const List = withInstall(stdin_default$e);
const [name$9, bem$9] = createNamespace("nav-bar");
const navBarProps = {
  title: String,
  fixed: Boolean,
  zIndex: numericProp,
  border: truthProp,
  leftText: String,
  rightText: String,
  leftDisabled: Boolean,
  rightDisabled: Boolean,
  leftArrow: Boolean,
  placeholder: Boolean,
  safeAreaInsetTop: Boolean,
  clickable: truthProp
};
var stdin_default$d = defineComponent({
  name: name$9,
  props: navBarProps,
  emits: ["clickLeft", "clickRight"],
  setup(props, {
    emit,
    slots
  }) {
    const navBarRef = ref();
    const renderPlaceholder = usePlaceholder(navBarRef, bem$9);
    const onClickLeft = (event) => {
      if (!props.leftDisabled) {
        emit("clickLeft", event);
      }
    };
    const onClickRight = (event) => {
      if (!props.rightDisabled) {
        emit("clickRight", event);
      }
    };
    const renderLeft = () => {
      if (slots.left) {
        return slots.left();
      }
      return [props.leftArrow && createVNode(Icon, {
        "class": bem$9("arrow"),
        "name": "arrow-left"
      }, null), props.leftText && createVNode("span", {
        "class": bem$9("text")
      }, [props.leftText])];
    };
    const renderRight = () => {
      if (slots.right) {
        return slots.right();
      }
      return createVNode("span", {
        "class": bem$9("text")
      }, [props.rightText]);
    };
    const renderNavBar = () => {
      const {
        title,
        fixed,
        border,
        zIndex
      } = props;
      const style = getZIndexStyle(zIndex);
      const hasLeft = props.leftArrow || props.leftText || slots.left;
      const hasRight = props.rightText || slots.right;
      return createVNode("div", {
        "ref": navBarRef,
        "style": style,
        "class": [bem$9({
          fixed
        }), {
          [BORDER_BOTTOM]: border,
          "van-safe-area-top": props.safeAreaInsetTop
        }]
      }, [createVNode("div", {
        "class": bem$9("content")
      }, [hasLeft && createVNode("div", {
        "class": [bem$9("left", {
          disabled: props.leftDisabled
        }), props.clickable && !props.leftDisabled ? HAPTICS_FEEDBACK : ""],
        "onClick": onClickLeft
      }, [renderLeft()]), createVNode("div", {
        "class": [bem$9("title"), "van-ellipsis"]
      }, [slots.title ? slots.title() : title]), hasRight && createVNode("div", {
        "class": [bem$9("right", {
          disabled: props.rightDisabled
        }), props.clickable && !props.rightDisabled ? HAPTICS_FEEDBACK : ""],
        "onClick": onClickRight
      }, [renderRight()])])]);
    };
    return () => {
      if (props.fixed && props.placeholder) {
        return renderPlaceholder(renderNavBar);
      }
      return renderNavBar();
    };
  }
});
const NavBar = withInstall(stdin_default$d);
const [name$8, bem$8] = createNamespace("notice-bar");
const noticeBarProps = {
  text: String,
  mode: String,
  color: String,
  delay: makeNumericProp(1),
  speed: makeNumericProp(60),
  leftIcon: String,
  wrapable: Boolean,
  background: String,
  scrollable: {
    type: Boolean,
    default: null
  }
};
var stdin_default$c = defineComponent({
  name: name$8,
  props: noticeBarProps,
  emits: ["close", "replay"],
  setup(props, {
    emit,
    slots
  }) {
    let wrapWidth = 0;
    let contentWidth = 0;
    let startTimer;
    const wrapRef = ref();
    const contentRef = ref();
    const state = reactive({
      show: true,
      offset: 0,
      duration: 0
    });
    const renderLeftIcon = () => {
      if (slots["left-icon"]) {
        return slots["left-icon"]();
      }
      if (props.leftIcon) {
        return createVNode(Icon, {
          "class": bem$8("left-icon"),
          "name": props.leftIcon
        }, null);
      }
    };
    const getRightIconName = () => {
      if (props.mode === "closeable") {
        return "cross";
      }
      if (props.mode === "link") {
        return "arrow";
      }
    };
    const onClickRightIcon = (event) => {
      if (props.mode === "closeable") {
        state.show = false;
        emit("close", event);
      }
    };
    const renderRightIcon = () => {
      if (slots["right-icon"]) {
        return slots["right-icon"]();
      }
      const name2 = getRightIconName();
      if (name2) {
        return createVNode(Icon, {
          "name": name2,
          "class": bem$8("right-icon"),
          "onClick": onClickRightIcon
        }, null);
      }
    };
    const onTransitionEnd = () => {
      state.offset = wrapWidth;
      state.duration = 0;
      raf(() => {
        doubleRaf(() => {
          state.offset = -contentWidth;
          state.duration = (contentWidth + wrapWidth) / +props.speed;
          emit("replay");
        });
      });
    };
    const renderMarquee = () => {
      const ellipsis = props.scrollable === false && !props.wrapable;
      const style = {
        transform: state.offset ? `translateX(${state.offset}px)` : "",
        transitionDuration: `${state.duration}s`
      };
      return createVNode("div", {
        "ref": wrapRef,
        "role": "marquee",
        "class": bem$8("wrap")
      }, [createVNode("div", {
        "ref": contentRef,
        "style": style,
        "class": [bem$8("content"), {
          "van-ellipsis": ellipsis
        }],
        "onTransitionend": onTransitionEnd
      }, [slots.default ? slots.default() : props.text])]);
    };
    const reset = () => {
      const {
        delay,
        speed,
        scrollable
      } = props;
      const ms = isDef(delay) ? +delay * 1e3 : 0;
      wrapWidth = 0;
      contentWidth = 0;
      state.offset = 0;
      state.duration = 0;
      clearTimeout(startTimer);
      startTimer = setTimeout(() => {
        if (!wrapRef.value || !contentRef.value || scrollable === false) {
          return;
        }
        const wrapRefWidth = useRect(wrapRef).width;
        const contentRefWidth = useRect(contentRef).width;
        if (scrollable || contentRefWidth > wrapRefWidth) {
          doubleRaf(() => {
            wrapWidth = wrapRefWidth;
            contentWidth = contentRefWidth;
            state.offset = -contentWidth;
            state.duration = contentWidth / +speed;
          });
        }
      }, ms);
    };
    onPopupReopen(reset);
    onMountedOrActivated(reset);
    useEventListener("pageshow", reset);
    useExpose({
      reset
    });
    watch(() => [props.text, props.scrollable], reset);
    return () => {
      const {
        color,
        wrapable,
        background
      } = props;
      return withDirectives(createVNode("div", {
        "role": "alert",
        "class": bem$8({
          wrapable
        }),
        "style": {
          color,
          background
        }
      }, [renderLeftIcon(), renderMarquee(), renderRightIcon()]), [[vShow, state.show]]);
    };
  }
});
const NoticeBar = withInstall(stdin_default$c);
const [name$7, bem$7, t$2] = createNamespace("pagination");
const makePage = (number2, text, active) => ({
  number: number2,
  text,
  active
});
const paginationProps = {
  mode: makeStringProp("multi"),
  prevText: String,
  nextText: String,
  pageCount: makeNumericProp(0),
  modelValue: makeNumberProp(0),
  totalItems: makeNumericProp(0),
  showPageSize: makeNumericProp(5),
  itemsPerPage: makeNumericProp(10),
  forceEllipses: Boolean,
  showPrevButton: truthProp,
  showNextButton: truthProp
};
var stdin_default$b = defineComponent({
  name: name$7,
  props: paginationProps,
  emits: ["change", "update:modelValue"],
  setup(props, {
    emit,
    slots
  }) {
    const count = computed(() => {
      const {
        pageCount,
        totalItems,
        itemsPerPage
      } = props;
      const count2 = +pageCount || Math.ceil(+totalItems / +itemsPerPage);
      return Math.max(1, count2);
    });
    const pages = computed(() => {
      const items = [];
      const pageCount = count.value;
      const showPageSize = +props.showPageSize;
      const {
        modelValue,
        forceEllipses
      } = props;
      let startPage = 1;
      let endPage = pageCount;
      const isMaxSized = showPageSize < pageCount;
      if (isMaxSized) {
        startPage = Math.max(modelValue - Math.floor(showPageSize / 2), 1);
        endPage = startPage + showPageSize - 1;
        if (endPage > pageCount) {
          endPage = pageCount;
          startPage = endPage - showPageSize + 1;
        }
      }
      for (let number2 = startPage; number2 <= endPage; number2++) {
        const page = makePage(number2, number2, number2 === modelValue);
        items.push(page);
      }
      if (isMaxSized && showPageSize > 0 && forceEllipses) {
        if (startPage > 1) {
          const prevPages = makePage(startPage - 1, "...");
          items.unshift(prevPages);
        }
        if (endPage < pageCount) {
          const nextPages = makePage(endPage + 1, "...");
          items.push(nextPages);
        }
      }
      return items;
    });
    const updateModelValue = (value, emitChange) => {
      value = clamp(value, 1, count.value);
      if (props.modelValue !== value) {
        emit("update:modelValue", value);
        if (emitChange) {
          emit("change", value);
        }
      }
    };
    watchEffect(() => updateModelValue(props.modelValue));
    const renderDesc = () => createVNode("li", {
      "class": bem$7("page-desc")
    }, [slots.pageDesc ? slots.pageDesc() : `${props.modelValue}/${count.value}`]);
    const renderPrevButton = () => {
      const {
        mode,
        modelValue,
        showPrevButton
      } = props;
      if (!showPrevButton) {
        return;
      }
      const slot = slots["prev-text"];
      const disabled = modelValue === 1;
      return createVNode("li", {
        "class": [bem$7("item", {
          disabled,
          border: mode === "simple",
          prev: true
        }), BORDER_SURROUND]
      }, [createVNode("button", {
        "type": "button",
        "disabled": disabled,
        "onClick": () => updateModelValue(modelValue - 1, true)
      }, [slot ? slot() : props.prevText || t$2("prev")])]);
    };
    const renderNextButton = () => {
      const {
        mode,
        modelValue,
        showNextButton
      } = props;
      if (!showNextButton) {
        return;
      }
      const slot = slots["next-text"];
      const disabled = modelValue === count.value;
      return createVNode("li", {
        "class": [bem$7("item", {
          disabled,
          border: mode === "simple",
          next: true
        }), BORDER_SURROUND]
      }, [createVNode("button", {
        "type": "button",
        "disabled": disabled,
        "onClick": () => updateModelValue(modelValue + 1, true)
      }, [slot ? slot() : props.nextText || t$2("next")])]);
    };
    const renderPages = () => pages.value.map((page) => createVNode("li", {
      "class": [bem$7("item", {
        active: page.active,
        page: true
      }), BORDER_SURROUND]
    }, [createVNode("button", {
      "type": "button",
      "aria-current": page.active || void 0,
      "onClick": () => updateModelValue(page.number, true)
    }, [slots.page ? slots.page(page) : page.text])]));
    return () => createVNode("nav", {
      "role": "navigation",
      "class": bem$7()
    }, [createVNode("ul", {
      "class": bem$7("items")
    }, [renderPrevButton(), props.mode === "simple" ? renderDesc() : renderPages(), renderNextButton()])]);
  }
});
const Pagination = withInstall(stdin_default$b);
const [name$6, bem$6] = createNamespace("progress");
const progressProps = {
  color: String,
  inactive: Boolean,
  pivotText: String,
  textColor: String,
  showPivot: truthProp,
  pivotColor: String,
  trackColor: String,
  strokeWidth: numericProp,
  percentage: {
    type: numericProp,
    default: 0,
    validator: (value) => +value >= 0 && +value <= 100
  }
};
var stdin_default$a = defineComponent({
  name: name$6,
  props: progressProps,
  setup(props, {
    slots
  }) {
    const background = computed(() => props.inactive ? void 0 : props.color);
    const format2 = (rate) => Math.min(Math.max(+rate, 0), 100);
    const renderPivot = () => {
      const {
        textColor,
        pivotText,
        pivotColor,
        percentage
      } = props;
      const safePercentage = format2(percentage);
      const text = pivotText != null ? pivotText : `${safePercentage}%`;
      if (props.showPivot && (slots.pivot || text)) {
        const style = {
          color: textColor,
          left: `${safePercentage}%`,
          transform: `translate(-${safePercentage}%,-50%)`,
          background: pivotColor || background.value
        };
        return createVNode("span", {
          "style": style,
          "class": bem$6("pivot", {
            inactive: props.inactive
          })
        }, [slots.pivot ? slots.pivot({
          percentage: safePercentage
        }) : text]);
      }
    };
    return () => {
      const {
        trackColor,
        percentage,
        strokeWidth
      } = props;
      const safePercentage = format2(percentage);
      const rootStyle = {
        background: trackColor,
        height: addUnit(strokeWidth)
      };
      const portionStyle = {
        width: `${safePercentage}%`,
        background: background.value
      };
      return createVNode("div", {
        "class": bem$6(),
        "style": rootStyle
      }, [createVNode("span", {
        "class": bem$6("portion", {
          inactive: props.inactive
        }),
        "style": portionStyle
      }, null), renderPivot()]);
    };
  }
});
const Progress = withInstall(stdin_default$a);
const [name$5, bem$5, t$1] = createNamespace("pull-refresh");
const DEFAULT_HEAD_HEIGHT = 50;
const TEXT_STATUS = ["pulling", "loosing", "success"];
const pullRefreshProps = {
  disabled: Boolean,
  modelValue: Boolean,
  headHeight: makeNumericProp(DEFAULT_HEAD_HEIGHT),
  successText: String,
  pullingText: String,
  loosingText: String,
  loadingText: String,
  pullDistance: numericProp,
  successDuration: makeNumericProp(500),
  animationDuration: makeNumericProp(300)
};
var stdin_default$9 = defineComponent({
  name: name$5,
  props: pullRefreshProps,
  emits: ["change", "refresh", "update:modelValue"],
  setup(props, {
    emit,
    slots
  }) {
    let reachTop;
    const root = ref();
    const track = ref();
    const scrollParent = useScrollParent(root);
    const state = reactive({
      status: "normal",
      distance: 0,
      duration: 0
    });
    const touch = useTouch();
    const getHeadStyle = () => {
      if (props.headHeight !== DEFAULT_HEAD_HEIGHT) {
        return {
          height: `${props.headHeight}px`
        };
      }
    };
    const isTouchable = () => state.status !== "loading" && state.status !== "success" && !props.disabled;
    const ease = (distance) => {
      const pullDistance = +(props.pullDistance || props.headHeight);
      if (distance > pullDistance) {
        if (distance < pullDistance * 2) {
          distance = pullDistance + (distance - pullDistance) / 2;
        } else {
          distance = pullDistance * 1.5 + (distance - pullDistance * 2) / 4;
        }
      }
      return Math.round(distance);
    };
    const setStatus = (distance, isLoading) => {
      const pullDistance = +(props.pullDistance || props.headHeight);
      state.distance = distance;
      if (isLoading) {
        state.status = "loading";
      } else if (distance === 0) {
        state.status = "normal";
      } else if (distance < pullDistance) {
        state.status = "pulling";
      } else {
        state.status = "loosing";
      }
      emit("change", {
        status: state.status,
        distance
      });
    };
    const getStatusText = () => {
      const {
        status
      } = state;
      if (status === "normal") {
        return "";
      }
      return props[`${status}Text`] || t$1(status);
    };
    const renderStatus = () => {
      const {
        status,
        distance
      } = state;
      if (slots[status]) {
        return slots[status]({
          distance
        });
      }
      const nodes = [];
      if (TEXT_STATUS.includes(status)) {
        nodes.push(createVNode("div", {
          "class": bem$5("text")
        }, [getStatusText()]));
      }
      if (status === "loading") {
        nodes.push(createVNode(Loading, {
          "class": bem$5("loading")
        }, {
          default: getStatusText
        }));
      }
      return nodes;
    };
    const showSuccessTip = () => {
      state.status = "success";
      setTimeout(() => {
        setStatus(0);
      }, +props.successDuration);
    };
    const checkPosition = (event) => {
      reachTop = getScrollTop(scrollParent.value) === 0;
      if (reachTop) {
        state.duration = 0;
        touch.start(event);
      }
    };
    const onTouchStart = (event) => {
      if (isTouchable()) {
        checkPosition(event);
      }
    };
    const onTouchMove = (event) => {
      if (isTouchable()) {
        if (!reachTop) {
          checkPosition(event);
        }
        const {
          deltaY
        } = touch;
        touch.move(event);
        if (reachTop && deltaY.value >= 0 && touch.isVertical()) {
          preventDefault(event);
          setStatus(ease(deltaY.value));
        }
      }
    };
    const onTouchEnd = () => {
      if (reachTop && touch.deltaY.value && isTouchable()) {
        state.duration = +props.animationDuration;
        if (state.status === "loosing") {
          setStatus(+props.headHeight, true);
          emit("update:modelValue", true);
          nextTick(() => emit("refresh"));
        } else {
          setStatus(0);
        }
      }
    };
    watch(() => props.modelValue, (value) => {
      state.duration = +props.animationDuration;
      if (value) {
        setStatus(+props.headHeight, true);
      } else if (slots.success || props.successText) {
        showSuccessTip();
      } else {
        setStatus(0, false);
      }
    });
    useEventListener("touchmove", onTouchMove, {
      target: track
    });
    return () => {
      var _a;
      const trackStyle = {
        transitionDuration: `${state.duration}ms`,
        transform: state.distance ? `translate3d(0,${state.distance}px, 0)` : ""
      };
      return createVNode("div", {
        "ref": root,
        "class": bem$5()
      }, [createVNode("div", {
        "ref": track,
        "class": bem$5("track"),
        "style": trackStyle,
        "onTouchstartPassive": onTouchStart,
        "onTouchend": onTouchEnd,
        "onTouchcancel": onTouchEnd
      }, [createVNode("div", {
        "class": bem$5("head"),
        "style": getHeadStyle()
      }, [renderStatus()]), (_a = slots.default) == null ? void 0 : _a.call(slots)])]);
    };
  }
});
const PullRefresh = withInstall(stdin_default$9);
const [name$4, bem$4] = createNamespace("skeleton-title");
const skeletonTitleProps = {
  round: Boolean,
  titleWidth: numericProp
};
var stdin_default$8 = defineComponent({
  name: name$4,
  props: skeletonTitleProps,
  setup(props) {
    return () => createVNode("h3", {
      "class": bem$4([{
        round: props.round
      }]),
      "style": {
        width: addUnit(props.titleWidth)
      }
    }, null);
  }
});
const SkeletonTitle = withInstall(stdin_default$8);
var stdin_default$7 = SkeletonTitle;
const [name$3, bem$3] = createNamespace("skeleton-avatar");
const skeletonAvatarProps = {
  avatarSize: numericProp,
  avatarShape: makeStringProp("round")
};
var stdin_default$6 = defineComponent({
  name: name$3,
  props: skeletonAvatarProps,
  setup(props) {
    return () => createVNode("div", {
      "class": bem$3([props.avatarShape]),
      "style": getSizeStyle(props.avatarSize)
    }, null);
  }
});
const SkeletonAvatar = withInstall(stdin_default$6);
var stdin_default$5 = SkeletonAvatar;
const DEFAULT_ROW_WIDTH = "100%";
const skeletonParagraphProps = {
  round: Boolean,
  rowWidth: {
    type: numericProp,
    default: DEFAULT_ROW_WIDTH
  }
};
const [name$2, bem$2] = createNamespace("skeleton-paragraph");
var stdin_default$4 = defineComponent({
  name: name$2,
  props: skeletonParagraphProps,
  setup(props) {
    return () => createVNode("div", {
      "class": bem$2([{
        round: props.round
      }]),
      "style": {
        width: props.rowWidth
      }
    }, null);
  }
});
const SkeletonParagraph = withInstall(stdin_default$4);
var stdin_default$3 = SkeletonParagraph;
const [name$1, bem$1] = createNamespace("skeleton");
const DEFAULT_LAST_ROW_WIDTH = "60%";
const skeletonProps = {
  row: makeNumericProp(0),
  round: Boolean,
  title: Boolean,
  titleWidth: numericProp,
  avatar: Boolean,
  avatarSize: numericProp,
  avatarShape: makeStringProp("round"),
  loading: truthProp,
  animate: truthProp,
  rowWidth: {
    type: [Number, String, Array],
    default: DEFAULT_ROW_WIDTH
  }
};
var stdin_default$2 = defineComponent({
  name: name$1,
  inheritAttrs: false,
  props: skeletonProps,
  setup(props, {
    slots,
    attrs
  }) {
    const renderAvatar = () => {
      if (props.avatar) {
        return createVNode(stdin_default$5, {
          "avatarShape": props.avatarShape,
          "avatarSize": props.avatarSize
        }, null);
      }
    };
    const renderTitle = () => {
      if (props.title) {
        return createVNode(stdin_default$7, {
          "round": props.round,
          "titleWidth": props.titleWidth
        }, null);
      }
    };
    const getRowWidth = (index) => {
      const {
        rowWidth
      } = props;
      if (rowWidth === DEFAULT_ROW_WIDTH && index === +props.row - 1) {
        return DEFAULT_LAST_ROW_WIDTH;
      }
      if (Array.isArray(rowWidth)) {
        return rowWidth[index];
      }
      return rowWidth;
    };
    const renderRows = () => Array(+props.row).fill("").map((_, i) => createVNode(stdin_default$3, {
      "key": i,
      "round": props.round,
      "rowWidth": addUnit(getRowWidth(i))
    }, null));
    const renderContents = () => {
      if (slots.template) {
        return slots.template();
      }
      return createVNode(Fragment, null, [renderAvatar(), createVNode("div", {
        "class": bem$1("content")
      }, [renderTitle(), renderRows()])]);
    };
    return () => {
      var _a;
      if (!props.loading) {
        return (_a = slots.default) == null ? void 0 : _a.call(slots);
      }
      return createVNode("div", mergeProps({
        "class": bem$1({
          animate: props.animate,
          round: props.round
        })
      }, attrs), [renderContents()]);
    };
  }
});
const Skeleton = withInstall(stdin_default$2);
const [name, bem, t] = createNamespace("uploader");
function readFileContent(file, resultType) {
  return new Promise((resolve2) => {
    if (resultType === "file") {
      resolve2();
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve2(event.target.result);
    };
    if (resultType === "dataUrl") {
      reader.readAsDataURL(file);
    } else if (resultType === "text") {
      reader.readAsText(file);
    }
  });
}
function isOversize(items, maxSize) {
  return toArray(items).some((item) => {
    if (item.file) {
      if (isFunction(maxSize)) {
        return maxSize(item.file);
      }
      return item.file.size > +maxSize;
    }
    return false;
  });
}
function filterFiles(items, maxSize) {
  const valid = [];
  const invalid = [];
  items.forEach((item) => {
    if (isOversize(item, maxSize)) {
      invalid.push(item);
    } else {
      valid.push(item);
    }
  });
  return { valid, invalid };
}
const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg|avif)/i;
const isImageUrl = (url) => IMAGE_REGEXP.test(url);
function isImageFile(item) {
  if (item.isImage) {
    return true;
  }
  if (item.file && item.file.type) {
    return item.file.type.indexOf("image") === 0;
  }
  if (item.url) {
    return isImageUrl(item.url);
  }
  if (typeof item.content === "string") {
    return item.content.indexOf("data:image") === 0;
  }
  return false;
}
var stdin_default$1 = defineComponent({
  props: {
    name: numericProp,
    item: makeRequiredProp(Object),
    index: Number,
    imageFit: String,
    lazyLoad: Boolean,
    deletable: Boolean,
    reupload: Boolean,
    previewSize: [Number, String, Array],
    beforeDelete: Function
  },
  emits: ["delete", "preview", "reupload"],
  setup(props, {
    emit,
    slots
  }) {
    const renderMask = () => {
      const {
        status,
        message
      } = props.item;
      if (status === "uploading" || status === "failed") {
        const MaskIcon = status === "failed" ? createVNode(Icon, {
          "name": "close",
          "class": bem("mask-icon")
        }, null) : createVNode(Loading, {
          "class": bem("loading")
        }, null);
        const showMessage = isDef(message) && message !== "";
        return createVNode("div", {
          "class": bem("mask")
        }, [MaskIcon, showMessage && createVNode("div", {
          "class": bem("mask-message")
        }, [message])]);
      }
    };
    const onDelete = (event) => {
      const {
        name: name2,
        item,
        index,
        beforeDelete
      } = props;
      event.stopPropagation();
      callInterceptor(beforeDelete, {
        args: [item, {
          name: name2,
          index
        }],
        done: () => emit("delete")
      });
    };
    const onPreview = () => emit("preview");
    const onReupload = () => emit("reupload");
    const renderDeleteIcon = () => {
      if (props.deletable && props.item.status !== "uploading") {
        const slot = slots["preview-delete"];
        return createVNode("div", {
          "role": "button",
          "class": bem("preview-delete", {
            shadow: !slot
          }),
          "tabindex": 0,
          "aria-label": t("delete"),
          "onClick": onDelete
        }, [slot ? slot() : createVNode(Icon, {
          "name": "cross",
          "class": bem("preview-delete-icon")
        }, null)]);
      }
    };
    const renderCover = () => {
      if (slots["preview-cover"]) {
        const {
          index,
          item
        } = props;
        return createVNode("div", {
          "class": bem("preview-cover")
        }, [slots["preview-cover"](extend({
          index
        }, item))]);
      }
    };
    const renderPreview = () => {
      const {
        item,
        lazyLoad,
        imageFit,
        previewSize,
        reupload
      } = props;
      if (isImageFile(item)) {
        return createVNode(Image, {
          "fit": imageFit,
          "src": item.objectUrl || item.content || item.url,
          "class": bem("preview-image"),
          "width": Array.isArray(previewSize) ? previewSize[0] : previewSize,
          "height": Array.isArray(previewSize) ? previewSize[1] : previewSize,
          "lazyLoad": lazyLoad,
          "onClick": reupload ? onReupload : onPreview
        }, {
          default: renderCover
        });
      }
      return createVNode("div", {
        "class": bem("file"),
        "style": getSizeStyle(props.previewSize)
      }, [createVNode(Icon, {
        "class": bem("file-icon"),
        "name": "description"
      }, null), createVNode("div", {
        "class": [bem("file-name"), "van-ellipsis"]
      }, [item.file ? item.file.name : item.url]), renderCover()]);
    };
    return () => createVNode("div", {
      "class": bem("preview")
    }, [renderPreview(), renderMask(), renderDeleteIcon()]);
  }
});
const uploaderProps = {
  name: makeNumericProp(""),
  accept: makeStringProp("image/*"),
  capture: String,
  multiple: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  lazyLoad: Boolean,
  maxCount: makeNumericProp(Infinity),
  imageFit: makeStringProp("cover"),
  resultType: makeStringProp("dataUrl"),
  uploadIcon: makeStringProp("photograph"),
  uploadText: String,
  deletable: truthProp,
  reupload: Boolean,
  afterRead: Function,
  showUpload: truthProp,
  modelValue: makeArrayProp(),
  beforeRead: Function,
  beforeDelete: Function,
  previewSize: [Number, String, Array],
  previewImage: truthProp,
  previewOptions: Object,
  previewFullImage: truthProp,
  maxSize: {
    type: [Number, String, Function],
    default: Infinity
  }
};
var stdin_default = defineComponent({
  name,
  props: uploaderProps,
  emits: ["delete", "oversize", "clickUpload", "closePreview", "clickPreview", "clickReupload", "update:modelValue"],
  setup(props, {
    emit,
    slots
  }) {
    const inputRef = ref();
    const urls = [];
    const reuploadIndex = ref(-1);
    const isReuploading = ref(false);
    const getDetail = (index = props.modelValue.length) => ({
      name: props.name,
      index
    });
    const resetInput = () => {
      if (inputRef.value) {
        inputRef.value.value = "";
      }
    };
    const onAfterRead = (items) => {
      resetInput();
      if (isOversize(items, props.maxSize)) {
        if (Array.isArray(items)) {
          const result = filterFiles(items, props.maxSize);
          items = result.valid;
          emit("oversize", result.invalid, getDetail());
          if (!items.length) {
            return;
          }
        } else {
          emit("oversize", items, getDetail());
          return;
        }
      }
      items = reactive(items);
      if (reuploadIndex.value > -1) {
        const arr = [...props.modelValue];
        arr.splice(reuploadIndex.value, 1, items);
        emit("update:modelValue", arr);
        reuploadIndex.value = -1;
      } else {
        emit("update:modelValue", [...props.modelValue, ...toArray(items)]);
      }
      if (props.afterRead) {
        props.afterRead(items, getDetail());
      }
    };
    const readFile = (files) => {
      const {
        maxCount,
        modelValue,
        resultType
      } = props;
      if (Array.isArray(files)) {
        const remainCount = +maxCount - modelValue.length;
        if (files.length > remainCount) {
          files = files.slice(0, remainCount);
        }
        Promise.all(files.map((file) => readFileContent(file, resultType))).then((contents) => {
          const fileList = files.map((file, index) => {
            const result = {
              file,
              status: "",
              message: "",
              objectUrl: URL.createObjectURL(file)
            };
            if (contents[index]) {
              result.content = contents[index];
            }
            return result;
          });
          onAfterRead(fileList);
        });
      } else {
        readFileContent(files, resultType).then((content) => {
          const result = {
            file: files,
            status: "",
            message: "",
            objectUrl: URL.createObjectURL(files)
          };
          if (content) {
            result.content = content;
          }
          onAfterRead(result);
        });
      }
    };
    const onChange = (event) => {
      const {
        files
      } = event.target;
      if (props.disabled || !files || !files.length) {
        return;
      }
      const file = files.length === 1 ? files[0] : [].slice.call(files);
      if (props.beforeRead) {
        const response = props.beforeRead(file, getDetail());
        if (!response) {
          resetInput();
          return;
        }
        if (isPromise(response)) {
          response.then((data) => {
            if (data) {
              readFile(data);
            } else {
              readFile(file);
            }
          }).catch(resetInput);
          return;
        }
      }
      readFile(file);
    };
    let imagePreview;
    const onClosePreview = () => emit("closePreview");
    const previewImage = (item) => {
      if (props.previewFullImage) {
        const imageFiles = props.modelValue.filter(isImageFile);
        const images = imageFiles.map((item2) => {
          if (item2.objectUrl && !item2.url && item2.status !== "failed") {
            item2.url = item2.objectUrl;
            urls.push(item2.url);
          }
          return item2.url;
        }).filter(Boolean);
        imagePreview = showImagePreview(extend({
          images,
          startPosition: imageFiles.indexOf(item),
          onClose: onClosePreview
        }, props.previewOptions));
      }
    };
    const closeImagePreview = () => {
      if (imagePreview) {
        imagePreview.close();
      }
    };
    const deleteFile = (item, index) => {
      const fileList = props.modelValue.slice(0);
      fileList.splice(index, 1);
      emit("update:modelValue", fileList);
      emit("delete", item, getDetail(index));
    };
    const reuploadFile = (index) => {
      isReuploading.value = true;
      reuploadIndex.value = index;
      nextTick(() => chooseFile());
    };
    const onInputClick = () => {
      if (!isReuploading.value) {
        reuploadIndex.value = -1;
      }
      isReuploading.value = false;
    };
    const renderPreviewItem = (item, index) => {
      const needPickData = ["imageFit", "deletable", "reupload", "previewSize", "beforeDelete"];
      const previewData = extend(pick(props, needPickData), pick(item, needPickData, true));
      return createVNode(stdin_default$1, mergeProps({
        "item": item,
        "index": index,
        "onClick": () => emit(props.reupload ? "clickReupload" : "clickPreview", item, getDetail(index)),
        "onDelete": () => deleteFile(item, index),
        "onPreview": () => previewImage(item),
        "onReupload": () => reuploadFile(index)
      }, pick(props, ["name", "lazyLoad"]), previewData), pick(slots, ["preview-cover", "preview-delete"]));
    };
    const renderPreviewList = () => {
      if (props.previewImage) {
        return props.modelValue.map(renderPreviewItem);
      }
    };
    const onClickUpload = (event) => emit("clickUpload", event);
    const renderUpload = () => {
      const lessThanMax = props.modelValue.length < +props.maxCount;
      const Input = props.readonly ? null : createVNode("input", {
        "ref": inputRef,
        "type": "file",
        "class": bem("input"),
        "accept": props.accept,
        "capture": props.capture,
        "multiple": props.multiple && reuploadIndex.value === -1,
        "disabled": props.disabled,
        "onChange": onChange,
        "onClick": onInputClick
      }, null);
      if (slots.default) {
        return withDirectives(createVNode("div", {
          "class": bem("input-wrapper"),
          "onClick": onClickUpload
        }, [slots.default(), Input]), [[vShow, lessThanMax]]);
      }
      return withDirectives(createVNode("div", {
        "class": bem("upload", {
          readonly: props.readonly
        }),
        "style": getSizeStyle(props.previewSize),
        "onClick": onClickUpload
      }, [createVNode(Icon, {
        "name": props.uploadIcon,
        "class": bem("upload-icon")
      }, null), props.uploadText && createVNode("span", {
        "class": bem("upload-text")
      }, [props.uploadText]), Input]), [[vShow, props.showUpload && lessThanMax]]);
    };
    const chooseFile = () => {
      if (inputRef.value && !props.disabled) {
        inputRef.value.click();
      }
    };
    useExpose({
      chooseFile,
      reuploadFile,
      closeImagePreview
    });
    useCustomFieldValue(() => props.modelValue);
    return () => createVNode("div", {
      "class": bem()
    }, [createVNode("div", {
      "class": bem("wrapper", {
        disabled: props.disabled
      })
    }, [renderPreviewList(), renderUpload()])]);
  }
});
const Uploader = withInstall(stdin_default);
const vant_E1sid_s2drf_FTnNUXVP7c_m9CYVU2kcWnYFPKlNDOM = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const components = [
    Button,
    NavBar,
    Tab,
    Tabs,
    Popup,
    Overlay,
    Loading,
    Toast,
    Dialog,
    ActionSheet,
    Picker,
    Uploader,
    Swipe,
    SwipeItem,
    PullRefresh,
    List,
    ImagePreview,
    Field,
    Form,
    Cell,
    CellGroup,
    Card,
    Badge,
    Icon,
    Pagination,
    NoticeBar,
    Divider,
    Empty,
    Skeleton,
    Tag,
    Progress,
    Circle
  ];
  components.forEach((component) => {
    nuxtApp.vueApp.component(component.name || "", component);
  });
  return {
    provide: {
      vantToast: Toast,
      vantDialog: Dialog,
      vantImagePreview: ImagePreview
    }
  };
});
const ssg_detect_IpHCGcQQ_IR5Rl99qyukWoMA9fJGfuTYyoksTzy81cs = /* @__PURE__ */ defineNuxtPlugin({
  name: "i18n:plugin:ssg-detect",
  dependsOn: ["i18n:plugin", "i18n:plugin:route-locale-detect"],
  enforce: "post",
  setup(_nuxt) {
    useNuxtApp(_nuxt._id);
    return;
  }
});
const plugins = [
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin$1,
  supabase_server_NZuw_NDm2ZtOgvg4QqXN_Xqdg_KPvGuBBWKrLH15GWY,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  plugin,
  switch_locale_path_ssr_NflG9_QeVcJ1jVig0vCfxB_cZhpEMQ9U2ujRUiYbbVw,
  route_locale_detect__HPHJq3Jg7gwhwgKEI8tQavopSAjmrCSPXl9HgL2h9U,
  i18n_EI7LsD1KYQADczz5hrChviGQCdVM8yUkvFEZLJpmnvM,
  components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4,
  vant_E1sid_s2drf_FTnNUXVP7c_m9CYVU2kcWnYFPKlNDOM,
  ssg_detect_IpHCGcQQ_IR5Rl99qyukWoMA9fJGfuTYyoksTzy81cs
];
const layouts = {
  auth: defineAsyncComponent(() => import('./auth-D85-3ghC.mjs').then((m) => m.default || m)),
  default: defineAsyncComponent(() => import('./default-Db8mBkME.mjs').then((m) => m.default || m)),
  mobile: defineAsyncComponent(() => import('./mobile-DkqKjfBF.mjs').then((m) => m.default || m)),
  pay: defineAsyncComponent(() => import('./pay-nUxaFhjK.mjs').then((m) => m.default || m))
};
const routeRulesMatcher = _routeRulesMatcher;
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  setup(props, context) {
    return () => h(layouts[props.name], props.layoutProps, context.slots);
  }
});
const nuxtLayoutProps = {
  name: {
    type: [String, Boolean, Object],
    default: null
  },
  fallback: {
    type: [String, Object],
    default: null
  }
};
const __nuxt_component_0 = defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: nuxtLayoutProps,
  setup(props, context) {
    const nuxtApp = useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const shouldUseEagerRoute = !injectedRoute || injectedRoute === useRoute$1();
    const route2 = shouldUseEagerRoute ? useRoute$2() : injectedRoute;
    const layout = computed(() => {
      let layout2 = unref(props.name) ?? route2?.meta.layout ?? routeRulesMatcher(route2?.path).appLayout ?? "default";
      if (layout2 && !(layout2 in layouts)) {
        if (props.fallback) {
          layout2 = unref(props.fallback);
        }
      }
      return layout2;
    });
    const layoutRef = shallowRef();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    let lastLayout;
    return () => {
      const hasLayout = !!layout.value && layout.value in layouts;
      const hasTransition = hasLayout && !!(route2?.meta.layoutTransition ?? appLayoutTransition);
      const transitionProps = hasTransition && _mergeTransitionProps([
        route2?.meta.layoutTransition,
        appLayoutTransition,
        {
          onBeforeLeave() {
            nuxtApp["~transitionPromise"] = new Promise((resolve2) => {
              nuxtApp["~transitionFinish"] = resolve2;
            });
          },
          onAfterLeave() {
            nuxtApp["~transitionFinish"]?.();
            delete nuxtApp["~transitionFinish"];
            delete nuxtApp["~transitionPromise"];
          }
        }
      ]);
      const previouslyRenderedLayout = lastLayout;
      lastLayout = layout.value;
      return _wrapInTransition(transitionProps, {
        default: () => h(
          Suspense,
          {
            suspensible: true,
            onResolve: async () => {
              await nextTick(done);
            }
          },
          {
            default: () => h(
              LayoutProvider,
              {
                layoutProps: mergeProps(context.attrs, route2.meta.layoutProps ?? {}, { ref: layoutRef }),
                key: layout.value || void 0,
                name: layout.value,
                shouldProvide: !props.name,
                isRenderingNewLayout: (name2) => {
                  return name2 !== previouslyRenderedLayout && name2 === layout.value;
                },
                hasTransition
              },
              context.slots
            )
          }
        )
      }).default();
    };
  }
});
const LayoutProvider = defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    },
    isRenderingNewLayout: {
      type: Function,
      required: true
    }
  },
  setup(props, context) {
    const name2 = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        // When name=false, always return true so NuxtPage doesn't skip rendering
        isCurrent: (route2) => name2 === false || name2 === (route2.meta.layout ?? routeRulesMatcher(route2.path).appLayout ?? "default")
      });
    }
    const injectedRoute = inject(PageRouteSymbol);
    const isNotWithinNuxtPage = injectedRoute && injectedRoute === useRoute$1();
    if (isNotWithinNuxtPage) {
      const vueRouterRoute = useRoute$2();
      const reactiveChildRoute = {};
      for (const _key in vueRouterRoute) {
        const key = _key;
        Object.defineProperty(reactiveChildRoute, key, {
          enumerable: true,
          get: () => {
            return props.isRenderingNewLayout(props.name) ? vueRouterRoute[key] : injectedRoute[key];
          }
        });
      }
      provide(PageRouteSymbol, shallowReactive(reactiveChildRoute));
    }
    return () => {
      if (!name2 || typeof name2 === "string" && !(name2 in layouts)) {
        return context.slots.default?.();
      }
      return h(
        LayoutLoader,
        { key: name2, layoutProps: props.layoutProps, name: name2 },
        context.slots
      );
    };
  }
});
const defineRouteProvider = (name2 = "RouteProvider") => defineComponent({
  name: name2,
  props: {
    route: {
      type: Object,
      required: true
    },
    vnode: Object,
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route2 = {};
    for (const key in props.route) {
      Object.defineProperty(route2, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route2));
    return () => {
      if (!props.vnode) {
        return props.vnode;
      }
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_1 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps2) => {
          return h(Suspense, { suspensible: true }, {
            default() {
              return h(RouteProvider, {
                vnode: slots.default ? normalizeSlot(slots.default, routeProps2) : routeProps2.Component,
                route: routeProps2.route,
                vnodeRef: pageRef
              });
            }
          });
        }
      });
    };
  }
});
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
const useSupabaseClient = () => {
  return useNuxtApp().$supabase.client;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const { locale } = useI18n();
    useSupabaseClient();
    useSupabaseUser();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_NuxtPage = __nuxt_component_1;
      _push(ssrRenderComponent(_component_NuxtLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtPage)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    const status = Number(_error.statusCode || 500);
    const is404 = status === 404;
    const statusText = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-DyJwnlkL.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-BJixXQWB.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ status: unref(status), statusText: unref(statusText), statusCode: unref(status), statusMessage: unref(statusText), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute$1());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup", []);
    const error = /* @__PURE__ */ useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    function invokeAppErrorHandler(err, target, info) {
      const errorHandler = nuxtApp.vueApp.config.errorHandler;
      if (errorHandler && !errorHandler.__nuxt_default) {
        try {
          errorHandler(err, target, info);
        } catch (handlerError) {
          console.error("[nuxt] Error in `app.config.errorHandler`", handlerError);
        }
      }
    }
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        invokeAppErrorHandler(err, target, info);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext && (ssrContext["~renderResponse"] || ssrContext._renderResponse)) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry_default = ((ssrContext) => entry(ssrContext));

export { __nuxt_component_0 as _, useLocalePath as a, useSupabaseClient as b, useSupabaseUser as c, useRoute$1 as d, entry_default as default, useRuntimeConfig as e, useRouter as f, useNuxtApp as g, asyncDataDefaults as h, createError as i, fetchDefaults as j, useRequestFetch as k, defineNuxtRouteMiddleware as l, encodeRoutePath as m, navigateTo as n, hasProtocol as o, parseQuery as p, joinURL as q, resolveRouteObject$1 as r, isScriptProtocol as s, tryUseNuxtApp as t, useI18n as u, withoutTrailingSlash as v, withTrailingSlash as w, nuxtLinkDefaults as x, useSwitchLocalePath as y };
//# sourceMappingURL=server.mjs.map
