var Se = Object.defineProperty;
var De = (e, t, s) => t in e ? Se(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s;
var g = (e, t, s) => De(e, typeof t != "symbol" ? t + "" : t, s);
var Ze = Object.defineProperty, Oe = (e, t, s) => t in e ? Ze(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s, q = (e, t, s) => Oe(e, typeof t != "symbol" ? t + "" : t, s);
const Qe = {
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
}, Vt = (e) => (e instanceof Float64Array || e instanceof Float32Array || Array.isArray(e) && e.every((t) => typeof t == "number")) && [6, 16].some((t) => e.length === t), Gt = (e) => e instanceof DOMMatrix || e instanceof C || typeof e == "object" && Object.keys(Qe).every((t) => e && t in e), ht = (e) => {
  const t = new C(), s = Array.from(e);
  if (!Vt(s))
    throw TypeError(`CSSMatrix: "${s.join(",")}" must be an array with 6/16 numbers.`);
  if (s.length === 16) {
    const [r, n, i, o, a, c, l, u, m, f, y, h, x, b, A, w] = s;
    t.m11 = r, t.a = r, t.m21 = a, t.c = a, t.m31 = m, t.m41 = x, t.e = x, t.m12 = n, t.b = n, t.m22 = c, t.d = c, t.m32 = f, t.m42 = b, t.f = b, t.m13 = i, t.m23 = l, t.m33 = y, t.m43 = A, t.m14 = o, t.m24 = u, t.m34 = h, t.m44 = w;
  } else if (s.length === 6) {
    const [r, n, i, o, a, c] = s;
    t.m11 = r, t.a = r, t.m12 = n, t.b = n, t.m21 = i, t.c = i, t.m22 = o, t.d = o, t.m41 = a, t.e = a, t.m42 = c, t.f = c;
  }
  return t;
}, te = (e) => {
  if (Gt(e))
    return ht([
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
}, ee = (e) => {
  if (typeof e != "string")
    throw TypeError(`CSSMatrix: "${JSON.stringify(e)}" is not a string.`);
  const t = String(e).replace(/\s/g, "");
  let s = new C();
  const r = `CSSMatrix: invalid transform string "${e}"`;
  return t.split(")").filter((n) => n).forEach((n) => {
    const [i, o] = n.split("(");
    if (!o) throw TypeError(r);
    const a = o.split(",").map((h) => h.includes("rad") ? parseFloat(h) * (180 / Math.PI) : parseFloat(h)), [c, l, u, m] = a, f = [c, l, u], y = [c, l, u, m];
    if (i === "perspective" && c && [l, u].every((h) => h === void 0))
      s.m34 = -1 / c;
    else if (i.includes("matrix") && [6, 16].includes(a.length) && a.every((h) => !Number.isNaN(+h))) {
      const h = a.map((x) => Math.abs(x) < 1e-6 ? 0 : x);
      s = s.multiply(ht(h));
    } else if (i === "translate3d" && f.every((h) => !Number.isNaN(+h)))
      s = s.translate(c, l, u);
    else if (i === "translate" && c && u === void 0)
      s = s.translate(c, l || 0, 0);
    else if (i === "rotate3d" && y.every((h) => !Number.isNaN(+h)) && m)
      s = s.rotateAxisAngle(c, l, u, m);
    else if (i === "rotate" && c && [l, u].every((h) => h === void 0))
      s = s.rotate(0, 0, c);
    else if (i === "scale3d" && f.every((h) => !Number.isNaN(+h)) && f.some((h) => h !== 1))
      s = s.scale(c, l, u);
    else if (i === "scale" && !Number.isNaN(c) && c !== 1 && u === void 0) {
      const h = Number.isNaN(+l) ? c : l;
      s = s.scale(c, h, 1);
    } else if (i === "skew" && (c || !Number.isNaN(c) && l) && u === void 0)
      s = s.skew(c, l || 0);
    else if (["translate", "rotate", "scale", "skew"].some((h) => i.includes(h)) && /[XYZ]/.test(i) && c && [l, u].every((h) => h === void 0))
      if (i === "skewX" || i === "skewY")
        s = s[i](c);
      else {
        const h = i.replace(/[XYZ]/, ""), x = i.replace(h, ""), b = ["X", "Y", "Z"].indexOf(x), A = h === "scale" ? 1 : 0, w = [b === 0 ? c : A, b === 1 ? c : A, b === 2 ? c : A];
        s = s[h](...w);
      }
    else
      throw TypeError(r);
  }), s;
}, vt = (e, t) => t ? [e.a, e.b, e.c, e.d, e.e, e.f] : [
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
], ne = (e, t, s) => {
  const r = new C();
  return r.m41 = e, r.e = e, r.m42 = t, r.f = t, r.m43 = s, r;
}, se = (e, t, s) => {
  const r = new C(), n = Math.PI / 180, i = e * n, o = t * n, a = s * n, c = Math.cos(i), l = -Math.sin(i), u = Math.cos(o), m = -Math.sin(o), f = Math.cos(a), y = -Math.sin(a), h = u * f, x = -u * y;
  r.m11 = h, r.a = h, r.m12 = x, r.b = x, r.m13 = m;
  const b = l * m * f + c * y;
  r.m21 = b, r.c = b;
  const A = c * f - l * m * y;
  return r.m22 = A, r.d = A, r.m23 = -l * u, r.m31 = l * y - c * m * f, r.m32 = l * f + c * m * y, r.m33 = c * u, r;
}, re = (e, t, s, r) => {
  const n = new C(), i = Math.sqrt(e * e + t * t + s * s);
  if (i === 0)
    return n;
  const o = e / i, a = t / i, c = s / i, l = r * (Math.PI / 360), u = Math.sin(l), m = Math.cos(l), f = u * u, y = o * o, h = a * a, x = c * c, b = 1 - 2 * (h + x) * f;
  n.m11 = b, n.a = b;
  const A = 2 * (o * a * f + c * u * m);
  n.m12 = A, n.b = A, n.m13 = 2 * (o * c * f - a * u * m);
  const w = 2 * (a * o * f - c * u * m);
  n.m21 = w, n.c = w;
  const N = 1 - 2 * (x + y) * f;
  return n.m22 = N, n.d = N, n.m23 = 2 * (a * c * f + o * u * m), n.m31 = 2 * (c * o * f + a * u * m), n.m32 = 2 * (c * a * f - o * u * m), n.m33 = 1 - 2 * (y + h) * f, n;
}, ie = (e, t, s) => {
  const r = new C();
  return r.m11 = e, r.a = e, r.m22 = t, r.d = t, r.m33 = s, r;
}, At = (e, t) => {
  const s = new C();
  if (e) {
    const r = e * Math.PI / 180, n = Math.tan(r);
    s.m21 = n, s.c = n;
  }
  if (t) {
    const r = t * Math.PI / 180, n = Math.tan(r);
    s.m12 = n, s.b = n;
  }
  return s;
}, oe = (e) => At(e, 0), ce = (e) => At(0, e), B = (e, t) => {
  const s = t.m11 * e.m11 + t.m12 * e.m21 + t.m13 * e.m31 + t.m14 * e.m41, r = t.m11 * e.m12 + t.m12 * e.m22 + t.m13 * e.m32 + t.m14 * e.m42, n = t.m11 * e.m13 + t.m12 * e.m23 + t.m13 * e.m33 + t.m14 * e.m43, i = t.m11 * e.m14 + t.m12 * e.m24 + t.m13 * e.m34 + t.m14 * e.m44, o = t.m21 * e.m11 + t.m22 * e.m21 + t.m23 * e.m31 + t.m24 * e.m41, a = t.m21 * e.m12 + t.m22 * e.m22 + t.m23 * e.m32 + t.m24 * e.m42, c = t.m21 * e.m13 + t.m22 * e.m23 + t.m23 * e.m33 + t.m24 * e.m43, l = t.m21 * e.m14 + t.m22 * e.m24 + t.m23 * e.m34 + t.m24 * e.m44, u = t.m31 * e.m11 + t.m32 * e.m21 + t.m33 * e.m31 + t.m34 * e.m41, m = t.m31 * e.m12 + t.m32 * e.m22 + t.m33 * e.m32 + t.m34 * e.m42, f = t.m31 * e.m13 + t.m32 * e.m23 + t.m33 * e.m33 + t.m34 * e.m43, y = t.m31 * e.m14 + t.m32 * e.m24 + t.m33 * e.m34 + t.m34 * e.m44, h = t.m41 * e.m11 + t.m42 * e.m21 + t.m43 * e.m31 + t.m44 * e.m41, x = t.m41 * e.m12 + t.m42 * e.m22 + t.m43 * e.m32 + t.m44 * e.m42, b = t.m41 * e.m13 + t.m42 * e.m23 + t.m43 * e.m33 + t.m44 * e.m43, A = t.m41 * e.m14 + t.m42 * e.m24 + t.m43 * e.m34 + t.m44 * e.m44;
  return ht([s, r, n, i, o, a, c, l, u, m, f, y, h, x, b, A]);
};
class C {
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
    return typeof t == "string" && t.length && t !== "none" ? ee(t) : Array.isArray(t) || t instanceof Float64Array || t instanceof Float32Array ? ht(t) : typeof t == "object" ? te(t) : this;
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
    return Float32Array.from(vt(this, t));
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
    return Float64Array.from(vt(this, t));
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
    const { is2D: t } = this, s = this.toFloat64Array(t).join(", ");
    return `${t ? "matrix" : "matrix3d"}(${s})`;
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
    const { is2D: t, isIdentity: s } = this;
    return { ...this, is2D: t, isIdentity: s };
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
    return B(this, t);
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
  translate(t, s, r) {
    const n = t;
    let i = s, o = r;
    return typeof i > "u" && (i = 0), typeof o > "u" && (o = 0), B(this, ne(n, i, o));
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
  scale(t, s, r) {
    const n = t;
    let i = s, o = r;
    return typeof i > "u" && (i = t), typeof o > "u" && (o = 1), B(this, ie(n, i, o));
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
  rotate(t, s, r) {
    let n = t, i = s || 0, o = r || 0;
    return typeof t == "number" && typeof s > "u" && typeof r > "u" && (o = n, n = 0, i = 0), B(this, se(n, i, o));
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
  rotateAxisAngle(t, s, r, n) {
    if ([t, s, r, n].some((i) => Number.isNaN(+i)))
      throw new TypeError("CSSMatrix: expecting 4 values");
    return B(this, re(t, s, r, n));
  }
  /**
   * Specifies a skew transformation along the `x-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param angle The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skewX(t) {
    return B(this, oe(t));
  }
  /**
   * Specifies a skew transformation along the `y-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param angle The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skewY(t) {
    return B(this, ce(t));
  }
  /**
   * Specifies a skew transformation along both the `x-axis` and `y-axis`.
   * This matrix is not modified.
   *
   * @param angleX The X-angle amount in degrees to skew.
   * @param angleY The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skew(t, s) {
    return B(this, At(t, s));
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
    const s = this.m11 * t.x + this.m21 * t.y + this.m31 * t.z + this.m41 * t.w, r = this.m12 * t.x + this.m22 * t.y + this.m32 * t.z + this.m42 * t.w, n = this.m13 * t.x + this.m23 * t.y + this.m33 * t.z + this.m43 * t.w, i = this.m14 * t.x + this.m24 * t.y + this.m34 * t.z + this.m44 * t.w;
    return t instanceof DOMPoint ? new DOMPoint(s, r, n, i) : {
      x: s,
      y: r,
      z: n,
      w: i
    };
  }
}
q(C, "Translate", ne), q(C, "Rotate", se), q(C, "RotateAxisAngle", re), q(C, "Scale", ie), q(C, "SkewX", oe), q(C, "SkewY", ce), q(C, "Skew", At), q(C, "Multiply", B), q(C, "fromArray", ht), q(C, "fromMatrix", te), q(C, "fromString", ee), q(C, "toArray", vt), q(C, "isCompatibleArray", Vt), q(C, "isCompatibleObject", Gt);
const V = {
  origin: [0, 0, 0],
  round: 4
}, nt = {
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
  let t = e.pathValue[e.segmentStart], s = t.toLowerCase();
  const { data: r } = e;
  for (; r.length >= nt[s] && (s === "m" && r.length > 2 ? (e.segments.push([t].concat(r.splice(0, 2))), s = "l", t = t === "m" ? "l" : "L") : e.segments.push(
    [t].concat(
      r.splice(0, nt[s])
    )
  ), !!nt[s]); )
    ;
}, E = "SVGPathCommander Error", ae = (e) => {
  const { index: t, pathValue: s } = e, r = s.charCodeAt(t);
  if (r === 48) {
    e.param = 0, e.index += 1;
    return;
  }
  if (r === 49) {
    e.param = 1, e.index += 1;
    return;
  }
  e.err = `${E}: invalid Arc flag "${s[t]}", expecting 0 or 1 at index ${t}`;
}, H = (e) => e >= 48 && e <= 57, U = "Invalid path value", le = (e) => {
  const { max: t, pathValue: s, index: r } = e;
  let n = r, i = !1, o = !1, a = !1, c = !1, l;
  if (n >= t) {
    e.err = `${E}: ${U} at index ${n}, "pathValue" is missing param`;
    return;
  }
  if (l = s.charCodeAt(n), (l === 43 || l === 45) && (n += 1, l = s.charCodeAt(n)), !H(l) && l !== 46) {
    e.err = `${E}: ${U} at index ${n}, "${s[n]}" is not a number`;
    return;
  }
  if (l !== 46) {
    if (i = l === 48, n += 1, l = s.charCodeAt(n), i && n < t && l && H(l)) {
      e.err = `${E}: ${U} at index ${r}, "${s[r]}" illegal number`;
      return;
    }
    for (; n < t && H(s.charCodeAt(n)); )
      n += 1, o = !0;
    l = s.charCodeAt(n);
  }
  if (l === 46) {
    for (c = !0, n += 1; H(s.charCodeAt(n)); )
      n += 1, a = !0;
    l = s.charCodeAt(n);
  }
  if (l === 101 || l === 69) {
    if (c && !o && !a) {
      e.err = `${E}: ${U} at index ${n}, "${s[n]}" invalid float exponent`;
      return;
    }
    if (n += 1, l = s.charCodeAt(n), (l === 43 || l === 45) && (n += 1), n < t && H(s.charCodeAt(n)))
      for (; n < t && H(s.charCodeAt(n)); )
        n += 1;
    else {
      e.err = `${E}: ${U} at index ${n}, "${s[n]}" invalid integer exponent`;
      return;
    }
  }
  e.index = n, e.param = +e.pathValue.slice(r, n);
}, ue = (e) => [
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
].includes(e), st = (e) => {
  const { pathValue: t, max: s } = e;
  for (; e.index < s && ue(t.charCodeAt(e.index)); )
    e.index += 1;
}, me = (e) => {
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
}, he = (e) => H(e) || e === 43 || e === 45 || e === 46, fe = (e) => (e | 32) === 97, ye = (e) => {
  switch (e | 32) {
    case 109:
    case 77:
      return !0;
    default:
      return !1;
  }
}, Et = (e) => {
  var c;
  const { max: t, pathValue: s, index: r, segments: n } = e, i = s.charCodeAt(r), o = nt[s[r].toLowerCase()];
  if (e.segmentStart = r, !me(i)) {
    e.err = `${E}: ${U} "${s[r]}" is not a path command at index ${r}`;
    return;
  }
  const a = n[n.length - 1];
  if (!ye(i) && ((c = a == null ? void 0 : a[0]) == null ? void 0 : c.toLocaleLowerCase()) === "z") {
    e.err = `${E}: ${U} "${s[r]}" is not a MoveTo path command at index ${r}`;
    return;
  }
  if (e.index += 1, st(e), e.data = [], !o) {
    Tt(e);
    return;
  }
  for (; ; ) {
    for (let l = o; l > 0; l -= 1) {
      if (fe(i) && (l === 3 || l === 4) ? ae(e) : le(e), e.err.length)
        return;
      e.data.push(e.param), st(e), e.index < t && s.charCodeAt(e.index) === 44 && (e.index += 1, st(e));
    }
    if (e.index >= e.max || !he(s.charCodeAt(e.index)))
      break;
  }
  Tt(e);
};
class Rt {
  constructor(t) {
    this.segments = [], this.pathValue = t, this.max = t.length, this.index = 0, this.param = 0, this.segmentStart = 0, this.data = [], this.err = "";
  }
}
const R = (e) => {
  if (typeof e != "string")
    return e.slice(0);
  const t = new Rt(e);
  for (st(t); t.index < t.max && !t.err.length; )
    Et(t);
  if (t != null && t.err.length)
    throw TypeError(t.err);
  return t.segments;
}, jt = (e, t, s, r) => {
  const [n] = e, i = n.toUpperCase();
  if (t === 0 || i === n) return e;
  if (i === "A")
    return [
      i,
      e[1],
      e[2],
      e[3],
      e[4],
      e[5],
      e[6] + s,
      e[7] + r
    ];
  if (i === "V")
    return [i, e[1] + r];
  if (i === "H")
    return [i, e[1] + s];
  if (i === "L")
    return [i, e[1] + s, e[2] + r];
  {
    const a = e.slice(1).map((c, l) => c + (l % 2 ? r : s));
    return [i].concat(a);
  }
}, j = (e, t) => {
  let s = e.length, r, n = "M", i = "M", o = !1, a = 0, c = 0, l = 0, u = 0, m = 0;
  for (let f = 0; f < s; f += 1) {
    r = e[f], [n] = r, m = r.length, i = n.toUpperCase(), o = i !== n;
    const y = t(r, f, a, c);
    if (y === !1)
      break;
    i === "Z" ? (a = l, c = u) : i === "H" ? a = r[1] + (o ? a : 0) : i === "V" ? c = r[1] + (o ? c : 0) : (a = r[m - 2] + (o ? a : 0), c = r[m - 1] + (o ? c : 0), i === "M" && (l = a, u = c)), y && (e[f] = y, y[0] === "C" && (s = e.length));
  }
  return e;
}, xt = (e) => {
  const t = R(e);
  return j(t, jt);
}, St = (e, t, s, r) => {
  const [n] = e, i = n.toLowerCase();
  if (t === 0 || n === i) return e;
  if (i === "a")
    return [
      i,
      e[1],
      e[2],
      e[3],
      e[4],
      e[5],
      e[6] - s,
      e[7] - r
    ];
  if (i === "v")
    return [i, e[1] - r];
  if (i === "h")
    return [i, e[1] - s];
  if (i === "l")
    return [i, e[1] - s, e[2] - r];
  {
    const a = e.slice(1).map((c, l) => c - (l % 2 ? r : s));
    return [i].concat(a);
  }
}, Xt = (e) => {
  const t = R(e);
  return j(t, St);
}, ct = (e, t, s) => {
  const { sin: r, cos: n } = Math, i = e * n(s) - t * r(s), o = e * r(s) + t * n(s);
  return { x: i, y: o };
}, Dt = (e, t, s, r, n, i, o, a, c, l) => {
  let u = e, m = t, f = s, y = r, h = a, x = c;
  const b = Math.PI * 120 / 180, A = Math.PI / 180 * (+n || 0);
  let w = [], N, M, d, v, L;
  if (l)
    [M, d, v, L] = l;
  else {
    N = ct(u, m, -A), u = N.x, m = N.y, N = ct(h, x, -A), h = N.x, x = N.y;
    const $ = (u - h) / 2, P = (m - x) / 2;
    let Q = $ * $ / (f * f) + P * P / (y * y);
    Q > 1 && (Q = Math.sqrt(Q), f *= Q, y *= Q);
    const F = f * f, D = y * y, Ut = (i === o ? -1 : 1) * Math.sqrt(Math.abs((F * D - F * P * P - D * $ * $) / (F * P * P + D * $ * $)));
    v = Ut * f * P / y + (u + h) / 2, L = Ut * -y * $ / f + (m + x) / 2, M = Math.asin(((m - L) / y * 10 ** 9 >> 0) / 10 ** 9), d = Math.asin(((x - L) / y * 10 ** 9 >> 0) / 10 ** 9), M = u < v ? Math.PI - M : M, d = h < v ? Math.PI - d : d, M < 0 && (M = Math.PI * 2 + M), d < 0 && (d = Math.PI * 2 + d), o && M > d && (M -= Math.PI * 2), !o && d > M && (d -= Math.PI * 2);
  }
  let T = d - M;
  if (Math.abs(T) > b) {
    const $ = d, P = h, Q = x;
    d = M + b * (o && d > M ? 1 : -1), h = v + f * Math.cos(d), x = L + y * Math.sin(d), w = Dt(h, x, f, y, n, 0, o, P, Q, [d, $, v, L]);
  }
  T = d - M;
  const Z = Math.cos(M), k = Math.sin(M), it = Math.cos(d), tt = Math.sin(d), _ = Math.tan(T / 4), et = 4 / 3 * f * _, I = 4 / 3 * y * _, J = [u, m], S = [u + et * k, m - I * Z], Y = [h + et * tt, x - I * it], K = [h, x];
  if (S[0] = 2 * J[0] - S[0], S[1] = 2 * J[1] - S[1], l)
    return [S[0], S[1], Y[0], Y[1], K[0], K[1]].concat(w);
  w = [S[0], S[1], Y[0], Y[1], K[0], K[1]].concat(w);
  const ot = [];
  for (let $ = 0, P = w.length; $ < P; $ += 1)
    ot[$] = $ % 2 ? ct(w[$ - 1], w[$], A).y : ct(w[$], w[$ + 1], A).x;
  return ot;
}, xe = (e, t, s, r, n, i) => {
  const o = 0.3333333333333333, a = 2 / 3;
  return [
    o * e + a * s,
    // cpx1
    o * t + a * r,
    // cpy1
    o * n + a * s,
    // cpx2
    o * i + a * r,
    // cpy2
    n,
    i
    // x,y
  ];
}, O = (e, t, s) => {
  const [r, n] = e, [i, o] = t;
  return [r + (i - r) * s, n + (o - n) * s];
}, Ct = (e, t, s, r) => {
  const n = O([e, t], [s, r], 0.3333333333333333), i = O([e, t], [s, r], 2 / 3);
  return [n[0], n[1], i[0], i[1], s, r];
}, Zt = (e, t) => {
  const [s] = e, r = e.slice(1).map(Number), [n, i] = r, { x1: o, y1: a, x: c, y: l } = t;
  return "TQ".includes(s) || (t.qx = null, t.qy = null), s === "M" ? (t.x = n, t.y = i, e) : s === "A" ? ["C"].concat(
    Dt(o, a, r[0], r[1], r[2], r[3], r[4], r[5], r[6])
  ) : s === "Q" ? (t.qx = n, t.qy = i, ["C"].concat(
    xe(o, a, r[0], r[1], r[2], r[3])
  )) : s === "L" ? ["C"].concat(Ct(o, a, n, i)) : s === "Z" ? ["C"].concat(Ct(o, a, c, l)) : e;
}, G = (e, t) => {
  const [s] = e, r = s.toUpperCase(), n = s !== r, { x1: i, y1: o, x2: a, y2: c, x: l, y: u } = t, m = e.slice(1);
  let f = m.map((y, h) => y + (n ? h % 2 ? u : l : 0));
  if ("TQ".includes(r) || (t.qx = null, t.qy = null), r === "A")
    return f = m.slice(0, -2).concat(m[5] + (n ? l : 0), m[6] + (n ? u : 0)), ["A"].concat(f);
  if (r === "H")
    return ["L", e[1] + (n ? l : 0), o];
  if (r === "V")
    return ["L", i, e[1] + (n ? u : 0)];
  if (r === "L")
    return [
      "L",
      e[1] + (n ? l : 0),
      e[2] + (n ? u : 0)
    ];
  if (r === "M")
    return [
      "M",
      e[1] + (n ? l : 0),
      e[2] + (n ? u : 0)
    ];
  if (r === "C")
    return ["C"].concat(f);
  if (r === "S") {
    const y = i * 2 - a, h = o * 2 - c;
    return t.x1 = y, t.y1 = h, ["C", y, h].concat(f);
  } else if (r === "T") {
    const y = i * 2 - (t.qx ? t.qx : (
      /* istanbul ignore next */
      0
    )), h = o * 2 - (t.qy ? t.qy : (
      /* istanbul ignore next */
      0
    ));
    return t.qx = y, t.qy = h, ["Q", y, h].concat(f);
  } else if (r === "Q") {
    const [y, h] = f;
    return t.qx = y, t.qy = h, ["Q"].concat(f);
  } else if (r === "Z")
    return ["Z"];
  return e;
}, X = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  x: 0,
  y: 0,
  qx: null,
  qy: null
}, gt = (e) => {
  const t = { ...X }, s = R(e);
  return j(s, (r, n, i, o) => {
    t.x = i, t.y = o;
    const a = G(r, t);
    let c = Zt(a, t);
    c[0] === "C" && c.length > 7 && (s.splice(n + 1, 0, ["C"].concat(c.slice(7))), c = c.slice(0, 7));
    const u = c.length;
    return t.x1 = +c[u - 2], t.y1 = +c[u - 1], t.x2 = +c[u - 4] || t.x1, t.y2 = +c[u - 3] || t.y1, c;
  });
}, z = (e, t) => {
  const s = t >= 1 ? 10 ** t : 1;
  return t > 0 ? Math.round(e * s) / s : Math.round(e);
}, $t = (e, t) => {
  const s = e.length;
  let { round: r } = V, n = e[0], i = "";
  r = t === "off" || typeof t == "number" && t >= 0 ? t : typeof r == "number" && r >= 0 ? r : (
    /* istanbul ignore next @preserve */
    "off"
  );
  for (let o = 0; o < s; o += 1) {
    n = e[o];
    const [a] = n, c = n.slice(1);
    if (i += a, r === "off")
      i += c.join(" ");
    else {
      let l = 0;
      const u = c.length;
      for (; l < u; )
        i += z(c[l], r), l !== u - 1 && (i += " "), l += 1;
    }
  }
  return i;
}, Mt = (e, t) => Math.sqrt((e[0] - t[0]) * (e[0] - t[0]) + (e[1] - t[1]) * (e[1] - t[1])), lt = (e, t, s, r) => Mt([e, t], [s, r]), Ot = (e, t, s, r, n) => {
  let i = { x: e, y: t };
  if (typeof n == "number") {
    const o = Mt([e, t], [s, r]);
    if (n <= 0)
      i = { x: e, y: t };
    else if (n >= o)
      i = { x: s, y: r };
    else {
      const [a, c] = O([e, t], [s, r], n / o);
      i = { x: a, y: c };
    }
  }
  return i;
}, zt = (e, t, s, r) => {
  const { min: n, max: i } = Math;
  return {
    min: {
      x: n(e, s),
      y: n(t, r)
    },
    max: {
      x: i(e, s),
      y: i(t, r)
    }
  };
}, Qt = (e, t, s) => {
  const r = s / 2, n = Math.sin(r), i = Math.cos(r), o = e ** 2 * n ** 2, a = t ** 2 * i ** 2, c = Math.sqrt(o + a) * s;
  return Math.abs(c);
}, W = (e, t, s, r, n, i) => {
  const { sin: o, cos: a } = Math, c = a(n), l = o(n), u = s * a(i), m = r * o(i);
  return {
    x: e + c * u - l * m,
    y: t + l * u + c * m
  };
}, Pt = (e, t) => {
  const { x: s, y: r } = e, { x: n, y: i } = t, o = s * n + r * i, a = Math.sqrt((s ** 2 + r ** 2) * (n ** 2 + i ** 2));
  return (s * i - r * n < 0 ? -1 : 1) * Math.acos(o / a);
}, wt = (e, t, s, r, n, i, o, a, c) => {
  const { abs: l, sin: u, cos: m, sqrt: f, PI: y } = Math;
  let h = l(s), x = l(r);
  const A = (n % 360 + 360) % 360 * (y / 180);
  if (e === a && t === c)
    return {
      rx: h,
      ry: x,
      startAngle: 0,
      endAngle: 0,
      center: { x: a, y: c }
    };
  if (h === 0 || x === 0)
    return {
      rx: h,
      ry: x,
      startAngle: 0,
      endAngle: 0,
      center: { x: (a + e) / 2, y: (c + t) / 2 }
    };
  const w = (e - a) / 2, N = (t - c) / 2, M = {
    x: m(A) * w + u(A) * N,
    y: -u(A) * w + m(A) * N
  }, d = M.x ** 2 / h ** 2 + M.y ** 2 / x ** 2;
  d > 1 && (h *= f(d), x *= f(d));
  const v = h ** 2 * x ** 2 - h ** 2 * M.y ** 2 - x ** 2 * M.x ** 2, L = h ** 2 * M.y ** 2 + x ** 2 * M.x ** 2;
  let T = v / L;
  T = T < 0 ? 0 : T;
  const Z = (i !== o ? 1 : -1) * f(T), k = {
    x: Z * (h * M.y / x),
    y: Z * (-(x * M.x) / h)
  }, it = {
    x: m(A) * k.x - u(A) * k.y + (e + a) / 2,
    y: u(A) * k.x + m(A) * k.y + (t + c) / 2
  }, tt = {
    x: (M.x - k.x) / h,
    y: (M.y - k.y) / x
  }, _ = Pt({ x: 1, y: 0 }, tt), et = {
    x: (-M.x - k.x) / h,
    y: (-M.y - k.y) / x
  };
  let I = Pt(tt, et);
  !o && I > 0 ? I -= 2 * y : o && I < 0 && (I += 2 * y), I %= 2 * y;
  const J = _ + I;
  return {
    center: it,
    startAngle: _,
    endAngle: J,
    rx: h,
    ry: x
  };
}, Bt = (e, t, s, r, n, i, o, a, c) => {
  const { rx: l, ry: u, startAngle: m, endAngle: f } = wt(e, t, s, r, n, i, o, a, c);
  return Qt(l, u, f - m);
}, ge = (e, t, s, r, n, i, o, a, c, l) => {
  let u = { x: e, y: t };
  const { center: m, rx: f, ry: y, startAngle: h, endAngle: x } = wt(e, t, s, r, n, i, o, a, c);
  if (typeof l == "number") {
    const b = Qt(f, y, x - h);
    if (l <= 0)
      u = { x: e, y: t };
    else if (l >= b)
      u = { x: a, y: c };
    else {
      if (e === a && t === c)
        return { x: a, y: c };
      if (f === 0 || y === 0)
        return Ot(e, t, a, c, l);
      const { PI: A, cos: w, sin: N } = Math, M = x - h, v = (n % 360 + 360) % 360 * (A / 180), L = h + M * (l / b), T = f * w(L), Z = y * N(L);
      u = {
        x: w(v) * T - N(v) * Z + m.x,
        y: N(v) * T + w(v) * Z + m.y
      };
    }
  }
  return u;
}, pe = (e, t, s, r, n, i, o, a, c) => {
  const { center: l, rx: u, ry: m, startAngle: f, endAngle: y } = wt(e, t, s, r, n, i, o, a, c), h = y - f, { min: x, max: b, tan: A, atan2: w, PI: N } = Math, M = { x: a, y: c }, { x: d, y: v } = l, L = [M], T = n * N / 180, Z = A(T), k = w(-m * Z, u), it = k, tt = k + N, _ = w(m, u * Z), et = _ + N, I = [e, a], J = [t, c], S = x(...I), Y = b(...I), K = x(...J), ot = b(...J), $ = y - h * 1e-3, P = W(d, v, u, m, T, $), Q = y - h * 0.999, F = W(d, v, u, m, T, Q);
  return (P.x > Y || F.x > Y) && L.push(W(d, v, u, m, T, it)), (P.x < S || F.x < S) && L.push(W(d, v, u, m, T, tt)), (P.y < K || F.y < K) && L.push(W(d, v, u, m, T, et)), (P.y > ot || F.y > ot) && L.push(W(d, v, u, m, T, _)), {
    min: {
      x: x(...L.map((D) => D.x)),
      y: x(...L.map((D) => D.y))
    },
    max: {
      x: b(...L.map((D) => D.x)),
      y: b(...L.map((D) => D.y))
    }
  };
}, Be = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  angleBetween: Pt,
  arcLength: Qt,
  arcPoint: W,
  getArcBBox: pe,
  getArcLength: Bt,
  getArcProps: wt,
  getPointAtArcLength: ge
}, Symbol.toStringTag, { value: "Module" })), qt = [
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
], be = [
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
], de = (e) => {
  const t = [];
  for (let s = e, r = s.length, n = r - 1; r > 1; r -= 1, n -= 1) {
    const i = [];
    for (let o = 0; o < n; o += 1)
      i.push({
        x: n * (s[o + 1].x - s[o].x),
        y: n * (s[o + 1].y - s[o].y),
        t: 0
      });
    t.push(i), s = i;
  }
  return t;
}, Ae = (e, t) => {
  if (t === 0)
    return e[0].t = 0, e[0];
  const s = e.length - 1;
  if (t === 1)
    return e[s].t = 1, e[s];
  const r = 1 - t;
  let n = e;
  if (s === 0)
    return e[0].t = t, e[0];
  if (s === 1)
    return {
      x: r * n[0].x + t * n[1].x,
      y: r * n[0].y + t * n[1].y,
      t
    };
  const i = r * r, o = t * t;
  let a = 0, c = 0, l = 0, u = 0;
  return s === 2 ? (n = [n[0], n[1], n[2], { x: 0, y: 0 }], a = i, c = r * t * 2, l = o) : s === 3 && (a = i * r, c = i * t * 3, l = r * o * 3, u = t * o), {
    x: a * n[0].x + c * n[1].x + l * n[2].x + u * n[3].x,
    y: a * n[0].y + c * n[1].y + l * n[2].y + u * n[3].y,
    t
  };
}, Me = (e, t) => {
  const s = e(t), r = s.x * s.x + s.y * s.y;
  return Math.sqrt(r);
}, we = (e) => {
  const s = qt.length;
  let r = 0;
  for (let n = 0, i; n < s; n++)
    i = 0.5 * qt[n] + 0.5, r += be[n] * Me(e, i);
  return 0.5 * r;
}, ft = (e) => {
  const t = [];
  for (let r = 0, n = e.length, i = 2; r < n; r += i)
    t.push({
      x: e[r],
      y: e[r + 1]
    });
  const s = de(t);
  return we((r) => Ae(s[0], r));
}, Ne = 1e-8, pt = ([e, t, s]) => {
  const r = Math.min(e, s), n = Math.max(e, s);
  if (t >= e ? s >= t : s <= t)
    return [r, n];
  const i = (e * s - t * t) / (e - 2 * t + s);
  return i < r ? [i, n] : [r, i];
}, kt = ([e, t, s, r]) => {
  const n = e - 3 * t + 3 * s - r;
  if (Math.abs(n) < Ne)
    return e === r && e === t ? [e, r] : pt([e, -0.5 * e + 1.5 * t, e - 3 * t + 3 * s]);
  const i = -e * s + e * r - t * s - t * r + t * t + s * s;
  if (i <= 0)
    return [Math.min(e, r), Math.max(e, r)];
  const o = Math.sqrt(i);
  let a = Math.min(e, r), c = Math.max(e, r);
  const l = e - 2 * t + s;
  for (let u = (l + o) / n, m = 1; m <= 2; u = (l - o) / n, m++)
    if (u > 0 && u < 1) {
      const f = e * (1 - u) * (1 - u) * (1 - u) + t * 3 * (1 - u) * (1 - u) * u + s * 3 * (1 - u) * u * u + r * u * u * u;
      f < a && (a = f), f > c && (c = f);
    }
  return [a, c];
}, Le = ([e, t, s, r, n, i, o, a], c) => {
  const l = 1 - c;
  return {
    x: l ** 3 * e + 3 * l ** 2 * c * s + 3 * l * c ** 2 * n + c ** 3 * o,
    y: l ** 3 * t + 3 * l ** 2 * c * r + 3 * l * c ** 2 * i + c ** 3 * a
  };
}, _t = (e, t, s, r, n, i, o, a) => ft([e, t, s, r, n, i, o, a]), ve = (e, t, s, r, n, i, o, a, c) => {
  const l = typeof c == "number";
  let u = { x: e, y: t };
  if (l) {
    const m = ft([e, t, s, r, n, i, o, a]);
    c <= 0 || (c >= m ? u = { x: o, y: a } : u = Le([e, t, s, r, n, i, o, a], c / m));
  }
  return u;
}, Te = (e, t, s, r, n, i, o, a) => {
  const c = kt([e, s, n, o]), l = kt([t, r, i, a]);
  return {
    min: { x: c[0], y: l[0] },
    max: { x: c[1], y: l[1] }
  };
}, Ce = ([e, t, s, r, n, i], o) => {
  const a = 1 - o;
  return {
    x: a ** 2 * e + 2 * a * o * s + o ** 2 * n,
    y: a ** 2 * t + 2 * a * o * r + o ** 2 * i
  };
}, Ft = (e, t, s, r, n, i) => ft([e, t, s, r, n, i]), $e = (e, t, s, r, n, i, o) => {
  const a = typeof o == "number";
  let c = { x: e, y: t };
  if (a) {
    const l = ft([e, t, s, r, n, i]);
    o <= 0 || (o >= l ? c = { x: n, y: i } : c = Ce([e, t, s, r, n, i], o / l));
  }
  return c;
}, ze = (e, t, s, r, n, i) => {
  const o = pt([e, s, n]), a = pt([t, r, i]);
  return {
    min: { x: o[0], y: a[0] },
    max: { x: o[1], y: a[1] }
  };
}, _e = (e) => {
  const t = e.length;
  let s = -1, r, n = e[t - 1], i = 0;
  for (; ++s < t; )
    r = n, n = e[s], i += r[1] * n[0] - r[0] * n[1];
  return i / 2;
}, Fe = (e) => e.reduce((t, s, r) => r ? t + Mt(e[r - 1], s) : 0, 0), bt = 1e-5, ut = (e) => {
  const t = R(e), s = { ...X };
  return j(t, (r, n, i, o) => {
    s.x = i, s.y = o;
    const a = G(r, s), c = a.length;
    return s.x1 = +a[c - 2], s.y1 = +a[c - 1], s.x2 = +a[c - 4] || s.x1, s.y2 = +a[c - 3] || s.y1, a;
  });
}, at = (e, t) => {
  const s = ut(e);
  let r = !1, n = [], i = "M", o = 0, a = 0, [c, l] = s[0].slice(1);
  const u = typeof t == "number";
  let m = { x: c, y: l }, f = 0, y = m, h = 0;
  return !u || t < bt ? m : (j(s, (x, b, A, w) => {
    if ([i] = x, r = i === "M", n = r ? n : [A, w].concat(x.slice(1)), r ? ([, c, l] = x, m = { x: c, y: l }, f = 0) : i === "L" ? (m = Ot(n[0], n[1], n[2], n[3], t - h), f = lt(n[0], n[1], n[2], n[3])) : i === "A" ? (m = ge(
      n[0],
      n[1],
      n[2],
      n[3],
      n[4],
      n[5],
      n[6],
      n[7],
      n[8],
      t - h
    ), f = Bt(n[0], n[1], n[2], n[3], n[4], n[5], n[6], n[7], n[8])) : i === "C" ? (m = ve(
      n[0],
      n[1],
      n[2],
      n[3],
      n[4],
      n[5],
      n[6],
      n[7],
      t - h
    ), f = _t(n[0], n[1], n[2], n[3], n[4], n[5], n[6], n[7])) : i === "Q" ? (m = $e(n[0], n[1], n[2], n[3], n[4], n[5], t - h), f = Ft(n[0], n[1], n[2], n[3], n[4], n[5])) : i === "Z" && (n = [A, w, c, l], m = { x: c, y: l }, f = lt(n[0], n[1], n[2], n[3])), [o, a] = n.slice(-2), h < t)
      y = m;
    else
      return !1;
    h += f;
  }), t > h - bt ? { x: o, y: a } : y);
}, rt = (e) => {
  const t = R(e), s = { ...X };
  let r = !1, n = [], i = "M", o = 0, a = 0, c = 0;
  return j(t, (l, u, m, f) => {
    s.x = m, s.y = f;
    const y = G(l, s);
    [i] = y, r = i === "M", n = r ? n : [m, f].concat(y.slice(1)), r ? [, o, a] = y : i === "L" ? c += lt(n[0], n[1], n[2], n[3]) : i === "A" ? c += Bt(n[0], n[1], n[2], n[3], n[4], n[5], n[6], n[7], n[8]) : i === "C" ? c += _t(n[0], n[1], n[2], n[3], n[4], n[5], n[6], n[7]) : i === "Q" ? c += Ft(n[0], n[1], n[2], n[3], n[4], n[5]) : i === "Z" && (n = [m, f, o, a], c += lt(n[0], n[1], n[2], n[3]));
    const h = y.length;
    s.x1 = +y[h - 2], s.y1 = +y[h - 1], s.x2 = +y[h - 4] || s.x1, s.y2 = +y[h - 3] || s.y1;
  }), c;
}, Ht = (e, t) => {
  const s = R(e);
  let r = s.slice(0), n = rt(r), i = r.length - 1, o = 0, a = 0, c = s[0];
  if (i <= 0 || !t || !Number.isFinite(t))
    return {
      segment: c,
      index: 0,
      length: a,
      lengthAtSegment: o
    };
  if (t >= n)
    return r = s.slice(0, -1), o = rt(r), a = n - o, c = s[i], {
      segment: c,
      index: i,
      length: a,
      lengthAtSegment: o
    };
  const l = [];
  for (; i > 0; )
    c = r[i], r = r.slice(0, -1), o = rt(r), a = n - o, n = o, l.push({
      segment: c,
      index: i,
      length: a,
      lengthAtSegment: o
    }), i -= 1;
  return l.find(({ lengthAtSegment: u }) => u <= t);
}, Nt = (e, t) => {
  const s = R(e), r = ut(s), n = rt(r), i = (M) => {
    const d = M.x - t.x, v = M.y - t.y;
    return d * d + v * v;
  };
  let o = 8, a, c = { x: 0, y: 0 }, l = 0, u = 0, m = 1 / 0;
  for (let M = 0; M <= n; M += o)
    a = at(r, M), l = i(a), l < m && (c = a, u = M, m = l);
  o /= 2;
  let f, y, h = 0, x = 0, b = 0, A = 0;
  for (; o > 1e-6 && (h = u - o, f = at(r, h), b = i(f), x = u + o, y = at(r, x), A = i(y), h >= 0 && b < m ? (c = f, u = h, m = b) : x <= n && A < m ? (c = y, u = x, m = A) : o /= 2, !(o < 1e-5)); )
    ;
  const w = Ht(s, u), N = Math.sqrt(m);
  return { closest: c, distance: N, segment: w };
}, He = (e, t) => Nt(e, t).closest, Ue = (e, t, s, r, n, i, o, a) => 3 * ((a - t) * (s + n) - (o - e) * (r + i) + r * (e - n) - s * (t - i) + a * (n + e / 3) - o * (i + t / 3)) / 20, Pe = (e) => {
  let t = 0, s = 0, r = 0;
  return gt(e).map((n) => {
    switch (n[0]) {
      case "M":
        return [, t, s] = n, 0;
      default:
        return r = Ue(t, s, n[1], n[2], n[3], n[4], n[5], n[6]), [t, s] = n.slice(-2), r;
    }
  }).reduce((n, i) => n + i, 0);
}, Xe = (e) => Pe(gt(e)) >= 0, Jt = (e) => {
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
  const t = R(e);
  let s = [], r = "M";
  const n = 0, i = 0;
  let o = 0, a = 0;
  const c = [], l = [];
  let u = { x: n, y: i }, m = { x: n, y: i };
  const f = { ...X };
  j(t, (N, M, d, v) => {
    f.x = d, f.y = v;
    const L = G(N, f);
    [r] = L, s = [d, v].concat(L.slice(1)), r === "M" ? ([, o, a] = L, u = { x: o, y: a }, m = { x: o, y: a }) : r === "L" ? { min: u, max: m } = zt(s[0], s[1], s[2], s[3]) : r === "A" ? { min: u, max: m } = pe(s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7], s[8]) : r === "C" ? { min: u, max: m } = Te(s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7]) : r === "Q" ? { min: u, max: m } = ze(s[0], s[1], s[2], s[3], s[4], s[5]) : r === "Z" && (s = [d, v, o, a], { min: u, max: m } = zt(s[0], s[1], s[2], s[3])), c.push(u), l.push(m);
    const T = L.length;
    f.x1 = +L[T - 2], f.y1 = +L[T - 1], f.x2 = +L[T - 4] || f.x1, f.y2 = +L[T - 3] || f.y1;
  });
  const y = Math.min(...c.map((N) => N.x)), h = Math.max(...l.map((N) => N.x)), x = Math.min(...c.map((N) => N.y)), b = Math.max(...l.map((N) => N.y)), A = h - y, w = b - x;
  return {
    width: A,
    height: w,
    x: y,
    y: x,
    x2: h,
    y2: b,
    cx: y + A / 2,
    cy: x + w / 2,
    // an estimated guess
    cz: Math.max(A, w) + Math.min(A, w) / 2
  };
}, Je = (e, t) => Ht(e, t).segment, Ye = (e, t) => Nt(e, t).segment, Lt = (e) => Array.isArray(e) && e.every((t) => {
  const s = t[0].toLowerCase();
  return nt[s] === t.length - 1 && "achlmqstvz".includes(s) && t.slice(1).every(Number.isFinite);
}) && e.length > 0, qe = (e) => Lt(e) && // `isPathArray` also checks if it's `Array`
e.every(([t]) => t === t.toUpperCase()), ke = (e) => qe(e) && e.every(([t]) => "ACLMQZ".includes(t)), Ke = (e) => ke(e) && e.every(([t]) => "MC".includes(t)), We = (e, t) => {
  const { distance: s } = Nt(e, t);
  return Math.abs(s) < bt;
}, Ve = (e) => Lt(e) && // `isPathArray` checks if it's `Array`
e.slice(1).every(([t]) => t === t.toLowerCase()), Ie = (e) => {
  if (typeof e != "string" || !e.length)
    return !1;
  const t = new Rt(e);
  for (st(t); t.index < t.max && !t.err.length; )
    Et(t);
  return !t.err.length && "mM".includes(t.segments[0][0]);
}, mt = {
  line: ["x1", "y1", "x2", "y2"],
  circle: ["cx", "cy", "r"],
  ellipse: ["cx", "cy", "rx", "ry"],
  rect: ["width", "height", "x", "y", "rx", "ry"],
  polygon: ["points"],
  polyline: ["points"],
  glyph: ["d"]
}, Ge = (e) => {
  let { x1: t, y1: s, x2: r, y2: n } = e;
  return [t, s, r, n] = [t, s, r, n].map((i) => +i), [
    ["M", t, s],
    ["L", r, n]
  ];
}, tn = (e) => {
  const t = [], s = (e.points || "").trim().split(/[\s|,]/).map((n) => +n);
  let r = 0;
  for (; r < s.length; )
    t.push([r ? "L" : "M", s[r], s[r + 1]]), r += 2;
  return e.type === "polygon" ? [...t, ["z"]] : t;
}, en = (e) => {
  let { cx: t, cy: s, r } = e;
  return [t, s, r] = [t, s, r].map((n) => +n), [
    ["M", t - r, s],
    ["a", r, r, 0, 1, 0, 2 * r, 0],
    ["a", r, r, 0, 1, 0, -2 * r, 0]
  ];
}, nn = (e) => {
  let { cx: t, cy: s } = e, r = e.rx || 0, n = e.ry || r;
  return [t, s, r, n] = [t, s, r, n].map((i) => +i), [
    ["M", t - r, s],
    ["a", r, n, 0, 1, 0, 2 * r, 0],
    ["a", r, n, 0, 1, 0, -2 * r, 0]
  ];
}, sn = (e) => {
  const t = +e.x || 0, s = +e.y || 0, r = +e.width, n = +e.height;
  let i = +(e.rx || 0), o = +(e.ry || i);
  return i || o ? (i * 2 > r && (i -= (i * 2 - r) / 2), o * 2 > n && (o -= (o * 2 - n) / 2), [
    ["M", t + i, s],
    ["h", r - i * 2],
    ["s", i, 0, i, o],
    ["v", n - o * 2],
    ["s", 0, o, -i, o],
    ["h", -r + i * 2],
    ["s", -i, 0, -i, -o],
    ["v", -n + o * 2],
    ["s", 0, -o, i, -o]
  ]) : [["M", t, s], ["h", r], ["v", n], ["H", t], ["Z"]];
}, Ee = (e, t) => {
  const r = (t || document).defaultView || /* istanbul ignore next */
  window, n = Object.keys(mt), i = e instanceof r.SVGElement, o = i ? e.tagName : null;
  if (o && [...n, "path"].every((m) => o !== m))
    throw TypeError(`${E}: "${o}" is not SVGElement`);
  const a = i ? o : e.type, c = mt[a], l = { type: a };
  i ? c.forEach((m) => {
    l[m] = e.getAttribute(m);
  }) : Object.assign(l, e);
  let u = [];
  return a === "circle" ? u = en(l) : a === "ellipse" ? u = nn(l) : ["polyline", "polygon"].includes(a) ? u = tn(l) : a === "rect" ? u = sn(l) : a === "line" ? u = Ge(l) : ["glyph", "path"].includes(a) && (u = R(
    i ? e.getAttribute("d") || /* istanbul ignore next @preserve */
    "" : e.d || ""
  )), Lt(u) && u.length ? u : !1;
}, rn = (e, t, s) => {
  const r = s || document, n = r.defaultView || /* istanbul ignore next */
  window, i = Object.keys(mt), o = e instanceof n.SVGElement, a = o ? e.tagName : null;
  if (a === "path") throw TypeError(`${E}: "${a}" is already SVGPathElement`);
  if (a && i.every((x) => a !== x)) throw TypeError(`${E}: "${a}" is not SVGElement`);
  const c = r.createElementNS("http://www.w3.org/2000/svg", "path"), l = o ? a : e.type, u = mt[l], m = { type: l }, f = V.round, y = Ee(e, r), h = y && y.length ? $t(y, f) : "";
  return o ? (u.forEach((x) => {
    m[x] = e.getAttribute(x);
  }), Object.values(e.attributes).forEach(({ name: x, value: b }) => {
    u.includes(x) || c.setAttribute(x, b);
  })) : (Object.assign(m, e), Object.keys(m).forEach((x) => {
    !u.includes(x) && x !== "type" && c.setAttribute(
      x.replace(/[A-Z]/g, (b) => `-${b.toLowerCase()}`),
      m[x]
    );
  })), Ie(h) ? (c.setAttribute("d", h), t && o && (e.before(c, e), e.remove()), c) : !1;
}, Re = (e) => {
  let t = new C();
  const { origin: s } = e, [r, n] = s, { translate: i } = e, { rotate: o } = e, { skew: a } = e, { scale: c } = e;
  return Array.isArray(i) && i.length >= 2 && i.every((l) => !Number.isNaN(+l)) && i.some((l) => l !== 0) ? t = t.translate(...i) : typeof i == "number" && !Number.isNaN(i) && (t = t.translate(i)), (o || a || c) && (t = t.translate(r, n), Array.isArray(o) && o.length >= 2 && o.every((l) => !Number.isNaN(+l)) && o.some((l) => l !== 0) ? t = t.rotate(...o) : typeof o == "number" && !Number.isNaN(o) && (t = t.rotate(o)), Array.isArray(a) && a.length === 2 && a.every((l) => !Number.isNaN(+l)) && a.some((l) => l !== 0) ? (t = a[0] ? t.skewX(a[0]) : t, t = a[1] ? t.skewY(a[1]) : t) : typeof a == "number" && !Number.isNaN(a) && (t = t.skewX(a)), Array.isArray(c) && c.length >= 2 && c.every((l) => !Number.isNaN(+l)) && c.some((l) => l !== 1) ? t = t.scale(...c) : typeof c == "number" && !Number.isNaN(c) && (t = t.scale(c)), t = t.translate(-r, -n)), t;
}, je = (e, t, s, r) => {
  const [n] = e, { round: i } = V, o = typeof i == "number" ? i : (
    /* istanbul ignore next */
    4
  ), a = t.slice(1), { x1: c, y1: l, x2: u, y2: m, x: f, y } = s, [h, x] = a.slice(-2), b = e;
  if ("TQ".includes(n) || (s.qx = null, s.qy = null), n === "L") {
    if (z(f, o) === z(h, o))
      return ["V", x];
    if (z(y, o) === z(x, o))
      return ["H", h];
  } else if (n === "C") {
    const [A, w] = a;
    if (s.x1 = A, s.y1 = w, "CS".includes(r) && (z(A, o) === z(c * 2 - u, o) && z(w, o) === z(l * 2 - m, o) || z(c, o) === z(u * 2 - f, o) && z(l, o) === z(m * 2 - y, o)))
      return ["S", a[2], a[3], a[4], a[5]];
  } else if (n === "Q") {
    const [A, w] = a;
    if (s.qx = A, s.qy = w, "QT".includes(r) && z(A, o) === z(c * 2 - u, o) && z(w, o) === z(l * 2 - m, o))
      return ["T", a[2], a[3]];
  }
  return b;
}, dt = (e, t) => {
  const s = e.slice(1).map((r) => z(r, t));
  return [e[0]].concat(s);
}, Yt = (e, t) => {
  const s = xt(e), r = typeof t == "number" && t >= 0 ? t : (
    /* istanbul ignore next @preserve */
    2
  ), n = { ...X }, i = [];
  let o = "M", a = "Z";
  return j(s, (c, l, u, m) => {
    n.x = u, n.y = m;
    const f = G(c, n);
    let y = c;
    if ([o] = c, i[l] = o, l) {
      a = i[l - 1];
      const x = je(c, f, n, a), b = dt(x, r), A = b.join(""), w = St(x, l, u, m), N = dt(w, r), M = N.join("");
      y = A.length < M.length ? b : N;
    }
    const h = f.length;
    return n.x1 = +f[h - 2], n.y1 = +f[h - 1], n.x2 = +f[h - 4] || n.x1, n.y2 = +f[h - 3] || n.y1, y;
  });
}, on = (e, t) => {
  let s = C.Translate(t[0], t[1], t[2]);
  return [, , , s.m44] = t, s = e.multiply(s), [s.m41, s.m42, s.m43, s.m44];
}, It = (e, t, s) => {
  const [r, n, i] = s, [o, a, c] = on(e, [t[0], t[1], 0, 1]), l = o - r, u = a - n, m = c - i;
  return [
    // protect against division by ZERO
    l * (Math.abs(i) / Math.abs(m) || 1) + r,
    u * (Math.abs(i) / Math.abs(m) || 1) + n
  ];
}, cn = (e) => {
  const t = e.slice(1).map(
    (s, r, n) => r ? n[r - 1].slice(-2).concat(s.slice(1)) : e[0].slice(1).concat(s.slice(1))
  ).map((s) => s.map((r, n) => s[s.length - n - 2 * (1 - n % 2)])).reverse();
  return [["M"].concat(t[0].slice(0, 2))].concat(
    t.map((s) => ["C"].concat(s.slice(2)))
  );
}, yt = (e) => {
  const t = xt(e), s = ut(t), r = t.length, n = t[r - 1][0] === "Z", i = j(t, (o, a) => {
    const c = s[a], l = a && t[a - 1], u = l && l[0], m = t[a + 1], f = m && m[0], [y] = o, [h, x] = s[a ? a - 1 : r - 1].slice(-2);
    let b = o;
    switch (y) {
      case "M":
        b = n ? ["Z"] : [y, h, x];
        break;
      case "A":
        b = [
          y,
          o[1],
          o[2],
          o[3],
          o[4],
          o[5] === 1 ? 0 : 1,
          h,
          x
        ];
        break;
      case "C":
        m && f === "S" ? b = ["S", o[1], o[2], h, x] : b = [y, o[3], o[4], o[1], o[2], h, x];
        break;
      case "S":
        u && "CS".includes(u) && (!m || f !== "S") ? b = [
          "C",
          c[3],
          c[4],
          c[1],
          c[2],
          h,
          x
        ] : b = [y, c[1], c[2], h, x];
        break;
      case "Q":
        m && f === "T" ? b = ["T", h, x] : b = [y, o[1], o[2], h, x];
        break;
      case "T":
        u && "QT".includes(u) && (!m || f !== "T") ? b = ["Q", c[1], c[2], h, x] : b = [y, h, x];
        break;
      case "Z":
        b = ["M", h, x];
        break;
      case "H":
        b = [y, h];
        break;
      case "V":
        b = [y, x];
        break;
      default:
        b = [y].concat(o.slice(1, -2), h, x);
    }
    return b;
  });
  return n ? i.reverse() : [i[0]].concat(i.slice(1).reverse());
}, an = (e, t) => {
  let { round: s } = V;
  return s = t === "off" || typeof t == "number" && t >= 0 ? t : typeof s == "number" && s >= 0 ? s : (
    /* istanbul ignore next @preserve */
    "off"
  ), s === "off" ? e.slice(0) : j(e, (r) => dt(r, s));
}, ln = (e, t = 0.5) => {
  const s = t, r = e.slice(0, 2), n = e.slice(2, 4), i = e.slice(4, 6), o = e.slice(6, 8), a = O(r, n, s), c = O(n, i, s), l = O(i, o, s), u = O(a, c, s), m = O(c, l, s), f = O(u, m, s);
  return [
    ["C", a[0], a[1], u[0], u[1], f[0], f[1]],
    ["C", m[0], m[1], l[0], l[1], o[0], o[1]]
  ];
}, Kt = (e) => {
  const t = [];
  let s, r = -1, n = 0, i = 0, o = 0, a = 0;
  const c = { ...X };
  return e.forEach((l) => {
    const [u] = l, m = u.toUpperCase(), f = u.toLowerCase(), y = u === f, h = l.slice(1);
    m === "M" ? (r += 1, [n, i] = h, n += y ? c.x : 0, i += y ? c.y : 0, o = n, a = i, s = [y ? [m, o, a] : l]) : (m === "Z" ? (n = o, i = a) : m === "H" ? ([, n] = l, n += y ? c.x : (
      /* istanbul ignore next @preserve */
      0
    )) : m === "V" ? ([, i] = l, i += y ? c.y : (
      /* istanbul ignore next @preserve */
      0
    )) : ([n, i] = l.slice(-2), n += y ? c.x : 0, i += y ? c.y : 0), s.push(l)), c.x = n, c.y = i, t[r] = s;
  }), t;
}, Wt = (e, t) => {
  let s = 0, r = 0, n = 0, i = 0, o = 0, a = 0, c = "M";
  const l = { ...X }, u = R(e), m = t && Object.keys(t);
  if (!t || m && !m.length) return u.slice(0);
  t.origin || Object.assign(t, { origin: V.origin });
  const f = t.origin, y = Re(t);
  return y.isIdentity ? u.slice(0) : j(u, (h, x, b, A) => {
    l.x = b, l.y = A, [c] = h;
    const w = c.toUpperCase(), M = w !== c ? jt(h, x, b, A) : h.slice(0);
    let d = w === "A" ? Zt(M, l) : ["V", "H"].includes(w) ? G(M, l) : M;
    c = d[0];
    const v = c === "C" && d.length > 7, L = v ? d.slice(0, 7) : d.slice(0);
    if (v && (u.splice(x + 1, 0, ["C"].concat(d.slice(7))), d = L), c === "L")
      [n, i] = It(y, [d[1], d[2]], f), s !== n && r !== i ? d = ["L", n, i] : r === i ? d = ["H", n] : s === n && (d = ["V", i]);
    else
      for (o = 1, a = d.length; o < a; o += 2)
        [n, i] = It(y, [+d[o], +d[o + 1]], f), d[o] = n, d[o + 1] = i;
    s = n, r = i;
    const T = L.length;
    return l.x1 = +L[T - 2], l.y1 = +L[T - 1], l.x2 = +L[T - 4] || l.x1, l.y2 = +L[T - 3] || l.y1, d;
  });
};
class p {
  /**
   * @constructor
   * @param pathValue the path string
   * @param config instance options
   */
  constructor(t, s) {
    const r = s || {}, n = typeof t > "u";
    if (n || !t.length)
      throw TypeError(`${E}: "pathValue" is ${n ? "undefined" : "empty"}`);
    this.segments = R(t);
    const { round: i, origin: o } = r;
    let a;
    Number.isInteger(i) || i === "off" ? a = i : a = V.round;
    let c = V.origin;
    if (Array.isArray(o) && o.length >= 2) {
      const [l, u, m] = o.map(Number);
      c = [
        Number.isNaN(l) ? 0 : l,
        Number.isNaN(u) ? 0 : u,
        Number.isNaN(m) ? 0 : m
      ];
    }
    return this.round = a, this.origin = c, this;
  }
  get bbox() {
    return Jt(this.segments);
  }
  get length() {
    return rt(this.segments);
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
    return at(this.segments, t);
  }
  /**
   * Convert path to absolute values
   *
   * @public
   */
  toAbsolute() {
    const { segments: t } = this;
    return this.segments = xt(t), this;
  }
  /**
   * Convert path to relative values
   *
   * @public
   */
  toRelative() {
    const { segments: t } = this;
    return this.segments = Xt(t), this;
  }
  /**
   * Convert path to cubic-bezier values. In addition, un-necessary `Z`
   * segment is removed if previous segment extends to the `M` segment.
   *
   * @public
   */
  toCurve() {
    const { segments: t } = this;
    return this.segments = gt(t), this;
  }
  /**
   * Reverse the order of the segments and their values.
   *
   * @param onlySubpath option to reverse all sub-paths except first
   * @public
   */
  reverse(t) {
    this.toAbsolute();
    const { segments: s } = this, r = Kt(s), n = r.length > 1 ? r : !1, i = n ? n.map((a, c) => t ? c ? yt(a) : a.slice(0) : yt(a)) : s.slice(0);
    let o = [];
    return n ? o = i.flat(1) : o = t ? s : yt(s), this.segments = o.slice(0), this;
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
    return this.segments = ut(t), this;
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
    const { segments: t } = this, s = this.round === "off" ? 2 : this.round;
    return this.segments = Yt(t, s), this;
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
    if (!t || typeof t != "object" || typeof t == "object" && !["translate", "rotate", "skew", "scale"].some((c) => c in t))
      return this;
    const {
      segments: s,
      origin: [r, n, i]
    } = this, o = {};
    for (const [c, l] of Object.entries(t))
      c === "skew" && Array.isArray(l) || (c === "rotate" || c === "translate" || c === "origin" || c === "scale") && Array.isArray(l) ? o[c] = l.map(Number) : c !== "origin" && typeof Number(l) == "number" && (o[c] = Number(l));
    const { origin: a } = o;
    if (Array.isArray(a) && a.length >= 2) {
      const [c, l, u] = a.map(Number);
      o.origin = [Number.isNaN(c) ? r : c, Number.isNaN(l) ? n : l, u || i];
    } else
      o.origin = [r, n, i];
    return this.segments = Wt(s, o), this;
  }
  /**
   * Rotate path 180deg vertically
   *
   * @public
   */
  flipX() {
    const { cx: t, cy: s } = this.bbox;
    return this.transform({ rotate: [0, 180, 0], origin: [t, s, 0] }), this;
  }
  /**
   * Rotate path 180deg horizontally
   *
   * @public
   */
  flipY() {
    const { cx: t, cy: s } = this.bbox;
    return this.transform({ rotate: [180, 0, 0], origin: [t, s, 0] }), this;
  }
  /**
   * Export the current path to be used
   * for the `d` (description) attribute.
   *
   * @public
   * @return the path string
   */
  toString() {
    return $t(this.segments, this.round);
  }
}
g(p, "CSSMatrix", C), g(p, "pathToAbsolute", xt), g(p, "pathToRelative", Xt), g(p, "pathToCurve", gt), g(p, "pathToString", $t), g(p, "arcTools", Be), g(p, "bezierTools", {
  Cvalues: be,
  Tvalues: qt,
  minmaxC: kt,
  minmaxQ: pt,
  getBezierLength: ft,
  bezierLength: we,
  calculateBezier: Me,
  computeBezier: Ae,
  deriveBezier: de,
  CBEZIER_MINMAX_EPSILON: Ne
}), g(p, "cubicTools", { getCubicLength: _t, getCubicBBox: Te, getPointAtCubicLength: ve, getPointAtCubicSegmentLength: Le }), g(p, "lineTools", { getPointAtLineLength: Ot, getLineBBox: zt, getLineLength: lt }), g(p, "quadTools", { getPointAtQuadSegmentLength: Ce, getQuadLength: Ft, getQuadBBox: ze, getPointAtQuadLength: $e }), g(p, "polygonTools", { polygonArea: _e, polygonLength: Fe }), g(p, "distanceSquareRoot", Mt), g(p, "distanceEpsilon", bt), g(p, "midPoint", O), g(p, "rotateVector", ct), g(p, "roundTo", z), g(p, "finalizeSegment", Tt), g(p, "invalidPathValue", U), g(p, "isArcCommand", fe), g(p, "isDigit", H), g(p, "isDigitStart", he), g(p, "isMoveCommand", ye), g(p, "isPathCommand", me), g(p, "isSpace", ue), g(p, "paramsCount", nt), g(p, "paramsParser", X), g(p, "pathParser", Rt), g(p, "scanFlag", ae), g(p, "scanParam", le), g(p, "scanSegment", Et), g(p, "skipSpaces", st), g(p, "getPathBBox", Jt), g(p, "getPathArea", Pe), g(p, "getTotalLength", rt), g(p, "getDrawDirection", Xe), g(p, "getPointAtLength", at), g(p, "getPropertiesAtLength", Ht), g(p, "getPropertiesAtPoint", Nt), g(p, "getClosestPoint", He), g(p, "getSegmentOfPoint", Ye), g(p, "getSegmentAtLength", Je), g(p, "isPointInStroke", We), g(p, "isValidPath", Ie), g(p, "isPathArray", Lt), g(p, "isAbsoluteArray", qe), g(p, "isRelativeArray", Ve), g(p, "isCurveArray", Ke), g(p, "isNormalizedArray", ke), g(p, "shapeToPath", rn), g(p, "shapeToPathArray", Ee), g(p, "shapeParams", mt), g(p, "parsePathString", R), g(p, "absolutizeSegment", jt), g(p, "arcToCubic", Dt), g(p, "getSVGMatrix", Re), g(p, "iterate", j), g(p, "lineToCubic", Ct), g(p, "normalizePath", ut), g(p, "normalizeSegment", G), g(p, "optimizePath", Yt), g(p, "projection2d", It), g(p, "quadToCubic", xe), g(p, "relativizeSegment", St), g(p, "reverseCurve", cn), g(p, "reversePath", yt), g(p, "roundPath", an), g(p, "roundSegment", dt), g(p, "segmentToCubic", Zt), g(p, "shortenSegment", je), g(p, "splitCubic", ln), g(p, "splitPath", Kt), g(p, "transformPath", Wt);
export {
  p as default
};
//# sourceMappingURL=svg-path-commander.mjs.map
