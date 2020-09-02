import pathToAbsolute from '../convert/pathToAbsolute.js'
import normalizeSegment from './normalizeSegment.js'
import roundPath from './roundPath.js';

export default function(pathArray) { // pathArray|pathString

  pathArray = pathToAbsolute(pathArray)
  
  let params = {x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0, qx: null, qy: null},
      allPathCommands = [], pathCommand = '', prevCommand = '', ii = pathArray.length,
      segment, seglen

  for (let i = 0; i < ii; i++) {
    pathArray[i] && (pathCommand = pathArray[i][0]) // save current path command

    allPathCommands[i] = pathCommand // Save current path command
    i && ( prevCommand = allPathCommands[i - 1]) // Get previous path command
    pathArray[i] = normalizeSegment(pathArray[i], params, prevCommand) // Previous path command is inputted to processSegment

    segment = pathArray[i]
    seglen = segment.length

    params.x1 = +segment[seglen - 2]
    params.y1 = +segment[seglen - 1]
    params.x2 = +(segment[seglen - 4]) || params.x1
    params.y2 = +(segment[seglen - 3]) || params.y1
  }
  return roundPath(pathArray)
}