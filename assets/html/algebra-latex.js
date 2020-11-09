(()=>{"use strict";var e={24:(e,t,r)=>{const s=["sin","cos","tan","arcsin","arccos","arctan","log","ln","sqrt","max","min"];let n=null;const i=(...e)=>{if("object"==typeof process&&process.env.TEX_DEBUG){let t=(new Error).stack.split("\n").length;null==n&&(n=t),t-=n;let r="";for(let e=0;e<t;e++)r+="-";console.log(r,...e)}},o=[{name:"alpha",symbol:"α"},{name:"beta",symbol:"β"},{name:"gamma",symbol:"γ"},{name:"delta",symbol:"δ"},{name:"epsilon",symbol:"ϵ"},{name:"zeta",symbol:"ζ"},{name:"eta",symbol:"η"},{name:"theta",symbol:"θ"},{name:"iota",symbol:"ι"},{name:"kappa",symbol:"κ"},{name:"lambda",symbol:"λ"},{name:"mu",symbol:"μ"},{name:"nu",symbol:"ν"},{name:"omicron",symbol:"ο"},{name:"pi",symbol:"π"},{name:"rho",symbol:"ρ"},{name:"sigma",symbol:"σ"},{name:"tau",symbol:"τ"},{name:"upsilon",symbol:"υ"},{name:"phi",symbol:"ϕ"},{name:"chi",symbol:"χ"},{name:"psi",symbol:"ψ"},{name:"omega",symbol:"ω"}];function a(e){return e.charAt(0).toUpperCase()+e.slice(1)}function u(e){return i("Converting math symbols "+e),o.forEach((t=>{e=(e=e.split(t.symbol).join(t.name)).split(a(t.symbol)).join(a(t.name))})),i("Converted math symbols "+e),e}const h=o;class p{constructor(e,t,r={}){this.lexer=new t(e),this.options=r,this.ast=null,this.current_token=null,this.peek_token=null,this.functions=s.concat(r.functions||[])}parse(){return i("\nLatex parser .parse()"),this.ast=this.equation(),this.eat("EOF"),this.ast}next_token(){return null!=this.peek_token?(this.current_token=this.peek_token,this.peek_token=null,i("next token from peek",this.current_token)):(this.current_token=this.lexer.next_token(),i("next token",this.current_token)),this.current_token}peek(){return null==this.peek_token&&(this.peek_token=this.lexer.next_token()),i("next token from peek",this.peek_token),this.peek_token}error(e){let t=this.lexer.text.split("\n")[this.lexer.line],r="";for(let e=0;e<this.lexer.col;e++)r+=" ";throw Error(`Parser error\n${t}\n${r}^\nError at line: ${this.lexer.line+1} col: ${this.lexer.col+1}\n${e}`)}eat(e){this.next_token().type!=e&&this.error(`Expected ${e} found ${JSON.stringify(this.current_token)}`)}equation(){let e=this.expr();return"equal"!=this.peek().type?e:(this.next_token(),{type:"equation",lhs:e,rhs:this.expr()})}expr(){return i("expr"),this.peek(),"number"==this.peek_token.type||"operator"==this.peek_token.type||"variable"==this.peek_token.type||"function"==this.peek_token.type||"keyword"==this.peek_token.type||"bracket"==this.peek_token.type?this.operator():"bracket"==this.peek_token.type&&0==this.peek_token.open?null:"EOF"==this.peek_token.type?(this.next_token(),null):(this.next_token(),void this.error("Unexpected token: "+JSON.stringify(this.current_token)))}keyword(){if(i("keyword"),"keyword"!=this.peek().type)throw Error("Expected keyword found "+JSON.stringify(this.peek_token));let e=this.peek_token.value;return e=e.toLowerCase(),i("keyword -",e),"frac"==e?this.fraction():"sqrt"==e?this.sqrt():this.functions.includes(e.toLowerCase())?this.function():(this.eat("keyword"),{type:"keyword",value:this.current_token.value})}sqrt(){if(i("sqrt"),this.eat("keyword"),"sqrt"!=this.current_token.value&&this.error("Expected sqrt found "+JSON.stringify(this.current_token)),"["!=this.peek().value)return{type:"function",value:"sqrt",content:this.group()};this.eat("bracket"),"["!=this.current_token.value&&this.error('Expected "[" bracket, found '+JSON.stringify(this.current_token));let e=this.number();return this.eat("bracket"),"]"!=this.current_token.value&&this.error('Expected "]" bracket, found '+JSON.stringify(this.current_token)),{type:"operator",operator:"exponent",lhs:this.group(),rhs:{type:"operator",operator:"divide",lhs:{type:"number",value:1},rhs:e}}}fraction(){return i("fraction"),this.eat("keyword"),"frac"!=this.current_token.value&&this.error("Expected fraction found "+JSON.stringify(this.current_token)),{type:"operator",operator:"divide",lhs:this.group(),rhs:this.group()}}function(){i("function"),this.eat("keyword");let e,t=this.current_token.value;return e="bracket"==this.peek().type?this.group():this.number(),{type:"function",value:t,content:e}}group(){i("start group"),this.eat("bracket"),1!=this.current_token.open&&this.error("Expected opening bracket found "+this.current_token);let e=this.expr();return this.eat("bracket"),0!=this.current_token.open&&this.error("Expected closing bracket found "+this.current_token),i("end group"),e}operator(){i("operator left");let e=this.operator_multiply(),t=this.peek();if("operator"!=t.type||"plus"!=t.value&&"minus"!=t.value)return i("operator only left side"),e;this.next_token(),i("operator right");let r=this.operator();return{type:"operator",operator:t.value,lhs:e,rhs:r}}operator_multiply(){let e;i("op mul left"),e="bracket"==this.peek().type?this.group():this.operator_divide();let t=this.peek();if("number"==t.type||"variable"==t.type||"keyword"==t.type||"bracket"==t.type&&"("==t.value)t={type:"operator",value:"multiply"};else{if("operator"!=t.type||"multiply"!=t.value&&"divide"!=t.value)return i("term only left side"),e;this.next_token()}i("op mul right");let r=this.operator_multiply();return{type:"operator",operator:t.value,lhs:e,rhs:r}}operator_divide(){i("operator_divide");let e=this.operator_mod();return this.operator_divide_prime(e)}operator_divide_prime(e){let t=this.peek();if("operator"!=t.type||"divide"!=t.value)return i("operator_divide_prime - epsilon"),e;this.next_token(),i("operator_divide_prime - next operator");let r=this.operator_mod();return this.operator_divide_prime({type:"operator",operator:"divide",lhs:e,rhs:r})}operator_mod(){i("modulus left");let e=this.operator_exp(),t=this.peek();return"operator"!=t.type||"modulus"!=t.value?(i("modulus only left side"),e):(this.next_token(),i("modulus right"),{type:"operator",operator:"modulus",lhs:e,rhs:this.operator_mod()})}operator_exp(){let e=this.subscript(),t=this.peek();return"operator"!=t.type||"exponent"!=t.value?(i("modulus only left side"),e):(this.next_token(),{type:"operator",operator:"exponent",lhs:e,rhs:this.operator_exp()})}variable(){return this.eat("variable"),{type:"variable",value:this.current_token.value}}subscript(){const e=this.number();return"underscore"==this.peek().type?(this.eat("underscore"),{type:"subscript",base:e,subscript:this.subscript()}):e}number(){return i("number"),this.peek(),"number"==this.peek_token.type?(this.next_token(),{type:this.current_token.type,value:this.current_token.value}):"operator"==this.peek_token.type?this.uni_operator():"variable"==this.peek_token.type?this.variable():"keyword"==this.peek_token.type?this.keyword():"bracket"==this.peek_token.type?this.group():(this.next_token(),void this.error("Expected number, variable, function, group, or + - found "+JSON.stringify(this.current_token)))}uni_operator(){if(this.eat("operator"),"plus"==this.current_token.value||"minus"==this.current_token.value){let e=this.current_token.value,t=this.number();return"number"==t.type?{type:"number",value:"minus"==e?-t.value:t.value}:{type:"uni-operator",operator:e,value:t}}}}class l{constructor(e){this.ast=e}format(e=this.ast){if(null==e)return"";switch(e.type){case"operator":return this.operator(e);case"number":return this.number(e);case"function":return this.function(e);case"variable":return this.variable(e);case"equation":return this.equation(e);case"subscript":return this.subscript(e);case"uni-operator":return this.uni_operator(e);default:throw Error("Unexpected type: "+e.type)}}operator(e){let t=e.operator;switch(t){case"plus":t="+";break;case"minus":t="-";break;case"multiply":t="*";break;case"divide":t="/";break;case"modulus":t="%";break;case"exponent":t="^"}let r=this.format(e.lhs),s=this.format(e.rhs);const n=[["modulus"],["exponent"],["multiply","divide"],["plus","minus"]],i=t=>"operator"==t.type&&((e,t)=>{const r=e=>n.findIndex((t=>t.includes(e)));return r(t)>r(e)})(e.operator,t.operator);let o=i(e.lhs),a=i(e.rhs);return a=a||"/"==t&&"operator"==e.rhs.type,"exponent"==e.operator&&"number"==e.rhs.type&&e.rhs.value<0&&(a=!0),r=o?`(${r})`:r,s=a?`(${s})`:s,r+t+s}number(e){return""+e.value}function(e){return`${e.value}(${this.format(e.content)})`}variable(e){return function(e){let t=o.find((t=>t.name===e.toLowerCase()));return void 0===t?null:(t=t.symbol,(r=e).charAt(0).toUpperCase()===r.charAt(0)&&(t=a(t)),t);var r}(e.value)||""+e.value}equation(e){return`${this.format(e.lhs)}=${this.format(e.rhs)}`}subscript(e){return"variable"==e.subscript.type&&1==e.subscript.value.length?`${this.format(e.base)}_${this.format(e.subscript)}`:`${this.format(e.base)}_(${this.format(e.subscript)})`}uni_operator(e){return"minus"==e.operator?"-"+this.format(e.value):this.format(e.value)}}class c{constructor(e){this.ast=e}format(e=this.ast){if(null==e)return"";switch(e.type){case"operator":return this.operator(e);case"number":return this.number(e);case"function":return this.function(e);case"variable":return this.variable(e);case"equation":return this.equation(e);case"subscript":return this.subscript(e);case"uni-operator":return this.uni_operator(e);default:throw Error("Unexpected type: "+e.type)}}operator(e){let t=e.operator;switch(t){case"plus":t="+";break;case"minus":t="-";break;case"multiply":t="\\cdot ";break;case"divide":return this.fragment(e);case"modulus":t="%";break;case"exponent":t="^"}let r=this.format(e.lhs),s=this.format(e.rhs);const n=[["modulus"],["exponent"],["multiply"],["plus","minus"]],i=t=>"operator"==t.type&&((e,t)=>{const r=e=>n.findIndex((t=>t.includes(e)));return r(t)>r(e)})(e.operator,t.operator);let o=i(e.lhs),a=i(e.rhs);return r=o?`\\left(${r}\\right)`:r,"exponent"==e.operator?(a=!0,s=a?`{${s}}`:s):s=a?`\\left(${s}\\right)`:s,`${r}${t}${s}`}fragment(e){return`\\frac{${this.format(e.lhs)}}{${this.format(e.rhs)}}`}number(e){return""+e.value}function(e){return"sqrt"==e.value?`\\${e.value}{${this.format(e.content)}}`:`\\${e.value}\\left(${this.format(e.content)}\\right)`}variable(e){return h.map((e=>e.name)).includes(e.value.toLowerCase())?"\\"+e.value:""+e.value}equation(e){return`${this.format(e.lhs)}=${this.format(e.rhs)}`}subscript(e){return"variable"==e.subscript.type&&1==e.subscript.value.length?`${this.format(e.base)}_${this.format(e.subscript)}`:`${this.format(e.base)}_{${this.format(e.subscript)}}`}uni_operator(e){return"minus"==e.operator?"-"+this.format(e.value):this.format(e.value)}}class m{constructor(e){this.text=e,this.pos=0,this.col=0,this.line=0,this.prev_col=0,this.prev_line=0}increment(e=1){this.pos+=e,this.col+=e}error(e){let t=this.text.split("\n")[this.prev_line],r="";for(let e=0;e<this.prev_col;e++)r+=" ";throw Error(`Lexer error\n${t}\n${r}^\nError at line: ${this.prev_line+1} col: ${this.prev_col+1}\n${e}`)}current_char(){return this.text.charAt(this.pos)}eat(e){this.current_char()==e?this.pos+=1:this.error(`Expected ${e} found ${this.current_char()}`)}number(){let e="",t=!1;for(;this.current_char().match(/[0-9\.]/);){if("."==this.current_char()){if(t)break;t=!0}e+=this.current_char(),this.increment()}let r=Number(e);return isNaN(r)&&this.error(`Could not parse number: '${e}'`),{type:"number",value:r}}}class k extends m{constructor(e){super(e)}next_token(){if(this.prev_col=this.col,this.prev_line=this.line,this.pos>=this.text.length)return{type:"EOF"};"\n"==this.current_char()&&(this.col=0,this.line++);const e=[" ","\n","\\ ","\\!","&","\\,","\\:","\\;","\\quad","\\qquad"];for(let t of e)if(this.text.startsWith(t,this.pos))return this.increment(t.length),this.next_token();return"\\"==this.current_char()?this.keyword():this.current_char().match(/[0-9]/)?this.number():this.current_char().match(/[a-zA-Z]/)?this.variable():"{"==this.current_char()?(this.increment(),{type:"bracket",open:!0,value:"{"}):"}"==this.current_char()?(this.increment(),{type:"bracket",open:!1,value:"}"}):"("==this.current_char()?(this.increment(),{type:"bracket",open:!0,value:"("}):")"==this.current_char()?(this.increment(),{type:"bracket",open:!1,value:")"}):"["==this.current_char()?(this.increment(),{type:"bracket",open:!0,value:"["}):"]"==this.current_char()?(this.increment(),{type:"bracket",open:!1,value:"]"}):"+"==this.current_char()?(this.increment(),{type:"operator",value:"plus"}):"-"==this.current_char()?(this.increment(),{type:"operator",value:"minus"}):"*"==this.current_char()?(this.increment(),{type:"operator",value:"multiply"}):"/"==this.current_char()?(this.increment(),{type:"operator",value:"divide"}):"^"==this.current_char()?(this.increment(),{type:"operator",value:"exponent"}):"="==this.current_char()?(this.increment(),{type:"equal"}):"_"==this.current_char()?(this.increment(),{type:"underscore"}):void this.error("Unknown symbol: "+this.current_char())}keyword(){this.eat("\\");let e=this.variable();if("cdot"==e.value)return{type:"operator",value:"multiply"};if("mod"==e.value)return{type:"operator",value:"modulus"};if("left"==e.value){let e=this.next_token();return"bracket"!=e.type&&1!=e.open&&this.error("Expected opening bracket found "+JSON.stringify(e)),e}if("right"==e.value){let e=this.next_token();return"bracket"!=e.type&&0!=e.open&&this.error("Expected closing bracket found "+JSON.stringify(e)),e}return h.map((e=>e.name)).includes(e.value.toLowerCase())?{type:"variable",value:e.value}:{type:"keyword",value:e.value}}variable(){let e="";for(;this.current_char().match(/[a-zA-Z]/)&&this.pos<=this.text.length;)e+=this.current_char(),this.increment();return{type:"variable",value:e}}}class y extends m{constructor(e){super(e)}next_token(){if(this.prev_col=this.col,this.prev_line=this.line,this.pos>=this.text.length)return{type:"EOF"};"\n"==this.current_char()&&(this.col=0,this.line++);const e=[" ","\n"];for(let t of e)if(this.text.startsWith(t,this.pos))return this.increment(t.length),this.next_token();return this.current_char().match(/[0-9]/)?this.number():this.current_char().match(/[a-zA-Z]/)?this.alphabetic():"("==this.current_char()?(this.increment(),{type:"bracket",open:!0,value:"("}):")"==this.current_char()?(this.increment(),{type:"bracket",open:!1,value:")"}):"+"==this.current_char()?(this.increment(),{type:"operator",value:"plus"}):"-"==this.current_char()?(this.increment(),{type:"operator",value:"minus"}):"*"==this.current_char()?(this.increment(),{type:"operator",value:"multiply"}):"/"==this.current_char()?(this.increment(),{type:"operator",value:"divide"}):"^"==this.current_char()?(this.increment(),{type:"operator",value:"exponent"}):"="==this.current_char()?(this.increment(),{type:"equal"}):"_"==this.current_char()?(this.increment(),{type:"underscore"}):void this.error("Unknown symbol: "+this.current_char())}alphabetic(){let e="";for(;this.current_char().match(/[a-zA-Z]/)&&this.pos<=this.text.length;)e+=this.current_char(),this.increment();return s.includes(e)?{type:"keyword",value:e}:{type:"variable",value:e}}}(e=r.hmd(e)).exports=class{constructor(e={}){this.options=e}parseLatex(e){return e=e.replace(/,/g,"."),this.input=e,this.parser=new p(e,k,this.options),this.parser.parse(),this}parseMath(e){return e=e.replace(/,/g,"."),this.input=e,this.parser=new p(e,y,this.options),this.parser.parse(),this}getAst(){return this.parser.ast}toMath(){return new l(this.getAst()).format()}toLatex(){return new c(this.getAst()).format()}toTex(){return self.toLatex()}toAlgebra(e){if(null===e)throw new Error("Algebra.js must be passed as a parameter for toAlgebra");let t=this.toMath();return t=u(t),e.parse(t)}toAlgebrite(e){if(null===e)return new Error("Algebrite must be passed as a parameter for toAlgebrite");if(this.isEquation())return new Error("Algebrite can not handle equations, only expressions");let t=this.toMath();return t=u(t),e.eval(t)}toCoffeequate(e){if(null===e)return new Error("Coffeequante must be passed as a parameter for toCoffeequante");let t=this.toMath();return t=t.replace(/\^/g,"**"),e(t)}isEquation(){return this.input.includes("=")}}}},t={};function r(s){if(t[s])return t[s].exports;var n=t[s]={id:s,loaded:!1,exports:{}};return e[s](n,n.exports,r),n.loaded=!0,n.exports}r.hmd=e=>((e=Object.create(e)).children||(e.children=[]),Object.defineProperty(e,"exports",{enumerable:!0,set:()=>{throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+e.id)}}),e),r(24)})();