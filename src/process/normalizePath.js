import pathToAbsolute from '../convert/pathToAbsolute';
import normalizeSegment from './normalizeSegment';
import clonePath from './clonePath';
import isNormalizedArray from '../util/isNormalizedArray';

/**
 * Normalizes a `path` object for further processing:
 * * convert segments to absolute values
 * * convert shorthand path commands to their non-shorthand notation
 *
 * @param {String | SVGPC.pathArray} pathInput the string to be parsed or 'pathArray'
 * @returns {SVGPC.pathArray} the normalized `pathArray`
 */
export default function normalizePath(pathInput) { // path|pathString
  if (isNormalizedArray(pathInput)) {
    return clonePath(pathInput);
  }

  const path = pathToAbsolute(pathInput);
  const params = {
    x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0, qx: null, qy: null,
  };
  const allPathCommands = [];
  const ii = path.length;
  let prevCommand = '';
  let segment;
  let seglen;

  for (let i = 0; i < ii; i += 1) {
    // save current path command
    const [pathCommand] = path[i];

    // Save current path command
    allPathCommands[i] = pathCommand;
    // Get previous path command
    if (i) prevCommand = allPathCommands[i - 1];
    // Previous path command is inputted to processSegment
    path[i] = normalizeSegment(path[i], params, prevCommand);

    segment = path[i];
    seglen = segment.length;

    params.x1 = +segment[seglen - 2];
    params.y1 = +segment[seglen - 1];
    params.x2 = +(segment[seglen - 4]) || params.x1;
    params.y2 = +(segment[seglen - 3]) || params.y1;
  }
  return path;
}
