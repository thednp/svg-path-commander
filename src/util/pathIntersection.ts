import type {
  BBoxMaxima,
  CubicCoordinates,
  IntersectionOptions,
  IntersectionPoint,
  PathArray,
  PointAtLength,
  PointTuple,
} from "../types.ts";
import { pathToCurve } from "../convert/pathToCurve.ts";
import {
  getCubicBBox,
  getCubicLength,
  getPointAtCubicLength,
} from "../math/cubicTools.ts";
import { distanceEpsilon } from "../util.ts";
import { roundTo } from "../math/roundTo.ts";

const intersect = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number,
) => {
  if (
    Math.max(x1, x2) < Math.min(x3, x4) ||
    Math.min(x1, x2) > Math.max(x3, x4) ||
    Math.max(y1, y2) < Math.min(y3, y4) ||
    Math.min(y1, y2) > Math.max(y3, y4)
  ) {
    return;
  }
  const nx = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4),
    ny = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4),
    denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  if (!denominator) {
    return;
  }
  const px = nx / denominator,
    py = ny / denominator,
    px2 = roundTo(px, 2),
    py2 = roundTo(py, 2);
  if (
    px2 < roundTo(Math.min(x1, x2), 2) ||
    px2 > roundTo(Math.max(x1, x2), 2) ||
    px2 < roundTo(Math.min(x3, x4), 2) ||
    px2 > roundTo(Math.max(x3, x4), 2) ||
    py2 < roundTo(Math.min(y1, y2), 2) ||
    py2 > roundTo(Math.max(y1, y2), 2) ||
    py2 < roundTo(Math.min(y3, y4), 2) ||
    py2 > roundTo(Math.max(y3, y4), 2)
  ) {
    return;
  }
  return { x: px, y: py };
};

/**
 * Checks if a point is inside a bounding box.
 *
 * @param bbox - The bounding box as [minX, minY, maxX, maxY]
 * @param point - The point as [x, y]
 * @returns True if the point is inside or on the edge of the bounding box
 */
export const isPointInsideBBox = (
  bbox: BBoxMaxima,
  [x, y]: PointTuple,
): boolean => {
  const [minX, minY, maxX, maxY] = bbox;
  return x >= minX && x <= maxX && y >= minY && y <= maxY;
};

/**
 * Checks if two bounding boxes intersect.
 *
 * @param a - First bounding box as [minX, minY, maxX, maxY]
 * @param b - Second bounding box as [minX, minY, maxX, maxY]
 * @returns True if the bounding boxes overlap
 */
export const boundingBoxIntersect = (a: BBoxMaxima, b: BBoxMaxima): boolean => {
  const [ax1, ay1, ax2, ay2] = a;
  const [bx1, by1, bx2, by2] = b;
  // return ax1 <= bx2 && ax2 >= bx1 && ay1 <= by2 && ay2 >= by1;
  return (
    isPointInsideBBox(b, [ax1, ay1]) ||
    isPointInsideBBox(b, [ax2, ay1]) ||
    isPointInsideBBox(b, [ax1, ay2]) ||
    isPointInsideBBox(b, [ax2, ay2]) ||
    isPointInsideBBox(a, [bx1, by1]) ||
    isPointInsideBBox(a, [bx2, by1]) ||
    isPointInsideBBox(a, [bx1, by2]) ||
    isPointInsideBBox(a, [bx2, by2]) ||
    // edge overlap without corner inside
    (ax1 < bx2 && ax1 > bx1 || bx1 < ax2 && bx1 > ax1) &&
      (ay1 < by2 && ay1 > by1 || by1 < ay2 && by1 > ay1)
  );
};

const interHelper = (
  bez1: CubicCoordinates,
  bez2: CubicCoordinates,
  config?: IntersectionOptions,
) => {
  const bbox1 = getCubicBBox(...bez1);
  const bbox2 = getCubicBBox(...bez2);
  const { justCount, epsilon } = Object.assign({
    justCount: true,
    epsilon: distanceEpsilon,
  }, config);

  if (!boundingBoxIntersect(bbox1, bbox2)) {
    return justCount ? 0 : [] as IntersectionPoint[];
  }
  const l1 = getCubicLength(...bez1),
    l2 = getCubicLength(...bez2),
    n1 = Math.max((l1 / 5) >> 0, 1),
    n2 = Math.max((l2 / 5) >> 0, 1),
    points1: PointAtLength[] = [],
    points2: PointAtLength[] = [],
    xy: Record<string, string> = {};
  // deno-lint-ignore prefer-const
  let res = justCount ? 0 : [] as IntersectionPoint[];
  for (let i = 0; i < n1 + 1; i++) {
    const p = getPointAtCubicLength(...bez1, (i / n1) * l1);
    points1.push({ x: p.x, y: p.y, t: i / n1 });
  }
  for (let i = 0; i < n2 + 1; i++) {
    const p = getPointAtCubicLength(...bez2, (i / n2) * l2);
    points2.push({ x: p.x, y: p.y, t: i / n2 });
  }
  for (let i = 0; i < n1; i++) {
    for (let j = 0; j < n2; j++) {
      const maxLimit = 1 + epsilon,
        di = points1[i],
        di1 = points1[i + 1],
        dj = points2[j],
        dj1 = points2[j + 1],
        ci = Math.abs(di1.x - di.x) < .001 ? "y" : "x",
        cj = Math.abs(dj1.x - dj.x) < .001 ? "y" : "x",
        is = intersect(di.x, di.y, di1.x, di1.y, dj.x, dj.y, dj1.x, dj1.y);
      if (is) {
        if (xy[is.x.toFixed(4)] == is.y.toFixed(4)) {
          continue;
        }
        xy[is.x.toFixed(4)] = is.y.toFixed(4);
        const t1 = di.t +
            Math.abs((is[ci] - di[ci]) / (di1[ci] - di[ci])) * (di1.t - di.t),
          t2 = dj.t +
            Math.abs((is[cj] - dj[cj]) / (dj1[cj] - dj[cj])) * (dj1.t - dj.t);

        // istanbul ignore else
        if (t1 >= 0 && t1 <= maxLimit && t2 >= 0 && t2 <= maxLimit) {
          if (justCount) {
            (res as number)++;
          } else {
            (res as IntersectionPoint[]).push({
              x: is.x,
              y: is.y,
              t1: Math.min(t1, 1),
              t2: Math.min(t2, 1),
            });
          }
        }
      }
    }
  }
  return res;
};

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
