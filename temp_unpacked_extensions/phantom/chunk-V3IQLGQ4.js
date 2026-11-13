import{c as G}from"./chunk-CJMN3KHS.js";import{z as o}from"./chunk-6F56BBC3.js";import{d as U,e as V,f as z,s as D}from"./chunk-5ONZFJ5E.js";import{g as r,i as X,n as q}from"./chunk-UG7Z3YUN.js";X();q();var J=r(V(),1);var K=r(U(),1);var c=r(z(),1),Y=G.div`
  position: relative;
  width: ${t=>`${t.width}px`};
  height: ${t=>`${t.height}px`};
  opacity: ${t=>t.disabled?t.disabledToggleOpacity:1};

  input[type="checkbox"] {
    width: ${t=>`${t.width}px`};
    height: ${t=>`${t.height}px`};
    margin: 0;
    &:hover {
      cursor: pointer;
    }
  }

  label {
    width: ${t=>`${t.width}px`};
    height: ${t=>`${t.height}px`};
    background: ${t=>t.disabled?t.disabledBackgroundColor:t.inactiveBackgroundColor};
    border-radius: ${t=>`${(t.height||0)/2}px`};
    cursor: pointer;
    text-indent: -9999px;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }

  label:after {
    content: "";
    position: absolute;
    top: ${t=>`${((t.height||0)-(t.toggleHeight||0))/2}px`};
    left: ${t=>`${((t.width||0)-(t.toggleWidth||0)*2)/2}px`};
    width: ${t=>`${t.toggleWidth}px`};
    height: ${t=>`${t.toggleHeight}px`};
    background: ${t=>t.inactiveToggleColor};
    border-radius: 100px;
    transition: 0.3s;
  }

  input:checked + label {
    background: ${t=>t.disabled?t.disabledBackgroundColor:t.activeBackgroundColor};
    &:after {
      background: ${t=>t.disabled?t.disabledToggleColor:t.activeToggleColor};
    }
  }

  input:checked + label:after {
    left: calc(100% - ${t=>`${((t.width||0)-(t.toggleWidth||0)*2)/2}px`});
    transform: translateX(-100%);
  }

  label:active:after {
    width: 14px;
    background: ${o.colors.legacy.textBase};
  }
`,oe=K.default.memo(t=>{let e=(0,J.c)(27);if(e[0]!=="262e495e137e997ce8d10c3131bda95f4caaa01b20beb1026f95c085d41ce2fb"){for(let y=0;y<27;y+=1)e[y]=Symbol.for("react.memo_cache_sentinel");e[0]="262e495e137e997ce8d10c3131bda95f4caaa01b20beb1026f95c085d41ce2fb"}let{id:i,width:S,height:W,toggleWidth:H,toggleHeight:O,activeBackgroundColor:P,activeToggleColor:R,inactiveBackgroundColor:_,inactiveToggleColor:A,disabledBackgroundColor:E,disabledToggleColor:F,disabledToggleOpacity:I,checked:L,disabled:M,onChange:s,label:N}=t,h=S===void 0?34:S,b=W===void 0?20:W,u=H===void 0?14:H,f=O===void 0?14:O,C=P===void 0?o.colors.legacy.spotBase:P,p=R===void 0?o.colors.legacy.textBase:R,k=_===void 0?o.colors.legacy.areaAccent:_,$=A===void 0?o.colors.legacy.borderAccent:A,T=E===void 0?o.colors.legacy.spotBase:E,v=F===void 0?o.colors.legacy.textBase:F,m=I===void 0?.4:I,Q=L===void 0?!1:L,l=M===void 0?!1:M,{t:x}=D(),w=N??"checkbox",B=l||Q,d;e[1]!==l||e[2]!==i||e[3]!==s||e[4]!==w||e[5]!==B?(d=(0,c.jsx)("input",{type:"checkbox","aria-label":w,id:i,checked:B,onChange:s,disabled:l,"data-testid":i}),e[1]=l,e[2]=i,e[3]=s,e[4]=w,e[5]=B,e[6]=d):d=e[6];let a;e[7]!==x?(a=x("switchToggle"),e[7]=x,e[8]=a):a=e[8];let g;e[9]!==i||e[10]!==a?(g=(0,c.jsx)("label",{htmlFor:i,children:a}),e[9]=i,e[10]=a,e[11]=g):g=e[11];let n;return e[12]!==C||e[13]!==p||e[14]!==l||e[15]!==T||e[16]!==v||e[17]!==m||e[18]!==b||e[19]!==k||e[20]!==$||e[21]!==d||e[22]!==g||e[23]!==f||e[24]!==u||e[25]!==h?(n=(0,c.jsxs)(Y,{width:h,height:b,toggleWidth:u,toggleHeight:f,activeBackgroundColor:C,inactiveBackgroundColor:k,disabledBackgroundColor:T,activeToggleColor:p,inactiveToggleColor:$,disabledToggleColor:v,disabledToggleOpacity:m,disabled:l,children:[d,g]}),e[12]=C,e[13]=p,e[14]=l,e[15]=T,e[16]=v,e[17]=m,e[18]=b,e[19]=k,e[20]=$,e[21]=d,e[22]=g,e[23]=f,e[24]=u,e[25]=h,e[26]=n):n=e[26],n});export{oe as a};
//# sourceMappingURL=chunk-V3IQLGQ4.js.map
