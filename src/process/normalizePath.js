import pathToAbsolute from '../convert/pathToAbsolute';
import normalizeSegment from './normalizeSegment';
import clonePath from './clonePath';
import isNormalizedArray from '../util/isNormalizedArray';
import paramsParser from '../parser/paramsParser';

/**
 * Normalizes a `path` object for further processing:
 * * convert segments to absolute values
 * * convert shorthand path commands to their non-shorthand notation
 *
 * @param {string | SVGPathCommander.pathArray} pathInput the string to be parsed or 'pathArray'
 * @returns {SVGPathCommander.normalArray} the normalized `pathArray`
 */
export default function normalizePath(pathInput) {
  if (isNormalizedArray(pathInput)) {
    // @ts-ignore -- `isNormalizedArray` checks if it's `pathArray`
    return clonePath(pathInput);
  }

  /** @type {SVGPathCommander.normalArray} */
  // @ts-ignore -- `absoluteArray` will become a `normalArray`
  const path = pathToAbsolute(pathInput);
  const params = { ...paramsParser };
  const allPathCommands = [];
  const ii = path.length;
  let pathCommand = '';
  let prevCommand = '';

  for (let i = 0; i < ii; i += 1) {
    [pathCommand] = path[i];

    // Save current path command
    allPathCommands[i] = pathCommand;
    // Get previous path command
    if (i) prevCommand = allPathCommands[i - 1];
    // Previous path command is used to normalizeSegment
    // @ts-ignore -- expected on normalization
    path[i] = normalizeSegment(path[i], params, prevCommand);

    const segment = path[i];
    const seglen = segment.length;

    params.x1 = +segment[seglen - 2];
    params.y1 = +segment[seglen - 1];
    params.x2 = +(segment[seglen - 4]) || params.x1;
    params.y2 = +(segment[seglen - 3]) || params.y1;
  }

  return path;
}
