import pathToAbsolute from './pathToAbsolute.js'
import segmentToCubic from '../process/segmentToCubic.js'
import roundPath from '../process/roundPath.js'
import fixArc from '../util/fixArc.js'
import isCurveArray from '../util/isCurveArray.js'
import clonePath from '../process/clonePath.js'
import isAbsoluteArray from '../util/isAbsoluteArray.js'

export default function pathToCurve(pathArray) { // pathArray|pathString
  if (isCurveArray(pathArray)){
    return clonePath(pathArray)
  }

  pathArray = isAbsoluteArray(pathArray) ? clonePath(pathArray) : pathToAbsolute(pathArray)
  
  // path commands of original path pathArray
  // path commands of original path p2
  // temporary holder for original path command
  let attrs = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
      segment = [], pathCommand = "", pcom = "", ii = pathArray.length;

  for (let i = 0; i < ii; i++) {
    pathArray[i] && (pathCommand = pathArray[i][0]); // save current path command

    if (pathCommand !== "C") { // C is not saved yet, because it may be result of conversion
      segment[i] = pathCommand; // Save current path command
      i && ( pcom = segment[i - 1]); // Get previous path command pcom
    }
    pathArray[i] = segmentToCubic(pathArray[i], attrs, pcom); // Previous path command is inputted to processSegment

    // A is the only command
    // which may produce multiple C:s
    // so we have to make sure that C is also C in original path
    if (segment[i] !== "A" && pathCommand === "C") segment[i] = "C";
    fixArc(pathArray,segment,i,ii);
    let seg = pathArray[i], seglen = seg.length;
    attrs.x = +seg[seglen - 2];
    attrs.y = +seg[seglen - 1];
    attrs.bx = +(seg[seglen - 4]) || attrs.x;
    attrs.by = +(seg[seglen - 3]) || attrs.y;
  }
  return isCurveArray(pathArray) ? roundPath(pathArray) : pathToCurve(pathArray) // solve curves ending with Z
}