import roundPath from '../process/roundPath.js'
import fixArc from '../util/fixArc.js'
import isCurveArray from '../util/isCurveArray.js'
import clonePath from '../process/clonePath.js'
import normalizePath from '../process/normalizePath.js'
import segmentToCubicBezier from '../process/segmentToCubicBezier.js'

export default function(pathArray,round) { // pathArray|pathString
  if (isCurveArray(pathArray)){
    return clonePath(pathArray)
  }

  pathArray = normalizePath(pathArray)
  
  let params = {x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0, qx: null, qy: null},
      allPathCommands = [], pathCommand = '', ii = pathArray.length, 
      segment, seglen;

  for (let i = 0; i < ii; i++) {
    pathArray[i] && (pathCommand = pathArray[i][0])     // save current path command

    if (pathCommand !== 'C') {                          // C is not saved yet, because it may be result of conversion
      allPathCommands[i] = pathCommand                  // save current path command
    }
    pathArray[i] = segmentToCubicBezier(pathArray[i], params)

    // A is the only command which may produce multiple C:s
    // so we have to make sure that C is also C in original path
    allPathCommands[i] !== 'A' && pathCommand === 'C' && ( allPathCommands[i] = 'C' )

    fixArc(pathArray,allPathCommands,i)
    ii = pathArray.length // solves curveArrays ending in Z

    segment = pathArray[i]
    seglen = segment.length

    params.x1 = +segment[seglen - 2]
    params.y1 = +segment[seglen - 1]
    params.x2 = +(segment[seglen - 4]) || params.x1
    params.y2 = +(segment[seglen - 3]) || params.y1
  }
  return roundPath(pathArray,round)
}