import{h as oe}from"./chunk-53RA5C5C.js";import{a as ae}from"./chunk-RGSOYWA5.js";import{c as te}from"./chunk-3IW35WFE.js";import{C as j,Ya as L,ba as ee}from"./chunk-AVAZQISO.js";import{c as i}from"./chunk-CJMN3KHS.js";import{W as Z}from"./chunk-GWI2UG5Y.js";import{a as Y}from"./chunk-XPFLPV4V.js";import{v as G,w as J,ya as X,z as w}from"./chunk-6F56BBC3.js";import{Db as de,zb as K}from"./chunk-MPQKYHWG.js";import{d as fe,e as z,f as _,s as Q}from"./chunk-5ONZFJ5E.js";import{a as y,g as m,i as R,n as $}from"./chunk-UG7Z3YUN.js";R();$();var re=m(z(),1);var S=m(_(),1),me=i.div`
  position: relative;
  width: 100%;
`,ge=i.div`
  position: absolute;
  right: 12px;
  top: calc(50% - 27px / 2);
  display: flex;
  align-items: center;
`,be=i(L)`
  margin-right: ${t=>`calc(120px - (${t.textLength}px * 5))`};
`,ue=i(L)`
  margin-right: 10px;
`,pe=i(te)`
  height: 27px;
`,he=i.div`
  position: relative;
  width: 100%;
  padding: 0px 8px;
  overflow: hidden;
  text-overflow: ellipsis;
`,We=y(t=>{let e=(0,re.c)(25);if(e[0]!=="742dab4d08b54dda3b0b335576f4722bbfa9bc990a709069f3ca66ac6b6b5023"){for(let h=0;h<25;h+=1)e[h]=Symbol.for("react.memo_cache_sentinel");e[0]="742dab4d08b54dda3b0b335576f4722bbfa9bc990a709069f3ca66ac6b6b5023"}let{symbol:r,alignSymbol:l,buttonText:a,width:b,borderRadius:n,onSetTarget:s,targetButtonDisabled:c,placeholder:d,...o}=t,{t:u}=Q(),f=o.value.toString().length,p;e[1]!==d||e[2]!==u?(p=d??u("maxInputAmount"),e[1]=d,e[2]=u,e[3]=p):p=e[3];let T;e[4]!==n||e[5]!==o||e[6]!==p?(T=(0,S.jsx)(oe,{placeholder:p,borderRadius:n,...o}),e[4]=n,e[5]=o,e[6]=p,e[7]=T):T=e[7];let I;e[8]!==l||e[9]!==r||e[10]!==f?(I=l==="left"?(0,S.jsx)(be,{size:16,textLength:f,color:w.colors.legacy.textDiminished,children:r}):(0,S.jsx)(ue,{size:16,color:w.colors.legacy.textDiminished,children:r}),e[8]=l,e[9]=r,e[10]=f,e[11]=I):I=e[11];let V=`${b}px`,C;e[12]!==a?(C=(0,S.jsx)(he,{children:a}),e[12]=a,e[13]=C):C=e[13];let v;e[14]!==s||e[15]!==V||e[16]!==C||e[17]!==c?(v=(0,S.jsx)(pe,{disabled:c,fontSize:13,width:V,borderRadius:"100px",paddingY:4,onClick:s,children:C}),e[14]=s,e[15]=V,e[16]=C,e[17]=c,e[18]=v):v=e[18];let k;e[19]!==I||e[20]!==v?(k=(0,S.jsxs)(ge,{children:[I,v]}),e[19]=I,e[20]=v,e[21]=k):k=e[21];let B;return e[22]!==T||e[23]!==k?(B=(0,S.jsxs)(me,{children:[T,k]}),e[22]=T,e[23]=k,e[24]=B):B=e[24],B},"TargetInput");R();$();var ie=m(z(),1);var N=m(fe(),1);var W=m(_(),1),xe=i.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${t=>t.color};
  height: ${t=>t.width}px;
  min-width: ${t=>t.width}px;
  border-radius: 6px;
`,ye=i.img`
  border-radius: ${t=>t.shape==="square"?"0":"50%"};
  height: ${t=>t.width}px;
  width: ${t=>t.width}px;
`,ne=N.default.memo(t=>{let e=(0,ie.c)(24);if(e[0]!=="896f950fa5455051e70b7ce6f12fca05ddcffcabcf76e3f4bf773c2d0a4cc207"){for(let x=0;x<24;x+=1)e[x]=Symbol.for("react.memo_cache_sentinel");e[0]="896f950fa5455051e70b7ce6f12fca05ddcffcabcf76e3f4bf773c2d0a4cc207"}let{alt:r,backgroundColor:l,className:a,defaultIcon:b,iconUrl:n,localImageSource:s,questionMarkWidth:c,shape:d,width:o}=t,u=l===void 0?w.colors.legacy.areaBase:l,f=d===void 0?"circle":d,[p,T]=(0,N.useState)(!1),[I,V]=(0,N.useState)(!1),C;e[1]===Symbol.for("react.memo_cache_sentinel")?(C=y(()=>{T(!0)},"t3"),e[1]=C):C=e[1];let v=C,k;e[2]===Symbol.for("react.memo_cache_sentinel")?(k=y(()=>{V(!0)},"t4"),e[2]=k):k=e[2];let B=k,h=n;if(n&&o){let x;e[3]!==n||e[4]!==o?(x=G(n,o,o),e[3]=n,e[4]=o,e[5]=x):x=e[5],h=x}else s&&(h=s);let D=p?"clear":u,U;e[6]!==r||e[7]!==f||e[8]!==h||e[9]!==o?(U=h?(0,W.jsx)(ye,{src:h,alt:r,width:o,shape:f,loading:"lazy",onLoad:v,onError:B}):null,e[6]=r,e[7]=f,e[8]=h,e[9]=o,e[10]=U):U=e[10];let M=U,A;e[11]!==b||e[12]!==c?(A=b||(0,W.jsx)(j,{width:c}),e[11]=b,e[12]=c,e[13]=A):A=e[13];let O=A;if(f==="square"){let x=h&&!I?M:O,q;return e[14]!==a||e[15]!==D||e[16]!==x||e[17]!==o?(q=(0,W.jsx)(xe,{className:a,color:D,width:o,children:x}),e[14]=a,e[15]=D,e[16]=x,e[17]=o,e[18]=q):q=e[18],q}let F=h&&!I?M:O,P;return e[19]!==a||e[20]!==D||e[21]!==F||e[22]!==o?(P=(0,W.jsx)(ae,{className:a,color:D,diameter:o,children:F}),e[19]=a,e[20]=D,e[21]=F,e[22]=o,e[23]=P):P=e[23],P});R();$();var le=m(z(),1);var g=m(_(),1),et=y(t=>{let e=(0,le.c)(21);if(e[0]!=="356c097641e0a449cc6652c297eac222cebd3afc41a6e3badc12167521106dc9"){for(let p=0;p<21;p+=1)e[p]=Symbol.for("react.memo_cache_sentinel");e[0]="356c097641e0a449cc6652c297eac222cebd3afc41a6e3badc12167521106dc9"}let{data:r}=Z(t.keybaseUsername),l=t.name??t.keybaseUsername??t.identifier,a=t.iconUrl??r,b;e[1]!==a?(b=(0,g.jsx)(Se,{width:28,iconUrl:a}),e[1]=a,e[2]=b):b=e[2];let n;e[3]!==l?(n=(0,g.jsx)(L,{textAlign:"left",weight:600,size:16,noWrap:!0,children:l}),e[3]=l,e[4]=n):n=e[4];let s;e[5]!==t.website?(s=t.website&&(0,g.jsx)(we,{href:t.website,children:(0,g.jsx)(ee,{})}),e[5]=t.website,e[6]=s):s=e[6];let c;e[7]!==t.onInfoClick?(c=t.onInfoClick&&(0,g.jsx)("div",{className:Ce.infoContainer,onClick:t.onInfoClick,children:(0,g.jsx)(X,{size:16})}),e[7]=t.onInfoClick,e[8]=c):c=e[8];let d;e[9]!==b||e[10]!==n||e[11]!==s||e[12]!==c?(d=(0,g.jsxs)(Ie,{children:[b,n,s,c]}),e[9]=b,e[10]=n,e[11]=s,e[12]=c,e[13]=d):d=e[13];let o;e[14]!==t.data?(o=t.data.map(Re),e[14]=t.data,e[15]=o):o=e[15];let u;e[16]!==o?(u=(0,g.jsx)(Te,{children:o}),e[16]=o,e[17]=u):u=e[17];let f;return e[18]!==d||e[19]!==u?(f=(0,g.jsxs)(ke,{children:[d,u]}),e[18]=d,e[19]=u,e[20]=f):f=e[20],f},"ValidatorCard"),Ce={infoContainer:J({cursor:"pointer"})},ke=i.div`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 47px auto;
  align-items: center;
  justify-content: flex-start;
  background: ${w.colors.legacy.elementBase};
  width: 100%;
  border-radius: 6px;
  margin-top: 12px;
`,Ie=i.div`
  display: grid;
  gap: 10px;
  grid-template-columns: 33px 1fr auto;
  align-items: center;
  padding: 9px 14px;
  border-bottom: 0.5px solid ${w.colors.legacy.borderBase};
`,we=i.a.attrs({target:"_blank",rel:"noopener noreferrer"})`
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
`,Se=i(ne)``,Te=i.section`
  padding: 14px;
`,ve=i.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 36px;
`;function Re(t){return(0,g.jsxs)(ve,{children:[(0,g.jsx)(L,{textAlign:"left",color:w.colors.legacy.textDiminished,size:14,lineHeight:17,noWrap:!0,children:t.label}),t.value]},t.label)}y(Re,"_temp");R();$();var ce=m(z(),1);de();var E=m(_(),1),se=y((t,e)=>Y(K(typeof t=="string"?Number(t):t),e),"format"),lt=y(t=>{let e=(0,ce.c)(6);if(e[0]!=="ad8620fd4df0c1fe2a1681af9c98d256960018534aa79e09a91d15f9ae61d518"){for(let a=0;a<6;a+=1)e[a]=Symbol.for("react.memo_cache_sentinel");e[0]="ad8620fd4df0c1fe2a1681af9c98d256960018534aa79e09a91d15f9ae61d518"}if(typeof t.children>"u")return null;let r;e[1]!==t.children||e[2]!==t.format?(r=se(t.children,t.format),e[1]=t.children,e[2]=t.format,e[3]=r):r=e[3];let l;return e[4]!==r?(l=(0,E.jsxs)(E.Fragment,{children:[r," SOL"]}),e[4]=r,e[5]=l):l=e[5],l},"SolBalance"),ct=y(t=>typeof t.balance>"u"?null:`${se(t.balance,t.format)} SOL`,"formatSolBalance");export{We as a,ne as b,et as c,lt as d,ct as e};
//# sourceMappingURL=chunk-7LFPKPPS.js.map
