import normalizeSegment from './normalizeSegment';
import type { NormalArray, PathArray } from '../types';
import iterate from './iterate';
import parsePathString from '../parser/parsePathString';
import paramsParser from '../parser/paramsParser';

/**
 * Normalizes a `pathArray` object for further processing:
 * * convert segments to absolute values
 * * convert shorthand path commands to their non-shorthand notation
 *
 * @param pathInput the string to be parsed or 'pathArray'
 * @returns the normalized `pathArray`
 */
const normalizePath = (pathInput: string | PathArray) => {
  const path = parsePathString(pathInput);
  const params = { ...paramsParser };

  return iterate<NormalArray>(path, (seg, _, lastX, lastY) => {
    params.x = lastX;
    params.y = lastY;
    const result = normalizeSegment(seg, params);

    const seglen = result.length;
    params.x1 = +result[seglen - 2];
    params.y1 = +result[seglen - 1];
    params.x2 = +result[seglen - 4] || params.x1;
    params.y2 = +result[seglen - 3] || params.y1;

    return result;
  });
};
export default normalizePath;
