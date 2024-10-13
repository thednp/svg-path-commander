import { getPointAtLineLength } from './lineTools';
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
 * Compute point on ellipse from angle around ellipse (theta);
 * @param theta the arc sweep angle
 * @param cx the center X
 * @param cy the center Y
 * @param rx the radius X
 * @param ry the radius Y
 * @param alpha the angle
 * @returns a point around ellipse
 */
const arc = (theta: number, cx: number, cy: number, rx: number, ry: number, alpha: number) => {
  // theta is angle in radians around arc
  // alpha is angle of rotation of ellipse in radians
  const cos = Math.cos(alpha);
  const sin = Math.sin(alpha);
  const x = rx * Math.cos(theta);
  const y = ry * Math.sin(theta);

  return {
    x: cx + cos * x - sin * y,
    y: cy + sin * x + cos * y,
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
 * Returns the following properties for an Arc segment: center, start angle
 * and radiuses on X and Y coordinates.
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
      center: { x, y },
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

  const cSquareNumerator = rx ** 2 * ry ** 2 - rx ** 2 * transformedPoint.y ** 2 - ry ** 2 * transformedPoint.x ** 2;
  const cSquareRootDenom = rx ** 2 * transformedPoint.y ** 2 + ry ** 2 * transformedPoint.x ** 2;

  let cRadicand = cSquareNumerator / cSquareRootDenom;
  /* istanbul ignore next @preserve */
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
export const getArcLength = (
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
  const { rx, ry, startAngle, endAngle } = getArcProps(x1, y1, RX, RY, angle, LAF, SF, x, y);
  return ellipticalArcLength(rx, ry, endAngle - startAngle);
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
 * @param distance a [0-1] ratio
 * @returns a point along the Arc segment
 */
export const getPointAtArcLength = (
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
  const { center, rx, ry, startAngle, endAngle } = getArcProps(x1, y1, RX, RY, angle, LAF, SF, x, y);
  const length = ellipticalArcLength(rx, ry, endAngle - startAngle);

  /* istanbul ignore else @preserve */
  if (typeof distance === 'number') {
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
        x: cos(xRotRad) * ellipseComponentX - sin(xRotRad) * ellipseComponentY + center.x,
        y: sin(xRotRad) * ellipseComponentX + cos(xRotRad) * ellipseComponentY + center.y,
      };
    }
  }

  return point;
};

/**
 * Returns the bounding box for an Arc segment.
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
 *
 */
export const getArcBBox = (
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
  const { center, rx, ry, startAngle, endAngle } = getArcProps(x1, y1, RX, RY, angle, LAF, SF, x, y);
  const deltaAngle = endAngle - startAngle;

  // final on path point
  const p = { x, y };

  // circle/elipse center coordinates
  const [cx, cy] = [center.x, center.y];

  // collect extreme points – add end point
  const extremes = [p];

  // rotation to radians
  const alpha = (angle * Math.PI) / 180;
  const tan = Math.tan(alpha);

  /**
   * find min/max from zeroes of directional derivative along x and y
   * along x axis
   */
  const theta = Math.atan2(-ry * tan, rx);
  const angle1 = theta;
  const angle2 = theta + Math.PI;
  const angle3 = Math.atan2(ry, rx * tan);
  const angle4 = angle3 + Math.PI;

  // inner bounding box
  const xArr = [x1, x];
  const yArr = [y1, y];
  const xMin = Math.min(...xArr);
  const xMax = Math.max(...xArr);
  const yMin = Math.min(...yArr);
  const yMax = Math.max(...yArr);

  // on path point close after start
  const angleAfterStart = endAngle - deltaAngle * 0.001;
  const pP2 = arc(angleAfterStart, cx, cy, rx, ry, alpha);

  // on path point close before end
  const angleBeforeEnd = endAngle - deltaAngle * 0.999;
  const pP3 = arc(angleBeforeEnd, cx, cy, rx, ry, alpha);

  /**
   * expected extremes
   * if leaving inner bounding box
   * (between segment start and end point)
   * otherwise exclude elliptic extreme points
   */

  // right
  // istanbul ignore if @preserve
  if (pP2.x > xMax || pP3.x > xMax) {
    // get point for this theta
    extremes.push(arc(angle1, cx, cy, rx, ry, alpha));
  }

  // left
  // istanbul ignore if @preserve
  if (pP2.x < xMin || pP3.x < xMin) {
    // get anti-symmetric point
    extremes.push(arc(angle2, cx, cy, rx, ry, alpha));
  }

  // top
  // istanbul ignore if @preserve
  if (pP2.y < yMin || pP3.y < yMin) {
    // get anti-symmetric point
    extremes.push(arc(angle4, cx, cy, rx, ry, alpha));
  }

  // bottom
  // istanbul ignore if @preserve
  if (pP2.y > yMax || pP3.y > yMax) {
    // get point for this theta
    extremes.push(arc(angle3, cx, cy, rx, ry, alpha));
  }

  return {
    min: {
      x: Math.min(...extremes.map(n => n.x)),
      y: Math.min(...extremes.map(n => n.y)),
    },
    max: {
      x: Math.max(...extremes.map(n => n.x)),
      y: Math.max(...extremes.map(n => n.y)),
    },
  };
};
