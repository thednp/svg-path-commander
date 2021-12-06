import paramsCount from './paramsCount';

/**
 * Breaks the parsing of a pathString once a segment is finalized.
 *
 * @param {SVGPathCommander.PathParser} path the `PathParser` instance
 */
export default function finalizeSegment(path) {
  let pathCommand = path.pathValue[path.segmentStart];
  let LK = pathCommand.toLowerCase();
  let { data } = path;

  // Process duplicated commands (without comand name)
  if (LK === 'm' && data.length > 2) {
    // @ts-ignore
    path.segments.push([pathCommand, data[0], data[1]]);
    data = data.slice(2);
    LK = 'l';
    pathCommand = pathCommand === 'm' ? 'l' : 'L';
  }

  // @ts-ignore
  while (data.length >= paramsCount[LK]) {
    // path.segments.push([pathCommand].concat(data.splice(0, paramsCount[LK])));
    // @ts-ignore
    path.segments.push([pathCommand, ...data.splice(0, paramsCount[LK])]);
    // @ts-ignore
    if (!paramsCount[LK]) {
      break;
    }
  }
}
