import parsePathString from '../process/parsePathString.js'
import roundPath from '../process/roundPath.js'
import clonePath from '../process/clonePath.js'
import isRelativeArray from '../util/isRelativeArray.js'

export default function (pathArray) {
  if (isRelativeArray(pathArray)){
    return clonePath(pathArray)
  }
  pathArray = parsePathString(pathArray)

  let resultArray = [], 
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
          relativeSegment[1] = segment[1];
          relativeSegment[2] = segment[2];
          relativeSegment[3] = segment[3];
          relativeSegment[4] = segment[4];
          relativeSegment[5] = segment[5];
          relativeSegment[6] = +segment[6] - x;
          relativeSegment[7] = +segment[7] - y
          break;
        case "v":
          relativeSegment[1] = +segment[1] - y;
          break;
        case "m":
          mx = +segment[1];
          my = +segment[2];
        default:
          for (let j = 1, jj = segment.length; j < jj; j++) {
            relativeSegment[j] = +segment[j] - ((j % 2) ? x : y)
          }
      }
    } else {
      relativeSegment = [];
      resultArray[i] = relativeSegment;
      if (pathCommand === "m") {
        mx = +segment[1] + x;
        my = +segment[2] + y;
      }
      segment.map(k=>resultArray[i].push(k))
    }
    let len = resultArray[i].length;
    switch (resultArray[i][0]) {
      case "z":
        x = mx;
        y = my;
        break;
      case "h":
        x += resultArray[i][len - 1];
        break;
      case "v":
        y += resultArray[i][len - 1];
        break;
      default:
        x += resultArray[i][len - 2];
        y += resultArray[i][len - 1];
    }
  }
  return roundPath(resultArray)
}