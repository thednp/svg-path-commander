var ee = Object.defineProperty;
var ne = (e, t, n) => t in e ? ee(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var N = (e, t, n) => ne(e, typeof t != "symbol" ? t + "" : t, n);
const P = {
  origin: [0, 0, 0],
  round: 4,
  sampleSize: 300
}, $ = "SVGPathCommander Error", K = {
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
}, Tt = (e) => {
  let t = e.pathValue[e.segmentStart], n = t.toLowerCase();
  const { data: r } = e;
  for (; r.length >= K[n] && (n === "m" && r.length > 2 ? (e.segments.push([t, ...r.splice(0, 2)]), n = "l", t = t === "m" ? "l" : "L") : e.segments.push([t, ...r.splice(0, K[n])]), !!K[n]); )
    ;
}, se = (e) => {
  const { index: t, pathValue: n } = e, r = n.charCodeAt(t);
  if (r === 48) {
    e.param = 0, e.index += 1;
    return;
  }
  if (r === 49) {
    e.param = 1, e.index += 1;
    return;
  }
  e.err = `${$}: invalid Arc flag "${n[t]}", expecting 0 or 1 at index ${t}`;
}, Z = (e) => e >= 48 && e <= 57, F = "Invalid path value", re = (e) => {
  const { max: t, pathValue: n, index: r } = e;
  let s = r, i = !1, c = !1, l = !1, a = !1, o;
  if (s >= t) {
    e.err = `${$}: ${F} at index ${s}, "pathValue" is missing param`;
    return;
  }
  if (o = n.charCodeAt(s), (o === 43 || o === 45) && (s += 1, o = n.charCodeAt(s)), !Z(o) && o !== 46) {
    e.err = `${$}: ${F} at index ${s}, "${n[s]}" is not a number`;
    return;
  }
  if (o !== 46) {
    if (i = o === 48, s += 1, o = n.charCodeAt(s), i && s < t && o && Z(o)) {
      e.err = `${$}: ${F} at index ${r}, "${n[r]}" illegal number`;
      return;
    }
    for (; s < t && Z(n.charCodeAt(s)); )
      s += 1, c = !0;
    o = n.charCodeAt(s);
  }
  if (o === 46) {
    for (a = !0, s += 1; Z(n.charCodeAt(s)); )
      s += 1, l = !0;
    o = n.charCodeAt(s);
  }
  if (o === 101 || o === 69) {
    if (a && !c && !l) {
      e.err = `${$}: ${F} at index ${s}, "${n[s]}" invalid float exponent`;
      return;
    }
    if (s += 1, o = n.charCodeAt(s), (o === 43 || o === 45) && (s += 1), s < t && Z(n.charCodeAt(s)))
      for (; s < t && Z(n.charCodeAt(s)); )
        s += 1;
    else {
      e.err = `${$}: ${F} at index ${s}, "${n[s]}" invalid integer exponent`;
      return;
    }
  }
  e.index = s, e.param = +e.pathValue.slice(r, s);
}, ie = (e) => [
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
  for (; e.index < n && ie(t.charCodeAt(e.index)); )
    e.index += 1;
}, oe = (e) => {
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
}, ce = (e) => Z(e) || e === 43 || e === 45 || e === 46, le = (e) => (e | 32) === 97, ae = (e) => {
  switch (e | 32) {
    case 109:
    case 77:
      return !0;
    default:
      return !1;
  }
}, Et = (e) => {
  var a;
  const { max: t, pathValue: n, index: r, segments: s } = e, i = n.charCodeAt(r), c = K[n[r].toLowerCase()];
  if (e.segmentStart = r, !oe(i)) {
    e.err = `${$}: ${F} "${n[r]}" is not a path command at index ${r}`;
    return;
  }
  const l = s[s.length - 1];
  if (!ae(i) && ((a = l == null ? void 0 : l[0]) == null ? void 0 : a.toLocaleLowerCase()) === "z") {
    e.err = `${$}: ${F} "${n[r]}" is not a MoveTo path command at index ${r}`;
    return;
  }
  if (e.index += 1, V(e), e.data = [], !c) {
    Tt(e);
    return;
  }
  for (; ; ) {
    for (let o = c; o > 0; o -= 1) {
      if (le(i) && (o === 3 || o === 4) ? se(e) : re(e), e.err.length)
        return;
      e.data.push(e.param), V(e), e.index < t && n.charCodeAt(e.index) === 44 && (e.index += 1, V(e));
    }
    if (e.index >= e.max || !ce(n.charCodeAt(e.index)))
      break;
  }
  Tt(e);
};
class jt {
  constructor(t) {
    this.segments = [], this.pathValue = t, this.max = t.length, this.index = 0, this.param = 0, this.segmentStart = 0, this.data = [], this.err = "";
  }
}
const W = (e) => Array.isArray(e) && e.every((t) => {
  const n = t[0].toLowerCase();
  return K[n] === t.length - 1 && "achlmqstvz".includes(n) && t.slice(1).every(Number.isFinite);
}) && e.length > 0, R = (e) => {
  if (W(e))
    return e.slice(0);
  const t = new jt(e);
  for (V(t); t.index < t.max && !t.err.length; )
    Et(t);
  if (t.err && t.err.length)
    throw TypeError(t.err);
  return t.segments;
}, me = (e) => {
  const t = e.length;
  let n = -1, r, s = e[t - 1], i = 0;
  for (; ++n < t; )
    r = s, s = e[n], i += r[1] * s[0] - r[0] * s[1];
  return i / 2;
}, G = (e, t) => Math.sqrt((e[0] - t[0]) * (e[0] - t[0]) + (e[1] - t[1]) * (e[1] - t[1])), he = (e) => e.reduce((t, n, r) => r ? t + G(e[r - 1], n) : 0, 0);
var ue = Object.defineProperty, fe = (e, t, n) => t in e ? ue(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, L = (e, t, n) => fe(e, typeof t != "symbol" ? t + "" : t, n);
const ye = {
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
}, It = (e) => (e instanceof Float64Array || e instanceof Float32Array || Array.isArray(e) && e.every((t) => typeof t == "number")) && [6, 16].some((t) => e.length === t), Dt = (e) => e instanceof DOMMatrix || e instanceof w || typeof e == "object" && Object.keys(ye).every((t) => e && t in e), tt = (e) => {
  const t = new w(), n = Array.from(e);
  if (!It(n))
    throw TypeError(`CSSMatrix: "${n.join(",")}" must be an array with 6/16 numbers.`);
  if (n.length === 16) {
    const [r, s, i, c, l, a, o, m, u, y, g, f, h, x, p, d] = n;
    t.m11 = r, t.a = r, t.m21 = l, t.c = l, t.m31 = u, t.m41 = h, t.e = h, t.m12 = s, t.b = s, t.m22 = a, t.d = a, t.m32 = y, t.m42 = x, t.f = x, t.m13 = i, t.m23 = o, t.m33 = g, t.m43 = p, t.m14 = c, t.m24 = m, t.m34 = f, t.m44 = d;
  } else if (n.length === 6) {
    const [r, s, i, c, l, a] = n;
    t.m11 = r, t.a = r, t.m12 = s, t.b = s, t.m21 = i, t.c = i, t.m22 = c, t.d = c, t.m41 = l, t.e = l, t.m42 = a, t.f = a;
  }
  return t;
}, Zt = (e) => {
  if (Dt(e))
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
  let n = new w();
  const r = `CSSMatrix: invalid transform string "${e}"`;
  return t.split(")").filter((s) => s).forEach((s) => {
    const [i, c] = s.split("(");
    if (!c) throw TypeError(r);
    const l = c.split(",").map((f) => f.includes("rad") ? parseFloat(f) * (180 / Math.PI) : parseFloat(f)), [a, o, m, u] = l, y = [a, o, m], g = [a, o, m, u];
    if (i === "perspective" && a && [o, m].every((f) => f === void 0))
      n.m34 = -1 / a;
    else if (i.includes("matrix") && [6, 16].includes(l.length) && l.every((f) => !Number.isNaN(+f))) {
      const f = l.map((h) => Math.abs(h) < 1e-6 ? 0 : h);
      n = n.multiply(tt(f));
    } else if (i === "translate3d" && y.every((f) => !Number.isNaN(+f)))
      n = n.translate(a, o, m);
    else if (i === "translate" && a && m === void 0)
      n = n.translate(a, o || 0, 0);
    else if (i === "rotate3d" && g.every((f) => !Number.isNaN(+f)) && u)
      n = n.rotateAxisAngle(a, o, m, u);
    else if (i === "rotate" && a && [o, m].every((f) => f === void 0))
      n = n.rotate(0, 0, a);
    else if (i === "scale3d" && y.every((f) => !Number.isNaN(+f)) && y.some((f) => f !== 1))
      n = n.scale(a, o, m);
    else if (i === "scale" && !Number.isNaN(a) && a !== 1 && m === void 0) {
      const f = Number.isNaN(+o) ? a : o;
      n = n.scale(a, f, 1);
    } else if (i === "skew" && (a || !Number.isNaN(a) && o) && m === void 0)
      n = n.skew(a, o || 0);
    else if (["translate", "rotate", "scale", "skew"].some((f) => i.includes(f)) && /[XYZ]/.test(i) && a && [o, m].every((f) => f === void 0))
      if (i === "skewX" || i === "skewY")
        n = n[i](a);
      else {
        const f = i.replace(/[XYZ]/, ""), h = i.replace(f, ""), x = ["X", "Y", "Z"].indexOf(h), p = f === "scale" ? 1 : 0, d = [x === 0 ? a : p, x === 1 ? a : p, x === 2 ? a : p];
        n = n[f](...d);
      }
    else
      throw TypeError(r);
  }), n;
}, Mt = (e, t) => t ? [e.a, e.b, e.c, e.d, e.e, e.f] : [
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
], Rt = (e, t, n) => {
  const r = new w();
  return r.m41 = e, r.e = e, r.m42 = t, r.f = t, r.m43 = n, r;
}, Xt = (e, t, n) => {
  const r = new w(), s = Math.PI / 180, i = e * s, c = t * s, l = n * s, a = Math.cos(i), o = -Math.sin(i), m = Math.cos(c), u = -Math.sin(c), y = Math.cos(l), g = -Math.sin(l), f = m * y, h = -m * g;
  r.m11 = f, r.a = f, r.m12 = h, r.b = h, r.m13 = u;
  const x = o * u * y + a * g;
  r.m21 = x, r.c = x;
  const p = a * y - o * u * g;
  return r.m22 = p, r.d = p, r.m23 = -o * m, r.m31 = o * g - a * u * y, r.m32 = o * y + a * u * g, r.m33 = a * m, r;
}, Qt = (e, t, n, r) => {
  const s = new w(), i = Math.sqrt(e * e + t * t + n * n);
  if (i === 0)
    return s;
  const c = e / i, l = t / i, a = n / i, o = r * (Math.PI / 360), m = Math.sin(o), u = Math.cos(o), y = m * m, g = c * c, f = l * l, h = a * a, x = 1 - 2 * (f + h) * y;
  s.m11 = x, s.a = x;
  const p = 2 * (c * l * y + a * m * u);
  s.m12 = p, s.b = p, s.m13 = 2 * (c * a * y - l * m * u);
  const d = 2 * (l * c * y - a * m * u);
  s.m21 = d, s.c = d;
  const A = 1 - 2 * (h + g) * y;
  return s.m22 = A, s.d = A, s.m23 = 2 * (l * a * y + c * m * u), s.m31 = 2 * (a * c * y + l * m * u), s.m32 = 2 * (a * l * y - c * m * u), s.m33 = 1 - 2 * (g + f) * y, s;
}, Ht = (e, t, n) => {
  const r = new w();
  return r.m11 = e, r.a = e, r.m22 = t, r.d = t, r.m33 = n, r;
}, ut = (e, t) => {
  const n = new w();
  if (e) {
    const r = e * Math.PI / 180, s = Math.tan(r);
    n.m21 = s, n.c = s;
  }
  if (t) {
    const r = t * Math.PI / 180, s = Math.tan(r);
    n.m12 = s, n.b = s;
  }
  return n;
}, Yt = (e) => ut(e, 0), Bt = (e) => ut(0, e), E = (e, t) => {
  const n = t.m11 * e.m11 + t.m12 * e.m21 + t.m13 * e.m31 + t.m14 * e.m41, r = t.m11 * e.m12 + t.m12 * e.m22 + t.m13 * e.m32 + t.m14 * e.m42, s = t.m11 * e.m13 + t.m12 * e.m23 + t.m13 * e.m33 + t.m14 * e.m43, i = t.m11 * e.m14 + t.m12 * e.m24 + t.m13 * e.m34 + t.m14 * e.m44, c = t.m21 * e.m11 + t.m22 * e.m21 + t.m23 * e.m31 + t.m24 * e.m41, l = t.m21 * e.m12 + t.m22 * e.m22 + t.m23 * e.m32 + t.m24 * e.m42, a = t.m21 * e.m13 + t.m22 * e.m23 + t.m23 * e.m33 + t.m24 * e.m43, o = t.m21 * e.m14 + t.m22 * e.m24 + t.m23 * e.m34 + t.m24 * e.m44, m = t.m31 * e.m11 + t.m32 * e.m21 + t.m33 * e.m31 + t.m34 * e.m41, u = t.m31 * e.m12 + t.m32 * e.m22 + t.m33 * e.m32 + t.m34 * e.m42, y = t.m31 * e.m13 + t.m32 * e.m23 + t.m33 * e.m33 + t.m34 * e.m43, g = t.m31 * e.m14 + t.m32 * e.m24 + t.m33 * e.m34 + t.m34 * e.m44, f = t.m41 * e.m11 + t.m42 * e.m21 + t.m43 * e.m31 + t.m44 * e.m41, h = t.m41 * e.m12 + t.m42 * e.m22 + t.m43 * e.m32 + t.m44 * e.m42, x = t.m41 * e.m13 + t.m42 * e.m23 + t.m43 * e.m33 + t.m44 * e.m43, p = t.m41 * e.m14 + t.m42 * e.m24 + t.m43 * e.m34 + t.m44 * e.m44;
  return tt([n, r, s, i, c, l, a, o, m, u, y, g, f, h, x, p]);
};
class w {
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
    return typeof t == "string" && t.length && t !== "none" ? Ft(t) : Array.isArray(t) || t instanceof Float64Array || t instanceof Float32Array ? tt(t) : typeof t == "object" ? Zt(t) : this;
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
    return Float32Array.from(Mt(this, t));
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
    return Float64Array.from(Mt(this, t));
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
  translate(t, n, r) {
    const s = t;
    let i = n, c = r;
    return typeof i > "u" && (i = 0), typeof c > "u" && (c = 0), E(this, Rt(s, i, c));
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
  scale(t, n, r) {
    const s = t;
    let i = n, c = r;
    return typeof i > "u" && (i = t), typeof c > "u" && (c = 1), E(this, Ht(s, i, c));
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
  rotate(t, n, r) {
    let s = t, i = n || 0, c = r || 0;
    return typeof t == "number" && typeof n > "u" && typeof r > "u" && (c = s, s = 0, i = 0), E(this, Xt(s, i, c));
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
  rotateAxisAngle(t, n, r, s) {
    if ([t, n, r, s].some((i) => Number.isNaN(+i)))
      throw new TypeError("CSSMatrix: expecting 4 values");
    return E(this, Qt(t, n, r, s));
  }
  /**
   * Specifies a skew transformation along the `x-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param angle The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skewX(t) {
    return E(this, Yt(t));
  }
  /**
   * Specifies a skew transformation along the `y-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param angle The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skewY(t) {
    return E(this, Bt(t));
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
    const n = this.m11 * t.x + this.m21 * t.y + this.m31 * t.z + this.m41 * t.w, r = this.m12 * t.x + this.m22 * t.y + this.m32 * t.z + this.m42 * t.w, s = this.m13 * t.x + this.m23 * t.y + this.m33 * t.z + this.m43 * t.w, i = this.m14 * t.x + this.m24 * t.y + this.m34 * t.z + this.m44 * t.w;
    return t instanceof DOMPoint ? new DOMPoint(n, r, s, i) : {
      x: n,
      y: r,
      z: s,
      w: i
    };
  }
}
L(w, "Translate", Rt), L(w, "Rotate", Xt), L(w, "RotateAxisAngle", Qt), L(w, "Scale", Ht), L(w, "SkewX", Yt), L(w, "SkewY", Bt), L(w, "Skew", ut), L(w, "Multiply", E), L(w, "fromArray", tt), L(w, "fromMatrix", Zt), L(w, "fromString", Ft), L(w, "toArray", Mt), L(w, "isCompatibleArray", It), L(w, "isCompatibleObject", Dt);
const ft = (e) => W(e) && // `isPathArray` also checks if it's `Array`
e.every(([t]) => t === t.toUpperCase()), H = (e) => {
  if (ft(e))
    return e.slice(0);
  const t = R(e);
  let n = 0, r = 0, s = 0, i = 0;
  return t.map((c) => {
    const l = c.slice(1).map(Number), [a] = c, o = a.toUpperCase();
    if (a === "M")
      return [n, r] = l, s = n, i = r, ["M", n, r];
    let m = [];
    if (a !== o)
      if (o === "A")
        m = [
          o,
          l[0],
          l[1],
          l[2],
          l[3],
          l[4],
          l[5] + n,
          l[6] + r
        ];
      else if (o === "V")
        m = [o, l[0] + r];
      else if (o === "H")
        m = [o, l[0] + n];
      else {
        const u = l.map((y, g) => y + (g % 2 ? r : n));
        m = [o, ...u];
      }
    else
      m = [o, ...l];
    return o === "Z" ? (n = s, r = i) : o === "H" ? [, n] = m : o === "V" ? [, r] = m : ([n, r] = m.slice(-2), o === "M" && (s = n, i = r)), m;
  });
}, ge = (e, t) => {
  const [n] = e, { x1: r, y1: s, x2: i, y2: c } = t, l = e.slice(1).map(Number);
  let a = e;
  if ("TQ".includes(n) || (t.qx = null, t.qy = null), n === "H")
    a = ["L", e[1], s];
  else if (n === "V")
    a = ["L", r, e[1]];
  else if (n === "S") {
    const o = r * 2 - i, m = s * 2 - c;
    t.x1 = o, t.y1 = m, a = ["C", o, m, ...l];
  } else if (n === "T") {
    const o = r * 2 - (t.qx ? t.qx : (
      /* istanbul ignore next */
      0
    )), m = s * 2 - (t.qy ? t.qy : (
      /* istanbul ignore next */
      0
    ));
    t.qx = o, t.qy = m, a = ["Q", o, m, ...l];
  } else if (n === "Q") {
    const [o, m] = l;
    t.qx = o, t.qy = m;
  }
  return a;
}, yt = (e) => ft(e) && e.every(([t]) => "ACLMQZ".includes(t)), et = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  x: 0,
  y: 0,
  qx: null,
  qy: null
}, I = (e) => {
  if (yt(e))
    return e.slice(0);
  const t = H(e), n = { ...et }, r = t.length;
  for (let s = 0; s < r; s += 1) {
    t[s], t[s] = ge(t[s], n);
    const i = t[s], c = i.length;
    n.x1 = +i[c - 2], n.y1 = +i[c - 1], n.x2 = +i[c - 4] || n.x1, n.y2 = +i[c - 3] || n.y1;
  }
  return t;
}, j = (e, t, n) => {
  const [r, s] = e, [i, c] = t;
  return [r + (i - r) * n, s + (c - s) * n];
}, At = (e, t, n, r, s) => {
  const i = G([e, t], [n, r]);
  let c = { x: 0, y: 0 };
  if (typeof s == "number")
    if (s <= 0)
      c = { x: e, y: t };
    else if (s >= i)
      c = { x: n, y: r };
    else {
      const [l, a] = j([e, t], [n, r], s / i);
      c = { x: l, y: a };
    }
  return {
    length: i,
    point: c,
    min: {
      x: Math.min(e, n),
      y: Math.min(t, r)
    },
    max: {
      x: Math.max(e, n),
      y: Math.max(t, r)
    }
  };
}, Lt = (e, t) => {
  const { x: n, y: r } = e, { x: s, y: i } = t, c = n * s + r * i, l = Math.sqrt((n ** 2 + r ** 2) * (s ** 2 + i ** 2));
  return (n * i - r * s < 0 ? -1 : 1) * Math.acos(c / l);
}, xe = (e, t, n, r, s, i, c, l, a, o) => {
  const { abs: m, sin: u, cos: y, sqrt: g, PI: f } = Math;
  let h = m(n), x = m(r);
  const d = (s % 360 + 360) % 360 * (f / 180);
  if (e === l && t === a)
    return { x: e, y: t };
  if (h === 0 || x === 0)
    return At(e, t, l, a, o).point;
  const A = (e - l) / 2, b = (t - a) / 2, M = {
    x: y(d) * A + u(d) * b,
    y: -u(d) * A + y(d) * b
  }, T = M.x ** 2 / h ** 2 + M.y ** 2 / x ** 2;
  T > 1 && (h *= g(T), x *= g(T));
  const S = h ** 2 * x ** 2 - h ** 2 * M.y ** 2 - x ** 2 * M.x ** 2, Y = h ** 2 * M.y ** 2 + x ** 2 * M.x ** 2;
  let X = S / Y;
  X = X < 0 ? 0 : X;
  const nt = (i !== c ? 1 : -1) * g(X), q = {
    x: nt * (h * M.y / x),
    y: nt * (-(x * M.x) / h)
  }, st = {
    x: y(d) * q.x - u(d) * q.y + (e + l) / 2,
    y: u(d) * q.x + y(d) * q.y + (t + a) / 2
  }, B = {
    x: (M.x - q.x) / h,
    y: (M.y - q.y) / x
  }, rt = Lt({ x: 1, y: 0 }, B), it = {
    x: (-M.x - q.x) / h,
    y: (-M.y - q.y) / x
  };
  let z = Lt(B, it);
  !c && z > 0 ? z -= 2 * f : c && z < 0 && (z += 2 * f), z %= 2 * f;
  const O = rt + z * o, J = h * y(O), U = x * u(O);
  return {
    x: y(d) * J - u(d) * U + st.x,
    y: u(d) * J + y(d) * U + st.y
  };
}, pe = (e, t, n, r, s, i, c, l, a, o, m = P.sampleSize) => {
  const u = typeof o == "number";
  let y = e, g = t, f = 0, h = [y, g, f], x = [y, g], p = 0, d = { x: 0, y: 0 };
  const A = [{ x: y, y: g }];
  u && o <= 0 && (d = { x: y, y: g });
  for (let b = 0; b <= m; b += 1) {
    if (p = b / m, { x: y, y: g } = xe(e, t, n, r, s, i, c, l, a, p), A.push({ x: y, y: g }), f += G(x, [y, g]), x = [y, g], u && f > o && o > h[2]) {
      const M = (f - o) / (f - h[2]);
      d = {
        x: x[0] * (1 - M) + h[0] * M,
        y: x[1] * (1 - M) + h[1] * M
      };
    }
    h = [y, g, f];
  }
  return u && o >= f && (d = { x: l, y: a }), {
    length: f,
    point: d,
    min: {
      x: Math.min(...A.map((b) => b.x)),
      y: Math.min(...A.map((b) => b.y))
    },
    max: {
      x: Math.max(...A.map((b) => b.x)),
      y: Math.max(...A.map((b) => b.y))
    }
  };
}, de = (e, t, n, r, s, i, c, l, a) => {
  const o = 1 - a;
  return {
    x: o ** 3 * e + 3 * o ** 2 * a * n + 3 * o * a ** 2 * s + a ** 3 * c,
    y: o ** 3 * t + 3 * o ** 2 * a * r + 3 * o * a ** 2 * i + a ** 3 * l
  };
}, be = (e, t, n, r, s, i, c, l, a, o = P.sampleSize) => {
  const m = typeof a == "number";
  let u = e, y = t, g = 0, f = [u, y, g], h = [u, y], x = 0, p = { x: 0, y: 0 };
  const d = [{ x: u, y }];
  m && a <= 0 && (p = { x: u, y });
  for (let A = 0; A <= o; A += 1) {
    if (x = A / o, { x: u, y } = de(e, t, n, r, s, i, c, l, x), d.push({ x: u, y }), g += G(h, [u, y]), h = [u, y], m && g > a && a > f[2]) {
      const b = (g - a) / (g - f[2]);
      p = {
        x: h[0] * (1 - b) + f[0] * b,
        y: h[1] * (1 - b) + f[1] * b
      };
    }
    f = [u, y, g];
  }
  return m && a >= g && (p = { x: c, y: l }), {
    length: g,
    point: p,
    min: {
      x: Math.min(...d.map((A) => A.x)),
      y: Math.min(...d.map((A) => A.y))
    },
    max: {
      x: Math.max(...d.map((A) => A.x)),
      y: Math.max(...d.map((A) => A.y))
    }
  };
}, Me = (e, t, n, r, s, i, c) => {
  const l = 1 - c;
  return {
    x: l ** 2 * e + 2 * l * c * n + c ** 2 * s,
    y: l ** 2 * t + 2 * l * c * r + c ** 2 * i
  };
}, Ae = (e, t, n, r, s, i, c, l = P.sampleSize) => {
  const a = typeof c == "number";
  let o = e, m = t, u = 0, y = [o, m, u], g = [o, m], f = 0, h = { x: 0, y: 0 };
  const x = [{ x: o, y: m }];
  a && c <= 0 && (h = { x: o, y: m });
  for (let p = 0; p <= l; p += 1) {
    if (f = p / l, { x: o, y: m } = Me(e, t, n, r, s, i, f), x.push({ x: o, y: m }), u += G(g, [o, m]), g = [o, m], a && u > c && c > y[2]) {
      const d = (u - c) / (u - y[2]);
      h = {
        x: g[0] * (1 - d) + y[0] * d,
        y: g[1] * (1 - d) + y[1] * d
      };
    }
    y = [o, m, u];
  }
  return a && c >= u && (h = { x: s, y: i }), {
    length: u,
    point: h,
    min: {
      x: Math.min(...x.map((p) => p.x)),
      y: Math.min(...x.map((p) => p.y))
    },
    max: {
      x: Math.max(...x.map((p) => p.x)),
      y: Math.max(...x.map((p) => p.y))
    }
  };
}, gt = (e, t, n = P.sampleSize) => {
  const r = I(e), s = typeof t == "number";
  let i, c = [], l, a = 0, o = 0, m = 0, u = 0, y;
  const g = [], f = [];
  let h = 0, x = { x: 0, y: 0 }, p = x, d = x, A = x, b = 0;
  for (let M = 0, T = r.length; M < T; M += 1)
    y = r[M], [l] = y, i = l === "M", c = i ? c : [a, o, ...y.slice(1)], i ? ([, m, u] = y, x = { x: m, y: u }, p = x, h = 0, s && t < 1e-3 && (A = x)) : l === "L" ? { length: h, min: x, max: p, point: d } = At(
      ...c,
      s ? t - b : void 0
    ) : l === "A" ? { length: h, min: x, max: p, point: d } = pe(
      ...c,
      s ? t - b : void 0,
      n
    ) : l === "C" ? { length: h, min: x, max: p, point: d } = be(
      ...c,
      s ? t - b : void 0,
      n
    ) : l === "Q" ? { length: h, min: x, max: p, point: d } = Ae(
      ...c,
      s ? t - b : void 0,
      n
    ) : l === "Z" && (c = [a, o, m, u], { length: h, min: x, max: p, point: d } = At(
      ...c,
      s ? t - b : void 0
    )), s && b < t && b + h >= t && (A = d), f.push(p), g.push(x), b += h, [a, o] = l !== "Z" ? y.slice(-2) : [m, u];
  return s && t >= b && (A = { x: a, y: o }), {
    length: b,
    point: A,
    min: {
      x: Math.min(...g.map((M) => M.x)),
      y: Math.min(...g.map((M) => M.y))
    },
    max: {
      x: Math.max(...f.map((M) => M.x)),
      y: Math.max(...f.map((M) => M.y))
    }
  };
}, $t = (e, t = P.sampleSize) => {
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
    min: { x: n, y: r },
    max: { x: s, y: i }
  } = gt(e, void 0, t), c = s - n, l = i - r;
  return {
    width: c,
    height: l,
    x: n,
    y: r,
    x2: s,
    y2: i,
    cx: n + c / 2,
    cy: r + l / 2,
    // an estimted guess
    cz: Math.max(c, l) + Math.min(c, l) / 2
  };
}, Nt = (e, t, n) => {
  if (e[n].length > 7) {
    e[n].shift();
    const r = e[n];
    let s = n;
    for (; r.length; )
      t[n] = "A", e.splice(s += 1, 0, ["C", ...r.splice(0, 6)]);
    e.splice(n, 1);
  }
}, Jt = (e) => yt(e) && e.every(([t]) => "MC".includes(t)), ot = (e, t, n) => {
  const r = e * Math.cos(n) - t * Math.sin(n), s = e * Math.sin(n) + t * Math.cos(n);
  return { x: r, y: s };
}, Ut = (e, t, n, r, s, i, c, l, a, o) => {
  let m = e, u = t, y = n, g = r, f = l, h = a;
  const x = Math.PI * 120 / 180, p = Math.PI / 180 * (+s || 0);
  let d = [], A, b, M, T, S;
  if (o)
    [b, M, T, S] = o;
  else {
    A = ot(m, u, -p), m = A.x, u = A.y, A = ot(f, h, -p), f = A.x, h = A.y;
    const C = (m - f) / 2, k = (u - h) / 2;
    let D = C * C / (y * y) + k * k / (g * g);
    D > 1 && (D = Math.sqrt(D), y *= D, g *= D);
    const dt = y * y, bt = g * g, Ct = (i === c ? -1 : 1) * Math.sqrt(Math.abs((dt * bt - dt * k * k - bt * C * C) / (dt * k * k + bt * C * C)));
    T = Ct * y * k / g + (m + f) / 2, S = Ct * -g * C / y + (u + h) / 2, b = Math.asin(((u - S) / g * 10 ** 9 >> 0) / 10 ** 9), M = Math.asin(((h - S) / g * 10 ** 9 >> 0) / 10 ** 9), b = m < T ? Math.PI - b : b, M = f < T ? Math.PI - M : M, b < 0 && (b = Math.PI * 2 + b), M < 0 && (M = Math.PI * 2 + M), c && b > M && (b -= Math.PI * 2), !c && M > b && (M -= Math.PI * 2);
  }
  let Y = M - b;
  if (Math.abs(Y) > x) {
    const C = M, k = f, D = h;
    M = b + x * (c && M > b ? 1 : -1), f = T + y * Math.cos(M), h = S + g * Math.sin(M), d = Ut(f, h, y, g, s, 0, c, k, D, [M, C, T, S]);
  }
  Y = M - b;
  const X = Math.cos(b), nt = Math.sin(b), q = Math.cos(M), st = Math.sin(M), B = Math.tan(Y / 4), rt = 4 / 3 * y * B, it = 4 / 3 * g * B, z = [m, u], O = [m + rt * nt, u - it * X], J = [f + rt * st, h - it * q], U = [f, h];
  if (O[0] = 2 * z[0] - O[0], O[1] = 2 * z[1] - O[1], o)
    return [...O, ...J, ...U, ...d];
  d = [...O, ...J, ...U, ...d];
  const pt = [];
  for (let C = 0, k = d.length; C < k; C += 1)
    pt[C] = C % 2 ? ot(d[C - 1], d[C], p).y : ot(d[C], d[C + 1], p).x;
  return pt;
}, Ne = (e, t, n, r, s, i) => {
  const c = 0.3333333333333333, l = 2 / 3;
  return [
    c * e + l * n,
    // cpx1
    c * t + l * r,
    // cpy1
    c * s + l * n,
    // cpx2
    c * i + l * r,
    // cpy2
    s,
    i
    // x,y
  ];
}, St = (e, t, n, r) => {
  const s = j([e, t], [n, r], 0.3333333333333333), i = j([e, t], [n, r], 2 / 3);
  return [...s, ...i, n, r];
}, lt = (e, t) => {
  const [n] = e, r = e.slice(1).map(Number), [s, i] = r;
  let c;
  const { x1: l, y1: a, x: o, y: m } = t;
  return "TQ".includes(n) || (t.qx = null, t.qy = null), n === "M" ? (t.x = s, t.y = i, e) : n === "A" ? (c = [l, a, ...r], ["C", ...Ut(...c)]) : n === "Q" ? (t.qx = s, t.qy = i, c = [l, a, ...r], ["C", ...Ne(...c)]) : n === "L" ? ["C", ...St(l, a, s, i)] : n === "Z" ? ["C", ...St(l, a, o, m)] : e;
}, at = (e) => {
  if (Jt(e))
    return e.slice(0);
  const t = I(e), n = { ...et }, r = [];
  let s = "", i = t.length;
  for (let c = 0; c < i; c += 1) {
    [s] = t[c], r[c] = s, t[c] = lt(t[c], n), Nt(t, r, c), i = t.length;
    const l = t[c], a = l.length;
    n.x1 = +l[a - 2], n.y1 = +l[a - 1], n.x2 = +l[a - 4] || n.x1, n.y2 = +l[a - 3] || n.y1;
  }
  return t;
}, ve = (e, t, n, r, s, i, c, l) => 3 * ((l - t) * (n + s) - (c - e) * (r + i) + r * (e - s) - n * (t - i) + l * (s + e / 3) - c * (i + t / 3)) / 20, Kt = (e) => {
  let t = 0, n = 0, r = 0;
  return at(e).map((s) => {
    switch (s[0]) {
      case "M":
        return [, t, n] = s, 0;
      default:
        return r = ve(t, n, ...s.slice(1)), [t, n] = s.slice(-2), r;
    }
  }).reduce((s, i) => s + i, 0);
}, Q = (e, t = P.sampleSize) => gt(e, void 0, t).length, we = (e) => Kt(at(e)) >= 0, _ = (e, t, n = P.sampleSize) => gt(e, t, n).point, Pt = (e, t, n = P.sampleSize) => {
  const r = R(e);
  let s = r.slice(0), i = Q(s, n), c = s.length - 1, l = 0, a = 0, o = r[0];
  const [m, u] = o.slice(-2), y = { x: m, y: u };
  if (c <= 0 || !t || !Number.isFinite(t))
    return {
      segment: o,
      index: 0,
      length: a,
      point: y,
      lengthAtSegment: l
    };
  if (t >= i)
    return s = r.slice(0, -1), l = Q(s, n), a = i - l, {
      segment: r[c],
      index: c,
      length: a,
      lengthAtSegment: l
    };
  const g = [];
  for (; c > 0; )
    o = s[c], s = s.slice(0, -1), l = Q(s, n), a = i - l, i = l, g.push({
      segment: o,
      index: c,
      length: a,
      lengthAtSegment: l
    }), c -= 1;
  return g.find(({ lengthAtSegment: f }) => f <= t);
}, xt = (e, t, n = P.sampleSize) => {
  const r = R(e), s = I(r), i = Q(r, n), c = (M) => {
    const T = M.x - t.x, S = M.y - t.y;
    return T * T + S * S;
  };
  let l = 8, a, o = { x: 0, y: 0 }, m = 0, u = 0, y = 1 / 0;
  for (let M = 0; M <= i; M += l)
    a = _(s, M, n), m = c(a), m < y && (o = a, u = M, y = m);
  l /= 2;
  let g, f, h = 0, x = 0, p = 0, d = 0;
  for (; l > 0.5; )
    h = u - l, g = _(s, h, n), p = c(g), x = u + l, f = _(s, x, n), d = c(f), h >= 0 && p < y ? (o = g, u = h, y = p) : x <= i && d < y ? (o = f, u = x, y = d) : l /= 2;
  const A = Pt(r, u, n), b = Math.sqrt(y);
  return { closest: o, distance: b, segment: A };
}, Pe = (e, t, n = P.sampleSize) => xt(e, t, n).closest, Ce = (e, t, n = P.sampleSize) => xt(e, t, n).segment, Te = (e, t, n = P.sampleSize) => Pt(e, t, n).segment, Le = (e, t, n = P.sampleSize) => {
  const { distance: r } = xt(e, t, n);
  return Math.abs(r) < 1e-3;
}, Vt = (e) => {
  if (typeof e != "string" || !e.length)
    return !1;
  const t = new jt(e);
  for (V(t); t.index < t.max && !t.err.length; )
    Et(t);
  return !t.err.length && "mM".includes(t.segments[0][0]);
}, _t = (e) => W(e) && // `isPathArray` checks if it's `Array`
e.slice(1).every(([t]) => t === t.toLowerCase()), mt = {
  line: ["x1", "y1", "x2", "y2"],
  circle: ["cx", "cy", "r"],
  ellipse: ["cx", "cy", "rx", "ry"],
  rect: ["width", "height", "x", "y", "rx", "ry"],
  polygon: ["points"],
  polyline: ["points"],
  glyph: ["d"]
}, $e = (e) => {
  let { x1: t, y1: n, x2: r, y2: s } = e;
  return [t, n, r, s] = [t, n, r, s].map((i) => +i), [
    ["M", t, n],
    ["L", r, s]
  ];
}, Se = (e) => {
  const t = [], n = (e.points || "").trim().split(/[\s|,]/).map((s) => +s);
  let r = 0;
  for (; r < n.length; )
    t.push([r ? "L" : "M", n[r], n[r + 1]]), r += 2;
  return e.type === "polygon" ? [...t, ["z"]] : t;
}, ke = (e) => {
  let { cx: t, cy: n, r } = e;
  return [t, n, r] = [t, n, r].map((s) => +s), [
    ["M", t - r, n],
    ["a", r, r, 0, 1, 0, 2 * r, 0],
    ["a", r, r, 0, 1, 0, -2 * r, 0]
  ];
}, qe = (e) => {
  let { cx: t, cy: n } = e, r = e.rx || 0, s = e.ry || r;
  return [t, n, r, s] = [t, n, r, s].map((i) => +i), [
    ["M", t - r, n],
    ["a", r, s, 0, 1, 0, 2 * r, 0],
    ["a", r, s, 0, 1, 0, -2 * r, 0]
  ];
}, ze = (e) => {
  const t = +e.x || 0, n = +e.y || 0, r = +e.width, s = +e.height;
  let i = +(e.rx || 0), c = +(e.ry || i);
  return i || c ? (i * 2 > r && (i -= (i * 2 - r) / 2), c * 2 > s && (c -= (c * 2 - s) / 2), [
    ["M", t + i, n],
    ["h", r - i * 2],
    ["s", i, 0, i, c],
    ["v", s - c * 2],
    ["s", 0, c, -i, c],
    ["h", -r + i * 2],
    ["s", -i, 0, -i, -c],
    ["v", -s + c * 2],
    ["s", 0, -c, i, -c]
  ]) : [["M", t, n], ["h", r], ["v", s], ["H", t], ["Z"]];
}, Wt = (e, t) => {
  const r = (t || document).defaultView || /* istanbul ignore next */
  window, s = Object.keys(mt), i = e instanceof r.SVGElement, c = i ? e.tagName : null;
  if (c && [...s, "path"].every((u) => c !== u))
    throw TypeError(`${$}: "${c}" is not SVGElement`);
  const l = i ? c : e.type, a = mt[l], o = { type: l };
  i ? a.forEach((u) => {
    o[u] = e.getAttribute(u);
  }) : Object.assign(o, e);
  let m = [];
  return l === "circle" ? m = ke(o) : l === "ellipse" ? m = qe(o) : ["polyline", "polygon"].includes(l) ? m = Se(o) : l === "rect" ? m = ze(o) : l === "line" ? m = $e(o) : ["glyph", "path"].includes(l) && (m = R(
    i ? e.getAttribute("d") || /* istanbul ignore next @preserve */
    "" : e.d || ""
  )), W(m) && m.length ? m : !1;
}, ht = (e, t) => {
  let { round: n } = P;
  if (t === "off" || n === "off") return [...e];
  n = typeof t == "number" && t >= 0 ? t : n;
  const r = typeof n == "number" && n >= 1 ? 10 ** n : 1;
  return e.map((s) => {
    const i = s.slice(1).map(Number).map((c) => n ? Math.round(c * r) / r : Math.round(c));
    return [s[0], ...i];
  });
}, vt = (e, t) => ht(e, t).map((n) => n[0] + n.slice(1).join(" ")).join(""), Oe = (e, t, n) => {
  const r = n || document, s = r.defaultView || /* istanbul ignore next */
  window, i = Object.keys(mt), c = e instanceof s.SVGElement, l = c ? e.tagName : null;
  if (l === "path") throw TypeError(`${$}: "${l}" is already SVGPathElement`);
  if (l && i.every((h) => l !== h)) throw TypeError(`${$}: "${l}" is not SVGElement`);
  const a = r.createElementNS("http://www.w3.org/2000/svg", "path"), o = c ? l : e.type, m = mt[o], u = { type: o }, y = P.round, g = Wt(e, r), f = g && g.length ? vt(g, y) : "";
  return c ? (m.forEach((h) => {
    u[h] = e.getAttribute(h);
  }), Object.values(e.attributes).forEach(({ name: h, value: x }) => {
    m.includes(h) || a.setAttribute(h, x);
  })) : (Object.assign(u, e), Object.keys(u).forEach((h) => {
    !m.includes(h) && h !== "type" && a.setAttribute(
      h.replace(/[A-Z]/g, (x) => `-${x.toLowerCase()}`),
      u[h]
    );
  })), Vt(f) ? (a.setAttribute("d", f), t && c && (e.before(a, e), e.remove()), a) : !1;
}, kt = (e) => {
  const t = [];
  let n, r = -1;
  return e.forEach((s) => {
    s[0] === "M" ? (n = [s], r += 1) : n.push(s), t[r] = n;
  }), t;
}, Gt = (e) => {
  let t = new w();
  const { origin: n } = e, [r, s] = n, { translate: i } = e, { rotate: c } = e, { skew: l } = e, { scale: a } = e;
  return Array.isArray(i) && i.length >= 2 && i.every((o) => !Number.isNaN(+o)) && i.some((o) => o !== 0) ? t = t.translate(...i) : typeof i == "number" && !Number.isNaN(i) && (t = t.translate(i)), (c || l || a) && (t = t.translate(r, s), Array.isArray(c) && c.length >= 2 && c.every((o) => !Number.isNaN(+o)) && c.some((o) => o !== 0) ? t = t.rotate(...c) : typeof c == "number" && !Number.isNaN(c) && (t = t.rotate(c)), Array.isArray(l) && l.length === 2 && l.every((o) => !Number.isNaN(+o)) && l.some((o) => o !== 0) ? (t = l[0] ? t.skewX(l[0]) : t, t = l[1] ? t.skewY(l[1]) : t) : typeof l == "number" && !Number.isNaN(l) && (t = t.skewX(l)), Array.isArray(a) && a.length >= 2 && a.every((o) => !Number.isNaN(+o)) && a.some((o) => o !== 1) ? t = t.scale(...a) : typeof a == "number" && !Number.isNaN(a) && (t = t.scale(a)), t = t.translate(-r, -s)), t;
}, wt = (e) => {
  if (_t(e))
    return e.slice(0);
  const t = R(e);
  let n = 0, r = 0, s = 0, i = 0;
  return t.map((c) => {
    const l = c.slice(1).map(Number), [a] = c, o = a.toLowerCase();
    if (a === "M")
      return [n, r] = l, s = n, i = r, ["M", n, r];
    let m = [];
    if (a !== o)
      if (o === "a")
        m = [
          o,
          l[0],
          l[1],
          l[2],
          l[3],
          l[4],
          l[5] - n,
          l[6] - r
        ];
      else if (o === "v")
        m = [o, l[0] - r];
      else if (o === "h")
        m = [o, l[0] - n];
      else {
        const y = l.map((g, f) => g - (f % 2 ? r : n));
        m = [o, ...y];
      }
    else
      a === "m" && (s = l[0] + n, i = l[1] + r), m = [o, ...l];
    const u = m.length;
    return o === "z" ? (n = s, r = i) : o === "h" ? n += m[1] : o === "v" ? r += m[1] : (n += m[u - 2], r += m[u - 1]), m;
  });
}, Ee = (e, t, n, r) => {
  const [s] = e, i = (p) => Math.round(p * 10 ** 4) / 10 ** 4, c = e.slice(1).map((p) => +p), l = t.slice(1).map((p) => +p), { x1: a, y1: o, x2: m, y2: u, x: y, y: g } = n;
  let f = e;
  const [h, x] = l.slice(-2);
  if ("TQ".includes(s) || (n.qx = null, n.qy = null), ["V", "H", "S", "T", "Z"].includes(s))
    f = [s, ...c];
  else if (s === "L")
    i(y) === i(h) ? f = ["V", x] : i(g) === i(x) && (f = ["H", h]);
  else if (s === "C") {
    const [p, d] = l;
    "CS".includes(r) && (i(p) === i(a * 2 - m) && i(d) === i(o * 2 - u) || i(a) === i(m * 2 - y) && i(o) === i(u * 2 - g)) && (f = ["S", ...l.slice(-4)]), n.x1 = p, n.y1 = d;
  } else if (s === "Q") {
    const [p, d] = l;
    n.qx = p, n.qy = d, "QT".includes(r) && (i(p) === i(a * 2 - m) && i(d) === i(o * 2 - u) || i(a) === i(m * 2 - y) && i(o) === i(u * 2 - g)) && (f = ["T", ...l.slice(-2)]);
  }
  return f;
}, qt = (e, t) => {
  const n = H(e), r = I(n), s = { ...et }, i = [], c = n.length;
  let l = "", a = "", o = 0, m = 0, u = 0, y = 0;
  for (let h = 0; h < c; h += 1) {
    [l] = n[h], i[h] = l, h && (a = i[h - 1]), n[h] = Ee(n[h], r[h], s, a);
    const x = n[h], p = x.length;
    switch (s.x1 = +x[p - 2], s.y1 = +x[p - 1], s.x2 = +x[p - 4] || s.x1, s.y2 = +x[p - 3] || s.y1, l) {
      case "Z":
        o = u, m = y;
        break;
      case "H":
        [, o] = x;
        break;
      case "V":
        [, m] = x;
        break;
      default:
        [o, m] = x.slice(-2).map(Number), l === "M" && (u = o, y = m);
    }
    s.x = o, s.y = m;
  }
  const g = ht(n, t), f = ht(wt(n), t);
  return g.map((h, x) => x ? h.join("").length < f[x].join("").length ? h : f[x] : h);
}, je = (e) => {
  const t = e.slice(1).map(
    (n, r, s) => r ? [...s[r - 1].slice(-2), ...n.slice(1)] : [...e[0].slice(1), ...n.slice(1)]
  ).map((n) => n.map((r, s) => n[n.length - s - 2 * (1 - s % 2)])).reverse();
  return [["M", ...t[0].slice(0, 2)], ...t.map((n) => ["C", ...n.slice(2)])];
}, ct = (e) => {
  const t = H(e), n = t.slice(-1)[0][0] === "Z", r = I(t).map((s, i) => {
    const [c, l] = s.slice(-2).map(Number);
    return {
      seg: t[i],
      // absolute
      n: s,
      // normalized
      c: t[i][0],
      // pathCommand
      x: c,
      // x
      y: l
      // y
    };
  }).map((s, i, c) => {
    const l = s.seg, a = s.n, o = i && c[i - 1], m = c[i + 1], u = s.c, y = c.length, g = i ? c[i - 1].x : c[y - 1].x, f = i ? c[i - 1].y : c[y - 1].y;
    let h = [];
    switch (u) {
      case "M":
        h = n ? ["Z"] : [u, g, f];
        break;
      case "A":
        h = [u, ...l.slice(1, -3), l[5] === 1 ? 0 : 1, g, f];
        break;
      case "C":
        m && m.c === "S" ? h = ["S", l[1], l[2], g, f] : h = [u, l[3], l[4], l[1], l[2], g, f];
        break;
      case "S":
        o && "CS".includes(o.c) && (!m || m.c !== "S") ? h = ["C", a[3], a[4], a[1], a[2], g, f] : h = [u, a[1], a[2], g, f];
        break;
      case "Q":
        m && m.c === "T" ? h = ["T", g, f] : h = [u, ...l.slice(1, -2), g, f];
        break;
      case "T":
        o && "QT".includes(o.c) && (!m || m.c !== "T") ? h = ["Q", a[1], a[2], g, f] : h = [u, g, f];
        break;
      case "Z":
        h = ["M", g, f];
        break;
      case "H":
        h = [u, g];
        break;
      case "V":
        h = [u, f];
        break;
      default:
        h = [u, ...l.slice(1, -2), g, f];
    }
    return h;
  });
  return n ? r.reverse() : [r[0], ...r.slice(1).reverse()];
}, Ie = (e, t) => {
  let n = w.Translate(...t.slice(0, -1));
  return [, , , n.m44] = t, n = e.multiply(n), [n.m41, n.m42, n.m43, n.m44];
}, zt = (e, t, n) => {
  const [r, s, i] = n, [c, l, a] = Ie(e, [...t, 0, 1]), o = c - r, m = l - s, u = a - i;
  return [
    // protect against division by ZERO
    o * (Math.abs(i) / Math.abs(u) || 1) + r,
    m * (Math.abs(i) / Math.abs(u) || 1) + s
  ];
}, te = (e) => {
  const t = ft(e) ? e : H(e), n = yt(t) ? t : I(t), r = { ...et }, s = [];
  let i = [], c = 0, l = "";
  const a = [];
  let o = 0, m = t.length;
  for (o = 0; o < m; o += 1)
    t[o] && ([l] = t[o]), s[o] = l, l === "A" && (i = lt(n[o], r), t[o] = lt(n[o], r), Nt(t, s, o), n[o] = lt(n[o], r), Nt(n, s, o), m = Math.max(t.length, n.length)), i = n[o], c = i.length, r.x1 = +i[c - 2], r.y1 = +i[c - 1], r.x2 = +i[c - 4] || r.x1, r.y2 = +i[c - 3] || r.y1, a.push(t[o]);
  return a;
}, Ot = (e, t) => {
  let n = 0, r = 0, s, i, c, l, a, o;
  const m = te(e), u = t && Object.keys(t);
  if (!t || u && !u.length) return m.slice(0);
  const y = I(m);
  if (!t.origin) {
    const { origin: b } = P;
    Object.assign(t, { origin: b });
  }
  const g = Gt(t), { origin: f } = t, h = { ...et };
  let x = [], p = 0, d = "";
  const A = [];
  if (!g.isIdentity) {
    for (s = 0, c = m.length; s < c; s += 1) {
      x = y[s], p = x.length, h.x1 = +x[p - 2], h.y1 = +x[p - 1], h.x2 = +x[p - 4] || h.x1, h.y2 = +x[p - 3] || h.y1;
      const b = {
        s: m[s],
        c: m[s][0],
        x: h.x1,
        y: h.y1
      };
      A.push(b);
    }
    return A.map((b) => {
      if (d = b.c, x = b.s, d === "L" || d === "H" || d === "V")
        return [a, o] = zt(g, [b.x, b.y], f), n !== a && r !== o ? x = ["L", a, o] : r === o ? x = ["H", a] : n === a && (x = ["V", o]), n = a, r = o, x;
      for (i = 1, l = x.length; i < l; i += 2)
        [n, r] = zt(g, [+x[i], +x[i + 1]], f), x[i] = n, x[i + 1] = r;
      return x;
    });
  }
  return m.slice(0);
}, De = (e) => {
  const n = e.slice(0, 2), r = e.slice(2, 4), s = e.slice(4, 6), i = e.slice(6, 8), c = j(n, r, 0.5), l = j(r, s, 0.5), a = j(s, i, 0.5), o = j(c, l, 0.5), m = j(l, a, 0.5), u = j(o, m, 0.5);
  return [
    ["C", ...c, ...o, ...u],
    ["C", ...m, ...a, ...i]
  ];
};
class v {
  /**
   * @constructor
   * @param pathValue the path string
   * @param config instance options
   */
  constructor(t, n) {
    const r = n || {}, s = typeof t > "u";
    if (s || !t.length)
      throw TypeError(`${$}: "pathValue" is ${s ? "undefined" : "empty"}`);
    const i = R(t);
    this.segments = i;
    const { width: c, height: l, cx: a, cy: o, cz: m } = this.getBBox(20), { round: u, origin: y } = r;
    let g;
    if (u === "auto") {
      const h = `${Math.floor(Math.max(c, l))}`.length;
      g = h >= 4 ? 0 : 4 - h;
    } else Number.isInteger(u) || u === "off" ? g = u : g = P.round;
    let f;
    if (Array.isArray(y) && y.length >= 2) {
      const [h, x, p] = y.map(Number);
      f = [
        Number.isNaN(h) ? a : h,
        Number.isNaN(x) ? o : x,
        Number.isNaN(p) ? m : p
      ];
    } else
      f = [a, o, m];
    return this.round = g, this.origin = f, this;
  }
  /**
   * Returns the path bounding box, equivalent to native `path.getBBox()`.
   *
   * @public
   * @param sampleSize the scan resolution
   * @returns the pathBBox
   */
  getBBox(t = P.sampleSize) {
    return $t(this.segments, t);
  }
  /**
   * Returns the total path length, equivalent to native `path.getTotalLength()`.
   *
   * @public
   * @param sampleSize the scan resolution
   * @returns the path total length
   */
  getTotalLength(t = P.sampleSize) {
    return Q(this.segments, t);
  }
  /**
   * Returns an `{x,y}` point in the path stroke at a given length,
   * equivalent to the native `path.getPointAtLength()`.
   *
   * @public
   * @param length the length
   * @param sampleSize the scan resolution
   * @returns the requested point
   */
  getPointAtLength(t, n = P.sampleSize) {
    return _(this.segments, t, n);
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
    return this.segments = wt(t), this;
  }
  /**
   * Convert path to cubic-bezier values. In addition, un-necessary `Z`
   * segment is removed if previous segment extends to the `M` segment.
   *
   * @public
   */
  toCurve() {
    const { segments: t } = this;
    return this.segments = at(t), this;
  }
  /**
   * Reverse the order of the segments and their values.
   *
   * @param onlySubpath option to reverse all sub-paths except first
   * @public
   */
  reverse(t) {
    this.toAbsolute();
    const { segments: n } = this, r = kt(n), s = r.length > 1 ? r : !1, i = s ? [...s].map((l, a) => t ? a ? ct(l) : [...l] : ct(l)) : [...n];
    let c = [];
    return s ? c = i.flat(1) : c = t ? n : ct(n), this.segments = [...c], this;
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
    return this.segments = I(t), this;
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
    return this.segments = qt(t, this.round), this;
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
      origin: [r, s, i]
    } = this, c = {};
    for (const [a, o] of Object.entries(t))
      a === "skew" && Array.isArray(o) || (a === "rotate" || a === "translate" || a === "origin" || a === "scale") && Array.isArray(o) ? c[a] = o.map(Number) : a !== "origin" && typeof Number(o) == "number" && (c[a] = Number(o));
    const { origin: l } = c;
    if (Array.isArray(l) && l.length >= 2) {
      const [a, o, m] = l.map(Number);
      c.origin = [Number.isNaN(a) ? r : a, Number.isNaN(o) ? s : o, m || i];
    } else
      c.origin = [r, s, i];
    return this.segments = Ot(n, c), this;
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
    return vt(this.segments, this.round);
  }
}
// bring main utilities to front
N(v, "CSSMatrix", w), N(v, "getSVGMatrix", Gt), N(v, "getPathBBox", $t), N(v, "getPathArea", Kt), N(v, "getTotalLength", Q), N(v, "getDrawDirection", we), N(v, "getPointAtLength", _), N(v, "pathLengthFactory", gt), N(v, "getPropertiesAtLength", Pt), N(v, "getPropertiesAtPoint", xt), N(v, "polygonLength", he), N(v, "polygonArea", me), N(v, "getClosestPoint", Pe), N(v, "getSegmentOfPoint", Ce), N(v, "getSegmentAtLength", Te), N(v, "isPointInStroke", Le), N(v, "isValidPath", Vt), N(v, "isPathArray", W), N(v, "isAbsoluteArray", ft), N(v, "isRelativeArray", _t), N(v, "isCurveArray", Jt), N(v, "isNormalizedArray", yt), N(v, "shapeToPath", Oe), N(v, "shapeToPathArray", Wt), N(v, "parsePathString", R), N(v, "roundPath", ht), N(v, "splitPath", kt), N(v, "splitCubic", De), N(v, "replaceArc", te), N(v, "optimizePath", qt), N(v, "reverseCurve", je), N(v, "reversePath", ct), N(v, "normalizePath", I), N(v, "transformPath", Ot), N(v, "pathToAbsolute", H), N(v, "pathToRelative", wt), N(v, "pathToCurve", at), N(v, "pathToString", vt);
export {
  v as default
};
//# sourceMappingURL=svg-path-commander.mjs.map
