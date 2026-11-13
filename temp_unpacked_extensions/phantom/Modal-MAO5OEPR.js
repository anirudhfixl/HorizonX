import{a as G}from"./chunk-7GEPQZPC.js";import{c as M}from"./chunk-5Z7HLEXX.js";import{c as R}from"./chunk-3IW35WFE.js";import{L as z,Ya as $}from"./chunk-AVAZQISO.js";import{c as d}from"./chunk-CJMN3KHS.js";import{fg as D}from"./chunk-2SX244H5.js";import"./chunk-YN22CTJL.js";import"./chunk-IOXRDXUS.js";import{G as S,Xa as _,z as k}from"./chunk-6F56BBC3.js";import"./chunk-GTTWDUTX.js";import"./chunk-MPQKYHWG.js";import{e as W,f as A,s as B}from"./chunk-5ONZFJ5E.js";import"./chunk-QGMIKOU5.js";import"./chunk-KO54X2FM.js";import"./chunk-2KUTQGIW.js";import"./chunk-BD5UCUNA.js";import"./chunk-UCNNJNLC.js";import"./chunk-J3TYUHYV.js";import{a as b,g as w,i as H,n as I}from"./chunk-UG7Z3YUN.js";H();I();var F=w(W(),1);var o=w(A(),1),N=16,L=d.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  height: 100%;
`,P=d.div`
  overflow: scroll;
`,E=d.div`
  margin: 45px 16px 16px 16px;
  padding-top: 16px;
`,j=d(M)`
  left: ${N}px;
  position: absolute;
`,q=d.div`
  align-items: center;
  background: ${k.colors.legacy.areaBase};
  border-bottom: 1px solid ${k.colors.legacy.borderDiminished};
  display: flex;
  height: 46px;
  padding: ${N}px;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
`,J=d.div`
  display: flex;
  flex: 1;
  justify-content: center;
`,K=d.footer`
  margin-top: auto;
  flex-shrink: 0;
  min-height: 16px;
`,O=d($).attrs(s=>({margin:s.margin??"12px 0px"}))`
  text-align: left;
`,Q=d($).attrs({size:16,weight:500,lineHeight:25})``;function U(s){let e=(0,F.c)(19);if(e[0]!=="6a2fc8287bbb4f049612ad3a9134c8c90545cc5ab73e128563df727f5a1207fe"){for(let t=0;t<19;t+=1)e[t]=Symbol.for("react.memo_cache_sentinel");e[0]="6a2fc8287bbb4f049612ad3a9134c8c90545cc5ab73e128563df727f5a1207fe"}let{actions:m,shortcuts:g,trackAction:n,onClose:i}=s,u;if(e[1]!==m.more||e[2]!==i||e[3]!==n){let t;e[5]!==i||e[6]!==n?(t=b(r=>{let h=D(r.type),x=r.isDestructive?"spotNegative":"textBase";return{start:(0,o.jsx)(h,{size:18,type:r.type,color:x}),topLeft:{text:r.text,color:x},onClick:b(()=>{n(r),i(),r.onClick(r.type)},"onClick")}},"t1"),e[5]=i,e[6]=n,e[7]=t):t=e[7],u=m.more.map(t),e[1]=m.more,e[2]=i,e[3]=n,e[4]=u}else u=e[4];let C=u,a;e[8]!==i||e[9]!==g||e[10]!==n?(a=g?.map(t=>{let r=D(t.type),h=t.isDestructive?"spotNegative":"textBase";return{start:(0,o.jsx)(r,{size:18,color:h}),topLeft:{text:t.text,color:h},onClick:b(()=>{n(t),i(),t.onClick(t.type)},"onClick")}})??[],e[8]=i,e[9]=g,e[10]=n,e[11]=a):a=e[11];let p=a,l;e[12]!==C?(l={rows:C},e[12]=C,e[13]=l):l=e[13];let c;e[14]!==p?(c={rows:p},e[14]=p,e[15]=c):c=e[15];let f;return e[16]!==l||e[17]!==c?(f=[l,c],e[16]=l,e[17]=c,e[18]=f):f=e[18],f}b(U,"useConvertActionsToRows");function V(s){let e=(0,F.c)(29);if(e[0]!=="6a2fc8287bbb4f049612ad3a9134c8c90545cc5ab73e128563df727f5a1207fe"){for(let v=0;v<29;v+=1)e[v]=Symbol.for("react.memo_cache_sentinel");e[0]="6a2fc8287bbb4f049612ad3a9134c8c90545cc5ab73e128563df727f5a1207fe"}let{t:m}=B(),{headerText:g,hostname:n,shortcuts:i}=s,u=U(s),C;e[1]===Symbol.for("react.memo_cache_sentinel")?(C=(0,o.jsx)(j,{children:(0,o.jsx)(z,{})}),e[1]=C):C=e[1];let a;e[2]!==g?(a=(0,o.jsx)(J,{children:(0,o.jsx)(Q,{children:g})}),e[2]=g,e[3]=a):a=e[3];let p;e[4]!==s.onClose||e[5]!==a?(p=(0,o.jsxs)(q,{onClick:s.onClose,children:[C,a]}),e[4]=s.onClose,e[5]=a,e[6]=p):p=e[6];let l;e[7]!==u?(l=u.map(X),e[7]=u,e[8]=l):l=e[8];let c;e[9]!==l?(c=(0,o.jsx)(S,{gap:"section",children:l}),e[9]=l,e[10]=c):c=e[10];let f;e[11]!==n||e[12]!==i||e[13]!==m?(f=n&&i&&i.length>0&&(0,o.jsx)(O,{color:k.colors.legacy.textDiminished,size:14,lineHeight:17,children:m("shortcutsWarningDescription",{url:n})}),e[11]=n,e[12]=i,e[13]=m,e[14]=f):f=e[14];let t;e[15]!==f?(t=(0,o.jsx)(K,{children:f}),e[15]=f,e[16]=t):t=e[16];let r;e[17]!==c||e[18]!==t?(r=(0,o.jsxs)(E,{children:[c,t]}),e[17]=c,e[18]=t,e[19]=r):r=e[19];let h=s.onClose,x;e[20]!==m?(x=m("commandClose"),e[20]=m,e[21]=x):x=e[21];let y;e[22]!==s.onClose||e[23]!==x?(y=(0,o.jsx)(G,{removeFooterExpansion:!0,children:(0,o.jsx)(R,{onClick:h,children:x})}),e[22]=s.onClose,e[23]=x,e[24]=y):y=e[24];let T;return e[25]!==y||e[26]!==p||e[27]!==r?(T=(0,o.jsx)(L,{children:(0,o.jsxs)(P,{children:[p,r,y]})}),e[25]=y,e[26]=p,e[27]=r,e[28]=T):T=e[28],T}b(V,"CTAModal");function X(s,e){return(0,o.jsx)(_,{rows:s.rows},`group-${e}`)}b(X,"_temp");var ce=V;export{V as CTAModal,ce as default};
//# sourceMappingURL=Modal-MAO5OEPR.js.map
