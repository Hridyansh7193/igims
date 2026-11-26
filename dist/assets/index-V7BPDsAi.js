const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/HomePage-7p7mC5pn.js","assets/vendor-icons-ApcgS4FA.js","assets/Reveal-CwF8G2FT.js","assets/eventsData-D9OfRqbs.js","assets/index-Dc8q-KFv.js","assets/vendor-react-Bl7zSkmt.js","assets/vendor-supabase-D_iOwayF.js","assets/EventsPage-xz33R6yC.js","assets/eventsService-CllJS-Rr.js","assets/PronitesPage-s_fDDqVF.js","assets/AccommodationPage-14saqagm.js","assets/razorpay-DmVB55cI.js","assets/ContactPage-BHmzy41u.js","assets/AboutPage-Aq9oJc3s.js","assets/DashboardPage-BK7WO9zR.js","assets/promoService-D9VprQ88.js","assets/promoCodes-CgzfsiK8.js","assets/browser-rkJRqvIq.js","assets/PolicyPage-BA3WEigX.js","assets/AdminPage-Bb0Gzk--.js","assets/BookingPortalPage-BVRAhdYu.js","assets/TitleSponsorModal-Br6cd6SS.js"])))=>i.map(i=>d[i]);
import{r as he,g as xe,a as u,C as be,R as ye,S as we,b as ve,X as ke,c as le}from"./vendor-icons-ApcgS4FA.js";import{r as Ce}from"./vendor-react-Bl7zSkmt.js";import{c as je}from"./vendor-supabase-D_iOwayF.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function r(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(a){if(a.ep)return;a.ep=!0;const o=r(a);fetch(a.href,o)}})();var U={exports:{}},F={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var X;function Ee(){if(X)return F;X=1;var n=he(),t=Symbol.for("react.element"),r=Symbol.for("react.fragment"),i=Object.prototype.hasOwnProperty,a=n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,o={key:!0,ref:!0,__self:!0,__source:!0};function c(d,h,m){var p,f={},s=null,g=null;m!==void 0&&(s=""+m),h.key!==void 0&&(s=""+h.key),h.ref!==void 0&&(g=h.ref);for(p in h)i.call(h,p)&&!o.hasOwnProperty(p)&&(f[p]=h[p]);if(d&&d.defaultProps)for(p in h=d.defaultProps,h)f[p]===void 0&&(f[p]=h[p]);return{$$typeof:t,type:d,key:s,ref:g,props:f,_owner:a.current}}return F.Fragment=r,F.jsx=c,F.jsxs=c,F}var K;function Se(){return K||(K=1,U.exports=Ee()),U.exports}var e=Se(),M={},J;function Le(){if(J)return M;J=1;var n=Ce();return M.createRoot=n.createRoot,M.hydrateRoot=n.hydrateRoot,M}var Ae=Le();const Pe=xe(Ae),Re="modulepreload",Te=function(n){return"/"+n},Z={},E=function(t,r,i){let a=Promise.resolve();if(r&&r.length>0){let c=function(m){return Promise.all(m.map(p=>Promise.resolve(p).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};document.getElementsByTagName("link");const d=document.querySelector("meta[property=csp-nonce]"),h=(d==null?void 0:d.nonce)||(d==null?void 0:d.getAttribute("nonce"));a=c(r.map(m=>{if(m=Te(m),m in Z)return;Z[m]=!0;const p=m.endsWith(".css"),f=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${m}"]${f}`))return;const s=document.createElement("link");if(s.rel=p?"stylesheet":Re,p||(s.as="script"),s.crossOrigin="",s.href=m,h&&s.setAttribute("nonce",h),document.head.appendChild(s),p)return new Promise((g,l)=>{s.addEventListener("load",g),s.addEventListener("error",()=>l(new Error(`Unable to preload CSS for ${m}`)))})}))}function o(c){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=c,window.dispatchEvent(d),!d.defaultPrevented)throw c}return a.then(c=>{for(const d of c||[])d.status==="rejected"&&o(d.reason);return t().catch(o)})};/*! Capacitor: https://capacitorjs.com/ - MIT License */var R;(function(n){n.Unimplemented="UNIMPLEMENTED",n.Unavailable="UNAVAILABLE"})(R||(R={}));class N extends Error{constructor(t,r,i){super(t),this.message=t,this.code=r,this.data=i}}const Fe=n=>{var t,r;return n!=null&&n.androidBridge?"android":!((r=(t=n==null?void 0:n.webkit)===null||t===void 0?void 0:t.messageHandlers)===null||r===void 0)&&r.bridge?"ios":"web"},Ie=n=>{const t=n.CapacitorCustomPlatform||null,r=n.Capacitor||{},i=r.Plugins=r.Plugins||{},a=()=>t!==null?t.name:Fe(n),o=()=>a()!=="web",c=f=>{const s=m.get(f);return!!(s!=null&&s.platforms.has(a())||d(f))},d=f=>{var s;return(s=r.PluginHeaders)===null||s===void 0?void 0:s.find(g=>g.name===f)},h=f=>n.console.error(f),m=new Map,p=(f,s={})=>{const g=m.get(f);if(g)return console.warn(`Capacitor plugin "${f}" already registered. Cannot register plugins twice.`),g.proxy;const l=a(),x=d(f);let b;const y=async()=>(!b&&l in s?b=typeof s[l]=="function"?b=await s[l]():b=s[l]:t!==null&&!b&&"web"in s&&(b=typeof s.web=="function"?b=await s.web():b=s.web),b),w=(v,k)=>{var S,L;if(x){const A=x==null?void 0:x.methods.find(C=>k===C.name);if(A)return A.rtype==="promise"?C=>r.nativePromise(f,k.toString(),C):(C,z)=>r.nativeCallback(f,k.toString(),C,z);if(v)return(S=v[k])===null||S===void 0?void 0:S.bind(v)}else{if(v)return(L=v[k])===null||L===void 0?void 0:L.bind(v);throw new N(`"${f}" plugin is not implemented on ${l}`,R.Unimplemented)}},j=v=>{let k;const S=(...L)=>{const A=y().then(C=>{const z=w(C,v);if(z){const O=z(...L);return k=O==null?void 0:O.remove,O}else throw new N(`"${f}.${v}()" is not implemented on ${l}`,R.Unimplemented)});return v==="addListener"&&(A.remove=async()=>k()),A};return S.toString=()=>`${v.toString()}() { [capacitor code] }`,Object.defineProperty(S,"name",{value:v,writable:!1,configurable:!1}),S},D=j("addListener"),T=j("removeListener"),fe=(v,k)=>{const S=D({eventName:v},k).then(C=>C),L=async()=>{const C=await S;await T({eventName:v,callbackId:C})},A=new Promise(C=>S.then(()=>C({remove:L})));return A.remove=async()=>{console.warn("Using addListener() without 'await' is deprecated."),await L()},A},G=new Proxy({},{get(v,k){switch(k){case"$$typeof":return;case"toJSON":return()=>({});case"addListener":return x?fe:D;case"removeListener":return T;default:return j(k)}}});return i[f]=G,m.set(f,{name:f,proxy:G,platforms:new Set([...Object.keys(s),...x?[l]:[]])}),G};return r.convertFileSrc||(r.convertFileSrc=f=>f),r.getPlatform=a,r.handleError=h,r.isNativePlatform=o,r.isPluginAvailable=c,r.registerPlugin=p,r.Exception=N,r.DEBUG=!!r.DEBUG,r.isLoggingEnabled=!!r.isLoggingEnabled,r},_e=n=>n.Capacitor=Ie(n),W=_e(typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{}),q=W.registerPlugin;class V{constructor(){this.listeners={},this.retainedEventArguments={},this.windowListeners={}}addListener(t,r){let i=!1;this.listeners[t]||(this.listeners[t]=[],i=!0),this.listeners[t].push(r);const o=this.windowListeners[t];o&&!o.registered&&this.addWindowListener(o),i&&this.sendRetainedArgumentsForEvent(t);const c=async()=>this.removeListener(t,r);return Promise.resolve({remove:c})}async removeAllListeners(){this.listeners={};for(const t in this.windowListeners)this.removeWindowListener(this.windowListeners[t]);this.windowListeners={}}notifyListeners(t,r,i){const a=this.listeners[t];if(!a){if(i){let o=this.retainedEventArguments[t];o||(o=[]),o.push(r),this.retainedEventArguments[t]=o}return}a.forEach(o=>o(r))}hasListeners(t){var r;return!!(!((r=this.listeners[t])===null||r===void 0)&&r.length)}registerWindowListener(t,r){this.windowListeners[r]={registered:!1,windowEventName:t,pluginEventName:r,handler:i=>{this.notifyListeners(r,i)}}}unimplemented(t="not implemented"){return new W.Exception(t,R.Unimplemented)}unavailable(t="not available"){return new W.Exception(t,R.Unavailable)}async removeListener(t,r){const i=this.listeners[t];if(!i)return;const a=i.indexOf(r);a!==-1&&this.listeners[t].splice(a,1),this.listeners[t].length||this.removeWindowListener(this.windowListeners[t])}addWindowListener(t){window.addEventListener(t.windowEventName,t.handler),t.registered=!0}removeWindowListener(t){t&&(window.removeEventListener(t.windowEventName,t.handler),t.registered=!1)}sendRetainedArgumentsForEvent(t){const r=this.retainedEventArguments[t];r&&(delete this.retainedEventArguments[t],r.forEach(i=>{this.notifyListeners(t,i)}))}}const Q=n=>encodeURIComponent(n).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape),ee=n=>n.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent);class De extends V{async getCookies(){const t=document.cookie,r={};return t.split(";").forEach(i=>{if(i.length<=0)return;let[a,o]=i.replace(/=/,"CAP_COOKIE").split("CAP_COOKIE");a=ee(a).trim(),o=ee(o).trim(),r[a]=o}),r}async setCookie(t){try{const r=Q(t.key),i=Q(t.value),a=t.expires?`; expires=${t.expires.replace("expires=","")}`:"",o=(t.path||"/").replace("path=",""),c=t.url!=null&&t.url.length>0?`domain=${t.url}`:"";document.cookie=`${r}=${i||""}${a}; path=${o}; ${c};`}catch(r){return Promise.reject(r)}}async deleteCookie(t){try{document.cookie=`${t.key}=; Max-Age=0`}catch(r){return Promise.reject(r)}}async clearCookies(){try{const t=document.cookie.split(";")||[];for(const r of t)document.cookie=r.replace(/^ +/,"").replace(/=.*/,`=;expires=${new Date().toUTCString()};path=/`)}catch(t){return Promise.reject(t)}}async clearAllCookies(){try{await this.clearCookies()}catch(t){return Promise.reject(t)}}}q("CapacitorCookies",{web:()=>new De});const ze=async n=>new Promise((t,r)=>{const i=new FileReader;i.onload=()=>{const a=i.result;t(a.indexOf(",")>=0?a.split(",")[1]:a)},i.onerror=a=>r(a),i.readAsDataURL(n)}),Oe=(n={})=>{const t=Object.keys(n);return Object.keys(n).map(a=>a.toLocaleLowerCase()).reduce((a,o,c)=>(a[o]=n[t[c]],a),{})},Me=(n,t=!0)=>n?Object.entries(n).reduce((i,a)=>{const[o,c]=a;let d,h;return Array.isArray(c)?(h="",c.forEach(m=>{d=t?encodeURIComponent(m):m,h+=`${o}=${d}&`}),h.slice(0,-1)):(d=t?encodeURIComponent(c):c,h=`${o}=${d}`),`${i}&${h}`},"").substr(1):null,Be=(n,t={})=>{const r=Object.assign({method:n.method||"GET",headers:n.headers},t),a=Oe(n.headers)["content-type"]||"";if(typeof n.data=="string")r.body=n.data;else if(a.includes("application/x-www-form-urlencoded")){const o=new URLSearchParams;for(const[c,d]of Object.entries(n.data||{}))o.set(c,d);r.body=o.toString()}else if(a.includes("multipart/form-data")||n.data instanceof FormData){const o=new FormData;if(n.data instanceof FormData)n.data.forEach((d,h)=>{o.append(h,d)});else for(const d of Object.keys(n.data))o.append(d,n.data[d]);r.body=o;const c=new Headers(r.headers);c.delete("content-type"),r.headers=c}else(a.includes("application/json")||typeof n.data=="object")&&(r.body=JSON.stringify(n.data));return r};class We extends V{async request(t){const r=Be(t,t.webFetchExtra),i=Me(t.params,t.shouldEncodeUrlParams),a=i?`${t.url}?${i}`:t.url,o=await fetch(a,r),c=o.headers.get("content-type")||"";let{responseType:d="text"}=o.ok?t:{};c.includes("application/json")&&(d="json");let h,m;switch(d){case"arraybuffer":case"blob":m=await o.blob(),h=await ze(m);break;case"json":h=await o.json();break;case"document":case"text":default:h=await o.text()}const p={};return o.headers.forEach((f,s)=>{p[s]=f}),{data:h,headers:p,status:o.status,url:o.url}}async get(t){return this.request(Object.assign(Object.assign({},t),{method:"GET"}))}async post(t){return this.request(Object.assign(Object.assign({},t),{method:"POST"}))}async put(t){return this.request(Object.assign(Object.assign({},t),{method:"PUT"}))}async patch(t){return this.request(Object.assign(Object.assign({},t),{method:"PATCH"}))}async delete(t){return this.request(Object.assign(Object.assign({},t),{method:"DELETE"}))}}q("CapacitorHttp",{web:()=>new We});var te;(function(n){n.Dark="DARK",n.Light="LIGHT",n.Default="DEFAULT"})(te||(te={}));var re;(function(n){n.StatusBar="StatusBar",n.NavigationBar="NavigationBar"})(re||(re={}));class $e extends V{async setStyle(){this.unavailable("not available for web")}async setAnimation(){this.unavailable("not available for web")}async show(){this.unavailable("not available for web")}async hide(){this.unavailable("not available for web")}}q("SystemBars",{web:()=>new $e});function ne(){return e.jsx("style",{children:`
      /* ==========================================================================
         CEREBREXIA '26 - NEW LOGO COLOR PALETTE
         Vermillion Red · Hot Magenta · Sapphire Blue · Royal Gold · Dark Amber
         ========================================================================== */
      :root {
        /* Deep Dark Backgrounds — near-black with warm maroon undertone */
        --navy-void: #080406;
        --navy-deep: #0C0508;
        --navy-surface: #140A0C;
        --navy-card: #1A0C0F;
        --indigo-nebula: #220D12;
        
        /* PRIMARY — Vermillion / Crimson Red (dominant logo color) */
        --cyan: #C0392B;
        --cyan-glow: #E74C3C;
        --cyan-dark: #7B1A14;
        --azure-deep: #220D12;
        --crx-red: #C0392B;
        --crx-red-bright: #E74C3C;
        --crx-red-deep: #7B1A14;
        
        /* ACCENT — Saffron Orange / Warm Amber (crown gems glow) */
        --crx-orange: #D4500A;
        --crx-orange-bright: #F06A1A;

        /* ACCENT — Hot Magenta / Dark Pink (crown gemstone highlights) */
        --crx-magenta: #C0185A;
        --crx-magenta-bright: #E91E8C;
        --crx-magenta-deep: #7A0F38;

        /* ACCENT — Sapphire Blue (single blue gem — contrast pop) */
        --crx-blue: #1565C0;
        --crx-blue-bright: #2196F3;

        /* Royal Gold (crown metal & diadem) */
        --gold: #C9973A;
        --gold-glow: #E8B84B;
        --gold-amber: #9A7228;
        --gold-dark: #5C4218;

        /* Text & Neutrals */
        --cream: #F7EDE2;
        --paper: #B8A898;
        --ink: #080406;
        --muted: #9A8A7A;
        --muted-blue: #7A6A5A;
        
        /* Borders & Glows */
        --hair: rgba(192, 57, 43, 0.25);
        --hair-gold: rgba(201, 151, 58, 0.35);
        --glow-cyan: 0 0 25px rgba(192, 57, 43, 0.45);
        --glow-gold: 0 0 25px rgba(201, 151, 58, 0.45);
        --glow-magenta: 0 0 25px rgba(192, 24, 90, 0.45);
        --glow-blue: 0 0 25px rgba(21, 101, 192, 0.5);

        /* Shared CRX Design System */
        --crx-gold: #E8B84B;
        --crx-bg: #080406;
        --crx-border: rgba(255, 255, 255, 0.08);
        --crx-text-main: #F7EDE2;
        --crx-text-muted: #9A8A7A;
        --font-serif: 'Playfair Display', serif;
        --font-sans: 'Inter', sans-serif;
      }

      *, *::before, *::after {
        box-sizing: border-box;
      }

      html {
        scroll-behavior: smooth;
        background-color: var(--navy-void);
        width: 100%;
        max-width: 100vw;
        overflow-x: hidden;
        overflow-x: clip;
      }

      body {
        margin: 0;
        padding: 0;
        width: 100%;
        max-width: 100vw;
        background-color: var(--navy-void);
        color: var(--paper);
        overflow-x: hidden;
        overflow-x: clip;
        position: relative;
      }

      #root {
        width: 100%;
        max-width: 100vw;
        overflow-x: hidden;
        overflow-x: clip;
        position: relative;
      }

      .crx-root {
        font-family: 'Space Grotesk', sans-serif;
        background: radial-gradient(ellipse at 50% -10%, #1C0810 0%, #080406 45%, #080406 100%);
        color: var(--paper);
        min-height: 100vh;
        width: 100%;
        max-width: 100vw;
        position: relative;
        overflow-x: hidden;
        overflow-x: clip;
      }

      .crx-display {
        font-family: 'Anton', sans-serif;
        letter-spacing: 0.5px;
      }

      .crx-black {
        font-family: 'Archivo Black', sans-serif;
      }

      *:focus-visible {
        outline: 2px solid var(--gold);
        outline-offset: 3px;
      }

      /* Ambient background dust & vignetting — vermillion + magenta atmospheric glow */
      .crx-dots {
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        background-image: radial-gradient(rgba(192, 57, 43, 0.13) 1px, transparent 1.5px);
        background-size: 34px 34px;
        opacity: 0.5;
      }

      .crx-vignette {
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        background: radial-gradient(ellipse at 50% 0%, rgba(192, 24, 90, 0.09), transparent 60%);
      }

      /* Angled Festival Sticker Badges */
      .crx-sticker {
        display: inline-block;
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 600;
        font-size: 11px;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        padding: 7px 14px;
        border-radius: 6px;
        white-space: nowrap;
        background: rgba(212, 175, 85, 0.06);
        border: 1px solid rgba(212, 175, 85, 0.3);
        color: #E5C07B;
        box-shadow: none;
        max-width: 100%;
      }

      /* All tones render identically now — one unified design system, no solid fills */
      .crx-sticker.gold,
      .crx-sticker.orange,
      .crx-sticker.cyan {
        background: rgba(212, 175, 85, 0.06);
        border: 1px solid rgba(212, 175, 85, 0.3);
        color: #E5C07B;
        box-shadow: none;
      }

      /* Dedicated subtle badge for stat labels (Edition Live, Total Events, etc.) */
      .crx-stat-badge {
        display: inline-block;
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 600;
        font-size: 0.75rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        padding: 6px 12px;
        border-radius: 6px;
        white-space: nowrap;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #A1A1AA;
      }

      /* Buttons with Cosmic Glows */
      .crx-btn {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-weight: 700;
        font-size: 13px;
        letter-spacing: 0.75px;
        text-transform: uppercase;
        padding: 13px 26px;
        border-radius: 10px;
        border: none;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
      }

      .crx-btn:hover {
        transform: translateY(-2px);
        filter: brightness(1.1);
      }

      .crx-btn:active {
        transform: translateY(0);
      }

      .crx-btn.gold {
        background: linear-gradient(135deg, #C0392B 0%, #D4500A 100%);
        color: #FFFFFF;
        box-shadow: 0 4px 20px rgba(192, 57, 43, 0.45);
      }

      .crx-btn.orange,
      .crx-btn.cyan {
        background: rgba(201, 151, 58, 0.08);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(201, 151, 58, 0.4);
        color: #F7EDE2;
        box-shadow: 0 4px 16px rgba(0,0,0,0.35);
      }

      .crx-btn.orange:hover,
      .crx-btn.cyan:hover {
        background: rgba(201, 151, 58, 0.16);
        border-color: rgba(201, 151, 58, 0.7);
      }

      /* Continuous Marquee Tickers */
      .crx-marquee {
        overflow: hidden;
        white-space: nowrap;
        position: relative;
        width: 100%;
      }

      .crx-marquee-track {
        display: inline-flex;
        align-items: center;
        animation: crx-scroll 24s linear infinite;
      }

      @keyframes crx-scroll {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }

      @media (prefers-reduced-motion: reduce) {
        .crx-marquee-track { animation: none; }
      }

      /* Navigation Tabs */
      .crx-navtab {
        transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
      }

      .crx-navtab:hover {
        color: var(--cyan);
      }

      /* Cosmic Card Hover Effects */
      .crx-card {
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;
      }

      .crx-card:hover {
        transform: translateY(-4px);
        border-color: rgba(220, 38, 38, 0.5) !important;
        box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.5);
      }

      .crx-idcard {
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
      }

      .crx-idcard:hover {
        transform: translateY(-5px) rotate(0.6deg);
        box-shadow: 0 20px 35px -10px rgba(179, 18, 58, 0.25);
      }

      .crx-social {
        transition: transform 0.2s ease, color 0.2s ease;
      }

      .crx-social:hover {
        transform: translateY(-3px);
        color: var(--cyan) !important;
      }

      .crx-burger span {
        display: block;
        width: 22px;
        height: 2px;
        background: var(--paper);
        margin: 5px 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }

      /* Custom Cyan/Gold Scrollbar */
      .crx-scrollbar::-webkit-scrollbar {
        height: 6px;
      }
      .crx-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(90deg, var(--cyan), var(--gold));
        border-radius: 3px;
      }

      input, textarea {
        font-family: 'Space Grotesk', sans-serif;
      }
      input:focus, textarea:focus {
        border-color: var(--cyan) !important;
        box-shadow: 0 0 0 3px rgba(179, 18, 58, 0.25) !important;
      }

      /* Floating Ambient Keyframe Animations */
      @keyframes crx-float {
        0% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(-20px) scale(1.05); }
        100% { transform: translateY(10px) scale(0.98); }
      }

      @keyframes crx-pulse-glow {
        0%   { filter: drop-shadow(0 0 10px rgba(192, 57, 43, 0.5)); }
        33%  { filter: drop-shadow(0 0 20px rgba(192, 24, 90, 0.5)); }
        66%  { filter: drop-shadow(0 0 25px rgba(201, 151, 58, 0.6)); }
        100% { filter: drop-shadow(0 0 10px rgba(192, 57, 43, 0.5)); }
      }

      /* Glitch title reveal — tiny jitter while resolving */
      @keyframes crx-glitch-jitter {
        0%   { transform: translate(0, 0); }
        25%  { transform: translate(-1.5px, 1px); }
        50%  { transform: translate(1.5px, -1px); }
        75%  { transform: translate(-1px, -1px); }
        100% { transform: translate(0, 0); }
      }

      @media (prefers-reduced-motion: reduce) {
        [style*="crx-glitch-jitter"] { animation: none !important; }
      }

      /* ==========================================================================
         MASCOT HALO FX — rotating rays, spinning ring, pulsing light beam
         ========================================================================== */
      @keyframes crx-rays-spin {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to   { transform: translate(-50%, -50%) rotate(360deg); }
      }

      @keyframes crx-ring-spin {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to   { transform: translate(-50%, -50%) rotate(-360deg); }
      }

      @keyframes crx-beam-pulse {
        0%, 100% { opacity: 0.35; transform: translateX(-50%) scaleY(0.92); }
        50%      { opacity: 0.9;  transform: translateX(-50%) scaleY(1.05); }
      }

      @keyframes crx-halo-breathe {
        0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) scale(1); }
        50%      { opacity: 1;    transform: translate(-50%, -50%) scale(1.08); }
      }

      .crx-mascot-rays {
        animation: crx-rays-spin 18s linear infinite;
      }

      .crx-mascot-ring {
        animation: crx-ring-spin 26s linear infinite;
      }

      .crx-mascot-beam {
        animation: crx-beam-pulse 3.2s ease-in-out infinite;
      }

      .crx-mascot-halo {
        animation: crx-halo-breathe 3.2s ease-in-out infinite;
      }

      @media (prefers-reduced-motion: reduce) {
        .crx-mascot-rays,
        .crx-mascot-ring,
        .crx-mascot-beam,
        .crx-mascot-halo {
          animation: none !important;
        }
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }

      /* ====================================================================
         NAVBAR GLASSMORPHISM & SCROLL BEHAVIOR (Seamless, no scroll outline)
         ==================================================================== */
      header.crx-nav-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 50;
        padding: 20px 32px;
        background: transparent;
        border-bottom: none !important;
        box-shadow: none !important;
        outline: none !important;
        transition: padding 0.25s ease;
      }

      header.crx-nav-header.scrolled {
        background: transparent !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        border-bottom: none !important;
        box-shadow: none !important;
        outline: none !important;
        padding: 16px 32px;
      }

      .crx-mobile-break {
        display: none;
      }

      /* ====================================================================
         MOBILE RESPONSIVENESS
         ==================================================================== */

      /* Prevent horizontal scroll everywhere */
      html, body, #root, .crx-root {
        overflow-x: hidden !important;
        overflow-x: clip !important;
        width: 100% !important;
        max-width: 100vw !important;
      }

      /* Ensure touch targets and mobile spacing */
      @media (max-width: 768px) {
        .crx-mobile-break {
          display: inline;
        }

        header.crx-nav-header {
          padding: 12px 16px !important;
          background: transparent !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          border-bottom: none !important;
          box-shadow: none !important;
        }

        header.crx-nav-header.scrolled {
          padding: 12px 16px !important;
          background: transparent !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          border-bottom: none !important;
          box-shadow: none !important;
        }

        .crx-logo-badge {
          width: 42px !important;
          height: 42px !important;
          border-radius: 12px !important;
        }

        .crx-hamburger-btn {
          width: 42px !important;
          height: 42px !important;
          border-radius: 12px !important;
        }

        .crx-director-grid {
          grid-template-columns: 1fr !important;
          gap: 28px !important;
          text-align: center;
        }

        .crx-btn {
          padding: 14px 20px;
          font-size: 12px;
          min-height: 44px;
        }

        .crx-sticker {
          font-size: 10px !important;
          padding: 6px 12px !important;
          white-space: normal !important;
          text-align: center !important;
          word-break: normal !important;
          max-width: 90vw !important;
          line-height: 1.35 !important;
        }

        .crx-stat-badge {
          font-size: 0.65rem;
          padding: 5px 10px;
        }
      }

      /* Small phones (under 400px) */
      @media (max-width: 400px) {
        .crx-btn {
          padding: 12px 16px;
          font-size: 11px;
          letter-spacing: 0.4px;
        }

        .crx-sticker {
          font-size: 9px !important;
          letter-spacing: 0.6px !important;
          padding: 5px 10px !important;
        }
      }
    `})}function ce(){const n=u.useRef(null);return u.useEffect(()=>{const t=n.current;if(!t)return;const r=t.getContext("2d");if(!r)return;let i,a=t.width=window.innerWidth,o=t.height=window.innerHeight;const c=()=>{a=t.width=window.innerWidth,o=t.height=window.innerHeight};window.addEventListener("resize",c);const d=["rgba(192, 57, 43, ","rgba(212, 80, 10, ","rgba(192, 24, 90, ","rgba(21, 101, 192, ","rgba(201, 151, 58, "],h=Math.min(a>768?65:35,80),m=Array.from({length:h},()=>({x:Math.random()*a,y:Math.random()*o,vx:(Math.random()-.5)*.45,vy:(Math.random()-.5)*.45,radius:Math.random()*2+.8,baseAlpha:Math.random()*.6+.25,alphaSpeed:Math.random()*.02+.008,alphaPhase:Math.random()*Math.PI*2,color:d[Math.floor(Math.random()*d.length)]}));let p={x:-1e3,y:-1e3,active:!1};const f=l=>{p.x=l.clientX,p.y=l.clientY,p.active=!0},s=()=>{p.active=!1};window.addEventListener("mousemove",f),window.addEventListener("mouseleave",s);const g=()=>{r.clearRect(0,0,a,o);for(let l=0;l<m.length;l++)for(let x=l+1;x<m.length;x++){const b=m[l].x-m[x].x,y=m[l].y-m[x].y,w=Math.sqrt(b*b+y*y);if(w<115){const j=(1-w/115)*.18;r.strokeStyle=`rgba(179, 18, 58, ${j})`,r.lineWidth=.6,r.beginPath(),r.moveTo(m[l].x,m[l].y),r.lineTo(m[x].x,m[x].y),r.stroke()}}m.forEach(l=>{if(l.x+=l.vx,l.y+=l.vy,l.x<0&&(l.x=a),l.x>a&&(l.x=0),l.y<0&&(l.y=o),l.y>o&&(l.y=0),p.active){const b=l.x-p.x,y=l.y-p.y,w=Math.sqrt(b*b+y*y);if(w<100&&w>0){const j=(100-w)/100;l.x+=b/w*j*1.5,l.y+=y/w*j*1.5}}l.alphaPhase+=l.alphaSpeed;const x=Math.max(.1,l.baseAlpha+Math.sin(l.alphaPhase)*.25);r.beginPath(),r.arc(l.x,l.y,l.radius,0,Math.PI*2),r.fillStyle=`${l.color}${x})`,r.shadowBlur=8,r.shadowColor=`${l.color}0.7)`,r.fill(),r.shadowBlur=0}),i=requestAnimationFrame(g)};return g(),()=>{cancelAnimationFrame(i),window.removeEventListener("resize",c),window.removeEventListener("mousemove",f),window.removeEventListener("mouseleave",s)}},[]),e.jsxs("div",{style:{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"},children:[e.jsx("div",{style:{position:"absolute",top:"-15%",left:"20%",width:"65vw",height:"65vw",maxWidth:900,maxHeight:900,borderRadius:"50%",background:"radial-gradient(circle, rgba(185, 28, 28, 0.12) 0%, transparent 70%)",filter:"blur(60px)",animation:"crx-float 16s ease-in-out infinite alternate"}}),e.jsx("canvas",{ref:n,style:{width:"100%",height:"100%",display:"block"}})]})}const Ge="/assets/logo-vVsmndta.webp",Ue="/assets/logo-sm-Bdg26l8s.webp",Ne=Ge,He=Ue,qe="/assets/logo-blue-wTcvU56K.webp";function Ve({onDone:n}){const[t,r]=u.useState("morphing"),[i,a]=u.useState(0),o=u.useRef(!1);u.useEffect(()=>{const x=setTimeout(()=>{r("red-loading")},4800);return()=>clearTimeout(x)},[]),u.useEffect(()=>{if(t!=="red-loading")return;let x=performance.now();const b=2800;let y;const w=j=>{const D=j-x,T=Math.min(100,D/b*100);a(T),T<100?y=requestAnimationFrame(w):setTimeout(()=>{o.current||(o.current=!0,n&&n())},380)};return y=requestAnimationFrame(w),()=>cancelAnimationFrame(y)},[t,n]);const c=280,d=124,h=2*Math.PI*d,m=h-h*i/100,p=i/100*2*Math.PI-Math.PI/2,f=140+d*Math.cos(p),s=140+d*Math.sin(p),g=t==="morphing",l=t==="red-loading";return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
          /* ── 1. Blue Logo: Hold (0.6s) -> Zoom/Blur (1.6s) -> Gentle Dissolve (0.8s) ── */
          @keyframes crx-blue-morph {
            0%, 12% {
              transform: translate(-50%, -50%) scale(1);
              filter: blur(0px);
              opacity: 1;
            }
            45% {
              transform: translate(-50%, -50%) scale(4.8);
              filter: blur(24px);
              opacity: 1;
            }
            64%, 100% {
              transform: translate(-50%, -50%) scale(4.8);
              filter: blur(28px);
              opacity: 0;
            }
          }

          /* Blue Aura: Expands and gently dissolves out */
          @keyframes crx-blue-aura-morph {
            0%, 12% {
              opacity: 0.55;
              transform: scale(1);
            }
            45% {
              opacity: 0.3;
              transform: scale(3);
            }
            64%, 100% {
              opacity: 0;
              transform: scale(3.5);
            }
          }

          /* ── 2. Red Logo: Delayed cross-fade in at 4.8x/24px blur, then Zoom-Out & Clarify to 1.0x/0px blur ── */
          @keyframes crx-red-morph {
            0%, 45% {
              transform: translate(-50%, -50%) scale(4.8);
              filter: blur(24px);
              opacity: 0;
            }
            66% {
              transform: translate(-50%, -50%) scale(4.8);
              filter: blur(24px);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(1);
              filter: blur(0px);
              opacity: 1;
            }
          }

          /* Red Aura: Cross-fades in during delayed window, then contracts to resting logo */
          @keyframes crx-red-aura-morph {
            0%, 45% {
              opacity: 0;
              transform: scale(3.5);
            }
            66% {
              opacity: 0.45;
              transform: scale(3.5);
            }
            100% {
              opacity: 0.65;
              transform: scale(1);
            }
          }

          /* Subtle breathing pulse once red logo is fully settled */
          @keyframes crx-red-settled-pulse {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.04); }
          }
        `}),e.jsxs("div",{style:{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"radial-gradient(ellipse at 50% 45%, #18060A 0%, #0C0508 55%, #050204 100%)",overflow:"hidden",zIndex:99999},children:[e.jsx(ce,{}),e.jsxs("div",{style:{position:"relative",zIndex:4,width:c,height:c,display:"flex",alignItems:"center",justifyContent:"center"},children:[g&&e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{position:"absolute",width:210,height:210,borderRadius:"50%",background:"rgba(59, 130, 246, 0.5)",filter:"blur(45px)",animation:"crx-blue-aura-morph 4.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",zIndex:1}}),e.jsx("img",{src:qe,alt:"Cerebrexia Blue Logo",width:210,height:210,decoding:"async",fetchPriority:"high",style:{position:"absolute",left:"50%",top:"50%",width:210,height:210,borderRadius:"50%",objectFit:"cover",transformOrigin:"center center",boxShadow:"0 0 35px rgba(59, 130, 246, 0.45)",animation:"crx-blue-morph 4.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",zIndex:2}})]}),e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{position:"absolute",width:210,height:210,borderRadius:"50%",background:"rgba(220, 38, 38, 0.45)",filter:"blur(35px)",animation:g?"crx-red-aura-morph 4.8s cubic-bezier(0.16, 1, 0.3, 1) forwards":"crx-red-settled-pulse 2.5s ease-in-out infinite",zIndex:1}}),e.jsx("img",{src:Ne,alt:"Cerebrexia Logo",width:210,height:210,decoding:"async",fetchPriority:"high",style:{position:"absolute",left:"50%",top:"50%",width:210,height:210,borderRadius:"50%",objectFit:"cover",transformOrigin:"center center",boxShadow:"0 0 32px rgba(220, 38, 38, 0.7), 0 0 65px rgba(185, 28, 28, 0.35)",animation:g?"crx-red-morph 4.8s cubic-bezier(0.16, 1, 0.3, 1) forwards":"translate(-50%, -50%) scale(1)",zIndex:3}})]}),l&&e.jsxs("svg",{width:c,height:c,viewBox:`0 0 ${c} ${c}`,style:{position:"absolute",inset:0,zIndex:5,pointerEvents:"none"},children:[e.jsxs("defs",{children:[e.jsxs("linearGradient",{id:"crxProgressGrad",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#EF4444"}),e.jsx("stop",{offset:"60%",stopColor:"#DC2626"}),e.jsx("stop",{offset:"100%",stopColor:"#B91C1C"})]}),e.jsxs("filter",{id:"crxNeonGlow",x:"-20%",y:"-20%",width:"140%",height:"140%",children:[e.jsx("feGaussianBlur",{stdDeviation:"2.5",result:"blur"}),e.jsx("feComposite",{in:"SourceGraphic",in2:"blur",operator:"over"})]})]}),e.jsx("circle",{cx:140,cy:140,r:d,fill:"none",stroke:"rgba(255, 255, 255, 0.08)",strokeWidth:"3.5"}),e.jsx("circle",{cx:140,cy:140,r:d,fill:"none",stroke:"url(#crxProgressGrad)",strokeWidth:"4",strokeLinecap:"round",strokeDasharray:h,strokeDashoffset:m,transform:"rotate(-90 140 140)",filter:"url(#crxNeonGlow)",style:{transition:"stroke-dashoffset 0.04s linear"}}),i>1&&i<100&&e.jsx("circle",{cx:f,cy:s,r:4.5,fill:"#FFFFFF",style:{filter:"drop-shadow(0 0 5px #DC2626) drop-shadow(0 0 8px #FFFFFF)"}})]})]}),e.jsx("div",{style:{position:"relative",zIndex:6,textAlign:"center",marginTop:26,minHeight:52},children:l?e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",fontSize:"clamp(20px, 3.5vw, 26px)",fontWeight:800,color:"#FFFFFF",letterSpacing:2,textShadow:"0 0 12px rgba(220, 38, 38, 0.75)"},children:[Math.round(i),"%"]}),e.jsx("div",{style:{fontSize:11,letterSpacing:"0.28em",textTransform:"uppercase",fontWeight:700,color:i>=100?"#4ADE80":"rgba(255, 255, 255, 0.45)",marginTop:5,transition:"color 0.3s ease"},children:i>=100?"INITIALIZATION COMPLETE":"THE CROWNED DIAGNOSIS"})]}):e.jsx("div",{style:{fontFamily:"var(--font-sans)",fontSize:11.5,letterSpacing:"0.3em",textTransform:"uppercase",fontWeight:600,color:"rgba(255, 255, 255, 0.4)",marginTop:10},children:"Initializing"})})]})]})}const de="https://dgkubrwfrwcfpkgjoxmu.supabase.co",Ye="sb_publishable_v_CcCDqlYXXvx1emJ9U7Cw_2KCpskhS",$=je(de,Ye,{auth:{persistSession:!0,autoRefreshToken:!0,detectSessionInUrl:!0,storageKey:"crx_session"},global:{headers:{"x-client-info":"cerebrexia-web"}}});function Xe(){if(typeof window>"u")return!1;const n=(window.location.hostname||"").toLowerCase();return n==="www.cerebrexiaigims.com"||n==="cerebrexiaigims.com"||n==="www.cerebrexia.in"||n==="cerebrexia.in"}function Ke(n){return n.toLowerCase().includes("dgkubrwfrwcfpkgjoxmu")}function Je(n,t){const r=typeof window<"u"?window.location.hostname:"non-browser",i=`Security Isolation Violation: Direct browser mutation (${t}) on table "${n}" targeting the production Supabase database is blocked on non-production origin (${r}). Please configure a separate staging Supabase project for Preview.`;console.error("[Supabase Isolation]",i);const a={data:null,error:{message:i,details:"Direct browser writes to production from Preview deployments are strictly disallowed.",hint:"Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to point to your staging Supabase project.",code:"SEC_PREVIEW_ISOLATION_BLOCKED"}},o={eq:()=>o,neq:()=>o,gt:()=>o,gte:()=>o,lt:()=>o,lte:()=>o,like:()=>o,ilike:()=>o,is:()=>o,in:()=>o,contains:()=>o,containedBy:()=>o,match:()=>o,not:()=>o,or:()=>o,filter:()=>o,select:()=>o,order:()=>o,limit:()=>o,range:()=>o,single:()=>Promise.resolve(a),maybeSingle:()=>Promise.resolve(a),then:(c,d)=>Promise.resolve(a).then(c,d),catch:c=>Promise.resolve(a).catch(c)};return o}const ue=Ke(de)&&typeof window<"u"&&!Xe();ue&&console.warn("[Supabase Isolation] Client-side mutation guard ACTIVE: Direct browser writes to production database blocked on domain:",typeof window<"u"?window.location.hostname:"unknown");const Ze=$.from.bind($);$.from=function(t){const r=Ze(t);return ue?new Proxy(r,{get(i,a,o){if(a==="insert"||a==="upsert"||a==="update"||a==="delete")return function(){return Je(t,a)};const c=Reflect.get(i,a,o);return typeof c=="function"?c.bind(i):c}}):r};const P=$;function I(n){const t=((n==null?void 0:n.message)||"").toLowerCase();return((n==null?void 0:n.status)??(n==null?void 0:n.code)??0)===429||t.includes("rate limit")||t.includes("too many")?{message:"Too many attempts. Please wait a moment and try again.",isRateLimit:!0}:t.includes("invalid login")||t.includes("invalid credentials")||t.includes("wrong")?{message:"Incorrect email or password.",isRateLimit:!1}:t.includes("email not confirmed")||t.includes("not confirmed")?{message:"Your email has not been verified yet. Please check your inbox and click the verification link before logging in.",isRateLimit:!1,isEmailNotConfirmed:!0}:t.includes("user already registered")||t.includes("already registered")?{message:"An account with this email already exists. Try signing in.",isRateLimit:!1}:t.includes("password should be")?{message:"Password must be at least 6 characters.",isRateLimit:!1}:t.includes("unable to validate")||t.includes("email address")?{message:"Please enter a valid email address.",isRateLimit:!1}:t.includes("network")||t.includes("fetch")?{message:"Network error. Check your connection and try again.",isRateLimit:!1}:{message:(n==null?void 0:n.message)||"Something went wrong. Please try again.",isRateLimit:!1}}async function oe(n,t=3){let r;for(let i=1;i<=t;i++)try{return await n()}catch(a){if(r=a,!(((a==null?void 0:a.status)??(a==null?void 0:a.code)??0)===429||((a==null?void 0:a.message)||"").toLowerCase().includes("rate limit"))||i===t)throw a;await new Promise(d=>setTimeout(d,1e3*Math.pow(2,i)))}throw r}const pe=u.createContext(null);function ae({children:n}){const[t,r]=u.useState(null),[i,a]=u.useState(!0);u.useEffect(()=>{P.auth.getSession().then(({data:{session:g}})=>{r((g==null?void 0:g.user)??null),a(!1)}).catch(g=>{console.error("[Auth] getSession error:",g),a(!1)});const{data:{subscription:s}}=P.auth.onAuthStateChange((g,l)=>{r((l==null?void 0:l.user)??null),g==="SIGNED_OUT"&&r(null)});return()=>s.unsubscribe()},[]);const o=u.useCallback(()=>typeof window<"u"?window.location.origin:"",[]),c=u.useCallback(async(s,g)=>{const l=o(),{data:x,error:b}=await oe(()=>P.auth.signUp({email:s.trim().toLowerCase(),password:g,options:{emailRedirectTo:l}}));if(b){const y=I(b),w=new Error(y.message);throw w.isRateLimit=y.isRateLimit,w.isEmailNotConfirmed=y.isEmailNotConfirmed,w}return x},[o]),d=u.useCallback(async s=>{const g=o(),{data:l,error:x}=await P.auth.resend({type:"signup",email:s.trim().toLowerCase(),options:{emailRedirectTo:g}});if(x){const b=I(x),y=new Error(b.message);throw y.isRateLimit=b.isRateLimit,y}return l},[o]),h=u.useCallback(async(s,g)=>{const{data:l,error:x}=await oe(()=>P.auth.signInWithPassword({email:s.trim().toLowerCase(),password:g}));if(x){const b=I(x),y=new Error(b.message);throw y.isRateLimit=b.isRateLimit,y.isEmailNotConfirmed=b.isEmailNotConfirmed,y}return l},[]),m=u.useCallback(async()=>{const s=o(),{data:g,error:l}=await P.auth.signInWithOAuth({provider:"google",options:{redirectTo:s,queryParams:{prompt:"select_account"}}});if(l)throw new Error(I(l).message);return g},[o]),p=u.useCallback(async()=>{const{error:s}=await P.auth.signOut();if(s)throw new Error(I(s).message)},[]),f={user:t,loading:i,signUpWithEmail:c,signInWithEmail:h,signInWithGoogle:m,resendVerificationEmail:d,signOut:p};return e.jsx(pe.Provider,{value:f,children:!i&&n})}const Y=()=>{const n=u.useContext(pe);if(!n)throw new Error("useAuth must be used inside <AuthProvider>");return n},Qe=e.jsx("svg",{viewBox:"0 0 24 24",width:"20",height:"20",xmlns:"http://www.w3.org/2000/svg",children:e.jsxs("g",{transform:"matrix(1,0,0,1,27.009001,-39.238998)",children:[e.jsx("path",{fill:"#4285F4",d:"M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"}),e.jsx("path",{fill:"#34A853",d:"M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"}),e.jsx("path",{fill:"#FBBC05",d:"M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"}),e.jsx("path",{fill:"#EA4335",d:"M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"})]})});function et({onSuccess:n,onOpenPolicy:t}){const{signInWithGoogle:r}=Y(),[i,a]=u.useState(!1),[o,c]=u.useState(null),d=async()=>{if(!i){c(null),a(!0);try{await r(),n&&n()}catch(h){c(h.message||"Google sign-in failed. Please try again."),a(!1)}}};return e.jsxs("div",{style:{background:"rgba(255,243,214,0.03)",border:"1px solid rgba(220,38,38,0.35)",borderRadius:16,padding:"clamp(24px, 5vw, 40px) clamp(16px, 4vw, 30px)",width:"92%",maxWidth:420,margin:"0 auto",boxShadow:"0 10px 40px rgba(0,0,0,0.6), 0 0 60px rgba(220,38,38,0.07)",backdropFilter:"blur(10px)",position:"relative",overflow:"hidden",boxSizing:"border-box",textAlign:"center"},children:[e.jsx("div",{style:{position:"absolute",top:-50,left:-50,width:160,height:160,background:"rgba(220,38,38,0.14)",filter:"blur(50px)",borderRadius:"50%",pointerEvents:"none"}}),e.jsx("div",{style:{position:"absolute",bottom:-40,right:-40,width:120,height:120,background:"rgba(220,38,38,0.07)",filter:"blur(40px)",borderRadius:"50%",pointerEvents:"none"}}),e.jsx("h2",{className:"crx-display",style:{fontSize:26,color:"var(--cream)",marginBottom:8,letterSpacing:1},children:"ACCESS TERMINAL"}),e.jsx("p",{style:{color:"var(--muted)",fontSize:13,lineHeight:1.5,marginBottom:28,letterSpacing:.3},children:"Sign in with your Google account to access Cerebrexia '26 and manage your passes."}),o&&e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:10,padding:"12px 14px",borderRadius:8,fontSize:13,marginBottom:20,background:"rgba(220,38,38,0.12)",border:"1px solid #DC2626",color:"#ff8f8f",textAlign:"left"},children:[e.jsx(be,{size:16,style:{flexShrink:0,marginTop:2}}),e.jsx("span",{children:o})]}),e.jsx("button",{type:"button",onClick:d,disabled:i,className:"crx-btn",style:{width:"100%",justifyContent:"center",background:"white",color:"#111",boxShadow:"0 4px 18px rgba(255,255,255,0.15)",marginBottom:20,gap:12,fontSize:14,fontWeight:700,padding:"14px 20px",borderRadius:10,cursor:i?"not-allowed":"pointer",opacity:i?.7:1,transition:"all 0.2s ease"},children:i?e.jsxs(e.Fragment,{children:[e.jsx(ye,{size:16,style:{animation:"spin 1s linear infinite"}}),"CONNECTING TO GOOGLE..."]}):e.jsxs(e.Fragment,{children:[Qe,"CONTINUE WITH GOOGLE"]})}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,padding:"10px 14px",color:"var(--muted)",fontSize:12,lineHeight:1.4,marginBottom:20},children:[e.jsx(we,{size:15,color:"#D4AF6A",style:{flexShrink:0}}),e.jsx("span",{children:"Instant, secure login. No passwords required."})]}),e.jsxs("div",{style:{marginTop:10,paddingTop:14,borderTop:"1px solid rgba(255, 255, 255, 0.08)",textAlign:"center"},children:[e.jsx("p",{style:{fontSize:10.5,color:"var(--muted)",margin:"0 0 8px",letterSpacing:.5},children:"Official Festival Compliance & Policies:"}),e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"6px 12px",fontSize:11},children:[e.jsx("button",{type:"button",onClick:()=>t?t("terms"):window.location.hash="terms",style:{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",padding:0,textDecoration:"underline"},children:"Terms & Conditions"}),e.jsx("span",{style:{color:"rgba(255,255,255,0.2)"},children:"•"}),e.jsx("button",{type:"button",onClick:()=>t?t("privacy"):window.location.hash="privacy",style:{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",padding:0,textDecoration:"underline"},children:"Privacy Policy"}),e.jsx("span",{style:{color:"rgba(255,255,255,0.2)"},children:"•"}),e.jsx("button",{type:"button",onClick:()=>t?t("refunds"):window.location.hash="refunds",style:{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",padding:0,textDecoration:"underline"},children:"Refund Policy"}),e.jsx("span",{style:{color:"rgba(255,255,255,0.2)"},children:"•"}),e.jsx("button",{type:"button",onClick:()=>t?t("pricing"):window.location.hash="pricing",style:{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",padding:0,textDecoration:"underline"},children:"Pricing & Delivery"})]})]})]})}function tt({onComplete:n,onWipeStart:t,onOpenPolicy:r}){const[i,a]=u.useState("loading"),[o,c]=u.useState(0),d=u.useRef(null),h=u.useRef(null),{user:m}=Y(),p=u.useCallback(()=>{a("wiping"),t&&t()},[t]),f=u.useCallback(()=>{m?p():a("auth")},[m,p]);u.useEffect(()=>{i==="auth"&&m&&p()},[m,i,p]),u.useEffect(()=>{if(i!=="wiping")return;h.current=performance.now();const l=1600,x=b=>{const y=b-h.current,w=Math.min(1,y/l),j=1-Math.pow(1-w,3);c(j),w<1?d.current=requestAnimationFrame(x):setTimeout(()=>{n&&n()},100)};return d.current=requestAnimationFrame(x),()=>{d.current&&cancelAnimationFrame(d.current)}},[i,n]);const s=50-o*50,g=50-o*50;return e.jsxs("div",{style:{position:"fixed",inset:0,zIndex:9999,pointerEvents:i==="auth"?"auto":"none"},children:[i==="loading"&&e.jsx(Ve,{onDone:f}),i==="auth"&&e.jsx("div",{style:{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#020101",padding:"20px 16px",overflowY:"auto"},children:e.jsx("div",{style:{width:"100%",maxWidth:420},children:e.jsx(et,{onSuccess:p,onOpenPolicy:r})})}),i==="wiping"&&e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{position:"absolute",left:0,right:0,top:0,height:`${g}%`,background:"#020101"}}),e.jsx("div",{style:{position:"absolute",left:0,right:0,bottom:0,height:`${g}%`,background:"#020101"}}),e.jsx("div",{style:{position:"absolute",left:0,top:`${g}%`,bottom:`${g}%`,width:`${s}%`,background:"#020101"}}),e.jsx("div",{style:{position:"absolute",right:0,top:`${g}%`,bottom:`${g}%`,width:`${s}%`,background:"#020101"}}),e.jsx("div",{style:{position:"absolute",left:`${s}%`,top:`${g}%`,right:`${s}%`,bottom:`${g}%`,border:`2px solid rgba(192, 57, 43, ${.8-o*.6})`,boxShadow:`0 0 ${20+o*30}px rgba(192, 57, 43, ${.4-o*.3}), inset 0 0 ${10+o*20}px rgba(192, 24, 90, ${.2-o*.15})`}})]})]})}const ie=["Home","Events","Pronites","Accommodation"],_=["About","Contact","Policies"];function ge(n){const[t,r]=u.useState(()=>typeof window<"u"&&window.innerWidth<n);return u.useEffect(()=>{const i=()=>r(window.innerWidth<n);return window.addEventListener("resize",i),()=>window.removeEventListener("resize",i)},[n]),t}function rt({page:n,setPage:t}){const[r,i]=u.useState(!1),[a,o]=u.useState(!1),[c,d]=u.useState(!1),h=u.useRef(null),m=ge(768),{user:p}=Y(),f=s=>{t(s.toLowerCase()),i(!1),o(!1)};return u.useEffect(()=>{const s=()=>d(window.scrollY>20);return window.addEventListener("scroll",s,{passive:!0}),s(),()=>window.removeEventListener("scroll",s)},[]),u.useEffect(()=>{if(!a)return;const s=g=>{h.current&&!h.current.contains(g.target)&&o(!1)};return document.addEventListener("mousedown",s),()=>document.removeEventListener("mousedown",s)},[a]),e.jsxs("header",{className:`crx-nav-header ${c?"scrolled":""}`,children:[e.jsxs("div",{style:{maxWidth:1360,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e.jsx("button",{onClick:()=>f("Home"),style:{background:"none",border:"none",cursor:"pointer",padding:0,position:"relative"},children:e.jsx("div",{className:"crx-logo-badge",style:{width:54,height:54,background:"#0C0508",border:"2px solid rgba(212, 175, 106, 0.65)",borderRadius:14,boxShadow:"0 4px 16px rgba(0, 0, 0, 0.6)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",padding:2,transition:"transform 180ms ease"},onMouseEnter:s=>{s.currentTarget.style.transform="scale(1.04)"},onMouseLeave:s=>{s.currentTarget.style.transform="scale(1)"},children:e.jsx("img",{src:He,alt:"Cerebrexia",width:50,height:50,decoding:"async",style:{width:"100%",height:"100%",borderRadius:10,objectFit:"cover"}})})}),e.jsxs("nav",{style:{display:m?"none":"flex",alignItems:"center",gap:4,background:c?"rgba(18, 9, 14, 0.88)":"rgba(20, 10, 14, 0.72)",border:c?"1px solid rgba(212, 175, 106, 0.55)":"1px solid rgba(255, 255, 255, 0.08)",borderRadius:40,padding:"6px 14px",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",boxShadow:c?"0 0 0 1px rgba(255, 255, 255, 0.14), 0 0 22px rgba(212, 175, 106, 0.28), 0 12px 36px rgba(0, 0, 0, 0.8)":"0 8px 30px rgba(0, 0, 0, 0.45)",transition:"border 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.3s cubic-bezier(0.22, 1, 0.36, 1)"},children:[ie.map(s=>{const g=n===s.toLowerCase();return e.jsx("button",{onClick:()=>f(s),style:{background:g?"rgba(255, 255, 255, 0.12)":"transparent",border:g?"1px solid rgba(255, 255, 255, 0.16)":"1px solid transparent",color:g?"#FFFFFF":"rgba(255, 255, 255, 0.72)",borderRadius:24,padding:"7px 18px",fontSize:13.5,fontWeight:700,letterSpacing:"0.04em",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Space Grotesk', sans-serif",transition:"color 160ms ease, background-color 160ms ease, border-color 160ms ease"},onMouseEnter:l=>{g||(l.currentTarget.style.color="#FFFFFF")},onMouseLeave:l=>{g||(l.currentTarget.style.color="rgba(255, 255, 255, 0.72)")},children:s},s)}),e.jsxs("div",{ref:h,style:{position:"relative"},children:[e.jsxs("button",{onClick:()=>o(!a),style:{display:"inline-flex",alignItems:"center",gap:5,background:_.some(s=>n===s.toLowerCase())?"rgba(255, 255, 255, 0.12)":"transparent",border:_.some(s=>n===s.toLowerCase())?"1px solid rgba(255, 255, 255, 0.16)":"1px solid transparent",color:_.some(s=>n===s.toLowerCase())?"#FFFFFF":"rgba(255, 255, 255, 0.72)",borderRadius:24,padding:"7px 16px",fontSize:13.5,fontWeight:700,letterSpacing:"0.04em",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Space Grotesk', sans-serif",transition:"color 160ms ease"},children:["More ",e.jsx(ve,{size:14,style:{transform:a?"rotate(180deg)":"none",transition:"transform 160ms ease"}})]}),a&&e.jsx("div",{style:{position:"absolute",top:"calc(100% + 12px)",left:"50%",transform:"translateX(-50%)",background:"rgba(16, 9, 14, 0.98)",border:"1px solid rgba(255, 255, 255, 0.14)",borderRadius:16,padding:8,minWidth:160,backdropFilter:"blur(20px)",boxShadow:"0 12px 36px rgba(0, 0, 0, 0.7)",display:"flex",flexDirection:"column",gap:3},children:_.map(s=>e.jsx("button",{onClick:()=>f(s),style:{background:"transparent",color:n===s.toLowerCase()?"#FFFFFF":"rgba(255, 255, 255, 0.75)",border:"none",borderRadius:10,padding:"9px 14px",fontSize:13,fontWeight:600,letterSpacing:"0.03em",textTransform:"uppercase",textAlign:"left",cursor:"pointer",fontFamily:"'Space Grotesk', sans-serif"},children:s},s))})]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12},children:[e.jsx("button",{onClick:()=>f("Dashboard"),style:{background:"linear-gradient(135deg, #C0392B 0%, #D4500A 100%)",color:"#FFFFFF",border:"none",borderRadius:12,boxShadow:"0 4px 20px rgba(192, 57, 43, 0.45)",padding:"11px 24px",fontWeight:800,fontSize:13.5,letterSpacing:"0.04em",textTransform:"uppercase",cursor:"pointer",display:m?"none":"inline-flex",alignItems:"center",fontFamily:"'Space Grotesk', sans-serif",transition:"transform 180ms ease, box-shadow 180ms ease, filter 180ms ease"},onMouseEnter:s=>{s.currentTarget.style.transform="translateY(-2px)",s.currentTarget.style.filter="brightness(1.1)"},onMouseLeave:s=>{s.currentTarget.style.transform="translateY(0)",s.currentTarget.style.filter="brightness(1)"},children:p?"Dashboard":"Sign In"}),e.jsx("button",{onClick:()=>i(!r),"aria-label":"Menu",className:"crx-hamburger-btn",style:{background:"linear-gradient(135deg, #C0392B 0%, #D4500A 100%)",border:"none",borderRadius:12,width:44,height:44,cursor:"pointer",display:m?"flex":"none",alignItems:"center",justifyContent:"center"},children:r?e.jsx(ke,{size:18,color:"var(--crx-text-primary)"}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:4},children:[e.jsx("span",{style:{width:16,height:1.5,background:"var(--crx-text-primary)"}}),e.jsx("span",{style:{width:16,height:1.5,background:"var(--crx-text-primary)"}}),e.jsx("span",{style:{width:16,height:1.5,background:"var(--crx-text-primary)"}})]})})]})]}),r&&e.jsxs("div",{style:{marginTop:12,background:"var(--crx-card)",border:"1px solid var(--crx-hairline-accent)",borderRadius:14,padding:14,display:"flex",flexDirection:"column",gap:4,backdropFilter:"blur(20px)",boxShadow:"0 12px 32px rgba(0,0,0,0.7)"},children:[[...ie,..._].map(s=>e.jsx("button",{onClick:()=>f(s),style:{background:"transparent",color:n===s.toLowerCase()?"var(--crx-text-primary)":"var(--crx-text-secondary)",border:"none",borderRadius:8,padding:"10px 14px",textAlign:"left",fontWeight:500,fontSize:13,letterSpacing:"0.03em",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Space Grotesk', sans-serif"},children:s},s)),e.jsx("button",{onClick:()=>f("Dashboard"),style:{background:"var(--crx-accent)",color:"#FFFFFF",border:"none",borderRadius:8,padding:"10px",fontWeight:600,fontSize:12.5,textTransform:"uppercase",cursor:"pointer",marginTop:6,fontFamily:"'Space Grotesk', sans-serif"},children:p?"Dashboard":"Sign In"})]})]})}function nt({size:n=24,color:t="currentColor",className:r="",style:i={}}){return e.jsxs("svg",{width:n,height:n,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:r,style:i,children:[e.jsx("rect",{width:"20",height:"20",x:"2",y:"2",rx:"5",ry:"5"}),e.jsx("path",{d:"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"}),e.jsx("line",{x1:"17.5",x2:"17.51",y1:"6.5",y2:"6.5"})]})}function se({size:n=24,color:t="currentColor",className:r="",style:i={}}){return e.jsx("svg",{width:n,height:n,viewBox:"0 0 24 24",fill:t==="currentColor"?"currentColor":t,className:r,style:i,children:e.jsx("path",{d:"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"})})}function B({children:n,tone:t="gold",rotate:r=-2,style:i={}}){return e.jsx("span",{className:`crx-sticker ${t}`,style:{transform:`rotate(${r}deg)`,...i},children:n})}function ot({setPage:n}){const t=ge(760);return e.jsxs("footer",{style:{borderTop:"1px solid rgba(179, 18, 58, 0.25)",background:"linear-gradient(180deg, transparent 0%, rgba(10, 5, 5, 0.9) 100%)",padding:"60px 24px 40px",position:"relative",zIndex:2,width:"100%",maxWidth:"100vw",overflow:"hidden",contain:"paint"},children:[e.jsxs("div",{style:{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:t?"1fr":"1.3fr 1fr 1.2fr 1fr",gap:30},children:[e.jsxs("div",{children:[e.jsx(B,{tone:"cyan",rotate:-2,style:{marginBottom:14},children:"Cerebrexia '26"}),e.jsx("p",{style:{fontSize:13.5,color:"var(--paper)",lineHeight:1.7,maxWidth:320,margin:"0 0 16px"},children:"The annual medical-college fest of IGIMS. Compete, perform, belong."}),e.jsxs("p",{style:{fontSize:11.5,color:"var(--muted)",margin:0,lineHeight:1.6},children:["Indira Gandhi Institute of Medical Sciences",e.jsx("br",{}),"Sheikhpura, Patna – 800014, Bihar"]})]}),e.jsxs("div",{children:[e.jsx(B,{tone:"gold",rotate:2,style:{marginBottom:14},children:"Explore"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:8},children:["Home","Events","Pronites","Accommodation","Contact"].map(r=>e.jsx("button",{onClick:()=>n(r.toLowerCase()),style:{background:"none",border:"none",color:"var(--muted)",textAlign:"left",cursor:"pointer",fontSize:13.5,padding:0,transition:"color 0.2s"},onMouseEnter:i=>i.currentTarget.style.color="var(--cyan)",onMouseLeave:i=>i.currentTarget.style.color="var(--muted)",children:r},r))})]}),e.jsxs("div",{children:[e.jsx(B,{tone:"gold",rotate:-1,style:{marginBottom:14},children:"Compliance"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:8},children:[{id:"terms",label:"Terms & Conditions"},{id:"privacy",label:"Privacy Policy"},{id:"refunds",label:"Refund & Cancellation"},{id:"pricing",label:"Pricing & Delivery"}].map(r=>e.jsx("button",{onClick:()=>n(r.id),style:{background:"none",border:"none",color:"var(--muted)",textAlign:"left",cursor:"pointer",fontSize:13.5,padding:0,transition:"color 0.2s"},onMouseEnter:i=>i.currentTarget.style.color="var(--gold)",onMouseLeave:i=>i.currentTarget.style.color="var(--muted)",children:r.label},r.id))})]}),e.jsxs("div",{children:[e.jsx(B,{tone:"cyan",rotate:-2,style:{marginBottom:14},children:"Connect"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:12},children:[e.jsxs("a",{href:"https://www.instagram.com/igimsfest?srtk=MWR5NzJobTV6MDB5aw==",target:"_blank",rel:"noopener noreferrer",style:{display:"inline-flex",alignItems:"center",gap:10,color:"var(--paper)",textDecoration:"none",fontSize:13,transition:"all 0.2s ease"},onMouseEnter:r=>{r.currentTarget.style.color="#E1306C",r.currentTarget.style.transform="translateX(3px)"},onMouseLeave:r=>{r.currentTarget.style.color="var(--paper)",r.currentTarget.style.transform="translateX(0)"},children:[e.jsx("div",{style:{width:32,height:32,borderRadius:8,background:"rgba(225, 48, 108, 0.12)",border:"1px solid rgba(225, 48, 108, 0.28)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#E1306C"},children:e.jsx(nt,{size:16})}),e.jsxs("div",{children:[e.jsx("span",{style:{display:"block",fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:.8,fontWeight:700},children:"Instagram"}),e.jsx("span",{children:"@igimsfest"})]})]}),e.jsxs("a",{href:"https://wa.me/918271791542",target:"_blank",rel:"noopener noreferrer",style:{display:"inline-flex",alignItems:"center",gap:10,color:"var(--paper)",textDecoration:"none",fontSize:13,transition:"all 0.2s ease"},onMouseEnter:r=>{r.currentTarget.style.color="#25D366",r.currentTarget.style.transform="translateX(3px)"},onMouseLeave:r=>{r.currentTarget.style.color="var(--paper)",r.currentTarget.style.transform="translateX(0)"},children:[e.jsx("div",{style:{width:32,height:32,borderRadius:8,background:"rgba(37, 211, 102, 0.12)",border:"1px solid rgba(37, 211, 102, 0.28)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#25D366"},children:e.jsx(se,{size:16,color:"#25D366"})}),e.jsxs("div",{children:[e.jsx("span",{style:{display:"block",fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:.8,fontWeight:700},children:"WhatsApp · Divyansh"}),e.jsx("span",{children:"+91 82717 91542"})]})]}),e.jsxs("a",{href:"https://wa.me/919128187476",target:"_blank",rel:"noopener noreferrer",style:{display:"inline-flex",alignItems:"center",gap:10,color:"var(--paper)",textDecoration:"none",fontSize:13,transition:"all 0.2s ease"},onMouseEnter:r=>{r.currentTarget.style.color="#25D366",r.currentTarget.style.transform="translateX(3px)"},onMouseLeave:r=>{r.currentTarget.style.color="var(--paper)",r.currentTarget.style.transform="translateX(0)"},children:[e.jsx("div",{style:{width:32,height:32,borderRadius:8,background:"rgba(37, 211, 102, 0.12)",border:"1px solid rgba(37, 211, 102, 0.28)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#25D366"},children:e.jsx(se,{size:16,color:"#25D366"})}),e.jsxs("div",{children:[e.jsx("span",{style:{display:"block",fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:.8,fontWeight:700},children:"WhatsApp · Veer"}),e.jsx("span",{children:"+91 91281 87476"})]})]})]})]})]}),e.jsxs("div",{style:{maxWidth:1100,margin:"40px auto 0",paddingTop:20,borderTop:"1px solid rgba(255, 255, 255, 0.06)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,fontSize:11.5,color:"var(--muted)"},children:[e.jsx("p",{style:{margin:0},children:"© 2026 Cerebrexia · IGIMS Patna · The Crowned Diagnosis"}),e.jsxs("div",{style:{display:"flex",gap:14},children:[e.jsx("button",{onClick:()=>n("terms"),style:{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:11.5,padding:0},children:"Terms"}),e.jsx("span",{children:"·"}),e.jsx("button",{onClick:()=>n("privacy"),style:{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:11.5,padding:0},children:"Privacy"}),e.jsx("span",{children:"·"}),e.jsx("button",{onClick:()=>n("refunds"),style:{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:11.5,padding:0},children:"Refunds"}),e.jsx("span",{children:"·"}),e.jsx("button",{onClick:()=>n("pricing"),style:{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:11.5,padding:0},children:"Pricing"})]})]})]})}const at=u.lazy(()=>E(()=>import("./HomePage-7p7mC5pn.js"),__vite__mapDeps([0,1,2,3,4,5,6]))),it=u.lazy(()=>E(()=>import("./EventsPage-xz33R6yC.js"),__vite__mapDeps([7,1,4,5,2,3,8,6]))),st=u.lazy(()=>E(()=>import("./PronitesPage-s_fDDqVF.js"),__vite__mapDeps([9,1,2,5,6]))),lt=u.lazy(()=>E(()=>import("./AccommodationPage-14saqagm.js"),__vite__mapDeps([10,1,2,8,11,5,6]))),ct=u.lazy(()=>E(()=>import("./ContactPage-BHmzy41u.js"),__vite__mapDeps([12,1,2,5,6]))),dt=u.lazy(()=>E(()=>import("./AboutPage-Aq9oJc3s.js"),__vite__mapDeps([13,1,2,5,6]))),ut=u.lazy(()=>E(()=>import("./DashboardPage-BK7WO9zR.js"),__vite__mapDeps([14,1,8,11,15,16,17,5,6]))),pt=u.lazy(()=>E(()=>import("./PolicyPage-BA3WEigX.js"),__vite__mapDeps([18,1,2,5,6]))),gt=u.lazy(()=>E(()=>import("./AdminPage-Bb0Gzk--.js"),__vite__mapDeps([19,1,15,5,6]))),mt=u.lazy(()=>E(()=>import("./BookingPortalPage-BVRAhdYu.js"),__vite__mapDeps([20,1,17,11,15,16,5,6]))),ft=u.lazy(()=>E(()=>import("./TitleSponsorModal-Br6cd6SS.js"),__vite__mapDeps([21,1,5,6]))),ht=u.lazy(()=>E(()=>import("./webNoScannerStub-C6d-v1ok.js"),[])),me=["terms","privacy","refunds","pricing","policies"],H=[...me,"home","events","pronites","accommodation","about","contact","dashboard","admin","booking-portal","booking"];function xt(){const n=typeof window<"u"&&W.isNativePlatform(),t=()=>{if(typeof window<"u"){const b=new URLSearchParams(window.location.search).get("page");if(b&&H.includes(b.toLowerCase()))return b.toLowerCase();if(window.location.hash){const y=window.location.hash.replace("#","").toLowerCase();if(H.includes(y))return y}}return"home"},[r,i]=u.useState(t),[a,o]=u.useState(!1),[c,d]=u.useState(!1),[h,m]=u.useState(!1),p=u.useCallback(x=>{i(x),typeof window<"u"&&window.history.replaceState(null,"","#"+x)},[]);u.useEffect(()=>{const x=()=>{const b=window.location.hash.replace("#","").toLowerCase();H.includes(b)&&i(b)};return window.addEventListener("hashchange",x),()=>window.removeEventListener("hashchange",x)},[]),u.useEffect(()=>{window.scrollTo(0,0)},[r]);const f=u.useCallback(()=>{o(!0),m(!0)},[]),s=u.useCallback(()=>{d(!0)},[]);if(n)return e.jsx(ae,{children:e.jsxs("div",{className:"crx-root",children:[e.jsx(ne,{}),e.jsx(u.Suspense,{fallback:e.jsx("div",{style:{minHeight:"100vh",background:"#070204"}}),children:e.jsx(ht,{})})]})});const g=me.includes(r),l=g||r==="admin"||r==="booking-portal"||r==="booking";return e.jsx(ae,{children:e.jsxs("div",{className:"crx-root",children:[e.jsx(ne,{}),!a&&!l&&e.jsx(tt,{onComplete:f,onWipeStart:s,onOpenPolicy:p}),h&&!l&&e.jsx(u.Suspense,{fallback:null,children:e.jsx(ft,{onClose:()=>m(!1)})}),(c||a||l)&&e.jsx(ce,{}),e.jsx("div",{className:"crx-dots"}),e.jsx("div",{className:"crx-vignette"}),e.jsxs("div",{style:{position:"relative",zIndex:1,width:"100%",maxWidth:"100vw",overflowX:"hidden"},children:[e.jsx(rt,{page:r,setPage:p}),e.jsxs(u.Suspense,{fallback:e.jsx("div",{style:{minHeight:"70vh"}}),children:[r==="home"&&e.jsx(at,{setPage:p,revealHeroTitle:c,canLoadMedia:a}),r==="events"&&e.jsx(it,{setPage:p}),r==="pronites"&&e.jsx(st,{}),r==="accommodation"&&e.jsx(lt,{}),r==="about"&&e.jsx(dt,{}),r==="contact"&&e.jsx(ct,{}),r==="dashboard"&&e.jsx(ut,{setPage:p}),r==="admin"&&e.jsx(gt,{setPage:p}),(r==="booking-portal"||r==="booking")&&e.jsx(mt,{setPage:p}),g&&e.jsx(pt,{initialTab:r==="policies"?"terms":r,setPage:p})]}),e.jsx(ot,{setPage:p})]})]})})}"scrollRestoration"in window.history&&(window.history.scrollRestoration="manual");window.scrollTo(0,0);class bt extends le.Component{constructor(t){super(t),this.state={hasError:!1,error:null}}static getDerivedStateFromError(t){return{hasError:!0,error:t}}componentDidCatch(t,r){console.error("[App Crash caught by ErrorBoundary]:",t,r)}render(){return this.state.hasError?e.jsxs("div",{style:{minHeight:"100vh",background:"#0B0409",color:"#FBF7F0",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center",fontFamily:"system-ui, sans-serif"},children:[e.jsx("h1",{style:{color:"#E63950",fontSize:28,marginBottom:12},children:"Cerebrexia '26"}),e.jsx("p",{style:{color:"#D4AF37",fontSize:16,marginBottom:20},children:"Something went wrong loading this view."}),e.jsx("button",{onClick:()=>{window.location.href="/"},style:{background:"#D4AF37",color:"#0B0409",border:"none",borderRadius:8,padding:"10px 24px",fontWeight:700,cursor:"pointer"},children:"Reload Website"})]}):this.props.children}}Pe.createRoot(document.getElementById("root")).render(e.jsx(le.StrictMode,{children:e.jsx(bt,{children:e.jsx(xt,{})})}));export{et as A,Ne as L,B as S,se as W,E as _,Y as a,e as j,P as s,ge as u};
