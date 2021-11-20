import getSegCubicLength from './getSegCubicLength.js';
import pathToCurve from '../convert/pathToCurve.js';

// calculates the shape total length
// equivalent to shape.getTotalLength()
// pathToCurve version
export default function getPathLength(pathArray) {
  let totalLength = 0;
  pathToCurve(pathArray).forEach((s, i, curveArray) => {
    totalLength += s[0] !== 'M' ? getSegCubicLength.apply(0, curveArray[i - 1].slice(-2).concat(s.slice(1))) : 0;
  });
  return totalLength;
}
