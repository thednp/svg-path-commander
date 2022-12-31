import roundPath from './roundPath';
import pathToAbsolute from '../convert/pathToAbsolute';
import pathToRelative from '../convert/pathToRelative';
import shortenSegment from './shortenSegment';
import paramsParser from '../parser/paramsParser';
import normalizePath from './normalizePath';
import type { PathSegment, HSegment, PathArray, VSegment, PathCommand, AbsoluteSegment } from '../types';

/**
 * Optimizes a `pathArray` object:
 * * convert segments to shorthand if possible
 * * select shortest segments from absolute and relative `pathArray`s
 *
 * @param pathInput a string or `pathArray`
 * @param round the amount of decimals to round values to
 * @returns the optimized `pathArray`
 */
const optimizePath = (pathInput: PathArray, round: 'off' | number): PathArray => {
  const path = pathToAbsolute(pathInput);
  const normalPath = normalizePath(path);
  const params = { ...paramsParser };
  const allPathCommands = [] as PathCommand[];
  const ii = path.length;
  let pathCommand = '' as PathCommand;
  let prevCommand = '' as PathCommand;
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
    path[i] = shortenSegment(path[i], normalPath[i], params, prevCommand) as AbsoluteSegment;

    const segment = path[i];
    const seglen = segment.length;

    // update C, S, Q, T specific params
    params.x1 = +segment[seglen - 2];
    params.y1 = +segment[seglen - 1];
    params.x2 = +segment[seglen - 4] || params.x1;
    params.y2 = +segment[seglen - 3] || params.y1;

    // update x, y params
    switch (pathCommand) {
      case 'Z':
        x = mx;
        y = my;
        break;
      case 'H':
        [, x] = segment as HSegment;
        break;
      case 'V':
        [, y] = segment as VSegment;
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

  return absolutePath.map((a: PathSegment, i: number) => {
    if (i) {
      return a.join('').length < relativePath[i].join('').length ? a : relativePath[i];
    }
    return a;
  }) as PathArray;
};
export default optimizePath;
