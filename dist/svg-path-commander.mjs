var oe = Object.defineProperty;
var ce = (e, t, n) => t in e ? oe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var M = (e, t, n) => ce(e, typeof t != "symbol" ? t + "" : t, n);
const ht = {
  origin: [0, 0, 0],
  round: 4
}, $ = "SVGPathCommander Error", U = {
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
}, Lt = (e) => {
  let t = e.pathValue[e.segmentStart], n = t.toLowerCase();
  const { data: s } = e;
  for (; s.length >= U[n] && (n === "m" && s.length > 2 ? (e.segments.push([t, ...s.splice(0, 2)]), n = "l", t = t === "m" ? "l" : "L") : e.segments.push([t, ...s.splice(0, U[n])]), !!U[n]); )
    ;
}, le = (e) => {
  const { index: t, pathValue: n } = e, s = n.charCodeAt(t);
  if (s === 48) {
    e.param = 0, e.index += 1;
    return;
  }
  if (s === 49) {
    e.param = 1, e.index += 1;
    return;
  }
  e.err = `${$}: invalid Arc flag "${n[t]}", expecting 0 or 1 at index ${t}`;
}, X = (e) => e >= 48 && e <= 57, Z = "Invalid path value", ae = (e) => {
  const { max: t, pathValue: n, index: s } = e;
  let r = s, i = !1, o = !1, c = !1, a = !1, l;
  if (r >= t) {
    e.err = `${$}: ${Z} at index ${r}, "pathValue" is missing param`;
    return;
  }
  if (l = n.charCodeAt(r), (l === 43 || l === 45) && (r += 1, l = n.charCodeAt(r)), !X(l) && l !== 46) {
    e.err = `${$}: ${Z} at index ${r}, "${n[r]}" is not a number`;
    return;
  }
  if (l !== 46) {
    if (i = l === 48, r += 1, l = n.charCodeAt(r), i && r < t && l && X(l)) {
      e.err = `${$}: ${Z} at index ${s}, "${n[s]}" illegal number`;
      return;
    }
    for (; r < t && X(n.charCodeAt(r)); )
      r += 1, o = !0;
    l = n.charCodeAt(r);
  }
  if (l === 46) {
    for (a = !0, r += 1; X(n.charCodeAt(r)); )
      r += 1, c = !0;
    l = n.charCodeAt(r);
  }
  if (l === 101 || l === 69) {
    if (a && !o && !c) {
      e.err = `${$}: ${Z} at index ${r}, "${n[r]}" invalid float exponent`;
      return;
    }
    if (r += 1, l = n.charCodeAt(r), (l === 43 || l === 45) && (r += 1), r < t && X(n.charCodeAt(r)))
      for (; r < t && X(n.charCodeAt(r)); )
        r += 1;
    else {
      e.err = `${$}: ${Z} at index ${r}, "${n[r]}" invalid integer exponent`;
      return;
    }
  }
  e.index = r, e.param = +e.pathValue.slice(s, r);
}, me = (e) => [
  // Special spaces
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
  // Line terminators
  10,
  13,
  8232,
  8233,
  // White spaces
  32,
  9,
  11,
  12,
  160
].includes(e), V = (e) => {
  const { pathValue: t, max: n } = e;
  for (; e.index < n && me(t.charCodeAt(e.index)); )
    e.index += 1;
}, he = (e) => {
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
}, ue = (e) => X(e) || e === 43 || e === 45 || e === 46, fe = (e) => (e | 32) === 97, ge = (e) => {
  switch (e | 32) {
    case 109:
    case 77:
      return !0;
    default:
      return !1;
  }
}, Dt = (e) => {
  var a;
  const { max: t, pathValue: n, index: s, segments: r } = e, i = n.charCodeAt(s), o = U[n[s].toLowerCase()];
  if (e.segmentStart = s, !he(i)) {
    e.err = `${$}: ${Z} "${n[s]}" is not a path command at index ${s}`;
    return;
  }
  const c = r[r.length - 1];
  if (!ge(i) && ((a = c == null ? void 0 : c[0]) == null ? void 0 : a.toLocaleLowerCase()) === "z") {
    e.err = `${$}: ${Z} "${n[s]}" is not a MoveTo path command at index ${s}`;
    return;
  }
  if (e.index += 1, V(e), e.data = [], !o) {
    Lt(e);
    return;
  }
  for (; ; ) {
    for (let l = o; l > 0; l -= 1) {
      if (fe(i) && (l === 3 || l === 4) ? le(e) : ae(e), e.err.length)
        return;
      e.data.push(e.param), V(e), e.index < t && n.charCodeAt(e.index) === 44 && (e.index += 1, V(e));
    }
    if (e.index >= e.max || !ue(n.charCodeAt(e.index)))
      break;
  }
  Lt(e);
};
class Rt {
  constructor(t) {
    this.segments = [], this.pathValue = t, this.max = t.length, this.index = 0, this.param = 0, this.segmentStart = 0, this.data = [], this.err = "";
  }
}
const G = (e) => Array.isArray(e) && e.every((t) => {
  const n = t[0].toLowerCase();
  return U[n] === t.length - 1 && "achlmqstvz".includes(n) && t.slice(1).every(Number.isFinite);
}) && e.length > 0, Y = (e) => {
  if (G(e))
    return e.slice(0);
  const t = new Rt(e);
  for (V(t); t.index < t.max && !t.err.length; )
    Dt(t);
  if (t.err && t.err.length)
    throw TypeError(t.err);
  return t.segments;
}, ye = (e) => {
  const t = e.length;
  let n = -1, s, r = e[t - 1], i = 0;
  for (; ++n < t; )
    s = r, r = e[n], i += s[1] * r[0] - s[0] * r[1];
  return i / 2;
}, Xt = (e, t) => Math.sqrt((e[0] - t[0]) * (e[0] - t[0]) + (e[1] - t[1]) * (e[1] - t[1])), xe = (e) => e.reduce((t, n, s) => s ? t + Xt(e[s - 1], n) : 0, 0);
var pe = Object.defineProperty, be = (e, t, n) => t in e ? pe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, C = (e, t, n) => be(e, typeof t != "symbol" ? t + "" : t, n);
const de = {
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
}, Zt = (e) => (e instanceof Float64Array || e instanceof Float32Array || Array.isArray(e) && e.every((t) => typeof t == "number")) && [6, 16].some((t) => e.length === t), Yt = (e) => e instanceof DOMMatrix || e instanceof P || typeof e == "object" && Object.keys(de).every((t) => e && t in e), tt = (e) => {
  const t = new P(), n = Array.from(e);
  if (!Zt(n))
    throw TypeError(`CSSMatrix: "${n.join(",")}" must be an array with 6/16 numbers.`);
  if (n.length === 16) {
    const [s, r, i, o, c, a, l, m, u, y, x, f, h, g, p, b] = n;
    t.m11 = s, t.a = s, t.m21 = c, t.c = c, t.m31 = u, t.m41 = h, t.e = h, t.m12 = r, t.b = r, t.m22 = a, t.d = a, t.m32 = y, t.m42 = g, t.f = g, t.m13 = i, t.m23 = l, t.m33 = x, t.m43 = p, t.m14 = o, t.m24 = m, t.m34 = f, t.m44 = b;
  } else if (n.length === 6) {
    const [s, r, i, o, c, a] = n;
    t.m11 = s, t.a = s, t.m12 = r, t.b = r, t.m21 = i, t.c = i, t.m22 = o, t.d = o, t.m41 = c, t.e = c, t.m42 = a, t.f = a;
  }
  return t;
}, Qt = (e) => {
  if (Yt(e))
    return tt([
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
}, Ft = (e) => {
  if (typeof e != "string")
    throw TypeError(`CSSMatrix: "${JSON.stringify(e)}" is not a string.`);
  const t = String(e).replace(/\s/g, "");
  let n = new P();
  const s = `CSSMatrix: invalid transform string "${e}"`;
  return t.split(")").filter((r) => r).forEach((r) => {
    const [i, o] = r.split("(");
    if (!o) throw TypeError(s);
    const c = o.split(",").map((f) => f.includes("rad") ? parseFloat(f) * (180 / Math.PI) : parseFloat(f)), [a, l, m, u] = c, y = [a, l, m], x = [a, l, m, u];
    if (i === "perspective" && a && [l, m].every((f) => f === void 0))
      n.m34 = -1 / a;
    else if (i.includes("matrix") && [6, 16].includes(c.length) && c.every((f) => !Number.isNaN(+f))) {
      const f = c.map((h) => Math.abs(h) < 1e-6 ? 0 : h);
      n = n.multiply(tt(f));
    } else if (i === "translate3d" && y.every((f) => !Number.isNaN(+f)))
      n = n.translate(a, l, m);
    else if (i === "translate" && a && m === void 0)
      n = n.translate(a, l || 0, 0);
    else if (i === "rotate3d" && x.every((f) => !Number.isNaN(+f)) && u)
      n = n.rotateAxisAngle(a, l, m, u);
    else if (i === "rotate" && a && [l, m].every((f) => f === void 0))
      n = n.rotate(0, 0, a);
    else if (i === "scale3d" && y.every((f) => !Number.isNaN(+f)) && y.some((f) => f !== 1))
      n = n.scale(a, l, m);
    else if (i === "scale" && !Number.isNaN(a) && a !== 1 && m === void 0) {
      const f = Number.isNaN(+l) ? a : l;
      n = n.scale(a, f, 1);
    } else if (i === "skew" && (a || !Number.isNaN(a) && l) && m === void 0)
      n = n.skew(a, l || 0);
    else if (["translate", "rotate", "scale", "skew"].some((f) => i.includes(f)) && /[XYZ]/.test(i) && a && [l, m].every((f) => f === void 0))
      if (i === "skewX" || i === "skewY")
        n = n[i](a);
      else {
        const f = i.replace(/[XYZ]/, ""), h = i.replace(f, ""), g = ["X", "Y", "Z"].indexOf(h), p = f === "scale" ? 1 : 0, b = [g === 0 ? a : p, g === 1 ? a : p, g === 2 ? a : p];
        n = n[f](...b);
      }
    else
      throw TypeError(s);
  }), n;
}, dt = (e, t) => t ? [e.a, e.b, e.c, e.d, e.e, e.f] : [
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
], Ht = (e, t, n) => {
  const s = new P();
  return s.m41 = e, s.e = e, s.m42 = t, s.f = t, s.m43 = n, s;
}, Bt = (e, t, n) => {
  const s = new P(), r = Math.PI / 180, i = e * r, o = t * r, c = n * r, a = Math.cos(i), l = -Math.sin(i), m = Math.cos(o), u = -Math.sin(o), y = Math.cos(c), x = -Math.sin(c), f = m * y, h = -m * x;
  s.m11 = f, s.a = f, s.m12 = h, s.b = h, s.m13 = u;
  const g = l * u * y + a * x;
  s.m21 = g, s.c = g;
  const p = a * y - l * u * x;
  return s.m22 = p, s.d = p, s.m23 = -l * m, s.m31 = l * x - a * u * y, s.m32 = l * y + a * u * x, s.m33 = a * m, s;
}, Jt = (e, t, n, s) => {
  const r = new P(), i = Math.sqrt(e * e + t * t + n * n);
  if (i === 0)
    return r;
  const o = e / i, c = t / i, a = n / i, l = s * (Math.PI / 360), m = Math.sin(l), u = Math.cos(l), y = m * m, x = o * o, f = c * c, h = a * a, g = 1 - 2 * (f + h) * y;
  r.m11 = g, r.a = g;
  const p = 2 * (o * c * y + a * m * u);
  r.m12 = p, r.b = p, r.m13 = 2 * (o * a * y - c * m * u);
  const b = 2 * (c * o * y - a * m * u);
  r.m21 = b, r.c = b;
  const v = 1 - 2 * (h + x) * y;
  return r.m22 = v, r.d = v, r.m23 = 2 * (c * a * y + o * m * u), r.m31 = 2 * (a * o * y + c * m * u), r.m32 = 2 * (a * c * y - o * m * u), r.m33 = 1 - 2 * (x + f) * y, r;
}, _t = (e, t, n) => {
  const s = new P();
  return s.m11 = e, s.a = e, s.m22 = t, s.d = t, s.m33 = n, s;
}, ut = (e, t) => {
  const n = new P();
  if (e) {
    const s = e * Math.PI / 180, r = Math.tan(s);
    n.m21 = r, n.c = r;
  }
  if (t) {
    const s = t * Math.PI / 180, r = Math.tan(s);
    n.m12 = r, n.b = r;
  }
  return n;
}, Kt = (e) => ut(e, 0), Ut = (e) => ut(0, e), E = (e, t) => {
  const n = t.m11 * e.m11 + t.m12 * e.m21 + t.m13 * e.m31 + t.m14 * e.m41, s = t.m11 * e.m12 + t.m12 * e.m22 + t.m13 * e.m32 + t.m14 * e.m42, r = t.m11 * e.m13 + t.m12 * e.m23 + t.m13 * e.m33 + t.m14 * e.m43, i = t.m11 * e.m14 + t.m12 * e.m24 + t.m13 * e.m34 + t.m14 * e.m44, o = t.m21 * e.m11 + t.m22 * e.m21 + t.m23 * e.m31 + t.m24 * e.m41, c = t.m21 * e.m12 + t.m22 * e.m22 + t.m23 * e.m32 + t.m24 * e.m42, a = t.m21 * e.m13 + t.m22 * e.m23 + t.m23 * e.m33 + t.m24 * e.m43, l = t.m21 * e.m14 + t.m22 * e.m24 + t.m23 * e.m34 + t.m24 * e.m44, m = t.m31 * e.m11 + t.m32 * e.m21 + t.m33 * e.m31 + t.m34 * e.m41, u = t.m31 * e.m12 + t.m32 * e.m22 + t.m33 * e.m32 + t.m34 * e.m42, y = t.m31 * e.m13 + t.m32 * e.m23 + t.m33 * e.m33 + t.m34 * e.m43, x = t.m31 * e.m14 + t.m32 * e.m24 + t.m33 * e.m34 + t.m34 * e.m44, f = t.m41 * e.m11 + t.m42 * e.m21 + t.m43 * e.m31 + t.m44 * e.m41, h = t.m41 * e.m12 + t.m42 * e.m22 + t.m43 * e.m32 + t.m44 * e.m42, g = t.m41 * e.m13 + t.m42 * e.m23 + t.m43 * e.m33 + t.m44 * e.m43, p = t.m41 * e.m14 + t.m42 * e.m24 + t.m43 * e.m34 + t.m44 * e.m44;
  return tt([n, s, r, i, o, c, a, l, m, u, y, x, f, h, g, p]);
};
class P {
  /**
   * @constructor
   * @param init accepts all parameter configurations:
   * * valid CSS transform string,
   * * CSSMatrix/DOMMatrix instance,
   * * a 6/16 elements *Array*.
   */
  constructor(t) {
    return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.e = 0, this.f = 0, this.m11 = 1, this.m12 = 0, this.m13 = 0, this.m14 = 0, this.m21 = 0, this.m22 = 1, this.m23 = 0, this.m24 = 0, this.m31 = 0, this.m32 = 0, this.m33 = 1, this.m34 = 0, this.m41 = 0, this.m42 = 0, this.m43 = 0, this.m44 = 1, t ? this.setMatrixValue(t) : this;
  }
  /**
   * A `Boolean` whose value is `true` if the matrix is the identity matrix. The identity
   * matrix is one in which every value is 0 except those on the main diagonal from top-left
   * to bottom-right corner (in other words, where the offsets in each direction are equal).
   *
   * @return the current property value
   */
  get isIdentity() {
    return this.m11 === 1 && this.m12 === 0 && this.m13 === 0 && this.m14 === 0 && this.m21 === 0 && this.m22 === 1 && this.m23 === 0 && this.m24 === 0 && this.m31 === 0 && this.m32 === 0 && this.m33 === 1 && this.m34 === 0 && this.m41 === 0 && this.m42 === 0 && this.m43 === 0 && this.m44 === 1;
  }
  /**
   * A `Boolean` flag whose value is `true` if the matrix was initialized as a 2D matrix
   * and `false` if the matrix is 3D.
   *
   * @return the current property value
   */
  get is2D() {
    return this.m31 === 0 && this.m32 === 0 && this.m33 === 1 && this.m34 === 0 && this.m43 === 0 && this.m44 === 1;
  }
  /**
   * The `setMatrixValue` method replaces the existing matrix with one computed
   * in the browser. EG: `matrix(1,0.25,-0.25,1,0,0)`
   *
   * The method accepts any *Array* values, the result of
   * `DOMMatrix` instance method `toFloat64Array()` / `toFloat32Array()` calls
   * or `CSSMatrix` instance method `toArray()`.
   *
   * This method expects valid *matrix()* / *matrix3d()* string values, as well
   * as other transform functions like *translateX(10px)*.
   *
   * @param source
   * @return the matrix instance
   */
  setMatrixValue(t) {
    return typeof t == "string" && t.length && t !== "none" ? Ft(t) : Array.isArray(t) || t instanceof Float64Array || t instanceof Float32Array ? tt(t) : typeof t == "object" ? Qt(t) : this;
  }
  /**
   * Returns a *Float32Array* containing elements which comprise the matrix.
   * The method can return either the 16 elements or the 6 elements
   * depending on the value of the `is2D` parameter.
   *
   * @param is2D *Array* representation of the matrix
   * @return an *Array* representation of the matrix
   */
  toFloat32Array(t) {
    return Float32Array.from(dt(this, t));
  }
  /**
   * Returns a *Float64Array* containing elements which comprise the matrix.
   * The method can return either the 16 elements or the 6 elements
   * depending on the value of the `is2D` parameter.
   *
   * @param is2D *Array* representation of the matrix
   * @return an *Array* representation of the matrix
   */
  toFloat64Array(t) {
    return Float64Array.from(dt(this, t));
  }
  /**
   * Creates and returns a string representation of the matrix in `CSS` matrix syntax,
   * using the appropriate `CSS` matrix notation.
   *
   * matrix3d *matrix3d(m11, m12, m13, m14, m21, ...)*
   * matrix *matrix(a, b, c, d, e, f)*
   *
   * @return a string representation of the matrix
   */
  toString() {
    const { is2D: t } = this, n = this.toFloat64Array(t).join(", ");
    return `${t ? "matrix" : "matrix3d"}(${n})`;
  }
  /**
   * Returns a JSON representation of the `CSSMatrix` instance, a standard *Object*
   * that includes `{a,b,c,d,e,f}` and `{m11,m12,m13,..m44}` properties as well
   * as the `is2D` & `isIdentity` properties.
   *
   * The result can also be used as a second parameter for the `fromMatrix` static method
   * to load values into another matrix instance.
   *
   * @return an *Object* with all matrix values.
   */
  toJSON() {
    const { is2D: t, isIdentity: n } = this;
    return { ...this, is2D: t, isIdentity: n };
  }
  /**
   * The Multiply method returns a new CSSMatrix which is the result of this
   * matrix multiplied by the passed matrix, with the passed matrix to the right.
   * This matrix is not modified.
   *
   * @param m2 CSSMatrix
   * @return The resulted matrix.
   */
  multiply(t) {
    return E(this, t);
  }
  /**
   * The translate method returns a new matrix which is this matrix post
   * multiplied by a translation matrix containing the passed values. If the z
   * component is undefined, a 0 value is used in its place. This matrix is not
   * modified.
   *
   * @param x X component of the translation value.
   * @param y Y component of the translation value.
   * @param z Z component of the translation value.
   * @return The resulted matrix
   */
  translate(t, n, s) {
    const r = t;
    let i = n, o = s;
    return typeof i > "u" && (i = 0), typeof o > "u" && (o = 0), E(this, Ht(r, i, o));
  }
  /**
   * The scale method returns a new matrix which is this matrix post multiplied by
   * a scale matrix containing the passed values. If the z component is undefined,
   * a 1 value is used in its place. If the y component is undefined, the x
   * component value is used in its place. This matrix is not modified.
   *
   * @param x The X component of the scale value.
   * @param y The Y component of the scale value.
   * @param z The Z component of the scale value.
   * @return The resulted matrix
   */
  scale(t, n, s) {
    const r = t;
    let i = n, o = s;
    return typeof i > "u" && (i = t), typeof o > "u" && (o = 1), E(this, _t(r, i, o));
  }
  /**
   * The rotate method returns a new matrix which is this matrix post multiplied
   * by each of 3 rotation matrices about the major axes, first X, then Y, then Z.
   * If the y and z components are undefined, the x value is used to rotate the
   * object about the z axis, as though the vector (0,0,x) were passed. All
   * rotation values are in degrees. This matrix is not modified.
   *
   * @param rx The X component of the rotation, or Z if Y and Z are null.
   * @param ry The (optional) Y component of the rotation value.
   * @param rz The (optional) Z component of the rotation value.
   * @return The resulted matrix
   */
  rotate(t, n, s) {
    let r = t, i = n || 0, o = s || 0;
    return typeof t == "number" && typeof n > "u" && typeof s > "u" && (o = r, r = 0, i = 0), E(this, Bt(r, i, o));
  }
  /**
   * The rotateAxisAngle method returns a new matrix which is this matrix post
   * multiplied by a rotation matrix with the given axis and `angle`. The right-hand
   * rule is used to determine the direction of rotation. All rotation values are
   * in degrees. This matrix is not modified.
   *
   * @param x The X component of the axis vector.
   * @param y The Y component of the axis vector.
   * @param z The Z component of the axis vector.
   * @param angle The angle of rotation about the axis vector, in degrees.
   * @return The resulted matrix
   */
  rotateAxisAngle(t, n, s, r) {
    if ([t, n, s, r].some((i) => Number.isNaN(+i)))
      throw new TypeError("CSSMatrix: expecting 4 values");
    return E(this, Jt(t, n, s, r));
  }
  /**
   * Specifies a skew transformation along the `x-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param angle The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skewX(t) {
    return E(this, Kt(t));
  }
  /**
   * Specifies a skew transformation along the `y-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param angle The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skewY(t) {
    return E(this, Ut(t));
  }
  /**
   * Specifies a skew transformation along both the `x-axis` and `y-axis`.
   * This matrix is not modified.
   *
   * @param angleX The X-angle amount in degrees to skew.
   * @param angleY The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skew(t, n) {
    return E(this, ut(t, n));
  }
  /**
   * Transforms a specified vector using the matrix, returning a new
   * {x,y,z,w} Tuple *Object* comprising the transformed vector.
   * Neither the matrix nor the original vector are altered.
   *
   * The method is equivalent with `transformPoint()` method
   * of the `DOMMatrix` constructor.
   *
   * @param t Tuple with `{x,y,z,w}` components
   * @return the resulting Tuple
   */
  transformPoint(t) {
    const n = this.m11 * t.x + this.m21 * t.y + this.m31 * t.z + this.m41 * t.w, s = this.m12 * t.x + this.m22 * t.y + this.m32 * t.z + this.m42 * t.w, r = this.m13 * t.x + this.m23 * t.y + this.m33 * t.z + this.m43 * t.w, i = this.m14 * t.x + this.m24 * t.y + this.m34 * t.z + this.m44 * t.w;
    return t instanceof DOMPoint ? new DOMPoint(n, s, r, i) : {
      x: n,
      y: s,
      z: r,
      w: i
    };
  }
}
C(P, "Translate", Ht), C(P, "Rotate", Bt), C(P, "RotateAxisAngle", Jt), C(P, "Scale", _t), C(P, "SkewX", Kt), C(P, "SkewY", Ut), C(P, "Skew", ut), C(P, "Multiply", E), C(P, "fromArray", tt), C(P, "fromMatrix", Qt), C(P, "fromString", Ft), C(P, "toArray", dt), C(P, "isCompatibleArray", Zt), C(P, "isCompatibleObject", Yt);
const ft = (e) => G(e) && // `isPathArray` also checks if it's `Array`
e.every(([t]) => t === t.toUpperCase()), H = (e) => {
  if (ft(e))
    return e.slice(0);
  const t = Y(e);
  let n = 0, s = 0, r = 0, i = 0;
  return t.map((o) => {
    const c = o.slice(1).map(Number), [a] = o, l = a.toUpperCase();
    if (a === "M")
      return [n, s] = c, r = n, i = s, ["M", n, s];
    let m = [];
    if (a !== l)
      if (l === "A")
        m = [
          l,
          c[0],
          c[1],
          c[2],
          c[3],
          c[4],
          c[5] + n,
          c[6] + s
        ];
      else if (l === "V")
        m = [l, c[0] + s];
      else if (l === "H")
        m = [l, c[0] + n];
      else {
        const u = c.map((y, x) => y + (x % 2 ? s : n));
        m = [l, ...u];
      }
    else
      m = [l, ...c];
    return l === "Z" ? (n = r, s = i) : l === "H" ? [, n] = m : l === "V" ? [, s] = m : ([n, s] = m.slice(-2), l === "M" && (r = n, i = s)), m;
  });
}, Me = (e, t) => {
  const [n] = e, { x1: s, y1: r, x2: i, y2: o } = t, c = e.slice(1).map(Number);
  let a = e;
  if ("TQ".includes(n) || (t.qx = null, t.qy = null), n === "H")
    a = ["L", e[1], r];
  else if (n === "V")
    a = ["L", s, e[1]];
  else if (n === "S") {
    const l = s * 2 - i, m = r * 2 - o;
    t.x1 = l, t.y1 = m, a = ["C", l, m, ...c];
  } else if (n === "T") {
    const l = s * 2 - (t.qx ? t.qx : (
      /* istanbul ignore next */
      0
    )), m = r * 2 - (t.qy ? t.qy : (
      /* istanbul ignore next */
      0
    ));
    t.qx = l, t.qy = m, a = ["Q", l, m, ...c];
  } else if (n === "Q") {
    const [l, m] = c;
    t.qx = l, t.qy = m;
  }
  return a;
}, gt = (e) => ft(e) && e.every(([t]) => "ACLMQZ".includes(t)), et = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  x: 0,
  y: 0,
  qx: null,
  qy: null
}, O = (e) => {
  if (gt(e))
    return e.slice(0);
  const t = H(e), n = { ...et }, s = t.length;
  for (let r = 0; r < s; r += 1) {
    t[r], t[r] = Me(t[r], n);
    const i = t[r], o = i.length;
    n.x1 = +i[o - 2], n.y1 = +i[o - 1], n.x2 = +i[o - 4] || n.x1, n.y2 = +i[o - 3] || n.y1;
  }
  return t;
}, z = (e, t, n) => {
  const [s, r] = e, [i, o] = t;
  return [s + (i - s) * n, r + (o - r) * n];
}, Mt = (e, t, n, s, r) => {
  const { min: i, max: o } = Math;
  let c = { x: 0, y: 0 };
  const a = () => Xt([e, t], [n, s]);
  if (typeof r == "number") {
    const l = a();
    if (r <= 0)
      c = { x: e, y: t };
    else if (r >= l)
      c = { x: n, y: s };
    else {
      const [m, u] = z([e, t], [n, s], r / l);
      c = { x: m, y: u };
    }
  }
  return {
    point: c,
    get length() {
      return a();
    },
    get bbox() {
      return {
        min: {
          x: i(e, n),
          y: i(t, s)
        },
        max: {
          x: o(e, n),
          y: o(t, s)
        }
      };
    }
  };
}, Ne = (e, t, n) => {
  const s = n / 2, r = Math.sin(s), i = Math.cos(s), o = e ** 2 * r ** 2, c = t ** 2 * i ** 2, a = Math.sqrt(o + c) * n;
  return Math.abs(a);
}, we = (e, t, n, s, r, i, o) => {
  const { cos: c, sin: a, min: l, max: m } = Math, u = c(r), y = a(r), x = (v) => e + n * c(v) * u - s * a(v) * y, f = (v) => t + s * a(v) * u + n * c(v) * y, h = x(i), g = f(i), p = x(o), b = f(o);
  return {
    min: { x: l(h, p), y: l(g, b) },
    max: { x: m(h, p), y: m(g, b) }
  };
}, $t = (e, t) => {
  const { x: n, y: s } = e, { x: r, y: i } = t, o = n * r + s * i, c = Math.sqrt((n ** 2 + s ** 2) * (r ** 2 + i ** 2));
  return (n * i - s * r < 0 ? -1 : 1) * Math.acos(o / c);
}, ve = (e, t, n, s, r, i, o, c, a, l) => {
  const { abs: m, sin: u, cos: y, sqrt: x, PI: f } = Math;
  let h = m(n), g = m(s);
  const b = (r % 360 + 360) % 360 * (f / 180);
  if (e === c && t === a)
    return {
      point: { x: c, y: a },
      length: 0,
      bbox: { min: { x: c, y: a }, max: { x: c, y: a } }
    };
  if (h === 0 || g === 0)
    return Mt(e, t, c, a, l);
  const v = (e - c) / 2, d = (t - a) / 2, w = {
    x: y(b) * v + u(b) * d,
    y: -u(b) * v + y(b) * d
  }, T = w.x ** 2 / h ** 2 + w.y ** 2 / g ** 2;
  T > 1 && (h *= x(T), g *= x(T));
  const j = h ** 2 * g ** 2 - h ** 2 * w.y ** 2 - g ** 2 * w.x ** 2, B = h ** 2 * w.y ** 2 + g ** 2 * w.x ** 2;
  let Q = j / B;
  Q = Q < 0 ? 0 : Q;
  const nt = (i !== o ? 1 : -1) * x(Q), q = {
    x: nt * (h * w.y / g),
    y: nt * (-(g * w.x) / h)
  }, D = {
    x: y(b) * q.x - u(b) * q.y + (e + c) / 2,
    y: u(b) * q.x + y(b) * q.y + (t + a) / 2
  }, J = {
    x: (w.x - q.x) / h,
    y: (w.y - q.y) / g
  }, I = $t({ x: 1, y: 0 }, J), st = {
    x: (-w.x - q.x) / h,
    y: (-w.y - q.y) / g
  };
  let L = $t(J, st);
  !o && L > 0 ? L -= 2 * f : o && L < 0 && (L += 2 * f), L %= 2 * f;
  const S = I + L * (l || 0), rt = I + L, _ = h * y(S), K = g * u(S);
  return {
    point: {
      x: y(b) * _ - u(b) * K + D.x,
      y: u(b) * _ + y(b) * K + D.y
    },
    center: D,
    angle: S,
    startAngle: I,
    endAngle: rt,
    radiusX: h,
    radiusY: g,
    get length() {
      return Ne(h, g, L);
    },
    get bbox() {
      return we(D.x, D.y, h, g, b, I, I + L);
    }
  };
}, Pe = { x: 0, y: 0 }, kt = [
  -0.06405689286260563,
  0.06405689286260563,
  -0.1911188674736163,
  0.1911188674736163,
  -0.3150426796961634,
  0.3150426796961634,
  -0.4337935076260451,
  0.4337935076260451,
  -0.5454214713888396,
  0.5454214713888396,
  -0.6480936519369755,
  0.6480936519369755,
  -0.7401241915785544,
  0.7401241915785544,
  -0.820001985973903,
  0.820001985973903,
  -0.8864155270044011,
  0.8864155270044011,
  -0.9382745520027328,
  0.9382745520027328,
  -0.9747285559713095,
  0.9747285559713095,
  -0.9951872199970213,
  0.9951872199970213
], Ae = [
  0.12793819534675216,
  0.12793819534675216,
  0.1258374563468283,
  0.1258374563468283,
  0.12167047292780339,
  0.12167047292780339,
  0.1155056680537256,
  0.1155056680537256,
  0.10744427011596563,
  0.10744427011596563,
  0.09761865210411388,
  0.09761865210411388,
  0.08619016153195327,
  0.08619016153195327,
  0.0733464814110803,
  0.0733464814110803,
  0.05929858491543678,
  0.05929858491543678,
  0.04427743881741981,
  0.04427743881741981,
  0.028531388628933663,
  0.028531388628933663,
  0.0123412297999872,
  0.0123412297999872
], Ce = (e) => {
  const t = [];
  for (let n = e, s = n.length, r = s - 1; s > 1; s -= 1, r -= 1) {
    const i = [];
    for (let o = 0; o < r; o += 1)
      i.push({
        x: r * (n[o + 1].x - n[o].x),
        y: r * (n[o + 1].y - n[o].y),
        t: 0
      });
    t.push(i), n = i;
  }
  return t;
}, Te = (e, t) => {
  if (t === 0)
    return e[0].t = 0, e[0];
  const n = e.length - 1;
  if (t === 1)
    return e[n].t = 1, e[n];
  const s = 1 - t;
  let r = e;
  if (n === 0)
    return e[0].t = t, e[0];
  if (n === 1)
    return {
      x: s * r[0].x + t * r[1].x,
      y: s * r[0].y + t * r[1].y,
      t
    };
  const i = s * s, o = t * t;
  let c = 0, a = 0, l = 0, m = 0;
  return n === 2 ? (r = [r[0], r[1], r[2], Pe], c = i, a = s * t * 2, l = o) : n === 3 && (c = i * s, a = i * t * 3, l = s * o * 3, m = t * o), {
    x: c * r[0].x + a * r[1].x + l * r[2].x + m * r[3].x,
    y: c * r[0].y + a * r[1].y + l * r[2].y + m * r[3].y,
    t
  };
}, Le = (e, t) => {
  const n = e(t), s = n.x * n.x + n.y * n.y;
  return Math.sqrt(s);
}, $e = (e) => {
  const n = kt.length;
  let s = 0;
  for (let r = 0, i; r < n; r++)
    i = 0.5 * kt[r] + 0.5, s += Ae[r] * Le(e, i);
  return 0.5 * s;
}, Vt = (e) => {
  const t = [];
  for (let s = 0, r = e.length, i = 2; s < r; s += i)
    t.push({
      x: e[s],
      y: e[s + 1]
    });
  const n = Ce(t);
  return $e((s) => Te(n[0], s));
}, ke = 1e-8, Nt = (e) => {
  const t = Math.min(e[0], e[2]), n = Math.max(e[0], e[2]);
  if (e[1] >= e[0] ? e[2] >= e[1] : e[2] <= e[1])
    return [t, n];
  const s = (e[0] * e[2] - e[1] * e[1]) / (e[0] - 2 * e[1] + e[2]);
  return s < t ? [s, n] : [t, s];
}, qt = (e) => {
  const t = e[0] - 3 * e[1] + 3 * e[2] - e[3];
  if (Math.abs(t) < ke)
    return e[0] === e[3] && e[0] === e[1] ? [e[0], e[3]] : Nt([e[0], -0.5 * e[0] + 1.5 * e[1], e[0] - 3 * e[1] + 3 * e[2]]);
  const n = -e[0] * e[2] + e[0] * e[3] - e[1] * e[2] - e[1] * e[3] + e[1] * e[1] + e[2] * e[2];
  if (n <= 0)
    return [Math.min(e[0], e[3]), Math.max(e[0], e[3])];
  const s = Math.sqrt(n);
  let r = Math.min(e[0], e[3]), i = Math.max(e[0], e[3]);
  const o = e[0] - 2 * e[1] + e[2];
  for (let c = (o + s) / t, a = 1; a <= 2; c = (o - s) / t, a++)
    if (c > 0 && c < 1) {
      const l = e[0] * (1 - c) * (1 - c) * (1 - c) + e[1] * 3 * (1 - c) * (1 - c) * c + e[2] * 3 * (1 - c) * c * c + e[3] * c * c * c;
      l < r && (r = l), l > i && (i = l);
    }
  return [r, i];
}, qe = ([e, t, n, s, r, i, o, c], a) => {
  const l = 1 - a;
  return {
    x: l ** 3 * e + 3 * l ** 2 * a * n + 3 * l * a ** 2 * r + a ** 3 * o,
    y: l ** 3 * t + 3 * l ** 2 * a * s + 3 * l * a ** 2 * i + a ** 3 * c
  };
}, Se = (e, t, n, s, r, i, o, c, a) => {
  const l = typeof a == "number";
  let m = { x: e, y: t };
  const u = () => Vt([e, t, n, s, r, i, o, c]);
  if (l) {
    const y = u();
    a <= 0 || (a >= y ? m = { x: o, y: c } : m = qe([e, t, n, s, r, i, o, c], a / y));
  }
  return {
    point: m,
    get length() {
      return u();
    },
    get bbox() {
      const y = qt([e, n, r, o]), x = qt([t, s, i, c]);
      return {
        min: { x: y[0], y: x[0] },
        max: { x: y[1], y: x[1] }
      };
    }
  };
}, Ee = ([e, t, n, s, r, i], o) => {
  const c = 1 - o;
  return {
    x: c ** 2 * e + 2 * c * o * n + o ** 2 * r,
    y: c ** 2 * t + 2 * c * o * s + o ** 2 * i
  };
}, ze = (e, t, n, s, r, i, o) => {
  const c = typeof o == "number";
  let a = { x: e, y: t };
  const l = () => Vt([e, t, n, s, r, i]);
  if (c) {
    const m = l();
    o <= 0 || (o >= m ? a = { x: r, y: i } : a = Ee([e, t, n, s, r, i], o / m));
  }
  return {
    point: a,
    get length() {
      return l();
    },
    get bbox() {
      const m = Nt([e, n, r]), u = Nt([t, s, i]);
      return {
        min: { x: m[0], y: u[0] },
        max: { x: m[1], y: u[1] }
      };
    }
  };
}, wt = 1e-5, yt = (e, t) => {
  const n = O(e), s = typeof t == "number";
  let r = !1, i = [], o = "M", c = 0, a = 0, l = 0, m = 0, u = n[0];
  const y = [], x = [];
  let f = { x: 0, y: 0 }, h = { x: 0, y: 0 }, g = f, p = 0, b = {
    point: { x: 0, y: 0 },
    length: 0,
    bbox: {
      min: { x: 0, y: 0 },
      max: { x: 0, y: 0 }
    }
  };
  for (let v = 0, d = n.length; v < d; v += 1)
    u = n[v], [o] = u, r = o === "M", i = r ? i : [c, a, ...u.slice(1)], s && t < wt && (g = f), r ? ([, l, m] = u, f = { x: l, y: m }, h = { x: l, y: m }, b = {
      point: f,
      length: 0,
      bbox: { min: f, max: h }
    }) : o === "L" ? b = Mt(
      ...i,
      s ? t - p : void 0
    ) : o === "A" ? b = ve(
      ...i,
      s ? t - p : void 0
    ) : o === "C" ? b = Se(
      ...i,
      s ? t - p : void 0
    ) : o === "Q" ? b = ze(
      ...i,
      s ? t - p : void 0
    ) : o === "Z" && (i = [c, a, l, m], b = Mt(
      ...i,
      s ? t - p : void 0
    )), s && p < t && p + b.length >= t && (g = b.point), y.push(b.bbox.min), x.push(b.bbox.max), p += b.length, [c, a] = o !== "Z" ? u.slice(-2) : [l, m];
  return s && t > p - wt && (g = { x: c, y: a }), {
    point: g,
    length: p,
    get bbox() {
      return {
        min: {
          x: Math.min(...y.map((v) => v.x)),
          y: Math.min(...y.map((v) => v.y))
        },
        max: {
          x: Math.max(...x.map((v) => v.x)),
          y: Math.max(...x.map((v) => v.y))
        }
      };
    }
  };
}, St = (e) => {
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
  const t = yt(e), {
    min: { x: n, y: s },
    max: { x: r, y: i }
  } = t.bbox, o = r - n, c = i - s;
  return {
    width: o,
    height: c,
    x: n,
    y: s,
    x2: r,
    y2: i,
    cx: n + o / 2,
    cy: s + c / 2,
    // an estimted guess
    cz: Math.max(o, c) + Math.min(o, c) / 2
  };
}, vt = (e, t, n) => {
  if (e[n].length > 7) {
    e[n].shift();
    const s = e[n];
    let r = n;
    for (; s.length; )
      t[n] = "A", e.splice(r += 1, 0, ["C", ...s.splice(0, 6)]);
    e.splice(n, 1);
  }
}, Wt = (e) => gt(e) && e.every(([t]) => "MC".includes(t)), it = (e, t, n) => {
  const s = e * Math.cos(n) - t * Math.sin(n), r = e * Math.sin(n) + t * Math.cos(n);
  return { x: s, y: r };
}, Gt = (e, t, n, s, r, i, o, c, a, l) => {
  let m = e, u = t, y = n, x = s, f = c, h = a;
  const g = Math.PI * 120 / 180, p = Math.PI / 180 * (+r || 0);
  let b = [], v, d, w, T, j;
  if (l)
    [d, w, T, j] = l;
  else {
    v = it(m, u, -p), m = v.x, u = v.y, v = it(f, h, -p), f = v.x, h = v.y;
    const A = (m - f) / 2, k = (u - h) / 2;
    let R = A * A / (y * y) + k * k / (x * x);
    R > 1 && (R = Math.sqrt(R), y *= R, x *= R);
    const pt = y * y, bt = x * x, Tt = (i === o ? -1 : 1) * Math.sqrt(Math.abs((pt * bt - pt * k * k - bt * A * A) / (pt * k * k + bt * A * A)));
    T = Tt * y * k / x + (m + f) / 2, j = Tt * -x * A / y + (u + h) / 2, d = Math.asin(((u - j) / x * 10 ** 9 >> 0) / 10 ** 9), w = Math.asin(((h - j) / x * 10 ** 9 >> 0) / 10 ** 9), d = m < T ? Math.PI - d : d, w = f < T ? Math.PI - w : w, d < 0 && (d = Math.PI * 2 + d), w < 0 && (w = Math.PI * 2 + w), o && d > w && (d -= Math.PI * 2), !o && w > d && (w -= Math.PI * 2);
  }
  let B = w - d;
  if (Math.abs(B) > g) {
    const A = w, k = f, R = h;
    w = d + g * (o && w > d ? 1 : -1), f = T + y * Math.cos(w), h = j + x * Math.sin(w), b = Gt(f, h, y, x, r, 0, o, k, R, [w, A, T, j]);
  }
  B = w - d;
  const Q = Math.cos(d), nt = Math.sin(d), q = Math.cos(w), D = Math.sin(w), J = Math.tan(B / 4), I = 4 / 3 * y * J, st = 4 / 3 * x * J, L = [m, u], S = [m + I * nt, u - st * Q], rt = [f + I * D, h - st * q], _ = [f, h];
  if (S[0] = 2 * L[0] - S[0], S[1] = 2 * L[1] - S[1], l)
    return [...S, ...rt, ..._, ...b];
  b = [...S, ...rt, ..._, ...b];
  const K = [];
  for (let A = 0, k = b.length; A < k; A += 1)
    K[A] = A % 2 ? it(b[A - 1], b[A], p).y : it(b[A], b[A + 1], p).x;
  return K;
}, Oe = (e, t, n, s, r, i) => {
  const o = 0.3333333333333333, c = 2 / 3;
  return [
    o * e + c * n,
    // cpx1
    o * t + c * s,
    // cpy1
    o * r + c * n,
    // cpx2
    o * i + c * s,
    // cpy2
    r,
    i
    // x,y
  ];
}, Et = (e, t, n, s) => {
  const r = z([e, t], [n, s], 0.3333333333333333), i = z([e, t], [n, s], 2 / 3);
  return [...r, ...i, n, s];
}, ct = (e, t) => {
  const [n] = e, s = e.slice(1).map(Number), [r, i] = s;
  let o;
  const { x1: c, y1: a, x: l, y: m } = t;
  return "TQ".includes(n) || (t.qx = null, t.qy = null), n === "M" ? (t.x = r, t.y = i, e) : n === "A" ? (o = [c, a, ...s], ["C", ...Gt(...o)]) : n === "Q" ? (t.qx = r, t.qy = i, o = [c, a, ...s], ["C", ...Oe(...o)]) : n === "L" ? ["C", ...Et(c, a, r, i)] : n === "Z" ? ["C", ...Et(c, a, l, m)] : e;
}, lt = (e) => {
  if (Wt(e))
    return e.slice(0);
  const t = O(e), n = { ...et }, s = [];
  let r = "", i = t.length;
  for (let o = 0; o < i; o += 1) {
    [r] = t[o], s[o] = r, t[o] = ct(t[o], n), vt(t, s, o), i = t.length;
    const c = t[o], a = c.length;
    n.x1 = +c[a - 2], n.y1 = +c[a - 1], n.x2 = +c[a - 4] || n.x1, n.y2 = +c[a - 3] || n.y1;
  }
  return t;
}, je = (e, t, n, s, r, i, o, c) => 3 * ((c - t) * (n + r) - (o - e) * (s + i) + s * (e - r) - n * (t - i) + c * (r + e / 3) - o * (i + t / 3)) / 20, te = (e) => {
  let t = 0, n = 0, s = 0;
  return lt(e).map((r) => {
    switch (r[0]) {
      case "M":
        return [, t, n] = r, 0;
      default:
        return s = je(t, n, ...r.slice(1)), [t, n] = r.slice(-2), s;
    }
  }).reduce((r, i) => r + i, 0);
}, F = (e) => yt(e).length, Ie = (e) => te(lt(e)) >= 0, W = (e, t) => yt(e, t).point, Ct = (e, t) => {
  const n = Y(e);
  let s = n.slice(0), r = F(s), i = s.length - 1, o = 0, c = 0, a = n[0];
  const [l, m] = a.slice(-2), u = { x: l, y: m };
  if (i <= 0 || !t || !Number.isFinite(t))
    return {
      segment: a,
      index: 0,
      length: c,
      point: u,
      lengthAtSegment: o
    };
  if (t >= r)
    return s = n.slice(0, -1), o = F(s), c = r - o, {
      segment: n[i],
      index: i,
      length: c,
      lengthAtSegment: o
    };
  const y = [];
  for (; i > 0; )
    a = s[i], s = s.slice(0, -1), o = F(s), c = r - o, r = o, y.push({
      segment: a,
      index: i,
      length: c,
      lengthAtSegment: o
    }), i -= 1;
  return y.find(({ lengthAtSegment: x }) => x <= t);
}, xt = (e, t) => {
  const n = Y(e), s = O(n), r = F(n), i = (d) => {
    const w = d.x - t.x, T = d.y - t.y;
    return w * w + T * T;
  };
  let o = 8, c, a = { x: 0, y: 0 }, l = 0, m = 0, u = 1 / 0;
  for (let d = 0; d <= r; d += o)
    c = W(s, d), l = i(c), l < u && (a = c, m = d, u = l);
  o /= 2;
  let y, x, f = 0, h = 0, g = 0, p = 0;
  for (; o > 1e-6 && (f = m - o, y = W(s, f), g = i(y), h = m + o, x = W(s, h), p = i(x), f >= 0 && g < u ? (a = y, m = f, u = g) : h <= r && p < u ? (a = x, m = h, u = p) : o /= 2, !(o < 1e-5)); )
    ;
  const b = Ct(n, m), v = Math.sqrt(u);
  return { closest: a, distance: v, segment: b };
}, De = (e, t) => xt(e, t).closest, Re = (e, t) => xt(e, t).segment, Xe = (e, t) => Ct(e, t).segment, Ze = (e, t) => {
  const { distance: n } = xt(e, t);
  return Math.abs(n) < wt;
}, ee = (e) => {
  if (typeof e != "string" || !e.length)
    return !1;
  const t = new Rt(e);
  for (V(t); t.index < t.max && !t.err.length; )
    Dt(t);
  return !t.err.length && "mM".includes(t.segments[0][0]);
}, ne = (e) => G(e) && // `isPathArray` checks if it's `Array`
e.slice(1).every(([t]) => t === t.toLowerCase()), at = {
  line: ["x1", "y1", "x2", "y2"],
  circle: ["cx", "cy", "r"],
  ellipse: ["cx", "cy", "rx", "ry"],
  rect: ["width", "height", "x", "y", "rx", "ry"],
  polygon: ["points"],
  polyline: ["points"],
  glyph: ["d"]
}, Ye = (e) => {
  let { x1: t, y1: n, x2: s, y2: r } = e;
  return [t, n, s, r] = [t, n, s, r].map((i) => +i), [
    ["M", t, n],
    ["L", s, r]
  ];
}, Qe = (e) => {
  const t = [], n = (e.points || "").trim().split(/[\s|,]/).map((r) => +r);
  let s = 0;
  for (; s < n.length; )
    t.push([s ? "L" : "M", n[s], n[s + 1]]), s += 2;
  return e.type === "polygon" ? [...t, ["z"]] : t;
}, Fe = (e) => {
  let { cx: t, cy: n, r: s } = e;
  return [t, n, s] = [t, n, s].map((r) => +r), [
    ["M", t - s, n],
    ["a", s, s, 0, 1, 0, 2 * s, 0],
    ["a", s, s, 0, 1, 0, -2 * s, 0]
  ];
}, He = (e) => {
  let { cx: t, cy: n } = e, s = e.rx || 0, r = e.ry || s;
  return [t, n, s, r] = [t, n, s, r].map((i) => +i), [
    ["M", t - s, n],
    ["a", s, r, 0, 1, 0, 2 * s, 0],
    ["a", s, r, 0, 1, 0, -2 * s, 0]
  ];
}, Be = (e) => {
  const t = +e.x || 0, n = +e.y || 0, s = +e.width, r = +e.height;
  let i = +(e.rx || 0), o = +(e.ry || i);
  return i || o ? (i * 2 > s && (i -= (i * 2 - s) / 2), o * 2 > r && (o -= (o * 2 - r) / 2), [
    ["M", t + i, n],
    ["h", s - i * 2],
    ["s", i, 0, i, o],
    ["v", r - o * 2],
    ["s", 0, o, -i, o],
    ["h", -s + i * 2],
    ["s", -i, 0, -i, -o],
    ["v", -r + o * 2],
    ["s", 0, -o, i, -o]
  ]) : [["M", t, n], ["h", s], ["v", r], ["H", t], ["Z"]];
}, se = (e, t) => {
  const s = (t || document).defaultView || /* istanbul ignore next */
  window, r = Object.keys(at), i = e instanceof s.SVGElement, o = i ? e.tagName : null;
  if (o && [...r, "path"].every((u) => o !== u))
    throw TypeError(`${$}: "${o}" is not SVGElement`);
  const c = i ? o : e.type, a = at[c], l = { type: c };
  i ? a.forEach((u) => {
    l[u] = e.getAttribute(u);
  }) : Object.assign(l, e);
  let m = [];
  return c === "circle" ? m = Fe(l) : c === "ellipse" ? m = He(l) : ["polyline", "polygon"].includes(c) ? m = Qe(l) : c === "rect" ? m = Be(l) : c === "line" ? m = Ye(l) : ["glyph", "path"].includes(c) && (m = Y(
    i ? e.getAttribute("d") || /* istanbul ignore next @preserve */
    "" : e.d || ""
  )), G(m) && m.length ? m : !1;
}, mt = (e, t) => {
  let { round: n } = ht;
  if (t === "off" || n === "off") return [...e];
  n = typeof t == "number" && t >= 0 ? t : n;
  const s = typeof n == "number" && n >= 1 ? 10 ** n : 1;
  return e.map((r) => {
    const i = r.slice(1).map(Number).map((o) => n ? Math.round(o * s) / s : Math.round(o));
    return [r[0], ...i];
  });
}, Pt = (e, t) => mt(e, t).map((n) => n[0] + n.slice(1).join(" ")).join(""), Je = (e, t, n) => {
  const s = n || document, r = s.defaultView || /* istanbul ignore next */
  window, i = Object.keys(at), o = e instanceof r.SVGElement, c = o ? e.tagName : null;
  if (c === "path") throw TypeError(`${$}: "${c}" is already SVGPathElement`);
  if (c && i.every((h) => c !== h)) throw TypeError(`${$}: "${c}" is not SVGElement`);
  const a = s.createElementNS("http://www.w3.org/2000/svg", "path"), l = o ? c : e.type, m = at[l], u = { type: l }, y = ht.round, x = se(e, s), f = x && x.length ? Pt(x, y) : "";
  return o ? (m.forEach((h) => {
    u[h] = e.getAttribute(h);
  }), Object.values(e.attributes).forEach(({ name: h, value: g }) => {
    m.includes(h) || a.setAttribute(h, g);
  })) : (Object.assign(u, e), Object.keys(u).forEach((h) => {
    !m.includes(h) && h !== "type" && a.setAttribute(
      h.replace(/[A-Z]/g, (g) => `-${g.toLowerCase()}`),
      u[h]
    );
  })), ee(f) ? (a.setAttribute("d", f), t && o && (e.before(a, e), e.remove()), a) : !1;
}, zt = (e) => {
  const t = [];
  let n, s = -1;
  return e.forEach((r) => {
    r[0] === "M" ? (n = [r], s += 1) : n.push(r), t[s] = n;
  }), t;
}, re = (e) => {
  let t = new P();
  const { origin: n } = e, [s, r] = n, { translate: i } = e, { rotate: o } = e, { skew: c } = e, { scale: a } = e;
  return Array.isArray(i) && i.length >= 2 && i.every((l) => !Number.isNaN(+l)) && i.some((l) => l !== 0) ? t = t.translate(...i) : typeof i == "number" && !Number.isNaN(i) && (t = t.translate(i)), (o || c || a) && (t = t.translate(s, r), Array.isArray(o) && o.length >= 2 && o.every((l) => !Number.isNaN(+l)) && o.some((l) => l !== 0) ? t = t.rotate(...o) : typeof o == "number" && !Number.isNaN(o) && (t = t.rotate(o)), Array.isArray(c) && c.length === 2 && c.every((l) => !Number.isNaN(+l)) && c.some((l) => l !== 0) ? (t = c[0] ? t.skewX(c[0]) : t, t = c[1] ? t.skewY(c[1]) : t) : typeof c == "number" && !Number.isNaN(c) && (t = t.skewX(c)), Array.isArray(a) && a.length >= 2 && a.every((l) => !Number.isNaN(+l)) && a.some((l) => l !== 1) ? t = t.scale(...a) : typeof a == "number" && !Number.isNaN(a) && (t = t.scale(a)), t = t.translate(-s, -r)), t;
}, At = (e) => {
  if (ne(e))
    return e.slice(0);
  const t = Y(e);
  let n = 0, s = 0, r = 0, i = 0;
  return t.map((o) => {
    const c = o.slice(1).map(Number), [a] = o, l = a.toLowerCase();
    if (a === "M")
      return [n, s] = c, r = n, i = s, ["M", n, s];
    let m = [];
    if (a !== l)
      if (l === "a")
        m = [
          l,
          c[0],
          c[1],
          c[2],
          c[3],
          c[4],
          c[5] - n,
          c[6] - s
        ];
      else if (l === "v")
        m = [l, c[0] - s];
      else if (l === "h")
        m = [l, c[0] - n];
      else {
        const y = c.map((x, f) => x - (f % 2 ? s : n));
        m = [l, ...y];
      }
    else
      a === "m" && (r = c[0] + n, i = c[1] + s), m = [l, ...c];
    const u = m.length;
    return l === "z" ? (n = r, s = i) : l === "h" ? n += m[1] : l === "v" ? s += m[1] : (n += m[u - 2], s += m[u - 1]), m;
  });
}, _e = (e, t, n, s) => {
  const [r] = e, i = (p) => Math.round(p * 10 ** 4) / 10 ** 4, o = e.slice(1).map((p) => +p), c = t.slice(1).map((p) => +p), { x1: a, y1: l, x2: m, y2: u, x: y, y: x } = n;
  let f = e;
  const [h, g] = c.slice(-2);
  if ("TQ".includes(r) || (n.qx = null, n.qy = null), ["V", "H", "S", "T", "Z"].includes(r))
    f = [r, ...o];
  else if (r === "L")
    i(y) === i(h) ? f = ["V", g] : i(x) === i(g) && (f = ["H", h]);
  else if (r === "C") {
    const [p, b] = c;
    "CS".includes(s) && (i(p) === i(a * 2 - m) && i(b) === i(l * 2 - u) || i(a) === i(m * 2 - y) && i(l) === i(u * 2 - x)) && (f = ["S", ...c.slice(-4)]), n.x1 = p, n.y1 = b;
  } else if (r === "Q") {
    const [p, b] = c;
    n.qx = p, n.qy = b, "QT".includes(s) && (i(p) === i(a * 2 - m) && i(b) === i(l * 2 - u) || i(a) === i(m * 2 - y) && i(l) === i(u * 2 - x)) && (f = ["T", ...c.slice(-2)]);
  }
  return f;
}, Ot = (e, t) => {
  const n = H(e), s = O(n), r = { ...et }, i = [], o = n.length;
  let c = "", a = "", l = 0, m = 0, u = 0, y = 0;
  for (let h = 0; h < o; h += 1) {
    [c] = n[h], i[h] = c, h && (a = i[h - 1]), n[h] = _e(n[h], s[h], r, a);
    const g = n[h], p = g.length;
    switch (r.x1 = +g[p - 2], r.y1 = +g[p - 1], r.x2 = +g[p - 4] || r.x1, r.y2 = +g[p - 3] || r.y1, c) {
      case "Z":
        l = u, m = y;
        break;
      case "H":
        [, l] = g;
        break;
      case "V":
        [, m] = g;
        break;
      default:
        [l, m] = g.slice(-2).map(Number), c === "M" && (u = l, y = m);
    }
    r.x = l, r.y = m;
  }
  const x = mt(n, t), f = mt(At(n), t);
  return x.map((h, g) => g ? h.join("").length < f[g].join("").length ? h : f[g] : h);
}, Ke = (e) => {
  const t = e.slice(1).map(
    (n, s, r) => s ? [...r[s - 1].slice(-2), ...n.slice(1)] : [...e[0].slice(1), ...n.slice(1)]
  ).map((n) => n.map((s, r) => n[n.length - r - 2 * (1 - r % 2)])).reverse();
  return [["M", ...t[0].slice(0, 2)], ...t.map((n) => ["C", ...n.slice(2)])];
}, ot = (e) => {
  const t = H(e), n = t.slice(-1)[0][0] === "Z", s = O(t).map((r, i) => {
    const [o, c] = r.slice(-2).map(Number);
    return {
      seg: t[i],
      // absolute
      n: r,
      // normalized
      c: t[i][0],
      // pathCommand
      x: o,
      // x
      y: c
      // y
    };
  }).map((r, i, o) => {
    const c = r.seg, a = r.n, l = i && o[i - 1], m = o[i + 1], u = r.c, y = o.length, x = i ? o[i - 1].x : o[y - 1].x, f = i ? o[i - 1].y : o[y - 1].y;
    let h = [];
    switch (u) {
      case "M":
        h = n ? ["Z"] : [u, x, f];
        break;
      case "A":
        h = [u, ...c.slice(1, -3), c[5] === 1 ? 0 : 1, x, f];
        break;
      case "C":
        m && m.c === "S" ? h = ["S", c[1], c[2], x, f] : h = [u, c[3], c[4], c[1], c[2], x, f];
        break;
      case "S":
        l && "CS".includes(l.c) && (!m || m.c !== "S") ? h = ["C", a[3], a[4], a[1], a[2], x, f] : h = [u, a[1], a[2], x, f];
        break;
      case "Q":
        m && m.c === "T" ? h = ["T", x, f] : h = [u, ...c.slice(1, -2), x, f];
        break;
      case "T":
        l && "QT".includes(l.c) && (!m || m.c !== "T") ? h = ["Q", a[1], a[2], x, f] : h = [u, x, f];
        break;
      case "Z":
        h = ["M", x, f];
        break;
      case "H":
        h = [u, x];
        break;
      case "V":
        h = [u, f];
        break;
      default:
        h = [u, ...c.slice(1, -2), x, f];
    }
    return h;
  });
  return n ? s.reverse() : [s[0], ...s.slice(1).reverse()];
}, Ue = (e, t) => {
  let n = P.Translate(...t.slice(0, -1));
  return [, , , n.m44] = t, n = e.multiply(n), [n.m41, n.m42, n.m43, n.m44];
}, jt = (e, t, n) => {
  const [s, r, i] = n, [o, c, a] = Ue(e, [...t, 0, 1]), l = o - s, m = c - r, u = a - i;
  return [
    // protect against division by ZERO
    l * (Math.abs(i) / Math.abs(u) || 1) + s,
    m * (Math.abs(i) / Math.abs(u) || 1) + r
  ];
}, ie = (e) => {
  const t = ft(e) ? e : H(e), n = gt(t) ? t : O(t), s = { ...et }, r = [];
  let i = [], o = 0, c = "";
  const a = [];
  let l = 0, m = t.length;
  for (l = 0; l < m; l += 1)
    t[l] && ([c] = t[l]), r[l] = c, c === "A" && (i = ct(n[l], s), t[l] = ct(n[l], s), vt(t, r, l), n[l] = ct(n[l], s), vt(n, r, l), m = Math.max(t.length, n.length)), i = n[l], o = i.length, s.x1 = +i[o - 2], s.y1 = +i[o - 1], s.x2 = +i[o - 4] || s.x1, s.y2 = +i[o - 3] || s.y1, a.push(t[l]);
  return a;
}, It = (e, t) => {
  let n = 0, s = 0, r, i, o, c, a, l;
  const m = ie(e), u = t && Object.keys(t);
  if (!t || u && !u.length) return m.slice(0);
  const y = O(m);
  if (!t.origin) {
    const { origin: d } = ht;
    Object.assign(t, { origin: d });
  }
  const x = re(t), { origin: f } = t, h = { ...et };
  let g = [], p = 0, b = "";
  const v = [];
  if (!x.isIdentity) {
    for (r = 0, o = m.length; r < o; r += 1) {
      g = y[r], p = g.length, h.x1 = +g[p - 2], h.y1 = +g[p - 1], h.x2 = +g[p - 4] || h.x1, h.y2 = +g[p - 3] || h.y1;
      const d = {
        s: m[r],
        c: m[r][0],
        x: h.x1,
        y: h.y1
      };
      v.push(d);
    }
    return v.map((d) => {
      if (b = d.c, g = d.s, b === "L" || b === "H" || b === "V")
        return [a, l] = jt(x, [d.x, d.y], f), n !== a && s !== l ? g = ["L", a, l] : s === l ? g = ["H", a] : n === a && (g = ["V", l]), n = a, s = l, g;
      for (i = 1, c = g.length; i < c; i += 2)
        [n, s] = jt(x, [+g[i], +g[i + 1]], f), g[i] = n, g[i + 1] = s;
      return g;
    });
  }
  return m.slice(0);
}, Ve = (e) => {
  const n = e.slice(0, 2), s = e.slice(2, 4), r = e.slice(4, 6), i = e.slice(6, 8), o = z(n, s, 0.5), c = z(s, r, 0.5), a = z(r, i, 0.5), l = z(o, c, 0.5), m = z(c, a, 0.5), u = z(l, m, 0.5);
  return [
    ["C", ...o, ...l, ...u],
    ["C", ...m, ...a, ...i]
  ];
};
class N {
  /**
   * @constructor
   * @param pathValue the path string
   * @param config instance options
   */
  constructor(t, n) {
    const s = n || {}, r = typeof t > "u";
    if (r || !t.length)
      throw TypeError(`${$}: "pathValue" is ${r ? "undefined" : "empty"}`);
    const i = Y(t);
    this.segments = i;
    const { width: o, height: c, cx: a, cy: l, cz: m } = this.bbox, { round: u, origin: y } = s;
    let x;
    if (u === "auto") {
      const h = `${Math.floor(Math.max(o, c))}`.length;
      x = h >= 4 ? 0 : 4 - h;
    } else Number.isInteger(u) || u === "off" ? x = u : x = ht.round;
    let f = [a, l, m];
    if (Array.isArray(y) && y.length >= 2) {
      const [h, g, p] = y.map(Number);
      f = [
        Number.isNaN(h) ? a : h,
        Number.isNaN(g) ? l : g,
        Number.isNaN(p) ? m : p
      ];
    }
    return this.round = x, this.origin = f, this;
  }
  get bbox() {
    return St(this.segments);
  }
  get length() {
    return F(this.segments);
  }
  /**
   * Returns the path bounding box, equivalent to native `path.getBBox()`.
   *
   * @public
   * @returns the pathBBox
   */
  getBBox() {
    return this.bbox;
  }
  /**
   * Returns the total path length, equivalent to native `path.getTotalLength()`.
   *
   * @public
   * @returns the path total length
   */
  getTotalLength() {
    return this.length;
  }
  /**
   * Returns an `{x,y}` point in the path stroke at a given length,
   * equivalent to the native `path.getPointAtLength()`.
   *
   * @public
   * @param length the length
   * @returns the requested point
   */
  getPointAtLength(t) {
    return W(this.segments, t);
  }
  /**
   * Convert path to absolute values
   *
   * @public
   */
  toAbsolute() {
    const { segments: t } = this;
    return this.segments = H(t), this;
  }
  /**
   * Convert path to relative values
   *
   * @public
   */
  toRelative() {
    const { segments: t } = this;
    return this.segments = At(t), this;
  }
  /**
   * Convert path to cubic-bezier values. In addition, un-necessary `Z`
   * segment is removed if previous segment extends to the `M` segment.
   *
   * @public
   */
  toCurve() {
    const { segments: t } = this;
    return this.segments = lt(t), this;
  }
  /**
   * Reverse the order of the segments and their values.
   *
   * @param onlySubpath option to reverse all sub-paths except first
   * @public
   */
  reverse(t) {
    this.toAbsolute();
    const { segments: n } = this, s = zt(n), r = s.length > 1 ? s : !1, i = r ? r.map((c, a) => t ? a ? ot(c) : c.slice(0) : ot(c)) : n.slice(0);
    let o = [];
    return r ? o = i.flat(1) : o = t ? n : ot(n), this.segments = o.slice(0), this;
  }
  /**
   * Normalize path in 2 steps:
   * * convert `pathArray`(s) to absolute values
   * * convert shorthand notation to standard notation
   *
   * @public
   */
  normalize() {
    const { segments: t } = this;
    return this.segments = O(t), this;
  }
  /**
   * Optimize `pathArray` values:
   * * convert segments to absolute and/or relative values
   * * select segments with shortest resulted string
   * * round values to the specified `decimals` option value
   *
   * @public
   */
  optimize() {
    const { segments: t } = this;
    return this.segments = Ot(t, this.round), this;
  }
  /**
   * Transform path using values from an `Object` defined as `transformObject`.
   *
   * @see TransformObject for a quick refference
   *
   * @param source a `transformObject`as described above
   * @public
   */
  transform(t) {
    if (!t || typeof t != "object" || typeof t == "object" && !["translate", "rotate", "skew", "scale"].some((a) => a in t))
      return this;
    const {
      segments: n,
      origin: [s, r, i]
    } = this, o = {};
    for (const [a, l] of Object.entries(t))
      a === "skew" && Array.isArray(l) || (a === "rotate" || a === "translate" || a === "origin" || a === "scale") && Array.isArray(l) ? o[a] = l.map(Number) : a !== "origin" && typeof Number(l) == "number" && (o[a] = Number(l));
    const { origin: c } = o;
    if (Array.isArray(c) && c.length >= 2) {
      const [a, l, m] = c.map(Number);
      o.origin = [Number.isNaN(a) ? s : a, Number.isNaN(l) ? r : l, m || i];
    } else
      o.origin = [s, r, i];
    return this.segments = It(n, o), this;
  }
  /**
   * Rotate path 180deg vertically
   *
   * @public
   */
  flipX() {
    return this.transform({ rotate: [0, 180, 0] }), this;
  }
  /**
   * Rotate path 180deg horizontally
   *
   * @public
   */
  flipY() {
    return this.transform({ rotate: [180, 0, 0] }), this;
  }
  /**
   * Export the current path to be used
   * for the `d` (description) attribute.
   *
   * @public
   * @return the path string
   */
  toString() {
    return Pt(this.segments, this.round);
  }
}
// bring main utilities to front
M(N, "CSSMatrix", P), M(N, "getSVGMatrix", re), M(N, "getPathBBox", St), M(N, "getPathArea", te), M(N, "getTotalLength", F), M(N, "getDrawDirection", Ie), M(N, "getPointAtLength", W), M(N, "pathFactory", yt), M(N, "getPropertiesAtLength", Ct), M(N, "getPropertiesAtPoint", xt), M(N, "polygonLength", xe), M(N, "polygonArea", ye), M(N, "getClosestPoint", De), M(N, "getSegmentOfPoint", Re), M(N, "getSegmentAtLength", Xe), M(N, "isPointInStroke", Ze), M(N, "isValidPath", ee), M(N, "isPathArray", G), M(N, "isAbsoluteArray", ft), M(N, "isRelativeArray", ne), M(N, "isCurveArray", Wt), M(N, "isNormalizedArray", gt), M(N, "shapeToPath", Je), M(N, "shapeToPathArray", se), M(N, "parsePathString", Y), M(N, "roundPath", mt), M(N, "splitPath", zt), M(N, "splitCubic", Ve), M(N, "replaceArc", ie), M(N, "optimizePath", Ot), M(N, "reverseCurve", Ke), M(N, "reversePath", ot), M(N, "normalizePath", O), M(N, "transformPath", It), M(N, "pathToAbsolute", H), M(N, "pathToRelative", At), M(N, "pathToCurve", lt), M(N, "pathToString", Pt);
export {
  N as default
};
//# sourceMappingURL=svg-path-commander.mjs.map
