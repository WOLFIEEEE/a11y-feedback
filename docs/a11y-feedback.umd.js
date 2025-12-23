(function(r,$){typeof exports=="object"&&typeof module<"u"?$(exports):typeof define=="function"&&define.amd?define(["exports"],$):(r=typeof globalThis<"u"?globalThis:r||self,$(r.A11yFeedback={}))})(this,function(r){"use strict";const $={success:{role:"status",ariaLive:"polite",priority:"low",canMoveFocus:!1,autoDismiss:!0},info:{role:"status",ariaLive:"polite",priority:"low",canMoveFocus:!1,autoDismiss:!0},loading:{role:"status",ariaLive:"polite",priority:"low",canMoveFocus:!1,autoDismiss:!1},warning:{role:"alert",ariaLive:"assertive",priority:"high",canMoveFocus:!0,autoDismiss:!0},error:{role:"alert",ariaLive:"assertive",priority:"high",canMoveFocus:!0,autoDismiss:!1}},Ne={visual:!1,defaultTimeout:5e3,visualContainer:null,visualPosition:"top-right",maxVisualItems:5,debug:!1,regionPrefix:"a11y-feedback"},$e={success:5e3,info:5e3,loading:0,warning:8e3,error:0},le=100,St=50,ue=["​","‌","‍","\uFEFF"],xt=`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`,ne={polite:"polite",assertive:"assertive"},R={region:"data-a11y-feedback",visual:"data-a11y-feedback-visual",visualItem:"data-a11y-feedback-item",feedbackId:"data-feedback-id",feedbackType:"data-feedback-type"},u={container:"a11y-feedback-container",item:"a11y-feedback-item",itemSuccess:"a11y-feedback-item--success",itemError:"a11y-feedback-item--error",itemWarning:"a11y-feedback-item--warning",itemInfo:"a11y-feedback-item--info",itemLoading:"a11y-feedback-item--loading",dismissButton:"a11y-feedback-dismiss",entering:"a11y-feedback-entering",exiting:"a11y-feedback-exiting",reducedMotion:"a11y-feedback-reduced-motion"},Lt={"top-left":"top: 1rem; left: 1rem;","top-right":"top: 1rem; right: 1rem;","bottom-left":"bottom: 1rem; left: 1rem;","bottom-right":"bottom: 1rem; right: 1rem;","top-center":"top: 1rem; left: 50%; transform: translateX(-50%);","bottom-center":"bottom: 1rem; left: 50%; transform: translateX(-50%);"},Mt={dismiss:"Escape"},Nt={success:[50],info:[30],loading:[20,50,20],warning:[100,50,100],error:[200,100,200]},$t=[25,50,75,100],c={actions:"a11y-feedback-actions",actionButton:"a11y-feedback-action",actionPrimary:"a11y-feedback-action--primary",actionSecondary:"a11y-feedback-action--secondary",actionDanger:"a11y-feedback-action--danger",progress:"a11y-feedback-progress",progressBar:"a11y-feedback-progress-bar",progressIndeterminate:"a11y-feedback-progress--indeterminate",richContent:"a11y-feedback-rich",richTitle:"a11y-feedback-rich-title",richDescription:"a11y-feedback-rich-description",richIcon:"a11y-feedback-rich-icon",richImage:"a11y-feedback-rich-image",richLink:"a11y-feedback-rich-link",group:"a11y-feedback-group",groupHeader:"a11y-feedback-group-header",groupBadge:"a11y-feedback-group-badge",groupCollapsed:"a11y-feedback-group--collapsed",groupExpanded:"a11y-feedback-group--expanded",center:"a11y-feedback-center",centerTrigger:"a11y-feedback-center-trigger",centerBadge:"a11y-feedback-center-badge",centerPanel:"a11y-feedback-center-panel",centerHeader:"a11y-feedback-center-header",centerList:"a11y-feedback-center-list",centerEmpty:"a11y-feedback-center-empty",dialog:"a11y-feedback-dialog",dialogBackdrop:"a11y-feedback-dialog-backdrop",dialogContent:"a11y-feedback-dialog-content",dialogTitle:"a11y-feedback-dialog-title",dialogInput:"a11y-feedback-dialog-input",dialogActions:"a11y-feedback-dialog-actions",unread:"a11y-feedback-unread"},Ie={history:"a11y-feedback-history",preferences:"a11y-feedback-prefs"};let w={...Ne};const fe=new Set;function ge(e){const t={...w};return w={...w,...e},Rt(t,w)&&Be(),{...w}}function p(){return{...w}}function It(){return w={...Ne},Be(),{...w}}function Ft(e){return fe.add(e),()=>{fe.delete(e)}}function me(){return w.visual}function E(){return w.debug}function Dt(){return w.regionPrefix}function Bt(){return w.grouping?.enabled??!1}function Fe(){return w.sounds}function Ht(){return w.haptics}function De(){return w.keyboard}function pe(){return w.grouping}function I(){return w.history}function Be(){const e={...w};fe.forEach(t=>{try{t(e)}catch(n){w.debug&&console.error("[a11y-feedback] Config listener error:",n)}})}function Rt(e,t){return Object.keys(e).some(o=>e[o]!==t[o])}function zt(){return new Promise(e=>{queueMicrotask(e)})}function Ot(e){return new Promise(t=>{setTimeout(t,e)})}function Pt(e){const t=e%ue.length;return ue[t]??ue[0]??""}function Vt(){const e=Date.now().toString(36),t=Math.random().toString(36).substring(2,9);return`a11y-${e}-${t}`}function Gt(e){return e===0||e===1/0||!Number.isFinite(e)}function He(e,t=document){try{return t.querySelector(e)}catch{return null}}function _t(e){if("disabled"in e&&e.disabled)return!1;const t=e.getAttribute("tabindex");return t!==null&&parseInt(t,10)<0?!1:["A","BUTTON","INPUT","SELECT","TEXTAREA","DETAILS","SUMMARY"].includes(e.tagName)?e.tagName==="A"?e.hasAttribute("href"):!0:e.isContentEditable?!0:t!==null&&parseInt(t,10)>=0}function Ut(e){const t=e.getAttribute("aria-label");if(t!==null&&t.trim()!=="")return t.trim();const n=e.getAttribute("aria-labelledby");if(n!==null){const a=document.getElementById(n);if(a!==null){const s=a.textContent;if(s!==null&&s.trim()!=="")return s.trim()}}if("labels"in e){const a=e.labels;if(a!==null&&a.length>0){const s=a[0]?.textContent;if(s!=null&&s.trim()!=="")return s.trim()}}if("placeholder"in e){const a=e.placeholder;if(a!==""&&a!==void 0)return a}const o=e.getAttribute("title");if(o!==null&&o.trim()!=="")return o.trim();const i=e.textContent;return i!==null&&i.trim()!==""?i.trim():""}function _(e,t={}){const n=document.createElement(e);return Object.entries(t).forEach(([o,i])=>{n.setAttribute(o,i)}),n}function Re(e,t){e.setAttribute("style",t)}function be(e){e?.parentNode?.removeChild(e)}function F(){return typeof document<"u"&&typeof window<"u"}function ze(){return F()?window.matchMedia("(prefers-reduced-motion: reduce)").matches:!1}let K=null,j=null,oe=!1;function ye(){if(!F())return!1;if(oe&&K!==null&&j!==null)return!0;const e=Dt(),t=document.getElementById(`${e}-${ne.polite}`),n=document.getElementById(`${e}-${ne.assertive}`);return t!==null&&n!==null?(K=t,j=n,oe=!0,!0):(K=Oe("polite",`${e}-${ne.polite}`),j=Oe("assertive",`${e}-${ne.assertive}`),document.body.appendChild(K),document.body.appendChild(j),oe=!0,!0)}function Oe(e,t){const n=_("div",{id:t,[R.region]:e,"aria-live":e,"aria-atomic":"true",role:e==="assertive"?"alert":"status"});return Re(n,xt),n}function qt(e){return oe||ye(),e==="assertive"?j:K}async function T(e,t){const n=qt(e);n!==null&&(n.textContent="",await zt(),n.textContent=t)}const L={lastPoliteMessage:null,lastAssertiveMessage:null,lastPoliteTimestamp:0,lastAssertiveTimestamp:0,zwcCounter:0};let ie=null,ae=null;async function Kt(e){ye();const{message:t,ariaLive:n,options:o}=e,i=n==="assertive"?L.lastAssertiveMessage:L.lastPoliteMessage,a=n==="assertive"?L.lastAssertiveTimestamp:L.lastPoliteTimestamp,s=o.force===!0||t===i,d=s?jt(t):t;Date.now()-a<le?await Wt(e,d,n):await he(d,n),n==="assertive"?(L.lastAssertiveMessage=t,L.lastAssertiveTimestamp=Date.now()):(L.lastPoliteMessage=t,L.lastPoliteTimestamp=Date.now()),E()&&Xt(e,d,s)}function jt(e){const t=Pt(L.zwcCounter);return L.zwcCounter++,`${e}${t}`}async function Wt(e,t,n){n==="assertive"?(ae!==null&&clearTimeout(ae),await new Promise(o=>{ae=setTimeout(()=>{he(t,"assertive").then(o),ae=null},le)})):(ie!==null&&clearTimeout(ie),await new Promise(o=>{ie=setTimeout(()=>{he(t,"polite").then(o),ie=null},le)}))}async function he(e,t){await Ot(St),await T(t,e)}function Xt(e,t,n){console.warn("[a11y-feedback] Announcement:",{message:e.message,type:e.type,role:e.role,ariaLive:e.ariaLive,forced:n,contentLength:t.length,timestamp:new Date().toISOString()})}const Pe=500,re=new Map,W=new Map;function Ve(e,t){return`${t}:${e}`}function Yt(e,t){const n=Ve(e,t),o=re.get(n);return o===void 0?!1:Date.now()-o<Pe}function Jt(e,t){const n=Ve(e,t);re.set(n,Date.now()),tn()}function Zt(e){return W.get(e)}function Qt(e){W.set(e.id,e),E()&&console.warn("[a11y-feedback] Registered event:",{id:e.id,message:e.message,activeCount:W.size})}function Ge(e){const t=W.delete(e);return t&&E()&&console.warn("[a11y-feedback] Unregistered event:",{id:e,activeCount:W.size}),t}function en(e){if(e.options.id!==void 0&&e.options.id!==""){const t=Zt(e.options.id);if(t!==void 0)return Ge(e.options.id),E()&&console.warn("[a11y-feedback] Replacing event:",{oldMessage:t.message,newMessage:e.message,id:e.options.id}),{shouldSkip:!1,replacedEvent:t,reason:"id_replacement"}}return e.options.force!==!0&&Yt(e.message,e.type)?(E()&&console.warn("[a11y-feedback] Deduped event:",{message:e.message,type:e.type}),{shouldSkip:!0,replacedEvent:null,reason:"content_dedupe"}):{shouldSkip:!1,replacedEvent:null,reason:"none"}}function tn(){const t=Date.now()-Pe*2;for(const[n,o]of re.entries())o<t&&re.delete(n)}const ve={dismiss:"Dismiss",notificationsLabel:"Notifications",focusMovedTo:"Focus moved to {label}.",confirmTitle:"Confirm",confirm:"Confirm",cancel:"Cancel",notificationCenter:"Notification Center",noNotifications:"No notifications",markAllRead:"Mark all as read",clearAll:"Clear all"},se={en:ve,es:{dismiss:"Cerrar",notificationsLabel:"Notificaciones",focusMovedTo:"Foco movido a {label}."},fr:{dismiss:"Fermer",notificationsLabel:"Notifications",focusMovedTo:"Focus déplacé vers {label}."},de:{dismiss:"Schließen",notificationsLabel:"Benachrichtigungen",focusMovedTo:"Fokus verschoben zu {label}."},it:{dismiss:"Chiudi",notificationsLabel:"Notifiche",focusMovedTo:"Focus spostato su {label}."},pt:{dismiss:"Fechar",notificationsLabel:"Notificações",focusMovedTo:"Foco movido para {label}."},ja:{dismiss:"閉じる",notificationsLabel:"通知",focusMovedTo:"フォーカスが{label}に移動しました。"},zh:{dismiss:"关闭",notificationsLabel:"通知",focusMovedTo:"焦点已移至{label}。"},ko:{dismiss:"닫기",notificationsLabel:"알림",focusMovedTo:"포커스가 {label}(으)로 이동됨."},ar:{dismiss:"إغلاق",notificationsLabel:"الإشعارات",focusMovedTo:"تم نقل التركيز إلى {label}."},he:{dismiss:"סגור",notificationsLabel:"התראות",focusMovedTo:"המיקוד הועבר אל {label}."}};function z(e){const t=p(),n=t.locale??"en";if(t.translations?.[e])return t.translations[e];const o=se[n];return o?.[e]?o[e]:ve[e]}function _e(e,t){let n=z(e);for(const[o,i]of Object.entries(t))n=n.replace(`{${o}}`,i);return n}function Ue(){const e=p();return e.rtl===!0?!0:e.rtl===!1?!1:e.rtl==="auto"&&F()?(document.documentElement.dir||document.body.dir)==="rtl":F()?window.getComputedStyle(document.documentElement).direction==="rtl":!1}function nn(){return Object.keys(se)}function on(e,t){se[e]={...ve,...se[e],...t}}function an(e){return $[e].canMoveFocus}function rn(e){const{type:t,options:n}=e;if(n.focus===void 0||n.focus==="")return{moved:!1,target:null,elementName:null,blockedReason:null};if(!an(t)){const o=`Focus movement blocked: ${t} type cannot move focus`;return E()&&console.warn("[a11y-feedback] Focus blocked:",{type:t,requestedTarget:n.focus,reason:o}),{moved:!1,target:n.focus,elementName:null,blockedReason:o}}return sn(n.focus)}function sn(e){if(!F())return{moved:!1,target:e,elementName:null,blockedReason:"DOM not available"};const t=He(e);if(t===null)return E()&&console.warn("[a11y-feedback] Focus target not found:",e),{moved:!1,target:e,elementName:null,blockedReason:`Element not found: ${e}`};_t(t)||(t.setAttribute("tabindex","-1"),E()&&console.warn("[a11y-feedback] Added tabindex=-1 to make element focusable:",e));const n=Ut(t);try{t.focus();const o=document.activeElement===t;return E()&&console.warn("[a11y-feedback] Focus moved:",{target:e,elementName:n,success:o}),{moved:o,target:e,elementName:n!==""?n:null,blockedReason:o?null:"Focus failed to move"}}catch(o){return E()&&console.error("[a11y-feedback] Focus error:",o),{moved:!1,target:e,elementName:null,blockedReason:"Focus operation threw an error"}}}function cn(e){return e!==null&&e!==""?_e("focusMovedTo",{label:e}):"Focus moved."}function dn(e,t,n){if(t.options.explainFocus!==!0||!n.moved)return e;const o=cn(n.elementName);return`${e} ${o}`}const ke=new Map;function we(e){let t=ke.get(e);return t||(t={focusedIndex:-1,processing:!1,processingActions:new Map},ke.set(e,t)),t}function ln(e){ke.delete(e)}function un(e="secondary"){switch(e){case"primary":return c.actionPrimary;case"danger":return c.actionDanger;case"secondary":default:return c.actionSecondary}}function fn(e,t,n){const o=document.createElement("button");if(o.type="button",o.className=`${c.actionButton} ${un(e.variant)}`,o.setAttribute("data-action-id",e.id),o.setAttribute("data-notification-id",t),e.ariaLabel&&o.setAttribute("aria-label",e.ariaLabel),e.icon){const a=document.createElement("span");a.className="a11y-feedback-action-icon",a.setAttribute("aria-hidden","true"),typeof e.icon=="string"?a.innerHTML=e.icon:e.icon instanceof SVGElement&&a.appendChild(e.icon.cloneNode(!0)),o.appendChild(a)}const i=document.createElement("span");return i.className="a11y-feedback-action-label",i.textContent=e.label,o.appendChild(i),o.addEventListener("click",async a=>{a.preventDefault(),a.stopPropagation();const s=we(t);if(!s.processingActions.get(e.id)){s.processingActions.set(e.id,!0),o.setAttribute("aria-busy","true"),o.disabled=!0;try{const d=e.onClick();d instanceof Promise&&await d,e.closeOnClick!==!1&&n&&n()}catch(d){p().debug&&console.error("[a11y-feedback] Action error:",d)}finally{s.processingActions.set(e.id,!1),o.setAttribute("aria-busy","false"),o.disabled=!1}}}),o.addEventListener("keydown",a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),o.click())}),o}function gn(e,t,n,o){const i=document.createElement("div");return i.className=c.actions,i.setAttribute("role","group"),i.setAttribute("aria-label","Notification actions"),e.forEach((a,s)=>{const d=fn(a,t,o);s===0&&n.type==="error"&&d.setAttribute("data-autofocus","true"),i.appendChild(d)}),mn(i,t),i}function mn(e,t){const n=e.querySelectorAll("button");if(n.length===0)return;const o=we(t);e.addEventListener("keydown",i=>{const a=i.target;if(!a.matches("button"))return;const s=Array.from(n).indexOf(a);switch(i.key){case"ArrowRight":case"ArrowDown":i.preventDefault();{const d=(s+1)%n.length,m=n[d];m&&(m.focus(),o.focusedIndex=d)}break;case"ArrowLeft":case"ArrowUp":i.preventDefault();{const d=(s-1+n.length)%n.length,m=n[d];m&&(m.focus(),o.focusedIndex=d)}break;case"Home":i.preventDefault();{const d=n[0];d&&(d.focus(),o.focusedIndex=0)}break;case"End":i.preventDefault();{const d=n[n.length-1];d&&(d.focus(),o.focusedIndex=n.length-1)}break}})}function pn(e){const t=document.querySelector(`[data-notification-id="${e}"] .${c.actions}`);if(!t)return!1;const n=t.querySelector("button");if(n){n.focus();const o=we(e);return o.focusedIndex=0,!0}return!1}function bn(e){if(e.length===0)return"";const t=e[0];if(e.length===1&&t)return`Action available: ${t.label}`;const n=e.map(o=>o.label).join(", ");return`${e.length} actions available: ${n}`}async function yn(e,t){const n=document.querySelector(`[data-notification-id="${e}"] [data-action-id="${t}"]`);n&&n.click()}function hn(){return`
    .${c.actions} {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.75rem;
      flex-wrap: wrap;
    }

    .${c.actionButton} {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 0.375rem;
      border: 1px solid transparent;
      cursor: pointer;
      transition: background-color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
      font-family: inherit;
      line-height: 1.4;
    }

    .${c.actionButton}:focus {
      outline: 2px solid var(--a11y-feedback-focus-ring, #3b82f6);
      outline-offset: 2px;
    }

    .${c.actionButton}:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .${c.actionButton}[aria-busy="true"] {
      position: relative;
    }

    .${c.actionButton}[aria-busy="true"]::after {
      content: '';
      position: absolute;
      width: 1em;
      height: 1em;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: a11y-feedback-spin 0.6s linear infinite;
    }

    .${c.actionPrimary} {
      background-color: var(--a11y-feedback-action-primary-bg, #3b82f6);
      color: var(--a11y-feedback-action-primary-text, #ffffff);
    }

    .${c.actionPrimary}:hover:not(:disabled) {
      background-color: var(--a11y-feedback-action-primary-hover, #2563eb);
    }

    .${c.actionSecondary} {
      background-color: var(--a11y-feedback-action-secondary-bg, transparent);
      color: var(--a11y-feedback-action-secondary-text, currentColor);
      border-color: var(--a11y-feedback-action-secondary-border, currentColor);
    }

    .${c.actionSecondary}:hover:not(:disabled) {
      background-color: var(--a11y-feedback-action-secondary-hover, rgba(255, 255, 255, 0.1));
    }

    .${c.actionDanger} {
      background-color: var(--a11y-feedback-action-danger-bg, #ef4444);
      color: var(--a11y-feedback-action-danger-text, #ffffff);
    }

    .${c.actionDanger}:hover:not(:disabled) {
      background-color: var(--a11y-feedback-action-danger-hover, #dc2626);
    }

    .a11y-feedback-action-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1em;
      height: 1em;
    }

    .a11y-feedback-action-icon svg {
      width: 100%;
      height: 100%;
    }

    @keyframes a11y-feedback-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @media (prefers-reduced-motion: reduce) {
      .${c.actionButton}[aria-busy="true"]::after {
        animation: none;
        border-style: dotted;
      }
    }
  `}const A=new Map;function vn(e,t,n={}){const o={value:n.initialValue??0,max:n.max??100,indeterminate:n.indeterminate??!1,lastAnnouncedAt:0,announceAt:n.announceAt??$t,active:!0,element:null,event:null,message:t};return A.set(e,o),!o.indeterminate&&o.value>0&&Ke(e,o),{update:(a,s)=>{kn(e,a,s)},complete:a=>{wn(e,a)},fail:a=>{Cn(e,a)},getValue:()=>A.get(e)?.value??0,isActive:()=>A.get(e)?.active??!1,dismiss:()=>{An(e)}}}function kn(e,t,n){const o=A.get(e);!o||!o.active||(o.value=Math.max(0,Math.min(o.max,t)),n&&(o.message=n),o.element&&Tn(o.element,o),En(e,o))}function wn(e,t){const n=A.get(e);if(!n||!n.active)return;if(n.active=!1,n.value=n.max,n.element){const i=n.element.querySelector(`.${c.progressBar}`);i&&(i.style.width="100%"),n.element.classList.remove("a11y-feedback-item--loading"),n.element.classList.add("a11y-feedback-item--success")}const o=t||`${n.message} - Complete`;T("polite",o),setTimeout(()=>{qe(e)},5e3)}function Cn(e,t){const n=A.get(e);if(!n||!n.active)return;if(n.active=!1,n.element){const i=n.element.querySelector(`.${c.progressBar}`);i&&i.classList.add("a11y-feedback-progress-bar--error"),n.element.classList.remove("a11y-feedback-item--loading"),n.element.classList.add("a11y-feedback-item--error")}const o=t||`${n.message} - Failed`;T("assertive",o)}function An(e){const t=A.get(e);t&&(t.active=!1,qe(e))}function qe(e){A.delete(e)}function En(e,t){if(t.indeterminate)return;const n=Math.round(t.value/t.max*100);for(const o of t.announceAt)if(n>=o&&t.lastAnnouncedAt<o){t.lastAnnouncedAt=o,Ke(e,t);break}}function Ke(e,t){const n=Math.round(t.value/t.max*100),o=`${t.message}: ${n}% complete`;T("polite",o),p().debug&&console.log(`[a11y-feedback] Progress ${e}: ${n}%`)}function Tn(e,t){const n=e.querySelector(`.${c.progressBar}`),o=e.querySelector(".a11y-feedback-content");if(n&&!t.indeterminate){const i=t.value/t.max*100;n.style.width=`${i}%`,n.setAttribute("aria-valuenow",String(t.value))}o&&(o.textContent=t.message)}function Sn(e,t={}){const n=A.get(e),o=n?.value??t.initialValue??0,i=n?.max??t.max??100,a=n?.indeterminate??t.indeterminate??!1,s=document.createElement("div");s.className=c.progress,a&&s.classList.add(c.progressIndeterminate);const d=document.createElement("div");return d.className=c.progressBar,d.setAttribute("role","progressbar"),d.setAttribute("aria-valuemin","0"),d.setAttribute("aria-valuemax",String(i)),a?d.removeAttribute("aria-valuenow"):(d.setAttribute("aria-valuenow",String(o)),d.style.width=`${o/i*100}%`),s.appendChild(d),n&&(n.element=s.parentElement||s),s}function xn(e,t){const n=A.get(e);n&&(n.element=t)}function je(e){return A.get(e)?.active??!1}function Ln(e){const t=A.get(e);return t?Math.round(t.value/t.max*100):0}function Mn(){return`
    .${c.progress} {
      width: 100%;
      height: 4px;
      background-color: var(--a11y-feedback-progress-bg, rgba(255, 255, 255, 0.2));
      border-radius: 2px;
      overflow: hidden;
      margin-top: 0.5rem;
    }

    .${c.progressBar} {
      height: 100%;
      background-color: var(--a11y-feedback-progress-fill, #3b82f6);
      border-radius: 2px;
      transition: width 0.3s ease;
    }

    .${c.progressBar}--error {
      background-color: var(--a11y-feedback-error, #ef4444);
    }

    .${c.progressIndeterminate} .${c.progressBar} {
      width: 30%;
      animation: a11y-feedback-progress-indeterminate 1.5s ease-in-out infinite;
    }

    @keyframes a11y-feedback-progress-indeterminate {
      0% {
        transform: translateX(-100%);
      }
      50% {
        transform: translateX(200%);
      }
      100% {
        transform: translateX(-100%);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .${c.progressBar} {
        transition: none;
      }
      
      .${c.progressIndeterminate} .${c.progressBar} {
        animation: none;
        width: 100%;
        opacity: 0.5;
      }
    }
  `}const Nn=new Set(["b","i","u","strong","em","br","span","p","ul","ol","li","code","pre","mark","small"]),$n=new Set(["class","id","aria-label","aria-hidden","role"]);function We(e){const t=document.createElement("div");t.innerHTML=e;const n=o=>{if(o.nodeType===Node.ELEMENT_NODE){const i=o,a=i.tagName.toLowerCase();if(!Nn.has(a)){i.replaceWith(...Array.from(i.childNodes));return}Array.from(i.attributes).forEach(s=>{$n.has(s.name.toLowerCase())||i.removeAttribute(s.name)}),Array.from(i.attributes).forEach(s=>{s.name.startsWith("on")&&i.removeAttribute(s.name)})}Array.from(o.childNodes).forEach(n)};return n(t),t.innerHTML}function In(e){const t=document.createElement("div");if(t.className=c.richIcon,t.setAttribute("aria-hidden","true"),typeof e=="string")t.innerHTML=Fn(e);else if(typeof e=="function"){const n=e();t.appendChild(n)}else e instanceof SVGElement&&t.appendChild(e.cloneNode(!0));return t}function Fn(e){const t=document.createElement("div");return t.innerHTML=e,t.querySelectorAll("script").forEach(i=>i.remove()),t.querySelectorAll("*").forEach(i=>{Array.from(i.attributes).forEach(a=>{a.name.startsWith("on")&&i.removeAttribute(a.name)})}),t.innerHTML}function Dn(e){if(!e.src||!e.alt)return p().debug&&console.warn("[a11y-feedback] Image missing required src or alt"),null;const t=document.createElement("div");t.className=c.richImage;const n=document.createElement("img");return n.src=e.src,n.alt=e.alt,n.loading="lazy",e.width&&(n.width=e.width),e.height&&(n.height=e.height),n.onerror=()=>{t.style.display="none",p().debug&&console.warn("[a11y-feedback] Image failed to load:",e.src)},t.appendChild(n),t}function Bn(e){const t=document.createElement("a");if(t.className=c.richLink,t.href=e.href,t.textContent=e.text,e.external){t.target="_blank",t.rel="noopener noreferrer";const n=document.createElement("span");n.className="a11y-feedback-external-icon",n.setAttribute("aria-hidden","true"),n.innerHTML="↗",t.appendChild(n);const o=document.createElement("span");o.className="a11y-sr-only",o.textContent=" (opens in new tab)",t.appendChild(o)}return e.ariaLabel&&t.setAttribute("aria-label",e.ariaLabel),t}function Xe(e,t){const n=document.createElement("div");n.className=c.richContent,e.icon&&n.appendChild(In(e.icon));const o=document.createElement("div");if(o.className="a11y-feedback-rich-body",e.title){const i=document.createElement("div");i.className=c.richTitle,i.textContent=e.title,o.appendChild(i)}if(e.description||t){const i=document.createElement("div");i.className=c.richDescription,i.textContent=e.description||t||"",o.appendChild(i)}if(e.html){const i=document.createElement("div");i.className="a11y-feedback-rich-html",i.innerHTML=We(e.html),o.appendChild(i)}if(e.image){const i=Dn(e.image);i&&o.appendChild(i)}if(e.link){const i=document.createElement("div");i.className="a11y-feedback-rich-link-wrapper",i.appendChild(Bn(e.link)),o.appendChild(i)}return n.appendChild(o),n}function Hn(e,t){const n=[];return e.title&&n.push(e.title),e.description?n.push(e.description):t&&n.push(t),e.link&&n.push(`Link: ${e.link.text}`),e.image?.alt&&n.push(`Image: ${e.image.alt}`),n.join(". ")}const Rn={success:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',error:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',warning:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',loading:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>'};function zn(){return`
    .${c.richContent} {
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
    }

    .${c.richIcon} {
      flex-shrink: 0;
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .${c.richIcon} svg {
      width: 100%;
      height: 100%;
    }

    .a11y-feedback-rich-body {
      flex: 1;
      min-width: 0;
    }

    .${c.richTitle} {
      font-weight: 600;
      font-size: 1rem;
      margin-bottom: 0.25rem;
      line-height: 1.3;
    }

    .${c.richDescription} {
      font-size: 0.875rem;
      opacity: 0.9;
      line-height: 1.5;
    }

    .a11y-feedback-rich-html {
      font-size: 0.875rem;
      line-height: 1.5;
      margin-top: 0.5rem;
    }

    .a11y-feedback-rich-html code {
      background-color: rgba(0, 0, 0, 0.2);
      padding: 0.125rem 0.375rem;
      border-radius: 0.25rem;
      font-family: ui-monospace, monospace;
      font-size: 0.85em;
    }

    .${c.richImage} {
      margin-top: 0.75rem;
      max-width: 100%;
      border-radius: 0.375rem;
      overflow: hidden;
    }

    .${c.richImage} img {
      display: block;
      max-width: 100%;
      height: auto;
    }

    .a11y-feedback-rich-link-wrapper {
      margin-top: 0.75rem;
    }

    .${c.richLink} {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      color: var(--a11y-feedback-link-color, #60a5fa);
      text-decoration: underline;
      text-underline-offset: 2px;
      transition: color 0.15s ease;
    }

    .${c.richLink}:hover {
      color: var(--a11y-feedback-link-hover, #93c5fd);
    }

    .${c.richLink}:focus {
      outline: 2px solid var(--a11y-feedback-focus-ring, #3b82f6);
      outline-offset: 2px;
    }

    .a11y-feedback-external-icon {
      font-size: 0.8em;
    }

    .a11y-sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      .${c.richLink} {
        transition: none;
      }
    }
  `}const v={groups:new Map,notificationToGroup:new Map,listeners:new Set};function On(e,t){return t?.groupBy?t.groupBy(e):e.options.group?e.options.group:null}function Ce(e){const t=e.notifications.length,n=e.notifications[0]?.type||"notification";return t===1?e.notifications[0]?.message||`1 ${n}`:`${t} ${n}s`}function Ye(e){const t=pe();if(!t?.enabled)return null;const n=On(e,t);if(!n)return null;let o=v.groups.get(n);const i=Date.now();if(o){const a=t.threshold??5e3;if(i-o.updatedAt>a)o=Je(n,e,i);else{const d=t.maxGroupSize??10;o.notifications.length<d&&(o={...o,notifications:[...o.notifications,e],updatedAt:i,summary:t.summarize?t.summarize({...o,notifications:[...o.notifications,e]}):Ce({...o,notifications:[...o.notifications,e]})},v.groups.set(n,o))}}else o=Je(n,e,i);return v.notificationToGroup.set(e.id,n),ce(),Kn(o),o}function Je(e,t,n){const o=pe(),i={id:e,notifications:[t],collapsed:!0,summary:o?.summarize?o.summarize({id:e,notifications:[t],collapsed:!0,summary:"",createdAt:n,updatedAt:n}):Ce({notifications:[t]}),createdAt:n,updatedAt:n};return v.groups.set(e,i),i}function Pn(e){const t=v.notificationToGroup.get(e);if(!t)return;const n=v.groups.get(t);if(!n){v.notificationToGroup.delete(e);return}const o=n.notifications.filter(i=>i.id!==e);if(o.length===0)v.groups.delete(t);else{const i=pe(),a={...n,notifications:o,updatedAt:Date.now(),summary:i?.summarize?i.summarize({...n,notifications:o}):Ce({...n,notifications:o})};v.groups.set(t,a)}v.notificationToGroup.delete(e),ce()}function Vn(e){const t=v.groups.get(e);if(!t)return;const n={...t,collapsed:!t.collapsed};v.groups.set(e,n),ce();const o=n.collapsed?"collapsed":"expanded";T("polite",`Notification group ${o}`)}function Ae(){return Array.from(v.groups.values())}function Gn(e){return v.groups.get(e)}function _n(e){const t=v.notificationToGroup.get(e);if(t)return v.groups.get(t)}function Un(){v.groups.clear(),v.notificationToGroup.clear(),ce()}function qn(e){return v.listeners.add(e),()=>{v.listeners.delete(e)}}function ce(){const e=Ae();v.listeners.forEach(t=>{try{t(e)}catch(n){p().debug&&console.error("[a11y-feedback] Group listener error:",n)}})}function Kn(e){e.notifications.length>1&&T("polite",e.summary)}function jn(){return`
    .${c.group} {
      border: 1px solid var(--a11y-feedback-group-border, rgba(255, 255, 255, 0.2));
      border-radius: 0.5rem;
      overflow: hidden;
    }

    .${c.groupHeader} {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.75rem 1rem;
      background-color: var(--a11y-feedback-group-header-bg, rgba(255, 255, 255, 0.05));
      border: none;
      color: inherit;
      font: inherit;
      cursor: pointer;
      text-align: left;
      transition: background-color 0.15s ease;
    }

    .${c.groupHeader}:hover {
      background-color: var(--a11y-feedback-group-header-hover, rgba(255, 255, 255, 0.1));
    }

    .${c.groupHeader}:focus {
      outline: 2px solid var(--a11y-feedback-focus-ring, #3b82f6);
      outline-offset: -2px;
    }

    .${c.groupBadge} {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 1.5rem;
      height: 1.5rem;
      padding: 0 0.5rem;
      background-color: var(--a11y-feedback-group-badge-bg, #3b82f6);
      color: var(--a11y-feedback-group-badge-text, #ffffff);
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .a11y-feedback-group-content {
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .${c.groupCollapsed} .a11y-feedback-group-content {
      display: none;
    }

    .${c.groupHeader}::before {
      content: '';
      display: inline-block;
      width: 0.5rem;
      height: 0.5rem;
      border-right: 2px solid currentColor;
      border-bottom: 2px solid currentColor;
      transform: rotate(-45deg);
      transition: transform 0.15s ease;
    }

    .${c.groupExpanded} .${c.groupHeader}::before {
      transform: rotate(45deg);
    }

    @media (prefers-reduced-motion: reduce) {
      .${c.groupHeader},
      .${c.groupHeader}::before {
        transition: none;
      }
    }
  `}const f={context:null,buffers:new Map,preloaded:!1,muted:!1,gainNode:null,prefersReducedData:!1};function Wn(e){if(f.context)return;const t=e||Fe();if(t?.enabled){if(t.respectReducedData!==!1&&navigator.connection?.saveData){f.prefersReducedData=!0,p().debug&&console.log("[a11y-feedback] Sounds disabled due to reduced data preference");return}try{f.context=new(window.AudioContext||window.webkitAudioContext),f.gainNode=f.context.createGain(),f.gainNode.gain.value=t.volume??.5,f.gainNode.connect(f.context.destination),p().debug&&console.log("[a11y-feedback] Sound manager initialized")}catch(n){p().debug&&console.error("[a11y-feedback] Failed to initialize audio context:",n)}}}async function Xn(){if(f.preloaded||!f.context)return;const e=Fe();if(!e?.sounds){f.preloaded=!0;return}const t=[];for(const[n,o]of Object.entries(e.sounds))o&&(o instanceof AudioBuffer?f.buffers.set(n,o):typeof o=="string"&&t.push(Yn(n,o)));await Promise.allSettled(t),f.preloaded=!0,p().debug&&console.log("[a11y-feedback] Sounds preloaded:",f.buffers.size)}async function Yn(e,t){if(f.context)try{const o=await(await fetch(t)).arrayBuffer(),i=await f.context.decodeAudioData(o);f.buffers.set(e,i)}catch(n){p().debug&&console.error(`[a11y-feedback] Failed to load sound for ${e}:`,n)}}function Ze(e){if(!f.context||!f.gainNode||f.muted||f.prefersReducedData)return;f.context.state==="suspended"&&f.context.resume();const t=f.buffers.get(e);if(t){const n=f.context.createBufferSource();n.buffer=t,n.connect(f.gainNode),n.start(0)}else Jn(e)}function Jn(e){if(!f.context||!f.gainNode)return;const t=f.context.createOscillator(),n=f.context.createGain(),i={success:{freq:880,duration:.15,waveform:"sine"},info:{freq:440,duration:.1,waveform:"sine"},warning:{freq:330,duration:.2,waveform:"triangle"},error:{freq:220,duration:.3,waveform:"sawtooth"},loading:{freq:660,duration:.05,waveform:"sine"}}[e];t.frequency.value=i.freq,t.type=i.waveform;const a=f.context.currentTime;n.gain.setValueAtTime(0,a),n.gain.linearRampToValueAtTime(.3,a+.01),n.gain.linearRampToValueAtTime(0,a+i.duration),t.connect(n),n.connect(f.gainNode),t.start(a),t.stop(a+i.duration+.01)}function Zn(e){f.gainNode&&(f.gainNode.gain.value=Math.max(0,Math.min(1,e)))}function Qn(){return f.gainNode?.gain.value??.5}function eo(){f.muted=!0,p().debug&&console.log("[a11y-feedback] Sounds muted")}function to(){f.muted=!1,p().debug&&console.log("[a11y-feedback] Sounds unmuted")}function no(){return f.muted=!f.muted,f.muted}function oo(){f.context&&(f.context.close(),f.context=null),f.gainNode=null,f.buffers.clear(),f.preloaded=!1,f.muted=!1,p().debug&&console.log("[a11y-feedback] Sound manager destroyed")}const y={enabled:!1,patterns:new Map,prefersReducedMotion:!1,supportsVibration:!1};function io(){return"vibrate"in navigator&&typeof navigator.vibrate=="function"}function ao(){return typeof window>"u"||!window.matchMedia?!1:window.matchMedia("(prefers-reduced-motion: reduce)").matches}function ro(e){const t=e||Ht();if(!t?.enabled){y.enabled=!1;return}if(y.supportsVibration=io(),!y.supportsVibration){p().debug&&console.log("[a11y-feedback] Haptics not supported on this device");return}if(t.respectReducedMotion!==!1){if(y.prefersReducedMotion=ao(),y.prefersReducedMotion){p().debug&&console.log("[a11y-feedback] Haptics disabled due to reduced motion preference");return}typeof window<"u"&&window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change",o=>{y.prefersReducedMotion=o.matches,p().debug&&console.log("[a11y-feedback] Reduced motion preference changed:",o.matches)})}y.patterns.clear();for(const[n,o]of Object.entries(Nt))y.patterns.set(n,o);if(t.patterns)for(const[n,o]of Object.entries(t.patterns))o&&y.patterns.set(n,o);y.enabled=!0,p().debug&&console.log("[a11y-feedback] Haptic manager initialized")}function Qe(e){if(!y.enabled||!y.supportsVibration||y.prefersReducedMotion)return!1;const t=y.patterns.get(e);if(!t)return!1;try{return navigator.vibrate(t),p().debug&&console.log(`[a11y-feedback] Haptic triggered for ${e}:`,t),!0}catch(n){return p().debug&&console.error("[a11y-feedback] Haptic error:",n),!1}}function so(e){if(!y.enabled||!y.supportsVibration||y.prefersReducedMotion)return!1;try{return navigator.vibrate(e),!0}catch(t){return p().debug&&console.error("[a11y-feedback] Haptic error:",t),!1}}function Ee(){if(y.supportsVibration)try{navigator.vibrate(0)}catch{}}function co(){y.supportsVibration&&!y.prefersReducedMotion&&(y.enabled=!0,p().debug&&console.log("[a11y-feedback] Haptics enabled"))}function lo(){y.enabled=!1,Ee(),p().debug&&console.log("[a11y-feedback] Haptics disabled")}function uo(){return y.enabled}function fo(){return y.supportsVibration}function go(){Ee(),y.enabled=!1,y.patterns.clear(),p().debug&&console.log("[a11y-feedback] Haptic manager destroyed")}const g={initialized:!1,focusedIndex:-1,notificationIds:[],shortcuts:new Map,keydownHandler:null,focusTrapActive:!1,focusTrapContainer:null};function mo(e){if(g.initialized)return;const t=e||De();t?.enabled!==!1&&(po(t),t?.shortcuts&&Object.entries(t.shortcuts).forEach(([n,o])=>{de(n,o)}),g.keydownHandler=yo,document.addEventListener("keydown",g.keydownHandler),g.initialized=!0,p().debug&&console.log("[a11y-feedback] Keyboard manager initialized"))}function po(e){const t=e?.dismissKey||Mt.dismiss;de(t,()=>{const n=g.notificationIds[g.focusedIndex];n&&V(n)})}function de(e,t){g.shortcuts.set(tt(e),t)}function et(e){g.shortcuts.delete(tt(e))}function tt(e){return e.toLowerCase().split("+").map(t=>t.trim()).sort((t,n)=>{const o=["ctrl","alt","shift","meta"],i=o.includes(t),a=o.includes(n);return i&&!a?-1:!i&&a?1:t.localeCompare(n)}).join("+")}function bo(e){const t=[];return e.ctrlKey&&t.push("ctrl"),e.altKey&&t.push("alt"),e.shiftKey&&t.push("shift"),e.metaKey&&t.push("meta"),["Control","Alt","Shift","Meta"].includes(e.key)||t.push(e.key.toLowerCase()),t.sort((n,o)=>{const i=["ctrl","alt","shift","meta"],a=i.includes(n),s=i.includes(o);return a&&!s?-1:!a&&s?1:n.localeCompare(o)}).join("+")}function yo(e){g.focusTrapActive&&g.focusTrapContainer&&vo(e);const t=bo(e),n=g.shortcuts.get(t);if(n){e.preventDefault(),e.stopPropagation(),n();return}De()?.arrowNavigation!==!1&&ho(e)}function ho(e){if(e.target.closest(`.${u.item}`))switch(e.key){case"ArrowDown":case"ArrowRight":e.preventDefault(),nt();break;case"ArrowUp":case"ArrowLeft":e.preventDefault(),ot();break;case"Home":e.preventDefault(),X(0);break;case"End":e.preventDefault(),X(g.notificationIds.length-1);break}}function vo(e){if(e.key!=="Tab"||!g.focusTrapContainer)return;const t=g.focusTrapContainer.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');if(t.length===0)return;const n=t[0],o=t[t.length-1];e.shiftKey&&document.activeElement===n&&o?(e.preventDefault(),o.focus()):!e.shiftKey&&document.activeElement===o&&n&&(e.preventDefault(),n.focus())}function ko(e){g.notificationIds.includes(e)||g.notificationIds.push(e)}function wo(e){const t=g.notificationIds.indexOf(e);t>-1&&(g.notificationIds.splice(t,1),g.focusedIndex>=g.notificationIds.length&&(g.focusedIndex=Math.max(0,g.notificationIds.length-1)))}function Co(e){const t=g.notificationIds.indexOf(e);return t===-1?!1:X(t)}function X(e){if(e<0||e>=g.notificationIds.length)return!1;const t=g.notificationIds[e],n=document.querySelector(`[data-feedback-id="${t}"]`);if(n){n.focus(),n.classList.add(u.item+"--focused"),g.focusedIndex=e;const o=`${e+1} of ${g.notificationIds.length}`;return T("polite",`Notification ${o}`),!0}return!1}function nt(){if(g.notificationIds.length===0)return!1;const e=(g.focusedIndex+1)%g.notificationIds.length;return X(e)}function ot(){if(g.notificationIds.length===0)return!1;const e=(g.focusedIndex-1+g.notificationIds.length)%g.notificationIds.length;return X(e)}function Te(e){g.focusTrapActive=!0,g.focusTrapContainer=e;const t=e.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');t&&t.focus()}function it(){g.focusTrapActive=!1,g.focusTrapContainer=null}function Ao(){g.keydownHandler&&(document.removeEventListener("keydown",g.keydownHandler),g.keydownHandler=null),g.shortcuts.clear(),g.notificationIds=[],g.focusedIndex=-1,g.initialized=!1,g.focusTrapActive=!1,g.focusTrapContainer=null,p().debug&&console.log("[a11y-feedback] Keyboard manager destroyed")}const l={notifications:[],readIds:new Set,isOpen:!1,listeners:new Set,element:null,badgeElement:null,initialized:!1};function Eo(){if(l.initialized)return;const e=I();e?.enabled&&(e.persist&&$o(),de("Alt+Shift+N",Se),l.initialized=!0,p().debug&&console.log("[a11y-feedback] Notification center initialized"))}function To(e){const t=I();if(!t?.enabled||e.options.persist===!1)return;l.notifications.unshift(e);const n=t.maxItems??100;l.notifications.length>n&&(l.notifications=l.notifications.slice(0,n)),t.persist&&Z(),J()}function So(){return[...l.notifications]}function xo(){return{notifications:[...l.notifications],unreadCount:O(),isOpen:l.isOpen,groups:Ae()}}function O(){return l.notifications.filter(e=>!l.readIds.has(e.id)).length}function at(e){l.readIds.has(e)||(l.readIds.add(e),J(),Y("markRead",{id:e}),I()?.persist&&Z())}function rt(){const e=O();l.notifications.forEach(t=>{l.readIds.add(t.id)}),J(),Y("markAllRead",{count:e}),I()?.persist&&Z()}function st(){const e=l.notifications.length;l.notifications=[],l.readIds.clear(),J(),Y("clear",{count:e}),I()?.persist&&Z()}function Se(){l.isOpen?xe():ct()}function ct(){l.isOpen||(l.isOpen=!0,l.element&&(l.element.hidden=!1,l.element.setAttribute("aria-hidden","false")),T("polite",`Notification center opened. ${O()} unread notifications.`),Y("open"),p().debug&&console.log("[a11y-feedback] Notification center opened"))}function xe(){l.isOpen&&(l.isOpen=!1,l.element&&(l.element.hidden=!0,l.element.setAttribute("aria-hidden","true")),T("polite","Notification center closed"),Y("close"),p().debug&&console.log("[a11y-feedback] Notification center closed"))}function Lo(){return l.isOpen}function Mo(e){const t=l.notifications.findIndex(n=>n.id===e);t>-1&&(l.notifications.splice(t,1),l.readIds.delete(e),J(),I()?.persist&&Z())}function No(e){return l.listeners.add(e),()=>{l.listeners.delete(e)}}function Y(e,t){l.listeners.forEach(n=>{try{n(e,t)}catch(o){p().debug&&console.error("[a11y-feedback] Center event listener error:",o)}})}function J(){if(!l.badgeElement)return;const e=O();l.badgeElement.textContent=String(e),l.badgeElement.hidden=e===0,l.badgeElement.setAttribute("aria-label",`${e} unread notifications`)}function Z(){try{const t=I()?.storageKey||Ie.history,n={notifications:l.notifications,readIds:Array.from(l.readIds)};localStorage.setItem(t,JSON.stringify(n))}catch(e){p().debug&&console.error("[a11y-feedback] Failed to persist history:",e)}}function $o(){try{const t=I()?.storageKey||Ie.history,n=localStorage.getItem(t);if(!n)return;const o=JSON.parse(n);Array.isArray(o.notifications)&&(l.notifications=o.notifications),Array.isArray(o.readIds)&&(l.readIds=new Set(o.readIds)),p().debug&&console.log("[a11y-feedback] Loaded persisted history:",l.notifications.length)}catch(e){p().debug&&console.error("[a11y-feedback] Failed to load persisted history:",e)}}function Io(e){const t=e||document.body,n=document.createElement("button");n.className=c.centerTrigger,n.setAttribute("aria-label","Open notification center"),n.setAttribute("aria-expanded","false"),n.setAttribute("aria-haspopup","dialog"),n.innerHTML=`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  `;const o=document.createElement("span");o.className=c.centerBadge,o.setAttribute("aria-label","Unread notifications"),o.textContent=String(O()),o.hidden=O()===0,n.appendChild(o),l.badgeElement=o;const i=document.createElement("div");i.className=c.centerPanel,i.id="a11y-notification-center",i.setAttribute("role","dialog"),i.setAttribute("aria-label","Notification center"),i.setAttribute("aria-hidden","true"),i.hidden=!0;const a=document.createElement("div");a.className=c.centerHeader,a.innerHTML=`
    <h2>Notifications</h2>
    <div class="a11y-feedback-center-actions">
      <button class="a11y-feedback-center-mark-read" aria-label="Mark all as read">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 11 12 14 22 4"/>
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
        </svg>
      </button>
      <button class="a11y-feedback-center-clear" aria-label="Clear all notifications">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
        </svg>
      </button>
      <button class="a11y-feedback-center-close" aria-label="Close notification center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  `;const s=document.createElement("div");s.className=c.centerList,s.setAttribute("role","list");const d=document.createElement("div");d.className=c.centerEmpty,d.textContent="No notifications",i.appendChild(a),i.appendChild(s),i.appendChild(d),n.addEventListener("click",()=>{Se(),n.setAttribute("aria-expanded",String(l.isOpen))}),a.querySelector(".a11y-feedback-center-close")?.addEventListener("click",xe),a.querySelector(".a11y-feedback-center-mark-read")?.addEventListener("click",rt),a.querySelector(".a11y-feedback-center-clear")?.addEventListener("click",()=>{l.notifications.length>0&&st()});const m=document.createElement("div");return m.className=c.center,m.appendChild(n),m.appendChild(i),l.element=i,t.appendChild(m),Fo(s,d),m}function Fo(e,t){if(e.innerHTML="",l.notifications.length===0){t.hidden=!1,e.hidden=!0;return}t.hidden=!0,e.hidden=!1,l.notifications.forEach(n=>{const o=Do(n);e.appendChild(o)})}function Do(e){const t=document.createElement("div");t.className=`a11y-feedback-center-item a11y-feedback-center-item--${e.type}`,t.setAttribute("role","listitem"),t.setAttribute("data-notification-id",e.id),l.readIds.has(e.id)||t.classList.add(c.unread);const n=document.createElement("div");n.className="a11y-feedback-center-item-content",n.textContent=e.message;const o=document.createElement("time");o.className="a11y-feedback-center-item-time",o.dateTime=new Date(e.timestamp).toISOString(),o.textContent=Bo(e.timestamp);const i=document.createElement("button");return i.className="a11y-feedback-center-item-dismiss",i.setAttribute("aria-label","Remove notification"),i.innerHTML="×",i.addEventListener("click",a=>{a.stopPropagation(),Mo(e.id),t.remove()}),t.appendChild(n),t.appendChild(o),t.appendChild(i),t.addEventListener("click",()=>{at(e.id),t.classList.remove(c.unread)}),t}function Bo(e){const n=Date.now()-e,o=Math.floor(n/1e3),i=Math.floor(o/60),a=Math.floor(i/60),s=Math.floor(a/24);return o<60?"Just now":i<60?`${i}m ago`:a<24?`${a}h ago`:s<7?`${s}d ago`:new Date(e).toLocaleDateString()}function Ho(){et("Alt+Shift+N"),l.element?.parentElement&&l.element.parentElement.remove(),l.element=null,l.badgeElement=null,l.initialized=!1,l.notifications=[],l.readIds.clear(),l.isOpen=!1,l.listeners.clear(),p().debug&&console.log("[a11y-feedback] Notification center destroyed")}let S=null;const D=new Map,P=new Map,Ro=`
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

  .${u.container} {
    position: fixed;
    z-index: var(--a11y-feedback-z-index, 9999);
    display: flex;
    flex-direction: column;
    gap: var(--a11y-feedback-gap);
    max-width: var(--a11y-feedback-max-width);
    pointer-events: none;
  }

  .${u.item} {
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

  .${u.reducedMotion} .${u.item} {
    transition: none;
  }

  .${u.item}.${u.entering} {
    opacity: 0;
    transform: translateX(1rem);
  }

  .${u.item}.${u.exiting} {
    opacity: 0;
    transform: translateX(1rem);
  }

  /* RTL support */
  [dir="rtl"] .${u.item}.${u.entering},
  [dir="rtl"] .${u.item}.${u.exiting} {
    transform: translateX(-1rem);
  }

  .${u.itemSuccess} {
    border-left: var(--a11y-feedback-border-width) solid var(--a11y-feedback-success);
  }

  .${u.itemError} {
    border-left: var(--a11y-feedback-border-width) solid var(--a11y-feedback-error);
  }

  .${u.itemWarning} {
    border-left: var(--a11y-feedback-border-width) solid var(--a11y-feedback-warning);
  }

  .${u.itemInfo} {
    border-left: var(--a11y-feedback-border-width) solid var(--a11y-feedback-info);
  }

  .${u.itemLoading} {
    border-left: var(--a11y-feedback-border-width) solid var(--a11y-feedback-loading);
  }

  /* RTL border support */
  [dir="rtl"] .${u.itemSuccess},
  [dir="rtl"] .${u.itemError},
  [dir="rtl"] .${u.itemWarning},
  [dir="rtl"] .${u.itemInfo},
  [dir="rtl"] .${u.itemLoading} {
    border-left: none;
    border-right: var(--a11y-feedback-border-width) solid;
  }

  [dir="rtl"] .${u.itemSuccess} { border-right-color: var(--a11y-feedback-success); }
  [dir="rtl"] .${u.itemError} { border-right-color: var(--a11y-feedback-error); }
  [dir="rtl"] .${u.itemWarning} { border-right-color: var(--a11y-feedback-warning); }
  [dir="rtl"] .${u.itemInfo} { border-right-color: var(--a11y-feedback-info); }
  [dir="rtl"] .${u.itemLoading} { border-right-color: var(--a11y-feedback-loading); }

  .${u.item} [data-icon] {
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
  }

  .${u.item} [data-content] {
    flex: 1;
    min-width: 0;
  }

  .${u.dismissButton} {
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

  [dir="rtl"] .${u.dismissButton} {
    margin: -0.25rem 0.5rem -0.25rem -0.25rem;
  }

  .${u.dismissButton}:hover {
    color: var(--a11y-feedback-text);
    background: var(--a11y-feedback-hover-bg);
  }

  .${u.dismissButton}:focus {
    outline: 2px solid var(--a11y-feedback-focus-ring);
    outline-offset: 2px;
  }
`,dt={success:`<svg data-icon viewBox="0 0 20 20" fill="currentColor" style="color: #10b981;">
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
  </svg>`,error:`<svg data-icon viewBox="0 0 20 20" fill="currentColor" style="color: #ef4444;">
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
  </svg>`,warning:`<svg data-icon viewBox="0 0 20 20" fill="currentColor" style="color: #f59e0b;">
    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
  </svg>`,info:`<svg data-icon viewBox="0 0 20 20" fill="currentColor" style="color: #3b82f6;">
    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
  </svg>`,loading:`<svg data-icon viewBox="0 0 20 20" fill="currentColor" style="color: #8b5cf6;">
    <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
  </svg>`},zo=`<svg viewBox="0 0 20 20" fill="currentColor" style="width: 1rem; height: 1rem;">
  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
</svg>`;let B=null;function lt(){!F()||!me()||(ut(),ft(),Ft(e=>{e.visual?(ut(),ft()):Uo()}))}function ut(){if(!F()||B!==null)return;const e=p();B=document.createElement("style"),B.setAttribute("data-a11y-feedback-styles",""),e.cspNonce!==void 0&&e.cspNonce!==""&&B.setAttribute("nonce",e.cspNonce);const t=[Ro,hn(),Mn(),zn(),jn()].join(`
`);B.textContent=t,document.head.appendChild(B)}function ft(){if(!F()||S!==null)return;const e=p();S=_("div",{[R.visual]:"",class:u.container,role:"region","aria-label":z("notificationsLabel")});const t=Lt[e.visualPosition];Re(S,t),ze()&&S.classList.add(u.reducedMotion),Ue()&&S.setAttribute("dir","rtl"),Oo(e.visualContainer).appendChild(S)}function Oo(e){return e===null?document.body:typeof e=="string"?He(e)??document.body:e}function gt(e){if(!me()||(lt(),S===null))return;const t=p();if(e.options.sound!==!1&&Ze(e.type),e.options.haptic!==!1&&Qe(e.type),To(e),Bt()&&e.options.group){const o=Ye(e);if(o&&o.notifications.length>1){Po(o.id);return}}for(;D.size>=t.maxVisualItems;){const o=D.keys().next().value;o!==void 0&&typeof o=="string"&&V(o)}const n=Vo(e);if(S.appendChild(n),D.set(e.id,n),requestAnimationFrame(()=>{n.classList.remove(u.entering)}),e.type==="error"&&e.actions&&e.actions.length>0){const o=n.querySelector("[data-autofocus]");o&&setTimeout(()=>o.focus(),100)}mt(e)}function Po(e){const t=S?.querySelector(`[data-group-id="${e}"]`);if(t){const n=_n(e);if(n){const o=t.querySelector(`.${c.groupBadge}`);o&&(o.textContent=String(n.notifications.length))}}}function Vo(e){const{type:t,message:n,id:o,options:i,actions:a,richContent:s}=e,d=Le(t),m=dt[t],b=_("div",{[R.visualItem]:"",[R.feedbackId]:o,[R.feedbackType]:t,class:`${u.item} ${d} ${u.entering}`,role:"status","aria-live":"off",tabindex:"-1"});if(b.setAttribute("tabindex","0"),s){const h=Xe(s,n);b.appendChild(h)}else{const h=_("span");h.innerHTML=m,b.appendChild(h);const H=_("span",{"data-content":"",class:"a11y-feedback-content"});H.textContent=n,b.appendChild(H)}if(t==="loading"&&je(o)){const h=Sn(o);b.appendChild(h),xn(o,b)}const k=a||i.actions;if(k&&k.length>0){const h=gn(k,o,e,()=>V(o));b.appendChild(h)}if(!k||k.length===0||t!=="error"){const h=_("button",{type:"button",class:u.dismissButton,"aria-label":z("dismiss")});h.innerHTML=zo,h.addEventListener("click",()=>{V(o)}),b.appendChild(h)}return i.className!==void 0&&i.className!==""&&b.classList.add(i.className),ko(o),b}function Le(e){return{success:u.itemSuccess,error:u.itemError,warning:u.itemWarning,info:u.itemInfo,loading:u.itemLoading}[e]}function mt(e){if(!$[e.type].autoDismiss)return;const n=p(),o=e.options.timeout??$e[e.type]??n.defaultTimeout;if(Gt(o))return;const i=setTimeout(()=>{V(e.id)},o);P.set(e.id,i)}function V(e){const t=D.get(e);if(t===void 0)return;const n=P.get(e);n!==void 0&&(clearTimeout(n),P.delete(e)),t.classList.add(u.exiting);const o=ze()?0:200;setTimeout(()=>{be(t),D.delete(e),Ge(e),ln(e),wo(e)},o)}function Go(e){const t=D.get(e.id);if(t===void 0){gt(e);return}const n=t.querySelector("[data-content]");n!==null&&(n.textContent=e.message);const o=t.getAttribute(R.feedbackType);if(o!==e.type){if(o!==null){const d=Le(o);t.classList.remove(d)}const a=Le(e.type);t.classList.add(a),t.setAttribute(R.feedbackType,e.type);const s=t.querySelector("[data-icon]")?.parentElement;s!=null&&(s.innerHTML=dt[e.type])}const i=P.get(e.id);i!==void 0&&(clearTimeout(i),P.delete(e.id)),mt(e)}function pt(){for(const e of D.keys())V(e)}function _o(){return D.size}function Uo(){pt(),be(S),S=null,be(B),B=null;for(const e of P.values())clearTimeout(e);P.clear()}const qo=100,x=[];function Ko(){ge({debug:!0}),console.warn("[a11y-feedback] Debug mode enabled")}function jo(){ge({debug:!1})}function Wo(){return[...x]}function Xo(){x.length=0}function bt(e,t,n={}){const o={event:e,action:t,region:n.region??null,focusMoved:n.focusResult?.moved??!1,focusTarget:n.focusResult?.target??null,focusBlocked:n.focusResult?.blockedReason??null,visualShown:n.visualShown??!1};for(x.push(o);x.length>qo;)x.shift();E()&&Yo(o)}function Yo(e){const{event:t,action:n,region:o,focusMoved:i,focusTarget:a,focusBlocked:s,visualShown:d}=e,m=Jo(t.type);console.warn(`%c[a11y-feedback]%c ${n.toUpperCase()}`,m.badge,m.action,{message:t.message,type:t.type,id:t.id,role:t.role,ariaLive:t.ariaLive,priority:t.priority,region:o,focusMoved:i,focusTarget:a,focusBlocked:s,visualShown:d,timestamp:new Date(t.timestamp).toISOString(),deduped:t.deduped,replaced:t.replaced})}function Jo(e){const n={success:"#10b981",error:"#ef4444",warning:"#f59e0b",info:"#3b82f6",loading:"#8b5cf6"}[e]??"#6b7280";return{badge:`background: ${n}; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;`,action:`color: ${n}; font-weight: bold;`}}function Zo(){const e={},t={};let n=0,o=0,i=0,a=0;for(const s of x){const d=s.event.type;e[d]=(e[d]??0)+1;const m=s.action;t[m]=(t[m]??0)+1,s.focusMoved&&n++,s.visualShown&&o++,s.event.deduped&&i++,s.event.replaced&&a++}return{total:x.length,byType:e,byAction:t,focusMoved:n,visualShown:o,deduped:i,replaced:a}}function Qo(e=10){return x.slice(-e)}function ei(e){return x.filter(t=>t.event.type===e)}function ti(e){return x.filter(t=>t.action===e)}function ni(){return JSON.stringify(x,null,2)}const C=new Map;function yt(e,t){C.has(e)||C.set(e,new Set);const n=C.get(e);return n.add(t),()=>{n.delete(t)}}function oi(e){C.has("*")||C.set("*",new Set);const t=C.get("*");return t.add(e),()=>{t.delete(e)}}function ii(e){e===void 0?C.clear():C.delete(e)}function Q(e,t){const n=C.get(e);n&&n.forEach(i=>{try{i(t)}catch(a){console.error(`[a11y-feedback] Event listener error for "${e}":`,a)}});const o=C.get("*");o&&o.forEach(i=>{try{i(e,t)}catch(a){console.error("[a11y-feedback] Wildcard listener error:",a)}})}function ai(e,t){const n=yt(e,o=>{n(),t(o)});return n}function ri(e){if(e===void 0){let t=0;return C.forEach(n=>{t+=n.size}),t}return C.get(e)?.size??0}function U(e){const t=(C.get(e)?.size??0)>0,n=(C.get("*")?.size??0)>0;return t||n}function si(e,t,n={}){const o=$[t];return{id:n.id??Vt(),message:e,type:t,role:o.role,ariaLive:o.ariaLive,priority:o.priority,options:n,timestamp:Date.now(),replaced:!1,deduped:!1}}async function ci(e){ye();const t=en(e);if(t.shouldSkip){const m={...e,deduped:!0};return bt(m,"deduped"),U("deduped")&&Q("deduped",{event:m,reason:"duplicate"}),m}const n=t.replacedEvent!==null,o={...e,replaced:n};Qt(o),Jt(o.message,o.type);const i=rn(o),a=dn(o.message,o,i),s={...o,message:a};await Kt(s);let d=!1;if(me()&&(lt(),n?Go(o):gt(o),d=!0),bt(o,n?"replaced":"announced",{region:o.ariaLive,focusResult:i,visualShown:d}),(U("announced")||U("replaced"))&&(n&&t.replacedEvent?Q("replaced",{newEvent:o,previousEvent:t.replacedEvent}):Q("announced",{event:o,region:o.ariaLive})),i.moved&&U("focusMoved")&&Q("focusMoved",{event:o,target:i.target??"",elementName:i.elementName}),d&&U("visualShown")){const m=document.querySelector("[data-a11y-feedback-visual]");m&&Q("visualShown",{event:o,container:m})}return o}async function q(e){const t=si(e.message,e.type,e.options);return ci(t)}async function di(e,t){return q({message:e,type:"success",options:t})}async function li(e,t){return q({message:e,type:"error",options:t})}async function ui(e,t){return q({message:e,type:"warning",options:t})}async function fi(e,t){return q({message:e,type:"info",options:t})}async function gi(e,t){return q({message:e,type:"loading",options:t})}const ee=Object.assign(q,{success:di,error:li,warning:ui,info:fi,loading:gi});let mi=0;function ht(){return`a11y-dialog-${++mi}`}const G=new Map;function vt(e){const t=document.createElement("div");return t.className=c.dialogBackdrop,t.setAttribute("data-dialog-id",e),t.setAttribute("aria-hidden","true"),t.addEventListener("click",n=>{n.target===t&&Ct(e)}),t}function kt(e,t,n,o){const i=document.createElement("div");i.className=c.dialog,i.id=e,i.setAttribute("role","alertdialog"),i.setAttribute("aria-modal","true"),i.setAttribute("aria-labelledby",`${e}-title`),i.setAttribute("aria-describedby",`${e}-desc`);const a=document.createElement("div");if(a.className=c.dialogContent,o){const m=document.createElement("div");m.className="a11y-feedback-dialog-icon",m.setAttribute("aria-hidden","true"),typeof o=="string"?m.innerHTML=o:m.appendChild(o.cloneNode(!0)),a.appendChild(m)}const s=document.createElement("h2");s.id=`${e}-title`,s.className=c.dialogTitle,s.textContent=t||z("confirmTitle")||"Confirm",a.appendChild(s);const d=document.createElement("p");return d.id=`${e}-desc`,d.className="a11y-feedback-dialog-message",d.textContent=n,a.appendChild(d),i.appendChild(a),i}function wt(e,t,n,o){const i=document.createElement("div");i.className=c.dialogActions;const a=document.createElement("button");a.type="button",a.className="a11y-feedback-dialog-btn a11y-feedback-dialog-btn--cancel",a.textContent=t.cancelText||z("cancel")||"Cancel",a.addEventListener("click",o);const s=document.createElement("button");return s.type="button",s.className="a11y-feedback-dialog-btn a11y-feedback-dialog-btn--confirm",t.type==="destructive"&&s.classList.add("a11y-feedback-dialog-btn--destructive"),s.textContent=t.confirmText||z("confirm")||"Confirm",s.addEventListener("click",n),i.appendChild(a),i.appendChild(s),i}async function pi(e,t={}){return new Promise(n=>{const o=ht(),i=document.activeElement,a=vt(o),s=kt(o,t.title,e,t.icon),d=()=>{te(o),n({confirmed:!0})},m=()=>{te(o),n({confirmed:!1})},b=wt(o,t,d,m);s.querySelector(`.${c.dialogContent}`)?.appendChild(b),a.appendChild(s),document.body.appendChild(a),G.set(o,{element:a,previousFocus:i,resolve:h=>n(h)}),Te(s),T("assertive",e);const k=h=>{h.key==="Escape"&&(h.preventDefault(),m(),document.removeEventListener("keydown",k))};document.addEventListener("keydown",k),p().debug&&console.log("[a11y-feedback] Confirm dialog opened:",o)})}async function bi(e,t={}){return new Promise(n=>{const o=ht(),i=document.activeElement,a=vt(o),s=kt(o,t.title,e,t.icon),d=s.querySelector(`.${c.dialogContent}`),m=document.createElement("div");m.className="a11y-feedback-dialog-input-wrapper";const b=document.createElement("input");b.type=t.inputType||"text",b.className=c.dialogInput,b.id=`${o}-input`,b.value=t.defaultValue||"",t.placeholder&&(b.placeholder=t.placeholder);const k=document.createElement("div");k.className="a11y-feedback-dialog-validation",k.setAttribute("role","alert"),k.setAttribute("aria-live","polite"),m.appendChild(b),m.appendChild(k),d?.appendChild(m);const h=()=>{if(t.validate){const N=t.validate(b.value);if(N)return k.textContent=N,b.setAttribute("aria-invalid","true"),b.setAttribute("aria-describedby",k.id),!1}return k.textContent="",b.removeAttribute("aria-invalid"),!0};b.addEventListener("input",h);const H=()=>{if(!h()){b.focus();return}te(o),n({value:b.value,confirmed:!0})},Et=()=>{te(o),n({value:null,confirmed:!1})},Mi=wt(o,t,H,Et);d?.appendChild(Mi),a.appendChild(s),document.body.appendChild(a),G.set(o,{element:a,previousFocus:i,resolve:N=>n(N)}),setTimeout(()=>{b.focus(),b.select()},50),Te(s),T("assertive",e);const Tt=N=>{N.key==="Escape"?(N.preventDefault(),Et(),document.removeEventListener("keydown",Tt)):N.key==="Enter"&&document.activeElement===b&&(N.preventDefault(),H())};document.addEventListener("keydown",Tt),p().debug&&console.log("[a11y-feedback] Prompt dialog opened:",o)})}function te(e){const t=G.get(e);t&&(t.element.remove(),it(),t.previousFocus instanceof HTMLElement&&t.previousFocus.focus(),G.delete(e),p().debug&&console.log("[a11y-feedback] Dialog closed:",e))}function Ct(e){G.get(e)&&te(e)}function yi(){for(const e of G.keys())Ct(e)}function hi(){return G.size>0}const Me=new Map;function M(e){const{type:t,defaults:n={},render:o,actions:i}=e,a=async(d,m,b)=>{const k=m&&o?o(m):void 0,h={...n,...b};(k||b?.richContent)&&(h.richContent=k||b?.richContent);const H=b?.actions||i;return H&&(h.actions=H),ee({message:d,type:t,options:h})};return{show:a,showWith:async(d,m)=>{if(!o)throw new Error("[a11y-feedback] Template has no render function");const b=o(d),k=b.title||b.description||"";return a(k,d,m)}}}function vi(e,t){Me.set(e,t),p().debug&&console.log(`[a11y-feedback] Template registered: ${e}`)}function At(e){return Me.get(e)}function ki(e){Me.delete(e)}async function wi(e,t,n,o){const i=At(e);if(!i)throw new Error(`[a11y-feedback] Template not found: ${e}`);return M(i).show(t,n,o)}const Ci=M({type:"error",defaults:{timeout:0},render:e=>({title:"Validation Error",description:`${e.field}: ${e.message}`})});M({type:"loading",render:e=>({description:e.loading})}),M({type:"info",defaults:{timeout:8e3},render:e=>({description:e.action}),actions:[{id:"undo",label:"Undo",variant:"secondary",onClick:()=>{}}]});const Ai=M({type:"info",render:e=>({title:e.online?"Back Online":"Offline",description:e.online?"Your connection has been restored":"You appear to be offline. Some features may not work.",icon:e.online?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.58 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>'})}),Ei=M({type:"loading",render:e=>{const t={uploading:`Uploading ${e.fileName}...`,complete:`${e.fileName} uploaded successfully`,failed:`Failed to upload ${e.fileName}`};return{title:e.fileName,description:t[e.status]}}});M({type:"warning",defaults:{timeout:0},render:e=>({title:`${e.permission} Permission Required`,description:e.reason}),actions:[{id:"deny",label:"Deny",variant:"secondary",onClick:()=>{}},{id:"allow",label:"Allow",variant:"primary",onClick:()=>{}}]});function Ti(e,t,n=8e3){return M({type:e,defaults:{timeout:n,actions:[{id:"undo",label:"Undo",variant:"secondary",onClick:t}]}})}function Si(e){let t=null;return{execute:async n=>{t=(await ee.loading(e.loadingMessage)).id;try{const i=await n;return await ee.success(e.successMessage(i),{id:t,timeout:e.successTimeout??5e3}),i}catch(i){throw await ee.error(e.errorMessage(i),{id:t}),i}}}}function xi(e){return typeof e=="string"&&["success","error","warning","info","loading"].includes(e)}function Li(e){if(typeof e!="object"||e===null)return!1;const t=e;return!(t.id!==void 0&&typeof t.id!="string"||t.focus!==void 0&&typeof t.focus!="string"||t.explainFocus!==void 0&&typeof t.explainFocus!="boolean"||t.force!==void 0&&typeof t.force!="boolean"||t.timeout!==void 0&&typeof t.timeout!="number")}r.BUILTIN_ICONS=Rn,r.DEFAULT_TIMEOUTS=$e,r.FEEDBACK_SEMANTICS=$,r.addToGroup=Ye,r.clearAllGroups=Un,r.clearFeedbackLog=Xo,r.clearHistory=st,r.closeAllDialogs=yi,r.closeCenter=xe,r.configureFeedback=ge,r.confirm=pi,r.createAsyncTemplate=Si,r.createProgressController=vn,r.createTemplate=M,r.createUndoTemplate=Ti,r.destroyHapticManager=go,r.destroyKeyboardManager=Ao,r.destroyNotificationCenter=Ho,r.destroySoundManager=oo,r.disableFeedbackDebug=jo,r.disableFocusTrap=it,r.disableHaptics=lo,r.dismissAllVisualFeedback=pt,r.dismissVisualFeedback=V,r.enableFeedbackDebug=Ko,r.enableFocusTrap=Te,r.enableHaptics=co,r.exportFeedbackLog=ni,r.fileUploadTemplate=Ei,r.focusFirstAction=pn,r.focusNextNotification=nt,r.focusNotification=Co,r.focusPreviousNotification=ot,r.formErrorTemplate=Ci,r.formatTranslation=_e,r.getActionsAnnouncement=bn,r.getActiveVisualCount=_o,r.getAllGroups=Ae,r.getAvailableLocales=nn,r.getConfig=p,r.getFeedbackByAction=ti,r.getFeedbackByType=ei,r.getFeedbackLog=Wo,r.getFeedbackStats=Zo,r.getGroup=Gn,r.getListenerCount=ri,r.getNotificationCenterState=xo,r.getNotificationHistory=So,r.getProgressPercentage=Ln,r.getRecentFeedback=Qo,r.getRichContentText=Hn,r.getTemplate=At,r.getTranslation=z,r.getUnreadCount=O,r.getVolume=Qn,r.hasActiveProgress=je,r.hasListeners=U,r.hasOpenDialogs=hi,r.initHapticManager=ro,r.initKeyboardManager=mo,r.initNotificationCenter=Eo,r.initSoundManager=Wn,r.isCenterOpen=Lo,r.isFeedbackOptions=Li,r.isFeedbackType=xi,r.isHapticsEnabled=uo,r.isRTL=Ue,r.markAllAsRead=rt,r.markAsRead=at,r.muteSounds=eo,r.networkStatusTemplate=Ai,r.notify=ee,r.offFeedback=ii,r.onAnyFeedback=oi,r.onCenterEvent=No,r.onFeedback=yt,r.onGroupChange=qn,r.onceFeedback=ai,r.openCenter=ct,r.playSound=Ze,r.preloadSounds=Xn,r.prompt=bi,r.registerLocale=on,r.registerShortcut=de,r.registerTemplate=vi,r.removeFromGroup=Pn,r.renderNotificationCenter=Io,r.renderRichContent=Xe,r.resetConfig=It,r.sanitizeHTML=We,r.setVolume=Zn,r.showTemplate=wi,r.stopHaptic=Ee,r.supportsVibration=fo,r.toggleCenter=Se,r.toggleGroupCollapse=Vn,r.toggleMute=no,r.triggerAction=yn,r.triggerCustomHaptic=so,r.triggerHaptic=Qe,r.unmuteSounds=to,r.unregisterShortcut=et,r.unregisterTemplate=ki,Object.defineProperty(r,Symbol.toStringTag,{value:"Module"})});
//# sourceMappingURL=a11y-feedback.umd.js.map
