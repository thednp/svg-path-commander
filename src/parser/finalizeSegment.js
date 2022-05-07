import paramsCount from './paramsCount';

/**
 * Breaks the parsing of a pathString once a segment is finalized.
 *
 * @param {SVGPath.PathParser} path the `PathParser` instance
 */
export default function finalizeSegment(path) {
  const pathCommand = path.pathValue[path.segmentStart];
  const LK = pathCommand.toLowerCase();
  const { data } = path;

  while (data.length >= paramsCount[LK]) {
    path.segments.push([pathCommand, ...data.splice(0, paramsCount[LK])]);
    if (!paramsCount[LK]) {
      break;
    }
  }
}
