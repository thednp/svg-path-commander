import type {
  CubicCoordinates,
  IntersectionOptions,
  IntersectionPoint,
  PointAtLength,
} from "../types.ts";
import {
  getCubicBBox,
  getCubicLength,
  getPointAtCubicLength,
} from "../math/cubicTools.ts";
import { distanceEpsilon } from "../util.ts";
import { roundTo } from "../math/roundTo.ts";
import { boundingBoxIntersect } from "./boundingBoxIntersect.ts";

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

export const interHelper = (
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
