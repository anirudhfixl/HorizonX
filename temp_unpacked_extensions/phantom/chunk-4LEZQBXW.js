import{A as B,g as T,t as q}from"./chunk-IOJXVR35.js";import{a as I}from"./chunk-PGPCFPOE.js";import{b as c,d as b}from"./chunk-CJMN3KHS.js";import{j as p,o as n}from"./chunk-KODJN5BD.js";import{f as a}from"./chunk-MSVYLZEI.js";import{z as m}from"./chunk-6F56BBC3.js";import{a as C}from"./chunk-GUIH7FSB.js";import{Ke as R,Oj as _,Ue as u,Vj as x,Wj as k,Wk as w,df as D,ll as O}from"./chunk-MPQKYHWG.js";import{Ea as H,wa as E}from"./chunk-QGMIKOU5.js";import{M as g,N as v,O as S,t as h}from"./chunk-KO54X2FM.js";import{a as i,i as o,j as s,n as r}from"./chunk-UG7Z3YUN.js";o();r();var P=w({authRepository:n,queryClient:p});o();r();var le=new O(a,n,P,{queryClient:p});o();r();S();H();var A=new R({store:I({isWriter:!1}),adapters:[new _({baseUrl:i(()=>h(),"baseUrl"),fetch(e,t){return E.bearer(!0).fetch(e,t)}})]}),d;n.subscribe("userID",e=>{d!==void 0&&d!==e&&x(A,d),d=e});n.subscribe("loggedOut",()=>{k(A),d=void 0});o();r();D();var f,z=new C,U=i(()=>{if(s.ENVIRONMENT!=="e2e")return null;let e=globalThis.__PHANTOM_E2E_SEEDLESS_JUICEBOX_CLIENT__;return e||null},"getE2EJuiceboxClientOverride"),G=i(async()=>{let e=U();return e||f||(f=new T(new B),f)},"juiceboxClient"),W={storage:z,authRepository:n,juiceboxClient:G},V=i(()=>{if(s.ENVIRONMENT!=="e2e")return null;let e=globalThis.__PHANTOM_E2E_SEEDLESS_REPOSITORY_OVERRIDES__;return e||null},"getE2ESeedlessRepositoryOverrides"),L=q(W),y={...L,recover:i(async e=>{let t=V()?.recover;return t?await t(e):await L.recover(e)},"recover")};y.subscribe("seedlessRotationResult",({type:e,didRotate:t})=>{let l=`Se*dless Bundle Rotation Result: ${e}, didRotate: ${t}`;u.addBreadcrumb("se*dless",l,"info"),a.capture("seedlessBundleRotationResult",{data:{type:e,didRotate:t}})});y.subscribe("seedlessRecoverResult",({type:e,reason:t})=>{let l=`Se*dless Bundle Recover Result: ${e}`;t&&(l+=`, reason: ${t}`),u.addBreadcrumb("se*dless",l,"info"),a.capture("seedlessBundleRecoverResult",{data:{type:e,reason:t}})});y.subscribe("seedlessBackupResult",({type:e,didBackup:t})=>{let l=`Se*dless Bundle Backup Result: ${e}, didBackup: ${t}`;u.addBreadcrumb("se*dless",l,"info"),a.capture("seedlessBundleBackupResult",{data:{type:e,didBackup:t}})});o();r();S();o();r();var $=function(e,t){return Object.defineProperty?Object.defineProperty(e,"raw",{value:t}):e.raw=t,e},J=c(N||(N=$([`
/* http://meyerweb.com/eric/tools/css/reset/
   v5.0.1 | 20191019
   License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
body {
  line-height: 1;
}
menu, ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
`],[`
/* http://meyerweb.com/eric/tools/css/reset/
   v5.0.1 | 20191019
   License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
body {
  line-height: 1;
}
menu, ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
`]))),je=b(j||(j=$(["",""],["",""])),J),M=J,N,j;var F=c`
  ::-webkit-scrollbar {
    background: ${m.colors.legacy.areaBase};
    width: 7px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${m.colors.legacy.elementBase};
    border-radius: 8px;
  }
`,Q=c`
  ::-webkit-scrollbar {
    display: none;
  }
  * {
    scrollbar-width: none; /* Also needed to disable scrollbar Firefox */
  }
`,Ge=b`
    ${M}

    body, html, * {
        box-sizing: border-box;
        font-family: 'Inter', 'Roboto', Arial;
        user-select: none;
        color: currentColor;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeSpeed;
        -webkit-font-smoothing: antialiased;
    }
    input, textarea {
        -webkit-user-select: text;
        -khtml-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
    }
    body {
        color: ${m.colors.legacy.textBase};
        background: ${e=>e.backgroundColor};
        min-height: 100vh;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    *:focus, *:focus-within {
        outline-color: transparent !important;
        outline-style: none !important;
        outline-width: 0px !important;
    }

    ${g||v?Q:F}
`;export{P as a,le as b,A as c,y as d,Ge as e};
//# sourceMappingURL=chunk-4LEZQBXW.js.map
