import type { MSegment, PathArray } from '../types';
import type { LengthFactory } from '../interface';
import normalizePath from '../process/normalizePath';
import segmentLineFactory from './segmentLineFactory';
import segmentArcFactory from './segmentArcFactory';
import segmentCubicFactory from './segmentCubicFactory';
import segmentQuadFactory from './segmentQuadFactory';

/**
 * Returns a {x,y} point at a given length
 * of a shape, the shape total length and
 * the shape minimum and maximum {x,y} coordinates.
 *
 * @param pathInput the `pathArray` to look into
 * @param distance the length of the shape to look at
 * @returns the path length, point, min & max
 */
const pathLengthFactory = (pathInput: string | PathArray, distance?: number): LengthFactory => {
  const path = normalizePath(pathInput);
  const distanceIsNumber = typeof distance === 'number';
  let isM;
  let data = [] as number[];
  let pathCommand;
  let x = 0;
  let y = 0;
  let mx = 0;
  let my = 0;
  let seg;
  let MIN = [] as { x: number; y: number }[];
  let MAX = [] as { x: number; y: number }[];
  let length = 0;
  let min = { x: 0, y: 0 };
  let max = min;
  let point = min;
  let POINT = min;
  let LENGTH = 0;

  for (let i = 0, ll = path.length; i < ll; i += 1) {
    seg = path[i];
    [pathCommand] = seg;
    isM = pathCommand === 'M';
    data = !isM ? [x, y, ...(seg.slice(1) as number[])] : data;

    // this segment is always ZERO
    /* istanbul ignore else */
    if (isM) {
      // remember mx, my for Z
      [, mx, my] = seg as MSegment;
      min = { x: mx, y: my };
      max = min;
      length = 0;

      if (distanceIsNumber && distance < 0.001) {
        POINT = min;
      }
    } else if (pathCommand === 'L') {
      ({ length, min, max, point } = segmentLineFactory(
        ...(data as [number, number, number, number]),
        (distance || 0) - LENGTH,
      ));
    } else if (pathCommand === 'A') {
      ({ length, min, max, point } = segmentArcFactory(
        ...(data as [number, number, number, number, number, number, number, number, number]),
        (distance || 0) - LENGTH,
      ));
    } else if (pathCommand === 'C') {
      ({ length, min, max, point } = segmentCubicFactory(
        ...(data as [number, number, number, number, number, number, number]),
        (distance || 0) - LENGTH,
      ));
    } else if (pathCommand === 'Q') {
      ({ length, min, max, point } = segmentQuadFactory(
        ...(data as [number, number, number, number, number, number]),
        (distance || 0) - LENGTH,
      ));
    } else if (pathCommand === 'Z') {
      data = [x, y, mx, my];
      ({ length, min, max, point } = segmentLineFactory(
        ...(data as [number, number, number, number]),
        (distance || 0) - LENGTH,
      ));
    }

    if (distanceIsNumber && LENGTH < distance && LENGTH + length >= distance) {
      POINT = point;
    }

    MAX = [...MAX, max];
    MIN = [...MIN, min];
    LENGTH += length;

    [x, y] = pathCommand !== 'Z' ? (seg.slice(-2) as [number, number]) : [mx, my];
  }

  // native `getPointAtLength` behavior when the given distance
  // is higher than total length
  if (distanceIsNumber && distance >= LENGTH) {
    POINT = { x, y };
  }

  return {
    length: LENGTH,
    point: POINT,
    min: {
      x: Math.min(...MIN.map(n => n.x)),
      y: Math.min(...MIN.map(n => n.y)),
    },
    max: {
      x: Math.max(...MAX.map(n => n.x)),
      y: Math.max(...MAX.map(n => n.y)),
    },
  };
};
export default pathLengthFactory;
