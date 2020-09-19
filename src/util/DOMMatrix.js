import CSSMatrix from 'dommatrix'

let CSS3Matrix = typeof DOMMatrix !== undefined ? DOMMatrix : CSSMatrix

// a more accurate way to determine a matrix depth
CSS3Matrix.prototype.is3D = function(){
  let m = this
  return !(m.m31 == 0 && m.m32 == 0 && m.m33 == 1 && m.m34 == 0 && m.m43 == 0 && m.m44 == 1)
}

export default CSS3Matrix