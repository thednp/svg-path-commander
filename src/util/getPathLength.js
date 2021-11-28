import getSegCubicLength from './getSegCubicLength';
import pathToCurve from '../convert/pathToCurve';

/**
 * Returns the shape total length,
 * or the equivalent to `shape.getTotalLength()`
 * pathToCurve version
 *
 * @param {SVGPathCommander.pathArray} path the ending point Y
 * @returns {number} the shape total length
 */
export default function getPathLength(path) {
  let totalLength = 0;
  pathToCurve(path).forEach((s, i, curveArray) => {
    totalLength += s[0] === 'M' ? 0
      // @ts-ignore
      : getSegCubicLength.apply(0, curveArray[i - 1].slice(-2).concat(s.slice(1)));
  });
  return totalLength;
}
