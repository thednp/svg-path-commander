import isPathArray from './isPathArray.js';

export default function isCurveArray(pathArray) {
  return isPathArray(pathArray) && pathArray.slice(1).every((seg) => seg[0] === 'C');
}
