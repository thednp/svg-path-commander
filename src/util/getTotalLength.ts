import type { MSegment, PathArray } from '../types';
import { getLineLength } from '../math/lineTools';
import { getArcLength } from '../math/arcTools';
import { getCubicLength } from '../math/cubicTools';
import { getQuadLength } from '../math/quadTools';
import iterate from '../process/iterate';
// import normalizePath from '../process/normalizePath';
import parsePathString from '../parser/parsePathString';
import paramsParser from '../parser/paramsParser';
import normalizeSegment from '../process/normalizeSegment';

/**
 * Returns the shape total length, or the equivalent to `shape.getTotalLength()`.
 *
 * The `normalizePath` version is lighter, faster, more efficient and more accurate
 * with paths that are not `curveArray`.
 *
 * @param pathInput the target `pathArray`
 * @returns the shape total length
 */
const getTotalLength = (pathInput: string | PathArray) => {
  const path = parsePathString(pathInput);
  const params = { ...paramsParser };

  let isM = false;
  let data = [] as number[];
  let pathCommand = 'M';
  let mx = 0;
  let my = 0;
  let totalLength = 0;

  iterate(path, (seg, _, lastX, lastY) => {
    params.x = lastX;
    params.y = lastY;
    const normalSegment = normalizeSegment(seg, params);
    [pathCommand] = normalSegment;
    isM = pathCommand === 'M';
    data = !isM ? [lastX, lastY].concat(normalSegment.slice(1) as number[]) : data;

    // this segment is always ZERO
    /* istanbul ignore else @preserve */
    if (isM) {
      // remember mx, my for Z
      [, mx, my] = normalSegment as MSegment;
    } else if (pathCommand === 'L') {
      totalLength += getLineLength(data[0], data[1], data[2], data[3]);
    } else if (pathCommand === 'A') {
      totalLength += getArcLength(data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8]);
    } else if (pathCommand === 'C') {
      totalLength += getCubicLength(data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7]);
    } else if (pathCommand === 'Q') {
      totalLength += getQuadLength(data[0], data[1], data[2], data[3], data[4], data[5]);
    } else if (pathCommand === 'Z') {
      data = [lastX, lastY, mx, my];
      totalLength += getLineLength(data[0], data[1], data[2], data[3]);
    }

    const seglen = normalSegment.length;
    params.x1 = +normalSegment[seglen - 2];
    params.y1 = +normalSegment[seglen - 1];
    params.x2 = +normalSegment[seglen - 4] || params.x1;
    params.y2 = +normalSegment[seglen - 3] || params.y1;
  });

  return totalLength;
};

export default getTotalLength;
