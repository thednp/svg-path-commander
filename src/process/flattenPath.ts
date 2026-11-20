import type { CubicCoordinates, CurveArray, Point } from "../types.ts";
import { getPointAtCubicSegmentLength } from "../math/cubicTools.ts";

/**
 * Returns the number of intervals a cubic segment is split into.
 *
 * The second differences of the control points bound the distance of the
 * curve to its chord, and the distance of a piece of the curve to the chord
 * of the piece falls with the square of the number of the pieces, so the
 * number of the intervals is the square root of the ratio of the bound to
 * the tolerance.
 *
 * @param coords - the coordinates of the cubic segment
 * @param tolerance - the maximum distance between the curve and its chords
 * @returns the number of intervals
 */
const getIntervalCount = (coords: CubicCoordinates, tolerance: number): number => {
  const [x1, y1, c1x, c1y, c2x, c2y, x2, y2] = coords;
  // the second differences of the control points
  const d1 = Math.hypot(x1 - 2 * c1x + c2x, y1 - 2 * c1y + c2y);
  const d2 = Math.hypot(c1x - 2 * c2x + x2, c1y - 2 * c2y + y2);
  // the bound of the distance of the curve to its chord
  const flatness = 0.75 * Math.max(d1, d2);
  // a straight segment is one interval
  if (flatness <= tolerance) return 1;

  return Math.ceil(Math.sqrt(flatness / tolerance));
};

/**
 * Flattens a path into polygons, one for every sub-path.
 *
 * The curves of the path are split into chords that stay within the
 * tolerance of the curve, and every sub-path is closed, the way a fill
 * closes an open path.
 *
 * @param path - the curve path to flatten
 * @param tolerance - the maximum distance between the curve and its chords
 * @returns the polygons of the path
 */
export const flattenPath = (path: CurveArray, tolerance: number): Point[][] => {
  const polygons: Point[][] = [];
  let points: Point[] = [];
  let current: Point = { x: 0, y: 0 };

  for (const segment of path) {
    if (segment[0] === "M") {
      // the sub-path before this one is closed
      if (points.length > 1) polygons.push(points);
      current = { x: segment[1] as number, y: segment[2] as number };
      points = [current];
      continue;
    }

    // a curve path holds no other command than the cubic
    const coords = [
      current.x,
      current.y,
      segment[1] as number,
      segment[2] as number,
      segment[3] as number,
      segment[4] as number,
      segment[5] as number,
      segment[6] as number,
    ] as CubicCoordinates;
    const count = getIntervalCount(coords, tolerance);

    for (let i = 1; i <= count; i += 1) {
      const point = getPointAtCubicSegmentLength(coords, i / count);
      points.push(point);
    }
    current = { x: segment[5] as number, y: segment[6] as number };
  }

  // the last sub-path is closed too
  if (points.length > 1) polygons.push(points);

  return polygons;
};
