import parsePathString from '../parser/parsePathString';
import type {
  ArcCoordinates,
  CubicCoordinates,
  LineCoordinates,
  MSegment,
  PathArray,
  PointTuple,
  QuadCoordinates,
} from '../types';
import { getLineLength } from '../math/lineTools';
import { getArcLength } from '../math/arcTools';
import { getCubicLength } from '../math/cubicTools';
import { getQuadLength } from '../math/quadTools';
import iterate from '../process/iterate';
import absolutizeSegment from '../process/absolutizeSegment';
import normalizeSegment from '../process/normalizeSegment';
// import pathFactory from './pathFactory';

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
  let isM = false;
  let data = [] as number[];
  let pathCommand = 'M';
  let x = 0;
  let y = 0;
  let mx = 0;
  let my = 0;
  let totalLength = 0;

  iterate(path, (seg, params) => {
    const absoluteSegment = absolutizeSegment(seg, params);
    const normalSegment = normalizeSegment(absoluteSegment, params);
    [pathCommand] = normalSegment;
    isM = pathCommand === 'M';
    data = !isM ? [x, y, ...(normalSegment.slice(1) as number[])] : data;

    // this segment is always ZERO
    /* istanbul ignore else @preserve */
    if (isM) {
      // remember mx, my for Z
      [, mx, my] = seg as MSegment;
    } else if (pathCommand === 'L') {
      totalLength += getLineLength(...(data as LineCoordinates));
    } else if (pathCommand === 'A') {
      totalLength += getArcLength(...(data as ArcCoordinates));
    } else if (pathCommand === 'C') {
      totalLength += getCubicLength(...(data as CubicCoordinates));
    } else if (pathCommand === 'Q') {
      totalLength += getQuadLength(...(data as QuadCoordinates));
    } else if (pathCommand === 'Z') {
      data = [x, y, mx, my];
      totalLength += getLineLength(...(data as LineCoordinates));
    }
    if (pathCommand === 'Z') {
      x = mx;
      y = my;
    } else {
      [x, y] = normalSegment.slice(-2) as PointTuple;

      if (isM) {
        mx = x;
        my = y;
      }
    }
    params.x = x;
    params.y = y;
    return normalSegment;
  });

  return totalLength;
};

export default getTotalLength;
