import DISTANCE_EPSILON from "./distanceEpsilon";
import type { MSegment, PathArray, PointTuple } from "../types";
import { iterate } from "../process/iterate";
import { getLineLength, getPointAtLineLength } from "../math/lineTools";
import { getArcLength, getPointAtArcLength } from "../math/arcTools";
import { getCubicLength, getPointAtCubicLength } from "../math/cubicTools";
import { getPointAtQuadLength, getQuadLength } from "../math/quadTools";
import { normalizePath } from "../process/normalizePath";

/**
 * Returns [x,y] coordinates of a point at a given length along a path.
 *
 * @param pathInput - The PathArray or path string to look into
 * @param distance - The distance along the path
 * @returns The requested {x, y} point coordinates
 *
 * @example
 * ```ts
 * getPointAtLength('M0 0L100 0L100 100Z', 50)
 * // => { x: 50, y: 0 }
 * ```
 */
export const getPointAtLength = <T extends PathArray>(
  pathInput: string | T,
  distance?: number,
) => {
  const path = normalizePath(pathInput);
  let isM = false;
  let data = [] as number[];
  let x = 0;
  let y = 0;
  let [mx, my] = path[0].slice(1) as PointTuple;
  const distanceIsNumber = typeof distance === "number";
  let point = { x: mx, y: my };
  let length = 0;
  let POINT = point;
  let totalLength = 0;

  if (!distanceIsNumber || distance < DISTANCE_EPSILON) return point;

  iterate(path, (seg, _, lastX, lastY) => {
    const pathCommand = seg[0];
    isM = pathCommand === "M";
    data = !isM ? [lastX, lastY].concat(seg.slice(1) as number[]) : data;

    // this segment is always ZERO
    /* istanbul ignore else @preserve */
    if (isM) {
      // remember mx, my for Z
      [, mx, my] = seg as MSegment;
      point = { x: mx, y: my };
      length = 0;
    } else if (pathCommand === "L") {
      point = getPointAtLineLength(
        data[0],
        data[1],
        data[2],
        data[3],
        distance - totalLength,
      );
      length = getLineLength(data[0], data[1], data[2], data[3]);
    } else if (pathCommand === "A") {
      point = getPointAtArcLength(
        data[0],
        data[1],
        data[2],
        data[3],
        data[4],
        data[5],
        data[6],
        data[7],
        data[8],
        distance - totalLength,
      );
      length = getArcLength(
        data[0],
        data[1],
        data[2],
        data[3],
        data[4],
        data[5],
        data[6],
        data[7],
        data[8],
      );
    } else if (pathCommand === "C") {
      point = getPointAtCubicLength(
        data[0],
        data[1],
        data[2],
        data[3],
        data[4],
        data[5],
        data[6],
        data[7],
        distance - totalLength,
      );
      length = getCubicLength(
        data[0],
        data[1],
        data[2],
        data[3],
        data[4],
        data[5],
        data[6],
        data[7],
      );
    } else if (pathCommand === "Q") {
      point = getPointAtQuadLength(
        data[0],
        data[1],
        data[2],
        data[3],
        data[4],
        data[5],
        distance - totalLength,
      );
      length = getQuadLength(
        data[0],
        data[1],
        data[2],
        data[3],
        data[4],
        data[5],
      );
    } else if (pathCommand === "Z") {
      data = [lastX, lastY, mx, my];
      point = { x: mx, y: my };

      length = getLineLength(data[0], data[1], data[2], data[3]);
    }

    [x, y] = data.slice(-2);

    if (totalLength < distance) {
      POINT = point;
    } else {
      // totalLength >= distance
      // stop right here
      // stop iterator now!
      return false;
    }

    totalLength += length;
    return;
  });

  // native `getPointAtLength` behavior when the given distance
  // is higher than total length
  if (distance > totalLength - DISTANCE_EPSILON) {
    return { x, y };
  }

  return POINT;
};
