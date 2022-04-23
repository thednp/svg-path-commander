import segmentCubicFactory from './segmentCubicFactory';
import arcToCubic from '../process/arcToCubic';

/**
 * Returns the length of an A (arc-to) segment
 * or an {x,y} point at a given length.
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
  const cubicSeg = arcToCubic(X1, Y1, RX, RY, angle, LAF, SF, X2, Y2);
  const distanceIsNumber = typeof distance === 'number';
  let [x, y] = [X1, Y1];
  const lengthMargin = 0.001;
  let cubicSubseg = [];
  let argsc = [];
  /** @type {{x: number, y: number}[]} */
  let MIN = [];
  /** @type {{x: number, y: number}[]} */
  let MAX = [];
  let length = 0;
  let min = { x: 0, y: 0 };
  let max = min;
  let point = min;
  let POINT = min;
  let LENGTH = 0;

  if (distanceIsNumber && distance < lengthMargin) {
    POINT = { x, y };
  }

  for (let i = 0, ii = cubicSeg.length; i < ii; i += 6) {
    cubicSubseg = cubicSeg.slice(i, i + 6);
    argsc = [x, y, ...cubicSubseg];
    ({
      length, min, max, point,
      // @ts-ignore
    } = segmentCubicFactory(...argsc, (distance || 0) - LENGTH));
    if (distanceIsNumber && LENGTH < distance && LENGTH + length >= distance) {
      POINT = point;
    }
    LENGTH += length;
    MAX = [...MAX, max];
    MIN = [...MIN, min];

    [x, y] = cubicSubseg.slice(-2);
  }

  if (distanceIsNumber && distance >= LENGTH) {
    POINT = { x: X2, y: Y2 };
  }

  return {
    length: LENGTH,
    point: POINT,
    min: {
      x: Math.min(...MIN.map((n) => n.x)),
      y: Math.min(...MIN.map((n) => n.y)),
    },
    max: {
      x: Math.max(...MAX.map((n) => n.x)),
      y: Math.max(...MAX.map((n) => n.y)),
    },
  };
}
