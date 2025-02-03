var Et = Object.defineProperty, Ot = (t, e, r) => e in t ? Et(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, I = (t, e, r) => Ot(t, typeof e != "symbol" ? e + "" : e, r);
const Vt = {
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
}, Fe = (t) => (t instanceof Float64Array || t instanceof Float32Array || Array.isArray(t) && t.every((e) => typeof e == "number")) && [6, 16].some((e) => t.length === e), Ue = (t) => t instanceof DOMMatrix || t instanceof P || typeof t == "object" && Object.keys(Vt).every((e) => t && e in t), oe = (t) => {
  const e = new P(), r = Array.from(t);
  if (!Fe(r))
    throw TypeError(
      `CSSMatrix: "${r.join(",")}" must be an array with 6/16 numbers.`
    );
  if (r.length === 16) {
    const [
      s,
      n,
      o,
      i,
      l,
      c,
      a,
      m,
      h,
      f,
      y,
      u,
      g,
      p,
      b,
      M
    ] = r;
    e.m11 = s, e.a = s, e.m21 = l, e.c = l, e.m31 = h, e.m41 = g, e.e = g, e.m12 = n, e.b = n, e.m22 = c, e.d = c, e.m32 = f, e.m42 = p, e.f = p, e.m13 = o, e.m23 = a, e.m33 = y, e.m43 = b, e.m14 = i, e.m24 = m, e.m34 = u, e.m44 = M;
  } else if (r.length === 6) {
    const [s, n, o, i, l, c] = r;
    e.m11 = s, e.a = s, e.m12 = n, e.b = n, e.m21 = o, e.c = o, e.m22 = i, e.d = i, e.m41 = l, e.e = l, e.m42 = c, e.f = c;
  }
  return e;
}, Ge = (t) => {
  if (Ue(t))
    return oe([
      t.m11,
      t.m12,
      t.m13,
      t.m14,
      t.m21,
      t.m22,
      t.m23,
      t.m24,
      t.m31,
      t.m32,
      t.m33,
      t.m34,
      t.m41,
      t.m42,
      t.m43,
      t.m44
    ]);
  throw TypeError(
    `CSSMatrix: "${JSON.stringify(t)}" is not a DOMMatrix / CSSMatrix / JSON compatible object.`
  );
}, Je = (t) => {
  if (typeof t != "string")
    throw TypeError(`CSSMatrix: "${JSON.stringify(t)}" is not a string.`);
  const e = String(t).replace(/\s/g, "");
  let r = new P();
  const s = `CSSMatrix: invalid transform string "${t}"`;
  return e.split(")").filter((n) => n).forEach((n) => {
    const [o, i] = n.split("(");
    if (!i) throw TypeError(s);
    const l = i.split(",").map(
      (u) => u.includes("rad") ? parseFloat(u) * (180 / Math.PI) : parseFloat(u)
    ), [c, a, m, h] = l, f = [c, a, m], y = [c, a, m, h];
    if (o === "perspective" && c && [a, m].every((u) => u === void 0))
      r.m34 = -1 / c;
    else if (o.includes("matrix") && [6, 16].includes(l.length) && l.every((u) => !Number.isNaN(+u))) {
      const u = l.map((g) => Math.abs(g) < 1e-6 ? 0 : g);
      r = r.multiply(oe(u));
    } else if (o === "translate3d" && f.every((u) => !Number.isNaN(+u)))
      r = r.translate(c, a, m);
    else if (o === "translate" && c && m === void 0)
      r = r.translate(c, a || 0, 0);
    else if (o === "rotate3d" && y.every((u) => !Number.isNaN(+u)) && h)
      r = r.rotateAxisAngle(c, a, m, h);
    else if (o === "rotate" && c && [a, m].every((u) => u === void 0))
      r = r.rotate(0, 0, c);
    else if (o === "scale3d" && f.every((u) => !Number.isNaN(+u)) && f.some((u) => u !== 1))
      r = r.scale(c, a, m);
    else if (
      // prop === "scale" && !Number.isNaN(x) && x !== 1 && z === undefined
      // prop === "scale" && !Number.isNaN(x) && [x, y].some((n) => n !== 1) &&
      o === "scale" && !Number.isNaN(c) && (c !== 1 || a !== 1) && m === void 0
    ) {
      const u = Number.isNaN(+a) ? c : a;
      r = r.scale(c, u, 1);
    } else if (o === "skew" && (c || !Number.isNaN(c) && a) && m === void 0)
      r = r.skew(c, a || 0);
    else if (["translate", "rotate", "scale", "skew"].some(
      (u) => o.includes(u)
    ) && /[XYZ]/.test(o) && c && [a, m].every((u) => u === void 0))
      if (o === "skewX" || o === "skewY")
        r = r[o](c);
      else {
        const u = o.replace(/[XYZ]/, ""), g = o.replace(u, ""), p = ["X", "Y", "Z"].indexOf(g), b = u === "scale" ? 1 : 0, M = [
          p === 0 ? c : b,
          p === 1 ? c : b,
          p === 2 ? c : b
        ];
        r = r[u](...M);
      }
    else
      throw TypeError(s);
  }), r;
}, Le = (t, e) => e ? [t.a, t.b, t.c, t.d, t.e, t.f] : [
  t.m11,
  t.m12,
  t.m13,
  t.m14,
  t.m21,
  t.m22,
  t.m23,
  t.m24,
  t.m31,
  t.m32,
  t.m33,
  t.m34,
  t.m41,
  t.m42,
  t.m43,
  t.m44
], Ke = (t, e, r) => {
  const s = new P();
  return s.m41 = t, s.e = t, s.m42 = e, s.f = e, s.m43 = r, s;
}, We = (t, e, r) => {
  const s = new P(), n = Math.PI / 180, o = t * n, i = e * n, l = r * n, c = Math.cos(o), a = -Math.sin(o), m = Math.cos(i), h = -Math.sin(i), f = Math.cos(l), y = -Math.sin(l), u = m * f, g = -m * y;
  s.m11 = u, s.a = u, s.m12 = g, s.b = g, s.m13 = h;
  const p = a * h * f + c * y;
  s.m21 = p, s.c = p;
  const b = c * f - a * h * y;
  return s.m22 = b, s.d = b, s.m23 = -a * m, s.m31 = a * y - c * h * f, s.m32 = a * f + c * h * y, s.m33 = c * m, s;
}, Xe = (t, e, r, s) => {
  const n = new P(), o = Math.sqrt(t * t + e * e + r * r);
  if (o === 0)
    return n;
  const i = t / o, l = e / o, c = r / o, a = s * (Math.PI / 360), m = Math.sin(a), h = Math.cos(a), f = m * m, y = i * i, u = l * l, g = c * c, p = 1 - 2 * (u + g) * f;
  n.m11 = p, n.a = p;
  const b = 2 * (i * l * f + c * m * h);
  n.m12 = b, n.b = b, n.m13 = 2 * (i * c * f - l * m * h);
  const M = 2 * (l * i * f - c * m * h);
  n.m21 = M, n.c = M;
  const d = 1 - 2 * (g + y) * f;
  return n.m22 = d, n.d = d, n.m23 = 2 * (l * c * f + i * m * h), n.m31 = 2 * (c * i * f + l * m * h), n.m32 = 2 * (c * l * f - i * m * h), n.m33 = 1 - 2 * (y + u) * f, n;
}, Ye = (t, e, r) => {
  const s = new P();
  return s.m11 = t, s.a = t, s.m22 = e, s.d = e, s.m33 = r, s;
}, de = (t, e) => {
  const r = new P();
  if (t) {
    const s = t * Math.PI / 180, n = Math.tan(s);
    r.m21 = n, r.c = n;
  }
  if (e) {
    const s = e * Math.PI / 180, n = Math.tan(s);
    r.m12 = n, r.b = n;
  }
  return r;
}, et = (t) => de(t, 0), tt = (t) => de(0, t), B = (t, e) => {
  const r = e.m11 * t.m11 + e.m12 * t.m21 + e.m13 * t.m31 + e.m14 * t.m41, s = e.m11 * t.m12 + e.m12 * t.m22 + e.m13 * t.m32 + e.m14 * t.m42, n = e.m11 * t.m13 + e.m12 * t.m23 + e.m13 * t.m33 + e.m14 * t.m43, o = e.m11 * t.m14 + e.m12 * t.m24 + e.m13 * t.m34 + e.m14 * t.m44, i = e.m21 * t.m11 + e.m22 * t.m21 + e.m23 * t.m31 + e.m24 * t.m41, l = e.m21 * t.m12 + e.m22 * t.m22 + e.m23 * t.m32 + e.m24 * t.m42, c = e.m21 * t.m13 + e.m22 * t.m23 + e.m23 * t.m33 + e.m24 * t.m43, a = e.m21 * t.m14 + e.m22 * t.m24 + e.m23 * t.m34 + e.m24 * t.m44, m = e.m31 * t.m11 + e.m32 * t.m21 + e.m33 * t.m31 + e.m34 * t.m41, h = e.m31 * t.m12 + e.m32 * t.m22 + e.m33 * t.m32 + e.m34 * t.m42, f = e.m31 * t.m13 + e.m32 * t.m23 + e.m33 * t.m33 + e.m34 * t.m43, y = e.m31 * t.m14 + e.m32 * t.m24 + e.m33 * t.m34 + e.m34 * t.m44, u = e.m41 * t.m11 + e.m42 * t.m21 + e.m43 * t.m31 + e.m44 * t.m41, g = e.m41 * t.m12 + e.m42 * t.m22 + e.m43 * t.m32 + e.m44 * t.m42, p = e.m41 * t.m13 + e.m42 * t.m23 + e.m43 * t.m33 + e.m44 * t.m43, b = e.m41 * t.m14 + e.m42 * t.m24 + e.m43 * t.m34 + e.m44 * t.m44;
  return oe([
    r,
    s,
    n,
    o,
    i,
    l,
    c,
    a,
    m,
    h,
    f,
    y,
    u,
    g,
    p,
    b
  ]);
};
class P {
  /**
   * @constructor
   * @param init accepts all parameter configurations:
   * * valid CSS transform string,
   * * CSSMatrix/DOMMatrix instance,
   * * a 6/16 elements *Array*.
   */
  constructor(e) {
    return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.e = 0, this.f = 0, this.m11 = 1, this.m12 = 0, this.m13 = 0, this.m14 = 0, this.m21 = 0, this.m22 = 1, this.m23 = 0, this.m24 = 0, this.m31 = 0, this.m32 = 0, this.m33 = 1, this.m34 = 0, this.m41 = 0, this.m42 = 0, this.m43 = 0, this.m44 = 1, e ? this.setMatrixValue(e) : this;
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
  setMatrixValue(e) {
    return typeof e == "string" && e.length && e !== "none" ? Je(e) : Array.isArray(e) || e instanceof Float64Array || e instanceof Float32Array ? oe(e) : typeof e == "object" ? Ge(e) : this;
  }
  /**
   * Returns a *Float32Array* containing elements which comprise the matrix.
   * The method can return either the 16 elements or the 6 elements
   * depending on the value of the `is2D` parameter.
   *
   * @param is2D *Array* representation of the matrix
   * @return an *Array* representation of the matrix
   */
  toFloat32Array(e) {
    return Float32Array.from(Le(this, e));
  }
  /**
   * Returns a *Float64Array* containing elements which comprise the matrix.
   * The method can return either the 16 elements or the 6 elements
   * depending on the value of the `is2D` parameter.
   *
   * @param is2D *Array* representation of the matrix
   * @return an *Array* representation of the matrix
   */
  toFloat64Array(e) {
    return Float64Array.from(Le(this, e));
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
    const { is2D: e } = this, r = this.toFloat64Array(e).join(", ");
    return `${e ? "matrix" : "matrix3d"}(${r})`;
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
    const { is2D: e, isIdentity: r } = this;
    return { ...this, is2D: e, isIdentity: r };
  }
  /**
   * The Multiply method returns a new CSSMatrix which is the result of this
   * matrix multiplied by the passed matrix, with the passed matrix to the right.
   * This matrix is not modified.
   *
   * @param m2 CSSMatrix
   * @return The resulted matrix.
   */
  multiply(e) {
    return B(this, e);
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
  translate(e, r, s) {
    const n = e;
    let o = r, i = s;
    return typeof o > "u" && (o = 0), typeof i > "u" && (i = 0), B(this, Ke(n, o, i));
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
  scale(e, r, s) {
    const n = e;
    let o = r, i = s;
    return typeof o > "u" && (o = e), typeof i > "u" && (i = 1), B(this, Ye(n, o, i));
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
  rotate(e, r, s) {
    let n = e, o = r || 0, i = s || 0;
    return typeof e == "number" && typeof r > "u" && typeof s > "u" && (i = n, n = 0, o = 0), B(this, We(n, o, i));
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
  rotateAxisAngle(e, r, s, n) {
    if ([e, r, s, n].some((o) => Number.isNaN(+o)))
      throw new TypeError("CSSMatrix: expecting 4 values");
    return B(this, Xe(e, r, s, n));
  }
  /**
   * Specifies a skew transformation along the `x-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param angle The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skewX(e) {
    return B(this, et(e));
  }
  /**
   * Specifies a skew transformation along the `y-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param angle The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skewY(e) {
    return B(this, tt(e));
  }
  /**
   * Specifies a skew transformation along both the `x-axis` and `y-axis`.
   * This matrix is not modified.
   *
   * @param angleX The X-angle amount in degrees to skew.
   * @param angleY The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skew(e, r) {
    return B(this, de(e, r));
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
  transformPoint(e) {
    const r = this.m11 * e.x + this.m21 * e.y + this.m31 * e.z + this.m41 * e.w, s = this.m12 * e.x + this.m22 * e.y + this.m32 * e.z + this.m42 * e.w, n = this.m13 * e.x + this.m23 * e.y + this.m33 * e.z + this.m43 * e.w, o = this.m14 * e.x + this.m24 * e.y + this.m34 * e.z + this.m44 * e.w;
    return e instanceof DOMPoint ? new DOMPoint(r, s, n, o) : {
      x: r,
      y: s,
      z: n,
      w: o
    };
  }
}
I(P, "Translate", Ke), I(P, "Rotate", We), I(P, "RotateAxisAngle", Xe), I(P, "Scale", Ye), I(P, "SkewX", et), I(P, "SkewY", tt), I(P, "Skew", de), I(P, "Multiply", B), I(P, "fromArray", oe), I(P, "fromMatrix", Ge), I(P, "fromString", Je), I(P, "toArray", Le), I(P, "isCompatibleArray", Fe), I(P, "isCompatibleObject", Ue);
const K = {
  origin: [0, 0, 0],
  round: 4
}, X = {
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
}, Te = (t) => {
  let e = t.pathValue[t.segmentStart], r = e.toLowerCase();
  const { data: s } = t;
  for (; s.length >= X[r] && (r === "m" && s.length > 2 ? (t.segments.push(
    [e].concat(
      s.splice(0, 2)
    )
  ), r = "l", e = e === "m" ? "l" : "L") : t.segments.push(
    [e].concat(
      s.splice(0, X[r])
    )
  ), !!X[r]); )
    ;
}, O = "SVGPathCommander Error", nt = (t) => {
  const { index: e, pathValue: r } = t, s = r.charCodeAt(e);
  if (s === 48) {
    t.param = 0, t.index += 1;
    return;
  }
  if (s === 49) {
    t.param = 1, t.index += 1;
    return;
  }
  t.err = `${O}: invalid Arc flag "${r[e]}", expecting 0 or 1 at index ${e}`;
}, H = (t) => t >= 48 && t <= 57, F = "Invalid path value", rt = (t) => {
  const { max: e, pathValue: r, index: s } = t;
  let n = s, o = !1, i = !1, l = !1, c = !1, a;
  if (n >= e) {
    t.err = `${O}: ${F} at index ${n}, "pathValue" is missing param`;
    return;
  }
  if (a = r.charCodeAt(n), (a === 43 || a === 45) && (n += 1, a = r.charCodeAt(n)), !H(a) && a !== 46) {
    t.err = `${O}: ${F} at index ${n}, "${r[n]}" is not a number`;
    return;
  }
  if (a !== 46) {
    if (o = a === 48, n += 1, a = r.charCodeAt(n), o && n < e && a && H(a)) {
      t.err = `${O}: ${F} at index ${s}, "${r[s]}" illegal number`;
      return;
    }
    for (; n < e && H(r.charCodeAt(n)); )
      n += 1, i = !0;
    a = r.charCodeAt(n);
  }
  if (a === 46) {
    for (c = !0, n += 1; H(r.charCodeAt(n)); )
      n += 1, l = !0;
    a = r.charCodeAt(n);
  }
  if (a === 101 || a === 69) {
    if (c && !i && !l) {
      t.err = `${O}: ${F} at index ${n}, "${r[n]}" invalid float exponent`;
      return;
    }
    if (n += 1, a = r.charCodeAt(n), (a === 43 || a === 45) && (n += 1), n < e && H(r.charCodeAt(n)))
      for (; n < e && H(r.charCodeAt(n)); )
        n += 1;
    else {
      t.err = `${O}: ${F} at index ${n}, "${r[n]}" invalid integer exponent`;
      return;
    }
  }
  t.index = n, t.param = +t.pathValue.slice(s, n);
}, st = (t) => [
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
].includes(t), Y = (t) => {
  const { pathValue: e, max: r } = t;
  for (; t.index < r && st(e.charCodeAt(t.index)); )
    t.index += 1;
}, ot = (t) => {
  switch (t | 32) {
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
}, it = (t) => H(t) || t === 43 || t === 45 || t === 46, ct = (t) => (t | 32) === 97, lt = (t) => {
  switch (t | 32) {
    case 109:
    case 77:
      return !0;
    default:
      return !1;
  }
}, Oe = (t) => {
  var c;
  const { max: e, pathValue: r, index: s, segments: n } = t, o = r.charCodeAt(s), i = X[r[s].toLowerCase()];
  if (t.segmentStart = s, !ot(o)) {
    t.err = `${O}: ${F} "${r[s]}" is not a path command at index ${s}`;
    return;
  }
  const l = n[n.length - 1];
  if (!lt(o) && ((c = l == null ? void 0 : l[0]) == null ? void 0 : c.toLocaleLowerCase()) === "z") {
    t.err = `${O}: ${F} "${r[s]}" is not a MoveTo path command at index ${s}`;
    return;
  }
  if (t.index += 1, Y(t), t.data = [], !i) {
    Te(t);
    return;
  }
  for (; ; ) {
    for (let a = i; a > 0; a -= 1) {
      if (ct(o) && (a === 3 || a === 4) ? nt(t) : rt(t), t.err.length)
        return;
      t.data.push(t.param), Y(t), t.index < e && r.charCodeAt(t.index) === 44 && (t.index += 1, Y(t));
    }
    if (t.index >= t.max || !it(r.charCodeAt(t.index)))
      break;
  }
  Te(t);
};
class Ve {
  constructor(e) {
    this.segments = [], this.pathValue = e, this.max = e.length, this.index = 0, this.param = 0, this.segmentStart = 0, this.data = [], this.err = "";
  }
}
const V = (t) => {
  if (typeof t != "string")
    return t.slice(0);
  const e = new Ve(t);
  for (Y(e); e.index < e.max && !e.err.length; )
    Oe(e);
  if (!e.err.length)
    e.segments.length && (e.segments[0][0] = "M");
  else
    throw TypeError(e.err);
  return e.segments;
}, ie = (t, e, r, s) => {
  const [n] = t, o = n.toUpperCase();
  if (e === 0 || o === n) return t;
  if (o === "A")
    return [
      o,
      t[1],
      t[2],
      t[3],
      t[4],
      t[5],
      t[6] + r,
      t[7] + s
    ];
  if (o === "V")
    return [o, t[1] + s];
  if (o === "H")
    return [o, t[1] + r];
  if (o === "L")
    return [
      o,
      t[1] + r,
      t[2] + s
    ];
  {
    const l = [], c = t.length;
    for (let a = 1; a < c; a += 1)
      l.push(t[a] + (a % 2 ? r : s));
    return [o].concat(l);
  }
}, R = (t, e) => {
  let r = t.length, s, n = "M", o = "M", i = !1, l = 0, c = 0, a = 0, m = 0, h = 0;
  for (let f = 0; f < r; f += 1) {
    s = t[f], [n] = s, h = s.length, o = n.toUpperCase(), i = o !== n;
    const y = e(s, f, l, c);
    if (y === !1)
      break;
    o === "Z" ? (l = a, c = m) : o === "H" ? l = s[1] + (i ? l : 0) : o === "V" ? c = s[1] + (i ? c : 0) : (l = s[h - 2] + (i ? l : 0), c = s[h - 1] + (i ? c : 0), o === "M" && (a = l, m = c)), y && (t[f] = y, y[0] === "C" && (r = t.length));
  }
  return t;
}, xe = (t) => {
  const e = V(t);
  return R(e, ie);
}, Re = (t, e, r, s) => {
  const [n] = t, o = n.toLowerCase();
  if (e === 0 || n === o) return t;
  if (o === "a")
    return [
      o,
      t[1],
      t[2],
      t[3],
      t[4],
      t[5],
      t[6] - r,
      t[7] - s
    ];
  if (o === "v")
    return [o, t[1] - s];
  if (o === "h")
    return [o, t[1] - r];
  if (o === "l")
    return [
      o,
      t[1] - r,
      t[2] - s
    ];
  {
    const l = [], c = t.length;
    for (let a = 1; a < c; a += 1)
      l.push(t[a] - (a % 2 ? r : s));
    return [o].concat(l);
  }
}, at = (t) => {
  const e = V(t);
  return R(e, Re);
}, te = (t, e, r) => {
  const { sin: s, cos: n } = Math, o = t * n(r) - e * s(r), i = t * s(r) + e * n(r);
  return { x: o, y: i };
}, pe = (t, e, r, s, n, o, i, l, c, a) => {
  let m = t, h = e, f = r, y = s, u = l, g = c;
  const p = Math.PI * 120 / 180, b = Math.PI / 180 * (+n || 0);
  let M = [], d, x, A, S, $;
  if (a)
    [x, A, S, $] = a;
  else {
    d = te(m, h, -b), m = d.x, h = d.y, d = te(u, g, -b), u = d.x, g = d.y;
    const w = (m - u) / 2, k = (h - g) / 2;
    let T = w * w / (f * f) + k * k / (y * y);
    T > 1 && (T = Math.sqrt(T), f *= T, y *= T);
    const Ne = f * f, we = y * y, He = (o === i ? -1 : 1) * Math.sqrt(
      Math.abs(
        (Ne * we - Ne * k * k - we * w * w) / (Ne * k * k + we * w * w)
      )
    );
    S = He * f * k / y + (m + u) / 2, $ = He * -y * w / f + (h + g) / 2, x = Math.asin(((h - $) / y * 10 ** 9 >> 0) / 10 ** 9), A = Math.asin(((g - $) / y * 10 ** 9 >> 0) / 10 ** 9), x = m < S ? Math.PI - x : x, A = u < S ? Math.PI - A : A, x < 0 && (x = Math.PI * 2 + x), A < 0 && (A = Math.PI * 2 + A), i && x > A && (x -= Math.PI * 2), !i && A > x && (A -= Math.PI * 2);
  }
  let j = A - x;
  if (Math.abs(j) > p) {
    const w = A, k = u, T = g;
    A = x + p * (i && A > x ? 1 : -1), u = S + f * Math.cos(A), g = $ + y * Math.sin(A), M = pe(u, g, f, y, n, 0, i, k, T, [
      A,
      w,
      S,
      $
    ]);
  }
  j = A - x;
  const L = Math.cos(x), N = Math.sin(x), _ = Math.cos(A), U = Math.sin(A), z = Math.tan(j / 4), C = 4 / 3 * f * z, q = 4 / 3 * y * z, Q = [m, h], E = [m + C * N, h - q * L], D = [u + C * U, g - q * _], W = [u, g];
  if (E[0] = 2 * Q[0] - E[0], E[1] = 2 * Q[1] - E[1], a)
    return [E[0], E[1], D[0], D[1], W[0], W[1]].concat(M);
  M = [E[0], E[1], D[0], D[1], W[0], W[1]].concat(M);
  const G = [];
  for (let w = 0, k = M.length; w < k; w += 1)
    G[w] = w % 2 ? te(M[w - 1], M[w], b).y : te(M[w], M[w + 1], b).x;
  return G;
}, mt = (t, e, r, s, n, o) => {
  const i = 0.3333333333333333, l = 2 / 3;
  return [
    i * t + l * r,
    // cpx1
    i * e + l * s,
    // cpy1
    i * n + l * r,
    // cpx2
    i * o + l * s,
    // cpy2
    n,
    o
    // x,y
  ];
}, Z = (t, e, r) => {
  const [s, n] = t, [o, i] = e;
  return [s + (o - s) * r, n + (i - n) * r];
}, ve = (t, e, r, s) => {
  const n = Z([t, e], [r, s], 0.3333333333333333), o = Z([t, e], [r, s], 2 / 3);
  return [n[0], n[1], o[0], o[1], r, s];
}, ut = (t, e) => {
  const [r] = t, s = t.slice(1).map(Number), [n, o] = s, { x1: i, y1: l, x: c, y: a } = e;
  return "TQ".includes(r) || (e.qx = null, e.qy = null), r === "M" ? (e.x = n, e.y = o, t) : r === "A" ? ["C"].concat(
    pe(
      i,
      l,
      s[0],
      s[1],
      s[2],
      s[3],
      s[4],
      s[5],
      s[6]
    )
  ) : r === "Q" ? (e.qx = n, e.qy = o, ["C"].concat(
    mt(i, l, s[0], s[1], s[2], s[3])
  )) : r === "L" ? ["C"].concat(
    ve(i, l, n, o)
  ) : r === "Z" ? ["C"].concat(
    ve(i, l, c, a)
  ) : t;
}, be = (t, e) => {
  const [r] = t, s = r.toUpperCase(), n = r !== s, { x1: o, y1: i, x2: l, y2: c, x: a, y: m } = e, h = t.slice(1);
  let f = h.map((y, u) => y + (n ? u % 2 ? m : a : 0));
  if ("TQ".includes(s) || (e.qx = null, e.qy = null), s === "A")
    return f = h.slice(0, -2).concat(
      h[5] + (n ? a : 0),
      h[6] + (n ? m : 0)
    ), ["A"].concat(f);
  if (s === "H")
    return [
      "L",
      t[1] + (n ? a : 0),
      i
    ];
  if (s === "V")
    return [
      "L",
      o,
      t[1] + (n ? m : 0)
    ];
  if (s === "L")
    return [
      "L",
      t[1] + (n ? a : 0),
      t[2] + (n ? m : 0)
    ];
  if (s === "M")
    return [
      "M",
      t[1] + (n ? a : 0),
      t[2] + (n ? m : 0)
    ];
  if (s === "C")
    return ["C"].concat(f);
  if (s === "S") {
    const y = o * 2 - l, u = i * 2 - c;
    return e.x1 = y, e.y1 = u, ["C", y, u].concat(f);
  } else if (s === "T") {
    const y = o * 2 - (e.qx ? e.qx : (
      /* istanbul ignore next */
      0
    )), u = i * 2 - (e.qy ? e.qy : (
      /* istanbul ignore next */
      0
    ));
    return e.qx = y, e.qy = u, ["Q", y, u].concat(f);
  } else if (s === "Q") {
    const [y, u] = f;
    return e.qx = y, e.qy = u, ["Q"].concat(f);
  } else if (s === "Z")
    return ["Z"];
  return t;
}, ce = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  x: 0,
  y: 0,
  qx: null,
  qy: null
}, Me = (t) => {
  const e = { ...ce }, r = V(t);
  return R(r, (s, n, o, i) => {
    e.x = o, e.y = i;
    const l = be(s, e);
    let c = ut(l, e);
    c[0] === "C" && c.length > 7 && (r.splice(
      n + 1,
      0,
      ["C"].concat(c.slice(7))
    ), c = c.slice(0, 7));
    const m = c.length;
    return e.x1 = +c[m - 2], e.y1 = +c[m - 1], e.x2 = +c[m - 4] || e.x1, e.y2 = +c[m - 3] || e.y1, c;
  });
}, v = (t, e) => {
  const r = e >= 1 ? 10 ** e : 1;
  return e > 0 ? Math.round(t * r) / r : Math.round(t);
}, _e = (t, e) => {
  const r = t.length;
  let { round: s } = K, n = t[0], o = "";
  s = e === "off" || typeof e == "number" && e >= 0 ? e : typeof s == "number" && s >= 0 ? s : (
    /* istanbul ignore next @preserve */
    "off"
  );
  for (let i = 0; i < r; i += 1) {
    n = t[i];
    const [l] = n, c = n.slice(1);
    if (o += l, s === "off")
      o += c.join(" ");
    else {
      let a = 0;
      const m = c.length;
      for (; a < m; )
        o += v(c[a], s), a !== m - 1 && (o += " "), a += 1;
    }
  }
  return o;
}, Ae = (t, e) => Math.sqrt(
  (t[0] - e[0]) * (t[0] - e[0]) + (t[1] - e[1]) * (t[1] - e[1])
), re = (t, e, r, s) => Ae([t, e], [r, s]), Qe = (t, e, r, s, n) => {
  let o = { x: t, y: e };
  if (typeof n == "number") {
    const i = Ae([t, e], [r, s]);
    if (n <= 0)
      o = { x: t, y: e };
    else if (n >= i)
      o = { x: r, y: s };
    else {
      const [l, c] = Z([t, e], [r, s], n / i);
      o = { x: l, y: c };
    }
  }
  return o;
}, $e = (t, e, r, s) => {
  const { min: n, max: o } = Math;
  return [n(t, r), n(e, s), o(t, r), o(e, s)];
}, Rt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getLineBBox: $e,
  getLineLength: re,
  getPointAtLineLength: Qe
}, Symbol.toStringTag, { value: "Module" })), Ze = (t, e, r) => {
  const s = r / 2, n = Math.sin(s), o = Math.cos(s), i = t ** 2 * n ** 2, l = e ** 2 * o ** 2, c = Math.sqrt(i + l) * r;
  return Math.abs(c);
}, J = (t, e, r, s, n, o) => {
  const { sin: i, cos: l } = Math, c = l(n), a = i(n), m = r * l(o), h = s * i(o);
  return [t + c * m - a * h, e + a * m + c * h];
}, je = (t, e) => {
  const { x: r, y: s } = t, { x: n, y: o } = e, i = r * n + s * o, l = Math.sqrt((r ** 2 + s ** 2) * (n ** 2 + o ** 2));
  return (r * o - s * n < 0 ? -1 : 1) * Math.acos(i / l);
}, Ce = (t, e, r, s, n, o, i, l, c) => {
  const { abs: a, sin: m, cos: h, sqrt: f, PI: y } = Math;
  let u = a(r), g = a(s);
  const b = (n % 360 + 360) % 360 * (y / 180);
  if (t === l && e === c)
    return {
      rx: u,
      ry: g,
      startAngle: 0,
      endAngle: 0,
      center: { x: l, y: c }
    };
  if (u === 0 || g === 0)
    return {
      rx: u,
      ry: g,
      startAngle: 0,
      endAngle: 0,
      center: { x: (l + t) / 2, y: (c + e) / 2 }
    };
  const M = (t - l) / 2, d = (e - c) / 2, x = {
    x: h(b) * M + m(b) * d,
    y: -m(b) * M + h(b) * d
  }, A = x.x ** 2 / u ** 2 + x.y ** 2 / g ** 2;
  A > 1 && (u *= f(A), g *= f(A));
  const S = u ** 2 * g ** 2 - u ** 2 * x.y ** 2 - g ** 2 * x.x ** 2, $ = u ** 2 * x.y ** 2 + g ** 2 * x.x ** 2;
  let j = S / $;
  j = j < 0 ? 0 : j;
  const L = (o !== i ? 1 : -1) * f(j), N = {
    x: L * (u * x.y / g),
    y: L * (-(g * x.x) / u)
  }, _ = {
    x: h(b) * N.x - m(b) * N.y + (t + l) / 2,
    y: m(b) * N.x + h(b) * N.y + (e + c) / 2
  }, U = {
    x: (x.x - N.x) / u,
    y: (x.y - N.y) / g
  }, z = je({ x: 1, y: 0 }, U), C = {
    x: (-x.x - N.x) / u,
    y: (-x.y - N.y) / g
  };
  let q = je(U, C);
  !i && q > 0 ? q -= 2 * y : i && q < 0 && (q += 2 * y), q %= 2 * y;
  const Q = z + q;
  return {
    center: _,
    startAngle: z,
    endAngle: Q,
    rx: u,
    ry: g
  };
}, De = (t, e, r, s, n, o, i, l, c) => {
  const { rx: a, ry: m, startAngle: h, endAngle: f } = Ce(
    t,
    e,
    r,
    s,
    n,
    o,
    i,
    l,
    c
  );
  return Ze(a, m, f - h);
}, ht = (t, e, r, s, n, o, i, l, c, a) => {
  let m = { x: t, y: e };
  const { center: h, rx: f, ry: y, startAngle: u, endAngle: g } = Ce(
    t,
    e,
    r,
    s,
    n,
    o,
    i,
    l,
    c
  );
  if (typeof a == "number") {
    const p = Ze(f, y, g - u);
    if (a <= 0)
      m = { x: t, y: e };
    else if (a >= p)
      m = { x: l, y: c };
    else {
      if (t === l && e === c)
        return { x: l, y: c };
      if (f === 0 || y === 0)
        return Qe(t, e, l, c, a);
      const { PI: b, cos: M, sin: d } = Math, x = g - u, S = (n % 360 + 360) % 360 * (b / 180), $ = u + x * (a / p), j = f * M($), L = y * d($);
      m = {
        x: M(S) * j - d(S) * L + h.x,
        y: d(S) * j + M(S) * L + h.y
      };
    }
  }
  return m;
}, ft = (t, e, r, s, n, o, i, l, c) => {
  const { center: a, rx: m, ry: h, startAngle: f, endAngle: y } = Ce(
    t,
    e,
    r,
    s,
    n,
    o,
    i,
    l,
    c
  ), u = y - f, { min: g, max: p, tan: b, atan2: M, PI: d } = Math, { x, y: A } = a, S = n * d / 180, $ = b(S), j = M(-h * $, m), L = j, N = j + d, _ = M(h, m * $), U = _ + d, z = [l], C = [c];
  let q = g(t, l), Q = p(t, l), E = g(e, c), D = p(e, c);
  const W = y - u * 1e-5, G = J(x, A, m, h, S, W), w = y - u * 0.99999, k = J(x, A, m, h, S, w);
  if (G[0] > Q || k[0] > Q) {
    const T = J(x, A, m, h, S, L);
    z.push(T[0]), C.push(T[1]);
  }
  if (G[0] < q || k[0] < q) {
    const T = J(x, A, m, h, S, N);
    z.push(T[0]), C.push(T[1]);
  }
  if (G[1] < E || k[1] < E) {
    const T = J(x, A, m, h, S, U);
    z.push(T[0]), C.push(T[1]);
  }
  if (G[1] > D || k[1] > D) {
    const T = J(x, A, m, h, S, _);
    z.push(T[0]), C.push(T[1]);
  }
  return q = g.apply([], z), E = g.apply([], C), Q = p.apply([], z), D = p.apply([], C), [q, E, Q, D];
}, _t = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  angleBetween: je,
  arcLength: Ze,
  arcPoint: J,
  getArcBBox: ft,
  getArcLength: De,
  getArcProps: Ce,
  getPointAtArcLength: ht
}, Symbol.toStringTag, { value: "Module" })), ze = [
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
], yt = [
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
], gt = (t) => {
  const e = [];
  for (let r = t, s = r.length, n = s - 1; s > 1; s -= 1, n -= 1) {
    const o = [];
    for (let i = 0; i < n; i += 1)
      o.push({
        x: n * (r[i + 1].x - r[i].x),
        y: n * (r[i + 1].y - r[i].y),
        t: 0
      });
    e.push(o), r = o;
  }
  return e;
}, dt = (t, e) => {
  if (e === 0)
    return t[0].t = 0, t[0];
  const r = t.length - 1;
  if (e === 1)
    return t[r].t = 1, t[r];
  const s = 1 - e;
  let n = t;
  if (r === 0)
    return t[0].t = e, t[0];
  if (r === 1)
    return {
      x: s * n[0].x + e * n[1].x,
      y: s * n[0].y + e * n[1].y,
      t: e
    };
  const o = s * s, i = e * e;
  let l = 0, c = 0, a = 0, m = 0;
  return r === 2 ? (n = [n[0], n[1], n[2], { x: 0, y: 0 }], l = o, c = s * e * 2, a = i) : r === 3 && (l = o * s, c = o * e * 3, a = s * i * 3, m = e * i), {
    x: l * n[0].x + c * n[1].x + a * n[2].x + m * n[3].x,
    y: l * n[0].y + c * n[1].y + a * n[2].y + m * n[3].y,
    t: e
  };
}, xt = (t, e) => {
  const r = t(e), s = r.x * r.x + r.y * r.y;
  return Math.sqrt(s);
}, pt = (t) => {
  const r = ze.length;
  let s = 0;
  for (let n = 0, o; n < r; n++)
    o = 0.5 * ze[n] + 0.5, s += yt[n] * xt(t, o);
  return 0.5 * s;
}, le = (t) => {
  const e = [];
  for (let s = 0, n = t.length, o = 2; s < n; s += o)
    e.push({
      x: t[s],
      y: t[s + 1]
    });
  const r = gt(e);
  return pt((s) => dt(r[0], s));
}, bt = 1e-8, ue = ([t, e, r]) => {
  const s = Math.min(t, r), n = Math.max(t, r);
  if (e >= t ? r >= e : r <= e)
    return [s, n];
  const o = (t * r - e * e) / (t - 2 * e + r);
  return o < s ? [o, n] : [s, o];
}, qe = ([t, e, r, s]) => {
  const n = t - 3 * e + 3 * r - s;
  if (Math.abs(n) < bt)
    return t === s && t === e ? [t, s] : ue([t, -0.5 * t + 1.5 * e, t - 3 * e + 3 * r]);
  const o = -t * r + t * s - e * r - e * s + e * e + r * r;
  if (o <= 0)
    return [Math.min(t, s), Math.max(t, s)];
  const i = Math.sqrt(o);
  let l = Math.min(t, s), c = Math.max(t, s);
  const a = t - 2 * e + r;
  for (let m = (a + i) / n, h = 1; h <= 2; m = (a - i) / n, h++)
    if (m > 0 && m < 1) {
      const f = t * (1 - m) * (1 - m) * (1 - m) + e * 3 * (1 - m) * (1 - m) * m + r * 3 * (1 - m) * m * m + s * m * m * m;
      f < l && (l = f), f > c && (c = f);
    }
  return [l, c];
}, Qt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CBEZIER_MINMAX_EPSILON: bt,
  Cvalues: yt,
  Tvalues: ze,
  bezierLength: pt,
  calculateBezier: xt,
  computeBezier: dt,
  deriveBezier: gt,
  getBezierLength: le,
  minmaxC: qe,
  minmaxQ: ue
}, Symbol.toStringTag, { value: "Module" })), Mt = ([t, e, r, s, n, o, i, l], c) => {
  const a = 1 - c;
  return {
    x: a ** 3 * t + 3 * a ** 2 * c * r + 3 * a * c ** 2 * n + c ** 3 * i,
    y: a ** 3 * e + 3 * a ** 2 * c * s + 3 * a * c ** 2 * o + c ** 3 * l
  };
}, he = (t, e, r, s, n, o, i, l) => le([t, e, r, s, n, o, i, l]), At = (t, e, r, s, n, o, i, l, c) => {
  const a = typeof c == "number";
  let m = { x: t, y: e };
  if (a) {
    const h = le([t, e, r, s, n, o, i, l]);
    c <= 0 || (c >= h ? m = { x: i, y: l } : m = Mt(
      [t, e, r, s, n, o, i, l],
      c / h
    ));
  }
  return m;
}, ke = (t, e, r, s, n, o, i, l) => {
  const c = qe([t, r, n, i]), a = qe([e, s, o, l]);
  return [c[0], a[0], c[1], a[1]];
}, Zt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getCubicBBox: ke,
  getCubicLength: he,
  getPointAtCubicLength: At,
  getPointAtCubicSegmentLength: Mt
}, Symbol.toStringTag, { value: "Module" })), Ct = ([t, e, r, s, n, o], i) => {
  const l = 1 - i;
  return {
    x: l ** 2 * t + 2 * l * i * r + i ** 2 * n,
    y: l ** 2 * e + 2 * l * i * s + i ** 2 * o
  };
}, fe = (t, e, r, s, n, o) => le([t, e, r, s, n, o]), St = (t, e, r, s, n, o, i) => {
  const l = typeof i == "number";
  let c = { x: t, y: e };
  if (l) {
    const a = le([t, e, r, s, n, o]);
    i <= 0 || (i >= a ? c = { x: n, y: o } : c = Ct(
      [t, e, r, s, n, o],
      i / a
    ));
  }
  return c;
}, Ie = (t, e, r, s, n, o) => {
  const i = ue([t, r, n]), l = ue([e, s, o]);
  return [i[0], l[0], i[1], l[1]];
}, Dt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getPointAtQuadLength: St,
  getPointAtQuadSegmentLength: Ct,
  getQuadBBox: Ie,
  getQuadLength: fe
}, Symbol.toStringTag, { value: "Module" })), Bt = (t) => {
  const e = t.length;
  let r = -1, s, n = t[e - 1], o = 0;
  for (; ++r < e; )
    s = n, n = t[r], o += s[1] * n[0] - s[0] * n[1];
  return o / 2;
}, Ht = (t) => t.reduce((e, r, s) => s ? e + Ae(t[s - 1], r) : 0, 0), Ft = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  polygonArea: Bt,
  polygonLength: Ht
}, Symbol.toStringTag, { value: "Module" })), ye = 1e-5, ae = (t) => {
  const e = V(t), r = { ...ce };
  return R(e, (s, n, o, i) => {
    r.x = o, r.y = i;
    const l = be(s, r), c = l.length;
    return r.x1 = +l[c - 2], r.y1 = +l[c - 1], r.x2 = +l[c - 4] || r.x1, r.y2 = +l[c - 3] || r.y1, l;
  });
}, ne = (t, e) => {
  const r = ae(t);
  let s = !1, n = [], o = "M", i = 0, l = 0, [c, a] = r[0].slice(1);
  const m = typeof e == "number";
  let h = { x: c, y: a }, f = 0, y = h, u = 0;
  return !m || e < ye ? h : (R(r, (g, p, b, M) => {
    if ([o] = g, s = o === "M", n = s ? n : [b, M].concat(g.slice(1)), s ? ([, c, a] = g, h = { x: c, y: a }, f = 0) : o === "L" ? (h = Qe(
      n[0],
      n[1],
      n[2],
      n[3],
      e - u
    ), f = re(n[0], n[1], n[2], n[3])) : o === "A" ? (h = ht(
      n[0],
      n[1],
      n[2],
      n[3],
      n[4],
      n[5],
      n[6],
      n[7],
      n[8],
      e - u
    ), f = De(
      n[0],
      n[1],
      n[2],
      n[3],
      n[4],
      n[5],
      n[6],
      n[7],
      n[8]
    )) : o === "C" ? (h = At(
      n[0],
      n[1],
      n[2],
      n[3],
      n[4],
      n[5],
      n[6],
      n[7],
      e - u
    ), f = he(
      n[0],
      n[1],
      n[2],
      n[3],
      n[4],
      n[5],
      n[6],
      n[7]
    )) : o === "Q" ? (h = St(
      n[0],
      n[1],
      n[2],
      n[3],
      n[4],
      n[5],
      e - u
    ), f = fe(
      n[0],
      n[1],
      n[2],
      n[3],
      n[4],
      n[5]
    )) : o === "Z" && (n = [b, M, c, a], h = { x: c, y: a }, f = re(n[0], n[1], n[2], n[3])), [i, l] = n.slice(-2), u < e)
      y = h;
    else
      return !1;
    u += f;
  }), e > u - ye ? { x: i, y: l } : y);
}, ee = (t) => {
  const e = V(t);
  let r = 0, s = 0, n = 0, o = 0, i = 0, l = 0, c = "M", a = 0, m = 0, h = 0;
  return R(e, (f, y, u, g) => {
    [c] = f;
    const p = c.toUpperCase(), M = p !== c ? ie(f, y, u, g) : f.slice(0), d = p === "V" ? ["L", u, M[1]] : p === "H" ? ["L", M[1], g] : M;
    if ([c] = d, "TQ".includes(p) || (i = 0, l = 0), c === "M")
      [, a, m] = d;
    else if (c === "L")
      h += re(
        u,
        g,
        d[1],
        d[2]
      );
    else if (c === "A")
      h += De(
        u,
        g,
        d[1],
        d[2],
        d[3],
        d[4],
        d[5],
        d[6],
        d[7]
      );
    else if (c === "S") {
      const x = r * 2 - n, A = s * 2 - o;
      h += he(
        u,
        g,
        x,
        A,
        d[1],
        d[2],
        d[3],
        d[4]
      );
    } else c === "C" ? h += he(
      u,
      g,
      d[1],
      d[2],
      d[3],
      d[4],
      d[5],
      d[6]
    ) : c === "T" ? (i = r * 2 - i, l = s * 2 - l, h += fe(
      u,
      g,
      i,
      l,
      d[1],
      d[2]
    )) : c === "Q" ? (i = d[1], l = d[2], h += fe(
      u,
      g,
      d[1],
      d[2],
      d[3],
      d[4]
    )) : c === "Z" && (h += re(u, g, a, m));
    [r, s] = c === "Z" ? [a, m] : d.slice(-2), [n, o] = c === "C" ? [d[3], d[4]] : c === "S" ? [d[1], d[2]] : [r, s];
  }), h;
}, Be = (t, e) => {
  const r = V(t);
  let s = r.slice(0), n = ee(s), o = s.length - 1, i = 0, l = 0, c = r[0];
  if (o <= 0 || !e || !Number.isFinite(e))
    return {
      segment: c,
      index: 0,
      length: l,
      lengthAtSegment: i
    };
  if (e >= n)
    return s = r.slice(0, -1), i = ee(s), l = n - i, c = r[o], {
      segment: c,
      index: o,
      length: l,
      lengthAtSegment: i
    };
  const a = [];
  for (; o > 0; )
    c = s[o], s = s.slice(0, -1), i = ee(s), l = n - i, n = i, a.push({
      segment: c,
      index: o,
      length: l,
      lengthAtSegment: i
    }), o -= 1;
  return a.find(
    ({ lengthAtSegment: m }) => m <= e
  );
}, Se = (t, e) => {
  const r = V(t), s = ae(r), n = ee(s), o = (x) => {
    const A = x.x - e.x, S = x.y - e.y;
    return A * A + S * S;
  };
  let i = 8, l, c = { x: 0, y: 0 }, a = 0, m = 0, h = 1 / 0;
  for (let x = 0; x <= n; x += i)
    l = ne(s, x), a = o(l), a < h && (c = l, m = x, h = a);
  i /= 2;
  let f, y, u = 0, g = 0, p = 0, b = 0;
  for (; i > 1e-6 && (u = m - i, f = ne(s, u), p = o(f), g = m + i, y = ne(s, g), b = o(y), u >= 0 && p < h ? (c = f, m = u, h = p) : g <= n && b < h ? (c = y, m = g, h = b) : i /= 2, !(i < 1e-5)); )
    ;
  const M = Be(r, m), d = Math.sqrt(h);
  return { closest: c, distance: d, segment: M };
}, Ut = (t, e) => Se(t, e).closest, Gt = (t, e, r, s, n, o, i, l) => 3 * ((l - e) * (r + n) - (i - t) * (s + o) + s * (t - n) - r * (e - o) + l * (n + t / 3) - i * (o + e / 3)) / 20, Pt = (t) => {
  let e = 0, r = 0, s = 0;
  return Me(t).map((n) => {
    switch (n[0]) {
      case "M":
        return [, e, r] = n, 0;
      default:
        return s = Gt(
          e,
          r,
          n[1],
          n[2],
          n[3],
          n[4],
          n[5],
          n[6]
        ), [e, r] = n.slice(-2), s;
    }
  }).reduce((n, o) => n + o, 0);
}, Jt = (t) => Pt(Me(t)) >= 0, Nt = (t) => {
  if (!t)
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
  const e = V(t);
  let r = "M", s = 0, n = 0;
  const { max: o, min: i } = Math;
  let l = 1 / 0, c = 1 / 0, a = -1 / 0, m = -1 / 0, h = 0, f = 0, y = 0, u = 0, g = 0, p = 0, b = 0, M = 0, d = 0, x = 0;
  R(e, ($, j, L, N) => {
    [r] = $;
    const _ = r.toUpperCase(), z = _ !== r ? ie($, j, L, N) : $.slice(0), C = _ === "V" ? ["L", L, z[1]] : _ === "H" ? ["L", z[1], N] : z;
    if ([r] = C, "TQ".includes(_) || (d = 0, x = 0), r === "M")
      [, s, n] = C, h = s, f = n, y = s, u = n;
    else if (r === "L")
      [h, f, y, u] = $e(
        L,
        N,
        C[1],
        C[2]
      );
    else if (r === "A")
      [h, f, y, u] = ft(
        L,
        N,
        C[1],
        C[2],
        C[3],
        C[4],
        C[5],
        C[6],
        C[7]
      );
    else if (r === "S") {
      const q = g * 2 - b, Q = p * 2 - M;
      [h, f, y, u] = ke(
        L,
        N,
        q,
        Q,
        C[1],
        C[2],
        C[3],
        C[4]
      );
    } else r === "C" ? [h, f, y, u] = ke(
      L,
      N,
      C[1],
      C[2],
      C[3],
      C[4],
      C[5],
      C[6]
    ) : r === "T" ? (d = g * 2 - d, x = p * 2 - x, [h, f, y, u] = Ie(
      L,
      N,
      d,
      x,
      C[1],
      C[2]
    )) : r === "Q" ? (d = C[1], x = C[2], [h, f, y, u] = Ie(
      L,
      N,
      C[1],
      C[2],
      C[3],
      C[4]
    )) : r === "Z" && ([h, f, y, u] = $e(L, N, s, n));
    l = i(h, l), c = i(f, c), a = o(y, a), m = o(u, m), [g, p] = r === "Z" ? [s, n] : C.slice(-2), [b, M] = r === "C" ? [C[3], C[4]] : r === "S" ? [C[1], C[2]] : [g, p];
  });
  const A = a - l, S = m - c;
  return {
    width: A,
    height: S,
    x: l,
    y: c,
    x2: a,
    y2: m,
    cx: l + A / 2,
    cy: c + S / 2,
    // an estimated guess
    cz: Math.max(A, S) + Math.min(A, S) / 2
  };
}, Kt = (t, e) => Be(t, e).segment, Wt = (t, e) => Se(t, e).segment, Pe = (t) => Array.isArray(t) && t.every((e) => {
  const r = e[0].toLowerCase();
  return X[r] === e.length - 1 && "achlmqstvz".includes(r) && e.slice(1).every(Number.isFinite);
}) && t.length > 0, wt = (t) => Pe(t) && // `isPathArray` also checks if it's `Array`
t.every(([e]) => e === e.toUpperCase()), Lt = (t) => wt(t) && t.every(([e]) => "ACLMQZ".includes(e)), Xt = (t) => Lt(t) && t.every(([e]) => "MC".includes(e)), Yt = (t, e) => {
  const { distance: r } = Se(t, e);
  return Math.abs(r) < ye;
}, en = (t) => Pe(t) && // `isPathArray` checks if it's `Array`
t.slice(1).every(([e]) => e === e.toLowerCase()), Tt = (t) => {
  if (typeof t != "string" || !t.length)
    return !1;
  const e = new Ve(t);
  for (Y(e); e.index < e.max && !e.err.length; )
    Oe(e);
  return !e.err.length && "mM".includes(e.segments[0][0]);
}, se = {
  line: ["x1", "y1", "x2", "y2"],
  circle: ["cx", "cy", "r"],
  ellipse: ["cx", "cy", "rx", "ry"],
  rect: ["width", "height", "x", "y", "rx", "ry"],
  polygon: ["points"],
  polyline: ["points"],
  glyph: ["d"]
}, vt = (t) => t != null && typeof t == "object" && t.nodeType === 1, tn = (t) => {
  let { x1: e, y1: r, x2: s, y2: n } = t;
  return [e, r, s, n] = [e, r, s, n].map((o) => +o), [
    ["M", e, r],
    ["L", s, n]
  ];
}, nn = (t) => {
  const e = [], r = (t.points || "").trim().split(/[\s|,]/).map((n) => +n);
  let s = 0;
  for (; s < r.length; )
    e.push([s ? "L" : "M", r[s], r[s + 1]]), s += 2;
  return t.type === "polygon" ? [...e, ["z"]] : e;
}, rn = (t) => {
  let { cx: e, cy: r, r: s } = t;
  return [e, r, s] = [e, r, s].map((n) => +n), [
    ["M", e - s, r],
    ["a", s, s, 0, 1, 0, 2 * s, 0],
    ["a", s, s, 0, 1, 0, -2 * s, 0]
  ];
}, sn = (t) => {
  let { cx: e, cy: r } = t, s = t.rx || 0, n = t.ry || s;
  return [e, r, s, n] = [e, r, s, n].map((o) => +o), [
    ["M", e - s, r],
    ["a", s, n, 0, 1, 0, 2 * s, 0],
    ["a", s, n, 0, 1, 0, -2 * s, 0]
  ];
}, on = (t) => {
  const e = +t.x || 0, r = +t.y || 0, s = +t.width, n = +t.height;
  let o = +(t.rx || 0), i = +(t.ry || o);
  return o || i ? (o * 2 > s && (o -= (o * 2 - s) / 2), i * 2 > n && (i -= (i * 2 - n) / 2), [
    ["M", e + o, r],
    ["h", s - o * 2],
    ["s", o, 0, o, i],
    ["v", n - i * 2],
    ["s", 0, i, -o, i],
    ["h", -s + o * 2],
    ["s", -o, 0, -o, -i],
    ["v", -n + i * 2],
    ["s", 0, -i, o, -i]
  ]) : [["M", e, r], ["h", s], ["v", n], ["H", e], ["Z"]];
}, $t = (t) => {
  const e = Object.keys(se), r = vt(t), s = r ? t.tagName : null;
  if (s && [...e, "path"].every((c) => s !== c))
    throw TypeError(`${O}: "${s}" is not SVGElement`);
  const n = r ? s : t.type, o = se[n], i = { type: n };
  r ? o.forEach((c) => {
    i[c] = t.getAttribute(c);
  }) : Object.assign(i, t);
  let l = [];
  return n === "circle" ? l = rn(i) : n === "ellipse" ? l = sn(i) : ["polyline", "polygon"].includes(n) ? l = nn(i) : n === "rect" ? l = on(i) : n === "line" ? l = tn(i) : ["glyph", "path"].includes(n) && (l = V(
    r ? t.getAttribute("d") || /* istanbul ignore next @preserve */
    "" : t.d || ""
  )), Pe(l) && l.length ? l : !1;
}, cn = (t, e, r) => {
  const s = r || document, n = Object.keys(se), o = vt(t), i = o ? t.tagName : null;
  if (i === "path")
    throw TypeError(`${O}: "${i}" is already SVGPathElement`);
  if (i && n.every((u) => i !== u))
    throw TypeError(`${O}: "${i}" is not SVGElement`);
  const l = s.createElementNS("http://www.w3.org/2000/svg", "path"), c = o ? i : t.type, a = se[c], m = { type: c }, h = K.round, f = $t(t), y = f && f.length ? _e(f, h) : "";
  return o ? (a.forEach((u) => {
    m[u] = t.getAttribute(u);
  }), Object.values(t.attributes).forEach(({ name: u, value: g }) => {
    a.includes(u) || l.setAttribute(u, g);
  })) : (Object.assign(m, t), Object.keys(m).forEach((u) => {
    !a.includes(u) && u !== "type" && l.setAttribute(
      u.replace(/[A-Z]/g, (g) => `-${g.toLowerCase()}`),
      m[u]
    );
  })), Tt(y) ? (l.setAttribute("d", y), e && o && (t.before(l, t), t.remove()), l) : !1;
}, jt = (t) => {
  let e = new P();
  const { origin: r } = t, [s, n] = r, { translate: o } = t, { rotate: i } = t, { skew: l } = t, { scale: c } = t;
  return Array.isArray(o) && o.length >= 2 && o.every((a) => !Number.isNaN(+a)) && o.some((a) => a !== 0) ? e = e.translate(...o) : typeof o == "number" && !Number.isNaN(o) && (e = e.translate(o)), (i || l || c) && (e = e.translate(s, n), Array.isArray(i) && i.length >= 2 && i.every((a) => !Number.isNaN(+a)) && i.some((a) => a !== 0) ? e = e.rotate(...i) : typeof i == "number" && !Number.isNaN(i) && (e = e.rotate(i)), Array.isArray(l) && l.length === 2 && l.every(
    (a) => !Number.isNaN(+a)
  ) && l.some((a) => a !== 0) ? (e = l[0] ? e.skewX(l[0]) : e, e = l[1] ? e.skewY(l[1]) : e) : typeof l == "number" && !Number.isNaN(l) && (e = e.skewX(l)), Array.isArray(c) && c.length >= 2 && c.every(
    (a) => !Number.isNaN(+a)
  ) && c.some((a) => a !== 1) ? e = e.scale(...c) : typeof c == "number" && !Number.isNaN(c) && (e = e.scale(c)), e = e.translate(-s, -n)), e;
}, zt = (t, e, r, s) => {
  const [n] = t, { round: o } = K, i = o, l = e.slice(1), { x1: c, y1: a, x2: m, y2: h, x: f, y } = r, [u, g] = l.slice(-2), p = t;
  if ("TQ".includes(n) || (r.qx = null, r.qy = null), n === "L") {
    if (v(f, i) === v(u, i))
      return ["V", g];
    if (v(y, i) === v(g, i))
      return ["H", u];
  } else if (n === "C") {
    const [b, M] = l;
    if (r.x1 = b, r.y1 = M, "CS".includes(s) && (v(b, i) === v(c * 2 - m, i) && v(M, i) === v(a * 2 - h, i) || v(c, i) === v(m * 2 - f, i) && v(a, i) === v(h * 2 - y, i)))
      return [
        "S",
        l[2],
        l[3],
        l[4],
        l[5]
      ];
  } else if (n === "Q") {
    const [b, M] = l;
    if (r.qx = b, r.qy = M, "QT".includes(s) && v(b, i) === v(c * 2 - m, i) && v(M, i) === v(a * 2 - h, i))
      return ["T", l[2], l[3]];
  }
  return p;
}, ge = (t, e) => {
  const r = t.slice(1).map(
    (s) => v(s, e)
  );
  return [t[0]].concat(r);
}, qt = (t, e) => {
  const r = xe(t), s = typeof e == "number" && e >= 0 ? e : (
    /* istanbul ignore next @preserve */
    2
  ), n = { ...ce }, o = [];
  let i = "M", l = "Z";
  return R(r, (c, a, m, h) => {
    n.x = m, n.y = h;
    const f = be(c, n);
    let y = c;
    if ([i] = c, o[a] = i, a) {
      l = o[a - 1];
      const g = zt(
        c,
        f,
        n,
        l
      ), p = ge(g, s), b = p.join(""), M = Re(g, a, m, h), d = ge(M, s), x = d.join("");
      y = b.length < x.length ? p : d;
    }
    const u = f.length;
    return n.x1 = +f[u - 2], n.y1 = +f[u - 1], n.x2 = +f[u - 4] || n.x1, n.y2 = +f[u - 3] || n.y1, y;
  });
}, ln = (t, e) => {
  let r = P.Translate(e[0], e[1], e[2]);
  return [, , , r.m44] = e, r = t.multiply(r), [r.m41, r.m42, r.m43, r.m44];
}, Ee = (t, e, r) => {
  const [s, n, o] = r, [i, l, c] = ln(t, [e[0], e[1], 0, 1]), a = i - s, m = l - n, h = c - o;
  return [
    // protect against division by ZERO
    a * (Math.abs(o) / Math.abs(h) || 1) + s,
    m * (Math.abs(o) / Math.abs(h) || 1) + n
  ];
}, an = (t) => {
  const e = t.slice(1).map(
    (r, s, n) => s ? n[s - 1].slice(-2).concat(r.slice(1)) : t[0].slice(1).concat(r.slice(1))
  ).map((r) => r.map((s, n) => r[r.length - n - 2 * (1 - n % 2)])).reverse();
  return [["M"].concat(e[0].slice(0, 2))].concat(
    e.map((r) => ["C"].concat(r.slice(2)))
  );
}, me = (t) => {
  const e = xe(t), r = ae(e), s = e.length, n = e[s - 1][0] === "Z", o = R(e, (i, l) => {
    const c = r[l], a = l && e[l - 1], m = a && a[0], h = e[l + 1], f = h && h[0], [y] = i, [u, g] = r[l ? l - 1 : s - 1].slice(-2);
    let p = i;
    switch (y) {
      case "M":
        p = n ? ["Z"] : [y, u, g];
        break;
      case "A":
        p = [
          y,
          i[1],
          i[2],
          i[3],
          i[4],
          i[5] === 1 ? 0 : 1,
          u,
          g
        ];
        break;
      case "C":
        h && f === "S" ? p = ["S", i[1], i[2], u, g] : p = [
          y,
          i[3],
          i[4],
          i[1],
          i[2],
          u,
          g
        ];
        break;
      case "S":
        m && "CS".includes(m) && (!h || f !== "S") ? p = [
          "C",
          c[3],
          c[4],
          c[1],
          c[2],
          u,
          g
        ] : p = [
          y,
          c[1],
          c[2],
          u,
          g
        ];
        break;
      case "Q":
        h && f === "T" ? p = ["T", u, g] : p = [y, i[1], i[2], u, g];
        break;
      case "T":
        m && "QT".includes(m) && (!h || f !== "T") ? p = [
          "Q",
          c[1],
          c[2],
          u,
          g
        ] : p = [y, u, g];
        break;
      case "Z":
        p = ["M", u, g];
        break;
      case "H":
        p = [y, u];
        break;
      case "V":
        p = [y, g];
        break;
      default:
        p = [y].concat(
          i.slice(1, -2),
          u,
          g
        );
    }
    return p;
  });
  return n ? o.reverse() : [o[0]].concat(o.slice(1).reverse());
}, mn = (t, e) => {
  let { round: r } = K;
  return r = e === "off" || typeof e == "number" && e >= 0 ? e : typeof r == "number" && r >= 0 ? r : (
    /* istanbul ignore next @preserve */
    "off"
  ), r === "off" ? t.slice(0) : R(t, (s) => ge(s, r));
}, un = (t, e = 0.5) => {
  const r = e, s = t.slice(0, 2), n = t.slice(2, 4), o = t.slice(4, 6), i = t.slice(6, 8), l = Z(s, n, r), c = Z(n, o, r), a = Z(o, i, r), m = Z(l, c, r), h = Z(c, a, r), f = Z(m, h, r);
  return [
    ["C", l[0], l[1], m[0], m[1], f[0], f[1]],
    ["C", h[0], h[1], a[0], a[1], i[0], i[1]]
  ];
}, kt = (t) => {
  const e = [];
  let r, s = -1, n = 0, o = 0, i = 0, l = 0;
  const c = { ...ce };
  return t.forEach((a) => {
    const [m] = a, h = m.toUpperCase(), f = m.toLowerCase(), y = m === f, u = a.slice(1);
    h === "M" ? (s += 1, [n, o] = u, n += y ? c.x : 0, o += y ? c.y : 0, i = n, l = o, r = [y ? [h, i, l] : a]) : (h === "Z" ? (n = i, o = l) : h === "H" ? ([, n] = a, n += y ? c.x : (
      /* istanbul ignore next @preserve */
      0
    )) : h === "V" ? ([, o] = a, o += y ? c.y : (
      /* istanbul ignore next @preserve */
      0
    )) : ([n, o] = a.slice(-2), n += y ? c.x : 0, o += y ? c.y : 0), r.push(a)), c.x = n, c.y = o, e[s] = r;
  }), e;
}, It = (t, e) => {
  let r = 0, s = 0, n = 0, o = 0, i = 0, l = 0, c = "M";
  const a = V(t), m = e && Object.keys(e);
  if (!e || m && !m.length)
    return a.slice(0);
  e.origin || Object.assign(e, { origin: K.origin });
  const h = e.origin, f = jt(e);
  return f.isIdentity ? a.slice(0) : R(a, (y, u, g, p) => {
    [c] = y;
    const b = c.toUpperCase(), d = b !== c ? ie(y, u, g, p) : y.slice(0);
    let x = b === "A" ? ["C"].concat(
      pe(
        g,
        p,
        d[1],
        d[2],
        d[3],
        d[4],
        d[5],
        d[6],
        d[7]
      )
    ) : b === "V" ? ["L", g, d[1]] : b === "H" ? ["L", d[1], p] : d;
    c = x[0];
    const A = c === "C" && x.length > 7, S = A ? x.slice(0, 7) : x.slice(0);
    if (A && (a.splice(
      u + 1,
      0,
      ["C"].concat(
        x.slice(7)
      )
    ), x = S), c === "L")
      [n, o] = Ee(f, [
        x[1],
        x[2]
      ], h), r !== n && s !== o ? x = ["L", n, o] : s === o ? x = ["H", n] : r === n && (x = ["V", o]);
    else
      for (i = 1, l = x.length; i < l; i += 2)
        [n, o] = Ee(
          f,
          [+x[i], +x[i + 1]],
          h
        ), x[i] = n, x[i + 1] = o;
    return r = n, s = o, x;
  });
};
class hn {
  /**
   * @constructor
   * @param pathValue the path string
   * @param config instance options
   */
  constructor(e, r) {
    const s = r || {}, n = typeof e > "u";
    if (n || !e.length)
      throw TypeError(
        `${O}: "pathValue" is ${n ? "undefined" : "empty"}`
      );
    this.segments = V(e);
    const { round: o, origin: i } = s;
    let l;
    Number.isInteger(o) || o === "off" ? l = o : l = K.round;
    let c = K.origin;
    if (Array.isArray(i) && i.length >= 2) {
      const [a, m, h] = i.map(Number);
      c = [
        Number.isNaN(a) ? 0 : a,
        Number.isNaN(m) ? 0 : m,
        Number.isNaN(h) ? 0 : h
      ];
    }
    return this.round = l, this.origin = c, this;
  }
  get bbox() {
    return Nt(this.segments);
  }
  get length() {
    return ee(this.segments);
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
  getPointAtLength(e) {
    return ne(this.segments, e);
  }
  /**
   * Convert path to absolute values
   *
   * @public
   */
  toAbsolute() {
    const { segments: e } = this;
    return this.segments = xe(e), this;
  }
  /**
   * Convert path to relative values
   *
   * @public
   */
  toRelative() {
    const { segments: e } = this;
    return this.segments = at(e), this;
  }
  /**
   * Convert path to cubic-bezier values. In addition, un-necessary `Z`
   * segment is removed if previous segment extends to the `M` segment.
   *
   * @public
   */
  toCurve() {
    const { segments: e } = this;
    return this.segments = Me(e), this;
  }
  /**
   * Reverse the order of the segments and their values.
   *
   * @param onlySubpath option to reverse all sub-paths except first
   * @public
   */
  reverse(e) {
    const { segments: r } = this, s = kt(r), n = s.length > 1 ? s : !1, o = n ? n.map((l, c) => e ? c ? me(l) : l.slice(0) : me(l)) : r.slice(0);
    let i = [];
    return n ? i = o.flat(1) : i = e ? r : me(r), this.segments = i.slice(0), this;
  }
  /**
   * Normalize path in 2 steps:
   * * convert `pathArray`(s) to absolute values
   * * convert shorthand notation to standard notation
   *
   * @public
   */
  normalize() {
    const { segments: e } = this;
    return this.segments = ae(e), this;
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
    const { segments: e } = this, r = this.round === "off" ? 2 : this.round;
    return this.segments = qt(e, r), this;
  }
  /**
   * Transform path using values from an `Object` defined as `transformObject`.
   *
   * @see TransformObject for a quick refference
   *
   * @param source a `transformObject`as described above
   * @public
   */
  transform(e) {
    if (!e || typeof e != "object" || typeof e == "object" && !["translate", "rotate", "skew", "scale"].some((c) => c in e))
      return this;
    const {
      segments: r,
      origin: [s, n, o]
    } = this, i = {};
    for (const [c, a] of Object.entries(e))
      c === "skew" && Array.isArray(a) || (c === "rotate" || c === "translate" || c === "origin" || c === "scale") && Array.isArray(a) ? i[c] = a.map(Number) : c !== "origin" && typeof Number(a) == "number" && (i[c] = Number(a));
    const { origin: l } = i;
    if (Array.isArray(l) && l.length >= 2) {
      const [c, a, m] = l.map(Number);
      i.origin = [
        Number.isNaN(c) ? s : c,
        Number.isNaN(a) ? n : a,
        m || o
      ];
    } else
      i.origin = [s, n, o];
    return this.segments = It(r, i), this;
  }
  /**
   * Rotate path 180deg vertically
   *
   * @public
   */
  flipX() {
    const { cx: e, cy: r } = this.bbox;
    return this.transform({ rotate: [0, 180, 0], origin: [e, r, 0] }), this;
  }
  /**
   * Rotate path 180deg horizontally
   *
   * @public
   */
  flipY() {
    const { cx: e, cy: r } = this.bbox;
    return this.transform({ rotate: [180, 0, 0], origin: [e, r, 0] }), this;
  }
  /**
   * Export the current path to be used
   * for the `d` (description) attribute.
   *
   * @public
   * @return the path string
   */
  toString() {
    return _e(this.segments, this.round);
  }
  /**
   * Remove the instance.
   *
   * @public
   * @return void
   */
  dispose() {
    Object.keys(this).forEach((e) => delete this[e]);
  }
}
const fn = {
  absolutizeSegment: ie,
  arcToCubic: pe,
  arcTools: _t,
  bezierTools: Qt,
  CSSMatrix: P,
  cubicTools: Zt,
  distanceEpsilon: ye,
  distanceSquareRoot: Ae,
  finalizeSegment: Te,
  getClosestPoint: Ut,
  getDrawDirection: Jt,
  getPathArea: Pt,
  getPathBBox: Nt,
  getPointAtLength: ne,
  getPropertiesAtLength: Be,
  getPropertiesAtPoint: Se,
  getSegmentAtLength: Kt,
  getSegmentOfPoint: Wt,
  getSVGMatrix: jt,
  getTotalLength: ee,
  invalidPathValue: F,
  isAbsoluteArray: wt,
  isArcCommand: ct,
  isCurveArray: Xt,
  isDigit: H,
  isDigitStart: it,
  isMoveCommand: lt,
  isNormalizedArray: Lt,
  isPathArray: Pe,
  isPathCommand: ot,
  isPointInStroke: Yt,
  isRelativeArray: en,
  isSpace: st,
  isValidPath: Tt,
  iterate: R,
  lineToCubic: ve,
  lineTools: Rt,
  midPoint: Z,
  normalizePath: ae,
  normalizeSegment: be,
  optimizePath: qt,
  paramsCount: X,
  paramsParser: ce,
  parsePathString: V,
  pathParser: Ve,
  pathToAbsolute: xe,
  pathToCurve: Me,
  pathToRelative: at,
  pathToString: _e,
  polygonTools: Ft,
  projection2d: Ee,
  quadToCubic: mt,
  quadTools: Dt,
  relativizeSegment: Re,
  reverseCurve: an,
  reversePath: me,
  rotateVector: te,
  roundPath: mn,
  roundSegment: ge,
  roundTo: v,
  scanFlag: nt,
  scanParam: rt,
  scanSegment: Oe,
  segmentToCubic: ut,
  shapeParams: se,
  shapeToPath: cn,
  shapeToPathArray: $t,
  shortenSegment: zt,
  skipSpaces: Y,
  splitCubic: un,
  splitPath: kt,
  // SVGPathCommander as default,
  transformPath: It
}, yn = Object.assign(hn, fn);
export {
  yn as default
};
//# sourceMappingURL=svg-path-commander.mjs.map
