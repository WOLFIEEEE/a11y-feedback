(function(a,y){typeof exports=="object"&&typeof module<"u"?y(exports):typeof define=="function"&&define.amd?define(["exports"],y):(a=typeof globalThis<"u"?globalThis:a||self,y(a.A11yFeedback={}))})(this,function(a){"use strict";const y={success:{role:"status",ariaLive:"polite",priority:"low",canMoveFocus:!1,autoDismiss:!0},info:{role:"status",ariaLive:"polite",priority:"low",canMoveFocus:!1,autoDismiss:!0},loading:{role:"status",ariaLive:"polite",priority:"low",canMoveFocus:!1,autoDismiss:!1},warning:{role:"alert",ariaLive:"assertive",priority:"high",canMoveFocus:!0,autoDismiss:!0},error:{role:"alert",ariaLive:"assertive",priority:"high",canMoveFocus:!0,autoDismiss:!1}},K={visual:!1,defaultTimeout:5e3,visualContainer:null,visualPosition:"top-right",maxVisualItems:5,debug:!1,regionPrefix:"a11y-feedback"},Z={success:5e3,info:5e3,loading:0,warning:8e3,error:0},P=100,ye=50,V=["​","‌","‍","\uFEFF"],ve=`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`,D={polite:"polite",assertive:"assertive"},w={region:"data-a11y-feedback",visual:"data-a11y-feedback-visual",visualItem:"data-a11y-feedback-item",feedbackId:"data-feedback-id",feedbackType:"data-feedback-type"},i={container:"a11y-feedback-container",item:"a11y-feedback-item",itemSuccess:"a11y-feedback-item--success",itemError:"a11y-feedback-item--error",itemWarning:"a11y-feedback-item--warning",itemInfo:"a11y-feedback-item--info",itemLoading:"a11y-feedback-item--loading",dismissButton:"a11y-feedback-dismiss",entering:"a11y-feedback-entering",exiting:"a11y-feedback-exiting",reducedMotion:"a11y-feedback-reduced-motion"},ke={"top-left":"top: 1rem; left: 1rem;","top-right":"top: 1rem; right: 1rem;","bottom-left":"bottom: 1rem; left: 1rem;","bottom-right":"bottom: 1rem; right: 1rem;","top-center":"top: 1rem; left: 50%; transform: translateX(-50%);","bottom-center":"bottom: 1rem; left: 50%; transform: translateX(-50%);"};let f={...K};const U=new Set;function W(e){const t={...f};return f={...f,...e},Te(t,f)&&J(),{...f}}function L(){return{...f}}function he(){return f={...K},J(),{...f}}function we(e){return U.add(e),()=>{U.delete(e)}}function H(){return f.visual}function m(){return f.debug}function Le(){return f.regionPrefix}function J(){const e={...f};U.forEach(t=>{try{t(e)}catch(n){f.debug&&console.error("[a11y-feedback] Config listener error:",n)}})}function Te(e,t){return Object.keys(e).some(o=>e[o]!==t[o])}function Ee(){return new Promise(e=>{queueMicrotask(e)})}function Fe(e){return new Promise(t=>{setTimeout(t,e)})}function Se(e){const t=e%V.length;return V[t]??V[0]??""}function Ce(){const e=Date.now().toString(36),t=Math.random().toString(36).substring(2,9);return`a11y-${e}-${t}`}function Me(e){return e===0||e===1/0||!Number.isFinite(e)}function Q(e,t=document){try{return t.querySelector(e)}catch{return null}}function Ae(e){if("disabled"in e&&e.disabled)return!1;const t=e.getAttribute("tabindex");return t!==null&&parseInt(t,10)<0?!1:["A","BUTTON","INPUT","SELECT","TEXTAREA","DETAILS","SUMMARY"].includes(e.tagName)?e.tagName==="A"?e.hasAttribute("href"):!0:e.isContentEditable?!0:t!==null&&parseInt(t,10)>=0}function $e(e){const t=e.getAttribute("aria-label");if(t!==null&&t.trim()!=="")return t.trim();const n=e.getAttribute("aria-labelledby");if(n!==null){const c=document.getElementById(n);if(c!==null){const s=c.textContent;if(s!==null&&s.trim()!=="")return s.trim()}}if("labels"in e){const c=e.labels;if(c!==null&&c.length>0){const s=c[0]?.textContent;if(s!=null&&s.trim()!=="")return s.trim()}}if("placeholder"in e){const c=e.placeholder;if(c!==""&&c!==void 0)return c}const o=e.getAttribute("title");if(o!==null&&o.trim()!=="")return o.trim();const r=e.textContent;return r!==null&&r.trim()!==""?r.trim():""}function E(e,t={}){const n=document.createElement(e);return Object.entries(t).forEach(([o,r])=>{n.setAttribute(o,r)}),n}function ee(e,t){e.setAttribute("style",t)}function j(e){e?.parentNode?.removeChild(e)}function v(){return typeof document<"u"&&typeof window<"u"}function te(){return v()?window.matchMedia("(prefers-reduced-motion: reduce)").matches:!1}let C=null,M=null,I=!1;function q(){if(!v())return!1;if(I&&C!==null&&M!==null)return!0;const e=Le(),t=document.getElementById(`${e}-${D.polite}`),n=document.getElementById(`${e}-${D.assertive}`);return t!==null&&n!==null?(C=t,M=n,I=!0,!0):(C=ne("polite",`${e}-${D.polite}`),M=ne("assertive",`${e}-${D.assertive}`),document.body.appendChild(C),document.body.appendChild(M),I=!0,!0)}function ne(e,t){const n=E("div",{id:t,[w.region]:e,"aria-live":e,"aria-atomic":"true",role:e==="assertive"?"alert":"status"});return ee(n,ve),n}function xe(e){return I||q(),e==="assertive"?M:C}async function De(e,t){const n=xe(e);n!==null&&(n.textContent="",await Ee(),n.textContent=t)}const g={lastPoliteMessage:null,lastAssertiveMessage:null,lastPoliteTimestamp:0,lastAssertiveTimestamp:0,zwcCounter:0};let N=null,R=null;async function Ie(e){q();const{message:t,ariaLive:n,options:o}=e,r=n==="assertive"?g.lastAssertiveMessage:g.lastPoliteMessage,c=n==="assertive"?g.lastAssertiveTimestamp:g.lastPoliteTimestamp,s=o.force===!0||t===r,l=s?Ne(t):t;Date.now()-c<P?await Re(e,l,n):await X(l,n),n==="assertive"?(g.lastAssertiveMessage=t,g.lastAssertiveTimestamp=Date.now()):(g.lastPoliteMessage=t,g.lastPoliteTimestamp=Date.now()),m()&&ze(e,l,s)}function Ne(e){const t=Se(g.zwcCounter);return g.zwcCounter++,`${e}${t}`}async function Re(e,t,n){n==="assertive"?(R!==null&&clearTimeout(R),await new Promise(o=>{R=setTimeout(()=>{X(t,"assertive").then(o),R=null},P)})):(N!==null&&clearTimeout(N),await new Promise(o=>{N=setTimeout(()=>{X(t,"polite").then(o),N=null},P)}))}async function X(e,t){await Fe(ye),await De(t,e)}function ze(e,t,n){console.warn("[a11y-feedback] Announcement:",{message:e.message,type:e.type,role:e.role,ariaLive:e.ariaLive,forced:n,contentLength:t.length,timestamp:new Date().toISOString()})}const oe=500,z=new Map,A=new Map;function ie(e,t){return`${t}:${e}`}function Be(e,t){const n=ie(e,t),o=z.get(n);return o===void 0?!1:Date.now()-o<oe}function Oe(e,t){const n=ie(e,t);z.set(n,Date.now()),Ue()}function _e(e){return A.get(e)}function Pe(e){A.set(e.id,e),m()&&console.warn("[a11y-feedback] Registered event:",{id:e.id,message:e.message,activeCount:A.size})}function ae(e){const t=A.delete(e);return t&&m()&&console.warn("[a11y-feedback] Unregistered event:",{id:e,activeCount:A.size}),t}function Ve(e){if(e.options.id!==void 0&&e.options.id!==""){const t=_e(e.options.id);if(t!==void 0)return ae(e.options.id),m()&&console.warn("[a11y-feedback] Replacing event:",{oldMessage:t.message,newMessage:e.message,id:e.options.id}),{shouldSkip:!1,replacedEvent:t,reason:"id_replacement"}}return e.options.force!==!0&&Be(e.message,e.type)?(m()&&console.warn("[a11y-feedback] Deduped event:",{message:e.message,type:e.type}),{shouldSkip:!0,replacedEvent:null,reason:"content_dedupe"}):{shouldSkip:!1,replacedEvent:null,reason:"none"}}function Ue(){const t=Date.now()-oe*2;for(const[n,o]of z.entries())o<t&&z.delete(n)}const Y={dismiss:"Dismiss",notificationsLabel:"Notifications",focusMovedTo:"Focus moved to {label}."},B={en:Y,es:{dismiss:"Cerrar",notificationsLabel:"Notificaciones",focusMovedTo:"Foco movido a {label}."},fr:{dismiss:"Fermer",notificationsLabel:"Notifications",focusMovedTo:"Focus déplacé vers {label}."},de:{dismiss:"Schließen",notificationsLabel:"Benachrichtigungen",focusMovedTo:"Fokus verschoben zu {label}."},it:{dismiss:"Chiudi",notificationsLabel:"Notifiche",focusMovedTo:"Focus spostato su {label}."},pt:{dismiss:"Fechar",notificationsLabel:"Notificações",focusMovedTo:"Foco movido para {label}."},ja:{dismiss:"閉じる",notificationsLabel:"通知",focusMovedTo:"フォーカスが{label}に移動しました。"},zh:{dismiss:"关闭",notificationsLabel:"通知",focusMovedTo:"焦点已移至{label}。"},ko:{dismiss:"닫기",notificationsLabel:"알림",focusMovedTo:"포커스가 {label}(으)로 이동됨."},ar:{dismiss:"إغلاق",notificationsLabel:"الإشعارات",focusMovedTo:"تم نقل التركيز إلى {label}."},he:{dismiss:"סגור",notificationsLabel:"התראות",focusMovedTo:"המיקוד הועבר אל {label}."}};function O(e){const t=L(),n=t.locale??"en";if(t.translations?.[e])return t.translations[e];const o=B[n];return o?.[e]?o[e]:Y[e]}function re(e,t){let n=O(e);for(const[o,r]of Object.entries(t))n=n.replace(`{${o}}`,r);return n}function se(){const e=L();return e.rtl===!0?!0:e.rtl===!1?!1:e.rtl==="auto"&&v()?(document.documentElement.dir||document.body.dir)==="rtl":v()?window.getComputedStyle(document.documentElement).direction==="rtl":!1}function We(){return Object.keys(B)}function He(e,t){B[e]={...Y,...B[e],...t}}function je(e){return y[e].canMoveFocus}function qe(e){const{type:t,options:n}=e;if(n.focus===void 0||n.focus==="")return{moved:!1,target:null,elementName:null,blockedReason:null};if(!je(t)){const o=`Focus movement blocked: ${t} type cannot move focus`;return m()&&console.warn("[a11y-feedback] Focus blocked:",{type:t,requestedTarget:n.focus,reason:o}),{moved:!1,target:n.focus,elementName:null,blockedReason:o}}return Xe(n.focus)}function Xe(e){if(!v())return{moved:!1,target:e,elementName:null,blockedReason:"DOM not available"};const t=Q(e);if(t===null)return m()&&console.warn("[a11y-feedback] Focus target not found:",e),{moved:!1,target:e,elementName:null,blockedReason:`Element not found: ${e}`};Ae(t)||(t.setAttribute("tabindex","-1"),m()&&console.warn("[a11y-feedback] Added tabindex=-1 to make element focusable:",e));const n=$e(t);try{t.focus();const o=document.activeElement===t;return m()&&console.warn("[a11y-feedback] Focus moved:",{target:e,elementName:n,success:o}),{moved:o,target:e,elementName:n!==""?n:null,blockedReason:o?null:"Focus failed to move"}}catch(o){return m()&&console.error("[a11y-feedback] Focus error:",o),{moved:!1,target:e,elementName:null,blockedReason:"Focus operation threw an error"}}}function Ye(e){return e!==null&&e!==""?re("focusMovedTo",{label:e}):"Focus moved."}function Ge(e,t,n){if(t.options.explainFocus!==!0||!n.moved)return e;const o=Ye(n.elementName);return`${e} ${o}`}let p=null;const k=new Map,T=new Map,Ke=`
  /* CSS Custom Properties for Theming */
  :root {
    /* Base colors */
    --a11y-feedback-bg: #1f2937;
    --a11y-feedback-text: #f9fafb;
    --a11y-feedback-text-muted: #9ca3af;
    --a11y-feedback-shadow: rgba(0, 0, 0, 0.1);
    
    /* Semantic colors */
    --a11y-feedback-success: #10b981;
    --a11y-feedback-error: #ef4444;
    --a11y-feedback-warning: #f59e0b;
    --a11y-feedback-info: #3b82f6;
    --a11y-feedback-loading: #8b5cf6;
    
    /* Focus and hover states */
    --a11y-feedback-focus-ring: #3b82f6;
    --a11y-feedback-hover-bg: rgba(255, 255, 255, 0.1);
    
    /* Spacing */
    --a11y-feedback-gap: 0.5rem;
    --a11y-feedback-padding: 0.875rem 1rem;
    --a11y-feedback-border-radius: 0.5rem;
    --a11y-feedback-border-width: 4px;
    --a11y-feedback-max-width: 24rem;
    
    /* Typography */
    --a11y-feedback-font-family: system-ui, -apple-system, sans-serif;
    --a11y-feedback-font-size: 0.875rem;
    --a11y-feedback-line-height: 1.4;
    
    /* Animation */
    --a11y-feedback-transition-duration: 0.2s;
    --a11y-feedback-transition-easing: ease;
  }

  /* Light mode overrides */
  @media (prefers-color-scheme: light) {
    :root {
      --a11y-feedback-bg: #ffffff;
      --a11y-feedback-text: #1f2937;
      --a11y-feedback-text-muted: #6b7280;
      --a11y-feedback-hover-bg: rgba(0, 0, 0, 0.05);
    }
  }

  .${i.container} {
    position: fixed;
    z-index: var(--a11y-feedback-z-index, 9999);
    display: flex;
    flex-direction: column;
    gap: var(--a11y-feedback-gap);
    max-width: var(--a11y-feedback-max-width);
    pointer-events: none;
  }

  .${i.item} {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: var(--a11y-feedback-padding);
    border-radius: var(--a11y-feedback-border-radius);
    background: var(--a11y-feedback-bg);
    color: var(--a11y-feedback-text);
    font-family: var(--a11y-feedback-font-family);
    font-size: var(--a11y-feedback-font-size);
    line-height: var(--a11y-feedback-line-height);
    box-shadow: 0 4px 6px -1px var(--a11y-feedback-shadow), 0 2px 4px -1px var(--a11y-feedback-shadow);
    pointer-events: auto;
    opacity: 1;
    transform: translateX(0);
    transition: opacity var(--a11y-feedback-transition-duration) var(--a11y-feedback-transition-easing), 
                transform var(--a11y-feedback-transition-duration) var(--a11y-feedback-transition-easing);
  }

  .${i.reducedMotion} .${i.item} {
    transition: none;
  }

  .${i.item}.${i.entering} {
    opacity: 0;
    transform: translateX(1rem);
  }

  .${i.item}.${i.exiting} {
    opacity: 0;
    transform: translateX(1rem);
  }

  /* RTL support */
  [dir="rtl"] .${i.item}.${i.entering},
  [dir="rtl"] .${i.item}.${i.exiting} {
    transform: translateX(-1rem);
  }

  .${i.itemSuccess} {
    border-left: var(--a11y-feedback-border-width) solid var(--a11y-feedback-success);
  }

  .${i.itemError} {
    border-left: var(--a11y-feedback-border-width) solid var(--a11y-feedback-error);
  }

  .${i.itemWarning} {
    border-left: var(--a11y-feedback-border-width) solid var(--a11y-feedback-warning);
  }

  .${i.itemInfo} {
    border-left: var(--a11y-feedback-border-width) solid var(--a11y-feedback-info);
  }

  .${i.itemLoading} {
    border-left: var(--a11y-feedback-border-width) solid var(--a11y-feedback-loading);
  }

  /* RTL border support */
  [dir="rtl"] .${i.itemSuccess},
  [dir="rtl"] .${i.itemError},
  [dir="rtl"] .${i.itemWarning},
  [dir="rtl"] .${i.itemInfo},
  [dir="rtl"] .${i.itemLoading} {
    border-left: none;
    border-right: var(--a11y-feedback-border-width) solid;
  }

  [dir="rtl"] .${i.itemSuccess} { border-right-color: var(--a11y-feedback-success); }
  [dir="rtl"] .${i.itemError} { border-right-color: var(--a11y-feedback-error); }
  [dir="rtl"] .${i.itemWarning} { border-right-color: var(--a11y-feedback-warning); }
  [dir="rtl"] .${i.itemInfo} { border-right-color: var(--a11y-feedback-info); }
  [dir="rtl"] .${i.itemLoading} { border-right-color: var(--a11y-feedback-loading); }

  .${i.item} [data-icon] {
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
  }

  .${i.item} [data-content] {
    flex: 1;
    min-width: 0;
  }

  .${i.dismissButton} {
    flex-shrink: 0;
    padding: 0.25rem;
    margin: -0.25rem -0.25rem -0.25rem 0.5rem;
    background: transparent;
    border: none;
    color: var(--a11y-feedback-text-muted);
    cursor: pointer;
    border-radius: 0.25rem;
    transition: color 0.15s ease, background-color 0.15s ease;
  }

  [dir="rtl"] .${i.dismissButton} {
    margin: -0.25rem 0.5rem -0.25rem -0.25rem;
  }

  .${i.dismissButton}:hover {
    color: var(--a11y-feedback-text);
    background: var(--a11y-feedback-hover-bg);
  }

  .${i.dismissButton}:focus {
    outline: 2px solid var(--a11y-feedback-focus-ring);
    outline-offset: 2px;
  }
`,ce={success:`<svg data-icon viewBox="0 0 20 20" fill="currentColor" style="color: #10b981;">
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
  </svg>`,error:`<svg data-icon viewBox="0 0 20 20" fill="currentColor" style="color: #ef4444;">
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
  </svg>`,warning:`<svg data-icon viewBox="0 0 20 20" fill="currentColor" style="color: #f59e0b;">
    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
  </svg>`,info:`<svg data-icon viewBox="0 0 20 20" fill="currentColor" style="color: #3b82f6;">
    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
  </svg>`,loading:`<svg data-icon viewBox="0 0 20 20" fill="currentColor" style="color: #8b5cf6;">
    <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
  </svg>`},Ze=`<svg viewBox="0 0 20 20" fill="currentColor" style="width: 1rem; height: 1rem;">
  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
</svg>`;let h=null;function le(){!v()||!H()||(de(),ue(),we(e=>{e.visual?(de(),ue()):nt()}))}function de(){if(!v()||h!==null)return;const e=L();h=document.createElement("style"),h.setAttribute("data-a11y-feedback-styles",""),e.cspNonce!==void 0&&e.cspNonce!==""&&h.setAttribute("nonce",e.cspNonce),h.textContent=Ke,document.head.appendChild(h)}function ue(){if(!v()||p!==null)return;const e=L();p=E("div",{[w.visual]:"",class:i.container,role:"region","aria-label":O("notificationsLabel")});const t=ke[e.visualPosition];ee(p,t),te()&&p.classList.add(i.reducedMotion),se()&&p.setAttribute("dir","rtl"),Je(e.visualContainer).appendChild(p)}function Je(e){return e===null?document.body:typeof e=="string"?Q(e)??document.body:e}function fe(e){if(!H()||(le(),p===null))return;const t=L();for(;k.size>=t.maxVisualItems;){const o=k.keys().next().value;o!==void 0&&typeof o=="string"&&$(o)}const n=Qe(e);p.appendChild(n),k.set(e.id,n),requestAnimationFrame(()=>{n.classList.remove(i.entering)}),me(e)}function Qe(e){const{type:t,message:n,id:o}=e,r=G(t),c=ce[t],s=E("div",{[w.visualItem]:"",[w.feedbackId]:o,[w.feedbackType]:t,class:`${i.item} ${r} ${i.entering}`,role:"status","aria-live":"off"}),l=E("span");l.innerHTML=c,s.appendChild(l);const d=E("span",{"data-content":""});d.textContent=n,s.appendChild(d);const _=E("button",{type:"button",class:i.dismissButton,"aria-label":O("dismiss")});return _.innerHTML=Ze,_.addEventListener("click",()=>{$(o)}),s.appendChild(_),e.options.className!==void 0&&e.options.className!==""&&s.classList.add(e.options.className),s}function G(e){return{success:i.itemSuccess,error:i.itemError,warning:i.itemWarning,info:i.itemInfo,loading:i.itemLoading}[e]}function me(e){if(!y[e.type].autoDismiss)return;const n=L(),o=e.options.timeout??Z[e.type]??n.defaultTimeout;if(Me(o))return;const r=setTimeout(()=>{$(e.id)},o);T.set(e.id,r)}function $(e){const t=k.get(e);if(t===void 0)return;const n=T.get(e);n!==void 0&&(clearTimeout(n),T.delete(e)),t.classList.add(i.exiting);const o=te()?0:200;setTimeout(()=>{j(t),k.delete(e),ae(e)},o)}function et(e){const t=k.get(e.id);if(t===void 0){fe(e);return}const n=t.querySelector("[data-content]");n!==null&&(n.textContent=e.message);const o=t.getAttribute(w.feedbackType);if(o!==e.type){if(o!==null){const l=G(o);t.classList.remove(l)}const c=G(e.type);t.classList.add(c),t.setAttribute(w.feedbackType,e.type);const s=t.querySelector("[data-icon]")?.parentElement;s!=null&&(s.innerHTML=ce[e.type])}const r=T.get(e.id);r!==void 0&&(clearTimeout(r),T.delete(e.id)),me(e)}function be(){for(const e of k.keys())$(e)}function tt(){return k.size}function nt(){be(),j(p),p=null,j(h),h=null;for(const e of T.values())clearTimeout(e);T.clear()}const ot=100,b=[];function it(){W({debug:!0}),console.warn("[a11y-feedback] Debug mode enabled")}function at(){W({debug:!1})}function rt(){return[...b]}function st(){b.length=0}function ge(e,t,n={}){const o={event:e,action:t,region:n.region??null,focusMoved:n.focusResult?.moved??!1,focusTarget:n.focusResult?.target??null,focusBlocked:n.focusResult?.blockedReason??null,visualShown:n.visualShown??!1};for(b.push(o);b.length>ot;)b.shift();m()&&ct(o)}function ct(e){const{event:t,action:n,region:o,focusMoved:r,focusTarget:c,focusBlocked:s,visualShown:l}=e,d=lt(t.type);console.warn(`%c[a11y-feedback]%c ${n.toUpperCase()}`,d.badge,d.action,{message:t.message,type:t.type,id:t.id,role:t.role,ariaLive:t.ariaLive,priority:t.priority,region:o,focusMoved:r,focusTarget:c,focusBlocked:s,visualShown:l,timestamp:new Date(t.timestamp).toISOString(),deduped:t.deduped,replaced:t.replaced})}function lt(e){const n={success:"#10b981",error:"#ef4444",warning:"#f59e0b",info:"#3b82f6",loading:"#8b5cf6"}[e]??"#6b7280";return{badge:`background: ${n}; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;`,action:`color: ${n}; font-weight: bold;`}}function dt(){const e={},t={};let n=0,o=0,r=0,c=0;for(const s of b){const l=s.event.type;e[l]=(e[l]??0)+1;const d=s.action;t[d]=(t[d]??0)+1,s.focusMoved&&n++,s.visualShown&&o++,s.event.deduped&&r++,s.event.replaced&&c++}return{total:b.length,byType:e,byAction:t,focusMoved:n,visualShown:o,deduped:r,replaced:c}}function ut(e=10){return b.slice(-e)}function ft(e){return b.filter(t=>t.event.type===e)}function mt(e){return b.filter(t=>t.action===e)}function bt(){return JSON.stringify(b,null,2)}const u=new Map;function pe(e,t){u.has(e)||u.set(e,new Set);const n=u.get(e);return n.add(t),()=>{n.delete(t)}}function gt(e){u.has("*")||u.set("*",new Set);const t=u.get("*");return t.add(e),()=>{t.delete(e)}}function pt(e){e===void 0?u.clear():u.delete(e)}function x(e,t){const n=u.get(e);n&&n.forEach(r=>{try{r(t)}catch(c){console.error(`[a11y-feedback] Event listener error for "${e}":`,c)}});const o=u.get("*");o&&o.forEach(r=>{try{r(e,t)}catch(c){console.error("[a11y-feedback] Wildcard listener error:",c)}})}function yt(e,t){const n=pe(e,o=>{n(),t(o)});return n}function vt(e){if(e===void 0){let t=0;return u.forEach(n=>{t+=n.size}),t}return u.get(e)?.size??0}function F(e){const t=(u.get(e)?.size??0)>0,n=(u.get("*")?.size??0)>0;return t||n}function kt(e,t,n={}){const o=y[t];return{id:n.id??Ce(),message:e,type:t,role:o.role,ariaLive:o.ariaLive,priority:o.priority,options:n,timestamp:Date.now(),replaced:!1,deduped:!1}}async function ht(e){q();const t=Ve(e);if(t.shouldSkip){const d={...e,deduped:!0};return ge(d,"deduped"),F("deduped")&&x("deduped",{event:d,reason:"duplicate"}),d}const n=t.replacedEvent!==null,o={...e,replaced:n};Pe(o),Oe(o.message,o.type);const r=qe(o),c=Ge(o.message,o,r),s={...o,message:c};await Ie(s);let l=!1;if(H()&&(le(),n?et(o):fe(o),l=!0),ge(o,n?"replaced":"announced",{region:o.ariaLive,focusResult:r,visualShown:l}),(F("announced")||F("replaced"))&&(n&&t.replacedEvent?x("replaced",{newEvent:o,previousEvent:t.replacedEvent}):x("announced",{event:o,region:o.ariaLive})),r.moved&&F("focusMoved")&&x("focusMoved",{event:o,target:r.target??"",elementName:r.elementName}),l&&F("visualShown")){const d=document.querySelector("[data-a11y-feedback-visual]");d&&x("visualShown",{event:o,container:d})}return o}async function S(e){const t=kt(e.message,e.type,e.options);return ht(t)}async function wt(e,t){return S({message:e,type:"success",options:t})}async function Lt(e,t){return S({message:e,type:"error",options:t})}async function Tt(e,t){return S({message:e,type:"warning",options:t})}async function Et(e,t){return S({message:e,type:"info",options:t})}async function Ft(e,t){return S({message:e,type:"loading",options:t})}const St=Object.assign(S,{success:wt,error:Lt,warning:Tt,info:Et,loading:Ft});function Ct(e){return typeof e=="string"&&["success","error","warning","info","loading"].includes(e)}function Mt(e){if(typeof e!="object"||e===null)return!1;const t=e;return!(t.id!==void 0&&typeof t.id!="string"||t.focus!==void 0&&typeof t.focus!="string"||t.explainFocus!==void 0&&typeof t.explainFocus!="boolean"||t.force!==void 0&&typeof t.force!="boolean"||t.timeout!==void 0&&typeof t.timeout!="number")}a.DEFAULT_TIMEOUTS=Z,a.FEEDBACK_SEMANTICS=y,a.clearFeedbackLog=st,a.configureFeedback=W,a.disableFeedbackDebug=at,a.dismissAllVisualFeedback=be,a.dismissVisualFeedback=$,a.enableFeedbackDebug=it,a.exportFeedbackLog=bt,a.formatTranslation=re,a.getActiveVisualCount=tt,a.getAvailableLocales=We,a.getConfig=L,a.getFeedbackByAction=mt,a.getFeedbackByType=ft,a.getFeedbackLog=rt,a.getFeedbackStats=dt,a.getListenerCount=vt,a.getRecentFeedback=ut,a.getTranslation=O,a.hasListeners=F,a.isFeedbackOptions=Mt,a.isFeedbackType=Ct,a.isRTL=se,a.notify=St,a.offFeedback=pt,a.onAnyFeedback=gt,a.onFeedback=pe,a.onceFeedback=yt,a.registerLocale=He,a.resetConfig=he,Object.defineProperty(a,Symbol.toStringTag,{value:"Module"})});
//# sourceMappingURL=a11y-feedback.umd.js.map
