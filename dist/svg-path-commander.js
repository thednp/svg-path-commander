/*!
* SVGPathCommander v0.1.1 (http://thednp.github.io/svg-path-commander)
* Copyright 2021 © thednp
* Licensed under MIT (https://github.com/thednp/svg-path-commander/blob/master/LICENSE)
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.SVGPathCommander = factory());
}(this, (function () { 'use strict';

  var SVGPCO = {
    origin:null,
    decimals:3,
    round:1
  };

  function Translate(x, y, z){
    var m = new CSSMatrix();
    m.m41 = m.e = x;
    m.m42 = m.f = y;
    m.m43 = z;
    return m
  }
  function Rotate(rx, ry, rz){
    var m = new CSSMatrix();
    rx *= Math.PI / 180;
    ry *= Math.PI / 180;
    rz *= Math.PI / 180;
    var cosx = Math.cos(rx), sinx = -Math.sin(rx),
        cosy = Math.cos(ry), siny = -Math.sin(ry),
        cosz = Math.cos(rz), sinz = -Math.sin(rz);
    m.m11 = m.a = cosy * cosz;
    m.m12 = m.b = -cosy * sinz;
    m.m13 = siny;
    m.m21 = m.c = sinx * siny * cosz + cosx * sinz;
    m.m22 = m.d = cosx * cosz - sinx * siny * sinz;
    m.m23 = -sinx * cosy;
    m.m31 = sinx * sinz - cosx * siny * cosz;
    m.m32 = sinx * cosz + cosx * siny * sinz;
    m.m33 = cosx * cosy;
    return m
  }
  function RotateAxisAngle(x, y, z, angle){
    angle *= Math.PI / 360;
    var sinA = Math.sin(angle),
        cosA = Math.cos(angle),
        sinA2 = sinA * sinA,
        length = Math.sqrt(x * x + y * y + z * z);
    if (length === 0){
      x = 0;
      y = 0;
      z = 1;
    } else {
      x /= length;
      y /= length;
      z /= length;
    }
    var x2 = x * x, y2 = y * y, z2 = z * z;
    var m = new CSSMatrix();
    m.m11 = m.a = 1 - 2 * (y2 + z2) * sinA2;
    m.m12 = m.b = 2 * (x * y * sinA2 + z * sinA * cosA);
    m.m13 = 2 * (x * z * sinA2 - y * sinA * cosA);
    m.m21 = m.c = 2 * (y * x * sinA2 - z * sinA * cosA);
    m.m22 = m.d = 1 - 2 * (z2 + x2) * sinA2;
    m.m23 = 2 * (y * z * sinA2 + x * sinA * cosA);
    m.m31 = 2 * (z * x * sinA2 + y * sinA * cosA);
    m.m32 = 2 * (z * y * sinA2 - x * sinA * cosA);
    m.m33 = 1 - 2 * (x2 + y2) * sinA2;
    m.m14 = m.m24 = m.m34 = 0;
    m.m41 = m.e = m.m42 = m.f = m.m43 = 0;
    m.m44 = 1;
    return m
  }
  function Scale(x, y, z){
    var m = new CSSMatrix();
    m.m11 = m.a = x;
    m.m22 = m.d = y;
    m.m33 = z;
    return m
  }
  function SkewX(angle){
    angle *= Math.PI / 180;
    var m = new CSSMatrix();
    m.m21 = m.c = Math.tan(angle);
    return m
  }
  function SkewY(angle){
    angle *= Math.PI / 180;
    var m = new CSSMatrix();
    m.m12 = m.b = Math.tan(angle);
    return m
  }
  function Multiply(m1, m2){
    var m11 = m2.m11 * m1.m11 + m2.m12 * m1.m21 + m2.m13 * m1.m31 + m2.m14 * m1.m41,
        m12 = m2.m11 * m1.m12 + m2.m12 * m1.m22 + m2.m13 * m1.m32 + m2.m14 * m1.m42,
        m13 = m2.m11 * m1.m13 + m2.m12 * m1.m23 + m2.m13 * m1.m33 + m2.m14 * m1.m43,
        m14 = m2.m11 * m1.m14 + m2.m12 * m1.m24 + m2.m13 * m1.m34 + m2.m14 * m1.m44,
        m21 = m2.m21 * m1.m11 + m2.m22 * m1.m21 + m2.m23 * m1.m31 + m2.m24 * m1.m41,
        m22 = m2.m21 * m1.m12 + m2.m22 * m1.m22 + m2.m23 * m1.m32 + m2.m24 * m1.m42,
        m23 = m2.m21 * m1.m13 + m2.m22 * m1.m23 + m2.m23 * m1.m33 + m2.m24 * m1.m43,
        m24 = m2.m21 * m1.m14 + m2.m22 * m1.m24 + m2.m23 * m1.m34 + m2.m24 * m1.m44,
        m31 = m2.m31 * m1.m11 + m2.m32 * m1.m21 + m2.m33 * m1.m31 + m2.m34 * m1.m41,
        m32 = m2.m31 * m1.m12 + m2.m32 * m1.m22 + m2.m33 * m1.m32 + m2.m34 * m1.m42,
        m33 = m2.m31 * m1.m13 + m2.m32 * m1.m23 + m2.m33 * m1.m33 + m2.m34 * m1.m43,
        m34 = m2.m31 * m1.m14 + m2.m32 * m1.m24 + m2.m33 * m1.m34 + m2.m34 * m1.m44,
        m41 = m2.m41 * m1.m11 + m2.m42 * m1.m21 + m2.m43 * m1.m31 + m2.m44 * m1.m41,
        m42 = m2.m41 * m1.m12 + m2.m42 * m1.m22 + m2.m43 * m1.m32 + m2.m44 * m1.m42,
        m43 = m2.m41 * m1.m13 + m2.m42 * m1.m23 + m2.m43 * m1.m33 + m2.m44 * m1.m43,
        m44 = m2.m41 * m1.m14 + m2.m42 * m1.m24 + m2.m43 * m1.m34 + m2.m44 * m1.m44;
    return new CSSMatrix(
     [m11, m21, m31, m41,
      m12, m22, m32, m42,
      m13, m23, m33, m43,
      m14, m24, m34, m44])
  }
  function fromMatrix(m){
    return new CSSMatrix(
     [m.m11, m.m21, m.m31, m.m41,
      m.m12, m.m22, m.m32, m.m42,
      m.m13, m.m23, m.m33, m.m43,
      m.m14, m.m24, m.m34, m.m44])
  }
  function fromArray(a){
    return feedFromArray(new CSSMatrix(),a)
  }
  function feedFromArray(m,array){
    var a = Array.from(array);
    if (a.length == 16){
      m.m11 = m.a = a[0];
      m.m21 = m.c = a[1];
      m.m31 = a[2];
      m.m41 = m.e = a[3];
      m.m12 = m.b = a[4];
      m.m22 = m.d = a[5];
      m.m32 = a[6];
      m.m42 = m.f = a[7];
      m.m13 = a[8];
      m.m23 = a[9];
      m.m33 = a[10];
      m.m43 = a[11];
      m.m14 = a[12];
      m.m24 = a[13];
      m.m34 = a[14];
      m.m44 = a[15];
    } else if (a.length == 6) {
      m.m11 = m.a = a[0];
      m.m12 = m.b = a[1];
      m.m14 = m.e = a[4];
      m.m21 = m.c = a[2];
      m.m22 = m.d = a[3];
      m.m24 = m.f = a[5];
    } else {
      throw new TypeError("CSSMatrix: expecting a 6/16 values Array")
    }
    return m
  }
  var CSSMatrix = function CSSMatrix(){
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];
    this.setIdentity();
    return args && args.length && this.setMatrixValue(args)
  };
  var prototypeAccessors = { isIdentity: { configurable: true },is2D: { configurable: true } };
  CSSMatrix.prototype.setMatrixValue = function setMatrixValue (source){
    var m = this;
    if (!source || !source.length) {
      return m
    } else if (source.length && typeof source[0] === 'string' && source[0].length) {
      var string = String(source[0]).trim(), type = '', values = [];
      if (string == 'none') { return m; }
      type = string.slice(0, string.indexOf('('));
      values = string.slice((type === 'matrix' ? 7 : 9), -1).split(',')
                    .map(function (n){ return Math.abs(n) < 1e-6 ? 0 : +n; });
      if ([6,16].indexOf(values.length)>-1){
        feedFromArray(m,values);
      } else {
        throw new TypeError("CSSMatrix: expecting valid CSS matrix() / matrix3d() syntax")
      }
    } else if (source[0] instanceof CSSMatrix) {
      feedFromArray(m,source[0].toArray());
    } else if (Array.isArray(source[0])) {
      feedFromArray(m,source[0]);
    } else if (Array.isArray(source)) {
      feedFromArray(m,source);
    }
    return m
  };
  CSSMatrix.prototype.toString = function toString (){
    var m = this, type = m.is2D ? 'matrix' : 'matrix3d';
    return (type + "(" + (m.toArray(1).join(',')) + ")")
  };
  CSSMatrix.prototype.toArray = function toArray (transposed){
    var m = this;
    return m.is2D ? [ m.a, m.b, m.c, m.d, m.e, m.f ]
      : transposed
      ?[m.m11, m.m12, m.m13, m.m14,
        m.m21, m.m22, m.m23, m.m24,
        m.m31, m.m32, m.m33, m.m34,
        m.m41, m.m42, m.m43, m.m44]
      :[m.m11, m.m21, m.m31, m.m41,
        m.m12, m.m22, m.m32, m.m42,
        m.m13, m.m23, m.m33, m.m43,
        m.m14, m.m24, m.m34, m.m44]
  };
  CSSMatrix.prototype.multiply = function multiply (m2){
    return Multiply(this,m2)
  };
  CSSMatrix.prototype.translate = function translate (x, y, z){
    if (z == null) { z = 0; }
    if (y == null) { y = 0; }
    return Multiply(this,Translate(x, y, z))
  };
  CSSMatrix.prototype.scale = function scale (x, y, z){
    if (y == null) { y = x; }
    if (z == null) { z = x; }
    return Multiply(this,Scale(x, y, z))
  };
  CSSMatrix.prototype.rotate = function rotate (rx, ry, rz){
    if (ry == null) { ry = 0; }
    if (rz == null) {rz = rx; rx = 0;}
    return Multiply(this,Rotate(rx, ry, rz))
  };
  CSSMatrix.prototype.rotateAxisAngle = function rotateAxisAngle (x, y, z, angle){
    if (arguments.length!==4){
      throw new TypeError("CSSMatrix: expecting 4 values")
    }
    return Multiply(this,RotateAxisAngle(x, y, z, angle))
  };
  CSSMatrix.prototype.skewX = function skewX (angle){
    return Multiply(this,SkewX(angle))
  };
  CSSMatrix.prototype.skewY = function skewY (angle){
    return Multiply(this,SkewY(angle))
  };
  CSSMatrix.prototype.setIdentity = function setIdentity (){
    var identity = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
    return feedFromArray(this,identity)
  };
  prototypeAccessors.isIdentity.get = function (){
    var m = this;
    return (m.m11 == 1 && m.m12 == 0 && m.m13 == 0 && m.m14 == 0 &&
            m.m21 == 0 && m.m22 == 1 && m.m23 == 0 && m.m24 == 0 &&
            m.m31 == 0 && m.m32 == 0 && m.m33 == 1 && m.m34 == 0 &&
            m.m41 == 0 && m.m42 == 0 && m.m43 == 0 && m.m44 == 1)
  };
  prototypeAccessors.isIdentity.set = function (value){
    this.isIdentity = value;
  };
  prototypeAccessors.is2D.get = function (){
    var m = this;
    return (m.m31 == 0 && m.m32 == 0 && m.m33 == 1 && m.m34 == 0 && m.m43 == 0 && m.m44 == 1)
  };
  prototypeAccessors.is2D.set = function (value){
    this.is2D = value;
  };
  CSSMatrix.prototype.transformPoint = function transformPoint (v){
    var _m = this, m = Translate(v.x, v.y, v.z);
    m.m44 = v.w || 1;
    m = _m.multiply(m);
    return {
      x: m.m41,
      y: m.m42,
      z: m.m43,
      w: m.m44
    }
  };
  CSSMatrix.prototype.transform = function transform (t){
  		var m = this,
        x = m.m11 * t.x + m.m12 * t.y + m.m13 * t.z + m.m14 * t.w,
        y = m.m21 * t.x + m.m22 * t.y + m.m23 * t.z + m.m24 * t.w,
        z = m.m31 * t.x + m.m32 * t.y + m.m33 * t.z + m.m34 * t.w,
        w = m.m41 * t.x + m.m42 * t.y + m.m43 * t.z + m.m44 * t.w;
  		return {
      x: x / w,
      y: y / w,
      z: z / w,
      w : w
    }
  };
  Object.defineProperties( CSSMatrix.prototype, prototypeAccessors );
  CSSMatrix.Translate = Translate;
  CSSMatrix.Rotate = Rotate;
  CSSMatrix.RotateAxisAngle = RotateAxisAngle;
  CSSMatrix.Scale = Scale;
  CSSMatrix.SkewX = SkewX;
  CSSMatrix.SkewY = SkewY;
  CSSMatrix.Multiply = Multiply;
  CSSMatrix.fromMatrix = fromMatrix;
  CSSMatrix.fromArray = fromArray;
  CSSMatrix.feedFromArray = feedFromArray;

  var CSS3Matrix = typeof DOMMatrix !== 'undefined' ? DOMMatrix : CSSMatrix;

  function clonePath(pathArray){
    return pathArray.map(function (x) { return Array.isArray(x)
      ? clonePath(x)
      : !isNaN(+x) ? +x : x; } )
  }

  function roundPath(pathArray,round) {
    var decimalsOption = !isNaN(+round) ? +round : SVGPCO.round && SVGPCO.decimals;
    return decimalsOption ?
      pathArray.map( function (seg) { return seg.map(function (c,i) {
        var nr = +c, dc = Math.pow(10,decimalsOption);
        return nr ? (nr % 1 === 0 ? nr : Math.round(nr*dc)/dc) : c
      }
    ); }) : clonePath(pathArray)
  }

  function fixArc(pathArray, allPathCommands, i) {
    if (pathArray[i].length > 7) {
      pathArray[i].shift();
      var pi = pathArray[i];
      while (pi.length) {
        allPathCommands[i] = "A";
        pathArray.splice(i++, 0, ["C"].concat(pi.splice(0, 6)));
      }
      pathArray.splice(i, 1);
    }
  }

  var paramsCount = { a: 7, c: 6, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, z: 0 };

  function isPathArray(pathArray){
    return Array.isArray(pathArray) && pathArray.every(function (seg){
      var pathCommand = seg[0].toLowerCase();
      return paramsCount[pathCommand] === seg.length - 1 && /[achlmrqstvz]/g.test(pathCommand)
    })
  }

  function isCurveArray(pathArray){
    return isPathArray(pathArray) && pathArray.slice(1).every(function (seg){ return seg[0] === 'C'; })
  }

  function finalizeSegment(state) {
    var pathCommand = state.pathValue[state.segmentStart],
        pathComLK = pathCommand.toLowerCase(),
        params = state.data;
    if (pathComLK === 'm' && params.length > 2) {
      state.segments.push([ pathCommand, params[0], params[1] ]);
      params = params.slice(2);
      pathComLK = 'l';
      pathCommand = (pathCommand === 'm') ? 'l' : 'L';
    }
    if (pathComLK === 'r') {
      state.segments.push([ pathCommand ].concat(params));
    } else {
      while (params.length >= paramsCount[pathComLK]) {
        state.segments.push([ pathCommand ].concat(params.splice(0, paramsCount[pathComLK])));
        if (!paramsCount[pathComLK]) {
          break;
        }
      }
    }
  }

  var invalidPathValue = 'Invalid path value';

  function scanFlag(state) {
    var ch = state.pathValue.charCodeAt(state.index);
    if (ch === 0x30) {
      state.param = 0;
      state.index++;
      return;
    }
    if (ch === 0x31) {
      state.param = 1;
      state.index++;
      return;
    }
    state.err = invalidPathValue + ": invalid Arc flag " + ch;
  }

  function isDigit(code) {
    return (code >= 48 && code <= 57);
  }

  function scanParam(state) {
    var start = state.index,
        index = start,
        max = state.max,
        zeroFirst = false,
        hasCeiling = false,
        hasDecimal = false,
        hasDot = false,
        ch;
    if (index >= max) {
      state.err = invalidPathValue + ": missing param " + (state.pathValue[index]);
      return;
    }
    ch = state.pathValue.charCodeAt(index);
    if (ch === 0x2B || ch === 0x2D) {
      index++;
      ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;
    }
    if (!isDigit(ch) && ch !== 0x2E) {
      state.err = invalidPathValue + ": " + (state.pathValue[index]) + " not number";
      return;
    }
    if (ch !== 0x2E) {
      zeroFirst = (ch === 0x30);
      index++;
      ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;
      if (zeroFirst && index < max) {
        if (ch && isDigit(ch)) {
          state.err = invalidPathValue + ": " + (state.pathValue[start]) + " illegal number";
          return;
        }
      }
      while (index < max && isDigit(state.pathValue.charCodeAt(index))) {
        index++;
        hasCeiling = true;
      }
      ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;
    }
    if (ch === 0x2E) {
      hasDot = true;
      index++;
      while (isDigit(state.pathValue.charCodeAt(index))) {
        index++;
        hasDecimal = true;
      }
      ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;
    }
    if (ch === 0x65 || ch === 0x45) {
      if (hasDot && !hasCeiling && !hasDecimal) {
        state.err = invalidPathValue + ": " + (state.pathValue[index]) + " invalid float exponent";
        return;
      }
      index++;
      ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;
      if (ch === 0x2B || ch === 0x2D) {
        index++;
      }
      if (index < max && isDigit(state.pathValue.charCodeAt(index))) {
        while (index < max && isDigit(state.pathValue.charCodeAt(index))) {
          index++;
        }
      } else {
        state.err = invalidPathValue + ": " + (state.pathValue[index]) + " invalid float exponent";
        return;
      }
    }
    state.index = index;
    state.param = +state.pathValue.slice(start, index);
  }

  function isSpace(ch) {
    var specialSpaces = [
      0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006,
      0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF ];
    return (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029) ||
      (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0) ||
      (ch >= 0x1680 && specialSpaces.indexOf(ch) >= 0);
  }

  function skipSpaces(state) {
    while (state.index < state.max && isSpace(state.pathValue.charCodeAt(state.index))) {
      state.index++;
    }
  }

  function isPathCommand(code) {
    switch (code | 0x20) {
      case 0x6D:
      case 0x7A:
      case 0x6C:
      case 0x68:
      case 0x76:
      case 0x63:
      case 0x73:
      case 0x71:
      case 0x74:
      case 0x61:
      case 0x72:
        return true;
    }
    return false;
  }

  function isDigitStart(code) {
    return (code >= 48 && code <= 57) ||
            code === 0x2B ||
            code === 0x2D ||
            code === 0x2E;
  }

  function isArcCommand(code) {
    return (code | 0x20) === 0x61;
  }

  function scanSegment(state) {
    var max = state.max, cmdCode, comma_found, need_params, i;
    state.segmentStart = state.index;
    cmdCode = state.pathValue.charCodeAt(state.index);
    if (!isPathCommand(cmdCode)) {
      state.err = invalidPathValue + ": " + (state.pathValue[state.index]) + " not a path command";
      return;
    }
    need_params = paramsCount[state.pathValue[state.index].toLowerCase()];
    state.index++;
    skipSpaces(state);
    state.data = [];
    if (!need_params) {
      finalizeSegment(state);
      return;
    }
    comma_found = false;
    for (;;) {
      for (i = need_params; i > 0; i--) {
        if (isArcCommand(cmdCode) && (i === 3 || i === 4)) { scanFlag(state); }
        else { scanParam(state); }
        if (state.err.length) {
          return;
        }
        state.data.push(state.param);
        skipSpaces(state);
        comma_found = false;
        if (state.index < max && state.pathValue.charCodeAt(state.index) === 0x2C) {
          state.index++;
          skipSpaces(state);
          comma_found = true;
        }
      }
      if (comma_found) {
        continue;
      }
      if (state.index >= state.max) {
        break;
      }
      if (!isDigitStart(state.pathValue.charCodeAt(state.index))) {
        break;
      }
    }
    finalizeSegment(state);
  }

  function SVGPathArray(pathString){
    this.segments = [];
    this.pathValue = pathString;
    this.max = pathString.length;
    this.index  = 0;
    this.param = 0.0;
    this.segmentStart = 0;
    this.data = [];
    this.err = '';
    return this
  }

  function parsePathString(pathString,round) {
    if ( isPathArray(pathString) ) {
      return clonePath(pathString)
    }
    var state = new SVGPathArray(pathString);
    skipSpaces(state);
    while (state.index < state.max && !state.err.length) {
      scanSegment(state);
    }
    if (state.err.length) {
      state.segments = [];
    } else if (state.segments.length) {
      if ('mM'.indexOf(state.segments[0][0]) < 0) {
        state.err = invalidPathValue + ": missing M/m";
        state.segments = [];
      } else {
        state.segments[0][0] = 'M';
      }
    }
    return roundPath(state.segments,round)
  }

  function isAbsoluteArray(pathInput){
    return isPathArray(pathInput) && pathInput.every(function (x){ return x[0] === x[0].toUpperCase(); })
  }

  function pathToAbsolute(pathArray,round) {
    if (isAbsoluteArray(pathArray)) {
      return clonePath(pathArray)
    }
    pathArray = parsePathString(pathArray);
    var resultArray = [],
        x = 0, y = 0, mx = 0, my = 0,
        start = 0, ii = pathArray.length,
        pathCommand = '', segment = [], segLength = 0,
        absoluteSegment = [];
    if (pathArray[0][0] === "M") {
      x = +pathArray[0][1];
      y = +pathArray[0][2];
      mx = x;
      my = y;
      start++;
      resultArray[0] = ["M", x, y];
    }
    for (var i = start; i < ii; i++) {
      segment = pathArray[i];
      pathCommand = segment[0];
      resultArray.push(absoluteSegment = []);
      if (pathCommand !== pathCommand.toUpperCase()) {
        absoluteSegment[0] = pathCommand.toUpperCase();
        switch (absoluteSegment[0]) {
          case "A":
            segment.slice(1,-2)
                   .concat([+segment[6] + x, +segment[7] + y])
                   .map(function (s){ return absoluteSegment.push(s); });
            break;
          case "V":
            absoluteSegment[1] = +segment[1] + y;
            break;
          case "H":
            absoluteSegment[1] = +segment[1] + x;
            break;
          case "M":
            mx = +segment[1] + x;
            my = +segment[2] + y;
          default:
            segment.map(function (s,j){ return j && absoluteSegment.push(+s + ((j % 2) ? x : y)); });
        }
      } else {
        segment.map(function (k){ return absoluteSegment.push(k); });
      }
      segLength = absoluteSegment.length;
      switch (absoluteSegment[0]) {
        case "Z":
          x = mx;
          y = my;
          break;
        case "H":
          x = +absoluteSegment[1];
          break;
        case "V":
          y = +absoluteSegment[1];
          break;
        case "M":
          mx = +absoluteSegment[segLength - 2];
          my = +absoluteSegment[segLength - 1];
        default:
          x = +absoluteSegment[segLength - 2];
          y = +absoluteSegment[segLength - 1];
      }
    }
    return roundPath(resultArray,round)
  }

  function shorthandToQuad(x1,y1,qx,qy,prevCommand){
    return 'QT'.indexOf(prevCommand)>-1 ? { qx: x1 * 2 - qx, qy: y1 * 2 - qy}
                                        : { qx: x1, qy: y1 }
  }

  function shorthandToCubic(x1,y1,x2,y2,prevCommand){
    return 'CS'.indexOf(prevCommand)>-1 ? { x1: x1 * 2 - x2, y1: y1 * 2 - y2}
                                        : { x1: x1, y1: y1 }
  }

  function normalizeSegment(segment, params, prevCommand) {
    var nqxy, nxy;
    'TQ'.indexOf(segment[0])<0 && (params.qx = params.qy = null);
    switch (segment[0]) {
      case "H":
        return ["L", segment[1], params.y1]
      case "V":
        return ["L", params.x1, segment[1]]
      case "S":
        nxy = shorthandToCubic(params.x1,params.y1, params.x2,params.y2, prevCommand);
        params.x1 = nxy.x1;
        params.y1 = nxy.y1;
        return ["C", nxy.x1, nxy.y1].concat(segment.slice(1))
      case "T":
        nqxy = shorthandToQuad(params.x1,params.y1, params.qx, params.qy, prevCommand);
        params.qx = nqxy.qx;
        params.qy = nqxy.qy;
        return ["Q", params.qx, params.qy].concat(segment.slice(1))
      case "Q":
        params.qx = segment[1];
        params.qy = segment[2];
    }
    return segment
  }

  function isNormalizedArray(pathArray){
    return Array.isArray(pathArray) && pathArray.every(function (seg){
      var pathCommand = seg[0].toLowerCase();
      return paramsCount[pathCommand] === seg.length - 1 && /[ACLMQZ]/.test(seg[0])
    })
  }

  function normalizePath(pathArray,round) {
    if (isNormalizedArray(pathArray)) {
      return clonePath(pathArray)
    }
    pathArray = pathToAbsolute(pathArray);
    var params = {x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0, qx: null, qy: null},
        allPathCommands = [], pathCommand = '', prevCommand = '',
        ii = pathArray.length, segment, seglen;
    for (var i = 0; i < ii; i++) {
      pathCommand = pathArray[i][0];
      allPathCommands[i] = pathCommand;
      i && ( prevCommand = allPathCommands[i - 1]);
      pathArray[i] = normalizeSegment(pathArray[i], params, prevCommand);
      segment = pathArray[i];
      seglen = segment.length;
      params.x1 = +segment[seglen - 2];
      params.y1 = +segment[seglen - 1];
      params.x2 = +(segment[seglen - 4]) || params.x1;
      params.y2 = +(segment[seglen - 3]) || params.y1;
    }
    return roundPath(pathArray,round)
  }

  function rotateVector(x, y, rad) {
    var X = x * Math.cos(rad) - y * Math.sin(rad),
        Y = x * Math.sin(rad) + y * Math.cos(rad);
    return {x: X, y: Y}
  }

  function arcToCubic(x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
    var _120 = Math.PI * 120 / 180,
        rad = Math.PI / 180 * (angle || 0),
        res = [], xy, f1, f2, cx, cy;
    if (!recursive) {
      xy = rotateVector(x1, y1, -rad);
      x1 = xy.x; y1 = xy.y;
      xy = rotateVector(x2, y2, -rad);
      x2 = xy.x; y2 = xy.y;
      var x = (x1 - x2) / 2,
          y = (y1 - y2) / 2,
          h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
      if (h > 1) {
        h = Math.sqrt(h);
        rx = h * rx;
        ry = h * ry;
      }
      var rx2 = rx * rx,
          ry2 = ry * ry,
          k = (large_arc_flag == sweep_flag ? -1 : 1)
            * Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x)
            / (rx2 * y * y + ry2 * x * x)));
      cx = k * rx * y / ry + (x1 + x2) / 2;
      cy = k * -ry * x / rx + (y1 + y2) / 2;
      f1 = Math.asin( ((y1 - cy) / ry).toFixed(9) );
      f2 = Math.asin( ((y2 - cy) / ry).toFixed(9) );
      f1 = x1 < cx ? Math.PI - f1 : f1;
      f2 = x2 < cx ? Math.PI - f2 : f2;
      f1 < 0 && (f1 = Math.PI * 2 + f1);
      f2 < 0 && (f2 = Math.PI * 2 + f2);
      if (sweep_flag && f1 > f2) {
        f1 = f1 - Math.PI * 2;
      }
      if (!sweep_flag && f2 > f1) {
        f2 = f2 - Math.PI * 2;
      }
    } else {
      f1 = recursive[0];
      f2 = recursive[1];
      cx = recursive[2];
      cy = recursive[3];
    }
    var df = f2 - f1;
    if (Math.abs(df) > _120) {
      var f2old = f2, x2old = x2, y2old = y2;
      f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
      x2 = cx + rx * Math.cos(f2);
      y2 = cy + ry * Math.sin(f2);
      res = arcToCubic(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
    }
    df = f2 - f1;
    var c1 = Math.cos(f1),
        s1 = Math.sin(f1),
        c2 = Math.cos(f2),
        s2 = Math.sin(f2),
        t = Math.tan(df / 4),
        hx = 4 / 3 * rx * t,
        hy = 4 / 3 * ry * t,
        m1 = [x1, y1],
        m2 = [x1 + hx * s1, y1 - hy * c1],
        m3 = [x2 + hx * s2, y2 - hy * c2],
        m4 = [x2, y2];
    m2[0] = 2 * m1[0] - m2[0];
    m2[1] = 2 * m1[1] - m2[1];
    if (recursive) {
      return [m2, m3, m4].concat(res);
    } else {
      res = [m2, m3, m4].concat(res).join().split(",");
      return res.map(function (rz,i){ return i % 2 ? rotateVector(res[i - 1], rz, rad).y : rotateVector(rz, res[i + 1], rad).x; });
    }
  }

  function quadToCubic (x1, y1, qx, qy, x2, y2) {
    var _13 = 1 / 3, _23 = 2 / 3;
    return [
            _13 * x1 + _23 * qx,
            _13 * y1 + _23 * qy,
            _13 * x2 + _23 * qx,
            _13 * y2 + _23 * qy,
            x2, y2 ]
  }

  function getPointAtSegLength (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
    var t1 = 1 - t;
    return {
        x: Math.pow(t1, 3) * p1x + Math.pow(t1, 2) * 3 * t * c1x + t1 * 3 * t * t * c2x + Math.pow(t, 3) * p2x,
        y: Math.pow(t1, 3) * p1y + Math.pow(t1, 2) * 3 * t * c1y + t1 * 3 * t * t * c2y + Math.pow(t, 3) * p2y
    };
  }

  function midPoint(a, b, t) {
    var ax = a[0], ay = a[1], bx = b[0], by = b[1];
    return [ ax + (bx - ax) * t, ay + (by - ay) * t];
  }

  function lineToCubic(x1, y1, x2, y2) {
    var t = 0.5,
        p0 = [x1,y1],
        p1 = [x2,y2],
        p2 = midPoint(p0, p1, t),
        p3 = midPoint(p1, p2, t),
        p4 = midPoint(p2, p3, t),
        p5 = midPoint(p3, p4, t),
        p6 = midPoint(p4, p5, t),
        cp1 = getPointAtSegLength.apply(0, p0.concat( p2, p4, p6, t)),
        cp2 = getPointAtSegLength.apply(0, p6.concat( p5, p3, p1, 0));
    return [cp1.x, cp1.y, cp2.x, cp2.y, x2, y2]
  }

  function segmentToCubic(segment, params) {
    'TQ'.indexOf(segment[0])<0 && (params.qx = params.qy = null);
    switch (segment[0]) {
      case 'M':
        params.x = segment[1];
        params.y = segment[2];
        return segment
      case 'A':
        return ['C'].concat(arcToCubic.apply(0, [params.x1, params.y1].concat(segment.slice(1))))
      case 'Q':
        params.qx = segment[1];
        params.qy = segment[2];
        return ['C'].concat(quadToCubic.apply(0, [params.x1, params.y1].concat(segment.slice(1))))
      case 'L':
        return ['C'].concat(lineToCubic(params.x1, params.y1, segment[1], segment[2]))
      case 'Z':
        return ['C'].concat(lineToCubic(params.x1, params.y1, params.x, params.y))
    }
    return segment
  }

  function pathToCurve(pathArray,round) {
    if (isCurveArray(pathArray)){
      return clonePath(pathArray)
    }
    pathArray = normalizePath(pathArray);
    var params = {x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0, qx: null, qy: null},
        allPathCommands = [], pathCommand = '',
        ii = pathArray.length, segment, seglen;
    for (var i = 0; i < ii; i++) {
      pathArray[i] && (pathCommand = pathArray[i][0]);
      allPathCommands[i] = pathCommand;
      pathArray[i] = segmentToCubic(pathArray[i], params);
      fixArc(pathArray,allPathCommands,i);
      ii = pathArray.length;
      segment = pathArray[i];
      seglen = segment.length;
      params.x1 = +segment[seglen - 2];
      params.y1 = +segment[seglen - 1];
      params.x2 = +(segment[seglen - 4]) || params.x1;
      params.y2 = +(segment[seglen - 3]) || params.y1;
    }
    return roundPath(pathArray,round)
  }

  function getCubicSegArea(x0,y0, x1,y1, x2,y2, x3,y3) {
    return 3 * ((y3 - y0) * (x1 + x2) - (x3 - x0) * (y1 + y2)
             + y1 * (x0 - x2) - x1 * (y0 - y2)
             + y3 * (x2 + x0 / 3) - x3 * (y2 + y0 / 3)) / 20;
  }
  function getPathArea(pathArray) {
    var x = 0, y = 0, mx = 0, my = 0, len = 0;
    return pathToCurve(pathArray).map(function (seg) {
      var assign;
      switch (seg[0]){
        case 'M':
        case 'Z':
          mx = seg[0] === 'M' ? seg[1] : mx;
          my = seg[0] === 'M' ? seg[2] : my;
          x = mx;
          y = my;
          return 0
        default:
          len = getCubicSegArea.apply(0, [x,y].concat(seg.slice(1) ));
          (assign = seg.slice(-2), x = assign[0], y = assign[1]);
          return len
      }
    }).reduce(function (a, b) { return a + b; }, 0)
  }

  function base3(p1, p2, p3, p4, t) {
    var t1 = -3 * p1 + 9 * p2 - 9 * p3 + 3 * p4,
        t2 = t * t1 + 6 * p1 - 12 * p2 + 6 * p3;
    return t * t2 - 3 * p1 + 3 * p2;
  }
  function getSegCubicLength (x1, y1, x2, y2, x3, y3, x4, y4, z) {
    (z === null || isNaN(+z)) && (z = 1);
    z = z > 1 ? 1 : z < 0 ? 0 : z;
    var z2 = z / 2, ct = 0, xbase = 0, ybase = 0, sum = 0,
        Tvalues = [-0.1252,0.1252,-0.3678,0.3678,-0.5873,0.5873,-0.7699,0.7699,-0.9041,0.9041,-0.9816,0.9816],
        Cvalues = [0.2491,0.2491,0.2335,0.2335,0.2032,0.2032,0.1601,0.1601,0.1069,0.1069,0.0472,0.0472];
    Tvalues.map(function (T,i){
      ct = z2 * T + z2;
      xbase = base3( x1, x2, x3, x4, ct);
      ybase = base3( y1, y2, y3, y4, ct);
      sum += Cvalues[i] * Math.sqrt(xbase * xbase + ybase * ybase);
    });
    return z2 * sum
  }

  function getPathLength(pathArray){
    var totalLength = 0;
    pathToCurve(pathArray).map(function (s,i,curveArray) {
      totalLength += 'M' !== s[0] ? getSegCubicLength.apply(0, curveArray[i-1].slice(-2).concat(s.slice(1)) ) : 0;
    });
    return totalLength
  }

  function getDrawDirection(pathArray) {
    return getPathArea(pathToCurve(pathArray)) >= 0
  }

  function getPointAtLength(pathArray,length){
    var totalLength = 0, segLen, data;
    return pathToCurve(pathArray).map(function (seg,i,curveArray) {
      data = i ? curveArray[i-1].slice(-2).concat(seg.slice(1)) : seg.slice(1);
      segLen = i ? getSegCubicLength.apply(0, data) : 0;
      totalLength += segLen;
      return i === 0 ? {x:data[0], y:data[1]} :
             totalLength>length && length>totalLength-segLen ?
                getPointAtSegLength.apply(0,data.concat(1 - (totalLength-length)/segLen)) : null
    }).filter(function (x){ return x; }).slice(-1)[0]
  }

  function getCubicSize(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
    var a = (c2x - 2 * c1x + p1x) - (p2x - 2 * c2x + c1x),
        b = 2 * (c1x - p1x) - 2 * (c2x - c1x),
        c = p1x - c1x,
        t1 = (-b + Math.sqrt(b * b - 4 * a * c)) / 2 / a,
        t2 = (-b - Math.sqrt(b * b - 4 * a * c)) / 2 / a,
        y = [p1y, p2y],
        x = [p1x, p2x],
        dot;
    Math.abs(t1) > "1e12" && (t1 = .5);
    Math.abs(t2) > "1e12" && (t2 = .5);
    if (t1 > 0 && t1 < 1) {
      dot = getPointAtSegLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
      x.push(dot.x);
      y.push(dot.y);
    }
    if (t2 > 0 && t2 < 1) {
      dot = getPointAtSegLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
      x.push(dot.x);
      y.push(dot.y);
    }
    a = (c2y - 2 * c1y + p1y) - (p2y - 2 * c2y + c1y);
    b = 2 * (c1y - p1y) - 2 * (c2y - c1y);
    c = p1y - c1y;
    t1 = (-b + Math.sqrt(b * b - 4 * a * c)) / 2 / a;
    t2 = (-b - Math.sqrt(b * b - 4 * a * c)) / 2 / a;
    Math.abs(t1) > "1e12" && (t1 = .5);
    Math.abs(t2) > "1e12" && (t2 = .5);
    if (t1 > 0 && t1 < 1) {
      dot = getPointAtSegLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
      x.push(dot.x);
      y.push(dot.y);
    }
    if (t2 > 0 && t2 < 1) {
      dot = getPointAtSegLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
      x.push(dot.x);
      y.push(dot.y);
    }
    return {
      min: {x: Math.min.apply(0, x), y: Math.min.apply(0, y)},
      max: {x: Math.max.apply(0, x), y: Math.max.apply(0, y)}
    }
  }

  function getPathBBox(pathArray) {
    if (!pathArray) {
      return {x: 0, y: 0, width: 0, height: 0, x2: 0, y2: 0};
    }
    pathArray = pathToCurve(pathArray);
    var x = 0, y = 0, X = [], Y = [];
    pathArray.map(function (segment){
      if (segment[0] === "M") {
        x = segment[1];
        y = segment[2];
        X.push(x);
        Y.push(y);
      } else {
        var dim = getCubicSize.apply(0, [x, y].concat(segment.slice(1)));
        X = X.concat(dim.min.x, dim.max.x);
        Y = Y.concat(dim.min.y, dim.max.y);
        x = segment[5];
        y = segment[6];
      }
    });
    var xTop = Math.min.apply(0, X), yTop = Math.min.apply(0, Y),
        xBot = Math.max.apply(0, X), yBot = Math.max.apply(0, Y),
        width = xBot - xTop, height = yBot - yTop;
    return {
      x: xTop, y: yTop,
      x2: xBot, y2: yBot,
      width: width, height: height,
      cx: xTop + width / 2,
      cy: yTop + height / 2
    }
  }

  function isRelativeArray(pathInput){
    return isPathArray(pathInput) && pathInput.slice(1).every(function (seg){ return seg[0] === seg[0].toLowerCase(); })
  }

  function pathToString(pathArray) {
    return pathArray.map(function (x){ return x[0].concat(x.slice(1).join(' ')); }).join('')
  }

  function splitPath(pathInput) {
    return pathToString(pathToAbsolute(pathInput,0))
      .replace( /(m|M)/g, "|$1")
      .split('|')
      .map(function (s){ return s.trim(); })
      .filter(function (s){ return s; })
  }

  function pathToRelative (pathArray,round) {
    if (isRelativeArray(pathArray)){
      return clonePath(pathArray)
    }
    pathArray = parsePathString(pathArray);
    var resultArray = [], segLength = 0,
        x = 0, y = 0, mx = 0, my = 0,
        segment = [], pathCommand = '', relativeSegment = [],
        start = 0, ii = pathArray.length;
    if (pathArray[0][0] === "M") {
      x = +pathArray[0][1];
      y = +pathArray[0][2];
      mx = x;
      my = y;
      start++;
      resultArray.push(["M", x, y]);
    }
    var loop = function ( i ) {
      segment = pathArray[i];
      pathCommand = segment[0];
      resultArray.push(relativeSegment = []);
      if (pathCommand !== pathCommand.toLowerCase() ) {
        relativeSegment[0] = pathCommand.toLowerCase();
        switch (relativeSegment[0]) {
          case "a":
            segment.slice(1,-2)
                   .concat([+segment[6] - x, +segment[7] - y])
                   .map(function (s){ return relativeSegment.push(s); });
            break;
          case "v":
            relativeSegment[1] = +segment[1] - y;
            break;
          case "m":
            mx = +segment[1];
            my = +segment[2];
          default:
            segment.map(function (s,j){ return j && relativeSegment.push(+s - ((j % 2) ? x : y)); });
        }
      } else {
        relativeSegment = [];
        resultArray[i] = relativeSegment;
        if (pathCommand === "m") {
          mx = +segment[1] + x;
          my = +segment[2] + y;
        }
        segment.map(function (s){ return resultArray[i].push(s); });
      }
      segLength = resultArray[i].length;
      switch (resultArray[i][0]) {
        case "z":
          x = mx;
          y = my;
          break;
        case "h":
          x += resultArray[i][segLength - 1];
          break;
        case "v":
          y += resultArray[i][segLength - 1];
          break;
        default:
          x += resultArray[i][segLength - 2];
          y += resultArray[i][segLength - 1];
      }
    };
    for (var i = start; i < ii; i++) loop( i );
    return roundPath(resultArray,round)
  }

  function optimizePath(pathArray,round){
    var absolutePath = pathToAbsolute(pathArray,round),
        relativePath = pathToRelative(pathArray,round);
    return absolutePath.map(function (x,i) { return i ? (x.join('').length < relativePath[i].join('').length ? x : relativePath[i]) : x; } )
  }

  function reverseCurve(pathArray){
     var rotatedCurve = pathArray.slice(1)
                        .map(function (x,i,curveOnly) { return !i ? pathArray[0].slice(1).concat(x.slice(1)) : curveOnly[i-1].slice(-2).concat(x.slice(1)); })
                        .map(function (x) { return x.map(function (y,i) { return x[x.length - i - 2 * (1 - i % 2)]; } ); })
                        .reverse();
    return [ ['M'].concat( rotatedCurve[0].slice(0,2)) ]
                  .concat(rotatedCurve.map(function (x){ return ['C'].concat(x.slice(2) ); } ))
  }

  function reversePath(pathString,round){
    var absolutePath = pathToAbsolute(pathString,round),
        isClosed = absolutePath.slice(-1)[0][0] === 'Z',
        reversedPath = [], segLength = 0;
    reversedPath = normalizePath(absolutePath).map(function (segment,i){
      segLength = segment.length;
      return {
        seg: absolutePath[i],
        n: segment,
        c: absolutePath[i][0],
        x: segment[segLength - 2],
        y: segment[segLength - 1]
      }
    }).map(function (seg,i,pathArray){
      var segment = seg.seg,
          data = seg.n,
          prevSeg = i && pathArray[i-1],
          nextSeg = pathArray[i+1] && pathArray[i+1],
          pathCommand = seg.c,
          pLen = pathArray.length,
          x = i ? pathArray[i-1].x : pathArray[pLen-1].x,
          y = i ? pathArray[i-1].y : pathArray[pLen-1].y,
          result = [];
      switch(pathCommand){
        case 'M':
          result = isClosed ? ['Z'] : [pathCommand, x,y];
          break
        case 'A':
          result = segment.slice(0,-3).concat([(segment[5] === 1 ? 0 : 1), x,y]);
          break
        case 'C':
          if (nextSeg && nextSeg.c === 'S') {
            result = ['S', segment[1],segment[2], x,y];
          } else {
            result = [pathCommand, segment[3],segment[4], segment[1],segment[2], x,y];
          }
          break
        case 'S':
          if ( prevSeg && 'CS'.indexOf(prevSeg.c)>-1 && (!nextSeg || nextSeg && nextSeg.c !== 'S')) {
            result = ['C', data[3],data[4], data[1],data[2], x,y];
          } else {
            result = [pathCommand, data[1],data[2], x,y];
          }
          break
        case 'Q':
          if (nextSeg && nextSeg.c === 'T') {
            result = ['T', x,y];
          } else {
            result = segment.slice(0,-2).concat([x,y]);
          }
          break
        case 'T':
          if (prevSeg && 'QT'.indexOf(prevSeg.c)>-1 && (!nextSeg || nextSeg && nextSeg.c !== 'T')) {
            result = ['Q', data[1],data[2], x,y];
          } else {
            result = [pathCommand, x,y];
          }
          break
        case 'Z':
          result = ['M',x,y];
          break
        case 'H':
          result = [pathCommand,x];
          break
        case 'V':
          result = [pathCommand,y];
          break
        default:
          result = segment.slice(0,-2).concat([x,y]);
      }
      return result
    });
    return isClosed ? reversedPath.reverse()
                    : [reversedPath[0]].concat(reversedPath.slice(1).reverse())
  }

  var epsilon = 1e-9;

  function getSVGMatrix(transformObject){
    var matrix = new CSS3Matrix(),
        origin = transformObject.origin,
        originX = +origin[0],
        originY = +origin[1],
        translate = transformObject.translate,
        rotate = transformObject.rotate,
        skew = transformObject.skew,
        scale = transformObject.scale;
    if (!isNaN(translate) || Array.isArray(translate) && translate.some(function (x){ return +x!==0; })){
      matrix = Array.isArray(translate) ? matrix.translate(+translate[0]||0,+translate[1]||0,+translate[2]||0)
                                        : matrix.translate(+translate||0,0,0);
    }
    if (rotate || skew || scale) {
      matrix = matrix.translate(+originX,+originY);
      if (rotate) {
        matrix = Array.isArray(rotate) && rotate.some(function (x){ return +x!==0; })
                ? matrix.rotate(+rotate[0]||0,+rotate[1]||0,+rotate[2]||0)
                : matrix.rotate(+rotate||0);
      }
      if (Array.isArray(skew) && skew.some(function (x){ return +x!==0; })) {
        if (Array.isArray(skew)) {
          matrix = skew[0] ? matrix.skewX(+skew[0]||0) : matrix;
          matrix = skew[1] ? matrix.skewY(+skew[1]||0) : matrix;
        } else {
          matrix = matrix.skewX(+skew||0);
        }
      }
      if (!isNaN(scale) || Array.isArray(scale) && scale.some(function (x){ return +x!==1; }) ){
        matrix = Array.isArray(scale)
               ? (matrix.scale(+scale[0]||1,+scale[1]||1,+scale[2]||1))
               : matrix.scale(+scale||1);
      }
      matrix = matrix.translate(-originX,-originY);
    }
    return matrix
  }

  function transformEllipse(m,rx,ry,ax) {
    var c = Math.cos(ax * Math.PI / 180),
        s = Math.sin(ax * Math.PI / 180),
        ma = [
          rx * (m[0]*c + m[2]*s),
          rx * (m[1]*c + m[3]*s),
          ry * (-m[0]*s + m[2]*c),
          ry * (-m[1]*s + m[3]*c)
        ];
    var J = ma[0]*ma[0] + ma[2]*ma[2],
        K = ma[1]*ma[1] + ma[3]*ma[3];
    var D = ((ma[0]-ma[3])*(ma[0]-ma[3]) + (ma[2]+ma[1])*(ma[2]+ma[1])) *
            ((ma[0]+ma[3])*(ma[0]+ma[3]) + (ma[2]-ma[1])*(ma[2]-ma[1]));
    var JK = (J + K) / 2;
    if (D < epsilon * JK) {
      rx = ry = Math.sqrt(JK);
      ax = 0;
      return { rx: rx, ry: ry, ax: ax }
    }
    var L = ma[0]*ma[1] + ma[2]*ma[3];
    D = Math.sqrt(D);
    var l1 = JK + D/2,
        l2 = JK - D/2;
    ax = (Math.abs(L) < epsilon && Math.abs(l1 - K) < epsilon) ? 90
        : Math.atan(Math.abs(L) > Math.abs(l1 - K) ? (l1 - J) / L
        : L / (l1 - K)) * 180 / Math.PI;
    if (ax >= 0) {
      rx = Math.sqrt(l1);
      ry = Math.sqrt(l2);
    } else {
      ax += 90;
      rx = Math.sqrt(l2);
      ry = Math.sqrt(l1);
    }
    return { rx: rx, ry: ry, ax: ax }
  }

  function projection2d(m, point2D, origin){
    var point3D = m.transformPoint({x:point2D[0], y:point2D[1], z:0, w:1}),
        originX = origin[0]||0,
        originY = origin[1]||0,
        originZ = origin[2]||0,
        relativePositionX = point3D.x - originX,
        relativePositionY = point3D.y - originY,
        relativePositionZ = point3D.z - originZ;
    return [
      relativePositionX * (Math.abs(originZ) / Math.abs(relativePositionZ)) + originX,
      relativePositionY * (Math.abs(originZ) / Math.abs(relativePositionZ)) + originY
    ]
  }

  function transformPath(pathArray,transformObject,round){
    var x, y, i, j, ii, jj, lx, ly, te,
        absolutePath = pathToAbsolute(pathArray),
        normalizedPath = normalizePath(absolutePath),
        matrixInstance = getSVGMatrix(transformObject),
        origin = transformObject.origin,
        matrix2d = [matrixInstance.a, matrixInstance.b, matrixInstance.c, matrixInstance.d, matrixInstance.e, matrixInstance.f],
        params = {x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0},
        segment = [], seglen = 0, pathCommand = '',
        transformedPath = [],
        allPathCommands = [],
        result = [];
    if (!matrixInstance.isIdentity) {
      for ( i=0, ii = absolutePath.length; i<ii; i++ ) {
        segment = absolutePath[i];
        absolutePath[i] && (pathCommand = segment[0]);
        allPathCommands[i] = pathCommand;
        if (pathCommand ==='A' && !matrixInstance.is2D) {
          segment = segmentToCubic(normalizedPath[i], params);
          absolutePath[i] = segmentToCubic(normalizedPath[i], params);
          fixArc(absolutePath,allPathCommands,i);
          normalizedPath[i] = segmentToCubic(normalizedPath[i], params);
          fixArc(normalizedPath,allPathCommands,i);
          ii = Math.max(absolutePath.length,normalizedPath.length);
        }
        segment = normalizedPath[i];
        seglen = segment.length;
        params.x1 = +segment[seglen - 2];
        params.y1 = +segment[seglen - 1];
        params.x2 = +(segment[seglen - 4]) || params.x1;
        params.y2 = +(segment[seglen - 3]) || params.y1;
        result = {s:absolutePath[i], c:absolutePath[i][0]};
        if (pathCommand !== 'Z') {
          result.x = params.x1;
          result.y = params.y1;
        }
        transformedPath = transformedPath.concat(result);
      }
      transformedPath = transformedPath.map( function (seg) {
        var assign, assign$1, assign$2;
        pathCommand = seg.c;
        segment = seg.s;
        switch (pathCommand){
          case 'A':
            te = transformEllipse(matrix2d, segment[1], segment[2], segment[3]);
            if (matrix2d[0] * matrix2d[3] - matrix2d[1] * matrix2d[2] < 0) {
              segment[5] = +segment[5] ? 0 : 1;
            }
            (assign = projection2d(matrixInstance, [segment[6], segment[7]], origin), lx = assign[0], ly = assign[1]);
            if ( x === lx && y === ly || te.rx < epsilon * te.ry || te.ry < epsilon * te.rx ) {
              segment = [ 'L', lx, ly ];
            } else {
              segment = [ pathCommand, te.rx, te.ry, te.ax, segment[4], segment[5], lx, ly ];
            }
            x = lx; y = ly;
            return segment
          case 'L':
          case 'H':
          case 'V':
            (assign$1 = projection2d(matrixInstance, [seg.x, seg.y], origin), lx = assign$1[0], ly = assign$1[1]);
            if ( x !== lx && y !== ly ) {
              segment = ['L',lx,ly];
            } else if (y === ly){
              segment = ['H',lx];
            } else if (x === lx){
              segment = ['V',ly];
            }
            x = lx; y = ly;
            return segment
          default:
            for (j = 1, jj = segment.length; j < jj; j += 2) {
              (assign$2 = projection2d(matrixInstance, [segment[j], segment[j+1]], origin), x = assign$2[0], y = assign$2[1]);
              segment[j] = x;
              segment[j + 1] = y;
            }
            return segment
        }
      });
      return roundPath(transformedPath,round);
    } else {
      return clonePath(absolutePath);
    }
  }

  var util = {
    CSSMatrix : CSS3Matrix,
    parsePathString: parsePathString,
    isPathArray: isPathArray,
    isCurveArray: isCurveArray,
    isAbsoluteArray: isAbsoluteArray,
    isRelativeArray: isRelativeArray,
    isNormalizedArray: isNormalizedArray,
    pathToAbsolute: pathToAbsolute,
    pathToRelative: pathToRelative,
    pathToCurve: pathToCurve,
    pathToString: pathToString,
    getDrawDirection: getDrawDirection,
    getPathArea: getPathArea,
    getPathBBox: getPathBBox,
    getPathLength: getPathLength,
    getPointAtLength: getPointAtLength,
    clonePath: clonePath,
    splitPath: splitPath,
    roundPath: roundPath,
    optimizePath: optimizePath,
    reverseCurve: reverseCurve,
    reversePath: reversePath,
    normalizePath: normalizePath,
    transformPath: transformPath,
    getSVGMatrix: getSVGMatrix,
    options: SVGPCO
  };

  var SVGPathCommander = function SVGPathCommander(pathValue,options){
    var roundOption = options && (+options.round === 0 || options.round === false) ? 0 : SVGPCO.round,
        decimalsOption = roundOption && (options && options.decimals || SVGPCO.decimals),
        originOption = options && options.origin,
        path = parsePathString(pathValue,this.round);
    this.round = roundOption === 0 ? 0 : decimalsOption;
    this.origin = originOption && !isNaN(originOption.x) && !isNaN(originOption.y) ? originOption : null;
    this.segments = clonePath(path);
    this.pathValue = pathValue;
    return this
  };
  SVGPathCommander.prototype.toAbsolute = function toAbsolute (){
    var path = pathToAbsolute(this.segments,this.round);
    this.segments = clonePath(path);
    return this
  };
  SVGPathCommander.prototype.toRelative = function toRelative (){
    var path = pathToRelative(this.segments,this.round);
    this.segments = clonePath(path);
    return this
  };
  SVGPathCommander.prototype.reverse = function reverse (onlySubpath){
    this.toAbsolute();
    var subPath = splitPath(this.pathValue).length > 1 && splitPath(this.toString()),
        absoluteMultiPath, path;
    absoluteMultiPath = subPath && clonePath(subPath)
                      .map(function (x,i) { return onlySubpath
                      ? (i ? reversePath(x) : parsePathString(x))
                      : reversePath(x); });
    path = subPath ? [].concat.apply([], absoluteMultiPath)
          : onlySubpath ? this.segments : reversePath(this.segments);
    this.segments = clonePath(path);
    return this
  };
  SVGPathCommander.prototype.normalize = function normalize (){
    var path = normalizePath(this.segments,this.round);
    this.segments = clonePath(path);
    return this
  };
  SVGPathCommander.prototype.optimize = function optimize (){
    var path = optimizePath(this.segments,this.round);
    this.segments = clonePath(path);
    return this
  };
  SVGPathCommander.prototype.transform = function transform (transformObject){
    transformObject = transformObject || {};
    if (!transformObject.origin) {
      var BBox = getPathBBox(this.segments);
      transformObject.origin = [BBox.cx,BBox.cy,BBox.cx];
    }
    var path = transformPath(
      this.segments,
      transformObject,
      this.round);
    this.segments = clonePath(path);
    return this
  };
  SVGPathCommander.prototype.flipX = function flipX (){
    this.transform({rotate:[180,0,0]});
    return this
  };
  SVGPathCommander.prototype.flipY = function flipY (){
    this.transform({rotate:[0,180,0]});
    return this
  };
  SVGPathCommander.prototype.toString = function toString (){
    return pathToString(this.segments)
  };

  for (var x in util) { SVGPathCommander[x] = util[x]; }

  return SVGPathCommander;

})));
