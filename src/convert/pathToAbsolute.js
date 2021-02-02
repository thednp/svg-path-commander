import parsePathString from '../process/parsePathString.js'
import roundPath from '../process/roundPath.js'
import clonePath from '../process/clonePath.js'
import isAbsoluteArray from '../util/isAbsoluteArray.js'

export default function(pathArray,round) {
  if (isAbsoluteArray(pathArray)) {
    return clonePath(pathArray)
  }
  pathArray = parsePathString(pathArray,round)

  let resultArray = [], 
      x = 0, y = 0, mx = 0, my = 0, 
      start = 0, ii = pathArray.length,
      pathCommand = '', segment = [], segLength = 0,
      absoluteSegment = []

  if (pathArray[0][0] === "M") {
    x = +pathArray[0][1];
    y = +pathArray[0][2];
    mx = x;
    my = y;
    start++;
    resultArray[0] = ["M", x, y];
  }

  for (let i = start; i < ii; i++) {
    segment = pathArray[i]
    pathCommand = segment[0]

    resultArray.push(absoluteSegment = []);

    if (pathCommand !== pathCommand.toUpperCase()) {
      absoluteSegment[0] = pathCommand.toUpperCase();
      switch (absoluteSegment[0]) {
        case "A":
          segment.slice(1,-2)
                 .concat([+segment[6] + x, +segment[7] + y])
                 .map(s=>absoluteSegment.push(s))
          break;
        case "V":
          absoluteSegment[1] = +segment[1] + y;
          break;
        case "H":
          absoluteSegment[1] = +segment[1] + x;
          break;
        case "M":
          mx = +segment[1] + x;
          my = +segment[2] + y;
        default:
          segment.map((s,j)=>j && absoluteSegment.push(+s + ((j % 2) ? x : y)))
      }
    } else {
      segment.map(k=>absoluteSegment.push(k))
    }

    segLength = absoluteSegment.length
    switch (absoluteSegment[0]) {
      case "Z":
        x = mx;
        y = my;
        break;
      case "H":
        x = +absoluteSegment[1];
        break;
      case "V":
        y = +absoluteSegment[1];
        break;
      case "M":
        mx = +absoluteSegment[segLength - 2];
        my = +absoluteSegment[segLength - 1];
      default:
        x = +absoluteSegment[segLength - 2];
        y = +absoluteSegment[segLength - 1];
    }
  }
  return roundPath(resultArray,round)
}