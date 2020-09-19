
import CSS3Matrix from './DOMMatrix.js'

export default function(transformObject){ 
  let matrix = new CSS3Matrix(),
      origin = transformObject.origin,
      originX = +origin[0], 
      originY = +origin[1],
      // originZ = +origin[2] || originX, // maybe later. maybe not required
      // perspective = transformObject.perspective,
      translate = transformObject.translate,
      rotate = transformObject.rotate,
      skew = transformObject.skew,
      scale = transformObject.scale;

  // !isNaN(perspective) && (matrix.m34 = -1/perspective)

  if (!isNaN(translate) || Array.isArray(translate) && translate.some(x=>+x!==0)){ // set translate
    matrix = Array.isArray(translate) ? matrix.translate(+translate[0]||0,+translate[1]||0,+translate[2]||0) 
                                      : matrix.translate(+translate||0,0,0)
  }

  if (rotate || skew || scale) {
    matrix = matrix.translate(+originX,+originY) // set SVG transform-origin, always defined

    if (rotate) { // set rotation
      matrix = Array.isArray(rotate) && rotate.some(x=>+x!==0) 
              ? matrix.rotate(+rotate[0]||0,+rotate[1]||0,+rotate[2]||0)
              : matrix.rotate(+rotate||0)
    }
    if (Array.isArray(skew) && skew.some(x=>+x!==0)) { // set skew(s)
      if (Array.isArray(skew)) {
        matrix = skew[0] ? matrix.skewX(+skew[0]||0) : matrix;
        matrix = skew[1] ? matrix.skewY(+skew[1]||0) : matrix;
      } else {
        matrix = matrix.skewX(+skew||0);
      }
    }
    if (!isNaN(scale) || Array.isArray(scale) && scale.some(x=>+x!==1) ){ // set scale
      matrix = Array.isArray(scale) 
             ? (matrix.scale(+scale[0]||1,+scale[1]||1,+scale[2]||1))
             : matrix.scale(+scale||1)
    }
    matrix = matrix.translate(-originX,-originY) // set SVG transform-origin
  }

  return matrix
}