/*!
* SVGPathCommander v0.1.3-alpha3 (http://thednp.github.io/svg-path-commander)
* Copyright 2021 © thednp
* Licensed under MIT (https://github.com/thednp/svg-path-commander/blob/master/LICENSE)
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.SVGPathCommander = factory());
}(this, (function () { 'use strict';

  var SVGPCO = {
    origin: null,
    decimals: 4,
    round: 1,
  };

  /**
   * DOMMatrix shim - CSSMatrix
   *
   * Creates and returns a new `DOMMatrix` compatible *Object*
   * with equivalent instance methods.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix
   * https://github.com/thednp/DOMMatrix/
   *
   * @param {String} String valid CSS transform in `matrix()`/`matrix3d()` format
   * @param {Array} Array expected to be *Float64Array* or *Float32Array* in the column major order.
   * @param {[a,b,c,d,e,f]} Arguments representing the 6 elements of a 2d matrix
   * @param {[m11,m21,m31,m41..]} Arguments representing the 16 elements of a 3d matrix
   */

  var CSSMatrix = function CSSMatrix() {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    this.setIdentity();
    return args && args.length && this.setMatrixValue(args);
  };

  var prototypeAccessors = { isIdentity: { configurable: true },is2D: { configurable: true } };

  /**
   * A `Boolean` whose value is `true` if the matrix is the identity matrix. The identity
   * matrix is one in which every value is 0 except those on the main diagonal from top-left
   * to bottom-right corner (in other words, where the offsets in each direction are equal).
   *
   * @return {Boolean} `Boolean` the current property value
   */
  prototypeAccessors.isIdentity.get = function () {
    var m = this;
    return (m.m11 === 1 && m.m12 === 0 && m.m13 === 0 && m.m14 === 0
            && m.m21 === 0 && m.m22 === 1 && m.m23 === 0 && m.m24 === 0
            && m.m31 === 0 && m.m32 === 0 && m.m33 === 1 && m.m34 === 0
            && m.m41 === 0 && m.m42 === 0 && m.m43 === 0 && m.m44 === 1);
  };

  /**
   * Sets a new `Boolean` flag value for `this.isIdentity` matrix property.
   *
   * @param {Boolean} value sets a new `Boolean` flag for this property
   */
  prototypeAccessors.isIdentity.set = function (value) {
    this.isIdentity = value;
  };

  /**
   * A `Boolean` flag whose value is `true` if the matrix was initialized as a 2D matrix
   * and `false` if the matrix is 3D.
   *
   * @return {Boolean} `Boolean` the current property value
   */
  prototypeAccessors.is2D.get = function () {
    var m = this;
    return (m.m31 === 0 && m.m32 === 0 && m.m33 === 1 && m.m34 === 0 && m.m43 === 0 && m.m44 === 1);
  };

  /**
   * Sets a new `Boolean` flag value for `this.is2D` matrix property.
   *
   * @param {Boolean} value sets a new `Boolean` flag for this property
   */
  prototypeAccessors.is2D.set = function (value) {
    this.is2D = value;
  };

  Object.defineProperties( CSSMatrix.prototype, prototypeAccessors );

  // export proto for custom compile via Buble
  var CSSMatrixProto = CSSMatrix.prototype;

  // Transform Functions
  // https://www.w3.org/TR/css-transforms-1/#transform-functions

  /**
   * Creates a new `CSSMatrix` for the translation matrix and returns it.
   * This method is equivalent to the CSS `translate3d()` function.
   *
   * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translate3d
   *
   * @param {Number} x the `x-axis` position.
   * @param {Number} y the `y-axis` position.
   * @param {Number} z the `z-axis` position.
   */
  function Translate(x, y, z) {
    var m = new CSSMatrix();
    m.m41 = x;
    m.e = x;
    m.m42 = y;
    m.f = y;
    m.m43 = z;
    return m;
  }

  /**
   * Creates a new `CSSMatrix` for the rotation matrix and returns it.
   *
   * http://en.wikipedia.org/wiki/Rotation_matrix
   *
   * @param {Number} rx the `x-axis` rotation.
   * @param {Number} ry the `y-axis` rotation.
   * @param {Number} rz the `z-axis` rotation.
   */

  function Rotate(rx, ry, rz) {
    var m = new CSSMatrix();

    var radX = (rx * Math.PI) / 180;
    var radY = (ry * Math.PI) / 180;
    var radZ = (rz * Math.PI) / 180;

    // minus sin() because of right-handed system
    var cosx = Math.cos(radX);
    var sinx = -Math.sin(radX);
    var cosy = Math.cos(radY);
    var siny = -Math.sin(radY);
    var cosz = Math.cos(radZ);
    var sinz = -Math.sin(radZ);

    var cycz = cosy * cosz;
    var cysz = -cosy * sinz;

    m.m11 = cycz;
    m.a = cycz;

    m.m12 = cysz;
    m.b = cysz;

    m.m13 = siny;

    var sxsy = sinx * siny * cosz + cosx * sinz;
    m.m21 = sxsy;
    m.c = sxsy;

    var cxcz = cosx * cosz - sinx * siny * sinz;
    m.m22 = cxcz;
    m.d = cxcz;

    m.m23 = -sinx * cosy;

    m.m31 = sinx * sinz - cosx * siny * cosz;
    m.m32 = sinx * cosz + cosx * siny * sinz;
    m.m33 = cosx * cosy;

    return m;
  }

  /**
   * Creates a new `CSSMatrix` for the rotation matrix and returns it.
   * This method is equivalent to the CSS `rotate3d()` function.
   *
   * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate3d
   *
   * @param {Number} x the `x-axis` vector length.
   * @param {Number} y the `y-axis` vector length.
   * @param {Number} z the `z-axis` vector length.
   * @param {Number} angle the value in degrees of the rotation.
   */
  function RotateAxisAngle(x, y, z, angle) {
    var m = new CSSMatrix();
    var radA = (angle * Math.PI) / 360;
    var sinA = Math.sin(radA);
    var cosA = Math.cos(radA);
    var sinA2 = sinA * sinA;
    var length = Math.sqrt(x * x + y * y + z * z);
    var X = 0;
    var Y = 0;
    var Z = 1;

    // bad vector length, use something reasonable
    if (length !== 0) {
      X = x / length;
      Y = y / length;
      Z = z / length;
    }

    var x2 = X * X;
    var y2 = Y * Y;
    var z2 = Z * Z;

    var m11 = 1 - 2 * (y2 + z2) * sinA2;
    m.m11 = m11;
    m.a = m11;

    var m12 = 2 * (x * y * sinA2 + z * sinA * cosA);
    m.m12 = m12;
    m.b = m12;

    m.m13 = 2 * (x * z * sinA2 - y * sinA * cosA);

    var m21 = 2 * (y * x * sinA2 - z * sinA * cosA);
    m.m21 = m21;
    m.c = m21;

    var m22 = 1 - 2 * (z2 + x2) * sinA2;
    m.m22 = m22;
    m.d = m22;

    m.m23 = 2 * (y * z * sinA2 + x * sinA * cosA);
    m.m31 = 2 * (z * x * sinA2 + y * sinA * cosA);
    m.m32 = 2 * (z * y * sinA2 - x * sinA * cosA);
    m.m33 = 1 - 2 * (x2 + y2) * sinA2;

    m.m14 = 0;
    m.m24 = 0;
    m.m34 = 0;

    m.m41 = 0;
    m.e = 0;
    m.m42 = 0;
    m.f = 0;
    m.m43 = 0;

    m.m44 = 1;

    return m;
  }

  /**
   * Creates a new `CSSMatrix` for the scale matrix and returns it.
   * This method is equivalent to the CSS `scale3d()` function.
   *
   * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/scale3d
   *
   * @param {Number} x the `x-axis` scale.
   * @param {Number} y the `y-axis` scale.
   * @param {Number} z the `z-axis` scale.
   */
  function Scale(x, y, z) {
    var m = new CSSMatrix();
    m.m11 = x;
    m.a = x;

    m.m22 = y;
    m.d = y;

    m.m33 = z;
    return m;
  }

  /**
   * Creates a new `CSSMatrix` for the shear of the `x-axis` rotation matrix and
   * returns it. This method is equivalent to the CSS `skewX()` function.
   *
   * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skewX
   *
   * @param {Number} angle the angle in degrees.
   */
  function SkewX(angle) {
    var radA = (angle * Math.PI) / 180;
    var m = new CSSMatrix();
    var t = Math.tan(radA);
    m.m21 = t;
    m.c = t;
    return m;
  }

  /**
   * Creates a new `CSSMatrix` for the shear of the `y-axis` rotation matrix and
   * returns it. This method is equivalent to the CSS `skewY()` function.
   *
   * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skewY
   *
   * @param {Number} angle the angle in degrees.
   */
  function SkewY(angle) {
    var radA = (angle * Math.PI) / 180;
    var m = new CSSMatrix();
    var t = Math.tan(radA);
    m.m12 = t;
    m.b = t;
    return m;
  }

  /**
   * Creates a new `CSSMatrix` resulted from the multiplication of two matrixes
   * and returns it. Both matrixes are not changed.
   *
   * @param {CSSMatrix} m1 the first matrix.
   * @param {CSSMatrix} m2 the second matrix.
   */
  function Multiply(m1, m2) {
    var m11 = m2.m11 * m1.m11 + m2.m12 * m1.m21 + m2.m13 * m1.m31 + m2.m14 * m1.m41;
    var m12 = m2.m11 * m1.m12 + m2.m12 * m1.m22 + m2.m13 * m1.m32 + m2.m14 * m1.m42;
    var m13 = m2.m11 * m1.m13 + m2.m12 * m1.m23 + m2.m13 * m1.m33 + m2.m14 * m1.m43;
    var m14 = m2.m11 * m1.m14 + m2.m12 * m1.m24 + m2.m13 * m1.m34 + m2.m14 * m1.m44;

    var m21 = m2.m21 * m1.m11 + m2.m22 * m1.m21 + m2.m23 * m1.m31 + m2.m24 * m1.m41;
    var m22 = m2.m21 * m1.m12 + m2.m22 * m1.m22 + m2.m23 * m1.m32 + m2.m24 * m1.m42;
    var m23 = m2.m21 * m1.m13 + m2.m22 * m1.m23 + m2.m23 * m1.m33 + m2.m24 * m1.m43;
    var m24 = m2.m21 * m1.m14 + m2.m22 * m1.m24 + m2.m23 * m1.m34 + m2.m24 * m1.m44;

    var m31 = m2.m31 * m1.m11 + m2.m32 * m1.m21 + m2.m33 * m1.m31 + m2.m34 * m1.m41;
    var m32 = m2.m31 * m1.m12 + m2.m32 * m1.m22 + m2.m33 * m1.m32 + m2.m34 * m1.m42;
    var m33 = m2.m31 * m1.m13 + m2.m32 * m1.m23 + m2.m33 * m1.m33 + m2.m34 * m1.m43;
    var m34 = m2.m31 * m1.m14 + m2.m32 * m1.m24 + m2.m33 * m1.m34 + m2.m34 * m1.m44;

    var m41 = m2.m41 * m1.m11 + m2.m42 * m1.m21 + m2.m43 * m1.m31 + m2.m44 * m1.m41;
    var m42 = m2.m41 * m1.m12 + m2.m42 * m1.m22 + m2.m43 * m1.m32 + m2.m44 * m1.m42;
    var m43 = m2.m41 * m1.m13 + m2.m42 * m1.m23 + m2.m43 * m1.m33 + m2.m44 * m1.m43;
    var m44 = m2.m41 * m1.m14 + m2.m42 * m1.m24 + m2.m43 * m1.m34 + m2.m44 * m1.m44;

    return new CSSMatrix(
      [m11, m21, m31, m41,
        m12, m22, m32, m42,
        m13, m23, m33, m43,
        m14, m24, m34, m44]
    );
  }

  /**
   * Returns a new *Float32Array* containing all 16 elements which comprise the matrix.
   * The elements are stored into the array as single-precision floating-point numbers
   * in column-major (colexographical access access or "colex") order.
   *
   * @return {Float32Array} matrix elements (m11, m21, m31, m41, ..)
   */
  // toFloat32Array(){
  //   return Float32Array.from(this.toArray());
  // }

  /**
   * Returns a new Float64Array containing all 16 elements which comprise the matrix.
   * The elements are stored into the array as double-precision floating-point numbers
   * in column-major (colexographical access access or "colex") order.
   *
   * @return {Float64Array} matrix elements (m11, m21, m31, m41, ..)
   */
  // toFloat64Array(){
  //   return Float64Array.from(this.toArray());
  // }

  /**
   * Creates a new mutable `CSSMatrix` object given an existing matrix or a
   * `DOMMatrix` *Object* which provides the values for its properties.
   *
   * @param {CSSMatrix} CSSMatrix the source `CSSMatrix` initialization to feed values from
   */
  function fromMatrix(m) {
    return new CSSMatrix(
      // DOMMatrix elements order
      [m.m11, m.m21, m.m31, m.m41,
        m.m12, m.m22, m.m32, m.m42,
        m.m13, m.m23, m.m33, m.m43,
        m.m14, m.m24, m.m34, m.m44]
    );
  }

  /**
   * Feed a CSSMatrix object with the values of a 6/16 values array and returns it.
   *
   * @param {Array} array The source `Array` to feed values from.
   * @return {CSSMatrix} a The source array to feed values from.
   */
  function feedFromArray(m, array) {
    var a = Array.from(array);
    if (a.length === 16) {
      var m11 = a[0];
      var m21 = a[1];
      var m31 = a[2];
      var m41 = a[3];
      var m12 = a[4];
      var m22 = a[5];
      var m32 = a[6];
      var m42 = a[7];
      var m13 = a[8];
      var m23 = a[9];
      var m33 = a[10];
      var m43 = a[11];
      var m14 = a[12];
      var m24 = a[13];
      var m34 = a[14];
      var m44 = a[15];

      m.m11 = m11;
      m.a = m11;

      m.m21 = m21;
      m.c = m21;

      m.m31 = m31;

      m.m41 = m41;
      m.e = m41;

      m.m12 = m12;
      m.b = m12;

      m.m22 = m22;
      m.d = m22;

      m.m32 = m32;

      m.m42 = m42;
      m.f = m42;

      m.m13 = m13;
      m.m23 = m23;
      m.m33 = m33;
      m.m43 = m43;
      m.m14 = m14;
      m.m24 = m24;
      m.m34 = m34;
      m.m44 = m44;
    } else if (a.length === 6) {
      var m11$1 = a[0];
      var m12$1 = a[1];
      var m21$1 = a[2];
      var m22$1 = a[3];
      var m14$1 = a[4];
      var m24$1 = a[5];

      m.m11 = m11$1;
      m.a = m11$1;

      m.m12 = m12$1;
      m.b = m12$1;

      m.m21 = m21$1;
      m.c = m21$1;

      m.m22 = m22$1;
      m.d = m22$1;

      m.m14 = m14$1;
      m.e = m14$1;

      m.m24 = m24$1;
      m.f = m24$1;
    } else {
      throw new TypeError('CSSMatrix: expecting a 6/16 values Array');
    }
    return m;
  }

  /**
   * Creates a new mutable `CSSMatrix` object given an array float values.
   *
   * If the array has six values, the result is a 2D matrix; if the array has 16 values,
   * the result is a 3D matrix. Otherwise, a TypeError exception is thrown.
   *
   * @param {Array} array The source `Array` to feed values from.
   * @return {CSSMatrix} a The source array to feed values from.
   */
  function fromArray(a) {
    return feedFromArray(new CSSMatrix(), a);
  }

  /**
   * Each create a new mutable `CSSMatrix` object given an array of single/double-precision
   * (32/64 bit) floating-point values.
   *
   * If the array has six values, the result is a 2D matrix; if the array has 16 values,
   * the result is a 3D matrix. Otherwise, a TypeError exception is thrown.
   *
   * @param {Float32Array|Float64Array} array The source float array to feed values from.
   * @return {CSSMatrix} a The source array to feed values from.
   */
  // more of an alias for now, will update later if it's the case
  // function fromFloat32Array(a){
  //   return feedFromArray(new CSSMatrix(), a);
  // }
  // function fromFloat64Array(a){ // more of an alias
  //   return feedFromArray(new CSSMatrix(), a);
  // }

  /**
   * The `setMatrixValue` method replaces the existing matrix with one computed
   * in the browser. EG: `matrix(1,0.25,-0.25,1,0,0)`
   *
   * The method accepts *Float64Array* / *Float32Array* / any *Array* values, the result of
   * `DOMMatrix` / `CSSMatrix` instance method calls `toFloat64Array()` / `toFloat32Array()`.
   *
   * This method expects valid *matrix()* / *matrix3d()* string values, other
   * transform functions like *translate()* are not supported.
   *
   * @param {String} source the *String* resulted from `getComputedStyle()`.
   * @param {Array} source the *Array* resulted from `toFloat64Array()`.
   */
  CSSMatrixProto.setMatrixValue = function setMatrixValue(source) {
    var m = this;

    if (!source || !source.length) { // no parameters or source
      return m;
    } if (source.length && typeof source[0] === 'string' && source[0].length) { // CSS transform String source
      var string = String(source[0]).trim();
      var type = '';
      var values = [];

      if (string === 'none') { return m; }

      type = string.slice(0, string.indexOf('('));
      values = string.slice((type === 'matrix' ? 7 : 9), -1).split(',')
        .map(function (n) { return (Math.abs(n) < 1e-6 ? 0 : +n); });

      if ([6, 16].indexOf(values.length) > -1) {
        feedFromArray(m, values);
      } else {
        throw new TypeError('CSSMatrix: expecting valid CSS matrix() / matrix3d() syntax');
      }
    } else if (source[0] instanceof CSSMatrix) { // CSSMatrix instance
      feedFromArray(m, source[0].toArray());
    } else if (Array.isArray(source[0])) { // Float32Array,Float64Array source
      feedFromArray(m, source[0]);
    } else if (Array.isArray(source)) { // Arguments list come here
      feedFromArray(m, source);
    }
    return m;
  };

  /**
   * Creates and returns a string representation of the matrix in `CSS` matrix syntax,
   * using the appropriate `CSS` matrix notation.
   *
   * The 16 items in the array 3D matrix array are *transposed* in row-major order.
   *
   * @matrix3d *matrix3d(m11, m12, m13, m14, m21, ...)*
   * @matrix *matrix(a, b, c, d, e, f)*
   *
   * @return {String} `String` representation of the matrix
   */
  CSSMatrixProto.toString = function toString() {
    var m = this;
    var type = m.is2D ? 'matrix' : 'matrix3d';

    return (type + "(" + (m.toArray(1).join(',')) + ")");
  };

  /**
   * Returns an *Array* containing all 16 elements which comprise the matrix.
   * The method can return either the elements in default column major order or
   * row major order (what we call the *transposed* matrix, used by `toString`).
   *
   * Other methods make use of this method to feed their output values from this matrix.
   *
   * @param {Boolean} transposed changes the order of elements in the output
   * @return {Array} an *Array* representation of the matrix
   */
  CSSMatrixProto.toArray = function toArray(transposed) {
    var m = this;
    var result;

    if (m.is2D) {
      result = [m.a, m.b, m.c, m.d, m.e, m.f];
    } else if (transposed) {
      result = [m.m11, m.m12, m.m13, m.m14, // transposed is used by toString
        m.m21, m.m22, m.m23, m.m24,
        m.m31, m.m32, m.m33, m.m34,
        m.m41, m.m42, m.m43, m.m44];
    } else {
      result = [m.m11, m.m21, m.m31, m.m41, // used by constructor
        m.m12, m.m22, m.m32, m.m42,
        m.m13, m.m23, m.m33, m.m43,
        m.m14, m.m24, m.m34, m.m44];
    }
    return result;
  };

  /**
   * The Multiply method returns a new CSSMatrix which is the result of this
   * matrix multiplied by the passed matrix, with the passed matrix to the right.
   * This matrix is not modified.
   *
   * @param {CSSMatrix} m2 CSSMatrix
   * @return {CSSMatrix} The result matrix.
   */
  CSSMatrixProto.multiply = function multiply(m2) {
    return Multiply(this, m2);
  };

  /**
   *
   * These methods will be implemented later into an extended version to provide
   * additional functionality.
   */
  // inverse = function(){}
  // determinant = function(){}
  // transpose = function(){}

  /**
   * The translate method returns a new matrix which is this matrix post
   * multiplied by a translation matrix containing the passed values. If the z
   * component is undefined, a 0 value is used in its place. This matrix is not
   * modified.
   *
   * @param {number} x X component of the translation value.
   * @param {number} y Y component of the translation value.
   * @param {number=} z Z component of the translation value.
   * @return {CSSMatrix} The result matrix
   */

  CSSMatrixProto.translate = function translate(x, y, z) {
    var X = x;
    var Y = y;
    var Z = z;
    if (Z == null) { Z = 0; }
    if (Y == null) { Y = 0; }
    return Multiply(this, Translate(X, Y, Z));
  };

  /**
   * The scale method returns a new matrix which is this matrix post multiplied by
   * a scale matrix containing the passed values. If the z component is undefined,
   * a 1 value is used in its place. If the y component is undefined, the x
   * component value is used in its place. This matrix is not modified.
   *
   * @param {number} x The X component of the scale value.
   * @param {number=} y The Y component of the scale value.
   * @param {number=} z The Z component of the scale value.
   * @return {CSSMatrix} The result matrix
   */
  CSSMatrixProto.scale = function scale(x, y, z) {
    var X = x;
    var Y = y;
    var Z = z;
    if (Y == null) { Y = x; }
    if (Z == null) { Z = x; }

    return Multiply(this, Scale(X, Y, Z));
  };

  /**
   * The rotate method returns a new matrix which is this matrix post multiplied
   * by each of 3 rotation matrices about the major axes, first X, then Y, then Z.
   * If the y and z components are undefined, the x value is used to rotate the
   * object about the z axis, as though the vector (0,0,x) were passed. All
   * rotation values are in degrees. This matrix is not modified.
   *
   * @param {number} rx The X component of the rotation, or Z if Y and Z are null.
   * @param {number=} ry The (optional) Y component of the rotation value.
   * @param {number=} rz The (optional) Z component of the rotation value.
   * @return {CSSMatrix} The result matrix
   */
  CSSMatrixProto.rotate = function rotate(rx, ry, rz) {
    var RX = rx;
    var RY = ry;
    var RZ = rz;
    if (RY == null) { RY = 0; }
    if (RZ == null) { RZ = RX; RX = 0; }
    return Multiply(this, Rotate(RX, RY, RZ));
  };

  /**
   * The rotateAxisAngle method returns a new matrix which is this matrix post
   * multiplied by a rotation matrix with the given axis and `angle`. The right-hand
   * rule is used to determine the direction of rotation. All rotation values are
   * in degrees. This matrix is not modified.
   *
   * @param {number} x The X component of the axis vector.
   * @param {number} y The Y component of the axis vector.
   * @param {number} z The Z component of the axis vector.
   * @param {number} angle The angle of rotation about the axis vector, in degrees.
   * @return {CSSMatrix} The `CSSMatrix` result
   */

  CSSMatrixProto.rotateAxisAngle = function rotateAxisAngle(x, y, z, angle) {
    if (arguments.length !== 4) {
      throw new TypeError('CSSMatrix: expecting 4 values');
    }
    return Multiply(this, RotateAxisAngle(x, y, z, angle));
  };

  /**
   * Specifies a skew transformation along the `x-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param {number} angle The angle amount in degrees to skew.
   * @return {CSSMatrix} The `CSSMatrix` result
   */

  CSSMatrixProto.skewX = function skewX(angle) {
    return Multiply(this, SkewX(angle));
  };

  /**
   * Specifies a skew transformation along the `y-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param {number} angle The angle amount in degrees to skew.
   * @return {CSSMatrix} The `CSSMatrix` result
   */

  CSSMatrixProto.skewY = function skewY(angle) {
    return Multiply(this, SkewY(angle));
  };

  /**
   * Set the current `CSSMatrix` instance to the identity form and returns it.
   *
   * @return {CSSMatrix} this `CSSMatrix` instance
   */
  CSSMatrixProto.setIdentity = function setIdentity() {
    var identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    return feedFromArray(this, identity);
  };

  /**
   * Transforms the specified point using the matrix, returning a new
   * *Object* containing the transformed point.
   * Neither the matrix nor the original point are altered.
   *
   * The method is equivalent with `transformPoint()` method
   * of the `DOMMatrix` constructor.
   *
   * JavaScript implementation by thednp
   *
   * @param {Point} point the *Object* with `x`, `y`, `z` and `w` components
   * @return {Point} a new `{x,y,z,w}` *Object*
   */
  CSSMatrixProto.transformPoint = function transformPoint(v) {
    var M = this;
    var m = Translate(v.x, v.y, v.z);

    m.m44 = v.w || 1;
    m = M.multiply(m);

    return {
      x: m.m41,
      y: m.m42,
      z: m.m43,
      w: m.m44,
    };
  };

  /**
   * Transforms the specified vector using the matrix, returning a new
   * {x,y,z,w} *Object* comprising the transformed vector.
   * Neither the matrix nor the original vector are altered.
   *
   * @param {Tuple} tupple an object with x, y, z and w components
   * @return {Tuple} the passed tuple
   */
  CSSMatrixProto.transform = function transform(t) {
    var m = this;
    var x = m.m11 * t.x + m.m12 * t.y + m.m13 * t.z + m.m14 * t.w;
    var y = m.m21 * t.x + m.m22 * t.y + m.m23 * t.z + m.m24 * t.w;
    var z = m.m31 * t.x + m.m32 * t.y + m.m33 * t.z + m.m34 * t.w;
    var w = m.m41 * t.x + m.m42 * t.y + m.m43 * t.z + m.m44 * t.w;

    return {
      x: x / w,
      y: y / w,
      z: z / w,
      w: w,
    };
  };

  // Add Transform Functions to CSSMatrix object
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

  function clonePath(pathArray) {
    return pathArray.map(function (x) {
      if (Array.isArray(x)) {
        return clonePath(x);
      }
      return !Number.isNaN(+x) ? +x : x;
    });
  }

  function roundPath(pathArray, round) {
    var decimalsOption = !Number.isNaN(+round) ? +round : SVGPCO.round && SVGPCO.decimals;
    var result;

    if (decimalsOption) {
      result = pathArray.map(function (seg) { return seg.map(function (c) {
        var nr = +c;
        var dc = Math.pow( 10, decimalsOption );
        if (nr) {
          return nr % 1 === 0 ? nr : Math.round(nr * dc) / dc;
        }
        return c;
      }); });
    } else {
      result = clonePath(pathArray);
    }
    return result;
  }

  function fixArc(pathArray, allPathCommands, i) {
    if (pathArray[i].length > 7) {
      pathArray[i].shift();
      var pi = pathArray[i];
      // const ni = i + 1;
      var ni = i;
      while (pi.length) {
        // if created multiple C:s, their original seg is saved
        allPathCommands[i] = 'A';
        pathArray.splice(ni += 1, 0, ['C'].concat(pi.splice(0, 6)));
        // pathArray.splice(i += 1, 0, ['C'].concat(pi.splice(0, 6)));
        // pathArray.splice(i++, 0, ['C'].concat(pi.splice(0, 6)));
      }
      pathArray.splice(i, 1);
    }
  }

  var paramsCount = {
    a: 7, c: 6, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, z: 0,
  };

  function isPathArray(pathArray) {
    return Array.isArray(pathArray) && pathArray.every(function (seg) {
      var pathCommand = seg[0].toLowerCase();
      return paramsCount[pathCommand] === seg.length - 1 && /[achlmrqstvz]/g.test(pathCommand);
    });
  }

  function isCurveArray(pathArray) {
    return isPathArray(pathArray) && pathArray.slice(1).every(function (seg) { return seg[0] === 'C'; });
  }

  function finalizeSegment(state) {
    var pathCommand = state.pathValue[state.segmentStart];
    var pathComLK = pathCommand.toLowerCase();
    var params = state.data;

    // Process duplicated commands (without comand name)
    if (pathComLK === 'm' && params.length > 2) {
      state.segments.push([pathCommand, params[0], params[1]]);
      params = params.slice(2);
      pathComLK = 'l';
      pathCommand = (pathCommand === 'm') ? 'l' : 'L';
    }

    if (pathComLK === 'r') {
      state.segments.push([pathCommand].concat(params));
    } else {
      while (params.length >= paramsCount[pathComLK]) {
        state.segments.push([pathCommand].concat(params.splice(0, paramsCount[pathComLK])));
        if (!paramsCount[pathComLK]) {
          break;
        }
      }
    }
  }

  var invalidPathValue = 'Invalid path value';

  function scanFlag(state) {
    var ch = state.pathValue.charCodeAt(state.index);

    if (ch === 0x30/* 0 */) {
      state.param = 0;
      state.index += 1;
      return;
    }

    if (ch === 0x31/* 1 */) {
      state.param = 1;
      state.index += 1;
      return;
    }

    // state.err = 'SvgPath: arc flag can be 0 or 1 only (at pos ' + state.index + ')';
    state.err = invalidPathValue + ": invalid Arc flag " + ch;
  }

  function isDigit(code) {
    return (code >= 48 && code <= 57); // 0..9
  }

  function scanParam(state) {
    var start = state.index;
    var max = state.max;
    var index = start;
    var zeroFirst = false;
    var hasCeiling = false;
    var hasDecimal = false;
    var hasDot = false;
    var ch;

    if (index >= max) {
      // state.err = 'SvgPath: missed param (at pos ' + index + ')';
      state.err = invalidPathValue + ": missing param " + (state.pathValue[index]);
      return;
    }
    ch = state.pathValue.charCodeAt(index);

    if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
      index += 1;
      ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;
    }

    // This logic is shamelessly borrowed from Esprima
    // https://github.com/ariya/esprimas
    if (!isDigit(ch) && ch !== 0x2E/* . */) {
      // state.err = 'SvgPath: param should start with 0..9 or `.` (at pos ' + index + ')';
      state.err = invalidPathValue + " at index " + index + ": " + (state.pathValue[index]) + " is not a number";
      return;
    }

    if (ch !== 0x2E/* . */) {
      zeroFirst = (ch === 0x30/* 0 */);
      index += 1;

      ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;

      if (zeroFirst && index < max) {
        // decimal number starts with '0' such as '09' is illegal.
        if (ch && isDigit(ch)) {
          // state.err = 'SvgPath: numbers started with `0` such as `09`
          // are illegal (at pos ' + start + ')';
          state.err = invalidPathValue + ": " + (state.pathValue[start]) + " illegal number";
          return;
        }
      }

      while (index < max && isDigit(state.pathValue.charCodeAt(index))) {
        index += 1;
        hasCeiling = true;
      }
      ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;
    }

    if (ch === 0x2E/* . */) {
      hasDot = true;
      index += 1;
      while (isDigit(state.pathValue.charCodeAt(index))) {
        index += 1;
        hasDecimal = true;
      }
      ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;
    }

    if (ch === 0x65/* e */ || ch === 0x45/* E */) {
      if (hasDot && !hasCeiling && !hasDecimal) {
        // state.err = 'SvgPath: invalid float exponent (at pos ' + index + ')';
        state.err = invalidPathValue + ": " + (state.pathValue[index]) + " invalid float exponent";
        return;
      }

      index += 1;

      ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;
      if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
        index += 1;
      }
      if (index < max && isDigit(state.pathValue.charCodeAt(index))) {
        while (index < max && isDigit(state.pathValue.charCodeAt(index))) {
          index += 1;
        }
      } else {
        // state.err = 'SvgPath: invalid float exponent (at pos ' + index + ')';
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
      0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF];
    return (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029) // Line terminators
      // White spaces
      || (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0)
      || (ch >= 0x1680 && specialSpaces.indexOf(ch) >= 0);
  }

  function skipSpaces(state) {
    while (state.index < state.max && isSpace(state.pathValue.charCodeAt(state.index))) {
      state.index += 1;
    }
  }

  function isPathCommand(code) {
    // eslint-disable no-bitwise
    switch (code | 0x20) {
      case 0x6D/* m */:
      case 0x7A/* z */:
      case 0x6C/* l */:
      case 0x68/* h */:
      case 0x76/* v */:
      case 0x63/* c */:
      case 0x73/* s */:
      case 0x71/* q */:
      case 0x74/* t */:
      case 0x61/* a */:
      case 0x72/* r */:
        return true;
      default:
        return false;
    }
  }

  function isDigitStart(code) {
    return (code >= 48 && code <= 57) /* 0..9 */
      || code === 0x2B /* + */
      || code === 0x2D /* - */
      || code === 0x2E; /* . */
  }

  function isArcCommand(code) {
    // eslint disable no-bitwise
    return (code | 0x20) === 0x61;
  }

  function scanSegment(state) {
    var max = state.max;
    var cmdCode = state.pathValue.charCodeAt(state.index);
    var reqParams = paramsCount[state.pathValue[state.index].toLowerCase()];
    // let hasComma;

    state.segmentStart = state.index;

    if (!isPathCommand(cmdCode)) {
      // state.err = 'SvgPath: bad command '
      // + state.pathValue[state.index]
      // + ' (at pos ' + state.index + ')';
      state.err = invalidPathValue + ": " + (state.pathValue[state.index]) + " not a path command";
      return;
    }

    state.index += 1;
    skipSpaces(state);

    state.data = [];

    if (!reqParams) {
      // Z
      finalizeSegment(state);
      return;
    }

    // hasComma = false;

    for (;;) {
      for (var i = reqParams; i > 0; i -= 1) {
        if (isArcCommand(cmdCode) && (i === 3 || i === 4)) { scanFlag(state); }
        else { scanParam(state); }

        if (state.err.length) {
          return;
        }
        state.data.push(state.param);

        skipSpaces(state);
        // hasComma = false;

        if (state.index < max && state.pathValue.charCodeAt(state.index) === 0x2C/* , */) {
          state.index += 1;
          skipSpaces(state);
          // hasComma = true;
        }
      }

      // after ',' param is mandatory
      // if (hasComma) {
      //   continue;
      // }

      if (state.index >= state.max) {
        break;
      }

      // Stop on next segment
      if (!isDigitStart(state.pathValue.charCodeAt(state.index))) {
        break;
      }
    }

    finalizeSegment(state);
  }

  function SVGPathArray(pathString) {
    this.segments = [];
    this.pathValue = pathString;
    this.max = pathString.length;
    this.index = 0;
    this.param = 0.0;
    this.segmentStart = 0;
    this.data = [];
    this.err = '';
    return this;
  }

  // Returns array of segments:
  function parsePathString(pathString, round) {
    if (isPathArray(pathString)) {
      return clonePath(pathString);
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
        // state.err = 'Path string should start with `M` or `m`';
        state.err = invalidPathValue + ": missing M/m";
        state.segments = [];
      } else {
        state.segments[0][0] = 'M';
      }
    }

    return roundPath(state.segments, round);
  }

  function isAbsoluteArray(pathInput) {
    return isPathArray(pathInput) && pathInput.every(function (x) { return x[0] === x[0].toUpperCase(); });
  }

  function pathToAbsolute(pathInput, round) {
    if (isAbsoluteArray(pathInput)) {
      return clonePath(pathInput);
    }

    var pathArray = parsePathString(pathInput, round);
    var ii = pathArray.length;
    var resultArray = [];
    var x = 0;
    var y = 0;
    var mx = 0;
    var my = 0;
    var start = 0;

    if (pathArray[0][0] === 'M') {
      x = +pathArray[0][1];
      y = +pathArray[0][2];
      mx = x;
      my = y;
      start += 1;
      resultArray.push(['M', x, y]);
    }

    for (var i = start; i < ii; i += 1) {
      var segment = pathArray[i];
      var pathCommand = segment[0];
      var absCommand = pathCommand.toUpperCase();
      var absoluteSegment = [];
      var newSeg = [];
      resultArray.push(absoluteSegment);

      if (pathCommand !== absCommand) {
        absoluteSegment[0] = absCommand;

        switch (absCommand) {
          case 'A':
            newSeg = segment.slice(1, -2).concat([+segment[6] + x, +segment[7] + y]);
            for (var j = 0; j < newSeg.length; j += 1) {
              absoluteSegment.push(newSeg[j]);
            }
            break;
          case 'V':
            absoluteSegment[1] = +segment[1] + y;
            break;
          case 'H':
            absoluteSegment[1] = +segment[1] + x;
            break;
          default:
            if (absCommand === 'M') {
              mx = +segment[1] + x;
              my = +segment[2] + y;
            }
            // for is here to stay for eslint
            for (var j$1 = 1; j$1 < segment.length; j$1 += 1) {
              absoluteSegment.push(+segment[j$1] + (j$1 % 2 ? x : y));
            }
        }
      } else {
        for (var j$2 = 0; j$2 < segment.length; j$2 += 1) {
          absoluteSegment.push(segment[j$2]);
        }
      }

      var segLength = absoluteSegment.length;
      switch (absCommand) {
        case 'Z':
          x = mx;
          y = my;
          break;
        case 'H':
          x = +absoluteSegment[1];
          break;
        case 'V':
          y = +absoluteSegment[1];
          break;
        default:
          x = +absoluteSegment[segLength - 2];
          y = +absoluteSegment[segLength - 1];

          if (absCommand === 'M') {
            mx = x;
            my = y;
          }
      }
    }

    return roundPath(resultArray, round);
  }

  // returns {qx,qy} for shorthand quadratic bezier segments
  function shorthandToQuad(x1, y1, qx, qy, prevCommand) {
    return 'QT'.indexOf(prevCommand) > -1
      ? { qx: x1 * 2 - qx, qy: y1 * 2 - qy }
      : { qx: x1, qy: y1 };
  }

  // returns {x1,x2} for shorthand cubic bezier segments
  function shorthandToCubic(x1, y1, x2, y2, prevCommand) {
    return 'CS'.indexOf(prevCommand) > -1
      ? { x1: x1 * 2 - x2, y1: y1 * 2 - y2 }
      : { x1: x1, y1: y1 };
  }

  function normalizeSegment(segment, params, prevCommand) {
    var pathCommand = segment[0];
    var xy = segment.slice(1);
    var result = segment;

    if ('TQ'.indexOf(segment[0]) < 0) {
      // optional but good to be cautious
      params.qx = null;
      params.qy = null;
    }

    if (pathCommand === 'H') {
      result = ['L', segment[1], params.y1];
    } else if (pathCommand === 'V') {
      result = ['L', params.x1, segment[1]];
    } else if (pathCommand === 'S') {
      var ref = shorthandToCubic(params.x1, params.y1, params.x2, params.y2, prevCommand);
      var x1 = ref.x1;
      var y1 = ref.y1;
      params.x1 = x1;
      params.y1 = y1;
      result = ['C', x1, y1].concat(xy);
    } else if (pathCommand === 'T') {
      var ref$1 = shorthandToQuad(params.x1, params.y1, params.qx, params.qy, prevCommand);
      var qx = ref$1.qx;
      var qy = ref$1.qy;
      params.qx = qx;
      params.qy = qy;
      result = ['Q', qx, qy].concat(xy);
    } else if (pathCommand === 'Q') {
      var nqx = xy[0];
      var nqy = xy[1];
      params.qx = nqx;
      params.qy = nqy;
    }
    return result;
  }

  function isNormalizedArray(pathArray) {
    return Array.isArray(pathArray) && pathArray.every(function (seg) {
      var pathCommand = seg[0].toLowerCase();
      return paramsCount[pathCommand] === seg.length - 1 && /[ACLMQZ]/.test(seg[0]); // achlmrqstvz
    });
  }

  function normalizePath(pathInput, round) { // pathArray|pathString
    if (isNormalizedArray(pathInput)) {
      return clonePath(pathInput);
    }

    var pathArray = pathToAbsolute(pathInput, round);
    var params = {
      x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0, qx: null, qy: null,
    };
    var allPathCommands = [];
    var ii = pathArray.length;
    var prevCommand = '';
    var segment;
    var seglen;

    for (var i = 0; i < ii; i += 1) {
      // save current path command
      var ref = pathArray[i];
      var pathCommand = ref[0];

      // Save current path command
      allPathCommands[i] = pathCommand;
      // Get previous path command
      if (i) { prevCommand = allPathCommands[i - 1]; }
      // Previous path command is inputted to processSegment
      pathArray[i] = normalizeSegment(pathArray[i], params, prevCommand);

      segment = pathArray[i];
      seglen = segment.length;

      params.x1 = +segment[seglen - 2];
      params.y1 = +segment[seglen - 1];
      params.x2 = +(segment[seglen - 4]) || params.x1;
      params.y2 = +(segment[seglen - 3]) || params.y1;
    }
    return roundPath(pathArray, round);
  }

  function rotateVector(x, y, rad) {
    var X = x * Math.cos(rad) - y * Math.sin(rad);
    var Y = x * Math.sin(rad) + y * Math.cos(rad);
    return { x: X, y: Y };
  }

  // for more information of where this math came from visit:
  // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
  // LAF = largeArcFlag, SF = sweepFlag

  function arcToCubic(x1, y1, rx, ry, angle, LAF, SF, x2, y2, recursive) {
    var d120 = (Math.PI * 120) / 180;
    var rad = (Math.PI / 180) * (angle || 0);
    var res = [];
    var X1 = x1;
    var X2 = x2;
    var Y1 = y1;
    var Y2 = y2;
    var RX = rx;
    var RY = ry;
    var xy;
    var f1;
    var f2;
    var cx;
    var cy;

    if (!recursive) {
      xy = rotateVector(X1, Y1, -rad);
      X1 = xy.x;
      Y1 = xy.y;
      xy = rotateVector(X2, Y2, -rad);
      X2 = xy.x;
      Y2 = xy.y;

      var x = (X1 - X2) / 2;
      var y = (Y1 - Y2) / 2;
      var h = (x * x) / (RX * RY) + (Math.pow( y, 2 )) / (Math.pow( RY, 2 ));
      if (h > 1) {
        h = Math.sqrt(h);
        RX *= h;
        RY *= h;
      }
      var rx2 = Math.pow( RX, 2 );
      var ry2 = Math.pow( RY, 2 );
      var k = (LAF === SF ? -1 : 1)
            * Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x)
            / (rx2 * y * y + ry2 * x * x)));

      cx = ((k * RX * y) / RY) + ((X1 + X2) / 2);
      cy = ((k * -RY * x) / RX) + ((Y1 + Y2) / 2);

      f1 = (Math.asin(((Y1 - cy) / RY) * Math.pow( 10, 9 ) >> 0) / Math.pow( 10, 9 ));
      f2 = (Math.asin(((Y2 - cy) / RY) * Math.pow( 10, 9 ) >> 0) / Math.pow( 10, 9 ));

      f1 = X1 < cx ? Math.PI - f1 : f1;
      f2 = X2 < cx ? Math.PI - f2 : f2;

      if (f1 < 0) { f1 = Math.PI * 2 + f1; }
      if (f2 < 0) { f2 = Math.PI * 2 + f2; }

      if (SF && f1 > f2) {
        f1 -= Math.PI * 2;
      }
      if (!SF && f2 > f1) {
        f2 -= Math.PI * 2;
      }
    } else {
      var r1 = recursive[0];
      var r2 = recursive[1];
      var r3 = recursive[2];
      var r4 = recursive[3];
      f1 = r1;
      f2 = r2;
      cx = r3;
      cy = r4;
    }

    var df = f2 - f1;

    if (Math.abs(df) > d120) {
      var f2old = f2; var x2old = X2; var
        y2old = Y2;

      f2 = f1 + d120 * (SF && f2 > f1 ? 1 : -1);
      X2 = cx + RX * Math.cos(f2);
      Y2 = cy + RY * Math.sin(f2);
      res = arcToCubic(X2, Y2, RX, RY, angle, 0, SF, x2old, y2old, [f2, f2old, cx, cy]);
    }

    df = f2 - f1;
    var c1 = Math.cos(f1);
    var s1 = Math.sin(f1);
    var c2 = Math.cos(f2);
    var s2 = Math.sin(f2);
    var t = Math.tan(df / 4);
    var hx = (4 / 3) * RX * t;
    var hy = (4 / 3) * RY * t;
    var m1 = [X1, Y1];
    var m2 = [X1 + hx * s1, Y1 - hy * c1];
    var m3 = [X2 + hx * s2, Y2 - hy * c2];
    var m4 = [X2, Y2];
    m2[0] = 2 * m1[0] - m2[0];
    m2[1] = 2 * m1[1] - m2[1];

    if (recursive) {
      return [m2, m3, m4].concat(res);
    }
    res = [m2, m3, m4].concat(res).join().split(',');
    return res.map(function (rz, i) {
      if (i % 2) {
        return rotateVector(res[i - 1], rz, rad).y;
      }
      return rotateVector(rz, res[i + 1], rad).x;
    });
  }

  function quadToCubic(x1, y1, qx, qy, x2, y2) {
    var r13 = 1 / 3;
    var r23 = 2 / 3;
    return [
      r13 * x1 + r23 * qx, // cpx1
      r13 * y1 + r23 * qy, // cpy1
      r13 * x2 + r23 * qx, // cpx2
      r13 * y2 + r23 * qy, // cpy2
      x2, y2 ];
  }

  // t = [0-1]
  function getPointAtSegLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
    var t1 = 1 - t;
    return {
      x: (Math.pow( t1, 3 )) * p1x
        + t1 * t1 * 3 * t * c1x
        + t1 * 3 * t * t * c2x
        + (Math.pow( t, 3 )) * p2x,
      y: (Math.pow( t1, 3 )) * p1y
        + t1 * t1 * 3 * t * c1y
        + t1 * 3 * t * t * c2y
        + (Math.pow( t, 3 )) * p2y,
    };
  }

  function midPoint(a, b, t) {
    var ax = a[0];
    var ay = a[1];
    var bx = b[0];
    var by = b[1];
    return [ax + (bx - ax) * t, ay + (by - ay) * t];
  }

  function lineToCubic(x1, y1, x2, y2) {
    var t = 0.5;
    var p0 = [x1, y1];
    var p1 = [x2, y2];
    var p2 = midPoint(p0, p1, t);
    var p3 = midPoint(p1, p2, t);
    var p4 = midPoint(p2, p3, t);
    var p5 = midPoint(p3, p4, t);
    var p6 = midPoint(p4, p5, t);
    var cp1 = getPointAtSegLength.apply(0, p0.concat(p2, p4, p6, t));
    var cp2 = getPointAtSegLength.apply(0, p6.concat(p5, p3, p1, 0));

    return [cp1.x, cp1.y, cp2.x, cp2.y, x2, y2];
  }

  function segmentToCubic(segment, params) {
    if ('TQ'.indexOf(segment[0]) < 0) {
      params.qx = null;
      params.qy = null;
    }

    var ref = segment.slice(1);
    var s1 = ref[0];
    var s2 = ref[1];

    switch (segment[0]) {
      case 'M':
        params.x = s1;
        params.y = s2;
        return segment;
      case 'A':
        return ['C'].concat(arcToCubic.apply(0, [params.x1, params.y1].concat(segment.slice(1))));
      case 'Q':
        params.qx = s1;
        params.qy = s2;
        return ['C'].concat(quadToCubic.apply(0, [params.x1, params.y1].concat(segment.slice(1))));
      case 'L':
        return ['C'].concat(lineToCubic(params.x1, params.y1, segment[1], segment[2]));
      case 'Z':
        return ['C'].concat(lineToCubic(params.x1, params.y1, params.x, params.y));
    }
    return segment;
  }

  function pathToCurve(pathInput, round) {
    var assign;
   // pathArray|pathString
    if (isCurveArray(pathInput)) {
      return clonePath(pathInput);
    }

    var pathArray = normalizePath(pathInput, round);
    var params = {
      x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0, qx: null, qy: null,
    };
    var allPathCommands = [];
    var pathCommand = '';
    var ii = pathArray.length;
    var segment;
    var seglen;

    for (var i = 0; i < ii; i += 1) {
      if (pathArray[i]) { (assign = pathArray[i], pathCommand = assign[0]); }

      allPathCommands[i] = pathCommand;
      pathArray[i] = segmentToCubic(pathArray[i], params);

      fixArc(pathArray, allPathCommands, i);
      ii = pathArray.length; // solves curveArrays ending in Z

      segment = pathArray[i];
      seglen = segment.length;

      params.x1 = +segment[seglen - 2];
      params.y1 = +segment[seglen - 1];
      params.x2 = +(segment[seglen - 4]) || params.x1;
      params.y2 = +(segment[seglen - 3]) || params.y1;
    }
    return roundPath(pathArray, round);
  }

  // https://github.com/paperjs/paper.js/blob/develop/src/path/Path.js

  function getCubicSegArea(x0, y0, x1, y1, x2, y2, x3, y3) {
    // http://objectmix.com/graphics/133553-area-closed-bezier-curve.html
    return (3 * ((y3 - y0) * (x1 + x2) - (x3 - x0) * (y1 + y2)
             + (y1 * (x0 - x2)) - (x1 * (y0 - y2))
             + (y3 * (x2 + x0 / 3)) - (x3 * (y2 + y0 / 3)))) / 20;
  }

  function getPathArea(pathArray, round) {
    var x = 0; var y = 0; var mx = 0; var my = 0; var
      len = 0;
    return pathToCurve(pathArray, round).map(function (seg) {
      var assign;

      switch (seg[0]) {
        case 'M':
        case 'Z':
          mx = seg[0] === 'M' ? seg[1] : mx;
          my = seg[0] === 'M' ? seg[2] : my;
          x = mx;
          y = my;
          return 0;
        default:
          len = getCubicSegArea.apply(0, [x, y].concat(seg.slice(1)));
          (assign = seg.slice(-2), x = assign[0], y = assign[1]);
          return len;
      }
    }).reduce(function (a, b) { return a + b; }, 0);
  }

  function base3(p1, p2, p3, p4, t) {
    var t1 = -3 * p1 + 9 * p2 - 9 * p3 + 3 * p4;
    var t2 = t * t1 + 6 * p1 - 12 * p2 + 6 * p3;
    return t * t2 - 3 * p1 + 3 * p2;
  }

  // returns the cubic bezier segment length
  function getSegCubicLength(x1, y1, x2, y2, x3, y3, x4, y4, z) {
    var Z;
    if (z === null || Number.isNaN(+z)) { Z = 1; }

    // Z = Z > 1 ? 1 : Z < 0 ? 0 : Z;
    if (Z > 1) { Z = 1; }
    if (Z < 0) { Z = 0; }

    var z2 = Z / 2; var ct = 0; var xbase = 0; var ybase = 0; var sum = 0;
    var Tvalues = [-0.1252, 0.1252, -0.3678, 0.3678,
      -0.5873, 0.5873, -0.7699, 0.7699,
      -0.9041, 0.9041, -0.9816, 0.9816];
    var Cvalues = [0.2491, 0.2491, 0.2335, 0.2335,
      0.2032, 0.2032, 0.1601, 0.1601,
      0.1069, 0.1069, 0.0472, 0.0472];

    Tvalues.forEach(function (T, i) {
      ct = z2 * T + z2;
      xbase = base3(x1, x2, x3, x4, ct);
      ybase = base3(y1, y2, y3, y4, ct);
      sum += Cvalues[i] * Math.sqrt(xbase * xbase + ybase * ybase);
    });
    return z2 * sum;
  }

  // calculates the shape total length
  // equivalent to shape.getTotalLength()
  // pathToCurve version
  function getPathLength(pathArray, round) {
    var totalLength = 0;
    pathToCurve(pathArray, round).forEach(function (s, i, curveArray) {
      totalLength += s[0] !== 'M' ? getSegCubicLength.apply(0, curveArray[i - 1].slice(-2).concat(s.slice(1))) : 0;
    });
    return totalLength;
  }

  function getDrawDirection(pathArray, round) {
    return getPathArea(pathToCurve(pathArray, round)) >= 0;
  }

  // calculates the shape total length
  // almost equivalent to shape.getTotalLength()
  function getPointAtLength(pathArray, length) {
    var totalLength = 0;
    var segLen;
    var data;
    var result;

    return pathToCurve(pathArray, 9).map(function (seg, i, curveArray) { // process data
      data = i ? curveArray[i - 1].slice(-2).concat(seg.slice(1)) : seg.slice(1);
      segLen = i ? getSegCubicLength.apply(0, data) : 0;
      totalLength += segLen;

      if (i === 0) {
        result = { x: data[0], y: data[1] };
      } else if (totalLength > length && length > totalLength - segLen) {
        result = getPointAtSegLength.apply(0, data.concat(1 - (totalLength - length) / segLen));
      } else {
        result = null;
      }

      return result;
    }).filter(function (x) { return x; }).slice(-1)[0]; // isolate last segment
  }

  // returns the cubic bezier segment length
  function getCubicSize(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
    var a = (c2x - 2 * c1x + p1x) - (p2x - 2 * c2x + c1x);
    var b = 2 * (c1x - p1x) - 2 * (c2x - c1x);
    var c = p1x - c1x;
    var t1 = (-b + Math.sqrt(b * b - 4 * a * c)) / 2 / a;
    var t2 = (-b - Math.sqrt(b * b - 4 * a * c)) / 2 / a;
    var y = [p1y, p2y];
    var x = [p1x, p2x];
    var dot;

    if (Math.abs(t1) > '1e12') { t1 = 0.5; }
    if (Math.abs(t2) > '1e12') { t2 = 0.5; }

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

    if (Math.abs(t1) > '1e12') { t1 = 0.5; }
    if (Math.abs(t2) > '1e12') { t2 = 0.5; }

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
      min: { x: Math.min.apply(0, x), y: Math.min.apply(0, y) },
      max: { x: Math.max.apply(0, x), y: Math.max.apply(0, y) },
    };
  }

  function getPathBBox(pathArray, round) {
    if (!pathArray) {
      return {
        x: 0, y: 0, width: 0, height: 0, x2: 0, y2: 0,
      };
    }
    var pathCurve = pathToCurve(pathArray, round);

    var x = 0;
    var y = 0;
    var X = [];
    var Y = [];

    pathCurve.forEach(function (segment) {
      var ref = segment.slice(-2);
      var s1 = ref[0];
      var s2 = ref[1];
      if (segment[0] === 'M') {
        x = s1;
        y = s2;
        X.push(s1);
        Y.push(s2);
      } else {
        var dim = getCubicSize.apply(0, [x, y].concat(segment.slice(1)));
        X = X.concat(dim.min.x, dim.max.x);
        Y = Y.concat(dim.min.y, dim.max.y);
        x = s1;
        y = s2;
      }
    });

    var xTop = Math.min.apply(0, X);
    var yTop = Math.min.apply(0, Y);
    var xBot = Math.max.apply(0, X);
    var yBot = Math.max.apply(0, Y);
    var width = xBot - xTop;
    var height = yBot - yTop;

    return {
      x: xTop,
      y: yTop,
      x2: xBot,
      y2: yBot,
      width: width,
      height: height,
      cx: xTop + width / 2,
      cy: yTop + height / 2,
    };
  }

  function isRelativeArray(pathInput) {
    return isPathArray(pathInput)
      && pathInput.slice(1).every(function (seg) { return seg[0] === seg[0].toLowerCase(); });
  }

  function pathToString(pathArray) {
    return pathArray.map(function (x) { return x[0].concat(x.slice(1).join(' ')); }).join('');
  }

  function splitPath(pathInput) {
    return pathToString(pathToAbsolute(pathInput, 0))
      .replace(/(m|M)/g, '|$1')
      .split('|')
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s; });
  }

  function pathToRelative(pathInput, round) {
    if (isRelativeArray(pathInput)) {
      return clonePath(pathInput);
    }

    var pathArray = parsePathString(pathInput, round);
    var ii = pathArray.length;
    var resultArray = [];
    var x = 0;
    var y = 0;
    var mx = 0;
    var my = 0;
    var start = 0;

    if (pathArray[0][0] === 'M') {
      x = +pathArray[0][1];
      y = +pathArray[0][2];
      mx = x;
      my = y;
      start += 1;
      resultArray.push(['M', x, y]);
    }

    for (var i = start; i < ii; i += 1) {
      var segment = pathArray[i];
      var pathCommand = segment[0];
      var relativeCommand = pathCommand.toLowerCase();
      var relativeSegment = [];
      var newSeg = [];
      resultArray.push(relativeSegment);

      if (pathCommand !== relativeCommand) {
        relativeSegment[0] = relativeCommand;
        switch (relativeCommand) {
          case 'a':
            newSeg = segment.slice(1, -2).concat([+segment[6] - x, +segment[7] - y]);

            for (var j = 0; j < newSeg.length; j += 1) {
              relativeSegment.push(newSeg[j]);
            }
            break;
          case 'v':
            relativeSegment[1] = +segment[1] - y;
            break;
          default:
            // for is here to stay for eslint
            for (var j$1 = 1; j$1 < segment.length; j$1 += 1) {
              relativeSegment.push(+segment[j$1] - (j$1 % 2 ? x : y));
            }

            if (relativeCommand === 'm') {
              mx = +segment[1];
              my = +segment[2];
            }
        }
      } else {
        if (pathCommand === 'm') {
          mx = +segment[1] + x;
          my = +segment[2] + y;
        }
        for (var j$2 = 0; j$2 < segment.length; j$2 += 1) {
          relativeSegment.push(segment[j$2]);
        }
      }

      var segLength = relativeSegment.length;
      switch (relativeSegment[0]) {
        case 'z':
          x = mx;
          y = my;
          break;
        case 'h':
          x += relativeSegment[segLength - 1];
          break;
        case 'v':
          y += relativeSegment[segLength - 1];
          break;
        default:
          x += resultArray[i][segLength - 2];
          y += resultArray[i][segLength - 1];
      }
    }
    return roundPath(resultArray, round);
  }

  function optimizePath(pathArray, round) {
    var absolutePath = pathToAbsolute(pathArray, round);
    var relativePath = pathToRelative(pathArray, round);
    return absolutePath.map(function (x, i) {
      if (i) {
        return x.join('').length < relativePath[i].join('').length ? x : relativePath[i];
      }
      return x;
    });
  }

  // reverse CURVE based pathArray segments only
  function reverseCurve(pathArray) {
    var rotatedCurve = pathArray.slice(1)
      .map(function (x, i, curveOnly) { return (!i
        ? pathArray[0].slice(1).concat(x.slice(1))
        : curveOnly[i - 1].slice(-2).concat(x.slice(1))); })
      .map(function (x) { return x.map(function (y, i) { return x[x.length - i - 2 * (1 - (i % 2))]; }); })
      .reverse();

    return [['M'].concat(rotatedCurve[0]
      .slice(0, 2))]
      .concat(rotatedCurve.map(function (x) { return ['C'].concat(x.slice(2)); }));
  }

  function reversePath(pathString, round) { // pathArray | pathString
    var absolutePath = pathToAbsolute(pathString, round);
    var isClosed = absolutePath.slice(-1)[0][0] === 'Z';
    var reversedPath = [];
    var segLength = 0;

    reversedPath = normalizePath(absolutePath, round).map(function (segment, i) {
      segLength = segment.length;
      return {
        seg: absolutePath[i], // absolute
        n: segment, // normalized
        c: absolutePath[i][0], // pathCommand
        x: segment[segLength - 2], // x
        y: segment[segLength - 1], // y
      };
    }).map(function (seg, i, pathArray) {
      var segment = seg.seg;
      var data = seg.n;
      var prevSeg = i && pathArray[i - 1];
      var nextSeg = pathArray[i + 1] && pathArray[i + 1];
      var pathCommand = seg.c;
      var pLen = pathArray.length;
      var x = i ? pathArray[i - 1].x : pathArray[pLen - 1].x;
      var y = i ? pathArray[i - 1].y : pathArray[pLen - 1].y;
      var result = [];

      switch (pathCommand) {
        case 'M':
          result = isClosed ? ['Z'] : [pathCommand, x, y];
          break;
        case 'A':
          result = segment.slice(0, -3).concat([(segment[5] === 1 ? 0 : 1), x, y]);
          break;
        case 'C':
          if (nextSeg && nextSeg.c === 'S') {
            result = ['S', segment[1], segment[2], x, y];
          } else {
            result = [pathCommand, segment[3], segment[4], segment[1], segment[2], x, y];
          }
          break;
        case 'S':
          if ((prevSeg && 'CS'.indexOf(prevSeg.c) > -1) && (!nextSeg || (nextSeg && nextSeg.c !== 'S'))) {
            result = ['C', data[3], data[4], data[1], data[2], x, y];
          } else {
            result = [pathCommand, data[1], data[2], x, y];
          }
          break;
        case 'Q':
          if (nextSeg && nextSeg.c === 'T') {
            result = ['T', x, y];
          } else {
            result = segment.slice(0, -2).concat([x, y]);
          }
          break;
        case 'T':
          if ((prevSeg && 'QT'.indexOf(prevSeg.c) > -1) && (!nextSeg || (nextSeg && nextSeg.c !== 'T'))) {
            result = ['Q', data[1], data[2], x, y];
          } else {
            result = [pathCommand, x, y];
          }
          break;
        case 'Z':
          result = ['M', x, y];
          break;
        case 'H':
          result = [pathCommand, x];
          break;
        case 'V':
          result = [pathCommand, y];
          break;
        default:
          result = segment.slice(0, -2).concat([x, y]);
      }

      return result;
    });

    return isClosed ? reversedPath.reverse()
      : [reversedPath[0]].concat(reversedPath.slice(1).reverse());
  }

  var epsilon = 1e-9;

  function getSVGMatrix(transformObject) {
    var matrix = new CSS3Matrix();
    var origin = transformObject.origin;
    var originX = +origin[0];
    var originY = +origin[1];
    // originZ = +origin[2] || originX, // maybe later. maybe not required
    // perspective = transformObject.perspective,
    var translate = transformObject.translate;
    var rotate = transformObject.rotate;
    var skew = transformObject.skew;
    var scale = transformObject.scale;

    // !isNaN(perspective) && perspective && (matrix.m34 = -1/perspective)

    // set translate
    if (!Number.isNaN(translate) || (Array.isArray(translate) && translate.some(function (x) { return +x !== 0; }))) {
      matrix = Array.isArray(translate)
        ? matrix.translate(+translate[0] || 0, +translate[1] || 0, +translate[2] || 0)
        : matrix.translate(+translate || 0, 0, 0);
    }

    if (rotate || skew || scale) {
      // set SVG transform-origin, always defined
      // matrix = matrix.translate(+originX,+originY,+originZ)
      matrix = matrix.translate(+originX, +originY);

      // set rotation
      if (rotate) {
        matrix = Array.isArray(rotate) && rotate.some(function (x) { return +x !== 0; })
          ? matrix.rotate(+rotate[0] || 0, +rotate[1] || 0, +rotate[2] || 0)
          : matrix.rotate(+rotate || 0);
      }
      // set skew(s)
      if (Array.isArray(skew) && skew.some(function (x) { return +x !== 0; })) {
        if (Array.isArray(skew)) {
          matrix = skew[0] ? matrix.skewX(+skew[0] || 0) : matrix;
          matrix = skew[1] ? matrix.skewY(+skew[1] || 0) : matrix;
        } else {
          matrix = matrix.skewX(+skew || 0);
        }
      }
      // set scale
      if (!Number.isNaN(scale) || (Array.isArray(scale) && scale.some(function (x) { return +x !== 1; }))) {
        matrix = Array.isArray(scale)
          ? (matrix.scale(+scale[0] || 1, +scale[1] || 1, +scale[2] || 1))
          : matrix.scale(+scale || 1);
      }
      // set SVG transform-origin
      // matrix = matrix.translate(-originX,-originY,-originZ)
      matrix = matrix.translate(-originX, -originY);
    }
    return matrix;
  }

  function transformEllipse(m, rx, ry, ax) {
    // We consider the current ellipse as image of the unit circle
    // by first scale(rx,ry) and then rotate(ax) ...
    // So we apply ma =  m x rotate(ax) x scale(rx,ry) to the unit circle.
    var c = Math.cos((ax * Math.PI) / 180);
    var s = Math.sin((ax * Math.PI) / 180);
    var ma = [
      rx * (m[0] * c + m[2] * s),
      rx * (m[1] * c + m[3] * s),
      ry * (-m[0] * s + m[2] * c),
      ry * (-m[1] * s + m[3] * c) ];

    // ma * transpose(ma) = [ J L ]
    //                      [ L K ]
    // L is calculated later (if the image is not a circle)
    var J = ma[0] * ma[0] + ma[2] * ma[2];
    var K = ma[1] * ma[1] + ma[3] * ma[3];

    // the discriminant of the characteristic polynomial of ma * transpose(ma)
    var D = ((ma[0] - ma[3]) * (ma[0] - ma[3]) + (ma[2] + ma[1]) * (ma[2] + ma[1]))
            * ((ma[0] + ma[3]) * (ma[0] + ma[3]) + (ma[2] - ma[1]) * (ma[2] - ma[1]));

    // the "mean eigenvalue"
    var JK = (J + K) / 2;

    // check if the image is (almost) a circle
    if (D < epsilon * JK) {
      // if it is
      var rxy = Math.sqrt(JK);

      return { rx: rxy, ry: rxy, ax: 0 };
    }

    // if it is not a circle
    var L = ma[0] * ma[1] + ma[2] * ma[3];

    D = Math.sqrt(D);

    // {l1,l2} = the two eigen values of ma * transpose(ma)
    var l1 = JK + D / 2;
    var l2 = JK - D / 2;
    // the x - axis - rotation angle is the argument of the l1 - eigenvector
    var AX = (Math.abs(L) < epsilon && Math.abs(l1 - K) < epsilon) ? 90
      : Math.atan(Math.abs(L) > Math.abs(l1 - K) ? (l1 - J) / L
        : ((L / (l1 - K))) * 180) / Math.PI;
    var RX;
    var RY;

    // if ax > 0 => rx = sqrt(l1), ry = sqrt(l2), else exchange axes and ax += 90
    if (AX >= 0) {
      // if ax in [0,90]
      RX = Math.sqrt(l1);
      RY = Math.sqrt(l2);
    } else {
      // if ax in ]-90,0[ => exchange axes
      AX += 90;
      RX = Math.sqrt(l2);
      RY = Math.sqrt(l1);
    }

    return { rx: RX, ry: RY, ax: AX };
  }

  // Given an xyz point and an xyz perspective origin point,
  // this will return the xy projected location
  // Using the equation found here: http://en.wikipedia.org/wiki/3D_projection#Diagram
  // https://stackoverflow.com/questions/23792505/predicted-rendering-of-css-3d-transformed-pixel

  function projection2d(m, point2D, origin) {
    var point3D = m.transformPoint({
      x: point2D[0], y: point2D[1], z: 0, w: 1,
    });
    var originX = origin[0] || 0;
    var originY = origin[1] || 0;
    var originZ = origin[2] || 0;
    var relativePositionX = point3D.x - originX;
    var relativePositionY = point3D.y - originY;
    var relativePositionZ = point3D.z - originZ;

    return [
      relativePositionX * (Math.abs(originZ) / Math.abs(relativePositionZ)) + originX,
      relativePositionY * (Math.abs(originZ) / Math.abs(relativePositionZ)) + originY ];
  }

  function transformPath(pathArray, transformObject, round) {
    var assign;

    var x; var y; var i; var j; var ii; var jj; var lx; var ly; var te;
    var absolutePath = pathToAbsolute(pathArray);
    var normalizedPath = normalizePath(absolutePath);
    var matrixInstance = getSVGMatrix(transformObject);
    var origin = transformObject.origin;
    var a = matrixInstance.a;
    var b = matrixInstance.b;
    var c = matrixInstance.c;
    var d = matrixInstance.d;
    var e = matrixInstance.e;
    var f = matrixInstance.f;
    var matrix2d = [a, b, c, d, e, f];
    var params = {
      x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0,
    };
    var segment = [];
    var seglen = 0;
    var pathCommand = '';
    var transformedPath = [];
    var allPathCommands = []; // needed for arc to curve transformation
    var result = [];

    if (!matrixInstance.isIdentity) {
      for (i = 0, ii = absolutePath.length; i < ii; i += 1) {
        segment = absolutePath[i];

        if (absolutePath[i]) { (assign = segment, pathCommand = assign[0]); }

        // REPLACE Arc path commands with Cubic Beziers
        // we don't have any scripting know-how on 3d ellipse transformation
        /// ////////////////////////////////////////
        allPathCommands[i] = pathCommand;

        if (pathCommand === 'A' && !matrixInstance.is2D) {
          segment = segmentToCubic(normalizedPath[i], params);

          absolutePath[i] = segmentToCubic(normalizedPath[i], params);
          fixArc(absolutePath, allPathCommands, i);

          normalizedPath[i] = segmentToCubic(normalizedPath[i], params);
          fixArc(normalizedPath, allPathCommands, i);
          ii = Math.max(absolutePath.length, normalizedPath.length);
        }
        /// ////////////////////////////////////////

        segment = normalizedPath[i];
        seglen = segment.length;

        params.x1 = +segment[seglen - 2];
        params.y1 = +segment[seglen - 1];
        params.x2 = +(segment[seglen - 4]) || params.x1;
        params.y2 = +(segment[seglen - 3]) || params.y1;

        result = { s: absolutePath[i], c: absolutePath[i][0] };

        if (pathCommand !== 'Z') {
          result.x = params.x1;
          result.y = params.y1;
        }
        transformedPath = transformedPath.concat(result);
      }

      transformedPath = transformedPath.map(function (seg) {
        var assign, assign$1, assign$2;

        pathCommand = seg.c;
        segment = seg.s;
        switch (pathCommand) {
          case 'A': // only apply to 2D transformations
            te = transformEllipse(matrix2d, segment[1], segment[2], segment[3]);

            if (matrix2d[0] * matrix2d[3] - matrix2d[1] * matrix2d[2] < 0) {
              segment[5] = +segment[5] ? 0 : 1;
            }

            (assign = projection2d(matrixInstance, [segment[6], segment[7]], origin), lx = assign[0], ly = assign[1]);

            if ((x === lx && y === ly) || (te.rx < epsilon * te.ry) || (te.ry < epsilon * te.rx)) {
              segment = ['L', lx, ly];
            } else {
              segment = [pathCommand, te.rx, te.ry, te.ax, segment[4], segment[5], lx, ly];
            }

            x = lx; y = ly;
            return segment;

          case 'L':
          case 'H':
          case 'V':

            (assign$1 = projection2d(matrixInstance, [seg.x, seg.y], origin), lx = assign$1[0], ly = assign$1[1]);

            if (x !== lx && y !== ly) {
              segment = ['L', lx, ly];
            } else if (y === ly) {
              segment = ['H', lx];
            } else if (x === lx) {
              segment = ['V', ly];
            }

            x = lx; y = ly; // now update x and y

            return segment;
          default:
            for (j = 1, jj = segment.length; j < jj; j += 2) {
              // compute line coordinates without altering previous coordinates
              (assign$2 = projection2d(matrixInstance, [segment[j], segment[j + 1]], origin), x = assign$2[0], y = assign$2[1]);
              segment[j] = x;
              segment[j + 1] = y;
            }
            return segment;
        }
      });
      return roundPath(transformedPath, round);
    }
    return clonePath(absolutePath);
  }

  var util = {
    CSSMatrix: CSS3Matrix,
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
    options: SVGPCO,
  };

  var SVGPathCommander = function SVGPathCommander(pathValue, ops) {
    var options = ops || {};
    // check for either true or > 0
    var roundOption = +options.round === 0 || options.round === false ? 0 : SVGPCO.round;
    var decimalsOption = roundOption && (options.decimals || SVGPCO.decimals);
    var originOption = options.origin;
    var path = parsePathString(pathValue, this.round);

    // set instance options
    this.round = roundOption === 0 ? 0 : decimalsOption; // ZERO will disable rounding numbers
    this.origin = originOption && !Number.isNaN(originOption.x) && !Number.isNaN(originOption.y)
      ? originOption : null;

    this.segments = clonePath(path);
    this.pathValue = pathValue;
    return this;
  };

  var SVGPCProto = SVGPathCommander.prototype;

  SVGPCProto.toAbsolute = function toAbsolute() {
    var path = pathToAbsolute(this.segments, this.round);
    this.segments = clonePath(path);
    return this;
  };
  SVGPCProto.toRelative = function toRelative() {
    var path = pathToRelative(this.segments, this.round);
    this.segments = clonePath(path);
    return this;
  };
  SVGPCProto.reverse = function reverse(onlySubpath) {
    this.toAbsolute();

    var subPath = splitPath(this.pathValue).length > 1 && splitPath(this.toString());
    var absoluteMultiPath = subPath && clonePath(subPath)
      .map(function (x, i) {
        if (onlySubpath) {
          return i ? reversePath(x) : parsePathString(x);
        }
        return reversePath(x);
      });

    var path = [];
    if (subPath) {
      path = absoluteMultiPath.flat(1);
    } else {
      path = onlySubpath ? this.segments : reversePath(this.segments, this.round);
    }

    this.segments = clonePath(path);
    return this;
  };
  SVGPCProto.normalize = function normalize() {
    var path = normalizePath(this.segments, this.round);
    this.segments = clonePath(path);
    return this;
  };
  SVGPCProto.optimize = function optimize() {
    var path = optimizePath(this.segments, this.round);
    this.segments = clonePath(path);
    return this;
  };
  SVGPCProto.transform = function transform(transformInput) {
    var transformObject = transformInput || {};
    if (!transformObject.origin) {
      var BBox = getPathBBox(this.segments);
      transformObject.origin = [BBox.cx, BBox.cy, BBox.cx];
    }

    var path = transformPath(
      this.segments, // the pathArray
      transformObject, // transform functions object, now includes the transform origin
      this.round // decimals option
    );

    this.segments = clonePath(path);
    return this;
  };
  SVGPCProto.flipX = function flipX() {
    this.transform({ rotate: [180, 0, 0] });
    return this;
  };
  SVGPCProto.flipY = function flipY() {
    this.transform({ rotate: [0, 180, 0] });
    return this;
  };
  SVGPCProto.toString = function toString() {
    return pathToString(this.segments);
  };

  Object.keys(util).forEach(function (x) { SVGPathCommander[x] = util[x]; });

  return SVGPathCommander;

})));
