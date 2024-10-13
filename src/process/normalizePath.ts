import normalizeSegment from './normalizeSegment';
import type { AbsoluteCommand, NormalArray, PathArray, PointTuple } from '../types';
import iterate from './iterate';
import parsePathString from '../parser/parsePathString';
import absolutizeSegment from './absolutizeSegment';

/**
 * Normalizes a `path` object for further processing:
 * * convert segments to absolute values
 * * convert shorthand path commands to their non-shorthand notation
 *
 * @param pathInput the string to be parsed or 'pathArray'
 * @returns the normalized `pathArray`
 */
const normalizePath = (pathInput: string | PathArray) => {
  let x = 0;
  let y = 0;
  let mx = 0;
  let my = 0;
  let pathCommand = 'M';

  return iterate<NormalArray>(parsePathString(pathInput), (seg, params) => {
    const absoluteSegment = absolutizeSegment(seg, params);
    const result = normalizeSegment(absoluteSegment, params);
    [pathCommand] = result;
    const absCommand = pathCommand.toUpperCase() as AbsoluteCommand;

    if (absCommand === 'Z') {
      x = mx;
      y = my;
    } else {
      [x, y] = result.slice(-2) as PointTuple;

      if (absCommand === 'M') {
        mx = x;
        my = y;
      }
    }

    // const seglen = result.length;
    // params.x1 = +result[seglen - 2];
    // params.y1 = +result[seglen - 1];
    // params.x2 = +result[seglen - 4] || params.x1;
    // params.y2 = +result[seglen - 3] || params.y1;
    params.x = x;
    params.y = y;
    return result;
  });
};
export default normalizePath;
