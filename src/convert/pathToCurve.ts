import fixArc from '../process/fixArc';
import isCurveArray from '../util/isCurveArray';
import normalizePath from '../process/normalizePath';
import segmentToCubic from '../process/segmentToCubic';
import paramsParser from '../parser/paramsParser';
import { CurveArray, PathArray, PathCommand } from '../types';

/**
 * Parses a path string value or 'pathArray' and returns a new one
 * in which all segments are converted to cubic-bezier.
 *
 * In addition, un-necessary `Z` segment is removed if previous segment
 * extends to the `M` segment.
 *
 * @param pathInput the string to be parsed or 'pathArray'
 * @returns the resulted `pathArray` converted to cubic-bezier
 */
const pathToCurve = (pathInput: string | PathArray): CurveArray => {
  /* istanbul ignore else */
  if (isCurveArray(pathInput)) {
    return pathInput.slice(0) as CurveArray;
  }

  const path = normalizePath(pathInput);
  const params = { ...paramsParser };
  const allPathCommands = [] as PathCommand[];
  let pathCommand = ''; // ts-lint
  let ii = path.length;

  for (let i = 0; i < ii; i += 1) {
    [pathCommand] = path[i];
    allPathCommands[i] = pathCommand as PathCommand;

    path[i] = segmentToCubic(path[i], params);

    fixArc(path, allPathCommands, i);
    ii = path.length;

    const segment = path[i];
    const seglen = segment.length;
    params.x1 = +segment[seglen - 2];
    params.y1 = +segment[seglen - 1];
    params.x2 = +segment[seglen - 4] || params.x1;
    params.y2 = +segment[seglen - 3] || params.y1;
  }

  return path as CurveArray;
};
export default pathToCurve;
