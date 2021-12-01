import roundPath from './roundPath';
import pathToAbsolute from '../convert/pathToAbsolute';
import pathToRelative from '../convert/pathToRelative';
import shortenSegment from './shortenSegment';

/**
 * Optimizes a `pathArray` object:
 * * convert segments to shorthand if possible
 * * select shortest segments from absolute and relative `pathArray`s
 *
 * @param {string | SVGPathCommander.pathArray} pathInput a string or `pathArray`
 * @param {number | boolean | null} round the amount of decimals to round values to
 * @returns {SVGPathCommander.pathArray} the optimized `pathArray`
 */
export default function optimizePath(pathInput, round) {
  const path = pathToAbsolute(pathInput);
  const params = {
    x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0, qx: null, qy: null,
  };
  const allPathCommands = [];
  const ii = path.length;
  let pathCommand = '';
  let prevCommand = '';
  let segment;
  let seglen;

  for (let i = 0; i < ii; i += 1) {
    // save current path command
    [pathCommand] = path[i];

    // Save current path command
    allPathCommands[i] = pathCommand;
    // Get previous path command
    if (i) prevCommand = allPathCommands[i - 1];
    // Previous path command is inputted to processSegment
    path[i] = shortenSegment(path[i], params, prevCommand);

    segment = path[i];
    seglen = segment.length;

    params.x1 = +segment[seglen - 2];
    params.y1 = +segment[seglen - 1];
    params.x2 = +(segment[seglen - 4]) || params.x1;
    params.y2 = +(segment[seglen - 3]) || params.y1;
  }

  const absolutePath = roundPath(pathToAbsolute(path), round);
  const relativePath = roundPath(pathToRelative(path), round);

  return absolutePath.map((x, i) => {
    if (i) {
      return x.join('').length < relativePath[i].join('').length
        ? x : relativePath[i];
    }
    return x;
  });
}
