(this["webpackJsonpmathlive-box"]=this["webpackJsonpmathlive-box"]||[]).push([[0],{28:function(t,e,r){},37:function(t,e,r){"use strict";r.r(e);var o,n,c,a=r(2),i=r(0),s=r.n(i),u=r(15),l=r.n(u),f=(r(28),r(18)),p=r(3),b=r(4),j=r(8),O=(r(29),r(1)),x=r(7),v=r.n(x),y=r(31),d=new(o=function(){function t(){Object(p.a)(this,t),this.latex="",Object(f.a)(this,"expression",n,this),Object(f.a)(this,"update",c,this)}return Object(b.a)(t,[{key:"eval",get:function(){try{return this.expression.evaluate().text()}catch(t){return"error"}}},{key:"text",get:function(){try{return this.expression.evaluate().text("fractions")}catch(t){return"error"}}},{key:"variable",get:function(){try{return this.expression.variables()}catch(t){return["error"]}}},{key:"solve",get:function(){try{return this.expression.solveFor("x").toString()}catch(t){return"error"}}},{key:"integrate",get:function(){try{return v.a.integrate(this.expression,"x").evaluate().text("fractions")}catch(t){return"error"}}},{key:"diff",get:function(){try{return v.a.diff(this.expression,"x").evaluate().text("fractions")}catch(t){return"error"}}}]),t}(),n=Object(j.a)(o.prototype,"expression",[O.f],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),c=Object(j.a)(o.prototype,"update",[O.b],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){var t=this;return function(e){t.latex=e;try{t.expression=y.convertFromLaTeX(e)}catch(r){t.expression=v()("")}}}}),Object(j.a)(o.prototype,"eval",[O.c],Object.getOwnPropertyDescriptor(o.prototype,"eval"),o.prototype),Object(j.a)(o.prototype,"text",[O.c],Object.getOwnPropertyDescriptor(o.prototype,"text"),o.prototype),Object(j.a)(o.prototype,"variable",[O.c],Object.getOwnPropertyDescriptor(o.prototype,"variable"),o.prototype),Object(j.a)(o.prototype,"solve",[O.c],Object.getOwnPropertyDescriptor(o.prototype,"solve"),o.prototype),Object(j.a)(o.prototype,"integrate",[O.c],Object.getOwnPropertyDescriptor(o.prototype,"integrate"),o.prototype),Object(j.a)(o.prototype,"diff",[O.c],Object.getOwnPropertyDescriptor(o.prototype,"diff"),o.prototype),o),h=s.a.createContext(d),g=function t(){var e=this;Object(p.a)(this,t),this.mfController=void 0,this.setController=function(t){e.mfController=t,e.focus()},this.add=function(t){return e.mfController.insert(t,{focus:!0,format:"latex"})},this.backspace=function(){e.mfController.executeCommand("deletePreviousChar"),e.focus()},this.clear=function(){e.mfController.executeCommand("deleteAll"),e.focus()},this.focus=function(){e.mfController&&e.mfController.focus&&e.mfController.focus()}},w=r(16);function m(){var t=Object(i.useContext)(h),e=new g;return Object(a.jsx)(w.a,{virtualKeyboardMode:"off",onContentDidChange:function(e){return t.update(e.getValue("latex-expanded"))},ref:function(t){t&&(e.setController(t),window.add=e.add,window.backspace=e.backspace,window.clear=e.clear)}})}var C,P=r(5),k=r(11);!function(t){t[t.Eval=0]="Eval",t[t.Symbolic=1]="Symbolic",t[t.Plot=2]="Plot"}(C||(C={}));var E=Object(k.a)((function(){var t=Object(i.useContext)(h),e=Object(i.useState)(C.Eval),r=Object(P.a)(e,2),o=r[0],n=r[1];switch(Object(i.useEffect)((function(){t.variable&&n(C.Eval)}),[t.variable]),Object(i.useEffect)((function(){window.doEvalCalc=function(){n(C.Eval)},window.doSymCalc=function(){n(C.Symbolic)},window.doPlot=function(){n(C.Plot)},console.log("run hook")}),[]),o){case C.Eval:return Object(a.jsx)(S,{});case C.Symbolic:return Object(a.jsx)(D,{});case C.Plot:return Object(a.jsx)(F,{});default:throw Error("Unknown type")}})),S=Object(k.a)((function(){var t=Object(i.useContext)(h),e=t.eval;return e===t.text?Object(a.jsx)(L,{content:"=".concat(e)}):Object(a.jsxs)("div",{children:[Object(a.jsx)(L,{content:"=".concat(t.eval)}),Object(a.jsx)(L,{content:"=".concat(t.text)})]})})),D=Object(k.a)((function(){var t=Object(i.useContext)(h);return Object(a.jsxs)("div",{children:[Object(a.jsx)(L,{content:"=".concat(t.integrate)}),Object(a.jsx)(L,{content:"=".concat(t.diff)})]})})),F=Object(k.a)((function(){throw Error("Not implemented yet")}));function L(t){return Object(a.jsx)(w.a,{value:t.content,readOnly:!0})}var T=E;function z(){return Object(a.jsxs)(h.Provider,{value:d,children:[Object(a.jsx)(m,{}),Object(a.jsx)(T,{})]})}var B=function(t){t&&t instanceof Function&&r.e(3).then(r.bind(null,38)).then((function(e){var r=e.getCLS,o=e.getFID,n=e.getFCP,c=e.getLCP,a=e.getTTFB;r(t),o(t),n(t),c(t),a(t)}))};l.a.render(Object(a.jsx)(s.a.StrictMode,{children:Object(a.jsx)(z,{})}),document.getElementById("root")),B()}},[[37,1,2]]]);
//# sourceMappingURL=main.a17237e9.chunk.js.map