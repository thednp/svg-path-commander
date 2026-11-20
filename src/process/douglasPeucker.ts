import type { Point } from "../types.ts";
import { distanceToSegment } from "../math/distanceToSegment.ts";

/**
 * Returns the indexes of the points that have to be kept to approximate a
 * polyline within a given tolerance, with the Douglas-Peucker algorithm.
 *
 * The first and the last point of the polyline are always kept, the points
 * in between are kept when they are further from the chord between the two
 * points around them than the tolerance.
 *
 * @see https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm
 *
 * @param points - the points of the polyline
 * @param tolerance - the maximum distance from the simplified polyline
 * @returns the indexes of the points to keep, in order
 */
export const douglasPeucker = (points: Point[], tolerance: number): number[] => {
  // a polyline of one or two points is already simple enough
  if (points.length < 3) return points.map((_point, index) => index);

  const keep = points.map(() => false);
  keep[0] = true;
  keep[points.length - 1] = true;

  // the pairs of points to measure, as a stack: the recursion of the
  // original algorithm would blow the stack on a long polyline
  const stack: number[] = [0, points.length - 1];
  while (stack.length) {
    const last = stack.pop() as number;
    const first = stack.pop() as number;
    const start = points[first];
    const end = points[last];
    let maxDistance = 0;
    let index = -1;
    for (let i = first + 1; i < last; i += 1) {
      const distance = distanceToSegment(points[i], start, end);
      if (distance > maxDistance) {
        maxDistance = distance;
        index = i;
      }
    }
    if (index === -1 || maxDistance <= tolerance) continue;

    keep[index] = true;
    const span = last - first;
    // a split at the edge of the range would make the recursion as deep as
    // the range is long, so the range is split in the middle as well
    const edge = span >> 3;
    if (span > 8 && (index - first < edge || last - index < edge)) {
      const middle = first + (span >> 1);
      // the range is split in three, at the worst point and in the middle:
      // the middle is a corner of the result, so it is kept
      keep[middle] = true;
      // the three parts of the range do not overlap
      if (index < middle) {
        stack.push(middle, last, index, middle, first, index);
      } else {
        stack.push(index, last, middle, index, first, middle);
      }
    } else {
      stack.push(index, last, first, index);
    }
  }

  return points.map((_point, index) => index).filter((index) => keep[index]);
};
