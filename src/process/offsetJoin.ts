import type { PointTuple } from "../types.ts";
import type { OffsetCap, OffsetJoin } from "../interface.ts";

/**
 * A point of an offset path with the direction of the path at that point.
 */
export type OffsetPoint = {
  /** The X coordinate of the point. */
  x: number;
  /** The Y coordinate of the point. */
  y: number;
  /** The X component of the unit tangent. */
  tx: number;
  /** The Y component of the unit tangent. */
  ty: number;
};

/**
 * The angle of an arc of a round join or a round cap, in radians.
 *
 * The arcs are emitted as straight lines, and the smaller the angle the
 * closer the result is to the arc it stands for.
 */
const arcStep = Math.PI / 8;

/**
 * Returns the signed angle between two directions, in radians.
 *
 * The angle is the turn of the path at a corner: it is positive when the
 * path turns towards the positive angle direction, and it is in the `-PI` to
 * `PI` range.
 *
 * @param from - the direction the path comes from
 * @param to - the direction the path goes to
 * @returns the signed angle between the two directions
 */
export const signedTurn = (from: OffsetPoint, to: OffsetPoint): number => {
  const dot = from.tx * to.tx + from.ty * to.ty;
  const cross = from.tx * to.ty - from.ty * to.tx;
  return Math.atan2(cross, dot);
};

/**
 * Returns the intersection of two lines, if they have one.
 *
 * @param x1 - the X coordinate of the first point
 * @param y1 - the Y coordinate of the first point
 * @param dx1 - the X component of the direction of the first line
 * @param dy1 - the Y component of the direction of the first line
 * @param x2 - the X coordinate of the second point
 * @param y2 - the Y coordinate of the second point
 * @param dx2 - the X component of the direction of the second line
 * @param dy2 - the Y component of the direction of the second line
 * @returns the intersection of the two lines, or `null`
 */
export const intersectLines = (
  x1: number,
  y1: number,
  dx1: number,
  dy1: number,
  x2: number,
  y2: number,
  dx2: number,
  dy2: number,
): PointTuple | null => {
  const denominator = dx1 * dy2 - dy1 * dx2;
  // parallel lines have no intersection
  if (Math.abs(denominator) < 1e-12) return null;
  const ratio = ((x2 - x1) * dy2 - (y2 - y1) * dx2) / denominator;
  return [x1 + dx1 * ratio, y1 + dy1 * ratio];
};

/**
 * Returns the points of a join between two offset lines.
 *
 * The join is placed on the outer side of a corner, where the two offset
 * lines do not cross: the `miter` join is the intersection of the two
 * lines, the `bevel` join is the straight line between the two offset
 * points and the `round` join is an arc of the offset radius around the
 * corner.
 *
 * @param cornerX - the X coordinate of the corner of the path
 * @param cornerY - the Y coordinate of the corner of the path
 * @param from - the end of the incoming offset line
 * @param to - the start of the outgoing offset line
 * @param distance - the offset distance
 * @param join - the join type
 * @param miterLimit - the ratio of the miter length to the offset distance
 * @returns the points of the join
 */
export const getJoinPoints = (
  cornerX: number,
  cornerY: number,
  from: OffsetPoint,
  to: OffsetPoint,
  distance: number,
  join: OffsetJoin,
  miterLimit: number,
): PointTuple[] => {
  if (join === "round") {
    const turn = signedTurn(from, to);
    const startAngle = Math.atan2(from.y - cornerY, from.x - cornerX);
    const steps = Math.max(1, Math.ceil(Math.abs(turn) / arcStep));
    const points: PointTuple[] = [];
    for (let i = 1; i < steps; i += 1) {
      const angle = startAngle + (turn * i) / steps;
      points.push([cornerX + Math.cos(angle) * distance, cornerY + Math.sin(angle) * distance]);
    }
    return points;
  }

  if (join === "miter") {
    const miter = intersectLines(from.x, from.y, from.tx, from.ty, to.x, to.y, to.tx, to.ty);
    if (miter) {
      const miterLength = Math.hypot(miter[0] - cornerX, miter[1] - cornerY);
      // the miter is too long, the corner is beveled instead
      if (miterLength <= miterLimit * distance) return [miter];
    }
  }

  return [];
};

/**
 * Returns the points of a cap at the end of an open path.
 *
 * The `butt` cap is the straight line between the two offset points, the
 * `square` cap extends the path by the offset distance and the `round` cap
 * is a half circle of the offset radius around the end of the path.
 *
 * @param centerX - the X coordinate of the end of the path
 * @param centerY - the Y coordinate of the end of the path
 * @param from - the first offset point of the cap
 * @param to - the last offset point of the cap
 * @param distance - the offset distance
 * @param cap - the cap type
 * @param extensionX - the X component of the direction the cap extends to
 * @param extensionY - the Y component of the direction the cap extends to
 * @returns the points of the cap
 */
export const getCapPoints = (
  centerX: number,
  centerY: number,
  from: PointTuple,
  to: PointTuple,
  distance: number,
  cap: OffsetCap,
  extensionX: number,
  extensionY: number,
): PointTuple[] => {
  if (cap === "butt") return [];

  if (cap === "square") {
    // the cap is extended by the offset distance, along the direction of
    // the path
    return [
      [from[0] + extensionX * distance, from[1] + extensionY * distance],
      [to[0] + extensionX * distance, to[1] + extensionY * distance],
    ];
  }

  // the cap is a half circle, it sweeps from the first offset point to the
  // last one around the end of the path
  const startAngle = Math.atan2(from[1] - centerY, from[0] - centerX);
  const sweep = -Math.PI;
  const steps = Math.max(1, Math.ceil(Math.abs(sweep) / arcStep));
  const points: PointTuple[] = [];
  for (let i = 1; i < steps; i += 1) {
    const angle = startAngle + (sweep * i) / steps;
    points.push([centerX + Math.cos(angle) * distance, centerY + Math.sin(angle) * distance]);
  }
  return points;
};
