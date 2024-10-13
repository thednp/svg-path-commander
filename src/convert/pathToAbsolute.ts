import parsePathString from '../parser/parsePathString';
import absolutizeSegment from '../process/absolutizeSegment';
import type { AbsoluteArray, AbsoluteCommand, HSegment, PathArray, PointTuple, VSegment } from '../types';
import iterate from '../process/iterate';

/**
 * Parses a path string value or object and returns an array
 * of segments, all converted to absolute values.
 *
 * @param pathInput the path string | object
 * @returns the resulted `pathArray` with absolute values
 */
const pathToAbsolute = (pathInput: string | PathArray) => {
  let x = 0;
  let y = 0;
  let mx = 0;
  let my = 0;
  let pathCommand = 'M';
  const path = parsePathString(pathInput);

  return iterate<AbsoluteArray>(path, (seg, params) => {
    [pathCommand] = seg;
    const result = absolutizeSegment(seg, params);
    const absCommand = pathCommand.toUpperCase() as AbsoluteCommand;

    if (absCommand === 'Z') {
      x = mx;
      y = my;
    } else if (absCommand === 'H') {
      [, x] = result as HSegment;
    } else if (absCommand === 'V') {
      [, y] = result as VSegment;
    } else {
      [x, y] = result.slice(-2) as PointTuple;

      if (absCommand === 'M') {
        mx = x;
        my = y;
      }
    }

    params.x = x;
    params.y = y;
    return result;
  });
};
export default pathToAbsolute;
