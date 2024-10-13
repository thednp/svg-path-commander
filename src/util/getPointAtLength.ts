import DISTANCE_EPSILON from './distanceEpsilon';
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
import iterate from '../process/iterate';
import absolutizeSegment from '../process/absolutizeSegment';
import normalizeSegment from '../process/normalizeSegment';
import { getLineLength, getPointAtLineLength } from '../math/lineTools';
import { getArcLength, getPointAtArcLength } from '../math/arcTools';
import { getCubicLength, getPointAtCubicLength } from '../math/cubicTools';
import { getQuadLength, getPointAtQuadLength } from '../math/quadTools';

/**
 * Returns [x,y] coordinates of a point at a given length of a shape.
 *
 * @param pathInput the `pathArray` to look into
 * @param distance the length of the shape to look at
 * @returns the requested {x, y} point coordinates
 */
const getPointAtLength = (pathInput: string | PathArray, distance?: number) => {
  const path = parsePathString(pathInput);
  let isM = false;
  let data = [] as number[];
  let pathCommand = 'M';
  let x = 0;
  let y = 0;
  let [mx, my] = path[0].slice(1) as PointTuple;
  const distanceIsNumber = typeof distance === 'number';
  let point = { x: mx, y: my };
  let length = 0;
  let POINT = point;
  let totalLength = 0;

  if (!distanceIsNumber) return point;

  if (distance < DISTANCE_EPSILON) {
    POINT = point;
  }

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
      point = { x: mx, y: my };
      length = 0;
    } else if (pathCommand === 'L') {
      point = getPointAtLineLength(...(data as LineCoordinates), distance - totalLength);
      length = getLineLength(...(data as LineCoordinates));
    } else if (pathCommand === 'A') {
      point = getPointAtArcLength(...(data as ArcCoordinates), distance - totalLength);
      length = getArcLength(...(data as ArcCoordinates));
    } else if (pathCommand === 'C') {
      point = getPointAtCubicLength(...(data as CubicCoordinates), distance - totalLength);
      length = getCubicLength(...(data as CubicCoordinates));
    } else if (pathCommand === 'Q') {
      point = getPointAtQuadLength(...(data as QuadCoordinates), distance - totalLength);
      length = getQuadLength(...(data as QuadCoordinates));
    } else if (pathCommand === 'Z') {
      data = [x, y, mx, my];
      point = { x: mx, y: my };
      length = getLineLength(...(data as LineCoordinates));
    }

    if (totalLength < distance && totalLength + length >= distance) {
      POINT = point;
    }

    totalLength += length;
    if (pathCommand === 'Z') {
      x = mx;
      y = my;
    } else {
      [x, y] = normalSegment.slice(-2) as PointTuple;

      if (pathCommand === 'M') {
        mx = x;
        my = y;
      }
    }
    params.x = x;
    params.y = y;
    return normalSegment;
  });

  // native `getPointAtLength` behavior when the given distance
  // is higher than total length
  if (distance > totalLength - DISTANCE_EPSILON) {
    POINT = { x, y };
  }

  return POINT;
};
export default getPointAtLength;
