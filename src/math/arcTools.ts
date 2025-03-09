import { getPointAtLineLength } from "./lineTools";
import type { Point, PointTuple } from "../types";

/**
 * Returns the Arc segment length.
 * @param rx radius along X axis
 * @param ry radius along Y axis
 * @param theta the angle in radians
 * @returns the arc length
 */
const arcLength = (rx: number, ry: number, theta: number) => {
  const halfTheta = theta / 2;
  const sinHalfTheta = Math.sin(halfTheta);
  const cosHalfTheta = Math.cos(halfTheta);
  const term1 = rx ** 2 * sinHalfTheta ** 2;
  const term2 = ry ** 2 * cosHalfTheta ** 2;
  const length = Math.sqrt(term1 + term2) * theta;
  return Math.abs(length);
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
) => {
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
const angleBetween = (v0: Point, v1: Point) => {
  const { x: v0x, y: v0y } = v0;
  const { x: v1x, y: v1y } = v1;
  const p = v0x * v1x + v0y * v1y;
  const n = Math.sqrt((v0x ** 2 + v0y ** 2) * (v1x ** 2 + v1y ** 2));
  const sign = v0x * v1y - v0y * v1x < 0 ? -1 : 1;
  return sign * Math.acos(p / n);
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
) => {
  const { abs, sin, cos, sqrt, PI } = Math;
  let rx = abs(RX);
  let ry = abs(RY);
  const xRot = ((angle % 360) + 360) % 360;
  const xRotRad = xRot * (PI / 180);

  // istanbul ignore next @preserve
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

  const radiiCheck = transformedPoint.x ** 2 / rx ** 2 +
    transformedPoint.y ** 2 / ry ** 2;

  if (radiiCheck > 1) {
    rx *= sqrt(radiiCheck);
    ry *= sqrt(radiiCheck);
  }

  const cSquareNumerator = rx ** 2 * ry ** 2 -
    rx ** 2 * transformedPoint.y ** 2 - ry ** 2 * transformedPoint.x ** 2;
  const cSquareRootDenom = rx ** 2 * transformedPoint.y ** 2 +
    ry ** 2 * transformedPoint.x ** 2;

  let cRadicand = cSquareNumerator / cSquareRootDenom;
  /* istanbul ignore next @preserve */
  cRadicand = cRadicand < 0 ? 0 : cRadicand;
  const cCoef = (LAF !== SF ? 1 : -1) * sqrt(cRadicand);
  const transformedCenter = {
    x: cCoef * ((rx * transformedPoint.y) / ry),
    y: cCoef * (-(ry * transformedPoint.x) / rx),
  };

  const center = {
    x: cos(xRotRad) * transformedCenter.x - sin(xRotRad) * transformedCenter.y +
      (x1 + x) / 2,
    y: sin(xRotRad) * transformedCenter.x + cos(xRotRad) * transformedCenter.y +
      (y1 + y) / 2,
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
) => {
  const { rx, ry, startAngle, endAngle } = getArcProps(
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
  return arcLength(rx, ry, endAngle - startAngle);
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
) => {
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

  /* istanbul ignore else @preserve */
  if (typeof distance === "number") {
    const length = arcLength(rx, ry, endAngle - startAngle);
    if (distance <= 0) {
      point = { x: x1, y: y1 };
    } else if (distance >= length) {
      point = { x, y };
    } else {
      /* istanbul ignore next @preserve */
      if (x1 === x && y1 === y) {
        return { x, y };
      }
      /* istanbul ignore next @preserve */
      if (rx === 0 || ry === 0) {
        return getPointAtLineLength(x1, y1, x, y, distance);
      }
      const { PI, cos, sin } = Math;
      const sweepAngle = endAngle - startAngle;
      const xRot = ((angle % 360) + 360) % 360;
      const xRotRad = xRot * (PI / 180);
      const alpha = startAngle + sweepAngle * (distance / length);
      const ellipseComponentX = rx * cos(alpha);
      const ellipseComponentY = ry * sin(alpha);

      point = {
        x: cos(xRotRad) * ellipseComponentX - sin(xRotRad) * ellipseComponentY +
          center.x,
        y: sin(xRotRad) * ellipseComponentX + cos(xRotRad) * ellipseComponentY +
          center.y,
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
) => {
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
  const { min, max, tan, atan2, PI } = Math;

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
  const xArray = [x];
  const yArray = [y];

  // inner bounding box
  let xMin = min(x1, x);
  let xMax = max(x1, x);
  let yMin = min(y1, y);
  let yMax = max(y1, y);

  // on path point close after start
  const angleAfterStart = endAngle - deltaAngle * 0.00001;
  const pP2 = arcPoint(cx, cy, rx, ry, alpha, angleAfterStart);

  // on path point close before end
  const angleBeforeEnd = endAngle - deltaAngle * 0.99999;
  const pP3 = arcPoint(cx, cy, rx, ry, alpha, angleBeforeEnd);

  /**
   * expected extremes
   * if leaving inner bounding box
   * (between segment start and end point)
   * otherwise exclude elliptic extreme points
   */

  // right
  if (pP2[0] > xMax || pP3[0] > xMax) {
    // get point for this theta
    const p1 = arcPoint(cx, cy, rx, ry, alpha, angle1);
    xArray.push(p1[0]);
    yArray.push(p1[1]);
  }

  // left
  if (pP2[0] < xMin || pP3[0] < xMin) {
    // get anti-symmetric point
    const p2 = arcPoint(cx, cy, rx, ry, alpha, angle2);
    xArray.push(p2[0]);
    yArray.push(p2[1]);
  }

  // top
  if (pP2[1] < yMin || pP3[1] < yMin) {
    // get anti-symmetric point
    const p4 = arcPoint(cx, cy, rx, ry, alpha, angle4);
    xArray.push(p4[0]);
    yArray.push(p4[1]);
  }

  // bottom
  if (pP2[1] > yMax || pP3[1] > yMax) {
    // get point for this theta
    const p3 = arcPoint(cx, cy, rx, ry, alpha, angle3);
    xArray.push(p3[0]);
    yArray.push(p3[1]);
  }

  xMin = min.apply([], xArray);
  yMin = min.apply([], yArray);
  xMax = max.apply([], xArray);
  yMax = max.apply([], yArray);

  return [xMin, yMin, xMax, yMax] as [number, number, number, number];
};

const arcTools = {
  angleBetween,
  arcLength,
  arcPoint,
  getArcBBox,
  getArcLength,
  getArcProps,
  getPointAtArcLength,
};

export {
  angleBetween,
  arcLength,
  arcPoint,
  arcTools,
  getArcBBox,
  getArcLength,
  getArcProps,
  getPointAtArcLength,
};
