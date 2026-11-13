import{j as D}from"./chunk-TKEALTEN.js";import{Ya as w}from"./chunk-AVAZQISO.js";import{c as C}from"./chunk-CJMN3KHS.js";import{Y as B}from"./chunk-JQP3OL52.js";import{aa as A,z as S}from"./chunk-6F56BBC3.js";import{d as I,e as V,f as _,s as $}from"./chunk-5ONZFJ5E.js";import{a as b,g as T,i as H,n as v}from"./chunk-UG7Z3YUN.js";H();v();var u=T(V(),1);var U=T(I(),1);var c=T(_(),1),R=C.div`
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: ${r=>r.settingsContainerHeight??"100%"};
`,z=C.div``,F=C.div`
  border-radius: 6px;
  overflow: hidden;
  padding-bottom: 32px;
`,L=C.div`
  display: flex;
  background-color: ${r=>r.selected?S.colors.legacy.spotBase:S.colors.legacy.elementBase};
  padding: 16px;
  align-items: center;
  cursor: pointer;

  & + & {
    border-top: 1px solid ${S.colors.legacy.areaBase};
  }
`,M=C.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`,N=b(r=>{let e=(0,u.c)(16);if(e[0]!=="9ddbf3e8094243cbf8a6c83ee3f9055a536e6190a8fa8511c7c8a5078fc8de9d"){for(let p=0;p<16;p+=1)e[p]=Symbol.for("react.memo_cache_sentinel");e[0]="9ddbf3e8094243cbf8a6c83ee3f9055a536e6190a8fa8511c7c8a5078fc8de9d"}let{selected:n,title:l,description:d,onClick:m}=r,g=n?S.colors.legacy.areaBase:S.colors.legacy.textBase,o;e[1]!==g||e[2]!==l?(o=(0,c.jsx)(w,{margin:"0 0 7px",lineHeight:16,textAlign:"left",weight:500,size:16,color:g,children:l}),e[1]=g,e[2]=l,e[3]=o):o=e[3];let s=n?S.colors.legacy.elementBase:S.colors.legacy.textDiminished,i;e[4]!==d?(i=d||(0,c.jsx)("span",{children:"\xA0"}),e[4]=d,e[5]=i):i=e[5];let a;e[6]!==s||e[7]!==i?(a=(0,c.jsx)(w,{textAlign:"left",weight:500,size:12,lineHeight:12,color:s,children:i}),e[6]=s,e[7]=i,e[8]=a):a=e[8];let t;e[9]!==o||e[10]!==a?(t=(0,c.jsxs)(M,{children:[o,a]}),e[9]=o,e[10]=a,e[11]=t):t=e[11];let f;return e[12]!==m||e[13]!==n||e[14]!==t?(f=(0,c.jsx)(L,{onClick:m,selected:n,children:t}),e[12]=m,e[13]=n,e[14]=t,e[15]=f):f=e[15],f},"Preset"),j=b(r=>{let e=(0,u.c)(15);if(e[0]!=="9ddbf3e8094243cbf8a6c83ee3f9055a536e6190a8fa8511c7c8a5078fc8de9d"){for(let k=0;k<15;k+=1)e[k]=Symbol.for("react.memo_cache_sentinel");e[0]="9ddbf3e8094243cbf8a6c83ee3f9055a536e6190a8fa8511c7c8a5078fc8de9d"}let{onSelectTransactionSpeed:n,selectedTransactionSpeed:l,networkID:d,transactionUnitAmount:m,closeModal:g,settingsContainerHeight:o}=r,{t:s}=$(),{presets:i,transactionSpeed:a}=B(d,l,m),t;e[1]!==g||e[2]!==n||e[3]!==a?(t=b(()=>{n(a),g()},"t1"),e[1]=g,e[2]=n,e[3]=a,e[4]=t):t=e[4];let f=t,p;e[5]!==s?(p=s("settingsTransactions"),e[5]=s,e[6]=p):p=e[6];let h=p,x;e[7]!==s?(x=s("commandSave"),e[7]=s,e[8]=x):x=e[8];let P=x,y;return e[9]!==h||e[10]!==f||e[11]!==i||e[12]!==P||e[13]!==o?(y={headerText:h,primaryText:P,onPress:f,presetViewStates:i,settingsContainerHeight:o},e[9]=h,e[10]=f,e[11]=i,e[12]=P,e[13]=o,e[14]=y):y=e[14],y},"useProps"),Z=b(r=>{let e=(0,u.c)(3);if(e[0]!=="9ddbf3e8094243cbf8a6c83ee3f9055a536e6190a8fa8511c7c8a5078fc8de9d"){for(let d=0;d<3;d+=1)e[d]=Symbol.for("react.memo_cache_sentinel");e[0]="9ddbf3e8094243cbf8a6c83ee3f9055a536e6190a8fa8511c7c8a5078fc8de9d"}let n=j(r),l;return e[1]!==n?(l=(0,c.jsx)(q,{...n}),e[1]=n,e[2]=l):l=e[2],l},"TransactionSettings"),q=U.default.memo(r=>{let e=(0,u.c)(17);if(e[0]!=="9ddbf3e8094243cbf8a6c83ee3f9055a536e6190a8fa8511c7c8a5078fc8de9d"){for(let p=0;p<17;p+=1)e[p]=Symbol.for("react.memo_cache_sentinel");e[0]="9ddbf3e8094243cbf8a6c83ee3f9055a536e6190a8fa8511c7c8a5078fc8de9d"}let{headerText:n,primaryText:l,onPress:d,settingsContainerHeight:m,presetViewStates:g}=r,o;e[1]!==n?(o=(0,c.jsx)(z,{children:(0,c.jsx)(D,{children:n})}),e[1]=n,e[2]=o):o=e[2];let s;e[3]!==g?(s=g.map(E),e[3]=g,e[4]=s):s=e[4];let i;e[5]!==s?(i=(0,c.jsx)(F,{children:s}),e[5]=s,e[6]=i):i=e[6];let a;e[7]!==d||e[8]!==l?(a=(0,c.jsx)(A,{background:"spot",onClick:d,children:l}),e[7]=d,e[8]=l,e[9]=a):a=e[9];let t;e[10]!==m||e[11]!==i||e[12]!==a?(t=(0,c.jsxs)(R,{settingsContainerHeight:m,children:[i,a]}),e[10]=m,e[11]=i,e[12]=a,e[13]=t):t=e[13];let f;return e[14]!==o||e[15]!==t?(f=(0,c.jsxs)(c.Fragment,{children:[o,t]}),e[14]=o,e[15]=t,e[16]=f):f=e[16],f});function E(r,e){return(0,c.jsx)(N,{onClick:r.onClick,title:r.title,description:r.description,selected:r.selected},e)}b(E,"_temp");export{Z as a};
//# sourceMappingURL=chunk-E5WJVE52.js.map
