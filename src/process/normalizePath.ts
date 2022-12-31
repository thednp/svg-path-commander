import pathToAbsolute from '../convert/pathToAbsolute';
import normalizeSegment from './normalizeSegment';
import isNormalizedArray from '../util/isNormalizedArray';
import paramsParser from '../parser/paramsParser';
import type { NormalArray, PathArray } from '../types';

/**
 * Normalizes a `path` object for further processing:
 * * convert segments to absolute values
 * * convert shorthand path commands to their non-shorthand notation
 *
 * @param pathInput the string to be parsed or 'pathArray'
 * @returns the normalized `pathArray`
 */
const normalizePath = (pathInput: string | PathArray): NormalArray => {
  if (isNormalizedArray(pathInput)) {
    return [...pathInput];
  }

  const path = pathToAbsolute(pathInput);
  const params = { ...paramsParser };
  const allPathCommands = [];
  const ii = path.length;
  let pathCommand = '';

  for (let i = 0; i < ii; i += 1) {
    [pathCommand] = path[i];

    // Save current path command
    allPathCommands[i] = pathCommand;
    path[i] = normalizeSegment(path[i], params);

    const segment = path[i];
    const seglen = segment.length;

    params.x1 = +segment[seglen - 2];
    params.y1 = +segment[seglen - 1];
    params.x2 = +segment[seglen - 4] || params.x1;
    params.y2 = +segment[seglen - 3] || params.y1;
  }

  return path as NormalArray;
};
export default normalizePath;
