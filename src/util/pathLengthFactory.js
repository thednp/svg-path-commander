import normalizePath from '../process/normalizePath';
import fixPath from '../process/fixPath';

import segmentLineFactory from './segmentLineFactory';
import segmentArcFactory from './segmentArcFactory';
import segmentCubicFactory from './segmentCubicFactory';
import segmentQuadFactory from './segmentQuadFactory';

/**
 * Returns a {x,y} point at a given length of a shape or the shape total length.
 *
 * @param {string | SVGPathCommander.pathArray} pathInput the `pathArray` to look into
 * @param {number=} distance the length of the shape to look at
 * @returns {{x: number, y: number} | number} the total length or point
 */
export default function pathLengthFactory(pathInput, distance) {
  const path = fixPath(normalizePath(pathInput));
  const distanceIsNumber = typeof distance === 'number';
  let totalLength = 0;
  let isM = true;
  /** @type {number[]} */
  let data = [];
  let pathCommand = 'M';
  let segLen = 0;
  let x = 0;
  let y = 0;
  let mx = 0;
  let my = 0;
  let seg;

  for (let i = 0, ll = path.length; i < ll; i += 1) {
    seg = path[i];
    [pathCommand] = seg;
    isM = pathCommand === 'M';
    // @ts-ignore
    data = !isM ? [x, y, ...seg.slice(1)] : data;

    // this segment is always ZERO
    if (isM) {
      // remember mx, my for Z
      // @ts-ignore
      [, mx, my] = seg;
      if (distanceIsNumber && distance < 0.001) {
        return { x: mx, y: my };
      }
    } else if (pathCommand === 'L') {
      // @ts-ignore
      segLen = segmentLineFactory(...data);
      if (distanceIsNumber && totalLength + segLen >= distance) {
        // @ts-ignore
        return segmentLineFactory(...data, distance - totalLength);
      }
      totalLength += segLen;
    } else if (pathCommand === 'A') {
      // @ts-ignore
      segLen = segmentArcFactory(...data);
      if (distanceIsNumber && totalLength + segLen >= distance) {
        // @ts-ignore
        return segmentArcFactory(...data, distance - totalLength);
      }
      totalLength += segLen;
    } else if (pathCommand === 'C') {
      // @ts-ignore
      segLen = segmentCubicFactory(...data);
      if (distanceIsNumber && totalLength + segLen >= distance) {
        // @ts-ignore
        return segmentCubicFactory(...data, distance - totalLength);
      }
      totalLength += segLen;
    } else if (pathCommand === 'Q') {
      // @ts-ignore
      segLen = segmentQuadFactory(...data);
      if (distanceIsNumber && totalLength + segLen >= distance) {
        // @ts-ignore
        return segmentQuadFactory(...data, distance - totalLength);
      }
      totalLength += segLen;
    } else if (pathCommand === 'Z') {
      data = [x, y, mx, my];
      // @ts-ignore
      segLen = segmentLineFactory(...data);
      if (distanceIsNumber && totalLength + segLen >= distance) {
        // @ts-ignore
        return segmentLineFactory(...data, distance - totalLength);
      }
      totalLength += segLen;
    }

    // @ts-ignore -- needed for the below
    [x, y] = pathCommand !== 'Z' ? seg.slice(-2) : [mx, my];
  }

  // native `getPointAtLength` behavior when the given distance
  // is higher than total length
  if (distanceIsNumber && distance >= totalLength) {
    return { x, y };
  }

  return totalLength;
}
