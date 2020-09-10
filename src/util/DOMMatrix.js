import CSSMatrix from './CSSMatrix.js'

let CSS3Matrix = typeof DOMMatrix !== undefined ? DOMMatrix : CSSMatrix

CSS3Matrix.prototype.toArray = function(){
  let m = this
  // return m.is2D ? [m.a, m.b, m.c, m.d, m.e, m.f] // COMING SOON
  //               : [
  //                   m.m11, m.m12, m.m13, m.m14,
  //                   m.m21, m.m22, m.m23, m.m24,
  //                   m.m31, m.m32, m.m33, m.m34,
  //                   m.m41, m.m42, m.m43, m.m44
  //                 ]
  return [m.a, m.b, m.c, m.d, m.e, m.f]
}

export default CSS3Matrix