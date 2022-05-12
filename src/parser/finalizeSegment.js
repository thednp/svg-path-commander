import paramsCount from './paramsCount';

/**
 * Breaks the parsing of a pathString once a segment is finalized.
 *
 * @param {SVGPath.PathParser} path the `PathParser` instance
 */
export default function finalizeSegment(path) {
  let pathCommand = path.pathValue[path.segmentStart];
  let LK = pathCommand.toLowerCase();
  const { data } = path;

  while (data.length >= paramsCount[LK]) {
    // overloaded `moveTo`
    // https://github.com/rveciana/svg-path-properties/blob/master/src/parse.ts
    if (LK === 'm' && data.length > 2) {
      path.segments.push([pathCommand, ...data.splice(0, 2)]);
      LK = 'l';
      pathCommand = pathCommand === 'm' ? 'l' : 'L';
    } else {
      path.segments.push([pathCommand, ...data.splice(0, paramsCount[LK])]);
    }

    if (!paramsCount[LK]) {
      break;
    }
  }
}
