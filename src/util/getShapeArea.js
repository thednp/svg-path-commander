
// https://github.com/paperjs/paper.js/blob/develop/src/path/Path.js
// Jürg Lehni & Jonathan Puckey
import getArea from './getArea.js'

export default function getShapeArea(curveArray) {
  let cv = curveArray.slice(1), previous;
  return cv.map(function (seg,i){
    previous = cv[i === 0 ? cv.length-1 : i-1];
    return getArea(previous.slice(previous.length-2).concat(seg.slice(1)))
  }).reduce((a, b) => a + b, 0)
}