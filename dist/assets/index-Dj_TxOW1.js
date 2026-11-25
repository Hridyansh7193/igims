const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/HomePage-C_A9Wcxv.js","assets/vendor-icons-ApcgS4FA.js","assets/Reveal-C3KcBlMl.js","assets/eventsData-D9OfRqbs.js","assets/index-Dc8q-KFv.js","assets/vendor-react-Bl7zSkmt.js","assets/vendor-supabase-D_iOwayF.js","assets/EventsPage-CDZRxc1S.js","assets/eventsService-aq8jUTy5.js","assets/PronitesPage-BbZd85n4.js","assets/AccommodationPage-BFDS5O8L.js","assets/razorpay-B2wTn5Wq.js","assets/ContactPage-Bf30eKDC.js","assets/AboutPage-CdqkmR0Y.js","assets/DashboardPage-MxJUzKeT.js","assets/promoService-CFlaF8mG.js","assets/promoCodes-CgzfsiK8.js","assets/browser-rkJRqvIq.js","assets/PolicyPage-gn3uAQ2l.js","assets/AdminPage-DYKUyBs0.js","assets/BookingPortalPage-B_gJsAPd.js","assets/TitleSponsorModal-ktM2AzHH.js"])))=>i.map(i=>d[i]);
import{r as ge,g as me,a as d,C as xe,R as he,S as fe,b as be,X as ye,c as ie}from"./vendor-icons-ApcgS4FA.js";import{r as we}from"./vendor-react-Bl7zSkmt.js";import{c as ve}from"./vendor-supabase-D_iOwayF.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const u of i.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&s(u)}).observe(document,{childList:!0,subtree:!0});function r(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(o){if(o.ep)return;o.ep=!0;const i=r(o);fetch(o.href,i)}})();var G={exports:{}},T={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Y;function ke(){if(Y)return T;Y=1;var n=ge(),t=Symbol.for("react.element"),r=Symbol.for("react.fragment"),s=Object.prototype.hasOwnProperty,o=n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,i={key:!0,ref:!0,__self:!0,__source:!0};function u(c,h,m){var p,x={},a=null,g=null;m!==void 0&&(a=""+m),h.key!==void 0&&(a=""+h.key),h.ref!==void 0&&(g=h.ref);for(p in h)s.call(h,p)&&!i.hasOwnProperty(p)&&(x[p]=h[p]);if(c&&c.defaultProps)for(p in h=c.defaultProps,h)x[p]===void 0&&(x[p]=h[p]);return{$$typeof:t,type:c,key:a,ref:g,props:x,_owner:o.current}}return T.Fragment=r,T.jsx=u,T.jsxs=u,T}var X;function Ce(){return X||(X=1,G.exports=ke()),G.exports}var e=Ce(),M={},K;function je(){if(K)return M;K=1;var n=we();return M.createRoot=n.createRoot,M.hydrateRoot=n.hydrateRoot,M}var Ee=je();const Se=me(Ee),Le="modulepreload",Ae=function(n){return"/"+n},J={},E=function(t,r,s){let o=Promise.resolve();if(r&&r.length>0){let u=function(m){return Promise.all(m.map(p=>Promise.resolve(p).then(x=>({status:"fulfilled",value:x}),x=>({status:"rejected",reason:x}))))};document.getElementsByTagName("link");const c=document.querySelector("meta[property=csp-nonce]"),h=(c==null?void 0:c.nonce)||(c==null?void 0:c.getAttribute("nonce"));o=u(r.map(m=>{if(m=Ae(m),m in J)return;J[m]=!0;const p=m.endsWith(".css"),x=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${m}"]${x}`))return;const a=document.createElement("link");if(a.rel=p?"stylesheet":Le,p||(a.as="script"),a.crossOrigin="",a.href=m,h&&a.setAttribute("nonce",h),document.head.appendChild(a),p)return new Promise((g,l)=>{a.addEventListener("load",g),a.addEventListener("error",()=>l(new Error(`Unable to preload CSS for ${m}`)))})}))}function i(u){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=u,window.dispatchEvent(c),!c.defaultPrevented)throw u}return o.then(u=>{for(const c of u||[])c.status==="rejected"&&i(c.reason);return t().catch(i)})};/*! Capacitor: https://capacitorjs.com/ - MIT License */var P;(function(n){n.Unimplemented="UNIMPLEMENTED",n.Unavailable="UNAVAILABLE"})(P||(P={}));class U extends Error{constructor(t,r,s){super(t),this.message=t,this.code=r,this.data=s}}const Re=n=>{var t,r;return n!=null&&n.androidBridge?"android":!((r=(t=n==null?void 0:n.webkit)===null||t===void 0?void 0:t.messageHandlers)===null||r===void 0)&&r.bridge?"ios":"web"},Pe=n=>{const t=n.CapacitorCustomPlatform||null,r=n.Capacitor||{},s=r.Plugins=r.Plugins||{},o=()=>t!==null?t.name:Re(n),i=()=>o()!=="web",u=x=>{const a=m.get(x);return!!(a!=null&&a.platforms.has(o())||c(x))},c=x=>{var a;return(a=r.PluginHeaders)===null||a===void 0?void 0:a.find(g=>g.name===x)},h=x=>n.console.error(x),m=new Map,p=(x,a={})=>{const g=m.get(x);if(g)return console.warn(`Capacitor plugin "${x}" already registered. Cannot register plugins twice.`),g.proxy;const l=o(),f=c(x);let b;const y=async()=>(!b&&l in a?b=typeof a[l]=="function"?b=await a[l]():b=a[l]:t!==null&&!b&&"web"in a&&(b=typeof a.web=="function"?b=await a.web():b=a.web),b),w=(v,k)=>{var S,L;if(f){const A=f==null?void 0:f.methods.find(C=>k===C.name);if(A)return A.rtype==="promise"?C=>r.nativePromise(x,k.toString(),C):(C,D)=>r.nativeCallback(x,k.toString(),C,D);if(v)return(S=v[k])===null||S===void 0?void 0:S.bind(v)}else{if(v)return(L=v[k])===null||L===void 0?void 0:L.bind(v);throw new U(`"${x}" plugin is not implemented on ${l}`,P.Unimplemented)}},j=v=>{let k;const S=(...L)=>{const A=y().then(C=>{const D=w(C,v);if(D){const O=D(...L);return k=O==null?void 0:O.remove,O}else throw new U(`"${x}.${v}()" is not implemented on ${l}`,P.Unimplemented)});return v==="addListener"&&(A.remove=async()=>k()),A};return S.toString=()=>`${v.toString()}() { [capacitor code] }`,Object.defineProperty(S,"name",{value:v,writable:!1,configurable:!1}),S},z=j("addListener"),F=j("removeListener"),pe=(v,k)=>{const S=z({eventName:v},k).then(C=>C),L=async()=>{const C=await S;await F({eventName:v,callbackId:C})},A=new Promise(C=>S.then(()=>C({remove:L})));return A.remove=async()=>{console.warn("Using addListener() without 'await' is deprecated."),await L()},A},$=new Proxy({},{get(v,k){switch(k){case"$$typeof":return;case"toJSON":return()=>({});case"addListener":return f?pe:z;case"removeListener":return F;default:return j(k)}}});return s[x]=$,m.set(x,{name:x,proxy:$,platforms:new Set([...Object.keys(a),...f?[l]:[]])}),$};return r.convertFileSrc||(r.convertFileSrc=x=>x),r.getPlatform=o,r.handleError=h,r.isNativePlatform=i,r.isPluginAvailable=u,r.registerPlugin=p,r.Exception=U,r.DEBUG=!!r.DEBUG,r.isLoggingEnabled=!!r.isLoggingEnabled,r},Fe=n=>n.Capacitor=Pe(n),W=Fe(typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{}),H=W.registerPlugin;class q{constructor(){this.listeners={},this.retainedEventArguments={},this.windowListeners={}}addListener(t,r){let s=!1;this.listeners[t]||(this.listeners[t]=[],s=!0),this.listeners[t].push(r);const i=this.windowListeners[t];i&&!i.registered&&this.addWindowListener(i),s&&this.sendRetainedArgumentsForEvent(t);const u=async()=>this.removeListener(t,r);return Promise.resolve({remove:u})}async removeAllListeners(){this.listeners={};for(const t in this.windowListeners)this.removeWindowListener(this.windowListeners[t]);this.windowListeners={}}notifyListeners(t,r,s){const o=this.listeners[t];if(!o){if(s){let i=this.retainedEventArguments[t];i||(i=[]),i.push(r),this.retainedEventArguments[t]=i}return}o.forEach(i=>i(r))}hasListeners(t){var r;return!!(!((r=this.listeners[t])===null||r===void 0)&&r.length)}registerWindowListener(t,r){this.windowListeners[r]={registered:!1,windowEventName:t,pluginEventName:r,handler:s=>{this.notifyListeners(r,s)}}}unimplemented(t="not implemented"){return new W.Exception(t,P.Unimplemented)}unavailable(t="not available"){return new W.Exception(t,P.Unavailable)}async removeListener(t,r){const s=this.listeners[t];if(!s)return;const o=s.indexOf(r);o!==-1&&this.listeners[t].splice(o,1),this.listeners[t].length||this.removeWindowListener(this.windowListeners[t])}addWindowListener(t){window.addEventListener(t.windowEventName,t.handler),t.registered=!0}removeWindowListener(t){t&&(window.removeEventListener(t.windowEventName,t.handler),t.registered=!1)}sendRetainedArgumentsForEvent(t){const r=this.retainedEventArguments[t];r&&(delete this.retainedEventArguments[t],r.forEach(s=>{this.notifyListeners(t,s)}))}}const Z=n=>encodeURIComponent(n).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape),Q=n=>n.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent);class Te extends q{async getCookies(){const t=document.cookie,r={};return t.split(";").forEach(s=>{if(s.length<=0)return;let[o,i]=s.replace(/=/,"CAP_COOKIE").split("CAP_COOKIE");o=Q(o).trim(),i=Q(i).trim(),r[o]=i}),r}async setCookie(t){try{const r=Z(t.key),s=Z(t.value),o=t.expires?`; expires=${t.expires.replace("expires=","")}`:"",i=(t.path||"/").replace("path=",""),u=t.url!=null&&t.url.length>0?`domain=${t.url}`:"";document.cookie=`${r}=${s||""}${o}; path=${i}; ${u};`}catch(r){return Promise.reject(r)}}async deleteCookie(t){try{document.cookie=`${t.key}=; Max-Age=0`}catch(r){return Promise.reject(r)}}async clearCookies(){try{const t=document.cookie.split(";")||[];for(const r of t)document.cookie=r.replace(/^ +/,"").replace(/=.*/,`=;expires=${new Date().toUTCString()};path=/`)}catch(t){return Promise.reject(t)}}async clearAllCookies(){try{await this.clearCookies()}catch(t){return Promise.reject(t)}}}H("CapacitorCookies",{web:()=>new Te});const Ie=async n=>new Promise((t,r)=>{const s=new FileReader;s.onload=()=>{const o=s.result;t(o.indexOf(",")>=0?o.split(",")[1]:o)},s.onerror=o=>r(o),s.readAsDataURL(n)}),_e=(n={})=>{const t=Object.keys(n);return Object.keys(n).map(o=>o.toLocaleLowerCase()).reduce((o,i,u)=>(o[i]=n[t[u]],o),{})},ze=(n,t=!0)=>n?Object.entries(n).reduce((s,o)=>{const[i,u]=o;let c,h;return Array.isArray(u)?(h="",u.forEach(m=>{c=t?encodeURIComponent(m):m,h+=`${i}=${c}&`}),h.slice(0,-1)):(c=t?encodeURIComponent(u):u,h=`${i}=${c}`),`${s}&${h}`},"").substr(1):null,De=(n,t={})=>{const r=Object.assign({method:n.method||"GET",headers:n.headers},t),o=_e(n.headers)["content-type"]||"";if(typeof n.data=="string")r.body=n.data;else if(o.includes("application/x-www-form-urlencoded")){const i=new URLSearchParams;for(const[u,c]of Object.entries(n.data||{}))i.set(u,c);r.body=i.toString()}else if(o.includes("multipart/form-data")||n.data instanceof FormData){const i=new FormData;if(n.data instanceof FormData)n.data.forEach((c,h)=>{i.append(h,c)});else for(const c of Object.keys(n.data))i.append(c,n.data[c]);r.body=i;const u=new Headers(r.headers);u.delete("content-type"),r.headers=u}else(o.includes("application/json")||typeof n.data=="object")&&(r.body=JSON.stringify(n.data));return r};class Oe extends q{async request(t){const r=De(t,t.webFetchExtra),s=ze(t.params,t.shouldEncodeUrlParams),o=s?`${t.url}?${s}`:t.url,i=await fetch(o,r),u=i.headers.get("content-type")||"";let{responseType:c="text"}=i.ok?t:{};u.includes("application/json")&&(c="json");let h,m;switch(c){case"arraybuffer":case"blob":m=await i.blob(),h=await Ie(m);break;case"json":h=await i.json();break;case"document":case"text":default:h=await i.text()}const p={};return i.headers.forEach((x,a)=>{p[a]=x}),{data:h,headers:p,status:i.status,url:i.url}}async get(t){return this.request(Object.assign(Object.assign({},t),{method:"GET"}))}async post(t){return this.request(Object.assign(Object.assign({},t),{method:"POST"}))}async put(t){return this.request(Object.assign(Object.assign({},t),{method:"PUT"}))}async patch(t){return this.request(Object.assign(Object.assign({},t),{method:"PATCH"}))}async delete(t){return this.request(Object.assign(Object.assign({},t),{method:"DELETE"}))}}H("CapacitorHttp",{web:()=>new Oe});var ee;(function(n){n.Dark="DARK",n.Light="LIGHT",n.Default="DEFAULT"})(ee||(ee={}));var te;(function(n){n.StatusBar="StatusBar",n.NavigationBar="NavigationBar"})(te||(te={}));class Me extends q{async setStyle(){this.unavailable("not available for web")}async setAnimation(){this.unavailable("not available for web")}async show(){this.unavailable("not available for web")}async hide(){this.unavailable("not available for web")}}H("SystemBars",{web:()=>new Me});function re(){return e.jsx("style",{children:`
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
    `})}function le(){const n=d.useRef(null);return d.useEffect(()=>{const t=n.current;if(!t)return;const r=t.getContext("2d");if(!r)return;let s,o=t.width=window.innerWidth,i=t.height=window.innerHeight;const u=()=>{o=t.width=window.innerWidth,i=t.height=window.innerHeight};window.addEventListener("resize",u);const c=["rgba(192, 57, 43, ","rgba(212, 80, 10, ","rgba(192, 24, 90, ","rgba(21, 101, 192, ","rgba(201, 151, 58, "],h=Math.min(o>768?65:35,80),m=Array.from({length:h},()=>({x:Math.random()*o,y:Math.random()*i,vx:(Math.random()-.5)*.45,vy:(Math.random()-.5)*.45,radius:Math.random()*2+.8,baseAlpha:Math.random()*.6+.25,alphaSpeed:Math.random()*.02+.008,alphaPhase:Math.random()*Math.PI*2,color:c[Math.floor(Math.random()*c.length)]}));let p={x:-1e3,y:-1e3,active:!1};const x=l=>{p.x=l.clientX,p.y=l.clientY,p.active=!0},a=()=>{p.active=!1};window.addEventListener("mousemove",x),window.addEventListener("mouseleave",a);const g=()=>{r.clearRect(0,0,o,i);for(let l=0;l<m.length;l++)for(let f=l+1;f<m.length;f++){const b=m[l].x-m[f].x,y=m[l].y-m[f].y,w=Math.sqrt(b*b+y*y);if(w<115){const j=(1-w/115)*.18;r.strokeStyle=`rgba(179, 18, 58, ${j})`,r.lineWidth=.6,r.beginPath(),r.moveTo(m[l].x,m[l].y),r.lineTo(m[f].x,m[f].y),r.stroke()}}m.forEach(l=>{if(l.x+=l.vx,l.y+=l.vy,l.x<0&&(l.x=o),l.x>o&&(l.x=0),l.y<0&&(l.y=i),l.y>i&&(l.y=0),p.active){const b=l.x-p.x,y=l.y-p.y,w=Math.sqrt(b*b+y*y);if(w<100&&w>0){const j=(100-w)/100;l.x+=b/w*j*1.5,l.y+=y/w*j*1.5}}l.alphaPhase+=l.alphaSpeed;const f=Math.max(.1,l.baseAlpha+Math.sin(l.alphaPhase)*.25);r.beginPath(),r.arc(l.x,l.y,l.radius,0,Math.PI*2),r.fillStyle=`${l.color}${f})`,r.shadowBlur=8,r.shadowColor=`${l.color}0.7)`,r.fill(),r.shadowBlur=0}),s=requestAnimationFrame(g)};return g(),()=>{cancelAnimationFrame(s),window.removeEventListener("resize",u),window.removeEventListener("mousemove",x),window.removeEventListener("mouseleave",a)}},[]),e.jsxs("div",{style:{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"},children:[e.jsx("div",{style:{position:"absolute",top:"-15%",left:"20%",width:"65vw",height:"65vw",maxWidth:900,maxHeight:900,borderRadius:"50%",background:"radial-gradient(circle, rgba(185, 28, 28, 0.12) 0%, transparent 70%)",filter:"blur(60px)",animation:"crx-float 16s ease-in-out infinite alternate"}}),e.jsx("canvas",{ref:n,style:{width:"100%",height:"100%",display:"block"}})]})}const Be="/assets/logo-vVsmndta.webp",We="/assets/logo-sm-Bdg26l8s.webp",$e=Be,Ge=We,Ue="/assets/logo-blue-wTcvU56K.webp";function Ne({onDone:n}){const[t,r]=d.useState("morphing"),[s,o]=d.useState(0),i=d.useRef(!1);d.useEffect(()=>{const f=setTimeout(()=>{r("red-loading")},4800);return()=>clearTimeout(f)},[]),d.useEffect(()=>{if(t!=="red-loading")return;let f=performance.now();const b=2800;let y;const w=j=>{const z=j-f,F=Math.min(100,z/b*100);o(F),F<100?y=requestAnimationFrame(w):setTimeout(()=>{i.current||(i.current=!0,n&&n())},380)};return y=requestAnimationFrame(w),()=>cancelAnimationFrame(y)},[t,n]);const u=280,c=124,h=2*Math.PI*c,m=h-h*s/100,p=s/100*2*Math.PI-Math.PI/2,x=140+c*Math.cos(p),a=140+c*Math.sin(p),g=t==="morphing",l=t==="red-loading";return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
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
        `}),e.jsxs("div",{style:{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"radial-gradient(ellipse at 50% 45%, #18060A 0%, #0C0508 55%, #050204 100%)",overflow:"hidden",zIndex:99999},children:[e.jsx(le,{}),e.jsxs("div",{style:{position:"relative",zIndex:4,width:u,height:u,display:"flex",alignItems:"center",justifyContent:"center"},children:[g&&e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{position:"absolute",width:210,height:210,borderRadius:"50%",background:"rgba(59, 130, 246, 0.5)",filter:"blur(45px)",animation:"crx-blue-aura-morph 4.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",zIndex:1}}),e.jsx("img",{src:Ue,alt:"Cerebrexia Blue Logo",width:210,height:210,decoding:"async",fetchPriority:"high",style:{position:"absolute",left:"50%",top:"50%",width:210,height:210,borderRadius:"50%",objectFit:"cover",transformOrigin:"center center",boxShadow:"0 0 35px rgba(59, 130, 246, 0.45)",animation:"crx-blue-morph 4.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",zIndex:2}})]}),e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{position:"absolute",width:210,height:210,borderRadius:"50%",background:"rgba(220, 38, 38, 0.45)",filter:"blur(35px)",animation:g?"crx-red-aura-morph 4.8s cubic-bezier(0.16, 1, 0.3, 1) forwards":"crx-red-settled-pulse 2.5s ease-in-out infinite",zIndex:1}}),e.jsx("img",{src:$e,alt:"Cerebrexia Logo",width:210,height:210,decoding:"async",fetchPriority:"high",style:{position:"absolute",left:"50%",top:"50%",width:210,height:210,borderRadius:"50%",objectFit:"cover",transformOrigin:"center center",boxShadow:"0 0 32px rgba(220, 38, 38, 0.7), 0 0 65px rgba(185, 28, 28, 0.35)",animation:g?"crx-red-morph 4.8s cubic-bezier(0.16, 1, 0.3, 1) forwards":"translate(-50%, -50%) scale(1)",zIndex:3}})]}),l&&e.jsxs("svg",{width:u,height:u,viewBox:`0 0 ${u} ${u}`,style:{position:"absolute",inset:0,zIndex:5,pointerEvents:"none"},children:[e.jsxs("defs",{children:[e.jsxs("linearGradient",{id:"crxProgressGrad",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#EF4444"}),e.jsx("stop",{offset:"60%",stopColor:"#DC2626"}),e.jsx("stop",{offset:"100%",stopColor:"#B91C1C"})]}),e.jsxs("filter",{id:"crxNeonGlow",x:"-20%",y:"-20%",width:"140%",height:"140%",children:[e.jsx("feGaussianBlur",{stdDeviation:"2.5",result:"blur"}),e.jsx("feComposite",{in:"SourceGraphic",in2:"blur",operator:"over"})]})]}),e.jsx("circle",{cx:140,cy:140,r:c,fill:"none",stroke:"rgba(255, 255, 255, 0.08)",strokeWidth:"3.5"}),e.jsx("circle",{cx:140,cy:140,r:c,fill:"none",stroke:"url(#crxProgressGrad)",strokeWidth:"4",strokeLinecap:"round",strokeDasharray:h,strokeDashoffset:m,transform:"rotate(-90 140 140)",filter:"url(#crxNeonGlow)",style:{transition:"stroke-dashoffset 0.04s linear"}}),s>1&&s<100&&e.jsx("circle",{cx:x,cy:a,r:4.5,fill:"#FFFFFF",style:{filter:"drop-shadow(0 0 5px #DC2626) drop-shadow(0 0 8px #FFFFFF)"}})]})]}),e.jsx("div",{style:{position:"relative",zIndex:6,textAlign:"center",marginTop:26,minHeight:52},children:l?e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",fontSize:"clamp(20px, 3.5vw, 26px)",fontWeight:800,color:"#FFFFFF",letterSpacing:2,textShadow:"0 0 12px rgba(220, 38, 38, 0.75)"},children:[Math.round(s),"%"]}),e.jsx("div",{style:{fontSize:11,letterSpacing:"0.28em",textTransform:"uppercase",fontWeight:700,color:s>=100?"#4ADE80":"rgba(255, 255, 255, 0.45)",marginTop:5,transition:"color 0.3s ease"},children:s>=100?"INITIALIZATION COMPLETE":"THE CROWNED DIAGNOSIS"})]}):e.jsx("div",{style:{fontFamily:"var(--font-sans)",fontSize:11.5,letterSpacing:"0.3em",textTransform:"uppercase",fontWeight:600,color:"rgba(255, 255, 255, 0.4)",marginTop:10},children:"Initializing"})})]})]})}const He="https://dgkubrwfrwcfpkgjoxmu.supabase.co",qe="sb_publishable_v_CcCDqlYXXvx1emJ9U7Cw_2KCpskhS",R=ve(He,qe,{auth:{persistSession:!0,autoRefreshToken:!0,detectSessionInUrl:!0,storageKey:"crx_session"},global:{headers:{"x-client-info":"cerebrexia-web"}}});function I(n){const t=((n==null?void 0:n.message)||"").toLowerCase();return((n==null?void 0:n.status)??(n==null?void 0:n.code)??0)===429||t.includes("rate limit")||t.includes("too many")?{message:"Too many attempts. Please wait a moment and try again.",isRateLimit:!0}:t.includes("invalid login")||t.includes("invalid credentials")||t.includes("wrong")?{message:"Incorrect email or password.",isRateLimit:!1}:t.includes("email not confirmed")||t.includes("not confirmed")?{message:"Your email has not been verified yet. Please check your inbox and click the verification link before logging in.",isRateLimit:!1,isEmailNotConfirmed:!0}:t.includes("user already registered")||t.includes("already registered")?{message:"An account with this email already exists. Try signing in.",isRateLimit:!1}:t.includes("password should be")?{message:"Password must be at least 6 characters.",isRateLimit:!1}:t.includes("unable to validate")||t.includes("email address")?{message:"Please enter a valid email address.",isRateLimit:!1}:t.includes("network")||t.includes("fetch")?{message:"Network error. Check your connection and try again.",isRateLimit:!1}:{message:(n==null?void 0:n.message)||"Something went wrong. Please try again.",isRateLimit:!1}}async function ne(n,t=3){let r;for(let s=1;s<=t;s++)try{return await n()}catch(o){if(r=o,!(((o==null?void 0:o.status)??(o==null?void 0:o.code)??0)===429||((o==null?void 0:o.message)||"").toLowerCase().includes("rate limit"))||s===t)throw o;await new Promise(c=>setTimeout(c,1e3*Math.pow(2,s)))}throw r}const ce=d.createContext(null);function oe({children:n}){const[t,r]=d.useState(null),[s,o]=d.useState(!0);d.useEffect(()=>{R.auth.getSession().then(({data:{session:g}})=>{r((g==null?void 0:g.user)??null),o(!1)}).catch(g=>{console.error("[Auth] getSession error:",g),o(!1)});const{data:{subscription:a}}=R.auth.onAuthStateChange((g,l)=>{r((l==null?void 0:l.user)??null),g==="SIGNED_OUT"&&r(null)});return()=>a.unsubscribe()},[]);const i=d.useCallback(()=>typeof window<"u"?window.location.origin:"",[]),u=d.useCallback(async(a,g)=>{const l=i(),{data:f,error:b}=await ne(()=>R.auth.signUp({email:a.trim().toLowerCase(),password:g,options:{emailRedirectTo:l}}));if(b){const y=I(b),w=new Error(y.message);throw w.isRateLimit=y.isRateLimit,w.isEmailNotConfirmed=y.isEmailNotConfirmed,w}return f},[i]),c=d.useCallback(async a=>{const g=i(),{data:l,error:f}=await R.auth.resend({type:"signup",email:a.trim().toLowerCase(),options:{emailRedirectTo:g}});if(f){const b=I(f),y=new Error(b.message);throw y.isRateLimit=b.isRateLimit,y}return l},[i]),h=d.useCallback(async(a,g)=>{const{data:l,error:f}=await ne(()=>R.auth.signInWithPassword({email:a.trim().toLowerCase(),password:g}));if(f){const b=I(f),y=new Error(b.message);throw y.isRateLimit=b.isRateLimit,y.isEmailNotConfirmed=b.isEmailNotConfirmed,y}return l},[]),m=d.useCallback(async()=>{const a=i(),{data:g,error:l}=await R.auth.signInWithOAuth({provider:"google",options:{redirectTo:a,queryParams:{prompt:"select_account"}}});if(l)throw new Error(I(l).message);return g},[i]),p=d.useCallback(async()=>{const{error:a}=await R.auth.signOut();if(a)throw new Error(I(a).message)},[]),x={user:t,loading:s,signUpWithEmail:u,signInWithEmail:h,signInWithGoogle:m,resendVerificationEmail:c,signOut:p};return e.jsx(ce.Provider,{value:x,children:!s&&n})}const V=()=>{const n=d.useContext(ce);if(!n)throw new Error("useAuth must be used inside <AuthProvider>");return n},Ve=e.jsx("svg",{viewBox:"0 0 24 24",width:"20",height:"20",xmlns:"http://www.w3.org/2000/svg",children:e.jsxs("g",{transform:"matrix(1,0,0,1,27.009001,-39.238998)",children:[e.jsx("path",{fill:"#4285F4",d:"M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"}),e.jsx("path",{fill:"#34A853",d:"M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"}),e.jsx("path",{fill:"#FBBC05",d:"M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"}),e.jsx("path",{fill:"#EA4335",d:"M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"})]})});function Ye({onSuccess:n,onOpenPolicy:t}){const{signInWithGoogle:r}=V(),[s,o]=d.useState(!1),[i,u]=d.useState(null),c=async()=>{if(!s){u(null),o(!0);try{await r(),n&&n()}catch(h){u(h.message||"Google sign-in failed. Please try again."),o(!1)}}};return e.jsxs("div",{style:{background:"rgba(255,243,214,0.03)",border:"1px solid rgba(220,38,38,0.35)",borderRadius:16,padding:"clamp(24px, 5vw, 40px) clamp(16px, 4vw, 30px)",width:"92%",maxWidth:420,margin:"0 auto",boxShadow:"0 10px 40px rgba(0,0,0,0.6), 0 0 60px rgba(220,38,38,0.07)",backdropFilter:"blur(10px)",position:"relative",overflow:"hidden",boxSizing:"border-box",textAlign:"center"},children:[e.jsx("div",{style:{position:"absolute",top:-50,left:-50,width:160,height:160,background:"rgba(220,38,38,0.14)",filter:"blur(50px)",borderRadius:"50%",pointerEvents:"none"}}),e.jsx("div",{style:{position:"absolute",bottom:-40,right:-40,width:120,height:120,background:"rgba(220,38,38,0.07)",filter:"blur(40px)",borderRadius:"50%",pointerEvents:"none"}}),e.jsx("h2",{className:"crx-display",style:{fontSize:26,color:"var(--cream)",marginBottom:8,letterSpacing:1},children:"ACCESS TERMINAL"}),e.jsx("p",{style:{color:"var(--muted)",fontSize:13,lineHeight:1.5,marginBottom:28,letterSpacing:.3},children:"Sign in with your Google account to access Cerebrexia '26 and manage your passes."}),i&&e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:10,padding:"12px 14px",borderRadius:8,fontSize:13,marginBottom:20,background:"rgba(220,38,38,0.12)",border:"1px solid #DC2626",color:"#ff8f8f",textAlign:"left"},children:[e.jsx(xe,{size:16,style:{flexShrink:0,marginTop:2}}),e.jsx("span",{children:i})]}),e.jsx("button",{type:"button",onClick:c,disabled:s,className:"crx-btn",style:{width:"100%",justifyContent:"center",background:"white",color:"#111",boxShadow:"0 4px 18px rgba(255,255,255,0.15)",marginBottom:20,gap:12,fontSize:14,fontWeight:700,padding:"14px 20px",borderRadius:10,cursor:s?"not-allowed":"pointer",opacity:s?.7:1,transition:"all 0.2s ease"},children:s?e.jsxs(e.Fragment,{children:[e.jsx(he,{size:16,style:{animation:"spin 1s linear infinite"}}),"CONNECTING TO GOOGLE..."]}):e.jsxs(e.Fragment,{children:[Ve,"CONTINUE WITH GOOGLE"]})}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,padding:"10px 14px",color:"var(--muted)",fontSize:12,lineHeight:1.4,marginBottom:20},children:[e.jsx(fe,{size:15,color:"#D4AF6A",style:{flexShrink:0}}),e.jsx("span",{children:"Instant, secure login. No passwords required."})]}),e.jsxs("div",{style:{marginTop:10,paddingTop:14,borderTop:"1px solid rgba(255, 255, 255, 0.08)",textAlign:"center"},children:[e.jsx("p",{style:{fontSize:10.5,color:"var(--muted)",margin:"0 0 8px",letterSpacing:.5},children:"Official Festival Compliance & Policies:"}),e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"6px 12px",fontSize:11},children:[e.jsx("button",{type:"button",onClick:()=>t?t("terms"):window.location.hash="terms",style:{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",padding:0,textDecoration:"underline"},children:"Terms & Conditions"}),e.jsx("span",{style:{color:"rgba(255,255,255,0.2)"},children:"•"}),e.jsx("button",{type:"button",onClick:()=>t?t("privacy"):window.location.hash="privacy",style:{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",padding:0,textDecoration:"underline"},children:"Privacy Policy"}),e.jsx("span",{style:{color:"rgba(255,255,255,0.2)"},children:"•"}),e.jsx("button",{type:"button",onClick:()=>t?t("refunds"):window.location.hash="refunds",style:{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",padding:0,textDecoration:"underline"},children:"Refund Policy"}),e.jsx("span",{style:{color:"rgba(255,255,255,0.2)"},children:"•"}),e.jsx("button",{type:"button",onClick:()=>t?t("pricing"):window.location.hash="pricing",style:{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",padding:0,textDecoration:"underline"},children:"Pricing & Delivery"})]})]})]})}function Xe({onComplete:n,onWipeStart:t,onOpenPolicy:r}){const[s,o]=d.useState("loading"),[i,u]=d.useState(0),c=d.useRef(null),h=d.useRef(null),{user:m}=V(),p=d.useCallback(()=>{o("wiping"),t&&t()},[t]),x=d.useCallback(()=>{m?p():o("auth")},[m,p]);d.useEffect(()=>{s==="auth"&&m&&p()},[m,s,p]),d.useEffect(()=>{if(s!=="wiping")return;h.current=performance.now();const l=1600,f=b=>{const y=b-h.current,w=Math.min(1,y/l),j=1-Math.pow(1-w,3);u(j),w<1?c.current=requestAnimationFrame(f):setTimeout(()=>{n&&n()},100)};return c.current=requestAnimationFrame(f),()=>{c.current&&cancelAnimationFrame(c.current)}},[s,n]);const a=50-i*50,g=50-i*50;return e.jsxs("div",{style:{position:"fixed",inset:0,zIndex:9999,pointerEvents:s==="auth"?"auto":"none"},children:[s==="loading"&&e.jsx(Ne,{onDone:x}),s==="auth"&&e.jsx("div",{style:{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#020101",padding:"20px 16px",overflowY:"auto"},children:e.jsx("div",{style:{width:"100%",maxWidth:420},children:e.jsx(Ye,{onSuccess:p,onOpenPolicy:r})})}),s==="wiping"&&e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{position:"absolute",left:0,right:0,top:0,height:`${g}%`,background:"#020101"}}),e.jsx("div",{style:{position:"absolute",left:0,right:0,bottom:0,height:`${g}%`,background:"#020101"}}),e.jsx("div",{style:{position:"absolute",left:0,top:`${g}%`,bottom:`${g}%`,width:`${a}%`,background:"#020101"}}),e.jsx("div",{style:{position:"absolute",right:0,top:`${g}%`,bottom:`${g}%`,width:`${a}%`,background:"#020101"}}),e.jsx("div",{style:{position:"absolute",left:`${a}%`,top:`${g}%`,right:`${a}%`,bottom:`${g}%`,border:`2px solid rgba(192, 57, 43, ${.8-i*.6})`,boxShadow:`0 0 ${20+i*30}px rgba(192, 57, 43, ${.4-i*.3}), inset 0 0 ${10+i*20}px rgba(192, 24, 90, ${.2-i*.15})`}})]})]})}const ae=["Home","Events","Pronites","Accommodation"],_=["About","Contact","Policies"];function de(n){const[t,r]=d.useState(()=>typeof window<"u"&&window.innerWidth<n);return d.useEffect(()=>{const s=()=>r(window.innerWidth<n);return window.addEventListener("resize",s),()=>window.removeEventListener("resize",s)},[n]),t}function Ke({page:n,setPage:t}){const[r,s]=d.useState(!1),[o,i]=d.useState(!1),[u,c]=d.useState(!1),h=d.useRef(null),m=de(768),{user:p}=V(),x=a=>{t(a.toLowerCase()),s(!1),i(!1)};return d.useEffect(()=>{const a=()=>c(window.scrollY>20);return window.addEventListener("scroll",a,{passive:!0}),a(),()=>window.removeEventListener("scroll",a)},[]),d.useEffect(()=>{if(!o)return;const a=g=>{h.current&&!h.current.contains(g.target)&&i(!1)};return document.addEventListener("mousedown",a),()=>document.removeEventListener("mousedown",a)},[o]),e.jsxs("header",{className:`crx-nav-header ${u?"scrolled":""}`,children:[e.jsxs("div",{style:{maxWidth:1360,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e.jsx("button",{onClick:()=>x("Home"),style:{background:"none",border:"none",cursor:"pointer",padding:0,position:"relative"},children:e.jsx("div",{className:"crx-logo-badge",style:{width:54,height:54,background:"#0C0508",border:"2px solid rgba(212, 175, 106, 0.65)",borderRadius:14,boxShadow:"0 4px 16px rgba(0, 0, 0, 0.6)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",padding:2,transition:"transform 180ms ease"},onMouseEnter:a=>{a.currentTarget.style.transform="scale(1.04)"},onMouseLeave:a=>{a.currentTarget.style.transform="scale(1)"},children:e.jsx("img",{src:Ge,alt:"Cerebrexia",width:50,height:50,decoding:"async",style:{width:"100%",height:"100%",borderRadius:10,objectFit:"cover"}})})}),e.jsxs("nav",{style:{display:m?"none":"flex",alignItems:"center",gap:4,background:u?"rgba(18, 9, 14, 0.88)":"rgba(20, 10, 14, 0.72)",border:u?"1px solid rgba(212, 175, 106, 0.55)":"1px solid rgba(255, 255, 255, 0.08)",borderRadius:40,padding:"6px 14px",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",boxShadow:u?"0 0 0 1px rgba(255, 255, 255, 0.14), 0 0 22px rgba(212, 175, 106, 0.28), 0 12px 36px rgba(0, 0, 0, 0.8)":"0 8px 30px rgba(0, 0, 0, 0.45)",transition:"border 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.3s cubic-bezier(0.22, 1, 0.36, 1)"},children:[ae.map(a=>{const g=n===a.toLowerCase();return e.jsx("button",{onClick:()=>x(a),style:{background:g?"rgba(255, 255, 255, 0.12)":"transparent",border:g?"1px solid rgba(255, 255, 255, 0.16)":"1px solid transparent",color:g?"#FFFFFF":"rgba(255, 255, 255, 0.72)",borderRadius:24,padding:"7px 18px",fontSize:13.5,fontWeight:700,letterSpacing:"0.04em",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Space Grotesk', sans-serif",transition:"color 160ms ease, background-color 160ms ease, border-color 160ms ease"},onMouseEnter:l=>{g||(l.currentTarget.style.color="#FFFFFF")},onMouseLeave:l=>{g||(l.currentTarget.style.color="rgba(255, 255, 255, 0.72)")},children:a},a)}),e.jsxs("div",{ref:h,style:{position:"relative"},children:[e.jsxs("button",{onClick:()=>i(!o),style:{display:"inline-flex",alignItems:"center",gap:5,background:_.some(a=>n===a.toLowerCase())?"rgba(255, 255, 255, 0.12)":"transparent",border:_.some(a=>n===a.toLowerCase())?"1px solid rgba(255, 255, 255, 0.16)":"1px solid transparent",color:_.some(a=>n===a.toLowerCase())?"#FFFFFF":"rgba(255, 255, 255, 0.72)",borderRadius:24,padding:"7px 16px",fontSize:13.5,fontWeight:700,letterSpacing:"0.04em",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Space Grotesk', sans-serif",transition:"color 160ms ease"},children:["More ",e.jsx(be,{size:14,style:{transform:o?"rotate(180deg)":"none",transition:"transform 160ms ease"}})]}),o&&e.jsx("div",{style:{position:"absolute",top:"calc(100% + 12px)",left:"50%",transform:"translateX(-50%)",background:"rgba(16, 9, 14, 0.98)",border:"1px solid rgba(255, 255, 255, 0.14)",borderRadius:16,padding:8,minWidth:160,backdropFilter:"blur(20px)",boxShadow:"0 12px 36px rgba(0, 0, 0, 0.7)",display:"flex",flexDirection:"column",gap:3},children:_.map(a=>e.jsx("button",{onClick:()=>x(a),style:{background:"transparent",color:n===a.toLowerCase()?"#FFFFFF":"rgba(255, 255, 255, 0.75)",border:"none",borderRadius:10,padding:"9px 14px",fontSize:13,fontWeight:600,letterSpacing:"0.03em",textTransform:"uppercase",textAlign:"left",cursor:"pointer",fontFamily:"'Space Grotesk', sans-serif"},children:a},a))})]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12},children:[e.jsx("button",{onClick:()=>x("Dashboard"),style:{background:"linear-gradient(135deg, #C0392B 0%, #D4500A 100%)",color:"#FFFFFF",border:"none",borderRadius:12,boxShadow:"0 4px 20px rgba(192, 57, 43, 0.45)",padding:"11px 24px",fontWeight:800,fontSize:13.5,letterSpacing:"0.04em",textTransform:"uppercase",cursor:"pointer",display:m?"none":"inline-flex",alignItems:"center",fontFamily:"'Space Grotesk', sans-serif",transition:"transform 180ms ease, box-shadow 180ms ease, filter 180ms ease"},onMouseEnter:a=>{a.currentTarget.style.transform="translateY(-2px)",a.currentTarget.style.filter="brightness(1.1)"},onMouseLeave:a=>{a.currentTarget.style.transform="translateY(0)",a.currentTarget.style.filter="brightness(1)"},children:p?"Dashboard":"Sign In"}),e.jsx("button",{onClick:()=>s(!r),"aria-label":"Menu",className:"crx-hamburger-btn",style:{background:"linear-gradient(135deg, #C0392B 0%, #D4500A 100%)",border:"none",borderRadius:12,width:44,height:44,cursor:"pointer",display:m?"flex":"none",alignItems:"center",justifyContent:"center"},children:r?e.jsx(ye,{size:18,color:"var(--crx-text-primary)"}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:4},children:[e.jsx("span",{style:{width:16,height:1.5,background:"var(--crx-text-primary)"}}),e.jsx("span",{style:{width:16,height:1.5,background:"var(--crx-text-primary)"}}),e.jsx("span",{style:{width:16,height:1.5,background:"var(--crx-text-primary)"}})]})})]})]}),r&&e.jsxs("div",{style:{marginTop:12,background:"var(--crx-card)",border:"1px solid var(--crx-hairline-accent)",borderRadius:14,padding:14,display:"flex",flexDirection:"column",gap:4,backdropFilter:"blur(20px)",boxShadow:"0 12px 32px rgba(0,0,0,0.7)"},children:[[...ae,..._].map(a=>e.jsx("button",{onClick:()=>x(a),style:{background:"transparent",color:n===a.toLowerCase()?"var(--crx-text-primary)":"var(--crx-text-secondary)",border:"none",borderRadius:8,padding:"10px 14px",textAlign:"left",fontWeight:500,fontSize:13,letterSpacing:"0.03em",textTransform:"uppercase",cursor:"pointer",fontFamily:"'Space Grotesk', sans-serif"},children:a},a)),e.jsx("button",{onClick:()=>x("Dashboard"),style:{background:"var(--crx-accent)",color:"#FFFFFF",border:"none",borderRadius:8,padding:"10px",fontWeight:600,fontSize:12.5,textTransform:"uppercase",cursor:"pointer",marginTop:6,fontFamily:"'Space Grotesk', sans-serif"},children:p?"Dashboard":"Sign In"})]})]})}function Je({size:n=24,color:t="currentColor",className:r="",style:s={}}){return e.jsxs("svg",{width:n,height:n,viewBox:"0 0 24 24",fill:"none",stroke:t,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:r,style:s,children:[e.jsx("rect",{width:"20",height:"20",x:"2",y:"2",rx:"5",ry:"5"}),e.jsx("path",{d:"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"}),e.jsx("line",{x1:"17.5",x2:"17.51",y1:"6.5",y2:"6.5"})]})}function se({size:n=24,color:t="currentColor",className:r="",style:s={}}){return e.jsx("svg",{width:n,height:n,viewBox:"0 0 24 24",fill:t==="currentColor"?"currentColor":t,className:r,style:s,children:e.jsx("path",{d:"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"})})}function B({children:n,tone:t="gold",rotate:r=-2,style:s={}}){return e.jsx("span",{className:`crx-sticker ${t}`,style:{transform:`rotate(${r}deg)`,...s},children:n})}function Ze({setPage:n}){const t=de(760);return e.jsxs("footer",{style:{borderTop:"1px solid rgba(179, 18, 58, 0.25)",background:"linear-gradient(180deg, transparent 0%, rgba(10, 5, 5, 0.9) 100%)",padding:"60px 24px 40px",position:"relative",zIndex:2,width:"100%",maxWidth:"100vw",overflow:"hidden",contain:"paint"},children:[e.jsxs("div",{style:{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:t?"1fr":"1.3fr 1fr 1.2fr 1fr",gap:30},children:[e.jsxs("div",{children:[e.jsx(B,{tone:"cyan",rotate:-2,style:{marginBottom:14},children:"Cerebrexia '26"}),e.jsx("p",{style:{fontSize:13.5,color:"var(--paper)",lineHeight:1.7,maxWidth:320,margin:"0 0 16px"},children:"The annual medical-college fest of IGIMS. Compete, perform, belong."}),e.jsxs("p",{style:{fontSize:11.5,color:"var(--muted)",margin:0,lineHeight:1.6},children:["Indira Gandhi Institute of Medical Sciences",e.jsx("br",{}),"Sheikhpura, Patna – 800014, Bihar"]})]}),e.jsxs("div",{children:[e.jsx(B,{tone:"gold",rotate:2,style:{marginBottom:14},children:"Explore"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:8},children:["Home","Events","Pronites","Accommodation","Contact"].map(r=>e.jsx("button",{onClick:()=>n(r.toLowerCase()),style:{background:"none",border:"none",color:"var(--muted)",textAlign:"left",cursor:"pointer",fontSize:13.5,padding:0,transition:"color 0.2s"},onMouseEnter:s=>s.currentTarget.style.color="var(--cyan)",onMouseLeave:s=>s.currentTarget.style.color="var(--muted)",children:r},r))})]}),e.jsxs("div",{children:[e.jsx(B,{tone:"gold",rotate:-1,style:{marginBottom:14},children:"Compliance"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:8},children:[{id:"terms",label:"Terms & Conditions"},{id:"privacy",label:"Privacy Policy"},{id:"refunds",label:"Refund & Cancellation"},{id:"pricing",label:"Pricing & Delivery"}].map(r=>e.jsx("button",{onClick:()=>n(r.id),style:{background:"none",border:"none",color:"var(--muted)",textAlign:"left",cursor:"pointer",fontSize:13.5,padding:0,transition:"color 0.2s"},onMouseEnter:s=>s.currentTarget.style.color="var(--gold)",onMouseLeave:s=>s.currentTarget.style.color="var(--muted)",children:r.label},r.id))})]}),e.jsxs("div",{children:[e.jsx(B,{tone:"cyan",rotate:-2,style:{marginBottom:14},children:"Connect"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:12},children:[e.jsxs("a",{href:"https://www.instagram.com/igimsfest?srtk=MWR5NzJobTV6MDB5aw==",target:"_blank",rel:"noopener noreferrer",style:{display:"inline-flex",alignItems:"center",gap:10,color:"var(--paper)",textDecoration:"none",fontSize:13,transition:"all 0.2s ease"},onMouseEnter:r=>{r.currentTarget.style.color="#E1306C",r.currentTarget.style.transform="translateX(3px)"},onMouseLeave:r=>{r.currentTarget.style.color="var(--paper)",r.currentTarget.style.transform="translateX(0)"},children:[e.jsx("div",{style:{width:32,height:32,borderRadius:8,background:"rgba(225, 48, 108, 0.12)",border:"1px solid rgba(225, 48, 108, 0.28)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#E1306C"},children:e.jsx(Je,{size:16})}),e.jsxs("div",{children:[e.jsx("span",{style:{display:"block",fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:.8,fontWeight:700},children:"Instagram"}),e.jsx("span",{children:"@igimsfest"})]})]}),e.jsxs("a",{href:"https://wa.me/918271791542",target:"_blank",rel:"noopener noreferrer",style:{display:"inline-flex",alignItems:"center",gap:10,color:"var(--paper)",textDecoration:"none",fontSize:13,transition:"all 0.2s ease"},onMouseEnter:r=>{r.currentTarget.style.color="#25D366",r.currentTarget.style.transform="translateX(3px)"},onMouseLeave:r=>{r.currentTarget.style.color="var(--paper)",r.currentTarget.style.transform="translateX(0)"},children:[e.jsx("div",{style:{width:32,height:32,borderRadius:8,background:"rgba(37, 211, 102, 0.12)",border:"1px solid rgba(37, 211, 102, 0.28)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#25D366"},children:e.jsx(se,{size:16,color:"#25D366"})}),e.jsxs("div",{children:[e.jsx("span",{style:{display:"block",fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:.8,fontWeight:700},children:"WhatsApp · Divyansh"}),e.jsx("span",{children:"+91 82717 91542"})]})]}),e.jsxs("a",{href:"https://wa.me/919128187476",target:"_blank",rel:"noopener noreferrer",style:{display:"inline-flex",alignItems:"center",gap:10,color:"var(--paper)",textDecoration:"none",fontSize:13,transition:"all 0.2s ease"},onMouseEnter:r=>{r.currentTarget.style.color="#25D366",r.currentTarget.style.transform="translateX(3px)"},onMouseLeave:r=>{r.currentTarget.style.color="var(--paper)",r.currentTarget.style.transform="translateX(0)"},children:[e.jsx("div",{style:{width:32,height:32,borderRadius:8,background:"rgba(37, 211, 102, 0.12)",border:"1px solid rgba(37, 211, 102, 0.28)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#25D366"},children:e.jsx(se,{size:16,color:"#25D366"})}),e.jsxs("div",{children:[e.jsx("span",{style:{display:"block",fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:.8,fontWeight:700},children:"WhatsApp · Veer"}),e.jsx("span",{children:"+91 91281 87476"})]})]})]})]})]}),e.jsxs("div",{style:{maxWidth:1100,margin:"40px auto 0",paddingTop:20,borderTop:"1px solid rgba(255, 255, 255, 0.06)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,fontSize:11.5,color:"var(--muted)"},children:[e.jsx("p",{style:{margin:0},children:"© 2026 Cerebrexia · IGIMS Patna · The Crowned Diagnosis"}),e.jsxs("div",{style:{display:"flex",gap:14},children:[e.jsx("button",{onClick:()=>n("terms"),style:{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:11.5,padding:0},children:"Terms"}),e.jsx("span",{children:"·"}),e.jsx("button",{onClick:()=>n("privacy"),style:{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:11.5,padding:0},children:"Privacy"}),e.jsx("span",{children:"·"}),e.jsx("button",{onClick:()=>n("refunds"),style:{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:11.5,padding:0},children:"Refunds"}),e.jsx("span",{children:"·"}),e.jsx("button",{onClick:()=>n("pricing"),style:{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:11.5,padding:0},children:"Pricing"})]})]})]})}const Qe=d.lazy(()=>E(()=>import("./HomePage-C_A9Wcxv.js"),__vite__mapDeps([0,1,2,3,4,5,6]))),et=d.lazy(()=>E(()=>import("./EventsPage-CDZRxc1S.js"),__vite__mapDeps([7,1,4,5,2,3,8,6]))),tt=d.lazy(()=>E(()=>import("./PronitesPage-BbZd85n4.js"),__vite__mapDeps([9,1,2,5,6]))),rt=d.lazy(()=>E(()=>import("./AccommodationPage-BFDS5O8L.js"),__vite__mapDeps([10,1,2,8,11,5,6]))),nt=d.lazy(()=>E(()=>import("./ContactPage-Bf30eKDC.js"),__vite__mapDeps([12,1,2,5,6]))),ot=d.lazy(()=>E(()=>import("./AboutPage-CdqkmR0Y.js"),__vite__mapDeps([13,1,2,5,6]))),at=d.lazy(()=>E(()=>import("./DashboardPage-MxJUzKeT.js"),__vite__mapDeps([14,1,8,11,15,16,17,5,6]))),st=d.lazy(()=>E(()=>import("./PolicyPage-gn3uAQ2l.js"),__vite__mapDeps([18,1,2,5,6]))),it=d.lazy(()=>E(()=>import("./AdminPage-DYKUyBs0.js"),__vite__mapDeps([19,1,15,5,6]))),lt=d.lazy(()=>E(()=>import("./BookingPortalPage-B_gJsAPd.js"),__vite__mapDeps([20,1,17,11,15,16,5,6]))),ct=d.lazy(()=>E(()=>import("./TitleSponsorModal-ktM2AzHH.js"),__vite__mapDeps([21,1,5,6]))),dt=d.lazy(()=>E(()=>import("./webNoScannerStub-C6d-v1ok.js"),[])),ue=["terms","privacy","refunds","pricing","policies"],N=[...ue,"home","events","pronites","accommodation","about","contact","dashboard","admin","booking-portal","booking"];function ut(){const n=typeof window<"u"&&W.isNativePlatform(),t=()=>{if(typeof window<"u"){const b=new URLSearchParams(window.location.search).get("page");if(b&&N.includes(b.toLowerCase()))return b.toLowerCase();if(window.location.hash){const y=window.location.hash.replace("#","").toLowerCase();if(N.includes(y))return y}}return"home"},[r,s]=d.useState(t),[o,i]=d.useState(!1),[u,c]=d.useState(!1),[h,m]=d.useState(!1),p=d.useCallback(f=>{s(f),typeof window<"u"&&window.history.replaceState(null,"","#"+f)},[]);d.useEffect(()=>{const f=()=>{const b=window.location.hash.replace("#","").toLowerCase();N.includes(b)&&s(b)};return window.addEventListener("hashchange",f),()=>window.removeEventListener("hashchange",f)},[]),d.useEffect(()=>{window.scrollTo(0,0)},[r]);const x=d.useCallback(()=>{i(!0),m(!0)},[]),a=d.useCallback(()=>{c(!0)},[]);if(n)return e.jsx(oe,{children:e.jsxs("div",{className:"crx-root",children:[e.jsx(re,{}),e.jsx(d.Suspense,{fallback:e.jsx("div",{style:{minHeight:"100vh",background:"#070204"}}),children:e.jsx(dt,{})})]})});const g=ue.includes(r),l=g||r==="admin"||r==="booking-portal"||r==="booking";return e.jsx(oe,{children:e.jsxs("div",{className:"crx-root",children:[e.jsx(re,{}),!o&&!l&&e.jsx(Xe,{onComplete:x,onWipeStart:a,onOpenPolicy:p}),h&&!l&&e.jsx(d.Suspense,{fallback:null,children:e.jsx(ct,{onClose:()=>m(!1)})}),(u||o||l)&&e.jsx(le,{}),e.jsx("div",{className:"crx-dots"}),e.jsx("div",{className:"crx-vignette"}),e.jsxs("div",{style:{position:"relative",zIndex:1,width:"100%",maxWidth:"100vw",overflowX:"hidden"},children:[e.jsx(Ke,{page:r,setPage:p}),e.jsxs(d.Suspense,{fallback:e.jsx("div",{style:{minHeight:"70vh"}}),children:[r==="home"&&e.jsx(Qe,{setPage:p,revealHeroTitle:u,canLoadMedia:o}),r==="events"&&e.jsx(et,{setPage:p}),r==="pronites"&&e.jsx(tt,{}),r==="accommodation"&&e.jsx(rt,{}),r==="about"&&e.jsx(ot,{}),r==="contact"&&e.jsx(nt,{}),r==="dashboard"&&e.jsx(at,{setPage:p}),r==="admin"&&e.jsx(it,{setPage:p}),(r==="booking-portal"||r==="booking")&&e.jsx(lt,{setPage:p}),g&&e.jsx(st,{initialTab:r==="policies"?"terms":r,setPage:p})]}),e.jsx(Ze,{setPage:p})]})]})})}"scrollRestoration"in window.history&&(window.history.scrollRestoration="manual");window.scrollTo(0,0);class pt extends ie.Component{constructor(t){super(t),this.state={hasError:!1,error:null}}static getDerivedStateFromError(t){return{hasError:!0,error:t}}componentDidCatch(t,r){console.error("[App Crash caught by ErrorBoundary]:",t,r)}render(){return this.state.hasError?e.jsxs("div",{style:{minHeight:"100vh",background:"#0B0409",color:"#FBF7F0",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center",fontFamily:"system-ui, sans-serif"},children:[e.jsx("h1",{style:{color:"#E63950",fontSize:28,marginBottom:12},children:"Cerebrexia '26"}),e.jsx("p",{style:{color:"#D4AF37",fontSize:16,marginBottom:20},children:"Something went wrong loading this view."}),e.jsx("button",{onClick:()=>{window.location.href="/"},style:{background:"#D4AF37",color:"#0B0409",border:"none",borderRadius:8,padding:"10px 24px",fontWeight:700,cursor:"pointer"},children:"Reload Website"})]}):this.props.children}}Se.createRoot(document.getElementById("root")).render(e.jsx(ie.StrictMode,{children:e.jsx(pt,{children:e.jsx(ut,{})})}));export{Ye as A,$e as L,B as S,se as W,E as _,V as a,e as j,R as s,de as u};
