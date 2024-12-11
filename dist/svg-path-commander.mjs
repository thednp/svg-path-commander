var Qe = Object.defineProperty;
var Ze = (e, t, s) => t in e ? Qe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s;
var b = (e, t, s) => Ze(e, typeof t != "symbol" ? t + "" : t, s);
var De = Object.defineProperty, Oe = (e, t, s) => t in e ? De(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s, j = (e, t, s) => Oe(e, typeof t != "symbol" ? t + "" : t, s);
const Be = {
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
}, Gt = (e) => (e instanceof Float64Array || e instanceof Float32Array || Array.isArray(e) && e.every((t) => typeof t == "number")) && [6, 16].some((t) => e.length === t), te = (e) => e instanceof DOMMatrix || e instanceof C || typeof e == "object" && Object.keys(Be).every((t) => e && t in e), lt = (e) => {
  const t = new C(), s = Array.from(e);
  if (!Gt(s))
    throw TypeError(
      `CSSMatrix: "${s.join(",")}" must be an array with 6/16 numbers.`
    );
  if (s.length === 16) {
    const [
      r,
      n,
      i,
      o,
      l,
      c,
      a,
      u,
      f,
      h,
      y,
      m,
      g,
      d,
      M,
      w
    ] = s;
    t.m11 = r, t.a = r, t.m21 = l, t.c = l, t.m31 = f, t.m41 = g, t.e = g, t.m12 = n, t.b = n, t.m22 = c, t.d = c, t.m32 = h, t.m42 = d, t.f = d, t.m13 = i, t.m23 = a, t.m33 = y, t.m43 = M, t.m14 = o, t.m24 = u, t.m34 = m, t.m44 = w;
  } else if (s.length === 6) {
    const [r, n, i, o, l, c] = s;
    t.m11 = r, t.a = r, t.m12 = n, t.b = n, t.m21 = i, t.c = i, t.m22 = o, t.d = o, t.m41 = l, t.e = l, t.m42 = c, t.f = c;
  }
  return t;
}, ee = (e) => {
  if (te(e))
    return lt([
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
  throw TypeError(
    `CSSMatrix: "${JSON.stringify(e)}" is not a DOMMatrix / CSSMatrix / JSON compatible object.`
  );
}, ne = (e) => {
  if (typeof e != "string")
    throw TypeError(`CSSMatrix: "${JSON.stringify(e)}" is not a string.`);
  const t = String(e).replace(/\s/g, "");
  let s = new C();
  const r = `CSSMatrix: invalid transform string "${e}"`;
  return t.split(")").filter((n) => n).forEach((n) => {
    const [i, o] = n.split("(");
    if (!o) throw TypeError(r);
    const l = o.split(",").map(
      (m) => m.includes("rad") ? parseFloat(m) * (180 / Math.PI) : parseFloat(m)
    ), [c, a, u, f] = l, h = [c, a, u], y = [c, a, u, f];
    if (i === "perspective" && c && [a, u].every((m) => m === void 0))
      s.m34 = -1 / c;
    else if (i.includes("matrix") && [6, 16].includes(l.length) && l.every((m) => !Number.isNaN(+m))) {
      const m = l.map((g) => Math.abs(g) < 1e-6 ? 0 : g);
      s = s.multiply(lt(m));
    } else if (i === "translate3d" && h.every((m) => !Number.isNaN(+m)))
      s = s.translate(c, a, u);
    else if (i === "translate" && c && u === void 0)
      s = s.translate(c, a || 0, 0);
    else if (i === "rotate3d" && y.every((m) => !Number.isNaN(+m)) && f)
      s = s.rotateAxisAngle(c, a, u, f);
    else if (i === "rotate" && c && [a, u].every((m) => m === void 0))
      s = s.rotate(0, 0, c);
    else if (i === "scale3d" && h.every((m) => !Number.isNaN(+m)) && h.some((m) => m !== 1))
      s = s.scale(c, a, u);
    else if (
      // prop === "scale" && !Number.isNaN(x) && x !== 1 && z === undefined
      // prop === "scale" && !Number.isNaN(x) && [x, y].some((n) => n !== 1) &&
      i === "scale" && !Number.isNaN(c) && (c !== 1 || a !== 1) && u === void 0
    ) {
      const m = Number.isNaN(+a) ? c : a;
      s = s.scale(c, m, 1);
    } else if (i === "skew" && (c || !Number.isNaN(c) && a) && u === void 0)
      s = s.skew(c, a || 0);
    else if (["translate", "rotate", "scale", "skew"].some(
      (m) => i.includes(m)
    ) && /[XYZ]/.test(i) && c && [a, u].every((m) => m === void 0))
      if (i === "skewX" || i === "skewY")
        s = s[i](c);
      else {
        const m = i.replace(/[XYZ]/, ""), g = i.replace(m, ""), d = ["X", "Y", "Z"].indexOf(g), M = m === "scale" ? 1 : 0, w = [
          d === 0 ? c : M,
          d === 1 ? c : M,
          d === 2 ? c : M
        ];
        s = s[m](...w);
      }
    else
      throw TypeError(r);
  }), s;
}, zt = (e, t) => t ? [e.a, e.b, e.c, e.d, e.e, e.f] : [
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
], se = (e, t, s) => {
  const r = new C();
  return r.m41 = e, r.e = e, r.m42 = t, r.f = t, r.m43 = s, r;
}, re = (e, t, s) => {
  const r = new C(), n = Math.PI / 180, i = e * n, o = t * n, l = s * n, c = Math.cos(i), a = -Math.sin(i), u = Math.cos(o), f = -Math.sin(o), h = Math.cos(l), y = -Math.sin(l), m = u * h, g = -u * y;
  r.m11 = m, r.a = m, r.m12 = g, r.b = g, r.m13 = f;
  const d = a * f * h + c * y;
  r.m21 = d, r.c = d;
  const M = c * h - a * f * y;
  return r.m22 = M, r.d = M, r.m23 = -a * u, r.m31 = a * y - c * f * h, r.m32 = a * h + c * f * y, r.m33 = c * u, r;
}, ie = (e, t, s, r) => {
  const n = new C(), i = Math.sqrt(e * e + t * t + s * s);
  if (i === 0)
    return n;
  const o = e / i, l = t / i, c = s / i, a = r * (Math.PI / 360), u = Math.sin(a), f = Math.cos(a), h = u * u, y = o * o, m = l * l, g = c * c, d = 1 - 2 * (m + g) * h;
  n.m11 = d, n.a = d;
  const M = 2 * (o * l * h + c * u * f);
  n.m12 = M, n.b = M, n.m13 = 2 * (o * c * h - l * u * f);
  const w = 2 * (l * o * h - c * u * f);
  n.m21 = w, n.c = w;
  const x = 1 - 2 * (g + y) * h;
  return n.m22 = x, n.d = x, n.m23 = 2 * (l * c * h + o * u * f), n.m31 = 2 * (c * o * h + l * u * f), n.m32 = 2 * (c * l * h - o * u * f), n.m33 = 1 - 2 * (y + m) * h, n;
}, oe = (e, t, s) => {
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
}, ce = (e) => At(e, 0), le = (e) => At(0, e), _ = (e, t) => {
  const s = t.m11 * e.m11 + t.m12 * e.m21 + t.m13 * e.m31 + t.m14 * e.m41, r = t.m11 * e.m12 + t.m12 * e.m22 + t.m13 * e.m32 + t.m14 * e.m42, n = t.m11 * e.m13 + t.m12 * e.m23 + t.m13 * e.m33 + t.m14 * e.m43, i = t.m11 * e.m14 + t.m12 * e.m24 + t.m13 * e.m34 + t.m14 * e.m44, o = t.m21 * e.m11 + t.m22 * e.m21 + t.m23 * e.m31 + t.m24 * e.m41, l = t.m21 * e.m12 + t.m22 * e.m22 + t.m23 * e.m32 + t.m24 * e.m42, c = t.m21 * e.m13 + t.m22 * e.m23 + t.m23 * e.m33 + t.m24 * e.m43, a = t.m21 * e.m14 + t.m22 * e.m24 + t.m23 * e.m34 + t.m24 * e.m44, u = t.m31 * e.m11 + t.m32 * e.m21 + t.m33 * e.m31 + t.m34 * e.m41, f = t.m31 * e.m12 + t.m32 * e.m22 + t.m33 * e.m32 + t.m34 * e.m42, h = t.m31 * e.m13 + t.m32 * e.m23 + t.m33 * e.m33 + t.m34 * e.m43, y = t.m31 * e.m14 + t.m32 * e.m24 + t.m33 * e.m34 + t.m34 * e.m44, m = t.m41 * e.m11 + t.m42 * e.m21 + t.m43 * e.m31 + t.m44 * e.m41, g = t.m41 * e.m12 + t.m42 * e.m22 + t.m43 * e.m32 + t.m44 * e.m42, d = t.m41 * e.m13 + t.m42 * e.m23 + t.m43 * e.m33 + t.m44 * e.m43, M = t.m41 * e.m14 + t.m42 * e.m24 + t.m43 * e.m34 + t.m44 * e.m44;
  return lt([
    s,
    r,
    n,
    i,
    o,
    l,
    c,
    a,
    u,
    f,
    h,
    y,
    m,
    g,
    d,
    M
  ]);
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
    return typeof t == "string" && t.length && t !== "none" ? ne(t) : Array.isArray(t) || t instanceof Float64Array || t instanceof Float32Array ? lt(t) : typeof t == "object" ? ee(t) : this;
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
    return Float32Array.from(zt(this, t));
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
    return Float64Array.from(zt(this, t));
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
    return _(this, t);
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
    return typeof i > "u" && (i = 0), typeof o > "u" && (o = 0), _(this, se(n, i, o));
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
    return typeof i > "u" && (i = t), typeof o > "u" && (o = 1), _(this, oe(n, i, o));
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
    return typeof t == "number" && typeof s > "u" && typeof r > "u" && (o = n, n = 0, i = 0), _(this, re(n, i, o));
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
    return _(this, ie(t, s, r, n));
  }
  /**
   * Specifies a skew transformation along the `x-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param angle The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skewX(t) {
    return _(this, ce(t));
  }
  /**
   * Specifies a skew transformation along the `y-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param angle The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skewY(t) {
    return _(this, le(t));
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
    return _(this, At(t, s));
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
j(C, "Translate", se), j(C, "Rotate", re), j(C, "RotateAxisAngle", ie), j(C, "Scale", oe), j(C, "SkewX", ce), j(C, "SkewY", le), j(C, "Skew", At), j(C, "Multiply", _), j(C, "fromArray", lt), j(C, "fromMatrix", ee), j(C, "fromString", ne), j(C, "toArray", zt), j(C, "isCompatibleArray", Gt), j(C, "isCompatibleObject", te);
const V = {
  origin: [0, 0, 0],
  round: 4
}, tt = {
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
}, qt = (e) => {
  let t = e.pathValue[e.segmentStart], s = t.toLowerCase();
  const { data: r } = e;
  for (; r.length >= tt[s] && (s === "m" && r.length > 2 ? (e.segments.push(
    [t].concat(
      r.splice(0, 2)
    )
  ), s = "l", t = t === "m" ? "l" : "L") : e.segments.push(
    [t].concat(
      r.splice(0, tt[s])
    )
  ), !!tt[s]); )
    ;
}, S = "SVGPathCommander Error", ae = (e) => {
  const { index: t, pathValue: s } = e, r = s.charCodeAt(t);
  if (r === 48) {
    e.param = 0, e.index += 1;
    return;
  }
  if (r === 49) {
    e.param = 1, e.index += 1;
    return;
  }
  e.err = `${S}: invalid Arc flag "${s[t]}", expecting 0 or 1 at index ${t}`;
}, U = (e) => e >= 48 && e <= 57, J = "Invalid path value", ue = (e) => {
  const { max: t, pathValue: s, index: r } = e;
  let n = r, i = !1, o = !1, l = !1, c = !1, a;
  if (n >= t) {
    e.err = `${S}: ${J} at index ${n}, "pathValue" is missing param`;
    return;
  }
  if (a = s.charCodeAt(n), (a === 43 || a === 45) && (n += 1, a = s.charCodeAt(n)), !U(a) && a !== 46) {
    e.err = `${S}: ${J} at index ${n}, "${s[n]}" is not a number`;
    return;
  }
  if (a !== 46) {
    if (i = a === 48, n += 1, a = s.charCodeAt(n), i && n < t && a && U(a)) {
      e.err = `${S}: ${J} at index ${r}, "${s[r]}" illegal number`;
      return;
    }
    for (; n < t && U(s.charCodeAt(n)); )
      n += 1, o = !0;
    a = s.charCodeAt(n);
  }
  if (a === 46) {
    for (c = !0, n += 1; U(s.charCodeAt(n)); )
      n += 1, l = !0;
    a = s.charCodeAt(n);
  }
  if (a === 101 || a === 69) {
    if (c && !o && !l) {
      e.err = `${S}: ${J} at index ${n}, "${s[n]}" invalid float exponent`;
      return;
    }
    if (n += 1, a = s.charCodeAt(n), (a === 43 || a === 45) && (n += 1), n < t && U(s.charCodeAt(n)))
      for (; n < t && U(s.charCodeAt(n)); )
        n += 1;
    else {
      e.err = `${S}: ${J} at index ${n}, "${s[n]}" invalid integer exponent`;
      return;
    }
  }
  e.index = n, e.param = +e.pathValue.slice(r, n);
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
].includes(e), et = (e) => {
  const { pathValue: t, max: s } = e;
  for (; e.index < s && me(t.charCodeAt(e.index)); )
    e.index += 1;
}, fe = (e) => {
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
}, he = (e) => U(e) || e === 43 || e === 45 || e === 46, ye = (e) => (e | 32) === 97, ge = (e) => {
  switch (e | 32) {
    case 109:
    case 77:
      return !0;
    default:
      return !1;
  }
}, Dt = (e) => {
  var c;
  const { max: t, pathValue: s, index: r, segments: n } = e, i = s.charCodeAt(r), o = tt[s[r].toLowerCase()];
  if (e.segmentStart = r, !fe(i)) {
    e.err = `${S}: ${J} "${s[r]}" is not a path command at index ${r}`;
    return;
  }
  const l = n[n.length - 1];
  if (!ge(i) && ((c = l == null ? void 0 : l[0]) == null ? void 0 : c.toLocaleLowerCase()) === "z") {
    e.err = `${S}: ${J} "${s[r]}" is not a MoveTo path command at index ${r}`;
    return;
  }
  if (e.index += 1, et(e), e.data = [], !o) {
    qt(e);
    return;
  }
  for (; ; ) {
    for (let a = o; a > 0; a -= 1) {
      if (ye(i) && (a === 3 || a === 4) ? ae(e) : ue(e), e.err.length)
        return;
      e.data.push(e.param), et(e), e.index < t && s.charCodeAt(e.index) === 44 && (e.index += 1, et(e));
    }
    if (e.index >= e.max || !he(s.charCodeAt(e.index)))
      break;
  }
  qt(e);
};
class Ot {
  constructor(t) {
    this.segments = [], this.pathValue = t, this.max = t.length, this.index = 0, this.param = 0, this.segmentStart = 0, this.data = [], this.err = "";
  }
}
const Q = (e) => {
  if (typeof e != "string")
    return e.slice(0);
  const t = new Ot(e);
  for (et(t); t.index < t.max && !t.err.length; )
    Dt(t);
  if (t != null && t.err.length)
    throw TypeError(t.err);
  return t.segments;
}, at = (e, t, s, r) => {
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
    return [
      i,
      e[1] + s,
      e[2] + r
    ];
  {
    const l = [], c = e.length;
    for (let a = 1; a < c; a += 1)
      l.push(e[a] + (a % 2 ? s : r));
    return [i].concat(l);
  }
}, Z = (e, t) => {
  let s = e.length, r, n = "M", i = "M", o = !1, l = 0, c = 0, a = 0, u = 0, f = 0;
  for (let h = 0; h < s; h += 1) {
    r = e[h], [n] = r, f = r.length, i = n.toUpperCase(), o = i !== n;
    const y = t(r, h, l, c);
    if (y === !1)
      break;
    i === "Z" ? (l = a, c = u) : i === "H" ? l = r[1] + (o ? l : 0) : i === "V" ? c = r[1] + (o ? c : 0) : (l = r[f - 2] + (o ? l : 0), c = r[f - 1] + (o ? c : 0), i === "M" && (a = l, u = c)), y && (e[h] = y, y[0] === "C" && (s = e.length));
  }
  return e;
}, ht = (e) => {
  const t = Q(e);
  return Z(t, at);
}, Bt = (e, t, s, r) => {
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
    return [
      i,
      e[1] - s,
      e[2] - r
    ];
  {
    const l = [], c = e.length;
    for (let a = 1; a < c; a += 1)
      l.push(e[a] - (a % 2 ? s : r));
    return [i].concat(l);
  }
}, Kt = (e) => {
  const t = Q(e);
  return Z(t, Bt);
}, st = (e, t, s) => {
  const { sin: r, cos: n } = Math, i = e * n(s) - t * r(s), o = e * r(s) + t * n(s);
  return { x: i, y: o };
}, Mt = (e, t, s, r, n, i, o, l, c, a) => {
  let u = e, f = t, h = s, y = r, m = l, g = c;
  const d = Math.PI * 120 / 180, M = Math.PI / 180 * (+n || 0);
  let w = [], x, p, L, T, I;
  if (a)
    [p, L, T, I] = a;
  else {
    x = st(u, f, -M), u = x.x, f = x.y, x = st(m, g, -M), m = x.x, g = x.y;
    const v = (u - m) / 2, O = (f - g) / 2;
    let X = v * v / (h * h) + O * O / (y * y);
    X > 1 && (X = Math.sqrt(X), h *= X, y *= X);
    const Ct = h * h, $t = y * y, Jt = (i === o ? -1 : 1) * Math.sqrt(
      Math.abs(
        (Ct * $t - Ct * O * O - $t * v * v) / (Ct * O * O + $t * v * v)
      )
    );
    T = Jt * h * O / y + (u + m) / 2, I = Jt * -y * v / h + (f + g) / 2, p = Math.asin(((f - I) / y * 10 ** 9 >> 0) / 10 ** 9), L = Math.asin(((g - I) / y * 10 ** 9 >> 0) / 10 ** 9), p = u < T ? Math.PI - p : p, L = m < T ? Math.PI - L : L, p < 0 && (p = Math.PI * 2 + p), L < 0 && (L = Math.PI * 2 + L), o && p > L && (p -= Math.PI * 2), !o && L > p && (L -= Math.PI * 2);
  }
  let R = L - p;
  if (Math.abs(R) > d) {
    const v = L, O = m, X = g;
    L = p + d * (o && L > p ? 1 : -1), m = T + h * Math.cos(L), g = I + y * Math.sin(L), w = Mt(m, g, h, y, n, 0, o, O, X, [
      L,
      v,
      T,
      I
    ]);
  }
  R = L - p;
  const P = Math.cos(p), z = Math.sin(p), D = Math.cos(L), K = Math.sin(L), q = Math.tan(R / 4), N = 4 / 3 * h * q, $ = 4 / 3 * y * q, E = [u, f], B = [u + N * z, f - $ * P], F = [m + N * K, g - $ * D], G = [m, g];
  if (B[0] = 2 * E[0] - B[0], B[1] = 2 * E[1] - B[1], a)
    return [B[0], B[1], F[0], F[1], G[0], G[1]].concat(w);
  w = [B[0], B[1], F[0], F[1], G[0], G[1]].concat(w);
  const W = [];
  for (let v = 0, O = w.length; v < O; v += 1)
    W[v] = v % 2 ? st(w[v - 1], w[v], M).y : st(w[v], w[v + 1], M).x;
  return W;
}, xe = (e, t, s, r, n, i) => {
  const o = 0.3333333333333333, l = 2 / 3;
  return [
    o * e + l * s,
    // cpx1
    o * t + l * r,
    // cpy1
    o * n + l * s,
    // cpx2
    o * i + l * r,
    // cpy2
    n,
    i
    // x,y
  ];
}, H = (e, t, s) => {
  const [r, n] = e, [i, o] = t;
  return [r + (i - r) * s, n + (o - n) * s];
}, Pt = (e, t, s, r) => {
  const n = H([e, t], [s, r], 0.3333333333333333), i = H([e, t], [s, r], 2 / 3);
  return [n[0], n[1], i[0], i[1], s, r];
}, pe = (e, t) => {
  const [s] = e, r = e.slice(1).map(Number), [n, i] = r, { x1: o, y1: l, x: c, y: a } = t;
  return "TQ".includes(s) || (t.qx = null, t.qy = null), s === "M" ? (t.x = n, t.y = i, e) : s === "A" ? ["C"].concat(
    Mt(
      o,
      l,
      r[0],
      r[1],
      r[2],
      r[3],
      r[4],
      r[5],
      r[6]
    )
  ) : s === "Q" ? (t.qx = n, t.qy = i, ["C"].concat(
    xe(o, l, r[0], r[1], r[2], r[3])
  )) : s === "L" ? ["C"].concat(
    Pt(o, l, n, i)
  ) : s === "Z" ? ["C"].concat(
    Pt(o, l, c, a)
  ) : e;
}, Nt = (e, t) => {
  const [s] = e, r = s.toUpperCase(), n = s !== r, { x1: i, y1: o, x2: l, y2: c, x: a, y: u } = t, f = e.slice(1);
  let h = f.map((y, m) => y + (n ? m % 2 ? u : a : 0));
  if ("TQ".includes(r) || (t.qx = null, t.qy = null), r === "A")
    return h = f.slice(0, -2).concat(
      f[5] + (n ? a : 0),
      f[6] + (n ? u : 0)
    ), ["A"].concat(h);
  if (r === "H")
    return [
      "L",
      e[1] + (n ? a : 0),
      o
    ];
  if (r === "V")
    return [
      "L",
      i,
      e[1] + (n ? u : 0)
    ];
  if (r === "L")
    return [
      "L",
      e[1] + (n ? a : 0),
      e[2] + (n ? u : 0)
    ];
  if (r === "M")
    return [
      "M",
      e[1] + (n ? a : 0),
      e[2] + (n ? u : 0)
    ];
  if (r === "C")
    return ["C"].concat(h);
  if (r === "S") {
    const y = i * 2 - l, m = o * 2 - c;
    return t.x1 = y, t.y1 = m, ["C", y, m].concat(h);
  } else if (r === "T") {
    const y = i * 2 - (t.qx ? t.qx : (
      /* istanbul ignore next */
      0
    )), m = o * 2 - (t.qy ? t.qy : (
      /* istanbul ignore next */
      0
    ));
    return t.qx = y, t.qy = m, ["Q", y, m].concat(h);
  } else if (r === "Q") {
    const [y, m] = h;
    return t.qx = y, t.qy = m, ["Q"].concat(h);
  } else if (r === "Z")
    return ["Z"];
  return e;
}, ut = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  x: 0,
  y: 0,
  qx: null,
  qy: null
}, yt = (e) => {
  const t = { ...ut }, s = Q(e);
  return Z(s, (r, n, i, o) => {
    t.x = i, t.y = o;
    const l = Nt(r, t);
    let c = pe(l, t);
    c[0] === "C" && c.length > 7 && (s.splice(
      n + 1,
      0,
      ["C"].concat(c.slice(7))
    ), c = c.slice(0, 7));
    const u = c.length;
    return t.x1 = +c[u - 2], t.y1 = +c[u - 1], t.x2 = +c[u - 4] || t.x1, t.y2 = +c[u - 3] || t.y1, c;
  });
}, k = (e, t) => {
  const s = t >= 1 ? 10 ** t : 1;
  return t > 0 ? Math.round(e * s) / s : Math.round(e);
}, kt = (e, t) => {
  const s = e.length;
  let { round: r } = V, n = e[0], i = "";
  r = t === "off" || typeof t == "number" && t >= 0 ? t : typeof r == "number" && r >= 0 ? r : (
    /* istanbul ignore next @preserve */
    "off"
  );
  for (let o = 0; o < s; o += 1) {
    n = e[o];
    const [l] = n, c = n.slice(1);
    if (i += l, r === "off")
      i += c.join(" ");
    else {
      let a = 0;
      const u = c.length;
      for (; a < u; )
        i += k(c[a], r), a !== u - 1 && (i += " "), a += 1;
    }
  }
  return i;
}, wt = (e, t) => Math.sqrt(
  (e[0] - t[0]) * (e[0] - t[0]) + (e[1] - t[1]) * (e[1] - t[1])
), it = (e, t, s, r) => wt([e, t], [s, r]), Ht = (e, t, s, r, n) => {
  let i = { x: e, y: t };
  if (typeof n == "number") {
    const o = wt([e, t], [s, r]);
    if (n <= 0)
      i = { x: e, y: t };
    else if (n >= o)
      i = { x: s, y: r };
    else {
      const [l, c] = H([e, t], [s, r], n / o);
      i = { x: l, y: c };
    }
  }
  return i;
}, It = (e, t, s, r) => {
  const { min: n, max: i } = Math;
  return [n(e, s), n(t, r), i(e, s), i(t, r)];
}, Ft = (e, t, s) => {
  const r = s / 2, n = Math.sin(r), i = Math.cos(r), o = e ** 2 * n ** 2, l = t ** 2 * i ** 2, c = Math.sqrt(o + l) * s;
  return Math.abs(c);
}, Y = (e, t, s, r, n, i) => {
  const { sin: o, cos: l } = Math, c = l(n), a = o(n), u = s * l(i), f = r * o(i);
  return [e + c * u - a * f, t + a * u + c * f];
}, Et = (e, t) => {
  const { x: s, y: r } = e, { x: n, y: i } = t, o = s * n + r * i, l = Math.sqrt((s ** 2 + r ** 2) * (n ** 2 + i ** 2));
  return (s * i - r * n < 0 ? -1 : 1) * Math.acos(o / l);
}, Lt = (e, t, s, r, n, i, o, l, c) => {
  const { abs: a, sin: u, cos: f, sqrt: h, PI: y } = Math;
  let m = a(s), g = a(r);
  const M = (n % 360 + 360) % 360 * (y / 180);
  if (e === l && t === c)
    return {
      rx: m,
      ry: g,
      startAngle: 0,
      endAngle: 0,
      center: { x: l, y: c }
    };
  if (m === 0 || g === 0)
    return {
      rx: m,
      ry: g,
      startAngle: 0,
      endAngle: 0,
      center: { x: (l + e) / 2, y: (c + t) / 2 }
    };
  const w = (e - l) / 2, x = (t - c) / 2, p = {
    x: f(M) * w + u(M) * x,
    y: -u(M) * w + f(M) * x
  }, L = p.x ** 2 / m ** 2 + p.y ** 2 / g ** 2;
  L > 1 && (m *= h(L), g *= h(L));
  const T = m ** 2 * g ** 2 - m ** 2 * p.y ** 2 - g ** 2 * p.x ** 2, I = m ** 2 * p.y ** 2 + g ** 2 * p.x ** 2;
  let R = T / I;
  R = R < 0 ? 0 : R;
  const P = (i !== o ? 1 : -1) * h(R), z = {
    x: P * (m * p.y / g),
    y: P * (-(g * p.x) / m)
  }, D = {
    x: f(M) * z.x - u(M) * z.y + (e + l) / 2,
    y: u(M) * z.x + f(M) * z.y + (t + c) / 2
  }, K = {
    x: (p.x - z.x) / m,
    y: (p.y - z.y) / g
  }, q = Et({ x: 1, y: 0 }, K), N = {
    x: (-p.x - z.x) / m,
    y: (-p.y - z.y) / g
  };
  let $ = Et(K, N);
  !o && $ > 0 ? $ -= 2 * y : o && $ < 0 && ($ += 2 * y), $ %= 2 * y;
  const E = q + $;
  return {
    center: D,
    startAngle: q,
    endAngle: E,
    rx: m,
    ry: g
  };
}, _t = (e, t, s, r, n, i, o, l, c) => {
  const { rx: a, ry: u, startAngle: f, endAngle: h } = Lt(
    e,
    t,
    s,
    r,
    n,
    i,
    o,
    l,
    c
  );
  return Ft(a, u, h - f);
}, be = (e, t, s, r, n, i, o, l, c, a) => {
  let u = { x: e, y: t };
  const { center: f, rx: h, ry: y, startAngle: m, endAngle: g } = Lt(
    e,
    t,
    s,
    r,
    n,
    i,
    o,
    l,
    c
  );
  if (typeof a == "number") {
    const d = Ft(h, y, g - m);
    if (a <= 0)
      u = { x: e, y: t };
    else if (a >= d)
      u = { x: l, y: c };
    else {
      if (e === l && t === c)
        return { x: l, y: c };
      if (h === 0 || y === 0)
        return Ht(e, t, l, c, a);
      const { PI: M, cos: w, sin: x } = Math, p = g - m, T = (n % 360 + 360) % 360 * (M / 180), I = m + p * (a / d), R = h * w(I), P = y * x(I);
      u = {
        x: w(T) * R - x(T) * P + f.x,
        y: x(T) * R + w(T) * P + f.y
      };
    }
  }
  return u;
}, de = (e, t, s, r, n, i, o, l, c) => {
  const { center: a, rx: u, ry: f, startAngle: h, endAngle: y } = Lt(
    e,
    t,
    s,
    r,
    n,
    i,
    o,
    l,
    c
  ), m = y - h, { min: g, max: d, tan: M, atan2: w, PI: x } = Math, { x: p, y: L } = a, T = n * x / 180, I = M(T), R = w(-f * I, u), P = R, z = R + x, D = w(f, u * I), K = D + x;
  let q = g(e, l), N = d(e, l), $ = g(t, c), E = d(t, c);
  const B = y - m * 1e-3, F = Y(p, L, u, f, T, B), G = y - m * 0.999, W = Y(p, L, u, f, T, G);
  if (F[0] > N || W[0] > N) {
    const v = Y(p, L, u, f, T, P);
    q = g(q, v[0]), $ = g($, v[1]), N = d(N, v[0]), E = d(E, v[1]);
  }
  if (F[0] < q || W[0] < q) {
    const v = Y(p, L, u, f, T, z);
    q = g(q, v[0]), $ = g($, v[1]), N = d(N, v[0]), E = d(E, v[1]);
  }
  if (F[1] < $ || W[1] < $) {
    const v = Y(p, L, u, f, T, K);
    q = g(q, v[0]), $ = g($, v[1]), N = d(N, v[0]), E = d(E, v[1]);
  }
  if (F[1] > E || W[1] > E) {
    const v = Y(p, L, u, f, T, D);
    q = g(q, v[0]), $ = g($, v[1]), N = d(N, v[0]), E = d(E, v[1]);
  }
  return [q, $, N, E];
}, He = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  angleBetween: Et,
  arcLength: Ft,
  arcPoint: Y,
  getArcBBox: de,
  getArcLength: _t,
  getArcProps: Lt,
  getPointAtArcLength: be
}, Symbol.toStringTag, { value: "Module" })), Rt = [
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
], Me = (e) => {
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
}, Ne = (e, t) => {
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
  let l = 0, c = 0, a = 0, u = 0;
  return s === 2 ? (n = [n[0], n[1], n[2], { x: 0, y: 0 }], l = i, c = r * t * 2, a = o) : s === 3 && (l = i * r, c = i * t * 3, a = r * o * 3, u = t * o), {
    x: l * n[0].x + c * n[1].x + a * n[2].x + u * n[3].x,
    y: l * n[0].y + c * n[1].y + a * n[2].y + u * n[3].y,
    t
  };
}, we = (e, t) => {
  const s = e(t), r = s.x * s.x + s.y * s.y;
  return Math.sqrt(r);
}, Le = (e) => {
  const s = Rt.length;
  let r = 0;
  for (let n = 0, i; n < s; n++)
    i = 0.5 * Rt[n] + 0.5, r += Ae[n] * we(e, i);
  return 0.5 * r;
}, mt = (e) => {
  const t = [];
  for (let r = 0, n = e.length, i = 2; r < n; r += i)
    t.push({
      x: e[r],
      y: e[r + 1]
    });
  const s = Me(t);
  return Le((r) => Ne(s[0], r));
}, ve = 1e-8, gt = ([e, t, s]) => {
  const r = Math.min(e, s), n = Math.max(e, s);
  if (t >= e ? s >= t : s <= t)
    return [r, n];
  const i = (e * s - t * t) / (e - 2 * t + s);
  return i < r ? [i, n] : [r, i];
}, jt = ([e, t, s, r]) => {
  const n = e - 3 * t + 3 * s - r;
  if (Math.abs(n) < ve)
    return e === r && e === t ? [e, r] : gt([e, -0.5 * e + 1.5 * t, e - 3 * t + 3 * s]);
  const i = -e * s + e * r - t * s - t * r + t * t + s * s;
  if (i <= 0)
    return [Math.min(e, r), Math.max(e, r)];
  const o = Math.sqrt(i);
  let l = Math.min(e, r), c = Math.max(e, r);
  const a = e - 2 * t + s;
  for (let u = (a + o) / n, f = 1; f <= 2; u = (a - o) / n, f++)
    if (u > 0 && u < 1) {
      const h = e * (1 - u) * (1 - u) * (1 - u) + t * 3 * (1 - u) * (1 - u) * u + s * 3 * (1 - u) * u * u + r * u * u * u;
      h < l && (l = h), h > c && (c = h);
    }
  return [l, c];
}, Te = ([e, t, s, r, n, i, o, l], c) => {
  const a = 1 - c;
  return {
    x: a ** 3 * e + 3 * a ** 2 * c * s + 3 * a * c ** 2 * n + c ** 3 * o,
    y: a ** 3 * t + 3 * a ** 2 * c * r + 3 * a * c ** 2 * i + c ** 3 * l
  };
}, xt = (e, t, s, r, n, i, o, l) => mt([e, t, s, r, n, i, o, l]), Ce = (e, t, s, r, n, i, o, l, c) => {
  const a = typeof c == "number";
  let u = { x: e, y: t };
  if (a) {
    const f = mt([e, t, s, r, n, i, o, l]);
    c <= 0 || (c >= f ? u = { x: o, y: l } : u = Te(
      [e, t, s, r, n, i, o, l],
      c / f
    ));
  }
  return u;
}, St = (e, t, s, r, n, i, o, l) => {
  const c = jt([e, s, n, o]), a = jt([t, r, i, l]);
  return [c[0], a[0], c[1], a[1]];
}, $e = ([e, t, s, r, n, i], o) => {
  const l = 1 - o;
  return {
    x: l ** 2 * e + 2 * l * o * s + o ** 2 * n,
    y: l ** 2 * t + 2 * l * o * r + o ** 2 * i
  };
}, pt = (e, t, s, r, n, i) => mt([e, t, s, r, n, i]), ze = (e, t, s, r, n, i, o) => {
  const l = typeof o == "number";
  let c = { x: e, y: t };
  if (l) {
    const a = mt([e, t, s, r, n, i]);
    o <= 0 || (o >= a ? c = { x: n, y: i } : c = $e(
      [e, t, s, r, n, i],
      o / a
    ));
  }
  return c;
}, Qt = (e, t, s, r, n, i) => {
  const o = gt([e, s, n]), l = gt([t, r, i]);
  return [o[0], l[0], o[1], l[1]];
}, Fe = (e) => {
  const t = e.length;
  let s = -1, r, n = e[t - 1], i = 0;
  for (; ++s < t; )
    r = n, n = e[s], i += r[1] * n[0] - r[0] * n[1];
  return i / 2;
}, _e = (e) => e.reduce((t, s, r) => r ? t + wt(e[r - 1], s) : 0, 0), bt = 1e-5, ot = (e) => {
  const t = Q(e), s = { ...ut };
  return Z(t, (r, n, i, o) => {
    s.x = i, s.y = o;
    const l = Nt(r, s), c = l.length;
    return s.x1 = +l[c - 2], s.y1 = +l[c - 1], s.x2 = +l[c - 4] || s.x1, s.y2 = +l[c - 3] || s.y1, l;
  });
}, rt = (e, t) => {
  const s = ot(e);
  let r = !1, n = [], i = "M", o = 0, l = 0, [c, a] = s[0].slice(1);
  const u = typeof t == "number";
  let f = { x: c, y: a }, h = 0, y = f, m = 0;
  return !u || t < bt ? f : (Z(s, (g, d, M, w) => {
    if ([i] = g, r = i === "M", n = r ? n : [M, w].concat(g.slice(1)), r ? ([, c, a] = g, f = { x: c, y: a }, h = 0) : i === "L" ? (f = Ht(
      n[0],
      n[1],
      n[2],
      n[3],
      t - m
    ), h = it(n[0], n[1], n[2], n[3])) : i === "A" ? (f = be(
      n[0],
      n[1],
      n[2],
      n[3],
      n[4],
      n[5],
      n[6],
      n[7],
      n[8],
      t - m
    ), h = _t(
      n[0],
      n[1],
      n[2],
      n[3],
      n[4],
      n[5],
      n[6],
      n[7],
      n[8]
    )) : i === "C" ? (f = Ce(
      n[0],
      n[1],
      n[2],
      n[3],
      n[4],
      n[5],
      n[6],
      n[7],
      t - m
    ), h = xt(
      n[0],
      n[1],
      n[2],
      n[3],
      n[4],
      n[5],
      n[6],
      n[7]
    )) : i === "Q" ? (f = ze(
      n[0],
      n[1],
      n[2],
      n[3],
      n[4],
      n[5],
      t - m
    ), h = pt(
      n[0],
      n[1],
      n[2],
      n[3],
      n[4],
      n[5]
    )) : i === "Z" && (n = [M, w, c, a], f = { x: c, y: a }, h = it(n[0], n[1], n[2], n[3])), [o, l] = n.slice(-2), m < t)
      y = f;
    else
      return !1;
    m += h;
  }), t > m - bt ? { x: o, y: l } : y);
}, nt = (e) => {
  const t = Q(e);
  let s = 0, r = 0, n = 0, i = 0, o = 0, l = 0, c = "M", a = 0, u = 0, f = 0;
  return Z(t, (h, y, m, g) => {
    [c] = h;
    const d = c.toUpperCase(), w = d !== c ? at(h, y, m, g) : h.slice(0), x = d === "V" ? ["L", m, w[1]] : d === "H" ? ["L", w[1], g] : w;
    if ([c] = x, "TQ".includes(d) || (o = 0, l = 0), c === "M")
      [, a, u] = x;
    else if (c === "L")
      f += it(
        m,
        g,
        x[1],
        x[2]
      );
    else if (c === "A")
      f += _t(
        m,
        g,
        x[1],
        x[2],
        x[3],
        x[4],
        x[5],
        x[6],
        x[7]
      );
    else if (c === "S") {
      const p = s * 2 - n, L = r * 2 - i;
      f += xt(
        m,
        g,
        p,
        L,
        x[1],
        x[2],
        x[3],
        x[4]
      );
    } else c === "C" ? f += xt(
      m,
      g,
      x[1],
      x[2],
      x[3],
      x[4],
      x[5],
      x[6]
    ) : c === "T" ? (o = s * 2 - o, l = r * 2 - l, f += pt(
      m,
      g,
      o,
      l,
      x[1],
      x[2]
    )) : c === "Q" ? (o = x[1], l = x[2], f += pt(
      m,
      g,
      x[1],
      x[2],
      x[3],
      x[4]
    )) : c === "Z" && (f += it(m, g, a, u));
    [s, r] = c === "Z" ? [a, u] : x.slice(-2), [n, i] = c === "C" ? [x[3], x[4]] : c === "S" ? [x[1], x[2]] : [s, r];
  }), f;
}, Ut = (e, t) => {
  const s = Q(e);
  let r = s.slice(0), n = nt(r), i = r.length - 1, o = 0, l = 0, c = s[0];
  if (i <= 0 || !t || !Number.isFinite(t))
    return {
      segment: c,
      index: 0,
      length: l,
      lengthAtSegment: o
    };
  if (t >= n)
    return r = s.slice(0, -1), o = nt(r), l = n - o, c = s[i], {
      segment: c,
      index: i,
      length: l,
      lengthAtSegment: o
    };
  const a = [];
  for (; i > 0; )
    c = r[i], r = r.slice(0, -1), o = nt(r), l = n - o, n = o, a.push({
      segment: c,
      index: i,
      length: l,
      lengthAtSegment: o
    }), i -= 1;
  return a.find(
    ({ lengthAtSegment: u }) => u <= t
  );
}, vt = (e, t) => {
  const s = Q(e), r = ot(s), n = nt(r), i = (p) => {
    const L = p.x - t.x, T = p.y - t.y;
    return L * L + T * T;
  };
  let o = 8, l, c = { x: 0, y: 0 }, a = 0, u = 0, f = 1 / 0;
  for (let p = 0; p <= n; p += o)
    l = rt(r, p), a = i(l), a < f && (c = l, u = p, f = a);
  o /= 2;
  let h, y, m = 0, g = 0, d = 0, M = 0;
  for (; o > 1e-6 && (m = u - o, h = rt(r, m), d = i(h), g = u + o, y = rt(r, g), M = i(y), m >= 0 && d < f ? (c = h, u = m, f = d) : g <= n && M < f ? (c = y, u = g, f = M) : o /= 2, !(o < 1e-5)); )
    ;
  const w = Ut(s, u), x = Math.sqrt(f);
  return { closest: c, distance: x, segment: w };
}, Ue = (e, t) => vt(e, t).closest, Je = (e, t, s, r, n, i, o, l) => 3 * ((l - t) * (s + n) - (o - e) * (r + i) + r * (e - n) - s * (t - i) + l * (n + e / 3) - o * (i + t / 3)) / 20, qe = (e) => {
  let t = 0, s = 0, r = 0;
  return yt(e).map((n) => {
    switch (n[0]) {
      case "M":
        return [, t, s] = n, 0;
      default:
        return r = Je(
          t,
          s,
          n[1],
          n[2],
          n[3],
          n[4],
          n[5],
          n[6]
        ), [t, s] = n.slice(-2), r;
    }
  }).reduce((n, i) => n + i, 0);
}, Ke = (e) => qe(yt(e)) >= 0, Wt = (e) => {
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
  const t = Q(e);
  let s = "M", r = 0, n = 0;
  const { max: i, min: o } = Math;
  let l = 1 / 0, c = 1 / 0, a = -1 / 0, u = -1 / 0, f = 0, h = 0, y = 0, m = 0, g = 0, d = 0, M = 0, w = 0, x = 0, p = 0;
  Z(t, (I, R, P, z) => {
    [s] = I;
    const D = s.toUpperCase(), q = D !== s ? at(I, R, P, z) : I.slice(0), N = D === "V" ? ["L", P, q[1]] : D === "H" ? ["L", q[1], z] : q;
    if ([s] = N, "TQ".includes(D) || (x = 0, p = 0), s === "M")
      [, r, n] = N, f = r, h = n, y = r, m = n;
    else if (s === "L")
      [f, h, y, m] = It(
        P,
        z,
        N[1],
        N[2]
      );
    else if (s === "A")
      [f, h, y, m] = de(
        P,
        z,
        N[1],
        N[2],
        N[3],
        N[4],
        N[5],
        N[6],
        N[7]
      );
    else if (s === "S") {
      const $ = g * 2 - M, E = d * 2 - w;
      [f, h, y, m] = St(
        P,
        z,
        $,
        E,
        N[1],
        N[2],
        N[3],
        N[4]
      );
    } else s === "C" ? [f, h, y, m] = St(
      P,
      z,
      N[1],
      N[2],
      N[3],
      N[4],
      N[5],
      N[6]
    ) : s === "T" ? (x = g * 2 - x, p = d * 2 - p, [f, h, y, m] = Qt(
      P,
      z,
      x,
      p,
      N[1],
      N[2]
    )) : s === "Q" ? (x = N[1], p = N[2], [f, h, y, m] = Qt(
      P,
      z,
      N[1],
      N[2],
      N[3],
      N[4]
    )) : s === "Z" && ([f, h, y, m] = It(P, z, r, n));
    l = o(f, l), c = o(h, c), a = i(y, a), u = i(m, u), [g, d] = s === "Z" ? [r, n] : N.slice(-2), [M, w] = s === "C" ? [N[3], N[4]] : s === "S" ? [N[1], N[2]] : [g, d];
  });
  const L = a - l, T = u - c;
  return {
    width: L,
    height: T,
    x: l,
    y: c,
    x2: a,
    y2: u,
    cx: l + L / 2,
    cy: c + T / 2,
    // an estimated guess
    cz: Math.max(L, T) + Math.min(L, T) / 2
  };
}, We = (e, t) => Ut(e, t).segment, Xe = (e, t) => vt(e, t).segment, Tt = (e) => Array.isArray(e) && e.every((t) => {
  const s = t[0].toLowerCase();
  return tt[s] === t.length - 1 && "achlmqstvz".includes(s) && t.slice(1).every(Number.isFinite);
}) && e.length > 0, Pe = (e) => Tt(e) && // `isPathArray` also checks if it's `Array`
e.every(([t]) => t === t.toUpperCase()), ke = (e) => Pe(e) && e.every(([t]) => "ACLMQZ".includes(t)), Ye = (e) => ke(e) && e.every(([t]) => "MC".includes(t)), Ve = (e, t) => {
  const { distance: s } = vt(e, t);
  return Math.abs(s) < bt;
}, Ge = (e) => Tt(e) && // `isPathArray` checks if it's `Array`
e.slice(1).every(([t]) => t === t.toLowerCase()), Ie = (e) => {
  if (typeof e != "string" || !e.length)
    return !1;
  const t = new Ot(e);
  for (et(t); t.index < t.max && !t.err.length; )
    Dt(t);
  return !t.err.length && "mM".includes(t.segments[0][0]);
}, ct = {
  line: ["x1", "y1", "x2", "y2"],
  circle: ["cx", "cy", "r"],
  ellipse: ["cx", "cy", "rx", "ry"],
  rect: ["width", "height", "x", "y", "rx", "ry"],
  polygon: ["points"],
  polyline: ["points"],
  glyph: ["d"]
}, Ee = (e) => e != null && typeof e == "object" && e.nodeType === 1, tn = (e) => {
  let { x1: t, y1: s, x2: r, y2: n } = e;
  return [t, s, r, n] = [t, s, r, n].map((i) => +i), [
    ["M", t, s],
    ["L", r, n]
  ];
}, en = (e) => {
  const t = [], s = (e.points || "").trim().split(/[\s|,]/).map((n) => +n);
  let r = 0;
  for (; r < s.length; )
    t.push([r ? "L" : "M", s[r], s[r + 1]]), r += 2;
  return e.type === "polygon" ? [...t, ["z"]] : t;
}, nn = (e) => {
  let { cx: t, cy: s, r } = e;
  return [t, s, r] = [t, s, r].map((n) => +n), [
    ["M", t - r, s],
    ["a", r, r, 0, 1, 0, 2 * r, 0],
    ["a", r, r, 0, 1, 0, -2 * r, 0]
  ];
}, sn = (e) => {
  let { cx: t, cy: s } = e, r = e.rx || 0, n = e.ry || r;
  return [t, s, r, n] = [t, s, r, n].map((i) => +i), [
    ["M", t - r, s],
    ["a", r, n, 0, 1, 0, 2 * r, 0],
    ["a", r, n, 0, 1, 0, -2 * r, 0]
  ];
}, rn = (e) => {
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
}, Re = (e) => {
  const t = Object.keys(ct), s = Ee(e), r = s ? e.tagName : null;
  if (r && [...t, "path"].every((c) => r !== c))
    throw TypeError(`${S}: "${r}" is not SVGElement`);
  const n = s ? r : e.type, i = ct[n], o = { type: n };
  s ? i.forEach((c) => {
    o[c] = e.getAttribute(c);
  }) : Object.assign(o, e);
  let l = [];
  return n === "circle" ? l = nn(o) : n === "ellipse" ? l = sn(o) : ["polyline", "polygon"].includes(n) ? l = en(o) : n === "rect" ? l = rn(o) : n === "line" ? l = tn(o) : ["glyph", "path"].includes(n) && (l = Q(
    s ? e.getAttribute("d") || /* istanbul ignore next @preserve */
    "" : e.d || ""
  )), Tt(l) && l.length ? l : !1;
}, on = (e, t, s) => {
  const r = s || document, n = Object.keys(ct), i = Ee(e), o = i ? e.tagName : null;
  if (o === "path")
    throw TypeError(`${S}: "${o}" is already SVGPathElement`);
  if (o && n.every((m) => o !== m))
    throw TypeError(`${S}: "${o}" is not SVGElement`);
  const l = r.createElementNS("http://www.w3.org/2000/svg", "path"), c = i ? o : e.type, a = ct[c], u = { type: c }, f = V.round, h = Re(e), y = h && h.length ? kt(h, f) : "";
  return i ? (a.forEach((m) => {
    u[m] = e.getAttribute(m);
  }), Object.values(e.attributes).forEach(({ name: m, value: g }) => {
    a.includes(m) || l.setAttribute(m, g);
  })) : (Object.assign(u, e), Object.keys(u).forEach((m) => {
    !a.includes(m) && m !== "type" && l.setAttribute(
      m.replace(/[A-Z]/g, (g) => `-${g.toLowerCase()}`),
      u[m]
    );
  })), Ie(y) ? (l.setAttribute("d", y), t && i && (e.before(l, e), e.remove()), l) : !1;
}, je = (e) => {
  let t = new C();
  const { origin: s } = e, [r, n] = s, { translate: i } = e, { rotate: o } = e, { skew: l } = e, { scale: c } = e;
  return Array.isArray(i) && i.length >= 2 && i.every((a) => !Number.isNaN(+a)) && i.some((a) => a !== 0) ? t = t.translate(...i) : typeof i == "number" && !Number.isNaN(i) && (t = t.translate(i)), (o || l || c) && (t = t.translate(r, n), Array.isArray(o) && o.length >= 2 && o.every((a) => !Number.isNaN(+a)) && o.some((a) => a !== 0) ? t = t.rotate(...o) : typeof o == "number" && !Number.isNaN(o) && (t = t.rotate(o)), Array.isArray(l) && l.length === 2 && l.every(
    (a) => !Number.isNaN(+a)
  ) && l.some((a) => a !== 0) ? (t = l[0] ? t.skewX(l[0]) : t, t = l[1] ? t.skewY(l[1]) : t) : typeof l == "number" && !Number.isNaN(l) && (t = t.skewX(l)), Array.isArray(c) && c.length >= 2 && c.every(
    (a) => !Number.isNaN(+a)
  ) && c.some((a) => a !== 1) ? t = t.scale(...c) : typeof c == "number" && !Number.isNaN(c) && (t = t.scale(c)), t = t.translate(-r, -n)), t;
}, Se = (e, t, s, r) => {
  const [n] = e, { round: i } = V, o = typeof i == "number" ? i : (
    /* istanbul ignore next */
    4
  ), l = t.slice(1), { x1: c, y1: a, x2: u, y2: f, x: h, y } = s, [m, g] = l.slice(-2), d = e;
  if ("TQ".includes(n) || (s.qx = null, s.qy = null), n === "L") {
    if (k(h, o) === k(m, o))
      return ["V", g];
    if (k(y, o) === k(g, o))
      return ["H", m];
  } else if (n === "C") {
    const [M, w] = l;
    if (s.x1 = M, s.y1 = w, "CS".includes(r) && (k(M, o) === k(c * 2 - u, o) && k(w, o) === k(a * 2 - f, o) || k(c, o) === k(u * 2 - h, o) && k(a, o) === k(f * 2 - y, o)))
      return [
        "S",
        l[2],
        l[3],
        l[4],
        l[5]
      ];
  } else if (n === "Q") {
    const [M, w] = l;
    if (s.qx = M, s.qy = w, "QT".includes(r) && k(M, o) === k(c * 2 - u, o) && k(w, o) === k(a * 2 - f, o))
      return ["T", l[2], l[3]];
  }
  return d;
}, dt = (e, t) => {
  const s = e.slice(1).map(
    (r) => k(r, t)
  );
  return [e[0]].concat(s);
}, Xt = (e, t) => {
  const s = ht(e), r = typeof t == "number" && t >= 0 ? t : (
    /* istanbul ignore next @preserve */
    2
  ), n = { ...ut }, i = [];
  let o = "M", l = "Z";
  return Z(s, (c, a, u, f) => {
    n.x = u, n.y = f;
    const h = Nt(c, n);
    let y = c;
    if ([o] = c, i[a] = o, a) {
      l = i[a - 1];
      const g = Se(
        c,
        h,
        n,
        l
      ), d = dt(g, r), M = d.join(""), w = Bt(g, a, u, f), x = dt(w, r), p = x.join("");
      y = M.length < p.length ? d : x;
    }
    const m = h.length;
    return n.x1 = +h[m - 2], n.y1 = +h[m - 1], n.x2 = +h[m - 4] || n.x1, n.y2 = +h[m - 3] || n.y1, y;
  });
}, cn = (e, t) => {
  let s = C.Translate(t[0], t[1], t[2]);
  return [, , , s.m44] = t, s = e.multiply(s), [s.m41, s.m42, s.m43, s.m44];
}, Zt = (e, t, s) => {
  const [r, n, i] = s, [o, l, c] = cn(e, [t[0], t[1], 0, 1]), a = o - r, u = l - n, f = c - i;
  return [
    // protect against division by ZERO
    a * (Math.abs(i) / Math.abs(f) || 1) + r,
    u * (Math.abs(i) / Math.abs(f) || 1) + n
  ];
}, ln = (e) => {
  const t = e.slice(1).map(
    (s, r, n) => r ? n[r - 1].slice(-2).concat(s.slice(1)) : e[0].slice(1).concat(s.slice(1))
  ).map((s) => s.map((r, n) => s[s.length - n - 2 * (1 - n % 2)])).reverse();
  return [["M"].concat(t[0].slice(0, 2))].concat(
    t.map((s) => ["C"].concat(s.slice(2)))
  );
}, ft = (e) => {
  const t = ht(e), s = ot(t), r = t.length, n = t[r - 1][0] === "Z", i = Z(t, (o, l) => {
    const c = s[l], a = l && t[l - 1], u = a && a[0], f = t[l + 1], h = f && f[0], [y] = o, [m, g] = s[l ? l - 1 : r - 1].slice(-2);
    let d = o;
    switch (y) {
      case "M":
        d = n ? ["Z"] : [y, m, g];
        break;
      case "A":
        d = [
          y,
          o[1],
          o[2],
          o[3],
          o[4],
          o[5] === 1 ? 0 : 1,
          m,
          g
        ];
        break;
      case "C":
        f && h === "S" ? d = ["S", o[1], o[2], m, g] : d = [
          y,
          o[3],
          o[4],
          o[1],
          o[2],
          m,
          g
        ];
        break;
      case "S":
        u && "CS".includes(u) && (!f || h !== "S") ? d = [
          "C",
          c[3],
          c[4],
          c[1],
          c[2],
          m,
          g
        ] : d = [
          y,
          c[1],
          c[2],
          m,
          g
        ];
        break;
      case "Q":
        f && h === "T" ? d = ["T", m, g] : d = [y, o[1], o[2], m, g];
        break;
      case "T":
        u && "QT".includes(u) && (!f || h !== "T") ? d = [
          "Q",
          c[1],
          c[2],
          m,
          g
        ] : d = [y, m, g];
        break;
      case "Z":
        d = ["M", m, g];
        break;
      case "H":
        d = [y, m];
        break;
      case "V":
        d = [y, g];
        break;
      default:
        d = [y].concat(
          o.slice(1, -2),
          m,
          g
        );
    }
    return d;
  });
  return n ? i.reverse() : [i[0]].concat(i.slice(1).reverse());
}, an = (e, t) => {
  let { round: s } = V;
  return s = t === "off" || typeof t == "number" && t >= 0 ? t : typeof s == "number" && s >= 0 ? s : (
    /* istanbul ignore next @preserve */
    "off"
  ), s === "off" ? e.slice(0) : Z(e, (r) => dt(r, s));
}, un = (e, t = 0.5) => {
  const s = t, r = e.slice(0, 2), n = e.slice(2, 4), i = e.slice(4, 6), o = e.slice(6, 8), l = H(r, n, s), c = H(n, i, s), a = H(i, o, s), u = H(l, c, s), f = H(c, a, s), h = H(u, f, s);
  return [
    ["C", l[0], l[1], u[0], u[1], h[0], h[1]],
    ["C", f[0], f[1], a[0], a[1], o[0], o[1]]
  ];
}, Yt = (e) => {
  const t = [];
  let s, r = -1, n = 0, i = 0, o = 0, l = 0;
  const c = { ...ut };
  return e.forEach((a) => {
    const [u] = a, f = u.toUpperCase(), h = u.toLowerCase(), y = u === h, m = a.slice(1);
    f === "M" ? (r += 1, [n, i] = m, n += y ? c.x : 0, i += y ? c.y : 0, o = n, l = i, s = [y ? [f, o, l] : a]) : (f === "Z" ? (n = o, i = l) : f === "H" ? ([, n] = a, n += y ? c.x : (
      /* istanbul ignore next @preserve */
      0
    )) : f === "V" ? ([, i] = a, i += y ? c.y : (
      /* istanbul ignore next @preserve */
      0
    )) : ([n, i] = a.slice(-2), n += y ? c.x : 0, i += y ? c.y : 0), s.push(a)), c.x = n, c.y = i, t[r] = s;
  }), t;
}, Vt = (e, t) => {
  let s = 0, r = 0, n = 0, i = 0, o = 0, l = 0, c = "M";
  const a = Q(e), u = t && Object.keys(t);
  if (!t || u && !u.length)
    return a.slice(0);
  t.origin || Object.assign(t, { origin: V.origin });
  const f = t.origin, h = je(t);
  return h.isIdentity ? a.slice(0) : Z(a, (y, m, g, d) => {
    [c] = y;
    const M = c.toUpperCase(), x = M !== c ? at(y, m, g, d) : y.slice(0);
    let p = M === "A" ? ["C"].concat(
      Mt(
        g,
        d,
        x[1],
        x[2],
        x[3],
        x[4],
        x[5],
        x[6],
        x[7]
      )
    ) : M === "V" ? ["L", g, x[1]] : M === "H" ? ["L", x[1], d] : x;
    c = p[0];
    const L = c === "C" && p.length > 7, T = L ? p.slice(0, 7) : p.slice(0);
    if (L && (a.splice(
      m + 1,
      0,
      ["C"].concat(
        p.slice(7)
      )
    ), p = T), c === "L")
      [n, i] = Zt(h, [
        p[1],
        p[2]
      ], f), s !== n && r !== i ? p = ["L", n, i] : r === i ? p = ["H", n] : s === n && (p = ["V", i]);
    else
      for (o = 1, l = p.length; o < l; o += 2)
        [n, i] = Zt(
          h,
          [+p[o], +p[o + 1]],
          f
        ), p[o] = n, p[o + 1] = i;
    return s = n, r = i, p;
  });
};
class A {
  /**
   * @constructor
   * @param pathValue the path string
   * @param config instance options
   */
  constructor(t, s) {
    const r = s || {}, n = typeof t > "u";
    if (n || !t.length)
      throw TypeError(
        `${S}: "pathValue" is ${n ? "undefined" : "empty"}`
      );
    this.segments = Q(t);
    const { round: i, origin: o } = r;
    let l;
    Number.isInteger(i) || i === "off" ? l = i : l = V.round;
    let c = V.origin;
    if (Array.isArray(o) && o.length >= 2) {
      const [a, u, f] = o.map(Number);
      c = [
        Number.isNaN(a) ? 0 : a,
        Number.isNaN(u) ? 0 : u,
        Number.isNaN(f) ? 0 : f
      ];
    }
    return this.round = l, this.origin = c, this;
  }
  get bbox() {
    return Wt(this.segments);
  }
  get length() {
    return nt(this.segments);
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
    return rt(this.segments, t);
  }
  /**
   * Convert path to absolute values
   *
   * @public
   */
  toAbsolute() {
    const { segments: t } = this;
    return this.segments = ht(t), this;
  }
  /**
   * Convert path to relative values
   *
   * @public
   */
  toRelative() {
    const { segments: t } = this;
    return this.segments = Kt(t), this;
  }
  /**
   * Convert path to cubic-bezier values. In addition, un-necessary `Z`
   * segment is removed if previous segment extends to the `M` segment.
   *
   * @public
   */
  toCurve() {
    const { segments: t } = this;
    return this.segments = yt(t), this;
  }
  /**
   * Reverse the order of the segments and their values.
   *
   * @param onlySubpath option to reverse all sub-paths except first
   * @public
   */
  reverse(t) {
    const { segments: s } = this, r = Yt(s), n = r.length > 1 ? r : !1, i = n ? n.map((l, c) => t ? c ? ft(l) : l.slice(0) : ft(l)) : s.slice(0);
    let o = [];
    return n ? o = i.flat(1) : o = t ? s : ft(s), this.segments = o.slice(0), this;
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
    return this.segments = ot(t), this;
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
    return this.segments = Xt(t, s), this;
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
    for (const [c, a] of Object.entries(t))
      c === "skew" && Array.isArray(a) || (c === "rotate" || c === "translate" || c === "origin" || c === "scale") && Array.isArray(a) ? o[c] = a.map(Number) : c !== "origin" && typeof Number(a) == "number" && (o[c] = Number(a));
    const { origin: l } = o;
    if (Array.isArray(l) && l.length >= 2) {
      const [c, a, u] = l.map(Number);
      o.origin = [
        Number.isNaN(c) ? r : c,
        Number.isNaN(a) ? n : a,
        u || i
      ];
    } else
      o.origin = [r, n, i];
    return this.segments = Vt(s, o), this;
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
    return kt(this.segments, this.round);
  }
  /**
   * Remove the instance.
   *
   * @public
   * @return void
   */
  dispose() {
    Object.keys(this).forEach((t) => delete this[t]);
  }
}
b(A, "CSSMatrix", C), b(A, "pathToAbsolute", ht), b(A, "pathToRelative", Kt), b(A, "pathToCurve", yt), b(A, "pathToString", kt), b(A, "arcTools", He), b(A, "bezierTools", {
  Cvalues: Ae,
  Tvalues: Rt,
  minmaxC: jt,
  minmaxQ: gt,
  getBezierLength: mt,
  bezierLength: Le,
  calculateBezier: we,
  computeBezier: Ne,
  deriveBezier: Me,
  CBEZIER_MINMAX_EPSILON: ve
}), b(A, "cubicTools", {
  getCubicLength: xt,
  getCubicBBox: St,
  getPointAtCubicLength: Ce,
  getPointAtCubicSegmentLength: Te
}), b(A, "lineTools", {
  getPointAtLineLength: Ht,
  getLineBBox: It,
  getLineLength: it
}), b(A, "quadTools", {
  getPointAtQuadSegmentLength: $e,
  getQuadLength: pt,
  getQuadBBox: Qt,
  getPointAtQuadLength: ze
}), b(A, "polygonTools", { polygonArea: Fe, polygonLength: _e }), b(A, "distanceSquareRoot", wt), b(A, "distanceEpsilon", bt), b(A, "midPoint", H), b(A, "rotateVector", st), b(A, "roundTo", k), b(A, "finalizeSegment", qt), b(A, "invalidPathValue", J), b(A, "isArcCommand", ye), b(A, "isDigit", U), b(A, "isDigitStart", he), b(A, "isMoveCommand", ge), b(A, "isPathCommand", fe), b(A, "isSpace", me), b(A, "paramsCount", tt), b(A, "paramsParser", ut), b(A, "pathParser", Ot), b(A, "scanFlag", ae), b(A, "scanParam", ue), b(A, "scanSegment", Dt), b(A, "skipSpaces", et), b(A, "getPathBBox", Wt), b(A, "getPathArea", qe), b(A, "getTotalLength", nt), b(A, "getDrawDirection", Ke), b(A, "getPointAtLength", rt), b(A, "getPropertiesAtLength", Ut), b(A, "getPropertiesAtPoint", vt), b(A, "getClosestPoint", Ue), b(A, "getSegmentOfPoint", Xe), b(A, "getSegmentAtLength", We), b(A, "isPointInStroke", Ve), b(A, "isValidPath", Ie), b(A, "isPathArray", Tt), b(A, "isAbsoluteArray", Pe), b(A, "isRelativeArray", Ge), b(A, "isCurveArray", Ye), b(A, "isNormalizedArray", ke), b(A, "shapeToPath", on), b(A, "shapeToPathArray", Re), b(A, "shapeParams", ct), b(A, "parsePathString", Q), b(A, "absolutizeSegment", at), b(A, "arcToCubic", Mt), b(A, "getSVGMatrix", je), b(A, "iterate", Z), b(A, "lineToCubic", Pt), b(A, "normalizePath", ot), b(A, "normalizeSegment", Nt), b(A, "optimizePath", Xt), b(A, "projection2d", Zt), b(A, "quadToCubic", xe), b(A, "relativizeSegment", Bt), b(A, "reverseCurve", ln), b(A, "reversePath", ft), b(A, "roundPath", an), b(A, "roundSegment", dt), b(A, "segmentToCubic", pe), b(A, "shortenSegment", Se), b(A, "splitCubic", un), b(A, "splitPath", Yt), b(A, "transformPath", Vt);
export {
  A as default
};
//# sourceMappingURL=svg-path-commander.mjs.map
