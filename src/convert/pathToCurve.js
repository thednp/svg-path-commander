import fixArc from '../process/fixArc';
import isCurveArray from '../util/isCurveArray';
import clonePath from '../process/clonePath';
import normalizePath from '../process/normalizePath';
import segmentToCubic from '../process/segmentToCubic';

/**
 * Parses a path string value or 'pathArray' and returns a new one
 * in which all segments are converted to cubic-bezier.
 *
 * @param {string | svgpcNS.pathArray} pathInput the string to be parsed or object
 * @returns {svgpcNS.pathArray} the resulted `pathArray` converted to cubic-bezier
 */
export default function pathToCurve(pathInput) {
  if (isCurveArray(pathInput)) {
    return clonePath(pathInput);
  }

  const path = normalizePath(pathInput);
  const params = {
    x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0, qx: null, qy: null,
  };
  /** @type {string[]} */
  const allPathCommands = [];
  let pathCommand = ''; // ts-lint
  let ii = path.length;

  for (let i = 0; i < ii; i += 1) {
    const segment = path[i];
    const seglen = segment.length;
    if (segment) [pathCommand] = segment;
    allPathCommands[i] = pathCommand;
    path[i] = segmentToCubic(segment, params);

    fixArc(path, allPathCommands, i);
    ii = path.length; // solves curveArrays ending in Z

    params.x1 = +segment[seglen - 2];
    params.y1 = +segment[seglen - 1];
    params.x2 = +(segment[seglen - 4]) || params.x1;
    params.y2 = +(segment[seglen - 3]) || params.y1;
  }

  return path;
}
