import paramsParser from '../parser/paramsParser';
import type { PathArray, PathCommand, PathSegment, IteratorCallback } from '../types';

const iterate = <T extends PathArray>(path: PathArray, iterator: IteratorCallback) => {
  const allPathCommands = [] as PathCommand[];
  const params = { ...paramsParser };
  let pathLen = path.length;
  let segment: PathSegment;
  let pathCommand = 'M' as PathCommand;

  for (let i = 0; i < pathLen; i += 1) {
    segment = path[i];
    [pathCommand] = segment;
    allPathCommands[i] = pathCommand;
    const iteratorResult = iterator(segment, params, i);
    path[i] = iteratorResult;

    if (iteratorResult[0] === 'C') {
      pathLen = path.length;
    }

    segment = path[i];
    const seglen = segment.length;
    params.x1 = +segment[seglen - 2];
    params.y1 = +segment[seglen - 1];
    params.x2 = +segment[seglen - 4] || params.x1;
    params.y2 = +segment[seglen - 3] || params.y1;
  }
  // console.log('iteration: ', ...path)
  return path as T;
};

export default iterate;
