// src/morph/samplePolygon.ts

import { error } from "../util/error";
import { iterate } from "../process/iterate";
import type { NormalArray, PointTuple } from "../types";

/**
 * Samples points from a path to form a polygon approximation.
 * Collects endpoints of each segment (M start + ends of L/C/etc).
 *
 * If `sampleSize` parameter is provided, it will return a polygon
 * equivalent to the original `PathArray`.
 * @param path `PolygonPathArray` or `CurvePathArray`
 * @returns Array of [x, y] points
 */
export function samplePolygon<T extends NormalArray>(
  path: T,
): PointTuple[] {
  const points: PointTuple[] = [];

  let [mx, my] = [0, 0];

  iterate(path, (seg) => {
    const cmd = seg[0];
    if (cmd === "M") {
      [mx, my] = [seg[1] as number, seg[2] as number];
      points.push([mx, my]);
    } else if (cmd === "L") {
      points.push([seg[1] as number, seg[2] as number]);
    } else if (cmd === "C") {
      points.push([seg[5] as number, seg[6] as number]);
    } else if (cmd === "A") {
      points.push([seg[6] as number, seg[7] as number]);
    } else if (cmd === "Z") {
      points.push([mx, my]);
    } else {
      throw new TypeError(`${error}: path command "${cmd}" is not supported`);
    }
  });

  return points;
}
