var ft = Object.defineProperty, yt = (t, e, r) => e in t ? ft(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, k = (t, e, r) => yt(t, typeof e != "symbol" ? e + "" : e, r);
const xt = {
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
}, Re = (t) => (t instanceof Float64Array || t instanceof Float32Array || Array.isArray(t) && t.every((e) => typeof e == "number")) && [6, 16].some((e) => t.length === e), _e = (t) => t instanceof DOMMatrix || t instanceof P || typeof t == "object" && Object.keys(xt).every((e) => t && e in t), ee = (t) => {
  const e = new P(), r = Array.from(t);
  if (!Re(r))
    throw TypeError(
      `CSSMatrix: "${r.join(",")}" must be an array with 6/16 numbers.`
    );
  if (r.length === 16) {
    const [
      o,
      n,
      s,
      i,
      l,
      c,
      a,
      u,
      h,
      f,
      y,
      m,
      x,
      p,
      b,
      M
    ] = r;
    e.m11 = o, e.a = o, e.m21 = l, e.c = l, e.m31 = h, e.m41 = x, e.e = x, e.m12 = n, e.b = n, e.m22 = c, e.d = c, e.m32 = f, e.m42 = p, e.f = p, e.m13 = s, e.m23 = a, e.m33 = y, e.m43 = b, e.m14 = i, e.m24 = u, e.m34 = m, e.m44 = M;
  } else if (r.length === 6) {
    const [o, n, s, i, l, c] = r;
    e.m11 = o, e.a = o, e.m12 = n, e.b = n, e.m21 = s, e.c = s, e.m22 = i, e.d = i, e.m41 = l, e.e = l, e.m42 = c, e.f = c;
  }
  return e;
}, Oe = (t) => {
  if (_e(t))
    return ee([
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
}, Qe = (t) => {
  if (typeof t != "string")
    throw TypeError(`CSSMatrix: "${JSON.stringify(t)}" is not a string.`);
  const e = String(t).replace(/\s/g, "");
  let r = new P();
  const o = `CSSMatrix: invalid transform string "${t}"`;
  return e.split(")").filter((n) => n).forEach((n) => {
    const [s, i] = n.split("(");
    if (!i) throw TypeError(o);
    const l = i.split(",").map(
      (m) => m.includes("rad") ? parseFloat(m) * (180 / Math.PI) : parseFloat(m)
    ), [c, a, u, h] = l, f = [c, a, u], y = [c, a, u, h];
    if (s === "perspective" && c && [a, u].every((m) => m === void 0))
      r.m34 = -1 / c;
    else if (s.includes("matrix") && [6, 16].includes(l.length) && l.every((m) => !Number.isNaN(+m))) {
      const m = l.map((x) => Math.abs(x) < 1e-6 ? 0 : x);
      r = r.multiply(ee(m));
    } else if (s === "translate3d" && f.every((m) => !Number.isNaN(+m)))
      r = r.translate(c, a, u);
    else if (s === "translate" && c && u === void 0)
      r = r.translate(c, a || 0, 0);
    else if (s === "rotate3d" && y.every((m) => !Number.isNaN(+m)) && h)
      r = r.rotateAxisAngle(c, a, u, h);
    else if (s === "rotate" && c && [a, u].every((m) => m === void 0))
      r = r.rotate(0, 0, c);
    else if (s === "scale3d" && f.every((m) => !Number.isNaN(+m)) && f.some((m) => m !== 1))
      r = r.scale(c, a, u);
    else if (
      // prop === "scale" && !Number.isNaN(x) && x !== 1 && z === undefined
      // prop === "scale" && !Number.isNaN(x) && [x, y].some((n) => n !== 1) &&
      s === "scale" && !Number.isNaN(c) && (c !== 1 || a !== 1) && u === void 0
    ) {
      const m = Number.isNaN(+a) ? c : a;
      r = r.scale(c, m, 1);
    } else if (s === "skew" && (c || !Number.isNaN(c) && a) && u === void 0)
      r = r.skew(c, a || 0);
    else if (["translate", "rotate", "scale", "skew"].some(
      (m) => s.includes(m)
    ) && /[XYZ]/.test(s) && c && [a, u].every((m) => m === void 0))
      if (s === "skewX" || s === "skewY")
        r = r[s](c);
      else {
        const m = s.replace(/[XYZ]/, ""), x = s.replace(m, ""), p = ["X", "Y", "Z"].indexOf(x), b = m === "scale" ? 1 : 0, M = [
          p === 0 ? c : b,
          p === 1 ? c : b,
          p === 2 ? c : b
        ];
        r = r[m](...M);
      }
    else
      throw TypeError(o);
  }), r;
}, de = (t, e) => e ? [t.a, t.b, t.c, t.d, t.e, t.f] : [
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
], Ze = (t, e, r) => {
  const o = new P();
  return o.m41 = t, o.e = t, o.m42 = e, o.f = e, o.m43 = r, o;
}, De = (t, e, r) => {
  const o = new P(), n = Math.PI / 180, s = t * n, i = e * n, l = r * n, c = Math.cos(s), a = -Math.sin(s), u = Math.cos(i), h = -Math.sin(i), f = Math.cos(l), y = -Math.sin(l), m = u * f, x = -u * y;
  o.m11 = m, o.a = m, o.m12 = x, o.b = x, o.m13 = h;
  const p = a * h * f + c * y;
  o.m21 = p, o.c = p;
  const b = c * f - a * h * y;
  return o.m22 = b, o.d = b, o.m23 = -a * u, o.m31 = a * y - c * h * f, o.m32 = a * f + c * h * y, o.m33 = c * u, o;
}, Be = (t, e, r, o) => {
  const n = new P(), s = Math.sqrt(t * t + e * e + r * r);
  if (s === 0)
    return n;
  const i = t / s, l = e / s, c = r / s, a = o * (Math.PI / 360), u = Math.sin(a), h = Math.cos(a), f = u * u, y = i * i, m = l * l, x = c * c, p = 1 - 2 * (m + x) * f;
  n.m11 = p, n.a = p;
  const b = 2 * (i * l * f + c * u * h);
  n.m12 = b, n.b = b, n.m13 = 2 * (i * c * f - l * u * h);
  const M = 2 * (l * i * f - c * u * h);
  n.m21 = M, n.c = M;
  const d = 1 - 2 * (x + y) * f;
  return n.m22 = d, n.d = d, n.m23 = 2 * (l * c * f + i * u * h), n.m31 = 2 * (c * i * f + l * u * h), n.m32 = 2 * (c * l * f - i * u * h), n.m33 = 1 - 2 * (y + m) * f, n;
}, He = (t, e, r) => {
  const o = new P();
  return o.m11 = t, o.a = t, o.m22 = e, o.d = e, o.m33 = r, o;
}, ae = (t, e) => {
  const r = new P();
  if (t) {
    const o = t * Math.PI / 180, n = Math.tan(o);
    r.m21 = n, r.c = n;
  }
  if (e) {
    const o = e * Math.PI / 180, n = Math.tan(o);
    r.m12 = n, r.b = n;
  }
  return r;
}, Fe = (t) => ae(t, 0), Ue = (t) => ae(0, t), D = (t, e) => {
  const r = e.m11 * t.m11 + e.m12 * t.m21 + e.m13 * t.m31 + e.m14 * t.m41, o = e.m11 * t.m12 + e.m12 * t.m22 + e.m13 * t.m32 + e.m14 * t.m42, n = e.m11 * t.m13 + e.m12 * t.m23 + e.m13 * t.m33 + e.m14 * t.m43, s = e.m11 * t.m14 + e.m12 * t.m24 + e.m13 * t.m34 + e.m14 * t.m44, i = e.m21 * t.m11 + e.m22 * t.m21 + e.m23 * t.m31 + e.m24 * t.m41, l = e.m21 * t.m12 + e.m22 * t.m22 + e.m23 * t.m32 + e.m24 * t.m42, c = e.m21 * t.m13 + e.m22 * t.m23 + e.m23 * t.m33 + e.m24 * t.m43, a = e.m21 * t.m14 + e.m22 * t.m24 + e.m23 * t.m34 + e.m24 * t.m44, u = e.m31 * t.m11 + e.m32 * t.m21 + e.m33 * t.m31 + e.m34 * t.m41, h = e.m31 * t.m12 + e.m32 * t.m22 + e.m33 * t.m32 + e.m34 * t.m42, f = e.m31 * t.m13 + e.m32 * t.m23 + e.m33 * t.m33 + e.m34 * t.m43, y = e.m31 * t.m14 + e.m32 * t.m24 + e.m33 * t.m34 + e.m34 * t.m44, m = e.m41 * t.m11 + e.m42 * t.m21 + e.m43 * t.m31 + e.m44 * t.m41, x = e.m41 * t.m12 + e.m42 * t.m22 + e.m43 * t.m32 + e.m44 * t.m42, p = e.m41 * t.m13 + e.m42 * t.m23 + e.m43 * t.m33 + e.m44 * t.m43, b = e.m41 * t.m14 + e.m42 * t.m24 + e.m43 * t.m34 + e.m44 * t.m44;
  return ee([
    r,
    o,
    n,
    s,
    i,
    l,
    c,
    a,
    u,
    h,
    f,
    y,
    m,
    x,
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
    return typeof e == "string" && e.length && e !== "none" ? Qe(e) : Array.isArray(e) || e instanceof Float64Array || e instanceof Float32Array ? ee(e) : typeof e == "object" ? Oe(e) : this;
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
    return Float32Array.from(de(this, e));
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
    return Float64Array.from(de(this, e));
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
    return D(this, e);
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
  translate(e, r, o) {
    const n = e;
    let s = r, i = o;
    return typeof s > "u" && (s = 0), typeof i > "u" && (i = 0), D(this, Ze(n, s, i));
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
  scale(e, r, o) {
    const n = e;
    let s = r, i = o;
    return typeof s > "u" && (s = e), typeof i > "u" && (i = 1), D(this, He(n, s, i));
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
  rotate(e, r, o) {
    let n = e, s = r || 0, i = o || 0;
    return typeof e == "number" && typeof r > "u" && typeof o > "u" && (i = n, n = 0, s = 0), D(this, De(n, s, i));
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
  rotateAxisAngle(e, r, o, n) {
    if ([e, r, o, n].some((s) => Number.isNaN(+s)))
      throw new TypeError("CSSMatrix: expecting 4 values");
    return D(this, Be(e, r, o, n));
  }
  /**
   * Specifies a skew transformation along the `x-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param angle The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skewX(e) {
    return D(this, Fe(e));
  }
  /**
   * Specifies a skew transformation along the `y-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param angle The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skewY(e) {
    return D(this, Ue(e));
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
    return D(this, ae(e, r));
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
    const r = this.m11 * e.x + this.m21 * e.y + this.m31 * e.z + this.m41 * e.w, o = this.m12 * e.x + this.m22 * e.y + this.m32 * e.z + this.m42 * e.w, n = this.m13 * e.x + this.m23 * e.y + this.m33 * e.z + this.m43 * e.w, s = this.m14 * e.x + this.m24 * e.y + this.m34 * e.z + this.m44 * e.w;
    return e instanceof DOMPoint ? new DOMPoint(r, o, n, s) : {
      x: r,
      y: o,
      z: n,
      w: s
    };
  }
}
k(P, "Translate", Ze), k(P, "Rotate", De), k(P, "RotateAxisAngle", Be), k(P, "Scale", He), k(P, "SkewX", Fe), k(P, "SkewY", Ue), k(P, "Skew", ae), k(P, "Multiply", D), k(P, "fromArray", ee), k(P, "fromMatrix", Oe), k(P, "fromString", Qe), k(P, "toArray", de), k(P, "isCompatibleArray", Re), k(P, "isCompatibleObject", _e);
const B = (t, e, r) => {
  const [o, n] = t, [s, i] = e;
  return [o + (s - o) * r, n + (i - n) * r];
}, we = (t, e) => Math.sqrt(
  (t[0] - e[0]) * (t[0] - e[0]) + (t[1] - e[1]) * (t[1] - e[1])
), Y = (t, e, r, o) => we([t, e], [r, o]), Le = (t, e, r, o, n) => {
  let s = { x: t, y: e };
  if (typeof n == "number") {
    const i = we([t, e], [r, o]);
    if (n <= 0)
      s = { x: t, y: e };
    else if (n >= i)
      s = { x: r, y: o };
    else {
      const [l, c] = B([t, e], [r, o], n / i);
      s = { x: l, y: c };
    }
  }
  return s;
}, ge = (t, e, r, o) => {
  const { min: n, max: s } = Math;
  return [n(t, r), n(e, o), s(t, r), s(e, o)];
}, Zt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getLineBBox: ge,
  getLineLength: Y,
  getPointAtLineLength: Le
}, Symbol.toStringTag, { value: "Module" })), Ne = (t, e, r) => {
  const o = r / 2, n = Math.sin(o), s = Math.cos(o), i = t ** 2 * n ** 2, l = e ** 2 * s ** 2, c = Math.sqrt(i + l) * r;
  return Math.abs(c);
}, U = (t, e, r, o, n, s) => {
  const { sin: i, cos: l } = Math, c = l(n), a = i(n), u = r * l(s), h = o * i(s);
  return [t + c * u - a * h, e + a * u + c * h];
}, pe = (t, e) => {
  const { x: r, y: o } = t, { x: n, y: s } = e, i = r * n + o * s, l = Math.sqrt((r ** 2 + o ** 2) * (n ** 2 + s ** 2));
  return (r * s - o * n < 0 ? -1 : 1) * Math.acos(i / l);
}, me = (t, e, r, o, n, s, i, l, c) => {
  const { abs: a, sin: u, cos: h, sqrt: f, PI: y } = Math;
  let m = a(r), x = a(o);
  const b = (n % 360 + 360) % 360 * (y / 180);
  if (t === l && e === c)
    return {
      rx: m,
      ry: x,
      startAngle: 0,
      endAngle: 0,
      center: { x: l, y: c }
    };
  if (m === 0 || x === 0)
    return {
      rx: m,
      ry: x,
      startAngle: 0,
      endAngle: 0,
      center: { x: (l + t) / 2, y: (c + e) / 2 }
    };
  const M = (t - l) / 2, d = (e - c) / 2, g = {
    x: h(b) * M + u(b) * d,
    y: -u(b) * M + h(b) * d
  }, A = g.x ** 2 / m ** 2 + g.y ** 2 / x ** 2;
  A > 1 && (m *= f(A), x *= f(A));
  const S = m ** 2 * x ** 2 - m ** 2 * g.y ** 2 - x ** 2 * g.x ** 2, v = m ** 2 * g.y ** 2 + x ** 2 * g.x ** 2;
  let q = S / v;
  q = q < 0 ? 0 : q;
  const N = (s !== i ? 1 : -1) * f(q), w = {
    x: N * (m * g.y / x),
    y: N * (-(x * g.x) / m)
  }, V = {
    x: h(b) * w.x - u(b) * w.y + (t + l) / 2,
    y: u(b) * w.x + h(b) * w.y + (e + c) / 2
  }, H = {
    x: (g.x - w.x) / m,
    y: (g.y - w.y) / x
  }, z = pe({ x: 1, y: 0 }, H), C = {
    x: (-g.x - w.x) / m,
    y: (-g.y - w.y) / x
  };
  let j = pe(H, C);
  !i && j > 0 ? j -= 2 * y : i && j < 0 && (j += 2 * y), j %= 2 * y;
  const R = z + j;
  return {
    center: V,
    startAngle: z,
    endAngle: R,
    rx: m,
    ry: x
  };
}, Te = (t, e, r, o, n, s, i, l, c) => {
  const { rx: a, ry: u, startAngle: h, endAngle: f } = me(
    t,
    e,
    r,
    o,
    n,
    s,
    i,
    l,
    c
  );
  return Ne(a, u, f - h);
}, Ge = (t, e, r, o, n, s, i, l, c, a) => {
  let u = { x: t, y: e };
  const { center: h, rx: f, ry: y, startAngle: m, endAngle: x } = me(
    t,
    e,
    r,
    o,
    n,
    s,
    i,
    l,
    c
  );
  if (typeof a == "number") {
    const p = Ne(f, y, x - m);
    if (a <= 0)
      u = { x: t, y: e };
    else if (a >= p)
      u = { x: l, y: c };
    else {
      if (t === l && e === c)
        return { x: l, y: c };
      if (f === 0 || y === 0)
        return Le(t, e, l, c, a);
      const { PI: b, cos: M, sin: d } = Math, g = x - m, S = (n % 360 + 360) % 360 * (b / 180), v = m + g * (a / p), q = f * M(v), N = y * d(v);
      u = {
        x: M(S) * q - d(S) * N + h.x,
        y: d(S) * q + M(S) * N + h.y
      };
    }
  }
  return u;
}, Je = (t, e, r, o, n, s, i, l, c) => {
  const { center: a, rx: u, ry: h, startAngle: f, endAngle: y } = me(
    t,
    e,
    r,
    o,
    n,
    s,
    i,
    l,
    c
  ), m = y - f, { min: x, max: p, tan: b, atan2: M, PI: d } = Math, { x: g, y: A } = a, S = n * d / 180, v = b(S), q = M(-h * v, u), N = q, w = q + d, V = M(h, u * v), H = V + d, z = [l], C = [c];
  let j = x(t, l), R = p(t, l), E = x(e, c), Z = p(e, c);
  const K = y - m * 1e-5, F = U(g, A, u, h, S, K), L = y - m * 0.99999, I = U(g, A, u, h, S, L);
  if (F[0] > R || I[0] > R) {
    const T = U(g, A, u, h, S, N);
    z.push(T[0]), C.push(T[1]);
  }
  if (F[0] < j || I[0] < j) {
    const T = U(g, A, u, h, S, w);
    z.push(T[0]), C.push(T[1]);
  }
  if (F[1] < E || I[1] < E) {
    const T = U(g, A, u, h, S, H);
    z.push(T[0]), C.push(T[1]);
  }
  if (F[1] > Z || I[1] > Z) {
    const T = U(g, A, u, h, S, V);
    z.push(T[0]), C.push(T[1]);
  }
  return j = x.apply([], z), E = x.apply([], C), R = p.apply([], z), Z = p.apply([], C), [j, E, R, Z];
}, Dt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  angleBetween: pe,
  arcLength: Ne,
  arcPoint: U,
  getArcBBox: Je,
  getArcLength: Te,
  getArcProps: me,
  getPointAtArcLength: Ge
}, Symbol.toStringTag, { value: "Module" })), be = [
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
], Ke = [
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
], We = (t) => {
  const e = [];
  for (let r = t, o = r.length, n = o - 1; o > 1; o -= 1, n -= 1) {
    const s = [];
    for (let i = 0; i < n; i += 1)
      s.push({
        x: n * (r[i + 1].x - r[i].x),
        y: n * (r[i + 1].y - r[i].y),
        t: 0
      });
    e.push(s), r = s;
  }
  return e;
}, Xe = (t, e) => {
  if (e === 0)
    return t[0].t = 0, t[0];
  const r = t.length - 1;
  if (e === 1)
    return t[r].t = 1, t[r];
  const o = 1 - e;
  let n = t;
  if (r === 0)
    return t[0].t = e, t[0];
  if (r === 1)
    return {
      x: o * n[0].x + e * n[1].x,
      y: o * n[0].y + e * n[1].y,
      t: e
    };
  const s = o * o, i = e * e;
  let l = 0, c = 0, a = 0, u = 0;
  return r === 2 ? (n = [n[0], n[1], n[2], { x: 0, y: 0 }], l = s, c = o * e * 2, a = i) : r === 3 && (l = s * o, c = s * e * 3, a = o * i * 3, u = e * i), {
    x: l * n[0].x + c * n[1].x + a * n[2].x + u * n[3].x,
    y: l * n[0].y + c * n[1].y + a * n[2].y + u * n[3].y,
    t: e
  };
}, Ye = (t, e) => {
  const r = t(e), o = r.x * r.x + r.y * r.y;
  return Math.sqrt(o);
}, et = (t) => {
  const r = be.length;
  let o = 0;
  for (let n = 0, s; n < r; n++)
    s = 0.5 * be[n] + 0.5, o += Ke[n] * Ye(t, s);
  return 0.5 * o;
}, te = (t) => {
  const e = [];
  for (let o = 0, n = t.length, s = 2; o < n; o += s)
    e.push({
      x: t[o],
      y: t[o + 1]
    });
  const r = We(e);
  return et((o) => Xe(r[0], o));
}, tt = 1e-8, se = ([t, e, r]) => {
  const o = Math.min(t, r), n = Math.max(t, r);
  if (e >= t ? r >= e : r <= e)
    return [o, n];
  const s = (t * r - e * e) / (t - 2 * e + r);
  return s < o ? [s, n] : [o, s];
}, Me = ([t, e, r, o]) => {
  const n = t - 3 * e + 3 * r - o;
  if (Math.abs(n) < tt)
    return t === o && t === e ? [t, o] : se([t, -0.5 * t + 1.5 * e, t - 3 * e + 3 * r]);
  const s = -t * r + t * o - e * r - e * o + e * e + r * r;
  if (s <= 0)
    return [Math.min(t, o), Math.max(t, o)];
  const i = Math.sqrt(s);
  let l = Math.min(t, o), c = Math.max(t, o);
  const a = t - 2 * e + r;
  for (let u = (a + i) / n, h = 1; h <= 2; u = (a - i) / n, h++)
    if (u > 0 && u < 1) {
      const f = t * (1 - u) * (1 - u) * (1 - u) + e * 3 * (1 - u) * (1 - u) * u + r * 3 * (1 - u) * u * u + o * u * u * u;
      f < l && (l = f), f > c && (c = f);
    }
  return [l, c];
}, Bt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CBEZIER_MINMAX_EPSILON: tt,
  Cvalues: Ke,
  Tvalues: be,
  bezierLength: et,
  calculateBezier: Ye,
  computeBezier: Xe,
  deriveBezier: We,
  getBezierLength: te,
  minmaxC: Me,
  minmaxQ: se
}, Symbol.toStringTag, { value: "Module" })), nt = ([t, e, r, o, n, s, i, l], c) => {
  const a = 1 - c;
  return {
    x: a ** 3 * t + 3 * a ** 2 * c * r + 3 * a * c ** 2 * n + c ** 3 * i,
    y: a ** 3 * e + 3 * a ** 2 * c * o + 3 * a * c ** 2 * s + c ** 3 * l
  };
}, ie = (t, e, r, o, n, s, i, l) => te([t, e, r, o, n, s, i, l]), rt = (t, e, r, o, n, s, i, l, c) => {
  const a = typeof c == "number";
  let u = { x: t, y: e };
  if (a) {
    const h = te([t, e, r, o, n, s, i, l]);
    c <= 0 || (c >= h ? u = { x: i, y: l } : u = nt(
      [t, e, r, o, n, s, i, l],
      c / h
    ));
  }
  return u;
}, Ae = (t, e, r, o, n, s, i, l) => {
  const c = Me([t, r, n, i]), a = Me([e, o, s, l]);
  return [c[0], a[0], c[1], a[1]];
}, Ht = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getCubicBBox: Ae,
  getCubicLength: ie,
  getPointAtCubicLength: rt,
  getPointAtCubicSegmentLength: nt
}, Symbol.toStringTag, { value: "Module" })), ot = ([t, e, r, o, n, s], i) => {
  const l = 1 - i;
  return {
    x: l ** 2 * t + 2 * l * i * r + i ** 2 * n,
    y: l ** 2 * e + 2 * l * i * o + i ** 2 * s
  };
}, ce = (t, e, r, o, n, s) => te([t, e, r, o, n, s]), st = (t, e, r, o, n, s, i) => {
  const l = typeof i == "number";
  let c = { x: t, y: e };
  if (l) {
    const a = te([t, e, r, o, n, s]);
    i <= 0 || (i >= a ? c = { x: n, y: s } : c = ot(
      [t, e, r, o, n, s],
      i / a
    ));
  }
  return c;
}, Ce = (t, e, r, o, n, s) => {
  const i = se([t, r, n]), l = se([e, o, s]);
  return [i[0], l[0], i[1], l[1]];
}, Ft = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getPointAtQuadLength: st,
  getPointAtQuadSegmentLength: ot,
  getQuadBBox: Ce,
  getQuadLength: ce
}, Symbol.toStringTag, { value: "Module" })), dt = (t) => {
  const e = t.length;
  let r = -1, o, n = t[e - 1], s = 0;
  for (; ++r < e; )
    o = n, n = t[r], s += o[1] * n[0] - o[0] * n[1];
  return s / 2;
}, gt = (t) => t.reduce((e, r, o) => o ? e + we(t[o - 1], r) : 0, 0), Ut = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  polygonArea: dt,
  polygonLength: gt
}, Symbol.toStringTag, { value: "Module" })), W = {
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
}, ke = (t) => {
  let e = t.pathValue[t.segmentStart], r = e.toLowerCase();
  const { data: o } = t;
  for (; o.length >= W[r] && (r === "m" && o.length > 2 ? (t.segments.push(
    [e].concat(
      o.splice(0, 2)
    )
  ), r = "l", e = e === "m" ? "l" : "L") : t.segments.push(
    [e].concat(
      o.splice(0, W[r])
    )
  ), !!W[r]); )
    ;
}, _ = "SVGPathCommander Error", pt = (t) => {
  const { index: e, pathValue: r } = t, o = r.charCodeAt(e);
  if (o === 48) {
    t.param = 0, t.index += 1;
    return;
  }
  if (o === 49) {
    t.param = 1, t.index += 1;
    return;
  }
  t.err = `${_}: invalid Arc flag "${r[e]}", expecting 0 or 1 at index ${e}`;
}, G = (t) => t >= 48 && t <= 57, J = "Invalid path value", bt = (t) => {
  const { max: e, pathValue: r, index: o } = t;
  let n = o, s = !1, i = !1, l = !1, c = !1, a;
  if (n >= e) {
    t.err = `${_}: ${J} at index ${n}, "pathValue" is missing param`;
    return;
  }
  if (a = r.charCodeAt(n), (a === 43 || a === 45) && (n += 1, a = r.charCodeAt(n)), !G(a) && a !== 46) {
    t.err = `${_}: ${J} at index ${n}, "${r[n]}" is not a number`;
    return;
  }
  if (a !== 46) {
    if (s = a === 48, n += 1, a = r.charCodeAt(n), s && n < e && a && G(a)) {
      t.err = `${_}: ${J} at index ${o}, "${r[o]}" illegal number`;
      return;
    }
    for (; n < e && G(r.charCodeAt(n)); )
      n += 1, i = !0;
    a = r.charCodeAt(n);
  }
  if (a === 46) {
    for (c = !0, n += 1; G(r.charCodeAt(n)); )
      n += 1, l = !0;
    a = r.charCodeAt(n);
  }
  if (a === 101 || a === 69) {
    if (c && !i && !l) {
      t.err = `${_}: ${J} at index ${n}, "${r[n]}" invalid float exponent`;
      return;
    }
    if (n += 1, a = r.charCodeAt(n), (a === 43 || a === 45) && (n += 1), n < e && G(r.charCodeAt(n)))
      for (; n < e && G(r.charCodeAt(n)); )
        n += 1;
    else {
      t.err = `${_}: ${J} at index ${n}, "${r[n]}" invalid integer exponent`;
      return;
    }
  }
  t.index = n, t.param = +t.pathValue.slice(o, n);
}, Mt = (t) => [
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
].includes(t), X = (t) => {
  const { pathValue: e, max: r } = t;
  for (; t.index < r && Mt(e.charCodeAt(t.index)); )
    t.index += 1;
}, At = (t) => {
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
}, Ct = (t) => G(t) || t === 43 || t === 45 || t === 46, St = (t) => (t | 32) === 97, Pt = (t) => {
  switch (t | 32) {
    case 109:
    case 77:
      return !0;
    default:
      return !1;
  }
}, it = (t) => {
  var c;
  const { max: e, pathValue: r, index: o, segments: n } = t, s = r.charCodeAt(o), i = W[r[o].toLowerCase()];
  if (t.segmentStart = o, !At(s)) {
    t.err = `${_}: ${J} "${r[o]}" is not a path command at index ${o}`;
    return;
  }
  const l = n[n.length - 1];
  if (!Pt(s) && ((c = l == null ? void 0 : l[0]) == null ? void 0 : c.toLocaleLowerCase()) === "z") {
    t.err = `${_}: ${J} "${r[o]}" is not a MoveTo path command at index ${o}`;
    return;
  }
  if (t.index += 1, X(t), t.data = [], !i) {
    ke(t);
    return;
  }
  for (; ; ) {
    for (let a = i; a > 0; a -= 1) {
      if (St(s) && (a === 3 || a === 4) ? pt(t) : bt(t), t.err.length)
        return;
      t.data.push(t.param), X(t), t.index < e && r.charCodeAt(t.index) === 44 && (t.index += 1, X(t));
    }
    if (t.index >= t.max || !Ct(r.charCodeAt(t.index)))
      break;
  }
  ke(t);
};
class ct {
  constructor(e) {
    this.segments = [], this.pathValue = e, this.max = e.length, this.index = 0, this.param = 0, this.segmentStart = 0, this.data = [], this.err = "";
  }
}
const Q = (t) => {
  if (typeof t != "string")
    return t.slice(0);
  const e = new ct(t);
  for (X(e); e.index < e.max && !e.err.length; )
    it(e);
  if (!e.err.length)
    e.segments.length && (e.segments[0][0] = "M");
  else
    throw TypeError(e.err);
  return e.segments;
}, ue = (t, e, r, o) => {
  const [n] = t, s = n.toUpperCase();
  if (e === 0 || s === n) return t;
  if (s === "A")
    return [
      s,
      t[1],
      t[2],
      t[3],
      t[4],
      t[5],
      t[6] + r,
      t[7] + o
    ];
  if (s === "V")
    return [s, t[1] + o];
  if (s === "H")
    return [s, t[1] + r];
  if (s === "L")
    return [
      s,
      t[1] + r,
      t[2] + o
    ];
  {
    const l = [], c = t.length;
    for (let a = 1; a < c; a += 1)
      l.push(t[a] + (a % 2 ? r : o));
    return [s].concat(l);
  }
}, O = (t, e) => {
  let r = t.length, o, n = "M", s = "M", i = !1, l = 0, c = 0, a = 0, u = 0, h = 0;
  for (let f = 0; f < r; f += 1) {
    o = t[f], [n] = o, h = o.length, s = n.toUpperCase(), i = s !== n;
    const y = e(o, f, l, c);
    if (y === !1)
      break;
    s === "Z" ? (l = a, c = u) : s === "H" ? l = o[1] + (i ? l : 0) : s === "V" ? c = o[1] + (i ? c : 0) : (l = o[h - 2] + (i ? l : 0), c = o[h - 1] + (i ? c : 0), s === "M" && (a = l, u = c)), y && (t[f] = y, y[0] === "C" && (r = t.length));
  }
  return t;
}, lt = (t) => {
  const e = Q(t);
  return O(e, ue);
}, at = (t, e, r, o) => {
  const [n] = t, s = n.toLowerCase();
  if (e === 0 || n === s) return t;
  if (s === "a")
    return [
      s,
      t[1],
      t[2],
      t[3],
      t[4],
      t[5],
      t[6] - r,
      t[7] - o
    ];
  if (s === "v")
    return [s, t[1] - o];
  if (s === "h")
    return [s, t[1] - r];
  if (s === "l")
    return [
      s,
      t[1] - r,
      t[2] - o
    ];
  {
    const l = [], c = t.length;
    for (let a = 1; a < c; a += 1)
      l.push(t[a] - (a % 2 ? r : o));
    return [s].concat(l);
  }
}, Gt = (t) => {
  const e = Q(t);
  return O(e, at);
}, re = (t, e, r) => {
  const { sin: o, cos: n } = Math, s = t * n(r) - e * o(r), i = t * o(r) + e * n(r);
  return { x: s, y: i };
}, ve = (t, e, r, o, n, s, i, l, c, a) => {
  let u = t, h = e, f = r, y = o, m = l, x = c;
  const p = Math.PI * 120 / 180, b = Math.PI / 180 * (+n || 0);
  let M = [], d, g, A, S, v;
  if (a)
    [g, A, S, v] = a;
  else {
    d = re(u, h, -b), u = d.x, h = d.y, d = re(m, x, -b), m = d.x, x = d.y;
    const L = (u - m) / 2, I = (h - x) / 2;
    let T = L * L / (f * f) + I * I / (y * y);
    T > 1 && (T = Math.sqrt(T), f *= T, y *= T);
    const fe = f * f, ye = y * y, Ie = (s === i ? -1 : 1) * Math.sqrt(
      Math.abs(
        (fe * ye - fe * I * I - ye * L * L) / (fe * I * I + ye * L * L)
      )
    );
    S = Ie * f * I / y + (u + m) / 2, v = Ie * -y * L / f + (h + x) / 2, g = Math.asin(((h - v) / y * 10 ** 9 >> 0) / 10 ** 9), A = Math.asin(((x - v) / y * 10 ** 9 >> 0) / 10 ** 9), g = u < S ? Math.PI - g : g, A = m < S ? Math.PI - A : A, g < 0 && (g = Math.PI * 2 + g), A < 0 && (A = Math.PI * 2 + A), i && g > A && (g -= Math.PI * 2), !i && A > g && (A -= Math.PI * 2);
  }
  let q = A - g;
  if (Math.abs(q) > p) {
    const L = A, I = m, T = x;
    A = g + p * (i && A > g ? 1 : -1), m = S + f * Math.cos(A), x = v + y * Math.sin(A), M = ve(m, x, f, y, n, 0, i, I, T, [
      A,
      L,
      S,
      v
    ]);
  }
  q = A - g;
  const N = Math.cos(g), w = Math.sin(g), V = Math.cos(A), H = Math.sin(A), z = Math.tan(q / 4), C = 4 / 3 * f * z, j = 4 / 3 * y * z, R = [u, h], E = [u + C * w, h - j * N], Z = [m + C * H, x - j * V], K = [m, x];
  if (E[0] = 2 * R[0] - E[0], E[1] = 2 * R[1] - E[1], a)
    return [E[0], E[1], Z[0], Z[1], K[0], K[1]].concat(M);
  M = [E[0], E[1], Z[0], Z[1], K[0], K[1]].concat(M);
  const F = [];
  for (let L = 0, I = M.length; L < I; L += 1)
    F[L] = L % 2 ? re(M[L - 1], M[L], b).y : re(M[L], M[L + 1], b).x;
  return F;
}, wt = (t, e, r, o, n, s) => {
  const i = 0.3333333333333333, l = 2 / 3;
  return [
    i * t + l * r,
    // cpx1
    i * e + l * o,
    // cpy1
    i * n + l * r,
    // cpx2
    i * s + l * o,
    // cpy2
    n,
    s
    // x,y
  ];
}, Ee = (t, e, r, o) => {
  const n = B([t, e], [r, o], 0.3333333333333333), s = B([t, e], [r, o], 2 / 3);
  return [n[0], n[1], s[0], s[1], r, o];
}, Lt = (t, e) => {
  const [r] = t, o = t.slice(1).map(Number), [n, s] = o, { x1: i, y1: l, x: c, y: a } = e;
  return "TQ".includes(r) || (e.qx = null, e.qy = null), r === "M" ? (e.x = n, e.y = s, t) : r === "A" ? ["C"].concat(
    ve(
      i,
      l,
      o[0],
      o[1],
      o[2],
      o[3],
      o[4],
      o[5],
      o[6]
    )
  ) : r === "Q" ? (e.qx = n, e.qy = s, ["C"].concat(
    wt(i, l, o[0], o[1], o[2], o[3])
  )) : r === "L" ? ["C"].concat(
    Ee(i, l, n, s)
  ) : r === "Z" ? ["C"].concat(
    Ee(i, l, c, a)
  ) : t;
}, $e = (t, e) => {
  const [r] = t, o = r.toUpperCase(), n = r !== o, { x1: s, y1: i, x2: l, y2: c, x: a, y: u } = e, h = t.slice(1);
  let f = h.map((y, m) => y + (n ? m % 2 ? u : a : 0));
  if ("TQ".includes(o) || (e.qx = null, e.qy = null), o === "A")
    return f = h.slice(0, -2).concat(
      h[5] + (n ? a : 0),
      h[6] + (n ? u : 0)
    ), ["A"].concat(f);
  if (o === "H")
    return [
      "L",
      t[1] + (n ? a : 0),
      i
    ];
  if (o === "V")
    return [
      "L",
      s,
      t[1] + (n ? u : 0)
    ];
  if (o === "L")
    return [
      "L",
      t[1] + (n ? a : 0),
      t[2] + (n ? u : 0)
    ];
  if (o === "M")
    return [
      "M",
      t[1] + (n ? a : 0),
      t[2] + (n ? u : 0)
    ];
  if (o === "C")
    return ["C"].concat(f);
  if (o === "S") {
    const y = s * 2 - l, m = i * 2 - c;
    return e.x1 = y, e.y1 = m, ["C", y, m].concat(f);
  } else if (o === "T") {
    const y = s * 2 - (e.qx ? e.qx : (
      /* istanbul ignore next */
      0
    )), m = i * 2 - (e.qy ? e.qy : (
      /* istanbul ignore next */
      0
    ));
    return e.qx = y, e.qy = m, ["Q", y, m].concat(f);
  } else if (o === "Q") {
    const [y, m] = f;
    return e.qx = y, e.qy = m, ["Q"].concat(f);
  } else if (o === "Z")
    return ["Z"];
  return t;
}, he = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  x: 0,
  y: 0,
  qx: null,
  qy: null
}, mt = (t) => {
  const e = { ...he }, r = Q(t);
  return O(r, (o, n, s, i) => {
    e.x = s, e.y = i;
    const l = $e(o, e);
    let c = Lt(l, e);
    c[0] === "C" && c.length > 7 && (r.splice(
      n + 1,
      0,
      ["C"].concat(c.slice(7))
    ), c = c.slice(0, 7));
    const u = c.length;
    return e.x1 = +c[u - 2], e.y1 = +c[u - 1], e.x2 = +c[u - 4] || e.x1, e.y2 = +c[u - 3] || e.y1, c;
  });
}, ne = {
  origin: [0, 0, 0],
  round: 4
}, $ = (t, e) => {
  const r = e >= 1 ? 10 ** e : 1;
  return e > 0 ? Math.round(t * r) / r : Math.round(t);
}, Nt = (t, e) => {
  const r = t.length;
  let { round: o } = ne, n = t[0], s = "";
  o = e === "off" || typeof e == "number" && e >= 0 ? e : typeof o == "number" && o >= 0 ? o : (
    /* istanbul ignore next @preserve */
    "off"
  );
  for (let i = 0; i < r; i += 1) {
    n = t[i];
    const [l] = n, c = n.slice(1);
    if (s += l, o === "off")
      s += c.join(" ");
    else {
      let a = 0;
      const u = c.length;
      for (; a < u; )
        s += $(c[a], o), a !== u - 1 && (s += " "), a += 1;
    }
  }
  return s;
}, Se = 1e-5, qe = (t) => {
  const e = Q(t), r = { ...he };
  return O(e, (o, n, s, i) => {
    r.x = s, r.y = i;
    const l = $e(o, r), c = l.length;
    return r.x1 = +l[c - 2], r.y1 = +l[c - 1], r.x2 = +l[c - 4] || r.x1, r.y2 = +l[c - 3] || r.y1, l;
  });
}, xe = (t, e) => {
  const r = qe(t);
  let o = !1, n = [], s = "M", i = 0, l = 0, [c, a] = r[0].slice(1);
  const u = typeof e == "number";
  let h = { x: c, y: a }, f = 0, y = h, m = 0;
  return !u || e < Se ? h : (O(r, (x, p, b, M) => {
    if ([s] = x, o = s === "M", n = o ? n : [b, M].concat(x.slice(1)), o ? ([, c, a] = x, h = { x: c, y: a }, f = 0) : s === "L" ? (h = Le(
      n[0],
      n[1],
      n[2],
      n[3],
      e - m
    ), f = Y(n[0], n[1], n[2], n[3])) : s === "A" ? (h = Ge(
      n[0],
      n[1],
      n[2],
      n[3],
      n[4],
      n[5],
      n[6],
      n[7],
      n[8],
      e - m
    ), f = Te(
      n[0],
      n[1],
      n[2],
      n[3],
      n[4],
      n[5],
      n[6],
      n[7],
      n[8]
    )) : s === "C" ? (h = rt(
      n[0],
      n[1],
      n[2],
      n[3],
      n[4],
      n[5],
      n[6],
      n[7],
      e - m
    ), f = ie(
      n[0],
      n[1],
      n[2],
      n[3],
      n[4],
      n[5],
      n[6],
      n[7]
    )) : s === "Q" ? (h = st(
      n[0],
      n[1],
      n[2],
      n[3],
      n[4],
      n[5],
      e - m
    ), f = ce(
      n[0],
      n[1],
      n[2],
      n[3],
      n[4],
      n[5]
    )) : s === "Z" && (n = [b, M, c, a], h = { x: c, y: a }, f = Y(n[0], n[1], n[2], n[3])), [i, l] = n.slice(-2), m < e)
      y = h;
    else
      return !1;
    m += f;
  }), e > m - Se ? { x: i, y: l } : y);
}, oe = (t) => {
  const e = Q(t);
  let r = 0, o = 0, n = 0, s = 0, i = 0, l = 0, c = "M", a = 0, u = 0, h = 0;
  return O(e, (f, y, m, x) => {
    [c] = f;
    const p = c.toUpperCase(), M = p !== c ? ue(f, y, m, x) : f.slice(0), d = p === "V" ? ["L", m, M[1]] : p === "H" ? ["L", M[1], x] : M;
    if ([c] = d, "TQ".includes(p) || (i = 0, l = 0), c === "M")
      [, a, u] = d;
    else if (c === "L")
      h += Y(
        m,
        x,
        d[1],
        d[2]
      );
    else if (c === "A")
      h += Te(
        m,
        x,
        d[1],
        d[2],
        d[3],
        d[4],
        d[5],
        d[6],
        d[7]
      );
    else if (c === "S") {
      const g = r * 2 - n, A = o * 2 - s;
      h += ie(
        m,
        x,
        g,
        A,
        d[1],
        d[2],
        d[3],
        d[4]
      );
    } else c === "C" ? h += ie(
      m,
      x,
      d[1],
      d[2],
      d[3],
      d[4],
      d[5],
      d[6]
    ) : c === "T" ? (i = r * 2 - i, l = o * 2 - l, h += ce(
      m,
      x,
      i,
      l,
      d[1],
      d[2]
    )) : c === "Q" ? (i = d[1], l = d[2], h += ce(
      m,
      x,
      d[1],
      d[2],
      d[3],
      d[4]
    )) : c === "Z" && (h += Y(m, x, a, u));
    [r, o] = c === "Z" ? [a, u] : d.slice(-2), [n, s] = c === "C" ? [d[3], d[4]] : c === "S" ? [d[1], d[2]] : [r, o];
  }), h;
}, ut = (t, e) => {
  const r = Q(t);
  let o = r.slice(0), n = oe(o), s = o.length - 1, i = 0, l = 0, c = r[0];
  if (s <= 0 || !e || !Number.isFinite(e))
    return {
      segment: c,
      index: 0,
      length: l,
      lengthAtSegment: i
    };
  if (e >= n)
    return o = r.slice(0, -1), i = oe(o), l = n - i, c = r[s], {
      segment: c,
      index: s,
      length: l,
      lengthAtSegment: i
    };
  const a = [];
  for (; s > 0; )
    c = o[s], o = o.slice(0, -1), i = oe(o), l = n - i, n = i, a.push({
      segment: c,
      index: s,
      length: l,
      lengthAtSegment: i
    }), s -= 1;
  return a.find(
    ({ lengthAtSegment: u }) => u <= e
  );
}, ze = (t, e) => {
  const r = Q(t), o = qe(r), n = oe(o), s = (g) => {
    const A = g.x - e.x, S = g.y - e.y;
    return A * A + S * S;
  };
  let i = 8, l, c = { x: 0, y: 0 }, a = 0, u = 0, h = 1 / 0;
  for (let g = 0; g <= n; g += i)
    l = xe(o, g), a = s(l), a < h && (c = l, u = g, h = a);
  i /= 2;
  let f, y, m = 0, x = 0, p = 0, b = 0;
  for (; i > 1e-6 && (m = u - i, f = xe(o, m), p = s(f), x = u + i, y = xe(o, x), b = s(y), m >= 0 && p < h ? (c = f, u = m, h = p) : x <= n && b < h ? (c = y, u = x, h = b) : i /= 2, !(i < 1e-5)); )
    ;
  const M = ut(r, u), d = Math.sqrt(h);
  return { closest: c, distance: d, segment: M };
}, Jt = (t, e) => ze(t, e).closest, Tt = (t, e, r, o, n, s, i, l) => 3 * ((l - e) * (r + n) - (i - t) * (o + s) + o * (t - n) - r * (e - s) + l * (n + t / 3) - i * (s + e / 3)) / 20, vt = (t) => {
  let e = 0, r = 0, o = 0;
  return mt(t).map((n) => {
    switch (n[0]) {
      case "M":
        return [, e, r] = n, 0;
      default:
        return o = Tt(
          e,
          r,
          n[1],
          n[2],
          n[3],
          n[4],
          n[5],
          n[6]
        ), [e, r] = n.slice(-2), o;
    }
  }).reduce((n, s) => n + s, 0);
}, Kt = (t) => vt(mt(t)) >= 0, Wt = (t) => {
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
  const e = Q(t);
  let r = "M", o = 0, n = 0;
  const { max: s, min: i } = Math;
  let l = 1 / 0, c = 1 / 0, a = -1 / 0, u = -1 / 0, h = 0, f = 0, y = 0, m = 0, x = 0, p = 0, b = 0, M = 0, d = 0, g = 0;
  O(e, (v, q, N, w) => {
    [r] = v;
    const V = r.toUpperCase(), z = V !== r ? ue(v, q, N, w) : v.slice(0), C = V === "V" ? ["L", N, z[1]] : V === "H" ? ["L", z[1], w] : z;
    if ([r] = C, "TQ".includes(V) || (d = 0, g = 0), r === "M")
      [, o, n] = C, h = o, f = n, y = o, m = n;
    else if (r === "L")
      [h, f, y, m] = ge(
        N,
        w,
        C[1],
        C[2]
      );
    else if (r === "A")
      [h, f, y, m] = Je(
        N,
        w,
        C[1],
        C[2],
        C[3],
        C[4],
        C[5],
        C[6],
        C[7]
      );
    else if (r === "S") {
      const j = x * 2 - b, R = p * 2 - M;
      [h, f, y, m] = Ae(
        N,
        w,
        j,
        R,
        C[1],
        C[2],
        C[3],
        C[4]
      );
    } else r === "C" ? [h, f, y, m] = Ae(
      N,
      w,
      C[1],
      C[2],
      C[3],
      C[4],
      C[5],
      C[6]
    ) : r === "T" ? (d = x * 2 - d, g = p * 2 - g, [h, f, y, m] = Ce(
      N,
      w,
      d,
      g,
      C[1],
      C[2]
    )) : r === "Q" ? (d = C[1], g = C[2], [h, f, y, m] = Ce(
      N,
      w,
      C[1],
      C[2],
      C[3],
      C[4]
    )) : r === "Z" && ([h, f, y, m] = ge(N, w, o, n));
    l = i(h, l), c = i(f, c), a = s(y, a), u = s(m, u), [x, p] = r === "Z" ? [o, n] : C.slice(-2), [b, M] = r === "C" ? [C[3], C[4]] : r === "S" ? [C[1], C[2]] : [x, p];
  });
  const A = a - l, S = u - c;
  return {
    width: A,
    height: S,
    x: l,
    y: c,
    x2: a,
    y2: u,
    cx: l + A / 2,
    cy: c + S / 2,
    // an estimated guess
    cz: Math.max(A, S) + Math.min(A, S) / 2
  };
}, Xt = (t, e) => ut(t, e).segment, Yt = (t, e) => ze(t, e).segment, je = (t) => Array.isArray(t) && t.every((e) => {
  const r = e[0].toLowerCase();
  return W[r] === e.length - 1 && "achlmqstvz".includes(r) && e.slice(1).every(Number.isFinite);
}) && t.length > 0, $t = (t) => je(t) && // `isPathArray` also checks if it's `Array`
t.every(([e]) => e === e.toUpperCase()), qt = (t) => $t(t) && t.every(([e]) => "ACLMQZ".includes(e)), en = (t) => qt(t) && t.every(([e]) => "MC".includes(e)), tn = (t, e) => {
  const { distance: r } = ze(t, e);
  return Math.abs(r) < Se;
}, nn = (t) => je(t) && // `isPathArray` checks if it's `Array`
t.slice(1).every(([e]) => e === e.toLowerCase()), zt = (t) => {
  if (typeof t != "string" || !t.length)
    return !1;
  const e = new ct(t);
  for (X(e); e.index < e.max && !e.err.length; )
    it(e);
  return !e.err.length && "mM".includes(e.segments[0][0]);
}, le = {
  line: ["x1", "y1", "x2", "y2"],
  circle: ["cx", "cy", "r"],
  ellipse: ["cx", "cy", "rx", "ry"],
  rect: ["width", "height", "x", "y", "rx", "ry"],
  polygon: ["points"],
  polyline: ["points"],
  glyph: ["d"]
}, ht = (t) => t != null && typeof t == "object" && t.nodeType === 1, jt = (t) => {
  let { x1: e, y1: r, x2: o, y2: n } = t;
  return [e, r, o, n] = [e, r, o, n].map((s) => +s), [
    ["M", e, r],
    ["L", o, n]
  ];
}, It = (t) => {
  const e = [], r = (t.points || "").trim().split(/[\s|,]/).map((n) => +n);
  let o = 0;
  for (; o < r.length; )
    e.push([o ? "L" : "M", r[o], r[o + 1]]), o += 2;
  return t.type === "polygon" ? [...e, ["z"]] : e;
}, kt = (t) => {
  let { cx: e, cy: r, r: o } = t;
  return [e, r, o] = [e, r, o].map((n) => +n), [
    ["M", e - o, r],
    ["a", o, o, 0, 1, 0, 2 * o, 0],
    ["a", o, o, 0, 1, 0, -2 * o, 0]
  ];
}, Et = (t) => {
  let { cx: e, cy: r } = t, o = t.rx || 0, n = t.ry || o;
  return [e, r, o, n] = [e, r, o, n].map((s) => +s), [
    ["M", e - o, r],
    ["a", o, n, 0, 1, 0, 2 * o, 0],
    ["a", o, n, 0, 1, 0, -2 * o, 0]
  ];
}, Vt = (t) => {
  const e = +t.x || 0, r = +t.y || 0, o = +t.width, n = +t.height;
  let s = +(t.rx || 0), i = +(t.ry || s);
  return s || i ? (s * 2 > o && (s -= (s * 2 - o) / 2), i * 2 > n && (i -= (i * 2 - n) / 2), [
    ["M", e + s, r],
    ["h", o - s * 2],
    ["s", s, 0, s, i],
    ["v", n - i * 2],
    ["s", 0, i, -s, i],
    ["h", -o + s * 2],
    ["s", -s, 0, -s, -i],
    ["v", -n + i * 2],
    ["s", 0, -i, s, -i]
  ]) : [["M", e, r], ["h", o], ["v", n], ["H", e], ["Z"]];
}, Rt = (t) => {
  const e = Object.keys(le), r = ht(t), o = r ? t.tagName : null;
  if (o && [...e, "path"].every((c) => o !== c))
    throw TypeError(`${_}: "${o}" is not SVGElement`);
  const n = r ? o : t.type, s = le[n], i = { type: n };
  r ? s.forEach((c) => {
    i[c] = t.getAttribute(c);
  }) : Object.assign(i, t);
  let l = [];
  return n === "circle" ? l = kt(i) : n === "ellipse" ? l = Et(i) : ["polyline", "polygon"].includes(n) ? l = It(i) : n === "rect" ? l = Vt(i) : n === "line" ? l = jt(i) : ["glyph", "path"].includes(n) && (l = Q(
    r ? t.getAttribute("d") || /* istanbul ignore next @preserve */
    "" : t.d || ""
  )), je(l) && l.length ? l : !1;
}, rn = (t, e, r) => {
  const o = r || document, n = Object.keys(le), s = ht(t), i = s ? t.tagName : null;
  if (i === "path")
    throw TypeError(`${_}: "${i}" is already SVGPathElement`);
  if (i && n.every((m) => i !== m))
    throw TypeError(`${_}: "${i}" is not SVGElement`);
  const l = o.createElementNS("http://www.w3.org/2000/svg", "path"), c = s ? i : t.type, a = le[c], u = { type: c }, h = ne.round, f = Rt(t), y = f && f.length ? Nt(f, h) : "";
  return s ? (a.forEach((m) => {
    u[m] = t.getAttribute(m);
  }), Object.values(t.attributes).forEach(({ name: m, value: x }) => {
    a.includes(m) || l.setAttribute(m, x);
  })) : (Object.assign(u, t), Object.keys(u).forEach((m) => {
    !a.includes(m) && m !== "type" && l.setAttribute(
      m.replace(/[A-Z]/g, (x) => `-${x.toLowerCase()}`),
      u[m]
    );
  })), zt(y) ? (l.setAttribute("d", y), e && s && (t.before(l, t), t.remove()), l) : !1;
}, _t = (t) => {
  let e = new P();
  const { origin: r } = t, [o, n] = r, { translate: s } = t, { rotate: i } = t, { skew: l } = t, { scale: c } = t;
  return Array.isArray(s) && s.length >= 2 && s.every((a) => !Number.isNaN(+a)) && s.some((a) => a !== 0) ? e = e.translate(...s) : typeof s == "number" && !Number.isNaN(s) && (e = e.translate(s)), (i || l || c) && (e = e.translate(o, n), Array.isArray(i) && i.length >= 2 && i.every((a) => !Number.isNaN(+a)) && i.some((a) => a !== 0) ? e = e.rotate(...i) : typeof i == "number" && !Number.isNaN(i) && (e = e.rotate(i)), Array.isArray(l) && l.length === 2 && l.every(
    (a) => !Number.isNaN(+a)
  ) && l.some((a) => a !== 0) ? (e = l[0] ? e.skewX(l[0]) : e, e = l[1] ? e.skewY(l[1]) : e) : typeof l == "number" && !Number.isNaN(l) && (e = e.skewX(l)), Array.isArray(c) && c.length >= 2 && c.every(
    (a) => !Number.isNaN(+a)
  ) && c.some((a) => a !== 1) ? e = e.scale(...c) : typeof c == "number" && !Number.isNaN(c) && (e = e.scale(c)), e = e.translate(-o, -n)), e;
}, Ot = (t, e, r, o) => {
  const [n] = t, { round: s } = ne, i = s, l = e.slice(1), { x1: c, y1: a, x2: u, y2: h, x: f, y } = r, [m, x] = l.slice(-2), p = t;
  if ("TQ".includes(n) || (r.qx = null, r.qy = null), n === "L") {
    if ($(f, i) === $(m, i))
      return ["V", x];
    if ($(y, i) === $(x, i))
      return ["H", m];
  } else if (n === "C") {
    const [b, M] = l;
    if (r.x1 = b, r.y1 = M, "CS".includes(o) && ($(b, i) === $(c * 2 - u, i) && $(M, i) === $(a * 2 - h, i) || $(c, i) === $(u * 2 - f, i) && $(a, i) === $(h * 2 - y, i)))
      return [
        "S",
        l[2],
        l[3],
        l[4],
        l[5]
      ];
  } else if (n === "Q") {
    const [b, M] = l;
    if (r.qx = b, r.qy = M, "QT".includes(o) && $(b, i) === $(c * 2 - u, i) && $(M, i) === $(a * 2 - h, i))
      return ["T", l[2], l[3]];
  }
  return p;
}, Pe = (t, e) => {
  const r = t.slice(1).map(
    (o) => $(o, e)
  );
  return [t[0]].concat(r);
}, on = (t, e) => {
  const r = lt(t), o = typeof e == "number" && e >= 0 ? e : (
    /* istanbul ignore next @preserve */
    2
  ), n = { ...he }, s = [];
  let i = "M", l = "Z";
  return O(r, (c, a, u, h) => {
    n.x = u, n.y = h;
    const f = $e(c, n);
    let y = c;
    if ([i] = c, s[a] = i, a) {
      l = s[a - 1];
      const x = Ot(
        c,
        f,
        n,
        l
      ), p = Pe(x, o), b = p.join(""), M = at(x, a, u, h), d = Pe(M, o), g = d.join("");
      y = b.length < g.length ? p : d;
    }
    const m = f.length;
    return n.x1 = +f[m - 2], n.y1 = +f[m - 1], n.x2 = +f[m - 4] || n.x1, n.y2 = +f[m - 3] || n.y1, y;
  });
}, Qt = (t, e) => {
  let r = P.Translate(e[0], e[1], e[2]);
  return [, , , r.m44] = e, r = t.multiply(r), [r.m41, r.m42, r.m43, r.m44];
}, Ve = (t, e, r) => {
  const [o, n, s] = r, [i, l, c] = Qt(t, [e[0], e[1], 0, 1]), a = i - o, u = l - n, h = c - s;
  return [
    // protect against division by ZERO
    a * (Math.abs(s) / Math.abs(h) || 1) + o,
    u * (Math.abs(s) / Math.abs(h) || 1) + n
  ];
}, sn = (t) => {
  const e = t.slice(1).map(
    (r, o, n) => o ? n[o - 1].slice(-2).concat(r.slice(1)) : t[0].slice(1).concat(r.slice(1))
  ).map((r) => r.map((o, n) => r[r.length - n - 2 * (1 - n % 2)])).reverse();
  return [["M"].concat(e[0].slice(0, 2))].concat(
    e.map((r) => ["C"].concat(r.slice(2)))
  );
}, cn = (t) => {
  const e = lt(t), r = qe(e), o = e.length, n = e[o - 1][0] === "Z", s = O(e, (i, l) => {
    const c = r[l], a = l && e[l - 1], u = a && a[0], h = e[l + 1], f = h && h[0], [y] = i, [m, x] = r[l ? l - 1 : o - 1].slice(-2);
    let p = i;
    switch (y) {
      case "M":
        p = n ? ["Z"] : [y, m, x];
        break;
      case "A":
        p = [
          y,
          i[1],
          i[2],
          i[3],
          i[4],
          i[5] === 1 ? 0 : 1,
          m,
          x
        ];
        break;
      case "C":
        h && f === "S" ? p = ["S", i[1], i[2], m, x] : p = [
          y,
          i[3],
          i[4],
          i[1],
          i[2],
          m,
          x
        ];
        break;
      case "S":
        u && "CS".includes(u) && (!h || f !== "S") ? p = [
          "C",
          c[3],
          c[4],
          c[1],
          c[2],
          m,
          x
        ] : p = [
          y,
          c[1],
          c[2],
          m,
          x
        ];
        break;
      case "Q":
        h && f === "T" ? p = ["T", m, x] : p = [y, i[1], i[2], m, x];
        break;
      case "T":
        u && "QT".includes(u) && (!h || f !== "T") ? p = [
          "Q",
          c[1],
          c[2],
          m,
          x
        ] : p = [y, m, x];
        break;
      case "Z":
        p = ["M", m, x];
        break;
      case "H":
        p = [y, m];
        break;
      case "V":
        p = [y, x];
        break;
      default:
        p = [y].concat(
          i.slice(1, -2),
          m,
          x
        );
    }
    return p;
  });
  return n ? s.reverse() : [s[0]].concat(s.slice(1).reverse());
}, ln = (t, e) => {
  let { round: r } = ne;
  return r = e === "off" || typeof e == "number" && e >= 0 ? e : typeof r == "number" && r >= 0 ? r : (
    /* istanbul ignore next @preserve */
    "off"
  ), r === "off" ? t.slice(0) : O(t, (o) => Pe(o, r));
}, an = (t, e = 0.5) => {
  const r = e, o = t.slice(0, 2), n = t.slice(2, 4), s = t.slice(4, 6), i = t.slice(6, 8), l = B(o, n, r), c = B(n, s, r), a = B(s, i, r), u = B(l, c, r), h = B(c, a, r), f = B(u, h, r);
  return [
    ["C", l[0], l[1], u[0], u[1], f[0], f[1]],
    ["C", h[0], h[1], a[0], a[1], i[0], i[1]]
  ];
}, mn = (t) => {
  const e = [];
  let r, o = -1, n = 0, s = 0, i = 0, l = 0;
  const c = { ...he };
  return t.forEach((a) => {
    const [u] = a, h = u.toUpperCase(), f = u.toLowerCase(), y = u === f, m = a.slice(1);
    h === "M" ? (o += 1, [n, s] = m, n += y ? c.x : 0, s += y ? c.y : 0, i = n, l = s, r = [y ? [h, i, l] : a]) : (h === "Z" ? (n = i, s = l) : h === "H" ? ([, n] = a, n += y ? c.x : (
      /* istanbul ignore next @preserve */
      0
    )) : h === "V" ? ([, s] = a, s += y ? c.y : (
      /* istanbul ignore next @preserve */
      0
    )) : ([n, s] = a.slice(-2), n += y ? c.x : 0, s += y ? c.y : 0), r.push(a)), c.x = n, c.y = s, e[o] = r;
  }), e;
}, un = (t, e) => {
  let r = 0, o = 0, n = 0, s = 0, i = 0, l = 0, c = "M";
  const a = Q(t), u = e && Object.keys(e);
  if (!e || u && !u.length)
    return a.slice(0);
  e.origin || Object.assign(e, { origin: ne.origin });
  const h = e.origin, f = _t(e);
  return f.isIdentity ? a.slice(0) : O(a, (y, m, x, p) => {
    [c] = y;
    const b = c.toUpperCase(), d = b !== c ? ue(y, m, x, p) : y.slice(0);
    let g = b === "A" ? ["C"].concat(
      ve(
        x,
        p,
        d[1],
        d[2],
        d[3],
        d[4],
        d[5],
        d[6],
        d[7]
      )
    ) : b === "V" ? ["L", x, d[1]] : b === "H" ? ["L", d[1], p] : d;
    c = g[0];
    const A = c === "C" && g.length > 7, S = A ? g.slice(0, 7) : g.slice(0);
    if (A && (a.splice(
      m + 1,
      0,
      ["C"].concat(
        g.slice(7)
      )
    ), g = S), c === "L")
      [n, s] = Ve(f, [
        g[1],
        g[2]
      ], h), r !== n && o !== s ? g = ["L", n, s] : o === s ? g = ["H", n] : r === n && (g = ["V", s]);
    else
      for (i = 1, l = g.length; i < l; i += 2)
        [n, s] = Ve(
          f,
          [+g[i], +g[i + 1]],
          h
        ), g[i] = n, g[i + 1] = s;
    return r = n, o = s, g;
  });
};
export {
  P as CSSMatrix,
  ue as absolutizeSegment,
  ve as arcToCubic,
  Dt as arcTools,
  Bt as bezierTools,
  Ht as cubicTools,
  Se as distanceEpsilon,
  we as distanceSquareRoot,
  ke as finalizeSegment,
  Jt as getClosestPoint,
  Kt as getDrawDirection,
  vt as getPathArea,
  Wt as getPathBBox,
  xe as getPointAtLength,
  ut as getPropertiesAtLength,
  ze as getPropertiesAtPoint,
  _t as getSVGMatrix,
  Xt as getSegmentAtLength,
  Yt as getSegmentOfPoint,
  oe as getTotalLength,
  J as invalidPathValue,
  $t as isAbsoluteArray,
  St as isArcCommand,
  en as isCurveArray,
  G as isDigit,
  Ct as isDigitStart,
  Pt as isMoveCommand,
  qt as isNormalizedArray,
  je as isPathArray,
  At as isPathCommand,
  tn as isPointInStroke,
  nn as isRelativeArray,
  Mt as isSpace,
  zt as isValidPath,
  O as iterate,
  Ee as lineToCubic,
  Zt as lineTools,
  B as midPoint,
  qe as normalizePath,
  $e as normalizeSegment,
  on as optimizePath,
  W as paramsCount,
  he as paramsParser,
  Q as parsePathString,
  ct as pathParser,
  lt as pathToAbsolute,
  mt as pathToCurve,
  Gt as pathToRelative,
  Nt as pathToString,
  Ut as polygonTools,
  Ve as projection2d,
  wt as quadToCubic,
  Ft as quadTools,
  at as relativizeSegment,
  sn as reverseCurve,
  cn as reversePath,
  re as rotateVector,
  ln as roundPath,
  Pe as roundSegment,
  $ as roundTo,
  pt as scanFlag,
  bt as scanParam,
  it as scanSegment,
  Lt as segmentToCubic,
  le as shapeParams,
  rn as shapeToPath,
  Rt as shapeToPathArray,
  Ot as shortenSegment,
  X as skipSpaces,
  an as splitCubic,
  mn as splitPath,
  un as transformPath
};
//# sourceMappingURL=util.mjs.map
