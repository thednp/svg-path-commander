import shorthandToQuad from './shorthandToQuad';
import shorthandToCubic from './shorthandToCubic';

/**
 * Normalizes a single segment of a `pathArray` object.
 *
 * @param {SVGPathCommander.pathSegment} segment the segment object
 * @param {any} params the coordinates of the previous segment
 * @param {string} prevCommand the path command of the previous segment
 * @returns {any} the normalized segment
 */
export default function normalizeSegment(segment, params, prevCommand) {
  const [pathCommand] = segment;
  const xy = segment.slice(1);
  let result = segment.slice();

  if (!'TQ'.includes(segment[0])) {
    // optional but good to be cautious
    params.qx = null;
    params.qy = null;
  }

  if (pathCommand === 'H') {
    result = ['L', segment[1], params.y1];
  } else if (pathCommand === 'V') {
    result = ['L', params.x1, segment[1]];
  } else if (pathCommand === 'S') {
    const { x1, y1 } = shorthandToCubic(params.x1, params.y1, params.x2, params.y2, prevCommand);
    params.x1 = x1;
    params.y1 = y1;
    result = ['C', x1, y1].concat(xy);
  } else if (pathCommand === 'T') {
    const { qx, qy } = shorthandToQuad(params.x1, params.y1, params.qx, params.qy, prevCommand);
    params.qx = qx;
    params.qy = qy;
    result = ['Q', qx, qy].concat(xy);
  } else if (pathCommand === 'Q') {
    const [nqx, nqy] = xy;
    params.qx = nqx;
    params.qy = nqy;
  }
  return result;
}
