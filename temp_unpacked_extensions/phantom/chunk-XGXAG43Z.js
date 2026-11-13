import{a as N}from"./chunk-LMZA6NIN.js";import{g as M}from"./chunk-SIPKILVV.js";import{c as D}from"./chunk-3IW35WFE.js";import{M as j,Ya as v}from"./chunk-AVAZQISO.js";import{b as I,c as f}from"./chunk-CJMN3KHS.js";import{T as E,X as R,z as h}from"./chunk-6F56BBC3.js";import{e as q,f as V,s as z}from"./chunk-5ONZFJ5E.js";import{a as g,g as $,i as H,n as F}from"./chunk-UG7Z3YUN.js";H();F();var A=$(q(),1);var t=$(V(),1),W=f.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: ${r=>r.addScreenPadding?"16px":"0"};
`,G=f.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`,J=f.div`
  width: 100%;
  > * {
    margin-top: 10px;
  }
  padding: 16px;
`,K=f.div`
  display: flex;
  justify-content: flex-end;
  position: absolute;
  width: 100%;
  padding: 16px;
`,Q=f.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`,U=f(v).attrs({size:28,weight:500,color:h.colors.legacy.textBase})`
  margin-top: 24px;
  margin-left: 12px;
  margin-right: 12px;
`,O=f(v).attrs({size:16,weight:400,color:h.colors.legacy.textDiminished})`
  margin-top: 9px;
  margin-left: 12px;
  margin-right: 12px;
  span {
    color: ${h.colors.legacy.textDiminished};
    font-weight: bold;
  }
`,X=f(v).attrs({size:16,weight:500,color:h.colors.legacy.spotBase})`
  margin-top: 18px;
  text-decoration: none;
  ${r=>r.opacity!==0&&I`
      &:hover {
        cursor: pointer;
        color: ${h.colors.legacy.spotAccent};
      }
    `}
`,Y=g(r=>{let e=(0,A.c)(32);if(e[0]!=="6335564a0000d4cca033e4ab4c1f55b1b196193c79c2b56073c846b17da98dfb"){for(let B=0;B<32;B+=1)e[B]=Symbol.for("react.memo_cache_sentinel");e[0]="6335564a0000d4cca033e4ab4c1f55b1b196193c79c2b56073c846b17da98dfb"}let{description:a,header:c,icon:l,onClose:n,title:i,txLink:o,isClosable:p,disclaimer:d}=r,{t:s}=z(),m;e[1]!==o?(m=g(()=>{o&&self.open(o)},"t1"),e[1]=o,e[2]=m):m=e[2];let b=m,T,k,L,P;e[3]===Symbol.for("react.memo_cache_sentinel")?(T={opacity:0},k={opacity:1},L={opacity:0},P={duration:.2},e[3]=T,e[4]=k,e[5]=L,e[6]=P):(T=e[3],k=e[4],L=e[5],P=e[6]);let x;e[7]!==l||e[8]!==i?(x=(0,t.jsx)(E,{mode:"wait",initial:!0,children:(0,t.jsx)(R.div,{initial:T,animate:k,exit:L,transition:P,children:l},i)}),e[7]=l,e[8]=i,e[9]=x):x=e[9];let y;e[10]!==i?(y=(0,t.jsx)(U,{children:i}),e[10]=i,e[11]=y):y=e[11];let u;e[12]!==a?(u=(0,t.jsx)(O,{children:a}),e[12]=a,e[13]=u):u=e[13];let S;e[14]!==b||e[15]!==s||e[16]!==o?(S=o&&(0,t.jsx)(E,{mode:"wait",initial:!1,children:(0,t.jsx)(R.div,{initial:{opacity:0,y:16},animate:{opacity:1,y:0},exit:{opacity:0},transition:{duration:.2},children:(0,t.jsx)(X,{opacity:1,onClick:b,children:s("swapTxConfirmationViewTransaction")})},o)}),e[14]=b,e[15]=s,e[16]=o,e[17]=S):S=e[17];let w;e[18]!==x||e[19]!==y||e[20]!==u||e[21]!==S?(w=(0,t.jsxs)(G,{children:[x,y,u,S]}),e[18]=x,e[19]=y,e[20]=u,e[21]=S,e[22]=w):w=e[22];let C;e[23]!==d||e[24]!==p||e[25]!==n||e[26]!==s?(C=p&&n?(0,t.jsxs)(J,{children:[(0,t.jsx)(O,{children:d}),p&&n?(0,t.jsx)(D,{onClick:n,children:s("commandClose")}):null]}):null,e[23]=d,e[24]=p,e[25]=n,e[26]=s,e[27]=C):C=e[27];let _;return e[28]!==c||e[29]!==w||e[30]!==C?(_=(0,t.jsxs)(W,{children:[c,w,C]}),e[28]=c,e[29]=w,e[30]=C,e[31]=_):_=e[31],_},"SwapStatus"),pe=g(r=>{let e=(0,A.c)(6);if(e[0]!=="6335564a0000d4cca033e4ab4c1f55b1b196193c79c2b56073c846b17da98dfb"){for(let o=0;o<6;o+=1)e[o]=Symbol.for("react.memo_cache_sentinel");e[0]="6335564a0000d4cca033e4ab4c1f55b1b196193c79c2b56073c846b17da98dfb"}let{ledgerAction:a,numberOfTransactions:c,cancel:l,ledgerApp:n}=r,i;return e[1]!==l||e[2]!==a||e[3]!==n||e[4]!==c?(i=(0,t.jsx)(W,{addScreenPadding:!0,children:(0,t.jsx)(M,{ledgerAction:a,numberOfTransactions:c,cancel:l,ledgerApp:n})}),e[1]=l,e[2]=a,e[3]=n,e[4]=c,e[5]=i):i=e[5],i},"SwapStatusLedger"),Z=g(r=>self.open(r,"_blank"),"openSupportLink"),me=g(r=>{let e=(0,A.c)(13);if(e[0]!=="6335564a0000d4cca033e4ab4c1f55b1b196193c79c2b56073c846b17da98dfb"){for(let b=0;b<13;b+=1)e[b]=Symbol.for("react.memo_cache_sentinel");e[0]="6335564a0000d4cca033e4ab4c1f55b1b196193c79c2b56073c846b17da98dfb"}let{txErrorTitle:a,txErrorMessage:c,txErrorHelpButtonLink:l,txLink:n,onClose:i}=r,o;e[1]!==l?(o=g(()=>Z(l),"t1"),e[1]=l,e[2]=o):o=e[2];let p;e[3]===Symbol.for("react.memo_cache_sentinel")?(p=(0,t.jsx)(j,{fill:"white"}),e[3]=p):p=e[3];let d;e[4]!==o?(d=(0,t.jsx)(K,{children:(0,t.jsx)(Q,{onClick:o,children:p})}),e[4]=o,e[5]=d):d=e[5];let s;e[6]===Symbol.for("react.memo_cache_sentinel")?(s=(0,t.jsx)(N,{type:"failure"}),e[6]=s):s=e[6];let m;return e[7]!==i||e[8]!==d||e[9]!==c||e[10]!==a||e[11]!==n?(m=(0,t.jsx)(Y,{header:d,icon:s,description:c,onClose:i,title:a,txLink:n,isClosable:!0}),e[7]=i,e[8]=d,e[9]=c,e[10]=a,e[11]=n,e[12]=m):m=e[12],m},"SwapStatusError");export{pe as a,me as b};
//# sourceMappingURL=chunk-XGXAG43Z.js.map
