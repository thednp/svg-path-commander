"use strict";
var SVGPathCommander = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    default: () => src_default
  });

  // src/options/options.ts
  var defaultOptions = {
    origin: [0, 0, 0],
    round: 4
  };
  var options_default = defaultOptions;

  // src/parser/error.ts
  var error = "SVGPathCommander Error";
  var error_default = error;

  // src/parser/paramsCount.ts
  var paramsCount = {
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
  };
  var paramsCount_default = paramsCount;

  // src/parser/finalizeSegment.ts
  var finalizeSegment = (path) => {
    let pathCommand = path.pathValue[path.segmentStart];
    let LK = pathCommand.toLowerCase();
    const { data } = path;
    while (data.length >= paramsCount_default[LK]) {
      if (LK === "m" && data.length > 2) {
        path.segments.push([pathCommand, ...data.splice(0, 2)]);
        LK = "l";
        pathCommand = pathCommand === "m" ? "l" : "L";
      } else {
        path.segments.push([pathCommand, ...data.splice(0, paramsCount_default[LK])]);
      }
      if (!paramsCount_default[LK]) {
        break;
      }
    }
  };
  var finalizeSegment_default = finalizeSegment;

  // src/parser/scanFlag.ts
  var scanFlag = (path) => {
    const { index, pathValue } = path;
    const code = pathValue.charCodeAt(index);
    if (code === 48) {
      path.param = 0;
      path.index += 1;
      return;
    }
    if (code === 49) {
      path.param = 1;
      path.index += 1;
      return;
    }
    path.err = `${error_default}: invalid Arc flag "${pathValue[index]}", expecting 0 or 1 at index ${index}`;
  };
  var scanFlag_default = scanFlag;

  // src/parser/isDigit.ts
  var isDigit = (code) => {
    return code >= 48 && code <= 57;
  };
  var isDigit_default = isDigit;

  // src/parser/invalidPathValue.ts
  var invalidPathValue = "Invalid path value";
  var invalidPathValue_default = invalidPathValue;

  // src/parser/scanParam.ts
  var scanParam = (path) => {
    const { max, pathValue, index: start } = path;
    let index = start;
    let zeroFirst = false;
    let hasCeiling = false;
    let hasDecimal = false;
    let hasDot = false;
    let ch;
    if (index >= max) {
      path.err = `${error_default}: ${invalidPathValue_default} at index ${index}, "pathValue" is missing param`;
      return;
    }
    ch = pathValue.charCodeAt(index);
    if (ch === 43 || ch === 45) {
      index += 1;
      ch = pathValue.charCodeAt(index);
    }
    if (!isDigit_default(ch) && ch !== 46) {
      path.err = `${error_default}: ${invalidPathValue_default} at index ${index}, "${pathValue[index]}" is not a number`;
      return;
    }
    if (ch !== 46) {
      zeroFirst = ch === 48;
      index += 1;
      ch = pathValue.charCodeAt(index);
      if (zeroFirst && index < max) {
        if (ch && isDigit_default(ch)) {
          path.err = `${error_default}: ${invalidPathValue_default} at index ${start}, "${pathValue[start]}" illegal number`;
          return;
        }
      }
      while (index < max && isDigit_default(pathValue.charCodeAt(index))) {
        index += 1;
        hasCeiling = true;
      }
      ch = pathValue.charCodeAt(index);
    }
    if (ch === 46) {
      hasDot = true;
      index += 1;
      while (isDigit_default(pathValue.charCodeAt(index))) {
        index += 1;
        hasDecimal = true;
      }
      ch = pathValue.charCodeAt(index);
    }
    if (ch === 101 || ch === 69) {
      if (hasDot && !hasCeiling && !hasDecimal) {
        path.err = `${error_default}: ${invalidPathValue_default} at index ${index}, "${pathValue[index]}" invalid float exponent`;
        return;
      }
      index += 1;
      ch = pathValue.charCodeAt(index);
      if (ch === 43 || ch === 45) {
        index += 1;
      }
      if (index < max && isDigit_default(pathValue.charCodeAt(index))) {
        while (index < max && isDigit_default(pathValue.charCodeAt(index))) {
          index += 1;
        }
      } else {
        path.err = `${error_default}: ${invalidPathValue_default} at index ${index}, "${pathValue[index]}" invalid integer exponent`;
        return;
      }
    }
    path.index = index;
    path.param = +path.pathValue.slice(start, index);
  };
  var scanParam_default = scanParam;

  // src/parser/isSpace.ts
  var isSpace = (ch) => {
    const allSpaces = [
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
    ];
    return allSpaces.includes(ch);
  };
  var isSpace_default = isSpace;

  // src/parser/skipSpaces.ts
  var skipSpaces = (path) => {
    const { pathValue, max } = path;
    while (path.index < max && isSpace_default(pathValue.charCodeAt(path.index))) {
      path.index += 1;
    }
  };
  var skipSpaces_default = skipSpaces;

  // src/parser/isPathCommand.ts
  var isPathCommand = (code) => {
    switch (code | 32) {
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
        return true;
      default:
        return false;
    }
  };
  var isPathCommand_default = isPathCommand;

  // src/parser/isDigitStart.ts
  var isDigitStart = (code) => {
    return isDigit_default(code) || code === 43 || code === 45 || code === 46;
  };
  var isDigitStart_default = isDigitStart;

  // src/parser/isArcCommand.ts
  var isArcCommand = (code) => {
    return (code | 32) === 97;
  };
  var isArcCommand_default = isArcCommand;

  // src/parser/scanSegment.ts
  var scanSegment = (path) => {
    const { max, pathValue, index } = path;
    const cmdCode = pathValue.charCodeAt(index);
    const reqParams = paramsCount_default[pathValue[index].toLowerCase()];
    path.segmentStart = index;
    if (!isPathCommand_default(cmdCode)) {
      path.err = `${error_default}: ${invalidPathValue_default} "${pathValue[index]}" is not a path command`;
      return;
    }
    path.index += 1;
    skipSpaces_default(path);
    path.data = [];
    if (!reqParams) {
      finalizeSegment_default(path);
      return;
    }
    for (; ; ) {
      for (let i = reqParams; i > 0; i -= 1) {
        if (isArcCommand_default(cmdCode) && (i === 3 || i === 4)) scanFlag_default(path);
        else scanParam_default(path);
        if (path.err.length) {
          return;
        }
        path.data.push(path.param);
        skipSpaces_default(path);
        if (path.index < max && pathValue.charCodeAt(path.index) === 44) {
          path.index += 1;
          skipSpaces_default(path);
        }
      }
      if (path.index >= path.max) {
        break;
      }
      if (!isDigitStart_default(pathValue.charCodeAt(path.index))) {
        break;
      }
    }
    finalizeSegment_default(path);
  };
  var scanSegment_default = scanSegment;

  // src/parser/pathParser.ts
  var PathParser = class {
    constructor(pathString) {
      this.segments = [];
      this.pathValue = pathString;
      this.max = pathString.length;
      this.index = 0;
      this.param = 0;
      this.segmentStart = 0;
      this.data = [];
      this.err = "";
    }
  };

  // src/util/isPathArray.ts
  var isPathArray = (path) => {
    return Array.isArray(path) && path.every((seg) => {
      const lk = seg[0].toLowerCase();
      return paramsCount_default[lk] === seg.length - 1 && "achlmqstvz".includes(lk) && seg.slice(1).every(Number.isFinite);
    }) && path.length > 0;
  };
  var isPathArray_default = isPathArray;

  // src/parser/parsePathString.ts
  var parsePathString = (pathInput) => {
    if (isPathArray_default(pathInput)) {
      return [...pathInput];
    }
    const path = new PathParser(pathInput);
    skipSpaces_default(path);
    while (path.index < path.max && !path.err.length) {
      scanSegment_default(path);
    }
    if (path.err && path.err.length) {
      throw TypeError(path.err);
    }
    return path.segments;
  };
  var parsePathString_default = parsePathString;

  // src/math/polygonArea.ts
  var polygonArea = (polygon) => {
    const n = polygon.length;
    let i = -1;
    let a;
    let b = polygon[n - 1];
    let area = 0;
    while (++i < n) {
      a = b;
      b = polygon[i];
      area += a[1] * b[0] - a[0] * b[1];
    }
    return area / 2;
  };
  var polygonArea_default = polygonArea;

  // src/math/distanceSquareRoot.ts
  var distanceSquareRoot = (a, b) => {
    return Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]));
  };
  var distanceSquareRoot_default = distanceSquareRoot;

  // src/math/polygonLength.ts
  var polygonLength = (polygon) => {
    return polygon.reduce((length, point, i) => {
      if (i) {
        return length + distanceSquareRoot_default(polygon[i - 1], point);
      }
      return 0;
    }, 0);
  };
  var polygonLength_default = polygonLength;

  // node_modules/.pnpm/@thednp+dommatrix@2.0.7/node_modules/@thednp/dommatrix/dist/dommatrix.mjs
  var Z = Object.defineProperty;
  var z = (s, t, e) => t in s ? Z(s, t, { enumerable: true, configurable: true, writable: true, value: e }) : s[t] = e;
  var p = (s, t, e) => z(s, typeof t != "symbol" ? t + "" : t, e);
  var $ = {
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
    is2D: true,
    isIdentity: true
  };
  var E = (s) => (s instanceof Float64Array || s instanceof Float32Array || Array.isArray(s) && s.every((t) => typeof t == "number")) && [6, 16].some((t) => s.length === t);
  var P = (s) => s instanceof DOMMatrix || s instanceof y || typeof s == "object" && Object.keys($).every((t) => s && t in s);
  var g = (s) => {
    const t = new y(), e = Array.from(s);
    if (!E(e))
      throw TypeError(`CSSMatrix: "${e.join(",")}" must be an array with 6/16 numbers.`);
    if (e.length === 16) {
      const [n, i, r, a, l, m, h, c, u, f, w, o, d, A, M, b] = e;
      t.m11 = n, t.a = n, t.m21 = l, t.c = l, t.m31 = u, t.m41 = d, t.e = d, t.m12 = i, t.b = i, t.m22 = m, t.d = m, t.m32 = f, t.m42 = A, t.f = A, t.m13 = r, t.m23 = h, t.m33 = w, t.m43 = M, t.m14 = a, t.m24 = c, t.m34 = o, t.m44 = b;
    } else if (e.length === 6) {
      const [n, i, r, a, l, m] = e;
      t.m11 = n, t.a = n, t.m12 = i, t.b = i, t.m21 = r, t.c = r, t.m22 = a, t.d = a, t.m41 = l, t.e = l, t.m42 = m, t.f = m;
    }
    return t;
  };
  var X = (s) => {
    if (P(s))
      return g([
        s.m11,
        s.m12,
        s.m13,
        s.m14,
        s.m21,
        s.m22,
        s.m23,
        s.m24,
        s.m31,
        s.m32,
        s.m33,
        s.m34,
        s.m41,
        s.m42,
        s.m43,
        s.m44
      ]);
    throw TypeError(`CSSMatrix: "${JSON.stringify(s)}" is not a DOMMatrix / CSSMatrix / JSON compatible object.`);
  };
  var O = (s) => {
    if (typeof s != "string")
      throw TypeError(`CSSMatrix: "${JSON.stringify(s)}" is not a string.`);
    const t = String(s).replace(/\s/g, "");
    let e = new y();
    const n = `CSSMatrix: invalid transform string "${s}"`;
    return t.split(")").filter((i) => i).forEach((i) => {
      const [r, a] = i.split("(");
      if (!a) throw TypeError(n);
      const l = a.split(",").map((o) => o.includes("rad") ? parseFloat(o) * (180 / Math.PI) : parseFloat(o)), [m, h, c, u] = l, f = [m, h, c], w = [m, h, c, u];
      if (r === "perspective" && m && [h, c].every((o) => o === void 0))
        e.m34 = -1 / m;
      else if (r.includes("matrix") && [6, 16].includes(l.length) && l.every((o) => !Number.isNaN(+o))) {
        const o = l.map((d) => Math.abs(d) < 1e-6 ? 0 : d);
        e = e.multiply(g(o));
      } else if (r === "translate3d" && f.every((o) => !Number.isNaN(+o)))
        e = e.translate(m, h, c);
      else if (r === "translate" && m && c === void 0)
        e = e.translate(m, h || 0, 0);
      else if (r === "rotate3d" && w.every((o) => !Number.isNaN(+o)) && u)
        e = e.rotateAxisAngle(m, h, c, u);
      else if (r === "rotate" && m && [h, c].every((o) => o === void 0))
        e = e.rotate(0, 0, m);
      else if (r === "scale3d" && f.every((o) => !Number.isNaN(+o)) && f.some((o) => o !== 1))
        e = e.scale(m, h, c);
      else if (r === "scale" && !Number.isNaN(m) && m !== 1 && c === void 0) {
        const d = Number.isNaN(+h) ? m : h;
        e = e.scale(m, d, 1);
      } else if (r === "skew" && (m || !Number.isNaN(m) && h) && c === void 0)
        e = e.skew(m, h || 0);
      else if (["translate", "rotate", "scale", "skew"].some((o) => r.includes(o)) && /[XYZ]/.test(r) && m && [h, c].every((o) => o === void 0))
        if (r === "skewX" || r === "skewY")
          e = e[r](m);
        else {
          const o = r.replace(/[XYZ]/, ""), d = r.replace(o, ""), A = ["X", "Y", "Z"].indexOf(d), M = o === "scale" ? 1 : 0, b = [A === 0 ? m : M, A === 1 ? m : M, A === 2 ? m : M];
          e = e[o](...b);
        }
      else
        throw TypeError(n);
    }), e;
  };
  var x = (s, t) => t ? [s.a, s.b, s.c, s.d, s.e, s.f] : [
    s.m11,
    s.m12,
    s.m13,
    s.m14,
    s.m21,
    s.m22,
    s.m23,
    s.m24,
    s.m31,
    s.m32,
    s.m33,
    s.m34,
    s.m41,
    s.m42,
    s.m43,
    s.m44
  ];
  var Y = (s, t, e) => {
    const n = new y();
    return n.m41 = s, n.e = s, n.m42 = t, n.f = t, n.m43 = e, n;
  };
  var F = (s, t, e) => {
    const n = new y(), i = Math.PI / 180, r = s * i, a = t * i, l = e * i, m = Math.cos(r), h = -Math.sin(r), c = Math.cos(a), u = -Math.sin(a), f = Math.cos(l), w = -Math.sin(l), o = c * f, d = -c * w;
    n.m11 = o, n.a = o, n.m12 = d, n.b = d, n.m13 = u;
    const A = h * u * f + m * w;
    n.m21 = A, n.c = A;
    const M = m * f - h * u * w;
    return n.m22 = M, n.d = M, n.m23 = -h * c, n.m31 = h * w - m * u * f, n.m32 = h * f + m * u * w, n.m33 = m * c, n;
  };
  var T = (s, t, e, n) => {
    const i = new y(), r = Math.sqrt(s * s + t * t + e * e);
    if (r === 0)
      return i;
    const a = s / r, l = t / r, m = e / r, h = n * (Math.PI / 360), c = Math.sin(h), u = Math.cos(h), f = c * c, w = a * a, o = l * l, d = m * m, A = 1 - 2 * (o + d) * f;
    i.m11 = A, i.a = A;
    const M = 2 * (a * l * f + m * c * u);
    i.m12 = M, i.b = M, i.m13 = 2 * (a * m * f - l * c * u);
    const b = 2 * (l * a * f - m * c * u);
    i.m21 = b, i.c = b;
    const k = 1 - 2 * (d + w) * f;
    return i.m22 = k, i.d = k, i.m23 = 2 * (l * m * f + a * c * u), i.m31 = 2 * (m * a * f + l * c * u), i.m32 = 2 * (m * l * f - a * c * u), i.m33 = 1 - 2 * (w + o) * f, i;
  };
  var I = (s, t, e) => {
    const n = new y();
    return n.m11 = s, n.a = s, n.m22 = t, n.d = t, n.m33 = e, n;
  };
  var v = (s, t) => {
    const e = new y();
    if (s) {
      const n = s * Math.PI / 180, i = Math.tan(n);
      e.m21 = i, e.c = i;
    }
    if (t) {
      const n = t * Math.PI / 180, i = Math.tan(n);
      e.m12 = i, e.b = i;
    }
    return e;
  };
  var R = (s) => v(s, 0);
  var D = (s) => v(0, s);
  var N = (s, t) => {
    const e = t.m11 * s.m11 + t.m12 * s.m21 + t.m13 * s.m31 + t.m14 * s.m41, n = t.m11 * s.m12 + t.m12 * s.m22 + t.m13 * s.m32 + t.m14 * s.m42, i = t.m11 * s.m13 + t.m12 * s.m23 + t.m13 * s.m33 + t.m14 * s.m43, r = t.m11 * s.m14 + t.m12 * s.m24 + t.m13 * s.m34 + t.m14 * s.m44, a = t.m21 * s.m11 + t.m22 * s.m21 + t.m23 * s.m31 + t.m24 * s.m41, l = t.m21 * s.m12 + t.m22 * s.m22 + t.m23 * s.m32 + t.m24 * s.m42, m = t.m21 * s.m13 + t.m22 * s.m23 + t.m23 * s.m33 + t.m24 * s.m43, h = t.m21 * s.m14 + t.m22 * s.m24 + t.m23 * s.m34 + t.m24 * s.m44, c = t.m31 * s.m11 + t.m32 * s.m21 + t.m33 * s.m31 + t.m34 * s.m41, u = t.m31 * s.m12 + t.m32 * s.m22 + t.m33 * s.m32 + t.m34 * s.m42, f = t.m31 * s.m13 + t.m32 * s.m23 + t.m33 * s.m33 + t.m34 * s.m43, w = t.m31 * s.m14 + t.m32 * s.m24 + t.m33 * s.m34 + t.m34 * s.m44, o = t.m41 * s.m11 + t.m42 * s.m21 + t.m43 * s.m31 + t.m44 * s.m41, d = t.m41 * s.m12 + t.m42 * s.m22 + t.m43 * s.m32 + t.m44 * s.m42, A = t.m41 * s.m13 + t.m42 * s.m23 + t.m43 * s.m33 + t.m44 * s.m43, M = t.m41 * s.m14 + t.m42 * s.m24 + t.m43 * s.m34 + t.m44 * s.m44;
    return g([e, n, i, r, a, l, m, h, c, u, f, w, o, d, A, M]);
  };
  var y = class {
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
      return typeof t == "string" && t.length && t !== "none" ? O(t) : Array.isArray(t) || t instanceof Float64Array || t instanceof Float32Array ? g(t) : typeof t == "object" ? X(t) : this;
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
      return Float32Array.from(x(this, t));
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
      return Float64Array.from(x(this, t));
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
      const { is2D: t } = this, e = this.toFloat64Array(t).join(", ");
      return `${t ? "matrix" : "matrix3d"}(${e})`;
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
      const { is2D: t, isIdentity: e } = this;
      return { ...this, is2D: t, isIdentity: e };
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
      return N(this, t);
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
    translate(t, e, n) {
      const i = t;
      let r = e, a = n;
      return typeof r > "u" && (r = 0), typeof a > "u" && (a = 0), N(this, Y(i, r, a));
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
    scale(t, e, n) {
      const i = t;
      let r = e, a = n;
      return typeof r > "u" && (r = t), typeof a > "u" && (a = 1), N(this, I(i, r, a));
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
    rotate(t, e, n) {
      let i = t, r = e || 0, a = n || 0;
      return typeof t == "number" && typeof e > "u" && typeof n > "u" && (a = i, i = 0, r = 0), N(this, F(i, r, a));
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
    rotateAxisAngle(t, e, n, i) {
      if ([t, e, n, i].some((r) => Number.isNaN(+r)))
        throw new TypeError("CSSMatrix: expecting 4 values");
      return N(this, T(t, e, n, i));
    }
    /**
     * Specifies a skew transformation along the `x-axis` by the given angle.
     * This matrix is not modified.
     *
     * @param angle The angle amount in degrees to skew.
     * @return The resulted matrix
     */
    skewX(t) {
      return N(this, R(t));
    }
    /**
     * Specifies a skew transformation along the `y-axis` by the given angle.
     * This matrix is not modified.
     *
     * @param angle The angle amount in degrees to skew.
     * @return The resulted matrix
     */
    skewY(t) {
      return N(this, D(t));
    }
    /**
     * Specifies a skew transformation along both the `x-axis` and `y-axis`.
     * This matrix is not modified.
     *
     * @param angleX The X-angle amount in degrees to skew.
     * @param angleY The angle amount in degrees to skew.
     * @return The resulted matrix
     */
    skew(t, e) {
      return N(this, v(t, e));
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
      const e = this.m11 * t.x + this.m21 * t.y + this.m31 * t.z + this.m41 * t.w, n = this.m12 * t.x + this.m22 * t.y + this.m32 * t.z + this.m42 * t.w, i = this.m13 * t.x + this.m23 * t.y + this.m33 * t.z + this.m43 * t.w, r = this.m14 * t.x + this.m24 * t.y + this.m34 * t.z + this.m44 * t.w;
      return t instanceof DOMPoint ? new DOMPoint(e, n, i, r) : {
        x: e,
        y: n,
        z: i,
        w: r
      };
    }
  };
  p(y, "Translate", Y), p(y, "Rotate", F), p(y, "RotateAxisAngle", T), p(y, "Scale", I), p(y, "SkewX", R), p(y, "SkewY", D), p(y, "Skew", v), p(y, "Multiply", N), p(y, "fromArray", g), p(y, "fromMatrix", X), p(y, "fromString", O), p(y, "toArray", x), p(y, "isCompatibleArray", E), p(y, "isCompatibleObject", P);

  // src/util/isAbsoluteArray.ts
  var isAbsoluteArray = (path) => {
    return isPathArray_default(path) && // `isPathArray` also checks if it's `Array`
    path.every(([x2]) => x2 === x2.toUpperCase());
  };
  var isAbsoluteArray_default = isAbsoluteArray;

  // src/convert/pathToAbsolute.ts
  var pathToAbsolute = (pathInput) => {
    if (isAbsoluteArray_default(pathInput)) {
      return [...pathInput];
    }
    const path = parsePathString_default(pathInput);
    let x2 = 0;
    let y2 = 0;
    let mx = 0;
    let my = 0;
    return path.map((segment) => {
      const values = segment.slice(1).map(Number);
      const [pathCommand] = segment;
      const absCommand = pathCommand.toUpperCase();
      if (pathCommand === "M") {
        [x2, y2] = values;
        mx = x2;
        my = y2;
        return ["M", x2, y2];
      }
      let absoluteSegment = [];
      if (pathCommand !== absCommand) {
        if (absCommand === "A") {
          absoluteSegment = [
            absCommand,
            values[0],
            values[1],
            values[2],
            values[3],
            values[4],
            values[5] + x2,
            values[6] + y2
          ];
        } else if (absCommand === "V") {
          absoluteSegment = [absCommand, values[0] + y2];
        } else if (absCommand === "H") {
          absoluteSegment = [absCommand, values[0] + x2];
        } else {
          const absValues = values.map((n, j) => n + (j % 2 ? y2 : x2));
          absoluteSegment = [absCommand, ...absValues];
        }
      } else {
        absoluteSegment = [absCommand, ...values];
      }
      if (absCommand === "Z") {
        x2 = mx;
        y2 = my;
      } else if (absCommand === "H") {
        [, x2] = absoluteSegment;
      } else if (absCommand === "V") {
        [, y2] = absoluteSegment;
      } else {
        [x2, y2] = absoluteSegment.slice(-2);
        if (absCommand === "M") {
          mx = x2;
          my = y2;
        }
      }
      return absoluteSegment;
    });
  };
  var pathToAbsolute_default = pathToAbsolute;

  // src/process/normalizeSegment.ts
  var normalizeSegment = (segment, params) => {
    const [pathCommand] = segment;
    const { x1: px1, y1: py1, x2: px2, y2: py2 } = params;
    const values = segment.slice(1).map(Number);
    let result = segment;
    if (!"TQ".includes(pathCommand)) {
      params.qx = null;
      params.qy = null;
    }
    if (pathCommand === "H") {
      result = ["L", segment[1], py1];
    } else if (pathCommand === "V") {
      result = ["L", px1, segment[1]];
    } else if (pathCommand === "S") {
      const x1 = px1 * 2 - px2;
      const y1 = py1 * 2 - py2;
      params.x1 = x1;
      params.y1 = y1;
      result = ["C", x1, y1, ...values];
    } else if (pathCommand === "T") {
      const qx = px1 * 2 - (params.qx ? params.qx : (
        /* istanbul ignore next */
        0
      ));
      const qy = py1 * 2 - (params.qy ? params.qy : (
        /* istanbul ignore next */
        0
      ));
      params.qx = qx;
      params.qy = qy;
      result = ["Q", qx, qy, ...values];
    } else if (pathCommand === "Q") {
      const [nqx, nqy] = values;
      params.qx = nqx;
      params.qy = nqy;
    }
    return result;
  };
  var normalizeSegment_default = normalizeSegment;

  // src/util/isNormalizedArray.ts
  var isNormalizedArray = (path) => {
    return isAbsoluteArray_default(path) && path.every(([pc]) => "ACLMQZ".includes(pc));
  };
  var isNormalizedArray_default = isNormalizedArray;

  // src/parser/paramsParser.ts
  var paramsParser = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    x: 0,
    y: 0,
    qx: null,
    qy: null
  };
  var paramsParser_default = paramsParser;

  // src/process/normalizePath.ts
  var normalizePath = (pathInput) => {
    if (isNormalizedArray_default(pathInput)) {
      return [...pathInput];
    }
    const path = pathToAbsolute_default(pathInput);
    const params = { ...paramsParser_default };
    const allPathCommands = [];
    const ii = path.length;
    let pathCommand = "";
    for (let i = 0; i < ii; i += 1) {
      [pathCommand] = path[i];
      allPathCommands[i] = pathCommand;
      path[i] = normalizeSegment_default(path[i], params);
      const segment = path[i];
      const seglen = segment.length;
      params.x1 = +segment[seglen - 2];
      params.y1 = +segment[seglen - 1];
      params.x2 = +segment[seglen - 4] || params.x1;
      params.y2 = +segment[seglen - 3] || params.y1;
    }
    return path;
  };
  var normalizePath_default = normalizePath;

  // src/math/midPoint.ts
  var midPoint = (a, b, t) => {
    const [ax, ay] = a;
    const [bx, by] = b;
    return [ax + (bx - ax) * t, ay + (by - ay) * t];
  };
  var midPoint_default = midPoint;

  // src/util/segmentLineFactory.ts
  var segmentLineFactory = (x1, y1, x2, y2, distance) => {
    const length = distanceSquareRoot_default([x1, y1], [x2, y2]);
    let point = { x: 0, y: 0 };
    if (typeof distance === "number") {
      if (distance <= 0) {
        point = { x: x1, y: y1 };
      } else if (distance >= length) {
        point = { x: x2, y: y2 };
      } else {
        const [x3, y3] = midPoint_default([x1, y1], [x2, y2], distance / length);
        point = { x: x3, y: y3 };
      }
    }
    return {
      length,
      point,
      min: {
        x: Math.min(x1, x2),
        y: Math.min(y1, y2)
      },
      max: {
        x: Math.max(x1, x2),
        y: Math.max(y1, y2)
      }
    };
  };
  var segmentLineFactory_default = segmentLineFactory;

  // src/util/segmentArcFactory.ts
  var angleBetween = (v0, v1) => {
    const { x: v0x, y: v0y } = v0;
    const { x: v1x, y: v1y } = v1;
    const p2 = v0x * v1x + v0y * v1y;
    const n = Math.sqrt((v0x ** 2 + v0y ** 2) * (v1x ** 2 + v1y ** 2));
    const sign = v0x * v1y - v0y * v1x < 0 ? -1 : 1;
    const angle = sign * Math.acos(p2 / n);
    return angle;
  };
  var getPointAtArcSegmentLength = (x1, y1, RX, RY, angle, LAF, SF, x2, y2, t) => {
    const { abs, sin, cos, sqrt, PI } = Math;
    let rx = abs(RX);
    let ry = abs(RY);
    const xRot = (angle % 360 + 360) % 360;
    const xRotRad = xRot * (PI / 180);
    if (x1 === x2 && y1 === y2) {
      return { x: x1, y: y1 };
    }
    if (rx === 0 || ry === 0) {
      return segmentLineFactory_default(x1, y1, x2, y2, t).point;
    }
    const dx = (x1 - x2) / 2;
    const dy = (y1 - y2) / 2;
    const transformedPoint = {
      x: cos(xRotRad) * dx + sin(xRotRad) * dy,
      y: -sin(xRotRad) * dx + cos(xRotRad) * dy
    };
    const radiiCheck = transformedPoint.x ** 2 / rx ** 2 + transformedPoint.y ** 2 / ry ** 2;
    if (radiiCheck > 1) {
      rx *= sqrt(radiiCheck);
      ry *= sqrt(radiiCheck);
    }
    const cSquareNumerator = rx ** 2 * ry ** 2 - rx ** 2 * transformedPoint.y ** 2 - ry ** 2 * transformedPoint.x ** 2;
    const cSquareRootDenom = rx ** 2 * transformedPoint.y ** 2 + ry ** 2 * transformedPoint.x ** 2;
    let cRadicand = cSquareNumerator / cSquareRootDenom;
    cRadicand = cRadicand < 0 ? 0 : cRadicand;
    const cCoef = (LAF !== SF ? 1 : -1) * sqrt(cRadicand);
    const transformedCenter = {
      x: cCoef * (rx * transformedPoint.y / ry),
      y: cCoef * (-(ry * transformedPoint.x) / rx)
    };
    const center = {
      x: cos(xRotRad) * transformedCenter.x - sin(xRotRad) * transformedCenter.y + (x1 + x2) / 2,
      y: sin(xRotRad) * transformedCenter.x + cos(xRotRad) * transformedCenter.y + (y1 + y2) / 2
    };
    const startVector = {
      x: (transformedPoint.x - transformedCenter.x) / rx,
      y: (transformedPoint.y - transformedCenter.y) / ry
    };
    const startAngle = angleBetween({ x: 1, y: 0 }, startVector);
    const endVector = {
      x: (-transformedPoint.x - transformedCenter.x) / rx,
      y: (-transformedPoint.y - transformedCenter.y) / ry
    };
    let sweepAngle = angleBetween(startVector, endVector);
    if (!SF && sweepAngle > 0) {
      sweepAngle -= 2 * PI;
    } else if (SF && sweepAngle < 0) {
      sweepAngle += 2 * PI;
    }
    sweepAngle %= 2 * PI;
    const alpha = startAngle + sweepAngle * t;
    const ellipseComponentX = rx * cos(alpha);
    const ellipseComponentY = ry * sin(alpha);
    const point = {
      x: cos(xRotRad) * ellipseComponentX - sin(xRotRad) * ellipseComponentY + center.x,
      y: sin(xRotRad) * ellipseComponentX + cos(xRotRad) * ellipseComponentY + center.y
    };
    return point;
  };
  var segmentArcFactory = (X1, Y1, RX, RY, angle, LAF, SF, X2, Y2, distance) => {
    const distanceIsNumber = typeof distance === "number";
    let x2 = X1;
    let y2 = Y1;
    let LENGTH = 0;
    let prev = [x2, y2, LENGTH];
    let cur = [x2, y2];
    let t = 0;
    let POINT = { x: 0, y: 0 };
    let POINTS = [{ x: x2, y: y2 }];
    if (distanceIsNumber && distance <= 0) {
      POINT = { x: x2, y: y2 };
    }
    const sampleSize = 300;
    for (let j = 0; j <= sampleSize; j += 1) {
      t = j / sampleSize;
      ({ x: x2, y: y2 } = getPointAtArcSegmentLength(X1, Y1, RX, RY, angle, LAF, SF, X2, Y2, t));
      POINTS = [...POINTS, { x: x2, y: y2 }];
      LENGTH += distanceSquareRoot_default(cur, [x2, y2]);
      cur = [x2, y2];
      if (distanceIsNumber && LENGTH > distance && distance > prev[2]) {
        const dv = (LENGTH - distance) / (LENGTH - prev[2]);
        POINT = {
          x: cur[0] * (1 - dv) + prev[0] * dv,
          y: cur[1] * (1 - dv) + prev[1] * dv
        };
      }
      prev = [x2, y2, LENGTH];
    }
    if (distanceIsNumber && distance >= LENGTH) {
      POINT = { x: X2, y: Y2 };
    }
    return {
      length: LENGTH,
      point: POINT,
      min: {
        x: Math.min(...POINTS.map((n) => n.x)),
        y: Math.min(...POINTS.map((n) => n.y))
      },
      max: {
        x: Math.max(...POINTS.map((n) => n.x)),
        y: Math.max(...POINTS.map((n) => n.y))
      }
    };
  };
  var segmentArcFactory_default = segmentArcFactory;

  // src/util/segmentCubicFactory.ts
  var getPointAtCubicSegmentLength = (x1, y1, c1x, c1y, c2x, c2y, x2, y2, t) => {
    const t1 = 1 - t;
    return {
      x: t1 ** 3 * x1 + 3 * t1 ** 2 * t * c1x + 3 * t1 * t ** 2 * c2x + t ** 3 * x2,
      y: t1 ** 3 * y1 + 3 * t1 ** 2 * t * c1y + 3 * t1 * t ** 2 * c2y + t ** 3 * y2
    };
  };
  var segmentCubicFactory = (x1, y1, c1x, c1y, c2x, c2y, x2, y2, distance) => {
    const distanceIsNumber = typeof distance === "number";
    let x3 = x1;
    let y3 = y1;
    let LENGTH = 0;
    let prev = [x3, y3, LENGTH];
    let cur = [x3, y3];
    let t = 0;
    let POINT = { x: 0, y: 0 };
    let POINTS = [{ x: x3, y: y3 }];
    if (distanceIsNumber && distance <= 0) {
      POINT = { x: x3, y: y3 };
    }
    const sampleSize = 300;
    for (let j = 0; j <= sampleSize; j += 1) {
      t = j / sampleSize;
      ({ x: x3, y: y3 } = getPointAtCubicSegmentLength(x1, y1, c1x, c1y, c2x, c2y, x2, y2, t));
      POINTS = [...POINTS, { x: x3, y: y3 }];
      LENGTH += distanceSquareRoot_default(cur, [x3, y3]);
      cur = [x3, y3];
      if (distanceIsNumber && LENGTH > distance && distance > prev[2]) {
        const dv = (LENGTH - distance) / (LENGTH - prev[2]);
        POINT = {
          x: cur[0] * (1 - dv) + prev[0] * dv,
          y: cur[1] * (1 - dv) + prev[1] * dv
        };
      }
      prev = [x3, y3, LENGTH];
    }
    if (distanceIsNumber && distance >= LENGTH) {
      POINT = { x: x2, y: y2 };
    }
    return {
      length: LENGTH,
      point: POINT,
      min: {
        x: Math.min(...POINTS.map((n) => n.x)),
        y: Math.min(...POINTS.map((n) => n.y))
      },
      max: {
        x: Math.max(...POINTS.map((n) => n.x)),
        y: Math.max(...POINTS.map((n) => n.y))
      }
    };
  };
  var segmentCubicFactory_default = segmentCubicFactory;

  // src/util/segmentQuadFactory.ts
  var getPointAtQuadSegmentLength = (x1, y1, cx, cy, x2, y2, t) => {
    const t1 = 1 - t;
    return {
      x: t1 ** 2 * x1 + 2 * t1 * t * cx + t ** 2 * x2,
      y: t1 ** 2 * y1 + 2 * t1 * t * cy + t ** 2 * y2
    };
  };
  var segmentQuadFactory = (x1, y1, qx, qy, x2, y2, distance) => {
    const distanceIsNumber = typeof distance === "number";
    let x3 = x1;
    let y3 = y1;
    let LENGTH = 0;
    let prev = [x3, y3, LENGTH];
    let cur = [x3, y3];
    let t = 0;
    let POINT = { x: 0, y: 0 };
    let POINTS = [{ x: x3, y: y3 }];
    if (distanceIsNumber && distance <= 0) {
      POINT = { x: x3, y: y3 };
    }
    const sampleSize = 300;
    for (let j = 0; j <= sampleSize; j += 1) {
      t = j / sampleSize;
      ({ x: x3, y: y3 } = getPointAtQuadSegmentLength(x1, y1, qx, qy, x2, y2, t));
      POINTS = [...POINTS, { x: x3, y: y3 }];
      LENGTH += distanceSquareRoot_default(cur, [x3, y3]);
      cur = [x3, y3];
      if (distanceIsNumber && LENGTH > distance && distance > prev[2]) {
        const dv = (LENGTH - distance) / (LENGTH - prev[2]);
        POINT = {
          x: cur[0] * (1 - dv) + prev[0] * dv,
          y: cur[1] * (1 - dv) + prev[1] * dv
        };
      }
      prev = [x3, y3, LENGTH];
    }
    if (distanceIsNumber && distance >= LENGTH) {
      POINT = { x: x2, y: y2 };
    }
    return {
      length: LENGTH,
      point: POINT,
      min: {
        x: Math.min(...POINTS.map((n) => n.x)),
        y: Math.min(...POINTS.map((n) => n.y))
      },
      max: {
        x: Math.max(...POINTS.map((n) => n.x)),
        y: Math.max(...POINTS.map((n) => n.y))
      }
    };
  };
  var segmentQuadFactory_default = segmentQuadFactory;

  // src/util/pathLengthFactory.ts
  var pathLengthFactory = (pathInput, distance) => {
    const path = normalizePath_default(pathInput);
    const distanceIsNumber = typeof distance === "number";
    let isM;
    let data = [];
    let pathCommand;
    let x2 = 0;
    let y2 = 0;
    let mx = 0;
    let my = 0;
    let seg;
    let MIN = [];
    let MAX = [];
    let length = 0;
    let min = { x: 0, y: 0 };
    let max = min;
    let point = min;
    let POINT = min;
    let LENGTH = 0;
    for (let i = 0, ll = path.length; i < ll; i += 1) {
      seg = path[i];
      [pathCommand] = seg;
      isM = pathCommand === "M";
      data = !isM ? [x2, y2, ...seg.slice(1)] : data;
      if (isM) {
        [, mx, my] = seg;
        min = { x: mx, y: my };
        max = min;
        length = 0;
        if (distanceIsNumber && distance < 1e-3) {
          POINT = min;
        }
      } else if (pathCommand === "L") {
        ({ length, min, max, point } = segmentLineFactory_default(
          ...data,
          (distance || 0) - LENGTH
        ));
      } else if (pathCommand === "A") {
        ({ length, min, max, point } = segmentArcFactory_default(
          ...data,
          (distance || 0) - LENGTH
        ));
      } else if (pathCommand === "C") {
        ({ length, min, max, point } = segmentCubicFactory_default(
          ...data,
          (distance || 0) - LENGTH
        ));
      } else if (pathCommand === "Q") {
        ({ length, min, max, point } = segmentQuadFactory_default(
          ...data,
          (distance || 0) - LENGTH
        ));
      } else if (pathCommand === "Z") {
        data = [x2, y2, mx, my];
        ({ length, min, max, point } = segmentLineFactory_default(
          ...data,
          (distance || 0) - LENGTH
        ));
      }
      if (distanceIsNumber && LENGTH < distance && LENGTH + length >= distance) {
        POINT = point;
      }
      MAX = [...MAX, max];
      MIN = [...MIN, min];
      LENGTH += length;
      [x2, y2] = pathCommand !== "Z" ? seg.slice(-2) : [mx, my];
    }
    if (distanceIsNumber && distance >= LENGTH) {
      POINT = { x: x2, y: y2 };
    }
    return {
      length: LENGTH,
      point: POINT,
      min: {
        x: Math.min(...MIN.map((n) => n.x)),
        y: Math.min(...MIN.map((n) => n.y))
      },
      max: {
        x: Math.max(...MAX.map((n) => n.x)),
        y: Math.max(...MAX.map((n) => n.y))
      }
    };
  };
  var pathLengthFactory_default = pathLengthFactory;

  // src/util/getPathBBox.ts
  var getPathBBox = (path) => {
    if (!path) {
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
    }
    const {
      min: { x: xMin, y: yMin },
      max: { x: xMax, y: yMax }
    } = pathLengthFactory_default(path);
    const width = xMax - xMin;
    const height = yMax - yMin;
    return {
      width,
      height,
      x: xMin,
      y: yMin,
      x2: xMax,
      y2: yMax,
      cx: xMin + width / 2,
      cy: yMin + height / 2,
      // an estimted guess
      cz: Math.max(width, height) + Math.min(width, height) / 2
    };
  };
  var getPathBBox_default = getPathBBox;

  // src/process/fixArc.ts
  var fixArc = (path, allPathCommands, i) => {
    if (path[i].length > 7) {
      path[i].shift();
      const segment = path[i];
      let ni = i;
      while (segment.length) {
        allPathCommands[i] = "A";
        path.splice(ni += 1, 0, ["C", ...segment.splice(0, 6)]);
      }
      path.splice(i, 1);
    }
  };
  var fixArc_default = fixArc;

  // src/util/isCurveArray.ts
  var isCurveArray = (path) => {
    return isNormalizedArray_default(path) && path.every(([pc]) => "MC".includes(pc));
  };
  var isCurveArray_default = isCurveArray;

  // src/math/rotateVector.ts
  var rotateVector = (x2, y2, rad) => {
    const X2 = x2 * Math.cos(rad) - y2 * Math.sin(rad);
    const Y2 = x2 * Math.sin(rad) + y2 * Math.cos(rad);
    return { x: X2, y: Y2 };
  };
  var rotateVector_default = rotateVector;

  // src/process/arcToCubic.ts
  var arcToCubic = (X1, Y1, RX, RY, angle, LAF, SF, X2, Y2, recursive) => {
    let x1 = X1;
    let y1 = Y1;
    let rx = RX;
    let ry = RY;
    let x2 = X2;
    let y2 = Y2;
    const d120 = Math.PI * 120 / 180;
    const rad = Math.PI / 180 * (+angle || 0);
    let res = [];
    let xy;
    let f1;
    let f2;
    let cx;
    let cy;
    if (!recursive) {
      xy = rotateVector_default(x1, y1, -rad);
      x1 = xy.x;
      y1 = xy.y;
      xy = rotateVector_default(x2, y2, -rad);
      x2 = xy.x;
      y2 = xy.y;
      const x3 = (x1 - x2) / 2;
      const y3 = (y1 - y2) / 2;
      let h = x3 * x3 / (rx * rx) + y3 * y3 / (ry * ry);
      if (h > 1) {
        h = Math.sqrt(h);
        rx *= h;
        ry *= h;
      }
      const rx2 = rx * rx;
      const ry2 = ry * ry;
      const k = (LAF === SF ? -1 : 1) * Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y3 * y3 - ry2 * x3 * x3) / (rx2 * y3 * y3 + ry2 * x3 * x3)));
      cx = k * rx * y3 / ry + (x1 + x2) / 2;
      cy = k * -ry * x3 / rx + (y1 + y2) / 2;
      f1 = Math.asin(((y1 - cy) / ry * 10 ** 9 >> 0) / 10 ** 9);
      f2 = Math.asin(((y2 - cy) / ry * 10 ** 9 >> 0) / 10 ** 9);
      f1 = x1 < cx ? Math.PI - f1 : f1;
      f2 = x2 < cx ? Math.PI - f2 : f2;
      if (f1 < 0) f1 = Math.PI * 2 + f1;
      if (f2 < 0) f2 = Math.PI * 2 + f2;
      if (SF && f1 > f2) {
        f1 -= Math.PI * 2;
      }
      if (!SF && f2 > f1) {
        f2 -= Math.PI * 2;
      }
    } else {
      [f1, f2, cx, cy] = recursive;
    }
    let df = f2 - f1;
    if (Math.abs(df) > d120) {
      const f2old = f2;
      const x2old = x2;
      const y2old = y2;
      f2 = f1 + d120 * (SF && f2 > f1 ? 1 : -1);
      x2 = cx + rx * Math.cos(f2);
      y2 = cy + ry * Math.sin(f2);
      res = arcToCubic(x2, y2, rx, ry, angle, 0, SF, x2old, y2old, [f2, f2old, cx, cy]);
    }
    df = f2 - f1;
    const c1 = Math.cos(f1);
    const s1 = Math.sin(f1);
    const c2 = Math.cos(f2);
    const s2 = Math.sin(f2);
    const t = Math.tan(df / 4);
    const hx = 4 / 3 * rx * t;
    const hy = 4 / 3 * ry * t;
    const m1 = [x1, y1];
    const m2 = [x1 + hx * s1, y1 - hy * c1];
    const m3 = [x2 + hx * s2, y2 - hy * c2];
    const m4 = [x2, y2];
    m2[0] = 2 * m1[0] - m2[0];
    m2[1] = 2 * m1[1] - m2[1];
    if (recursive) {
      return [...m2, ...m3, ...m4, ...res];
    }
    res = [...m2, ...m3, ...m4, ...res];
    const newres = [];
    for (let i = 0, ii = res.length; i < ii; i += 1) {
      newres[i] = i % 2 ? rotateVector_default(res[i - 1], res[i], rad).y : rotateVector_default(res[i], res[i + 1], rad).x;
    }
    return newres;
  };
  var arcToCubic_default = arcToCubic;

  // src/process/quadToCubic.ts
  var quadToCubic = (x1, y1, qx, qy, x2, y2) => {
    const r13 = 1 / 3;
    const r23 = 2 / 3;
    return [
      r13 * x1 + r23 * qx,
      // cpx1
      r13 * y1 + r23 * qy,
      // cpy1
      r13 * x2 + r23 * qx,
      // cpx2
      r13 * y2 + r23 * qy,
      // cpy2
      x2,
      y2
      // x,y
    ];
  };
  var quadToCubic_default = quadToCubic;

  // src/process/lineToCubic.ts
  var lineToCubic = (x1, y1, x2, y2) => {
    const c1 = midPoint_default([x1, y1], [x2, y2], 1 / 3);
    const c2 = midPoint_default([x1, y1], [x2, y2], 2 / 3);
    return [...c1, ...c2, x2, y2];
  };
  var lineToCubic_default = lineToCubic;

  // src/process/segmentToCubic.ts
  var segmentToCubic = (segment, params) => {
    const [pathCommand] = segment;
    const values = segment.slice(1).map(Number);
    const [x2, y2] = values;
    let args;
    const { x1: px1, y1: py1, x: px, y: py } = params;
    if (!"TQ".includes(pathCommand)) {
      params.qx = null;
      params.qy = null;
    }
    if (pathCommand === "M") {
      params.x = x2;
      params.y = y2;
      return segment;
    } else if (pathCommand === "A") {
      args = [px1, py1, ...values];
      return ["C", ...arcToCubic_default(...args)];
    } else if (pathCommand === "Q") {
      params.qx = x2;
      params.qy = y2;
      args = [px1, py1, ...values];
      return ["C", ...quadToCubic_default(...args)];
    } else if (pathCommand === "L") {
      return ["C", ...lineToCubic_default(px1, py1, x2, y2)];
    } else if (pathCommand === "Z") {
      return ["C", ...lineToCubic_default(px1, py1, px, py)];
    }
    return segment;
  };
  var segmentToCubic_default = segmentToCubic;

  // src/convert/pathToCurve.ts
  var pathToCurve = (pathInput) => {
    if (isCurveArray_default(pathInput)) {
      return [...pathInput];
    }
    const path = normalizePath_default(pathInput);
    const params = { ...paramsParser_default };
    const allPathCommands = [];
    let pathCommand = "";
    let ii = path.length;
    for (let i = 0; i < ii; i += 1) {
      [pathCommand] = path[i];
      allPathCommands[i] = pathCommand;
      path[i] = segmentToCubic_default(path[i], params);
      fixArc_default(path, allPathCommands, i);
      ii = path.length;
      const segment = path[i];
      const seglen = segment.length;
      params.x1 = +segment[seglen - 2];
      params.y1 = +segment[seglen - 1];
      params.x2 = +segment[seglen - 4] || params.x1;
      params.y2 = +segment[seglen - 3] || params.y1;
    }
    return path;
  };
  var pathToCurve_default = pathToCurve;

  // src/util/getPathArea.ts
  var getCubicSegArea = (x1, y1, c1x, c1y, c2x, c2y, x2, y2) => {
    return 3 * ((y2 - y1) * (c1x + c2x) - (x2 - x1) * (c1y + c2y) + c1y * (x1 - c2x) - c1x * (y1 - c2y) + y2 * (c2x + x1 / 3) - x2 * (c2y + y1 / 3)) / 20;
  };
  var getPathArea = (path) => {
    let x2 = 0;
    let y2 = 0;
    let len = 0;
    return pathToCurve_default(path).map((seg) => {
      switch (seg[0]) {
        case "M":
          [, x2, y2] = seg;
          return 0;
        default:
          len = getCubicSegArea(x2, y2, ...seg.slice(1));
          [x2, y2] = seg.slice(-2);
          return len;
      }
    }).reduce((a, b) => a + b, 0);
  };
  var getPathArea_default = getPathArea;

  // src/util/getTotalLength.ts
  var getTotalLength = (pathInput) => {
    return pathLengthFactory_default(pathInput).length;
  };
  var getTotalLength_default = getTotalLength;

  // src/util/getDrawDirection.ts
  var getDrawDirection = (path) => {
    return getPathArea_default(pathToCurve_default(path)) >= 0;
  };
  var getDrawDirection_default = getDrawDirection;

  // src/util/getPointAtLength.ts
  var getPointAtLength = (pathInput, distance) => {
    return pathLengthFactory_default(pathInput, distance).point;
  };
  var getPointAtLength_default = getPointAtLength;

  // src/util/getPropertiesAtLength.ts
  var getPropertiesAtLength = (pathInput, distance) => {
    const pathArray = parsePathString_default(pathInput);
    let pathTemp = [...pathArray];
    let pathLength = getTotalLength_default(pathTemp);
    let index = pathTemp.length - 1;
    let lengthAtSegment = 0;
    let length = 0;
    let segment = pathArray[0];
    const [x2, y2] = segment.slice(-2);
    const point = { x: x2, y: y2 };
    if (index <= 0 || !distance || !Number.isFinite(distance)) {
      return {
        segment,
        index: 0,
        length,
        point,
        lengthAtSegment
      };
    }
    if (distance >= pathLength) {
      pathTemp = pathArray.slice(0, -1);
      lengthAtSegment = getTotalLength_default(pathTemp);
      length = pathLength - lengthAtSegment;
      return {
        segment: pathArray[index],
        index,
        length,
        lengthAtSegment
      };
    }
    const segments = [];
    while (index > 0) {
      segment = pathTemp[index];
      pathTemp = pathTemp.slice(0, -1);
      lengthAtSegment = getTotalLength_default(pathTemp);
      length = pathLength - lengthAtSegment;
      pathLength = lengthAtSegment;
      segments.push({
        segment,
        index,
        length,
        lengthAtSegment
      });
      index -= 1;
    }
    return segments.find(({ lengthAtSegment: l }) => l <= distance);
  };
  var getPropertiesAtLength_default = getPropertiesAtLength;

  // src/util/getPropertiesAtPoint.ts
  var getPropertiesAtPoint = (pathInput, point) => {
    const path = parsePathString_default(pathInput);
    const normalPath = normalizePath_default(path);
    const pathLength = getTotalLength_default(path);
    const distanceTo = (p2) => {
      const dx = p2.x - point.x;
      const dy = p2.y - point.y;
      return dx * dx + dy * dy;
    };
    let precision = 8;
    let scan;
    let closest = { x: 0, y: 0 };
    let scanDistance = 0;
    let bestLength = 0;
    let bestDistance = Infinity;
    for (let scanLength = 0; scanLength <= pathLength; scanLength += precision) {
      scan = getPointAtLength_default(normalPath, scanLength);
      scanDistance = distanceTo(scan);
      if (scanDistance < bestDistance) {
        closest = scan;
        bestLength = scanLength;
        bestDistance = scanDistance;
      }
    }
    precision /= 2;
    let before;
    let after;
    let beforeLength = 0;
    let afterLength = 0;
    let beforeDistance = 0;
    let afterDistance = 0;
    while (precision > 0.5) {
      beforeLength = bestLength - precision;
      before = getPointAtLength_default(normalPath, beforeLength);
      beforeDistance = distanceTo(before);
      afterLength = bestLength + precision;
      after = getPointAtLength_default(normalPath, afterLength);
      afterDistance = distanceTo(after);
      if (beforeLength >= 0 && beforeDistance < bestDistance) {
        closest = before;
        bestLength = beforeLength;
        bestDistance = beforeDistance;
      } else if (afterLength <= pathLength && afterDistance < bestDistance) {
        closest = after;
        bestLength = afterLength;
        bestDistance = afterDistance;
      } else {
        precision /= 2;
      }
    }
    const segment = getPropertiesAtLength_default(path, bestLength);
    const distance = Math.sqrt(bestDistance);
    return { closest, distance, segment };
  };
  var getPropertiesAtPoint_default = getPropertiesAtPoint;

  // src/util/getClosestPoint.ts
  var getClosestPoint = (pathInput, point) => {
    return getPropertiesAtPoint_default(pathInput, point).closest;
  };
  var getClosestPoint_default = getClosestPoint;

  // src/util/getSegmentOfPoint.ts
  var getSegmentOfPoint = (path, point) => {
    return getPropertiesAtPoint_default(path, point).segment;
  };
  var getSegmentOfPoint_default = getSegmentOfPoint;

  // src/util/getSegmentAtLength.ts
  var getSegmentAtLength = (pathInput, distance) => {
    return getPropertiesAtLength_default(pathInput, distance).segment;
  };
  var getSegmentAtLength_default = getSegmentAtLength;

  // src/util/isPointInStroke.ts
  var isPointInStroke = (pathInput, point) => {
    const { distance } = getPropertiesAtPoint_default(pathInput, point);
    return Math.abs(distance) < 1e-3;
  };
  var isPointInStroke_default = isPointInStroke;

  // src/util/isValidPath.ts
  var isValidPath = (pathString) => {
    if (typeof pathString !== "string" || !pathString.length) {
      return false;
    }
    const path = new PathParser(pathString);
    skipSpaces_default(path);
    while (path.index < path.max && !path.err.length) {
      scanSegment_default(path);
    }
    return !path.err.length && "mM".includes(path.segments[0][0]);
  };
  var isValidPath_default = isValidPath;

  // src/util/isRelativeArray.ts
  var isRelativeArray = (path) => {
    return isPathArray_default(path) && // `isPathArray` checks if it's `Array`
    path.slice(1).every(([pc]) => pc === pc.toLowerCase());
  };
  var isRelativeArray_default = isRelativeArray;

  // src/util/shapeParams.ts
  var shapeParams = {
    line: ["x1", "y1", "x2", "y2"],
    circle: ["cx", "cy", "r"],
    ellipse: ["cx", "cy", "rx", "ry"],
    rect: ["width", "height", "x", "y", "rx", "ry"],
    polygon: ["points"],
    polyline: ["points"],
    glyph: ["d"]
  };
  var shapeParams_default = shapeParams;

  // src/util/shapeToPathArray.ts
  var getLinePath = (attr) => {
    let { x1, y1, x2, y2 } = attr;
    [x1, y1, x2, y2] = [x1, y1, x2, y2].map((a) => +a);
    return [
      ["M", x1, y1],
      ["L", x2, y2]
    ];
  };
  var getPolyPath = (attr) => {
    const pathArray = [];
    const points = (attr.points || "").trim().split(/[\s|,]/).map((a) => +a);
    let index = 0;
    while (index < points.length) {
      pathArray.push([index ? "L" : "M", points[index], points[index + 1]]);
      index += 2;
    }
    return attr.type === "polygon" ? [...pathArray, ["z"]] : pathArray;
  };
  var getCirclePath = (attr) => {
    let { cx, cy, r } = attr;
    [cx, cy, r] = [cx, cy, r].map((a) => +a);
    return [
      ["M", cx - r, cy],
      ["a", r, r, 0, 1, 0, 2 * r, 0],
      ["a", r, r, 0, 1, 0, -2 * r, 0]
    ];
  };
  var getEllipsePath = (attr) => {
    let { cx, cy } = attr;
    let rx = attr.rx || 0;
    let ry = attr.ry || rx;
    [cx, cy, rx, ry] = [cx, cy, rx, ry].map((a) => +a);
    return [
      ["M", cx - rx, cy],
      ["a", rx, ry, 0, 1, 0, 2 * rx, 0],
      ["a", rx, ry, 0, 1, 0, -2 * rx, 0]
    ];
  };
  var getRectanglePath = (attr) => {
    const x2 = +attr.x || 0;
    const y2 = +attr.y || 0;
    const w = +attr.width;
    const h = +attr.height;
    let rx = +(attr.rx || 0);
    let ry = +(attr.ry || rx);
    if (rx || ry) {
      if (rx * 2 > w) rx -= (rx * 2 - w) / 2;
      if (ry * 2 > h) ry -= (ry * 2 - h) / 2;
      return [
        ["M", x2 + rx, y2],
        ["h", w - rx * 2],
        ["s", rx, 0, rx, ry],
        ["v", h - ry * 2],
        ["s", 0, ry, -rx, ry],
        ["h", -w + rx * 2],
        ["s", -rx, 0, -rx, -ry],
        ["v", -h + ry * 2],
        ["s", 0, -ry, rx, -ry]
      ];
    }
    return [["M", x2, y2], ["h", w], ["v", h], ["H", x2], ["Z"]];
  };
  var shapeToPathArray = (element, ownerDocument) => {
    const doc = ownerDocument || document;
    const win = doc.defaultView || /* istanbul ignore next */
    window;
    const supportedShapes = Object.keys(shapeParams_default);
    const targetIsElement = element instanceof win.SVGElement;
    const tagName = targetIsElement ? element.tagName : null;
    if (tagName && [...supportedShapes, "path"].every((s) => tagName !== s)) {
      throw TypeError(`${error_default}: "${tagName}" is not SVGElement`);
    }
    const type = targetIsElement ? tagName : element.type;
    const shapeAttrs = shapeParams_default[type];
    const config = { type };
    if (targetIsElement) {
      shapeAttrs.forEach((p2) => {
        config[p2] = element.getAttribute(p2);
      });
    } else {
      Object.assign(config, element);
    }
    let pathArray = [];
    if (type === "circle") pathArray = getCirclePath(config);
    else if (type === "ellipse") pathArray = getEllipsePath(config);
    else if (["polyline", "polygon"].includes(type)) pathArray = getPolyPath(config);
    else if (type === "rect") pathArray = getRectanglePath(config);
    else if (type === "line") pathArray = getLinePath(config);
    else if (["glyph", "path"].includes(type)) {
      pathArray = parsePathString_default(targetIsElement ? element.getAttribute("d") || "" : element.d || "");
    }
    if (isPathArray_default(pathArray) && pathArray.length) {
      return pathArray;
    }
    return false;
  };
  var shapeToPathArray_default = shapeToPathArray;

  // src/process/roundPath.ts
  var roundPath = (path, roundOption) => {
    let { round } = options_default;
    if (roundOption === "off" || round === "off") return [...path];
    round = typeof roundOption === "number" && roundOption >= 0 ? roundOption : round;
    const pow = typeof round === "number" && round >= 1 ? 10 ** round : 1;
    return path.map((pi) => {
      const values = pi.slice(1).map(Number).map((n) => round ? Math.round(n * pow) / pow : Math.round(n));
      return [pi[0], ...values];
    });
  };
  var roundPath_default = roundPath;

  // src/convert/pathToString.ts
  var pathToString = (path, round) => {
    return roundPath_default(path, round).map((x2) => x2[0] + x2.slice(1).join(" ")).join("");
  };
  var pathToString_default = pathToString;

  // src/util/shapeToPath.ts
  var shapeToPath = (element, replace, ownerDocument) => {
    const doc = ownerDocument || document;
    const win = doc.defaultView || /* istanbul ignore next */
    window;
    const supportedShapes = Object.keys(shapeParams_default);
    const targetIsElement = element instanceof win.SVGElement;
    const tagName = targetIsElement ? element.tagName : null;
    if (tagName === "path") throw TypeError(`${error_default}: "${tagName}" is already SVGPathElement`);
    if (tagName && supportedShapes.every((s) => tagName !== s)) throw TypeError(`${error_default}: "${tagName}" is not SVGElement`);
    const path = doc.createElementNS("http://www.w3.org/2000/svg", "path");
    const type = targetIsElement ? tagName : element.type;
    const shapeAttrs = shapeParams_default[type];
    const config = { type };
    const round = options_default.round;
    const pathArray = shapeToPathArray_default(element, doc);
    const description = pathArray && pathArray.length ? pathToString_default(pathArray, round) : "";
    if (targetIsElement) {
      shapeAttrs.forEach((p2) => {
        config[p2] = element.getAttribute(p2);
      });
      Object.values(element.attributes).forEach(({ name, value }) => {
        if (!shapeAttrs.includes(name)) path.setAttribute(name, value);
      });
    } else {
      Object.assign(config, element);
      Object.keys(config).forEach((k) => {
        if (!shapeAttrs.includes(k) && k !== "type") {
          path.setAttribute(
            k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`),
            config[k]
          );
        }
      });
    }
    if (isValidPath_default(description)) {
      path.setAttribute("d", description);
      if (replace && targetIsElement) {
        element.before(path, element);
        element.remove();
      }
      return path;
    }
    return false;
  };
  var shapeToPath_default = shapeToPath;

  // src/process/splitPath.ts
  var splitPath = (pathInput) => {
    const composite = [];
    let path;
    let pi = -1;
    pathInput.forEach((seg) => {
      if (seg[0] === "M") {
        path = [seg];
        pi += 1;
      } else {
        path = [...path, seg];
      }
      composite[pi] = path;
    });
    return composite;
  };
  var splitPath_default = splitPath;

  // src/process/getSVGMatrix.ts
  var getSVGMatrix = (transform) => {
    let matrix = new y();
    const { origin } = transform;
    const [originX, originY] = origin;
    const { translate } = transform;
    const { rotate } = transform;
    const { skew } = transform;
    const { scale } = transform;
    if (Array.isArray(translate) && translate.length >= 2 && translate.every((x2) => !Number.isNaN(+x2)) && translate.some((x2) => x2 !== 0)) {
      matrix = matrix.translate(...translate);
    } else if (typeof translate === "number" && !Number.isNaN(translate)) {
      matrix = matrix.translate(translate);
    }
    if (rotate || skew || scale) {
      matrix = matrix.translate(originX, originY);
      if (Array.isArray(rotate) && rotate.length >= 2 && rotate.every((x2) => !Number.isNaN(+x2)) && rotate.some((x2) => x2 !== 0)) {
        matrix = matrix.rotate(...rotate);
      } else if (typeof rotate === "number" && !Number.isNaN(rotate)) {
        matrix = matrix.rotate(rotate);
      }
      if (Array.isArray(skew) && skew.length === 2 && skew.every((x2) => !Number.isNaN(+x2)) && skew.some((x2) => x2 !== 0)) {
        matrix = skew[0] ? matrix.skewX(skew[0]) : matrix;
        matrix = skew[1] ? matrix.skewY(skew[1]) : matrix;
      } else if (typeof skew === "number" && !Number.isNaN(skew)) {
        matrix = matrix.skewX(skew);
      }
      if (Array.isArray(scale) && scale.length >= 2 && scale.every((x2) => !Number.isNaN(+x2)) && scale.some((x2) => x2 !== 1)) {
        matrix = matrix.scale(...scale);
      } else if (typeof scale === "number" && !Number.isNaN(scale)) {
        matrix = matrix.scale(scale);
      }
      matrix = matrix.translate(-originX, -originY);
    }
    return matrix;
  };
  var getSVGMatrix_default = getSVGMatrix;

  // src/convert/pathToRelative.ts
  var pathToRelative = (pathInput) => {
    if (isRelativeArray_default(pathInput)) {
      return [...pathInput];
    }
    const path = parsePathString_default(pathInput);
    let x2 = 0;
    let y2 = 0;
    let mx = 0;
    let my = 0;
    return path.map((segment) => {
      const values = segment.slice(1).map(Number);
      const [pathCommand] = segment;
      const relativeCommand = pathCommand.toLowerCase();
      if (pathCommand === "M") {
        [x2, y2] = values;
        mx = x2;
        my = y2;
        return ["M", x2, y2];
      }
      let relativeSegment = [];
      if (pathCommand !== relativeCommand) {
        if (relativeCommand === "a") {
          relativeSegment = [
            relativeCommand,
            values[0],
            values[1],
            values[2],
            values[3],
            values[4],
            values[5] - x2,
            values[6] - y2
          ];
        } else if (relativeCommand === "v") {
          relativeSegment = [relativeCommand, values[0] - y2];
        } else if (relativeCommand === "h") {
          relativeSegment = [relativeCommand, values[0] - x2];
        } else {
          const relValues = values.map((n, j) => n - (j % 2 ? y2 : x2));
          relativeSegment = [relativeCommand, ...relValues];
        }
      } else {
        if (pathCommand === "m") {
          mx = values[0] + x2;
          my = values[1] + y2;
        }
        relativeSegment = [relativeCommand, ...values];
      }
      const segLength = relativeSegment.length;
      if (relativeCommand === "z") {
        x2 = mx;
        y2 = my;
      } else if (relativeCommand === "h") {
        x2 += relativeSegment[1];
      } else if (relativeCommand === "v") {
        y2 += relativeSegment[1];
      } else {
        x2 += relativeSegment[segLength - 2];
        y2 += relativeSegment[segLength - 1];
      }
      return relativeSegment;
    });
  };
  var pathToRelative_default = pathToRelative;

  // src/process/shortenSegment.ts
  var shortenSegment = (segment, normalSegment, params, prevCommand) => {
    const [pathCommand] = segment;
    const round4 = (n) => Math.round(n * 10 ** 4) / 10 ** 4;
    const segmentValues = segment.slice(1).map((n) => +n);
    const normalValues = normalSegment.slice(1).map((n) => +n);
    const { x1: px1, y1: py1, x2: px2, y2: py2, x: px, y: py } = params;
    let result = segment;
    const [x2, y2] = normalValues.slice(-2);
    if (!"TQ".includes(pathCommand)) {
      params.qx = null;
      params.qy = null;
    }
    if (["V", "H", "S", "T", "Z"].includes(pathCommand)) {
      result = [pathCommand, ...segmentValues];
    } else if (pathCommand === "L") {
      if (round4(px) === round4(x2)) {
        result = ["V", y2];
      } else if (round4(py) === round4(y2)) {
        result = ["H", x2];
      }
    } else if (pathCommand === "C") {
      const [x1, y1] = normalValues;
      if ("CS".includes(prevCommand) && (round4(x1) === round4(px1 * 2 - px2) && round4(y1) === round4(py1 * 2 - py2) || round4(px1) === round4(px2 * 2 - px) && round4(py1) === round4(py2 * 2 - py))) {
        result = ["S", ...normalValues.slice(-4)];
      }
      params.x1 = x1;
      params.y1 = y1;
    } else if (pathCommand === "Q") {
      const [qx, qy] = normalValues;
      params.qx = qx;
      params.qy = qy;
      if ("QT".includes(prevCommand) && (round4(qx) === round4(px1 * 2 - px2) && round4(qy) === round4(py1 * 2 - py2) || round4(px1) === round4(px2 * 2 - px) && round4(py1) === round4(py2 * 2 - py))) {
        result = ["T", ...normalValues.slice(-2)];
      }
    }
    return result;
  };
  var shortenSegment_default = shortenSegment;

  // src/process/optimizePath.ts
  var optimizePath = (pathInput, round) => {
    const path = pathToAbsolute_default(pathInput);
    const normalPath = normalizePath_default(path);
    const params = { ...paramsParser_default };
    const allPathCommands = [];
    const ii = path.length;
    let pathCommand = "";
    let prevCommand = "";
    let x2 = 0;
    let y2 = 0;
    let mx = 0;
    let my = 0;
    for (let i = 0; i < ii; i += 1) {
      [pathCommand] = path[i];
      allPathCommands[i] = pathCommand;
      if (i) prevCommand = allPathCommands[i - 1];
      path[i] = shortenSegment_default(path[i], normalPath[i], params, prevCommand);
      const segment = path[i];
      const seglen = segment.length;
      params.x1 = +segment[seglen - 2];
      params.y1 = +segment[seglen - 1];
      params.x2 = +segment[seglen - 4] || params.x1;
      params.y2 = +segment[seglen - 3] || params.y1;
      switch (pathCommand) {
        case "Z":
          x2 = mx;
          y2 = my;
          break;
        case "H":
          [, x2] = segment;
          break;
        case "V":
          [, y2] = segment;
          break;
        default:
          [x2, y2] = segment.slice(-2).map(Number);
          if (pathCommand === "M") {
            mx = x2;
            my = y2;
          }
      }
      params.x = x2;
      params.y = y2;
    }
    const absolutePath = roundPath_default(path, round);
    const relativePath = roundPath_default(pathToRelative_default(path), round);
    return absolutePath.map((a, i) => {
      if (i) {
        return a.join("").length < relativePath[i].join("").length ? a : relativePath[i];
      }
      return a;
    });
  };
  var optimizePath_default = optimizePath;

  // src/process/reverseCurve.ts
  var reverseCurve = (path) => {
    const rotatedCurve = path.slice(1).map(
      (x2, i, curveOnly) => !i ? [...path[0].slice(1), ...x2.slice(1)] : [...curveOnly[i - 1].slice(-2), ...x2.slice(1)]
    ).map((x2) => x2.map((_, i) => x2[x2.length - i - 2 * (1 - i % 2)])).reverse();
    return [["M", ...rotatedCurve[0].slice(0, 2)], ...rotatedCurve.map((x2) => ["C", ...x2.slice(2)])];
  };
  var reverseCurve_default = reverseCurve;

  // src/process/reversePath.ts
  var reversePath = (pathInput) => {
    const absolutePath = pathToAbsolute_default(pathInput);
    const isClosed = absolutePath.slice(-1)[0][0] === "Z";
    const reversedPath = normalizePath_default(absolutePath).map((segment, i) => {
      const [x2, y2] = segment.slice(-2).map(Number);
      return {
        seg: absolutePath[i],
        // absolute
        n: segment,
        // normalized
        c: absolutePath[i][0],
        // pathCommand
        x: x2,
        // x
        y: y2
        // y
      };
    }).map((seg, i, path) => {
      const segment = seg.seg;
      const data = seg.n;
      const prevSeg = i && path[i - 1];
      const nextSeg = path[i + 1];
      const pathCommand = seg.c;
      const pLen = path.length;
      const x2 = i ? path[i - 1].x : path[pLen - 1].x;
      const y2 = i ? path[i - 1].y : path[pLen - 1].y;
      let result = [];
      switch (pathCommand) {
        case "M":
          result = isClosed ? ["Z"] : [pathCommand, x2, y2];
          break;
        case "A":
          result = [pathCommand, ...segment.slice(1, -3), segment[5] === 1 ? 0 : 1, x2, y2];
          break;
        case "C":
          if (nextSeg && nextSeg.c === "S") {
            result = ["S", segment[1], segment[2], x2, y2];
          } else {
            result = [pathCommand, segment[3], segment[4], segment[1], segment[2], x2, y2];
          }
          break;
        case "S":
          if (prevSeg && "CS".includes(prevSeg.c) && (!nextSeg || nextSeg.c !== "S")) {
            result = ["C", data[3], data[4], data[1], data[2], x2, y2];
          } else {
            result = [pathCommand, data[1], data[2], x2, y2];
          }
          break;
        case "Q":
          if (nextSeg && nextSeg.c === "T") {
            result = ["T", x2, y2];
          } else {
            result = [pathCommand, ...segment.slice(1, -2), x2, y2];
          }
          break;
        case "T":
          if (prevSeg && "QT".includes(prevSeg.c) && (!nextSeg || nextSeg.c !== "T")) {
            result = ["Q", data[1], data[2], x2, y2];
          } else {
            result = [pathCommand, x2, y2];
          }
          break;
        case "Z":
          result = ["M", x2, y2];
          break;
        case "H":
          result = [pathCommand, x2];
          break;
        case "V":
          result = [pathCommand, y2];
          break;
        default:
          result = [pathCommand, ...segment.slice(1, -2), x2, y2];
      }
      return result;
    });
    return isClosed ? reversedPath.reverse() : [reversedPath[0], ...reversedPath.slice(1).reverse()];
  };
  var reversePath_default = reversePath;

  // src/process/projection2d.ts
  var translatePoint = (cssm, v2) => {
    let m = y.Translate(...v2.slice(0, -1));
    [, , , m.m44] = v2;
    m = cssm.multiply(m);
    return [m.m41, m.m42, m.m43, m.m44];
  };
  var projection2d = (m, point2D, origin) => {
    const [originX, originY, originZ] = origin;
    const [x2, y2, z2] = translatePoint(m, [...point2D, 0, 1]);
    const relativePositionX = x2 - originX;
    const relativePositionY = y2 - originY;
    const relativePositionZ = z2 - originZ;
    return [
      // protect against division by ZERO
      relativePositionX * (Math.abs(originZ) / Math.abs(relativePositionZ) || 1) + originX,
      relativePositionY * (Math.abs(originZ) / Math.abs(relativePositionZ) || 1) + originY
    ];
  };
  var projection2d_default = projection2d;

  // src/process/transformPath.ts
  var transformPath = (path, transform) => {
    let x2 = 0;
    let y2 = 0;
    let i;
    let j;
    let ii;
    let jj;
    let lx;
    let ly;
    const absolutePath = pathToAbsolute_default(path);
    const transformProps = transform && Object.keys(transform);
    if (!transform || transformProps && !transformProps.length) return [...absolutePath];
    const normalizedPath = normalizePath_default(absolutePath);
    if (!transform.origin) {
      const { origin: defaultOrigin } = options_default;
      Object.assign(transform, { origin: defaultOrigin });
    }
    const matrixInstance = getSVGMatrix_default(transform);
    const { origin } = transform;
    const params = { ...paramsParser_default };
    let segment = [];
    let seglen = 0;
    let pathCommand = "";
    let transformedPath = [];
    const allPathCommands = [];
    if (!matrixInstance.isIdentity) {
      for (i = 0, ii = absolutePath.length; i < ii; i += 1) {
        segment = absolutePath[i];
        if (absolutePath[i]) [pathCommand] = segment;
        allPathCommands[i] = pathCommand;
        if (pathCommand === "A") {
          segment = segmentToCubic_default(normalizedPath[i], params);
          absolutePath[i] = segmentToCubic_default(normalizedPath[i], params);
          fixArc_default(absolutePath, allPathCommands, i);
          normalizedPath[i] = segmentToCubic_default(normalizedPath[i], params);
          fixArc_default(normalizedPath, allPathCommands, i);
          ii = Math.max(absolutePath.length, normalizedPath.length);
        }
        segment = normalizedPath[i];
        seglen = segment.length;
        params.x1 = +segment[seglen - 2];
        params.y1 = +segment[seglen - 1];
        params.x2 = +segment[seglen - 4] || params.x1;
        params.y2 = +segment[seglen - 3] || params.y1;
        const result = {
          s: absolutePath[i],
          c: absolutePath[i][0],
          x: params.x1,
          y: params.y1
        };
        transformedPath = [...transformedPath, ...[result]];
      }
      return transformedPath.map((seg) => {
        pathCommand = seg.c;
        segment = seg.s;
        if (pathCommand === "L" || pathCommand === "H" || pathCommand === "V") {
          [lx, ly] = projection2d_default(matrixInstance, [seg.x, seg.y], origin);
          if (x2 !== lx && y2 !== ly) {
            segment = ["L", lx, ly];
          } else if (y2 === ly) {
            segment = ["H", lx];
          } else if (x2 === lx) {
            segment = ["V", ly];
          }
          x2 = lx;
          y2 = ly;
          return segment;
        } else {
          for (j = 1, jj = segment.length; j < jj; j += 2) {
            [x2, y2] = projection2d_default(matrixInstance, [+segment[j], +segment[j + 1]], origin);
            segment[j] = x2;
            segment[j + 1] = y2;
          }
          return segment;
        }
      });
    }
    return [...absolutePath];
  };
  var transformPath_default = transformPath;

  // src/process/splitCubic.ts
  var splitCubic = (pts) => {
    const t = (
      /* ratio || */
      0.5
    );
    const p0 = pts.slice(0, 2);
    const p1 = pts.slice(2, 4);
    const p2 = pts.slice(4, 6);
    const p3 = pts.slice(6, 8);
    const p4 = midPoint_default(p0, p1, t);
    const p5 = midPoint_default(p1, p2, t);
    const p6 = midPoint_default(p2, p3, t);
    const p7 = midPoint_default(p4, p5, t);
    const p8 = midPoint_default(p5, p6, t);
    const p9 = midPoint_default(p7, p8, t);
    return [
      ["C", ...p4, ...p7, ...p9],
      ["C", ...p8, ...p6, ...p3]
    ];
  };
  var splitCubic_default = splitCubic;

  // src/index.ts
  var SVGPathCommander = class {
    // bring main utilities to front
    static CSSMatrix = y;
    static getSVGMatrix = getSVGMatrix_default;
    static getPathBBox = getPathBBox_default;
    static getPathArea = getPathArea_default;
    static getTotalLength = getTotalLength_default;
    static getDrawDirection = getDrawDirection_default;
    static getPointAtLength = getPointAtLength_default;
    static pathLengthFactory = pathLengthFactory_default;
    static getPropertiesAtLength = getPropertiesAtLength_default;
    static getPropertiesAtPoint = getPropertiesAtPoint_default;
    static polygonLength = polygonLength_default;
    static polygonArea = polygonArea_default;
    static getClosestPoint = getClosestPoint_default;
    static getSegmentOfPoint = getSegmentOfPoint_default;
    static getSegmentAtLength = getSegmentAtLength_default;
    static isPointInStroke = isPointInStroke_default;
    static isValidPath = isValidPath_default;
    static isPathArray = isPathArray_default;
    static isAbsoluteArray = isAbsoluteArray_default;
    static isRelativeArray = isRelativeArray_default;
    static isCurveArray = isCurveArray_default;
    static isNormalizedArray = isNormalizedArray_default;
    static shapeToPath = shapeToPath_default;
    static shapeToPathArray = shapeToPathArray_default;
    static parsePathString = parsePathString_default;
    static roundPath = roundPath_default;
    static splitPath = splitPath_default;
    static splitCubic = splitCubic_default;
    static optimizePath = optimizePath_default;
    static reverseCurve = reverseCurve_default;
    static reversePath = reversePath_default;
    static normalizePath = normalizePath_default;
    static transformPath = transformPath_default;
    static pathToAbsolute = pathToAbsolute_default;
    static pathToRelative = pathToRelative_default;
    static pathToCurve = pathToCurve_default;
    static pathToString = pathToString_default;
    /**
     * @constructor
     * @param {string} pathValue the path string
     * @param {any} config instance options
     */
    constructor(pathValue, config) {
      const instanceOptions = config || {};
      const undefPath = typeof pathValue === "undefined";
      if (undefPath || !pathValue.length) {
        throw TypeError(`${error_default}: "pathValue" is ${undefPath ? "undefined" : "empty"}`);
      }
      const segments = parsePathString_default(pathValue);
      this.segments = segments;
      const { width, height, cx, cy, cz } = this.getBBox();
      const { round: roundOption, origin: originOption } = instanceOptions;
      let round;
      if (roundOption === "auto") {
        const pathScale = `${Math.floor(Math.max(width, height))}`.length;
        round = pathScale >= 4 ? 0 : 4 - pathScale;
      } else if (Number.isInteger(roundOption) || roundOption === "off") {
        round = roundOption;
      } else {
        round = options_default.round;
      }
      let origin;
      if (Array.isArray(originOption) && originOption.length >= 2) {
        const [originX, originY, originZ] = originOption.map(Number);
        origin = [
          !Number.isNaN(originX) ? originX : cx,
          !Number.isNaN(originY) ? originY : cy,
          !Number.isNaN(originZ) ? originZ : cz
        ];
      } else {
        origin = [cx, cy, cz];
      }
      this.round = round;
      this.origin = origin;
      return this;
    }
    /**
     * Returns the path bounding box, equivalent to native `path.getBBox()`.
     *
     * @public
     * @returns the pathBBox
     */
    getBBox() {
      return getPathBBox_default(this.segments);
    }
    /**
     * Returns the total path length, equivalent to native `path.getTotalLength()`.
     *
     * @public
     * @returns the path total length
     */
    getTotalLength() {
      return getTotalLength_default(this.segments);
    }
    /**
     * Returns an `{x,y}` point in the path stroke at a given length,
     * equivalent to the native `path.getPointAtLength()`.
     *
     * @public
     * @param length the length
     * @returns the requested point
     */
    getPointAtLength(length) {
      return getPointAtLength_default(this.segments, length);
    }
    /**
     * Convert path to absolute values
     *
     * @public
     */
    toAbsolute() {
      const { segments } = this;
      this.segments = pathToAbsolute_default(segments);
      return this;
    }
    /**
     * Convert path to relative values
     *
     * @public
     */
    toRelative() {
      const { segments } = this;
      this.segments = pathToRelative_default(segments);
      return this;
    }
    /**
     * Convert path to cubic-bezier values. In addition, un-necessary `Z`
     * segment is removed if previous segment extends to the `M` segment.
     *
     * @public
     */
    toCurve() {
      const { segments } = this;
      this.segments = pathToCurve_default(segments);
      return this;
    }
    /**
     * Reverse the order of the segments and their values.
     *
     * @param onlySubpath option to reverse all sub-paths except first
     * @public
     */
    reverse(onlySubpath) {
      this.toAbsolute();
      const { segments } = this;
      const split = splitPath_default(segments);
      const subPath = split.length > 1 ? split : false;
      const absoluteMultiPath = subPath ? [...subPath].map((x2, i) => {
        if (onlySubpath) {
          return i ? reversePath_default(x2) : [...x2];
        }
        return reversePath_default(x2);
      }) : [...segments];
      let path = [];
      if (subPath) {
        path = absoluteMultiPath.flat(1);
      } else {
        path = onlySubpath ? segments : reversePath_default(segments);
      }
      this.segments = [...path];
      return this;
    }
    /**
     * Normalize path in 2 steps:
     * * convert `pathArray`(s) to absolute values
     * * convert shorthand notation to standard notation
     *
     * @public
     */
    normalize() {
      const { segments } = this;
      this.segments = normalizePath_default(segments);
      return this;
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
      const { segments } = this;
      this.segments = optimizePath_default(segments, this.round);
      return this;
    }
    /**
     * Transform path using values from an `Object` defined as `transformObject`.
     *
     * @see TransformObject for a quick refference
     *
     * @param source a `transformObject`as described above
     * @public
     */
    transform(source) {
      if (!source || typeof source !== "object" || typeof source === "object" && !["translate", "rotate", "skew", "scale"].some((x2) => x2 in source))
        return this;
      const {
        segments,
        origin: [cx, cy, cz]
      } = this;
      const transform = {};
      for (const [k, v2] of Object.entries(source)) {
        if (k === "skew" && Array.isArray(v2)) {
          transform[k] = v2.map(Number);
        } else if ((k === "rotate" || k === "translate" || k === "origin" || k === "scale") && Array.isArray(v2)) {
          transform[k] = v2.map(Number);
        } else if (k !== "origin" && typeof Number(v2) === "number") transform[k] = Number(v2);
      }
      const { origin } = transform;
      if (Array.isArray(origin) && origin.length >= 2) {
        const [originX, originY, originZ] = origin.map(Number);
        transform.origin = [!Number.isNaN(originX) ? originX : cx, !Number.isNaN(originY) ? originY : cy, originZ || cz];
      } else {
        transform.origin = [cx, cy, cz];
      }
      this.segments = transformPath_default(segments, transform);
      return this;
    }
    /**
     * Rotate path 180deg vertically
     *
     * @public
     */
    flipX() {
      this.transform({ rotate: [0, 180, 0] });
      return this;
    }
    /**
     * Rotate path 180deg horizontally
     *
     * @public
     */
    flipY() {
      this.transform({ rotate: [180, 0, 0] });
      return this;
    }
    /**
     * Export the current path to be used
     * for the `d` (description) attribute.
     *
     * @public
     * @return the path string
     */
    toString() {
      return pathToString_default(this.segments, this.round);
    }
  };
  var src_default = SVGPathCommander;
  return __toCommonJS(src_exports);
})();