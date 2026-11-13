import{a as D}from"./chunk-3IW35WFE.js";import{D as K,la as q}from"./chunk-AVAZQISO.js";import{b as H,c as b}from"./chunk-CJMN3KHS.js";import{z as f}from"./chunk-6F56BBC3.js";import{d as J,e as O,f as B}from"./chunk-5ONZFJ5E.js";import{a as $,g as w,i as F,n as V}from"./chunk-UG7Z3YUN.js";F();V();var y=w(O(),1);var x=w(J(),1);var p=w(B(),1),I=H`
  width: 100%;
  padding: ${n=>n.padding||"14px"};
  background: ${n=>n.backgroundColor||f.colors.legacy.areaAccent};
  border-width: ${n=>n.borderWidth||"1px"};
  border-style: solid;
  border-color: ${n=>n.warning?f.colors.legacy.spotNegative:f.colors.legacy.borderDiminished};
  border-radius: ${n=>n.borderRadius||"6px"};
  color: white;
  font-size: ${n=>n.fontSize||"16px"};
  line-height: 19px;

  &::placeholder {
    color: ${n=>n.placeholderColor||f.colors.legacy.textIncidental};
  }

  &:focus {
    outline: 0;
  }

  ::selection {
    background: ${f.colors.legacy.spotBase};
  }

  ::-moz-selection {
    background: ${f.colors.legacy.spotBase};
  }
`,Q=H`
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }
`,W=$(n=>{let u=(0,x.forwardRef)((s,l)=>{let t=(0,y.c)(12);if(t[0]!=="2e47ed31f69c267af339605ba7b2aec9237f1e22f531b7f44330a393a691bbec"){for(let g=0;g<12;g+=1)t[g]=Symbol.for("react.memo_cache_sentinel");t[0]="2e47ed31f69c267af339605ba7b2aec9237f1e22f531b7f44330a393a691bbec"}let r,o;t[1]!==s?({warningMessage:o,...r}=s,t[1]=s,t[2]=r,t[3]=o):(r=t[2],o=t[3]);let a;t[4]!==r||t[5]!==l?(a=(0,p.jsx)(n,{...r,ref:l}),t[4]=r,t[5]=l,t[6]=a):a=t[6];let i;t[7]!==o?(i=o&&(0,p.jsx)(Y,{children:o}),t[7]=o,t[8]=i):i=t[8];let c;return t[9]!==a||t[10]!==i?(c=(0,p.jsxs)(X,{children:[a,i]}),t[9]=a,t[10]=i,t[11]=c):c=t[11],c}),e=(0,x.forwardRef)((s,l)=>{let t=(0,y.c)(10);if(t[0]!=="2e47ed31f69c267af339605ba7b2aec9237f1e22f531b7f44330a393a691bbec"){for(let c=0;c<10;c+=1)t[c]=Symbol.for("react.memo_cache_sentinel");t[0]="2e47ed31f69c267af339605ba7b2aec9237f1e22f531b7f44330a393a691bbec"}let r,o;t[1]!==s?({label:o,...r}=s,t[1]=s,t[2]=r,t[3]=o):(r=t[2],o=t[3]);let a;t[4]!==r||t[5]!==l?(a=(0,p.jsx)(n,{...r,ref:l}),t[4]=r,t[5]=l,t[6]=a):a=t[6];let i;return t[7]!==o||t[8]!==a?(i=(0,p.jsx)(Z,{label:o,children:a}),t[7]=o,t[8]=a,t[9]=i):i=t[9],i}),d=n;return d.WithWarning=u,d.WithLabel=e,d},"withVariants"),X=b.div`
  width: 100%;
`,E=b.input`
  ${I}
  ${Q}
`,Y=b.div`
  color: ${f.colors.legacy.spotNegative};
  font-size: 16px;
  line-height: 1.2;
  margin-top: 10px;
  text-align: left;
`,Z=b.div`
  position: relative;
  &:after {
    ${n=>n.label?`content: "${n.label}"`:""};
    color: ${f.colors.legacy.textIncidental};
    position: absolute;
    right: 20px;
    bottom: 17px;
    font-size: 16px;
  }
`,ge=W(E),j=b.textarea`
  ${I}
  resize: none;
  padding: 25px;
  line-height: 150%;
  word-spacing: 10px;
  text-align: left;
  white-space: normal;
  &:placeholder-shown {
    word-spacing: 3px;
  }
`,ee=b.textarea`
  ${I}
  height: 68px;
  text-align: start;
  resize: none;
`,te=b.textarea`
  ${I}
  height: 68px;
  text-align: start;
  resize: none;
`,ne=b.textarea`
  ${I}
  overflow: auto;
  height: 50px;
  text-align: start;
`,fe=W(j),ue=W(ee),he=W(te),me=W(ne),oe=b(E)`
  padding-left: 43px;
  padding-right: 43px;
`,ae=b.div`
  width: 100%;
  position: relative;
`,re=b.div`
  position: absolute;
  top: 16px;
  left: 15px;
`,ie=b.div`
  position: absolute;
  top: 16px;
  right: 15px;
  cursor: pointer;
`,xe=(0,x.forwardRef)((n,u)=>{let e=(0,y.c)(18);if(e[0]!=="2e47ed31f69c267af339605ba7b2aec9237f1e22f531b7f44330a393a691bbec"){for(let g=0;g<18;g+=1)e[g]=Symbol.for("react.memo_cache_sentinel");e[0]="2e47ed31f69c267af339605ba7b2aec9237f1e22f531b7f44330a393a691bbec"}let d,s,l,t;e[1]!==n?({showClearIcon:l,onClear:s,showLoadingIcon:t,...d}=n,e[1]=n,e[2]=d,e[3]=s,e[4]=l,e[5]=t):(d=e[2],s=e[3],l=e[4],t=e[5]);let r=t===void 0?!1:t,o;e[6]!==r?(o=(0,p.jsx)(re,{children:r?(0,p.jsx)(D,{diameter:17}):(0,p.jsx)(K,{})}),e[6]=r,e[7]=o):o=e[7];let a;e[8]!==d||e[9]!==u?(a=(0,p.jsx)(oe,{...d,ref:u,type:"text"}),e[8]=d,e[9]=u,e[10]=a):a=e[10];let i;e[11]!==s||e[12]!==l?(i=l&&(0,p.jsx)(ie,{onClick:s,"data-testid":"search-clear-button",children:(0,p.jsx)(q,{})}),e[11]=s,e[12]=l,e[13]=i):i=e[13];let c;return e[14]!==o||e[15]!==a||e[16]!==i?(c=(0,p.jsxs)(ae,{children:[o,a,i]}),e[14]=o,e[15]=a,e[16]=i,e[17]=c):c=e[17],c}),se=b(E)`
  border: ${({border:n})=>n||"inherit"};
  color: ${({color:n})=>n||"inherit"};

  &:disabled {
    cursor: not-allowed;
  }
`,ye=x.default.memo($(function(u){let e=(0,y.c)(21);if(e[0]!=="2e47ed31f69c267af339605ba7b2aec9237f1e22f531b7f44330a393a691bbec"){for(let m=0;m<21;m+=1)e[m]=Symbol.for("react.memo_cache_sentinel");e[0]="2e47ed31f69c267af339605ba7b2aec9237f1e22f531b7f44330a393a691bbec"}let{value:d,placeholder:s,fontSize:l,required:t,warning:r,minLength:o,maxLength:a,decimalLimit:i,border:c,borderRadius:g,disabled:L,"aria-labelledby":P,"aria-label":C,onKeyPress:v,onUserInput:T,name:R}=u,M=l===void 0?"16px":l,k=o===void 0?1:o,z=a===void 0?79:a,U=i===void 0?9:i,A=r?f.colors.legacy.spotNegative:f.colors.legacy.textBase,_=`^\\d*(\\.\\d{0,${U}})?$`,h;e[1]!==T?(h=$(m=>{let N=m.target;if(!N.validity.valid)m.preventDefault();else{let G=N.value.replace(/,/g,".");T(G)}},"t7"),e[1]=T,e[2]=h):h=e[2];let S;return e[3]!==C||e[4]!==P||e[5]!==c||e[6]!==g||e[7]!==L||e[8]!==M||e[9]!==z||e[10]!==k||e[11]!==R||e[12]!==v||e[13]!==s||e[14]!==t||e[15]!==A||e[16]!==_||e[17]!==h||e[18]!==d||e[19]!==r?(S=(0,p.jsx)(se,{value:d,required:t,warning:r,border:c,borderRadius:g,color:A,type:"text",inputMode:"decimal",pattern:_,autoComplete:"off",autoCorrect:"off",spellCheck:"false",fontSize:M,placeholder:s,step:"any",minLength:k,maxLength:z,disabled:L,name:R,"aria-labelledby":P,"aria-label":C,onKeyPress:v,onInput:h}),e[3]=C,e[4]=P,e[5]=c,e[6]=g,e[7]=L,e[8]=M,e[9]=z,e[10]=k,e[11]=R,e[12]=v,e[13]=s,e[14]=t,e[15]=A,e[16]=_,e[17]=h,e[18]=d,e[19]=r,e[20]=S):S=e[20],S},"InnerInput"));export{W as a,ge as b,fe as c,ue as d,he as e,me as f,xe as g,ye as h};
//# sourceMappingURL=chunk-53RA5C5C.js.map
