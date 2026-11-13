import{e as z,g as L,h as j,i as K}from"./chunk-HFEUTQX6.js";import"./chunk-MJIBACEK.js";import"./chunk-AH2GJAYE.js";import{d as $}from"./chunk-FQXVLIFL.js";import"./chunk-CHMMS3Y4.js";import"./chunk-UO6I334U.js";import{Ya as U,ka as F}from"./chunk-AVAZQISO.js";import{c as s}from"./chunk-CJMN3KHS.js";import{b as q}from"./chunk-FEEGBQYP.js";import"./chunk-MSVYLZEI.js";import"./chunk-NXFIQWFW.js";import"./chunk-AAAPPUJY.js";import"./chunk-IOXRDXUS.js";import{aa as H,ha as O,z as T}from"./chunk-6F56BBC3.js";import"./chunk-ZEYU2BFN.js";import"./chunk-GUIH7FSB.js";import"./chunk-62GKJ7TH.js";import{Zc as A,_c as X}from"./chunk-MPQKYHWG.js";import{d as Z,e as ee,f as D,s as N}from"./chunk-5ONZFJ5E.js";import"./chunk-QGMIKOU5.js";import"./chunk-KO54X2FM.js";import"./chunk-2KUTQGIW.js";import"./chunk-BD5UCUNA.js";import"./chunk-UCNNJNLC.js";import"./chunk-J3TYUHYV.js";import{a as R,g as S,i as P,n as v}from"./chunk-UG7Z3YUN.js";P();v();var J=S(ee(),1);X();var E=S(Z(),1);var t=S(D(),1),te=s.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 6px;
`,Y=s.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`,oe=s.div`
  background: ${T.colors.legacy.elementBase};
  border-radius: 6px;
  padding: 12px 16px;
`,le=s.div`
  display: flex;
  flex-direction: row;
  color: ${T.colors.legacy.textBase};
  cursor: pointer;
  font-size: 14px;
  width: fit-content;
  margin-bottom: 8px;

  > span {
    min-height: 14px !important;
    height: 14px !important;
    min-width: 14px !important;
    width: 14px !important;
    border-radius: 3px !important;
  }
`,se=s.div`
  display: flex;
  gap: 16px;
`,ie=s.div`
  padding: 27px 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`,ne=E.default.memo(Q=>{let e=(0,J.c)(49);if(e[0]!=="21bed530f473abb796e30c38bc10f5489902cee26aab72a10ba74574a3933624"){for(let G=0;G<49;G+=1)e[G]=Symbol.for("react.memo_cache_sentinel");e[0]="21bed530f473abb796e30c38bc10f5489902cee26aab72a10ba74574a3933624"}let{requestId:i}=Q,{t:o}=N(),n=z(),[l,V]=(0,E.useState)(!1),_;e[1]!==l||e[2]!==n||e[3]!==i?(_=R(()=>{n({jsonrpc:"2.0",id:i,result:l?A.user_selectEthWallet.result.enum.ALWAYS_USE_PHANTOM:A.user_selectEthWallet.result.enum.CONTINUE_WITH_PHANTOM})},"t1"),e[1]=l,e[2]=n,e[3]=i,e[4]=_):_=e[4];let W=_,w;e[5]!==l||e[6]!==n||e[7]!==i?(w=R(()=>{n({jsonrpc:"2.0",id:i,result:l?A.user_selectEthWallet.result.enum.ALWAYS_USE_METAMASK:A.user_selectEthWallet.result.enum.CONTINUE_WITH_METAMASK})},"t2"),e[5]=l,e[6]=n,e[7]=i,e[8]=w):w=e[8];let B=w,C;e[9]===Symbol.for("react.memo_cache_sentinel")?(C={display:"flex",alignItems:"center"},e[9]=C):C=e[9];let I;e[10]===Symbol.for("react.memo_cache_sentinel")?(I=(0,t.jsxs)(se,{children:[(0,t.jsx)(q,{size:64}),(0,t.jsx)(F,{width:64,height:64})]}),e[10]=I):I=e[10];let r;e[11]!==o?(r=o("whichExtensionToConnectWith"),e[11]=o,e[12]=r):r=e[12];let a;e[13]!==r?(a=(0,t.jsx)(L,{style:C,children:(0,t.jsx)(ie,{children:(0,t.jsx)($,{icon:I,primaryText:r,headerStyle:"small"})})}),e[13]=r,e[14]=a):a=e[14];let c;e[15]!==o?(c=o("useMetaMask"),e[15]=o,e[16]=c):c=e[16];let p;e[17]!==B||e[18]!==c?(p=(0,t.jsx)(Y,{children:(0,t.jsx)(H,{onClick:B,testID:"select_wallet--metamask",children:c})}),e[17]=B,e[18]=c,e[19]=p):p=e[19];let m;e[20]!==o?(m=o("usePhantom"),e[20]=o,e[21]=m):m=e[21];let f;e[22]!==W||e[23]!==m?(f=(0,t.jsx)(Y,{children:(0,t.jsx)(H,{background:"spot",onClick:W,testID:"select_wallet--phantom",children:m})}),e[22]=W,e[23]=m,e[24]=f):f=e[24];let d;e[25]!==l?(d=R(()=>V(!l),"t11"),e[25]=l,e[26]=d):d=e[26];let u;e[27]!==o?(u=o("dontAskMeAgain"),e[27]=o,e[28]=u):u=e[28];let x;e[29]!==u?(x={text:u,color:"textBase"},e[29]=u,e[30]=x):x=e[30];let h;e[31]!==l||e[32]!==d||e[33]!==x?(h=(0,t.jsx)(le,{children:(0,t.jsx)(O,{checked:l,onChange:d,label:x,shape:"square"})}),e[31]=l,e[32]=d,e[33]=x,e[34]=h):h=e[34];let g;e[35]!==o?(g=o("configureInSettings"),e[35]=o,e[36]=g):g=e[36];let b;e[37]!==g?(b=(0,t.jsx)(U,{color:T.colors.legacy.textDiminished,size:13,weight:500,lineHeight:16,textAlign:"left",children:g}),e[37]=g,e[38]=b):b=e[38];let k;e[39]!==h||e[40]!==b?(k=(0,t.jsxs)(oe,{children:[h,b]}),e[39]=h,e[40]=b,e[41]=k):k=e[41];let y;e[42]!==f||e[43]!==k||e[44]!==p?(y=(0,t.jsx)(K,{plain:!0,children:(0,t.jsxs)(te,{children:[p,f,k]})}),e[42]=f,e[43]=k,e[44]=p,e[45]=y):y=e[45];let M;return e[46]!==y||e[47]!==a?(M=(0,t.jsxs)(j,{children:[a,y]}),e[46]=y,e[47]=a,e[48]=M):M=e[48],M}),ye=ne;export{ne as EthSelectWallet,ye as default};
//# sourceMappingURL=EthSelectWallet-3W35E6QI.js.map
