import type { PathArray, Point } from '../types';
import type { PointProperties } from '../interface';
import getPointAtLength from './getPointAtLength';
import getPropertiesAtLength from './getPropertiesAtLength';
import getTotalLength from './getTotalLength';
import parsePathString from '../parser/parsePathString';
import normalizePath from '../process/normalizePath';

/**
 * Returns the point and segment in path closest to a given point as well as
 * the distance to the path stroke.
 *
 * @see https://bl.ocks.org/mbostock/8027637
 *
 * @param pathInput target `pathArray`
 * @param point the given point
 * @returns the requested properties
 */
const getPropertiesAtPoint = (pathInput: string | PathArray, point: Point): PointProperties => {
  const path = parsePathString(pathInput);
  const normalPath = normalizePath(path);
  const pathLength = getTotalLength(normalPath);
  const distanceTo = (p: Point) => {
    const dx = p.x - point.x;
    const dy = p.y - point.y;
    return dx * dx + dy * dy;
  };
  let precision = 8;
  let scan: Point;
  let closest = { x: 0, y: 0 }; // make TS happy
  let scanDistance = 0;
  let bestLength = 0;
  let bestDistance = Infinity;

  // linear scan for coarse approximation
  for (let scanLength = 0; scanLength <= pathLength; scanLength += precision) {
    scan = getPointAtLength(normalPath, scanLength);
    scanDistance = distanceTo(scan);

    if (scanDistance < bestDistance) {
      closest = scan;
      bestLength = scanLength;
      bestDistance = scanDistance;
    }
  }

  // binary search for precise estimate
  precision /= 2;
  let before: { x: number; y: number };
  let after: { x: number; y: number };
  let beforeLength = 0;
  let afterLength = 0;
  let beforeDistance = 0;
  let afterDistance = 0;

  while (precision > 0.000001) {
    beforeLength = bestLength - precision;
    before = getPointAtLength(normalPath, beforeLength);
    beforeDistance = distanceTo(before);
    afterLength = bestLength + precision;
    after = getPointAtLength(normalPath, afterLength);
    afterDistance = distanceTo(after);

    if (beforeLength >= 0 && beforeDistance < bestDistance) {
      closest = before;
      bestLength = beforeLength;
      bestDistance = beforeDistance;
    } else if (afterLength <= pathLength && afterDistance < bestDistance) {
      closest = after;
      bestLength = afterLength;
      bestDistance = afterDistance;
    } else {
      precision /= 2;
    }
    if (precision < 0.00001) break;
  }

  const segment = getPropertiesAtLength(path, bestLength);
  const distance = Math.sqrt(bestDistance);

  return { closest, distance, segment };
};

export default getPropertiesAtPoint;
