import { getPointAtLineLength } from "./lineTools.ts";
import { Cvalues, Tvalues } from "./bezier.ts";
import type { Point, PointTuple } from "../types.ts";

/**
 * Returns the signed arc length of an ellipse segment from angle `0` up to
 * the given `theta` angle, by integrating the curve speed
 * `|sqrt(rx^2 * sin^2(phi) + ry^2 * cos^2(phi))|` over the `[0, theta]`
 * interval with Gauss-Legendre quadrature.
 *
 * @param rx radius along X axis
 * @param ry radius along Y axis
 * @param theta the angle in radians
 * @returns the signed arc length
 */
const arcLengthAtAngle = (rx: number, ry: number, theta: number): number => {
  const sign = theta < 0 ? -1 : 1;
  const absTheta = Math.abs(theta);
  const step = Math.PI / 2;

  let total = 0;
  let remaining = absTheta;
  let offset = 0;

  while (remaining > 0) {
    const span = Math.min(step, remaining);
    const z = span / 2;

    let sum = 0;
    for (let i = 0, len = Tvalues.length; i < len; i += 1) {
      const phi = offset + z * Tvalues[i] + z;
      sum += Cvalues[i] * Math.sqrt((rx * Math.sin(phi)) ** 2 + (ry * Math.cos(phi)) ** 2);
    }
    total += z * sum;
    offset += span;
    remaining -= span;
  }
  return sign * total;
};

/**
 * Returns the signed arc length of an ellipse segment between two angles.
 * @param rx radius along X axis
 * @param ry radius along Y axis
 * @param from the start angle in radians
 * @param to the end angle in radians
 * @returns the signed arc length
 */
const arcLengthBetween = (rx: number, ry: number, from: number, to: number): number => {
  return arcLengthAtAngle(rx, ry, to) - arcLengthAtAngle(rx, ry, from);
};

/**
 * Returns the Arc segment length.
 * @param rx radius along X axis
 * @param ry radius along Y axis
 * @param theta the angle in radians
 * @returns the arc length
 */
const arcLength = (rx: number, ry: number, theta: number): number => {
  return Math.abs(arcLengthAtAngle(rx, ry, theta));
};

/**
 * Find point on ellipse at given angle around ellipse (theta);
 * @param cx the center X
 * @param cy the center Y
 * @param rx the radius X
 * @param ry the radius Y
 * @param alpha the arc rotation angle in radians
 * @param theta the arc sweep angle in radians
 * @returns a point around ellipse at given angle
 */
const arcPoint = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  alpha: number,
  theta: number,
): PointTuple => {
  const { sin, cos } = Math;
  // theta is angle in radians around arc
  // alpha is angle of rotation of ellipse in radians
  const cosA = cos(alpha);
  const sinA = sin(alpha);
  const x = rx * cos(theta);
  const y = ry * sin(theta);

  return [cx + cosA * x - sinA * y, cy + sinA * x + cosA * y] as PointTuple;
};

/**
 * Returns the angle between two points.
 * @param v0 starting point
 * @param v1 ending point
 * @returns the angle in radian
 */
const angleBetween = (v0: Point, v1: Point): number => {
  const { x: v0x, y: v0y } = v0;
  const { x: v1x, y: v1y } = v1;
  const p = v0x * v1x + v0y * v1y;
  const n = Math.sqrt((v0x ** 2 + v0y ** 2) * (v1x ** 2 + v1y ** 2));
  const sign = v0x * v1y - v0y * v1x < 0 ? -1 : 1;
  // the cosine of an angle is in the [-1-1] range, the rounding of the
  // division can push it out of it and `acos` of a value under -1 is NaN
  return sign * Math.acos(Math.min(1, Math.max(-1, p / n)));
};

/**
 * Returns the following properties for an Arc segment: center, start angle,
 * end angle, and radiuses on X and Y axis.
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param RX the radius on X axis
 * @param RY the radius on Y axis
 * @param angle the ellipse rotation in degrees
 * @param LAF the large arc flag
 * @param SF the sweep flag
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @returns properties specific to Arc segments
 */
const getArcProps = (
  x1: number,
  y1: number,
  RX: number,
  RY: number,
  angle: number,
  LAF: number,
  SF: number,
  x: number,
  y: number,
): {
  rx: number;
  ry: number;
  startAngle: number;
  endAngle: number;
  center: { x: number; y: number };
} => {
  const { abs, sin, cos, sqrt, PI } = Math;
  let rx = abs(RX);
  let ry = abs(RY);
  const xRot = ((angle % 360) + 360) % 360;
  const xRotRad = xRot * (PI / 180);

  // istanbul ignore next
  if (x1 === x && y1 === y) {
    return {
      rx,
      ry,
      startAngle: 0,
      endAngle: 0,
      center: { x, y },
    };
  }

  if (rx === 0 || ry === 0) {
    return {
      rx,
      ry,
      startAngle: 0,
      endAngle: 0,
      center: { x: (x + x1) / 2, y: (y + y1) / 2 },
    };
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

  const cSquareNumerator =
    rx ** 2 * ry ** 2 - rx ** 2 * transformedPoint.y ** 2 - ry ** 2 * transformedPoint.x ** 2;
  const cSquareRootDenom = rx ** 2 * transformedPoint.y ** 2 + ry ** 2 * transformedPoint.x ** 2;

  let cRadicand = cSquareNumerator / cSquareRootDenom;
  /* istanbul ignore next */
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

  const endAngle = startAngle + sweepAngle;

  // point.ellipticalArcStartAngle = startAngle;
  // point.ellipticalArcEndAngle = startAngle + sweepAngle;
  // point.ellipticalArcAngle = alpha;

  // point.ellipticalArcCenter = center;
  // point.resultantRx = rx;
  // point.resultantRy = ry;

  return {
    center,
    startAngle,
    endAngle,
    rx,
    ry,
  };
};

/**
 * Returns the length of an Arc segment.
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param c1x the first control point X
 * @param c1y the first control point Y
 * @param c2x the second control point X
 * @param c2y the second control point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @returns the length of the Arc segment
 */
const getArcLength = (
  x1: number,
  y1: number,
  RX: number,
  RY: number,
  angle: number,
  LAF: number,
  SF: number,
  x: number,
  y: number,
): number => {
  const { abs } = Math;
  // a zero radius is treated as a straight line to the end point
  if (RX === 0 || RY === 0) {
    return abs(Math.sqrt((x - x1) ** 2 + (y - y1) ** 2));
  }
  const { rx, ry, startAngle, endAngle } = getArcProps(x1, y1, RX, RY, angle, LAF, SF, x, y);
  return Math.abs(arcLengthBetween(rx, ry, startAngle, endAngle));
};

/**
 * Returns a point along an Arc segment at a given distance.
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param RX the radius on X axis
 * @param RY the radius on Y axis
 * @param angle the ellipse rotation in degrees
 * @param LAF the large arc flag
 * @param SF the sweep flag
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @param distance the distance along the arc
 * @returns a point along the Arc segment
 */
const getPointAtArcLength = (
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
): { x: number; y: number } => {
  let point = { x: x1, y: y1 };
  const { center, rx, ry, startAngle, endAngle } = getArcProps(
    x1,
    y1,
    RX,
    RY,
    angle,
    LAF,
    SF,
    x,
    y,
  );

  /* istanbul ignore else */
  if (typeof distance === "number") {
    const sweepAngle = endAngle - startAngle;
    const length = Math.abs(arcLengthBetween(rx, ry, startAngle, endAngle));
    // a zero radius is treated as a straight line to the end point
    if (rx === 0 || ry === 0) {
      return getPointAtLineLength(x1, y1, x, y, distance);
    }
    if (distance <= 0) {
      point = { x: x1, y: y1 };
    } else if (distance >= length) {
      point = { x, y };
    } else {
      const { PI, cos, sin } = Math;
      const xRot = ((angle % 360) + 360) % 360;
      const xRotRad = xRot * (PI / 180);

      let lo = 0;
      let hi = 1;
      for (let i = 0; i < 25; i += 1) {
        const mid = (lo + hi) / 2;
        if (
          Math.abs(arcLengthBetween(rx, ry, startAngle, startAngle + sweepAngle * mid)) < distance
        ) {
          lo = mid;
        } else {
          hi = mid;
        }
      }
      const alpha = startAngle + sweepAngle * ((lo + hi) / 2);
      const ellipseComponentX = rx * cos(alpha);
      const ellipseComponentY = ry * sin(alpha);

      point = {
        x: cos(xRotRad) * ellipseComponentX - sin(xRotRad) * ellipseComponentY + center.x,
        y: sin(xRotRad) * ellipseComponentX + cos(xRotRad) * ellipseComponentY + center.y,
      };
    }
  }

  return point;
};

/**
 * Returns the extrema for an Arc segment in the following format:
 * [MIN_X, MIN_Y, MAX_X, MAX_Y]
 *
 * @see https://github.com/herrstrietzel/svg-pathdata-getbbox
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param RX the radius on X axis
 * @param RY the radius on Y axis
 * @param angle the ellipse rotation in degrees
 * @param LAF the large arc flag
 * @param SF the sweep flag
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @returns the extrema of the Arc segment
 */
const getArcBBox = (
  x1: number,
  y1: number,
  RX: number,
  RY: number,
  angle: number,
  LAF: number,
  SF: number,
  x: number,
  y: number,
): [number, number, number, number] => {
  const { min, max, tan, atan2, cos, PI } = Math;

  // an arc with the same start and end point is omitted by the spec
  if (x1 === x && y1 === y) {
    return [x1, y1, x, y];
  }

  // a zero radius is a straight line to the end point
  if (RX === 0 || RY === 0) {
    return [min(x1, x), min(y1, y), max(x1, x), max(y1, y)];
  }

  const { center, rx, ry, startAngle, endAngle } = getArcProps(
    x1,
    y1,
    RX,
    RY,
    angle,
    LAF,
    SF,
    x,
    y,
  );
  const deltaAngle = endAngle - startAngle;

  // circle/elipse center coordinates
  const { x: cx, y: cy } = center;

  // rotation to radians
  const alpha = (angle * PI) / 180;
  const tangent = tan(alpha);

  /**
   * find min/max from zeroes of directional derivative along x and y
   * along x axis
   */
  const theta = atan2(-ry * tangent, rx);
  const angle1 = theta;
  const angle2 = theta + PI;
  const angle3 = atan2(ry, rx * tangent);
  const angle4 = angle3 + PI;
  // the extremum points swap sides when the ellipse is rotated by more
  // than 90 degrees, the sign of `cos(alpha)` tells which one is which
  const flipped = cos(alpha) < 0;
  const rightAngle = flipped ? angle2 : angle1;
  const leftAngle = flipped ? angle1 : angle2;
  const topAngle = flipped ? angle3 : angle4;
  const bottomAngle = flipped ? angle4 : angle3;
  // the endpoints of the arc and the extrema of the ellipse it sweeps over
  const xArray = [x1, x];
  const yArray = [y1, y];

  // the span of the sweep and its direction
  const span = Math.abs(deltaAngle);
  const clockwise = deltaAngle >= 0;

  /**
   * tells if an extremum of the ellipse is on the arc, the offset of the
   * extremum is measured from the start of the arc, in the direction of
   * the sweep
   */
  const isOnArc = (extremum: number): boolean => {
    const offset = clockwise
      ? (((extremum - startAngle) % (2 * PI)) + 2 * PI) % (2 * PI)
      : (((startAngle - extremum) % (2 * PI)) + 2 * PI) % (2 * PI);
    return offset <= span + 1e-9;
  };

  // right
  if (isOnArc(rightAngle)) {
    const p = arcPoint(cx, cy, rx, ry, alpha, rightAngle);
    xArray.push(p[0]);
    yArray.push(p[1]);
  }

  // left
  if (isOnArc(leftAngle)) {
    const p = arcPoint(cx, cy, rx, ry, alpha, leftAngle);
    xArray.push(p[0]);
    yArray.push(p[1]);
  }

  // top
  if (isOnArc(topAngle)) {
    const p = arcPoint(cx, cy, rx, ry, alpha, topAngle);
    xArray.push(p[0]);
    yArray.push(p[1]);
  }

  // bottom
  if (isOnArc(bottomAngle)) {
    const p = arcPoint(cx, cy, rx, ry, alpha, bottomAngle);
    xArray.push(p[0]);
    yArray.push(p[1]);
  }

  return [min(...xArray), min(...yArray), max(...xArray), max(...yArray)] as [
    number,
    number,
    number,
    number,
  ];
};

/** The tools for elliptical arc computation. */
const arcTools = {
  angleBetween,
  arcLength,
  arcLengthAtAngle,
  arcLengthBetween,
  arcPoint,
  getArcBBox,
  getArcLength,
  getArcProps,
  getPointAtArcLength,
};

export {
  angleBetween,
  arcLength,
  arcLengthAtAngle,
  arcLengthBetween,
  arcPoint,
  arcTools,
  getArcBBox,
  getArcLength,
  getArcProps,
  getPointAtArcLength,
};
