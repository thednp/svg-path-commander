import type { ParserParams } from '../interface';
import type { NormalSegment, PointTuple, PathSegment, QSegment, CSegment, LSegment } from '../types';

/**
 * Normalizes a single segment of a `pathArray` object.
 *
 * @param segment the segment object
 * @param params the coordinates of the previous segment
 * @returns the normalized segment
 */
const normalizeSegment = (segment: PathSegment, params: ParserParams) => {
  const [pathCommand] = segment;
  const { x1: px1, y1: py1, x2: px2, y2: py2 } = params;
  const values = segment.slice(1).map(Number);

  if (!'TQ'.includes(pathCommand)) {
    // optional but good to be cautious
    params.qx = null;
    params.qy = null;
  }

  if (pathCommand === 'H') {
    return ['L', segment[1], py1] as LSegment;
  } else if (pathCommand === 'V') {
    return ['L', px1, segment[1]] as LSegment;
  } else if (pathCommand === 'S') {
    const x1 = px1 * 2 - px2;
    const y1 = py1 * 2 - py2;
    params.x1 = x1;
    params.y1 = y1;
    return ['C', x1, y1, ...values] as CSegment;
  } else if (pathCommand === 'T') {
    const qx = px1 * 2 - (params.qx ? params.qx : /* istanbul ignore next */ 0);
    const qy = py1 * 2 - (params.qy ? params.qy : /* istanbul ignore next */ 0);
    params.qx = qx;
    params.qy = qy;
    return ['Q', qx, qy, ...values] as QSegment;
  } else if (pathCommand === 'Q') {
    const [nqx, nqy] = values as PointTuple;
    params.qx = nqx;
    params.qy = nqy;
  }

  return segment as NormalSegment;
};
export default normalizeSegment;
