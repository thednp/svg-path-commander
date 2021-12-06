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
    const args = s[0] !== 'M' ? [...curveArray[i - 1].slice(-2), ...s.slice(1)] : [];
    totalLength += s[0] === 'M' ? 0
      // @ts-ignore
      : getSegCubicLength(...args);
  });
  return totalLength;
}
