import paramsParser from '../parser/paramsParser';
import type { AbsoluteCommand, HSegment, MSegment, PathArray, PointTuple, RelativeCommand, VSegment } from '../types';

/**
 * Split a path into an `Array` of sub-path strings.
 *
 * In the process, values are converted to absolute
 * for visual consistency.
 *
 * @param pathInput the source `pathArray`
 * @return an array with all sub-path strings
 */
const splitPath = (pathInput: PathArray): PathArray[] => {
  const composite = [] as PathArray[];
  let path: PathArray;
  let pi = -1;
  let x = 0;
  let y = 0;
  let mx = 0;
  let my = 0;
  const params = { ...paramsParser };

  pathInput.forEach(seg => {
    const [pathCommand] = seg;
    const absCommand = pathCommand.toUpperCase() as AbsoluteCommand;
    const relCommand = pathCommand.toLowerCase() as RelativeCommand;
    const isRelative = pathCommand === relCommand;
    const values = seg.slice(1) as number[];

    if (absCommand === 'M') {
      pi += 1;
      [x, y] = values as PointTuple;
      x += isRelative ? params.x : 0;
      y += isRelative ? params.y : 0;
      mx = x;
      my = y;
      path = [(isRelative ? [absCommand, mx, my] : seg) as MSegment];
    } else {
      if (absCommand === 'Z') {
        x = mx;
        y = my;
      } else if (absCommand === 'H') {
        [, x] = seg as HSegment;
        x += isRelative ? params.x : /* istanbul ignore next @preserve */ 0;
      } else if (absCommand === 'V') {
        [, y] = seg as VSegment;
        y += isRelative ? params.y : /* istanbul ignore next @preserve */ 0;
      } else {
        [x, y] = seg.slice(-2) as PointTuple;
        x += isRelative ? params.x : 0;
        y += isRelative ? params.y : 0;
      }
      path.push(seg);
    }

    params.x = x;
    params.y = y;
    composite[pi] = path;
  });

  return composite;
};
export default splitPath;
