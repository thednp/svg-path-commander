import segmentCubicFactory from './segmentCubicFactory';
import pathToCurve from '../convert/pathToCurve';

/**
 * Returns [x,y] coordinates of a point at a given length of a shape.
 * `pathToCurve` version.
 *
 * @param {string | SVGPathCommander.pathArray} pathInput the `pathArray` to look into
 * @param {number} length the length of the shape to look at
 * @returns {{x: number, y: number}} the requested {x, y} point coordinates
 */
export default function getPointAtPathLength(pathInput, length) {
  let totalLength = 0;
  let isM = true;
  let segLen = 0;
  let data;
  let result = { x: 0, y: 0 };
  let x = 0;
  let y = 0;
  const path = pathToCurve(pathInput);
  let seg;

  for (let i = 0, l = path.length; i < l; i += 1) {
    seg = path[i];
    isM = seg[0] === 'M';
    data = !isM ? [x, y, ...seg.slice(1)] : seg.slice(1);
    // @ts-ignore
    segLen = !isM ? segmentCubicFactory(...data) : 0;

    if (isM) {
      [, x, y] = seg;
    } else if (totalLength + segLen > length) {
      const args = [...data, length - totalLength];

      // @ts-ignore -- `args` values are correct
      result = segmentCubicFactory(...args);
      break;
    }
    totalLength += segLen;
    // @ts-ignore - these are usually numbers
    [x, y] = seg.slice(-2);
  }
  return result;
}
