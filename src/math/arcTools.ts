import { default as getLineSegmentProperties } from './lineTools';
import type { Point } from '../types';

/**
 * Returns the Arc segment length.
 * @param rx radius along X axis
 * @param ry radius along Y axis
 * @param theta the angle in radians
 * @returns the arc length
 */
const ellipticalArcLength = (rx: number, ry: number, theta: number) => {
  const halfTheta = theta / 2;
  const sinHalfTheta = Math.sin(halfTheta);
  const cosHalfTheta = Math.cos(halfTheta);
  const term1 = rx ** 2 * sinHalfTheta ** 2;
  const term2 = ry ** 2 * cosHalfTheta ** 2;
  const arcLength = Math.sqrt(term1 + term2) * theta;
  return Math.abs(arcLength);
};

/**
 * Returns the most extreme points in an Arc segment.
 * @param x Center X coordinate of the ellipse arc
 * @param y Center Y coordinate of the ellipse arc
 * @param rx Radius on the X axis of the ellipse
 * @param ry Radius on the Y axis of the ellipse
 * @param rotation The ellipse rotation angle in radians
 * @param startAngle The ellipse start angle in radians
 * @param endAngle The ellipse end angle in radians
 * @see https://stackoverflow.com/questions/87734/how-do-you-calculate-the-axis-aligned-bounding-box-of-an-ellipse
 */
const minmax = (
  x: number,
  y: number,
  rx: number,
  ry: number,
  rotation: number,
  startAngle: number,
  endAngle: number,
) => {
  const { cos, sin, min, max } = Math;
  const cosRotation = cos(rotation);
  const sinRotation = sin(rotation);

  // Rotate parametric equations
  const xRotated = (t: number) => {
    return x + rx * cos(t) * cosRotation - ry * sin(t) * sinRotation;
  };
  const yRotated = (t: number) => {
    return y + ry * sin(t) * cosRotation + rx * cos(t) * sinRotation;
  };

  // Evaluate at start and end angles
  const startX = xRotated(startAngle);
  const startY = yRotated(startAngle);
  const endX = xRotated(endAngle);
  const endY = yRotated(endAngle);

  // Find minimum and maximum x and y values
  // Return AABB
  return {
    min: { x: min(startX, endX), y: min(startY, endY) },
    max: { x: max(startX, endX), y: max(startY, endY) },
  };
};

/**
 * Returns the angle between two points.
 * @param v0 starting point
 * @param v1 ending point
 * @returns the angle
 */
const angleBetween = (v0: Point, v1: Point) => {
  const { x: v0x, y: v0y } = v0;
  const { x: v1x, y: v1y } = v1;
  const p = v0x * v1x + v0y * v1y;
  const n = Math.sqrt((v0x ** 2 + v0y ** 2) * (v1x ** 2 + v1y ** 2));
  const sign = v0x * v1y - v0y * v1x < 0 ? -1 : 1;
  const angle = sign * Math.acos(p / n);

  return angle;
};

/**
 * Returns properties for an Arc segment.
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param c1x the first control point X
 * @param c1y the first control point Y
 * @param c2x the second control point X
 * @param c2y the second control point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @param distance a [0-1] ratio
 * @returns properties specific to Arc segmentas well as the segment length, point at length and the bounding box
 */
const getSegmentProperties = (
  x1: number,
  y1: number,
  RX: number,
  RY: number,
  angle: number,
  LAF: number,
  SF: number,
  x: number,
  y: number,
  distance?: number,
) => {
  const { abs, sin, cos, sqrt, PI } = Math;
  let rx = abs(RX);
  let ry = abs(RY);
  const xRot = ((angle % 360) + 360) % 360;
  const xRotRad = xRot * (PI / 180);

  if (x1 === x && y1 === y) {
    return {
      point: { x, y },
      length: 0,
      bbox: { min: { x, y }, max: { x, y } },
    };
  }

  if (rx === 0 || ry === 0) {
    return getLineSegmentProperties(x1, y1, x, y, distance);
  }

  const dx = (x1 - x) / 2;
  const dy = (y1 - y) / 2;

  const transformedPoint = {
    x: cos(xRotRad) * dx + sin(xRotRad) * dy,
    y: -sin(xRotRad) * dx + cos(xRotRad) * dy,
  };

  const radiiCheck = transformedPoint.x ** 2 / rx ** 2 + transformedPoint.y ** 2 / ry ** 2;

  if (radiiCheck > 1) {
    rx *= sqrt(radiiCheck);
    ry *= sqrt(radiiCheck);
  }

  const cSquareNumerator = rx ** 2 * ry ** 2 - rx ** 2 * transformedPoint.y ** 2 - ry ** 2 * transformedPoint.x ** 2;
  const cSquareRootDenom = rx ** 2 * transformedPoint.y ** 2 + ry ** 2 * transformedPoint.x ** 2;

  let cRadicand = cSquareNumerator / cSquareRootDenom;
  cRadicand = cRadicand < 0 ? 0 : cRadicand;
  const cCoef = (LAF !== SF ? 1 : -1) * sqrt(cRadicand);
  const transformedCenter = {
    x: cCoef * ((rx * transformedPoint.y) / ry),
    y: cCoef * (-(ry * transformedPoint.x) / rx),
  };

  const center = {
    x: cos(xRotRad) * transformedCenter.x - sin(xRotRad) * transformedCenter.y + (x1 + x) / 2,
    y: sin(xRotRad) * transformedCenter.x + cos(xRotRad) * transformedCenter.y + (y1 + y) / 2,
  };

  const startVector = {
    x: (transformedPoint.x - transformedCenter.x) / rx,
    y: (transformedPoint.y - transformedCenter.y) / ry,
  };

  const startAngle = angleBetween({ x: 1, y: 0 }, startVector);

  const endVector = {
    x: (-transformedPoint.x - transformedCenter.x) / rx,
    y: (-transformedPoint.y - transformedCenter.y) / ry,
  };

  let sweepAngle = angleBetween(startVector, endVector);
  if (!SF && sweepAngle > 0) {
    sweepAngle -= 2 * PI;
  } else if (SF && sweepAngle < 0) {
    sweepAngle += 2 * PI;
  }
  sweepAngle %= 2 * PI;

  const alpha = startAngle + sweepAngle * (distance || 0);
  const endAngle = startAngle + sweepAngle;
  const ellipseComponentX = rx * cos(alpha);
  const ellipseComponentY = ry * sin(alpha);

  const point = {
    x: cos(xRotRad) * ellipseComponentX - sin(xRotRad) * ellipseComponentY + center.x,
    y: sin(xRotRad) * ellipseComponentX + cos(xRotRad) * ellipseComponentY + center.y,
  };

  // to be used later
  // point.ellipticalArcStartAngle = startAngle;
  // point.ellipticalArcEndAngle = startAngle + sweepAngle;
  // point.ellipticalArcAngle = alpha;

  // point.ellipticalArcCenter = center;
  // point.resultantRx = rx;
  // point.resultantRy = ry;
  // point.length = ellipticalArcLength(rx, ry, sweepAngle);
  // point.box = minmax(center.x, center.y, rx, ry, xRotRad, startAngle, startAngle + sweepAngle);

  return {
    point,
    center,
    angle: alpha,
    startAngle,
    endAngle,
    radiusX: rx,
    radiusY: ry,
    get length() {
      return ellipticalArcLength(rx, ry, sweepAngle);
    },
    get bbox() {
      return minmax(center.x, center.y, rx, ry, xRotRad, startAngle, startAngle + sweepAngle);
    },
  };
};

export default getSegmentProperties;
