import segmentCubicFactory from './segmentCubicFactory';
import arcToCubic from '../process/arcToCubic';

/**
 * Returns the length of a A (arc-to) segment,
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
 * @returns {{x: number, y: number} | number} the segment length or point
 */
export default function segmentArcFactory(X1, Y1, RX, RY, angle, LAF, SF, X2, Y2, distance) {
  const cubicSeg = arcToCubic(X1, Y1, RX, RY, angle, LAF, SF, X2, Y2);
  const distanceIsNumber = typeof distance === 'number';
  let [x, y] = [X1, Y1];
  const lengthMargin = 0.001;
  let totalLength = 0;
  let cubicSubseg = [];
  let argsc = [];
  let segLen = 0;

  if (distanceIsNumber && distance < lengthMargin) {
    return { x, y };
  }

  for (let i = 0, ii = cubicSeg.length; i < ii; i += 6) {
    cubicSubseg = cubicSeg.slice(i, i + 6);
    argsc = [x, y, ...cubicSubseg];
    // @ts-ignore
    segLen = segmentCubicFactory(...argsc);
    if (distanceIsNumber && totalLength + segLen >= distance) {
      // @ts-ignore -- this is a `cubicSegment`
      return segmentCubicFactory(...argsc, distance - totalLength);
    }
    totalLength += segLen;
    [x, y] = cubicSubseg.slice(-2);
  }

  if (distanceIsNumber && distance >= totalLength) {
    return { x: X2, y: Y2 };
  }

  return totalLength;
}
