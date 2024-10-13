var he = Object.defineProperty;
var fe = (e, t, n) => t in e ? he(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var N = (e, t, n) => fe(e, typeof t != "symbol" ? t + "" : t, n);
const st = {
  origin: [0, 0, 0],
  round: 4
}, E = "SVGPathCommander Error", tt = {
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
}, $t = (e) => {
  let t = e.pathValue[e.segmentStart], n = t.toLowerCase();
  const { data: r } = e;
  for (; r.length >= tt[n] && (n === "m" && r.length > 2 ? (e.segments.push([t, ...r.splice(0, 2)]), n = "l", t = t === "m" ? "l" : "L") : e.segments.push([t, ...r.splice(0, tt[n])]), !!tt[n]); )
    ;
}, ye = (e) => {
  const { index: t, pathValue: n } = e, r = n.charCodeAt(t);
  if (r === 48) {
    e.param = 0, e.index += 1;
    return;
  }
  if (r === 49) {
    e.param = 1, e.index += 1;
    return;
  }
  e.err = `${E}: invalid Arc flag "${n[t]}", expecting 0 or 1 at index ${t}`;
}, F = (e) => e >= 48 && e <= 57, U = "Invalid path value", ge = (e) => {
  const { max: t, pathValue: n, index: r } = e;
  let s = r, i = !1, o = !1, c = !1, l = !1, a;
  if (s >= t) {
    e.err = `${E}: ${U} at index ${s}, "pathValue" is missing param`;
    return;
  }
  if (a = n.charCodeAt(s), (a === 43 || a === 45) && (s += 1, a = n.charCodeAt(s)), !F(a) && a !== 46) {
    e.err = `${E}: ${U} at index ${s}, "${n[s]}" is not a number`;
    return;
  }
  if (a !== 46) {
    if (i = a === 48, s += 1, a = n.charCodeAt(s), i && s < t && a && F(a)) {
      e.err = `${E}: ${U} at index ${r}, "${n[r]}" illegal number`;
      return;
    }
    for (; s < t && F(n.charCodeAt(s)); )
      s += 1, o = !0;
    a = n.charCodeAt(s);
  }
  if (a === 46) {
    for (l = !0, s += 1; F(n.charCodeAt(s)); )
      s += 1, c = !0;
    a = n.charCodeAt(s);
  }
  if (a === 101 || a === 69) {
    if (l && !o && !c) {
      e.err = `${E}: ${U} at index ${s}, "${n[s]}" invalid float exponent`;
      return;
    }
    if (s += 1, a = n.charCodeAt(s), (a === 43 || a === 45) && (s += 1), s < t && F(n.charCodeAt(s)))
      for (; s < t && F(n.charCodeAt(s)); )
        s += 1;
    else {
      e.err = `${E}: ${U} at index ${s}, "${n[s]}" invalid integer exponent`;
      return;
    }
  }
  e.index = s, e.param = +e.pathValue.slice(r, s);
}, xe = (e) => [
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
].includes(e), et = (e) => {
  const { pathValue: t, max: n } = e;
  for (; e.index < n && xe(t.charCodeAt(e.index)); )
    e.index += 1;
}, pe = (e) => {
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
}, de = (e) => F(e) || e === 43 || e === 45 || e === 46, Me = (e) => (e | 32) === 97, be = (e) => {
  switch (e | 32) {
    case 109:
    case 77:
      return !0;
    default:
      return !1;
  }
}, Qt = (e) => {
  var l;
  const { max: t, pathValue: n, index: r, segments: s } = e, i = n.charCodeAt(r), o = tt[n[r].toLowerCase()];
  if (e.segmentStart = r, !pe(i)) {
    e.err = `${E}: ${U} "${n[r]}" is not a path command at index ${r}`;
    return;
  }
  const c = s[s.length - 1];
  if (!be(i) && ((l = c == null ? void 0 : c[0]) == null ? void 0 : l.toLocaleLowerCase()) === "z") {
    e.err = `${E}: ${U} "${n[r]}" is not a MoveTo path command at index ${r}`;
    return;
  }
  if (e.index += 1, et(e), e.data = [], !o) {
    $t(e);
    return;
  }
  for (; ; ) {
    for (let a = o; a > 0; a -= 1) {
      if (Me(i) && (a === 3 || a === 4) ? ye(e) : ge(e), e.err.length)
        return;
      e.data.push(e.param), et(e), e.index < t && n.charCodeAt(e.index) === 44 && (e.index += 1, et(e));
    }
    if (e.index >= e.max || !de(n.charCodeAt(e.index)))
      break;
  }
  $t(e);
};
class Xt {
  constructor(t) {
    this.segments = [], this.pathValue = t, this.max = t.length, this.index = 0, this.param = 0, this.segmentStart = 0, this.data = [], this.err = "";
  }
}
const q = (e) => {
  if (typeof e != "string")
    return e.slice(0);
  const t = new Xt(e);
  for (et(t); t.index < t.max && !t.err.length; )
    Qt(t);
  if (t != null && t.err.length)
    throw TypeError(t.err);
  return t.segments;
}, we = (e) => {
  const t = e.length;
  let n = -1, r, s = e[t - 1], i = 0;
  for (; ++n < t; )
    r = s, s = e[n], i += r[1] * s[0] - r[0] * s[1];
  return i / 2;
}, Pt = (e, t) => Math.sqrt((e[0] - t[0]) * (e[0] - t[0]) + (e[1] - t[1]) * (e[1] - t[1])), Ne = (e) => e.reduce((t, n, r) => r ? t + Pt(e[r - 1], n) : 0, 0);
var Ae = Object.defineProperty, Ce = (e, t, n) => t in e ? Ae(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, k = (e, t, n) => Ce(e, typeof t != "symbol" ? t + "" : t, n);
const ve = {
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
}, Bt = (e) => (e instanceof Float64Array || e instanceof Float32Array || Array.isArray(e) && e.every((t) => typeof t == "number")) && [6, 16].some((t) => e.length === t), Yt = (e) => e instanceof DOMMatrix || e instanceof v || typeof e == "object" && Object.keys(ve).every((t) => e && t in e), it = (e) => {
  const t = new v(), n = Array.from(e);
  if (!Bt(n))
    throw TypeError(`CSSMatrix: "${n.join(",")}" must be an array with 6/16 numbers.`);
  if (n.length === 16) {
    const [r, s, i, o, c, l, a, m, u, g, f, h, y, x, p, d] = n;
    t.m11 = r, t.a = r, t.m21 = c, t.c = c, t.m31 = u, t.m41 = y, t.e = y, t.m12 = s, t.b = s, t.m22 = l, t.d = l, t.m32 = g, t.m42 = x, t.f = x, t.m13 = i, t.m23 = a, t.m33 = f, t.m43 = p, t.m14 = o, t.m24 = m, t.m34 = h, t.m44 = d;
  } else if (n.length === 6) {
    const [r, s, i, o, c, l] = n;
    t.m11 = r, t.a = r, t.m12 = s, t.b = s, t.m21 = i, t.c = i, t.m22 = o, t.d = o, t.m41 = c, t.e = c, t.m42 = l, t.f = l;
  }
  return t;
}, Ht = (e) => {
  if (Yt(e))
    return it([
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
  let n = new v();
  const r = `CSSMatrix: invalid transform string "${e}"`;
  return t.split(")").filter((s) => s).forEach((s) => {
    const [i, o] = s.split("(");
    if (!o) throw TypeError(r);
    const c = o.split(",").map((h) => h.includes("rad") ? parseFloat(h) * (180 / Math.PI) : parseFloat(h)), [l, a, m, u] = c, g = [l, a, m], f = [l, a, m, u];
    if (i === "perspective" && l && [a, m].every((h) => h === void 0))
      n.m34 = -1 / l;
    else if (i.includes("matrix") && [6, 16].includes(c.length) && c.every((h) => !Number.isNaN(+h))) {
      const h = c.map((y) => Math.abs(y) < 1e-6 ? 0 : y);
      n = n.multiply(it(h));
    } else if (i === "translate3d" && g.every((h) => !Number.isNaN(+h)))
      n = n.translate(l, a, m);
    else if (i === "translate" && l && m === void 0)
      n = n.translate(l, a || 0, 0);
    else if (i === "rotate3d" && f.every((h) => !Number.isNaN(+h)) && u)
      n = n.rotateAxisAngle(l, a, m, u);
    else if (i === "rotate" && l && [a, m].every((h) => h === void 0))
      n = n.rotate(0, 0, l);
    else if (i === "scale3d" && g.every((h) => !Number.isNaN(+h)) && g.some((h) => h !== 1))
      n = n.scale(l, a, m);
    else if (i === "scale" && !Number.isNaN(l) && l !== 1 && m === void 0) {
      const h = Number.isNaN(+a) ? l : a;
      n = n.scale(l, h, 1);
    } else if (i === "skew" && (l || !Number.isNaN(l) && a) && m === void 0)
      n = n.skew(l, a || 0);
    else if (["translate", "rotate", "scale", "skew"].some((h) => i.includes(h)) && /[XYZ]/.test(i) && l && [a, m].every((h) => h === void 0))
      if (i === "skewX" || i === "skewY")
        n = n[i](l);
      else {
        const h = i.replace(/[XYZ]/, ""), y = i.replace(h, ""), x = ["X", "Y", "Z"].indexOf(y), p = h === "scale" ? 1 : 0, d = [x === 0 ? l : p, x === 1 ? l : p, x === 2 ? l : p];
        n = n[h](...d);
      }
    else
      throw TypeError(r);
  }), n;
}, wt = (e, t) => t ? [e.a, e.b, e.c, e.d, e.e, e.f] : [
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
], Ut = (e, t, n) => {
  const r = new v();
  return r.m41 = e, r.e = e, r.m42 = t, r.f = t, r.m43 = n, r;
}, Vt = (e, t, n) => {
  const r = new v(), s = Math.PI / 180, i = e * s, o = t * s, c = n * s, l = Math.cos(i), a = -Math.sin(i), m = Math.cos(o), u = -Math.sin(o), g = Math.cos(c), f = -Math.sin(c), h = m * g, y = -m * f;
  r.m11 = h, r.a = h, r.m12 = y, r.b = y, r.m13 = u;
  const x = a * u * g + l * f;
  r.m21 = x, r.c = x;
  const p = l * g - a * u * f;
  return r.m22 = p, r.d = p, r.m23 = -a * m, r.m31 = a * f - l * u * g, r.m32 = a * g + l * u * f, r.m33 = l * m, r;
}, _t = (e, t, n, r) => {
  const s = new v(), i = Math.sqrt(e * e + t * t + n * n);
  if (i === 0)
    return s;
  const o = e / i, c = t / i, l = n / i, a = r * (Math.PI / 360), m = Math.sin(a), u = Math.cos(a), g = m * m, f = o * o, h = c * c, y = l * l, x = 1 - 2 * (h + y) * g;
  s.m11 = x, s.a = x;
  const p = 2 * (o * c * g + l * m * u);
  s.m12 = p, s.b = p, s.m13 = 2 * (o * l * g - c * m * u);
  const d = 2 * (c * o * g - l * m * u);
  s.m21 = d, s.c = d;
  const C = 1 - 2 * (y + f) * g;
  return s.m22 = C, s.d = C, s.m23 = 2 * (c * l * g + o * m * u), s.m31 = 2 * (l * o * g + c * m * u), s.m32 = 2 * (l * c * g - o * m * u), s.m33 = 1 - 2 * (f + h) * g, s;
}, Jt = (e, t, n) => {
  const r = new v();
  return r.m11 = e, r.a = e, r.m22 = t, r.d = t, r.m33 = n, r;
}, yt = (e, t) => {
  const n = new v();
  if (e) {
    const r = e * Math.PI / 180, s = Math.tan(r);
    n.m21 = s, n.c = s;
  }
  if (t) {
    const r = t * Math.PI / 180, s = Math.tan(r);
    n.m12 = s, n.b = s;
  }
  return n;
}, Kt = (e) => yt(e, 0), Wt = (e) => yt(0, e), j = (e, t) => {
  const n = t.m11 * e.m11 + t.m12 * e.m21 + t.m13 * e.m31 + t.m14 * e.m41, r = t.m11 * e.m12 + t.m12 * e.m22 + t.m13 * e.m32 + t.m14 * e.m42, s = t.m11 * e.m13 + t.m12 * e.m23 + t.m13 * e.m33 + t.m14 * e.m43, i = t.m11 * e.m14 + t.m12 * e.m24 + t.m13 * e.m34 + t.m14 * e.m44, o = t.m21 * e.m11 + t.m22 * e.m21 + t.m23 * e.m31 + t.m24 * e.m41, c = t.m21 * e.m12 + t.m22 * e.m22 + t.m23 * e.m32 + t.m24 * e.m42, l = t.m21 * e.m13 + t.m22 * e.m23 + t.m23 * e.m33 + t.m24 * e.m43, a = t.m21 * e.m14 + t.m22 * e.m24 + t.m23 * e.m34 + t.m24 * e.m44, m = t.m31 * e.m11 + t.m32 * e.m21 + t.m33 * e.m31 + t.m34 * e.m41, u = t.m31 * e.m12 + t.m32 * e.m22 + t.m33 * e.m32 + t.m34 * e.m42, g = t.m31 * e.m13 + t.m32 * e.m23 + t.m33 * e.m33 + t.m34 * e.m43, f = t.m31 * e.m14 + t.m32 * e.m24 + t.m33 * e.m34 + t.m34 * e.m44, h = t.m41 * e.m11 + t.m42 * e.m21 + t.m43 * e.m31 + t.m44 * e.m41, y = t.m41 * e.m12 + t.m42 * e.m22 + t.m43 * e.m32 + t.m44 * e.m42, x = t.m41 * e.m13 + t.m42 * e.m23 + t.m43 * e.m33 + t.m44 * e.m43, p = t.m41 * e.m14 + t.m42 * e.m24 + t.m43 * e.m34 + t.m44 * e.m44;
  return it([n, r, s, i, o, c, l, a, m, u, g, f, h, y, x, p]);
};
class v {
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
    return typeof t == "string" && t.length && t !== "none" ? Ft(t) : Array.isArray(t) || t instanceof Float64Array || t instanceof Float32Array ? it(t) : typeof t == "object" ? Ht(t) : this;
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
    return Float32Array.from(wt(this, t));
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
    return Float64Array.from(wt(this, t));
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
    return j(this, t);
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
    let i = n, o = r;
    return typeof i > "u" && (i = 0), typeof o > "u" && (o = 0), j(this, Ut(s, i, o));
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
    let i = n, o = r;
    return typeof i > "u" && (i = t), typeof o > "u" && (o = 1), j(this, Jt(s, i, o));
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
    let s = t, i = n || 0, o = r || 0;
    return typeof t == "number" && typeof n > "u" && typeof r > "u" && (o = s, s = 0, i = 0), j(this, Vt(s, i, o));
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
    return j(this, _t(t, n, r, s));
  }
  /**
   * Specifies a skew transformation along the `x-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param angle The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skewX(t) {
    return j(this, Kt(t));
  }
  /**
   * Specifies a skew transformation along the `y-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param angle The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skewY(t) {
    return j(this, Wt(t));
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
    return j(this, yt(t, n));
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
k(v, "Translate", Ut), k(v, "Rotate", Vt), k(v, "RotateAxisAngle", _t), k(v, "Scale", Jt), k(v, "SkewX", Kt), k(v, "SkewY", Wt), k(v, "Skew", yt), k(v, "Multiply", j), k(v, "fromArray", it), k(v, "fromMatrix", Ht), k(v, "fromString", Ft), k(v, "toArray", wt), k(v, "isCompatibleArray", Bt), k(v, "isCompatibleObject", Yt);
const gt = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  x: 0,
  y: 0,
  qx: null,
  qy: null
}, D = (e, t) => {
  const n = { ...gt };
  let r = e.length, s;
  for (let i = 0; i < r; i += 1) {
    s = e[i];
    const o = t(s, n, i);
    e[i] = o, o[0] === "C" && (r = e.length), s = e[i];
    const c = s.length;
    n.x1 = +s[c - 2], n.y1 = +s[c - 1], n.x2 = +s[c - 4] || n.x1, n.y2 = +s[c - 3] || n.y1;
  }
  return e;
}, V = (e, t) => {
  const [n] = e, { x: r, y: s } = t, i = e.slice(1).map(Number), o = n.toUpperCase();
  if (!(o === n)) {
    if (o === "A")
      return [
        o,
        i[0],
        i[1],
        i[2],
        i[3],
        i[4],
        i[5] + r,
        i[6] + s
      ];
    if (o === "V")
      return [o, i[0] + s];
    if (o === "H")
      return [o, i[0] + r];
    {
      const l = i.map((a, m) => a + (m % 2 ? s : r));
      return [o, ...l];
    }
  }
  return e;
}, G = (e, t) => {
  const [n] = e, { x1: r, y1: s, x2: i, y2: o } = t, c = e.slice(1).map(Number);
  if ("TQ".includes(n) || (t.qx = null, t.qy = null), n === "H")
    return ["L", e[1], s];
  if (n === "V")
    return ["L", r, e[1]];
  if (n === "S") {
    const l = r * 2 - i, a = s * 2 - o;
    return t.x1 = l, t.y1 = a, ["C", l, a, ...c];
  } else if (n === "T") {
    const l = r * 2 - (t.qx ? t.qx : (
      /* istanbul ignore next */
      0
    )), a = s * 2 - (t.qy ? t.qy : (
      /* istanbul ignore next */
      0
    ));
    return t.qx = l, t.qy = a, ["Q", l, a, ...c];
  } else if (n === "Q") {
    const [l, a] = c;
    t.qx = l, t.qy = a;
  }
  return e;
}, R = (e, t, n) => {
  const [r, s] = e, [i, o] = t;
  return [r + (i - r) * n, s + (o - s) * n];
}, at = (e, t, n, r) => Pt([e, t], [n, r]), Gt = (e, t, n, r, s) => {
  const i = Pt([e, t], [n, r]);
  let o = { x: e, y: t };
  if (typeof s == "number")
    if (s <= 0)
      o = { x: e, y: t };
    else if (s >= i)
      o = { x: n, y: r };
    else {
      const [c, l] = R([e, t], [n, r], s / i);
      o = { x: c, y: l };
    }
  return o;
}, kt = (e, t, n, r) => {
  const { min: s, max: i } = Math;
  return {
    min: {
      x: s(e, n),
      y: s(t, r)
    },
    max: {
      x: i(e, n),
      y: i(t, r)
    }
  };
}, te = (e, t, n) => {
  const r = n / 2, s = Math.sin(r), i = Math.cos(r), o = e ** 2 * s ** 2, c = t ** 2 * i ** 2, l = Math.sqrt(o + c) * n;
  return Math.abs(l);
}, K = (e, t, n, r, s, i) => {
  const o = Math.cos(i), c = Math.sin(i), l = r * Math.cos(e), a = s * Math.sin(e);
  return {
    x: t + o * l - c * a,
    y: n + c * l + o * a
  };
}, qt = (e, t) => {
  const { x: n, y: r } = e, { x: s, y: i } = t, o = n * s + r * i, c = Math.sqrt((n ** 2 + r ** 2) * (s ** 2 + i ** 2));
  return (n * i - r * s < 0 ? -1 : 1) * Math.acos(o / c);
}, Lt = (e, t, n, r, s, i, o, c, l) => {
  const { abs: a, sin: m, cos: u, sqrt: g, PI: f } = Math;
  let h = a(n), y = a(r);
  const p = (s % 360 + 360) % 360 * (f / 180);
  if (e === c && t === l)
    return {
      rx: h,
      ry: y,
      startAngle: 0,
      endAngle: 0,
      center: { x: c, y: l }
    };
  if (h === 0 || y === 0)
    return {
      rx: h,
      ry: y,
      startAngle: 0,
      endAngle: 0,
      center: { x: c, y: l }
    };
  const d = (e - c) / 2, C = (t - l) / 2, M = {
    x: u(p) * d + m(p) * C,
    y: -m(p) * d + u(p) * C
  }, b = M.x ** 2 / h ** 2 + M.y ** 2 / y ** 2;
  b > 1 && (h *= g(b), y *= g(b));
  const w = h ** 2 * y ** 2 - h ** 2 * M.y ** 2 - y ** 2 * M.x ** 2, T = h ** 2 * M.y ** 2 + y ** 2 * M.x ** 2;
  let P = w / T;
  P = P < 0 ? 0 : P;
  const $ = (i !== o ? 1 : -1) * g(P), S = {
    x: $ * (h * M.y / y),
    y: $ * (-(y * M.x) / h)
  }, _ = {
    x: u(p) * S.x - m(p) * S.y + (e + c) / 2,
    y: m(p) * S.x + u(p) * S.y + (t + l) / 2
  }, X = {
    x: (M.x - S.x) / h,
    y: (M.y - S.y) / y
  }, Q = qt({ x: 1, y: 0 }, X), B = {
    x: (-M.x - S.x) / h,
    y: (-M.y - S.y) / y
  };
  let I = qt(X, B);
  !o && I > 0 ? I -= 2 * f : o && I < 0 && (I += 2 * f), I %= 2 * f;
  const J = Q + I;
  return {
    center: _,
    startAngle: Q,
    endAngle: J,
    rx: h,
    ry: y
  };
}, ee = (e, t, n, r, s, i, o, c, l) => {
  const { rx: a, ry: m, startAngle: u, endAngle: g } = Lt(e, t, n, r, s, i, o, c, l);
  return te(a, m, g - u);
}, Pe = (e, t, n, r, s, i, o, c, l, a) => {
  let m = { x: e, y: t };
  const { center: u, rx: g, ry: f, startAngle: h, endAngle: y } = Lt(e, t, n, r, s, i, o, c, l), x = te(g, f, y - h);
  if (typeof a == "number")
    if (a <= 0)
      m = { x: e, y: t };
    else if (a >= x)
      m = { x: c, y: l };
    else {
      if (e === c && t === l)
        return { x: c, y: l };
      if (g === 0 || f === 0)
        return Gt(e, t, c, l, a);
      const { PI: p, cos: d, sin: C } = Math, M = y - h, w = (s % 360 + 360) % 360 * (p / 180), T = h + M * (a / x), P = g * d(T), $ = f * C(T);
      m = {
        x: d(w) * P - C(w) * $ + u.x,
        y: C(w) * P + d(w) * $ + u.y
      };
    }
  return m;
}, Le = (e, t, n, r, s, i, o, c, l) => {
  const { center: a, rx: m, ry: u, startAngle: g, endAngle: f } = Lt(e, t, n, r, s, i, o, c, l), h = f - g, y = { x: c, y: l }, [x, p] = [a.x, a.y], d = [y], C = s * Math.PI / 180, M = Math.tan(C), b = Math.atan2(-u * M, m), w = b, T = b + Math.PI, P = Math.atan2(u, m * M), $ = P + Math.PI, S = [e, c], _ = [t, l], X = Math.min(...S), Q = Math.max(...S), B = Math.min(..._), I = Math.max(..._), J = f - h * 1e-3, z = K(J, x, p, m, u, C), ot = f - h * 0.999, Y = K(ot, x, p, m, u, C);
  return (z.x > Q || Y.x > Q) && d.push(K(w, x, p, m, u, C)), (z.x < X || Y.x < X) && d.push(K(T, x, p, m, u, C)), (z.y < B || Y.y < B) && d.push(K($, x, p, m, u, C)), (z.y > I || Y.y > I) && d.push(K(P, x, p, m, u, C)), {
    min: {
      x: Math.min(...d.map((O) => O.x)),
      y: Math.min(...d.map((O) => O.y))
    },
    max: {
      x: Math.max(...d.map((O) => O.x)),
      y: Math.max(...d.map((O) => O.y))
    }
  };
}, Te = { x: 0, y: 0 }, It = [
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
], Se = [
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
], $e = (e) => {
  const t = [];
  for (let n = e, r = n.length, s = r - 1; r > 1; r -= 1, s -= 1) {
    const i = [];
    for (let o = 0; o < s; o += 1)
      i.push({
        x: s * (n[o + 1].x - n[o].x),
        y: s * (n[o + 1].y - n[o].y),
        t: 0
      });
    t.push(i), n = i;
  }
  return t;
}, ke = (e, t) => {
  if (t === 0)
    return e[0].t = 0, e[0];
  const n = e.length - 1;
  if (t === 1)
    return e[n].t = 1, e[n];
  const r = 1 - t;
  let s = e;
  if (n === 0)
    return e[0].t = t, e[0];
  if (n === 1)
    return {
      x: r * s[0].x + t * s[1].x,
      y: r * s[0].y + t * s[1].y,
      t
    };
  const i = r * r, o = t * t;
  let c = 0, l = 0, a = 0, m = 0;
  return n === 2 ? (s = [s[0], s[1], s[2], Te], c = i, l = r * t * 2, a = o) : n === 3 && (c = i * r, l = i * t * 3, a = r * o * 3, m = t * o), {
    x: c * s[0].x + l * s[1].x + a * s[2].x + m * s[3].x,
    y: c * s[0].y + l * s[1].y + a * s[2].y + m * s[3].y,
    t
  };
}, qe = (e, t) => {
  const n = e(t), r = n.x * n.x + n.y * n.y;
  return Math.sqrt(r);
}, Ie = (e) => {
  const n = It.length;
  let r = 0;
  for (let s = 0, i; s < n; s++)
    i = 0.5 * It[s] + 0.5, r += Se[s] * qe(e, i);
  return 0.5 * r;
}, xt = (e) => {
  const t = [];
  for (let r = 0, s = e.length, i = 2; r < s; r += i)
    t.push({
      x: e[r],
      y: e[r + 1]
    });
  const n = $e(t);
  return Ie((r) => ke(n[0], r));
}, Ee = 1e-8, Nt = (e) => {
  const t = Math.min(e[0], e[2]), n = Math.max(e[0], e[2]);
  if (e[1] >= e[0] ? e[2] >= e[1] : e[2] <= e[1])
    return [t, n];
  const r = (e[0] * e[2] - e[1] * e[1]) / (e[0] - 2 * e[1] + e[2]);
  return r < t ? [r, n] : [t, r];
}, Et = (e) => {
  const t = e[0] - 3 * e[1] + 3 * e[2] - e[3];
  if (Math.abs(t) < Ee)
    return e[0] === e[3] && e[0] === e[1] ? [e[0], e[3]] : Nt([e[0], -0.5 * e[0] + 1.5 * e[1], e[0] - 3 * e[1] + 3 * e[2]]);
  const n = -e[0] * e[2] + e[0] * e[3] - e[1] * e[2] - e[1] * e[3] + e[1] * e[1] + e[2] * e[2];
  if (n <= 0)
    return [Math.min(e[0], e[3]), Math.max(e[0], e[3])];
  const r = Math.sqrt(n);
  let s = Math.min(e[0], e[3]), i = Math.max(e[0], e[3]);
  const o = e[0] - 2 * e[1] + e[2];
  for (let c = (o + r) / t, l = 1; l <= 2; c = (o - r) / t, l++)
    if (c > 0 && c < 1) {
      const a = e[0] * (1 - c) * (1 - c) * (1 - c) + e[1] * 3 * (1 - c) * (1 - c) * c + e[2] * 3 * (1 - c) * c * c + e[3] * c * c * c;
      a < s && (s = a), a > i && (i = a);
    }
  return [s, i];
}, ze = ([e, t, n, r, s, i, o, c], l) => {
  const a = 1 - l;
  return {
    x: a ** 3 * e + 3 * a ** 2 * l * n + 3 * a * l ** 2 * s + l ** 3 * o,
    y: a ** 3 * t + 3 * a ** 2 * l * r + 3 * a * l ** 2 * i + l ** 3 * c
  };
}, ne = (e, t, n, r, s, i, o, c) => xt([e, t, n, r, s, i, o, c]), Ze = (e, t, n, r, s, i, o, c, l) => {
  const a = typeof l == "number";
  let m = { x: e, y: t };
  if (a) {
    const u = xt([e, t, n, r, s, i, o, c]);
    l <= 0 || (l >= u ? m = { x: o, y: c } : m = ze([e, t, n, r, s, i, o, c], l / u));
  }
  return m;
}, Oe = (e, t, n, r, s, i, o, c) => {
  const l = Et([e, n, s, o]), a = Et([t, r, i, c]);
  return {
    min: { x: l[0], y: a[0] },
    max: { x: l[1], y: a[1] }
  };
}, je = ([e, t, n, r, s, i], o) => {
  const c = 1 - o;
  return {
    x: c ** 2 * e + 2 * c * o * n + o ** 2 * s,
    y: c ** 2 * t + 2 * c * o * r + o ** 2 * i
  };
}, se = (e, t, n, r, s, i) => xt([e, t, n, r, s, i]), Re = (e, t, n, r, s, i, o) => {
  const c = typeof o == "number";
  let l = { x: e, y: t };
  if (c) {
    const a = xt([e, t, n, r, s, i]);
    o <= 0 || (o >= a ? l = { x: s, y: i } : l = je([e, t, n, r, s, i], o / a));
  }
  return l;
}, De = (e, t, n, r, s, i) => {
  const o = Nt([e, n, s]), c = Nt([t, r, i]);
  return {
    min: { x: o[0], y: c[0] },
    max: { x: o[1], y: c[1] }
  };
}, zt = (e) => {
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
  const t = q(e);
  let n = [], r = "M", s = 0, i = 0, o = 0, c = 0;
  const l = [], a = [];
  let m = { x: s, y: i }, u = { x: s, y: i };
  D(t, (d, C) => {
    const M = V(d, C), b = G(M, C);
    return [r] = b, n = [s, i, ...b.slice(1)], r === "M" ? ([, o, c] = b, m = { x: o, y: c }, u = { x: o, y: c }) : r === "L" ? { min: m, max: u } = kt(...n) : r === "A" ? { min: m, max: u } = Le(...n) : r === "C" ? { min: m, max: u } = Oe(...n) : r === "Q" ? { min: m, max: u } = De(...n) : r === "Z" && (n = [s, i, o, c], { min: m, max: u } = kt(...n)), l.push(m), a.push(u), r === "Z" ? (s = o, i = c) : ([s, i] = b.slice(-2), r === "M" && (o = s, c = i)), C.x = s, C.y = i, b;
  });
  const g = Math.min(...l.map((d) => d.x)), f = Math.max(...a.map((d) => d.x)), h = Math.min(...l.map((d) => d.y)), y = Math.max(...a.map((d) => d.y)), x = f - g, p = y - h;
  return {
    width: x,
    height: p,
    x: g,
    y: h,
    x2: f,
    y2: y,
    cx: g + x / 2,
    cy: h + p / 2,
    // an estimated guess
    cz: Math.max(x, p) + Math.min(x, p) / 2
  };
}, ct = (e, t, n) => {
  const r = e * Math.cos(n) - t * Math.sin(n), s = e * Math.sin(n) + t * Math.cos(n);
  return { x: r, y: s };
}, re = (e, t, n, r, s, i, o, c, l, a) => {
  let m = e, u = t, g = n, f = r, h = c, y = l;
  const x = Math.PI * 120 / 180, p = Math.PI / 180 * (+s || 0);
  let d = [], C, M, b, w, T;
  if (a)
    [M, b, w, T] = a;
  else {
    C = ct(m, u, -p), m = C.x, u = C.y, C = ct(h, y, -p), h = C.x, y = C.y;
    const L = (m - h) / 2, Z = (u - y) / 2;
    let H = L * L / (g * g) + Z * Z / (f * f);
    H > 1 && (H = Math.sqrt(H), g *= H, f *= H);
    const Mt = g * g, bt = f * f, St = (i === o ? -1 : 1) * Math.sqrt(Math.abs((Mt * bt - Mt * Z * Z - bt * L * L) / (Mt * Z * Z + bt * L * L)));
    w = St * g * Z / f + (m + h) / 2, T = St * -f * L / g + (u + y) / 2, M = Math.asin(((u - T) / f * 10 ** 9 >> 0) / 10 ** 9), b = Math.asin(((y - T) / f * 10 ** 9 >> 0) / 10 ** 9), M = m < w ? Math.PI - M : M, b = h < w ? Math.PI - b : b, M < 0 && (M = Math.PI * 2 + M), b < 0 && (b = Math.PI * 2 + b), o && M > b && (M -= Math.PI * 2), !o && b > M && (b -= Math.PI * 2);
  }
  let P = b - M;
  if (Math.abs(P) > x) {
    const L = b, Z = h, H = y;
    b = M + x * (o && b > M ? 1 : -1), h = w + g * Math.cos(b), y = T + f * Math.sin(b), d = re(h, y, g, f, s, 0, o, Z, H, [b, L, w, T]);
  }
  P = b - M;
  const $ = Math.cos(M), S = Math.sin(M), _ = Math.cos(b), X = Math.sin(b), Q = Math.tan(P / 4), B = 4 / 3 * g * Q, I = 4 / 3 * f * Q, J = [m, u], z = [m + B * S, u - I * $], ot = [h + B * X, y - I * _], Y = [h, y];
  if (z[0] = 2 * J[0] - z[0], z[1] = 2 * J[1] - z[1], a)
    return [...z, ...ot, ...Y, ...d];
  d = [...z, ...ot, ...Y, ...d];
  const O = [];
  for (let L = 0, Z = d.length; L < Z; L += 1)
    O[L] = L % 2 ? ct(d[L - 1], d[L], p).y : ct(d[L], d[L + 1], p).x;
  return O;
}, Qe = (e, t, n, r, s, i) => {
  const o = 0.3333333333333333, c = 2 / 3;
  return [
    o * e + c * n,
    // cpx1
    o * t + c * r,
    // cpy1
    o * s + c * n,
    // cpx2
    o * i + c * r,
    // cpy2
    s,
    i
    // x,y
  ];
}, Zt = (e, t, n, r) => {
  const s = R([e, t], [n, r], 0.3333333333333333), i = R([e, t], [n, r], 2 / 3);
  return [...s, ...i, n, r];
}, ie = (e, t) => {
  const [n] = e, r = e.slice(1).map(Number), [s, i] = r;
  let o;
  const { x1: c, y1: l, x: a, y: m } = t;
  return "TQ".includes(n) || (t.qx = null, t.qy = null), n === "M" ? (t.x = s, t.y = i, e) : n === "A" ? (o = [c, l, ...r], ["C", ...re(...o)]) : n === "Q" ? (t.qx = s, t.qy = i, o = [c, l, ...r], ["C", ...Qe(...o)]) : n === "L" ? ["C", ...Zt(c, l, s, i)] : n === "Z" ? ["C", ...Zt(c, l, a, m)] : e;
}, mt = (e) => {
  let t = 0, n = 0, r = 0, s = 0, i = "M";
  const o = q(e);
  return D(o, (c, l, a) => {
    const m = V(c, l);
    [i] = m;
    const u = i.toUpperCase(), g = G(m, l);
    let f = ie(g, l);
    return f[0] === "C" && f.length > 7 && (o.splice(a + 1, 0, ["C", ...f.slice(7)]), f = f.slice(0, 7)), u === "Z" ? (t = r, n = s) : ([t, n] = f.slice(-2), u === "M" && (r = t, s = n)), l.x = t, l.y = n, f;
  });
}, Xe = (e, t, n, r, s, i, o, c) => 3 * ((c - t) * (n + s) - (o - e) * (r + i) + r * (e - s) - n * (t - i) + c * (s + e / 3) - o * (i + t / 3)) / 20, oe = (e) => {
  let t = 0, n = 0, r = 0;
  return mt(e).map((s) => {
    switch (s[0]) {
      case "M":
        return [, t, n] = s, 0;
      default:
        return r = Xe(t, n, ...s.slice(1)), [t, n] = s.slice(-2), r;
    }
  }).reduce((s, i) => s + i, 0);
}, W = (e) => {
  const t = q(e);
  let n = !1, r = [], s = "M", i = 0, o = 0, c = 0, l = 0, a = 0;
  return D(t, (m, u) => {
    const g = V(m, u), f = G(g, u);
    return [s] = f, n = s === "M", r = n ? r : [i, o, ...f.slice(1)], n ? [, c, l] = m : s === "L" ? a += at(...r) : s === "A" ? a += ee(...r) : s === "C" ? a += ne(...r) : s === "Q" ? a += se(...r) : s === "Z" && (r = [i, o, c, l], a += at(...r)), s === "Z" ? (i = c, o = l) : ([i, o] = f.slice(-2), n && (c = i, l = o)), u.x = i, u.y = o, f;
  }), a;
}, Be = (e) => oe(mt(e)) >= 0, At = 1e-5, nt = (e, t) => {
  const n = q(e);
  let r = !1, s = [], i = "M", o = 0, c = 0, [l, a] = n[0].slice(1);
  const m = typeof t == "number";
  let u = { x: l, y: a }, g = 0, f = u, h = 0;
  return m ? (t < At && (f = u), D(n, (y, x) => {
    const p = V(y, x), d = G(p, x);
    return [i] = d, r = i === "M", s = r ? s : [o, c, ...d.slice(1)], r ? ([, l, a] = y, u = { x: l, y: a }, g = 0) : i === "L" ? (u = Gt(...s, t - h), g = at(...s)) : i === "A" ? (u = Pe(...s, t - h), g = ee(...s)) : i === "C" ? (u = Ze(...s, t - h), g = ne(...s)) : i === "Q" ? (u = Re(...s, t - h), g = se(...s)) : i === "Z" && (s = [o, c, l, a], u = { x: l, y: a }, g = at(...s)), h < t && h + g >= t && (f = u), h += g, i === "Z" ? (o = l, c = a) : ([o, c] = d.slice(-2), i === "M" && (l = o, a = c)), x.x = o, x.y = c, d;
  }), t > h - At && (f = { x: o, y: c }), f) : u;
}, Tt = (e, t) => {
  const n = q(e);
  let r = n.slice(0), s = W(r), i = r.length - 1, o = 0, c = 0, l = n[0];
  const [a, m] = l.slice(-2), u = { x: a, y: m };
  if (i <= 0 || !t || !Number.isFinite(t))
    return {
      segment: l,
      index: 0,
      length: c,
      point: u,
      lengthAtSegment: o
    };
  if (t >= s)
    return r = n.slice(0, -1), o = W(r), c = s - o, {
      segment: n[i],
      index: i,
      length: c,
      lengthAtSegment: o
    };
  const g = [];
  for (; i > 0; )
    l = r[i], r = r.slice(0, -1), o = W(r), c = s - o, s = o, g.push({
      segment: l,
      index: i,
      length: c,
      lengthAtSegment: o
    }), i -= 1;
  return g.find(({ lengthAtSegment: f }) => f <= t);
}, rt = (e) => {
  let t = 0, n = 0, r = 0, s = 0, i = "M";
  return D(q(e), (o, c) => {
    const l = V(o, c), a = G(l, c);
    [i] = a;
    const m = i.toUpperCase();
    return m === "Z" ? (t = r, n = s) : ([t, n] = a.slice(-2), m === "M" && (r = t, s = n)), c.x = t, c.y = n, a;
  });
}, pt = (e, t) => {
  const n = q(e), r = rt(n), s = W(n), i = (M) => {
    const b = M.x - t.x, w = M.y - t.y;
    return b * b + w * w;
  };
  let o = 8, c, l = { x: 0, y: 0 }, a = 0, m = 0, u = 1 / 0;
  for (let M = 0; M <= s; M += o)
    c = nt(r, M), a = i(c), a < u && (l = c, m = M, u = a);
  o /= 2;
  let g, f, h = 0, y = 0, x = 0, p = 0;
  for (; o > 1e-6 && (h = m - o, g = nt(r, h), x = i(g), y = m + o, f = nt(r, y), p = i(f), h >= 0 && x < u ? (l = g, m = h, u = x) : y <= s && p < u ? (l = f, m = y, u = p) : o /= 2, !(o < 1e-5)); )
    ;
  const d = Tt(n, m), C = Math.sqrt(u);
  return { closest: l, distance: C, segment: d };
}, Ye = (e, t) => pt(e, t).closest, He = (e, t) => pt(e, t).segment, Fe = (e, t) => Tt(e, t).segment, Ue = (e, t) => {
  const { distance: n } = pt(e, t);
  return Math.abs(n) < At;
}, ce = (e) => {
  if (typeof e != "string" || !e.length)
    return !1;
  const t = new Xt(e);
  for (et(t); t.index < t.max && !t.err.length; )
    Qt(t);
  return !t.err.length && "mM".includes(t.segments[0][0]);
}, dt = (e) => Array.isArray(e) && e.every((t) => {
  const n = t[0].toLowerCase();
  return tt[n] === t.length - 1 && "achlmqstvz".includes(n) && t.slice(1).every(Number.isFinite);
}) && e.length > 0, le = (e) => dt(e) && // `isPathArray` also checks if it's `Array`
e.every(([t]) => t === t.toUpperCase()), Ve = (e) => dt(e) && // `isPathArray` checks if it's `Array`
e.slice(1).every(([t]) => t === t.toLowerCase()), ae = (e) => le(e) && e.every(([t]) => "ACLMQZ".includes(t)), _e = (e) => ae(e) && e.every(([t]) => "MC".includes(t)), ut = {
  line: ["x1", "y1", "x2", "y2"],
  circle: ["cx", "cy", "r"],
  ellipse: ["cx", "cy", "rx", "ry"],
  rect: ["width", "height", "x", "y", "rx", "ry"],
  polygon: ["points"],
  polyline: ["points"],
  glyph: ["d"]
}, Je = (e) => {
  let { x1: t, y1: n, x2: r, y2: s } = e;
  return [t, n, r, s] = [t, n, r, s].map((i) => +i), [
    ["M", t, n],
    ["L", r, s]
  ];
}, Ke = (e) => {
  const t = [], n = (e.points || "").trim().split(/[\s|,]/).map((s) => +s);
  let r = 0;
  for (; r < n.length; )
    t.push([r ? "L" : "M", n[r], n[r + 1]]), r += 2;
  return e.type === "polygon" ? [...t, ["z"]] : t;
}, We = (e) => {
  let { cx: t, cy: n, r } = e;
  return [t, n, r] = [t, n, r].map((s) => +s), [
    ["M", t - r, n],
    ["a", r, r, 0, 1, 0, 2 * r, 0],
    ["a", r, r, 0, 1, 0, -2 * r, 0]
  ];
}, Ge = (e) => {
  let { cx: t, cy: n } = e, r = e.rx || 0, s = e.ry || r;
  return [t, n, r, s] = [t, n, r, s].map((i) => +i), [
    ["M", t - r, n],
    ["a", r, s, 0, 1, 0, 2 * r, 0],
    ["a", r, s, 0, 1, 0, -2 * r, 0]
  ];
}, tn = (e) => {
  const t = +e.x || 0, n = +e.y || 0, r = +e.width, s = +e.height;
  let i = +(e.rx || 0), o = +(e.ry || i);
  return i || o ? (i * 2 > r && (i -= (i * 2 - r) / 2), o * 2 > s && (o -= (o * 2 - s) / 2), [
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
}, me = (e, t) => {
  const r = (t || document).defaultView || /* istanbul ignore next */
  window, s = Object.keys(ut), i = e instanceof r.SVGElement, o = i ? e.tagName : null;
  if (o && [...s, "path"].every((u) => o !== u))
    throw TypeError(`${E}: "${o}" is not SVGElement`);
  const c = i ? o : e.type, l = ut[c], a = { type: c };
  i ? l.forEach((u) => {
    a[u] = e.getAttribute(u);
  }) : Object.assign(a, e);
  let m = [];
  return c === "circle" ? m = We(a) : c === "ellipse" ? m = Ge(a) : ["polyline", "polygon"].includes(c) ? m = Ke(a) : c === "rect" ? m = tn(a) : c === "line" ? m = Je(a) : ["glyph", "path"].includes(c) && (m = q(
    i ? e.getAttribute("d") || /* istanbul ignore next @preserve */
    "" : e.d || ""
  )), dt(m) && m.length ? m : !1;
}, ht = (e, t) => {
  let { round: n } = st;
  if (t === "off" || n === "off") return e.slice(0);
  n = typeof t == "number" && t >= 0 ? t : n;
  const r = typeof n == "number" && n >= 1 ? 10 ** n : 1;
  return D(e, (s) => {
    const i = s.slice(1).map((o) => n ? Math.round(o * r) / r : Math.round(o));
    return [s[0], ...i];
  });
}, Ct = (e, t) => ht(e, t).map((n) => n[0] + n.slice(1).join(" ")).join(""), en = (e, t, n) => {
  const r = n || document, s = r.defaultView || /* istanbul ignore next */
  window, i = Object.keys(ut), o = e instanceof s.SVGElement, c = o ? e.tagName : null;
  if (c === "path") throw TypeError(`${E}: "${c}" is already SVGPathElement`);
  if (c && i.every((y) => c !== y)) throw TypeError(`${E}: "${c}" is not SVGElement`);
  const l = r.createElementNS("http://www.w3.org/2000/svg", "path"), a = o ? c : e.type, m = ut[a], u = { type: a }, g = st.round, f = me(e, r), h = f && f.length ? Ct(f, g) : "";
  return o ? (m.forEach((y) => {
    u[y] = e.getAttribute(y);
  }), Object.values(e.attributes).forEach(({ name: y, value: x }) => {
    m.includes(y) || l.setAttribute(y, x);
  })) : (Object.assign(u, e), Object.keys(u).forEach((y) => {
    !m.includes(y) && y !== "type" && l.setAttribute(
      y.replace(/[A-Z]/g, (x) => `-${x.toLowerCase()}`),
      u[y]
    );
  })), ce(h) ? (l.setAttribute("d", h), t && o && (e.before(l, e), e.remove()), l) : !1;
}, Ot = (e) => {
  const t = [];
  let n, r = -1, s = 0, i = 0, o = 0, c = 0;
  const l = { ...gt };
  return e.forEach((a) => {
    const [m] = a, u = m.toUpperCase(), g = m.toLowerCase(), f = m === g, h = a.slice(1);
    u === "M" ? (r += 1, [s, i] = h, s += f ? l.x : 0, i += f ? l.y : 0, o = s, c = i, n = [f ? [u, o, c] : a]) : (u === "Z" ? (s = o, i = c) : u === "H" ? ([, s] = a, s += f ? l.x : (
      /* istanbul ignore next @preserve */
      0
    )) : u === "V" ? ([, i] = a, i += f ? l.y : (
      /* istanbul ignore next @preserve */
      0
    )) : ([s, i] = a.slice(-2), s += f ? l.x : 0, i += f ? l.y : 0), n.push(a)), l.x = s, l.y = i, t[r] = n;
  }), t;
}, ue = (e) => {
  let t = new v();
  const { origin: n } = e, [r, s] = n, { translate: i } = e, { rotate: o } = e, { skew: c } = e, { scale: l } = e;
  return Array.isArray(i) && i.length >= 2 && i.every((a) => !Number.isNaN(+a)) && i.some((a) => a !== 0) ? t = t.translate(...i) : typeof i == "number" && !Number.isNaN(i) && (t = t.translate(i)), (o || c || l) && (t = t.translate(r, s), Array.isArray(o) && o.length >= 2 && o.every((a) => !Number.isNaN(+a)) && o.some((a) => a !== 0) ? t = t.rotate(...o) : typeof o == "number" && !Number.isNaN(o) && (t = t.rotate(o)), Array.isArray(c) && c.length === 2 && c.every((a) => !Number.isNaN(+a)) && c.some((a) => a !== 0) ? (t = c[0] ? t.skewX(c[0]) : t, t = c[1] ? t.skewY(c[1]) : t) : typeof c == "number" && !Number.isNaN(c) && (t = t.skewX(c)), Array.isArray(l) && l.length >= 2 && l.every((a) => !Number.isNaN(+a)) && l.some((a) => a !== 1) ? t = t.scale(...l) : typeof l == "number" && !Number.isNaN(l) && (t = t.scale(l)), t = t.translate(-r, -s)), t;
}, ft = (e) => {
  let t = 0, n = 0, r = 0, s = 0, i = "M";
  const o = q(e);
  return D(o, (c, l) => {
    [i] = c;
    const a = V(c, l), m = i.toUpperCase();
    return m === "Z" ? (t = r, n = s) : m === "H" ? [, t] = a : m === "V" ? [, n] = a : ([t, n] = a.slice(-2), m === "M" && (r = t, s = n)), l.x = t, l.y = n, a;
  });
}, nn = (e, t, n) => {
  const [r] = e, { x: s, y: i } = t, o = e.slice(1).map(Number), c = r.toLowerCase();
  if (n === 0 && r === "M")
    return e;
  if (r !== c) {
    if (c === "a")
      return [
        c,
        o[0],
        o[1],
        o[2],
        o[3],
        o[4],
        o[5] - s,
        o[6] - i
      ];
    if (c === "v")
      return [c, o[0] - i];
    if (c === "h")
      return [c, o[0] - s];
    {
      const l = o.map((a, m) => a - (m % 2 ? i : s));
      return [c, ...l];
    }
  }
  return e;
}, vt = (e) => {
  let t = 0, n = 0, r = 0, s = 0, i = "M";
  const o = q(e);
  return D(o, (c, l, a) => {
    [i] = c;
    const m = nn(c, l, a), [u] = m, g = i.toUpperCase(), f = i.toLowerCase(), h = u === f;
    return g === "Z" ? (t = r, n = s) : g === "H" ? ([, t] = m, t += h ? l.x : (
      /* istanbul ignore next @preserve */
      0
    )) : g === "V" ? ([, n] = m, n += h ? l.y : (
      /* istanbul ignore next @preserve */
      0
    )) : ([t, n] = m.slice(-2), t += h ? l.x : 0, n += h ? l.y : 0, g === "M" && (r = t, s = n)), l.x = t, l.y = n, m;
  });
}, sn = (e, t, n, r) => {
  const [s] = e, i = (p) => Math.round(p * 10 ** 4) / 10 ** 4, o = e.slice(1), c = t.slice(1), { x1: l, y1: a, x2: m, y2: u, x: g, y: f } = n;
  let h = e;
  const [y, x] = c.slice(-2);
  if ("TQ".includes(s) || (n.qx = null, n.qy = null), ["V", "H", "S", "T", "Z"].includes(s))
    h = [s, ...o];
  else if (s === "L")
    i(g) === i(y) ? h = ["V", x] : i(f) === i(x) && (h = ["H", y]);
  else if (s === "C") {
    const [p, d] = c;
    "CS".includes(r) && (i(p) === i(l * 2 - m) && i(d) === i(a * 2 - u) || i(l) === i(m * 2 - g) && i(a) === i(u * 2 - f)) && (h = ["S", ...c.slice(-4)]), n.x1 = p, n.y1 = d;
  } else if (s === "Q") {
    const [p, d] = c;
    n.qx = p, n.qy = d, "QT".includes(r) && (i(p) === i(l * 2 - m) && i(d) === i(a * 2 - u) || i(l) === i(m * 2 - g) && i(a) === i(u * 2 - f)) && (h = ["T", ...c.slice(-2)]);
  }
  return h;
}, jt = (e, t) => {
  const n = ft(e), r = rt(n), s = { ...gt }, i = [], o = n.length;
  let c = "", l = "", a = 0, m = 0, u = 0, g = 0;
  for (let y = 0; y < o; y += 1) {
    [c] = n[y], i[y] = c, y && (l = i[y - 1]), n[y] = sn(n[y], r[y], s, l);
    const x = n[y], p = x.length;
    switch (s.x1 = +x[p - 2], s.y1 = +x[p - 1], s.x2 = +x[p - 4] || s.x1, s.y2 = +x[p - 3] || s.y1, c) {
      case "Z":
        a = u, m = g;
        break;
      case "H":
        [, a] = x;
        break;
      case "V":
        [, m] = x;
        break;
      default:
        [a, m] = x.slice(-2).map(Number), c === "M" && (u = a, g = m);
    }
    s.x = a, s.y = m;
  }
  const f = ht(n, t), h = ht(vt(n), t);
  return f.map((y, x) => x ? y.join("").length < h[x].join("").length ? y : h[x] : y);
}, rn = (e) => {
  const t = e.slice(1).map(
    (n, r, s) => r ? [...s[r - 1].slice(-2), ...n.slice(1)] : [...e[0].slice(1), ...n.slice(1)]
  ).map((n) => n.map((r, s) => n[n.length - s - 2 * (1 - s % 2)])).reverse();
  return [["M", ...t[0].slice(0, 2)], ...t.map((n) => ["C", ...n.slice(2)])];
}, lt = (e) => {
  const t = ft(e), n = t.slice(-1)[0][0] === "Z", r = rt(t).map((s, i) => {
    const [o, c] = s.slice(-2).map(Number);
    return {
      seg: t[i],
      // absolute
      n: s,
      // normalized
      c: t[i][0],
      // pathCommand
      x: o,
      // x
      y: c
      // y
    };
  }).map((s, i, o) => {
    const c = s.seg, l = s.n, a = i && o[i - 1], m = o[i + 1], u = s.c, g = o.length, f = i ? o[i - 1].x : o[g - 1].x, h = i ? o[i - 1].y : o[g - 1].y;
    let y = [];
    switch (u) {
      case "M":
        y = n ? ["Z"] : [u, f, h];
        break;
      case "A":
        y = [u, ...c.slice(1, -3), c[5] === 1 ? 0 : 1, f, h];
        break;
      case "C":
        m && m.c === "S" ? y = ["S", c[1], c[2], f, h] : y = [u, c[3], c[4], c[1], c[2], f, h];
        break;
      case "S":
        a && "CS".includes(a.c) && (!m || m.c !== "S") ? y = ["C", l[3], l[4], l[1], l[2], f, h] : y = [u, l[1], l[2], f, h];
        break;
      case "Q":
        m && m.c === "T" ? y = ["T", f, h] : y = [u, ...c.slice(1, -2), f, h];
        break;
      case "T":
        a && "QT".includes(a.c) && (!m || m.c !== "T") ? y = ["Q", l[1], l[2], f, h] : y = [u, f, h];
        break;
      case "Z":
        y = ["M", f, h];
        break;
      case "H":
        y = [u, f];
        break;
      case "V":
        y = [u, h];
        break;
      default:
        y = [u, ...c.slice(1, -2), f, h];
    }
    return y;
  });
  return n ? r.reverse() : [r[0], ...r.slice(1).reverse()];
}, on = (e, t) => {
  let n = v.Translate(...t.slice(0, -1));
  return [, , , n.m44] = t, n = e.multiply(n), [n.m41, n.m42, n.m43, n.m44];
}, Rt = (e, t, n) => {
  const [r, s, i] = n, [o, c, l] = on(e, [...t, 0, 1]), a = o - r, m = c - s, u = l - i;
  return [
    // protect against division by ZERO
    a * (Math.abs(i) / Math.abs(u) || 1) + r,
    m * (Math.abs(i) / Math.abs(u) || 1) + s
  ];
}, Dt = (e, t) => {
  let n = 0, r = 0, s = 0, i = 0, o = 0, c = 0, l = 0, a = 0, m = 0, u = 0, g = "M";
  const f = { ...gt }, h = q(e), y = t && Object.keys(t);
  if (!t || y && !y.length) return h;
  t.origin || Object.assign(t, { origin: st.origin });
  const x = t.origin, p = ue(t);
  return p.isIdentity ? h : D(h, (d, C, M) => {
    const b = V(d, f);
    [g] = b;
    let w = g === "A" ? ie(b, f) : ["V", "H"].includes(g) ? G(b, f) : b;
    const T = w[0] === "C" && w.length > 7, P = T ? w.slice(0, 7) : w.slice(0);
    if (T && (h.splice(M + 1, 0, ["C", ...w.slice(7)]), w = w.slice(0, 7)), w[0] === "L") {
      const S = w.slice(-2);
      [o, c] = Rt(p, S, x), n !== o && r !== c ? w = ["L", o, c] : r === c ? w = ["H", o] : n === o && (w = ["V", c]);
    } else
      for (l = 1, a = w.length; l < a; l += 2)
        [o, c] = Rt(p, [+w[l], +w[l + 1]], x), w[l] = o, w[l + 1] = c;
    n = o, r = c, g === "Z" ? (m = s, u = i) : ([m, u] = P.slice(-2), g === "M" && (s = m, i = u));
    const $ = P.length;
    return f.x1 = +P[$ - 2], f.y1 = +P[$ - 1], f.x2 = +P[$ - 4] || f.x1, f.y2 = +P[$ - 3] || f.y1, f.x = m, f.y = u, w;
  });
}, cn = (e, t = 0.5) => {
  const n = t, r = e.slice(0, 2), s = e.slice(2, 4), i = e.slice(4, 6), o = e.slice(6, 8), c = R(r, s, n), l = R(s, i, n), a = R(i, o, n), m = R(c, l, n), u = R(l, a, n), g = R(m, u, n);
  return [
    ["C", ...c, ...m, ...g],
    ["C", ...u, ...a, ...o]
  ];
};
class A {
  /**
   * @constructor
   * @param pathValue the path string
   * @param config instance options
   */
  constructor(t, n) {
    const r = n || {}, s = typeof t > "u";
    if (s || !t.length)
      throw TypeError(`${E}: "pathValue" is ${s ? "undefined" : "empty"}`);
    const i = q(t);
    this.segments = i;
    const { round: o, origin: c } = r;
    let l;
    Number.isInteger(o) || o === "off" ? l = o : l = st.round;
    let a = st.origin;
    if (Array.isArray(c) && c.length >= 2) {
      const [m, u, g] = c.map(Number);
      a = [
        Number.isNaN(m) ? 0 : m,
        Number.isNaN(u) ? 0 : u,
        Number.isNaN(g) ? 0 : g
      ];
    }
    return this.round = l, this.origin = a, this;
  }
  get bbox() {
    return zt(this.segments);
  }
  get length() {
    return W(this.segments);
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
    return nt(this.segments, t);
  }
  /**
   * Convert path to absolute values
   *
   * @public
   */
  toAbsolute() {
    const { segments: t } = this;
    return this.segments = ft(t), this;
  }
  /**
   * Convert path to relative values
   *
   * @public
   */
  toRelative() {
    const { segments: t } = this;
    return this.segments = vt(t), this;
  }
  /**
   * Convert path to cubic-bezier values. In addition, un-necessary `Z`
   * segment is removed if previous segment extends to the `M` segment.
   *
   * @public
   */
  toCurve() {
    const { segments: t } = this;
    return this.segments = mt(t), this;
  }
  /**
   * Reverse the order of the segments and their values.
   *
   * @param onlySubpath option to reverse all sub-paths except first
   * @public
   */
  reverse(t) {
    this.toAbsolute();
    const { segments: n } = this, r = Ot(n), s = r.length > 1 ? r : !1, i = s ? s.map((c, l) => t ? l ? lt(c) : c.slice(0) : lt(c)) : n.slice(0);
    let o = [];
    return s ? o = i.flat(1) : o = t ? n : lt(n), this.segments = o.slice(0), this;
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
    return this.segments = rt(t), this;
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
    return this.segments = jt(t, this.round), this;
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
    if (!t || typeof t != "object" || typeof t == "object" && !["translate", "rotate", "skew", "scale"].some((l) => l in t))
      return this;
    const {
      segments: n,
      origin: [r, s, i]
    } = this, o = {};
    for (const [l, a] of Object.entries(t))
      l === "skew" && Array.isArray(a) || (l === "rotate" || l === "translate" || l === "origin" || l === "scale") && Array.isArray(a) ? o[l] = a.map(Number) : l !== "origin" && typeof Number(a) == "number" && (o[l] = Number(a));
    const { origin: c } = o;
    if (Array.isArray(c) && c.length >= 2) {
      const [l, a, m] = c.map(Number);
      o.origin = [Number.isNaN(l) ? r : l, Number.isNaN(a) ? s : a, m || i];
    } else
      o.origin = [r, s, i];
    return this.segments = Dt(n, o), this;
  }
  /**
   * Rotate path 180deg vertically
   *
   * @public
   */
  flipX() {
    const { cx: t, cy: n } = this.bbox;
    return this.transform({ rotate: [0, 180, 0], origin: [t, n, 0] }), this;
  }
  /**
   * Rotate path 180deg horizontally
   *
   * @public
   */
  flipY() {
    const { cx: t, cy: n } = this.bbox;
    return this.transform({ rotate: [180, 0, 0], origin: [t, n, 0] }), this;
  }
  /**
   * Export the current path to be used
   * for the `d` (description) attribute.
   *
   * @public
   * @return the path string
   */
  toString() {
    return Ct(this.segments, this.round);
  }
}
N(A, "CSSMatrix", v), N(A, "getSVGMatrix", ue), N(A, "getPathBBox", zt), N(A, "getPathArea", oe), N(A, "getTotalLength", W), N(A, "getDrawDirection", Be), N(A, "getPointAtLength", nt), N(A, "getPropertiesAtLength", Tt), N(A, "getPropertiesAtPoint", pt), N(A, "polygonLength", Ne), N(A, "polygonArea", we), N(A, "getClosestPoint", Ye), N(A, "getSegmentOfPoint", He), N(A, "getSegmentAtLength", Fe), N(A, "isPointInStroke", Ue), N(A, "isValidPath", ce), N(A, "isPathArray", dt), N(A, "isAbsoluteArray", le), N(A, "isRelativeArray", Ve), N(A, "isCurveArray", _e), N(A, "isNormalizedArray", ae), N(A, "shapeToPath", en), N(A, "shapeToPathArray", me), N(A, "parsePathString", q), N(A, "roundPath", ht), N(A, "splitPath", Ot), N(A, "splitCubic", cn), N(A, "optimizePath", jt), N(A, "reverseCurve", rn), N(A, "reversePath", lt), N(A, "normalizePath", rt), N(A, "transformPath", Dt), N(A, "pathToAbsolute", ft), N(A, "pathToRelative", vt), N(A, "pathToCurve", mt), N(A, "pathToString", Ct);
export {
  A as default
};
//# sourceMappingURL=svg-path-commander.mjs.map
