import{a as Z}from"./chunk-H7U6C5ZQ.js";import{o as ee,v as te}from"./chunk-TWJYISKH.js";import{sa as R}from"./chunk-X2DFKDEG.js";import{c as J,f as Y}from"./chunk-TKEALTEN.js";import{c as Q}from"./chunk-5Z7HLEXX.js";import{b as O}from"./chunk-UO6I334U.js";import{Z as z,_ as F,c as q}from"./chunk-AVAZQISO.js";import{b as w,c as u}from"./chunk-CJMN3KHS.js";import{ia as G}from"./chunk-GWI2UG5Y.js";import{z as E}from"./chunk-6F56BBC3.js";import{d as j,e as M,f as H}from"./chunk-5ONZFJ5E.js";import{a as r,g as x,i as y,n as I}from"./chunk-UG7Z3YUN.js";y();I();var le=x(M()),a=x(j());y();I();var ne=x(M(),1);var _=x(H(),1),ie=5,W=5,T=2,de=W+2*T,K=14,ue=K+2*T,oe=W+2*T,he=u.div`
  display: flex;
  justify-content: ${t=>t.shouldCenter?"center":"flex-start"};
  align-items: center;
  position: relative;
  overflow: hidden;
  width: ${t=>(t.maxVisible-1)*de+ue}px;
`,be=u.div`
  align-items: center;
  display: flex;
  ${t=>t.shouldShift&&w`
      transform: translateX(calc(-${oe}px * ${t.shiftAmount}));
      transition: transform 0.3s ease-in-out;
    `}
`,ge=u.div`
  align-items: center;
  background-color: ${E.colors.legacy.textDiminished};
  border-radius: 95px;
  display: flex;
  height: ${ie}px;
  justify-content: center;
  margin: 0 ${T}px;
  min-width: ${W}px;
  transition: all 0.3s ease-in-out;
  ${t=>t.isActive&&w`
      min-width: ${K}px;
    `}
  ${t=>t.isSmall&&w`
      min-width: 3px;
      margin: 0 ${T}px;
      height: 3px;
    `}
`,pe=u.div`
  width: ${K}px;
  height: ${ie}px;
  border-radius: 95px;
  position: absolute;
  margin: 0 ${T}px;
  background-color: ${E.colors.legacy.spotBase};
  transition: transform 0.3s ease-in-out;
  ${t=>t.position&&w`
      transform: translateX(${t.position*oe}px);
    `}
`,xe=r(t=>{let e=(0,ne.c)(18);if(e[0]!=="c371d24cba5c84b269c5ce73aa69ec9afea024f68080e086157fab22198b3542"){for(let b=0;b<18;b+=1)e[b]=Symbol.for("react.memo_cache_sentinel");e[0]="c371d24cba5c84b269c5ce73aa69ec9afea024f68080e086157fab22198b3542"}let{numOfItems:i,currentIndex:o,maxVisible:l}=t,n=l===void 0?5:l,s=i>n?o>n-3:!1,c=s?o-(n-3):0,k=n>i,m;e[1]!==i?(m=Array.from({length:i}),e[1]=i,e[2]=m):m=e[2];let g;e[3]!==o||e[4]!==s||e[5]!==m?(g=m.map((b,p)=>{let S=(p===o-2||p===o+2)&&s;return(0,_.jsx)(ge,{isActive:o===p,isSmall:S},`pagination-dot-${p}`)}),e[3]=o,e[4]=s,e[5]=m,e[6]=g):g=e[6];let f;e[7]!==o?(f=(0,_.jsx)(pe,{position:o}),e[7]=o,e[8]=f):f=e[8];let d;e[9]!==c||e[10]!==s||e[11]!==g||e[12]!==f?(d=(0,_.jsxs)(be,{shouldShift:s,shiftAmount:c,children:[g,f]}),e[9]=c,e[10]=s,e[11]=g,e[12]=f,e[13]=d):d=e[13];let h;return e[14]!==n||e[15]!==k||e[16]!==d?(h=(0,_.jsx)(he,{shouldCenter:k,maxVisible:n,children:d}),e[14]=n,e[15]=k,e[16]=d,e[17]=h):h=e[17],h},"PaginationDots"),ae=xe;var Ce=u.div`
  height: 0;
  transition: height 0.2s ease-in-out;
  width: 100%;
  ${t=>t.animate?`height: ${t.shouldCollapse?t.itemHeight+26:t.itemHeight+46}px`:""}
`,ye=u.div`
  transition: transform 0.5s ease;
  width: 100%;
`,se=u(Q)``,re=u.div`
  visibility: ${t=>t.isVisible?"visible":"hidden"};
`,Ie=u.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`,ke=u.ul`
  align-items: center;
  display: flex;
  margin-bottom: 8px;
  transition: transform 0.5s ease;
  transform: ${t=>`translateX(${t.currentIndex*-100}%)`};
`,Se=u.li`
  align-items: center;
  display: flex;
  flex: 0 0 100%;
  padding: ${t=>t.isActive?"0":t.isNext||t.isPrevious?"0 6px":"0"};
  height: ${t=>t.isActive?t.itemHeight:.9*t.itemHeight}px; /* 0.9 is taken from parallaxAdjacentItemScale from the carousel on mobile */
`,Ee=r(t=>{let e=(0,le.c)(41);if(e[0]!=="8a7d9afd106bfe1de34d32ca2ceb57fbedcdc19723c3bf77f799b4555c2db18b"){for(let C=0;C<41;C+=1)e[C]=Symbol.for("react.memo_cache_sentinel");e[0]="8a7d9afd106bfe1de34d32ca2ceb57fbedcdc19723c3bf77f799b4555c2db18b"}let{items:i,onIndexChange:o,itemHeight:l}=t,[n,s]=(0,a.useState)(0),c;e[1]===Symbol.for("react.memo_cache_sentinel")?(c=r(()=>{s(De)},"t1"),e[1]=c):c=e[1];let k=c,m;e[2]===Symbol.for("react.memo_cache_sentinel")?(m=r(()=>{s($e)},"t2"),e[2]=m):m=e[2];let g=m,f=n<i.length-1,d=n>0,h;e[3]!==n||e[4]!==i.length||e[5]!==o?(h=r(()=>{!i.length||n>i.length-1||o(n)},"t3"),e[3]=n,e[4]=i.length,e[5]=o,e[6]=h):h=e[6];let b;e[7]!==n||e[8]!==i||e[9]!==o?(b=[i,o,n],e[7]=n,e[8]=i,e[9]=o,e[10]=b):b=e[10],(0,a.useEffect)(h,b);let p;e[11]!==n||e[12]!==i.length?(p=r(()=>{i.length>0&&n>=i.length&&s(i.length-1)},"t5"),e[11]=n,e[12]=i.length,e[13]=p):p=e[13];let S;e[14]!==n||e[15]!==i?(S=[n,i],e[14]=n,e[15]=i,e[16]=S):S=e[16],(0,a.useEffect)(p,S);let D=i.length<=1,N=i.length>0,$;if(e[17]!==n||e[18]!==l||e[19]!==i){let C;e[21]!==n||e[22]!==l?(C=r((X,B)=>a.default.createElement(Se,{key:X.key,isActive:n===B,isNext:n+1===B,isPrevious:n-1===B,itemHeight:l},X.node),"t9"),e[21]=n,e[22]=l,e[23]=C):C=e[23],$=i.map(C),e[17]=n,e[18]=l,e[19]=i,e[20]=$}else $=e[20];let v;e[24]!==n||e[25]!==$?(v=a.default.createElement(ke,{currentIndex:n},$),e[24]=n,e[25]=$,e[26]=v):v=e[26];let A;e[27]!==n||e[28]!==f||e[29]!==d||e[30]!==i.length||e[31]!==D?(A=!D&&a.default.createElement(Ie,null,a.default.createElement(re,{isVisible:d},a.default.createElement(se,{onClick:g},a.default.createElement(z,null))),a.default.createElement(ae,{numOfItems:i.length,currentIndex:n,maxVisible:5}),a.default.createElement(re,{isVisible:f},a.default.createElement(se,{onClick:k},a.default.createElement(F,null)))),e[27]=n,e[28]=f,e[29]=d,e[30]=i.length,e[31]=D,e[32]=A):A=e[32];let P;e[33]!==A||e[34]!==v?(P=a.default.createElement(ye,null,v,A),e[33]=A,e[34]=v,e[35]=P):P=e[35];let L;return e[36]!==l||e[37]!==D||e[38]!==P||e[39]!==N?(L=a.default.createElement(Ce,{animate:N,shouldCollapse:D,itemHeight:l},P),e[36]=l,e[37]=D,e[38]=P,e[39]=N,e[40]=L):L=e[40],L},"Carousel");function De(t){return t+1}r(De,"_temp");function $e(t){return t-1}r($e,"_temp2");y();I();var me=x(M(),1);var fe=x(j(),1);y();I();var ce=r(t=>{if(t==="Settings: Security & Privacy")return te;if(t==="Settings: Currency")return ee},"getSanityComponentMapping");var V=x(H(),1),Ae=fe.default.lazy(()=>import("./FungibleDetailPage-VZWMRPZ7.js")),ct=r(()=>{let t=(0,me.c)(7);if(t[0]!=="859c38ad1cd03c2b27e2867613d139a22c6acccde8f34476e22fb69dd4f5072e"){for(let c=0;c<7;c+=1)t[c]=Symbol.for("react.memo_cache_sentinel");t[0]="859c38ad1cd03c2b27e2867613d139a22c6acccde8f34476e22fb69dd4f5072e"}let{showSettingsMenu:e}=J(),{handleShowModalVisibility:i}=R(),{pushDetailView:o}=Y(),l=G(),n=q(),s;return t[1]!==i||t[2]!==n||t[3]!==o||t[4]!==e||t[5]!==l?(s=r((c,k)=>{let{destinationType:m,url:g,caip19:f,tokenCategoryId:d,tokenCategoryName:h}=k;e:switch(m){case"External Link":{O({url:g});break e}case"Buy":{i("onramp");break e}case"Collectibles":{n("/",{state:{defaultTab:"collectibles",nonce:Date.now()}});break e}case"Explore":{n("/explore");break e}case"Token Category":{if(!d||!h)return;o((0,V.jsx)(Z,{category:{id:d,name:h}}));break e}case"Swapper":{n("/swap");break e}case"Settings: Claim Username":{i("quickClaimUsername");break e}case"Settings: Import Seed Phrase":{O({url:"onboarding.html?append=true"});break e}case"Connect Hardware Wallet":{O({url:"connect_hardware.html"});break e}case"Convert to Jito":{i(l?"mintPSOLUKInfo":"mintPSOLInfo",{presentNext:!0});break e}case"Token":{if(!f)return;o((0,V.jsx)(Ae,{caip19:f,title:void 0,entryPoint:"actionBanner"}));break e}default:{let b=ce(m);if(!b)return;e(c,(0,V.jsx)(b,{}))}}},"t0"),t[1]=i,t[2]=n,t[3]=o,t[4]=e,t[5]=l,t[6]=s):s=t[6],s},"useDeepLink");export{ct as a,Ee as b};
//# sourceMappingURL=chunk-W4PBCJ3N.js.map
