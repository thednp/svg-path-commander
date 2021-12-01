import shorthandToQuad from './shorthandToQuad';
import shorthandToCubic from './shorthandToCubic';

/**
 * Normalizes a single segment of a `pathArray` object.
 *
 * @param {SVGPathCommander.pathSegment} segment the segment object
 * @param {any} params the coordinates of the previous segment
 * @param {string} prevCommand the path command of the previous segment
 * @returns {SVGPathCommander.pathSegment} the normalized segment
 */
export default function normalizeSegment(segment, params, prevCommand) {
  const {
    x1: px1, y1: py1, x2: px2, y2: py2,
  } = params;
  const [pathCommand] = segment;
  const values = segment.slice(1).map(Number);
  const [x, y] = values;
  let result = segment;

  if (!'TQ'.includes(segment[0])) {
    // optional but good to be cautious
    params.qx = null;
    params.qy = null;
  }

  if (pathCommand === 'H') {
    result = ['L', segment[1], py1];
  } else if (pathCommand === 'V') {
    result = ['L', px1, segment[1]];
  } else if (pathCommand === 'S') {
    const { x1, y1 } = shorthandToCubic(px1, py1, px2, py2, prevCommand);
    params.x1 = x1;
    params.y1 = y1;
    result = ['C', x1, y1, ...values];
  } else if (pathCommand === 'T') {
    const { qx, qy } = shorthandToQuad(px1, py1, params.qx, params.qy, prevCommand);
    params.qx = qx;
    params.qy = qy;
    result = ['Q', qx, qy, ...values];
  } else if (pathCommand === 'Q') {
    params.qx = x;
    params.qy = y;
  }
  return result;
}