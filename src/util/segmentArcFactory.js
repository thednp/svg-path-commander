import segmentLineFactory from './segmentLineFactory';
import distanceSquareRoot from '../math/distanceSquareRoot';

/**
 *
 * @param {{x: number, y: number}} v0
 * @param {{x: number, y: number}} v1
 * @returns {{x: number, y: number}}
 */
function angleBetween(v0, v1) {
  const { x: v0x, y: v0y } = v0;
  const { x: v1x, y: v1y } = v1;
  const p = v0x * v1x + v0y * v1y;
  const n = Math.sqrt((v0x ** 2 + v0y ** 2) * (v1x ** 2 + v1y ** 2));
  const sign = v0x * v1y - v0y * v1x < 0 ? -1 : 1;
  const angle = sign * Math.acos(p / n);

  return angle;
}

/**
 * Returns a {x,y} point at a given length, the total length and
 * the minimum and maximum {x,y} coordinates of a C (cubic-bezier) segment.
 * @see https://github.com/MadLittleMods/svg-curve-lib/blob/master/src/js/svg-curve-lib.js
 *
 * @param {number} x1 the starting x position
 * @param {number} y1 the starting y position
 * @param {number} RX x-radius of the arc
 * @param {number} RY y-radius of the arc
 * @param {number} angle x-axis-rotation of the arc
 * @param {number} LAF large-arc-flag of the arc
 * @param {number} SF sweep-flag of the arc
 * @param {number} x the ending x position
 * @param {number} y the ending y position
 * @param {number} t the point distance
 * @returns {{x: number, y: number}} the requested point
 */
function getPointAtArcSegmentLength(x1, y1, RX, RY, angle, LAF, SF, x, y, t) {
  const {
    abs, sin, cos, sqrt, PI,
  } = Math;
  let rx = abs(RX);
  let ry = abs(RY);
  const xRot = ((angle % 360) + 360) % 360;
  const xRotRad = xRot * (PI / 180);

  if (x1 === x && y1 === y) {
    return { x: x1, y: y1 };
  }

  if (rx === 0 || ry === 0) {
    return segmentLineFactory(x1, y1, x, y, t).point;
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

  const cSquareNumerator = rx ** 2 * ry ** 2
    - rx ** 2 * transformedPoint.y ** 2
    - ry ** 2 * transformedPoint.x ** 2;

  const cSquareRootDenom = rx ** 2 * transformedPoint.y ** 2
    + ry ** 2 * transformedPoint.x ** 2;

  let cRadicand = cSquareNumerator / cSquareRootDenom;
  cRadicand = cRadicand < 0 ? 0 : cRadicand;
  const cCoef = (LAF !== SF ? 1 : -1) * sqrt(cRadicand);
  const transformedCenter = {
    x: cCoef * ((rx * transformedPoint.y) / ry),
    y: cCoef * (-(ry * transformedPoint.x) / rx),
  };

  const center = {
    x: cos(xRotRad) * transformedCenter.x
      - sin(xRotRad) * transformedCenter.y + (x1 + x) / 2,
    y: sin(xRotRad) * transformedCenter.x
      + cos(xRotRad) * transformedCenter.y + (y1 + y) / 2,
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

  const alpha = startAngle + sweepAngle * t;
  const ellipseComponentX = rx * cos(alpha);
  const ellipseComponentY = ry * sin(alpha);

  const point = {
    x: cos(xRotRad) * ellipseComponentX
      - sin(xRotRad) * ellipseComponentY
      + center.x,
    y: sin(xRotRad) * ellipseComponentX
      + cos(xRotRad) * ellipseComponentY
      + center.y,
  };

  // to be used later
  // point.ellipticalArcStartAngle = startAngle;
  // point.ellipticalArcEndAngle = startAngle + sweepAngle;
  // point.ellipticalArcAngle = alpha;

  // point.ellipticalArcCenter = center;
  // point.resultantRx = rx;
  // point.resultantRy = ry;

  return point;
}

/**
 * Returns a {x,y} point at a given length, the total length and
 * the shape minimum and maximum {x,y} coordinates of an A (arc-to) segment.
 *
 * @param {number} X1 the starting x position
 * @param {number} Y1 the starting y position
 * @param {number} RX x-radius of the arc
 * @param {number} RY y-radius of the arc
 * @param {number} angle x-axis-rotation of the arc
 * @param {number} LAF large-arc-flag of the arc
 * @param {number} SF sweep-flag of the arc
 * @param {number} X2 the ending x position
 * @param {number} Y2 the ending y position
 * @param {number} distance the point distance
 * @returns {SVGPath.lengthFactory} the segment length, point, min & max
 */
export default function segmentArcFactory(X1, Y1, RX, RY, angle, LAF, SF, X2, Y2, distance) {
  const distanceIsNumber = typeof distance === 'number';
  let x = X1; let y = Y1;
  let LENGTH = 0;
  let prev = [x, y, LENGTH];
  let cur = [x, y];
  let t = 0;
  let POINT = { x: 0, y: 0 };
  let POINTS = [{ x, y }];

  if (distanceIsNumber && distance <= 0) {
    POINT = { x, y };
  }

  const sampleSize = 300;
  for (let j = 0; j <= sampleSize; j += 1) {
    t = j / sampleSize;

    ({ x, y } = getPointAtArcSegmentLength(X1, Y1, RX, RY, angle, LAF, SF, X2, Y2, t));
    POINTS = [...POINTS, { x, y }];
    LENGTH += distanceSquareRoot(cur, [x, y]);
    cur = [x, y];

    if (distanceIsNumber && LENGTH > distance && distance > prev[2]) {
      const dv = (LENGTH - distance) / (LENGTH - prev[2]);

      POINT = {
        x: cur[0] * (1 - dv) + prev[0] * dv,
        y: cur[1] * (1 - dv) + prev[1] * dv,
      };
    }
    prev = [x, y, LENGTH];
  }

  if (distanceIsNumber && distance >= LENGTH) {
    POINT = { x: X2, y: Y2 };
  }

  return {
    length: LENGTH,
    point: POINT,
    min: {
      x: Math.min(...POINTS.map((n) => n.x)),
      y: Math.min(...POINTS.map((n) => n.y)),
    },
    max: {
      x: Math.max(...POINTS.map((n) => n.x)),
      y: Math.max(...POINTS.map((n) => n.y)),
    },
  };
}
