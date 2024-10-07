import type { MSegment, PathArray, PathSegment, Point, PointTuple } from '../types';
// import type { LengthFactory } from '../interface';
import normalizePath from '../process/normalizePath';
import getLineSegmentProperties from '../math/lineTools';
import getArcSegmentProperties from '../math/arcTools';
import getCubicSegmentProperties from '../math/cubicTools';
import getQuadSegmentProperties from '../math/quadTools';
import DISTANCE_EPSILON from './distanceEpsilon';

/**
 * Returns a {x,y} point at a given length
 * of a shape, the shape total length and
 * the shape minimum and maximum {x,y} coordinates.
 *
 * @param pathInput the `pathArray` to look into
 * @param distance the length of the shape to look at
 * @returns the path length, point, min & max
 */
const pathFactory = (pathInput: string | PathArray, distance?: number) => {
  const path = normalizePath(pathInput);
  const distanceIsNumber = typeof distance === 'number';
  let isM = false;
  let data = [] as number[];
  let pathCommand = 'M';
  let x = 0;
  let y = 0;
  let mx = 0;
  let my = 0;
  let seg = path[0] as PathSegment;
  const MIN = [] as Point[];
  const MAX = [] as Point[];
  let min = { x: 0, y: 0 };
  let max = { x: 0, y: 0 };
  let POINT = min;
  let LENGTH = 0;
  let props = {
    point: { x: 0, y: 0 },
    length: 0,
    bbox: {
      min: { x: 0, y: 0 },
      max: { x: 0, y: 0 },
    },
  };

  for (let i = 0, ll = path.length; i < ll; i += 1) {
    seg = path[i];
    [pathCommand] = seg;
    isM = pathCommand === 'M';
    data = !isM ? [x, y, ...(seg.slice(1) as number[])] : data;

    if (distanceIsNumber && distance < DISTANCE_EPSILON) {
      POINT = min;
    }

    // this segment is always ZERO
    /* istanbul ignore else @preserve */
    if (isM) {
      // remember mx, my for Z
      [, mx, my] = seg as MSegment;
      min = { x: mx, y: my };
      max = { x: mx, y: my };
      props = {
        point: min,
        length: 0,
        bbox: { min, max },
      };
    } else if (pathCommand === 'L') {
      props = getLineSegmentProperties(
        ...(data as [number, number, number, number]),
        distanceIsNumber ? distance - LENGTH : undefined,
      );
    } else if (pathCommand === 'A') {
      props = getArcSegmentProperties(
        ...(data as [number, number, number, number, number, number, number, number, number]),
        distanceIsNumber ? distance - LENGTH : undefined,
      );
    } else if (pathCommand === 'C') {
      props = getCubicSegmentProperties(
        ...(data as [number, number, number, number, number, number, number, number]),
        distanceIsNumber ? distance - LENGTH : undefined,
      );
    } else if (pathCommand === 'Q') {
      props = getQuadSegmentProperties(
        ...(data as [number, number, number, number, number, number]),
        distanceIsNumber ? distance - LENGTH : undefined,
      );
    } else if (pathCommand === 'Z') {
      data = [x, y, mx, my];
      props = getLineSegmentProperties(
        ...(data as [number, number, number, number]),
        distanceIsNumber ? distance - LENGTH : undefined,
      );
    }

    if (distanceIsNumber && LENGTH < distance && LENGTH + props.length >= distance) {
      POINT = props.point;
    }

    MIN.push(props.bbox.min);
    MAX.push(props.bbox.max);
    LENGTH += props.length;

    [x, y] = pathCommand !== 'Z' ? (seg.slice(-2) as PointTuple) : [mx, my];
  }

  // native `getPointAtLength` behavior when the given distance
  // is higher than total length
  if (distanceIsNumber && distance > LENGTH - DISTANCE_EPSILON) {
    POINT = { x, y };
  }

  return {
    point: POINT,
    length: LENGTH,
    get bbox() {
      return {
        min: {
          x: Math.min(...MIN.map(n => n.x)),
          y: Math.min(...MIN.map(n => n.y)),
        },
        max: {
          x: Math.max(...MAX.map(n => n.x)),
          y: Math.max(...MAX.map(n => n.y)),
        },
      };
    },
  };
};

export default pathFactory;
