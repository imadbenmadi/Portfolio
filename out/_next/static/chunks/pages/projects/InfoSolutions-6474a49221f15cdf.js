(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[742],{5197:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/projects/InfoSolutions",function(){return n(8657)}])},3025:function(e,t,n){"use strict";n.d(t,{Et:function(){return h},Pg:function(){return m}});var r=n(5893),i=n(1664),s=n.n(i),o=n(5675),l=n.n(o),a=n(7747),c=n(6725),u=n(4e3),d=n(917);let h=e=>{let{children:t,category:n="projects",id:i,title:o,thumbnail:d}=e;return(0,r.jsx)(a.xu,{w:"100%",textAlign:"center",children:(0,r.jsxs)(c.f,{as:s(),href:"/".concat(n,"/").concat(i),scroll:!1,cursor:"pointer",children:[(0,r.jsx)(l(),{src:d,alt:o,style:{borderRadius:"12px"},className:"grid-item-thumbnail",placeholder:"blur"}),(0,r.jsx)(c.A,{as:"div",href:"/".concat(n,"/").concat(i),children:(0,r.jsx)(u.x,{mt:2,fontSize:20,children:o})}),(0,r.jsx)(u.x,{fontSize:14,children:t})]})})},m=()=>(0,r.jsx)(d.xB,{styles:"\n      .grid-item-thumbnail {\n        border-radius: 12px;\n      }\n    "})},6741:function(e,t,n){"use strict";var r=n(5893),i=n(9702),s=n(9008),o=n.n(s),l=n(3025);let a={hidden:{opacity:0,x:0,y:20},enter:{opacity:1,x:0,y:0},exit:{opacity:0,x:-0,y:20}};t.Z=e=>{let{children:t,title:n}=e,s="".concat(n," - Benmadi imad");return(0,r.jsx)(i.E.article,{initial:"hidden",animate:"enter",exit:"exit",variants:a,transition:{duration:.4,type:"easeInOut"},style:{position:"relative"},children:(0,r.jsxs)(r.Fragment,{children:[n&&(0,r.jsxs)(o(),{children:[(0,r.jsx)("title",{children:s}),(0,r.jsx)("meta",{name:"twitter:title",content:s}),(0,r.jsx)("meta",{property:"og:title",content:s})]}),t,(0,r.jsx)(l.Pg,{})]})})}},9594:function(e,t,n){"use strict";var r=n(2729);function i(){let e=(0,r._)(["\n  text-align: start;\n  hyphens: auto;\n"]);return i=function(){return e},e}let s=n(6829).Z.p(i());t.Z=s},5798:function(e,t,n){"use strict";n.d(t,{h_:function(){return b},Dx:function(){return g},WZ:function(){return y}});var r=n(5893),i=n(1664),s=n.n(i),o=n(7747),l=n(2883),a=n(2757),c=n(6554),u=(0,c.G)(function(e,t){let{htmlWidth:n,htmlHeight:i,alt:s,...o}=e;return(0,r.jsx)("img",{width:n,height:i,ref:t,alt:s,...o})});u.displayName="NativeImage";var d=n(6245),h=n(7294),m=(e,t)=>"loaded"!==e&&"beforeLoadOrError"===t||"failed"===e&&"onError"===t,x=n(9653),f=(0,c.G)(function(e,t){let{fallbackSrc:n,fallback:i,src:s,srcSet:o,align:l,fit:a,loading:c,ignoreFallback:f,crossOrigin:p,fallbackStrategy:j="beforeLoadOrError",referrerPolicy:g,...y}=e,b=void 0!==n||void 0!==i,_=null!=c||f||!b,v=m(function(e){let{loading:t,src:n,srcSet:r,onLoad:i,onError:s,crossOrigin:o,sizes:l,ignoreFallback:a}=e,[c,u]=(0,h.useState)("pending");(0,h.useEffect)(()=>{u(n?"loading":"pending")},[n]);let m=(0,h.useRef)(),x=(0,h.useCallback)(()=>{if(!n)return;f();let e=new Image;e.src=n,o&&(e.crossOrigin=o),r&&(e.srcset=r),l&&(e.sizes=l),t&&(e.loading=t),e.onload=e=>{f(),u("loaded"),null==i||i(e)},e.onerror=e=>{f(),u("failed"),null==s||s(e)},m.current=e},[n,o,r,l,i,s,t]),f=()=>{m.current&&(m.current.onload=null,m.current.onerror=null,m.current=null)};return(0,d.G)(()=>{if(!a)return"loading"===c&&x(),()=>{f()}},[c,x,a]),a?"loaded":c}({...e,crossOrigin:p,ignoreFallback:_}),j),N={ref:t,objectFit:a,objectPosition:l,..._?y:function(e,t=[]){let n=Object.assign({},e);for(let e of t)e in n&&delete n[e];return n}(y,["onError","onLoad"])};return v?i||(0,r.jsx)(x.m.img,{as:u,className:"chakra-image__placeholder",src:n,...N}):(0,r.jsx)(x.m.img,{as:u,src:s,srcSet:o,crossOrigin:p,loading:c,referrerPolicy:g,className:"chakra-image",...N})});f.displayName="Image";var p=n(4880),j=n(3459);let g=e=>{let{children:t}=e;return(0,r.jsxs)(o.xu,{children:[(0,r.jsx)(l.r,{as:s(),href:"/projects",children:"Projects"}),(0,r.jsxs)("span",{children:["  ",(0,r.jsx)(j.X,{}),"  "]}),(0,r.jsx)(a.X,{display:"inline-block",as:"h3",fontSize:20,mb:4,children:t})]})},y=e=>{let{src:t,alt:n}=e;return(0,r.jsx)(f,{borderRadius:"lg",w:"full",src:t,alt:n,mb:4})},b=e=>{let{children:t}=e;return(0,r.jsx)(p.C,{colorScheme:"green",mr:2,children:t})}},8657:function(e,t,n){"use strict";n.r(t);var r=n(5893),i=n(2338),s=n(4880),o=n(3804),l=n(2883),a=n(5349),c=n(5798),u=n(9594),d=n(6741);t.default=()=>(0,r.jsx)(d.Z,{title:"Algerify",children:(0,r.jsxs)(i.W,{my:6,children:[(0,r.jsxs)(c.Dx,{children:["Info Solutions ",(0,r.jsx)(s.C,{children:"2024"})]}),(0,r.jsx)(u.Z,{children:"Developed within the Cntic club, our aim was to compile all the mathematical modules studied at the university and create a website capable of solving equations and other problems specific to each module. Our initiative seeks to facilitate learning and understanding of mathematical concepts for students."}),(0,r.jsxs)(o.aV,{ml:4,my:4,children:[(0,r.jsxs)(o.HC,{children:[(0,r.jsx)(c.h_,{children:"Live Stream :"}),(0,r.jsxs)(l.r,{href:"https://info-solutions.cntic-club.com/",target:"_black",children:["link",(0,r.jsx)(a.h,{mx:"2px"})]})]}),(0,r.jsxs)(o.HC,{children:[(0,r.jsx)(c.h_,{children:"Github Repo : "}),(0,r.jsxs)(l.r,{href:"https://github.com/imadbenmadi/InfoSolutions",target:"_black",children:["https://github.com/imadbenmadi/InfoSolutions",(0,r.jsx)(a.h,{mx:"2px"})]})]}),(0,r.jsxs)(o.HC,{children:[(0,r.jsx)(c.h_,{children:"Coded by :"}),(0,r.jsx)("span",{children:"Reactjs, TailwindCss, ReactRouter"})]})]}),(0,r.jsx)(c.WZ,{src:"/images/projects/Infosolutions.png",alt:"Infosolutions"}),(0,r.jsx)(c.WZ,{src:"/images/projects/Infosolutions2.png",alt:"Infosolutions"}),(0,r.jsx)(c.WZ,{src:"/images/projects/Infosolutions3.png",alt:"Infosolutions"})]})})},3459:function(e,t,n){"use strict";n.d(t,{X:function(){return r}});var r=(0,n(4027).I)({d:"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z",displayName:"ChevronRightIcon"})},5349:function(e,t,n){"use strict";n.d(t,{h:function(){return s}});var r=n(4027),i=n(5893),s=(0,r.I)({displayName:"ExternalLinkIcon",path:(0,i.jsxs)("g",{fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeWidth:"2",children:[(0,i.jsx)("path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"}),(0,i.jsx)("path",{d:"M15 3h6v6"}),(0,i.jsx)("path",{d:"M10 14L21 3"})]})})},3804:function(e,t,n){"use strict";n.d(t,{HC:function(){return x},aV:function(){return m}});var r=n(6948),i=n(5227),s=n(2495),o=n(6554),l=n(7030),a=n(3179),c=n(9653),u=n(5893),[d,h]=(0,i.k)({name:"ListStylesContext",errorMessage:"useListStyles returned is 'undefined'. Seems you forgot to wrap the components in \"<List />\" "}),m=(0,o.G)(function(e,t){let n=(0,l.jC)("List",e),{children:r,styleType:i="none",stylePosition:o,spacing:h,...m}=(0,a.Lr)(e),x=(0,s.W)(r);return(0,u.jsx)(d,{value:n,children:(0,u.jsx)(c.m.ul,{ref:t,listStyleType:i,listStylePosition:o,role:"list",__css:{...n.container,...h?{"& > *:not(style) ~ *:not(style)":{mt:h}}:{}},...m,children:x})})});m.displayName="List",(0,o.G)((e,t)=>{let{as:n,...r}=e;return(0,u.jsx)(m,{ref:t,as:"ol",styleType:"decimal",marginStart:"1em",...r})}).displayName="OrderedList",(0,o.G)(function(e,t){let{as:n,...r}=e;return(0,u.jsx)(m,{ref:t,as:"ul",styleType:"initial",marginStart:"1em",...r})}).displayName="UnorderedList";var x=(0,o.G)(function(e,t){let n=h();return(0,u.jsx)(c.m.li,{ref:t,...e,__css:n.item})});x.displayName="ListItem",(0,o.G)(function(e,t){let n=h();return(0,u.jsx)(r.J,{ref:t,role:"presentation",...e,__css:n.icon})}).displayName="ListIcon"},4880:function(e,t,n){"use strict";n.d(t,{C:function(){return c}});var r=n(6554),i=n(7030),s=n(3179),o=n(9653),l=n(5432),a=n(5893),c=(0,r.G)(function(e,t){let n=(0,i.mq)("Badge",e),{className:r,...c}=(0,s.Lr)(e);return(0,a.jsx)(o.m.span,{ref:t,className:(0,l.cx)("chakra-badge",e.className),...c,__css:{display:"inline-block",whiteSpace:"nowrap",verticalAlign:"middle",...n}})});c.displayName="Badge"}},function(e){e.O(0,[925,888,774,179],function(){return e(e.s=5197)}),_N_E=e.O()}]);