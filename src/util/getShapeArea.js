
// https://github.com/paperjs/paper.js/blob/develop/src/path/Path.js
// Jürg Lehni & Jonathan Puckey
import getArea from './getArea.js'

export default function getShapeArea(curveArray) {
  let area = 0
  curveArray.map((seg,i)=>{
    let previous = curveArray[i === 0 ? curveArray.length-1 : i-1];
    area += getArea(previous.slice(previous.length-2).concat(seg.slice(1)));
  })
  return area;
}