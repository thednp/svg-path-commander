// import paramsParser from '../parser/paramsParser';
import type { PathArray, PathCommand, PathSegment, IteratorCallback, AbsoluteCommand } from '../types';

const iterate = <T extends PathArray>(path: PathArray, iterator: IteratorCallback) => {
  let pathLen = path.length;
  let segment: PathSegment;
  let pathCommand = 'M' as PathCommand;
  let absCommand = 'M' as AbsoluteCommand;
  let isRelative = false;
  let x = 0;
  let y = 0;
  let mx = 0;
  let my = 0;
  let segLen = 0;

  for (let i = 0; i < pathLen; i += 1) {
    segment = path[i];
    [pathCommand] = segment;
    segLen = segment.length;
    absCommand = pathCommand.toUpperCase() as AbsoluteCommand;
    isRelative = absCommand !== pathCommand;

    const iteratorResult = iterator(segment, i, x, y);
    // some methods like getPointAtLength would like to break
    // when task is complete
    if (iteratorResult === false) {
      break;
    }

    // segment = path[i];
    if (absCommand === 'Z') {
      x = mx;
      y = my;
    } else if (absCommand === 'H') {
      x = (segment[1] as number) + (isRelative ? x : 0);
    } else if (absCommand === 'V') {
      y = (segment[1] as number) + (isRelative ? y : 0);
    } else {
      x = (segment[segLen - 2] as number) + (isRelative ? x : 0);
      y = (segment[segLen - 1] as number) + (isRelative ? y : 0);

      if (absCommand === 'M') {
        mx = x;
        my = y;
      }
    }

    if (iteratorResult) {
      path[i] = iteratorResult;
      if (iteratorResult[0] === 'C') {
        pathLen = path.length;
      }
    }
  }
  return path as T;
};

export default iterate;
