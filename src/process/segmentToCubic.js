import arcToCubic from './arcToCubic';
import quadToCubic from './quadToCubic';
import lineToCubic from './lineToCubic';

/**
 * Converts any segment to C (cubic-bezier).
 *
 * @param {SVGPath.pathSegment} segment the source segment
 * @param {SVGPath.parserParams} params the source segment parameters
 * @returns {SVGPath.cubicSegment | SVGPath.MSegment} the cubic-bezier segment
 */
export default function segmentToCubic(segment, params) {
  const [pathCommand] = segment;
  const values = segment.slice(1).map(Number);
  const [x, y] = values;
  let args;
  const {
    x1: px1, y1: py1, x: px, y: py,
  } = params;

  if (!'TQ'.includes(pathCommand)) {
    params.qx = null;
    params.qy = null;
  }

  switch (pathCommand) {
    case 'M':
      params.x = x;
      params.y = y;
      return segment;
    case 'A':
      args = [px1, py1, ...values];
      return ['C', ...arcToCubic(...args)];
    case 'Q':
      params.qx = x;
      params.qy = y;
      args = [px1, py1, ...values];
      return ['C', ...quadToCubic(...args)];
    case 'L':
      return ['C', ...lineToCubic(px1, py1, x, y)];
    case 'Z':
      return ['C', ...lineToCubic(px1, py1, px, py)];
    default:
  }
  return segment;
}
