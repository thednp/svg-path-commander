
import util from './util.js'
import getPathBBox from './getPathBBox.js'

export default function(pathArray,transformObject,origin){
  let matrix = new util.CSSMatrix(),
      BBox = getPathBBox(pathArray),
      originX = origin && !isNaN(origin.x) ? +origin.x : BBox.cx, 
      originY = origin && !isNaN(origin.y) ? +origin.y : BBox.cy,
      // perspective = transformObject.perspective, // WORK IN PROGRESS
      translate = transformObject.translate,
      rotate = transformObject.rotate,
      skew = transformObject.skew,
      scale = transformObject.scale;

  // !isNaN(perspective) && +perspective && (matrix.m34 = -1/perspective) // set perspective LATER

  if (translate){ // set translate
    matrix = Array.isArray(translate) ? (matrix.translate.apply(matrix, translate)) : matrix.translate(translate) 
  }

  if (rotate || skew || scale) {
    matrix = matrix.translate(originX,originY) // set SVG transform-origin

    if (rotate) {
      matrix = Array.isArray(rotate) ? matrix.rotate.apply(matrix,rotate) : matrix.rotate(rotate) // set rotation
    }
    if (skew) { // set skew
      matrix = skew[0] ? matrix.skewX(skew[0]) : matrix;
      matrix = skew[1] ? matrix.skewY(skew[1]) : matrix;
    }
    if (scale){
      matrix = Array.isArray(scale) ? (matrix.scale.apply(matrix,scale)): matrix.scale(scale) // set scale
    }

    matrix = matrix.translate(-originX,-originY) // set SVG transform-origin
  }

  // return matrix
  // return [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f]
  return matrix.toArray()
}