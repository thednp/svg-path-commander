var SVGPathCommander=function(){"use strict";var ln=Object.defineProperty;var an=(W,F,q)=>F in W?ln(W,F,{enumerable:!0,configurable:!0,writable:!0,value:q}):W[F]=q;var A=(W,F,q)=>an(W,typeof F!="symbol"?F+"":F,q);var W=Object.defineProperty,F=(e,t,s)=>t in e?W(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s,q=(e,t,s)=>F(e,typeof t!="symbol"?t+"":t,s);const Ze={a:1,b:0,c:0,d:1,e:0,f:0,m11:1,m12:0,m13:0,m14:0,m21:0,m22:1,m23:0,m24:0,m31:0,m32:0,m33:1,m34:0,m41:0,m42:0,m43:0,m44:1,is2D:!0,isIdentity:!0},Wt=e=>(e instanceof Float64Array||e instanceof Float32Array||Array.isArray(e)&&e.every(t=>typeof t=="number"))&&[6,16].some(t=>e.length===t),Xt=e=>e instanceof DOMMatrix||e instanceof T||typeof e=="object"&&Object.keys(Ze).every(t=>e&&t in e),it=e=>{const t=new T,s=Array.from(e);if(!Wt(s))throw TypeError(`CSSMatrix: "${s.join(",")}" must be an array with 6/16 numbers.`);if(s.length===16){const[r,n,i,o,l,c,a,u,m,h,g,f,y,p,M,N]=s;t.m11=r,t.a=r,t.m21=l,t.c=l,t.m31=m,t.m41=y,t.e=y,t.m12=n,t.b=n,t.m22=c,t.d=c,t.m32=h,t.m42=p,t.f=p,t.m13=i,t.m23=a,t.m33=g,t.m43=M,t.m14=o,t.m24=u,t.m34=f,t.m44=N}else if(s.length===6){const[r,n,i,o,l,c]=s;t.m11=r,t.a=r,t.m12=n,t.b=n,t.m21=i,t.c=i,t.m22=o,t.d=o,t.m41=l,t.e=l,t.m42=c,t.f=c}return t},Yt=e=>{if(Xt(e))return it([e.m11,e.m12,e.m13,e.m14,e.m21,e.m22,e.m23,e.m24,e.m31,e.m32,e.m33,e.m34,e.m41,e.m42,e.m43,e.m44]);throw TypeError(`CSSMatrix: "${JSON.stringify(e)}" is not a DOMMatrix / CSSMatrix / JSON compatible object.`)},Vt=e=>{if(typeof e!="string")throw TypeError(`CSSMatrix: "${JSON.stringify(e)}" is not a string.`);const t=String(e).replace(/\s/g,"");let s=new T;const r=`CSSMatrix: invalid transform string "${e}"`;return t.split(")").filter(n=>n).forEach(n=>{const[i,o]=n.split("(");if(!o)throw TypeError(r);const l=o.split(",").map(f=>f.includes("rad")?parseFloat(f)*(180/Math.PI):parseFloat(f)),[c,a,u,m]=l,h=[c,a,u],g=[c,a,u,m];if(i==="perspective"&&c&&[a,u].every(f=>f===void 0))s.m34=-1/c;else if(i.includes("matrix")&&[6,16].includes(l.length)&&l.every(f=>!Number.isNaN(+f))){const f=l.map(y=>Math.abs(y)<1e-6?0:y);s=s.multiply(it(f))}else if(i==="translate3d"&&h.every(f=>!Number.isNaN(+f)))s=s.translate(c,a,u);else if(i==="translate"&&c&&u===void 0)s=s.translate(c,a||0,0);else if(i==="rotate3d"&&g.every(f=>!Number.isNaN(+f))&&m)s=s.rotateAxisAngle(c,a,u,m);else if(i==="rotate"&&c&&[a,u].every(f=>f===void 0))s=s.rotate(0,0,c);else if(i==="scale3d"&&h.every(f=>!Number.isNaN(+f))&&h.some(f=>f!==1))s=s.scale(c,a,u);else if(i==="scale"&&!Number.isNaN(c)&&c!==1&&u===void 0){const f=Number.isNaN(+a)?c:a;s=s.scale(c,f,1)}else if(i==="skew"&&(c||!Number.isNaN(c)&&a)&&u===void 0)s=s.skew(c,a||0);else if(["translate","rotate","scale","skew"].some(f=>i.includes(f))&&/[XYZ]/.test(i)&&c&&[a,u].every(f=>f===void 0))if(i==="skewX"||i==="skewY")s=s[i](c);else{const f=i.replace(/[XYZ]/,""),y=i.replace(f,""),p=["X","Y","Z"].indexOf(y),M=f==="scale"?1:0,N=[p===0?c:M,p===1?c:M,p===2?c:M];s=s[f](...N)}else throw TypeError(r)}),s},zt=(e,t)=>t?[e.a,e.b,e.c,e.d,e.e,e.f]:[e.m11,e.m12,e.m13,e.m14,e.m21,e.m22,e.m23,e.m24,e.m31,e.m32,e.m33,e.m34,e.m41,e.m42,e.m43,e.m44],Gt=(e,t,s)=>{const r=new T;return r.m41=e,r.e=e,r.m42=t,r.f=t,r.m43=s,r},te=(e,t,s)=>{const r=new T,n=Math.PI/180,i=e*n,o=t*n,l=s*n,c=Math.cos(i),a=-Math.sin(i),u=Math.cos(o),m=-Math.sin(o),h=Math.cos(l),g=-Math.sin(l),f=u*h,y=-u*g;r.m11=f,r.a=f,r.m12=y,r.b=y,r.m13=m;const p=a*m*h+c*g;r.m21=p,r.c=p;const M=c*h-a*m*g;return r.m22=M,r.d=M,r.m23=-a*u,r.m31=a*g-c*m*h,r.m32=a*h+c*m*g,r.m33=c*u,r},ee=(e,t,s,r)=>{const n=new T,i=Math.sqrt(e*e+t*t+s*s);if(i===0)return n;const o=e/i,l=t/i,c=s/i,a=r*(Math.PI/360),u=Math.sin(a),m=Math.cos(a),h=u*u,g=o*o,f=l*l,y=c*c,p=1-2*(f+y)*h;n.m11=p,n.a=p;const M=2*(o*l*h+c*u*m);n.m12=M,n.b=M,n.m13=2*(o*c*h-l*u*m);const N=2*(l*o*h-c*u*m);n.m21=N,n.c=N;const x=1-2*(y+g)*h;return n.m22=x,n.d=x,n.m23=2*(l*c*h+o*u*m),n.m31=2*(c*o*h+l*u*m),n.m32=2*(c*l*h-o*u*m),n.m33=1-2*(g+f)*h,n},ne=(e,t,s)=>{const r=new T;return r.m11=e,r.a=e,r.m22=t,r.d=t,r.m33=s,r},yt=(e,t)=>{const s=new T;if(e){const r=e*Math.PI/180,n=Math.tan(r);s.m21=n,s.c=n}if(t){const r=t*Math.PI/180,n=Math.tan(r);s.m12=n,s.b=n}return s},se=e=>yt(e,0),re=e=>yt(0,e),_=(e,t)=>{const s=t.m11*e.m11+t.m12*e.m21+t.m13*e.m31+t.m14*e.m41,r=t.m11*e.m12+t.m12*e.m22+t.m13*e.m32+t.m14*e.m42,n=t.m11*e.m13+t.m12*e.m23+t.m13*e.m33+t.m14*e.m43,i=t.m11*e.m14+t.m12*e.m24+t.m13*e.m34+t.m14*e.m44,o=t.m21*e.m11+t.m22*e.m21+t.m23*e.m31+t.m24*e.m41,l=t.m21*e.m12+t.m22*e.m22+t.m23*e.m32+t.m24*e.m42,c=t.m21*e.m13+t.m22*e.m23+t.m23*e.m33+t.m24*e.m43,a=t.m21*e.m14+t.m22*e.m24+t.m23*e.m34+t.m24*e.m44,u=t.m31*e.m11+t.m32*e.m21+t.m33*e.m31+t.m34*e.m41,m=t.m31*e.m12+t.m32*e.m22+t.m33*e.m32+t.m34*e.m42,h=t.m31*e.m13+t.m32*e.m23+t.m33*e.m33+t.m34*e.m43,g=t.m31*e.m14+t.m32*e.m24+t.m33*e.m34+t.m34*e.m44,f=t.m41*e.m11+t.m42*e.m21+t.m43*e.m31+t.m44*e.m41,y=t.m41*e.m12+t.m42*e.m22+t.m43*e.m32+t.m44*e.m42,p=t.m41*e.m13+t.m42*e.m23+t.m43*e.m33+t.m44*e.m43,M=t.m41*e.m14+t.m42*e.m24+t.m43*e.m34+t.m44*e.m44;return it([s,r,n,i,o,l,c,a,u,m,h,g,f,y,p,M])};class T{constructor(t){return this.a=1,this.b=0,this.c=0,this.d=1,this.e=0,this.f=0,this.m11=1,this.m12=0,this.m13=0,this.m14=0,this.m21=0,this.m22=1,this.m23=0,this.m24=0,this.m31=0,this.m32=0,this.m33=1,this.m34=0,this.m41=0,this.m42=0,this.m43=0,this.m44=1,t?this.setMatrixValue(t):this}get isIdentity(){return this.m11===1&&this.m12===0&&this.m13===0&&this.m14===0&&this.m21===0&&this.m22===1&&this.m23===0&&this.m24===0&&this.m31===0&&this.m32===0&&this.m33===1&&this.m34===0&&this.m41===0&&this.m42===0&&this.m43===0&&this.m44===1}get is2D(){return this.m31===0&&this.m32===0&&this.m33===1&&this.m34===0&&this.m43===0&&this.m44===1}setMatrixValue(t){return typeof t=="string"&&t.length&&t!=="none"?Vt(t):Array.isArray(t)||t instanceof Float64Array||t instanceof Float32Array?it(t):typeof t=="object"?Yt(t):this}toFloat32Array(t){return Float32Array.from(zt(this,t))}toFloat64Array(t){return Float64Array.from(zt(this,t))}toString(){const{is2D:t}=this,s=this.toFloat64Array(t).join(", ");return`${t?"matrix":"matrix3d"}(${s})`}toJSON(){const{is2D:t,isIdentity:s}=this;return{...this,is2D:t,isIdentity:s}}multiply(t){return _(this,t)}translate(t,s,r){const n=t;let i=s,o=r;return typeof i>"u"&&(i=0),typeof o>"u"&&(o=0),_(this,Gt(n,i,o))}scale(t,s,r){const n=t;let i=s,o=r;return typeof i>"u"&&(i=t),typeof o>"u"&&(o=1),_(this,ne(n,i,o))}rotate(t,s,r){let n=t,i=s||0,o=r||0;return typeof t=="number"&&typeof s>"u"&&typeof r>"u"&&(o=n,n=0,i=0),_(this,te(n,i,o))}rotateAxisAngle(t,s,r,n){if([t,s,r,n].some(i=>Number.isNaN(+i)))throw new TypeError("CSSMatrix: expecting 4 values");return _(this,ee(t,s,r,n))}skewX(t){return _(this,se(t))}skewY(t){return _(this,re(t))}skew(t,s){return _(this,yt(t,s))}transformPoint(t){const s=this.m11*t.x+this.m21*t.y+this.m31*t.z+this.m41*t.w,r=this.m12*t.x+this.m22*t.y+this.m32*t.z+this.m42*t.w,n=this.m13*t.x+this.m23*t.y+this.m33*t.z+this.m43*t.w,i=this.m14*t.x+this.m24*t.y+this.m34*t.z+this.m44*t.w;return t instanceof DOMPoint?new DOMPoint(s,r,n,i):{x:s,y:r,z:n,w:i}}}q(T,"Translate",Gt),q(T,"Rotate",te),q(T,"RotateAxisAngle",ee),q(T,"Scale",ne),q(T,"SkewX",se),q(T,"SkewY",re),q(T,"Skew",yt),q(T,"Multiply",_),q(T,"fromArray",it),q(T,"fromMatrix",Yt),q(T,"fromString",Vt),q(T,"toArray",zt),q(T,"isCompatibleArray",Wt),q(T,"isCompatibleObject",Xt);const X={origin:[0,0,0],round:4},et={a:7,c:6,h:1,l:2,m:2,r:4,q:4,s:4,t:2,v:1,z:0},Pt=e=>{let t=e.pathValue[e.segmentStart],s=t.toLowerCase();const{data:r}=e;for(;r.length>=et[s]&&(s==="m"&&r.length>2?(e.segments.push([t].concat(r.splice(0,2))),s="l",t=t==="m"?"l":"L"):e.segments.push([t].concat(r.splice(0,et[s]))),!!et[s]););},j="SVGPathCommander Error",ie=e=>{const{index:t,pathValue:s}=e,r=s.charCodeAt(t);if(r===48){e.param=0,e.index+=1;return}if(r===49){e.param=1,e.index+=1;return}e.err=`${j}: invalid Arc flag "${s[t]}", expecting 0 or 1 at index ${t}`},J=e=>e>=48&&e<=57,K="Invalid path value",oe=e=>{const{max:t,pathValue:s,index:r}=e;let n=r,i=!1,o=!1,l=!1,c=!1,a;if(n>=t){e.err=`${j}: ${K} at index ${n}, "pathValue" is missing param`;return}if(a=s.charCodeAt(n),(a===43||a===45)&&(n+=1,a=s.charCodeAt(n)),!J(a)&&a!==46){e.err=`${j}: ${K} at index ${n}, "${s[n]}" is not a number`;return}if(a!==46){if(i=a===48,n+=1,a=s.charCodeAt(n),i&&n<t&&a&&J(a)){e.err=`${j}: ${K} at index ${r}, "${s[r]}" illegal number`;return}for(;n<t&&J(s.charCodeAt(n));)n+=1,o=!0;a=s.charCodeAt(n)}if(a===46){for(c=!0,n+=1;J(s.charCodeAt(n));)n+=1,l=!0;a=s.charCodeAt(n)}if(a===101||a===69){if(c&&!o&&!l){e.err=`${j}: ${K} at index ${n}, "${s[n]}" invalid float exponent`;return}if(n+=1,a=s.charCodeAt(n),(a===43||a===45)&&(n+=1),n<t&&J(s.charCodeAt(n)))for(;n<t&&J(s.charCodeAt(n));)n+=1;else{e.err=`${j}: ${K} at index ${n}, "${s[n]}" invalid integer exponent`;return}}e.index=n,e.param=+e.pathValue.slice(r,n)},ce=e=>[5760,6158,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8239,8287,12288,65279,10,13,8232,8233,32,9,11,12,160].includes(e),nt=e=>{const{pathValue:t,max:s}=e;for(;e.index<s&&ce(t.charCodeAt(e.index));)e.index+=1},le=e=>{switch(e|32){case 109:case 122:case 108:case 104:case 118:case 99:case 115:case 113:case 116:case 97:return!0;default:return!1}},ae=e=>J(e)||e===43||e===45||e===46,ue=e=>(e|32)===97,me=e=>{switch(e|32){case 109:case 77:return!0;default:return!1}},qt=e=>{var c;const{max:t,pathValue:s,index:r,segments:n}=e,i=s.charCodeAt(r),o=et[s[r].toLowerCase()];if(e.segmentStart=r,!le(i)){e.err=`${j}: ${K} "${s[r]}" is not a path command at index ${r}`;return}const l=n[n.length-1];if(!me(i)&&((c=l==null?void 0:l[0])==null?void 0:c.toLocaleLowerCase())==="z"){e.err=`${j}: ${K} "${s[r]}" is not a MoveTo path command at index ${r}`;return}if(e.index+=1,nt(e),e.data=[],!o){Pt(e);return}for(;;){for(let a=o;a>0;a-=1){if(ue(i)&&(a===3||a===4)?ie(e):oe(e),e.err.length)return;e.data.push(e.param),nt(e),e.index<t&&s.charCodeAt(e.index)===44&&(e.index+=1,nt(e))}if(e.index>=e.max||!ae(s.charCodeAt(e.index)))break}Pt(e)};class kt{constructor(t){this.segments=[],this.pathValue=t,this.max=t.length,this.index=0,this.param=0,this.segmentStart=0,this.data=[],this.err=""}}const Q=e=>{if(typeof e!="string")return e.slice(0);const t=new kt(e);for(nt(t);t.index<t.max&&!t.err.length;)qt(t);if(t!=null&&t.err.length)throw TypeError(t.err);return t.segments},ot=(e,t,s,r)=>{const[n]=e,i=n.toUpperCase();if(t===0||i===n)return e;if(i==="A")return[i,e[1],e[2],e[3],e[4],e[5],e[6]+s,e[7]+r];if(i==="V")return[i,e[1]+r];if(i==="H")return[i,e[1]+s];if(i==="L")return[i,e[1]+s,e[2]+r];{const l=[],c=e.length;for(let a=1;a<c;a+=1)l.push(e[a]+(a%2?s:r));return[i].concat(l)}},Z=(e,t)=>{let s=e.length,r,n="M",i="M",o=!1,l=0,c=0,a=0,u=0,m=0;for(let h=0;h<s;h+=1){r=e[h],[n]=r,m=r.length,i=n.toUpperCase(),o=i!==n;const g=t(r,h,l,c);if(g===!1)break;i==="Z"?(l=a,c=u):i==="H"?l=r[1]+(o?l:0):i==="V"?c=r[1]+(o?c:0):(l=r[m-2]+(o?l:0),c=r[m-1]+(o?c:0),i==="M"&&(a=l,u=c)),g&&(e[h]=g,g[0]==="C"&&(s=e.length))}return e},gt=e=>{const t=Q(e);return Z(t,ot)},It=(e,t,s,r)=>{const[n]=e,i=n.toLowerCase();if(t===0||n===i)return e;if(i==="a")return[i,e[1],e[2],e[3],e[4],e[5],e[6]-s,e[7]-r];if(i==="v")return[i,e[1]-r];if(i==="h")return[i,e[1]-s];if(i==="l")return[i,e[1]-s,e[2]-r];{const l=[],c=e.length;for(let a=1;a<c;a+=1)l.push(e[a]-(a%2?s:r));return[i].concat(l)}},fe=e=>{const t=Q(e);return Z(t,It)},ct=(e,t,s)=>{const{sin:r,cos:n}=Math,i=e*n(s)-t*r(s),o=e*r(s)+t*n(s);return{x:i,y:o}},xt=(e,t,s,r,n,i,o,l,c,a)=>{let u=e,m=t,h=s,g=r,f=l,y=c;const p=Math.PI*120/180,M=Math.PI/180*(+n||0);let N=[],x,b,L,C,E;if(a)[b,L,C,E]=a;else{x=ct(u,m,-M),u=x.x,m=x.y,x=ct(f,y,-M),f=x.x,y=x.y;const v=(u-f)/2,O=(m-y)/2;let tt=v*v/(h*h)+O*O/(g*g);tt>1&&(tt=Math.sqrt(tt),h*=tt,g*=tt);const Jt=h*h,Kt=g*g,Qe=(i===o?-1:1)*Math.sqrt(Math.abs((Jt*Kt-Jt*O*O-Kt*v*v)/(Jt*O*O+Kt*v*v)));C=Qe*h*O/g+(u+f)/2,E=Qe*-g*v/h+(m+y)/2,b=Math.asin(((m-E)/g*10**9>>0)/10**9),L=Math.asin(((y-E)/g*10**9>>0)/10**9),b=u<C?Math.PI-b:b,L=f<C?Math.PI-L:L,b<0&&(b=Math.PI*2+b),L<0&&(L=Math.PI*2+L),o&&b>L&&(b-=Math.PI*2),!o&&L>b&&(L-=Math.PI*2)}let S=L-b;if(Math.abs(S)>p){const v=L,O=f,tt=y;L=b+p*(o&&L>b?1:-1),f=C+h*Math.cos(L),y=E+g*Math.sin(L),N=xt(f,y,h,g,n,0,o,O,tt,[L,v,C,E])}S=L-b;const I=Math.cos(b),z=Math.sin(b),D=Math.cos(L),V=Math.sin(L),P=Math.tan(S/4),w=4/3*h*P,$=4/3*g*P,R=[u,m],H=[u+w*z,m-$*I],U=[f+w*V,y-$*D],rt=[f,y];if(H[0]=2*R[0]-H[0],H[1]=2*R[1]-H[1],a)return[H[0],H[1],U[0],U[1],rt[0],rt[1]].concat(N);N=[H[0],H[1],U[0],U[1],rt[0],rt[1]].concat(N);const G=[];for(let v=0,O=N.length;v<O;v+=1)G[v]=v%2?ct(N[v-1],N[v],M).y:ct(N[v],N[v+1],M).x;return G},he=(e,t,s,r,n,i)=>{const o=.3333333333333333,l=2/3;return[o*e+l*s,o*t+l*r,o*n+l*s,o*i+l*r,n,i]},B=(e,t,s)=>{const[r,n]=e,[i,o]=t;return[r+(i-r)*s,n+(o-n)*s]},Et=(e,t,s,r)=>{const n=B([e,t],[s,r],.3333333333333333),i=B([e,t],[s,r],2/3);return[n[0],n[1],i[0],i[1],s,r]},ye=(e,t)=>{const[s]=e,r=e.slice(1).map(Number),[n,i]=r,{x1:o,y1:l,x:c,y:a}=t;return"TQ".includes(s)||(t.qx=null,t.qy=null),s==="M"?(t.x=n,t.y=i,e):s==="A"?["C"].concat(xt(o,l,r[0],r[1],r[2],r[3],r[4],r[5],r[6])):s==="Q"?(t.qx=n,t.qy=i,["C"].concat(he(o,l,r[0],r[1],r[2],r[3]))):s==="L"?["C"].concat(Et(o,l,n,i)):s==="Z"?["C"].concat(Et(o,l,c,a)):e},pt=(e,t)=>{const[s]=e,r=s.toUpperCase(),n=s!==r,{x1:i,y1:o,x2:l,y2:c,x:a,y:u}=t,m=e.slice(1);let h=m.map((g,f)=>g+(n?f%2?u:a:0));if("TQ".includes(r)||(t.qx=null,t.qy=null),r==="A")return h=m.slice(0,-2).concat(m[5]+(n?a:0),m[6]+(n?u:0)),["A"].concat(h);if(r==="H")return["L",e[1]+(n?a:0),o];if(r==="V")return["L",i,e[1]+(n?u:0)];if(r==="L")return["L",e[1]+(n?a:0),e[2]+(n?u:0)];if(r==="M")return["M",e[1]+(n?a:0),e[2]+(n?u:0)];if(r==="C")return["C"].concat(h);if(r==="S"){const g=i*2-l,f=o*2-c;return t.x1=g,t.y1=f,["C",g,f].concat(h)}else if(r==="T"){const g=i*2-(t.qx?t.qx:0),f=o*2-(t.qy?t.qy:0);return t.qx=g,t.qy=f,["Q",g,f].concat(h)}else if(r==="Q"){const[g,f]=h;return t.qx=g,t.qy=f,["Q"].concat(h)}else if(r==="Z")return["Z"];return e},lt={x1:0,y1:0,x2:0,y2:0,x:0,y:0,qx:null,qy:null},bt=e=>{const t={...lt},s=Q(e);return Z(s,(r,n,i,o)=>{t.x=i,t.y=o;const l=pt(r,t);let c=ye(l,t);c[0]==="C"&&c.length>7&&(s.splice(n+1,0,["C"].concat(c.slice(7))),c=c.slice(0,7));const u=c.length;return t.x1=+c[u-2],t.y1=+c[u-1],t.x2=+c[u-4]||t.x1,t.y2=+c[u-3]||t.y1,c})},k=(e,t)=>{const s=t>=1?10**t:1;return t>0?Math.round(e*s)/s:Math.round(e)},Rt=(e,t)=>{const s=e.length;let{round:r}=X,n=e[0],i="";r=t==="off"||typeof t=="number"&&t>=0?t:typeof r=="number"&&r>=0?r:"off";for(let o=0;o<s;o+=1){n=e[o];const[l]=n,c=n.slice(1);if(i+=l,r==="off")i+=c.join(" ");else{let a=0;const u=c.length;for(;a<u;)i+=k(c[a],r),a!==u-1&&(i+=" "),a+=1}}return i},dt=(e,t)=>Math.sqrt((e[0]-t[0])*(e[0]-t[0])+(e[1]-t[1])*(e[1]-t[1])),at=(e,t,s,r)=>dt([e,t],[s,r]),St=(e,t,s,r,n)=>{let i={x:e,y:t};if(typeof n=="number"){const o=dt([e,t],[s,r]);if(n<=0)i={x:e,y:t};else if(n>=o)i={x:s,y:r};else{const[l,c]=B([e,t],[s,r],n/o);i={x:l,y:c}}}return i},jt=(e,t,s,r)=>{const{min:n,max:i}=Math;return[n(e,s),n(t,r),i(e,s),i(t,r)]},Qt=(e,t,s)=>{const r=s/2,n=Math.sin(r),i=Math.cos(r),o=e**2*n**2,l=t**2*i**2,c=Math.sqrt(o+l)*s;return Math.abs(c)},Y=(e,t,s,r,n,i)=>{const{sin:o,cos:l}=Math,c=l(n),a=o(n),u=s*l(i),m=r*o(i);return[e+c*u-a*m,t+a*u+c*m]},Zt=(e,t)=>{const{x:s,y:r}=e,{x:n,y:i}=t,o=s*n+r*i,l=Math.sqrt((s**2+r**2)*(n**2+i**2));return(s*i-r*n<0?-1:1)*Math.acos(o/l)},At=(e,t,s,r,n,i,o,l,c)=>{const{abs:a,sin:u,cos:m,sqrt:h,PI:g}=Math;let f=a(s),y=a(r);const M=(n%360+360)%360*(g/180);if(e===l&&t===c)return{rx:f,ry:y,startAngle:0,endAngle:0,center:{x:l,y:c}};if(f===0||y===0)return{rx:f,ry:y,startAngle:0,endAngle:0,center:{x:(l+e)/2,y:(c+t)/2}};const N=(e-l)/2,x=(t-c)/2,b={x:m(M)*N+u(M)*x,y:-u(M)*N+m(M)*x},L=b.x**2/f**2+b.y**2/y**2;L>1&&(f*=h(L),y*=h(L));const C=f**2*y**2-f**2*b.y**2-y**2*b.x**2,E=f**2*b.y**2+y**2*b.x**2;let S=C/E;S=S<0?0:S;const I=(i!==o?1:-1)*h(S),z={x:I*(f*b.y/y),y:I*(-(y*b.x)/f)},D={x:m(M)*z.x-u(M)*z.y+(e+l)/2,y:u(M)*z.x+m(M)*z.y+(t+c)/2},V={x:(b.x-z.x)/f,y:(b.y-z.y)/y},P=Zt({x:1,y:0},V),w={x:(-b.x-z.x)/f,y:(-b.y-z.y)/y};let $=Zt(V,w);!o&&$>0?$-=2*g:o&&$<0&&($+=2*g),$%=2*g;const R=P+$;return{center:D,startAngle:P,endAngle:R,rx:f,ry:y}},Dt=(e,t,s,r,n,i,o,l,c)=>{const{rx:a,ry:u,startAngle:m,endAngle:h}=At(e,t,s,r,n,i,o,l,c);return Qt(a,u,h-m)},ge=(e,t,s,r,n,i,o,l,c,a)=>{let u={x:e,y:t};const{center:m,rx:h,ry:g,startAngle:f,endAngle:y}=At(e,t,s,r,n,i,o,l,c);if(typeof a=="number"){const p=Qt(h,g,y-f);if(a<=0)u={x:e,y:t};else if(a>=p)u={x:l,y:c};else{if(e===l&&t===c)return{x:l,y:c};if(h===0||g===0)return St(e,t,l,c,a);const{PI:M,cos:N,sin:x}=Math,b=y-f,C=(n%360+360)%360*(M/180),E=f+b*(a/p),S=h*N(E),I=g*x(E);u={x:N(C)*S-x(C)*I+m.x,y:x(C)*S+N(C)*I+m.y}}}return u},xe=(e,t,s,r,n,i,o,l,c)=>{const{center:a,rx:u,ry:m,startAngle:h,endAngle:g}=At(e,t,s,r,n,i,o,l,c),f=g-h,{min:y,max:p,tan:M,atan2:N,PI:x}=Math,{x:b,y:L}=a,C=n*x/180,E=M(C),S=N(-m*E,u),I=S,z=S+x,D=N(m,u*E),V=D+x;let P=y(e,l),w=p(e,l),$=y(t,c),R=p(t,c);const H=g-f*.001,U=Y(b,L,u,m,C,H),rt=g-f*.999,G=Y(b,L,u,m,C,rt);if(U[0]>w||G[0]>w){const v=Y(b,L,u,m,C,I);P=y(P,v[0]),$=y($,v[1]),w=p(w,v[0]),R=p(R,v[1])}if(U[0]<P||G[0]<P){const v=Y(b,L,u,m,C,z);P=y(P,v[0]),$=y($,v[1]),w=p(w,v[0]),R=p(R,v[1])}if(U[1]<$||G[1]<$){const v=Y(b,L,u,m,C,V);P=y(P,v[0]),$=y($,v[1]),w=p(w,v[0]),R=p(R,v[1])}if(U[1]>R||G[1]>R){const v=Y(b,L,u,m,C,D);P=y(P,v[0]),$=y($,v[1]),w=p(w,v[0]),R=p(R,v[1])}return[P,$,w,R]},De=Object.freeze(Object.defineProperty({__proto__:null,angleBetween:Zt,arcLength:Qt,arcPoint:Y,getArcBBox:xe,getArcLength:Dt,getArcProps:At,getPointAtArcLength:ge},Symbol.toStringTag,{value:"Module"})),Ot=[-.06405689286260563,.06405689286260563,-.1911188674736163,.1911188674736163,-.3150426796961634,.3150426796961634,-.4337935076260451,.4337935076260451,-.5454214713888396,.5454214713888396,-.6480936519369755,.6480936519369755,-.7401241915785544,.7401241915785544,-.820001985973903,.820001985973903,-.8864155270044011,.8864155270044011,-.9382745520027328,.9382745520027328,-.9747285559713095,.9747285559713095,-.9951872199970213,.9951872199970213],pe=[.12793819534675216,.12793819534675216,.1258374563468283,.1258374563468283,.12167047292780339,.12167047292780339,.1155056680537256,.1155056680537256,.10744427011596563,.10744427011596563,.09761865210411388,.09761865210411388,.08619016153195327,.08619016153195327,.0733464814110803,.0733464814110803,.05929858491543678,.05929858491543678,.04427743881741981,.04427743881741981,.028531388628933663,.028531388628933663,.0123412297999872,.0123412297999872],be=e=>{const t=[];for(let s=e,r=s.length,n=r-1;r>1;r-=1,n-=1){const i=[];for(let o=0;o<n;o+=1)i.push({x:n*(s[o+1].x-s[o].x),y:n*(s[o+1].y-s[o].y),t:0});t.push(i),s=i}return t},de=(e,t)=>{if(t===0)return e[0].t=0,e[0];const s=e.length-1;if(t===1)return e[s].t=1,e[s];const r=1-t;let n=e;if(s===0)return e[0].t=t,e[0];if(s===1)return{x:r*n[0].x+t*n[1].x,y:r*n[0].y+t*n[1].y,t};const i=r*r,o=t*t;let l=0,c=0,a=0,u=0;return s===2?(n=[n[0],n[1],n[2],{x:0,y:0}],l=i,c=r*t*2,a=o):s===3&&(l=i*r,c=i*t*3,a=r*o*3,u=t*o),{x:l*n[0].x+c*n[1].x+a*n[2].x+u*n[3].x,y:l*n[0].y+c*n[1].y+a*n[2].y+u*n[3].y,t}},Ae=(e,t)=>{const s=e(t),r=s.x*s.x+s.y*s.y;return Math.sqrt(r)},Me=e=>{const s=Ot.length;let r=0;for(let n=0,i;n<s;n++)i=.5*Ot[n]+.5,r+=pe[n]*Ae(e,i);return .5*r},ut=e=>{const t=[];for(let r=0,n=e.length,i=2;r<n;r+=i)t.push({x:e[r],y:e[r+1]});const s=be(t);return Me(r=>de(s[0],r))},we=1e-8,Mt=([e,t,s])=>{const r=Math.min(e,s),n=Math.max(e,s);if(t>=e?s>=t:s<=t)return[r,n];const i=(e*s-t*t)/(e-2*t+s);return i<r?[i,n]:[r,i]},Bt=([e,t,s,r])=>{const n=e-3*t+3*s-r;if(Math.abs(n)<we)return e===r&&e===t?[e,r]:Mt([e,-.5*e+1.5*t,e-3*t+3*s]);const i=-e*s+e*r-t*s-t*r+t*t+s*s;if(i<=0)return[Math.min(e,r),Math.max(e,r)];const o=Math.sqrt(i);let l=Math.min(e,r),c=Math.max(e,r);const a=e-2*t+s;for(let u=(a+o)/n,m=1;m<=2;u=(a-o)/n,m++)if(u>0&&u<1){const h=e*(1-u)*(1-u)*(1-u)+t*3*(1-u)*(1-u)*u+s*3*(1-u)*u*u+r*u*u*u;h<l&&(l=h),h>c&&(c=h)}return[l,c]},Ne=([e,t,s,r,n,i,o,l],c)=>{const a=1-c;return{x:a**3*e+3*a**2*c*s+3*a*c**2*n+c**3*o,y:a**3*t+3*a**2*c*r+3*a*c**2*i+c**3*l}},wt=(e,t,s,r,n,i,o,l)=>ut([e,t,s,r,n,i,o,l]),Le=(e,t,s,r,n,i,o,l,c)=>{const a=typeof c=="number";let u={x:e,y:t};if(a){const m=ut([e,t,s,r,n,i,o,l]);c<=0||(c>=m?u={x:o,y:l}:u=Ne([e,t,s,r,n,i,o,l],c/m))}return u},Ht=(e,t,s,r,n,i,o,l)=>{const c=Bt([e,s,n,o]),a=Bt([t,r,i,l]);return[c[0],a[0],c[1],a[1]]},ve=([e,t,s,r,n,i],o)=>{const l=1-o;return{x:l**2*e+2*l*o*s+o**2*n,y:l**2*t+2*l*o*r+o**2*i}},Nt=(e,t,s,r,n,i)=>ut([e,t,s,r,n,i]),Ce=(e,t,s,r,n,i,o)=>{const l=typeof o=="number";let c={x:e,y:t};if(l){const a=ut([e,t,s,r,n,i]);o<=0||(o>=a?c={x:n,y:i}:c=ve([e,t,s,r,n,i],o/a))}return c},Ft=(e,t,s,r,n,i)=>{const o=Mt([e,s,n]),l=Mt([t,r,i]);return[o[0],l[0],o[1],l[1]]},Oe=e=>{const t=e.length;let s=-1,r,n=e[t-1],i=0;for(;++s<t;)r=n,n=e[s],i+=r[1]*n[0]-r[0]*n[1];return i/2},Be=e=>e.reduce((t,s,r)=>r?t+dt(e[r-1],s):0,0),Lt=1e-5,mt=e=>{const t=Q(e),s={...lt};return Z(t,(r,n,i,o)=>{s.x=i,s.y=o;const l=pt(r,s),c=l.length;return s.x1=+l[c-2],s.y1=+l[c-1],s.x2=+l[c-4]||s.x1,s.y2=+l[c-3]||s.y1,l})},ft=(e,t)=>{const s=mt(e);let r=!1,n=[],i="M",o=0,l=0,[c,a]=s[0].slice(1);const u=typeof t=="number";let m={x:c,y:a},h=0,g=m,f=0;return!u||t<Lt?m:(Z(s,(y,p,M,N)=>{if([i]=y,r=i==="M",n=r?n:[M,N].concat(y.slice(1)),r?([,c,a]=y,m={x:c,y:a},h=0):i==="L"?(m=St(n[0],n[1],n[2],n[3],t-f),h=at(n[0],n[1],n[2],n[3])):i==="A"?(m=ge(n[0],n[1],n[2],n[3],n[4],n[5],n[6],n[7],n[8],t-f),h=Dt(n[0],n[1],n[2],n[3],n[4],n[5],n[6],n[7],n[8])):i==="C"?(m=Le(n[0],n[1],n[2],n[3],n[4],n[5],n[6],n[7],t-f),h=wt(n[0],n[1],n[2],n[3],n[4],n[5],n[6],n[7])):i==="Q"?(m=Ce(n[0],n[1],n[2],n[3],n[4],n[5],t-f),h=Nt(n[0],n[1],n[2],n[3],n[4],n[5])):i==="Z"&&(n=[M,N,c,a],m={x:c,y:a},h=at(n[0],n[1],n[2],n[3])),[o,l]=n.slice(-2),f<t)g=m;else return!1;f+=h}),t>f-Lt?{x:o,y:l}:g)},st=e=>{const t=Q(e);let s=0,r=0,n=0,i=0,o=0,l=0,c="M",a=0,u=0,m=0;return Z(t,(h,g,f,y)=>{[c]=h;const p=c.toUpperCase(),N=p!==c?ot(h,g,f,y):h.slice(0),x=p==="V"?["L",f,N[1]]:p==="H"?["L",N[1],y]:N;if([c]=x,"TQ".includes(p)||(o=0,l=0),c==="M")[,a,u]=x;else if(c==="L")m+=at(f,y,x[1],x[2]);else if(c==="A")m+=Dt(f,y,x[1],x[2],x[3],x[4],x[5],x[6],x[7]);else if(c==="S"){const b=s*2-n,L=r*2-i;m+=wt(f,y,b,L,x[1],x[2],x[3],x[4])}else c==="C"?m+=wt(f,y,x[1],x[2],x[3],x[4],x[5],x[6]):c==="T"?(o=s*2-o,l=r*2-l,m+=Nt(f,y,o,l,x[1],x[2])):c==="Q"?(o=x[1],l=x[2],m+=Nt(f,y,x[1],x[2],x[3],x[4])):c==="Z"&&(m+=at(f,y,a,u));[s,r]=c==="Z"?[a,u]:x.slice(-2),[n,i]=c==="C"?[x[3],x[4]]:c==="S"?[x[1],x[2]]:[s,r]}),m},_t=(e,t)=>{const s=Q(e);let r=s.slice(0),n=st(r),i=r.length-1,o=0,l=0,c=s[0];if(i<=0||!t||!Number.isFinite(t))return{segment:c,index:0,length:l,lengthAtSegment:o};if(t>=n)return r=s.slice(0,-1),o=st(r),l=n-o,c=s[i],{segment:c,index:i,length:l,lengthAtSegment:o};const a=[];for(;i>0;)c=r[i],r=r.slice(0,-1),o=st(r),l=n-o,n=o,a.push({segment:c,index:i,length:l,lengthAtSegment:o}),i-=1;return a.find(({lengthAtSegment:u})=>u<=t)},vt=(e,t)=>{const s=Q(e),r=mt(s),n=st(r),i=b=>{const L=b.x-t.x,C=b.y-t.y;return L*L+C*C};let o=8,l,c={x:0,y:0},a=0,u=0,m=1/0;for(let b=0;b<=n;b+=o)l=ft(r,b),a=i(l),a<m&&(c=l,u=b,m=a);o/=2;let h,g,f=0,y=0,p=0,M=0;for(;o>1e-6&&(f=u-o,h=ft(r,f),p=i(h),y=u+o,g=ft(r,y),M=i(g),f>=0&&p<m?(c=h,u=f,m=p):y<=n&&M<m?(c=g,u=y,m=M):o/=2,!(o<1e-5)););const N=_t(s,u),x=Math.sqrt(m);return{closest:c,distance:x,segment:N}},He=(e,t)=>vt(e,t).closest,Fe=(e,t,s,r,n,i,o,l)=>3*((l-t)*(s+n)-(o-e)*(r+i)+r*(e-n)-s*(t-i)+l*(n+e/3)-o*(i+t/3))/20,Te=e=>{let t=0,s=0,r=0;return bt(e).map(n=>{switch(n[0]){case"M":return[,t,s]=n,0;default:return r=Fe(t,s,n[1],n[2],n[3],n[4],n[5],n[6]),[t,s]=n.slice(-2),r}}).reduce((n,i)=>n+i,0)},_e=e=>Te(bt(e))>=0,$e=e=>{if(!e)return{x:0,y:0,width:0,height:0,x2:0,y2:0,cx:0,cy:0,cz:0};const t=Q(e);let s="M",r=0,n=0;const{max:i,min:o}=Math;let l=1/0,c=1/0,a=-1/0,u=-1/0,m=0,h=0,g=0,f=0,y=0,p=0,M=0,N=0,x=0,b=0;Z(t,(E,S,I,z)=>{[s]=E;const D=s.toUpperCase(),P=D!==s?ot(E,S,I,z):E.slice(0),w=D==="V"?["L",I,P[1]]:D==="H"?["L",P[1],z]:P;if([s]=w,"TQ".includes(D)||(x=0,b=0),s==="M")[,r,n]=w,m=r,h=n,g=r,f=n;else if(s==="L")[m,h,g,f]=jt(I,z,w[1],w[2]);else if(s==="A")[m,h,g,f]=xe(I,z,w[1],w[2],w[3],w[4],w[5],w[6],w[7]);else if(s==="S"){const $=y*2-M,R=p*2-N;[m,h,g,f]=Ht(I,z,$,R,w[1],w[2],w[3],w[4])}else s==="C"?[m,h,g,f]=Ht(I,z,w[1],w[2],w[3],w[4],w[5],w[6]):s==="T"?(x=y*2-x,b=p*2-b,[m,h,g,f]=Ft(I,z,x,b,w[1],w[2])):s==="Q"?(x=w[1],b=w[2],[m,h,g,f]=Ft(I,z,w[1],w[2],w[3],w[4])):s==="Z"&&([m,h,g,f]=jt(I,z,r,n));l=o(m,l),c=o(h,c),a=i(g,a),u=i(f,u),[y,p]=s==="Z"?[r,n]:w.slice(-2),[M,N]=s==="C"?[w[3],w[4]]:s==="S"?[w[1],w[2]]:[y,p]});const L=a-l,C=u-c;return{width:L,height:C,x:l,y:c,x2:a,y2:u,cx:l+L/2,cy:c+C/2,cz:Math.max(L,C)+Math.min(L,C)/2}},Ue=(e,t)=>_t(e,t).segment,Je=(e,t)=>vt(e,t).segment,Ct=e=>Array.isArray(e)&&e.every(t=>{const s=t[0].toLowerCase();return et[s]===t.length-1&&"achlmqstvz".includes(s)&&t.slice(1).every(Number.isFinite)})&&e.length>0,ze=e=>Ct(e)&&e.every(([t])=>t===t.toUpperCase()),Pe=e=>ze(e)&&e.every(([t])=>"ACLMQZ".includes(t)),Ke=e=>Pe(e)&&e.every(([t])=>"MC".includes(t)),We=(e,t)=>{const{distance:s}=vt(e,t);return Math.abs(s)<Lt},Xe=e=>Ct(e)&&e.slice(1).every(([t])=>t===t.toLowerCase()),qe=e=>{if(typeof e!="string"||!e.length)return!1;const t=new kt(e);for(nt(t);t.index<t.max&&!t.err.length;)qt(t);return!t.err.length&&"mM".includes(t.segments[0][0])},ht={line:["x1","y1","x2","y2"],circle:["cx","cy","r"],ellipse:["cx","cy","rx","ry"],rect:["width","height","x","y","rx","ry"],polygon:["points"],polyline:["points"],glyph:["d"]},Ye=e=>{let{x1:t,y1:s,x2:r,y2:n}=e;return[t,s,r,n]=[t,s,r,n].map(i=>+i),[["M",t,s],["L",r,n]]},Ve=e=>{const t=[],s=(e.points||"").trim().split(/[\s|,]/).map(n=>+n);let r=0;for(;r<s.length;)t.push([r?"L":"M",s[r],s[r+1]]),r+=2;return e.type==="polygon"?[...t,["z"]]:t},Ge=e=>{let{cx:t,cy:s,r}=e;return[t,s,r]=[t,s,r].map(n=>+n),[["M",t-r,s],["a",r,r,0,1,0,2*r,0],["a",r,r,0,1,0,-2*r,0]]},tn=e=>{let{cx:t,cy:s}=e,r=e.rx||0,n=e.ry||r;return[t,s,r,n]=[t,s,r,n].map(i=>+i),[["M",t-r,s],["a",r,n,0,1,0,2*r,0],["a",r,n,0,1,0,-2*r,0]]},en=e=>{const t=+e.x||0,s=+e.y||0,r=+e.width,n=+e.height;let i=+(e.rx||0),o=+(e.ry||i);return i||o?(i*2>r&&(i-=(i*2-r)/2),o*2>n&&(o-=(o*2-n)/2),[["M",t+i,s],["h",r-i*2],["s",i,0,i,o],["v",n-o*2],["s",0,o,-i,o],["h",-r+i*2],["s",-i,0,-i,-o],["v",-n+o*2],["s",0,-o,i,-o]]):[["M",t,s],["h",r],["v",n],["H",t],["Z"]]},ke=(e,t)=>{const r=(t||document).defaultView||window,n=Object.keys(ht),i=e instanceof r.SVGElement,o=i?e.tagName:null;if(o&&[...n,"path"].every(m=>o!==m))throw TypeError(`${j}: "${o}" is not SVGElement`);const l=i?o:e.type,c=ht[l],a={type:l};i?c.forEach(m=>{a[m]=e.getAttribute(m)}):Object.assign(a,e);let u=[];return l==="circle"?u=Ge(a):l==="ellipse"?u=tn(a):["polyline","polygon"].includes(l)?u=Ve(a):l==="rect"?u=en(a):l==="line"?u=Ye(a):["glyph","path"].includes(l)&&(u=Q(i?e.getAttribute("d")||"":e.d||"")),Ct(u)&&u.length?u:!1},nn=(e,t,s)=>{const r=s||document,n=r.defaultView||window,i=Object.keys(ht),o=e instanceof n.SVGElement,l=o?e.tagName:null;if(l==="path")throw TypeError(`${j}: "${l}" is already SVGPathElement`);if(l&&i.every(y=>l!==y))throw TypeError(`${j}: "${l}" is not SVGElement`);const c=r.createElementNS("http://www.w3.org/2000/svg","path"),a=o?l:e.type,u=ht[a],m={type:a},h=X.round,g=ke(e,r),f=g&&g.length?Rt(g,h):"";return o?(u.forEach(y=>{m[y]=e.getAttribute(y)}),Object.values(e.attributes).forEach(({name:y,value:p})=>{u.includes(y)||c.setAttribute(y,p)})):(Object.assign(m,e),Object.keys(m).forEach(y=>{!u.includes(y)&&y!=="type"&&c.setAttribute(y.replace(/[A-Z]/g,p=>`-${p.toLowerCase()}`),m[y])})),qe(f)?(c.setAttribute("d",f),t&&o&&(e.before(c,e),e.remove()),c):!1},Ie=e=>{let t=new T;const{origin:s}=e,[r,n]=s,{translate:i}=e,{rotate:o}=e,{skew:l}=e,{scale:c}=e;return Array.isArray(i)&&i.length>=2&&i.every(a=>!Number.isNaN(+a))&&i.some(a=>a!==0)?t=t.translate(...i):typeof i=="number"&&!Number.isNaN(i)&&(t=t.translate(i)),(o||l||c)&&(t=t.translate(r,n),Array.isArray(o)&&o.length>=2&&o.every(a=>!Number.isNaN(+a))&&o.some(a=>a!==0)?t=t.rotate(...o):typeof o=="number"&&!Number.isNaN(o)&&(t=t.rotate(o)),Array.isArray(l)&&l.length===2&&l.every(a=>!Number.isNaN(+a))&&l.some(a=>a!==0)?(t=l[0]?t.skewX(l[0]):t,t=l[1]?t.skewY(l[1]):t):typeof l=="number"&&!Number.isNaN(l)&&(t=t.skewX(l)),Array.isArray(c)&&c.length>=2&&c.every(a=>!Number.isNaN(+a))&&c.some(a=>a!==1)?t=t.scale(...c):typeof c=="number"&&!Number.isNaN(c)&&(t=t.scale(c)),t=t.translate(-r,-n)),t},Ee=(e,t,s,r)=>{const[n]=e,{round:i}=X,o=typeof i=="number"?i:4,l=t.slice(1),{x1:c,y1:a,x2:u,y2:m,x:h,y:g}=s,[f,y]=l.slice(-2),p=e;if("TQ".includes(n)||(s.qx=null,s.qy=null),n==="L"){if(k(h,o)===k(f,o))return["V",y];if(k(g,o)===k(y,o))return["H",f]}else if(n==="C"){const[M,N]=l;if(s.x1=M,s.y1=N,"CS".includes(r)&&(k(M,o)===k(c*2-u,o)&&k(N,o)===k(a*2-m,o)||k(c,o)===k(u*2-h,o)&&k(a,o)===k(m*2-g,o)))return["S",l[2],l[3],l[4],l[5]]}else if(n==="Q"){const[M,N]=l;if(s.qx=M,s.qy=N,"QT".includes(r)&&k(M,o)===k(c*2-u,o)&&k(N,o)===k(a*2-m,o))return["T",l[2],l[3]]}return p},Tt=(e,t)=>{const s=e.slice(1).map(r=>k(r,t));return[e[0]].concat(s)},Re=(e,t)=>{const s=gt(e),r=typeof t=="number"&&t>=0?t:2,n={...lt},i=[];let o="M",l="Z";return Z(s,(c,a,u,m)=>{n.x=u,n.y=m;const h=pt(c,n);let g=c;if([o]=c,i[a]=o,a){l=i[a-1];const y=Ee(c,h,n,l),p=Tt(y,r),M=p.join(""),N=It(y,a,u,m),x=Tt(N,r),b=x.join("");g=M.length<b.length?p:x}const f=h.length;return n.x1=+h[f-2],n.y1=+h[f-1],n.x2=+h[f-4]||n.x1,n.y2=+h[f-3]||n.y1,g})},sn=(e,t)=>{let s=T.Translate(t[0],t[1],t[2]);return[,,,s.m44]=t,s=e.multiply(s),[s.m41,s.m42,s.m43,s.m44]},Ut=(e,t,s)=>{const[r,n,i]=s,[o,l,c]=sn(e,[t[0],t[1],0,1]),a=o-r,u=l-n,m=c-i;return[a*(Math.abs(i)/Math.abs(m)||1)+r,u*(Math.abs(i)/Math.abs(m)||1)+n]},rn=e=>{const t=e.slice(1).map((s,r,n)=>r?n[r-1].slice(-2).concat(s.slice(1)):e[0].slice(1).concat(s.slice(1))).map(s=>s.map((r,n)=>s[s.length-n-2*(1-n%2)])).reverse();return[["M"].concat(t[0].slice(0,2))].concat(t.map(s=>["C"].concat(s.slice(2))))},$t=e=>{const t=gt(e),s=mt(t),r=t.length,n=t[r-1][0]==="Z",i=Z(t,(o,l)=>{const c=s[l],a=l&&t[l-1],u=a&&a[0],m=t[l+1],h=m&&m[0],[g]=o,[f,y]=s[l?l-1:r-1].slice(-2);let p=o;switch(g){case"M":p=n?["Z"]:[g,f,y];break;case"A":p=[g,o[1],o[2],o[3],o[4],o[5]===1?0:1,f,y];break;case"C":m&&h==="S"?p=["S",o[1],o[2],f,y]:p=[g,o[3],o[4],o[1],o[2],f,y];break;case"S":u&&"CS".includes(u)&&(!m||h!=="S")?p=["C",c[3],c[4],c[1],c[2],f,y]:p=[g,c[1],c[2],f,y];break;case"Q":m&&h==="T"?p=["T",f,y]:p=[g,o[1],o[2],f,y];break;case"T":u&&"QT".includes(u)&&(!m||h!=="T")?p=["Q",c[1],c[2],f,y]:p=[g,f,y];break;case"Z":p=["M",f,y];break;case"H":p=[g,f];break;case"V":p=[g,y];break;default:p=[g].concat(o.slice(1,-2),f,y)}return p});return n?i.reverse():[i[0]].concat(i.slice(1).reverse())},on=(e,t)=>{let{round:s}=X;return s=t==="off"||typeof t=="number"&&t>=0?t:typeof s=="number"&&s>=0?s:"off",s==="off"?e.slice(0):Z(e,r=>Tt(r,s))},cn=(e,t=.5)=>{const s=t,r=e.slice(0,2),n=e.slice(2,4),i=e.slice(4,6),o=e.slice(6,8),l=B(r,n,s),c=B(n,i,s),a=B(i,o,s),u=B(l,c,s),m=B(c,a,s),h=B(u,m,s);return[["C",l[0],l[1],u[0],u[1],h[0],h[1]],["C",m[0],m[1],a[0],a[1],o[0],o[1]]]},Se=e=>{const t=[];let s,r=-1,n=0,i=0,o=0,l=0;const c={...lt};return e.forEach(a=>{const[u]=a,m=u.toUpperCase(),h=u.toLowerCase(),g=u===h,f=a.slice(1);m==="M"?(r+=1,[n,i]=f,n+=g?c.x:0,i+=g?c.y:0,o=n,l=i,s=[g?[m,o,l]:a]):(m==="Z"?(n=o,i=l):m==="H"?([,n]=a,n+=g?c.x:0):m==="V"?([,i]=a,i+=g?c.y:0):([n,i]=a.slice(-2),n+=g?c.x:0,i+=g?c.y:0),s.push(a)),c.x=n,c.y=i,t[r]=s}),t},je=(e,t)=>{let s=0,r=0,n=0,i=0,o=0,l=0,c="M";const a=Q(e),u=t&&Object.keys(t);if(!t||u&&!u.length)return a.slice(0);t.origin||Object.assign(t,{origin:X.origin});const m=t.origin,h=Ie(t);return h.isIdentity?a.slice(0):Z(a,(g,f,y,p)=>{[c]=g;const M=c.toUpperCase(),x=M!==c?ot(g,f,y,p):g.slice(0);let b=M==="A"?["C"].concat(xt(y,p,x[1],x[2],x[3],x[4],x[5],x[6],x[7])):M==="V"?["L",y,x[1]]:M==="H"?["L",x[1],p]:x;c=b[0];const L=c==="C"&&b.length>7,C=L?b.slice(0,7):b.slice(0);if(L&&(a.splice(f+1,0,["C"].concat(b.slice(7))),b=C),c==="L")[n,i]=Ut(h,[b[1],b[2]],m),s!==n&&r!==i?b=["L",n,i]:r===i?b=["H",n]:s===n&&(b=["V",i]);else for(o=1,l=b.length;o<l;o+=2)[n,i]=Ut(h,[+b[o],+b[o+1]],m),b[o]=n,b[o+1]=i;return s=n,r=i,b})};class d{constructor(t,s){const r=s||{},n=typeof t>"u";if(n||!t.length)throw TypeError(`${j}: "pathValue" is ${n?"undefined":"empty"}`);this.segments=Q(t);const{round:i,origin:o}=r;let l;Number.isInteger(i)||i==="off"?l=i:l=X.round;let c=X.origin;if(Array.isArray(o)&&o.length>=2){const[a,u,m]=o.map(Number);c=[Number.isNaN(a)?0:a,Number.isNaN(u)?0:u,Number.isNaN(m)?0:m]}return this.round=l,this.origin=c,this}get bbox(){return $e(this.segments)}get length(){return st(this.segments)}getBBox(){return this.bbox}getTotalLength(){return this.length}getPointAtLength(t){return ft(this.segments,t)}toAbsolute(){const{segments:t}=this;return this.segments=gt(t),this}toRelative(){const{segments:t}=this;return this.segments=fe(t),this}toCurve(){const{segments:t}=this;return this.segments=bt(t),this}reverse(t){this.toAbsolute();const{segments:s}=this,r=Se(s),n=r.length>1?r:!1,i=n?n.map((l,c)=>t?c?$t(l):l.slice(0):$t(l)):s.slice(0);let o=[];return n?o=i.flat(1):o=t?s:$t(s),this.segments=o.slice(0),this}normalize(){const{segments:t}=this;return this.segments=mt(t),this}optimize(){const{segments:t}=this,s=this.round==="off"?2:this.round;return this.segments=Re(t,s),this}transform(t){if(!t||typeof t!="object"||typeof t=="object"&&!["translate","rotate","skew","scale"].some(c=>c in t))return this;const{segments:s,origin:[r,n,i]}=this,o={};for(const[c,a]of Object.entries(t))c==="skew"&&Array.isArray(a)||(c==="rotate"||c==="translate"||c==="origin"||c==="scale")&&Array.isArray(a)?o[c]=a.map(Number):c!=="origin"&&typeof Number(a)=="number"&&(o[c]=Number(a));const{origin:l}=o;if(Array.isArray(l)&&l.length>=2){const[c,a,u]=l.map(Number);o.origin=[Number.isNaN(c)?r:c,Number.isNaN(a)?n:a,u||i]}else o.origin=[r,n,i];return this.segments=je(s,o),this}flipX(){const{cx:t,cy:s}=this.bbox;return this.transform({rotate:[0,180,0],origin:[t,s,0]}),this}flipY(){const{cx:t,cy:s}=this.bbox;return this.transform({rotate:[180,0,0],origin:[t,s,0]}),this}toString(){return Rt(this.segments,this.round)}}return A(d,"CSSMatrix",T),A(d,"pathToAbsolute",gt),A(d,"pathToRelative",fe),A(d,"pathToCurve",bt),A(d,"pathToString",Rt),A(d,"arcTools",De),A(d,"bezierTools",{Cvalues:pe,Tvalues:Ot,minmaxC:Bt,minmaxQ:Mt,getBezierLength:ut,bezierLength:Me,calculateBezier:Ae,computeBezier:de,deriveBezier:be,CBEZIER_MINMAX_EPSILON:we}),A(d,"cubicTools",{getCubicLength:wt,getCubicBBox:Ht,getPointAtCubicLength:Le,getPointAtCubicSegmentLength:Ne}),A(d,"lineTools",{getPointAtLineLength:St,getLineBBox:jt,getLineLength:at}),A(d,"quadTools",{getPointAtQuadSegmentLength:ve,getQuadLength:Nt,getQuadBBox:Ft,getPointAtQuadLength:Ce}),A(d,"polygonTools",{polygonArea:Oe,polygonLength:Be}),A(d,"distanceSquareRoot",dt),A(d,"distanceEpsilon",Lt),A(d,"midPoint",B),A(d,"rotateVector",ct),A(d,"roundTo",k),A(d,"finalizeSegment",Pt),A(d,"invalidPathValue",K),A(d,"isArcCommand",ue),A(d,"isDigit",J),A(d,"isDigitStart",ae),A(d,"isMoveCommand",me),A(d,"isPathCommand",le),A(d,"isSpace",ce),A(d,"paramsCount",et),A(d,"paramsParser",lt),A(d,"pathParser",kt),A(d,"scanFlag",ie),A(d,"scanParam",oe),A(d,"scanSegment",qt),A(d,"skipSpaces",nt),A(d,"getPathBBox",$e),A(d,"getPathArea",Te),A(d,"getTotalLength",st),A(d,"getDrawDirection",_e),A(d,"getPointAtLength",ft),A(d,"getPropertiesAtLength",_t),A(d,"getPropertiesAtPoint",vt),A(d,"getClosestPoint",He),A(d,"getSegmentOfPoint",Je),A(d,"getSegmentAtLength",Ue),A(d,"isPointInStroke",We),A(d,"isValidPath",qe),A(d,"isPathArray",Ct),A(d,"isAbsoluteArray",ze),A(d,"isRelativeArray",Xe),A(d,"isCurveArray",Ke),A(d,"isNormalizedArray",Pe),A(d,"shapeToPath",nn),A(d,"shapeToPathArray",ke),A(d,"shapeParams",ht),A(d,"parsePathString",Q),A(d,"absolutizeSegment",ot),A(d,"arcToCubic",xt),A(d,"getSVGMatrix",Ie),A(d,"iterate",Z),A(d,"lineToCubic",Et),A(d,"normalizePath",mt),A(d,"normalizeSegment",pt),A(d,"optimizePath",Re),A(d,"projection2d",Ut),A(d,"quadToCubic",he),A(d,"relativizeSegment",It),A(d,"reverseCurve",rn),A(d,"reversePath",$t),A(d,"roundPath",on),A(d,"roundSegment",Tt),A(d,"segmentToCubic",ye),A(d,"shortenSegment",Ee),A(d,"splitCubic",cn),A(d,"splitPath",Se),A(d,"transformPath",je),d}();
//# sourceMappingURL=svg-path-commander.js.map
