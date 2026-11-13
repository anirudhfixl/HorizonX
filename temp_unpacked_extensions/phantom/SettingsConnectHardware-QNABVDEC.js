"use no memo";import{a as M,b as W,d as X,e as J,h as U}from"./chunk-RA6LSTNH.js";import{a as _}from"./chunk-AE7RHK2J.js";import"./chunk-LMZA6NIN.js";import"./chunk-7EKUOHO2.js";import"./chunk-AH2GJAYE.js";import"./chunk-E67GAGVK.js";import"./chunk-4ZFADYVA.js";import"./chunk-SMARHYCK.js";import"./chunk-X2DFKDEG.js";import{a as N}from"./chunk-7AUQ4PGY.js";import"./chunk-7LFPKPPS.js";import"./chunk-XOIHROZ2.js";import"./chunk-T6JUKBEM.js";import{a as G}from"./chunk-TPXGP6KR.js";import"./chunk-SIPKILVV.js";import"./chunk-3AVNFBYF.js";import"./chunk-FQXVLIFL.js";import"./chunk-72T5VA6N.js";import"./chunk-WSEUOTFC.js";import"./chunk-ZY4PWXDL.js";import"./chunk-53RA5C5C.js";import"./chunk-O6HH7URN.js";import"./chunk-EPVNAE7G.js";import{a as I}from"./chunk-TKEALTEN.js";import{a as A}from"./chunk-RGSOYWA5.js";import"./chunk-7GEPQZPC.js";import"./chunk-CHMMS3Y4.js";import"./chunk-U6A32EFD.js";import"./chunk-PMN7274X.js";import"./chunk-5Z7HLEXX.js";import"./chunk-UO6I334U.js";import"./chunk-SAXOQZ4S.js";import"./chunk-QX73RCOK.js";import"./chunk-NS2DCXMO.js";import"./chunk-EZ4BE2KM.js";import"./chunk-3IW35WFE.js";import"./chunk-PLP2XZVE.js";import{q as L}from"./chunk-AVAZQISO.js";import{c as C}from"./chunk-CJMN3KHS.js";import"./chunk-42T2VNYU.js";import{a as $}from"./chunk-KQGDWZIG.js";import"./chunk-LVK627YI.js";import"./chunk-GWI2UG5Y.js";import"./chunk-FEEGBQYP.js";import"./chunk-ECX75NJ4.js";import"./chunk-IU2N2FOI.js";import"./chunk-XPFLPV4V.js";import"./chunk-JQP3OL52.js";import"./chunk-3OBZ6LUY.js";import"./chunk-SD6LWQWG.js";import"./chunk-MSVYLZEI.js";import"./chunk-NXFIQWFW.js";import{A as T,s as R}from"./chunk-AAAPPUJY.js";import"./chunk-2SX244H5.js";import"./chunk-YN22CTJL.js";import"./chunk-IOXRDXUS.js";import{T as D,X as F,z as i}from"./chunk-6F56BBC3.js";import"./chunk-TWGFMXTI.js";import"./chunk-PYJSTKTI.js";import"./chunk-MPYVOXNK.js";import"./chunk-SWXHI25T.js";import"./chunk-GUIH7FSB.js";import"./chunk-62GKJ7TH.js";import"./chunk-GTTWDUTX.js";import"./chunk-MPQKYHWG.js";import{d as Y,e as Z,f as B}from"./chunk-5ONZFJ5E.js";import"./chunk-QGMIKOU5.js";import"./chunk-KO54X2FM.js";import"./chunk-2KUTQGIW.js";import"./chunk-A3V4OY5P.js";import"./chunk-BD5UCUNA.js";import"./chunk-UCNNJNLC.js";import"./chunk-J3TYUHYV.js";import{a as y,g as h,i as l,n as p}from"./chunk-UG7Z3YUN.js";l();p();var H=h(Y(),1);l();p();var z=h(Z(),1);l();p();var V=C(A)`
  cursor: pointer;
  width: 24px;
  height: 24px;
  transition: background-color 200ms ease;
  background-color: ${t=>t.$isExpanded?i.colors.legacy.black:i.colors.legacy.elementAccent} !important;
  :hover {
    background-color: ${i.colors.legacy.gray};
    svg {
      fill: white;
    }
  }
  svg {
    fill: ${t=>t.$isExpanded?"white":i.colors.legacy.textDiminished};
    transition: fill 200ms ease;
    position: relative;
    ${t=>t.top?`top: ${t.top}px;`:""}
    ${t=>t.right?`right: ${t.right}px;`:""}
  }
`;var a=h(B(),1),j=C(G).attrs({justify:"space-between"})`
  background-color: ${i.colors.legacy.areaBase};
  padding: 10px 16px;
  border-bottom: 1px solid ${i.colors.legacy.borderDiminished};
  height: 46px;
  opacity: ${t=>t.opacity??"1"};
`,ee=C.div`
  display: flex;
  margin-left: 10px;
  > * {
    margin-right: 10px;
  }
`,q=C.div`
  width: 24px;
  height: 24px;
`,K=y(t=>{let e=(0,z.c)(16);if(e[0]!=="0c8c6a638b5fec09ab7de9d4ce9ccea4c2b344ac069438e6822653f168b3d788"){for(let n=0;n<16;n+=1)e[n]=Symbol.for("react.memo_cache_sentinel");e[0]="0c8c6a638b5fec09ab7de9d4ce9ccea4c2b344ac069438e6822653f168b3d788"}let{onBackClick:g,totalSteps:m,currentStepIndex:o,isHidden:v,showBackButtonOnFirstStep:E,showBackButton:S}=t,f=(S===void 0?!0:S)&&(E||o!==0),u=v?0:1,r;e[1]!==g||e[2]!==f?(r=f?(0,a.jsx)(V,{right:1,onClick:g,children:(0,a.jsx)(L,{})}):(0,a.jsx)(q,{}),e[1]=g,e[2]=f,e[3]=r):r=e[3];let s;if(e[4]!==o||e[5]!==m){let n;e[7]!==o?(n=y(x=>{let b=x<=o?i.colors.legacy.spotBase:i.colors.legacy.elementAccent;return(0,a.jsx)(A,{diameter:12,color:b},x)},"t5"),e[7]=o,e[8]=n):n=e[8],s=M(m).map(n),e[4]=o,e[5]=m,e[6]=s}else s=e[6];let c;e[9]!==s?(c=(0,a.jsx)(ee,{children:s}),e[9]=s,e[10]=c):c=e[10];let w;e[11]===Symbol.for("react.memo_cache_sentinel")?(w=(0,a.jsx)(q,{}),e[11]=w):w=e[11];let k;return e[12]!==u||e[13]!==r||e[14]!==c?(k=(0,a.jsxs)(j,{opacity:u,children:[r,c,w]}),e[12]=u,e[13]=r,e[14]=c,e[15]=k):k=e[15],k},"StepHeader");l();p();var d=h(B(),1),oe=y(()=>{let{mutateAsync:t}=T(),{hardwareStepStack:e,pushStep:g,popStep:m,currentStep:o,setOnConnectHardwareAccounts:v,setOnConnectHardwareDone:E,setExistingAccounts:S}=W(),{data:P=[],isFetched:f,isError:u}=R(),r=I(e,(b,Q)=>b?.length===Q.length),s=e.length>(r??[]).length,c=r?.length===0,n={initial:{x:c?0:s?150:-150,opacity:c?1:0},animate:{x:0,opacity:1},exit:{opacity:0},transition:{duration:.2}},x=(0,H.useCallback)(()=>{o()?.props.preventBack||(o()?.props.onBackCallback&&o()?.props.onBackCallback?.(),m())},[o,m]);return N(e.length===0,()=>{v(async b=>{await t(b),await $.set(_,!await $.get(_))}),E(()=>self.close()),g((0,d.jsx)(U,{}))}),(0,H.useEffect)(()=>{S({data:P,isFetched:f,isError:u})},[P,f,u,S]),(0,d.jsxs)(X,{children:[(0,d.jsx)(K,{totalSteps:3,onBackClick:x,showBackButton:!o()?.props.preventBack,currentStepIndex:e.length-1}),(0,d.jsx)(D,{mode:"wait",children:(0,d.jsx)(F.div,{style:{display:"flex",flexGrow:1},...n,children:(0,d.jsx)(J,{children:o()})},`${e.length}_${r?.length}`)})]})},"SettingsConnectHardware"),De=oe;export{De as default};
//# sourceMappingURL=SettingsConnectHardware-QNABVDEC.js.map
