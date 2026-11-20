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
