import{c as K}from"./chunk-AVAZQISO.js";import{b as S,c as D}from"./chunk-CJMN3KHS.js";import{T as O,X as J,z as p}from"./chunk-6F56BBC3.js";import{e as q,f as M}from"./chunk-5ONZFJ5E.js";import{a as g,g as _,i as A,n as I}from"./chunk-UG7Z3YUN.js";A();I();var G=_(q(),1);var h=_(M(),1),Z=g(t=>{let e=(0,G.c)(9);if(e[0]!=="0f06ff9f3c4655a809aa71f1a997f40f6e794b55e6fc87ce728a71f54004069c"){for(let f=0;f<9;f+=1)e[f]=Symbol.for("react.memo_cache_sentinel");e[0]="0f06ff9f3c4655a809aa71f1a997f40f6e794b55e6fc87ce728a71f54004069c"}let{width:a,trackColor:i,spinnerColor:d}=t,l=a===void 0?44:a,s=i===void 0?p.colors.legacy.areaAccent:i,c=d===void 0?p.colors.legacy.spotBase:d,n;e[1]!==s?(n=(0,h.jsx)("g",{children:(0,h.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M13 23.413c5.751 0 10.413-4.662 10.413-10.413S18.751 2.587 13 2.587 2.587 7.249 2.587 13 7.249 23.413 13 23.413zm0 2.315c7.03 0 12.727-5.699 12.727-12.728S20.03.273 13 .273C5.97.273.273 5.97.273 13 .273 20.03 5.97 25.728 13 25.728z",fill:s})}),e[1]=s,e[2]=n):n=e[2];let r;e[3]!==c?(r=(0,h.jsx)("g",{children:(0,h.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M16.382 24.125a1.157 1.157 0 01.623-1.513 10.412 10.412 0 005.607-13.617 1.157 1.157 0 112.136-.89 12.726 12.726 0 01-6.853 16.643 1.157 1.157 0 01-1.513-.623z",fill:c})}),e[3]=c,e[4]=r):r=e[4];let m;return e[5]!==n||e[6]!==r||e[7]!==l?(m=(0,h.jsxs)("svg",{width:l,height:l,viewBox:"0 0 26 26",children:[n,r]}),e[5]=n,e[6]=r,e[7]=l,e[8]=m):m=e[8],m},"LoaderSvg"),ee=D.div`
  position: ${t=>t.position};
  height: ${t=>t.diameter}px;
  width: ${t=>t.diameter}px;
  animation: rotate 0.5s linear infinite;
  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
`,Y=g(t=>{let e=(0,G.c)(9);if(e[0]!=="0f06ff9f3c4655a809aa71f1a997f40f6e794b55e6fc87ce728a71f54004069c"){for(let r=0;r<9;r+=1)e[r]=Symbol.for("react.memo_cache_sentinel");e[0]="0f06ff9f3c4655a809aa71f1a997f40f6e794b55e6fc87ce728a71f54004069c"}let{diameter:a,color:i,trackColor:d,position:l}=t,s=a===void 0?44:a,c;e[1]!==i||e[2]!==s||e[3]!==d?(c=(0,h.jsx)(Z,{width:s,spinnerColor:i,trackColor:d}),e[1]=i,e[2]=s,e[3]=d,e[4]=c):c=e[4];let n;return e[5]!==s||e[6]!==l||e[7]!==c?(n=(0,h.jsx)(ee,{diameter:s,position:l,children:c}),e[5]=s,e[6]=l,e[7]=c,e[8]=n):n=e[8],n},"Spinner"),te=D.div`
  display: flex;
  align-items: center;
  justify-content: center;
`,re=g(()=>{let t=(0,G.c)(2);if(t[0]!=="0f06ff9f3c4655a809aa71f1a997f40f6e794b55e6fc87ce728a71f54004069c"){for(let a=0;a<2;a+=1)t[a]=Symbol.for("react.memo_cache_sentinel");t[0]="0f06ff9f3c4655a809aa71f1a997f40f6e794b55e6fc87ce728a71f54004069c"}let e;return t[1]===Symbol.for("react.memo_cache_sentinel")?(e=(0,h.jsx)(te,{children:(0,h.jsx)(Y,{})}),t[1]=e):e=t[1],e},"SpinnerIcon");A();I();var H=_(q(),1);var u=_(M(),1),Q=D.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${t=>t.paddingY}px 0px;
  width: ${t=>t.width};
  height: ${t=>t.height};
  border-radius: ${t=>t.borderRadius};
  font-size: ${t=>t.fontSize}px;
  font-weight: ${t=>t.fontWeight};
  line-height: ${t=>t.lineHeight}px;
  color: ${p.colors.legacy.textBase};
  pointer-events: auto;
  border: none;
  outline-color: transparent;
  outline-style: none;
  cursor: ${t=>t.disabled?"auto":"pointer"};
  &:disabled {
    opacity: 0.4;
  }
  ${t=>t.noWrap&&S`
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `}
  ${t=>t.theme==="primary"?S`
          background: ${p.colors.legacy.spotBase};
          color: ${p.colors.legacy.areaBase};
          &:hover:enabled {
            background: ${p.colors.legacy.spotAccent};
          }
        `:t.theme==="warning"?S`
            background: ${p.colors.legacy.spotNegative};
            color: ${p.colors.legacy.areaBase};
            &:hover:enabled {
              background: ${p.colors.legacy.spotNegative};
            }
          `:t.theme==="dark"?S`
              background: ${p.colors.legacy.areaAccent};
            `:t.theme==="metamask"?S`
                /* metamask brand color */
                background: #f5841f;
                &:hover:enabled {
                  /* metamask brand color */
                  background: #d0701a;
                }
              `:t.theme==="link"?S`
                  background: transparent;
                  color: ${p.colors.legacy.spotBase};
                  justify-content: flex-start;
                  &:hover:enabled {
                    color: ${p.colors.legacy.spotBase};
                  }
                `:t.theme==="text"?S`
                    background: transparent;
                    padding-left: 4px;
                    padding-right: 4px;
                    justify-content: flex-start;
                    &:hover:enabled {
                      background: ${p.colors.legacy.gray};
                    }
                  `:S`
                    background: ${p.colors.legacy.elementAccent};
                    &:hover:enabled {
                      background: ${p.colors.legacy.gray};
                    }
                  `}
`,E=g(t=>{let e=(0,H.c)(39);if(e[0]!=="00a1baeb4e3b3bc33ac32b622a2f0a78d9fd7eacf15efb2e3c5e6028fee84702"){for(let P=0;P<39;P+=1)e[P]=Symbol.for("react.memo_cache_sentinel");e[0]="00a1baeb4e3b3bc33ac32b622a2f0a78d9fd7eacf15efb2e3c5e6028fee84702"}let a,i,d,l,s,c,n,r,m,f,o,b,v,y;e[1]!==t?({children:a,loading:i,to:y,onClick:d,fontSize:s,fontWeight:c,lineHeight:n,paddingY:r,width:m,borderRadius:f,theme:o,type:b,noWrap:v,...l}=t,e[1]=t,e[2]=a,e[3]=i,e[4]=d,e[5]=l,e[6]=s,e[7]=c,e[8]=n,e[9]=r,e[10]=m,e[11]=f,e[12]=o,e[13]=b,e[14]=v,e[15]=y):(a=e[2],i=e[3],d=e[4],l=e[5],s=e[6],c=e[7],n=e[8],r=e[9],m=e[10],f=e[11],o=e[12],b=e[13],v=e[14],y=e[15]);let w=s===void 0?16:s,N=c===void 0?600:c,$=n===void 0?19:n,x=r===void 0?14:r,k=m===void 0?"100%":m,B=f===void 0?"16px":f,C=o===void 0?"default":o,R=b===void 0?"button":b,F=v===void 0?!0:v,z;e[16]!==B||e[17]!==w||e[18]!==N||e[19]!==$||e[20]!==F||e[21]!==x||e[22]!==l||e[23]!==C||e[24]!==R||e[25]!==k?(z={fontSize:w,fontWeight:N,lineHeight:$,paddingY:x,width:k,borderRadius:B,theme:C,type:R,noWrap:F,...l},e[16]=B,e[17]=w,e[18]=N,e[19]=$,e[20]=F,e[21]=x,e[22]=l,e[23]=C,e[24]=R,e[25]=k,e[26]=z):z=e[26];let L=z;if(y){let P;return e[27]!==L||e[28]!==a||e[29]!==i||e[30]!==y?(P=(0,u.jsx)(oe,{loading:i,to:y,...L,children:a}),e[27]=L,e[28]=a,e[29]=i,e[30]=y,e[31]=P):P=e[31],P}let j=L,T;e[32]!==a||e[33]!==i?(T=i?(0,u.jsx)(Y,{diameter:24,position:"absolute"}):a,e[32]=a,e[33]=i,e[34]=T):T=e[34];let W;return e[35]!==d||e[36]!==j||e[37]!==T?(W=(0,u.jsx)(Q,{...j,onClick:d,children:T}),e[35]=d,e[36]=j,e[37]=T,e[38]=W):W=e[38],W},"Button");var oe=g(t=>{let e=(0,H.c)(16);if(e[0]!=="00a1baeb4e3b3bc33ac32b622a2f0a78d9fd7eacf15efb2e3c5e6028fee84702"){for(let f=0;f<16;f+=1)e[f]=Symbol.for("react.memo_cache_sentinel");e[0]="00a1baeb4e3b3bc33ac32b622a2f0a78d9fd7eacf15efb2e3c5e6028fee84702"}let a,i,d,l;e[1]!==t?({children:a,loading:i,to:l,...d}=t,e[1]=t,e[2]=a,e[3]=i,e[4]=d,e[5]=l):(a=e[2],i=e[3],d=e[4],l=e[5]);let s=K();if(!l)throw new Error("ButtonWithNavigation requires a 'to' prop");let c=d,n;e[6]!==s||e[7]!==l?(n=g(()=>s(l),"t2"),e[6]=s,e[7]=l,e[8]=n):n=e[8];let r;e[9]!==a||e[10]!==i?(r=i?(0,u.jsx)(Y,{diameter:24,position:"absolute"}):a,e[9]=a,e[10]=i,e[11]=r):r=e[11];let m;return e[12]!==c||e[13]!==n||e[14]!==r?(m=(0,u.jsx)(Q,{...c,onClick:n,children:r}),e[12]=c,e[13]=n,e[14]=r,e[15]=m):m=e[15],m},"NavButton"),U=D.div`
  display: flex;
  flex-direction: ${t=>t.vertical?"column-reverse":"row"};
  width: 100%;
  gap: 10px;
`;var V={fontSize:14,lineHeight:17,paddingY:10},be=g(t=>{let e=(0,H.c)(21);if(e[0]!=="00a1baeb4e3b3bc33ac32b622a2f0a78d9fd7eacf15efb2e3c5e6028fee84702"){for(let R=0;R<21;R+=1)e[R]=Symbol.for("react.memo_cache_sentinel");e[0]="00a1baeb4e3b3bc33ac32b622a2f0a78d9fd7eacf15efb2e3c5e6028fee84702"}let{className:a,primaryText:i,secondaryText:d,onPrimaryClicked:l,onPrimaryHover:s,onSecondaryClicked:c,primaryTheme:n,secondaryTheme:r,primaryDisabled:m,primaryLoading:f,secondaryDisabled:o,buttonPairStyle:b}=t,v=n===void 0?"primary":n,y=r===void 0?"default":r,w=m===void 0?!1:m,N=b===void 0?"normal":b,$;e[1]!==N?($=N==="normal"?{}:V,e[1]=N,e[2]=$):$=e[2];let x=$,k;e[3]!==x||e[4]!==c||e[5]!==o||e[6]!==d||e[7]!==y?(k=(0,u.jsx)(E,{theme:y,onClick:c,disabled:o,...x,"data-testid":"secondary-button",children:d}),e[3]=x,e[4]=c,e[5]=o,e[6]=d,e[7]=y,e[8]=k):k=e[8];let B;e[9]!==x||e[10]!==l||e[11]!==s||e[12]!==w||e[13]!==f||e[14]!==i||e[15]!==v?(B=(0,u.jsx)(E,{type:"submit",theme:v,disabled:w,loading:f,onClick:l,onMouseEnter:s,...x,"data-testid":"primary-button",children:i}),e[9]=x,e[10]=l,e[11]=s,e[12]=w,e[13]=f,e[14]=i,e[15]=v,e[16]=B):B=e[16];let C;return e[17]!==a||e[18]!==k||e[19]!==B?(C=(0,u.jsxs)(U,{className:a,children:[k,B]}),e[17]=a,e[18]=k,e[19]=B,e[20]=C):C=e[20],C},"ButtonPair");var ye=g(t=>{let e=(0,H.c)(14);if(e[0]!=="00a1baeb4e3b3bc33ac32b622a2f0a78d9fd7eacf15efb2e3c5e6028fee84702"){for(let f=0;f<14;f+=1)e[f]=Symbol.for("react.memo_cache_sentinel");e[0]="00a1baeb4e3b3bc33ac32b622a2f0a78d9fd7eacf15efb2e3c5e6028fee84702"}let{buttons:a,buttonStyle:i,className:d,vertical:l}=t,s;e[1]!==i?(s=i==="small"?V:{},e[1]=i,e[2]=s):s=e[2];let c=s,n;if(e[3]!==a||e[4]!==c){let f;e[6]!==c?(f=g((o,b)=>typeof o.hideButton>"u"?(0,u.jsx)(E,{type:o.type??"button",theme:o.theme,onClick:o.onClick,disabled:o.disabled,loading:o.loading,className:o.className,"data-testid":o.testID,...c,children:o.text},o.key??(typeof o.text=="string"&&o.text?o.text:b)):o.hideButton?null:(0,u.jsx)(J.div,{initial:{opacity:0,scale:.8,width:0},exit:{opacity:0,width:0},animate:{height:"auto",opacity:1,scale:1,width:"100%"},transition:{ease:"easeInOut",duration:.3},children:(0,u.jsx)(E,{type:o.type??"button",theme:o.theme,onClick:o.onClick,disabled:o.disabled,loading:o.loading,className:o.className,"data-testid":o.testID,...c,children:o.text})},o.key??(typeof o.text=="string"&&o.text?o.text:b)),"t3"),e[6]=c,e[7]=f):f=e[7],n=a.map(f),e[3]=a,e[4]=c,e[5]=n}else n=e[5];let r;e[8]!==n?(r=(0,u.jsx)(O,{children:n}),e[8]=n,e[9]=r):r=e[9];let m;return e[10]!==d||e[11]!==r||e[12]!==l?(m=(0,u.jsx)(U,{className:d,vertical:l,children:r}),e[10]=d,e[11]=r,e[12]=l,e[13]=m):m=e[13],m},"ButtonGroup");export{Y as a,re as b,E as c,be as d,ye as e};
//# sourceMappingURL=chunk-3IW35WFE.js.map
