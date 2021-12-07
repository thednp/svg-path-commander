import roundPath from './roundPath';
import pathToAbsolute from '../convert/pathToAbsolute';
import pathToRelative from '../convert/pathToRelative';
import shortenSegment from './shortenSegment';
import paramsParser from '../parser/paramsParser';
import normalizePath from './normalizePath';

/**
 * Optimizes a `pathArray` object:
 * * convert segments to shorthand if possible
 * * select shortest segments from absolute and relative `pathArray`s
 *
 * TO DO
 * * implement `auto` for rounding values based on pathBBox
 * * also revers path check if it's smaller string, maybe?
 *
 * @param {SVGPathCommander.pathArray} pathInput a string or `pathArray`
 * @param {number | boolean} round the amount of decimals to round values to
 * @returns {SVGPathCommander.pathArray} the optimized `pathArray`
 */
export default function optimizePath(pathInput, round) {
  const path = pathToAbsolute(pathInput);
  const normalPath = normalizePath(path);
  const params = { ...paramsParser };
  const allPathCommands = [];
  const ii = path.length;
  let pathCommand = '';
  let prevCommand = '';
  let x = 0;
  let y = 0;
  let mx = 0;
  let my = 0;

  for (let i = 0; i < ii; i += 1) {
    [pathCommand] = path[i];

    // Save current path command
    allPathCommands[i] = pathCommand;
    // Get previous path command for `shortenSegment`
    if (i) prevCommand = allPathCommands[i - 1];
    // @ts-ignore -- expected when switching `pathSegment` type
    path[i] = shortenSegment(path[i], normalPath[i], params, prevCommand);

    const segment = path[i];
    const seglen = segment.length;

    // update C, S, Q, T specific params
    params.x1 = +segment[seglen - 2];
    params.y1 = +segment[seglen - 1];
    params.x2 = +(segment[seglen - 4]) || params.x1;
    params.y2 = +(segment[seglen - 3]) || params.y1;

    // update x, y params
    switch (pathCommand) {
      case 'Z':
        x = mx;
        y = my;
        break;
      case 'H':
        // @ts-ignore
        [, x] = segment;
        break;
      case 'V':
        // @ts-ignore
        [, y] = segment;
        break;
      default:
        [x, y] = segment.slice(-2).map(Number);

        if (pathCommand === 'M') {
          mx = x;
          my = y;
        }
    }
    params.x = x;
    params.y = y;
  }

  const absolutePath = roundPath(path, round);
  const relativePath = roundPath(pathToRelative(path), round);

  // @ts-ignore - it's expected an optimized `pathArray` to contain all kinds of segments
  return absolutePath.map((a, i) => {
    if (i) {
      return a.join('').length < relativePath[i].join('').length
        ? a : relativePath[i];
    }
    return a;
  });
}
