// src/morph/splitCubicToCount.ts

import { CubicCoordinates } from "../types";
import { splitCubicSegment } from "./splitCubicSegment";

/**
 * Split a cubic Bézier into `count` segments of roughly equal parameter length.
 * Does NOT mutate input parameters.
 *
 * @param x1 - Start point X
 * @param y1 - Start point Y
 * @param x2 - First control point X
 * @param y2 - First control point Y
 * @param x3 - Second control point X
 * @param y3 - Second control point Y
 * @param x4 - End point X
 * @param y4 - End point Y
 * @param count - Number of segments to split into
 * @returns Array of `count` cubic segments, each as [x1,y1,x2,y2,x3,y3,x4,y4]
 */
export function splitCubicToCount(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number,
  count: number,
): Array<CubicCoordinates> {
  if (count <= 1) return [[x1, y1, x2, y2, x3, y3, x4, y4]];

  const result: Array<CubicCoordinates> = [];

  // Work on local copies to avoid mutating inputs
  let cx1 = x1;
  let cy1 = y1;
  let cx2 = x2;
  let cy2 = y2;
  let cx3 = x3;
  let cy3 = y3;
  let cx4 = x4;
  let cy4 = y4;

  let i = 0;
  while (i < count) {
    const t = 1 / (count - i);
    const [first, second] = splitCubicSegment(
      cx1,
      cy1,
      cx2,
      cy2,
      cx3,
      cy3,
      cx4,
      cy4,
      t,
    );

    result.push(first);

    // Update working curve to the remaining (second) part
    [cx1, cy1, cx2, cy2, cx3, cy3, cx4, cy4] = second;
    i++;
  }

  return result;
}
