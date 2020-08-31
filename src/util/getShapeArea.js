
// https://github.com/paperjs/paper.js/blob/develop/src/path/Path.js
// Jürg Lehni & Jonathan Puckey
function getArea(v) {
  // http://objectmix.com/graphics/133553-area-closed-bezier-curve.html
  let x0 = v[0], y0 = v[1],
      x1 = v[2], y1 = v[3],
      x2 = v[4], y2 = v[5],
      x3 = v[6], y3 = v[7];
  return 3 * ((y3 - y0) * (x1 + x2) - (x3 - x0) * (y1 + y2)
          + y1 * (x0 - x2) - x1 * (y0 - y2)
          + y3 * (x2 + x0 / 3) - x3 * (y2 + y0 / 3)) / 20;
}

// export default function getShapeArea(curveArray) {
//   let cv = curveArray.slice(1), previous;
//   return cv.map(function (seg,i){
//     previous = cv[i === 0 ? cv.length-1 : i-1];
//     return getArea(previous.slice(previous.length-2).concat(seg.slice(1)))
//   }).reduce((a, b) => a + b, 0)
// }
export default function getShapeArea(curveArray) {
  return curveArray.slice(1).map(function (seg,i,cv){
    let previous = cv[i === 0 ? cv.length-1 : i-1];
    return getArea(previous.slice(previous.length-2).concat(seg.slice(1)))
  }).reduce((a, b) => a + b, 0)
}