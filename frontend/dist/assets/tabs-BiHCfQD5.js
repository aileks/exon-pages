import{j as r,c as h,r as a,P as F,l as k,m as ue,n as G,o as I,p as le,q as L,s as K,t as de,v as fe}from"./index-BA64tdYx.js";function Me({className:e,type:t,...n}){return r.jsx("input",{type:t,"data-slot":"input",className:h("file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm","focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]","aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",e),...n})}var be="Label",O=a.forwardRef((e,t)=>r.jsx(F.label,{...e,ref:t,onMouseDown:n=>{var s;n.target.closest("button, input, select, textarea")||((s=e.onMouseDown)==null||s.call(e,n),!n.defaultPrevented&&n.detail>1&&n.preventDefault())}}));O.displayName=be;var ve=O;function ke({className:e,...t}){return r.jsx(ve,{"data-slot":"label",className:h("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",e),...t})}var A="rovingFocusGroup.onEntryFocus",ge={bubbles:!1,cancelable:!0},C="RovingFocusGroup",[N,$,pe]=ue(C),[me,V]=k(C,[pe]),[xe,Ie]=me(C),U=a.forwardRef((e,t)=>r.jsx(N.Provider,{scope:e.__scopeRovingFocusGroup,children:r.jsx(N.Slot,{scope:e.__scopeRovingFocusGroup,children:r.jsx(Te,{...e,ref:t})})}));U.displayName=C;var Te=a.forwardRef((e,t)=>{const{__scopeRovingFocusGroup:n,orientation:o,loop:s=!1,dir:f,currentTabStopId:i,defaultCurrentTabStopId:v,onCurrentTabStopIdChange:g,onEntryFocus:c,preventScrollOnEntryFocus:l=!1,...u}=e,p=a.useRef(null),R=le(t,p),d=L(f),[T=null,y]=K({prop:i,defaultProp:v,onChange:g}),[m,x]=a.useState(!1),E=de(c),ne=$(n),_=a.useRef(!1),[re,D]=a.useState(0);return a.useEffect(()=>{const b=p.current;if(b)return b.addEventListener(A,E),()=>b.removeEventListener(A,E)},[E]),r.jsx(xe,{scope:n,orientation:o,dir:d,loop:s,currentTabStopId:T,onItemFocus:a.useCallback(b=>y(b),[y]),onItemShiftTab:a.useCallback(()=>x(!0),[]),onFocusableItemAdd:a.useCallback(()=>D(b=>b+1),[]),onFocusableItemRemove:a.useCallback(()=>D(b=>b-1),[]),children:r.jsx(F.div,{tabIndex:m||re===0?-1:0,"data-orientation":o,...u,ref:R,style:{outline:"none",...e.style},onMouseDown:I(e.onMouseDown,()=>{_.current=!0}),onFocus:I(e.onFocus,b=>{const ae=!_.current;if(b.target===b.currentTarget&&ae&&!m){const M=new CustomEvent(A,ge);if(b.currentTarget.dispatchEvent(M),!M.defaultPrevented){const S=ne().filter(w=>w.focusable),se=S.find(w=>w.active),ie=S.find(w=>w.id===T),ce=[se,ie,...S].filter(Boolean).map(w=>w.ref.current);Y(ce,l)}}_.current=!1}),onBlur:I(e.onBlur,()=>x(!1))})})}),B="RovingFocusGroupItem",z=a.forwardRef((e,t)=>{const{__scopeRovingFocusGroup:n,focusable:o=!0,active:s=!1,tabStopId:f,...i}=e,v=G(),g=f||v,c=Ie(B,n),l=c.currentTabStopId===g,u=$(n),{onFocusableItemAdd:p,onFocusableItemRemove:R}=c;return a.useEffect(()=>{if(o)return p(),()=>R()},[o,p,R]),r.jsx(N.ItemSlot,{scope:n,id:g,focusable:o,active:s,children:r.jsx(F.span,{tabIndex:l?0:-1,"data-orientation":c.orientation,...i,ref:t,onMouseDown:I(e.onMouseDown,d=>{o?c.onItemFocus(g):d.preventDefault()}),onFocus:I(e.onFocus,()=>c.onItemFocus(g)),onKeyDown:I(e.onKeyDown,d=>{if(d.key==="Tab"&&d.shiftKey){c.onItemShiftTab();return}if(d.target!==d.currentTarget)return;const T=he(d,c.orientation,c.dir);if(T!==void 0){if(d.metaKey||d.ctrlKey||d.altKey||d.shiftKey)return;d.preventDefault();let m=u().filter(x=>x.focusable).map(x=>x.ref.current);if(T==="last")m.reverse();else if(T==="prev"||T==="next"){T==="prev"&&m.reverse();const x=m.indexOf(d.currentTarget);m=c.loop?Re(m,x+1):m.slice(x+1)}setTimeout(()=>Y(m))}})})})});z.displayName=B;var we={ArrowLeft:"prev",ArrowUp:"prev",ArrowRight:"next",ArrowDown:"next",PageUp:"first",Home:"first",PageDown:"last",End:"last"};function Fe(e,t){return t!=="rtl"?e:e==="ArrowLeft"?"ArrowRight":e==="ArrowRight"?"ArrowLeft":e}function he(e,t,n){const o=Fe(e.key,n);if(!(t==="vertical"&&["ArrowLeft","ArrowRight"].includes(o))&&!(t==="horizontal"&&["ArrowUp","ArrowDown"].includes(o)))return we[o]}function Y(e,t=!1){const n=document.activeElement;for(const o of e)if(o===n||(o.focus({preventScroll:t}),document.activeElement!==n))return}function Re(e,t){return e.map((n,o)=>e[(t+o)%e.length])}var Ce=U,ye=z,j="Tabs",[Ee,Ge]=k(j,[V]),q=V(),[_e,P]=Ee(j),H=a.forwardRef((e,t)=>{const{__scopeTabs:n,value:o,onValueChange:s,defaultValue:f,orientation:i="horizontal",dir:v,activationMode:g="automatic",...c}=e,l=L(v),[u,p]=K({prop:o,onChange:s,defaultProp:f});return r.jsx(_e,{scope:n,baseId:G(),value:u,onValueChange:p,orientation:i,dir:l,activationMode:g,children:r.jsx(F.div,{dir:l,"data-orientation":i,...c,ref:t})})});H.displayName=j;var J="TabsList",Q=a.forwardRef((e,t)=>{const{__scopeTabs:n,loop:o=!0,...s}=e,f=P(J,n),i=q(n);return r.jsx(Ce,{asChild:!0,...i,orientation:f.orientation,dir:f.dir,loop:o,children:r.jsx(F.div,{role:"tablist","aria-orientation":f.orientation,...s,ref:t})})});Q.displayName=J;var W="TabsTrigger",X=a.forwardRef((e,t)=>{const{__scopeTabs:n,value:o,disabled:s=!1,...f}=e,i=P(W,n),v=q(n),g=te(i.baseId,o),c=oe(i.baseId,o),l=o===i.value;return r.jsx(ye,{asChild:!0,...v,focusable:!s,active:l,children:r.jsx(F.button,{type:"button",role:"tab","aria-selected":l,"aria-controls":c,"data-state":l?"active":"inactive","data-disabled":s?"":void 0,disabled:s,id:g,...f,ref:t,onMouseDown:I(e.onMouseDown,u=>{!s&&u.button===0&&u.ctrlKey===!1?i.onValueChange(o):u.preventDefault()}),onKeyDown:I(e.onKeyDown,u=>{[" ","Enter"].includes(u.key)&&i.onValueChange(o)}),onFocus:I(e.onFocus,()=>{const u=i.activationMode!=="manual";!l&&!s&&u&&i.onValueChange(o)})})})});X.displayName=W;var Z="TabsContent",ee=a.forwardRef((e,t)=>{const{__scopeTabs:n,value:o,forceMount:s,children:f,...i}=e,v=P(Z,n),g=te(v.baseId,o),c=oe(v.baseId,o),l=o===v.value,u=a.useRef(l);return a.useEffect(()=>{const p=requestAnimationFrame(()=>u.current=!1);return()=>cancelAnimationFrame(p)},[]),r.jsx(fe,{present:s||l,children:({present:p})=>r.jsx(F.div,{"data-state":l?"active":"inactive","data-orientation":v.orientation,role:"tabpanel","aria-labelledby":g,hidden:!p,id:c,tabIndex:0,...i,ref:t,style:{...e.style,animationDuration:u.current?"0s":void 0},children:p&&f})})});ee.displayName=Z;function te(e,t){return`${e}-trigger-${t}`}function oe(e,t){return`${e}-content-${t}`}var Se=H,Ae=Q,Ne=X,je=ee;function Le({className:e,...t}){return r.jsx(Se,{"data-slot":"tabs",className:h("flex flex-col gap-2",e),...t})}function Ke({className:e,...t}){return r.jsx(Ae,{"data-slot":"tabs-list",className:h("bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",e),...t})}function Oe({className:e,...t}){return r.jsx(Ne,{"data-slot":"tabs-trigger",className:h("data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",e),...t})}function $e({className:e,...t}){return r.jsx(je,{"data-slot":"tabs-content",className:h("flex-1 outline-none",e),...t})}export{Me as I,ke as L,Le as T,Ke as a,Oe as b,$e as c};
