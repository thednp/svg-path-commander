import type {
  CubicCoordinates,
  IntersectionPoint,
  PathArray,
} from "../types.ts";
import { pathToCurve } from "../convert/pathToCurve.ts";
import { interHelper } from "./interHelper.ts";

/**
 * Finds intersection points between two paths.
 *
 * @param pathInput1 - First path string or PathArray
 * @param pathInput2 - Second path string or PathArray
 * @param justCount - If true, returns the count of intersections; if false, returns the intersection points
 * @returns The number of intersections (when justCount is true) or an array of IntersectionPoint objects
 *
 * @example
 * ```ts
 * pathsIntersection('M0 50C0 0,100 0,100 50', 'M50 0C100 0,100 100,50 100', true)
 * // => 1
 * pathsIntersection('M0 50C0 0,100 0,100 50', 'M50 0C100 0,100 100,50 100', false)
 * // => [{ x: 50, y: 25, t1: 0.5, t2: 0.5 }]
 * ```
 */
export const pathsIntersection = <T extends string | PathArray>(
  pathInput1: T,
  pathInput2: T,
  justCount = /* istanbul ignore next */ true,
) => {
  const path1 = pathToCurve(pathInput1);
  const path2 = pathToCurve(pathInput2);
  let x1 = 0,
    y1 = 0,
    x2 = 0,
    y2 = 0,
    x1m = 0,
    y1m = 0,
    x2m = 0,
    y2m = 0,
    bez1: CubicCoordinates = [x1, y1, x1, y1, x1m, y1m, x1m, y1m],
    bez2: CubicCoordinates = [x2, y2, x2, y2, x2m, y2m, x2m, y2m],
    countResult = 0;
  const pointsResult: IntersectionPoint[] = [];
  const pathLen1 = path1.length;
  const pathLen2 = path2.length;

  for (let i = 0; i < pathLen1; i++) {
    const seg1 = path1[i];
    if (seg1[0] == "M") {
      x1 = seg1[1];
      y1 = seg1[2];
      x1m = x1;
      y1m = y1;
    } else {
      /* istanbul ignore else */
      if (seg1[0] == "C") {
        bez1 = [x1, y1, seg1[1], seg1[2], seg1[3], seg1[4], seg1[5], seg1[6]];
        x1 = bez1[6];
        y1 = bez1[7];
      } else {
        bez1 = [x1, y1, x1, y1, x1m, y1m, x1m, y1m];
        x1 = x1m;
        y1 = y1m;
      }
      for (let j = 0; j < pathLen2; j++) {
        const seg2 = path2[j];
        // istanbul ignore else
        if (seg2[0] == "M") {
          x2 = seg2[1];
          y2 = seg2[2];
          x2m = x2;
          y2m = y2;
        } else if (seg2[0] == "C") {
          bez2 = [
            x2,
            y2,
            seg2[1],
            seg2[2],
            seg2[3],
            seg2[4],
            seg2[5],
            seg2[6],
          ];
          x2 = bez2[6];
          y2 = bez2[7];
          // dead code, pathToCurve is almost always made of M/C
          // } else {
          //   bez2 = [x2, y2, x2, y2, x2m, y2m, x2m, y2m];
          //   x2 = x2m;
          //   y2 = y2m;
        }
        const intr = interHelper(bez1, bez2, { justCount });
        if (justCount) {
          // (res as number) += intr;
          countResult += intr as number;
        } else {
          // Include additional segment properties, maybe not
          // const kk = (intr as IntersectionPoint[]).length;
          // for (let k = 0; k < kk; k++) {
          //   intr[k].segment1 = i;
          //   intr[k].segment2 = j;
          //   intr[k].bez1 = bez1;
          //   intr[k].bez2 = bez2;
          // }
          // (res as IntersectionPoint[]) = (res as IntersectionPoint[]).concat(intr);
          pointsResult.push(...intr as IntersectionPoint[]);
        }
      }
    }
  }
  return justCount ? countResult : pointsResult;
};
