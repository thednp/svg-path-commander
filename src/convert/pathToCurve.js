import fixArc from '../process/fixArc';
import fixPath from '../process/fixPath';
import isCurveArray from '../util/isCurveArray';
import clonePath from '../process/clonePath';
import normalizePath from '../process/normalizePath';
import segmentToCubic from '../process/segmentToCubic';
import paramsParser from '../parser/paramsParser';

/**
 * Parses a path string value or 'pathArray' and returns a new one
 * in which all segments are converted to cubic-bezier.
 *
 * In addition, un-necessary `Z` segment is removed if previous segment
 * extends to the `M` segment.
 *
 * @param {string | SVGPathCommander.pathArray} pathInput the string to be parsed or 'pathArray'
 * @returns {SVGPathCommander.curveArray} the resulted `pathArray` converted to cubic-bezier
 */
export default function pathToCurve(pathInput) {
  if (isCurveArray(pathInput)) {
    // @ts-ignore -- `isCurveArray` checks if it's `pathArray`
    return clonePath(pathInput);
  }

  const path = fixPath(normalizePath(pathInput));
  const params = { ...paramsParser };
  const allPathCommands = [];
  let pathCommand = ''; // ts-lint
  let ii = path.length;

  for (let i = 0; i < ii; i += 1) {
    [pathCommand] = path[i];
    allPathCommands[i] = pathCommand;

    path[i] = segmentToCubic(path[i], params);

    fixArc(path, allPathCommands, i);
    ii = path.length;

    const segment = path[i];
    const seglen = segment.length;
    params.x1 = +segment[seglen - 2];
    params.y1 = +segment[seglen - 1];
    params.x2 = +(segment[seglen - 4]) || params.x1;
    params.y2 = +(segment[seglen - 3]) || params.y1;
  }

  // @ts-ignore
  return path;
}
