var SVGPathCommander=function(){"use strict";var an=Object.defineProperty;var un=(X,_,z)=>_ in X?an(X,_,{enumerable:!0,configurable:!0,writable:!0,value:z}):X[_]=z;var d=(X,_,z)=>un(X,typeof _!="symbol"?_+"":_,z);var X=Object.defineProperty,_=(e,t,s)=>t in e?X(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s,z=(e,t,s)=>_(e,typeof t!="symbol"?t+"":t,s);const De={a:1,b:0,c:0,d:1,e:0,f:0,m11:1,m12:0,m13:0,m14:0,m21:0,m22:1,m23:0,m24:0,m31:0,m32:0,m33:1,m34:0,m41:0,m42:0,m43:0,m44:1,is2D:!0,isIdentity:!0},Wt=e=>(e instanceof Float64Array||e instanceof Float32Array||Array.isArray(e)&&e.every(t=>typeof t=="number"))&&[6,16].some(t=>e.length===t),Xt=e=>e instanceof DOMMatrix||e instanceof T||typeof e=="object"&&Object.keys(De).every(t=>e&&t in e),it=e=>{const t=new T,s=Array.from(e);if(!Wt(s))throw TypeError(`CSSMatrix: "${s.join(",")}" must be an array with 6/16 numbers.`);if(s.length===16){const[r,n,i,o,l,c,a,u,f,h,y,m,g,A,M,N]=s;t.m11=r,t.a=r,t.m21=l,t.c=l,t.m31=f,t.m41=g,t.e=g,t.m12=n,t.b=n,t.m22=c,t.d=c,t.m32=h,t.m42=A,t.f=A,t.m13=i,t.m23=a,t.m33=y,t.m43=M,t.m14=o,t.m24=u,t.m34=m,t.m44=N}else if(s.length===6){const[r,n,i,o,l,c]=s;t.m11=r,t.a=r,t.m12=n,t.b=n,t.m21=i,t.c=i,t.m22=o,t.d=o,t.m41=l,t.e=l,t.m42=c,t.f=c}return t},Yt=e=>{if(Xt(e))return it([e.m11,e.m12,e.m13,e.m14,e.m21,e.m22,e.m23,e.m24,e.m31,e.m32,e.m33,e.m34,e.m41,e.m42,e.m43,e.m44]);throw TypeError(`CSSMatrix: "${JSON.stringify(e)}" is not a DOMMatrix / CSSMatrix / JSON compatible object.`)},Vt=e=>{if(typeof e!="string")throw TypeError(`CSSMatrix: "${JSON.stringify(e)}" is not a string.`);const t=String(e).replace(/\s/g,"");let s=new T;const r=`CSSMatrix: invalid transform string "${e}"`;return t.split(")").filter(n=>n).forEach(n=>{const[i,o]=n.split("(");if(!o)throw TypeError(r);const l=o.split(",").map(m=>m.includes("rad")?parseFloat(m)*(180/Math.PI):parseFloat(m)),[c,a,u,f]=l,h=[c,a,u],y=[c,a,u,f];if(i==="perspective"&&c&&[a,u].every(m=>m===void 0))s.m34=-1/c;else if(i.includes("matrix")&&[6,16].includes(l.length)&&l.every(m=>!Number.isNaN(+m))){const m=l.map(g=>Math.abs(g)<1e-6?0:g);s=s.multiply(it(m))}else if(i==="translate3d"&&h.every(m=>!Number.isNaN(+m)))s=s.translate(c,a,u);else if(i==="translate"&&c&&u===void 0)s=s.translate(c,a||0,0);else if(i==="rotate3d"&&y.every(m=>!Number.isNaN(+m))&&f)s=s.rotateAxisAngle(c,a,u,f);else if(i==="rotate"&&c&&[a,u].every(m=>m===void 0))s=s.rotate(0,0,c);else if(i==="scale3d"&&h.every(m=>!Number.isNaN(+m))&&h.some(m=>m!==1))s=s.scale(c,a,u);else if(i==="scale"&&!Number.isNaN(c)&&(c!==1||a!==1)&&u===void 0){const m=Number.isNaN(+a)?c:a;s=s.scale(c,m,1)}else if(i==="skew"&&(c||!Number.isNaN(c)&&a)&&u===void 0)s=s.skew(c,a||0);else if(["translate","rotate","scale","skew"].some(m=>i.includes(m))&&/[XYZ]/.test(i)&&c&&[a,u].every(m=>m===void 0))if(i==="skewX"||i==="skewY")s=s[i](c);else{const m=i.replace(/[XYZ]/,""),g=i.replace(m,""),A=["X","Y","Z"].indexOf(g),M=m==="scale"?1:0,N=[A===0?c:M,A===1?c:M,A===2?c:M];s=s[m](...N)}else throw TypeError(r)}),s},zt=(e,t)=>t?[e.a,e.b,e.c,e.d,e.e,e.f]:[e.m11,e.m12,e.m13,e.m14,e.m21,e.m22,e.m23,e.m24,e.m31,e.m32,e.m33,e.m34,e.m41,e.m42,e.m43,e.m44],Gt=(e,t,s)=>{const r=new T;return r.m41=e,r.e=e,r.m42=t,r.f=t,r.m43=s,r},te=(e,t,s)=>{const r=new T,n=Math.PI/180,i=e*n,o=t*n,l=s*n,c=Math.cos(i),a=-Math.sin(i),u=Math.cos(o),f=-Math.sin(o),h=Math.cos(l),y=-Math.sin(l),m=u*h,g=-u*y;r.m11=m,r.a=m,r.m12=g,r.b=g,r.m13=f;const A=a*f*h+c*y;r.m21=A,r.c=A;const M=c*h-a*f*y;return r.m22=M,r.d=M,r.m23=-a*u,r.m31=a*y-c*f*h,r.m32=a*h+c*f*y,r.m33=c*u,r},ee=(e,t,s,r)=>{const n=new T,i=Math.sqrt(e*e+t*t+s*s);if(i===0)return n;const o=e/i,l=t/i,c=s/i,a=r*(Math.PI/360),u=Math.sin(a),f=Math.cos(a),h=u*u,y=o*o,m=l*l,g=c*c,A=1-2*(m+g)*h;n.m11=A,n.a=A;const M=2*(o*l*h+c*u*f);n.m12=M,n.b=M,n.m13=2*(o*c*h-l*u*f);const N=2*(l*o*h-c*u*f);n.m21=N,n.c=N;const x=1-2*(g+y)*h;return n.m22=x,n.d=x,n.m23=2*(l*c*h+o*u*f),n.m31=2*(c*o*h+l*u*f),n.m32=2*(c*l*h-o*u*f),n.m33=1-2*(y+m)*h,n},ne=(e,t,s)=>{const r=new T;return r.m11=e,r.a=e,r.m22=t,r.d=t,r.m33=s,r},yt=(e,t)=>{const s=new T;if(e){const r=e*Math.PI/180,n=Math.tan(r);s.m21=n,s.c=n}if(t){const r=t*Math.PI/180,n=Math.tan(r);s.m12=n,s.b=n}return s},se=e=>yt(e,0),re=e=>yt(0,e),U=(e,t)=>{const s=t.m11*e.m11+t.m12*e.m21+t.m13*e.m31+t.m14*e.m41,r=t.m11*e.m12+t.m12*e.m22+t.m13*e.m32+t.m14*e.m42,n=t.m11*e.m13+t.m12*e.m23+t.m13*e.m33+t.m14*e.m43,i=t.m11*e.m14+t.m12*e.m24+t.m13*e.m34+t.m14*e.m44,o=t.m21*e.m11+t.m22*e.m21+t.m23*e.m31+t.m24*e.m41,l=t.m21*e.m12+t.m22*e.m22+t.m23*e.m32+t.m24*e.m42,c=t.m21*e.m13+t.m22*e.m23+t.m23*e.m33+t.m24*e.m43,a=t.m21*e.m14+t.m22*e.m24+t.m23*e.m34+t.m24*e.m44,u=t.m31*e.m11+t.m32*e.m21+t.m33*e.m31+t.m34*e.m41,f=t.m31*e.m12+t.m32*e.m22+t.m33*e.m32+t.m34*e.m42,h=t.m31*e.m13+t.m32*e.m23+t.m33*e.m33+t.m34*e.m43,y=t.m31*e.m14+t.m32*e.m24+t.m33*e.m34+t.m34*e.m44,m=t.m41*e.m11+t.m42*e.m21+t.m43*e.m31+t.m44*e.m41,g=t.m41*e.m12+t.m42*e.m22+t.m43*e.m32+t.m44*e.m42,A=t.m41*e.m13+t.m42*e.m23+t.m43*e.m33+t.m44*e.m43,M=t.m41*e.m14+t.m42*e.m24+t.m43*e.m34+t.m44*e.m44;return it([s,r,n,i,o,l,c,a,u,f,h,y,m,g,A,M])};class T{constructor(t){return this.a=1,this.b=0,this.c=0,this.d=1,this.e=0,this.f=0,this.m11=1,this.m12=0,this.m13=0,this.m14=0,this.m21=0,this.m22=1,this.m23=0,this.m24=0,this.m31=0,this.m32=0,this.m33=1,this.m34=0,this.m41=0,this.m42=0,this.m43=0,this.m44=1,t?this.setMatrixValue(t):this}get isIdentity(){return this.m11===1&&this.m12===0&&this.m13===0&&this.m14===0&&this.m21===0&&this.m22===1&&this.m23===0&&this.m24===0&&this.m31===0&&this.m32===0&&this.m33===1&&this.m34===0&&this.m41===0&&this.m42===0&&this.m43===0&&this.m44===1}get is2D(){return this.m31===0&&this.m32===0&&this.m33===1&&this.m34===0&&this.m43===0&&this.m44===1}setMatrixValue(t){return typeof t=="string"&&t.length&&t!=="none"?Vt(t):Array.isArray(t)||t instanceof Float64Array||t instanceof Float32Array?it(t):typeof t=="object"?Yt(t):this}toFloat32Array(t){return Float32Array.from(zt(this,t))}toFloat64Array(t){return Float64Array.from(zt(this,t))}toString(){const{is2D:t}=this,s=this.toFloat64Array(t).join(", ");return`${t?"matrix":"matrix3d"}(${s})`}toJSON(){const{is2D:t,isIdentity:s}=this;return{...this,is2D:t,isIdentity:s}}multiply(t){return U(this,t)}translate(t,s,r){const n=t;let i=s,o=r;return typeof i>"u"&&(i=0),typeof o>"u"&&(o=0),U(this,Gt(n,i,o))}scale(t,s,r){const n=t;let i=s,o=r;return typeof i>"u"&&(i=t),typeof o>"u"&&(o=1),U(this,ne(n,i,o))}rotate(t,s,r){let n=t,i=s||0,o=r||0;return typeof t=="number"&&typeof s>"u"&&typeof r>"u"&&(o=n,n=0,i=0),U(this,te(n,i,o))}rotateAxisAngle(t,s,r,n){if([t,s,r,n].some(i=>Number.isNaN(+i)))throw new TypeError("CSSMatrix: expecting 4 values");return U(this,ee(t,s,r,n))}skewX(t){return U(this,se(t))}skewY(t){return U(this,re(t))}skew(t,s){return U(this,yt(t,s))}transformPoint(t){const s=this.m11*t.x+this.m21*t.y+this.m31*t.z+this.m41*t.w,r=this.m12*t.x+this.m22*t.y+this.m32*t.z+this.m42*t.w,n=this.m13*t.x+this.m23*t.y+this.m33*t.z+this.m43*t.w,i=this.m14*t.x+this.m24*t.y+this.m34*t.z+this.m44*t.w;return t instanceof DOMPoint?new DOMPoint(s,r,n,i):{x:s,y:r,z:n,w:i}}}z(T,"Translate",Gt),z(T,"Rotate",te),z(T,"RotateAxisAngle",ee),z(T,"Scale",ne),z(T,"SkewX",se),z(T,"SkewY",re),z(T,"Skew",yt),z(T,"Multiply",U),z(T,"fromArray",it),z(T,"fromMatrix",Yt),z(T,"fromString",Vt),z(T,"toArray",zt),z(T,"isCompatibleArray",Wt),z(T,"isCompatibleObject",Xt);const Y={origin:[0,0,0],round:4},et={a:7,c:6,h:1,l:2,m:2,r:4,q:4,s:4,t:2,v:1,z:0},Pt=e=>{let t=e.pathValue[e.segmentStart],s=t.toLowerCase();const{data:r}=e;for(;r.length>=et[s]&&(s==="m"&&r.length>2?(e.segments.push([t].concat(r.splice(0,2))),s="l",t=t==="m"?"l":"L"):e.segments.push([t].concat(r.splice(0,et[s]))),!!et[s]););},Z="SVGPathCommander Error",ie=e=>{const{index:t,pathValue:s}=e,r=s.charCodeAt(t);if(r===48){e.param=0,e.index+=1;return}if(r===49){e.param=1,e.index+=1;return}e.err=`${Z}: invalid Arc flag "${s[t]}", expecting 0 or 1 at index ${t}`},K=e=>e>=48&&e<=57,W="Invalid path value",oe=e=>{const{max:t,pathValue:s,index:r}=e;let n=r,i=!1,o=!1,l=!1,c=!1,a;if(n>=t){e.err=`${Z}: ${W} at index ${n}, "pathValue" is missing param`;return}if(a=s.charCodeAt(n),(a===43||a===45)&&(n+=1,a=s.charCodeAt(n)),!K(a)&&a!==46){e.err=`${Z}: ${W} at index ${n}, "${s[n]}" is not a number`;return}if(a!==46){if(i=a===48,n+=1,a=s.charCodeAt(n),i&&n<t&&a&&K(a)){e.err=`${Z}: ${W} at index ${r}, "${s[r]}" illegal number`;return}for(;n<t&&K(s.charCodeAt(n));)n+=1,o=!0;a=s.charCodeAt(n)}if(a===46){for(c=!0,n+=1;K(s.charCodeAt(n));)n+=1,l=!0;a=s.charCodeAt(n)}if(a===101||a===69){if(c&&!o&&!l){e.err=`${Z}: ${W} at index ${n}, "${s[n]}" invalid float exponent`;return}if(n+=1,a=s.charCodeAt(n),(a===43||a===45)&&(n+=1),n<t&&K(s.charCodeAt(n)))for(;n<t&&K(s.charCodeAt(n));)n+=1;else{e.err=`${Z}: ${W} at index ${n}, "${s[n]}" invalid integer exponent`;return}}e.index=n,e.param=+e.pathValue.slice(r,n)},ce=e=>[5760,6158,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8239,8287,12288,65279,10,13,8232,8233,32,9,11,12,160].includes(e),nt=e=>{const{pathValue:t,max:s}=e;for(;e.index<s&&ce(t.charCodeAt(e.index));)e.index+=1},le=e=>{switch(e|32){case 109:case 122:case 108:case 104:case 118:case 99:case 115:case 113:case 116:case 97:return!0;default:return!1}},ae=e=>K(e)||e===43||e===45||e===46,ue=e=>(e|32)===97,me=e=>{switch(e|32){case 109:case 77:return!0;default:return!1}},qt=e=>{var c;const{max:t,pathValue:s,index:r,segments:n}=e,i=s.charCodeAt(r),o=et[s[r].toLowerCase()];if(e.segmentStart=r,!le(i)){e.err=`${Z}: ${W} "${s[r]}" is not a path command at index ${r}`;return}const l=n[n.length-1];if(!me(i)&&((c=l==null?void 0:l[0])==null?void 0:c.toLocaleLowerCase())==="z"){e.err=`${Z}: ${W} "${s[r]}" is not a MoveTo path command at index ${r}`;return}if(e.index+=1,nt(e),e.data=[],!o){Pt(e);return}for(;;){for(let a=o;a>0;a-=1){if(ue(i)&&(a===3||a===4)?ie(e):oe(e),e.err.length)return;e.data.push(e.param),nt(e),e.index<t&&s.charCodeAt(e.index)===44&&(e.index+=1,nt(e))}if(e.index>=e.max||!ae(s.charCodeAt(e.index)))break}Pt(e)};class kt{constructor(t){this.segments=[],this.pathValue=t,this.max=t.length,this.index=0,this.param=0,this.segmentStart=0,this.data=[],this.err=""}}const D=e=>{if(typeof e!="string")return e.slice(0);const t=new kt(e);for(nt(t);t.index<t.max&&!t.err.length;)qt(t);if(t!=null&&t.err.length)throw TypeError(t.err);return t.segments[0][0]="M",t.segments},ot=(e,t,s,r)=>{const[n]=e,i=n.toUpperCase();if(t===0||i===n)return e;if(i==="A")return[i,e[1],e[2],e[3],e[4],e[5],e[6]+s,e[7]+r];if(i==="V")return[i,e[1]+r];if(i==="H")return[i,e[1]+s];if(i==="L")return[i,e[1]+s,e[2]+r];{const l=[],c=e.length;for(let a=1;a<c;a+=1)l.push(e[a]+(a%2?s:r));return[i].concat(l)}},O=(e,t)=>{let s=e.length,r,n="M",i="M",o=!1,l=0,c=0,a=0,u=0,f=0;for(let h=0;h<s;h+=1){r=e[h],[n]=r,f=r.length,i=n.toUpperCase(),o=i!==n;const y=t(r,h,l,c);if(y===!1)break;i==="Z"?(l=a,c=u):i==="H"?l=r[1]+(o?l:0):i==="V"?c=r[1]+(o?c:0):(l=r[f-2]+(o?l:0),c=r[f-1]+(o?c:0),i==="M"&&(a=l,u=c)),y&&(e[h]=y,y[0]==="C"&&(s=e.length))}return e},gt=e=>{const t=D(e);return O(t,ot)},It=(e,t,s,r)=>{const[n]=e,i=n.toLowerCase();if(t===0||n===i)return e;if(i==="a")return[i,e[1],e[2],e[3],e[4],e[5],e[6]-s,e[7]-r];if(i==="v")return[i,e[1]-r];if(i==="h")return[i,e[1]-s];if(i==="l")return[i,e[1]-s,e[2]-r];{const l=[],c=e.length;for(let a=1;a<c;a+=1)l.push(e[a]-(a%2?s:r));return[i].concat(l)}},fe=e=>{const t=D(e);return O(t,It)},ct=(e,t,s)=>{const{sin:r,cos:n}=Math,i=e*n(s)-t*r(s),o=e*r(s)+t*n(s);return{x:i,y:o}},xt=(e,t,s,r,n,i,o,l,c,a)=>{let u=e,f=t,h=s,y=r,m=l,g=c;const A=Math.PI*120/180,M=Math.PI/180*(+n||0);let N=[],x,p,w,C,I;if(a)[p,w,C,I]=a;else{x=ct(u,f,-M),u=x.x,f=x.y,x=ct(m,g,-M),m=x.x,g=x.y;const $=(u-m)/2,S=(f-g)/2;let k=$*$/(h*h)+S*S/(y*y);k>1&&(k=Math.sqrt(k),h*=k,y*=k);const Jt=h*h,Kt=y*y,Ze=(i===o?-1:1)*Math.sqrt(Math.abs((Jt*Kt-Jt*S*S-Kt*$*$)/(Jt*S*S+Kt*$*$)));C=Ze*h*S/y+(u+m)/2,I=Ze*-y*$/h+(f+g)/2,p=Math.asin(((f-I)/y*10**9>>0)/10**9),w=Math.asin(((g-I)/y*10**9>>0)/10**9),p=u<C?Math.PI-p:p,w=m<C?Math.PI-w:w,p<0&&(p=Math.PI*2+p),w<0&&(w=Math.PI*2+w),o&&p>w&&(p-=Math.PI*2),!o&&w>p&&(w-=Math.PI*2)}let E=w-p;if(Math.abs(E)>A){const $=w,S=m,k=g;w=p+A*(o&&w>p?1:-1),m=C+h*Math.cos(w),g=I+y*Math.sin(w),N=xt(m,g,h,y,n,0,o,S,k,[w,$,C,I])}E=w-p;const q=Math.cos(p),v=Math.sin(p),B=Math.cos(w),G=Math.sin(w),R=Math.tan(E/4),L=4/3*h*R,j=4/3*y*R,H=[u,f],Q=[u+L*v,f-j*q],J=[m+L*G,g-j*B],rt=[m,g];if(Q[0]=2*H[0]-Q[0],Q[1]=2*H[1]-Q[1],a)return[Q[0],Q[1],J[0],J[1],rt[0],rt[1]].concat(N);N=[Q[0],Q[1],J[0],J[1],rt[0],rt[1]].concat(N);const tt=[];for(let $=0,S=N.length;$<S;$+=1)tt[$]=$%2?ct(N[$-1],N[$],M).y:ct(N[$],N[$+1],M).x;return tt},he=(e,t,s,r,n,i)=>{const o=.3333333333333333,l=2/3;return[o*e+l*s,o*t+l*r,o*n+l*s,o*i+l*r,n,i]},F=(e,t,s)=>{const[r,n]=e,[i,o]=t;return[r+(i-r)*s,n+(o-n)*s]},Et=(e,t,s,r)=>{const n=F([e,t],[s,r],.3333333333333333),i=F([e,t],[s,r],2/3);return[n[0],n[1],i[0],i[1],s,r]},ye=(e,t)=>{const[s]=e,r=e.slice(1).map(Number),[n,i]=r,{x1:o,y1:l,x:c,y:a}=t;return"TQ".includes(s)||(t.qx=null,t.qy=null),s==="M"?(t.x=n,t.y=i,e):s==="A"?["C"].concat(xt(o,l,r[0],r[1],r[2],r[3],r[4],r[5],r[6])):s==="Q"?(t.qx=n,t.qy=i,["C"].concat(he(o,l,r[0],r[1],r[2],r[3]))):s==="L"?["C"].concat(Et(o,l,n,i)):s==="Z"?["C"].concat(Et(o,l,c,a)):e},pt=(e,t)=>{const[s]=e,r=s.toUpperCase(),n=s!==r,{x1:i,y1:o,x2:l,y2:c,x:a,y:u}=t,f=e.slice(1);let h=f.map((y,m)=>y+(n?m%2?u:a:0));if("TQ".includes(r)||(t.qx=null,t.qy=null),r==="A")return h=f.slice(0,-2).concat(f[5]+(n?a:0),f[6]+(n?u:0)),["A"].concat(h);if(r==="H")return["L",e[1]+(n?a:0),o];if(r==="V")return["L",i,e[1]+(n?u:0)];if(r==="L")return["L",e[1]+(n?a:0),e[2]+(n?u:0)];if(r==="M")return["M",e[1]+(n?a:0),e[2]+(n?u:0)];if(r==="C")return["C"].concat(h);if(r==="S"){const y=i*2-l,m=o*2-c;return t.x1=y,t.y1=m,["C",y,m].concat(h)}else if(r==="T"){const y=i*2-(t.qx?t.qx:0),m=o*2-(t.qy?t.qy:0);return t.qx=y,t.qy=m,["Q",y,m].concat(h)}else if(r==="Q"){const[y,m]=h;return t.qx=y,t.qy=m,["Q"].concat(h)}else if(r==="Z")return["Z"];return e},lt={x1:0,y1:0,x2:0,y2:0,x:0,y:0,qx:null,qy:null},bt=e=>{const t={...lt},s=D(e);return O(s,(r,n,i,o)=>{t.x=i,t.y=o;const l=pt(r,t);let c=ye(l,t);c[0]==="C"&&c.length>7&&(s.splice(n+1,0,["C"].concat(c.slice(7))),c=c.slice(0,7));const u=c.length;return t.x1=+c[u-2],t.y1=+c[u-1],t.x2=+c[u-4]||t.x1,t.y2=+c[u-3]||t.y1,c})},P=(e,t)=>{const s=t>=1?10**t:1;return t>0?Math.round(e*s)/s:Math.round(e)},Rt=(e,t)=>{const s=e.length;let{round:r}=Y,n=e[0],i="";r=t==="off"||typeof t=="number"&&t>=0?t:typeof r=="number"&&r>=0?r:"off";for(let o=0;o<s;o+=1){n=e[o];const[l]=n,c=n.slice(1);if(i+=l,r==="off")i+=c.join(" ");else{let a=0;const u=c.length;for(;a<u;)i+=P(c[a],r),a!==u-1&&(i+=" "),a+=1}}return i},dt=(e,t)=>Math.sqrt((e[0]-t[0])*(e[0]-t[0])+(e[1]-t[1])*(e[1]-t[1])),at=(e,t,s,r)=>dt([e,t],[s,r]),jt=(e,t,s,r,n)=>{let i={x:e,y:t};if(typeof n=="number"){const o=dt([e,t],[s,r]);if(n<=0)i={x:e,y:t};else if(n>=o)i={x:s,y:r};else{const[l,c]=F([e,t],[s,r],n/o);i={x:l,y:c}}}return i},St=(e,t,s,r)=>{const{min:n,max:i}=Math;return[n(e,s),n(t,r),i(e,s),i(t,r)]},Qt=(e,t,s)=>{const r=s/2,n=Math.sin(r),i=Math.cos(r),o=e**2*n**2,l=t**2*i**2,c=Math.sqrt(o+l)*s;return Math.abs(c)},V=(e,t,s,r,n,i)=>{const{sin:o,cos:l}=Math,c=l(n),a=o(n),u=s*l(i),f=r*o(i);return[e+c*u-a*f,t+a*u+c*f]},Zt=(e,t)=>{const{x:s,y:r}=e,{x:n,y:i}=t,o=s*n+r*i,l=Math.sqrt((s**2+r**2)*(n**2+i**2));return(s*i-r*n<0?-1:1)*Math.acos(o/l)},At=(e,t,s,r,n,i,o,l,c)=>{const{abs:a,sin:u,cos:f,sqrt:h,PI:y}=Math;let m=a(s),g=a(r);const M=(n%360+360)%360*(y/180);if(e===l&&t===c)return{rx:m,ry:g,startAngle:0,endAngle:0,center:{x:l,y:c}};if(m===0||g===0)return{rx:m,ry:g,startAngle:0,endAngle:0,center:{x:(l+e)/2,y:(c+t)/2}};const N=(e-l)/2,x=(t-c)/2,p={x:f(M)*N+u(M)*x,y:-u(M)*N+f(M)*x},w=p.x**2/m**2+p.y**2/g**2;w>1&&(m*=h(w),g*=h(w));const C=m**2*g**2-m**2*p.y**2-g**2*p.x**2,I=m**2*p.y**2+g**2*p.x**2;let E=C/I;E=E<0?0:E;const q=(i!==o?1:-1)*h(E),v={x:q*(m*p.y/g),y:q*(-(g*p.x)/m)},B={x:f(M)*v.x-u(M)*v.y+(e+l)/2,y:u(M)*v.x+f(M)*v.y+(t+c)/2},G={x:(p.x-v.x)/m,y:(p.y-v.y)/g},R=Zt({x:1,y:0},G),L={x:(-p.x-v.x)/m,y:(-p.y-v.y)/g};let j=Zt(G,L);!o&&j>0?j-=2*y:o&&j<0&&(j+=2*y),j%=2*y;const H=R+j;return{center:B,startAngle:R,endAngle:H,rx:m,ry:g}},Dt=(e,t,s,r,n,i,o,l,c)=>{const{rx:a,ry:u,startAngle:f,endAngle:h}=At(e,t,s,r,n,i,o,l,c);return Qt(a,u,h-f)},ge=(e,t,s,r,n,i,o,l,c,a)=>{let u={x:e,y:t};const{center:f,rx:h,ry:y,startAngle:m,endAngle:g}=At(e,t,s,r,n,i,o,l,c);if(typeof a=="number"){const A=Qt(h,y,g-m);if(a<=0)u={x:e,y:t};else if(a>=A)u={x:l,y:c};else{if(e===l&&t===c)return{x:l,y:c};if(h===0||y===0)return jt(e,t,l,c,a);const{PI:M,cos:N,sin:x}=Math,p=g-m,C=(n%360+360)%360*(M/180),I=m+p*(a/A),E=h*N(I),q=y*x(I);u={x:N(C)*E-x(C)*q+f.x,y:x(C)*E+N(C)*q+f.y}}}return u},xe=(e,t,s,r,n,i,o,l,c)=>{const{center:a,rx:u,ry:f,startAngle:h,endAngle:y}=At(e,t,s,r,n,i,o,l,c),m=y-h,{min:g,max:A,tan:M,atan2:N,PI:x}=Math,{x:p,y:w}=a,C=n*x/180,I=M(C),E=N(-f*I,u),q=E,v=E+x,B=N(f,u*I),G=B+x,R=[l],L=[c];let j=g(e,l),H=A(e,l),Q=g(t,c),J=A(t,c);const rt=y-m*1e-5,tt=V(p,w,u,f,C,rt),$=y-m*.99999,S=V(p,w,u,f,C,$);if(tt[0]>H||S[0]>H){const k=V(p,w,u,f,C,q);R.push(k[0]),L.push(k[1])}if(tt[0]<j||S[0]<j){const k=V(p,w,u,f,C,v);R.push(k[0]),L.push(k[1])}if(tt[1]<Q||S[1]<Q){const k=V(p,w,u,f,C,G);R.push(k[0]),L.push(k[1])}if(tt[1]>J||S[1]>J){const k=V(p,w,u,f,C,B);R.push(k[0]),L.push(k[1])}return j=g.apply([],R),Q=g.apply([],L),H=A.apply([],R),J=A.apply([],L),[j,Q,H,J]},Oe=Object.freeze(Object.defineProperty({__proto__:null,angleBetween:Zt,arcLength:Qt,arcPoint:V,getArcBBox:xe,getArcLength:Dt,getArcProps:At,getPointAtArcLength:ge},Symbol.toStringTag,{value:"Module"})),Ot=[-.06405689286260563,.06405689286260563,-.1911188674736163,.1911188674736163,-.3150426796961634,.3150426796961634,-.4337935076260451,.4337935076260451,-.5454214713888396,.5454214713888396,-.6480936519369755,.6480936519369755,-.7401241915785544,.7401241915785544,-.820001985973903,.820001985973903,-.8864155270044011,.8864155270044011,-.9382745520027328,.9382745520027328,-.9747285559713095,.9747285559713095,-.9951872199970213,.9951872199970213],pe=[.12793819534675216,.12793819534675216,.1258374563468283,.1258374563468283,.12167047292780339,.12167047292780339,.1155056680537256,.1155056680537256,.10744427011596563,.10744427011596563,.09761865210411388,.09761865210411388,.08619016153195327,.08619016153195327,.0733464814110803,.0733464814110803,.05929858491543678,.05929858491543678,.04427743881741981,.04427743881741981,.028531388628933663,.028531388628933663,.0123412297999872,.0123412297999872],be=e=>{const t=[];for(let s=e,r=s.length,n=r-1;r>1;r-=1,n-=1){const i=[];for(let o=0;o<n;o+=1)i.push({x:n*(s[o+1].x-s[o].x),y:n*(s[o+1].y-s[o].y),t:0});t.push(i),s=i}return t},de=(e,t)=>{if(t===0)return e[0].t=0,e[0];const s=e.length-1;if(t===1)return e[s].t=1,e[s];const r=1-t;let n=e;if(s===0)return e[0].t=t,e[0];if(s===1)return{x:r*n[0].x+t*n[1].x,y:r*n[0].y+t*n[1].y,t};const i=r*r,o=t*t;let l=0,c=0,a=0,u=0;return s===2?(n=[n[0],n[1],n[2],{x:0,y:0}],l=i,c=r*t*2,a=o):s===3&&(l=i*r,c=i*t*3,a=r*o*3,u=t*o),{x:l*n[0].x+c*n[1].x+a*n[2].x+u*n[3].x,y:l*n[0].y+c*n[1].y+a*n[2].y+u*n[3].y,t}},Ae=(e,t)=>{const s=e(t),r=s.x*s.x+s.y*s.y;return Math.sqrt(r)},Me=e=>{const s=Ot.length;let r=0;for(let n=0,i;n<s;n++)i=.5*Ot[n]+.5,r+=pe[n]*Ae(e,i);return .5*r},ut=e=>{const t=[];for(let r=0,n=e.length,i=2;r<n;r+=i)t.push({x:e[r],y:e[r+1]});const s=be(t);return Me(r=>de(s[0],r))},Ne=1e-8,Mt=([e,t,s])=>{const r=Math.min(e,s),n=Math.max(e,s);if(t>=e?s>=t:s<=t)return[r,n];const i=(e*s-t*t)/(e-2*t+s);return i<r?[i,n]:[r,i]},Bt=([e,t,s,r])=>{const n=e-3*t+3*s-r;if(Math.abs(n)<Ne)return e===r&&e===t?[e,r]:Mt([e,-.5*e+1.5*t,e-3*t+3*s]);const i=-e*s+e*r-t*s-t*r+t*t+s*s;if(i<=0)return[Math.min(e,r),Math.max(e,r)];const o=Math.sqrt(i);let l=Math.min(e,r),c=Math.max(e,r);const a=e-2*t+s;for(let u=(a+o)/n,f=1;f<=2;u=(a-o)/n,f++)if(u>0&&u<1){const h=e*(1-u)*(1-u)*(1-u)+t*3*(1-u)*(1-u)*u+s*3*(1-u)*u*u+r*u*u*u;h<l&&(l=h),h>c&&(c=h)}return[l,c]},we=([e,t,s,r,n,i,o,l],c)=>{const a=1-c;return{x:a**3*e+3*a**2*c*s+3*a*c**2*n+c**3*o,y:a**3*t+3*a**2*c*r+3*a*c**2*i+c**3*l}},Nt=(e,t,s,r,n,i,o,l)=>ut([e,t,s,r,n,i,o,l]),Le=(e,t,s,r,n,i,o,l,c)=>{const a=typeof c=="number";let u={x:e,y:t};if(a){const f=ut([e,t,s,r,n,i,o,l]);c<=0||(c>=f?u={x:o,y:l}:u=we([e,t,s,r,n,i,o,l],c/f))}return u},Ht=(e,t,s,r,n,i,o,l)=>{const c=Bt([e,s,n,o]),a=Bt([t,r,i,l]);return[c[0],a[0],c[1],a[1]]},Ce=([e,t,s,r,n,i],o)=>{const l=1-o;return{x:l**2*e+2*l*o*s+o**2*n,y:l**2*t+2*l*o*r+o**2*i}},wt=(e,t,s,r,n,i)=>ut([e,t,s,r,n,i]),Te=(e,t,s,r,n,i,o)=>{const l=typeof o=="number";let c={x:e,y:t};if(l){const a=ut([e,t,s,r,n,i]);o<=0||(o>=a?c={x:n,y:i}:c=Ce([e,t,s,r,n,i],o/a))}return c},Ft=(e,t,s,r,n,i)=>{const o=Mt([e,s,n]),l=Mt([t,r,i]);return[o[0],l[0],o[1],l[1]]},Be=e=>{const t=e.length;let s=-1,r,n=e[t-1],i=0;for(;++s<t;)r=n,n=e[s],i+=r[1]*n[0]-r[0]*n[1];return i/2},He=e=>e.reduce((t,s,r)=>r?t+dt(e[r-1],s):0,0),Lt=1e-5,mt=e=>{const t=D(e),s={...lt};return O(t,(r,n,i,o)=>{s.x=i,s.y=o;const l=pt(r,s),c=l.length;return s.x1=+l[c-2],s.y1=+l[c-1],s.x2=+l[c-4]||s.x1,s.y2=+l[c-3]||s.y1,l})},ft=(e,t)=>{const s=mt(e);let r=!1,n=[],i="M",o=0,l=0,[c,a]=s[0].slice(1);const u=typeof t=="number";let f={x:c,y:a},h=0,y=f,m=0;return!u||t<Lt?f:(O(s,(g,A,M,N)=>{if([i]=g,r=i==="M",n=r?n:[M,N].concat(g.slice(1)),r?([,c,a]=g,f={x:c,y:a},h=0):i==="L"?(f=jt(n[0],n[1],n[2],n[3],t-m),h=at(n[0],n[1],n[2],n[3])):i==="A"?(f=ge(n[0],n[1],n[2],n[3],n[4],n[5],n[6],n[7],n[8],t-m),h=Dt(n[0],n[1],n[2],n[3],n[4],n[5],n[6],n[7],n[8])):i==="C"?(f=Le(n[0],n[1],n[2],n[3],n[4],n[5],n[6],n[7],t-m),h=Nt(n[0],n[1],n[2],n[3],n[4],n[5],n[6],n[7])):i==="Q"?(f=Te(n[0],n[1],n[2],n[3],n[4],n[5],t-m),h=wt(n[0],n[1],n[2],n[3],n[4],n[5])):i==="Z"&&(n=[M,N,c,a],f={x:c,y:a},h=at(n[0],n[1],n[2],n[3])),[o,l]=n.slice(-2),m<t)y=f;else return!1;m+=h}),t>m-Lt?{x:o,y:l}:y)},st=e=>{const t=D(e);let s=0,r=0,n=0,i=0,o=0,l=0,c="M",a=0,u=0,f=0;return O(t,(h,y,m,g)=>{[c]=h;const A=c.toUpperCase(),N=A!==c?ot(h,y,m,g):h.slice(0),x=A==="V"?["L",m,N[1]]:A==="H"?["L",N[1],g]:N;if([c]=x,"TQ".includes(A)||(o=0,l=0),c==="M")[,a,u]=x;else if(c==="L")f+=at(m,g,x[1],x[2]);else if(c==="A")f+=Dt(m,g,x[1],x[2],x[3],x[4],x[5],x[6],x[7]);else if(c==="S"){const p=s*2-n,w=r*2-i;f+=Nt(m,g,p,w,x[1],x[2],x[3],x[4])}else c==="C"?f+=Nt(m,g,x[1],x[2],x[3],x[4],x[5],x[6]):c==="T"?(o=s*2-o,l=r*2-l,f+=wt(m,g,o,l,x[1],x[2])):c==="Q"?(o=x[1],l=x[2],f+=wt(m,g,x[1],x[2],x[3],x[4])):c==="Z"&&(f+=at(m,g,a,u));[s,r]=c==="Z"?[a,u]:x.slice(-2),[n,i]=c==="C"?[x[3],x[4]]:c==="S"?[x[1],x[2]]:[s,r]}),f},_t=(e,t)=>{const s=D(e);let r=s.slice(0),n=st(r),i=r.length-1,o=0,l=0,c=s[0];if(i<=0||!t||!Number.isFinite(t))return{segment:c,index:0,length:l,lengthAtSegment:o};if(t>=n)return r=s.slice(0,-1),o=st(r),l=n-o,c=s[i],{segment:c,index:i,length:l,lengthAtSegment:o};const a=[];for(;i>0;)c=r[i],r=r.slice(0,-1),o=st(r),l=n-o,n=o,a.push({segment:c,index:i,length:l,lengthAtSegment:o}),i-=1;return a.find(({lengthAtSegment:u})=>u<=t)},Ct=(e,t)=>{const s=D(e),r=mt(s),n=st(r),i=p=>{const w=p.x-t.x,C=p.y-t.y;return w*w+C*C};let o=8,l,c={x:0,y:0},a=0,u=0,f=1/0;for(let p=0;p<=n;p+=o)l=ft(r,p),a=i(l),a<f&&(c=l,u=p,f=a);o/=2;let h,y,m=0,g=0,A=0,M=0;for(;o>1e-6&&(m=u-o,h=ft(r,m),A=i(h),g=u+o,y=ft(r,g),M=i(y),m>=0&&A<f?(c=h,u=m,f=A):g<=n&&M<f?(c=y,u=g,f=M):o/=2,!(o<1e-5)););const N=_t(s,u),x=Math.sqrt(f);return{closest:c,distance:x,segment:N}},Fe=(e,t)=>Ct(e,t).closest,_e=(e,t,s,r,n,i,o,l)=>3*((l-t)*(s+n)-(o-e)*(r+i)+r*(e-n)-s*(t-i)+l*(n+e/3)-o*(i+t/3))/20,ve=e=>{let t=0,s=0,r=0;return bt(e).map(n=>{switch(n[0]){case"M":return[,t,s]=n,0;default:return r=_e(t,s,n[1],n[2],n[3],n[4],n[5],n[6]),[t,s]=n.slice(-2),r}}).reduce((n,i)=>n+i,0)},Ue=e=>ve(bt(e))>=0,$e=e=>{if(!e)return{x:0,y:0,width:0,height:0,x2:0,y2:0,cx:0,cy:0,cz:0};const t=D(e);let s="M",r=0,n=0;const{max:i,min:o}=Math;let l=1/0,c=1/0,a=-1/0,u=-1/0,f=0,h=0,y=0,m=0,g=0,A=0,M=0,N=0,x=0,p=0;O(t,(I,E,q,v)=>{[s]=I;const B=s.toUpperCase(),R=B!==s?ot(I,E,q,v):I.slice(0),L=B==="V"?["L",q,R[1]]:B==="H"?["L",R[1],v]:R;if([s]=L,"TQ".includes(B)||(x=0,p=0),s==="M")[,r,n]=L,f=r,h=n,y=r,m=n;else if(s==="L")[f,h,y,m]=St(q,v,L[1],L[2]);else if(s==="A")[f,h,y,m]=xe(q,v,L[1],L[2],L[3],L[4],L[5],L[6],L[7]);else if(s==="S"){const j=g*2-M,H=A*2-N;[f,h,y,m]=Ht(q,v,j,H,L[1],L[2],L[3],L[4])}else s==="C"?[f,h,y,m]=Ht(q,v,L[1],L[2],L[3],L[4],L[5],L[6]):s==="T"?(x=g*2-x,p=A*2-p,[f,h,y,m]=Ft(q,v,x,p,L[1],L[2])):s==="Q"?(x=L[1],p=L[2],[f,h,y,m]=Ft(q,v,L[1],L[2],L[3],L[4])):s==="Z"&&([f,h,y,m]=St(q,v,r,n));l=o(f,l),c=o(h,c),a=i(y,a),u=i(m,u),[g,A]=s==="Z"?[r,n]:L.slice(-2),[M,N]=s==="C"?[L[3],L[4]]:s==="S"?[L[1],L[2]]:[g,A]});const w=a-l,C=u-c;return{width:w,height:C,x:l,y:c,x2:a,y2:u,cx:l+w/2,cy:c+C/2,cz:Math.max(w,C)+Math.min(w,C)/2}},Je=(e,t)=>_t(e,t).segment,Ke=(e,t)=>Ct(e,t).segment,Tt=e=>Array.isArray(e)&&e.every(t=>{const s=t[0].toLowerCase();return et[s]===t.length-1&&"achlmqstvz".includes(s)&&t.slice(1).every(Number.isFinite)})&&e.length>0,ze=e=>Tt(e)&&e.every(([t])=>t===t.toUpperCase()),Pe=e=>ze(e)&&e.every(([t])=>"ACLMQZ".includes(t)),We=e=>Pe(e)&&e.every(([t])=>"MC".includes(t)),Xe=(e,t)=>{const{distance:s}=Ct(e,t);return Math.abs(s)<Lt},Ye=e=>Tt(e)&&e.slice(1).every(([t])=>t===t.toLowerCase()),qe=e=>{if(typeof e!="string"||!e.length)return!1;const t=new kt(e);for(nt(t);t.index<t.max&&!t.err.length;)qt(t);return!t.err.length&&"mM".includes(t.segments[0][0])},ht={line:["x1","y1","x2","y2"],circle:["cx","cy","r"],ellipse:["cx","cy","rx","ry"],rect:["width","height","x","y","rx","ry"],polygon:["points"],polyline:["points"],glyph:["d"]},ke=e=>e!=null&&typeof e=="object"&&e.nodeType===1,Ve=e=>{let{x1:t,y1:s,x2:r,y2:n}=e;return[t,s,r,n]=[t,s,r,n].map(i=>+i),[["M",t,s],["L",r,n]]},Ge=e=>{const t=[],s=(e.points||"").trim().split(/[\s|,]/).map(n=>+n);let r=0;for(;r<s.length;)t.push([r?"L":"M",s[r],s[r+1]]),r+=2;return e.type==="polygon"?[...t,["z"]]:t},tn=e=>{let{cx:t,cy:s,r}=e;return[t,s,r]=[t,s,r].map(n=>+n),[["M",t-r,s],["a",r,r,0,1,0,2*r,0],["a",r,r,0,1,0,-2*r,0]]},en=e=>{let{cx:t,cy:s}=e,r=e.rx||0,n=e.ry||r;return[t,s,r,n]=[t,s,r,n].map(i=>+i),[["M",t-r,s],["a",r,n,0,1,0,2*r,0],["a",r,n,0,1,0,-2*r,0]]},nn=e=>{const t=+e.x||0,s=+e.y||0,r=+e.width,n=+e.height;let i=+(e.rx||0),o=+(e.ry||i);return i||o?(i*2>r&&(i-=(i*2-r)/2),o*2>n&&(o-=(o*2-n)/2),[["M",t+i,s],["h",r-i*2],["s",i,0,i,o],["v",n-o*2],["s",0,o,-i,o],["h",-r+i*2],["s",-i,0,-i,-o],["v",-n+o*2],["s",0,-o,i,-o]]):[["M",t,s],["h",r],["v",n],["H",t],["Z"]]},Ie=e=>{const t=Object.keys(ht),s=ke(e),r=s?e.tagName:null;if(r&&[...t,"path"].every(c=>r!==c))throw TypeError(`${Z}: "${r}" is not SVGElement`);const n=s?r:e.type,i=ht[n],o={type:n};s?i.forEach(c=>{o[c]=e.getAttribute(c)}):Object.assign(o,e);let l=[];return n==="circle"?l=tn(o):n==="ellipse"?l=en(o):["polyline","polygon"].includes(n)?l=Ge(o):n==="rect"?l=nn(o):n==="line"?l=Ve(o):["glyph","path"].includes(n)&&(l=D(s?e.getAttribute("d")||"":e.d||"")),Tt(l)&&l.length?l:!1},sn=(e,t,s)=>{const r=s||document,n=Object.keys(ht),i=ke(e),o=i?e.tagName:null;if(o==="path")throw TypeError(`${Z}: "${o}" is already SVGPathElement`);if(o&&n.every(m=>o!==m))throw TypeError(`${Z}: "${o}" is not SVGElement`);const l=r.createElementNS("http://www.w3.org/2000/svg","path"),c=i?o:e.type,a=ht[c],u={type:c},f=Y.round,h=Ie(e),y=h&&h.length?Rt(h,f):"";return i?(a.forEach(m=>{u[m]=e.getAttribute(m)}),Object.values(e.attributes).forEach(({name:m,value:g})=>{a.includes(m)||l.setAttribute(m,g)})):(Object.assign(u,e),Object.keys(u).forEach(m=>{!a.includes(m)&&m!=="type"&&l.setAttribute(m.replace(/[A-Z]/g,g=>`-${g.toLowerCase()}`),u[m])})),qe(y)?(l.setAttribute("d",y),t&&i&&(e.before(l,e),e.remove()),l):!1},Ee=e=>{let t=new T;const{origin:s}=e,[r,n]=s,{translate:i}=e,{rotate:o}=e,{skew:l}=e,{scale:c}=e;return Array.isArray(i)&&i.length>=2&&i.every(a=>!Number.isNaN(+a))&&i.some(a=>a!==0)?t=t.translate(...i):typeof i=="number"&&!Number.isNaN(i)&&(t=t.translate(i)),(o||l||c)&&(t=t.translate(r,n),Array.isArray(o)&&o.length>=2&&o.every(a=>!Number.isNaN(+a))&&o.some(a=>a!==0)?t=t.rotate(...o):typeof o=="number"&&!Number.isNaN(o)&&(t=t.rotate(o)),Array.isArray(l)&&l.length===2&&l.every(a=>!Number.isNaN(+a))&&l.some(a=>a!==0)?(t=l[0]?t.skewX(l[0]):t,t=l[1]?t.skewY(l[1]):t):typeof l=="number"&&!Number.isNaN(l)&&(t=t.skewX(l)),Array.isArray(c)&&c.length>=2&&c.every(a=>!Number.isNaN(+a))&&c.some(a=>a!==1)?t=t.scale(...c):typeof c=="number"&&!Number.isNaN(c)&&(t=t.scale(c)),t=t.translate(-r,-n)),t},Re=(e,t,s,r)=>{const[n]=e,{round:i}=Y,o=typeof i=="number"?i:4,l=t.slice(1),{x1:c,y1:a,x2:u,y2:f,x:h,y}=s,[m,g]=l.slice(-2),A=e;if("TQ".includes(n)||(s.qx=null,s.qy=null),n==="L"){if(P(h,o)===P(m,o))return["V",g];if(P(y,o)===P(g,o))return["H",m]}else if(n==="C"){const[M,N]=l;if(s.x1=M,s.y1=N,"CS".includes(r)&&(P(M,o)===P(c*2-u,o)&&P(N,o)===P(a*2-f,o)||P(c,o)===P(u*2-h,o)&&P(a,o)===P(f*2-y,o)))return["S",l[2],l[3],l[4],l[5]]}else if(n==="Q"){const[M,N]=l;if(s.qx=M,s.qy=N,"QT".includes(r)&&P(M,o)===P(c*2-u,o)&&P(N,o)===P(a*2-f,o))return["T",l[2],l[3]]}return A},vt=(e,t)=>{const s=e.slice(1).map(r=>P(r,t));return[e[0]].concat(s)},je=(e,t)=>{const s=gt(e),r=typeof t=="number"&&t>=0?t:2,n={...lt},i=[];let o="M",l="Z";return O(s,(c,a,u,f)=>{n.x=u,n.y=f;const h=pt(c,n);let y=c;if([o]=c,i[a]=o,a){l=i[a-1];const g=Re(c,h,n,l),A=vt(g,r),M=A.join(""),N=It(g,a,u,f),x=vt(N,r),p=x.join("");y=M.length<p.length?A:x}const m=h.length;return n.x1=+h[m-2],n.y1=+h[m-1],n.x2=+h[m-4]||n.x1,n.y2=+h[m-3]||n.y1,y})},rn=(e,t)=>{let s=T.Translate(t[0],t[1],t[2]);return[,,,s.m44]=t,s=e.multiply(s),[s.m41,s.m42,s.m43,s.m44]},Ut=(e,t,s)=>{const[r,n,i]=s,[o,l,c]=rn(e,[t[0],t[1],0,1]),a=o-r,u=l-n,f=c-i;return[a*(Math.abs(i)/Math.abs(f)||1)+r,u*(Math.abs(i)/Math.abs(f)||1)+n]},on=e=>{const t=e.slice(1).map((s,r,n)=>r?n[r-1].slice(-2).concat(s.slice(1)):e[0].slice(1).concat(s.slice(1))).map(s=>s.map((r,n)=>s[s.length-n-2*(1-n%2)])).reverse();return[["M"].concat(t[0].slice(0,2))].concat(t.map(s=>["C"].concat(s.slice(2))))},$t=e=>{const t=gt(e),s=mt(t),r=t.length,n=t[r-1][0]==="Z",i=O(t,(o,l)=>{const c=s[l],a=l&&t[l-1],u=a&&a[0],f=t[l+1],h=f&&f[0],[y]=o,[m,g]=s[l?l-1:r-1].slice(-2);let A=o;switch(y){case"M":A=n?["Z"]:[y,m,g];break;case"A":A=[y,o[1],o[2],o[3],o[4],o[5]===1?0:1,m,g];break;case"C":f&&h==="S"?A=["S",o[1],o[2],m,g]:A=[y,o[3],o[4],o[1],o[2],m,g];break;case"S":u&&"CS".includes(u)&&(!f||h!=="S")?A=["C",c[3],c[4],c[1],c[2],m,g]:A=[y,c[1],c[2],m,g];break;case"Q":f&&h==="T"?A=["T",m,g]:A=[y,o[1],o[2],m,g];break;case"T":u&&"QT".includes(u)&&(!f||h!=="T")?A=["Q",c[1],c[2],m,g]:A=[y,m,g];break;case"Z":A=["M",m,g];break;case"H":A=[y,m];break;case"V":A=[y,g];break;default:A=[y].concat(o.slice(1,-2),m,g)}return A});return n?i.reverse():[i[0]].concat(i.slice(1).reverse())},cn=(e,t)=>{let{round:s}=Y;return s=t==="off"||typeof t=="number"&&t>=0?t:typeof s=="number"&&s>=0?s:"off",s==="off"?e.slice(0):O(e,r=>vt(r,s))},ln=(e,t=.5)=>{const s=t,r=e.slice(0,2),n=e.slice(2,4),i=e.slice(4,6),o=e.slice(6,8),l=F(r,n,s),c=F(n,i,s),a=F(i,o,s),u=F(l,c,s),f=F(c,a,s),h=F(u,f,s);return[["C",l[0],l[1],u[0],u[1],h[0],h[1]],["C",f[0],f[1],a[0],a[1],o[0],o[1]]]},Se=e=>{const t=[];let s,r=-1,n=0,i=0,o=0,l=0;const c={...lt};return e.forEach(a=>{const[u]=a,f=u.toUpperCase(),h=u.toLowerCase(),y=u===h,m=a.slice(1);f==="M"?(r+=1,[n,i]=m,n+=y?c.x:0,i+=y?c.y:0,o=n,l=i,s=[y?[f,o,l]:a]):(f==="Z"?(n=o,i=l):f==="H"?([,n]=a,n+=y?c.x:0):f==="V"?([,i]=a,i+=y?c.y:0):([n,i]=a.slice(-2),n+=y?c.x:0,i+=y?c.y:0),s.push(a)),c.x=n,c.y=i,t[r]=s}),t},Qe=(e,t)=>{let s=0,r=0,n=0,i=0,o=0,l=0,c="M";const a=D(e),u=t&&Object.keys(t);if(!t||u&&!u.length)return a.slice(0);t.origin||Object.assign(t,{origin:Y.origin});const f=t.origin,h=Ee(t);return h.isIdentity?a.slice(0):O(a,(y,m,g,A)=>{[c]=y;const M=c.toUpperCase(),x=M!==c?ot(y,m,g,A):y.slice(0);let p=M==="A"?["C"].concat(xt(g,A,x[1],x[2],x[3],x[4],x[5],x[6],x[7])):M==="V"?["L",g,x[1]]:M==="H"?["L",x[1],A]:x;c=p[0];const w=c==="C"&&p.length>7,C=w?p.slice(0,7):p.slice(0);if(w&&(a.splice(m+1,0,["C"].concat(p.slice(7))),p=C),c==="L")[n,i]=Ut(h,[p[1],p[2]],f),s!==n&&r!==i?p=["L",n,i]:r===i?p=["H",n]:s===n&&(p=["V",i]);else for(o=1,l=p.length;o<l;o+=2)[n,i]=Ut(h,[+p[o],+p[o+1]],f),p[o]=n,p[o+1]=i;return s=n,r=i,p})};class b{constructor(t,s){const r=s||{},n=typeof t>"u";if(n||!t.length)throw TypeError(`${Z}: "pathValue" is ${n?"undefined":"empty"}`);this.segments=D(t);const{round:i,origin:o}=r;let l;Number.isInteger(i)||i==="off"?l=i:l=Y.round;let c=Y.origin;if(Array.isArray(o)&&o.length>=2){const[a,u,f]=o.map(Number);c=[Number.isNaN(a)?0:a,Number.isNaN(u)?0:u,Number.isNaN(f)?0:f]}return this.round=l,this.origin=c,this}get bbox(){return $e(this.segments)}get length(){return st(this.segments)}getBBox(){return this.bbox}getTotalLength(){return this.length}getPointAtLength(t){return ft(this.segments,t)}toAbsolute(){const{segments:t}=this;return this.segments=gt(t),this}toRelative(){const{segments:t}=this;return this.segments=fe(t),this}toCurve(){const{segments:t}=this;return this.segments=bt(t),this}reverse(t){const{segments:s}=this,r=Se(s),n=r.length>1?r:!1,i=n?n.map((l,c)=>t?c?$t(l):l.slice(0):$t(l)):s.slice(0);let o=[];return n?o=i.flat(1):o=t?s:$t(s),this.segments=o.slice(0),this}normalize(){const{segments:t}=this;return this.segments=mt(t),this}optimize(){const{segments:t}=this,s=this.round==="off"?2:this.round;return this.segments=je(t,s),this}transform(t){if(!t||typeof t!="object"||typeof t=="object"&&!["translate","rotate","skew","scale"].some(c=>c in t))return this;const{segments:s,origin:[r,n,i]}=this,o={};for(const[c,a]of Object.entries(t))c==="skew"&&Array.isArray(a)||(c==="rotate"||c==="translate"||c==="origin"||c==="scale")&&Array.isArray(a)?o[c]=a.map(Number):c!=="origin"&&typeof Number(a)=="number"&&(o[c]=Number(a));const{origin:l}=o;if(Array.isArray(l)&&l.length>=2){const[c,a,u]=l.map(Number);o.origin=[Number.isNaN(c)?r:c,Number.isNaN(a)?n:a,u||i]}else o.origin=[r,n,i];return this.segments=Qe(s,o),this}flipX(){const{cx:t,cy:s}=this.bbox;return this.transform({rotate:[0,180,0],origin:[t,s,0]}),this}flipY(){const{cx:t,cy:s}=this.bbox;return this.transform({rotate:[180,0,0],origin:[t,s,0]}),this}toString(){return Rt(this.segments,this.round)}dispose(){Object.keys(this).forEach(t=>delete this[t])}}return d(b,"CSSMatrix",T),d(b,"pathToAbsolute",gt),d(b,"pathToRelative",fe),d(b,"pathToCurve",bt),d(b,"pathToString",Rt),d(b,"arcTools",Oe),d(b,"bezierTools",{Cvalues:pe,Tvalues:Ot,minmaxC:Bt,minmaxQ:Mt,getBezierLength:ut,bezierLength:Me,calculateBezier:Ae,computeBezier:de,deriveBezier:be,CBEZIER_MINMAX_EPSILON:Ne}),d(b,"cubicTools",{getCubicLength:Nt,getCubicBBox:Ht,getPointAtCubicLength:Le,getPointAtCubicSegmentLength:we}),d(b,"lineTools",{getPointAtLineLength:jt,getLineBBox:St,getLineLength:at}),d(b,"quadTools",{getPointAtQuadSegmentLength:Ce,getQuadLength:wt,getQuadBBox:Ft,getPointAtQuadLength:Te}),d(b,"polygonTools",{polygonArea:Be,polygonLength:He}),d(b,"distanceSquareRoot",dt),d(b,"distanceEpsilon",Lt),d(b,"midPoint",F),d(b,"rotateVector",ct),d(b,"roundTo",P),d(b,"finalizeSegment",Pt),d(b,"invalidPathValue",W),d(b,"isArcCommand",ue),d(b,"isDigit",K),d(b,"isDigitStart",ae),d(b,"isMoveCommand",me),d(b,"isPathCommand",le),d(b,"isSpace",ce),d(b,"paramsCount",et),d(b,"paramsParser",lt),d(b,"pathParser",kt),d(b,"scanFlag",ie),d(b,"scanParam",oe),d(b,"scanSegment",qt),d(b,"skipSpaces",nt),d(b,"getPathBBox",$e),d(b,"getPathArea",ve),d(b,"getTotalLength",st),d(b,"getDrawDirection",Ue),d(b,"getPointAtLength",ft),d(b,"getPropertiesAtLength",_t),d(b,"getPropertiesAtPoint",Ct),d(b,"getClosestPoint",Fe),d(b,"getSegmentOfPoint",Ke),d(b,"getSegmentAtLength",Je),d(b,"isPointInStroke",Xe),d(b,"isValidPath",qe),d(b,"isPathArray",Tt),d(b,"isAbsoluteArray",ze),d(b,"isRelativeArray",Ye),d(b,"isCurveArray",We),d(b,"isNormalizedArray",Pe),d(b,"shapeToPath",sn),d(b,"shapeToPathArray",Ie),d(b,"shapeParams",ht),d(b,"parsePathString",D),d(b,"absolutizeSegment",ot),d(b,"arcToCubic",xt),d(b,"getSVGMatrix",Ee),d(b,"iterate",O),d(b,"lineToCubic",Et),d(b,"normalizePath",mt),d(b,"normalizeSegment",pt),d(b,"optimizePath",je),d(b,"projection2d",Ut),d(b,"quadToCubic",he),d(b,"relativizeSegment",It),d(b,"reverseCurve",on),d(b,"reversePath",$t),d(b,"roundPath",cn),d(b,"roundSegment",vt),d(b,"segmentToCubic",ye),d(b,"shortenSegment",Re),d(b,"splitCubic",ln),d(b,"splitPath",Se),d(b,"transformPath",Qe),b}();
//# sourceMappingURL=svg-path-commander.js.map
