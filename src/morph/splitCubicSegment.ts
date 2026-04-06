// src/morph/splitCubicSegment.ts

import { midPoint } from "../math/midPoint";
import { CubicCoordinates } from "../types";

/**
 * Split a cubic Bézier into two cubics at parameter t [0–1].
 *
 * @param x1 - Start point X
 * @param y1 - Start point Y
 * @param x2 - First control point X
 * @param y2 - First control point Y
 * @param x3 - Second control point X
 * @param y3 - Second control point Y
 * @param x4 - End point X
 * @param y4 - End point Y
 * @param t - Parameter in range [0, 1] at which to split
 * @returns Array of two cubic segments, each as [x1,y1, x2,y2, x3,y3, x4,y4]
 */
export function splitCubicSegment(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number,
  t: number,
): [CubicCoordinates, CubicCoordinates] {
  const [px01, py01] = midPoint([x1, y1], [x2, y2], t);
  const [px12, py12] = midPoint([x2, y2], [x3, y3], t);
  const [px23, py23] = midPoint([x3, y3], [x4, y4], t);

  const [cx0, cy0] = midPoint([px01, py01], [px12, py12], t);
  const [cx1, cy1] = midPoint([px12, py12], [px23, py23], t);

  const [px, py] = midPoint([cx0, cy0], [cx1, cy1], t);

  return [
    [x1, y1, px01, py01, cx0, cy0, px, py], // first segment
    [px, py, cx1, cy1, px23, py23, x4, y4], // second segment
  ];
}
