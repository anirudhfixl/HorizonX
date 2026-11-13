import{a as _}from"./chunk-MJIBACEK.js";import{a as L}from"./chunk-AH2GJAYE.js";import{f as S}from"./chunk-UO6I334U.js";import{c as f}from"./chunk-CJMN3KHS.js";import{e as I,z as m}from"./chunk-6F56BBC3.js";import{a as C,b as $}from"./chunk-ZEYU2BFN.js";import{a as F}from"./chunk-62GKJ7TH.js";import{d as N,e as D}from"./chunk-5ONZFJ5E.js";import{a as r,g as M,i as d,n as p}from"./chunk-UG7Z3YUN.js";d();p();var u=M(D());var i=M(N()),k=M(F());var P={isConnected:!1,lastMessage:null,postMessage:I},U=i.default.createContext(P);function J(){let e=(0,u.c)(11);if(e[0]!=="3354bfff9dd8ac9cb324fabbcf896a3ffd074792b903ec43354c0221b60f77c8"){for(let n=0;n<11;n+=1)e[n]=Symbol.for("react.memo_cache_sentinel");e[0]="3354bfff9dd8ac9cb324fabbcf896a3ffd074792b903ec43354c0221b60f77c8"}let[o,t]=(0,i.useState)(null),[a,s]=(0,i.useState)(null),{isSidebarOpen:b}=L(),g;e[1]===Symbol.for("react.memo_cache_sentinel")?(g=r(n=>{let c=$(n);!c||typeof c.url!="string"||!c.url||!c.req||typeof c.req.method!="string"||!c.req.method||s({...c,url:_(c.url.toString())})},"t0"),e[1]=g):g=e[1];let v=g,x,h;e[2]!==b?(x=r(()=>{let n;return r(async()=>{if(b){let B=r(l=>{l.name==="popup/sidepanel"&&(t(l),l.onMessage.addListener(v),l.onDisconnect.addListener(()=>{t(null),s(null)}))},"onConnect");k.default.runtime.onConnect.addListener(B)}else{let l=`notification/${(await S()).id}`;n=k.default.runtime.connect({name:l}),t(n),n.onMessage.addListener(v),n.onDisconnect.addListener(()=>{self.close(),t(null),s(null)})}},"init")(),()=>{n?.disconnect()}},"t1"),h=[b],e[2]=b,e[3]=x,e[4]=h):(x=e[3],h=e[4]),(0,i.useEffect)(x,h);let y;e[5]!==o?(y=r(n=>{o&&o.postMessage(C(n))},"t3"),e[5]=o,e[6]=y):y=e[6];let R=y,q=!!o,w;return e[7]!==a||e[8]!==R||e[9]!==q?(w=[q,a,R],e[7]=a,e[8]=R,e[9]=q,e[10]=w):w=e[10],w}r(J,"useRemotePortConnection");function A(){let e=(0,u.c)(1);if(e[0]!=="3354bfff9dd8ac9cb324fabbcf896a3ffd074792b903ec43354c0221b60f77c8"){for(let t=0;t<1;t+=1)e[t]=Symbol.for("react.memo_cache_sentinel");e[0]="3354bfff9dd8ac9cb324fabbcf896a3ffd074792b903ec43354c0221b60f77c8"}let o=(0,i.useContext)(U);if(!o)throw new Error("Missing background connection context");return o}r(A,"useBackgroundConnection");function T(){let e=(0,u.c)(1);if(e[0]!=="3354bfff9dd8ac9cb324fabbcf896a3ffd074792b903ec43354c0221b60f77c8"){for(let t=0;t<1;t+=1)e[t]=Symbol.for("react.memo_cache_sentinel");e[0]="3354bfff9dd8ac9cb324fabbcf896a3ffd074792b903ec43354c0221b60f77c8"}let{lastMessage:o}=A();return o}r(T,"useIncomingBackgroundRequest");function Q(){let e=(0,u.c)(4);if(e[0]!=="3354bfff9dd8ac9cb324fabbcf896a3ffd074792b903ec43354c0221b60f77c8"){for(let s=0;s<4;s+=1)e[s]=Symbol.for("react.memo_cache_sentinel");e[0]="3354bfff9dd8ac9cb324fabbcf896a3ffd074792b903ec43354c0221b60f77c8"}let o=T(),{postMessage:t}=A(),a;return e[1]!==o||e[2]!==t?(a=r(s=>{if(o){if(o.req.id!==s.id)throw new Error(`Request id: ${o.req.id} does not match response id: ${s.id}`);t(s)}else throw new Error("No request received from the background yet")},"t0"),e[1]=o,e[2]=t,e[3]=a):a=e[3],a}r(Q,"usePostOutgoingBackgroundResponse");d();p();d();p();var E=f.div`
  ${e=>!e.plain&&`
    box-shadow: ${e.theme?.footer?.boxShadow??"0px -6px 10px rgba(0, 0, 0, 0.1)"};
    background-color: ${m.colors.legacy.areaBase};
    border-top: ${`1px solid ${m.colors.legacy.elementBase}`};
  `}
`;var ae=f.div`
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  > * {
    margin-top: 27px;
  }
`,fe=f.div`
  flex: 1;
  overflow: auto;
  padding: 0px 16px;
`,le=f.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  left: 0;
  bottom: 0;
  background: ${m.colors.legacy.areaBase};
`,de=f(E)`
  flex: none;
  padding: 14px 20px;
`,pe=f.div`
  padding: 20px;
  height: 100%;
`;export{E as a,U as b,J as c,T as d,Q as e,ae as f,fe as g,le as h,de as i,pe as j};
//# sourceMappingURL=chunk-HFEUTQX6.js.map
