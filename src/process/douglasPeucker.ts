import type { Point } from "../types.ts";

/**
 * Returns the distance from a point to a line segment.
 *
 * The distance is the one to the segment, not to the infinite line: a point
 * beyond the end of the segment is at the distance to that end.
 *
 * @param point - the point to measure
 * @param start - the start of the segment
 * @param end - the end of the segment
 * @returns the distance from the point to the segment
 */
export const distanceToSegment = (point: Point, start: Point, end: Point): number => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  // a segment without a length is a point
  if (lengthSquared === 0) {
    const px = point.x - start.x;
    const py = point.y - start.y;
    return Math.sqrt(px * px + py * py);
  }
  let ratio = ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared;
  ratio = ratio < 0 ? 0 : ratio > 1 ? 1 : ratio;
  const px = point.x - (start.x + dx * ratio);
  const py = point.y - (start.y + dy * ratio);
  return Math.sqrt(px * px + py * py);
};

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
