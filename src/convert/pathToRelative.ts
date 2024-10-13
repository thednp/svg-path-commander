import type {
  AbsoluteCommand,
  hSegment,
  PathArray,
  PointTuple,
  RelativeArray,
  RelativeCommand,
  vSegment,
} from '../types';
import parsePathString from '../parser/parsePathString';
import iterate from '../process/iterate';
import relativizeSegment from '../process/relativizeSegment';

/**
 * Parses a path string value or object and returns an array
 * of segments, all converted to relative values.
 *
 * @param pathInput the path string | object
 * @returns the resulted `pathArray` with relative values
 */
const pathToRelative = (pathInput: string | PathArray): RelativeArray => {
  let x = 0;
  let y = 0;
  let mx = 0;
  let my = 0;
  let pathCommand = 'M';
  const path = parsePathString(pathInput);

  return iterate<RelativeArray>(path, (seg, params, i) => {
    [pathCommand] = seg;
    const result = relativizeSegment(seg, params, i);
    const [resultedCommand] = result;
    const absCommand = pathCommand.toUpperCase() as AbsoluteCommand;
    const relCommand = pathCommand.toLowerCase() as RelativeCommand;
    const isRelative = resultedCommand === relCommand;

    if (absCommand === 'Z') {
      x = mx;
      y = my;
    } else if (absCommand === 'H') {
      [, x] = result as hSegment;
      x += isRelative ? params.x : /* istanbul ignore next @preserve */ 0;
    } else if (absCommand === 'V') {
      [, y] = result as vSegment;
      y += isRelative ? params.y : /* istanbul ignore next @preserve */ 0;
    } else {
      [x, y] = result.slice(-2) as PointTuple;
      x += isRelative ? params.x : 0;
      y += isRelative ? params.y : 0;

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
export default pathToRelative;
