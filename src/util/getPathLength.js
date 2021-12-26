import segmentCubicFactory from './segmentCubicFactory';
import pathToCurve from '../convert/pathToCurve';

/**
 * Returns the shape total length, or the equivalent to `shape.getTotalLength()`.
 *
 * This is the `pathToCurve` version which is faster and more efficient for
 * paths that are `curveArray`.
 *
 * @param {string | SVGPathCommander.curveArray} path the target `pathArray`
 * @returns {number} the `curveArray` total length
 */
export default function getPathLength(path) {
  let totalLength = 0;
  pathToCurve(path).forEach((s, i, curveArray) => {
    const args = s[0] !== 'M' ? [...curveArray[i - 1].slice(-2), ...s.slice(1)] : [];
    // @ts-ignore
    totalLength += s[0] === 'M' ? 0 : segmentCubicFactory(...args);
  });
  return totalLength;
}
