import getSegCubicLength from './getSegCubicLength.js';
import getPointAtSegLength from './getPointAtSegLength.js';
import pathToCurve from '../convert/pathToCurve.js';

// calculates the shape total length
// almost equivalent to shape.getTotalLength()
export default function getPointAtLength(pathArray, length) {
  let totalLength = 0;
  let segLen;
  let data;
  let result;

  return pathToCurve(pathArray, 9).map((seg, i, curveArray) => { // process data
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
  }).filter((x) => x).slice(-1)[0]; // isolate last segment
}
