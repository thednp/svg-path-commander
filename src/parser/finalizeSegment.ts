import paramsCount from './paramsCount';
import PathParser from './pathParser';
import type { PathCommand, PathSegment, RelativeCommand } from '../types';

/**
 * Breaks the parsing of a pathString once a segment is finalized.
 *
 * @param path the `PathParser` instance
 */
const finalizeSegment = (path: PathParser) => {
  let pathCommand = path.pathValue[path.segmentStart] as PathCommand;
  let LK = pathCommand.toLowerCase() as RelativeCommand;
  const { data } = path;

  while (data.length >= paramsCount[LK]) {
    // overloaded `moveTo`
    // https://github.com/rveciana/svg-path-properties/blob/master/src/parse.ts
    if (LK === 'm' && data.length > 2) {
      path.segments.push([pathCommand, ...(data.splice(0, 2) as number[])] as PathSegment);
      LK = 'l';
      pathCommand = pathCommand === 'm' ? 'l' : 'L';
    } else {
      path.segments.push([pathCommand, ...(data.splice(0, paramsCount[LK]) as number[])] as PathSegment);
    }

    if (!paramsCount[LK]) {
      break;
    }
  }
};
export default finalizeSegment;
