import paramCounts from './paramsCount';

/**
 * Breaks the parsing of a pathString once a segment is finalized.
 *
 * @param {SVGPC.parserPathArray} path the `parserPathArray` instance
 */
export default function finalizeSegment(path) {
  let pathCommand = path.pathValue[path.segmentStart];
  let pathComLK = pathCommand.toLowerCase();
  let params = path.data;

  // Process duplicated commands (without comand name)
  if (pathComLK === 'm' && params.length > 2) {
    path.segments.push([pathCommand, params[0], params[1]]);
    params = params.slice(2);
    pathComLK = 'l';
    pathCommand = (pathCommand === 'm') ? 'l' : 'L';
  }

  if (pathComLK === 'r') {
    path.segments.push([pathCommand].concat(params));
  } else {
    while (params.length >= paramCounts[pathComLK]) {
      path.segments.push([pathCommand].concat(params.splice(0, paramCounts[pathComLK])));
      if (!paramCounts[pathComLK]) {
        break;
      }
    }
  }
}
