import type { ParserParams } from '../interface';
import type {
  NormalSegment,
  PointTuple,
  PathSegment,
  QSegment,
  CSegment,
  LSegment,
  MSegment,
  HSegment,
  VSegment,
  ASegment,
  PathCommand,
} from '../types';

/**
 * Normalizes a single segment of a `pathArray` object.
 *
 * @param segment the segment object
 * @param params the normalization parameters
 * @returns the normalized segment
 */
const normalizeSegment = (segment: PathSegment, params: ParserParams) => {
  const [pathCommand] = segment;
  const absCommand = pathCommand.toUpperCase();
  const isRelative = pathCommand !== absCommand;
  const { x1: px1, y1: py1, x2: px2, y2: py2, x, y } = params;
  const values = segment.slice(1) as number[];
  let absValues = values.map((n, j) => n + (isRelative ? (j % 2 ? y : x) : 0));

  if (!'TQ'.includes(absCommand)) {
    // optional but good to be cautious
    params.qx = null;
    params.qy = null;
  }

  // istanbul ignore else @preserve
  if (absCommand === 'A') {
    absValues = values.slice(0, -2).concat(values[5] + (isRelative ? x : 0), values[6] + (isRelative ? y : 0));

    return ['A' as PathCommand | number].concat(absValues) as ASegment;
  } else if (absCommand === 'H') {
    return ['L', (segment as HSegment)[1] + (isRelative ? x : 0), py1] as LSegment;
  } else if (absCommand === 'V') {
    return ['L', px1, (segment as VSegment)[1] + (isRelative ? y : 0)] as LSegment;
  } else if (absCommand === 'L') {
    return [
      'L',
      (segment as LSegment)[1] + (isRelative ? x : 0),
      (segment as LSegment)[2] + (isRelative ? y : 0),
    ] as LSegment;
  } else if (absCommand === 'M') {
    return [
      'M',
      (segment as MSegment)[1] + (isRelative ? x : 0),
      (segment as MSegment)[2] + (isRelative ? y : 0),
    ] as MSegment;
  } else if (absCommand === 'C') {
    return ['C' as PathCommand | number].concat(absValues) as CSegment;
  } else if (absCommand === 'S') {
    const x1 = px1 * 2 - px2;
    const y1 = py1 * 2 - py2;
    params.x1 = x1;
    params.y1 = y1;
    return ['C', x1, y1].concat(absValues) as CSegment;
  } else if (absCommand === 'T') {
    const qx = px1 * 2 - (params.qx ? params.qx : /* istanbul ignore next */ 0);
    const qy = py1 * 2 - (params.qy ? params.qy : /* istanbul ignore next */ 0);
    params.qx = qx;
    params.qy = qy;
    return ['Q', qx, qy].concat(absValues) as QSegment;
  } else if (absCommand === 'Q') {
    const [nqx, nqy] = absValues as PointTuple;
    params.qx = nqx;
    params.qy = nqy;
    return ['Q' as PathCommand | number].concat(absValues) as QSegment;
  } else if (absCommand === 'Z') {
    return ['Z'] as NormalSegment;
  }

  // istanbul ignore next @preserve
  return segment as NormalSegment;
};
export default normalizeSegment;
