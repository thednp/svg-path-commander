import parsePathString from '../process/parsePathString.js'
import roundPath from '../process/roundPath.js'
import clonePath from '../process/clonePath.js'
import isRelativeArray from '../util/isRelativeArray.js'

export default function (pathArray,round) {
  if (isRelativeArray(pathArray)){
    return clonePath(pathArray)
  }
  pathArray = parsePathString(pathArray)

  let resultArray = [], segLength = 0,
      x = 0, y = 0, mx = 0, my = 0,
      segment = [], pathCommand = '', relativeSegment = [],
      start = 0, ii = pathArray.length;

  if (pathArray[0][0] === "M") {
    x = +pathArray[0][1];
    y = +pathArray[0][2];
    mx = x;
    my = y;
    start++;
    resultArray.push(["M", x, y]);
  }

  for (let i = start; i < ii; i++) {
    segment = pathArray[i]
    pathCommand = segment[0]
    resultArray.push(relativeSegment = [])

    if (pathCommand !== pathCommand.toLowerCase() ) {
      relativeSegment[0] = pathCommand.toLowerCase();
      switch (relativeSegment[0]) {
        case "a":
          segment.slice(1,-2)
                 .concat([+segment[6] - x, +segment[7] - y])
                 .map(s=>relativeSegment.push(s))
          break;
        case "v":
          relativeSegment[1] = +segment[1] - y;
          break;
        case "m":
          mx = +segment[1];
          my = +segment[2];
        default:
          segment.map((s,j)=>j && relativeSegment.push(+s - ((j % 2) ? x : y)))
      }
    } else {
      relativeSegment = [];
      resultArray[i] = relativeSegment;
      if (pathCommand === "m") {
        mx = +segment[1] + x;
        my = +segment[2] + y;
      }
      segment.map(s=>resultArray[i].push(s))
    }

    segLength = resultArray[i].length;
    switch (resultArray[i][0]) {
      case "z":
        x = mx;
        y = my;
        break;
      case "h":
        x += resultArray[i][segLength - 1];
        break;
      case "v":
        y += resultArray[i][segLength - 1];
        break;
      default:
        x += resultArray[i][segLength - 2];
        y += resultArray[i][segLength - 1];
    }
  }
  return roundPath(resultArray,round)
}