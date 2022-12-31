const at = {
  origin: [0, 0, 0],
  round: 4
}, q = "SVGPathCommander Error", B = {
  a: 7,
  c: 6,
  h: 1,
  l: 2,
  m: 2,
  r: 4,
  q: 4,
  s: 4,
  t: 2,
  v: 1,
  z: 0
}, Ct = (e) => {
  let t = e.pathValue[e.segmentStart], n = t.toLowerCase();
  const { data: r } = e;
  for (; r.length >= B[n] && (n === "m" && r.length > 2 ? (e.segments.push([t, ...r.splice(0, 2)]), n = "l", t = t === "m" ? "l" : "L") : e.segments.push([t, ...r.splice(0, B[n])]), !!B[n]); )
    ;
}, Ut = (e) => {
  const { index: t, pathValue: n } = e, r = n.charCodeAt(t);
  if (r === 48) {
    e.param = 0, e.index += 1;
    return;
  }
  if (r === 49) {
    e.param = 1, e.index += 1;
    return;
  }
  e.err = `${q}: invalid Arc flag "${n[t]}", expecting 0 or 1 at index ${t}`;
}, I = (e) => e >= 48 && e <= 57, D = "Invalid path value", Kt = (e) => {
  const { max: t, pathValue: n, index: r } = e;
  let s = r, i = !1, o = !1, l = !1, c = !1, a;
  if (s >= t) {
    e.err = `${q}: ${D} at index ${s}, "pathValue" is missing param`;
    return;
  }
  if (a = n.charCodeAt(s), (a === 43 || a === 45) && (s += 1, a = n.charCodeAt(s)), !I(a) && a !== 46) {
    e.err = `${q}: ${D} at index ${s}, "${n[s]}" is not a number`;
    return;
  }
  if (a !== 46) {
    if (i = a === 48, s += 1, a = n.charCodeAt(s), i && s < t && a && I(a)) {
      e.err = `${q}: ${D} at index ${r}, "${n[r]}" illegal number`;
      return;
    }
    for (; s < t && I(n.charCodeAt(s)); )
      s += 1, o = !0;
    a = n.charCodeAt(s);
  }
  if (a === 46) {
    for (c = !0, s += 1; I(n.charCodeAt(s)); )
      s += 1, l = !0;
    a = n.charCodeAt(s);
  }
  if (a === 101 || a === 69) {
    if (c && !o && !l) {
      e.err = `${q}: ${D} at index ${s}, "${n[s]}" invalid float exponent`;
      return;
    }
    if (s += 1, a = n.charCodeAt(s), (a === 43 || a === 45) && (s += 1), s < t && I(n.charCodeAt(s)))
      for (; s < t && I(n.charCodeAt(s)); )
        s += 1;
    else {
      e.err = `${q}: ${D} at index ${s}, "${n[s]}" invalid integer exponent`;
      return;
    }
  }
  e.index = s, e.param = +e.pathValue.slice(r, s);
}, _t = (e) => [
  5760,
  6158,
  8192,
  8193,
  8194,
  8195,
  8196,
  8197,
  8198,
  8199,
  8200,
  8201,
  8202,
  8239,
  8287,
  12288,
  65279,
  10,
  13,
  8232,
  8233,
  32,
  9,
  11,
  12,
  160
].includes(e), G = (e) => {
  const { pathValue: t, max: n } = e;
  for (; e.index < n && _t(t.charCodeAt(e.index)); )
    e.index += 1;
}, Wt = (e) => {
  switch (e | 32) {
    case 109:
    case 122:
    case 108:
    case 104:
    case 118:
    case 99:
    case 115:
    case 113:
    case 116:
    case 97:
      return !0;
    default:
      return !1;
  }
}, te = (e) => I(e) || e === 43 || e === 45 || e === 46, ee = (e) => (e | 32) === 97, Vt = (e) => {
  const { max: t, pathValue: n, index: r } = e, s = n.charCodeAt(r), i = B[n[r].toLowerCase()];
  if (e.segmentStart = r, !Wt(s)) {
    e.err = `${q}: ${D} "${n[r]}" is not a path command`;
    return;
  }
  if (e.index += 1, G(e), e.data = [], !i) {
    Ct(e);
    return;
  }
  for (; ; ) {
    for (let o = i; o > 0; o -= 1) {
      if (ee(s) && (o === 3 || o === 4) ? Ut(e) : Kt(e), e.err.length)
        return;
      e.data.push(e.param), G(e), e.index < t && n.charCodeAt(e.index) === 44 && (e.index += 1, G(e));
    }
    if (e.index >= e.max || !te(n.charCodeAt(e.index)))
      break;
  }
  Ct(e);
};
class Ot {
  constructor(t) {
    this.segments = [], this.pathValue = t, this.max = t.length, this.index = 0, this.param = 0, this.segmentStart = 0, this.data = [], this.err = "";
  }
}
const ct = (e) => Array.isArray(e) && e.every((t) => {
  const n = t[0].toLowerCase();
  return B[n] === t.length - 1 && "achlmqstvz".includes(n);
}), R = (e) => {
  if (ct(e))
    return [...e];
  const t = new Ot(e);
  for (G(t); t.index < t.max && !t.err.length; )
    Vt(t);
  if (t.err && t.err.length)
    throw TypeError(t.err);
  return t.segments;
}, ne = (e) => {
  const t = e.length;
  let n = -1, r, s = e[t - 1], i = 0;
  for (; ++n < t; )
    r = s, s = e[n], i += r[1] * s[0] - r[0] * s[1];
  return i / 2;
}, U = (e, t) => Math.sqrt((e[0] - t[0]) * (e[0] - t[0]) + (e[1] - t[1]) * (e[1] - t[1])), se = (e) => e.reduce((t, n, r) => r ? t + U(e[r - 1], n) : 0, 0);
var re = Object.defineProperty, ie = (e, t, n) => t in e ? re(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, C = (e, t, n) => (ie(e, typeof t != "symbol" ? t + "" : t, n), n);
const oe = {
  a: 1,
  b: 0,
  c: 0,
  d: 1,
  e: 0,
  f: 0,
  m11: 1,
  m12: 0,
  m13: 0,
  m14: 0,
  m21: 0,
  m22: 1,
  m23: 0,
  m24: 0,
  m31: 0,
  m32: 0,
  m33: 1,
  m34: 0,
  m41: 0,
  m42: 0,
  m43: 0,
  m44: 1,
  is2D: !0,
  isIdentity: !0
}, zt = (e) => (e instanceof Float64Array || e instanceof Float32Array || Array.isArray(e) && e.every((t) => typeof t == "number")) && [6, 16].some((t) => e.length === t), It = (e) => e instanceof DOMMatrix || e instanceof N || typeof e == "object" && Object.keys(oe).every((t) => e && t in e), K = (e) => {
  const t = new N(), n = Array.from(e);
  if (!zt(n))
    throw TypeError(`CSSMatrix: "${n.join(",")}" must be an array with 6/16 numbers.`);
  if (n.length === 16) {
    const [r, s, i, o, l, c, a, m, f, y, g, h, u, x, p, d] = n;
    t.m11 = r, t.a = r, t.m21 = l, t.c = l, t.m31 = f, t.m41 = u, t.e = u, t.m12 = s, t.b = s, t.m22 = c, t.d = c, t.m32 = y, t.m42 = x, t.f = x, t.m13 = i, t.m23 = a, t.m33 = g, t.m43 = p, t.m14 = o, t.m24 = m, t.m34 = h, t.m44 = d;
  } else if (n.length === 6) {
    const [r, s, i, o, l, c] = n;
    t.m11 = r, t.a = r, t.m12 = s, t.b = s, t.m21 = i, t.c = i, t.m22 = o, t.d = o, t.m41 = l, t.e = l, t.m42 = c, t.f = c;
  }
  return t;
}, jt = (e) => {
  if (It(e))
    return K([
      e.m11,
      e.m12,
      e.m13,
      e.m14,
      e.m21,
      e.m22,
      e.m23,
      e.m24,
      e.m31,
      e.m32,
      e.m33,
      e.m34,
      e.m41,
      e.m42,
      e.m43,
      e.m44
    ]);
  throw TypeError(`CSSMatrix: "${JSON.stringify(e)}" is not a DOMMatrix / CSSMatrix / JSON compatible object.`);
}, Et = (e) => {
  if (typeof e != "string")
    throw TypeError(`CSSMatrix: "${JSON.stringify(e)}" is not a string.`);
  const t = String(e).replace(/\s/g, "");
  let n = new N();
  const r = `CSSMatrix: invalid transform string "${e}"`;
  return t.split(")").filter((s) => s).forEach((s) => {
    const [i, o] = s.split("(");
    if (!o)
      throw TypeError(r);
    const l = o.split(",").map((h) => h.includes("rad") ? parseFloat(h) * (180 / Math.PI) : parseFloat(h)), [c, a, m, f] = l, y = [c, a, m], g = [c, a, m, f];
    if (i === "perspective" && c && [a, m].every((h) => h === void 0))
      n.m34 = -1 / c;
    else if (i.includes("matrix") && [6, 16].includes(l.length) && l.every((h) => !Number.isNaN(+h))) {
      const h = l.map((u) => Math.abs(u) < 1e-6 ? 0 : u);
      n = n.multiply(K(h));
    } else if (i === "translate3d" && y.every((h) => !Number.isNaN(+h)))
      n = n.translate(c, a, m);
    else if (i === "translate" && c && m === void 0)
      n = n.translate(c, a || 0, 0);
    else if (i === "rotate3d" && g.every((h) => !Number.isNaN(+h)) && f)
      n = n.rotateAxisAngle(c, a, m, f);
    else if (i === "rotate" && c && [a, m].every((h) => h === void 0))
      n = n.rotate(0, 0, c);
    else if (i === "scale3d" && y.every((h) => !Number.isNaN(+h)) && y.some((h) => h !== 1))
      n = n.scale(c, a, m);
    else if (i === "scale" && !Number.isNaN(c) && c !== 1 && m === void 0) {
      const h = Number.isNaN(+a) ? c : a;
      n = n.scale(c, h, 1);
    } else if (i === "skew" && (c || !Number.isNaN(c) && a) && m === void 0)
      n = n.skew(c, a || 0);
    else if (["translate", "rotate", "scale", "skew"].some((h) => i.includes(h)) && /[XYZ]/.test(i) && c && [a, m].every((h) => h === void 0))
      if (i === "skewX" || i === "skewY")
        n = n[i](c);
      else {
        const h = i.replace(/[XYZ]/, ""), u = i.replace(h, ""), x = ["X", "Y", "Z"].indexOf(u), p = h === "scale" ? 1 : 0, d = [x === 0 ? c : p, x === 1 ? c : p, x === 2 ? c : p];
        n = n[h](...d);
      }
    else
      throw TypeError(r);
  }), n;
}, xt = (e, t) => t ? [e.a, e.b, e.c, e.d, e.e, e.f] : [
  e.m11,
  e.m12,
  e.m13,
  e.m14,
  e.m21,
  e.m22,
  e.m23,
  e.m24,
  e.m31,
  e.m32,
  e.m33,
  e.m34,
  e.m41,
  e.m42,
  e.m43,
  e.m44
], Dt = (e, t, n) => {
  const r = new N();
  return r.m41 = e, r.e = e, r.m42 = t, r.f = t, r.m43 = n, r;
}, Zt = (e, t, n) => {
  const r = new N(), s = Math.PI / 180, i = e * s, o = t * s, l = n * s, c = Math.cos(i), a = -Math.sin(i), m = Math.cos(o), f = -Math.sin(o), y = Math.cos(l), g = -Math.sin(l), h = m * y, u = -m * g;
  r.m11 = h, r.a = h, r.m12 = u, r.b = u, r.m13 = f;
  const x = a * f * y + c * g;
  r.m21 = x, r.c = x;
  const p = c * y - a * f * g;
  return r.m22 = p, r.d = p, r.m23 = -a * m, r.m31 = a * g - c * f * y, r.m32 = a * y + c * f * g, r.m33 = c * m, r;
}, Rt = (e, t, n, r) => {
  const s = new N(), i = Math.sqrt(e * e + t * t + n * n);
  if (i === 0)
    return s;
  const o = e / i, l = t / i, c = n / i, a = r * (Math.PI / 360), m = Math.sin(a), f = Math.cos(a), y = m * m, g = o * o, h = l * l, u = c * c, x = 1 - 2 * (h + u) * y;
  s.m11 = x, s.a = x;
  const p = 2 * (o * l * y + c * m * f);
  s.m12 = p, s.b = p, s.m13 = 2 * (o * c * y - l * m * f);
  const d = 2 * (l * o * y - c * m * f);
  s.m21 = d, s.c = d;
  const A = 1 - 2 * (u + g) * y;
  return s.m22 = A, s.d = A, s.m23 = 2 * (l * c * y + o * m * f), s.m31 = 2 * (c * o * y + l * m * f), s.m32 = 2 * (c * l * y - o * m * f), s.m33 = 1 - 2 * (g + h) * y, s;
}, Xt = (e, t, n) => {
  const r = new N();
  return r.m11 = e, r.a = e, r.m22 = t, r.d = t, r.m33 = n, r;
}, lt = (e, t) => {
  const n = new N();
  if (e) {
    const r = e * Math.PI / 180, s = Math.tan(r);
    n.m21 = s, n.c = s;
  }
  if (t) {
    const r = t * Math.PI / 180, s = Math.tan(r);
    n.m12 = s, n.b = s;
  }
  return n;
}, Ft = (e) => lt(e, 0), Qt = (e) => lt(0, e), k = (e, t) => {
  const n = t.m11 * e.m11 + t.m12 * e.m21 + t.m13 * e.m31 + t.m14 * e.m41, r = t.m11 * e.m12 + t.m12 * e.m22 + t.m13 * e.m32 + t.m14 * e.m42, s = t.m11 * e.m13 + t.m12 * e.m23 + t.m13 * e.m33 + t.m14 * e.m43, i = t.m11 * e.m14 + t.m12 * e.m24 + t.m13 * e.m34 + t.m14 * e.m44, o = t.m21 * e.m11 + t.m22 * e.m21 + t.m23 * e.m31 + t.m24 * e.m41, l = t.m21 * e.m12 + t.m22 * e.m22 + t.m23 * e.m32 + t.m24 * e.m42, c = t.m21 * e.m13 + t.m22 * e.m23 + t.m23 * e.m33 + t.m24 * e.m43, a = t.m21 * e.m14 + t.m22 * e.m24 + t.m23 * e.m34 + t.m24 * e.m44, m = t.m31 * e.m11 + t.m32 * e.m21 + t.m33 * e.m31 + t.m34 * e.m41, f = t.m31 * e.m12 + t.m32 * e.m22 + t.m33 * e.m32 + t.m34 * e.m42, y = t.m31 * e.m13 + t.m32 * e.m23 + t.m33 * e.m33 + t.m34 * e.m43, g = t.m31 * e.m14 + t.m32 * e.m24 + t.m33 * e.m34 + t.m34 * e.m44, h = t.m41 * e.m11 + t.m42 * e.m21 + t.m43 * e.m31 + t.m44 * e.m41, u = t.m41 * e.m12 + t.m42 * e.m22 + t.m43 * e.m32 + t.m44 * e.m42, x = t.m41 * e.m13 + t.m42 * e.m23 + t.m43 * e.m33 + t.m44 * e.m43, p = t.m41 * e.m14 + t.m42 * e.m24 + t.m43 * e.m34 + t.m44 * e.m44;
  return K([n, r, s, i, o, l, c, a, m, f, y, g, h, u, x, p]);
};
class N {
  constructor(t) {
    return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.e = 0, this.f = 0, this.m11 = 1, this.m12 = 0, this.m13 = 0, this.m14 = 0, this.m21 = 0, this.m22 = 1, this.m23 = 0, this.m24 = 0, this.m31 = 0, this.m32 = 0, this.m33 = 1, this.m34 = 0, this.m41 = 0, this.m42 = 0, this.m43 = 0, this.m44 = 1, t ? this.setMatrixValue(t) : this;
  }
  get isIdentity() {
    return this.m11 === 1 && this.m12 === 0 && this.m13 === 0 && this.m14 === 0 && this.m21 === 0 && this.m22 === 1 && this.m23 === 0 && this.m24 === 0 && this.m31 === 0 && this.m32 === 0 && this.m33 === 1 && this.m34 === 0 && this.m41 === 0 && this.m42 === 0 && this.m43 === 0 && this.m44 === 1;
  }
  get is2D() {
    return this.m31 === 0 && this.m32 === 0 && this.m33 === 1 && this.m34 === 0 && this.m43 === 0 && this.m44 === 1;
  }
  setMatrixValue(t) {
    return typeof t == "string" && t.length && t !== "none" ? Et(t) : Array.isArray(t) || t instanceof Float64Array || t instanceof Float32Array ? K(t) : typeof t == "object" ? jt(t) : this;
  }
  toFloat32Array(t) {
    return Float32Array.from(xt(this, t));
  }
  toFloat64Array(t) {
    return Float64Array.from(xt(this, t));
  }
  toString() {
    const { is2D: t } = this, n = this.toFloat64Array(t).join(", ");
    return `${t ? "matrix" : "matrix3d"}(${n})`;
  }
  toJSON() {
    const { is2D: t, isIdentity: n } = this;
    return { ...this, is2D: t, isIdentity: n };
  }
  multiply(t) {
    return k(this, t);
  }
  translate(t, n, r) {
    const s = t;
    let i = n, o = r;
    return typeof i > "u" && (i = 0), typeof o > "u" && (o = 0), k(this, Dt(s, i, o));
  }
  scale(t, n, r) {
    const s = t;
    let i = n, o = r;
    return typeof i > "u" && (i = t), typeof o > "u" && (o = 1), k(this, Xt(s, i, o));
  }
  rotate(t, n, r) {
    let s = t, i = n || 0, o = r || 0;
    return typeof t == "number" && typeof n > "u" && typeof r > "u" && (o = s, s = 0, i = 0), k(this, Zt(s, i, o));
  }
  rotateAxisAngle(t, n, r, s) {
    if ([t, n, r, s].some((i) => Number.isNaN(+i)))
      throw new TypeError("CSSMatrix: expecting 4 values");
    return k(this, Rt(t, n, r, s));
  }
  skewX(t) {
    return k(this, Ft(t));
  }
  skewY(t) {
    return k(this, Qt(t));
  }
  skew(t, n) {
    return k(this, lt(t, n));
  }
  transformPoint(t) {
    const n = this.m11 * t.x + this.m21 * t.y + this.m31 * t.z + this.m41 * t.w, r = this.m12 * t.x + this.m22 * t.y + this.m32 * t.z + this.m42 * t.w, s = this.m13 * t.x + this.m23 * t.y + this.m33 * t.z + this.m43 * t.w, i = this.m14 * t.x + this.m24 * t.y + this.m34 * t.z + this.m44 * t.w;
    return t instanceof DOMPoint ? new DOMPoint(n, r, s, i) : {
      x: n,
      y: r,
      z: s,
      w: i
    };
  }
}
C(N, "Translate", Dt), C(N, "Rotate", Zt), C(N, "RotateAxisAngle", Rt), C(N, "Scale", Xt), C(N, "SkewX", Ft), C(N, "SkewY", Qt), C(N, "Skew", lt), C(N, "Multiply", k), C(N, "fromArray", K), C(N, "fromMatrix", jt), C(N, "fromString", Et), C(N, "toArray", xt), C(N, "isCompatibleArray", zt), C(N, "isCompatibleObject", It);
const Mt = (e) => ct(e) && e.every(([t]) => t === t.toUpperCase()), X = (e) => {
  if (Mt(e))
    return [...e];
  const t = R(e);
  let n = 0, r = 0, s = 0, i = 0;
  return t.map((o) => {
    const l = o.slice(1).map(Number), [c] = o, a = c.toUpperCase();
    if (c === "M")
      return [n, r] = l, s = n, i = r, ["M", n, r];
    let m = [];
    if (c !== a)
      if (a === "A")
        m = [
          a,
          l[0],
          l[1],
          l[2],
          l[3],
          l[4],
          l[5] + n,
          l[6] + r
        ];
      else if (a === "V")
        m = [a, l[0] + r];
      else if (a === "H")
        m = [a, l[0] + n];
      else {
        const f = l.map((y, g) => y + (g % 2 ? r : n));
        m = [a, ...f];
      }
    else
      m = [a, ...l];
    return a === "Z" ? (n = s, r = i) : a === "H" ? [, n] = m : a === "V" ? [, r] = m : ([n, r] = m.slice(-2), a === "M" && (s = n, i = r)), m;
  });
}, ae = (e, t) => {
  const [n] = e, { x1: r, y1: s, x2: i, y2: o } = t, l = e.slice(1).map(Number);
  let c = e;
  if ("TQ".includes(n) || (t.qx = null, t.qy = null), n === "H")
    c = ["L", e[1], s];
  else if (n === "V")
    c = ["L", r, e[1]];
  else if (n === "S") {
    const a = r * 2 - i, m = s * 2 - o;
    t.x1 = a, t.y1 = m, c = ["C", a, m, ...l];
  } else if (n === "T") {
    const a = r * 2 - (t.qx ? t.qx : 0), m = s * 2 - (t.qy ? t.qy : 0);
    t.qx = a, t.qy = m, c = ["Q", a, m, ...l];
  } else if (n === "Q") {
    const [a, m] = l;
    t.qx = a, t.qy = m;
  }
  return c;
}, At = (e) => Mt(e) && e.every(([t]) => "ACLMQZ".includes(t)), mt = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  x: 0,
  y: 0,
  qx: null,
  qy: null
}, O = (e) => {
  if (At(e))
    return [...e];
  const t = X(e), n = { ...mt }, r = t.length;
  for (let s = 0; s < r; s += 1) {
    t[s], t[s] = ae(t[s], n);
    const i = t[s], o = i.length;
    n.x1 = +i[o - 2], n.y1 = +i[o - 1], n.x2 = +i[o - 4] || n.x1, n.y2 = +i[o - 3] || n.y1;
  }
  return t;
}, V = (e, t, n) => {
  const [r, s] = e, [i, o] = t;
  return [r + (i - r) * n, s + (o - s) * n];
}, pt = (e, t, n, r, s) => {
  const i = U([e, t], [n, r]);
  let o = { x: 0, y: 0 };
  if (typeof s == "number")
    if (s <= 0)
      o = { x: e, y: t };
    else if (s >= i)
      o = { x: n, y: r };
    else {
      const [l, c] = V([e, t], [n, r], s / i);
      o = { x: l, y: c };
    }
  return {
    length: i,
    point: o,
    min: {
      x: Math.min(e, n),
      y: Math.min(t, r)
    },
    max: {
      x: Math.max(e, n),
      y: Math.max(t, r)
    }
  };
}, wt = (e, t) => {
  const { x: n, y: r } = e, { x: s, y: i } = t, o = n * s + r * i, l = Math.sqrt((n ** 2 + r ** 2) * (s ** 2 + i ** 2));
  return (n * i - r * s < 0 ? -1 : 1) * Math.acos(o / l);
}, ce = (e, t, n, r, s, i, o, l, c, a) => {
  const { abs: m, sin: f, cos: y, sqrt: g, PI: h } = Math;
  let u = m(n), x = m(r);
  const d = (s % 360 + 360) % 360 * (h / 180);
  if (e === l && t === c)
    return { x: e, y: t };
  if (u === 0 || x === 0)
    return pt(e, t, l, c, a).point;
  const A = (e - l) / 2, b = (t - c) / 2, M = {
    x: y(d) * A + f(d) * b,
    y: -f(d) * A + y(d) * b
  }, w = M.x ** 2 / u ** 2 + M.y ** 2 / x ** 2;
  w > 1 && (u *= g(w), x *= g(w));
  const $ = u ** 2 * x ** 2 - u ** 2 * M.y ** 2 - x ** 2 * M.x ** 2, F = u ** 2 * M.y ** 2 + x ** 2 * M.x ** 2;
  let E = $ / F;
  E = E < 0 ? 0 : E;
  const _ = (i !== o ? 1 : -1) * g(E), S = {
    x: _ * (u * M.y / x),
    y: _ * (-(x * M.x) / u)
  }, W = {
    x: y(d) * S.x - f(d) * S.y + (e + l) / 2,
    y: f(d) * S.x + y(d) * S.y + (t + c) / 2
  }, Q = {
    x: (M.x - S.x) / u,
    y: (M.y - S.y) / x
  }, tt = wt({ x: 1, y: 0 }, Q), et = {
    x: (-M.x - S.x) / u,
    y: (-M.y - S.y) / x
  };
  let T = wt(Q, et);
  !o && T > 0 ? T -= 2 * h : o && T < 0 && (T += 2 * h), T %= 2 * h;
  const L = tt + T * a, H = u * y(L), Y = x * f(L);
  return {
    x: y(d) * H - f(d) * Y + W.x,
    y: f(d) * H + y(d) * Y + W.y
  };
}, le = (e, t, n, r, s, i, o, l, c, a) => {
  const m = typeof a == "number";
  let f = e, y = t, g = 0, h = [f, y, g], u = [f, y], x = 0, p = { x: 0, y: 0 }, d = [{ x: f, y }];
  m && a <= 0 && (p = { x: f, y });
  const A = 300;
  for (let b = 0; b <= A; b += 1) {
    if (x = b / A, { x: f, y } = ce(e, t, n, r, s, i, o, l, c, x), d = [...d, { x: f, y }], g += U(u, [f, y]), u = [f, y], m && g > a && a > h[2]) {
      const M = (g - a) / (g - h[2]);
      p = {
        x: u[0] * (1 - M) + h[0] * M,
        y: u[1] * (1 - M) + h[1] * M
      };
    }
    h = [f, y, g];
  }
  return m && a >= g && (p = { x: l, y: c }), {
    length: g,
    point: p,
    min: {
      x: Math.min(...d.map((b) => b.x)),
      y: Math.min(...d.map((b) => b.y))
    },
    max: {
      x: Math.max(...d.map((b) => b.x)),
      y: Math.max(...d.map((b) => b.y))
    }
  };
}, me = (e, t, n, r, s, i, o, l, c) => {
  const a = 1 - c;
  return {
    x: a ** 3 * e + 3 * a ** 2 * c * n + 3 * a * c ** 2 * s + c ** 3 * o,
    y: a ** 3 * t + 3 * a ** 2 * c * r + 3 * a * c ** 2 * i + c ** 3 * l
  };
}, he = (e, t, n, r, s, i, o, l, c) => {
  const a = typeof c == "number";
  let m = e, f = t, y = 0, g = [m, f, y], h = [m, f], u = 0, x = { x: 0, y: 0 }, p = [{ x: m, y: f }];
  a && c <= 0 && (x = { x: m, y: f });
  const d = 300;
  for (let A = 0; A <= d; A += 1) {
    if (u = A / d, { x: m, y: f } = me(e, t, n, r, s, i, o, l, u), p = [...p, { x: m, y: f }], y += U(h, [m, f]), h = [m, f], a && y > c && c > g[2]) {
      const b = (y - c) / (y - g[2]);
      x = {
        x: h[0] * (1 - b) + g[0] * b,
        y: h[1] * (1 - b) + g[1] * b
      };
    }
    g = [m, f, y];
  }
  return a && c >= y && (x = { x: o, y: l }), {
    length: y,
    point: x,
    min: {
      x: Math.min(...p.map((A) => A.x)),
      y: Math.min(...p.map((A) => A.y))
    },
    max: {
      x: Math.max(...p.map((A) => A.x)),
      y: Math.max(...p.map((A) => A.y))
    }
  };
}, ue = (e, t, n, r, s, i, o) => {
  const l = 1 - o;
  return {
    x: l ** 2 * e + 2 * l * o * n + o ** 2 * s,
    y: l ** 2 * t + 2 * l * o * r + o ** 2 * i
  };
}, fe = (e, t, n, r, s, i, o) => {
  const l = typeof o == "number";
  let c = e, a = t, m = 0, f = [c, a, m], y = [c, a], g = 0, h = { x: 0, y: 0 }, u = [{ x: c, y: a }];
  l && o <= 0 && (h = { x: c, y: a });
  const x = 300;
  for (let p = 0; p <= x; p += 1) {
    if (g = p / x, { x: c, y: a } = ue(e, t, n, r, s, i, g), u = [...u, { x: c, y: a }], m += U(y, [c, a]), y = [c, a], l && m > o && o > f[2]) {
      const d = (m - o) / (m - f[2]);
      h = {
        x: y[0] * (1 - d) + f[0] * d,
        y: y[1] * (1 - d) + f[1] * d
      };
    }
    f = [c, a, m];
  }
  return l && o >= m && (h = { x: s, y: i }), {
    length: m,
    point: h,
    min: {
      x: Math.min(...u.map((p) => p.x)),
      y: Math.min(...u.map((p) => p.y))
    },
    max: {
      x: Math.max(...u.map((p) => p.x)),
      y: Math.max(...u.map((p) => p.y))
    }
  };
}, ht = (e, t) => {
  const n = O(e), r = typeof t == "number";
  let s, i = [], o, l = 0, c = 0, a = 0, m = 0, f, y = [], g = [], h = 0, u = { x: 0, y: 0 }, x = u, p = u, d = u, A = 0;
  for (let b = 0, M = n.length; b < M; b += 1)
    f = n[b], [o] = f, s = o === "M", i = s ? i : [l, c, ...f.slice(1)], s ? ([, a, m] = f, u = { x: a, y: m }, x = u, h = 0, r && t < 1e-3 && (d = u)) : o === "L" ? { length: h, min: u, max: x, point: p } = pt(
      ...i,
      (t || 0) - A
    ) : o === "A" ? { length: h, min: u, max: x, point: p } = le(
      ...i,
      (t || 0) - A
    ) : o === "C" ? { length: h, min: u, max: x, point: p } = he(
      ...i,
      (t || 0) - A
    ) : o === "Q" ? { length: h, min: u, max: x, point: p } = fe(
      ...i,
      (t || 0) - A
    ) : o === "Z" && (i = [l, c, a, m], { length: h, min: u, max: x, point: p } = pt(
      ...i,
      (t || 0) - A
    )), r && A < t && A + h >= t && (d = p), g = [...g, x], y = [...y, u], A += h, [l, c] = o !== "Z" ? f.slice(-2) : [a, m];
  return r && t >= A && (d = { x: l, y: c }), {
    length: A,
    point: d,
    min: {
      x: Math.min(...y.map((b) => b.x)),
      y: Math.min(...y.map((b) => b.y))
    },
    max: {
      x: Math.max(...g.map((b) => b.x)),
      y: Math.max(...g.map((b) => b.y))
    }
  };
}, vt = (e) => {
  if (!e)
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      x2: 0,
      y2: 0,
      cx: 0,
      cy: 0,
      cz: 0
    };
  const {
    min: { x: t, y: n },
    max: { x: r, y: s }
  } = ht(e), i = r - t, o = s - n;
  return {
    width: i,
    height: o,
    x: t,
    y: n,
    x2: r,
    y2: s,
    cx: t + i / 2,
    cy: n + o / 2,
    cz: Math.max(i, o) + Math.min(i, o) / 2
  };
}, dt = (e, t, n) => {
  if (e[n].length > 7) {
    e[n].shift();
    const r = e[n];
    let s = n;
    for (; r.length; )
      t[n] = "A", e.splice(s += 1, 0, ["C", ...r.splice(0, 6)]);
    e.splice(n, 1);
  }
}, Ht = (e) => At(e) && e.every(([t]) => "MC".includes(t)), nt = (e, t, n) => {
  const r = e * Math.cos(n) - t * Math.sin(n), s = e * Math.sin(n) + t * Math.cos(n);
  return { x: r, y: s };
}, Yt = (e, t, n, r, s, i, o, l, c, a) => {
  let m = e, f = t, y = n, g = r, h = l, u = c;
  const x = Math.PI * 120 / 180, p = Math.PI / 180 * (+s || 0);
  let d = [], A, b, M, w, $;
  if (a)
    [b, M, w, $] = a;
  else {
    A = nt(m, f, -p), m = A.x, f = A.y, A = nt(h, u, -p), h = A.x, u = A.y;
    const P = (m - h) / 2, v = (f - u) / 2;
    let z = P * P / (y * y) + v * v / (g * g);
    z > 1 && (z = Math.sqrt(z), y *= z, g *= z);
    const yt = y * y, gt = g * g, Pt = (i === o ? -1 : 1) * Math.sqrt(Math.abs((yt * gt - yt * v * v - gt * P * P) / (yt * v * v + gt * P * P)));
    w = Pt * y * v / g + (m + h) / 2, $ = Pt * -g * P / y + (f + u) / 2, b = Math.asin(((f - $) / g * 10 ** 9 >> 0) / 10 ** 9), M = Math.asin(((u - $) / g * 10 ** 9 >> 0) / 10 ** 9), b = m < w ? Math.PI - b : b, M = h < w ? Math.PI - M : M, b < 0 && (b = Math.PI * 2 + b), M < 0 && (M = Math.PI * 2 + M), o && b > M && (b -= Math.PI * 2), !o && M > b && (M -= Math.PI * 2);
  }
  let F = M - b;
  if (Math.abs(F) > x) {
    const P = M, v = h, z = u;
    M = b + x * (o && M > b ? 1 : -1), h = w + y * Math.cos(M), u = $ + g * Math.sin(M), d = Yt(h, u, y, g, s, 0, o, v, z, [M, P, w, $]);
  }
  F = M - b;
  const E = Math.cos(b), _ = Math.sin(b), S = Math.cos(M), W = Math.sin(M), Q = Math.tan(F / 4), tt = 4 / 3 * y * Q, et = 4 / 3 * g * Q, T = [m, f], L = [m + tt * _, f - et * E], H = [h + tt * W, u - et * S], Y = [h, u];
  if (L[0] = 2 * T[0] - L[0], L[1] = 2 * T[1] - L[1], a)
    return [...L, ...H, ...Y, ...d];
  d = [...L, ...H, ...Y, ...d];
  const ft = [];
  for (let P = 0, v = d.length; P < v; P += 1)
    ft[P] = P % 2 ? nt(d[P - 1], d[P], p).y : nt(d[P], d[P + 1], p).x;
  return ft;
}, ye = (e, t, n, r, s, i) => {
  const o = 0.3333333333333333, l = 2 / 3;
  return [
    o * e + l * n,
    o * t + l * r,
    o * s + l * n,
    o * i + l * r,
    s,
    i
  ];
}, St = (e, t, n, r) => [...V([e, t], [n, r], 0.5), n, r, n, r], rt = (e, t) => {
  const [n] = e, r = e.slice(1).map(Number), [s, i] = r;
  let o;
  const { x1: l, y1: c, x: a, y: m } = t;
  return "TQ".includes(n) || (t.qx = null, t.qy = null), n === "M" ? (t.x = s, t.y = i, e) : n === "A" ? (o = [l, c, ...r], ["C", ...Yt(...o)]) : n === "Q" ? (t.qx = s, t.qy = i, o = [l, c, ...r], ["C", ...ye(...o)]) : n === "L" ? ["C", ...St(l, c, s, i)] : n === "Z" ? ["C", ...St(l, c, a, m)] : e;
}, it = (e) => {
  if (Ht(e))
    return [...e];
  const t = O(e), n = { ...mt }, r = [];
  let s = "", i = t.length;
  for (let o = 0; o < i; o += 1) {
    [s] = t[o], r[o] = s, t[o] = rt(t[o], n), dt(t, r, o), i = t.length;
    const l = t[o], c = l.length;
    n.x1 = +l[c - 2], n.y1 = +l[c - 1], n.x2 = +l[c - 4] || n.x1, n.y2 = +l[c - 3] || n.y1;
  }
  return t;
}, ge = (e, t, n, r, s, i, o, l) => 3 * ((l - t) * (n + s) - (o - e) * (r + i) + r * (e - s) - n * (t - i) + l * (s + e / 3) - o * (i + t / 3)) / 20, Bt = (e) => {
  let t = 0, n = 0, r = 0;
  return it(e).map((s) => {
    switch (s[0]) {
      case "M":
        return [, t, n] = s, 0;
      default:
        return r = ge(t, n, ...s.slice(1)), [t, n] = s.slice(-2), r;
    }
  }).reduce((s, i) => s + i, 0);
}, Z = (e) => ht(e).length, xe = (e) => Bt(it(e)) >= 0, J = (e, t) => ht(e, t).point, Nt = (e, t) => {
  const n = R(e);
  let r = [...n], s = Z(r), i = r.length - 1, o = 0, l = 0, c = n[0];
  const [a, m] = c.slice(-2), f = { x: a, y: m };
  if (i <= 0 || !t || !Number.isFinite(t))
    return {
      segment: c,
      index: 0,
      length: l,
      point: f,
      lengthAtSegment: o
    };
  if (t >= s)
    return r = n.slice(0, -1), o = Z(r), l = s - o, {
      segment: n[i],
      index: i,
      length: l,
      lengthAtSegment: o
    };
  const y = [];
  for (; i > 0; )
    c = r[i], r = r.slice(0, -1), o = Z(r), l = s - o, s = o, y.push({
      segment: c,
      index: i,
      length: l,
      lengthAtSegment: o
    }), i -= 1;
  return y.find(({ lengthAtSegment: g }) => g <= t);
}, ut = (e, t) => {
  const n = R(e), r = O(n), s = Z(n), i = (b) => {
    const M = b.x - t.x, w = b.y - t.y;
    return M * M + w * w;
  };
  let o = 8, l, c = { x: 0, y: 0 }, a = 0, m = 0, f = 1 / 0;
  for (let b = 0; b <= s; b += o)
    l = J(r, b), a = i(l), a < f && (c = l, m = b, f = a);
  o /= 2;
  let y, g, h = 0, u = 0, x = 0, p = 0;
  for (; o > 0.5; )
    h = m - o, y = J(r, h), x = i(y), u = m + o, g = J(r, u), p = i(g), h >= 0 && x < f ? (c = y, m = h, f = x) : u <= s && p < f ? (c = g, m = u, f = p) : o /= 2;
  const d = Nt(n, m), A = Math.sqrt(f);
  return { closest: c, distance: A, segment: d };
}, pe = (e, t) => ut(e, t).closest, de = (e, t) => ut(e, t).segment, be = (e, t) => Nt(e, t).segment, Me = (e, t) => {
  const { distance: n } = ut(e, t);
  return Math.abs(n) < 1e-3;
}, Gt = (e) => {
  if (typeof e != "string")
    return !1;
  const t = new Ot(e);
  for (G(t); t.index < t.max && !t.err.length; )
    Vt(t);
  return !t.err.length && "mM".includes(t.segments[0][0]);
}, Jt = (e) => ct(e) && e.slice(1).every(([t]) => t === t.toLowerCase()), ot = (e, t) => {
  let { round: n } = at;
  if (t === "off" || n === "off")
    return [...e];
  n = typeof t == "number" && t >= 0 ? t : n;
  const r = typeof n == "number" && n >= 1 ? 10 ** n : 1;
  return e.map((s) => {
    const i = s.slice(1).map(Number).map((o) => n ? Math.round(o * r) / r : Math.round(o));
    return [s[0], ...i];
  });
}, j = (e, t) => ot(e, t).map((n) => n[0] + n.slice(1).join(" ")).join(""), Tt = {
  line: ["x1", "y1", "x2", "y2"],
  circle: ["cx", "cy", "r"],
  ellipse: ["cx", "cy", "rx", "ry"],
  rect: ["width", "height", "x", "y", "rx", "ry"],
  polygon: ["points"],
  polyline: ["points"],
  glyph: ["d"]
}, Ae = (e) => {
  const { x1: t, y1: n, x2: r, y2: s } = e;
  return [
    ["M", t, n],
    ["L", r, s]
  ];
}, Ne = (e) => {
  const t = [], n = (e.points || "").trim().split(/[\s|,]/).map(Number);
  let r = 0;
  for (; r < n.length; )
    t.push([r ? "L" : "M", n[r], n[r + 1]]), r += 2;
  return e.type === "polygon" ? [...t, ["z"]] : t;
}, Pe = (e) => {
  const { cx: t, cy: n, r } = e;
  return [
    ["M", t - r, n],
    ["a", r, r, 0, 1, 0, 2 * r, 0],
    ["a", r, r, 0, 1, 0, -2 * r, 0]
  ];
}, Ce = (e) => {
  const { cx: t, cy: n, rx: r, ry: s } = e;
  return [
    ["M", t - r, n],
    ["a", r, s, 0, 1, 0, 2 * r, 0],
    ["a", r, s, 0, 1, 0, -2 * r, 0]
  ];
}, we = (e) => {
  const t = +e.x || 0, n = +e.y || 0, r = +e.width, s = +e.height;
  let i = +e.rx, o = +e.ry;
  return i || o ? (i = i || o, o = o || i, i * 2 > r && (i -= (i * 2 - r) / 2), o * 2 > s && (o -= (o * 2 - s) / 2), [
    ["M", t + i, n],
    ["h", r - i * 2],
    ["s", i, 0, i, o],
    ["v", s - o * 2],
    ["s", 0, o, -i, o],
    ["h", -r + i * 2],
    ["s", -i, 0, -i, -o],
    ["v", -s + o * 2],
    ["s", 0, -o, i, -o]
  ]) : [["M", t, n], ["h", r], ["v", s], ["H", t], ["Z"]];
}, ve = (e, t, n) => {
  const r = n || document, s = r.defaultView || window, i = Object.keys(Tt), o = e instanceof s.SVGElement, l = o ? e.tagName : null;
  if (l && i.every((h) => l !== h))
    throw TypeError(`${q}: "${l}" is not SVGElement`);
  const c = r.createElementNS("http://www.w3.org/2000/svg", "path"), a = o ? l : e.type, m = Tt[a], f = { type: a };
  o ? (m.forEach((h) => {
    m.includes(h) && (f[h] = e.getAttribute(h));
  }), Object.values(e.attributes).forEach(({ name: h, value: u }) => {
    m.includes(h) || c.setAttribute(h, u);
  })) : (Object.assign(f, e), Object.keys(f).forEach((h) => {
    !m.includes(h) && h !== "type" && c.setAttribute(
      h.replace(/[A-Z]/g, (u) => `-${u.toLowerCase()}`),
      f[h]
    );
  }));
  let y = "";
  const g = at.round;
  return a === "circle" ? y = j(Pe(f), g) : a === "ellipse" ? y = j(Ce(f), g) : ["polyline", "polygon"].includes(a) ? y = j(Ne(f), g) : a === "rect" ? y = j(we(f), g) : a === "line" ? y = j(Ae(f), g) : a === "glyph" && (y = o ? e.getAttribute("d") : e.d), Gt(y) ? (c.setAttribute("d", y), t && o && (e.before(c, e), e.remove()), c) : !1;
}, Lt = (e) => {
  const t = [];
  let n, r = -1;
  return e.forEach((s) => {
    s[0] === "M" ? (n = [s], r += 1) : n = [...n, s], t[r] = n;
  }), t;
}, bt = (e) => {
  if (Jt(e))
    return [...e];
  const t = R(e);
  let n = 0, r = 0, s = 0, i = 0;
  return t.map((o) => {
    const l = o.slice(1).map(Number), [c] = o, a = c.toLowerCase();
    if (c === "M")
      return [n, r] = l, s = n, i = r, ["M", n, r];
    let m = [];
    if (c !== a)
      if (a === "a")
        m = [
          a,
          l[0],
          l[1],
          l[2],
          l[3],
          l[4],
          l[5] - n,
          l[6] - r
        ];
      else if (a === "v")
        m = [a, l[0] - r];
      else if (a === "h")
        m = [a, l[0] - n];
      else {
        const y = l.map((g, h) => g - (h % 2 ? r : n));
        m = [a, ...y];
      }
    else
      c === "m" && (s = l[0] + n, i = l[1] + r), m = [a, ...l];
    const f = m.length;
    return a === "z" ? (n = s, r = i) : a === "h" ? n += m[1] : a === "v" ? r += m[1] : (n += m[f - 2], r += m[f - 1]), m;
  });
}, Se = (e, t, n, r) => {
  const [s] = e, i = (p) => Math.round(p * 10 ** 4) / 10 ** 4, o = e.slice(1).map((p) => +p), l = t.slice(1).map((p) => +p), { x1: c, y1: a, x2: m, y2: f, x: y, y: g } = n;
  let h = e;
  const [u, x] = l.slice(-2);
  if ("TQ".includes(s) || (n.qx = null, n.qy = null), ["V", "H", "S", "T", "Z"].includes(s))
    h = [s, ...o];
  else if (s === "L")
    i(y) === i(u) ? h = ["V", x] : i(g) === i(x) && (h = ["H", u]);
  else if (s === "C") {
    const [p, d] = l;
    "CS".includes(r) && (i(p) === i(c * 2 - m) && i(d) === i(a * 2 - f) || i(c) === i(m * 2 - y) && i(a) === i(f * 2 - g)) && (h = ["S", ...l.slice(-4)]), n.x1 = p, n.y1 = d;
  } else if (s === "Q") {
    const [p, d] = l;
    n.qx = p, n.qy = d, "QT".includes(r) && (i(p) === i(c * 2 - m) && i(d) === i(a * 2 - f) || i(c) === i(m * 2 - y) && i(a) === i(f * 2 - g)) && (h = ["T", ...l.slice(-2)]);
  }
  return h;
}, kt = (e, t) => {
  const n = X(e), r = O(n), s = { ...mt }, i = [], o = n.length;
  let l = "", c = "", a = 0, m = 0, f = 0, y = 0;
  for (let u = 0; u < o; u += 1) {
    [l] = n[u], i[u] = l, u && (c = i[u - 1]), n[u] = Se(n[u], r[u], s, c);
    const x = n[u], p = x.length;
    switch (s.x1 = +x[p - 2], s.y1 = +x[p - 1], s.x2 = +x[p - 4] || s.x1, s.y2 = +x[p - 3] || s.y1, l) {
      case "Z":
        a = f, m = y;
        break;
      case "H":
        [, a] = x;
        break;
      case "V":
        [, m] = x;
        break;
      default:
        [a, m] = x.slice(-2).map(Number), l === "M" && (f = a, y = m);
    }
    s.x = a, s.y = m;
  }
  const g = ot(n, t), h = ot(bt(n), t);
  return g.map((u, x) => x ? u.join("").length < h[x].join("").length ? u : h[x] : u);
}, Te = (e) => {
  const t = e.slice(1).map(
    (n, r, s) => r ? [...s[r - 1].slice(-2), ...n.slice(1)] : [...e[0].slice(1), ...n.slice(1)]
  ).map((n) => n.map((r, s) => n[n.length - s - 2 * (1 - s % 2)])).reverse();
  return [["M", ...t[0].slice(0, 2)], ...t.map((n) => ["C", ...n.slice(2)])];
}, st = (e) => {
  const t = X(e), n = t.slice(-1)[0][0] === "Z", r = O(t).map((s, i) => {
    const [o, l] = s.slice(-2).map(Number);
    return {
      seg: t[i],
      n: s,
      c: t[i][0],
      x: o,
      y: l
    };
  }).map((s, i, o) => {
    const l = s.seg, c = s.n, a = i && o[i - 1], m = o[i + 1], f = s.c, y = o.length, g = i ? o[i - 1].x : o[y - 1].x, h = i ? o[i - 1].y : o[y - 1].y;
    let u = [];
    switch (f) {
      case "M":
        u = n ? ["Z"] : [f, g, h];
        break;
      case "A":
        u = [f, ...l.slice(1, -3), l[5] === 1 ? 0 : 1, g, h];
        break;
      case "C":
        m && m.c === "S" ? u = ["S", l[1], l[2], g, h] : u = [f, l[3], l[4], l[1], l[2], g, h];
        break;
      case "S":
        a && "CS".includes(a.c) && (!m || m.c !== "S") ? u = ["C", c[3], c[4], c[1], c[2], g, h] : u = [f, c[1], c[2], g, h];
        break;
      case "Q":
        m && m.c === "T" ? u = ["T", g, h] : u = [f, ...l.slice(1, -2), g, h];
        break;
      case "T":
        a && "QT".includes(a.c) && (!m || m.c !== "T") ? u = ["Q", c[1], c[2], g, h] : u = [f, g, h];
        break;
      case "Z":
        u = ["M", g, h];
        break;
      case "H":
        u = [f, g];
        break;
      case "V":
        u = [f, h];
        break;
      default:
        u = [f, ...l.slice(1, -2), g, h];
    }
    return u;
  });
  return n ? r.reverse() : [r[0], ...r.slice(1).reverse()];
}, Le = (e) => {
  let t = new N();
  const { origin: n } = e, [r, s] = n, { translate: i } = e, { rotate: o } = e, { skew: l } = e, { scale: c } = e;
  return Array.isArray(i) && i.length >= 2 && i.every((a) => !Number.isNaN(+a)) && i.some((a) => a !== 0) ? t = t.translate(...i) : typeof i == "number" && !Number.isNaN(i) && (t = t.translate(i)), (o || l || c) && (t = t.translate(r, s), Array.isArray(o) && o.length >= 2 && o.every((a) => !Number.isNaN(+a)) && o.some((a) => a !== 0) ? t = t.rotate(...o) : typeof o == "number" && !Number.isNaN(o) && (t = t.rotate(o)), Array.isArray(l) && l.length === 2 && l.every((a) => !Number.isNaN(+a)) && l.some((a) => a !== 0) ? (t = l[0] ? t.skewX(l[0]) : t, t = l[1] ? t.skewY(l[1]) : t) : typeof l == "number" && !Number.isNaN(l) && (t = t.skewX(l)), Array.isArray(c) && c.length >= 2 && c.every((a) => !Number.isNaN(+a)) && c.some((a) => a !== 1) ? t = t.scale(...c) : typeof c == "number" && !Number.isNaN(c) && (t = t.scale(c)), t = t.translate(-r, -s)), t;
}, ke = (e, t) => {
  let n = N.Translate(...t.slice(0, -1));
  return [, , , n.m44] = t, n = e.multiply(n), [n.m41, n.m42, n.m43, n.m44];
}, qt = (e, t, n) => {
  const [r, s, i] = n, [o, l, c] = ke(e, [...t, 0, 1]), a = o - r, m = l - s, f = c - i;
  return [
    a * (Math.abs(i) / Math.abs(f) || 1) + r,
    m * (Math.abs(i) / Math.abs(f) || 1) + s
  ];
}, $t = (e, t) => {
  let n = 0, r = 0, s, i, o, l, c, a;
  const m = X(e), f = t && Object.keys(t);
  if (!t || f && !f.length)
    return [...m];
  const y = O(m);
  if (!t.origin) {
    const { origin: M } = at;
    Object.assign(t, { origin: M });
  }
  const g = Le(t), { origin: h } = t, u = { ...mt };
  let x = [], p = 0, d = "", A = [];
  const b = [];
  if (!g.isIdentity) {
    for (s = 0, o = m.length; s < o; s += 1) {
      x = m[s], m[s] && ([d] = x), b[s] = d, d === "A" && (x = rt(y[s], u), m[s] = rt(y[s], u), dt(m, b, s), y[s] = rt(y[s], u), dt(y, b, s), o = Math.max(m.length, y.length)), x = y[s], p = x.length, u.x1 = +x[p - 2], u.y1 = +x[p - 1], u.x2 = +x[p - 4] || u.x1, u.y2 = +x[p - 3] || u.y1;
      const M = {
        s: m[s],
        c: m[s][0],
        x: u.x1,
        y: u.y1
      };
      A = [...A, M];
    }
    return A.map((M) => {
      if (d = M.c, x = M.s, d === "L" || d === "H" || d === "V")
        return [c, a] = qt(g, [M.x, M.y], h), n !== c && r !== a ? x = ["L", c, a] : r === a ? x = ["H", c] : n === c && (x = ["V", a]), n = c, r = a, x;
      for (i = 1, l = x.length; i < l; i += 2)
        [n, r] = qt(g, [+x[i], +x[i + 1]], h), x[i] = n, x[i + 1] = r;
      return x;
    });
  }
  return [...m];
}, qe = (e) => {
  const n = e.slice(0, 2), r = e.slice(2, 4), s = e.slice(4, 6), i = e.slice(6, 8), o = V(n, r, 0.5), l = V(r, s, 0.5), c = V(s, i, 0.5), a = V(o, l, 0.5), m = V(l, c, 0.5), f = V(a, m, 0.5);
  return [
    ["C", ...o, ...a, ...f],
    ["C", ...m, ...c, ...i]
  ];
};
class $e {
  static CSSMatrix = N;
  static getPathBBox = vt;
  static getPathArea = Bt;
  static getTotalLength = Z;
  static getDrawDirection = xe;
  static getPointAtLength = J;
  static pathLengthFactory = ht;
  static getPropertiesAtLength = Nt;
  static getPropertiesAtPoint = ut;
  static polygonLength = se;
  static polygonArea = ne;
  static getClosestPoint = pe;
  static getSegmentOfPoint = de;
  static getSegmentAtLength = be;
  static isPointInStroke = Me;
  static isValidPath = Gt;
  static isPathArray = ct;
  static isAbsoluteArray = Mt;
  static isRelativeArray = Jt;
  static isCurveArray = Ht;
  static isNormalizedArray = At;
  static shapeToPath = ve;
  static parsePathString = R;
  static roundPath = ot;
  static splitPath = Lt;
  static splitCubic = qe;
  static optimizePath = kt;
  static reverseCurve = Te;
  static reversePath = st;
  static normalizePath = O;
  static transformPath = $t;
  static pathToAbsolute = X;
  static pathToRelative = bt;
  static pathToCurve = it;
  static pathToString = j;
  constructor(t, n) {
    const r = n || {}, s = typeof t > "u";
    if (s || !t.length)
      throw TypeError(`${q}: "pathValue" is ${s ? "undefined" : "empty"}`);
    const i = R(t);
    this.segments = i;
    const { width: o, height: l, cx: c, cy: a, cz: m } = this.getBBox(), { round: f, origin: y } = r;
    let g;
    if (f === "auto") {
      const u = `${Math.floor(Math.max(o, l))}`.length;
      g = u >= 4 ? 0 : 4 - u;
    } else
      Number.isInteger(f) || f === "off" ? g = f : g = at.round;
    let h;
    if (Array.isArray(y) && y.length >= 2) {
      const [u, x, p] = y.map(Number);
      h = [
        Number.isNaN(u) ? c : u,
        Number.isNaN(x) ? a : x,
        Number.isNaN(p) ? m : p
      ];
    } else
      h = [c, a, m];
    return this.round = g, this.origin = h, this;
  }
  getBBox() {
    return vt(this.segments);
  }
  getTotalLength() {
    return Z(this.segments);
  }
  getPointAtLength(t) {
    return J(this.segments, t);
  }
  toAbsolute() {
    const { segments: t } = this;
    return this.segments = X(t), this;
  }
  toRelative() {
    const { segments: t } = this;
    return this.segments = bt(t), this;
  }
  toCurve() {
    const { segments: t } = this;
    return this.segments = it(t), this;
  }
  reverse(t) {
    this.toAbsolute();
    const { segments: n } = this, r = Lt(n), s = r.length > 1 ? r : !1, i = s ? [...s].map((l, c) => t ? c ? st(l) : [...l] : st(l)) : [...n];
    let o = [];
    return s ? o = i.flat(1) : o = t ? n : st(n), this.segments = [...o], this;
  }
  normalize() {
    const { segments: t } = this;
    return this.segments = O(t), this;
  }
  optimize() {
    const { segments: t } = this;
    return this.segments = kt(t, this.round), this;
  }
  transform(t) {
    if (!t || typeof t != "object" || typeof t == "object" && !["translate", "rotate", "skew", "scale"].some((c) => c in t))
      return this;
    const {
      segments: n,
      origin: [r, s, i]
    } = this, o = {};
    for (const [c, a] of Object.entries(t))
      c === "skew" && Array.isArray(a) || (c === "rotate" || c === "translate" || c === "origin" || c === "scale") && Array.isArray(a) ? o[c] = a.map(Number) : c !== "origin" && typeof Number(a) == "number" && (o[c] = Number(a));
    const { origin: l } = o;
    if (Array.isArray(l) && l.length >= 2) {
      const [c, a, m] = l.map(Number);
      o.origin = [Number.isNaN(c) ? r : c, Number.isNaN(a) ? s : a, m || i];
    } else
      o.origin = [r, s, i];
    return this.segments = $t(n, o), this;
  }
  flipX() {
    return this.transform({ rotate: [0, 180, 0] }), this;
  }
  flipY() {
    return this.transform({ rotate: [180, 0, 0] }), this;
  }
  toString() {
    return j(this.segments, this.round);
  }
}
export {
  $e as default
};
//# sourceMappingURL=svg-path-commander.mjs.map
