import type { CubicCoordinates, NormalSegment, Point, QuadCoordinates } from "../types.ts";
import {
  computeBezier,
  deriveBezier,
  getBezierPoints,
  getTAtBezierLength,
} from "../math/bezier.ts";
import { getPointAtCubicSegmentLength } from "../math/cubicTools.ts";
import { getPointAtQuadSegmentLength } from "../math/quadTools.ts";
import { arcLengthBetween, getArcProps } from "../math/arcTools.ts";

/**
 * The frame of a path at a given length: the point, the direction of the path
 * at that point (the tangent), the perpendicular to it (the normal) and the
 * angle of the tangent.
 */
export type PathFrame = {
  /** The point at the given length. */
  point: Point;
  /** The unit tangent vector at the given length. */
  tangent: Point;
  /** The unit normal vector at the given length, the left normal of the tangent. */
  normal: Point;
  /** The angle of the tangent at the given length, in degrees. */
  angle: number;
};

/**
 * Returns a value without a negative zero.
 *
 * The negative zero is a valid number, but it is a surprise in a result:
 * `Object.is(-0, 0)` is false, so a deep comparison of two equal frames
 * would fail.
 *
 * @param value the value to clean
 * @returns the value without a negative zero
 */
export const cleanZero = (value: number): number => (value === 0 ? 0 : value);

/**
 * Returns the unit vector of a direction.
 *
 * A direction without a length has no unit vector, so the zero vector is
 * returned for it.
 *
 * @param x the X component of the direction
 * @param y the Y component of the direction
 * @returns the unit vector of the direction
 */
const normalizeVector = (x: number, y: number): Point => {
  const length = Math.sqrt(x * x + y * y);
  return length > 0 ? { x: cleanZero(x / length), y: cleanZero(y / length) } : { x: 0, y: 0 };
};

/**
 * Returns the frame of a point with a given direction.
 *
 * The normal is the left normal of the tangent, so it points to the left of
 * the direction of the path, and the angle is the angle of the tangent in
 * degrees, in the `-180` to `180` range.
 *
 * @param point the point of the frame
 * @param x the X component of the direction
 * @param y the Y component of the direction
 * @returns the frame of the point
 */
const frameFrom = (point: Point, x: number, y: number): PathFrame => {
  const tangent = normalizeVector(x, y);
  return {
    point: { x: cleanZero(point.x), y: cleanZero(point.y) },
    tangent,
    normal: { x: cleanZero(-tangent.y), y: cleanZero(tangent.x) },
    angle: (Math.atan2(tangent.y, tangent.x) * 180) / Math.PI,
  };
};

/**
 * Returns the frame of a line segment at a given distance.
 *
 * @param startX the X coordinate the segment starts at
 * @param startY the Y coordinate the segment starts at
 * @param endX the X coordinate the segment ends at
 * @param endY the Y coordinate the segment ends at
 * @param offset the distance from the start of the segment
 * @param length the length of the segment
 * @returns the frame of the segment
 */
const lineFrame = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  offset: number,
  length: number,
): PathFrame => {
  const dx = endX - startX;
  const dy = endY - startY;
  const ratio = length > 0 ? Math.min(Math.max(offset / length, 0), 1) : 0;
  return frameFrom({ x: startX + dx * ratio, y: startY + dy * ratio }, dx, dy);
};

/**
 * Returns the frame of a cubic Bezier segment at a given distance.
 *
 * The `t` ratio of the point is found once and shared with the tangent, so
 * the point and the frame always describe the very same spot on the curve.
 *
 * @param coords the coordinates of the segment
 * @param offset the distance from the start of the segment
 * @param length the length of the segment
 * @returns the frame of the segment
 */
const cubicFrame = (coords: CubicCoordinates, offset: number, length: number): PathFrame => {
  const t = offset <= 0 ? 0 : offset >= length ? 1 : getTAtBezierLength(coords, offset);
  const point = getPointAtCubicSegmentLength(coords, t);
  // the first derivative level holds the control points of the derivative
  const derivative = computeBezier(deriveBezier(getBezierPoints(coords))[0], t);
  return frameFrom(point, derivative.x, derivative.y);
};

/**
 * Returns the frame of a quadratic Bezier segment at a given distance.
 *
 * @param coords the coordinates of the segment
 * @param offset the distance from the start of the segment
 * @param length the length of the segment
 * @returns the frame of the segment
 */
const quadFrame = (coords: QuadCoordinates, offset: number, length: number): PathFrame => {
  const t = offset <= 0 ? 0 : offset >= length ? 1 : getTAtBezierLength(coords, offset);
  const point = getPointAtQuadSegmentLength(coords, t);
  const derivative = computeBezier(deriveBezier(getBezierPoints(coords))[0], t);
  return frameFrom(point, derivative.x, derivative.y);
};

/**
 * Returns the frame of an elliptical arc segment at a given distance.
 *
 * The parametric angle of the arc is found once and shared with the tangent,
 * which is the derivative of the ellipse at that angle.
 *
 * @param startX the X coordinate the segment starts at
 * @param startY the Y coordinate the segment starts at
 * @param RX the radius on X axis
 * @param RY the radius on Y axis
 * @param rotation the ellipse rotation in degrees
 * @param LAF the large arc flag
 * @param SF the sweep flag
 * @param endX the X coordinate the segment ends at
 * @param endY the Y coordinate the segment ends at
 * @param offset the distance from the start of the segment
 * @param length the length of the segment
 * @returns the frame of the segment
 */
const arcFrame = (
  startX: number,
  startY: number,
  RX: number,
  RY: number,
  rotation: number,
  LAF: number,
  SF: number,
  endX: number,
  endY: number,
  offset: number,
  length: number,
): PathFrame => {
  const { center, rx, ry, startAngle, endAngle } = getArcProps(
    startX,
    startY,
    RX,
    RY,
    rotation,
    LAF,
    SF,
    endX,
    endY,
  );

  // a zero radius is treated as a straight line to the end point
  if (rx === 0 || ry === 0) {
    return lineFrame(startX, startY, endX, endY, offset, length);
  }

  const sweepAngle = endAngle - startAngle;
  const { PI, cos, sin } = Math;
  const xRot = ((rotation % 360) + 360) % 360;
  const xRotRad = xRot * (PI / 180);

  // the tangent of the ellipse at the parametric angle, before the rotation
  const tangentAt = (alpha: number): Point => {
    const cosA = cos(alpha);
    const sinA = sin(alpha);
    return {
      x: -cos(xRotRad) * rx * sinA - sin(xRotRad) * ry * cosA,
      y: -sin(xRotRad) * rx * sinA + cos(xRotRad) * ry * cosA,
    };
  };

  const pointAt = (alpha: number): Point => {
    const ellipseX = rx * cos(alpha);
    const ellipseY = ry * sin(alpha);
    return {
      x: cos(xRotRad) * ellipseX - sin(xRotRad) * ellipseY + center.x,
      y: sin(xRotRad) * ellipseX + cos(xRotRad) * ellipseY + center.y,
    };
  };

  // an arc without a sweep has no direction
  if (length <= 0) {
    return frameFrom({ x: startX, y: startY }, 0, 0);
  }

  // the arc is drawn in the direction of the sweep, so the tangent points
  // the other way when the sweep is negative
  const direction = sweepAngle < 0 ? -1 : 1;

  if (offset <= 0) {
    const tangent = tangentAt(startAngle);
    return frameFrom({ x: startX, y: startY }, direction * tangent.x, direction * tangent.y);
  }

  if (offset >= length) {
    const tangent = tangentAt(endAngle);
    return frameFrom({ x: endX, y: endY }, direction * tangent.x, direction * tangent.y);
  }

  // the parametric angle at the given distance, found by interval bisection
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 25; i += 1) {
    const mid = (lo + hi) / 2;
    if (Math.abs(arcLengthBetween(rx, ry, startAngle, startAngle + sweepAngle * mid)) < offset) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  const alpha = startAngle + sweepAngle * ((lo + hi) / 2);
  const tangent = tangentAt(alpha);
  return frameFrom(pointAt(alpha), direction * tangent.x, direction * tangent.y);
};

/**
 * Returns the frame of a path segment at a given distance.
 *
 * The segment has to be an absolute one, with the shorthand commands
 * expanded, so the geometry and the length of the segment agree.
 *
 * @param geometry the absolute segment
 * @param startX the X coordinate the segment starts at
 * @param startY the Y coordinate the segment starts at
 * @param endX the X coordinate the segment ends at
 * @param endY the Y coordinate the segment ends at
 * @param offset the distance from the start of the segment
 * @param length the length of the segment
 * @returns the frame of the segment
 */
export const getSegmentFrame = (
  geometry: NormalSegment,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  offset: number,
  length: number,
): PathFrame => {
  const command = geometry[0];

  // a moveto has no direction, it only holds the start of a sub-path
  if (command === "M") {
    return frameFrom({ x: endX, y: endY }, 0, 0);
  }

  if (command === "L" || command === "Z") {
    return lineFrame(startX, startY, endX, endY, offset, length);
  }

  if (command === "C") {
    const coords = [
      startX,
      startY,
      geometry[1] as number,
      geometry[2] as number,
      geometry[3] as number,
      geometry[4] as number,
      endX,
      endY,
    ] as CubicCoordinates;
    return cubicFrame(coords, offset, length);
  }

  if (command === "Q") {
    const coords = [
      startX,
      startY,
      geometry[1] as number,
      geometry[2] as number,
      endX,
      endY,
    ] as QuadCoordinates;
    return quadFrame(coords, offset, length);
  }

  return arcFrame(
    startX,
    startY,
    geometry[1] as number,
    geometry[2] as number,
    geometry[3] as number,
    geometry[4] as number,
    geometry[5] as number,
    endX,
    endY,
    offset,
    length,
  );
};
