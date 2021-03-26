import pathToAbsolute from '../convert/pathToAbsolute.js';
import normalizeSegment from './normalizeSegment.js';
import roundPath from './roundPath.js';
import clonePath from './clonePath.js';
import isNormalizedArray from '../util/isNormalizedArray.js';

export default function normalizePath(pathInput, round) { // pathArray|pathString
  if (isNormalizedArray(pathInput)) {
    return clonePath(pathInput);
  }

  const pathArray = pathToAbsolute(pathInput, round);
  const params = {
    x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0, qx: null, qy: null,
  };
  const allPathCommands = [];
  const ii = pathArray.length;
  let prevCommand = '';
  let segment;
  let seglen;

  for (let i = 0; i < ii; i += 1) {
    // save current path command
    const [pathCommand] = pathArray[i];

    // Save current path command
    allPathCommands[i] = pathCommand;
    // Get previous path command
    if (i) prevCommand = allPathCommands[i - 1];
    // Previous path command is inputted to processSegment
    pathArray[i] = normalizeSegment(pathArray[i], params, prevCommand);

    segment = pathArray[i];
    seglen = segment.length;

    params.x1 = +segment[seglen - 2];
    params.y1 = +segment[seglen - 1];
    params.x2 = +(segment[seglen - 4]) || params.x1;
    params.y2 = +(segment[seglen - 3]) || params.y1;
  }
  return roundPath(pathArray, round);
}
